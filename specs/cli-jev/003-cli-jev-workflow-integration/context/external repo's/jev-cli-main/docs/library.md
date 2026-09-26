# Use from Node.js

The same functions the CLI uses are exported from the `jevctl` package, so you can embed judgments in a script without shelling out.

```ts
import { createAsk, runVerify, runScreen, runClassify, runCompact } from "jevctl";

const ask = createAsk({ provider: "auto", model: "jev-latest", timeoutMs: 30_000 });

const verdicts = await runVerify(ask, {
  claims: ["The ordinance mentions reflective gear."],
  evidence: [{ id: "ordinance", text: ordinanceText }],
  autoAccept: 0.8,
});
console.log(verdicts.results[0].verdict, verdicts.results[0].confidence);

const screened = await runScreen(ask, { text: pageHtml, purpose: "extract prices", blockAt: 0.75, reviewAt: 0.25 });
if (screened.recommendation.action === "block") throw new Error(screened.recommendation.reason);

const label = await runClassify(ask, {
  text: ticket,
  labels: [{ label: "billing", description: null }, { label: "technical", description: null }],
  other: true,
  minConfidence: 0.6,
});
```

Every `run*` function takes an `AskFn` first. `createAsk` builds one from the environment (or from stored credentials via `withStoredCredentials`); in tests, pass your own `async (state, questions) => ({ answers, usage, provider, model })`.

| Export | From |
| --- | --- |
| `runVerify`, `runScreen`, `runFind`, `runAsk`, `runClassify`, `runClassifyMulti`, `runClassifyTaxonomy`, `runExtract`, `runRerank`, `runMatch`, `runRoute`, `runCompact` | `core/*` |
| `build*Request` | The exact `state` and `questions` a command would send |
| `parseRows`, `runBatch` | Row parsing and the concurrency pool |
| `parseTranscript` | Claude Code session log or messages JSON to `Message[]` |
| `createAsk`, `resolveProvider`, `providerModel` | Providers |
| `resolveConfig`, `configPath` | Configuration |
| `resolveStore`, `withStoredCredentials` | Stored credentials |
| `compaction` | The vendored compaction library namespace |

Types are included. The package is ESM only.
