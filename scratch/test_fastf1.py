import fastf1
import os

# Setup FastF1 Cache
CACHE_DIR = "fastf1_cache"
if not os.path.exists(CACHE_DIR):
    os.makedirs(CACHE_DIR)
fastf1.Cache.enable_cache(CACHE_DIR)

try:
    print("Attempting to load 2024 Round 1 Race Session...")
    session = fastf1.get_session(2024, 1, 'R')
    session.load(telemetry=False, laps=True, weather=False)
    print(f"Success! Loaded {len(session.laps)} laps.")
except Exception as e:
    print(f"Error loading session: {e}")
