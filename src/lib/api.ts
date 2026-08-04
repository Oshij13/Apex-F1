import axios from "axios";
import { Driver, Race, Team, LiveDriver } from "./f1-data";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const api = axios.create({
  baseURL: API_BASE,
});

const nationalityToFlag = (nat: string) => {
  const flags: Record<string, string> = {
    Italian: "🇮🇹",
    British: "🇬🇧",
    Monegasque: "🇲🇨",
    Dutch: "🇳🇱",
    Spanish: "🇪🇸",
    Mexican: "🇲🇽",
    Australian: "🇦🇺",
    French: "🇫🇷",
    German: "🇩🇪",
    Canadian: "🇨🇦",
    Japanese: "🇯🇵",
    Thai: "🇹🇭",
    Danish: "🇩🇰",
    American: "🇺🇸",
    Finnish: "🇫🇮",
    Chinese: "🇨🇳",
    Brazilian: "🇧🇷",
    "New Zealander": "🇳🇿",
    "Spanish/French": "🇪🇸",
    Swiss: "🇨🇭",
    Austrian: "🇦🇹",
    "Thai/British": "🇹🇭",
  };
  return flags[nat] || "🏁";
};

// --- Jolpica (Historical) ---

export const getStandings = async () => {
  const { data } = await api.get("/standings");
  return data.MRData.StandingsTable.StandingsLists[0].DriverStandings.map(
    (ds: any) => ({
      id: ds.Driver.driverId,
      number: parseInt(ds.Driver.permanentNumber),
      code: ds.Driver.code,
      name: `${ds.Driver.givenName} ${ds.Driver.familyName}`,
      firstName: ds.Driver.givenName,
      lastName: ds.Driver.familyName,
      team: ds.Constructors[0].name as Team,
      country: ds.Driver.nationality,
      nationality: ds.Driver.nationality,
      flag: nationalityToFlag(ds.Driver.nationality),
      points: parseInt(ds.points),
      wins: ds.calculatedWins ?? parseInt(ds.wins),
      podiums: ds.calculatedPodiums ?? 0,
      poles: ds.calculatedPoles ?? 0,
    }),
  );
};

export const getCalendar = async () => {
  const { data } = await api.get("/calendar");
  return data.MRData.RaceTable.Races.map((r: any) => {
    // Resolve TBA names using location
    const baseName =
      r.raceName === "TBA" || !r.raceName
        ? `${r.Circuit.Location.country} Grand Prix`
        : r.raceName;

    return {
      round: parseInt(r.round),
      id: `${r.season}-${r.round}`,
      name: baseName,
      circuit: r.Circuit.circuitName,
      country: r.Circuit.Location.country,
      Circuit: r.Circuit, // Keep full circuit object for specs/layout
      flag: "🏁",
      date: r.date,
      time: r.time,
      season: r.season,
      status: r.date < new Date().toISOString() ? "done" : "upcoming",
      sessions: {
        fp1: r.FirstPractice?.date
          ? `${r.FirstPractice.date}T${r.FirstPractice.time}`
          : null,
        fp2: r.SecondPractice?.date
          ? `${r.SecondPractice.date}T${r.SecondPractice.time}`
          : null,
        fp3: r.ThirdPractice?.date
          ? `${r.ThirdPractice.date}T${r.ThirdPractice.time}`
          : null,
        qualifying: r.Qualifying?.date
          ? `${r.Qualifying.date}T${r.Qualifying.time}`
          : null,
        sprintQualifying: r.SprintQualifying?.date
          ? `${r.SprintQualifying.date}T${r.SprintQualifying.time}`
          : null,
        sprint: r.Sprint?.date ? `${r.Sprint.date}T${r.Sprint.time}` : null,
        gp: r.date && r.time ? `${r.date}T${r.time}` : r.date,
      },
    };
  });
};

