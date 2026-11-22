---
id: weekday-deep-review
trigger: {kind: cron, expression: "0 9 * * 1-5"}
runtime: {kind: cli-opencode, model: deepseek-v4-flash}
budget: {maxIterations: 6}
---
Run a deep review of the changes merged since the last run and write the findings.
