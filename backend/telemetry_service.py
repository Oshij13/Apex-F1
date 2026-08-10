import os
import math
import json
import logging
import threading
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone
from pathlib import Path
import numpy as np
import pandas as pd
import fastf1
from fastapi import FastAPI, HTTPException, status
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from datetime import timedelta
import uvicorn

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(GZipMiddleware, minimum_size=1000)

# Both caches must live below a stable, absolute directory on the phone. Set
# APEX_CACHE_ROOT to persistent storage in production.
APP_DIR = Path(__file__).resolve().parent
CACHE_ROOT = Path(os.getenv("APEX_CACHE_ROOT", APP_DIR / "fastf1_cache")).expanduser().resolve()
FASTF1_CACHE_DIR = CACHE_ROOT / "fastf1"
CACHE_VERSION = os.getenv("TELEMETRY_CACHE_VERSION", "v1")
PROCESSED_CACHE_DIR = CACHE_ROOT / "processed" / CACHE_VERSION
FASTF1_CACHE_DIR.mkdir(parents=True, exist_ok=True)
PROCESSED_CACHE_DIR.mkdir(parents=True, exist_ok=True)
fastf1.Cache.enable_cache(str(FASTF1_CACHE_DIR))

logger = logging.getLogger("apex.telemetry")
GENERATION_WORKERS = max(1, int(os.getenv("TELEMETRY_GENERATION_WORKERS", "1")))
generation_pool = ThreadPoolExecutor(max_workers=GENERATION_WORKERS, thread_name_prefix="race-generation")
generation_states = {}
generation_states_lock = threading.Lock()

FPS = 10  # Reduced FPS for lighter payload over web
DT = 1 / FPS

def _resample_driver(session, driver_code, global_t_min, global_t_max):
    try:
        laps = session.laps.pick_drivers(driver_code)
        if laps.empty: return None
        
        # Head 10 laps for faster processing in this demo
        tel = laps.head(10).get_telemetry()
        if tel.empty: return None
        
        t_arr = tel['SessionTime'].dt.total_seconds().to_numpy()
        x_arr = tel['X'].to_numpy()
        y_arr = tel['Y'].to_numpy()
        v_arr = tel['Speed'].to_numpy()
        g_arr = tel['nGear'].to_numpy()
        d_arr = tel['Distance'].to_numpy()
        th_arr = tel['Throttle'].to_numpy()
        br_arr = tel['Brake'].to_numpy().astype(float)
        
        # Resample timeline
        timeline = np.arange(global_t_min, global_t_max, DT)
        
        # Normalization handled by frontend or here? 
        # The reference project uses raw world coords and handles scaling in GUI.
        # We'll normalize to 0-1 here to keep the frontend simple and fast.
        
        return {
            "t": t_arr,
            "x": x_arr,
            "y": y_arr,
            "v": v_arr,
            "g": g_arr,
            "d": d_arr,
            "th": th_arr,
            "br": br_arr
        }
    except:
        return None

def _cache_path(year: int, race_round: int) -> Path:
    return PROCESSED_CACHE_DIR / f"{year}-{race_round:02d}.json"


def _read_processed_cache(year: int, race_round: int):
    cache_path = _cache_path(year, race_round)
    if not cache_path.is_file():
        return None
    try:
        with cache_path.open("r", encoding="utf-8") as cache_file:
            data = json.load(cache_file)
        if (
            data.get("cache_version") == CACHE_VERSION
            and isinstance(data.get("drivers"), dict)
            and data["drivers"]
            and isinstance(data.get("track_path"), list)
        ):
            return data
        logger.warning("Ignoring invalid processed cache file: %s", cache_path)
    except (OSError, json.JSONDecodeError) as exc:
        logger.warning("Unable to read processed cache %s: %s", cache_path, exc)
    return None


def _write_processed_cache(year: int, race_round: int, data: dict) -> None:
    cache_path = _cache_path(year, race_round)
    temp_path = cache_path.with_suffix(f".json.{os.getpid()}.{threading.get_ident()}.tmp")
    try:
        with temp_path.open("w", encoding="utf-8") as cache_file:
            json.dump(data, cache_file, separators=(",", ":"), allow_nan=False)
            cache_file.flush()
            os.fsync(cache_file.fileno())
        os.replace(temp_path, cache_path)
    finally:
        if temp_path.exists():
            temp_path.unlink(missing_ok=True)


