---
title: "Changelog: Convergence Design and Hardening [009-research-backlog-remediation/009-convergence-design-and-hardening]"
description: "Chronological changelog for the Convergence Design and Hardening phase."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-07-01

> Spec folder: `.opencode/specs/deep-loops/030-agent-loops-improved/009-research-backlog-remediation/009-convergence-design-and-hardening` (Level 1)
> Parent packet: `.opencode/specs/deep-loops/030-agent-loops-improved/009-research-backlog-remediation`

### Summary

A sliding-window convergence mode was evaluated against generation-2 evidence that full-history denominator drag is mathematically real and deferred to a follow-up phase rather than built now. Two hardening items already existed and were confirmed and tested, and two genuinely new hardening items, stall alerting and a per-lineage cost cap, were built.

### Added

- Add `decision-record.md` recommending deferral of the sliding-window convergence mode to a follow-up phase, citing generation-2 evidence down to the raw lineage iteration files.
- Add `startLineageStallWatchdog()` in `fanout-run.cjs`, emitting a `stall_detected` event when a lineage's event stream goes quiet past a configurable threshold.
- Add `evaluateLineageBudgetCap()`, mirroring the `deep-ai-council` cost-guard pattern, enforced before a lineage's CLI subprocess is spawned.

### Changed

- `statusForLedgerEvent()` now maps the new `stall_detected` and `budget_cap_exceeded` events to typed statuses.

### Fixed

- Confirmed the pre-existing lag-ceiling status mapping was already correct and added a direct regression test for it.
- Confirmed near-duplicate finding dedup already existed and works, and documented the explicit decision to keep it opt-in rather than flip its default.

### Verification

- Targeted `fanout-run.vitest.ts` run, PASS, 40 of 40.
- Full `deep-loop-runtime` Vitest suite run, PASS, 563 of 565, the same pre-existing unrelated baseline failures noted throughout this remediation phase.
- Every cited decision-record evidence line spot-checked directly against the real source files, no fabrication.

### Files Changed

| File | Action | What changed |
|---|---|---|
| `009-convergence-design-and-hardening/decision-record.md` | Added | Sliding-window convergence design decision. |
| `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs` | Modified | Stall watchdog and budget-cap evaluator plus enforcement. |
| `.opencode/skills/deep-loop-runtime/tests/unit/fanout-run.vitest.ts` | Modified | Added the 4 new hardening regression tests. |

### Follow-Ups

- The sliding-window convergence mode is a documented follow-up, not shipped in this phase, matching the packet's own explicit scope boundary.
- The per-lineage budget cap measures configured cost units rather than real measured per-lineage token consumption, since the runtime does not currently track that telemetry.
