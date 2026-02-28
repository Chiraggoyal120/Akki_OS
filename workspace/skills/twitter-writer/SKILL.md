---
name: twitter-writer
description: X (Twitter) ke liye viral threads aur tweets likhna
---

# Twitter Writer Skill

## Purpose
X (Twitter) ke liye viral threads aur tweets likhna

## Tweet Types
- Hot Take: 1 powerful opinion (280 chars)
- Thread: 5-10 tweets, each standalone
- Case Study: Results thread with numbers
- Question: Engagement bait with insight

## Thread Structure
1/ Hook tweet (most important - decides virality)
2/ Context/Problem
3/ Solution point 1
4/ Solution point 2
5/ Solution point 3
6/ Real example/proof
7/ CTA + summary

## Rules
- Tweet 1 must standalone as hook
- Each tweet max 250 chars (leave room)
- Numbers > words (5x better than "much better")
- End threads with strong CTA
- No hashtags in threads (looks spammy)
- 3 hashtags max in single tweets

## After Writing
1. Save draft to convex via webhook:
curl -X POST http://localhost:3003
  -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1aWpvcGR4enB3cWxoZXl4cWRwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTY1NDYyMiwiZXhwIjoyMDg3MjMwNjIyfQ.-Zws-y7D3n7pVtrkg-UVtJxJ-Ar7M0quIgfhzEQZPms" \
  -H "Content-Type: application/json" \
  -d '{"content": "POST_CONTENT", "platform": "twitter", "status": "pending"}'

2. Report to webhook (use webhook-report skill)
