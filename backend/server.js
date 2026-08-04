console.log("Apex F1 Backend Initializing...");
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const NodeCache = require("node-cache");

const app = express();
app.use(cors());
app.use(express.json());

// Cache: 15 min for live data, 24 hours for historical
const liveCache = new NodeCache({ stdTTL: 900 });
const histCache = new NodeCache({ stdTTL: 86400 });

// Simple queue for requests to prevent 429
let lastRequestTime = 0;
const MIN_DELAY = 300; // Increased to 300ms to avoid 429s

// Cache the full driver list once to avoid repeated large fetches
let fullDriverList = null;
let isFetchingDrivers = false;

async function throttle() {
  const now = Date.now();
  const wait = Math.max(0, lastRequestTime + MIN_DELAY - now);
  if (wait > 0) await new Promise((r) => setTimeout(r, wait));
  lastRequestTime = Date.now();
}

// ─── BASE URL ────────────────────────────────────────────────────────────────
const J = "https://api.jolpi.ca/ergast/f1";

// ─── HELPERS ─────────────────────────────────────────────────────────────────
async function live(key, url, headers = {}) {
  if (liveCache.has(key)) return liveCache.get(key);
  await throttle();
  console.log(`[LIVE] Fetching: ${key}`);
  const res = await axios.get(url, { timeout: 10000, ...headers });
  liveCache.set(key, res.data);
  return res.data;
}

async function hist(key, url) {
  if (histCache.has(key)) return histCache.get(key);

  let attempts = 0;
  while (attempts < 3) {
    try {
      await throttle();
      console.log(
        `[HIST] Fetching: ${key} | URL: ${url} (Attempt ${attempts + 1})`,
      );
      const res = await axios.get(url, {
        timeout: 15000,
        headers: { Accept: "application/json" },
      });
      histCache.set(key, res.data);
      return res.data;
    } catch (e) {
      attempts++;
      const isRateLimit = e.response?.status === 429;
      console.warn(`[HIST] ${key} failed (Attempt ${attempts}): ${e.message}`);
      if (attempts >= 3) throw e;
      await new Promise((r) => setTimeout(r, isRateLimit ? 2000 : 500));
    }
  }
}

// ─── SEASONS ─────────────────────────────────────────────────────────────────
// All seasons list
app.get("/api/seasons", async (req, res) => {
  try {
    const data = await hist("seasons", `${J}/seasons.json?limit=100`);
    res.json(data);
  } catch {
    res.status(500).json({ error: "Seasons failed" });
  }
});

// Full race schedule for a year
app.get("/api/season/:year", async (req, res) => {
  const { year } = req.params;
  try {
    // Fetch schedule + race winners in parallel
    const [schedule, winners] = await Promise.all([
      hist(`schedule-${year}`, `${J}/${year}/races.json?limit=100`),
      hist(`winners-${year}`, `${J}/${year}/results/1.json?limit=100`),
    ]);
    const races = schedule.MRData.RaceTable.Races;
    const winnerRaces = winners.MRData.RaceTable.Races;

    // Merge winner info into schedule
    const merged = races.map((race) => {
      const w = winnerRaces.find((r) => r.round === race.round);
      return {
        ...race,
        winner: w?.Results?.[0]?.Driver
          ? `${w.Results[0].Driver.givenName} ${w.Results[0].Driver.familyName}`
          : null,
        winnerTeam: w?.Results?.[0]?.Constructor?.name || null,
      };
    });
    res.json({ MRData: { RaceTable: { season: year, Races: merged } } });
  } catch (e) {
    console.error(`Season ${year} error:`, e.message);
    res.status(500).json({ error: "Season failed" });
  }
});

// ─── CIRCUITS ─────────────────────────────────────────────────────────────────
app.get("/api/circuits", async (req, res) => {
  try {
    const data = await hist("circuits", `${J}/circuits.json?limit=100`);
    res.json(data);
  } catch {
    res.status(500).json({ error: "Circuits failed" });
  }
});

