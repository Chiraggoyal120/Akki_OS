import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const log = mutation({
  args: {
    agent: v.string(),
    action: v.string(),
    message: v.string(),
    user_id: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("activity", {
      ...args,
      timestamp: Date.now(),
    });
  },
});

export const getRecent = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("activity")
      .order("desc")
      .take(50);
  },
});
