@echo off
echo 🦅 Akki OS - Personal Branding Operating System
echo ================================================

:: Check Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js not found!
    echo Please install from: https://nodejs.org
    pause
    exit
)
echo ✅ Node.js found

:: Check Git
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Git not found!
    echo Please install from: https://git-scm.com
    pause
    exit
)

:: Copy .env
if not exist .env (
    copy .env.example .env
    echo.
    echo 📝 Fill in your .env file with credentials:
    echo    - GEMINI_API_KEY
    echo    - SUPABASE_URL
    echo    - SUPABASE_ANON_KEY
    echo    - SUPABASE_SERVICE_KEY
    echo    - TELEGRAM_BOT_TOKEN
    echo    - APIFY_TOKEN
    echo    - OPENCLAW_TOKEN
    echo.
    notepad .env
    pause
)

:: Install OpenClaw
echo 📦 Installing OpenClaw...
npm install -g openclaw

:: OpenClaw Setup
echo ⚙️ Setting up OpenClaw...
for /f "tokens=2 delims==" %%a in ('findstr "GEMINI_API_KEY" .env') do set GEMINI_API_KEY=%%a
for /f "tokens=2 delims==" %%a in ('findstr "OPENCLAW_TOKEN" .env') do set OPENCLAW_TOKEN=%%a

npx openclaw onboard ^
  --non-interactive ^
  --accept-risk ^
  --gemini-api-key "%GEMINI_API_KEY%" ^
  --workspace %CD%\workspace ^
  --gateway-token "%OPENCLAW_TOKEN%" ^
  --gateway-bind lan ^
  --install-daemon ^
  --skip-channels ^
  --flow quickstart

:: Register Agents
echo 🤖 Registering 9 agents...
for %%a in (jarvis fury loki shuri atlas echo oracle pulse vision) do (
    npx openclaw agents create %%a --workspace %CD%\agents\%%a
    echo   ✅ %%a registered
)

:: Webhook Server
echo 🔗 Starting webhook server...
cd skills\webhook-server\scripts
npm init -y
npm install @supabase/supabase-js
start /B node server.js
cd ..\..\..
echo ✅ Webhook server started on port 3003

:: Supabase Setup
echo.
echo 🗄️ Supabase Setup:
echo    1. supabase.com/dashboard pe jao
echo    2. SQL Editor mein paste karo: skills\supabase-schema\schema.sql
echo    3. Run karo
pause

:: Social Media Setup
echo.
echo 📱 Social Media Setup:
echo    LinkedIn: node skills\browser-automation\scripts\setup-linkedin.js
echo    Twitter:  node skills\browser-automation\scripts\setup-twitter.js
echo.

echo ✅ Akki OS Setup Complete!
echo.
echo Next Steps:
echo 1. LinkedIn login: node skills\browser-automation\scripts\setup-linkedin.js
echo 2. Twitter login:  node skills\browser-automation\scripts\setup-twitter.js
echo 3. Telegram pe bot ko /start bhejo
echo 4. Dashboard: git clone https://github.com/Chiraggoyal120/mission_control
echo.
echo 🦅 Your Personal Branding OS is LIVE!
pause
