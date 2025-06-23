import express, { NextFunction } from "express";
import { HighScoreRequest } from "../types";

export async function validateHighScoreSubmission(
  req: HighScoreRequest,
  res: express.Response,
  next: express.NextFunction
) {
  const { player, guesses, timeTakeInSeconds } = req.body;

  const errors: string[] = [];

  if (typeof player !== "string" || player.trim() === "") {
    errors.push("player must be a non-empty string");
  }

  if (typeof guesses !== "number" || isNaN(guesses)) {
    errors.push("guesses must be a valid number");
  }

  if (typeof timeTakeInSeconds !== "number" || isNaN(timeTakeInSeconds)) {
    errors.push("timeTakeInSeconds must be a valid number");
  }

  if (errors.length > 0) {
    res.status(400).json({ error: "Invalid request body", details: errors });
  } else {
    next();
  }
}
