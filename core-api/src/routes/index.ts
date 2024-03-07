import * as Router from "@koa/router";
import * as axios from "axios";
import * as api from "@opentelemetry/api";
import { openTelemetryTracer } from "../libs/open-telemetry";

const globalRouter = new Router();

globalRouter.get("/ping", (ctx) => {
  ctx.body = "pong";
});

globalRouter.get("/make-request", async (ctx) => {
  const span = openTelemetryTracer().startSpan("for-loop-1");
  for (let i = 0; i < 1000000000; i++) {}
  span.end();
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
