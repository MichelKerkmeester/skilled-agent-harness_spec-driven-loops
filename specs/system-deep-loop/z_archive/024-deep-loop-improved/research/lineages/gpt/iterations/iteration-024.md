# Iteration 24: Shared Root Cause Hypothesis

## Focus

Assess whether drift is one generator/backfill issue or independent patches.

## Findings

- Phase 009/004 states the phase-map rows and completion_pct drift are both a never-synced-after-completion problem and proposes one idempotent sync script. [SOURCE: .opencode/specs/deep-loops/030-agent-loops-improved/009-research-backlog-remediation/004-phase-doc-map-and-completion-pct-sync/spec.md:60] [SOURCE: .opencode/specs/deep-loops/030-agent-loops-improved/009-research-backlog-remediation/004-phase-doc-map-and-completion-pct-sync/spec.md:63]
- The 009 graph metadata drift shows the same class extends to graph/description backfill, not only Markdown phase tables. [SOURCE: .opencode/specs/deep-loops/030-agent-loops-improved/009-research-backlog-remediation/graph-metadata.json:6] [SOURCE: .opencode/specs/deep-loops/030-agent-loops-improved/009-research-backlog-remediation/description.json:3]

## Novelty

newInfoRatio: 0.51. Root cause is shared stale generation/backfill plus missing semantic validation.
