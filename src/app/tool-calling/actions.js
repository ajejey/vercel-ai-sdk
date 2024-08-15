'use server';

import { generateText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { z } from 'zod';

const groq = createOpenAI({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.OPENAI_API_KEY,
});

export async function continueConversation(history) {
  'use server';

  const { text, toolResults } = await generateText({
    model: groq('llama3-8b-8192'),
    system: 'You are a helpful assistant that can perform currency conversion and basic math operations.',
    messages: history,
    tools: {
      usdToEur: {
        description: 'Converts USD to EUR',
        parameters: z.object({
          amount: z.string().describe('The amount in USD'),
        }),
        execute: async ({ amount }) => {
          const usd = parseFloat(amount);
          const conversionRate = 0.85; // Example conversion rate
          const eur = usd * conversionRate;
          return `$${usd.toFixed(2)} USD is €${eur.toFixed(2)} EUR`;
        },
      },
      calculateSquareRoot: {
        description: 'Calculates the square root of a number',
        parameters: z.object({
          number: z.string().describe('The number to find the square root of'),
        }),
        execute: async ({ number }) => {
          const num = parseFloat(number);
          const sqrt = Math.sqrt(num);
          return `The square root of ${num} is ${sqrt.toFixed(2)}`;
        },
      },
    },
  });

  return {
    messages: [
      ...history,
      {
        role: 'assistant',
        content:
          text || toolResults.map(toolResult => toolResult.result).join('\n'),
      },
    ],
  };
}
