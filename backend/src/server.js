import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5050;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/* ===== HEALTH ===== */
app.get("/", (req, res) => {
  res.send("Mubarak backend is live 🌙");
});

/* ===== CHAT ===== */
app.post("/chat", async (req, res) => {
  try {
    const { system, messages, max_tokens } = req.body;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.7,
      max_tokens: max_tokens || 900,
      messages: [
        { role: "system", content: system },
        ...messages
      ]
    });

    res.json({
      reply: completion.choices[0].message.content
    });

  } catch (err) {
    console.error("AI error:", err.message);
    res.status(500).json({ error: "AI request failed" });
  }
});

/* ===== START ===== */
app.listen(PORT, () => {
  console.log(`Mubarak API running on port ${PORT}`);
});
