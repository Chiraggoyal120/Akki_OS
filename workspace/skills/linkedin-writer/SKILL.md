---
name: linkedin-writer
description: LinkedIn ke liye high-quality posts likhna
---

# LinkedIn Writer Skill

## Purpose
LinkedIn ke liye high-quality posts likhna

## Post Structure
1. Hook (first line - attention grabbing)
2. Story/Problem (2-3 lines)
3. Insight/Solution (3-4 lines)
4. CTA (1 line)
5. Hashtags (3-5 relevant)

## Tone Rules
- Conversational, not corporate
- First person always
- Short paragraphs (1-2 lines max)
- Numbers and data where possible
- No buzzwords

## Post Types
- Pain Story: Personal struggle → lesson learned
- Hot Take: Controversial opinion → reasoning
- Tactical: Step by step how-to
- Case Study: Real example → results

## After Writing
1. Save draft to Supabase:
curl -X POST https://suijopdxzpwqlheyxqdp.supabase.co/rest/v1/drafts \
  -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1aWpvcGR4enB3cWxoZXl4cWRwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTY1NDYyMiwiZXhwIjoyMDg3MjMwNjIyfQ.-Zws-y7D3n7pVtrkg-UVtJxJ-Ar7M0quIgfhzEQZPms" \
  -H "Content-Type: application/json" \
  -d '{"content": "POST_CONTENT", "platform": "linkedin", "status": "pending"}'

2. Report to webhook (use webhook-report skill)
