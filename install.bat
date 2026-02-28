@echo off
setlocal enabledelayedexpansion
echo.
echo ===================================================
echo    Akki OS - Personal Branding Operating System
echo ===================================================
echo.

echo [1/4] Checking Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js not found! Install from: https://nodejs.org
    pause
    exit /b 1
)
echo OK: Node.js ready

echo [2/4] Checking Docker...
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Docker not found! Install from: https://docker.com
    start https://docker.com
    pause
    exit /b 1
)
echo OK: Docker ready

echo.
echo [3/4] Installing OpenClaw...
call npm install -g openclaw >nul 2>&1
echo OK: OpenClaw installed

echo.
echo ===================================================
echo    OpenClaw will now guide you through setup!
echo ===================================================
echo.
call npx openclaw onboard --workspace %~dp0workspace --gateway-bind loopback --install-daemon

echo.
echo Reading gateway token from OpenClaw config...
for /f "tokens=*" %%a in ('node -e "const c=require(process.env.USERPROFILE+'/.openclaw/openclaw.json');console.log(c.gateway.token)"') do set OPENCLAW_TOKEN=%%a
echo OK: Gateway token loaded - !OPENCLAW_TOKEN!

echo.
echo [4/4] Setting up Agents + Skills + Webhook + Mission Control...

REM Register agents
for %%a in (jarvis fury loki shuri atlas echo oracle pulse vision) do (
    call npx openclaw agents add %%a --workspace %~dp0agents\%%a >nul 2>&1
    echo   OK: %%a registered
)

REM Copy skills
if not exist %~dp0workspace\skills mkdir %~dp0workspace\skills
xcopy /E /I /Y %~dp0skills\* %~dp0workspace\skills\ >nul 2>&1
echo OK: Skills copied

REM Start webhook
cd %~dp0skills\webhook-server\scripts
call npm init -y >nul 2>&1
call npm install convex dotenv >nul 2>&1
start "Webhook Server" cmd /k "node server.js"
cd %~dp0
echo OK: Webhook started

REM Mission Control
if not exist %~dp0mission_control (
    git clone https://github.com/Chiraggoyal120/mission_control.git %~dp0mission_control
)
cd %~dp0mission_control
if not exist .env (
    (
        echo FRONTEND_PORT=3000
        echo BACKEND_PORT=8000
        echo CORS_ORIGINS=http://localhost:3000
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
