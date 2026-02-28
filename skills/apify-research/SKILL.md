---
name: apify-research
description: Reddit, LinkedIn, X, IndieHackers se real data scrape karo
---

# Apify Research Skill

## Purpose
Reddit, LinkedIn, X, IndieHackers se real data scrape karo

## Apify Token
apify_api_4SfGKC50BoH09w1HJGkItZwjCdLf1v3xHffg

## Actor ID
6V5kyjMMj3cjsJKJf

## Usage
curl -X POST "https://api.apify.com/v2/acts/6V5kyjMMj3cjsJKJf/runs?token=apify_api_4SfGKC50BoH09w1HJGkItZwjCdLf1v3xHffg" \
  -H "Content-Type: application/json" \
  -d '{"query": "YOUR_SEARCH_QUERY", "platform": "reddit"}'

## After Research
1. Save findings to Supabase (use convex via webhook-save skill)
2. Report to webhook (use webhook-report skill)

## Platforms
- reddit
- linkedin  
- twitter
- indiehackers
