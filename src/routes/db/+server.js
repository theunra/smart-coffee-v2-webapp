import { error } from '@sveltejs/kit';
/** @type {import('./$types').RequestHandler} */

export function GET({ url }) {	
    const out = {status : 200};

    return new Response(JSON.stringify(out));
}