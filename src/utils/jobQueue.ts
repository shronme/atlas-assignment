import { loanProcessing, type LoanInput } from "./loanProcessing.js";
import { getCrimegrade } from "./anchor.js";

type Job = {
  id: string;
  payload: LoanInput;
  crimeGradeData?: { zipcode: string; crimeGrade: string };
  attempts: number;
};

const queue: Job[] = [];
let running = false;

const processJob = async (job: Job) => {
  try {
    console.log(`[jobQueue] Processing job ${job.id}`);
    // If crime grade data wasn't pre-fetched, compute it now (offline)
    let crimeGradeData = job.crimeGradeData;
    if (!crimeGradeData) {
      const zipcode = job.payload.propertyAddress.split(" ").pop() || "00000";
      try {
        // cast because getCrimegrade returns an external type
        crimeGradeData = (await getCrimegrade(zipcode)) as {
          zipcode: string;
          crimeGrade: string;
        };
      } catch (e) {
        console.error(
          "[jobQueue] Failed to fetch crime grade, using Unknown",
          e
        );
        crimeGradeData = { zipcode, crimeGrade: "Unknown" };
      }
    }
    await loanProcessing(job.payload, crimeGradeData);
    console.log(`[jobQueue] Job ${job.id} completed`);
  } catch (err) {
    console.error(`[jobQueue] Job ${job.id} failed:`, err);
  }
};

const worker = async () => {
  if (running) return;
  running = true;
  while (queue.length > 0) {
    const job = queue.shift()!;
    // process without blocking the event loop too long
    // but await to keep ordering
    // eslint-disable-next-line no-await-in-loop
    await processJob(job);
  }
  running = false;
};

export const enqueueLoan = (
  payload: LoanInput,
  crimeGradeData?: { zipcode: string; crimeGrade: string }
) => {
  // generate a simple id without adding a new dependency
  const id = `${Date.now().toString(36)}-${Math.floor(Math.random() * 1e6)}`;
  const job: Job = Object.assign(
    { id, payload, attempts: 0 },
    crimeGradeData ? { crimeGradeData } : {}
  );
  queue.push(job);
  // kick the worker (non-blocking)
  setImmediate(worker);
  return job.id;
};

export const queueLength = () => queue.length;

// Start a periodic worker to pick up any stray jobs (in case setImmediate misses)
setInterval(() => {
  if (!running && queue.length > 0) setImmediate(worker);
}, 5000);
