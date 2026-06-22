---
title: "Implementation Summary: Deep Loop STOP-Input Corroboration"
description: "Runtime implementation summary for the STOP-input corroboration cluster. C1 through C6 are implemented in deep-loop-runtime with deterministic tests. Live benchmark calibration, workflow reported-novelty forwarding and namespace-aware graph-edge persistence remain explicit gates. C7 was already shipped in packet 030 commit 46812f12a8."
trigger_phrases:
  - "stop input corroboration implementation summary"
  - "newInfoRatio audit status"
  - "lag ceiling status"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/004-deep-loop/005-stop-input-corroboration"
    last_updated_at: "2026-06-19T13:46:00+02:00"
    last_updated_by: "codex"
    recent_action: "Implemented deep-loop-runtime C1-C6 runtime seams and deterministic tests"
    next_safe_action: "Run live benchmark calibration and wire workflow reported-novelty forwarding"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-004-005-replan"
      parent_session_id: null
    completion_pct: 80
    open_questions: []
    answered_questions: []
---
# Implementation Summary: Deep Loop STOP-Input Corroboration

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `028-memory-search-intelligence/004-deep-loop/005-stop-input-corroboration` |
| **Completed** | Runtime implementation complete. Live gates pending |
| **Level** | 2 |
| **Status** | complete |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

C1 through C6 were implemented in `.opencode/skills/deep-loop-runtime` with deterministic tests. C7 remains already-shipped via packet 030 commit `46812f12a8` and was not re-implemented. The cluster is complete as a runtime-scoped ship: every candidate landed behind a conservative default-off or benchmark-gated guard, so the live behavior gates (novelty floor/tolerance calibration, fanout lag ceiling, heartbeat cadence), the workflow reported-novelty forwarding and namespace-aware graph-edge persistence remain explicit downstream gates recorded under Known Limitations rather than incomplete core work.

| Candidate | Outcome |
|-----------|---------|
| C1 graph-novelty audit | Implemented `computeGraphNoveltyDelta` from graph rows and snapshots, with no model self-report input. Benchmark threshold calibration pending. |
| C2 reported-novelty STOP guard | Implemented `--reported-novelty`, `effectiveNovelty = max(reported, graphDelta)` and blocking `novelty_self_report_unverified`. An absent arg is a no-op. Workflow forwarding remains pending outside runtime. |
| C3 lag ceiling | Implemented pure cost-guard evaluator and fanout-pool warning event. Fanout default remains off until benchmarked. |
| C4 keep-both collision handling | Implemented same-id/different-content keep-both with content-derived ids and deterministic ordering. |
| C5 conflict record | Implemented `_conflicts` markers with `relation: 'CONTRADICTS'`. Namespace-aware graph-edge persistence remains a separate gate because fanout merge has no graph namespace inputs. |
| C6 progress heartbeat | Implemented configurable progress events in the lineage worker. Default `0` keeps current behavior until cadence is benchmarked. |

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-signals.ts` | Modified | Adds graph-observed novelty delta |
| `.opencode/skills/deep-loop-runtime/scripts/convergence.cjs` | Modified | Adds reported-novelty parsing, effective novelty and STOP blocker |
| `.opencode/skills/deep-loop-runtime/lib/council/cost-guards.cjs` | Modified | Adds lag-ceiling normalization/evaluator |
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-config.ts` | Modified | Adds default-off fanout lag/heartbeat config |
| `.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs` | Modified | Emits lag-ceiling warning events when configured |
| `.opencode/skills/deep-loop-runtime/scripts/fanout-merge.cjs` | Modified | Keeps both divergent same-id findings and marks conflicts |
| `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs` | Modified | Emits optional in-lineage progress events |
| `.opencode/skills/deep-loop-runtime/package.json` | Modified | Adds canonical `npm run typecheck` |
| `.opencode/skills/deep-loop-runtime/tsconfig.json` | Added | Source-only runtime TypeScript check |
| `.opencode/skills/deep-loop-runtime/tests/...` | Modified | Adds deterministic coverage for C1-C6 |
| `spec.md`, `tasks.md`, `checklist.md`, `implementation-summary.md` | Modified | Reconciles runtime implementation status and remaining gates |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementation stayed inside deep-loop-runtime. C1 and C2 harden structured STOP only when a runtime caller supplies `--reported-novelty`, which preserves existing callers. C3 and C6 are default-off in live fanout config because their defaults require calibration. C4 and C5 avoid downstream same-id clobber by rewriting divergent records to content-derived ids before any later id-scoped upsert.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep C1 before C2 | The independent graph delta is the input the STOP gate consumes. |
| Leave workflow forwarding pending | The requested code scope was deep-loop-runtime, and the workflow reducer file was outside that subsystem. |
| Keep C3 additive and default-off in fanout | The existing cost-guard return remains advisory, while live tripwire defaults need benchmark calibration. |
| Rewrite divergent same-id records to content-derived ids | Downstream id-scoped upsert would clobber same-id bodies. Unique ids preserve both sides. |
| Keep C6 default disabled until measured | The heartbeat cadence can add ledger noise if the default is wrong. |
| Do not rebuild C7 | Packet 030 commit `46812f12a8` already shipped the shutdown-summary half. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Baseline | PASS: broad related Vitest was `6 files / 83 tests`. Baseline `npm run typecheck` failed because no script existed |
| `node --check` | PASS: `convergence.cjs`, `cost-guards.cjs`, `fanout-merge.cjs`, `fanout-pool.cjs`, `fanout-run.cjs` |
| `npm run typecheck` | PASS: 0 errors |
| Broad related Vitest | PASS: `7 files / 136 tests` |
| Dependency discipline | PASS: no candidate depends on D2 reliability |
| Strict packet validation | PASS: 0 errors / 0 warnings |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Benchmark calibration remains pending.** Novelty floor/tolerance, fanout lag ceiling and heartbeat cadence need real histories before any default-on behavior.
2. **Workflow forwarding remains pending.** `convergence.cjs` accepts `--reported-novelty`, but the deep-research reducer/orchestrator was not modified in this runtime-scoped pass.
3. **Namespace-aware graph-edge persistence remains pending.** Fanout merge emits `_conflicts` markers. It does not write graph edges because it has no graph namespace input.
4. **No independent adversarial review seat was run.** Deterministic fixtures cover the anti-gaming and merge behaviors. The T024 review gate remains open.
<!-- /ANCHOR:limitations -->
