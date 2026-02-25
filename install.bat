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

:: Install OpenClaw
echo 📦 Installing OpenClaw...
npm install -g openclaw >nul 2>&1
echo ✅ OpenClaw installed

:: Copy .env
if not exist .env (
    copy .env.example .env
    echo.
    echo 📝 Fill in your .env file with credentials
    notepad .env
    echo Press any key after saving .env...
    pause >nul
)

:: Read .env file
echo ⚙️ Reading configuration...
for /f "usebackq tokens=1,2 delims==" %%a in (".env") do (
    if "%%a"=="GEMINI_API_KEY" set GEMINI_API_KEY=%%b
    if "%%a"=="OPENCLAW_TOKEN" set OPENCLAW_TOKEN=%%b
    if "%%a"=="SUPABASE_URL" set SUPABASE_URL=%%b
    if "%%a"=="SUPABASE_SERVICE_KEY" set SUPABASE_SERVICE_KEY=%%b
    if "%%a"=="TELEGRAM_BOT_TOKEN" set TELEGRAM_BOT_TOKEN=%%b
    if "%%a"=="APIFY_TOKEN" set APIFY_TOKEN=%%b
)

echo ✅ Config loaded: %GEMINI_API_KEY:~0,10%...

:: OpenClaw Setup
echo ⚙️ Setting up OpenClaw...
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
call npm init -y >nul 2>&1
call npm install @supabase/supabase-js >nul 2>&1
start /B node server.js
cd ..\..\..
echo ✅ Webhook started on port 3003

:: Done
echo.
echo ✅ Akki OS Setup Complete!
echo.
echo Next Steps:
echo 1. LinkedIn: node skills\browser-automation\scripts\setup-linkedin.js
echo 2. Twitter:  node skills\browser-automation\scripts\setup-twitter.js
echo 3. Telegram pe bot ko /start bhejo
echo 4. Dashboard: git clone https://github.com/Chiraggoyal120/mission_control
echo.
echo 🦅 Your Personal Branding OS is LIVE!
pause