def _generate_telemetry(year: int, round: int):
    cache_path = _cache_path(year, round)
    try:
        print(f"Loading {year} Round {round} Full Race from API...")
        session = fastf1.get_session(year, round, 'R')
        session.load(telemetry=True, laps=True, weather=True)
        
        drivers = session.drivers
        
        # 1. Precise Race Start Time
        # We look for the exact second the first driver started Lap 1
        try:
            lap1 = session.laps.pick_lap(1)
            # The start of Lap 1 is: Time - LapTime
            start_time = (lap1['Time'] - lap1['LapTime']).dt.total_seconds().min()
        except:
            start_time = session.laps['Time'].dt.total_seconds().min()

        # 2. Find global time bounds
        t_maxs = []
        for drv in drivers:
            try:
                laps = session.laps.pick_drivers(drv)
                if laps.empty: continue
                tel = laps.get_telemetry()
                if not tel.empty and 'SessionTime' in tel.columns:
                    t_maxs.append(tel['SessionTime'].dt.total_seconds().max())
            except: continue
        
        if not t_maxs:
            raise HTTPException(status_code=404, detail="No telemetry data found")
            
        global_t_min = start_time
        global_t_max = max(t_maxs)
        
        duration = global_t_max - global_t_min
        dynamic_fps = 5 if duration < 3600 else 2
        dt = 1 / dynamic_fps
        timeline = np.arange(global_t_min, global_t_max, dt)
        
        # 3. Track Geometry & DRS Zones
        track_path = []
        drs_zones = []
        min_x, max_x, min_y, max_y = 0, 1, 0, 1
        range_x, range_y = 1, 1
        
        try:
            fastest = session.laps.pick_fastest()
            if fastest is None and not session.laps.empty: 
                fastest = session.laps.iloc[0]
            
            if fastest is not None:
                track_tel = fastest.get_telemetry()
                min_x, max_x = track_tel['X'].min(), track_tel['X'].max()
                min_y, max_y = track_tel['Y'].min(), track_tel['Y'].max()
                range_x = max_x - min_x if max_x != min_x else 1
                range_y = max_y - min_y if max_y != min_y else 1
                
                step = max(1, len(track_tel) // 500)
                for _, row in track_tel.iloc[::step].iterrows():
                    track_path.append({
                        "x": float((row['X'] - min_x) / range_x),
                        "y": float((row['Y'] - min_y) / range_y)
                    })

                # Extract DRS Zones
                try:
                    circuit_info = session.get_circuit_info()
                    dist_arr = track_tel['Distance'].to_numpy()
                    x_arr = track_tel['X'].to_numpy()
                    y_arr = track_tel['Y'].to_numpy()

                    # Debug: print columns to verify data structure
                    print(f"--- [DRS] Circuit Info Columns: {circuit_info.drs_zones.columns.tolist()}")
                    
                    for _, zone in circuit_info.drs_zones.iterrows():
                        # Handle wrap-around (DistanceStart > DistanceEnd)
                        d_start = zone.get('DistanceStart', zone.get('Distance', 0))
                        d_end = zone.get('DistanceEnd', d_start + 100)

                        if d_start < d_end:
                            mask = (dist_arr >= d_start) & (dist_arr <= d_end)
                        else:
                            mask = (dist_arr >= d_start) | (dist_arr <= d_end)
                        
                        z_x, z_y = x_arr[mask], y_arr[mask]
                        if len(z_x) > 1:
                            path = [{"x": float((z_x[i]-min_x)/range_x), "y": float((z_y[i]-min_y)/range_y)} for i in range(len(z_x))]
                            drs_zones.append({"path": path})

                    # UNIVERSAL FALLBACK: If still empty, add a zone from 5% to 15% of track as a visual test
                    if len(drs_zones) == 0:
                        print("--- [DRS] No zones found. Adding Universal Fallback Zone (5-15%)")
                        idx_start, idx_end = int(len(x_arr) * 0.05), int(len(x_arr) * 0.15)
                        z_x, z_y = x_arr[idx_start:idx_end], y_arr[idx_start:idx_end]
                        if len(z_x) > 1:
                            path = [{"x": float((z_x[i]-min_x)/range_x), "y": float((z_y[i]-min_y)/range_y)} for i in range(len(z_x))]
                            drs_zones.append({"path": path})

                    print(f"--- [DRS] Final count: {len(drs_zones)} zones for {session.event['EventName']}")
                except Exception as e: 
                    print(f"--- [DRS] Failed to process circuit info: {e}")
                    # Emergency fallback using track path segments
                    if len(track_path) > 50:
                        drs_zones.append({"path": track_path[10:40]})
        except Exception as e:
            print(f"--- [DRS] Telemetry processing failed: {e}")

        # 4. Process Drivers
        driver_data = {}
        # Get official results for DNF and Winner sync
        results = session.results if not session.results.empty else None

        for drv in drivers:
            try:
                info = session.get_driver(drv)
                res_row = results[results['Abbreviation'] == info['Abbreviation']] if results is not None else None
                status = str(res_row['Status'].iloc[0]) if res_row is not None and not res_row.empty else "Finished"
                pos = int(res_row['Position'].iloc[0]) if res_row is not None and not res_row.empty else 20

                laps = session.laps.pick_drivers(drv)
                if laps.empty:
                    # DNS/No-data driver entry
                    driver_data[info['Abbreviation']] = {
                        "x": [0.0] * len(timeline),
                        "y": [0.0] * len(timeline),
                        "v": [0] * len(timeline),
                        "d": [-1000.0] * len(timeline),
                        "th": [0] * len(timeline),
                        "br": [0] * len(timeline),
                        "lap": [0] * len(timeline),
                        "age": [0] * len(timeline),
                        "comp": ['U'] * len(timeline),
                        "t_end": 0.0,
                        "stints": [],
                        "pit_stops": [],
                        "final_status": status,
                        "final_pos": pos,
                        "team": info['TeamName'],
                        "color": "#" + info['TeamColor'] if info['TeamColor'] else "#FFFFFF",
                    }
                    continue

                tel = laps.get_telemetry()
                if tel.empty or 'SessionTime' not in tel.columns:
                    # DNF/No-telemetry driver entry
                    driver_data[info['Abbreviation']] = {
                        "x": [0.0] * len(timeline),
                        "y": [0.0] * len(timeline),
                        "v": [0] * len(timeline),
                        "d": [-1000.0] * len(timeline),
                        "th": [0] * len(timeline),
                        "br": [0] * len(timeline),
                        "lap": [0] * len(timeline),
                        "age": [0] * len(timeline),
                        "comp": ['U'] * len(timeline),
                        "t_end": 0.0,
                        "stints": [],
                        "pit_stops": [],
                        "final_status": status,
                        "final_pos": pos,
                        "team": info['TeamName'],
                        "color": "#" + info['TeamColor'] if info['TeamColor'] else "#FFFFFF",
                    }
                    continue
                
                t_drv = tel['SessionTime'].dt.total_seconds().to_numpy()
                raw_dist = tel['Distance'].to_numpy()
                
                # CRITICAL: Normalize distance to exactly 0.0 at the race start
                dist_at_start = np.interp(global_t_min, t_drv, raw_dist)
                norm_dist = raw_dist - dist_at_start

                def resample(arr):
                    return np.interp(timeline, t_drv, arr).tolist()
                
                # Laps mapping
                lap_resampled = np.zeros(len(timeline))
                try:
                    if 'Time' in laps.columns and 'LapNumber' in laps.columns:
                        l_times = laps['Time'].dt.total_seconds().to_numpy()
                        l_nums = laps['LapNumber'].to_numpy()
                        l_indices = np.searchsorted(l_times, timeline)
                        l_indices = np.clip(l_indices, 0, len(l_nums) - 1)
                        lap_resampled = l_nums[l_indices]
                except: pass

                # Stint and Tyre tracking mapping
                stints = []
                tyre_age_resampled = np.zeros(len(timeline))
                compound_resampled = np.array(['U'] * len(timeline), dtype='object')
                
                try:
                    # Get per-lap stint info
                    for stint_id, row in laps.groupby('Stint'):
                        raw_comp = str(row['Compound'].iloc[0]).upper()
                        # Map full names to codes if necessary, but take first letter as primary
                        comp_code = raw_comp[0] if raw_comp and raw_comp != "NAN" else 'U'
                        
                        stints.append({
                            "stint": int(stint_id),
                            "compound": comp_code,
                            "start_lap": int(row['LapNumber'].iloc[0]),
                            "end_lap": int(row['LapNumber'].iloc[-1]),
                            "initial_age": int(row['TyreLife'].iloc[0])
                        })
                    
                    # Create per-lap time-series for age and compound
                    l_times = laps['Time'].dt.total_seconds().to_numpy()
                    l_ages = laps['TyreLife'].to_numpy()
                    
                    # Robust compound mapping
                    l_comps = []
                    for c in laps['Compound'].astype(str):
                        c_up = c.upper()
                        if not c_up or c_up == "NAN" or c_up == "UNKNOWN":
                            l_comps.append('U')
                        else:
                            l_comps.append(c_up[0])
                    l_comps = np.array(l_comps)
                    
                    l_indices = np.searchsorted(l_times, timeline)
                    l_indices = np.clip(l_indices, 0, len(l_ages) - 1)
                    
                    # Use linear interpolation for age to be smooth
                    tyre_age_resampled = np.interp(timeline, l_times, l_ages)
                    compound_resampled = l_comps[l_indices]
                except Exception as e:
                    print(f"Stint processing error for {drv}: {e}")
                    pass

                # Pit Stops mapping
                pit_stops = []
                try:
                    for _, lap in laps.iterrows():
                        if not pd.isna(lap['PitInTime']):
                            pit_stops.append({
                                "type": "in",
                                "lap": int(lap['LapNumber']),
                                "t": float(lap['PitInTime'].total_seconds() - global_t_min)
                            })
                        if not pd.isna(lap['PitOutTime']):
                            pit_stops.append({
                                "type": "out",
                                "lap": int(lap['LapNumber']),
                                "t": float(lap['PitOutTime'].total_seconds() - global_t_min)
                            })
                except: pass

                info = session.get_driver(drv)
                res_row = results[results['Abbreviation'] == info['Abbreviation']] if results is not None else None
                status = str(res_row['Status'].iloc[0]) if res_row is not None and not res_row.empty else "Finished"
                
                driver_data[info['Abbreviation']] = {
                    "x": [float((val - min_x) / range_x) for val in resample(tel['X'])],
                    "y": [float((val - min_y) / range_y) for val in resample(tel['Y'])],
                    "v": [int(val) for val in resample(tel['Speed'])],
                    "d": [float(val) for val in resample(norm_dist)],
                    "th": [int(val) for val in resample(tel['Throttle'])],
                    "br": [int(val) for val in resample(tel['Brake'])],
                    "lap": [int(val) for val in lap_resampled.tolist()],
                    "age": [int(val) for val in tyre_age_resampled.tolist()],
                    "comp": compound_resampled.tolist(),
                    "t_end": float(t_drv[-1] - global_t_min),
                    "stints": stints,
                    "pit_stops": pit_stops,
                    "final_status": status,
                    "final_pos": int(res_row['Position'].iloc[0]) if res_row is not None and not res_row.empty else 20,
                    "team": info['TeamName'],
                    "color": "#" + info['TeamColor'] if info['TeamColor'] else "#FFFFFF",
                }
            except: continue

        track_status_list = []
        try:
            if hasattr(session, 'track_status') and not session.track_status.empty:
                for _, row in session.track_status.iterrows():
                    t_sec = row['Time'].total_seconds()
                    if t_sec >= global_t_min:
                        track_status_list.append({
                            "t": float(t_sec - global_t_min),
                            "status": str(row['Status']),
                            "message": str(row['Message'])
                        })
        except: pass

        # 5. Weather Data
        weather_resampled = {}
        try:
            w_data = session.weather_data
            if not w_data.empty:
                w_times = w_data['Time'].dt.total_seconds().to_numpy()
                for col in ['AirTemp', 'TrackTemp', 'Humidity', 'Rainfall', 'WindSpeed']:
                    w_vals = w_data[col].to_numpy()
                    weather_resampled[col] = np.interp(timeline, w_times, w_vals).tolist()
        except: pass

        result = {
            "cache_version": CACHE_VERSION,
            "event": str(session.event['EventName']),
            "track_path": track_path,
            "drs_zones": drs_zones,
            "aspect_ratio": float(range_x / range_y) if range_y != 0 else 1.0,
            "drivers": driver_data,
            "weather": weather_resampled,
            "track_status": track_status_list,
            "total_laps": int(session.laps['LapNumber'].max()) if not session.laps.empty else 0,
            "fps": dynamic_fps,
            "duration": float(global_t_max - global_t_min)
        }

        # Write atomically so a polling request can never observe partial JSON.
        _write_processed_cache(year, round, result)
            
        return result

    except Exception as e:
        print(f"Error: {e}")
        raise RuntimeError(str(e)) from e


def _classify_generation_error(exc: Exception):
    message = str(exc)
    lowered = message.lower()
    unavailable_markers = (
        "no data for this session",
        "failed to load any data",
        "no telemetry data found",
        "does not exist",
        "cannot find",
    )
    if any(marker in lowered for marker in unavailable_markers):
        return "fastf1_data_unavailable", 404
    return "processing_failed", 422


def _run_generation(year: int, race_round: int) -> None:
    key = (year, race_round)
    try:
        _generate_telemetry(year, race_round)
        with generation_states_lock:
            generation_states[key] = {
                "status": "ready",
                "finished_at": datetime.now(timezone.utc).isoformat(),
            }
    except Exception as exc:
        error_code, http_status = _classify_generation_error(exc)
        logger.exception("Telemetry generation failed for %s round %s", year, race_round)
        with generation_states_lock:
            generation_states[key] = {
                "status": "failed",
                "error": error_code,
                "message": str(exc),
                "http_status": http_status,
                "finished_at": datetime.now(timezone.utc).isoformat(),
            }


def _telemetry_response(year: int, race_round: int):
    if year < 2018 or race_round < 1 or race_round > 30:
        raise HTTPException(status_code=400, detail="Invalid year or race round")

    cached = _read_processed_cache(year, race_round)
    if cached is not None:
        return cached

    key = (year, race_round)
    with generation_states_lock:
        current = generation_states.get(key)
        if current and current["status"] == "failed":
            payload = {"status": "failed", "year": year, "round": race_round, **current}
            return JSONResponse(status_code=current["http_status"], content=payload)
        if not current or current["status"] != "processing":
            generation_states[key] = {
                "status": "processing",
                "started_at": datetime.now(timezone.utc).isoformat(),
            }
            generation_pool.submit(_run_generation, year, race_round)

    return JSONResponse(
        status_code=status.HTTP_202_ACCEPTED,
        headers={"Retry-After": "4", "Cache-Control": "no-store"},
        content={
            "status": "processing",
            "year": year,
            "round": race_round,
            "retry_after": 4,
        },
    )


@app.get("/api/telemetry/{year}/{round}")
def get_telemetry(year: int, round: int):
    return _telemetry_response(year, round)


@app.get("/api/telemetry/status/{year}/{round}")
def get_telemetry_status(year: int, round: int):
    cached = _read_processed_cache(year, round)
    if cached is not None:
        return {"status": "ready", "year": year, "round": round}
    with generation_states_lock:
        state = generation_states.get((year, round))
        if state is None:
            return {"status": "not_started", "year": year, "round": round}
        return {"year": year, "round": round, **state}


@app.get("/health")
def health():
    return {
        "status": "ok",
        "cache_version": CACHE_VERSION,
        "cache_root": str(CACHE_ROOT),
    }


@app.on_event("startup")
def prewarm_configured_races() -> None:
    """Queue comma-separated YEAR-ROUND values without delaying startup."""
    configured = os.getenv("PREWARM_RACES", "").strip()
    if not configured:
        return
    for value in configured.split(","):
        try:
            year_text, round_text = value.strip().split("-", 1)
            year, race_round = int(year_text), int(round_text)
            if _read_processed_cache(year, race_round) is None:
                _telemetry_response(year, race_round)
                logger.info("Queued pre-warm for %s round %s", year, race_round)
        except (ValueError, HTTPException) as exc:
            logger.error("Invalid PREWARM_RACES entry %r: %s", value, exc)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
