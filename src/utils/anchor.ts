import AnchorClient from "anchorbrowser";

const anchorClient = new AnchorClient({
  apiKey: process.env.ANCHOR_API_KEY,
});

// const config = {
//   browser: {
//     web_bot_auth: {
//       active: true,
//     },
//   },
//   proxy: {
//     active: true,
//     type: "anchor_residential",
//     country_code: "us",
//   },
// } as any;
// const session = await anchorClient.sessions.create(config);

// const sessionId: string = session.data?.id || "";
// console.log("Anchor session created with ID:", sessionId);
export const getCrimegrade = async (zipcode: string) => {
  const executionStepLogs = [];

  const result = await anchorClient.agent.task(
    "go to url https://crimegrade.org/ , if challenged by cloudflare, click that you are not a bot," +
      "as a human might do, then put in the zipcode " +
      zipcode +
      " and click Explore. In the next page get the crime grade for the area," +
      "from the box under the map where it says Overall Crime GradeTM. " +
      'Always return only with a JSON {"zipcode": zipcode, "crimeGrade": grade}, no text except for the JSON' +
      'If you failed to find the information, return {"zipcode": zipcode, "crimeGrade": "Unknown"}' +
      "If blocked by cloudflare or unable to access the site, try searching with duckduckgo or " +
      "google and see if the search results or the AI summary provide the information",
    {
      taskOptions: {
        onAgentStep: (executionStep) => {
          console.log("Agent step:", executionStep);
          executionStepLogs.push(executionStep);
        },
        agent: "openai-cua",
        detectElements: true,
      },
      // sessionId: sessionId,
    }
  );
  console.log("Task result:", result);

  // Simpler behavior: only accept the result if it is exactly the expected
  // shape { zipcode: string, crimeGrade: string }. Otherwise return the
  // default with crimeGrade set to "Unknown" and zipcode set to the input.
  const defaultResult = { zipcode, crimeGrade: "Unknown" };

  const isExactFormat = (obj: any) => {
    if (!obj || typeof obj !== "object") return false;
    const keys = Object.keys(obj);
    if (keys.length !== 2) return false;
    return (
      keys.includes("zipcode") &&
      keys.includes("crimeGrade") &&
      typeof obj.zipcode === "string" &&
      typeof obj.crimeGrade === "string"
    );
  };

  if (isExactFormat(result)) {
    return result;
  }

  return defaultResult;
};
