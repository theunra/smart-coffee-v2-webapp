import { error } from '@sveltejs/kit';
import {sequelize, EnoseRawData, EnosePPMData, RoastSession, Roast} from '$lib/model/postgres.jsx';
import { LongPolling } from '$lib/services/long-polling';

const deviceId = "77f04f7b-0ec0-4ce7-b8e7-ff629e90d8c3";
const deviceRoastSessionId = 0;
let deviceEvent = [];
let isDeviceActive = false;
let isDeviceConnected = false;
let isDeviceHasEvent = false;

const deviceGetTimeout = 5000; //ms

/** @type {import('./$types').RequestHandler} */
export async function GET({ url }) {
  isDeviceConnected = true;
  const param = url.searchParams.get('param');
  const res = {
    status: 200, 
    payload : {},
  };

  if(param == "isDeviceActive"){
    res.payload.isDeviceActive = isDeviceActive;
  }
  else if (param == "roastSession"){
    const roastSession = await RoastSession.findOne({
      where : {
        id : deviceRoastSessionId,
      },
    });

    if(roastSession && roastSession.roastId != null){
      const roast = await Roast.findOne({
        where: {
          id : roastSession.roastId,
        },
      });

      res.payload.roast = roast;
      res.payload.roastSession = roastSession;
    }
    else {
      res.status = 400;
    }
  }
  else if (param == "event") {
    await LongPolling({
      doCheck : async ()=>{
        if(isDeviceHasEvent) return true;
        else return false;
      },

      onTimeout : async ()=>{
        res.status = 504;
      },

      onFinish : async ()=>{
        if(isDeviceHasEvent){
          res.payload.event = deviceEvent[0];
        
          deviceEvent.shift();
        
          if(deviceEvent.length > 0) isDeviceHasEvent = true;
          else isDeviceHasEvent = false;
        }
      },
    });
  }

  isDeviceConnected = false;

  return new Response(JSON.stringify(res));
}

async function CheckClientActive(){
  await new Promise(r => setTimeout(r, 5000));

  if(!isDeviceConnected) {
    if(isDeviceActive){
      isDeviceActive = false;
    }
    else {
      return; //stop routine
    }
  } else isDeviceActive = true;

  CheckClientActive();
}


export async function POST({ request }) {	
  isDeviceConnected = true;

  const {id, param} = await request.json(); 
  const response = {
    status : 200,
    payload : {}
  };

  if(param == "connect"){
    if(id !== deviceId) return new Response(404);
    const roastSession = await RoastSession.findOne({
      where : {
        id : deviceRoastSessionId,
      },
    });

    if(roastSession && roastSession.roastId != null){
      const roast = await Roast.findOne({
        where: {
          id : roastSession.roastId,
        },
      });
      response.payload.roast = roast;
    }

    isDeviceActive = true;
    response.payload.connected = true;
    response.payload.roastSession = roastSession;

    CheckClientActive();
  }
  else if (param == "create-session"){
    try{
      const roast = await Roast.create({
        beanType : param.beanType,
        level: param.level,
        startTime: param.startTime,
      });
      const roastSession = await RoastSession.findOne({
        where : {
          id : deviceRoastSessionId,
        },
      });

      roastSession.changed('roastId', true);
      await roastSession.update({roastId : roast.id});

      response.payload.message = "create session success";
      response.payload.roastSession = roastSession;
      response.payload.roast = roast;

      pushDeviceEvent("create-session");
    }
    catch(err){
      response.status = 400;
      response.payload.message = err;
    }
  }
  else if (param == "close-session"){
    const roastSession = await RoastSession.findOne({
      where : {
        id : deviceRoastSessionId,
      },
    });

    roastSession.changed('roastId', true);
    await roastSession.update({roastId : null});

    response.payload.message = "closing session success";
    response.payload.roastSession = roastSession;
    pushDeviceEvent("close-session");
  }
  else if (param == "start-roast") {
    pushDeviceEvent("start-roast");
  }
  else if (param == "stop-roast"){
    pushDeviceEvent("stop-roast");
  }

  isDeviceConnected = false;

  return new Response(JSON.stringify(response));
}

function pushDeviceEvent(event){
  deviceEvent.push({
    param : event,
  });

  isDeviceHasEvent = true;
}