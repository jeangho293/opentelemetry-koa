import * as Router from "@koa/router";
import { openTelemetryTracer } from "../libs/open-telemetry";
import * as api from "@opentelemetry/api";
import * as axios from "axios";

const tracer = openTelemetryTracer("core-api");
export const globalRouter = new Router();

globalRouter.get("/ping", async (ctx) => {
  const span = tracer.startSpan(ctx.request.path);

  const result = await api.context.with(
    api.trace.setSpan(api.ROOT_CONTEXT, span),
    async () => {
      latency(500000000, 1);
      latency(1000000000, 2);

      const axiosSpan = tracer.startSpan("app2");
      const result = await axios.default.get("http://localhost:3001/ping");
      axiosSpan.end();
      span.end();
      return result.data;
    }
  );
  ctx.body = result;
});

function latency(number: number, index: number) {
  const currentSpan = tracer.startSpan(`latency:${index}`);
  for (let i = 0; i < number; i++) {}
  currentSpan.end();
}

// globalRouter2
export const globalRouter2 = new Router();

globalRouter2.get("/ping", async (ctx) => {
  for (let i = 0; i < 1000000000; i++) {}
  ctx.body = "pong";
});
