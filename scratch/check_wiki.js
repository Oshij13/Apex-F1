import axios from "axios";

async function checkWiki() {
  try {
    const res = await axios.get(
      "http://localhost:3000/api/wiki/Bahrain_International_Circuit",
    );
    console.log("Wiki Response Example:", JSON.stringify(res.data, null, 2));
  } catch (err) {
    console.error("Error fetching wiki:", err.message);
  }
}

checkWiki();
