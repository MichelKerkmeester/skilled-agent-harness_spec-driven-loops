---
id: nightly-digest
trigger: {kind: webhook}
runtime: {kind: native}
budget: {maxIterations: 4, timeoutSeconds: 600}
isolation: shared
delivery: local-only
---
Summarize the commits merged since the last run into a short digest.