export const getSeasonResults = async (year: number) => {
  const { data } = await api.get(`/season/${year}`);
  return data.MRData.RaceTable.Races.map((r: any) => ({
    round: parseInt(r.round),
    id: `${year}-${r.round}`,
    name: r.raceName,
    circuit: r.Circuit.circuitName,
    country: r.Circuit?.Location?.country || "",
    flag: "🏁",
    date: r.date,
    status: r.date < new Date().toISOString() ? "done" : "upcoming",
    winner: r.winner || null,
    winnerTeam: r.winnerTeam || null,
  }));
};

export const getChampionshipWinner = async (year: number) => {
  try {
    const { data } = await api.get(`/champion/${year}`);
    return data;
  } catch (error) {
    console.error(`Champion fetch error for ${year}:`, error);
    return null;
  }
};

export const getDriverStandings = async () => {
  try {
    const { data } = await api.get("/standings/drivers/2026");
    return data.map((d: any) => ({
      id: d.Driver.driverId,
      name: d.Driver.familyName,
      fullName: `${d.Driver.givenName} ${d.Driver.familyName}`,
      firstName: d.Driver.givenName,
      lastName: d.Driver.familyName,
      points: parseInt(d.points),
      team: d.Constructors[0].name,
      teamId: d.Constructors[0].constructorId,
      position: parseInt(d.position),
      wins: parseInt(d.wins),
      nationality: d.Driver.nationality,
      code: d.Driver.code,
      number: d.Driver.permanentNumber,
      flag: nationalityToFlag(d.Driver.nationality),
    }));
  } catch (error) {
    console.error("Drivers API Error:", error);
    return [];
  }
};

export const getConstructorStandings = async () => {
  const { data } = await api.get("/constructors");
  return data.MRData.StandingsTable.StandingsLists[0].ConstructorStandings.map(
    (cs: any) => ({
      id: cs.Constructor.constructorId,
      name: cs.Constructor.name,
      points: parseInt(cs.points),
      wins: parseInt(cs.wins),
      color: `var(--team-${cs.Constructor.constructorId})`, // Fallback mapping
    }),
  );
};

// --- RapidAPI F1 Pulse (Live) ---

export const getLiveDrivers = async () => {
  const { data } = await api.get("/live/drivers");
  return data; // Raw data for now, components will handle it
};

export const getWeather = async () => {
  const { data } = await api.get("/live/weather");
  return data;
};

export const getLiveTiming = async () => {
  const { data } = await api.get("/live/timing");
  return data;
};

export const getLiveSessionInfo = async () => {
  const { data } = await api.get("/live/session");
  return data;
};

export const getDriverResultsAll = async (id: string) => {
  const { data } = await api.get(`/driver/${id}/results/all`);
  return data.MRData.RaceTable.Races;
};

export const getDriverStandingsAll = async (id: string) => {
  const { data } = await api.get(`/driver/${id}/standings/all`);
  return data.MRData.StandingsTable.StandingsLists;
};

export const getDriverQualiAll = async (id: string) => {
  const { data } = await api.get(`/driver/${id}/qualifying/all`);
  return data.MRData.RaceTable.Races;
};

export const searchHistoricalDrivers = async (q: string) => {
  const { data } = await api.get(`/search/drivers?q=${q}`);
  return data;
};

// --- News ---

