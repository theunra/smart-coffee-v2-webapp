import { error } from '@sveltejs/kit';
import {sequelize, EnoseRawData, EnosePPMData} from '$lib/model/postgres.jsx';
import { LongPolling } from '$lib/services/long-polling';
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
  const roastId = url.searchParams.get('roastId');
  const getRawData = url.searchParams.get('get_raw_data');
  const getPpmData = url.searchParams.get('get_ppm_data');

  let response={};

  await LongPolling({
    doCheck : async () => {
      if(clientTracker == tracker) return false;
      else return true;
    },

    onTimeout : async () => {
      response = {
        status : 504,
      };
    },

    onFinish : async () => {
        const enoseRawDatas = await EnoseRawData.findAll({
          where : {
            roastId : roastId,
          },
          order : [["time", "desc"]],
        });
        const enosePpmDatas = await EnosePPMData.findAll({
           where : {
            roastId : roastId,
          },
        });
        
        enoseRawDatas.reverse();
        enosePpmDatas.reverse();

        response = {
          payload: {
            enose_raw_datas : enoseRawDatas,
            enose_ppm_datas : enosePpmDatas,
          },
          tracker : tracker,
        };
    }
  });

  return new Response(JSON.stringify(response));
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
