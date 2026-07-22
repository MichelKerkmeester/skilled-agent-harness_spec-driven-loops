---
title: "Tasks: cli-opencode Driver Leg + Matrix Schema Extension"
description: "Task breakdown for the declarative matrix-schema child phase: driverLegs entry, executor-carrying skip cells, and requiredCellCount reconciliation with verification tasks."
trigger_phrases:
  - "tasks cli-opencode driver leg matrix"
  - "matrix schema tasks requiredCellCount"
  - "driver cell authoring tasks"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/035-command-surface-benchmark/015-command-benchmark-cli-opencode-driver/001-driver-leg-and-matrix-schema"
    last_updated_at: "2026-07-22T11:30:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored L2 tasks"
    next_safe_action: "Edit matrix schema on isolated worktree"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/deep-alignment/assets/command-benchmark/command-benchmark-matrix.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "deep-loop-035-015-001-driver-leg-matrix-schema-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: cli-opencode Driver Leg + Matrix Schema Extension

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path) [effort]`


<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 [B] Record extend-vs-parallel + coverage decisions (parent OPEN QUESTIONS) [10m]
- [ ] T002 Confirm/confirm the leg name + role string (`cli-opencode` / `opencode-driver`) [5m]
- [ ] T003 Create isolated worktree; record recovery-baseline commit hash [10m]
- [ ] T004 Re-read `bounds` + the last existing driver/leaf cell as the copy template (`command-benchmark-matrix.json`) [5m]


<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### driverLegs entry
- [ ] T005 Append the 4th `bounds.driverLegs` entry `{ legName, role }` (`command-benchmark-matrix.json`) [15m]

### requiredCells
- [ ] T006 Author N driver cells, one per covered scenario, with unique `id` (e.g. `driver:DAB-0XX:cli-opencode`) (`command-benchmark-matrix.json`) [45m]
- [ ] T007 Give each cell correct `scenarioId`, `scenarioPath`, `fixtureRef`, `samples: 1` (`command-benchmark-matrix.json`) [20m]
- [ ] T008 [P] Add `executor: { executorKind: "cli-opencode", model: "deepseek/deepseek-v4-pro", variant: "high" }` to each new cell (`command-benchmark-matrix.json`) [15m]
- [ ] T009 [P] Add a `skip` block with a new code (`opencode_driver_capture_pending`) to each new cell (`command-benchmark-matrix.json`) [10m]

### Reconciliation
- [ ] T010 Bump `bounds.requiredCellCount` from 52 to 52 + N (`command-benchmark-matrix.json`) [5m]


<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Parse + contract
- [ ] T011 `node -e "JSON.parse(fs.readFileSync('<matrix>','utf8'))"` succeeds [5m]
- [ ] T012 Require the scheduler module and call `validateManifest(manifest)` — no throw [10m]

### Invariants
- [ ] T013 Assert `requiredCellCount === requiredCells.length` [5m]
- [ ] T014 Assert no duplicate cell `id` (validator already enforces; double-check) [5m]

### Regression
- [ ] T015 `git diff` review: 3 frozen legs, 48 driver skips, 4 leaf cells, and `fixtures` unchanged [5m]


<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining (decisions resolved)
- [ ] `validateManifest()` passes
- [ ] `requiredCellCount === requiredCells.length`
- [ ] Checklist.md fully verified


<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`

<!-- /ANCHOR:cross-refs -->
