'use server';

import { createOpenAI } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { z } from 'zod';

const groq = createOpenAI({
    baseURL: 'https://api.groq.com/openai/v1',
    apiKey: process.env.OPENAI_API_KEY,
  });

export async function getMeetingSchedules(input) {
  'use server';

  const { object: schedules } = await generateObject({
    model: groq('llama3-8b-8192'),
    system: 'You generate three meeting schedules for a team. Use Indian names for participants, and ensure the agenda items are relevant to a software development project.',
    prompt: input,
    schema: z.object({
      schedules: z.array(
        z.object({
          title: z.string().describe('Title of the meeting'),
          participants: z.array(z.string().describe('Name of a participant')).min(2),
          time: z.string().describe('Time of the meeting in HH:MM AM/PM format'),
          agenda: z.array(
            z.object({
              topic: z.string().describe('Agenda topic'),
              duration: z.string().describe('Expected duration in minutes'),
            })
          ).min(1),
        })
      ),
    }),
  });

  return { schedules };
}