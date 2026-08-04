import sys
import os
import fastf1
import pandas
import numpy
import fastapi
import uvicorn

print(f"Python Version: {sys.version}")
print(f"FastF1 Version: {fastf1.__version__}")
print(f"Pandas Version: {pandas.__version__}")
print(f"NumPy Version: {numpy.__version__}")
print(f"FastAPI Version: {fastapi.__version__}")
print(f"Uvicorn Version: {uvicorn.__version__}")

try:
    session = fastf1.get_session(2024, 1, 'R')
    print("FastF1: Successfully initialized session object (no load yet)")
except Exception as e:
    print(f"FastF1 Error: {e}")

print("Environment check complete.")
