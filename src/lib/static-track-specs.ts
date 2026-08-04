export interface TrackSpec {
  length: string;
  turns: string;
  sectors: string;
  elevation: string;
  record: {
    time: string;
    holders: { driver: string; year: number }[];
  };
}

export const STATIC_TRACK_SPECS: Record<string, TrackSpec> = {
  "Albert Park Circuit": {
    length: "5.278",
    turns: "14",
    sectors: "3",
    elevation: "10 meters",
    record: {
      time: "1:20.235",
      holders: [{ driver: "Sergio Perez", year: 2023 }],
    },
  },
  "Suzuka International Racing Course": {
    length: "5.807",
    turns: "18",
    sectors: "3",
    elevation: "40 meters",
    record: {
      time: "1:30.983",
      holders: [{ driver: "Lewis Hamilton", year: 2019 }],
    },
  },
  "Circuit de Monaco": {
    length: "3.337",
    turns: "19",
    sectors: "3",
    elevation: "42 meters",
    record: {
      time: "1:12.909",
      holders: [{ driver: "Lewis Hamilton", year: 2021 }],
    },
  },
  "Silverstone Circuit": {
    length: "5.891",
    turns: "18",
    sectors: "3",
    elevation: "11 meters",
    record: {
      time: "1:27.097",
      holders: [{ driver: "Max Verstappen", year: 2020 }],
    },
  },
  "Autodromo Nazionale di Monza": {
    length: "5.793",
    turns: "11",
    sectors: "3",
    elevation: "13 meters",
    record: {
      time: "1:21.046",
      holders: [{ driver: "Rubens Barrichello", year: 2004 }],
    },
  },
  "Circuit de Spa-Francorchamps": {
    length: "7.004",
    turns: "20",
    sectors: "3",
    elevation: "102 meters",
    record: {
      time: "1:46.286",
      holders: [{ driver: "Valtteri Bottas", year: 2018 }],
    },
  },
  "Red Bull Ring": {
    length: "4.318",
    turns: "10",
    sectors: "3",
    elevation: "65 meters",
    record: {
      time: "1:05.619",
      holders: [{ driver: "Carlos Sainz", year: 2020 }],
    },
  },
  "Interlagos": {
    length: "4.309",
    turns: "15",
    sectors: "3",
    elevation: "43 meters",
    record: {
      time: "1:10.540",
      holders: [{ driver: "Valtteri Bottas", year: 2018 }],
    },
  },
  "Yas Marina Circuit": {
    length: "5.281",
    turns: "16",
    sectors: "3",
    elevation: "11 meters",
    record: {
      time: "1:26.103",
      holders: [{ driver: "Max Verstappen", year: 2021 }],
    },
  },
  "Baku City Circuit": {
    length: "6.003",
    turns: "20",
    sectors: "3",
    elevation: "28 meters",
    record: {
      time: "1:43.009",
      holders: [{ driver: "Charles Leclerc", year: 2019 }],
    },
  },
  "Circuit Gilles-Villeneuve": {
    length: "4.361",
    turns: "14",
    sectors: "3",
    elevation: "6 meters",
    record: {
      time: "1:13.078",
      holders: [{ driver: "Valtteri Bottas", year: 2019 }],
    },
  },
  "Hungaroring": {
    length: "4.381",
    turns: "14",
    sectors: "3",
    elevation: "34 meters",
    record: {
      time: "1:16.627",
      holders: [{ driver: "Lewis Hamilton", year: 2020 }],
    },
  },
  "Circuit de Barcelona-Catalunya": {
    length: "4.675",
    turns: "14",
    sectors: "3",
    elevation: "30 meters",
    record: {
      time: "1:16.330",
      holders: [{ driver: "Max Verstappen", year: 2023 }],
    },
  },
  "Zandvoort": {
    length: "4.259",
    turns: "14",
    sectors: "3",
    elevation: "15 meters",
    record: {
      time: "1:11.097",
      holders: [{ driver: "Lewis Hamilton", year: 2021 }],
    },
  },
  "Marina Bay Street Circuit": {
    length: "4.940",
    turns: "19",
    sectors: "3",
    elevation: "5 meters",
    record: {
      time: "1:35.867",
      holders: [{ driver: "Lewis Hamilton", year: 2023 }],
    },
  },
  "Circuit of the Americas": {
    length: "5.513",
    turns: "20",
    sectors: "3",
    elevation: "41 meters",
    record: {
      time: "1:36.169",
      holders: [{ driver: "Charles Leclerc", year: 2019 }],
    },
  },
  "Autódromo Hermanos Rodríguez": {
    length: "4.304",
    turns: "17",
    sectors: "3",
    elevation: "2 meters",
    record: {
      time: "1:17.774",
      holders: [{ driver: "Valtteri Bottas", year: 2021 }],
    },
  },
  "Shanghai International Circuit": {
    length: "5.451",
    turns: "16",
    sectors: "3",
    elevation: "7 meters",
    record: {
      time: "1:32.238",
      holders: [{ driver: "Michael Schumacher", year: 2004 }],
    },
  },
  "Bahrain International Circuit": {
    length: "5.412",
    turns: "15",
    sectors: "3",
    elevation: "18 meters",
    record: {
      time: "1:31.447",
      holders: [{ driver: "Pedro de la Rosa", year: 2005 }],
    },
  },
  "Jeddah Corniche Circuit": {
    length: "6.174",
    turns: "27",
    sectors: "3",
    elevation: "5 meters",
    record: {
      time: "1:30.734",
      holders: [{ driver: "Lewis Hamilton", year: 2021 }],
    },
  },
  "Lusail International Circuit": {
    length: "5.419",
    turns: "16",
    sectors: "3",
    elevation: "10 meters",
    record: {
      time: "1:24.319",
      holders: [{ driver: "Max Verstappen", year: 2023 }],
    },
  },
  "Las Vegas Strip Circuit": {
    length: "6.201",
    turns: "17",
    sectors: "3",
    elevation: "4 meters",
    record: {
      time: "1:35.490",
      holders: [{ driver: "Oscar Piastri", year: 2023 }],
    },
  },
  "Autodromo Enzo e Dino Ferrari": {
    length: "4.909",
    turns: "19",
    sectors: "3",
    elevation: "32 meters",
    record: {
      time: "1:15.484",
      holders: [{ driver: "Lewis Hamilton", year: 2020 }],
    },
  },
  "Imola": {
    length: "4.909",
    turns: "19",
    sectors: "3",
    elevation: "32 meters",
    record: {
      time: "1:15.484",
      holders: [{ driver: "Lewis Hamilton", year: 2020 }],
    },
  }
};
