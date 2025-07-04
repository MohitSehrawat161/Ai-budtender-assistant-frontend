// // app/api/chat/route.ts

// import { OpenAI } from 'openai';
// import { OpenAIStream } from 'ai';
// import { NextResponse } from 'next/server';

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY!,
// });

// export async function POST(req: Request) {
//   const { messages } = await req.json();

//   const response = await openai.chat.completions.create({
//     model: 'gpt-3.5-turbo',
//     stream: true,
//     messages: [
//       {
//         role: 'system',
//         content: `You are a helpful cannabis budtender who recommends strains based on issues like stress, sleep problems, or pain.`,
//       },
//       ...messages,
//     ],
//   });

//   const stream = OpenAIStream(response);
//   return new NextResponse(stream); // use this instead of StreamingTextResponse
// }
import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();
  console.log(messages);
  const result = streamText({
    model: openai('gpt-4o'),
    messages:[{role:"user",content:"hello"}]
  });

  return result.toDataStreamResponse();
}