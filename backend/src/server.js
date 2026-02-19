import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5050;

/* ================= OPENAI CLIENT ================= */
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/* ================= HEALTH CHECK ================= */
app.get("/", (req, res) => {
  res.send("🌙 Mubarak backend is live");
});

/* ================= CHAT ENDPOINT ================= */
app.post("/chat", async (req, res) => {
  try {
    const { message, system } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.7,
      messages: [
        ...(system ? [{ role: "system", content: system }] : []),
        { role: "user", content: message },
      ],
    });

    const reply = completion.choices[0].message.content;

    res.json({ reply });
  } catch (error) {
    console.error("OpenAI error:", error.message);
    res.status(500).json({ error: "AI request failed" });
  }
});

/* ================= START SERVER ================= */
app.listen(PORT, () => {
  console.log(`🚀 Mubarak API running on port ${PORT}`);
});
