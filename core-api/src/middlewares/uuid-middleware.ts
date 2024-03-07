import type { Context, Next } from "koa";
import { v4 as uuidv4 } from "uuid";

export const uuidMiddleWare = async (ctx: Context, next: Next) => {
  ctx.state.txId = ctx.get("x-request-id") || uuidv4();

  await next();
};
