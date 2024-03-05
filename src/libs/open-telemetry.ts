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
import { SemanticResourceAttributes } from "@opentelemetry/semantic-conventions";

export const openTelemetryTracer = (serviceName: string) => {
  const provider = new NodeTracerProvider({
    resource: new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: serviceName,
    }),
  });

  provider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()));
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

  return api.trace.getTracer(serviceName);
};
