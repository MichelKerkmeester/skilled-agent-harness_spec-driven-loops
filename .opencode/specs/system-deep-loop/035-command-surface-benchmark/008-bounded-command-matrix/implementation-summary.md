---
title: "Implementation Summary: bounded command matrix machinery"
description: "A hermetically verified 52-cell scheduler and manifest now gate deferred command-surface capture."
status: in-progress
trigger_phrases:
  - "bounded command matrix implementation"
  - "command behavior matrix scheduler"
  - "command matrix reconciliation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/035-command-surface-benchmark/008-bounded-command-matrix"
    last_updated_at: "2026-07-15T11:58:18Z"
    last_updated_by: "codex"
    recent_action: "Built bounded scheduler, 52-cell manifest, and hermetic reconciliation gate"
    next_safe_action: "Run operator-approved live driver cells, then contested reruns"
    blockers:
      - "Live capture requires operator green-light"
    key_files:
      - ".opencode/skills/system-deep-loop/deep-alignment/scripts/command-benchmark/run-command-behavior-matrix.cjs"
      - ".opencode/skills/system-deep-loop/deep-alignment/assets/command_benchmark/command_benchmark_matrix.json"
      - ".opencode/skills/system-deep-loop/deep-alignment/scripts/tests/command-behavior-matrix.test.cjs"
    completion_pct: 65
    open_questions:
      - "Which live GPT registry slugs and effort names are available at capture time?"
    answered_questions:
      - "Alignment fan-out is absent from ACTIVE_FANOUT_LOOP_TYPES."
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 008-bounded-command-matrix |
| **Status** | In progress; live capture deferred |
| **Completed** | Not complete; live capture deferred |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The command-surface benchmark now has a bounded, machine-reconciled execution plan that is fully testable without a model. The production manifest freezes 52 required cells across DAB-012..027: 48 driver cells from three legs over 16 scenarios, plus four representative alignment leaf sentinels. Every cell carries its scenario, leg, sample count, fixture hash reference, and either a result pointer or a machine-readable skip.

### Scheduler and manifest

The scheduler exposes only `--matrix` and `--out-dir`. Before accounting for a cell, it parses the scenario contract and recomputes the same recursive per-file SHA-256 map as the frozen runner. Runnable cells restore and recheck their fixture, invoke the runner as a child process, preserve retryable exit 75, and require the declared result file to reconcile. Skipped cells never spawn an executor.

### Fan-out gap decision

The shared runtime declares `const ACTIVE_FANOUT_LOOP_TYPES = new Set(['research', 'review']);` at `fanout-run.cjs:339`. Alignment fan-out is therefore not runnable in this phase. The four prior representative leaf profiles remain explicit `alignment_fanout_not_wired` skips; no live fan-out path was added.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `deep-alignment/scripts/command-benchmark/run-command-behavior-matrix.cjs` | Created | Verify fixtures, invoke the frozen runner, and reconcile required cells |
| `deep-alignment/assets/command_benchmark/command_benchmark_matrix.json` | Created | Freeze 52 bounded cells, 16 fixture hash maps, and skip reasons |
| `deep-alignment/scripts/tests/command-behavior-matrix.test.cjs` | Created | Prove skip, result, mismatch, and three-sample paths hermetically |
| `008-bounded-command-matrix/spec.md` | Modified | Record in-progress machinery and deferred live scope |
| `008-bounded-command-matrix/plan.md` | Modified | Record the implemented architecture and operator-gated next phase |
| `008-bounded-command-matrix/tasks.md` | Modified | Close machinery tasks with evidence and leave live tasks open |
| `008-bounded-command-matrix/implementation-summary.md` | Created | Capture current state, evidence, and limitations |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The runner's `BEHAVIOR_BENCH_SPAWN_JSON` seam drives a local Node process in the test suite, so the complete scheduler-to-runner path is verified without Claude, GPT, Codex, or OpenCode execution. Production reconciliation currently resolves every required cell as a predeclared skip.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Bound the matrix at 52 cells | Three driver legs across 16 scenarios plus four existing leaf profiles cover the intended axes without a universal cross-product |
| Keep production cells single-sample | The framework reserves three samples for cells made contested by actual evidence |
| Record the alignment gap instead of adding fan-out | The live alignment loop type is outside this deferred-live phase and the shared runtime currently rejects it |
| Spawn the runner instead of importing it | The scheduler stays independent of runner-owned result interpretation |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Scheduler and test syntax | PASS: `node --check` exits 0 |
| Phase-owned hermetic suite | PASS: `node --test` exits 0, 6 tests passed |
| G008 production command | PASS: exit 0; 52 required, 0 results, 52 skips, 0 retryable, 0 failures |
| Live model capture | NOT RUN: prohibited until operator green-light |
| Strict packet validation | PASS: `validate.sh --strict` Errors:0 Warnings:0 after `graph-metadata.json` was regenerated post-authoring |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Live variance is unmeasured.** The 48 driver cells remain deferred skips pending operator approval.
2. **Alignment leaves cannot run.** The four sentinels remain skips until alignment fan-out is implemented and live-tested.
3. **No production cell is contested yet.** The three-sample path is hermetically proven, but only live evidence can nominate a production rerun.
4. **Driver leg identifiers are provisional (backlog).** The `bounds.driverLegs` names and roles are placeholders to be revalidated against the live GPT registry when the matrix runs; the fast-tier leg names encode service tier plus effort and are not yet the final registry slugs.
5. **Skip-declaration guard is minimal (backlog).** `validateManifest` requires a string `reason` on each skip but does not yet enforce a non-empty machine `code`; every current cell carries a real code, and genuinely malformed cells (missing declaration, wrong types, unknown fixture ref) still hard-fail before reconciliation, so this is defense-in-depth hardening rather than a present hole.
<!-- /ANCHOR:limitations -->
