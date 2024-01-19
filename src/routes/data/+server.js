import { error } from '@sveltejs/kit';
import {sequelize, EnoseData} from '$lib/model/postgres.jsx';

/** @type {import('./$types').RequestHandler} */
export async function GET({ url }) {	
  const enoseDatas = await EnoseData.findAll();

  return new Response(JSON.stringify({payload: enoseDatas}));
}
