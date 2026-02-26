@echo off
setlocal enabledelayedexpansion
echo.
echo ===================================================
echo    Akki OS - Personal Branding Operating System
echo ===================================================
echo.

echo [1/8] Checking Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js not found! Install from: https://nodejs.org
    pause
    exit /b 1
)
echo OK: Node.js ready

echo.
echo [2/8] Installing OpenClaw...
call npm install -g openclaw >nul 2>&1
echo OK: OpenClaw installed

echo.
echo [3/8] Setting up configuration...
if not exist .env (
    copy .env.example .env >nul
    notepad .env
    echo Press any key after saving .env...
    pause >nul
)
for /f "usebackq tokens=1,2 delims==" %%a in (".env") do (
    if "%%a"=="GEMINI_API_KEY" set GEMINI_API_KEY=%%b
    if "%%a"=="OPENCLAW_TOKEN" set OPENCLAW_TOKEN=%%b
    if "%%a"=="SUPABASE_URL" set SUPABASE_URL=%%b
    if "%%a"=="SUPABASE_SERVICE_KEY" set SUPABASE_SERVICE_KEY=%%b
    if "%%a"=="TELEGRAM_BOT_TOKEN" set TELEGRAM_BOT_TOKEN=%%b
    if "%%a"=="APIFY_TOKEN" set APIFY_TOKEN=%%b
)
echo OK: Config loaded

echo.
echo [4/8] Setting up OpenClaw...
call npx openclaw onboard --non-interactive --accept-risk --gemini-api-key "%GEMINI_API_KEY%" --workspace %CD%\workspace --gateway-token "%OPENCLAW_TOKEN%" --gateway-bind loopback --install-daemon --skip-channels --flow quickstart
echo OK: OpenClaw configured

echo.
echo [5/8] Starting Gateway...
start "OpenClaw Gateway" cmd /k "npx openclaw gateway start"
echo Waiting for gateway to be ready...
:waitloop
npx openclaw gateway probe >nul 2>&1
if %errorlevel% neq 0 (
    timeout /t 3 /nobreak >nul
    goto waitloop
)
echo OK: Gateway ready!

echo.
echo [6/8] Adding Telegram + Registering agents...
call npx openclaw channels add telegram --token "%TELEGRAM_BOT_TOKEN%" >nul 2>&1
echo OK: Telegram added
for %%a in (jarvis fury loki shuri atlas echo oracle pulse vision) do (
    call npx openclaw agents create %%a --workspace %CD%\agents\%%a >nul 2>&1
    echo   OK: %%a registered
)

echo.
echo [7/8] Copying skills to workspace...
if not exist workspace\skills mkdir workspace\skills
xcopy /E /I /Y skills\* workspace\skills\ >nul 2>&1
echo OK: Skills copied to workspace

echo.
echo [8/8] Starting webhook server...
cd skills\webhook-server\scripts
call npm init -y >nul 2>&1
call npm install @supabase/supabase-js >nul 2>&1
start "Webhook Server" cmd /k "node server.js"
cd ..\..\..
echo OK: Webhook started on port 3003

echo.
echo ===================================================
echo    Akki OS Setup Complete!
echo ===================================================
echo.
echo Next Steps:
echo 1. node skills\browser-automation\scripts\setup-linkedin.js
echo 2. node skills\browser-automation\scripts\setup-twitter.js
echo 3. Telegram pe @AkkiOS_bot ko /start bhejo
echo 4. git clone https://github.com/Chiraggoyal120/mission_control
echo.
echo Your Personal Branding OS is LIVE!
pause
