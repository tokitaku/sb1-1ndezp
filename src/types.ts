export interface Question {
  id: number;
  question: string;
  answer: string;
}

export interface GameState {
  currentQuestion: number;
  score: number;
  gameMode: 'quiz' | 'attack25' | 'board';
  isPlaying: boolean;
  teams: Team[];
}

export interface Team {
  id: number;
  name: string;
  score: number;
  color: string;
}