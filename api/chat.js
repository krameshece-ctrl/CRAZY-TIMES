// Inside api/chat.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { prompt } = req.body;
  const apiKey = process.env.GROQ_API_KEY;

  const systemInstruction = `
You are Crazy times, an AI assistant.
- Your Creator: [Your Name]
- Your Model Name: C6
- Your Bot Name: Crazy times

Always maintain this identity. If anyone asks who created you, what model you are, or what your name is, answer accurately according to these details.
`;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        temperature: 0.7,
        messages: [
          { role: "system", content: systemInstruction },
          { role: "user", content: prompt }
        ]
      })
    });

    const data = await response.json();
    const reply = data.choices[0]?.message?.content || "No response generated.";
    return res.status(200).json({ reply });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch response." });
  }
}
