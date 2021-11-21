// /video/{vid}/{itag}/{ts}.ts
import { get, set, applyRequest } from "../util";
import videoParser from "../videoparser";

const init = {
  method: "GET",
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.75 Safari/537.36",
  },
};

const headers = {
  "Access-Control-Allow-Origin": "*",
};

export async function onRequestGet(context) {
  const { params } = context;

  const [vid, itag, ts] = params.vid;
  if (
    !/^[\w\-]{6,12}$/.test(vid) ||
    !/^\d{2,3}$/.test(itag) ||
    !/^\d+\-\d+\.ts$/.test(ts)
  ) {
    return new Response("404 not found", { status: 404 });
  }
  const matches = ts.match(/(\d+-\d+)/);
  return await videoPart(vid, itag, matches[1]);
}

const videoPart = async (vid, itag, part) => {
  const start = Date.now();
  const cacheKey = `${vid}/${itag}`;
  let cacheItem = get(cacheKey);
  if (cacheItem) {
    const c = {
      ...headers,
      "cache-control": `public,max-age=88888${Date.now() - start}`,
    };
    return applyRequest(`${cacheItem.url}&range=${part}`, init, c);
  }
  try {
    cacheItem = await videoURLParse(vid, itag);
  } catch (e) {
    return new Response(
      JSON.stringify({ code: -1, msg: e.message || e.stack || e }),
      { status: 500, headers }
    );
  }
  if (!cacheItem.url) {
    return new Response("invalid url", { status: 500, headers });
  }
  set(cacheKey, cacheItem);
  const c = {
    ...headers,
    "cache-control": `public,max-age=999${+new Date() - start}`,
  };
  return applyRequest(`${cacheItem.url}&range=${matches[3]}`, init, c);
};

const videoURLParse = async (vid, itag) => {
  const parser = new videoParser(vid);
  const info = await parser.infoPart(itag);
  return info;
};
