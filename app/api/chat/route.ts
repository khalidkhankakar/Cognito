// import { getModelCookie } from '@/lib/models';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { convertToModelMessages, createUIMessageStream, createUIMessageStreamResponse, stepCountIs, streamText, type UIMessage } from 'ai';
import { google } from '@ai-sdk/google';
import {  myToolSet } from '@/lib/tools';
import type { MyUIMessage } from '@/lib/types';
import { githubMCPClient } from '@/lib/mcp';


// const openrouter = createOpenRouter({
//     apiKey: process.env.OPENROUTER_API_KEY!,
// });

// openai/gpt-oss-120b  -OK
// tngtech/deepseek-r1t2-chimera:free  -OK
// openrouter/free  -OK



const model = google('gemini-2.5-flash');
// const model = openrouter('openrouter/free');

export type { MyUIMessage } from '@/lib/types';



export async function POST(req: Request) {
    const { messages }: { messages: UIMessage[] } = await req.json();

    // const modelId = await getModelCookie();
    // console.dir({ messages })
    const convertMessages = await convertToModelMessages(messages);

    const stream = createUIMessageStream<MyUIMessage>({
        execute: async ({ writer }) => {

            const result = streamText({
                model,
                messages: convertMessages,
                system: "You are a helpful assistant",
                tools: myToolSet,
                stopWhen: stepCountIs(10)
            });

            writer.merge(result.toUIMessageStream())
        },
        onFinish: async () => {
        //    await githubMCPClient.close();
        }
    },
)



    return createUIMessageStreamResponse({
        stream,
    });
}