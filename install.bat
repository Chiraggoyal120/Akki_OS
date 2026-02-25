@echo off
setlocal enabledelayedexpansion
echo.
echo ===================================================
echo    Akki OS - Personal Branding Operating System
echo ===================================================
echo.

:: Check Node.js
echo [1/6] Checking Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js not found!
    echo Please install from: https://nodejs.org
    pause
    exit /b 1
)
echo OK: Node.js ready

:: Install OpenClaw
echo.
echo [2/6] Installing OpenClaw...
call npm install -g openclaw >nul 2>&1
echo OK: OpenClaw installed

:: Copy .env
echo.
echo [3/6] Setting up configuration...
if not exist .env (
    copy .env.example .env >nul
    echo Please fill in your .env file now...
    notepad .env
    echo Press any key after saving .env file...
    pause >nul
)

:: Read .env
for /f "usebackq tokens=1,2 delims==" %%a in (".env") do (
    if "%%a"=="GEMINI_API_KEY" set GEMINI_API_KEY=%%b
    if "%%a"=="OPENCLAW_TOKEN" set OPENCLAW_TOKEN=%%b
    if "%%a"=="SUPABASE_URL" set SUPABASE_URL=%%b
    if "%%a"=="SUPABASE_SERVICE_KEY" set SUPABASE_SERVICE_KEY=%%b
    if "%%a"=="TELEGRAM_BOT_TOKEN" set TELEGRAM_BOT_TOKEN=%%b
    if "%%a"=="APIFY_TOKEN" set APIFY_TOKEN=%%b
)
echo OK: Config loaded

:: OpenClaw Setup
echo.
echo [4/6] Setting up OpenClaw Gateway...
call npx openclaw onboard --non-interactive --accept-risk --gemini-api-key "%GEMINI_API_KEY%" --workspace %CD%\workspace --gateway-token "%OPENCLAW_TOKEN%" --gateway-bind lan --install-daemon --skip-channels --flow quickstart
echo OK: OpenClaw configured

:: Register Agents
echo.
echo [5/6] Registering 9 agents...
for %%a in (jarvis fury loki shuri atlas echo oracle pulse vision) do (
    call npx openclaw agents create %%a --workspace %CD%\agents\%%a >nul 2>&1
    echo   OK: %%a registered
)

:: Webhook Server
echo.
echo [6/6] Starting webhook server...
cd skills\webhook-server\scripts
call npm init -y >nul 2>&1
call npm install @supabase/supabase-js >nul 2>&1
start "Webhook Server" /B node server.js
cd ..\..\..
echo OK: Webhook server started on port 3003

echo.
echo ===================================================
echo    Akki OS Setup Complete!
echo ===================================================
echo.
echo Next Steps:
echo 1. LinkedIn login:
echo    node skills\browser-automation\scripts\setup-linkedin.js
echo.
echo 2. Twitter login:
echo    node skills\browser-automation\scripts\setup-twitter.js
echo.
echo 3. Telegram pe @AkkiOS_bot ko /start bhejo
echo.
echo 4. Dashboard chalao:
echo    git clone https://github.com/Chiraggoyal120/mission_control
echo    cd mission_control
echo    npm install
echo    npm run dev
echo.
echo Your Personal Branding OS is LIVE!
echo.
pause
