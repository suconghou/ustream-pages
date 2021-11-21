const errorHandler = async ({ next }) => {
  try {
    return await next();
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
