FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY telemetry_service.py .

RUN mkdir -p /app/fastf1_cache

ENV FASTF1_CACHE=/app/fastf1_cache

CMD exec uvicorn telemetry_service:app \
    --host 0.0.0.0 \
    --port ${PORT:-8080} \
    --workers 1