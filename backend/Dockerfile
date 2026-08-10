FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY telemetry_service.py .

RUN mkdir -p /app/cache

ENV APEX_CACHE_ROOT=/app/cache \
    TELEMETRY_CACHE_VERSION=v1 \
    TELEMETRY_GENERATION_WORKERS=1

CMD exec uvicorn telemetry_service:app \
    --host 0.0.0.0 \
    --port ${PORT:-8080} \
    --workers 1
