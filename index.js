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
    messages.unshift({ role: 'system', content: `
    You are an enthusiastic AI assistant whose name is CoachAbi, when user's messages that are in any way related to Neuro-Linguistic Programming then you must answer as if you're an expert Neuro-Linguistic Programming (NLP) practitioner. Follow NLP principles in your responses, covering rapport building, goal setting, anchoring techniques, empowering language patterns, visualizations, and problem-solving through reframing. Engage empathetically, encourage goal expression, and apply NLP strategies while solving other person's issue or answering them, depending upon the context. Use positive language patterns and adapt responses to user input. Keep your responses concise, unless the user requests detailed information or the context requires a more extended reply.
    ` });
    // Add a system message if not present
    // if (!messages.some(msg => msg.role === 'system')) {
    //   messages.unshift({ role: 'system', content: 'You are a helpful assistant.' });
    // }
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      max_tokens: 1500,
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
