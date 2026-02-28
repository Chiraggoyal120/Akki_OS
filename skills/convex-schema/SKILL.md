# Convex Schema

Database: https://graceful-clownfish-349.convex.cloud

## Tables
- activity: agent, action, message, user_id, timestamp
- config: key, value
- drafts: agent, content, platform, status, timestamp

## Usage
All agents report via webhook:
POST http://localhost:3003
{"agent": "loki", "action": "draft", "message": "content here"}
