export const prerender = false


export async function load ({ locals }) {
  return {
    db:       locals.db,
    settings: locals.settings,
  }
}
