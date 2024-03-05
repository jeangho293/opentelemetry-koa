import * as Router from "@koa/router";
import * as api from "@opentelemetry/api";
import * as axios from "axios";

export const globalRouter = new Router();

globalRouter.get("/ping", async (ctx) => {
  latency(1000000000, 1);
  latency(5000000000, 2);

  api.propagation.inject(api.context.active(), ctx.headers);
  const { data } = await axios.default.get("http://localhost:3001/ping", {
    headers: ctx.headers,
  });
  ctx.body = data;
});

// globalRouter2
export const globalRouter2 = new Router();

globalRouter2.get("/ping", async (ctx) => {
  const context = api.propagation.extract(api.context.active(), ctx.headers);

  const tracer = api.trace.getTracer("app2");
  const span = tracer.startSpan("app2", {}, context);
  for (let i = 0; i < 1000000000; i++) {}
  span.end();
  ctx.body = "pong";
});

function latency(number: number, index: number) {
  const currentSpan = api.trace
    .getTracer("core-api")
    .startSpan(`latency-${index}`);
  for (let i = 0; i < number; i++) {}
  currentSpan.end();
}
