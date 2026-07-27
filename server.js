require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");
const Groq = require("groq-sdk");

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.log("❌ MongoDB Error:", err));

// Groq
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Home
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Chat API
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
          content:
            "You are Novix AI, a friendly and intelligent AI assistant."
        },
        {
          role: "user",
          content: message
        }
      ],
      temperature: 0.7,
      max_tokens: 1024
    });

    const reply = completion.choices[0].message.content;

    res.json({
      reply
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      reply: "Something went wrong."
    });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Novix AI running on port ${PORT}`);
});