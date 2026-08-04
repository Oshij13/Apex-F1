// Mock F1 data — realistic 2026 season snapshot for the APEX F1 platform.

export const countryToFlag = (name: string): string => {
  const n = name.toLowerCase();
  if (n.includes("bahrain") || n.includes("sakhir")) return "🇧🇭";
  if (n.includes("saudi")) return "🇸🇦";
  if (
    n.includes("australia") ||
    n.includes("melbourne") ||
    n.includes("australian")
  )
    return "🇦🇺";
  if (n.includes("japan") || n.includes("japanese")) return "🇯🇵";
  if (n.includes("china") || n.includes("chinese")) return "🇨🇳";
  if (
    n.includes("miami") ||
    n.includes("usa") ||
    n.includes("united states") ||
    n.includes("vegas") ||
    n.includes("austin") ||
    n.includes("american")
  )
    return "🇺🇸";
  if (
    n.includes("italy") ||
    n.includes("imola") ||
    n.includes("monza") ||
    n.includes("emilia") ||
    n.includes("italian") ||
    n.includes("tuscan")
  )
    return "🇮🇹";
  if (n.includes("monaco") || n.includes("monegasque")) return "🇲🇨";
  if (
    n.includes("spain") ||
    n.includes("barcelona") ||
    n.includes("catalunya") ||
    n.includes("spanish")
  )
    return "🇪🇸";
  if (n.includes("canada") || n.includes("montreal") || n.includes("canadian"))
    return "🇨🇦";
  if (
    n.includes("austria") ||
    n.includes("spielberg") ||
    n.includes("austrian") ||
    n.includes("styrian")
  )
    return "🇦🇹";
  if (
    n.includes("britain") ||
    n.includes("uk") ||
    n.includes("united kingdom") ||
    n.includes("silverstone") ||
    n.includes("british") ||
    n.includes("70th")
  )
    return "🇬🇧";
  if (
    n.includes("hungary") ||
    n.includes("budapest") ||
    n.includes("hungarian")
  )
    return "🇭🇺";
  if (n.includes("belgium") || n.includes("spa") || n.includes("belgian"))
    return "🇧🇪";
  if (
    n.includes("netherlands") ||
    n.includes("zandvoort") ||
    n.includes("dutch")
  )
    return "🇳🇱";
  if (
    n.includes("azerbaijan") ||
    n.includes("baku") ||
    n.includes("azerbaijani")
  )
    return "🇦🇿";
  if (n.includes("singapore") || n.includes("singaporean")) return "🇸🇬";
  if (n.includes("mexico") || n.includes("mexican")) return "🇲🇽";
  if (
    n.includes("brazil") ||
    n.includes("são paulo") ||
    n.includes("interlagos") ||
    n.includes("brazilian")
  )
    return "🇧🇷";
  if (n.includes("qatar")) return "🇶🇦";
  if (n.includes("abu dhabi") || n.includes("uae") || n.includes("emirates"))
    return "🇦🇪";
  if (n.includes("malaysia") || n.includes("malaysian")) return "🇲🇾";
  if (n.includes("russia") || n.includes("russian")) return "🇷🇺";
  if (n.includes("france") || n.includes("french")) return "🇫🇷";
  if (n.includes("portugal") || n.includes("portuguese")) return "🇵🇹";
  if (n.includes("turkey") || n.includes("turkish")) return "🇹🇷";
  if (n.includes("germany") || n.includes("german") || n.includes("eifel"))
    return "🇩🇪";
  if (n.includes("india") || n.includes("indian")) return "🇮🇳";
  if (n.includes("korea") || n.includes("korean")) return "🇰🇷";
  if (n.includes("argentina") || n.includes("argentine")) return "🇦🇷";
  if (n.includes("south africa")) return "🇿🇦";
  if (n.includes("switzerland") || n.includes("swiss")) return "🇨🇭";
  return "🏁";
};

