import { NextRequest, NextResponse } from "next/server";

import { ChatRequest } from "@/types/chat-request";
import { ChatResponse } from "@/types/chat";

export async function POST(req: NextRequest) {
  const body: ChatRequest = await req.json();

  const { world, messages, userMessage } = body;

  console.log(
    messages.map((m) => ({
      speaker: m.speaker,
      role: m.role,
      content: m.content,
    })),
  );

  const speaker =
    world.characters[Math.floor(Math.random() * world.characters.length)];

  const response: ChatResponse = {
    message: {
      id: crypto.randomUUID(),
      speaker: speaker.name,
      role: "character",
      content: `I heard you say "${userMessage}". I'm only a mock response for now.`,
    },

    sceneChanged: false,
  };

  return NextResponse.json(response);
}
