export interface Character {
  name: string;

  role: string;

  personality: string;

  appearance: string;

  goal: string;
}

export interface World {
  worldName: string;
  theme: string;
  scene: string;
  backgroundPrompt: string;

  characters: Character[];

  openingMessage: string;
}
