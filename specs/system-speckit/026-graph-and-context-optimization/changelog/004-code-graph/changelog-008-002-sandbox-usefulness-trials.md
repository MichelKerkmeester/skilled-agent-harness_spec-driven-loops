---
title: "Changelog: Real-World Usefulness Test Execution [008-real-world-usefulness-test-planning/002-sandbox-usefulness-trials]"
description: "Chronological changelog for the Real-World Usefulness Test Execution phase."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-15

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph/008-real-world-usefulness-test-planning/002-sandbox-usefulness-trials` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph/008-real-world-usefulness-test-planning`

### Summary

This execution packet turns the parent campaign from a plan into partial empirical evidence. It ran the sandboxable code graph and hook checks, preserved raw outputs, aggregated metrics, and named the runtime cells that need a live authenticated follow-up.

### Added

- Created Level 2 execution packet with spec.md, plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md, and metadata files.
- Established trials/raw/, trials/control/, and analysis/ directories with trial-log schema at trials/trial-log.jsonl.
- Produced analysis/aggregated-metrics.md and analysis/per-scenario-deltas.md summarizing scenario and CLI metrics with assisted-vs-control deltas.
- Authored synthesis-report.md with verdict, wins, overheads, deferrals, and backlog sections.

### Changed

- Updated parent graph-metadata.json children_ids to include 002-sandbox-usefulness-trials.
- Ran sandboxable trials across code graph, hook, advisor, Gate 3, and sk-code routing scenarios producing 74 trial-log rows (36 completed assisted, 3 blocked, 35 control).
- Recorded automatable-vs-deferred matrix in plan.md listing completed sandbox-direct cells and deferred live/runtime cells.
- Attempted external CLI smoke checks (cli-codex, cli-copilot, cli-opencode) and recorded blocked results with DNS/auth/browser-login reasons.
- Classified code graph as useful, hooks as mixed, and plugin/runtime integration as sandbox-limited overhead.

### Fixed

- None. This is an execution packet, not a production fix; finding-class and producer/consumer inventories are documented in plan.md and synthesis.

### Verification

- Parent docs read - PASS: ../spec.md, ../plan.md, ../tasks.md, and ../decision-record.md read before execution.
- Trial log entries - PASS: 74 rows written to trials/trial-log.jsonl.
- Analysis docs - PASS: analysis/aggregated-metrics.md and analysis/per-scenario-deltas.md written.
- Synthesis report - PASS: synthesis-report.md written with required sections.
- Strict validation - PASS: validate.sh --strict exited 0 after final docs update.
- Tasks complete - 38 completed task item(s) recorded

### Files Changed

| File | Action | What changed |
|---|---|---|
| `spec.md` | Update | Declared execution scope, requirements, and sandbox limits. |
| `plan.md` | Update | Listed completed sandbox-direct cells and deferred live/runtime cells. |
| `tasks.md` | Update | Tracked one task per planned matrix cell plus analysis and synthesis. |
| `checklist.md` | Update | Recorded P0/P1/P2 evidence for completed and deferred work. |
| `decision-record.md` | Create | Captured execution ADRs for deferrals and scoring mechanics. |
| `implementation-summary.md` | Update | Summarized trials, verdicts, and validation status. |
| `trials/trial-log.jsonl` | Create | Append-only structured trial log. |
| `trials/raw/` | Create | Raw assisted output and blocked external smoke outputs. |
| `trials/control/` | Create | Manual/control workflow records. |
| `analysis/aggregated-metrics.md` | Create | Scenario and CLI metrics aggregation. |
| `analysis/per-scenario-deltas.md` | Create | Assisted-vs-control deltas. |
| `synthesis-report.md` | Create | Verdict, wins, overheads, deferrals, and backlog. |

### Follow-Ups

- Runtime integration is sandbox-limited. External CLI cells did not complete model calls because of DNS/auth/browser-login blockers.
- Compaction recovery is unmeasured. S-HK-04 needs a real long-running session and compaction event.
- Controls are lower bounds. rg command timings are faster than a real human orientation workflow.
- Token counts are estimates. Local tools did not expose model-token metrics.
