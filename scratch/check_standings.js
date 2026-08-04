import axios from "axios";

async function checkStandings() {
  try {
    const res = await axios.get("http://localhost:3000/api/standings");
    const driver =
      res.data.MRData.StandingsTable.StandingsLists[0].DriverStandings[0];
    console.log("Driver Standing Example:", JSON.stringify(driver, null, 2));
  } catch (err) {
    console.error("Error fetching standings:", err.message);
  }
}

checkStandings();
