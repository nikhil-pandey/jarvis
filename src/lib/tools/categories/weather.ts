import {z} from 'zod';
import {zodToJsonSchema} from 'zod-to-json-schema';
import {BaseToolSettings} from '@/types/tools';
import {createToolCategory} from '@/lib/tools/createCategory';

export const weatherTools = createToolCategory({
  id: 'weather',
  name: 'Weather Tools',
  description: 'Tools for weather information',
  tools: {
    get_weather: {
      settings: BaseToolSettings,
      definition: {
        name: 'get_weather',
        type: 'function',
        description: 'Get the current weather in a given city',
        parameters: zodToJsonSchema(z.object({
          lat: z.number().describe('The latitude of the location to get the weather for'),
          lng: z.number().describe('The longitude of the location to get the weather for'),
          city: z.string().describe('The city to get the weather for')
        }))
      },
      execute: async ({lat, lng, city}) => {
        const result = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,wind_speed_10m&city=${city}`
        );
        const json = await result.json();
        return json;
      },
      enabled: false
    }
  }
}); 