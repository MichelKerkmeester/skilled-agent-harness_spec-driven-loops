---
id: nightly-report
routine:
  what: the nightly report
  starts:
    - {kind: cron, expression: "0 2 * * *"}
  does: act
  until: the report is filed
  until_check: test -f reports/nightly.md
runtime: {kind: cli-codex}
budget: {maxIterations: 4, timeoutSeconds: 600}
isolation: shared
delivery: local-only
---
Write the nightly report to reports/nightly.md.