export const getDriverDetails = async (driverId: string) => {
  const [bioRes, standingsRes, fullStandingsRes, careerRes] = await Promise.all(
    [
      api.get(`/driver/${driverId}`),
      api.get(`/driver/${driverId}/standings`),
      api.get("/standings"),
      api.get(`/driver/${driverId}/career`),
    ],
  );

  const bio = bioRes.data.MRData.DriverTable.Drivers[0];
  const standingsLists = standingsRes.data.MRData.StandingsTable.StandingsLists;
  const allDrivers =
    fullStandingsRes.data.MRData.StandingsTable.StandingsLists[0]
      .DriverStandings;
  const career = careerRes.data;

  const currentStanding =
    standingsLists.length > 0 ? standingsLists[0].DriverStandings[0] : null;
  const teamId = currentStanding?.Constructors[0]?.constructorId;

  // Find teammate
  const teammate = allDrivers.find(
    (ds: any) =>
      ds.Constructors[0].constructorId === teamId &&
      ds.Driver.driverId !== driverId,
  );

  // Aggregate stats
  let totalWins = 0;
  let totalPoints = 0;
  standingsLists.forEach((list: any) => {
    const s = list.DriverStandings[0];
    totalWins += parseInt(s.wins);
    totalPoints += parseFloat(s.points);
  });

  return {
    ...bio,
    id: bio.driverId,
    firstName: bio.givenName,
    lastName: bio.familyName,
    isActive: allDrivers.some((ds: any) => ds.Driver.driverId === driverId),
    totalWins: career.totalWins || totalWins,
    totalPoints,
    totalStarts: career.totalStarts || 0,
    totalPodiums: career.totalPodiums || 0,
    totalPoles: career.totalPoles || 0,
    currentPodiums: career.currentPodiums || 0,
    currentWins:
      career.performance?.filter((r: any) => r.racePos === 1).length || 0,
    currentPoles:
      career.performance?.filter((r: any) => r.qualiPos === 1).length || 0,
    performance: career.performance || [],
    currentStanding,
    teammate: teammate
      ? {
          id: teammate.Driver.driverId,
          code: teammate.Driver.code,
          name: teammate.Driver.familyName,
          points: parseInt(teammate.points),
          wins: (teammate as any).calculatedWins ?? parseInt(teammate.wins),
          podiums: (teammate as any).calculatedPodiums ?? 0,
          poles: (teammate as any).calculatedPoles ?? 0,
        }
      : null,
  };
};

export const getStatuses = async () => {
  const { data } = await api.get("/statuses");
  return data.MRData.StatusTable.Status;
};

export const getCircuits = async () => {
  const { data } = await api.get("/circuits");
  return data.MRData.CircuitTable.Circuits.map((c: any) => ({
    id: c.circuitId,
    name: c.circuitName,
    location: c.Location.locality,
    country: c.Location.country,
  }));
};

export const getNews = async () => {
  const { data } = await api.get("/news");
  return data;
};

// --- Wikipedia ---

export const getRaceResults = async (year: number, round: number) => {
  const { data } = await api.get(`/results/${year}/${round}`);
  const race = data.MRData.RaceTable.Races[0];
  if (!race) return null;
  return {
    ...race,
    results: race.Results.map((r: any) => ({
      pos: parseInt(r.position),
      driver: {
        id: r.Driver.driverId,
        code: r.Driver.code,
        firstName: r.Driver.givenName,
        lastName: r.Driver.familyName,
        nationality: r.Driver.nationality,
        team: r.Constructor.name,
        constructorId: r.Constructor.constructorId,
      },
      grid: parseInt(r.grid),
      laps: parseInt(r.laps),
      status: r.status,
      time: r.Time?.time || null,
      fastestLap: r.FastestLap || null,
      pts: parseInt(r.points),
    })),
  };
};

export const getQualifyingResults = async (year: number, round: number) => {
  const { data } = await api.get(`/qualifying/${year}/${round}`);
  const race = data.MRData.RaceTable.Races[0];
  if (!race) return null;
  return (
    race.QualifyingResults?.map((r: any) => ({
      pos: parseInt(r.position),
      driver: {
        id: r.Driver.driverId,
        code: r.Driver.code,
        lastName: r.Driver.familyName,
        team: r.Constructor.name,
      },
      q1: r.Q1 || null,
      q2: r.Q2 || null,
      q3: r.Q3 || null,
    })) || []
  );
};

export const getPitstops = async (year: number, round: number) => {
  const { data } = await api.get(`/pitstops/${year}/${round}`);
  const race = data.MRData.RaceTable.Races[0];
  if (!race) return [];
  return (
    race.PitStops?.map((p: any) => ({
      driverId: p.driverId,
      stop: parseInt(p.stop),
      lap: parseInt(p.lap),
      time: p.time,
      duration: p.duration,
    })) || []
  );
};