export const countryToIso = (name: string): string => {
  const n = name.toLowerCase();
  if (n.includes("bahrain") || n.includes("sakhir")) return "bh";
  if (n.includes("saudi")) return "sa";
  if (
    n.includes("australia") ||
    n.includes("melbourne") ||
    n.includes("australian")
  )
    return "au";
  if (n.includes("japan") || n.includes("japanese")) return "jp";
  if (n.includes("china") || n.includes("chinese")) return "cn";
  if (
    n.includes("miami") ||
    n.includes("usa") ||
    n.includes("united states") ||
    n.includes("vegas") ||
    n.includes("austin") ||
    n.includes("american")
  )
    return "us";
  if (
    n.includes("italy") ||
    n.includes("imola") ||
    n.includes("monza") ||
    n.includes("emilia") ||
    n.includes("italian") ||
    n.includes("tuscan")
  )
    return "it";
  if (n.includes("monaco") || n.includes("monegasque")) return "mc";
  if (
    n.includes("spain") ||
    n.includes("barcelona") ||
    n.includes("catalunya") ||
    n.includes("spanish")
  )
    return "es";
  if (n.includes("canada") || n.includes("montreal") || n.includes("canadian"))
    return "ca";
  if (
    n.includes("austria") ||
    n.includes("spielberg") ||
    n.includes("austrian") ||
    n.includes("styrian")
  )
    return "at";
  if (
    n.includes("britain") ||
    n.includes("uk") ||
    n.includes("united kingdom") ||
    n.includes("silverstone") ||
    n.includes("british") ||
    n.includes("70th")
  )
    return "gb";
  if (
    n.includes("hungary") ||
    n.includes("budapest") ||
    n.includes("hungarian")
  )
    return "hu";
  if (n.includes("belgium") || n.includes("spa") || n.includes("belgian"))
    return "be";
  if (
    n.includes("netherlands") ||
    n.includes("zandvoort") ||
    n.includes("dutch")
  )
    return "nl";
  if (
    n.includes("azerbaijan") ||
    n.includes("baku") ||
    n.includes("azerbaijani")
  )
    return "az";
  if (n.includes("singapore") || n.includes("singaporean")) return "sg";
  if (n.includes("mexico") || n.includes("mexican")) return "mx";
  if (
    n.includes("brazil") ||
    n.includes("são paulo") ||
    n.includes("interlagos") ||
    n.includes("brazilian")
  )
    return "br";
  if (n.includes("qatar")) return "qa";
  if (n.includes("abu dhabi") || n.includes("uae") || n.includes("emirates"))
    return "ae";
  if (n.includes("malaysia")) return "my";
  if (n.includes("russia")) return "ru";
  if (n.includes("france")) return "fr";
  if (n.includes("portugal")) return "pt";
  if (n.includes("turkey")) return "tr";
  if (n.includes("germany")) return "de";
  if (n.includes("india")) return "in";
  if (n.includes("korea")) return "kr";
  if (n.includes("argentina")) return "ar";
  if (n.includes("south africa")) return "za";
  if (n.includes("switzerland")) return "ch";
  return "";
};

export type Team =
  | "McLaren"
  | "Ferrari"
  | "Red Bull"
  | "Mercedes"
  | "Aston Martin"
  | "Alpine"
  | "Williams"
  | "RB"
  | "Haas"
  | "Sauber"
  | "Audi"
  | "Cadillac";

export const teamColor: Record<Team, string> = {
  McLaren: "var(--team-mclaren)",
  Ferrari: "var(--team-ferrari)",
  "Red Bull": "var(--team-redbull)",
  Mercedes: "var(--team-mercedes)",
  "Aston Martin": "var(--team-aston)",
  Alpine: "var(--team-alpine)",
  Williams: "var(--team-williams)",
  RB: "var(--team-rb)",
  Haas: "var(--team-haas)",
  Sauber: "var(--team-sauber)",
  Audi: "var(--team-audi)",
  Cadillac: "var(--team-cadillac)",
};

export const getTeamColor = (name: string | null | undefined): string => {
  if (!name) return "var(--muted)";
  const n = name.toLowerCase();
  const exactMatch = Object.keys(teamColor).find(
    (t) => t.toLowerCase() === n,
  ) as Team;
  if (exactMatch) return teamColor[exactMatch];
  const partialMatch = Object.keys(teamColor).find((t) =>
    n.includes(t.toLowerCase()),
  ) as Team;
  if (partialMatch) return teamColor[partialMatch];
  return "var(--muted)";
};

export interface Driver {
  id: string;
  number: number;
  code: string;
  name: string;
  firstName: string;
  lastName: string;
  team: Team;
  country: string;
  flag: string;
  points: number;
  wins: number;
  podiums: number;
  poles: number;
}

