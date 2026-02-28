---
name: linkedin-post
description: Approved drafts ko LinkedIn pe automatically publish karna
---

# LinkedIn Post Skill

## Purpose
Approved drafts ko LinkedIn pe automatically publish karna

## Browser Session
Location: ~/.openclaw/mission-control/browser-sessions/linkedin

## How to Post
Use browser automation to post on LinkedIn:
node ~/.openclaw/mission-control/browser-automation/linkedin-actions.js

## Steps
1. Browser session load karo
2. LinkedIn open karo
3. Post content paste karo
4. Publish karo
5. Post URL save karo

## After Publishing
1. Update draft status in Supabase:
curl -X PATCH http://localhost:3003
  -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1aWpvcGR4enB3cWxoZXl4cWRwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTY1NDYyMiwiZXhwIjoyMDg3MjMwNjIyfQ.-Zws-y7D3n7pVtrkg-UVtJxJ-Ar7M0quIgfhzEQZPms" \
  -H "Content-Type: application/json" \
  -d '{"status": "published"}'

2. Report to webhook:
curl -X POST http://127.0.0.1:3003 \
  -H "Content-Type: application/json" \
  -d '{"agent": "atlas", "action": "post_published", "message": "Published on LinkedIn"}'
