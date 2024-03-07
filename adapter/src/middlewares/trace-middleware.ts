import { openTelemetryTracer } from "../libs/open-telemetry";
import * as api from "@opentelemetry/api";
import type { Context, Next } from "koa";

function extractParentContext(ctx: Context) {
  return api.propagation.extract(api.context.active(), ctx.headers);
}

export const tracerMiddleWare = async (ctx: Context, next: Next) => {
  const { txId } = ctx.state as { txId: string };

  const tracer = openTelemetryTracer("adapter");
  const span = tracer.startSpan(
    ctx.request.path,
    {
      attributes: {
        txId,
        method: ctx.request.method,
        url: ctx.request.path,
      },
    },
    extractParentContext(ctx)
  );

  await api.context.with(
    api.trace.setSpan(api.context.active(), span),
    async () => {
      await next();
      span.end();
    }
  );
};
