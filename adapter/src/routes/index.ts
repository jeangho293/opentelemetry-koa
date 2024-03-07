import * as Router from "@koa/router";
import { openTelemetryTracer } from "../libs/open-telemetry";

const globalRouter = new Router();

globalRouter.get("/ping", async (ctx) => {
  const tracer = openTelemetryTracer();
  await tracer.startActiveSpan("for-loop-1", async (span) => {
    for (let i = 0; i < 5000000000; i++) {}
    span.end();
  });
  await tracer.startActiveSpan("for-loop-2", async (span) => {
    for (let i = 0; i < 5000000000; i++) {}
    span.end();
  });

  ctx.body = "여기는 어댑터 서버입니다.";
});

export default globalRouter;
