---
id: every-five
trigger: {kind: cron, expression: "*/5 * * * *"}
runtime: {kind: cli-codex}
budget: {maxIterations: 4, timeoutSeconds: 600}
isolation: shared
delivery: local-only
---
Report the queue depth every five minutes.
