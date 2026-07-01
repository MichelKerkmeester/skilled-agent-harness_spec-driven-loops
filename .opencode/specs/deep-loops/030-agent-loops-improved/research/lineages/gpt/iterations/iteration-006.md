# Iteration 6: Lineage Timeout Ceiling

## Focus

Re-check timeout cap status.

## Findings

- `computeLineageTimeoutMs` still hard-caps lineage execution at 4 hours with no visible override argument. [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:884] [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:887]
- Phase `009/002` already scopes the missing `--lineage-timeout-hours` flag, but all implementation tasks remain unchecked. [SOURCE: .opencode/specs/deep-loops/030-agent-loops-improved/009-research-backlog-remediation/002-fanout-timeout-override/tasks.md:52] [SOURCE: .opencode/specs/deep-loops/030-agent-loops-improved/009-research-backlog-remediation/002-fanout-timeout-override/tasks.md:63]

## Novelty

newInfoRatio: 0.55. Still live, now planned but not implemented.
