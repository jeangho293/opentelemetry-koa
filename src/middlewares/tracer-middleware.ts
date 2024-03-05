import { openTelemetryTracer } from "../libs/open-telemetry";
import * as api from "@opentelemetry/api";
import type { Context } from "koa";

export const tracerMiddleWare = async (
  ctx: Context,
  next: () => Promise<void>
) => {
  const { txId } = ctx.state as { txId: string };
  const tracer = openTelemetryTracer("core-api");
  const span = tracer.startSpan(ctx.request.path);

  span.setAttribute("txId", txId);

  await api.context.with(
    api.trace.setSpan(api.ROOT_CONTEXT, span),
    async () => {
      await next();
      span.end();
    }
  );
};
