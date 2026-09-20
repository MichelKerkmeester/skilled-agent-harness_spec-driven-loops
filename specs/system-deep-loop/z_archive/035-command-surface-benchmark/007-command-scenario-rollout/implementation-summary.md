---
title: "Implementation Summary: command scenario rollout"
description: "Authoring record for DAB-016 to 027, command-suite reconciliation, and the deferred live Claude baseline."
status: in_progress
trigger_phrases:
  - "command scenario rollout implementation"
  - "DAB-016 to 027 authoring"
  - "command benchmark baseline deferred"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/035-command-surface-benchmark/007-command-scenario-rollout"
    last_updated_at: "2026-07-15T11:35:00Z"
    last_updated_by: "claude"
    recent_action: "Authored DAB-016 to 027; fixed 6 sentinels + direct_dispatch min_task_events"
    next_safe_action: "Capture the sixteen live Claude baseline cells after operator green-light"
    blockers:
      - "Live Claude baseline capture is deferred pending operator green-light"
    key_files:
      - ".opencode/skills/system-deep-loop/deep-alignment/scripts/tests/command-scenario-rollout.test.cjs"
      - ".opencode/skills/system-deep-loop/deep-alignment/behavior_benchmark/behavior_benchmark.md"
    completion_pct: 80
---
<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

# Implementation Summary

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
| --- | --- |
| **Spec Folder** | 007-command-scenario-rollout |
| **Completed** | Not complete; live baseline deferred |
| **Level** | 1 |
| **Status** | In Progress |
| **Completion** | 80% |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The rollout adds twelve schema-v2 scenarios and dedicated fixture roots to the four pilots already authored in DAB-012 to 015. The resulting command suite is exactly DAB-012 through DAB-027. The package index, pending Claude ledger, marker-source hashes, topology evidence, fixture boundaries, and frozen v1 scoring are reconciled by the phase-owned test.

### Command coverage

| ID | Command | Topology | Evidence kind | Expected interaction |
| --- | --- | --- | --- | --- |
| DAB-016 | `create/benchmark` | workflow router | `task_dispatch` | autonomous |
| DAB-017 | `design/audit` | workflow router | `task_dispatch` | autonomous |
| DAB-018 | `doctor/mcp install` | subaction router | `task_dispatch` | question_halt |
| DAB-019 | `doctor/mcp debug` | subaction router | `task_dispatch` | autonomous |
| DAB-020 | `doctor/mcp install --fix` | subaction router | `task_dispatch` | fail_fast |
| DAB-021 | `memory/learn list` | direct-tool/plugin router | `direct_dispatch` | autonomous |
| DAB-022 | `memory/learn budget` | direct-tool/plugin router | `direct_dispatch` | autonomous |
| DAB-023 | `memory/manage health` | direct-tool/plugin router | `direct_dispatch` | autonomous |
| DAB-024 | `memory/manage checkpoint list` | direct-tool/plugin router | `direct_dispatch` | autonomous |
| DAB-025 | `memory/save <fixture> --apply` | direct-tool/plugin router | `direct_dispatch` | autonomous |
| DAB-026 | `goal_opencode show` | direct-tool/plugin router | `direct_dispatch` | autonomous |
| DAB-027 | bare `agent_router` | monolithic | `task_dispatch` | question_halt |

### Files changed

| Surface | Action | Purpose |
| --- | --- | --- |
| DAB-016 through DAB-027 | Created | Add twelve topology-correct schema-v2 contracts |
| Twelve fixture roots | Created | Keep every probe and permitted write fixture-local |
| Benchmark index and Claude baseline | Modified | Reconcile the exact sixteen-cell suite and pending values |
| Phase-owned test | Created | Pin contracts, markers, baseline rows, and v1 scoring |
| Phase documents | Modified | Record delivered authoring and deferred capture |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The work was authored without live executor runs. Two hermetic Node tests verify the contract set and the frozen runner behavior; live Claude values remain pending until explicit operator green-light.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
| --- | --- |
| Keep direct-tool cells on literal MCP/plugin identifiers | The schema-v2 matcher accepts literal targets, making the required dispatch evidence specific and auditable. |
| Declare `min_task_events: 0` on every direct_dispatch cell | A direct-dispatch command hits its tool inline and forbids LEAF/Task events, so the task-event floor must be zero; the required direct-hit floor is enforced separately by the D3 evaluator's own default. Carrying the task-dispatch value of 1 structurally pinned D1 to 0 and made `pass` unreachable for read-only cells. Same correction was applied to the DAB-014 pilot from the prior phase. |
| Use `allow_prefixes: ["."]` for fixture-wide cells | A non-empty root-relative prefix permits fixture-local writes without classifying every fixture change as an escape. |
| Keep all sixteen Claude rows pending | No live executor was authorized, so inferred checkpoints would not be quotable evidence. |
| Preserve the shared framework, runner, and shared test | The rollout is contract authoring; evaluator behavior is frozen. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
| --- | --- |
| Phase-owned Node test | PASS: three assertions passed; only the live-baseline assertion skipped with the pending marker. |
| New contract parsing | PASS: DAB-016 through DAB-027 parse 12/12 as schema version 2 with topology-correct evidence kinds. |
| Full command suite | PASS: the test proves the exact DAB-012 through DAB-027 set and reconciles 16/16 index and pending baseline rows. |
| Frozen v1 scoring | PASS: DAB-001 through DAB-011 reproduce the existing golden fingerprints. |
| Shared hermetic runner test | PASS: `behavior-bench-run.test.cjs` exited 0. |
| Fixture boundaries | PASS: every new boundary is non-empty and agrees with its changed-path probe. |
| Live execution and evidence | PASS: no executor was invoked and no evidence directory was created. |
| Fixture sentinel probes | PASS: the six `text_contains` postconditions (DAB-021/022/023/024/026/027) each resolve `ok:true`; the declared `*_SENTINEL` marker is now present in every seed file it reads. |
| Direct-dispatch scoring floor | PASS: a flawless read-only simulation scores `d1:2 d2:2 d3:2 d4:2` → `pass` for all seven direct_dispatch cells; three negative controls (no target hit, forbidden-target hit, failing postcondition) each still resolve `partial`, proving discrimination is preserved. |
| Frozen evaluator unchanged | PASS: `git diff` on `behavior-bench-run.cjs`, `framework.md`, and the shared runner test is empty; the runner SHA pin and DAB-001 through DAB-011 golden are untouched. |
| Strict spec validation | PASS: `validate.sh --strict` Errors:0 Warnings:0 after graph metadata was regenerated and the Spec Folder value was recorded as a bare basename. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Live baseline deferred.** After operator green-light, capture all sixteen Claude cells, replace every pending value with quotable checkpoints and classifications, rerun reconciliation, and close the phase.
2. **Advisory `forbidden_targets` on task_dispatch cells (backlog).** DAB-016 and DAB-017, like the pre-existing pilots DAB-013/015/018/019/020/027, declare non-empty `forbidden_targets` on `task_dispatch` contracts. The evaluator reads expected/forbidden targets only for `direct_dispatch` cells, so on task_dispatch cells these arrays are inert, and a cell whose failure-mode prose promises a route-mismatch verdict describes a check the scorer does not perform. This is a pre-existing systemic pattern (noted as advisory in the 006 pilot), not a regression from this phase. Queued for the packet backlog: prune the dead fields or wire the task_dispatch forbidden-target semantics so prose and scorer agree. It does not affect the deferred live capture.
<!-- /ANCHOR:limitations -->
