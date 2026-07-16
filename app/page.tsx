"use client";

import { useState } from "react";
import { World } from "@/types/world";
import { Message } from "@/types/message";
import WorldView from "@/components/WorldView";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [world, setWorld] = useState<World | null>(null);

  if (world) {
    return <WorldView world={world} />;
  }

  const handleGenerate = async () => {
    const response = await fetch("/api/generate-world", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(data);
      alert(data.error || "Failed to generate world");
      return;
    }

    setWorld(data);
  };

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-lg space-y-4">
        <h1 className="text-3xl font-bold text-center">
          What would you like today?
        </h1>

        <input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="I want to be a queen today..."
          className="w-full border rounded p-3"
        />

        <button onClick={handleGenerate} className="w-full border rounded p-3">
          Generate World
        </button>
      </div>
    </main>
  );
}
