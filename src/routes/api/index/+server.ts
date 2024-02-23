
import type { RequestHandler } from './$types'


// Generate topic index

export const GET: RequestHandler = async ({ url }) => {

  return new Response(JSON.stringify({ "ok": true }))
}
