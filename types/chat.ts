import { Message } from "./message";

export interface ChatResponse {
  message?: Message;

  narration?: string;

  sceneChanged: boolean;

  newScene?: string;

  backgroundPrompt?: string;
}
