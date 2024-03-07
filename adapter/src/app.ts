import * as Koa from "koa";
import { tracerMiddleWare, uuidMiddleWare } from "./middlewares";
import globalRouter from "./routes";

const app = new Koa();

app.use(uuidMiddleWare);
app.use(tracerMiddleWare);

app.use(globalRouter.routes());

app.listen(3001, () => console.log("Server running on port 3001"));
