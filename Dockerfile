# Stage 1: Build React Frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# Stage 2: Production Python Backend
FROM python:3.12-slim
WORKDIR /app

# System dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install Python requirements
COPY backend/requirements.txt ./backend/
RUN pip install --no-cache-dir -r ./backend/requirements.txt

# Copy Backend Source Code
COPY backend/ ./backend/

# Copy Built Frontend Assets from Stage 1 into frontend/dist
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Expose port (Render/Heroku/Railway dynamic PORT support)
ENV PORT=8000
EXPOSE 8000

# Set Working Directory to backend
WORKDIR /app/backend

# Launch Unified FastAPI Server (serves both REST API and React Single-Page Application)
CMD uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}