export const drivers: Driver[] = [
  {
    id: "norris",
    number: 1,
    code: "NOR",
    name: "Lando Norris",
    firstName: "Lando",
    lastName: "Norris",
    team: "McLaren",
    country: "GBR",
    flag: "🇬🇧",
    points: 408,
    wins: 7,
    podiums: 14,
    poles: 6,
  },
  {
    id: "piastri",
    number: 81,
    code: "PIA",
    name: "Oscar Piastri",
    firstName: "Oscar",
    lastName: "Piastri",
    team: "McLaren",
    country: "AUS",
    flag: "🇦🇺",
    points: 384,
    wins: 6,
    podiums: 13,
    poles: 4,
  },
  {
    id: "verstappen",
    number: 3,
    code: "VER",
    name: "Max Verstappen",
    firstName: "Max",
    lastName: "Verstappen",
    team: "Red Bull",
    country: "NED",
    flag: "🇳🇱",
    points: 366,
    wins: 5,
    podiums: 11,
    poles: 3,
  },
  {
    id: "leclerc",
    number: 16,
    code: "LEC",
    name: "Charles Leclerc",
    firstName: "Charles",
    lastName: "Leclerc",
    team: "Ferrari",
    country: "MON",
    flag: "🇲🇨",
    points: 298,
    wins: 2,
    podiums: 9,
    poles: 4,
  },
  {
    id: "russell",
    number: 63,
    code: "RUS",
    name: "George Russell",
    firstName: "George",
    lastName: "Russell",
    team: "Mercedes",
    country: "GBR",
    flag: "🇬🇧",
    points: 254,
    wins: 1,
    podiums: 8,
    poles: 2,
  },
  {
    id: "hamilton",
    number: 44,
    code: "HAM",
    name: "Lewis Hamilton",
    firstName: "Lewis",
    lastName: "Hamilton",
    team: "Ferrari",
    country: "GBR",
    flag: "🇬🇧",
    points: 218,
    wins: 1,
    podiums: 5,
    poles: 1,
  },
  {
    id: "sainz",
    number: 55,
    code: "SAI",
    name: "Carlos Sainz",
    firstName: "Carlos",
    lastName: "Sainz",
    team: "Williams",
    country: "ESP",
    flag: "🇪🇸",
    points: 142,
    wins: 0,
    podiums: 2,
    poles: 0,
  },
  {
    id: "antonelli",
    number: 12,
    code: "ANT",
    name: "Kimi Antonelli",
    firstName: "Kimi",
    lastName: "Antonelli",
    team: "Mercedes",
    country: "ITA",
    flag: "🇮🇹",
    points: 138,
    wins: 0,
    podiums: 3,
    poles: 1,
  },
  {
    id: "alonso",
    number: 14,
    code: "ALO",
    name: "Fernando Alonso",
    firstName: "Fernando",
    lastName: "Alonso",
    team: "Aston Martin",
    country: "ESP",
    flag: "🇪🇸",
    points: 76,
    wins: 0,
    podiums: 1,
    poles: 0,
  },
  {
    id: "stroll",
    number: 18,
    code: "STR",
    name: "Lance Stroll",
    firstName: "Lance",
    lastName: "Stroll",
    team: "Aston Martin",
    country: "CAN",
    flag: "🇨🇦",
    points: 42,
    wins: 0,
    podiums: 0,
    poles: 0,
  },
  {
    id: "hadjar",
    number: 6,
    code: "HAD",
    name: "Isack Hadjar",
    firstName: "Isack",
    lastName: "Hadjar",
    team: "Red Bull",
    country: "FRA",
    flag: "🇫🇷",
    points: 38,
    wins: 0,
    podiums: 0,
    poles: 0,
  },
  {
    id: "albon",
    number: 23,
    code: "ALB",
    name: "Alex Albon",
    firstName: "Alex",
    lastName: "Albon",
    team: "Williams",
    country: "THA",
    flag: "🇹🇭",
    points: 34,
    wins: 0,
    podiums: 0,
    poles: 0,
  },
  {
    id: "hulkenberg",
    number: 27,
    code: "HUL",
    name: "Nico Hülkenberg",
    firstName: "Nico",
    lastName: "Hülkenberg",
    team: "Audi",
    country: "GER",
    flag: "🇩🇪",
    points: 28,
    wins: 0,
    podiums: 1,
    poles: 0,
  },
  {
    id: "ocon",
    number: 31,
    code: "OCO",
    name: "Esteban Ocon",
    firstName: "Esteban",
    lastName: "Ocon",
    team: "Haas",
    country: "FRA",
    flag: "🇫🇷",
    points: 24,
    wins: 0,
    podiums: 0,
    poles: 0,
  },
  {
    id: "gasly",
    number: 10,
    code: "GAS",
    name: "Pierre Gasly",
    firstName: "Pierre",
    lastName: "Gasly",
    team: "Alpine",
    country: "FRA",
    flag: "🇫🇷",
    points: 18,
    wins: 0,
    podiums: 0,
    poles: 0,
  },
  {
    id: "colapinto",
    number: 43,
    code: "COL",
    name: "Franco Colapinto",
    firstName: "Franco",
    lastName: "Colapinto",
    team: "Alpine",
    country: "ARG",
    flag: "🇦🇷",
    points: 14,
    wins: 0,
    podiums: 0,
    poles: 0,
  },
  {
    id: "lawson",
    number: 30,
    code: "LAW",
    name: "Liam Lawson",
    firstName: "Liam",
    lastName: "Lawson",
    team: "RB",
    country: "NZL",
    flag: "🇳🇿",
    points: 12,
    wins: 0,
    podiums: 0,
    poles: 0,
  },
  {
    id: "bortoleto",
    number: 5,
    code: "BOR",
    name: "Gabriel Bortoleto",
    firstName: "Gabriel",
    lastName: "Bortoleto",
    team: "Audi",
    country: "BRA",
    flag: "🇧🇷",
    points: 8,
    wins: 0,
    podiums: 0,
    poles: 0,
  },
  {
    id: "bearman",
    number: 87,
    code: "BEA",
    name: "Oliver Bearman",
    firstName: "Oliver",
    lastName: "Bearman",
    team: "Haas",
    country: "GBR",
    flag: "🇬🇧",
    points: 6,
    wins: 0,
    podiums: 0,
    poles: 0,
  },
  {
    id: "lindblad",
    number: 41,
    code: "LIN",
    name: "Arvid Lindblad",
    firstName: "Arvid",
    lastName: "Lindblad",
    team: "RB",
    country: "GBR",
    flag: "🇬🇧",
    points: 2,
    wins: 0,
    podiums: 0,
    poles: 0,
  },
  {
    id: "bottas",
    number: 77,
    code: "BOT",
    name: "Valtteri Bottas",
    firstName: "Valtteri",
    lastName: "Bottas",
    team: "Cadillac",
    country: "FIN",
    flag: "🇫🇮",
    points: 0,
    wins: 0,
    podiums: 0,
    poles: 0,
  },
  {
    id: "perez",
    number: 11,
    code: "PER",
    name: "Sergio Perez",
    firstName: "Sergio",
    lastName: "Perez",
    team: "Cadillac",
    country: "MEX",
    flag: "🇲🇽",
    points: 0,
    wins: 0,
    podiums: 0,
    poles: 0,
  },
];

