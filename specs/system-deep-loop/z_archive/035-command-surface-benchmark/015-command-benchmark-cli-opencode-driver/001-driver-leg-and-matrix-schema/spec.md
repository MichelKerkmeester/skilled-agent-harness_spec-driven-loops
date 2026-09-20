---
title: "Spec: cli-opencode Driver Leg + Matrix Schema Extension"
description: "Add a fourth cli-opencode driver leg to the command-surface behavior benchmark and extend the matrix schema/config so it carries a selectable model/variant (default deepseek/deepseek-v4-pro --variant high), while reconciling the frozen requiredCellCount and fixture hashes coherently. Schema/config layer only; runner dispatch wiring is child 002. Runtime-affecting."
trigger_phrases:
  - "cli-opencode driver leg matrix schema"
  - "command benchmark opencode driver cell"
  - "extend behavior matrix requiredCellCount"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/035-command-surface-benchmark/015-command-benchmark-cli-opencode-driver/001-driver-leg-and-matrix-schema"
    last_updated_at: "2026-07-22T11:30:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored L2 spec"
    next_safe_action: "Edit matrix schema on isolated worktree"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/deep-alignment/assets/command-benchmark/command-benchmark-matrix.json"
      - ".opencode/skills/system-deep-loop/deep-alignment/scripts/command-benchmark/run-command-behavior-matrix.cjs"
      - ".opencode/skills/cli-external-orchestration/cli-opencode/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "deep-loop-035-015-001-driver-leg-matrix-schema-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Spec: cli-opencode Driver Leg + Matrix Schema Extension

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned — not yet implemented |
| **Spec Folder** | 001-driver-leg-and-matrix-schema |
| **Parent** | 015-command-benchmark-cli-opencode-driver |
| **Verification** | Matrix JSON parses; `validateManifest` passes; `requiredCellCount === requiredCells.length`; the existing 52 cells and frozen fixture hashes are byte-stable |


<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The command-surface behavior matrix
(`.opencode/skills/system-deep-loop/deep-alignment/assets/command-benchmark/command-benchmark-matrix.json`)
declares exactly three **frozen** driver legs in `bounds.driverLegs`: `claude-cli`
(`claude-baseline`), `gpt-fast-high` (`gpt-high-effort-driver`), and `gpt-fast-med`
(`gpt-fast-driver`). There is no cli-opencode **driver** leg. The matrix already carries a
single cli-opencode cell — `leaf:DAB-012:cli-opencode:gpt-5.6-sol-fast:xhigh` — but that is an
`alignment-leaf-sentinel` cell that is permanently `skip`ped with code
`alignment_fanout_not_wired`, not a runnable driver leg.

### Purpose
Extend the matrix schema/config so a cli-opencode **driver** leg exists alongside the frozen
three, carrying a selectable model/variant (default `deepseek/deepseek-v4-pro --variant high`,
the cli-opencode skill default). This child owns the **declarative** layer only: the
`bounds.driverLegs` entry, the new `requiredCells` records, and a coherent reconciliation of
`requiredCellCount`. The runner/scheduler wiring that actually dispatches the leg is child 002;
the end-to-end run, evidence, and regression proof are child 003.


<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add a fourth entry to `bounds.driverLegs` (a `{ legName, role }` pair; recommended
  `legName: "cli-opencode"`, `role: "opencode-driver"` — exact name is an open question).
- Carry a selectable model/variant for the leg. Recommended: mirror the leaf-sentinel cells,
  which already hold an `executor` block (`{ executorKind, model, effort }`), by giving each new
  driver cell an `executor: { executorKind: "cli-opencode", model, variant }` with the default
  `deepseek/deepseek-v4-pro` + `high`.
- Add the new driver `requiredCells` (one per covered scenario × the new leg) and reconcile
  `bounds.requiredCellCount` so it stays equal to `requiredCells.length`.
- Keep the new driver cells as `skip` cells initially (a new skip code, e.g.
  `opencode_driver_capture_pending`) so no live run is triggered until child 003 flips them.

### Out of Scope
- Runner/scheduler dispatch wiring (`behavior-bench-run.cjs` `LEG_TABLE` / `buildSpawnArgs`,
  scheduler `invokeRunner`) — that is child 002.
- End-to-end capture, evidence emission, tests, and regression proof — child 003.
- Rewriting the frozen fixture set (DAB-012..DAB-027) or their sha256 hashes — the new leg reuses
  the existing scenarios and fixtures unchanged.
