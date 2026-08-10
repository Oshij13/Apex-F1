# Phone telemetry deployment

The Python telemetry service now keeps two persistent caches and generates an
uncached race in the background. Render receives `202 Accepted` while a race is
being generated, and the browser polls until the processed JSON is ready.

## Phone configuration

Set these variables before starting FastAPI. `APEX_CACHE_ROOT` must point to a
directory that survives process and phone restarts.

```sh
export APEX_CACHE_ROOT="$HOME/apex-f1-cache"
export TELEMETRY_CACHE_VERSION="v1"
export TELEMETRY_GENERATION_WORKERS="1"
export PREWARM_RACES="2025-1,2025-6"
python telemetry_service.py
```

The directory will contain:

```text
apex-f1-cache/
  fastf1/
  processed/
    v1/
      2025-01.json
      2025-06.json
```

Keep `TELEMETRY_GENERATION_WORKERS=1` on the phone unless it has enough memory
and CPU for concurrent FastF1 sessions. To invalidate processed files after a
response-schema change, set a new version such as `v2`. The raw FastF1 cache is
reused across processed-cache versions.

## Render configuration

Set `PYTHON_TELEMETRY_URL` to the public Tailscale/Funnel URL without a trailing
slash. Render now waits at most 10 seconds for each short status/data request.

## Verification

1. Choose a race absent from `processed/v1`. The first request should return
   HTTP 202 with `status: processing`; later polls should return HTTP 200.
2. Request the same race again. It should return HTTP 200 immediately without
   a new FastF1 load.
3. Stop the phone service temporarily. Render should return HTTP 502 with
   `telemetry_service_offline` or `telemetry_service_timeout` instead of hanging.

Useful direct checks:

```sh
curl -i https://YOUR-PHONE-URL/health
curl -i https://YOUR-PHONE-URL/api/telemetry/2025/1
curl -i https://YOUR-PHONE-URL/api/telemetry/status/2025/1
```