export const constructors = [
  {
    id: "mclaren",
    name: "McLaren",
    points: 792,
    wins: 13,
    color: "var(--team-mclaren)",
  },
  {
    id: "ferrari",
    name: "Ferrari",
    points: 516,
    wins: 3,
    color: "var(--team-ferrari)",
  },
  {
    id: "redbull",
    name: "Red Bull",
    points: 404,
    wins: 5,
    color: "var(--team-redbull)",
  },
  {
    id: "mercedes",
    name: "Mercedes",
    points: 392,
    wins: 1,
    color: "var(--team-mercedes)",
  },
  {
    id: "williams",
    name: "Williams",
    points: 176,
    wins: 0,
    color: "var(--team-williams)",
  },
  {
    id: "aston",
    name: "Aston Martin",
    points: 118,
    wins: 0,
    color: "var(--team-aston)",
  },
  { id: "rb", name: "RB", points: 26, wins: 0, color: "var(--team-rb)" },
  { id: "haas", name: "Haas", points: 30, wins: 0, color: "var(--team-haas)" },
  {
    id: "sauber",
    name: "Sauber",
    points: 36,
    wins: 0,
    color: "var(--team-sauber)",
  },
  {
    id: "alpine",
    name: "Alpine",
    points: 20,
    wins: 0,
    color: "var(--team-alpine)",
  },
];

export interface Race {
  round: number;
  id: string;
  name: string;
  circuit: string;
  country: string;
  flag: string;
  date: string;
  status: "done" | "next" | "upcoming" | "live";
  winner?: string;
  winnerTeam?: Team;
  fastestLap?: string;
}

