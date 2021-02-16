/**
 * Pre-start is where we want to place things that must run BEFORE the express server is started.
 * This is useful for environment variables, command-line arguments, and cron-jobs.
 */

import path from "path";
import dotenv from "dotenv";
import commandLineArgs from "command-line-args";
import mongoose from "mongoose";

(() => {
  // Setup command line options
  const options = commandLineArgs([
    {
      name: "env",
      alias: "e",
      defaultValue: "development",
      type: String,
    },
  ]);

  process.on("uncaughtException", (err) => {
    console.log("UNCAUGHT EXCEPTION! Shutting down...");
    console.log(err.name, err.message);
    process.exit(1);
  });

  // Set the env file
  const result2 = dotenv.config({
    path: path.join(__dirname, `env/${options.env}.env`),
  });
  if (result2.error) {
    throw result2.error;
  }

  const DB = (process.env.DATABASE as string).replace(
    "<PASSWORD>",
    process.env.DATABASE_PASSWORD as string
  );

  mongoose
    .connect(DB, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    })
    .then(() => console.log("Database connection successful!"));
})();
