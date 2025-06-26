import express from "express";
import chalk from "chalk";
import cors from "cors";
import { JSONFilePreset } from "lowdb/node";
import { HighScore, HighScoreRequest } from "./types";
import { validateHighScoreSubmission } from "./middleware/high-score";

interface Database {
  scores: HighScore[];
}

(async () => {
  console.log(chalk.gray(`💭 Loading database...`));
  const defaultData: Database = { scores: [] };
  const db = await JSONFilePreset("db.json", defaultData);

  console.log(chalk.green(`✅ Database loaded...`));

  console.log(chalk.gray(`💭 Initialising Express app...`));
  const app = express();
  const port = 3000;

  app.use(cors());
  app.use(express.json());

  app.get("/", (_req, res) => {
    res.send("✅ Welcome to the Memory Game API");
  });

  app.get("/api/high-scores", (_req, res) => {
    res.json(db.data?.scores ?? []);
  });

  app.post(
    "/api/high-scores",
    validateHighScoreSubmission,
    async (req: HighScoreRequest, res: express.Response) => {
      const { body } = req;
      const {
        player = "",
        guesses = 0,
        timeTakeInSeconds = 0,
        score = 0,
      } = body;
      const id = crypto.randomUUID();

      const newScore: HighScore = {
        id,
        player,
        guesses,
        timeTakeInSeconds,
        score,
      };

      try {
        // Update db.
        db.data.scores.push(newScore);
        await db.write();

        res.status(201).json(newScore);
      } catch (error) {
        res.status(500).json({
          error: "Unable to save score",
        });
      }
    }
  );

  console.log(chalk.green(`✅ Express initialised with routes...`));

  app.listen(port, () => {
    console.log(chalk.gray(`--------------------------------------`));
    console.log(chalk.green.bold("🚀 Server is running!"));
    console.log(chalk.blue(`🌐 URL: http://localhost:${port}`));
    console.log(
      chalk.gray(`📦 Environment: ${process.env.NODE_ENV || "development"}`)
    );
  });
})();