export const races: Race[] = [
  {
    round: 1,
    id: "australia",
    name: "Australian GP",
    circuit: "Albert Park",
    country: "Melbourne",
    flag: "🇦🇺",
    date: "2026-03-16",
    status: "done",
    winner: "George Russell",
    winnerTeam: "Mercedes",
    fastestLap: "1:21.443",
  },
  {
    round: 2,
    id: "china",
    name: "Chinese GP",
    circuit: "Shanghai International",
    country: "Shanghai",
    flag: "🇨🇳",
    date: "2026-04-06",
    status: "done",
    winner: "Andrea Kimi Antonelli",
    winnerTeam: "Mercedes",
    fastestLap: "1:34.220",
  },
  {
    round: 3,
    id: "japan",
    name: "Japanese GP",
    circuit: "Suzuka",
    country: "Suzuka",
    flag: "🇯🇵",
    date: "2026-04-20",
    status: "done",
    winner: "Andrea Kimi Antonelli",
    winnerTeam: "Mercedes",
    fastestLap: "1:30.965",
  },
  {
    round: 4,
    id: "miami",
    name: "Miami GP",
    circuit: "Miami International",
    country: "Miami",
    flag: "🇺🇸",
    date: "2026-05-04",
    status: "upcoming",
  },
  {
    round: 5,
    id: "imola",
    name: "Emilia-Romagna GP",
    circuit: "Imola",
    country: "Imola",
    flag: "🇮🇹",
    date: "2026-05-18",
    status: "done",
    winner: "Lando Norris",
    winnerTeam: "McLaren",
    fastestLap: "1:18.023",
  },
  {
    round: 6,
    id: "monaco",
    name: "Monaco GP",
    circuit: "Circuit de Monaco",
    country: "Monte Carlo",
    flag: "🇲🇨",
    date: "2026-05-25",
    status: "done",
    winner: "Charles Leclerc",
    winnerTeam: "Ferrari",
    fastestLap: "1:14.612",
  },
  {
    round: 7,
    id: "canada",
    name: "Canadian GP",
    circuit: "Gilles Villeneuve",
    country: "Montreal",
    flag: "🇨🇦",
    date: "2026-06-15",
    status: "done",
    winner: "George Russell",
    winnerTeam: "Mercedes",
    fastestLap: "1:14.856",
  },
  {
    round: 8,
    id: "spain",
    name: "Spanish GP",
    circuit: "Catalunya",
    country: "Barcelona",
    flag: "🇪🇸",
    date: "2026-06-29",
    status: "done",
    winner: "Oscar Piastri",
    winnerTeam: "McLaren",
    fastestLap: "1:17.221",
  },
  {
    round: 9,
    id: "austria",
    name: "Austrian GP",
    circuit: "Red Bull Ring",
    country: "Spielberg",
    flag: "🇦🇹",
    date: "2026-07-06",
    status: "done",
    winner: "Lando Norris",
    winnerTeam: "McLaren",
    fastestLap: "1:06.789",
  },
  {
    round: 10,
    id: "britain",
    name: "British GP",
    circuit: "Silverstone",
    country: "Silverstone",
    flag: "🇬🇧",
    date: "2026-07-20",
    status: "live",
    winner: "—",
    winnerTeam: "McLaren",
    fastestLap: "—",
  },
  {
    round: 11,
    id: "hungary",
    name: "Hungarian GP",
    circuit: "Hungaroring",
    country: "Budapest",
    flag: "🇭🇺",
    date: "2026-08-03",
    status: "next",
  },
  {
    round: 14,
    id: "belgium",
    name: "Belgian GP",
    circuit: "Spa-Francorchamps",
    country: "Spa",
    flag: "🇧🇪",
    date: "2026-08-31",
    status: "upcoming",
  },
  {
    round: 15,
    id: "netherlands",
    name: "Dutch GP",
    circuit: "Zandvoort",
    country: "Zandvoort",
    flag: "🇳🇱",
    date: "2026-09-07",
    status: "upcoming",
  },
  {
    round: 16,
    id: "italy",
    name: "Italian GP",
    circuit: "Monza",
    country: "Monza",
    flag: "🇮🇹",
    date: "2026-09-21",
    status: "upcoming",
  },
  {
    round: 17,
    id: "azerbaijan",
    name: "Azerbaijan GP",
    circuit: "Baku City",
    country: "Baku",
    flag: "🇦🇿",
    date: "2026-09-28",
    status: "upcoming",
  },
  {
    round: 18,
    id: "singapore",
    name: "Singapore GP",
    circuit: "Marina Bay",
    country: "Singapore",
    flag: "🇸🇬",
    date: "2026-10-05",
    status: "upcoming",
  },
  {
    round: 19,
    id: "usa",
    name: "United States GP",
    circuit: "COTA",
    country: "Austin",
    flag: "🇺🇸",
    date: "2026-10-19",
    status: "upcoming",
  },
  {
    round: 20,
    id: "mexico",
    name: "Mexico City GP",
    circuit: "Hermanos Rodríguez",
    country: "Mexico City",
    flag: "🇲🇽",
    date: "2026-10-26",
    status: "upcoming",
  },
  {
    round: 21,
    id: "brazil",
    name: "São Paulo GP",
    circuit: "Interlagos",
    country: "São Paulo",
    flag: "🇧🇷",
    date: "2026-11-09",
    status: "upcoming",
  },
  {
    round: 22,
    id: "vegas",
    name: "Las Vegas GP",
    circuit: "Las Vegas Strip",
    country: "Las Vegas",
    flag: "🇺🇸",
    date: "2026-11-22",
    status: "upcoming",
  },
  {
    round: 22,
    id: "abudhabi",
    name: "Abu Dhabi GP",
    circuit: "Yas Marina",
    country: "Abu Dhabi",
    flag: "🇦🇪",
    date: "2026-12-07",
    status: "upcoming",
  },
];

export const nextRace = races.find((r) => r.status === "next")!;
export const liveRace = races.find((r) => r.status === "live")!;

