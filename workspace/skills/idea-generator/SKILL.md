---
name: idea-generator
description: Research data se 100s of content ideas generate karna
---

# Idea Generator Skill

## Purpose
Research data se 100s of content ideas generate karna

## Input
- Pain points from convex via webhook
- User profile and niche
- Current trends

## Idea Types
1. Pain Story - Personal struggle related to pain point
2. Hot Take - Controversial angle on common belief
3. Tactical - Step by step solution
4. Case Study - Real example with results
5. Myth Buster - Common misconception debunked

## Idea Format
Title: [Catchy headline]
Angle: [Unique perspective]
Platform: [LinkedIn/Twitter]
Pain Point: [Which pain it addresses]
Hook: [First line of post]

## After Generating
1. Save ideas to convex via webhook:
curl -X POST http://localhost:3003
  -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1aWpvcGR4enB3cWxoZXl4cWRwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTY1NDYyMiwiZXhwIjoyMDg3MjMwNjIyfQ.-Zws-y7D3n7pVtrkg-UVtJxJ-Ar7M0quIgfhzEQZPms" \
  -H "Content-Type: application/json" \
  -d '{"title": "IDEA_TITLE", "angle": "IDEA_ANGLE", "status": "active"}'

2. Report to webhook:
curl -X POST http://127.0.0.1:3003 \
  -H "Content-Type: application/json" \
  -d '{"agent": "oracle", "action": "ideas_generated", "message": "Generated 10 new ideas"}'
