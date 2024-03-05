import * as Koa from "koa";
import { uuidMiddleWare } from "./middlewares/uuid-middleware";
import { globalRouter } from "./routes";
import { openTelemetryTracer } from "./libs/open-telemetry";
openTelemetryTracer("core-api");

const app = new Koa();

app.use(uuidMiddleWare);
app.use(globalRouter.routes());

app.listen(3000, () => console.log(`http://localhost:3000`));
