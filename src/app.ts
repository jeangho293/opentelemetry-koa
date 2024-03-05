import * as Koa from "koa";
import { uuidMiddleWare } from "./middlewares/uuid-middleware";
import { tracerMiddleWare } from "./middlewares/tracer-middleware";
import { globalRouter, globalRouter2 } from "./routes";
import { openTelemetryTracer } from "./libs/open-telemetry";
openTelemetryTracer("core-api");

const app = new Koa();

app.use(uuidMiddleWare);
app.use(tracerMiddleWare);
app.use(globalRouter.routes());

app.listen(3000, () => console.log(`http://localhost:3000`));

// APP2
const app2 = new Koa();

app2.use(globalRouter2.routes());
app2.listen(3001, () => console.log(`http://localhost:3001`));
