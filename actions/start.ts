import { bot } from "../config/index.ts";
import { Context } from "../deps.ts";

bot.command("start", async (ctx: Context) => {
  console.log("start");

  await ctx.reply("Welcome!");
});
