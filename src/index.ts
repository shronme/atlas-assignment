import "dotenv/config";
import express from "express";
import type { Request, Response } from "express";
import { prisma } from "./lib/prisma.js";
import { validateApiKey } from "./middleware/auth.js";
import {
  validateLoanRequest,
  handleValidationResult,
} from "./middleware/validators.js";
import { getCrimegrade } from "./utils/anchor.js";
import { loanProcessing, type LoanInput } from "./utils/loanProcessing.js";

const app = express();

// Parse JSON bodies for POST/PUT requests
app.use(express.json());
const port = process.env.PORT || 3000;

app.use(validateApiKey);

app.get("/", async (_req: Request, res: Response) => {
  const data = await getCrimegrade("90210");
  res.send("Data retrieved " + data);
});

app.post(
  "/loan",
  validateLoanRequest,
  handleValidationResult,
  async (_req: Request, res: Response) => {
    const payload: LoanInput = _req.body;
    const zipcode = payload.propertyAddress.split(" ").pop()! || "00000";
    const crimeGradeData = await getCrimegrade(zipcode);
    const loan = await loanProcessing(payload, crimeGradeData);
    console.log("Created loan request:", loan);
    return res.status(201).json(loan);
  }
);

app.get("/loan/:id", async (_req: Request, res: Response) => {
  const loanUUID = _req.params.id;
  if (!loanUUID) return res.status(400).json({ error: "Invalid id" });

  const loan = await prisma.loan.findFirst({
    where: { uuid: loanUUID as string },
  });
  if (!loan) return res.status(404).json({ error: "Loan not found" });
  return res.json(loan);
});

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