app.get("/api/circuits/:year", async (req, res) => {
  const { year } = req.params;
  try {
    const data = await hist(
      `circuits-${year}`,
      `${J}/${year}/circuits.json?limit=100`,
    );
    res.json(data);
  } catch {
    res.status(500).json({ error: "Circuits failed" });
  }
});

// Individual circuit by ID
app.get("/api/circuits/info/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const data = await hist(`circuit-${id}`, `${J}/circuits/${id}.json`);
    res.json(data);
  } catch {
    res.status(500).json({ error: "Circuit info failed" });
  }
});

// ─── RACES ────────────────────────────────────────────────────────────────────
app.get("/api/races/:year", async (req, res) => {
  const { year } = req.params;
  try {
    const data = await hist(
      `races-${year}`,
      `${J}/${year}/races.json?limit=100`,
    );
    res.json(data);
  } catch {
    res.status(500).json({ error: "Races failed" });
  }
});

app.get("/api/race/:year/:round", async (req, res) => {
  const { year, round } = req.params;
  try {
    const data = await hist(
      `race-${year}-${round}`,
      `${J}/${year}/${round}/results.json`,
    );
    res.json(data);
  } catch {
    res.status(500).json({ error: "Race results failed" });
  }
});

// ─── RESULTS ─────────────────────────────────────────────────────────────────
app.get("/api/results/:year", async (req, res) => {
  const { year } = req.params;
  try {
    const data = await hist(
      `results-${year}`,
      `${J}/${year}/results.json?limit=100`,
    );
    res.json(data);
  } catch {
    res.status(500).json({ error: "Results failed" });
  }
});

app.get("/api/results/:year/:round", async (req, res) => {
  const { year, round } = req.params;
  try {
    const data = await hist(
      `results-${year}-${round}`,
      `${J}/${year}/${round}/results.json`,
    );
    res.json(data);
  } catch {
    res.status(500).json({ error: "Results failed" });
  }
});

// ─── QUALIFYING ───────────────────────────────────────────────────────────────
app.get("/api/qualifying/:year", async (req, res) => {
  const { year } = req.params;
  try {
    const data = await hist(
      `qualifying-${year}`,
      `${J}/${year}/qualifying.json?limit=100`,
    );
    res.json(data);
  } catch {
    res.status(500).json({ error: "Qualifying failed" });
  }
});

app.get("/api/qualifying/:year/:round", async (req, res) => {
  const { year, round } = req.params;
  try {
    const data = await hist(
      `qualifying-${year}-${round}`,
      `${J}/${year}/${round}/qualifying.json`,
    );
    res.json(data);
  } catch {
    res.status(500).json({ error: "Qualifying failed" });
  }
});

// ─── SPRINT ───────────────────────────────────────────────────────────────────
app.get("/api/sprint/:year", async (req, res) => {
  const { year } = req.params;
  try {
    const data = await hist(
      `sprint-${year}`,
      `${J}/${year}/sprint.json?limit=100`,
    );
    res.json(data);
  } catch {
    res.status(500).json({ error: "Sprint failed" });
  }
});

app.get("/api/sprint/:year/:round", async (req, res) => {
  const { year, round } = req.params;
  try {
    const data = await hist(
      `sprint-${year}-${round}`,
      `${J}/${year}/${round}/sprint.json`,
    );
    res.json(data);
  } catch {
    res.status(500).json({ error: "Sprint failed" });
  }
});

// ─── PITSTOPS ─────────────────────────────────────────────────────────────────
app.get("/api/pitstops/:year/:round", async (req, res) => {
  const { year, round } = req.params;
  try {
    const data = await hist(
      `pitstops-${year}-${round}`,
      `${J}/${year}/${round}/pitstops.json?limit=100`,
    );
    res.json(data);
  } catch {
    res.status(500).json({ error: "Pitstops failed" });
  }
});

// ─── LAPS ─────────────────────────────────────────────────────────────────────
app.get("/api/laps/:year/:round", async (req, res) => {
  const { year, round } = req.params;
  try {
    const data = await hist(
      `laps-${year}-${round}`,
      `${J}/${year}/${round}/laps.json?limit=200`,
    );
    res.json(data);
  } catch {
    res.status(500).json({ error: "Laps failed" });
  }
});

