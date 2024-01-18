import type { Context } from "koa";
import { v4 as uuidv4 } from "uuid";

export const uuidMiddleWare = async (
  ctx: Context,
  next: () => Promise<void>
) => {
  const { txId }: { txId?: string } = ctx.state;
  if (!txId) {
    ctx.state.txId = uuidv4();
  }
  await next();
};
