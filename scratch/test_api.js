import axios from "axios";
const J = "https://api.jolpi.ca/ergast/f1";

async function test() {
    const id = "leclerc";
    const url = `${J}/drivers/${id}/qualifying/1.json?limit=1`;
    console.log(`Testing ${id}: ${url}`);
    try {
        const res = await axios.get(url);
        console.log(`- Success! Career Poles: ${res.data.MRData.total}`);
    } catch (e) {
        console.log(`- Failed: ${e.response?.status || e.message}`);
    }
}

test();
