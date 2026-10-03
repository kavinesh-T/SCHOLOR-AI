#!/usr/bin/env bash
set -e

echo "========================================================="
echo "ScholarMatch AI - Production Build and Single-Port Deploy"
echo "========================================================="

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo "[1/3] Building Optimized React Frontend..."
cd "$DIR/frontend"
npm run build

echo "[2/3] Installing Python Backend Dependencies..."
cd "$DIR/backend"
pip install -r requirements.txt --quiet

echo "[3/3] Starting Unified Production Server on http://0.0.0.0:8000..."
echo "Both React Frontend and FastAPI Backend will run seamlessly on Port 8000!"
python -m uvicorn main:app --host 0.0.0.0 --port "${PORT:-8000}"
