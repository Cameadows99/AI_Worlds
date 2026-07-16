export interface Message {
  id: string;

  speaker?: string;

  role: "user" | "character" | "narrator";

  content: string;
}
