---
id: nightly-digest
trigger: {kind: cron, expression: "0 9 * * *"}
runtime: {kind: cli-codex}
budget: {maxIterations: 4, timeoutSeconds: 7200}
isolation: shared
delivery: local-only
---
Summarize the commits merged since the last run into a short digest.
