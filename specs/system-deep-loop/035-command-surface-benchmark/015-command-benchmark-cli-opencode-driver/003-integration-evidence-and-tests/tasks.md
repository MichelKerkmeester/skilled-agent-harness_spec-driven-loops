---
title: "Tasks: cli-opencode Leg Integration, Evidence & Regression"
description: "Task breakdown for the end-to-end cli-opencode leg run, evidence capture, integration tests, and byte-stability regression proof of the frozen legs and fixtures."
trigger_phrases:
  - "tasks cli-opencode leg integration"
  - "benchmark evidence regression tasks"
  - "end-to-end opencode leg tasks"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/035-command-surface-benchmark/015-command-benchmark-cli-opencode-driver/003-integration-evidence-and-tests"
    last_updated_at: "2026-07-22T11:30:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored L2 tasks"
    next_safe_action: "Capture live run on isolated worktree"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/deep-alignment/scripts/command-benchmark/run-command-behavior-matrix.cjs"
      - ".opencode/skills/system-deep-loop/shared/behavior-benchmark/behavior-bench-run.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "deep-loop-035-015-003-integration-evidence-and-tests-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: cli-opencode Leg Integration, Evidence & Regression

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

- [ ] T001 [B] Confirm children 001 + 002 landed and verified [10m]
- [ ] T002 Capture a baseline of frozen-leg `buildSpawnArgs` output + the 52 cells + fixture hashes [20m]
- [ ] T003 `opencode --version` vs v1.3.17 baseline; run provider auth pre-flight (`opencode providers`) [20m]
- [ ] T004 Locate the existing benchmark test tree (do not fabricate a path) [20m]
- [ ] T005 Create isolated worktree; record recovery-baseline commit hash [10m]


<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Cell flip
- [ ] T006 Flip the chosen cli-opencode cell(s) from `skip` to a live `resultPointer` matching `<scenarioId>-cli-opencode.result.json` (`command-benchmark-matrix.json`) [30m]

### Integration tests
- [ ] T007 Add a stubbed runner integration test via `BEHAVIOR_BENCH_SPAWN_JSON` asserting a well-formed `cli-opencode` result [1h]
- [ ] T008 [P] Add a scheduler test invoking `runMatrix` and asserting reconciliation accounts for the live cell [1h]
- [ ] T009 [P] Add a test asserting a quota rejection yields `retryable` (exit 75), not `failed` [30m]

### Live capture
- [ ] T010 Run one bounded live scheduler pass (real `opencode`) for the first scenario; save the out-dir evidence [1h]
- [ ] T011 Confirm the transcript shows the canonical `opencode run …` command with no `--agent` [20m]


<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Evidence
- [ ] T012 Assert `<scenarioId>-cli-opencode.result.json` has `leg: "cli-opencode"`, matching `scenarioId`, `classification`, `dimensions`, `terminal` [20m]
- [ ] T013 Assert `command-behavior-matrix.reconciliation.json` `status`/`resultCount`/`skipCount` coherent [20m]
- [ ] T014 Assert `isolation.violations` empty; post-run fixture `git status` clean [15m]

### Regression
- [ ] T015 Byte-diff frozen legs' `buildSpawnArgs` + the 48 driver skips + 4 leaf cells against baseline [30m]
- [ ] T016 Assert all `fixtures[*].hashes` unchanged [15m]

### Suite
- [ ] T017 Run the benchmark test suite; confirm green [20m]
- [ ] T018 Re-run `validateManifest()` on the flipped manifest — no throw [10m]


<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining (001 + 002 landed)
- [ ] Live evidence captured; integration tests green
- [ ] Frozen legs + fixtures byte-stable
- [ ] Checklist.md fully verified


<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Upstream**: See `../001-driver-leg-and-matrix-schema/` and `../002-scheduler-opencode-dispatch/`

<!-- /ANCHOR:cross-refs -->
