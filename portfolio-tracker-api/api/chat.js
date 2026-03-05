// Serverless proxy for Groq API
// The API key lives ONLY here as a server-side env var (GROQ_API_KEY).
// It is never exposed to the browser or baked into the frontend bundle.

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

module.exports = async (req, res) => {
  // CORS headers — allow requests from any origin (GitHub Pages, localhost, etc.)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");

  // Handle preflight
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Server is missing GROQ_API_KEY environment variable." });
  }

  try {
    const groqResponse = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(req.body),
    });

    const data = await groqResponse.json();
    return res.status(groqResponse.status).json(data);
  } catch (err) {
    console.error("Groq proxy error:", err);
    return res.status(500).json({ error: "Failed to reach Groq API." });
  }
};
