import { tool } from "ai";
import z from 'zod'
export const myTools = {
    weather: tool({
        description: 'Get the weather of a location',
        inputSchema: z.object({
            location: z.string().describe('The location to get the weather for')
        }),
        execute: async ({ location }) => {
            const url = `https://weatherapi-com.p.rapidapi.com/current.json?q=${location}`;
            const options = {
                method: 'GET',
                headers: {
                    'x-rapidapi-key': '188f914a41msh1173a21487141aap17c814jsnb145380aef56',
                    'x-rapidapi-host': 'weatherapi-com.p.rapidapi.com'
                }
            };
            try {
                const response = await fetch(url, options);
                const result = await response.json();
                console.log('WEATHER TOOL CALLED')
                console.log({ result })
                return JSON.stringify(result);
            } catch (error) {
                console.error(error);
            }
        }
    }),

}