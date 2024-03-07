import * as Koa from "koa";
import { uuidMiddleWare, tracerMiddleWare } from "./middlewares";
import globalRouter from "./routes";

const app = new Koa();

app.use(uuidMiddleWare);
app.use(tracerMiddleWare);

// router middleWare
app.use(globalRouter.routes());

app.listen(3000, () => console.log(`Server running on port 3000`));
