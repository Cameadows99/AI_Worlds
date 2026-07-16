import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const mockWorld = {
  worldName: "Kingdom of Aurelia",
  theme: "Fantasy Castle",
  scene: "Royal Throne Room",
  backgroundPrompt: "A grand fantasy throne room with stained glass windows",

  characters: [
    {
      name: "Liondia",

      role: "Queen",

      personality: "Calm, intelligent and diplomatic.",

      appearance: "Long silver hair and emerald robes.",

      goal: "Prevent another war while protecting her people.",
    },
    {
      name: "Grub",

      role: "Royal Cook",

      personality: "Cheerful, loud, always hungry.",

      appearance: "Short with flour-covered clothes.",

      goal: "Prepare the greatest feast in the kingdom.",
    },
  ],

  openingMessage:
    "Your Majesty, the treasury has mysteriously vanished overnight.",
};

export async function POST(request: Request) {
  if (process.env.USE_MOCK_WORLD === "true") {
    return NextResponse.json(mockWorld);
  }
  try {
    const body = await request.json();
    const prompt = body.prompt;

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",

      messages: [
        {
          role: "system",
          content: `
You generate temporary AI chat worlds.

The user describes a role, world, mood, setting, or scenario.

Your job is to generate a world object.

Rules:

- Respect details provided by the user.
- Fill in missing details creatively.
- Create 3-5 characters.
- Create an interesting opening situation.
- Generate a theme.
- Generate a scene.
- Generate a background prompt.

Return ONLY valid JSON.

Schema:

{
  "worldName": string,
  "theme": string,
  "scene": string,
  "backgroundPrompt": string,
  "characters": [
    {
      "name": string,
      "personality": string
    }
  ],
  "openingMessage": string
}
`,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const content = completion.choices[0].message.content;

    if (!content) {
      return NextResponse.json(
        { error: "No content returned" },
        { status: 500 },
      );
    }

    const world = JSON.parse(content);

    return NextResponse.json(world);
  } catch (error) {
    console.error("WORLD GENERATION ERROR:", error);

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
      },
      {
        status: 500,
      },
    );
  }
}
