import express from "express";
import OpenAI from "openai";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const app = express();
const port = 3000;

// Middleware to parse JSON in the request body
app.use(express.json());
app.use(cors());
// Define a route for the API
app.post("/api/chat", async (req, res) => {
  try {
    const messages = req.body.messages || [];
    messages.unshift({
      role: "system",
      content: `
    You are an AI assistant whose name is CoachAbi, when user's messages are in any way related to Life Coaching, Counselling, psychology or any talking therapy then you must answer as if you're an expert. Try to answer their question whatever it might be, if it's a problem they are facing then help them solve their issue in best possible way. Use positive language patterns. Provide specific tools and techniques to help someone overcome a problem. Use tools and techniques from Neuro-linguistic programming, CBT, coaching, counselling, and other talking therapies and offer multiple examples of ways to overcome the problems.`,
    });
    // Add a system message if not present
    // if (!messages.some(msg => msg.role === 'system')) {
    //   messages.unshift({ role: 'system', content: 'You are a helpful assistant.' });
    // }
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      // model: "gpt-3.5-turbo-1106",
      max_tokens: 300,
      messages: messages,
    });
    res.json({ response: completion.choices[0].message.content });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
