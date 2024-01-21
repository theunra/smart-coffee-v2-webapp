import { error } from '@sveltejs/kit';
import {sequelize, EnoseRawData, EnosePPMData} from '$lib/model/postgres.jsx';

/*
 * tracker to keep all client data up-to-date
 * client start in any other number , tracker = 3
 * server will send back tracker value for client to store,
 * if tracker and clientTracker not equal then client is lag behind
 */
let tracker = 0;

/** @type {import('./$types').RequestHandler} */
export async function GET({ url }) {	
  const clientTracker = url.searchParams.get('tracker');
  const getRawData = url.searchParams.get('get_raw_data');
  const getPpmData = url.searchParams.get('get_ppm_data'); 

  while(clientTracker == tracker)
    await new Promise(r => setTimeout(r, 100));
  
  const enoseRawDatas = await EnoseRawData.findAll({
    limit : 10,
    order : [["time", "desc"]],
  });
  const enosePpmDatas = await EnosePPMData.findAll();
  
  enoseRawDatas.reverse();

  return new Response(JSON.stringify({
    payload: {
      enose_raw_datas : enoseRawDatas,
      enose_ppm_datas : enosePpmDatas,
    },
    tracker : tracker,
  }));
}

function flipTracker(){
  if(tracker == 0) tracker = 1;
  else tracker = 0;
}

export async function POST({ request }) {	
  const {raw_datas, ppm_datas, method, type} = await request.json();
  
  if(raw_datas){
    if(method == 'single')
      await EnoseRawData.create(raw_datas);
    else if(method == 'bulk')
      await EnoseRawData.bulkCreate(raw_datas);
  }

  if(ppm_datas){
    if(method == 'single')
      await EnosePPMData.create(ppm_datas);
    else if(method == 'bulk')
      await EnosePPMData.bulkCreate(ppm_datas);
  }
  
  flipTracker();

  return new Response(JSON.stringify({status : 200}));
}
