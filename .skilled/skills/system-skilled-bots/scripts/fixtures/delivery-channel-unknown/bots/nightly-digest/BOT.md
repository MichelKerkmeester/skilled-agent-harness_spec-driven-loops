---
id: nightly-digest
trigger: {kind: cron, expression: "0 9 * * *"}
runtime: {kind: cli-codex}
budget: {maxIterations: 4, timeoutSeconds: 600}
isolation: shared
delivery: {targets: [desktop, email:ops]}
---
Summarize the commits merged since the last run into a short digest.
