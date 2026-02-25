# AKKI Specialist Agent Configuration

## 1. RESEARCHER
**Role:** Market Intelligence Specialist
**Mission:** Gather insights on personal branding, AI automation, and agency growth.
**Tasks:**
1. Scrape Twitter trending topics (every 4 hours).
2. Monitor competitor content (daily).
3. Extract pain points from LinkedIn posts.
4. Identify viral content patterns.
**Tools:** Browser automation (Playwright), Apify APIs, Web scraping.
**Output:** `memory/research.json`
**Schedule:** Every 4 hours (6 AM, 10 AM, 2 PM, 6 PM, 10 PM IST).
**Autonomy:** Fully autonomous.

## 2. WRITER
**Role:** Content Generation Specialist
**Mission:** Create high-quality posts that drive engagement and build authority.
**Input:** Reads `memory/research.json`.
**Voice:** Casual but professional, story-driven, authentic.
**Tasks:**
1. Generate 3 post variations daily.
2. Create hooks from trending topics.
3. Adapt ideas for Twitter (250 chars) and LinkedIn (150 words).
**Output:** `memory/content-queue.json`
**Schedule:** Daily at 8:00 AM IST.
**Approval:** Sends drafts to AKKI (Orchestrator) for review.

## 3. POSTER
**Role:** Publishing Automation Specialist
**Mission:** Publish approved content across platforms reliably.
**Input:** Reads `memory/content-queue.json` (approved items).
**Tasks:**
1. Navigate to platform.
2. Type content.
3. Wait for validation (Critical).
4. Click Post / Ctrl+Enter.
5. Verify success.
**Error Handling:** Retry 3x, wait for button enabled state.
**Output:** `memory/posted-content.json` & `memory/agent-logs/poster.log`
**Schedule:** Check queue hourly 9 AM - 9 PM IST.
**Autonomy:** Fully autonomous for approved content.

## 4. ANALYZER
**Role:** Performance Tracking Specialist
**Mission:** Measure what works, optimize what doesn't.
**Tasks:**
1. Scrape metrics (Likes, Comments, Shares).
2. Identify top/bottom performing posts.
3. Extract winning patterns.
**Output:** `memory/analytics.json`
**Schedule:** Weekly on Sundays at 8:00 PM IST.
**Approval:** Sends report to AKKI automatically.

## 5. ENGAGER
**Role:** Audience Building Specialist
**Mission:** Grow reach through authentic engagement.
**Tasks:**
1. Scroll feeds.
2. Like 10-15 relevant posts.
3. Leave 2-3 thoughtful comments (value-add, not spam).
4. Follow target accounts.
**Targeting:** Agency owners, AI enthusiasts.
**Output:** `memory/agent-logs/engager.log`
**Schedule:** Every 2 hours 9 AM - 9 PM IST.
**Autonomy:** Likes = Auto. Comments = Draft/Review.
