import * as Koa from "koa";
import { NodeTracerProvider } from "@opentelemetry/sdk-trace-node";
import { Resource } from "@opentelemetry/resources";
import { SemanticResourceAttributes } from "@opentelemetry/semantic-conventions";
import { registerInstrumentations } from "@opentelemetry/instrumentation";
import { KoaInstrumentation } from "@opentelemetry/instrumentation-koa";
import { trace } from "@opentelemetry/api";
import { globalRouter } from "./routes";

const app = new Koa();

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

app.use(async (ctx, next) => {
  const span = trace.getTracer("theo-test").startSpan(ctx.request.path);

  await next();

  span.end();
  console.log(span);
});

app.use(globalRouter.routes());

app.listen(3000, () => {
  console.log(`http://localhost:3000`);
});
