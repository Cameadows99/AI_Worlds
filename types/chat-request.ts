import { World } from "./world";
import { Message } from "./message";

export interface ChatRequest {
  world: World;
  messages: Message[];
  userMessage: string;
}
