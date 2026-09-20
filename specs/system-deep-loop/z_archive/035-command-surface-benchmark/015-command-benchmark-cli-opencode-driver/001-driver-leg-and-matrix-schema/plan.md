---
title: "Plan: cli-opencode Driver Leg + Matrix Schema Extension"
description: "Implementation plan for the declarative matrix-schema layer of the cli-opencode driver leg: add a driverLegs entry, executor-carrying driver cells, and a coherent requiredCellCount reconciliation, on an isolated worktree with existing legs byte-stable."
trigger_phrases:
  - "plan cli-opencode driver leg matrix"
  - "matrix schema extension plan"
  - "requiredCellCount reconciliation plan"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/035-command-surface-benchmark/015-command-benchmark-cli-opencode-driver/001-driver-leg-and-matrix-schema"
    last_updated_at: "2026-07-22T11:30:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored L2 plan"
    next_safe_action: "Edit matrix schema on isolated worktree"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/deep-alignment/assets/command-benchmark/command-benchmark-matrix.json"
      - ".opencode/skills/system-deep-loop/deep-alignment/scripts/command-benchmark/run-command-behavior-matrix.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "deep-loop-035-015-001-driver-leg-matrix-schema-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Plan: cli-opencode Driver Leg + Matrix Schema Extension

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JSON manifest consumed by Node.js (CommonJS) |
| **Artifact** | `command-benchmark-matrix.json` (`schemaVersion: 1`) |
| **Consumers** | `run-command-behavior-matrix.cjs` (`validateManifest`, `runMatrix`) |
| **Testing** | Node `JSON.parse` + `validateManifest()` invocation; diff review |

### Overview
This is a declarative, additive edit to one JSON asset. We append a fourth `driverLegs` entry and
the matching driver `requiredCells` (each carrying an `executor` block defaulting to
`deepseek/deepseek-v4-pro` + `high`), then bump `requiredCellCount` to equal `requiredCells.length`.
New cells are `skip` cells so nothing dispatches until child 002 (runner) and child 003 (go-live)
land. No fixture, no existing cell, and no existing leg is modified.


<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Extend-vs-parallel decision recorded (parent OPEN QUESTION resolved)
- [ ] Coverage decision recorded (all 16 vs leaf sentinel)
- [ ] Leg name/role string confirmed (becomes the `LEG_TABLE` key for child 002)
- [ ] Isolated worktree created; main tree clean or committed

### Definition of Done
- [ ] Matrix `JSON.parse` succeeds
- [ ] `validateManifest()` passes with no throw
- [ ] `requiredCellCount === requiredCells.length`
- [ ] Diff is additive-only apart from the single count bump


<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Additive manifest extension — mirror the existing cell shapes rather than invent a new schema.

### Key Components
- **`bounds.driverLegs`**: array of `{ legName, role }`; append the 4th.
- **`requiredCells`**: array of cell records; the 48 existing driver cells key their spawn purely
  off `legName`, while the 4 alignment-leaf cells additionally carry an `executor` block. The new
  driver cells follow the leaf-cell precedent and carry `executor: { executorKind, model, variant }`.
- **`bounds.requiredCellCount`**: integer the scheduler compares against `requiredCells.length`.

### Data Flow
1. `runMatrix()` reads the manifest and calls `validateManifest()`.
2. For each cell, `validateManifest()` requires `id`, `scenarioId`, `scenarioPath`, `legName`,
   integer `samples >= 1`, a known `fixtureRef`, and exactly one of `skip` xor `resultPointer`.
3. New driver cells satisfy all of the above with a `skip` block, so they are counted but inert.
4. At the end, `records.length` must equal `requiredCellCount` for status `reconciled`.


<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Create isolated worktree; confirm main `git status` clean or committed
- [ ] Record recovery-baseline commit hash
- [ ] Re-read the current matrix `bounds` block and the last existing cell record as the copy source

### Phase 2: Core Implementation
- [ ] Append the 4th `driverLegs` entry (`cli-opencode` / `opencode-driver`)
- [ ] Append N driver `requiredCells` (one per covered scenario), each with a unique `id`, correct
      `scenarioId`/`scenarioPath`/`fixtureRef`, `samples: 1`, an `executor` block, and a `skip` block
- [ ] Bump `requiredCellCount` from 52 to 52 + N

### Phase 3: Verification
- [ ] `node -e "JSON.parse(require('fs').readFileSync('<matrix>','utf8'))"` succeeds
- [ ] Invoke `validateManifest()` on the parsed manifest — no throw
- [ ] Assert `requiredCellCount === requiredCells.length`
- [ ] Diff review confirms additive-only change + single count bump


<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Parse | Manifest is valid JSON | `node -e JSON.parse` |
| Contract | `validateManifest()` accepts the manifest | Require the scheduler module, call the exported `validateManifest` |
| Invariant | `requiredCellCount === requiredCells.length` | Node assertion |
| Regression | Existing 52 cells + 3 legs + fixtures unchanged | `git diff` review |


<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `run-command-behavior-matrix.cjs` `validateManifest` | Internal | Green | Cannot verify manifest contract |
| Child 002 (runner `LEG_TABLE`) | Internal | Planned | New leg cannot dispatch (cells stay `skip`, which is fine here) |
| Operator extend-vs-parallel decision | External | Pending | Coverage count N is unfixed |
| cli-opencode default (`deepseek/deepseek-v4-pro --variant high`) | Internal | Green | Default model/variant reference |


<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: `validateManifest()` throws, count mismatch, or a fixture hash unexpectedly moves.
- **Procedure**: `git checkout -- command-benchmark-matrix.json` on the worktree to restore the
  frozen manifest; no other file is touched.


<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:l2-phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──> Phase 2 (Schema edit) ──> Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Operator decisions | Schema edit |
| Schema edit | Setup | Verify |
| Verify | Schema edit | Child 002 handoff |


<!-- /ANCHOR:l2-phase-deps -->
---

<!-- ANCHOR:l2-effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup + decisions | Low | 30 minutes |
| Schema edit | Low-Medium | 1-2 hours (N cells authored consistently) |
| Verification | Low | 30 minutes |
| **Total** | | **2-3 hours** |


<!-- /ANCHOR:l2-effort -->
---

<!-- ANCHOR:l2-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Isolated worktree; recovery-baseline commit hash recorded
- [ ] Pre-edit copy of the frozen manifest retained in the worktree diff
- [ ] `requiredCellCount` old value (52) noted for reversal math

### Rollback Procedure
1. **Immediate**: `git checkout -- <matrix>` to restore the frozen manifest.
2. **Verify**: re-run `validateManifest()` on the restored file — must pass at 52 cells.
3. **Confirm**: `git status` clean for the matrix path.

### Data Reversal
- **Has data migrations?** No — a single JSON asset edit, fully reversible by `git checkout`.

<!-- /ANCHOR:l2-rollback -->
