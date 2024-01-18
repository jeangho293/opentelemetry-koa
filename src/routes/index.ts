import * as Router from "@koa/router";

export const globalRouter = new Router();

globalRouter.get("/", async (ctx) => {
  ctx.body = "pong";
});
