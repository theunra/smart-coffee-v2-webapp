import { error } from '@sveltejs/kit';
import {sequelize, EnoseRawData, EnosePPMData} from '$lib/model/postgres.jsx';

const deviceId = "77f04f7b-0ec0-4ce7-b8e7-ff629e90d8c3";
let deviceEvent = [];
let isDeviceActive = false;
let isDeviceHasEvent = false;

const deviceGetTimeout = 5000; //ms

/** @type {import('./$types').RequestHandler} */
export async function GET({ url }) {	 
  const param = url.searchParams.get('param');
  const res = {
    status: 200, 
    payload : {},
  };

  if(param == "isDeviceActive"){
    res.payload.isDeviceActive = isDeviceActive;
  }
  else if (param == "event") {
    let requestWaitedTooLong = false;
    setTimeout(()=>{requestWaitedTooLong = true;}, deviceGetTimeout);

    while(!isDeviceHasEvent && !requestWaitedTooLong){
      isDeviceActive = true;     
      await new Promise(r => setTimeout(r, 100));
    }
    
    if(isDeviceHasEvent){
      res.payload.event = deviceEvent[0];
    
      deviceEvent.shift();
    
      if(deviceEvent.length > 0) isDeviceHasEvent = true;
      else isDeviceHasEvent = false;
    }
  }
  
  return new Response(JSON.stringify(res));
}

async function CheckClientActive(){
  await new Promise(r => setTimeout(r, 5000));

  if(isDeviceActive){
    isDeviceActive = false;
  }
  else {
    return;
  }

  CheckClientActive();
}


export async function POST({ request }) {	
  const {id, param} = await request.json(); 

  if(param == "connect"){
    if(id !== deviceId) return new Response(404);
    isDeviceActive = true;
    CheckClientActive();
  } 
  else if (param == "start-roast") {
    deviceEvent.push({
      param : "start-roast",
    });

    isDeviceHasEvent = true;
  }

  return new Response(JSON.stringify({status : 200}));
}
