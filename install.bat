@echo off
setlocal enabledelayedexpansion
echo.
echo ===================================================
echo    Akki OS - Personal Branding Operating System
echo ===================================================
echo.

echo [1/7] Checking Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js not found! Install from: https://nodejs.org
    pause
    exit /b 1
)
echo OK: Node.js ready

echo [2/7] Checking Docker...
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Docker not found! Install from: https://docker.com
    start https://docker.com
    pause
    exit /b 1
)
echo OK: Docker ready

echo.
echo [3/7] Installing OpenClaw...
call npm install -g openclaw >nul 2>&1
echo OK: OpenClaw installed

echo.
echo ===================================================
echo    QUICK SETUP - Only 3 things needed!
echo    (Everything else your AI will ask you)
echo ===================================================
echo.

if not exist .env (

    echo --- Step 1: Choose AI Provider ---
    echo.
    echo   1. Google Gemini  (Free - https://aistudio.google.com/apikey)
    echo   2. Anthropic Claude (https://console.anthropic.com)
    echo   3. OpenAI GPT     (https://platform.openai.com)
    echo.
    set /p AI_CHOICE="Enter choice (1/2/3): "

    if "!AI_CHOICE!"=="1" (
        set /p AI_API_KEY="Enter Gemini API Key: "
        set AI_PROVIDER=google
    )
    if "!AI_CHOICE!"=="2" (
        set /p AI_API_KEY="Enter Anthropic API Key: "
        set AI_PROVIDER=anthropic
    )
    if "!AI_CHOICE!"=="3" (
        set /p AI_API_KEY="Enter OpenAI API Key: "
        set AI_PROVIDER=openai
    )

    echo.
    echo --- Step 2: Telegram Bot ---
    echo Get token from @BotFather on Telegram
    echo.
    set /p TELEGRAM_BOT_TOKEN="Enter Telegram Bot Token: "

    echo.
    echo --- Step 3: Gateway Password ---
    echo This protects your local AI dashboard.
    echo.
    set /p OPENCLAW_TOKEN="Enter Gateway Password (e.g. akki2026): "

    echo.
    echo Saving...
    (
        echo AI_PROVIDER=!AI_PROVIDER!
        echo AI_API_KEY=!AI_API_KEY!
        echo TELEGRAM_BOT_TOKEN=!TELEGRAM_BOT_TOKEN!
        echo OPENCLAW_TOKEN=!OPENCLAW_TOKEN!
    ) > .env
    echo OK: Saved!

) else (
    echo OK: Found existing .env, loading...
    for /f "usebackq tokens=1,2 delims==" %%a in (".env") do (
        if "%%a"=="AI_API_KEY" set AI_API_KEY=%%b
        if "%%a"=="AI_PROVIDER" set AI_PROVIDER=%%b
        if "%%a"=="OPENCLAW_TOKEN" set OPENCLAW_TOKEN=%%b
        if "%%a"=="TELEGRAM_BOT_TOKEN" set TELEGRAM_BOT_TOKEN=%%b
    )
)

echo.
echo [4/7] Setting up OpenClaw...
if "!AI_PROVIDER!"=="google" (
    call npx openclaw onboard --non-interactive --accept-risk --gemini-api-key "!AI_API_KEY!" --workspace %~dp0workspace --gateway-token "!OPENCLAW_TOKEN!" --gateway-bind loopback --install-daemon --skip-channels --flow quickstart
)
if "!AI_PROVIDER!"=="anthropic" (
    call npx openclaw onboard --non-interactive --accept-risk --anthropic-api-key "!AI_API_KEY!" --workspace %~dp0workspace --gateway-token "!OPENCLAW_TOKEN!" --gateway-bind loopback --install-daemon --skip-channels --flow quickstart
)
if "!AI_PROVIDER!"=="openai" (
    call npx openclaw onboard --non-interactive --accept-risk --openai-api-key "!AI_API_KEY!" --workspace %~dp0workspace --gateway-token "!OPENCLAW_TOKEN!" --gateway-bind loopback --install-daemon --skip-channels --flow quickstart
)
echo OK: OpenClaw configured

echo.
echo [5/7] Starting Gateway...
schtasks /run /tn "OpenClaw Gateway" >nul 2>&1
echo Waiting for gateway...
:waitloop
timeout /t 3 /nobreak >nul
npx openclaw status 2>&1 | findstr "reachable" >nul
if %errorlevel% neq 0 goto waitloop
echo OK: Gateway ready!

echo.
echo [6/7] Registering Agents + Skills + Webhook...
call npx openclaw channels add telegram --token "!TELEGRAM_BOT_TOKEN!" >nul 2>&1
echo OK: Telegram added
for %%a in (jarvis fury loki shuri atlas echo oracle pulse vision) do (
    call npx openclaw agents add %%a --workspace %~dp0agents\%%a >nul 2>&1
    echo   OK: %%a registered
)
if not exist %~dp0workspace\skills mkdir %~dp0workspace\skills
xcopy /E /I /Y %~dp0skills\* %~dp0workspace\skills\ >nul 2>&1
echo OK: Skills copied
cd %~dp0skills\webhook-server\scripts
call npm init -y >nul 2>&1
call npm install @/-js dotenv >nul 2>&1
start "Webhook Server" cmd /k "node server.js"
cd %~dp0
echo OK: Webhook started

echo.
echo [7/7] Setting up Mission Control Dashboard...
if not exist %~dp0mission_control (
    git clone https://github.com/Chiraggoyal120/mission_control.git %~dp0mission_control
)
cd %~dp0mission_control
if not exist .env (
    (
        echo FRONTEND_PORT=3000
        echo BACKEND_PORT=8000
        echo POSTGRES_DB=mission_control
        echo POSTGRES_USER=postgres
        echo POSTGRES_PASSWORD=postgres
        echo POSTGRES_PORT=5432
        echo CORS_ORIGINS=http://localhost:3000
        echo DB_AUTO_MIGRATE=true
        echo LOG_LEVEL=INFO
        echo REQUEST_LOG_SLOW_MS=1000
        echo AUTH_MODE=local
        echo LOCAL_AUTH_TOKEN=!OPENCLAW_TOKEN!
        echo NEXT_PUBLIC_API_URL=http://localhost:8000
    ) > .env
)
docker compose -f compose.yml --env-file .env up -d --build
cd %~dp0
echo OK: Mission Control started!

echo.
echo ===================================================
echo    Akki OS is LIVE!
echo ===================================================
echo.
echo OpenClaw:        http://127.0.0.1:18789/?token=!OPENCLAW_TOKEN!
echo Mission Control: http://localhost:3000  (Login: !OPENCLAW_TOKEN!)
echo.
echo Next Step: Open Telegram and message your bot!
echo Your AI will guide you through the rest.
echo.
pause
