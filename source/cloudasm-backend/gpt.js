// Import necessary packages and modules
const { OpenAI } = require('openai');
require('dotenv').config(); // Load environment variables from a .env file



const openai = new OpenAI({
  apiKey: process.env.API_KEY // This is also the default, can be omitted
});

const chatCompletion = openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{"role": "user", "content": "Hello!"}],
  });
  console.log(chatCompletion.choices[0].message);