import type { Request, Response, NextFunction } from "express";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn(
    `[${new Date().toISOString()}] Warning: API_KEY environment variable is not set`
  );
}

// Middleware to validate API key
export const validateApiKey = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const timestamp = new Date().toISOString();
  const providedKey = req.headers["x-api-key"];

  if (!API_KEY) {
    console.error(
      `[${timestamp}] API Key validation failed: Server configuration error - API key not configured`
    );
    return res
      .status(500)
      .json({ error: "Server configuration error: API key not configured" });
  }

  if (!providedKey) {
    console.warn(
      `[${timestamp}] API Key validation failed: Missing API key header for ${req.method} ${req.path}`
    );
    return res
      .status(401)
      .json({ error: "Missing API key. Please provide x-api-key header" });
  }

  if (providedKey !== API_KEY) {
    console.warn(
      `[${timestamp}] API Key validation failed: Invalid API key provided for ${req.method} ${req.path}`
    );
    return res.status(403).json({ error: "Invalid API key" });
  }

  console.log(
    `[${timestamp}] API Key validated successfully for ${req.method} ${req.path}`
  );
  next();
};
