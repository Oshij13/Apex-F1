import axios from "axios";

async function testAI() {
  try {
    const prompt =
      "Summarize the 2026 Bahrain Grand Prix. Focus on the podium finishers and key strategic moments in 3 engaging sentences.";
    const res = await axios.post("http://localhost:3000/api/ai-summary", {
      prompt,
    });
    console.log("AI Response:", JSON.stringify(res.data, null, 2));
  } catch (err) {
    console.error("Error fetching AI:", err.message);
  }
}

testAI();
