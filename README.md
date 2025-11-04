# Atlas Invest assignment

This project includes a BE app for processing loans.

## Prequisite

- The app is using the Anchor web agent. To run the app, you'll need an API from Anchor.
  Go to https://anchorbrowser.io/ to create an account and retrieve an API key
- copy the .env.example into your own .env file and add the proper API keys

## How to run the app

Use makefile commands to run the app

**Build the containers**

```bash
   make build
```

**Start the containers**

```bash
   make up
```

**See the logs**

```bash
   make logs
```

**Stop the containers**

```bash
   make down
```

**Run migrations**

```bash
   make migrate
```

**Run tests**

```bash
   make test
```

## Solution description

### Frameworks in use

- Express for web framework
- Prisma for SQL DB handling
- Vitest for unit testing

## Solution architecture

- index.ts
  - The file holds the API routes. Each endpoint goes through api key validation and performs the actions
  - Some of the design decisions:
    - Post endpoint: Since this endpoint triggers the loan processing, it also triggers the agent that scrapes the crimegrade website. Since this process can take a while, I decided to perform the loan processing offline in a background worker and reply to the API call quickly.
      The worker calls the agent and then processes the eligibility criteria and saves it all to the DB
    - Get endpoint: I decided to use the UUID and not the numerical id as the identifier for security reasons. In cases where network sniffers detect the numerical id, it gives them an idea of the internal workings of the loans DB. Using a UUID reducec this risk.
- utils/anchor.ts
  - This file creates and runs the anchor web agent. For the sake of saving time, I thougt it's better to use off the shelf agent that can handle web scraping instead of implementing one from scratch.
    The agents prompt and configuration can be improved to better handle bot detection, but that an iterative process I didn't have enough time for.
- utils/jobQueue.ts
  - This file handles the queueing and processing of the background job that handles the web agent and loan eligibility checks. It also has a simple retry mechanism in case of a fail
- utils/loanProcessing.ts
  - This file handles the eligibility checks and DB saving of the loan
