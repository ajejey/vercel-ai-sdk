import { createOpenAI, openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const groq = createOpenAI({
    baseURL: 'https://api.groq.com/openai/v1',
    apiKey: process.env.OPENAI_API_KEY,
  });

export async function POST(req) {
  const { messages } = await req.json();
  console.log('messages', messages);

  const result = await streamText({
    model: groq('llama3-8b-8192'),
    messages,
  });

  return result.toAIStreamResponse();
}