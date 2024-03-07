import * as Router from "@koa/router";

const globalRouter = new Router();

globalRouter.get("/ping", (ctx) => {
  ctx.body = "여기는 어댑터 서버입니다.";
});

export default globalRouter;