// ─── DRIVERS ─────────────────────────────────────────────────────────────────
app.get("/api/drivers", async (req, res) => {
  try {
    const data = await hist(
      "drivers-current",
      `${J}/current/drivers.json?limit=100`,
    );
    res.json(data);
  } catch {
    res.status(500).json({ error: "Drivers failed" });
  }
});

app.get("/api/drivers/:year", async (req, res) => {
  const { year } = req.params;
  try {
    const data = await hist(
      `drivers-${year}`,
      `${J}/${year}/drivers.json?limit=100`,
    );
    res.json(data);
  } catch {
    res.status(500).json({ error: "Drivers failed" });
  }
});

app.get("/api/search/drivers", async (req, res) => {
  const { q } = req.query;
  if (!q) return res.json([]);
  const searchTerm = q.toLowerCase().trim();

  try {
    if (!fullDriverList && !isFetchingDrivers) {
      isFetchingDrivers = true;
      console.log("[SEARCH] Initializing master driver list fetch...");
      try {
        const data = await hist(
          "master-drivers",
          `${J}/drivers.json?limit=1000`,
        );
        fullDriverList = data.MRData.DriverTable.Drivers;
        console.log(
          `[SEARCH] Master list ready: ${fullDriverList.length} drivers cached.`,
        );
      } catch (e) {
        console.error("[SEARCH] Master fetch failed:", e.message);
      } finally {
        isFetchingDrivers = false;
      }
    }

    // Wait if fetching is in progress
    let attempts = 0;
    while (isFetchingDrivers && attempts < 20) {
      await new Promise((r) => setTimeout(r, 500));
      attempts++;
    }

    if (fullDriverList) {
      const results = fullDriverList
        .filter(
          (d) =>
            d.givenName.toLowerCase().includes(searchTerm) ||
            d.familyName.toLowerCase().includes(searchTerm) ||
            d.driverId.toLowerCase().includes(searchTerm),
        )
        .slice(0, 10);

      console.log(`[SEARCH] Fuzzy query: "${q}" | Hits: ${results.length}`);
      if (results.length > 0) return res.json(results);
    }

    // Fallback: Direct ID lookup
    console.log(`[SEARCH] Fallback: Direct ID lookup for "${searchTerm}"`);
    const direct = await hist(
      `driver-direct-${searchTerm}`,
      `${J}/drivers/${searchTerm}.json`,
    );
    if (direct.MRData.DriverTable.Drivers) {
      return res.json(direct.MRData.DriverTable.Drivers);
    }

    res.json([]);
  } catch (e) {
    console.error("[SEARCH] Pipeline error:", e.message);
    res.json([]);
  }
});

app.get("/api/driver/:id", async (req, res) => {
  const { id } = req.params;
  console.log(`[API] Fetching driver: ${id}`);
  try {
    const data = await hist(`driver-${id}`, `${J}/drivers/${id}.json`);
    res.json(data);
  } catch (e) {
    console.error(`[API] Driver ${id} failed:`, e.message);
    res.status(500).json({ error: "Driver failed" });
  }
});

app.get("/api/driver/:id/standings", async (req, res) => {
  const { id } = req.params;
  const season = req.query.season || "2026";
  console.log(`[API] Fetching ${season} standings for: ${id}`);
  try {
    const data = await hist(
      `driver-standings-${id}-${season}`,
      `${J}/${season}/drivers/${id}/driverStandings.json`,
    );
    res.json(data);
  } catch (e) {
    console.warn(`[API] Standings for ${id} ${season} unavailable:`, e.message);
    res.json({
      MRData: { StandingsTable: { driverId: id, StandingsLists: [] } },
    });
  }
});

