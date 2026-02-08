import { getModelCookie } from '@/lib/models';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { convertToModelMessages, streamText, type UIMessage } from 'ai';
import { google } from '@ai-sdk/google';

const openrouter = createOpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY!,
});

// openai/gpt-oss-120b  -OK
// tngtech/deepseek-r1t2-chimera:free  -OK
// openrouter/free  -OK

const model = google('gemini-2.5-flash');

export async function POST(req: Request) {
    const { messages }: { messages: UIMessage[] } = await req.json();

    const modelId = await getModelCookie();
    console.dir({messages })
    const result = streamText({
        model: model,
        system: 'You are a helpful assistant.',
        messages: await convertToModelMessages(messages),
    });

    return result.toUIMessageStreamResponse();

}