---
name: analytics-reader
description: Post performance analyze karo aur insights generate karo
---

# Analytics Reader Skill

## Purpose
Post performance analyze karo aur insights generate karo

## Metrics to Track
- Impressions (total views)
- Engagement rate (likes+comments+shares/impressions)
- Profile visits from post
- Follower growth
- Best performing post type
- Best performing time

## Analysis Rules
- Compare this week vs last week
- Find top 3 performing posts
- Find bottom 3 performing posts
- Identify winning patterns
- Identify losing patterns

## Insights Format
Week: [DATE RANGE]
Top Post: [Title + engagement rate]
Winning Pattern: [What worked]
Losing Pattern: [What didn't work]
Action Items:
1. [Do more of X]
2. [Stop doing Y]
3. [Try Z next week]

## Platforms
- LinkedIn: Check post analytics
- Twitter/X: Check tweet analytics

## After Analysis
1. Save to convex via webhook:
curl -X POST http://localhost:3003
  -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1aWpvcGR4enB3cWxoZXl4cWRwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTY1NDYyMiwiZXhwIjoyMDg3MjMwNjIyfQ.-Zws-y7D3n7pVtrkg-UVtJxJ-Ar7M0quIgfhzEQZPms" \
  -H "Content-Type: application/json" \
  -d '{"period": "WEEK", "top_posts": [], "learnings": "INSIGHTS"}'

2. Update Shuri strategy based on insights

3. Report to webhook:
curl -X POST http://127.0.0.1:3003 \
  -H "Content-Type: application/json" \
  -d '{"agent": "pulse", "action": "analytics_ready", "message": "Weekly report generated"}'
