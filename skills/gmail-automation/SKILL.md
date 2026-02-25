---
name: gmail-automation
description: Gmail se emails read karna aur send karna
---

# Gmail Automation Skill

## Purpose
Gmail se emails read karna aur send karna

## Setup (One Time)
node setup-google.js
# Browser khulega - Google login karo

## Usage
# Emails read karo
node gmail-actions.js read

# Email send karo
node gmail-actions.js send "to@email.com" "Subject" "Body"

## Session
Saved in: ~/.openclaw/mission-control/browser-sessions/google
