import { registerInstrumentations } from "@opentelemetry/instrumentation";
import * as api from "@opentelemetry/api";
import { HttpInstrumentation } from "@opentelemetry/instrumentation-http";
import { ZipkinExporter } from "@opentelemetry/exporter-zipkin";
import { KoaInstrumentation } from "@opentelemetry/instrumentation-koa";
import { Resource } from "@opentelemetry/resources";
import {
  ConsoleSpanExporter,
  NodeTracerProvider,
  SimpleSpanProcessor,
} from "@opentelemetry/sdk-trace-node";
import { SEMRESATTRS_SERVICE_NAME } from "@opentelemetry/semantic-conventions";

export const openTelemetryTracer = () => {
  const provider = new NodeTracerProvider({
    resource: new Resource({
      [SEMRESATTRS_SERVICE_NAME]: "adapter",
    }),
  });

  //   provider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()));
  provider.addSpanProcessor(new SimpleSpanProcessor(new ZipkinExporter()));

  registerInstrumentations({
    instrumentations: [
      new HttpInstrumentation(),
      new KoaInstrumentation({
        // FIXME: request hook is not working...
        requestHook: (span, info) => {
          span.setAttribute("http.method", info.context.request.method);
        },
      }),
    ],
    tracerProvider: provider,
  });

  provider.register();

  return api.trace.getTracer("adapter");
};
