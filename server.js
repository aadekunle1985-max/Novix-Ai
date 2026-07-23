require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const Groq = require("groq-sdk");

const app = express();
const PORT = process.env.PORT || 3000;

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Home page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Chat endpoint
app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        reply: "Please enter a message."
      });
    }

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: "You are Novix AI, a helpful and friendly AI assistant."
        },
        {
          role: "user",
          content: message
        }
      ],
      temperature: 0.7,
      max_tokens: 1024
    });

    res.json({
      reply: completion.choices[0].message.content
    });

  } catch (error) {
    console.error("Groq Error:", error);

    res.status(500).json({
      reply: "Sorry, I couldn't process your request."
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Novix AI is running on port ${PORT}`);
});