app.get("/api/driver/:id/career", async (req, res) => {
  const { id } = req.params;
  const season = req.query.season || "2026";
  try {
    const [wins, p2, p3, poles, all, currentResults, currentQuali] =
      await Promise.all([
        hist(`career-wins-${id}`, `${J}/drivers/${id}/results/1.json?limit=1`),
        hist(`career-p2-${id}`, `${J}/drivers/${id}/results/2.json?limit=1`),
        hist(`career-p3-${id}`, `${J}/drivers/${id}/results/3.json?limit=1`),
        hist(
          `career-poles-${id}`,
          `${J}/drivers/${id}/grid/1/results.json?limit=1`,
        ),
        hist(`career-starts-${id}`, `${J}/drivers/${id}/results.json?limit=1`),
        hist(
          `current-results-${id}-${season}`,
          `${J}/${season}/drivers/${id}/results.json`,
        ),
        hist(
          `current-quali-${id}-${season}`,
          `${J}/${season}/drivers/${id}/qualifying.json`,
        ),
      ]);

    const totalWins = parseInt(wins.MRData.total);
    const totalPodiums =
      totalWins + parseInt(p2.MRData.total) + parseInt(p3.MRData.total);
    const totalPoles = parseInt(poles.MRData.total);
    const totalStarts = parseInt(all.MRData.total);

    // Map 2026 performance data
    const races = currentResults.MRData.RaceTable.Races.map((race) => {
      const q = currentQuali.MRData.RaceTable.Races.find(
        (qr) => qr.round === race.round,
      );
      return {
        round: race.round,
        code: race.Circuit.circuitId.substring(0, 3).toUpperCase(),
        racePos: parseInt(race.Results[0].position),
        qualiPos: q ? parseInt(q.QualifyingResults[0].position) : null,
      };
    });

    const currentPodiums = races.filter((r) => r.racePos <= 3).length;

    res.json({
      totalWins,
      totalPodiums,
      totalPoles,
      totalStarts,
      currentPodiums,
      performance: races,
    });
  } catch (e) {
    console.error(`Career stats failed for ${id}:`, e.message);
    res.status(500).json({ error: "Career stats failed" });
  }
});

app.get("/api/driver/:id/results/all", async (req, res) => {
  const { id } = req.params;
  try {
    const data = await hist(
      `results-all-${id}`,
      `${J}/drivers/${id}/results.json?limit=1000`,
    );
    res.json(data);
  } catch (e) {
    console.error(`[API] Results All failed for ${id}:`, e.message);
    res.status(500).json({ error: "Failed" });
  }
});

app.get("/api/driver/:id/standings/all", async (req, res) => {
  const { id } = req.params;
  try {
    const data = await hist(
      `standings-all-${id}`,
      `${J}/drivers/${id}/driverStandings.json?limit=100`,
    );
    res.json(data);
  } catch (e) {
    console.error(`[API] Standings All failed for ${id}:`, e.message);
    res.status(500).json({ error: "Failed to fetch full standings" });
  }
});

app.get("/api/driver/:id/qualifying/all", async (req, res) => {
  const { id } = req.params;
  try {
    const data = await hist(
      `quali-all-${id}`,
      `${J}/drivers/${id}/qualifying.json?limit=1000`,
    );
    res.json(data);
  } catch (e) {
    console.error(`[API] Quali All failed for ${id}:`, e.message);
    res.status(500).json({ error: "Failed" });
  }
});

// ─── CONSTRUCTORS ─────────────────────────────────────────────────────────────
app.get("/api/constructors", async (req, res) => {
  try {
    const data = await live(
      "constructors",
      `${J}/2026/constructorstandings.json`,
    );
    res.json(data);
  } catch {
    res.status(500).json({ error: "Constructors failed" });
  }
});

app.get("/api/constructors/:year", async (req, res) => {
  const { year } = req.params;
  try {
    const data = await hist(
      `constructors-${year}`,
      `${J}/${year}/constructors.json?limit=100`,
    );
    res.json(data);
  } catch {
    res.status(500).json({ error: "Constructors failed" });
  }
});

