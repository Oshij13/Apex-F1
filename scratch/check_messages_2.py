import fastf1
fastf1.Cache.enable_cache('fastf1_cache')
session = fastf1.get_session(2024, 3, 'R')
session.load(telemetry=False, weather=False, messages=True)
for m in session.race_control_messages['Message']:
    if 'HAMILTON' in m.upper():
        print(m)
