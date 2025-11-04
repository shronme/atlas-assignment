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
import { enqueueLoan } from "./utils/jobQueue.js";

const app = express();

// Parse JSON bodies for POST/PUT requests
app.use(express.json());
const port = process.env.PORT || 3000;

app.use(validateApiKey);

app.post(
  "/loan",
  validateLoanRequest,
  handleValidationResult,
  async (_req: Request, res: Response) => {
    const payload: LoanInput = _req.body;
    const zipcode = payload.propertyAddress.split(" ").pop()! || "00000";

    // Enqueue for background processing and return immediately.
    // We don't await getCrimegrade here to keep the request fast; the
    // background worker will fetch crime-grade and complete processing.
    const jobId = enqueueLoan(payload);
    console.log(`Enqueued loan job ${jobId} for zipcode ${zipcode}`);
    // Return 200 OK immediately; 202 Accepted would be more RESTful but
    // returning 200 to match your preference.
    return res.status(200).json({ status: "processing" });
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
