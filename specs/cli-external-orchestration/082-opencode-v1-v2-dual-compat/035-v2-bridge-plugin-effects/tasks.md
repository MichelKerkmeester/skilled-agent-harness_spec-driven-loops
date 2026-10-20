---
title: "Tasks: OpenCode 2 bridge delivers the tool names and session events plugins act on"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "v2 bridge plugin effects tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: OpenCode 2 bridge delivers the tool names and session events plugins act on

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Probe raw v2 events, tool hooks and transforms in the worktree (`scratch/live-runs/raw-probe.txt`)
- [ ] T002 Record the plugin suite baseline (`scratch/live-runs/baseline-tests.txt`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Tool aliases for `shell` and `subagent` with argument write-back (`.opencode/plugins/lib/v2-bridge.js`)
- [ ] T004 Once-per-session `session.created` from the event and transform paths (`.opencode/plugins/lib/v2-bridge.js`)
- [ ] T005 `sessionID`, `info.time.completed` and the user inbox mapping (`.opencode/plugins/lib/v2-bridge.js`)
- [ ] T006 Unit tests for T003 to T005 (`.opencode/plugins/tests/v2-bridge.test.cjs`)
- [ ] T007 Bridge docs (`.opencode/plugins/ARCHITECTURE.md`, `.opencode/plugins/README.md`)
- [ ] T008 The five 034 runner follow-ups (`manual-testing-playbook/plugin-utilization/`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 Full plugin suite, inventory and purity guards
- [ ] T010 Live rerun of all 17 scenarios on v1 and v2, new results matrix (`scratch/live-runs/results-matrix.md`)
- [ ] T011 Luna review, recursive strict validation, merge, push and CI
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Live rerun matrix recorded with evidence
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---



