---
id: nightly-digest
trigger: {kind: cron, expression: "0 9 * * *"}
runtime: {kind: native}
budget: {maxIterations: 4, timeoutSeconds: 600}
isolation: shared
delivery: {targets: [desktop, slack:ops]}
---
Summarize the commits merged since the last run into a short digest.
