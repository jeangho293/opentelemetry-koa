import * as Router from "@koa/router";
import * as axios from "axios";
import * as api from "@opentelemetry/api";

const globalRouter = new Router();

globalRouter.get("/ping", (ctx) => {
  ctx.body = "pong";
});

globalRouter.get("/to-adapter", async (ctx) => {
  api.propagation.inject(api.context.active(), ctx.headers);
  const response = await axios.default.get("http://localhost:3001/ping", {
    headers: {
      ...ctx.headers,
      "x-request-id": ctx.state.txId,
    },
  });
  ctx.body = response.data;
});

export default globalRouter;