export type Tire = "S" | "M" | "H" | "I" | "W" | "P";
export const tireColor: Record<Tire, string> = {
  S: "#E8002D", // soft — red
  M: "#FFC72C", // medium — yellow
  H: "#F0F0F0", // hard — white
  I: "#43B02A", // inter — green
  W: "#005AFF", // wet — blue
  P: "#2563EB", // pitting — blue
};

export interface LiveDriver {
  pos: number;
  prevPos: number;
  driver: Driver;
  gap: string;
  interval: string;
  lastLap: string;
  bestLap: string;
  s1: number;
  s2: number;
  s3: number;
  s1Best?: boolean;
  s2Best?: boolean;
  s3Best?: boolean;
  tire: Tire;
  tireAge: number;
  pits: number;
  status: "running" | "pit" | "out";
  drs: boolean;
}

const drv = (id: string) => drivers.find((d) => d.id === id)!;

export const liveLeaderboard: LiveDriver[] = [
  {
    pos: 1,
    prevPos: 1,
    driver: drv("norris"),
    gap: "Leader",
    interval: "—",
    lastLap: "1:28.412",
    bestLap: "1:27.991",
    s1: 27.221,
    s2: 33.105,
    s3: 28.086,
    s2Best: true,
    tire: "M",
    tireAge: 14,
    pits: 1,
    status: "running",
    drs: false,
  },
  {
    pos: 2,
    prevPos: 3,
    driver: drv("piastri"),
    gap: "+1.8s",
    interval: "+1.8s",
    lastLap: "1:28.503",
    bestLap: "1:28.044",
    s1: 27.198,
    s2: 33.214,
    s3: 28.091,
    s1Best: true,
    tire: "M",
    tireAge: 13,
    pits: 1,
    status: "running",
    drs: true,
  },
  {
    pos: 3,
    prevPos: 2,
    driver: drv("verstappen"),
    gap: "+3.2s",
    interval: "+1.4s",
    lastLap: "1:28.621",
    bestLap: "1:28.103",
    s1: 27.301,
    s2: 33.298,
    s3: 28.022,
    s3Best: true,
    tire: "H",
    tireAge: 22,
    pits: 1,
    status: "running",
    drs: false,
  },
  {
    pos: 4,
    prevPos: 4,
    driver: drv("leclerc"),
    gap: "+8.4s",
    interval: "+5.2s",
    lastLap: "1:28.844",
    bestLap: "1:28.231",
    s1: 27.401,
    s2: 33.341,
    s3: 28.102,
    tire: "M",
    tireAge: 12,
    pits: 1,
    status: "running",
    drs: false,
  },
  {
    pos: 5,
    prevPos: 5,
    driver: drv("hamilton"),
    gap: "+12.1s",
    interval: "+3.7s",
    lastLap: "1:28.901",
    bestLap: "1:28.402",
    s1: 27.451,
    s2: 33.398,
    s3: 28.052,
    tire: "M",
    tireAge: 12,
    pits: 1,
    status: "running",
    drs: false,
  },
  {
    pos: 6,
    prevPos: 6,
    driver: drv("russell"),
    gap: "+18.5s",
    interval: "+6.4s",
    lastLap: "1:29.022",
    bestLap: "1:28.512",
    s1: 27.521,
    s2: 33.502,
    s3: 27.999,
    tire: "H",
    tireAge: 24,
    pits: 1,
    status: "running",
    drs: false,
  },
  {
    pos: 7,
    prevPos: 9,
    driver: drv("antonelli"),
    gap: "+24.2s",
    interval: "+5.7s",
    lastLap: "1:29.105",
    bestLap: "1:28.692",
    s1: 27.601,
    s2: 33.512,
    s3: 27.992,
    tire: "S",
    tireAge: 4,
    pits: 2,
    status: "running",
    drs: true,
  },
  {
    pos: 8,
    prevPos: 7,
    driver: drv("sainz"),
    gap: "+28.9s",
    interval: "+4.7s",
    lastLap: "1:29.221",
    bestLap: "1:28.812",
    s1: 27.621,
    s2: 33.602,
    s3: 27.998,
    tire: "M",
    tireAge: 11,
    pits: 1,
    status: "running",
    drs: false,
  },
  {
    pos: 9,
    prevPos: 8,
    driver: drv("alonso"),
    gap: "+34.1s",
    interval: "+5.2s",
    lastLap: "1:29.341",
    bestLap: "1:28.998",
    s1: 27.681,
    s2: 33.621,
    s3: 28.039,
    tire: "M",
    tireAge: 13,
    pits: 1,
    status: "running",
    drs: false,
  },
  {
    pos: 10,
    prevPos: 10,
    driver: drv("albon"),
    gap: "+38.7s",
    interval: "+4.6s",
    lastLap: "1:29.442",
    bestLap: "1:29.012",
    s1: 27.701,
    s2: 33.711,
    s3: 28.03,
    tire: "H",
    tireAge: 26,
    pits: 1,
    status: "running",
    drs: false,
  },
  {
    pos: 11,
    prevPos: 11,
    driver: drv("tsunoda"),
    gap: "+42.3s",
    interval: "+3.6s",
    lastLap: "1:29.521",
    bestLap: "1:29.221",
    s1: 27.751,
    s2: 33.741,
    s3: 28.029,
    tire: "M",
    tireAge: 11,
    pits: 1,
    status: "pit",
    drs: false,
  },
  {
    pos: 12,
    prevPos: 12,
    driver: drv("hulkenberg"),
    gap: "+46.8s",
    interval: "+4.5s",
    lastLap: "1:29.612",
    bestLap: "1:29.302",
    s1: 27.811,
    s2: 33.792,
    s3: 28.009,
    tire: "H",
    tireAge: 25,
    pits: 1,
    status: "running",
    drs: false,
  },
  {
    pos: 13,
    prevPos: 14,
    driver: drv("hadjar"),
    gap: "+51.2s",
    interval: "+4.4s",
    lastLap: "1:29.702",
    bestLap: "1:29.412",
    s1: 27.842,
    s2: 33.821,
    s3: 28.039,
    tire: "S",
    tireAge: 5,
    pits: 2,
    status: "running",
    drs: false,
  },
  {
    pos: 14,
    prevPos: 13,
    driver: drv("ocon"),
    gap: "+55.9s",
    interval: "+4.7s",
    lastLap: "1:29.812",
    bestLap: "1:29.502",
    s1: 27.901,
    s2: 33.871,
    s3: 28.04,
    tire: "M",
    tireAge: 14,
    pits: 1,
    status: "running",
    drs: false,
  },
  {
    pos: 15,
    prevPos: 15,
    driver: drv("stroll"),
    gap: "+1L",
    interval: "+1L",
    lastLap: "1:29.991",
    bestLap: "1:29.612",
    s1: 27.951,
    s2: 33.921,
    s3: 28.119,
    tire: "M",
    tireAge: 13,
    pits: 1,
    status: "running",
    drs: false,
  },
  {
    pos: 16,
    prevPos: 16,
    driver: drv("lawson"),
    gap: "+1L",
    interval: "+0.8s",
    lastLap: "1:30.121",
    bestLap: "1:29.812",
    s1: 27.991,
    s2: 33.992,
    s3: 28.138,
    tire: "H",
    tireAge: 27,
    pits: 1,
    status: "running",
    drs: false,
  },
  {
    pos: 17,
    prevPos: 17,
    driver: drv("gasly"),
    gap: "+1L",
    interval: "+1.2s",
    lastLap: "1:30.221",
    bestLap: "1:29.912",
    s1: 28.021,
    s2: 34.012,
    s3: 28.188,
    tire: "M",
    tireAge: 12,
    pits: 1,
    status: "running",
    drs: false,
  },
  {
    pos: 18,
    prevPos: 18,
    driver: drv("bortoleto"),
    gap: "+1L",
    interval: "+1.6s",
    lastLap: "1:30.401",
    bestLap: "1:30.102",
    s1: 28.082,
    s2: 34.062,
    s3: 28.257,
    tire: "H",
    tireAge: 28,
    pits: 1,
    status: "running",
    drs: false,
  },
  {
    pos: 19,
    prevPos: 19,
    driver: drv("bearman"),
    gap: "+1L",
    interval: "+2.1s",
    lastLap: "1:30.612",
    bestLap: "1:30.221",
    s1: 28.121,
    s2: 34.112,
    s3: 28.379,
    tire: "M",
    tireAge: 14,
    pits: 1,
    status: "running",
    drs: false,
  },
  {
    pos: 20,
    prevPos: 20,
    driver: drv("doohan"),
    gap: "DNF",
    interval: "—",
    lastLap: "—",
    bestLap: "1:30.812",
    s1: 0,
    s2: 0,
    s3: 0,
    tire: "M",
    tireAge: 8,
    pits: 1,
    status: "out",
    drs: false,
  },
];

