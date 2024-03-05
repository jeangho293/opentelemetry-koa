import * as Router from "@koa/router";
import * as api from "@opentelemetry/api";
import * as axios from "axios";

export const globalRouter = new Router();

globalRouter.get("/ping", async (ctx) => {
  latency(1000000000, 1);
  latency(5000000000, 2);
  const currentSpan = api.trace
    .getTracer("core-api")
    .startSpan("GET 3000:/ping", {});
  const { data } = await axios.default.get("http://localhost:3001/ping");
  currentSpan.end();

  ctx.body = data;
});

// globalRouter2
export const globalRouter2 = new Router();

globalRouter2.get("/ping", async (ctx) => {
  for (let i = 0; i < 1000000000; i++) {}
  ctx.body = "pong";
});

function latency(number: number, index: number) {
  const currentSpan = api.trace
    .getTracer("core-api")
    .startSpan(`latency-${index}`);
  for (let i = 0; i < number; i++) {}
  currentSpan.end();
}