- Adding non-opencode providers, or wiring alignment fan-out.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-deep-loop/deep-alignment/assets/command-benchmark/command-benchmark-matrix.json` | Modify | Add `driverLegs` entry, new driver `requiredCells`, and reconcile `requiredCellCount` |


<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A fourth cli-opencode driver leg is declared | `bounds.driverLegs` has a 4th `{legName, role}` entry distinct from the three frozen legs |
| REQ-002 | Model/variant is selectable and defaults correctly | New driver cells carry an `executor` block defaulting to `deepseek/deepseek-v4-pro` + `high` |
| REQ-003 | `requiredCellCount` is reconciled coherently | `bounds.requiredCellCount === requiredCells.length` after the additions |
| REQ-004 | Existing legs/cells stay byte-stable | The three frozen `driverLegs` entries and the existing 52 cell records are unchanged |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | The manifest still validates under the scheduler | `validateManifest()` in `run-command-behavior-matrix.cjs` throws no error on the edited manifest |
| REQ-006 | New driver cells are inert until child 003 | Each new driver cell declares exactly one `skip` (not a `resultPointer`), per the skip-xor-result invariant |


<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `JSON.parse` of the edited matrix succeeds and `validateManifest()` passes.
- **SC-002**: `requiredCellCount` equals the new `requiredCells.length` (current 52 → 52 + N).
- **SC-003**: A diff of the manifest shows only additions plus the single `requiredCellCount` bump — the three frozen legs, the 48 existing driver skip cells, the 4 alignment-leaf cells, and the `fixtures` block are untouched.


<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Frozen `requiredCellCount` / fixture hashes | A miscount makes `records.length !== requiredCellCount`, forcing status `failed` | Recompute `requiredCellCount` from `requiredCells.length`; never touch `fixtures` hashes |
| Risk | Shipped benchmark runtime (blast radius) | Edits land in a live skill asset | Implement on an isolated worktree; additive-only diff; new cells start as `skip` |
| Dependency | Child 002 (runner wiring) | New leg won't dispatch until the runner honors it | Keep cells `skip` here; child 002 adds `LEG_TABLE`/`buildSpawnArgs` support |
| Risk | Extend-vs-parallel undecided | Coverage count (N) is not yet fixed | Resolve in OPEN QUESTIONS before editing; the arithmetic is bounded either way |


<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Determinism
- **NFR-D01**: The manifest stays deterministic — no timestamps, no run-derived fields; cell ids
  are stable strings (e.g. `driver:DAB-012:cli-opencode`).

### Isolation
- **NFR-I01**: No fixture file or fixture hash under `fixtures` changes; `restorePolicy` stays `git`.

### Compatibility
- **NFR-C01**: `schemaVersion` stays `1`; every new cell satisfies the skip-xor-`resultPointer`
  invariant enforced by `validateManifest()`.


<!-- /ANCHOR:nfr -->
---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Coverage boundaries
- **All 16 scenarios**: adds 16 driver cells → `requiredCellCount` 52 → 68.
- **Leaf sentinel only (DAB-012)**: adds 1 driver cell → `requiredCellCount` 52 → 53.
- **Parallel matrix**: a separate manifest file leaves this one at 52 (no reconciliation needed here).

### Schema validation
- **Missing `executor` support in validator**: `validateManifest()` does not read `executor`; an
  extra field is inert and safe. Confirm the runner (child 002) is the only consumer.
- **Duplicate cell id**: `validateManifest()` rejects duplicate ids — new ids must be unique.
- **`fixtureRef` correctness**: each new driver cell must reference an existing `fixtures` key,
  else `validateManifest()` throws "unknown fixtureRef".


<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

- **Extend vs parallel**: does the cli-opencode driver leg extend this frozen matrix (new cells +
  `requiredCellCount` bump) or run as a parallel driver set? **UNKNOWN** — operator decision.
- **Coverage**: all 16 scenarios, or the leaf sentinel `DAB-012` first? **UNKNOWN**.
- **Leg name/role**: `cli-opencode` / `opencode-driver` recommended — confirm the exact string,
  since it becomes the `LEG_TABLE` key the runner (child 002) must match.
- **Executor block shape**: reuse the leaf-cell field name `executor.effort`, or introduce
  `executor.variant` to match cli-opencode's `--variant` vocabulary? **UNKNOWN** — resolve with 002.


<!-- /ANCHOR:questions -->
---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Successor phase**: See `../002-scheduler-opencode-dispatch/spec.md`
- **Parent Spec**: See `../spec.md`

<!-- /ANCHOR:related-docs -->
