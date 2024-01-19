import { error } from '@sveltejs/kit';
import {sequelize, EnoseData} from '$lib/model/postgres.jsx';

let tracker = 0;

/** @type {import('./$types').RequestHandler} */
export async function GET({ url }) {	
  const clientTracker = url.searchParams.get('tracker');
  
  while(clientTracker == tracker)
    await new Promise(r => setTimeout(r, 100));
  
  const enoseDatas = await EnoseData.findAll();

  return new Response(JSON.stringify({payload: enoseDatas, tracker : tracker}));
}

function flipTracker(){
  if(tracker == 0) tracker = 1;
  else tracker = 0;
}

export async function POST({ request }) {	
  const {val} = await request.json();
  
  await EnoseData.create({
    val: val,
  });

  flipTracker();

  return new Response(JSON.stringify({status : 200}));
}
