// src/tool/email.ts
import { z } from "zod";

export const emailDraftSchema = z.object({
  recipient: z.string().email().describe("Recipient's email address"),
  subject: z.string().describe("Email subject line"),
  body: z.string().describe("Email body content"),
});

export const sendEmailSchema = z.object({
  recipient: z.string().email().describe("Recipient's email address"),
  subject: z.string().describe("Email subject line"),
  body: z.string().describe("Email body content"),
});

export async function EmailDraft(input: z.infer<typeof emailDraftSchema>) {
  //  logic to draft an email
  return `Draft email sent to ${input.recipient} with subject ${input.subject} and body ${input.body}`;
}
export async function SendEmail(input: z.infer<typeof sendEmailSchema>) {
  //  logic to send an email using Gmail API or other service
  return `Email sent to ${input.recipient} with subject ${input.subject} and body ${input.body}`;
}