export interface PitStop {
  lap: number;
  driver: string;
  team: Team;
  duration: string;
  tireFrom: Tire;
  tireTo: Tire;
}

export const recentPits: PitStop[] = [
  {
    lap: 38,
    driver: "Tsunoda",
    team: "Red Bull",
    duration: "2.31s",
    tireFrom: "M",
    tireTo: "S",
  },
  {
    lap: 36,
    driver: "Antonelli",
    team: "Mercedes",
    duration: "2.18s",
    tireFrom: "M",
    tireTo: "S",
  },
  {
    lap: 34,
    driver: "Hadjar",
    team: "RB",
    duration: "2.44s",
    tireFrom: "M",
    tireTo: "S",
  },
  {
    lap: 28,
    driver: "Verstappen",
    team: "Red Bull",
    duration: "2.09s",
    tireFrom: "M",
    tireTo: "H",
  },
  {
    lap: 27,
    driver: "Russell",
    team: "Mercedes",
    duration: "2.42s",
    tireFrom: "M",
    tireTo: "H",
  },
  {
    lap: 25,
    driver: "Norris",
    team: "McLaren",
    duration: "2.21s",
    tireFrom: "S",
    tireTo: "M",
  },
];

export const raceState = {
  name: "British Grand Prix",
  circuit: "Silverstone Circuit",
  flag: "🇬🇧",
  lap: 42,
  totalLaps: 52,
  weather: "Cloudy",
  airTemp: 21,
  trackTemp: 32,
  windSpeed: 14,
  fastestLap: { driver: "Norris", time: "1:27.991", lap: 32 },
  safetyCar: false,
  yellow: false,
};

