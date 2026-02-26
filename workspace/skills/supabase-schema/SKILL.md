---
name: supabase-schema
description: Akki OS ke liye complete database setup
---

# Supabase Schema Skill

## Purpose
Akki OS ke liye complete database setup

## Setup (One Time)
1. Supabase dashboard pe jao
2. SQL Editor open karo
3. schema.sql ka content paste karo
4. Run karo

## Tables
- accounts: User accounts
- drafts: Content drafts (Loki saves here)
- activity: All agent actions (all agents save here)
- pain_points: Research findings (Fury saves here)
- ideas: Content ideas (Oracle saves here)
- strategy: Weekly calendar (Shuri saves here)
- analytics: Performance data (Pulse saves here)
- engagement: Reply opportunities (Echo saves here)

## Enable Realtime
Supabase Dashboard → Database → Publications
→ supabase_realtime → activity table ON
