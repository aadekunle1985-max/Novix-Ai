require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const Anthropic = require("@anthropic-ai/sdk");

const app = express();

app.use(cors());
app.use(express.json());

// Serve frontend files
app.use(express.static(__dirname));

const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
});

// Open the website at "/"
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Claude API endpoint
app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

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
      reply: "Something went wrong.",
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Novix AI running on port ${PORT}`);
});