// ─── STANDINGS ────────────────────────────────────────────────────────────────
// Driver standings (current season)
app.get("/api/standings", async (req, res) => {
  try {
    const [standingsRes, resultsRes, qualiRes] = await Promise.all([
      live("standings", `${J}/2026/driverstandings.json`),
      live("season-results-2026", `${J}/2026/results.json?limit=1000`),
      live("season-quali-2026", `${J}/2026/qualifying.json?limit=1000`),
    ]);

    const standings =
      standingsRes.MRData.StandingsTable.StandingsLists[0].DriverStandings;
    const races = resultsRes.MRData.RaceTable.Races;
    const qualis = qualiRes.MRData.RaceTable.Races;

    // Inject calculated podiums, wins, and poles into the standings object
    const enhancedStandings = standings.map((ds) => {
      const driverId = ds.Driver.driverId;

      return {
        ...ds,
        calculatedPodiums: races.filter((r) =>
          r.Results.some(
            (res) =>
              res.Driver.driverId === driverId && parseInt(res.position) <= 3,
          ),
        ).length,
        calculatedWins: races.filter((r) =>
          r.Results.some(
            (res) =>
              res.Driver.driverId === driverId && parseInt(res.position) === 1,
          ),
        ).length,
        calculatedPoles: qualis.filter((r) =>
          r.QualifyingResults.some(
            (res) =>
              res.Driver.driverId === driverId && parseInt(res.position) === 1,
          ),
        ).length,
      };
    });

    standingsRes.MRData.StandingsTable.StandingsLists[0].DriverStandings =
      enhancedStandings;
    res.json(standingsRes);
  } catch (e) {
    console.error("Standings upgrade failed:", e.message);
    res.status(500).json({ error: "Standings failed" });
  }
});

// Driver standings for a specific year
app.get("/api/standings/drivers/:year", async (req, res) => {
  const { year } = req.params;
  try {
    const data = await hist(
      `driverstandings-${year}`,
      `${J}/${year}/driverstandings.json`,
    );
    res.json(data);
  } catch {
    res.status(500).json({ error: "Driver standings failed" });
  }
});

// Constructor standings for a specific year
app.get("/api/standings/constructors/:year", async (req, res) => {
  const { year } = req.params;
  try {
    const data = await hist(
      `constructorstandings-${year}`,
      `${J}/${year}/constructorstandings.json`,
    );
    res.json(data);
  } catch {
    res.status(500).json({ error: "Constructor standings failed" });
  }
});

// Championship winner for a year (top of driverstandings)
app.get("/api/champion/:year", async (req, res) => {
  const { year } = req.params;
  try {
    const data = await hist(
      `champion-${year}`,
      `${J}/${year}/driverstandings/1.json`,
    );
    const list = data.MRData.StandingsTable.StandingsLists[0];
    const w = list?.DriverStandings?.[0];
    if (!w) return res.status(404).json({ error: "No champion data" });
    res.json({
      year,
      driver: `${w.Driver.givenName} ${w.Driver.familyName}`,
      driverId: w.Driver.driverId,
      team: w.Constructors[0]?.name || "—",
      points: w.points,
      wins: w.wins,
    });
  } catch (e) {
    console.error(`Champion ${year}:`, e.message);
    res.status(500).json({ error: "Champion data failed" });
  }
});

// Calendar (current season)
app.get("/api/calendar", async (req, res) => {
  const season = req.query.season || "2026";
  try {
    const data = await hist(`calendar-${season}`, `${J}/${season}/races.json`);
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch calendar" });
  }
});

// Status definitions
app.get("/api/statuses", async (req, res) => {
  try {
    const data = await live("statuses", `${J}/status.json?limit=500`);
    res.json(data);
  } catch {
    res.status(500).json({ error: "Statuses failed" });
  }
});

// ─── AI SUMMARY ───────────────────────────────────────────────────────────────
app.post("/api/ai-summary", async (req, res) => {
  try {
    const { prompt } = req.body;
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content:
              "You are a Senior F1 Technical Analyst. Strictly provide the response in the format requested by the user. If they ask for plain text, provide ONLY plain text. If they ask for JSON, provide ONLY JSON.",
          },
          { role: "user", content: prompt },
        ],
        max_tokens: 4000,
        temperature: 0.7,
      },
      { headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` } },
    );
    res.json({ content: response.data.choices[0].message.content });
  } catch (e) {
    console.error("AI Summary Error:", e.response?.data || e.message);
    res.status(500).json({ error: "AI summary generation failed" });
  }
});

// ─── NEWS ─────────────────────────────────────────────────────────────────────
app.get("/api/news", async (req, res) => {
  try {
    if (liveCache.has("news-everything")) {
      return res.json(liveCache.get("news-everything"));
    }

    // Fetch real-world F1 news and we'll map it to the 2026 simulation in the frontend
    const response = await axios.get(
      `https://newsapi.org/v2/everything?q=Formula+1+FIA+F1&sortBy=publishedAt&language=en&apiKey=${process.env.NEWS_API_KEY}`,
      { timeout: 8000 },
    );

    liveCache.set("news-everything", response.data.articles, 3600); // 1 hour cache
    res.json(response.data.articles);
  } catch (e) {
    console.error("News API Error:", e.response?.data || e.message);
    res.status(500).json({ error: "News fetch failed" });
  }
});

