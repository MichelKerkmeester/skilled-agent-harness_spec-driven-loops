---
id: digest
routine:
  what: the morning digest
  starts:
    - {kind: cron, expression: "15 */6 * * *"}
  does: tell
  until: the digest is sent
runtime: {kind: cli-codex}
budget: {maxIterations: 4, timeoutSeconds: 600}
isolation: shared
delivery: {targets: [], onFailure: null}
---
Summarize the commits merged since the last run into a short digest.
