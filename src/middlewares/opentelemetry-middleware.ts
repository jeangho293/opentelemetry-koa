import { NodeTracerProvider } from "@opentelemetry/sdk-trace-node";
import { Resource } from "@opentelemetry/resources";
import { SemanticResourceAttributes } from "@opentelemetry/semantic-conventions";
import { registerInstrumentations } from "@opentelemetry/instrumentation";
import { trace } from "@opentelemetry/api";
import { KoaInstrumentation } from "@opentelemetry/instrumentation-koa";
import { Context } from "koa";

const provider = new NodeTracerProvider({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: "theo-test",
  }),
});

registerInstrumentations({
  instrumentations: [new KoaInstrumentation()],
  tracerProvider: provider,
});

provider.register();
trace.setGlobalTracerProvider(provider);
export const tracerMiddleWare = async (
  ctx: Context,
  next: () => Promise<void>
) => {
  const { txId }: { txId: string } = ctx.state;
  const span = trace.getTracer("theo-test").startSpan(ctx.request.path);

  span.setAttributes({
    txId,
    "http.method": ctx.request.method,
    url: ctx.request.path,
  });
  await next();
  span.end();
};
