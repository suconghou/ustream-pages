// /video/{vid}/{itag}/{ts}.ts

export async function onRequestGet(context) {
  const {
    request, // same as existing Worker API
    env, // same as existing Worker API
    params, // if filename includes [id] or [[path]]
    waitUntil, // same as ctx.waitUntil in existing Worker API
  } = context;
  return new Response(JSON.stringify(params));
}
