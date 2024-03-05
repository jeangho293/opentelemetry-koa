import * as Router from "@koa/router";
import { openTelemetryTracer } from "../libs/open-telemetry";
import * as api from "@opentelemetry/api";

const tracer = openTelemetryTracer("core-api");
export const globalRouter = new Router();

globalRouter.get("/ping", async (ctx) => {
  const span = tracer.startSpan(ctx.request.path);

  api.context.with(api.trace.setSpan(api.ROOT_CONTEXT, span), async () => {
    latency(500000000, 1);
    latency(1000000000, 2);

    span.end();
  });
  ctx.body = "pong";
});

function latency(number: number, index: number) {
  const currentSpan = tracer.startSpan(`latency:${index}`);
  for (let i = 0; i < number; i++) {}

  currentSpan.end();
}
