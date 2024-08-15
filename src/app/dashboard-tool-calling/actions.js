'use server';

import { generateText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { z } from 'zod';

const groq = createOpenAI({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.OPENAI_API_KEY,
});

const salesData = [
    { region: 'North', product: 'Laptop', sales: 150, date: '2024-08-01' },
    { region: 'South', product: 'Tablet', sales: 80, date: '2024-08-02' },
    { region: 'East', product: 'Laptop', sales: 200, date: '2024-08-03' },
    { region: 'West', product: 'Smartphone', sales: 120, date: '2024-08-04' },
    { region: 'North', product: 'Smartphone', sales: 180, date: '2024-08-05' },
    { region: 'South', product: 'Laptop', sales: 220, date: '2024-08-06' },
    { region: 'East', product: 'Tablet', sales: 100, date: '2024-08-07' },
    { region: 'West', product: 'Laptop', sales: 160, date: '2024-08-08' },
    { region: 'North', product: 'Tablet', sales: 140, date: '2024-08-09' },
    { region: 'South', product: 'Smartphone', sales: 130, date: '2024-08-10' },
    { region: 'East', product: 'Smartphone', sales: 190, date: '2024-08-11' },
    { region: 'West', product: 'Tablet', sales: 90, date: '2024-08-12' },
    { region: 'North', product: 'Laptop', sales: 210, date: '2024-08-13' },
    { region: 'South', product: 'Laptop', sales: 240, date: '2024-08-14' },
    { region: 'East', product: 'Smartphone', sales: 170, date: '2024-08-15' },
    { region: 'West', product: 'Laptop', sales: 190, date: '2024-08-16' },
    { region: 'North', product: 'Smartphone', sales: 160, date: '2024-08-17' },
    { region: 'South', product: 'Tablet', sales: 110, date: '2024-08-18' },
    { region: 'East', product: 'Laptop', sales: 230, date: '2024-08-19' },
    { region: 'West', product: 'Tablet', sales: 100, date: '2024-08-20' },
  ];
  
  

   async function filterByRegion(region) {
    return salesData.filter(item => item.region.toLowerCase() === region.toLowerCase());
  }
  
   async function filterByProduct(product) {
    return salesData.filter(item => item.product.toLowerCase() === product.toLowerCase());
  }
  
   async function filterByDate(date) {
    return salesData.filter(item => item.date === date);
  }
  
   async function sortData(data, criteria, order = 'asc') {
    return data.sort((a, b) => {
      if (criteria === 'sales') {
        return order === 'asc' ? a.sales - b.sales : b.sales - a.sales;
      } else if (criteria === 'date') {
        return order === 'asc' ? new Date(a.date) - new Date(b.date) : new Date(b.date) - new Date(a.date);
      }
      return 0;
    });
  }

  async function filterBySales(condition, value) {
    return salesData.filter(item => {
      if (condition === 'less than') {
        return item.sales < value;
      } else if (condition === 'greater than') {
        return item.sales > value;
      }
      return false;
    });
  }

  async function filterByDateRange(condition, date) {
    return salesData.filter(item => {
      const itemDate = new Date(item.date);
      const targetDate = new Date(date);
  
      if (condition === 'before') {
        return itemDate < targetDate;
      } else if (condition === 'after') {
        return itemDate > targetDate;
      } else if (condition === 'on') {
        return itemDate.getTime() === targetDate.getTime();
      }
      return false;
    });
  }
  
  export async function filterSalesData(history) {
    'use server';
  
    const { text, toolResults } = await generateText({
      model: groq('llama3-8b-8192'),
      system: 'You are an assistant that filters and sorts sales data based on user input.',
      messages: history,
      tools: {
        filterByRegion: {
          description: 'Filters sales data by region',
          parameters: z.object({
            region: z.string().describe('The region to filter by'),
          }),
          execute: async ({ region }) => filterByRegion(region),
        },
        filterByProduct: {
          description: 'Filters sales data by product',
          parameters: z.object({
            product: z.string().describe('The product to filter by'),
          }),
          execute: async ({ product }) => filterByProduct(product),
        },
        filterByDate: {
          description: 'Filters sales data by date',
          parameters: z.object({
            date: z.string().describe('The date to filter by in YYYY-MM-DD format'),
          }),
          execute: async ({ date }) => filterByDate(date),
        },
        sortData: {
          description: 'Sorts sales data by a given criteria and order',
          parameters: z.object({
            criteria: z.string().describe('The criteria to sort by (e.g., sales, date)'),
            order: z.enum(['asc', 'desc']).describe('The sort order (asc or desc)'),
          }),
          execute: async ({ criteria, order }) => sortData(salesData, criteria, order),
        },
        filterBySales: {
            description: 'Filters sales data by a sales threshold',
            parameters: z.object({
              condition: z.enum(['less than', 'greater than']).describe('The condition to filter sales by'),
              value: z.number().describe('The sales value to compare against'),
            }),
            execute: async ({ condition, value }) => filterBySales(condition, value),
          },
          filterByDateRange: {
            description: 'Filters sales data by a date range',
            parameters: z.object({
              condition: z.enum(['before', 'after', 'on']).describe('The date condition'),
              date: z.string().describe('The target date in YYYY-MM-DD format'),
            }),
            execute: async ({ condition, date }) => filterByDateRange(condition, date),
          },
      },
    });
  
    const results = toolResults.map(toolResult => JSON.stringify(toolResult.result));
  
    return {
      messages: [
        ...history,
        {
          role: 'assistant',
          content: text || results.join('\n'),
        },
      ],
    };
  }