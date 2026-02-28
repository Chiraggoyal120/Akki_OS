import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  activity: defineTable({
    agent: v.string(),
    action: v.string(),
    message: v.string(),
    user_id: v.optional(v.string()),
    timestamp: v.number(),
  }),
  config: defineTable({
    key: v.string(),
    value: v.string(),
  }),
  drafts: defineTable({
    agent: v.string(),
    content: v.string(),
    platform: v.optional(v.string()),
    status: v.string(),
    timestamp: v.number(),
  }),
});
