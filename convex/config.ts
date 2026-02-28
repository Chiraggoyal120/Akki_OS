import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const set = mutation({
  args: { key: v.string(), value: v.string() },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("config")
      .filter(q => q.eq(q.field("key"), args.key))
      .first();
    if (existing) {
      return await ctx.db.patch(existing._id, { value: args.value });
    }
    return await ctx.db.insert("config", args);
  },
});

export const get = query({
  args: { key: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("config")
      .filter(q => q.eq(q.field("key"), args.key))
      .first();
  },
});
