// src/app/api/chat/route.ts
import { NextRequest, NextResponse } from "next/server"
import { ChatOpenAI } from "@langchain/openai"
import { createReactAgent } from "@langchain/langgraph/prebuilt"
import { SystemMessage } from "@langchain/core/messages"
import { EmailDraft, SendEmail, emailDraftSchema, sendEmailSchema } from "@/lib/email"
import { convertVercelMessageToLangChainMessage } from "@/lib/message-converters"
import { toUIMessageStream } from "@ai-sdk/langchain"
import { convertToModelMessages, createUIMessageStreamResponse, streamText, tool } from "ai"
import {createOpenRouter, openrouter } from "@openrouter/ai-sdk-provider"
import z from "zod"

const AGENT_SYSTEM_TEMPLATE = `You are ResumeFlow, an intelligent and supportive AI agent that helps users create, review, and optimize resumes tailored to specific job descriptions.

Your Capabilities:
- Access and analyze resumes from Google Docs.
- Rewrite or generate optimized resumes using Google Docs templates.
- Tailor resumes for specific job descriptions provided by the user.
- Generate concise email drafts to send resumes to recruiters via Gmail.

Your Objectives:
- Provide actionable suggestions for each resume section (summary, experience, projects, education, skills).
- Identify and flag weak entries, missing details, or formatting issues.
- Rewrite or reformat text for clarity, impact, and ATS compatibility.
- Ask for missing context (e.g. quantifiable impact, specific tools used, career goals).

Tone & Style:
- Friendly, encouraging, and clear.
- Use concise, high-impact bullet points.
- Avoid jargon unless appropriate for the role/industry.
- Speak with empathy, especially for early-career professionals or career switchers.

Boundaries:
- Do not make up user data (e.g. roles, dates, achievements).
- Ask for confirmation before sending any emails or submitting resumes.
`
  function createDummyTicket(data: any) {
    console.log('createDummyTicket', data)
    const randomId = 'TCK-' + Math.floor(10000 + Math.random() * 90000);
    return {
      ticketId: randomId,
      ...data,
      createdAt: new Date().toISOString(),
      status: 'open',
    };
  }
const openRouter = createOpenRouter({
  apiKey: process.env.OPENAI_API_KEY!,
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { messages } = body
    console.log("Received messages:", messages)

    // const llm = new ChatOpenAI({
    //   model: "gpt-4o-mini",
    //   temperature: 0,
    //   apiKey: process.env.OPENAI_API_KEY,
    // })

    // const agent = createReactAgent({
    //   llm,
    //   tools: [],
    //   messageModifier: new SystemMessage(AGENT_SYSTEM_TEMPLATE),
    // })

    // const eventStream = agent.streamEvents(
    //   { messages: convertVercelMessageToLangChainMessage(messages) },
    //   { version: "v2" }
    // )
    // return createUIMessageStreamResponse({
    //   stream: toUIMessageStream(eventStream),
    // })

    const Text = streamText({
    model: openRouter.languageModel('minimax/minimax-m2:free'),
    messages: convertToModelMessages(messages),
    system: AGENT_SYSTEM_TEMPLATE,
    tools: {
        // Define any tools here if needed
              createTicket: tool({
        description:
          'Creates a new company support ticket using the form data provided by the user.',
        inputSchema: z.object({
          name: z.string().describe('Full name of the user'),
          userAge: z.number().describe('Age of the user'),
          email: z.string().email().describe('User email'),
          issueType: z.string().describe('Type of issue (leave, salary, complaint, etc.)'),
          details: z.string().describe('Detailed issue description'),
          priority: z
            .enum(['low', 'medium', 'high'])
            .default('medium')
            .describe('Issue priority'),
        }),
        execute: async (input) => {
          const ticket = createDummyTicket(input);
          return {
            message: `✅ email draft successfully!`,
            ticket,
          };
        },
      }), 

    }
    })

    return Text.toUIMessageStreamResponse();

  } catch (e: any) {
    console.error(e)
    return NextResponse.json({ error: e.message }, { status: e.status ?? 500 })
  }
}
