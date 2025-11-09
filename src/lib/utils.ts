import { UIMessage } from "ai";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { AIMessage, HumanMessage } from "@langchain/core/messages";
/* import { docs_v1 } from "googleapis" */

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export const ConvertVercelMessagesToLangchain = (messages:UIMessage[]): any[] => {
  return messages.map((message) => {
    message.role === 'user' ? new HumanMessage(message.parts.map((part) => part.type === 'text' ? part.text : "").join(""))
    : new AIMessage(message.parts.map((part) => part.type === 'text' ? part.text : "").join(""))
  });
}

/*
type ExtractedBlock = {
  text: string
  startIndex: number
  endIndex: number
}

export function extractTextFromGoogleDoc(
  body: docs_v1.Schema$StructuralElement[] = []
): ExtractedBlock[] {
  const blocks: ExtractedBlock[] = []

  for (const block of body) {
    // === Paragraphs ===
    if (block.paragraph) {
      for (const element of block.paragraph.elements || []) {
        const text = element.textRun?.content?.trim()
        const startIndex = element.startIndex ?? -1
        const endIndex = element.endIndex ?? -1

        if (
          text &&
          startIndex !== -1 &&
          endIndex !== -1 &&
          startIndex < endIndex
        ) {
          blocks.push({
            text,
            startIndex,
            endIndex,
          })
        }
      }
    }

    // === Tables ===
    else if (block.table) {
      for (const [rowIndex, row] of (block.table.tableRows || []).entries()) {
        for (const [cellIndex, cell] of row.tableCells.entries()) {
          for (const cellBlock of cell.content || []) {
            if (cellBlock.paragraph) {
              for (const element of cellBlock.paragraph.elements || []) {
                const text = element.textRun?.content?.trim()
                const startIndex = element.startIndex ?? -1
                const endIndex = element.endIndex ?? -1

                if (
                  text &&
                  startIndex !== -1 &&
                  endIndex !== -1 &&
                  startIndex < endIndex
                ) {
                  blocks.push({
                    text: `Cell [${rowIndex}, ${cellIndex}]: ${text}`,
                    startIndex,
                    endIndex,
                  })
                }
              }
            }
          }
        }
      }
    }

    // === Bullets ===
    else if (block.bullet && block.paragraph) {
      for (const element of block.paragraph.elements || []) {
        const text = element.textRun?.content?.trim()
        const startIndex = element.startIndex ?? -1
        const endIndex = element.endIndex ?? -1

        if (
          text &&
          startIndex !== -1 &&
          endIndex !== -1 &&
          startIndex < endIndex
        ) {
          blocks.push({
            text: `• ${text}`,
            startIndex,
            endIndex,
          })
        }
      }
    }
  }

  return blocks
}
 */
