require("dotenv").config();

const express = require("express");
const cors = require("cors");
const Anthropic = require("@anthropic-ai/sdk");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve frontend files
app.use(express.static(__dirname));

const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
});

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

    const response = await anthropic.messages.create({
      model: "claude-3-5-haiku-latest",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: message,
        },
      ],
    });

    res.json({
      reply: response.content[0].text,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      reply: "Something went wrong on the server.",
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Novix AI backend running on port ${PORT}`);
});
