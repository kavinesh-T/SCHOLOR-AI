@echo off
title ScholarMatch AI Production Launcher
echo =========================================================
echo ScholarMatch AI - Production Build and Single-Port Deploy
echo =========================================================

echo [1/3] Building Optimized React Frontend...
cd /d %~dp0frontend
call npm.cmd run build
if %errorlevel% neq 0 (
    echo [ERROR] Frontend build failed!
    pause
    exit /b %errorlevel%
)

echo.
echo [2/3] Checking Python Backend Dependencies...
cd /d %~dp0backend
pip install -r requirements.txt --quiet

echo.
echo [3/3] Starting Unified Production Server on http://127.0.0.1:8000...
echo Both React Frontend and FastAPI Backend will run seamlessly on Port 8000!
echo.
python -m uvicorn main:app --host 127.0.0.1 --port 8000

pause