// ─── WIKI ─────────────────────────────────────────────────────────────────────
app.get("/api/wiki/:name", async (req, res) => {
  try {
    const { name } = req.params;
    const response = await axios.get(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(name)}`,
      {
        timeout: 4000,
        headers: { "User-Agent": "ApexF1App/1.0 (dev@apexf1.app)" },
      },
    );
    res.json(response.data);
  } catch (e) {
    if (e.response?.status === 404) {
      return res.json(null);
    }
    console.error("Wiki Error:", e.response?.data || e.message);
    res.json(null); // Return null instead of 500 to keep frontend happy
  }
});

// ─── RAPIDAPI LIVE ────────────────────────────────────────────────────────────
const RA = "https://f1-live-pulse.p.rapidapi.com";
const raHeaders = {
  headers: {
    "x-rapidapi-key": process.env.RAPIDAPI_KEY,
    "x-rapidapi-host": process.env.RAPIDAPI_HOST,
  },
};

app.get("/api/live/drivers", async (req, res) => {
  try {
    const data = await live("live-drivers", `${RA}/driverList`, raHeaders);
    res.json(data);
  } catch {
    res.status(500).json({ error: "Live drivers failed" });
  }
});

app.get("/api/live/timing", async (req, res) => {
  try {
    const data = await live("live-timing", `${RA}/timing`, raHeaders);
    res.json(data);
  } catch {
    res.status(500).json({ error: "Live timing failed" });
  }
});

app.get("/api/live/session", async (req, res) => {
  try {
    const data = await live("live-session", `${RA}/sessionInfo`, raHeaders);
    res.json(data);
  } catch {
    res.status(500).json({ error: "Live session failed" });
  }
});

// ─── TELEMETRY PROXY ──────────────────────────────────────────────────────────
// Proxies requests to the Python FastAPI telemetry service.
// Set PYTHON_TELEMETRY_URL on Render to your deployed Python service URL.
const PYTHON_TELEMETRY_URL = process.env.PYTHON_TELEMETRY_URL || null;

app.get("/api/telemetry/:year/:round", async (req, res) => {
  if (!PYTHON_TELEMETRY_URL) {
    return res.status(503).json({
      error: "Telemetry service not configured",
      message: "Set PYTHON_TELEMETRY_URL on your Render Node backend to your Python telemetry service URL.",
    });
  }
  const { year, round } = req.params;
  try {
    const response = await axios.get(
      `${PYTHON_TELEMETRY_URL}/api/telemetry/${year}/${round}`,
      { timeout: 120000 } // 2 min timeout for heavy telemetry processing
    );
    res.json(response.data);
  } catch (e) {
    console.error(`[TELEMETRY] Proxy failed for ${year}/${round}:`, e.message);
    res.status(502).json({ error: "Telemetry service unavailable", detail: e.message });
  }
});

// ─── HEALTH ───────────────────────────────────────────────────────────────────
app.get("/", (req, res) => res.send("🚀 Apex F1 Backend Online"));


const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log("-----------------------------------------");
  console.log(`🚀 APEX F1 BACKEND IS LIVE ON PORT ${PORT}`);
  console.log("-----------------------------------------");
  console.log("Routes: seasons | circuits | races | results |");
  console.log("        qualifying | sprint | pitstops | laps |");
  console.log("        drivers | constructors | standings | champion");
  console.log("-----------------------------------------");
});
