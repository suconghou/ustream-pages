const errorHandler = async ({ next, request, env }) => {
  try {
    const url = new URL(request.url);
    const ext = url.pathname.split(".").pop();
    if (ext.length >= 2 && ext.length <= 4) {
      return await next();
    }
    return env.ASSETS.fetch(request);
  } catch (err) {
    return new Response(`${err.message}\n${err.stack}`, { status: 500 });
  }
};

const cors = async ({ next }) => {
  const response = await next();
  response.headers.set("Access-Control-Allow-Origin", "*");
  return response;
};

export const onRequest = [errorHandler, cors];
