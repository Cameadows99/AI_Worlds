import { useEffect, useRef, useState } from "react";

import { DEV_CONFIG } from "@/config/dev";

import { World } from "@/types/world";
import { Message } from "@/types/message";
import { ChatResponse } from "@/types/chat";

interface WorldViewProps {
  world: World;
}

export default function WorldView({ world }: WorldViewProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: crypto.randomUUID(),
      speaker: "Narrator",
      role: "narrator",
      content: world.openingMessage,
    },
  ]);

  const [input, setInput] = useState("");
  const [showWorldDetails, setShowWorldDetails] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userInput = input;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      speaker: "You",
      role: "user",
      content: userInput,
    };

    setMessages((current) => [...current, userMessage]);

    setInput("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          world,
          messages,
          userMessage: userInput,
        }),
      });

      const response: ChatResponse = await res.json();

      setMessages((current) => [...current, response.message]);

      if (DEV_CONFIG.allowSceneChanges && response.sceneChanged) {
        console.log("Scene would change:", response.newScene);
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="relative h-screen overflow-hidden text-white">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-900 to-black" />

      {/* Slight darkening at bottom for readability */}
      <div className="absolute inset-x-0 bottom-0 h-[45%] bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />

      {/* Overlay */}
      <div className="relative flex h-full flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5">
          <h1 className="text-2xl font-semibold tracking-wide">
            {world.worldName}
          </h1>

          <button
            onClick={() => setShowWorldDetails(!showWorldDetails)}
            className="rounded-full border border-white/15 bg-black/20 backdrop-blur-md px-4 py-2 text-sm transition hover:bg-black/35"
          >
            {showWorldDetails ? "Hide World" : "World"}
          </button>
        </div>

        {showWorldDetails && (
          <div className="mx-5 mb-4 rounded-2xl border border-white/15 bg-black/25 backdrop-blur-md p-5">
            <p>
              <strong>Theme:</strong> {world.theme}
            </p>

            <p className="mt-2">
              <strong>Scene:</strong> {world.scene}
            </p>

            <div className="mt-4">
              <strong>Characters</strong>

              <ul className="mt-2 space-y-1">
                {world.characters.map((character) => (
                  <li key={character.name}>
                    {character.name} — {character.personality}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Push conversation toward the bottom */}
        <div className="flex-1" />

        {/* Conversation */}
        <div className="h-[38vh] overflow-y-auto px-10">
          <div className="space-y-6">
            {messages.map((message) => {
              if (message.role === "narrator") {
                return (
                  <div
                    key={message.id}
                    className="text-center italic text-white/70"
                  >
                    {message.content}
                  </div>
                );
              }

              if (message.role === "user") {
                return (
                  <div key={message.id} className="flex justify-end">
                    <div className="max-w-xs">
                      <p className="mb-1 text-right text-[11px] text-white/50">
                        {message.speaker}
                      </p>

                      <div
                        className="
                        inline-block

                        rounded-xl

                        border border-white/10

                        bg-black/15

                        backdrop-blur-lg

                        px-3
                        py-2

                        text-sm
                      "
                      >
                        {message.content}
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <div key={message.id} className="flex justify-start">
                  <div className="max-w-xs">
                    <p className="mb-1 text-[11px] text-white/50">
                      ● {message.speaker}
                    </p>

                    <div
                      className="
                      inline-block

                      rounded-xl

                      border border-white/10

                      bg-black/15

                      backdrop-blur-lg

                      px-3
                      py-2

                      text-sm
                    "
                    >
                      {message.content}
                    </div>
                  </div>
                </div>
              );
            })}

            <div ref={bottomRef} />
          </div>
        </div>

        {/* Input */}
        <div className="p-5">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex gap-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="What do you want to say?"
              className="
              flex-1

              rounded-full

              border border-white/15

              bg-black/20

              backdrop-blur-lg

              px-5
              py-3

              text-sm

              placeholder:text-white/40

              outline-none
            "
            />

            <button
              type="submit"
              className="
              rounded-full

              border border-white/15

              bg-black/20

              backdrop-blur-lg

              px-6

              transition

              hover:bg-black/30
            "
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
