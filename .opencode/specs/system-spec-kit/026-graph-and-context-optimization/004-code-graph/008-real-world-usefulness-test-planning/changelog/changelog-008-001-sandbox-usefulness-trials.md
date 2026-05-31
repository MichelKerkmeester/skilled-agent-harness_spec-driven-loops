---
title: "Code Graph 008-001: Real-World Usefulness Test Execution"
description: "Sandbox trial execution for the code graph and hooks usefulness campaign. 74 trial-log rows, aggregated metrics, per-scenario deltas and a synthesis report classifying code graph as useful, hooks as mixed and plugin/runtime integration as overhead under sandbox constraints."
trigger_phrases:
  - "sandbox usefulness trials"
  - "008-001 usefulness execution"
  - "code graph usefulness test execution"
  - "trial log jsonl 74 rows"
  - "usefulness synthesis report"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-06

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph/008-real-world-usefulness-test-planning/001-sandbox-usefulness-trials` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph/008-real-world-usefulness-test-planning`

### Summary

The parent campaign had a 58-cell usefulness matrix but no empirical evidence yet. Many cells required authenticated external CLIs, network access, native Claude Code or OpenCode sessions or live compaction state that the sandbox cannot reproduce. This execution sub-phase ran every cell the sandbox could reach, preserved raw outputs and paired controls, aggregated metrics and named the cells that need a live follow-up.

Seventy-four trial-log rows were written: 36 completed assisted rows, 3 blocked assisted rows and 35 control rows. The synthesis classified code graph as useful, hooks as mixed and plugin/runtime integration as overhead under sandbox constraints. External CLI smoke checks were attempted and recorded as blocked rather than fabricated as passing.

### Added

- `trials/trial-log.jsonl` append-only structured trial log with 74 rows (NEW)
- `trials/raw/` directory holding raw assisted output and blocked external smoke records (NEW)
- `trials/control/` directory holding manual control workflow records (NEW)
- `analysis/aggregated-metrics.md` scenario and CLI metrics aggregation (NEW)
- `analysis/per-scenario-deltas.md` assisted-vs-control deltas by scenario (NEW)
- `synthesis-report.md` verdict, wins, overheads, deferred cells, backlog and confidence note (NEW)
- `decision-record.md` capturing execution ADRs for deferrals and scoring mechanics (NEW)

### Changed

- `spec.md` updated to declare execution scope, sandbox limits and out-of-scope fabrication rule
- `plan.md` updated to list completed sandbox-direct cells and deferred live/runtime cells with reasons
- `tasks.md` updated to track one task per planned matrix cell plus analysis and synthesis tasks
- `checklist.md` updated to record P0/P1/P2 evidence for completed and deferred work
- `implementation-summary.md` updated to summarize trials, verdicts and validation status

### Fixed

None.

### Verification

| Check | Result |
|-------|--------|
| Parent docs read | PASS: `../spec.md`, `../plan.md`, `../tasks.md` and `../decision-record.md` read before execution |
| Trial log entries | PASS: 74 rows written to `trials/trial-log.jsonl` |
| Analysis docs | PASS: `analysis/aggregated-metrics.md` and `analysis/per-scenario-deltas.md` written |
| Synthesis report | PASS: `synthesis-report.md` written with verdict, wins, overheads, deferrals and backlog sections |
| Strict validation | PASS: `validate.sh --strict` exited 0 after final docs update |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `trials/trial-log.jsonl` | Create (NEW) | Append-only JSONL log. 74 rows covering completed, blocked and control trials. |
| `trials/raw/` | Create (NEW) | Raw assisted outputs and blocked external smoke records. |
| `trials/control/` | Create (NEW) | Manual control workflow records paired to each assisted trial. |
| `analysis/aggregated-metrics.md` | Create (NEW) | Mean time, token estimates, hit rate, relevance and usefulness by scenario and CLI. |
| `analysis/per-scenario-deltas.md` | Create (NEW) | Assisted-vs-control delta table by scenario. |
| `synthesis-report.md` | Create (NEW) | Verdict section classifying code graph, hooks and runtime integration. Includes wins, overheads, deferred cells and backlog. |
| `decision-record.md` | Create (NEW) | ADRs covering sandbox deferral rationale and scoring mechanics. |
| `spec.md` | Update | Added execution scope, sandbox limits and out-of-scope fabrication rule. |
| `plan.md` | Update | Completed cell list and deferred cell list with sandbox-blocked reasons. |
| `tasks.md` | Update | One task per matrix cell. Analysis and synthesis tasks added. |
| `checklist.md` | Update | P0/P1/P2 evidence rows for completed and deferred work. |
| `implementation-summary.md` | Update | What Was Built, trial corpus counts, synthesis verdicts and verification table. |

### Follow-Ups

- Complete deferred runtime cells once authenticated external CLI access is available. S-PL-01 through S-PL-04 require DNS and auth that the sandbox blocked.
- Measure compaction recovery. S-HK-04 requires a real long-running session with an observed compaction event.
- Treat control timings as lower bounds. Shell `rg` timings are faster than a real human orientation workflow and should be recalibrated with a live engineer baseline.
- Replace token estimates with actual counts. Local tools did not expose model-token accounting. A live run can record real token usage.
