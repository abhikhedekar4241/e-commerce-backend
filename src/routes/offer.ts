import { Router } from "express";

/**
 * Handles offer related routes.
 */
export const offerRouter = Router().get("/", function (req, res) {
  res.json({ message: "All good boss" });
});

export default { offerRouter };
