# ustream-pages

u2web 站点的 Cloudflare Pages 部署仓库,访问地址 https://u2web.pages.dev/

> **根目录的 `index.html` / `assets/` / `fastload.min.js` / `favicon.ico` 是构建产物,请勿手工修改。**
> 它们由 https://github.com/suconghou/u2web 的 CI 在执行 `pnpm build` 后自动同步到此仓库。
> 需要改动站点请改 u2web 源码,然后推送到 u2web 的 `master` 分支。

## 目录

```
index.html          站点入口(SPA)
assets/             前端 JS / CSS
fastload.min.js     P2P 多源多线程下载 / MSE 播放引擎(vendoring 自 suconghou/fastloadjs)
functions/          Cloudflare Pages Functions,为站点提供同源接口
```

## functions 提供的同源接口

| 路径 | 说明 |
| --- | --- |
| `GET /video/{vid}.json` | 视频解析,返回 streams / initRange / indexRange |
| `GET /video/{vid}.jpg` | 封面图代理 |
| `GET /video/{vid}.webp` | 封面图代理(webp) |
| `GET /video/{vid}/{itag}.mp4` | 按 byte-range 代理媒体分片 |

在站点的「设置」页把 **视频解析服务** 填成 `/video`(相对路径,即当前域名),即可使用这些同源接口,
省去跨域与第三方中转。也可绑定 `CACHE` KV 命名空间缓存解析结果,降低上游请求量。

`functions/_middleware.js` 负责两件事:

1. 带扩展名的路径(如 `.json` / `.jpg` / `.mp4`)交给对应的 Function 或静态资源
2. 其余路径(前端路由)交给静态资源,由 Pages 回落到 `index.html`,使 SPA 路由可直接刷新

## 部署

推送到本仓库 `master` 即触发 Cloudflare Pages 自动构建部署。Pages 项目无需构建命令,
构建输出目录为仓库根目录。

## 相关项目

- https://github.com/suconghou/u2web — 站点源码
- https://github.com/suconghou/fastloadjs — 播放引擎
- https://github.com/suconghou/u2worker — 同类解析服务(cf workers 版)
