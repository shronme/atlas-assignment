import AnchorClient from "anchorbrowser";

const anchorClient = new AnchorClient({
  apiKey: process.env.ANCHOR_API_KEY,
});

const config = {
  browser: {
    web_bot_auth: {
      active: true,
    },
  },
  proxy: {
    active: true,
    type: "anchor_residential",
    country_code: "us",
  },
} as any;
const session = await anchorClient.sessions.create(config);

const sessionId: string = session.data?.id || "";
console.log("Anchor session created with ID:", sessionId);
export const getCrimegrade = async (zipcode: string) => {
  const executionStepLogs = [];

  const result = await anchorClient.agent.task(
    "go to url https://crimegrade.org/ , if challenged by cloudflare, click that you are not a bot, as a human might do, then put in the zipcode " +
      zipcode +
      ' and click Explore. In the next page get the crime grade for the area, from the box under the map where it says Overall Crime GradeTM and return a JSON {"zipcode": zipcode, "crimeGrade": grade}',
    {
      taskOptions: {
        onAgentStep: (executionStep) => {
          console.log("Agent step:", executionStep);
          executionStepLogs.push(executionStep);
        },
      },
      sessionId: sessionId,
    }
  );
  console.log("Task result:", result);
};
