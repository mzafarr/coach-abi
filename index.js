import express from 'express';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import cors from 'cors';
dotenv.config();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const app = express();
const port = 3000; 

// Middleware to parse JSON in the request body
app.use(express.json());
app.use(cors());
// Define a route for the API
app.post('/api/chat', async (req, res) => {
  try {
    const messages = req.body.messages || [];
    // Add a system message if not present
    // if (!messages.some(msg => msg.role === 'system')) {
    //   messages.unshift({ role: 'system', content: 'You are a helpful assistant.' });
    // }
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messages,
    });

    res.json({ response: completion.choices[0].message.content });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
