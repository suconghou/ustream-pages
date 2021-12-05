// /video/{vid}.jpg
// /video/{vid}.webp
// /video/{vid}.json

import { get, set, applyRequest } from "../util";
import videoParser from "../videoparser";

const imageMap = {
  jpg: "http://i.ytimg.com/vi/",
  webp: "http://i.ytimg.com/vi_webp/",
};

const headers = {
  "Access-Control-Allow-Origin": "*",
};

export async function onRequestGet(context) {
  const { params, env } = context;
  const [vid, ext] = params.vid.split(".");
  if (!/^[\w\-]{6,12}$/.test(vid) || !["jpg", "webp", "json"].includes(ext)) {
    return new Response("404 not found", { status: 404 });
  }
  if (ext == "json") {
    return await videoInfoParse(vid, env);
  }
  return await videoImage(vid, ext);
}

const videoImage = async (vid, ext) => {
  const target = imageMap[ext] + vid + "/mqdefault." + ext;
  const headers = {
    Accept: "image/webp,image/apng,image/*,*/*;q=0.8",
    "Accept-Encoding": "gzip, deflate",
    "User-Agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.75 Safari/537.36",
  };
  const init = {
    method: "GET",
    headers,
  };
  return await applyRequest(target, init);
};

const videoInfoParse = async (vid, env) => {
  const start = +new Date();
  let info = get(vid);
  if (!info) {
    const parser = new videoParser(vid, env);
    info = await parser.info();
    set(vid, info);
  }
  for (const item of Object.values(info.streams || {})) {
    delete item.url;
  }
  const init = {
    status: 200,
    headers: {
      ...headers,
      "Content-Type": "application/json",
      "cache-control": `public,max-age=9999${+new Date() - start}`,
    },
  };
  return new Response(JSON.stringify(info), init);
};
