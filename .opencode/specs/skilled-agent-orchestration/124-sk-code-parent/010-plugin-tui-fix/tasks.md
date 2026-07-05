---
title: "Tasks: plugin TUI-overlay fix"
description: "Completed Level 2 task list for the shipped mk-dist-freshness-guard TUI-output fix."
trigger_phrases:
  - "mk-dist-freshness-guard tasks"
  - "plugin TUI overlay fix tasks"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/124-sk-code-parent/010-plugin-tui-fix"
    last_updated_at: "2026-07-05T00:00:00Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Backfilled strict Level 2 tasks for the shipped plugin TUI-overlay fix"
    next_safe_action: "Use the completed phase docs as validation evidence for parent close-out"
---
# Tasks: plugin TUI-overlay fix

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

- [x] T001 Identify stale-dist plugin terminal-output source (`.opencode/plugins/mk-dist-freshness-guard.js`) [15m]
- [x] T002 Confirm no env kill-switch existed and fail-open behavior had to remain (`.opencode/plugins/mk-dist-freshness-guard.js`) [10m]
- [x] T003 [P] Identify sibling system-context injection pattern (`.opencode/plugins/mk-goal.js`, `.opencode/plugins/mk-skill-advisor.js`, `.opencode/plugins/mk-spec-memory.js`) [10m]

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Plugin Rechannel
- [x] T004 Remove stale-dist `console.*` emissions (`.opencode/plugins/mk-dist-freshness-guard.js`) [30m]
- [x] T005 Add bounded system-context warning injection (`.opencode/plugins/mk-dist-freshness-guard.js`) [45m]
- [x] T006 Add append-only operator log line (`.opencode/plugins/mk-dist-freshness-guard.js`) [30m]
- [x] T007 Preserve session dedupe, single default export, and never-throw behavior (`.opencode/plugins/mk-dist-freshness-guard.js`) [30m]

### Regression Coverage
- [x] T008 Retarget stale-warning assertions from console capture to transform output (`.opencode/plugins/tests/mk-dist-freshness-guard.test.cjs`) [30m]
- [x] T009 Retarget operator-record assertions to log-file deltas (`.opencode/plugins/tests/mk-dist-freshness-guard.test.cjs`) [20m]
- [x] T010 Preserve seven behavioral cases including fresh silence, dedupe, and malformed args never throw (`.opencode/plugins/tests/mk-dist-freshness-guard.test.cjs`) [25m]

### Documentation and Durable Rule
- [x] T011 [P] Update plugin consumer channel wording (`.opencode/plugins/README.md`) [15m]
- [x] T012 [P] Update bin consumer list/channel wording (`.opencode/bin/README.md`) [10m]
- [x] T013 Add no-TUI-output rule to sk-code OpenCode guidance (`.opencode/skills/sk-code/.../quality_standards.md`) [20m]
- [x] T014 Add matching P0 checklist rule (`.opencode/skills/sk-code/.../javascript_checklist.md`) [15m]

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Unit Tests
- [x] T015 Run plugin regression suite (`node .opencode/plugins/tests/mk-dist-freshness-guard.test.cjs`) [10m]

### Integration Tests
- [x] T016 Confirm stale path produces one warning and fresh path produces zero warnings (`.opencode/plugins/tests/mk-dist-freshness-guard.test.cjs`) [10m]
- [x] T017 Confirm malformed args never throw (`.opencode/plugins/tests/mk-dist-freshness-guard.test.cjs`) [5m]

### Manual Verification
- [x] T018 Live-smoke `validate.sh` through `bash` and confirm zero TUI writes [15m]
- [x] T019 Record shipped commit evidence (remote `711b019eb1`, local `42677fac58`) [5m]

### Documentation
- [x] T020 Backfill strict Level-2 spec docs (`010-plugin-tui-fix/`) [30m]

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`.
- [x] No `[B]` blocked tasks remaining.
- [x] Plugin test suite passing.
- [x] Live smoke confirmed zero TUI writes.
- [x] Checklist.md fully verified.

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`

<!-- /ANCHOR:cross-refs -->