export const aiInsights = {
  live: "Norris is managing a 1.8s gap to Piastri but his rear-left medium is now 14 laps old — degradation models predict he'll lose 0.4s/lap from lap 45. McLaren may be forced into a defensive pit window. Verstappen on hards has the strategic advantage to undercut if either pits late.",
  britain:
    "A McLaren masterclass at Silverstone. Norris controlled the race from pole, but the real story was Piastri's recovery from P5 after a slow first stop — fastest middle stint of any driver. Verstappen extracted everything from a Red Bull that simply lacked McLaren's cornering speed in sectors 2 and 3.",
  hamilton:
    "Hamilton's first season at Ferrari has been a study in adaptation. After 12 years with Mercedes' philosophy, his qualifying deficit to Leclerc (avg +0.184s) reflects the brake-by-wire transition. However, his race-craft remains elite — he's gained an average of 2.4 positions per race from his grid slot, the highest in the field.",
};

export const championships = [
  { year: 2024, driver: "Max Verstappen", team: "Red Bull" },
  { year: 2023, driver: "Max Verstappen", team: "Red Bull" },
  { year: 2022, driver: "Max Verstappen", team: "Red Bull" },
  { year: 2021, driver: "Max Verstappen", team: "Red Bull" },
  { year: 2020, driver: "Lewis Hamilton", team: "Mercedes" },
  { year: 2019, driver: "Lewis Hamilton", team: "Mercedes" },
  { year: 2018, driver: "Lewis Hamilton", team: "Mercedes" },
  { year: 2017, driver: "Lewis Hamilton", team: "Mercedes" },
  { year: 2016, driver: "Nico Rosberg", team: "Mercedes" },
  { year: 2015, driver: "Lewis Hamilton", team: "Mercedes" },
];

// Driver season performance (qualifying & race)
export const driverSeasonChart = [
  { round: "BHR", qual: 1, race: 1 },
  { round: "SAU", qual: 3, race: 4 },
  { round: "AUS", qual: 1, race: 2 },
  { round: "JPN", qual: 1, race: 1 },
  { round: "CHN", qual: 2, race: 2 },
  { round: "MIA", qual: 4, race: 3 },
  { round: "IMO", qual: 1, race: 1 },
  { round: "MON", qual: 3, race: 4 },
  { round: "CAN", qual: 2, race: 5 },
  { round: "ESP", qual: 1, race: 2 },
  { round: "AUT", qual: 1, race: 1 },
];
export const circuitSvgMap: Record<string, string> = {
  albert_park: "melbourne-2.svg",
  bahrain: "bahrain-1.svg",
  baku: "baku-1.svg",
  catalunya: "catalunya-6.svg",
  hungaroring: "hungaroring-3.svg",
  interlagos: "interlagos-2.svg",
  jeddah: "jeddah-1.svg",
  las_vegas: "las-vegas-1.svg",
  lusail: "lusail-1.svg",
  marina_bay: "marina-bay-4.svg",
  rodriguez: "mexico-city-3.svg",
  miami: "miami-1.svg",
  monaco: "monaco-6.svg",
  villeneuve: "montreal-6.svg",
  monza: "monza-7.svg",
  shanghai: "shanghai-1.svg",
  silverstone: "silverstone-8.svg",
  spa: "spa-francorchamps-4.svg",
  red_bull_ring: "spielberg-3.svg",
  suzuka: "suzuka-2.svg",
  yas_marina: "yas-marina-2.svg",
  zandvoort: "zandvoort-5.svg",
  austin: "austin-1.svg",
  americas: "austin-1.svg",
  mexico: "mexico-city-3.svg",
  brazil: "interlagos-2.svg",
  abu_dhabi: "yas-marina-2.svg",
  vegas: "las-vegas-1.svg",
};
