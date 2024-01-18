import * as Koa from "koa";
import { globalRouter } from "./routes";
import { uuidMiddleWare } from "./middlewares/uuid-middleware";
import { tracerMiddleWare } from "./middlewares/opentelemetry-middleware";
import "dotenv/config";

const app = new Koa();

app.use(uuidMiddleWare);
app.use(tracerMiddleWare);

app.use(globalRouter.routes());

app.listen(3000, () => {
  console.log(`http://localhost:3000`);
});
