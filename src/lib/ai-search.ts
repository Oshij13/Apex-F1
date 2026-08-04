import { getAISummary } from "./api";

export interface AIDriverResult {
  id: string;
  name: string;
  nationality: string;
  mostFamousTeam: string;
  role: string;
}

export interface AIDriverProfile {
  name: string;
  nationality: string;
  championships: number;
  championshipYears: number[];
  yearsActive: number;
  totalWins: number;
  totalPodiums: number;
  totalStarts: number;
  teams: { name: string; years: string }[];
  legacy: string;
  aiSummary: string;
  careerGraph: { year: number; pos: number }[];
}

/**
 * Uses AI to search for drivers matching a query.
 */
export const searchDriversAI = async (query: string): Promise<AIDriverResult[]> => {
  const prompt = `You are a Formula 1 data engine. The user is searching for a driver: '${query}'. 
  Search your knowledge for the top 8 most relevant Formula 1 drivers (historical or active).
  Return a JSON array of objects. Each object MUST have:
  - 'id': A URL-friendly unique ID (e.g., 'senna', 'michael-schumacher', 'hamilton').
  - 'name': Their full name.
  - 'nationality': Their nationality.
  - 'mostFamousTeam': The team they are most associated with.
  - 'role': A brief title (e.g., '3-Time World Champion', 'Legendary Pioneer').
  
  Only return the raw JSON array. No markdown, no explanation.`;

  try {
    const text = await getAISummary(prompt);
    const jsonStr = text.match(/\[[\s\S]*\]/)?.[0] || text;
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("AI Search Error:", error);
    return [];
  }
};

/**
 * Uses AI to generate a full career profile for a driver.
 */
export const getDriverProfileAI = async (driverName: string): Promise<AIDriverProfile | null> => {
  const prompt = `Generate a comprehensive Formula 1 career profile for '${driverName}'.
  Provide the data in JSON format with the following keys:
  - "name": Full name.
  - "nationality": Nationality.
  - "championships": Total World Titles (number).
  - "championshipYears": Array of years they won titles (numbers).
  - "yearsActive": Total number of seasons competed (number).
  - "totalWins": Total career race wins (number).
  - "totalPodiums": Total career podiums (number).
  - "totalStarts": Total career race starts (number).
  - "teams": Array of objects { "name": string, "years": string } for EVERY team they drove for in chronological order. MANDATORY: The "years" field MUST be the specific years they were at that team, e.g., "1996 - 2006". DO NOT leave this empty.
  - "legacy": A 3-4 sentence description of their career progress and impact on the sport.
  - "aiSummary": A 2-sentence summary of their driving style or personality.
  - "careerGraph": An array of objects { "year": number, "pos": number } showing their championship finishing position for every year they competed.
  
  Only return the raw JSON object. No markdown.`;

  try {
    const text = await getAISummary(prompt);
    const jsonStr = text.match(/\{[\s\S]*\}/)?.[0] || text;
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("AI Profile Error:", error);
    return null;
  }
};
