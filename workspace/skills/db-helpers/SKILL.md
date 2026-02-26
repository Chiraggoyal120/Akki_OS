---
name: db-helpers
description: Supabase ke saath easily interact karna
---

# DB Helpers Skill

## Purpose
Supabase ke saath easily interact karna

## Setup
SUPABASE_URL aur SUPABASE_SERVICE_KEY .env mein daalo

## Functions
- saveUser(userData)
- getUser(userId)
- saveDraft(draftData)
- getDrafts(userId)
- logActivity(agent, action, message)

## Usage
const db = require('./db-helpers');
await db.logActivity('fury', 'research', 'Found pain points');
await db.saveDraft({content, platform, user_id});
