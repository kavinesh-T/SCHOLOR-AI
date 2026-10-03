@echo off
title ScholarMatch AI Launcher
echo ===================================================
echo Starting ScholarMatch AI (Backend + Frontend)
echo ===================================================

echo [1/2] Launching FastAPI Backend on http://127.0.0.1:8000...
start cmd /k "cd /d %~dp0backend && python -m uvicorn main:app --host 127.0.0.1 --port 8000"

timeout /t 2 /nobreak >nul

echo [2/2] Launching React Vite Frontend on http://localhost:5173...
start cmd /k "cd /d %~dp0frontend && npm.cmd run dev"

echo.
echo Both servers started!
echo Open your browser at http://localhost:5173
echo ===================================================