export const getSprintResults = async (year: number, round: number) => {
  try {
    const { data } = await api.get(`/sprint/${year}/${round}`);
    const race = data.MRData.RaceTable.Races[0];
    if (!race) return null;
    return (
      race.SprintResults?.map((r: any) => ({
        pos: parseInt(r.position),
        driver: {
          id: r.Driver.driverId,
          code: r.Driver.code,
          lastName: r.Driver.familyName,
          team: r.Constructor.name,
        },
        laps: parseInt(r.laps),
        time: r.Time?.time || r.status,
        pts: parseInt(r.points),
      })) || null
    );
  } catch {
    return null; // Sprint not available for all races
  }
};

import { STATIC_TRACK_SPECS } from "./static-track-specs";

export const getTrackSpecs = async (circuitName: string) => {
  // Check static mapping first for consistency
  const normalized = Object.keys(STATIC_TRACK_SPECS).find(
    (key) =>
      circuitName.toLowerCase().includes(key.toLowerCase()) ||
      key.toLowerCase().includes(circuitName.toLowerCase()),
  );

  if (normalized) {
    return STATIC_TRACK_SPECS[normalized];
  }

  const prompt = `Provide technical specifications for the ${circuitName} Formula 1 track. 
  Include: 
  - Circuit Length (km)
  - Number of Turns
  - Number of Sectors
  - Highest Elevation Point
  - Lap Record (Time, ALL Drivers who share this exact record time, and Years)
  Provide the output in a concise JSON format with keys: "length", "turns", "sectors", "elevation", "record". 
  The "record" field should be an object with keys: "time" (string), and "holders" (an array of objects with keys "driver" and "year").
  List ALL holders in ascending order of the year. If multiple drivers share the record, include EVERY ONE of them.
  Only return the JSON.`;

  const text = await getAISummary(prompt);
  try {
    const jsonStr = text.match(/\{[\s\S]*\}/)?.[0] || text;
    return JSON.parse(jsonStr);
  } catch (e) {
    return null;
  }
};

export const getCircuitDetails = async (circuitId: string) => {
  try {
    console.log(`Fetching circuit details for: ${circuitId}`);
    const { data } = await api.get(`/circuits/info/${circuitId}`);
    const circuit = data.MRData?.CircuitTable?.Circuits?.[0];
    if (!circuit) {
      console.warn(`No circuit found for ID: ${circuitId}`);
      return null;
    }

    // Extract Wiki title from URL if possible for better accuracy
    let wikiTitle = circuit.circuitName;
    if (circuit.url) {
      const parts = circuit.url.split("/wiki/");
      if (parts.length > 1) wikiTitle = parts[1];
    }

    const wiki = await getWikiSummary(wikiTitle).catch((err) => {
      console.error(`Wiki fetch failed for ${wikiTitle}:`, err);
      return null;
    });

    return { ...circuit, wiki };
  } catch (err) {
    console.error(`getCircuitDetails failed for ${circuitId}:`, err);
    return null;
  }
};

export const getWikiSummary = async (query: string) => {
  const { data } = await api.get(`/wiki/${query}`);
  return data;
};

export const getAISummary = async (prompt: string) => {
  const { data } = await api.post("/ai-summary", { prompt });
  return data.content;
};

export const getOnThisDayFact = async () => {
  const today = new Date();
  const dateStr = today.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });
  const prompt = `Tell me one interesting historical Formula 1 event that happened on ${dateStr}. 
  Provide the output in JSON format with three fields: 
  "date" (e.g. "${dateStr}, 1994"), 
  "event" (a short title), 
  "description" (a 2-3 sentence summary).
  Only return the JSON.`;

  const text = await getAISummary(prompt);
  try {
    // Basic JSON extraction in case AI adds markdown
    const jsonStr = text.match(/\{[\s\S]*\}/)?.[0] || text;
    return JSON.parse(jsonStr);
  } catch (e) {
    return {
      date: dateStr,
      event: "F1 History in the Making",
      description:
        "On this day, the world of Formula 1 continues its legacy of speed and innovation.",
    };
  }
};
