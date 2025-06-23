import { Request } from "express";

export interface HighScore {
  id: string;
  player: string;
  guesses: number;
  timeTakeInSeconds: number;
}

export type HighScorePostRequestBody = Omit<HighScore, "id">;

export type HighScoreRequest = Request<{}, {}, HighScorePostRequestBody>;
