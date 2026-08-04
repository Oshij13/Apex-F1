import { Team } from "./f1-data";

export interface TeamDetail {
  id: string;
  name: string;
  fullTitle: string;
  base: string;
  chief: string;
  powerUnit: string;
  budget2026: string;
  established: string;
  allTime: {
    titles: number;
    driverTitles: number;
    wins: number;
    podiums: number;
    poles: number;
    fastestLaps: number;
    budgetScale: string;
    famousDrivers: { name: string; years: string }[];
    aiInsight: string;
  };
}

export const teamDetails: Record<string, TeamDetail> = {
  mclaren: {
    id: "mclaren",
    name: "McLaren",
    fullTitle: "McLaren Formula 1 Team",
    base: "Woking, United Kingdom",
    chief: "Andrea Stella",
    powerUnit: "Mercedes",
    budget2026: "$145M (Cost Cap Max)",
    established: "1963",
    allTime: {
      titles: 8,
      driverTitles: 12,
      wins: 188,
      podiums: 512,
      poles: 161,
      fastestLaps: 168,
      budgetScale: "Ultra-High / Tier 1",
      famousDrivers: [
        { name: "Ayrton Senna", years: "1988-1993" },
        { name: "Alain Prost", years: "1984-1989" },
        { name: "Lewis Hamilton", years: "2007-2012" },
        { name: "Mika Häkkinen", years: "1993-2001" },
      ],
      aiInsight:
        "McLaren is defined by its pursuit of engineering perfection and a 'scientific' approach to racing. From the dominant MP4/4 era to the current ground-effect renaissance, the team has consistently pioneered carbon fiber technology and advanced aerodynamics. Their philosophy centers on relentless iterative development and a highly integrated technical structure at the McLaren Technology Centre.",
    },
  },
  ferrari: {
    id: "ferrari",
    name: "Ferrari",
    fullTitle: "Scuderia Ferrari HP",
    base: "Maranello, Italy",
    chief: "Frédéric Vasseur",
    powerUnit: "Ferrari",
    budget2026: "$145M (Cost Cap Max)",
    established: "1929 (1950 F1)",
    allTime: {
      titles: 16,
      driverTitles: 15,
      wins: 245,
      podiums: 810,
      poles: 250,
      fastestLaps: 260,
      budgetScale: "Legendary / Infinite Heritage",
      famousDrivers: [
        { name: "Michael Schumacher", years: "1996-2006" },
        { name: "Niki Lauda", years: "1974-1977" },
        { name: "Gilles Villeneuve", years: "1977-1982" },
        { name: "Sebastian Vettel", years: "2015-2020" },
      ],
      aiInsight:
        "Scuderia Ferrari is the spiritual heart of Formula 1. Their technical philosophy is rooted in engine supremacy and the emotional 'passion' of Maranello. While often criticized for strategic volatility, their vertical integration—building both chassis and power unit under one roof—gives them a unique technical purity. The team represents the pinnacle of racing heritage, blending artisanal craftsmanship with state-of-the-art simulation.",
    },
  },
  red_bull: {
    id: "red_bull",
    name: "Red Bull",
    fullTitle: "Oracle Red Bull Racing",
    base: "Milton Keynes, United Kingdom",
    chief: "Jonathan Wheatley",
    powerUnit: "Red Bull Ford",
    budget2026: "$145M (Cost Cap Max)",
    established: "2005",
    allTime: {
      titles: 6,
      driverTitles: 7,
      wins: 120,
      podiums: 270,
      poles: 100,
      fastestLaps: 98,
      budgetScale: "High Efficiency / Tier 1",
      famousDrivers: [
        { name: "Sebastian Vettel", years: "2009-2014" },
        { name: "Max Verstappen", years: "2016-Present" },
        { name: "Daniel Ricciardo", years: "2014-2018" },
        { name: "Mark Webber", years: "2007-2013" },
      ],
      aiInsight:
        "Red Bull Racing revolutionized F1 through aerodynamic dominance, primarily under the design leadership of Adrian Newey. Their philosophy is aggressive: maximizing 'outwash' and floor efficiency to create high-downforce platforms. As they transition to Red Bull Ford Power Trains, the team is evolving from a specialized aero-house into a fully integrated power unit manufacturer, maintaining a disruptive, high-risk-reward culture.",
    },
  },
  mercedes: {
    id: "mercedes",
    name: "Mercedes",
    fullTitle: "Mercedes-AMG PETRONAS F1 Team",
    base: "Brackley, United Kingdom",
    chief: "Toto Wolff",
    powerUnit: "Mercedes",
    budget2026: "$145M (Cost Cap Max)",
    established: "1954 (Modern 2010)",
    allTime: {
      titles: 8,
      driverTitles: 9,
      wins: 128,
      podiums: 295,
      poles: 139,
      fastestLaps: 108,
      budgetScale: "Industrial Powerhouse / Tier 1",
      famousDrivers: [
        { name: "Lewis Hamilton", years: "2013-2024" },
        { name: "Nico Rosberg", years: "2010-2016" },
        { name: "Michael Schumacher", years: "2010-2012" },
        { name: "Juan Manuel Fangio", years: "1954-1955" },
      ],
      aiInsight:
        "Mercedes represents the 'Silver Arrows' legacy of industrial-grade precision. Their turbo-hybrid era dominance was built on total system integration—synchronizing power unit harvesting with chassis recovery. Their philosophy centers on 'No Blame' culture and data-driven reliability, often producing the most stable and predictable aero platforms on the grid.",
    },
  },
  aston_martin: {
    id: "aston_martin",
    name: "Aston Martin",
    fullTitle: "Aston Martin Aramco F1 Team",
    base: "Silverstone, United Kingdom",
    chief: "Mike Krack",
    powerUnit: "Honda",
    budget2026: "$145M (Cost Cap Max)",
    established: "2021",
    allTime: {
      titles: 0,
      driverTitles: 0,
      wins: 1,
      podiums: 12,
      poles: 1,
      fastestLaps: 2,
      budgetScale: "Rapid Expansion / Tier 1 Ambition",
      famousDrivers: [
        { name: "Fernando Alonso", years: "2023-Present" },
        { name: "Sebastian Vettel", years: "2021-2022" },
        { name: "Sergio Perez", years: "2014-2020 (Force India/RP)" },
      ],
      aiInsight:
        "Aston Martin (formerly Jordan/Force India) is in a phase of hyper-expansion. With their new AMR Technology Campus and exclusive Honda engine partnership for 2026, they are moving from a 'giant-killer' underdog to a factory-level contender. Their technical philosophy focuses on rapid mechanical simulation and aggressive surface aero, bolstered by heavy recruitment from top-tier rivals.",
    },
  },
  williams: {
    id: "williams",
    name: "Williams",
    fullTitle: "Williams Racing",
    base: "Grove, United Kingdom",
    chief: "James Vowles",
    powerUnit: "Mercedes",
    budget2026: "$140M",
    established: "1977",
    allTime: {
      titles: 9,
      driverTitles: 7,
      wins: 114,
      podiums: 313,
      poles: 128,
      fastestLaps: 133,
      budgetScale: "Resurgent Independent",
      famousDrivers: [
        { name: "Nigel Mansell", years: "1985-1988, 1991-1992" },
        { name: "Alain Prost", years: "1993" },
        { name: "Ayrton Senna", years: "1994" },
        { name: "Damon Hill", years: "1993-1996" },
      ],
      aiInsight:
        "Williams is the ultimate independent racing team. Their history is defined by mechanical innovation—pioneering active suspension and groundbreaking wind tunnel workflows in the 90s. Under new ownership, the team is modernizing its infrastructure to reclaim its position as a technical pioneer, focusing on low-drag efficiency and advanced composite manufacturing.",
    },
  },
  audi: {
    id: "audi",
    name: "Audi",
    fullTitle: "Audi Factory Team",
    base: "Neuburg/Hinwil, Germany/CH",
    chief: "Mattia Binotto",
    powerUnit: "Audi",
    budget2026: "$145M (Cost Cap Max)",
    established: "2026",
    allTime: {
      titles: 0,
      driverTitles: 0,
      wins: 0,
      podiums: 0,
      poles: 0,
      fastestLaps: 0,
      budgetScale: "Factory Entry",
      famousDrivers: [
        { name: "Nico Hülkenberg", years: "2025-Present" },
        { name: "Gabriel Bortoleto", years: "2026-Present" },
      ],
      aiInsight:
        "Audi enters F1 with a massive legacy in Le Mans and Rallying. Taking over the Sauber foundation, they are a full 'Power Unit and Chassis' factory project. Their philosophy is expected to mirror their endurance racing success: extreme efficiency, cooling optimization, and high-performance electric harvesting (MGU-K focus for 2026).",
    },
  },
  alpine: {
    id: "alpine",
    name: "Alpine",
    fullTitle: "BWT Alpine F1 Team",
    base: "Enstone, United Kingdom",
    chief: "Oliver Oakes",
    powerUnit: "Mercedes (Customer)",
    budget2026: "$135M",
    established: "2021",
    allTime: {
      titles: 2,
      driverTitles: 2,
      wins: 36,
      podiums: 105,
      poles: 20,
      fastestLaps: 15,
      budgetScale: "Mid-Field Tier 1",
      famousDrivers: [
        { name: "Fernando Alonso", years: "2003-2006, 2021-2022" },
        { name: "Michael Schumacher", years: "1991-1995 (Benetton)" },
        { name: "Esteban Ocon", years: "2020-2024" },
      ],
      aiInsight:
        "Alpine (formerly Renault/Benetton) has a legacy of being a technical disruptor. Having moved to a customer Mercedes engine for 2026, they are focused purely on chassis excellence and lightweight integration. Their philosophy emphasizes suspension geometry and mechanical grip, aiming to maximize points through consistent, high-utility aero platforms.",
    },
  },
  cadillac: {
    id: "cadillac",
    name: "Cadillac",
    fullTitle: "Cadillac Racing (Andretti)",
    base: "Fishers, Indiana, USA",
    chief: "Michael Andretti",
    powerUnit: "Ferrari (Customer)",
    budget2026: "$140M",
    established: "2026",
    allTime: {
      titles: 0,
      driverTitles: 0,
      wins: 0,
      podiums: 0,
      poles: 0,
      fastestLaps: 0,
      budgetScale: "New Entrant",
      famousDrivers: [
        { name: "Valtteri Bottas", years: "2026-Present" },
        { name: "Sergio Perez", years: "2026-Present" },
      ],
      aiInsight:
        "Cadillac brings American muscle and INDYCAR-bred aggression to the grid. As a new entrant, their technical philosophy focuses on rapid simulation and leveraging American aerospace manufacturing. They are currently a customer of Ferrari but aim for full power unit autonomy by 2028, focusing on high-speed stability and mechanical robustness.",
    },
  },
  racing_bulls: {
    id: "racing_bulls",
    name: "RB",
    fullTitle: "Visa Cash App RB F1 Team",
    base: "Faenza, Italy",
    chief: "Laurent Mekies",
    powerUnit: "Red Bull Ford",
    budget2026: "$135M",
    established: "2024",
    allTime: {
      titles: 0,
      driverTitles: 0,
      wins: 2,
      podiums: 5,
      poles: 1,
      fastestLaps: 3,
      budgetScale: "Sister Team Integration",
      famousDrivers: [
        { name: "Sebastian Vettel", years: "2007-2008" },
        { name: "Daniel Ricciardo", years: "2012-2013, 2023-2024" },
        { name: "Pierre Gasly", years: "2017-2022" },
      ],
      aiInsight:
        "RB (formerly Toro Rosso/AlphaTauri) acts as the high-tech laboratory for the Red Bull ecosystem. Their philosophy is centered on agility and testing bold aero concepts that eventually feed into the senior team. They maintain an Italian operational heart with a UK-based aero department, focusing on aggressive development cycles.",
    },
  },
  haas: {
    id: "haas",
    name: "Haas",
    fullTitle: "MoneyGram Haas F1 Team",
    base: "Kannapolis, USA",
    chief: "Ayao Komatsu",
    powerUnit: "Ferrari",
    budget2026: "$130M",
    established: "2016",
    allTime: {
      titles: 0,
      driverTitles: 0,
      wins: 0,
      podiums: 0,
      poles: 1,
      fastestLaps: 2,
      budgetScale: "Lean Operator",
      famousDrivers: [
        { name: "Romain Grosjean", years: "2016-2020" },
        { name: "Kevin Magnussen", years: "2017-2020, 2022-2024" },
        { name: "Nico Hülkenberg", years: "2023-2024" },
      ],
      aiInsight:
        "Haas pioneered the 'outsourced' model in F1, leveraging a deep technical partnership with Ferrari and Dallara. Their philosophy is ultra-lean, focusing on maximizing the utility of off-the-shelf components while optimizing their own aero surfaces. Under Komatsu, they have shifted towards a more engineering-led culture, prioritizing race-day stability.",
    },
  },
  kick_sauber: {
    id: "kick_sauber",
    name: "Sauber",
    fullTitle: "Sauber Motorsport",
    base: "Hinwil, Switzerland",
    chief: "Mattia Binotto",
    powerUnit: "Ferrari",
    budget2026: "$135M",
    established: "1970",
    allTime: {
      titles: 0,
      driverTitles: 0,
      wins: 1,
      podiums: 26,
      poles: 1,
      fastestLaps: 5,
      budgetScale: "Mid-Field Veteran",
      famousDrivers: [
        { name: "Kimi Räikkönen", years: "2001, 2019-2021" },
        { name: "Robert Kubica", years: "2006-2009" },
        { name: "Sebastian Vettel", years: "2007" },
      ],
      aiInsight:
        "Sauber is known for Swiss precision and producing world-class driving talent. Their Hinwil wind tunnel remains one of the best in the world. While currently transitioning into the Audi project, their core philosophy remains 'efficiency over excess', often punching above their weight with limited resources.",
    },
  },
};

// --- ALIASES FOR API COMPATIBILITY ---
// RB aliases
teamDetails["rb"] = teamDetails.racing_bulls;
teamDetails["rbf1"] = teamDetails.racing_bulls;
teamDetails["racing-bulls"] = teamDetails.racing_bulls;

// Sauber aliases
teamDetails["sauber"] = teamDetails.kick_sauber;
teamDetails["sauber_f1"] = teamDetails.kick_sauber;

// Red Bull aliases
teamDetails["redbull"] = teamDetails.red_bull;

// Aston Martin aliases
teamDetails["aston"] = teamDetails.aston_martin;
