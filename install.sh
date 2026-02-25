#!/bin/bash
echo "🦅 Akki OS - Personal Branding Operating System"
echo "================================================"

# .env check
if [ ! -f .env ]; then
  cp .env.example .env
  echo "📝 Please fill in your .env file"
  echo "   Required: GEMINI_API_KEY, SUPABASE_URL, TELEGRAM_BOT_TOKEN, APIFY_TOKEN, OPENCLAW_TOKEN"
  read -p "Press Enter after filling .env..."
fi
source .env

# Node.js check
if ! command -v node &> /dev/null; then
  echo "📦 Installing Node.js..."
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
  sudo apt-get install -y nodejs
fi
echo "✅ Node.js: $(node --version)"

# OpenClaw install
if ! command -v openclaw &> /dev/null; then
  echo "📦 Installing OpenClaw..."
  npm install -g openclaw
fi
echo "✅ OpenClaw ready"

# OpenClaw onboard
echo "⚙️ Setting up OpenClaw..."
npx openclaw onboard \
  --non-interactive \
  --accept-risk \
  --gemini-api-key "$GEMINI_API_KEY" \
  --workspace $(pwd)/workspace \
  --gateway-token "$OPENCLAW_TOKEN" \
  --gateway-bind lan \
  --install-daemon \
  --skip-channels \
  --flow quickstart

# Agents register
echo "🤖 Registering 9 agents..."
for agent in jarvis fury loki shuri atlas echo oracle pulse vision; do
  npx openclaw agents create $agent --workspace $(pwd)/agents/$agent
  echo "  ✅ $agent"
done

# Webhook server
echo "🔗 Starting webhook server..."
cd skills/webhook-server/scripts
npm init -y
npm install @supabase/supabase-js
node server.js &
cd ../../..
echo "✅ Webhook server started on port 3003"

# Supabase setup
echo ""
echo "🗄️ Supabase Setup Required:"
echo "   Go to: supabase.com/dashboard"
echo "   SQL Editor mein paste karo: skills/supabase-schema/schema.sql"
read -p "Press Enter after Supabase setup..."

echo ""
echo "✅ Akki OS Setup Complete!"
echo ""
echo "Next Steps:"
echo "1. LinkedIn login: node skills/browser-automation/scripts/setup-linkedin.js"
echo "2. Twitter login:  node skills/browser-automation/scripts/setup-twitter.js"
echo "3. Telegram pe @YourBot ko /start bhejo"
echo "4. Dashboard: git clone https://github.com/Chiraggoyal120/mission_control"
echo ""
echo "🦅 Your Personal Branding OS is LIVE!"
