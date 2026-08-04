import { Team } from "./f1-data";

export interface PrincipalDetail {
  id: string;
  teamId: string;
  name: string;
  role: string;
  team: Team | string;
  nationality: string;
  dateOfBirth: string;
  yearsActive: number;
  championships: number;
  raceWins: number;
  managementStyle: string;
  background: string;
}

export const principalDetails: Record<string, PrincipalDetail> = {
  red_bull: {
    id: "red_bull",
    teamId: "red_bull",
    name: "Jonathan Wheatley",
    role: "Team Principal",
    team: "Red Bull",
    nationality: "British",
    dateOfBirth: "1967-05-07",
    yearsActive: 2,
    championships: 0,
    raceWins: 0,
    managementStyle: "Strategic & Operational Excellence. Wheatley is deeply rooted in the sporting regulations and operational mechanics of the sport, bringing an aggressive, zero-compromise approach to trackside operations.",
    background: "Previously Red Bull's Sporting Director, Wheatley stepped up to Team Principal following internal restructuring, leveraging his unmatched understanding of pit lane dynamics and race strategy."
  },
  mercedes: {
    id: "mercedes",
    teamId: "mercedes",
    name: "Toto Wolff",
    role: "CEO & Team Principal",
    team: "Mercedes",
    nationality: "Austrian",
    dateOfBirth: "1972-01-12",
    yearsActive: 14,
    championships: 8,
    raceWins: 115,
    managementStyle: "No-Blame Culture & Corporate Precision. Wolff runs Mercedes like a high-end technology firm, focusing heavily on mental health, psychological safety, and intense accountability without pointing fingers.",
    background: "A former racing driver and investor, Wolff bought into Williams before moving to Mercedes in 2013, orchestrating the most dominant era by a single team in Formula 1 history."
  },
  ferrari: {
    id: "ferrari",
    teamId: "ferrari",
    name: "Frédéric Vasseur",
    role: "General Manager",
    team: "Ferrari",
    nationality: "French",
    dateOfBirth: "1968-05-28",
    yearsActive: 9,
    championships: 0,
    raceWins: 8,
    managementStyle: "Pragmatic & Anti-Political. Vasseur cuts through the traditional emotional volatility of Maranello, implementing a calm, decisive, and distinctly racing-focused culture over corporate bureaucracy.",
    background: "Founder of the highly successful ART Grand Prix junior team, Vasseur previously led Renault and Alfa Romeo (Sauber) before taking the helm at Ferrari to rebuild their title credentials."
  },
  mclaren: {
    id: "mclaren",
    teamId: "mclaren",
    name: "Andrea Stella",
    role: "Team Principal",
    team: "McLaren",
    nationality: "Italian",
    dateOfBirth: "1971-02-22",
    yearsActive: 4,
    championships: 0,
    raceWins: 10,
    managementStyle: "Engineering-Led & Highly Analytical. Stella approaches leadership through the lens of a performance engineer, prioritizing aerodynamic truth, absolute data transparency, and steady, iterative progress.",
    background: "A former race engineer for Michael Schumacher, Kimi Räikkönen, and Fernando Alonso at Ferrari, Stella joined McLaren in 2015 and engineered their rapid rise back to the front of the grid."
  },
  aston_martin: {
    id: "aston_martin",
    teamId: "aston_martin",
    name: "Mike Krack",
    role: "Team Principal",
    team: "Aston Martin",
    nationality: "Luxembourgish",
    dateOfBirth: "1972-03-18",
    yearsActive: 5,
    championships: 0,
    raceWins: 0,
    managementStyle: "Quiet & Collaborative. Krack acts as a steady hand amidst hyper-expansion, focusing on harmonizing the aggressive growth mandated by ownership with the practical realities of trackside execution.",
    background: "Having worked for Sauber in the early 2000s, Krack spent years leading BMW's global motorsport operations before returning to F1 to manage Aston Martin's transformation into a works team."
  },
  williams: {
    id: "williams",
    teamId: "williams",
    name: "James Vowles",
    role: "Team Principal",
    team: "Williams",
    nationality: "British",
    dateOfBirth: "1979-06-20",
    yearsActive: 4,
    championships: 0,
    raceWins: 0,
    managementStyle: "Modernizer & Systems Thinker. Vowles is ruthlessly honest about infrastructure deficits, prioritizing long-term capital expenditure, software modernization, and cultural realignment over short-term upgrades.",
    background: "The strategic mastermind behind Mercedes' turbo-hybrid dominance, Vowles left his role as Motorsport Strategy Director to lead the historic Williams team back from the brink of obscurity."
  },
  alpine: {
    id: "alpine",
    teamId: "alpine",
    name: "Oliver Oakes",
    role: "Team Principal",
    team: "Alpine",
    nationality: "British",
    dateOfBirth: "1988-01-11",
    yearsActive: 2,
    championships: 0,
    raceWins: 0,
    managementStyle: "Aggressive & Youthful. Oakes brings a fresh, uncompromising 'racer first' mentality to the corporate structure of Alpine, stripping away excess management layers to focus purely on chassis performance.",
    background: "A former karting world champion and Red Bull junior driver, Oakes founded Hitech Grand Prix, turning it into a junior formula powerhouse before being recruited to stabilize Alpine."
  },
  haas: {
    id: "haas",
    teamId: "haas",
    name: "Ayao Komatsu",
    role: "Team Principal",
    team: "Haas",
    nationality: "Japanese",
    dateOfBirth: "1976-01-28",
    yearsActive: 3,
    championships: 0,
    raceWins: 0,
    managementStyle: "Ultra-Lean & Optimization-Focused. Komatsu maximizes limited resources through extreme engineering efficiency, prioritizing race-day execution, tire management, and honest engineering debriefs.",
    background: "Having been with Haas since their inception in 2016 as Chief Race Engineer, Komatsu replaced Guenther Steiner to bring a strictly technical and performance-oriented focus to the American outfit."
  },
  racing_bulls: {
    id: "racing_bulls",
    teamId: "racing_bulls",
    name: "Laurent Mekies",
    role: "Team Principal",
    team: "RB",
    nationality: "French",
    dateOfBirth: "1977-04-28",
    yearsActive: 3,
    championships: 0,
    raceWins: 0,
    managementStyle: "Agile & Synergistic. Mekies blends Italian passion with clinical Red Bull efficiency, heavily focusing on exploiting the technical synergies with the senior team while maintaining an independent fighting spirit.",
    background: "A former FIA Safety Director and Ferrari Sporting Director, Mekies returned to the Faenza-based squad (where he worked during the Toro Rosso days) to lead their rebranding and competitive step-up."
  },
  audi: {
    id: "audi",
    teamId: "audi",
    name: "Mattia Binotto",
    role: "COO & CTO",
    team: "Audi",
    nationality: "Swiss-Italian",
    dateOfBirth: "1969-11-03",
    yearsActive: 6,
    championships: 0,
    raceWins: 7,
    managementStyle: "Technocratic & Protective. Binotto operates primarily as an overarching technical director, shielding his engineers from pressure and focusing on deep, long-term power unit and chassis integration.",
    background: "The former Team Principal of Ferrari, Binotto's deep expertise in engine development made him the ideal candidate to spearhead Audi's massive factory entry into Formula 1 for the 2026 regulations."
  },
  cadillac: {
    id: "cadillac",
    teamId: "cadillac",
    name: "Michael Andretti",
    role: "Team Principal",
    team: "Cadillac",
    nationality: "American",
    dateOfBirth: "1962-10-05",
    yearsActive: 1,
    championships: 0,
    raceWins: 0,
    managementStyle: "Bold & American Racing Heritage. Andretti brings a fiery, competitive American racing spirit to the grid, operating with a chip on the shoulder to prove that his INDYCAR empire can translate to global dominance.",
    background: "An American racing legend and one of the most successful team owners in US motorsport, Andretti fought a brutal political battle to bring General Motors and the Andretti name into Formula 1."
  },
  horner: {
    id: "horner",
    teamId: "horner",
    name: "Christian Horner",
    role: "Team Principal",
    team: "Red Bull",
    nationality: "British",
    dateOfBirth: "1973-11-16",
    yearsActive: 19,
    championships: 7,
    raceWins: 113,
    managementStyle: "Assertive & Politically Astute. Horner is a master of Formula 1's political landscape, fostering an uncompromising winning culture centered around exceptional talent and rapid development.",
    background: "A former racing driver who founded Arden International, Horner became the youngest Team Principal in F1 history when he took the helm of Red Bull Racing in 2005."
  },
  steiner: {
    id: "steiner",
    teamId: "steiner",
    name: "Guenther Steiner",
    role: "Team Principal",
    team: "Haas",
    nationality: "Italian-American",
    dateOfBirth: "1965-04-07",
    yearsActive: 10,
    championships: 0,
    raceWins: 0,
    managementStyle: "Direct & Unfiltered. Steiner led Haas with a famously passionate, no-nonsense approach, prioritizing survival and cost efficiency using the unique Ferrari customer model.",
    background: "Having worked in rallying and with Jaguar/Red Bull F1, Steiner was instrumental in building the Haas F1 Team from scratch."
  },
  todt: {
    id: "todt",
    teamId: "todt",
    name: "Jean Todt",
    role: "General Manager",
    team: "Ferrari",
    nationality: "French",
    dateOfBirth: "1946-02-25",
    yearsActive: 14,
    championships: 14,
    raceWins: 106,
    managementStyle: "Relentless & Methodical. Todt brought unprecedented discipline and structural reorganization to Ferrari, shielding the team from Italian media pressure to build a 'dream team'.",
    background: "After massive success in rallying and sports cars with Peugeot, Todt was hired to revive Ferrari and orchestrated the Michael Schumacher era of absolute dominance before becoming FIA President."
  },
  dennis: {
    id: "dennis",
    teamId: "dennis",
    name: "Ron Dennis",
    role: "Team Principal",
    team: "McLaren",
    nationality: "British",
    dateOfBirth: "1947-06-01",
    yearsActive: 28,
    championships: 17,
    raceWins: 158,
    managementStyle: "Obsessive Perfectionism. Dennis famously enforced absolute clinical cleanliness and extreme attention to detail, creating the modern corporate standards of Formula 1.",
    background: "Starting as a mechanic, Dennis merged his Project Four Racing team with McLaren in 1980, turning the squad into one of the most successful sporting organizations in history."
  },
  williams_f: {
    id: "williams_f",
    teamId: "williams_f",
    name: "Frank Williams",
    role: "Team Principal",
    team: "Williams",
    nationality: "British",
    dateOfBirth: "1942-04-16",
    yearsActive: 43,
    championships: 16,
    raceWins: 114,
    managementStyle: "Pure Racer. Sir Frank led his team with an unwavering passion for engineering over driver politics, famously viewing the car itself as the ultimate star.",
    background: "A true garagiste, Frank Williams founded his eponymous team with Patrick Head, overcoming a life-changing accident to become the longest-serving Team Principal in F1."
  },
  brawn: {
    id: "brawn",
    teamId: "brawn",
    name: "Ross Brawn",
    role: "Team Principal",
    team: "Brawn GP / Mercedes",
    nationality: "British",
    dateOfBirth: "1954-11-23",
    yearsActive: 5,
    championships: 2,
    raceWins: 17,
    managementStyle: "Technical Mastery & Calm Logic. The definitive 'super-brain' of F1, Brawn solved complex sporting and technical puzzles with a deeply analytical and composed demeanor.",
    background: "The technical mastermind behind Schumacher's titles at Benetton and Ferrari, Brawn bought Honda's team to win the 2009 title as Brawn GP, before laying the foundation for Mercedes."
  },
  briatore: {
    id: "briatore",
    teamId: "briatore",
    name: "Flavio Briatore",
    role: "Managing Director",
    team: "Benetton / Renault",
    nationality: "Italian",
    dateOfBirth: "1950-04-12",
    yearsActive: 19,
    championships: 7,
    raceWins: 43,
    managementStyle: "Commercial & Instinctive. Briatore approached F1 not as an engineer but as a businessman, excelling at talent spotting, aggressive marketing, and managing eccentric personalities.",
    background: "Brought into Benetton as a commercial director, Briatore discovered Michael Schumacher and Fernando Alonso, winning titles with both before leaving the sport under a cloud of controversy."
  },
  chapman: {
    id: "chapman",
    teamId: "chapman",
    name: "Colin Chapman",
    role: "Founder / Principal",
    team: "Lotus",
    nationality: "British",
    dateOfBirth: "1928-05-19",
    yearsActive: 24,
    championships: 13,
    raceWins: 74,
    managementStyle: "Radical Innovation. Chapman's ethos was 'simplify, then add lightness'. He prioritized revolutionary engineering concepts, constantly pushing the boundaries of what an F1 car could be.",
    background: "An aerospace engineer by training, Chapman introduced monocoque chassis, ground effect aerodynamics, and commercial sponsorship to Formula 1."
  },
  jordan: {
    id: "jordan",
    teamId: "jordan",
    name: "Eddie Jordan",
    role: "Founder / Principal",
    team: "Jordan",
    nationality: "Irish",
    dateOfBirth: "1948-03-30",
    yearsActive: 14,
    championships: 0,
    raceWins: 4,
    managementStyle: "Charismatic & Opportunistic. EJ ran his team with a rock-and-roll attitude, combining shrewd financial acumen with an incredible eye for rookie driving talent.",
    background: "A former bank clerk and racing driver, Jordan built a formidable independent team that gave Michael Schumacher his F1 debut and scored giant-killing victories."
  },
  sauber_p: {
    id: "sauber_p",
    teamId: "sauber_p",
    name: "Peter Sauber",
    role: "Founder / Principal",
    team: "Sauber",
    nationality: "Swiss",
    dateOfBirth: "1943-10-13",
    yearsActive: 23,
    championships: 0,
    raceWins: 1,
    managementStyle: "Quiet & Methodical. Sauber operated with distinct Swiss precision, focusing on long-term stability, excellent engineering facilities, and discovering generational talent.",
    background: "Transitioning from sports car racing with Mercedes, Peter Sauber brought his eponymous team into F1 in 1993, building a legacy of steady independence."
  }
};

export const historicalPrincipals = [
  "horner", "steiner", "todt", "dennis", "williams_f", "brawn", "briatore", "chapman", "jordan", "sauber_p"
].map(id => principalDetails[id]);
