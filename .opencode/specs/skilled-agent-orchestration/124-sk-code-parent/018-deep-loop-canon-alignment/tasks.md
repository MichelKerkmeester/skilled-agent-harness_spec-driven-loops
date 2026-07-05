---
title: "Tasks: Phase 18 deep-loop canon alignment and benchmark"
description: "Forward-looking task list split into 018a SAFE-NOW additive artifacts and 018b DEFERRED/GATED registry, router, extension, and changelog work."
trigger_phrases:
  - "deep-loop canon tasks"
  - "018a safe-now"
  - "018b deferred gated"
importance_tier: "high"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/124-sk-code-parent/018-deep-loop-canon-alignment"
    last_updated_at: "2026-07-05T00:00:00Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Phase planned and documented; execution pending"
    next_safe_action: "Start T001"
---
# Tasks: Phase 18 deep-loop canon alignment and benchmark

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

**Task Format**: `T### [P?] Description (file path) [effort] [trace]`

<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T000 Confirm the split before execution: 018a SAFE-NOW is add-only, 018b DEFERRED/GATED is blocked until git-clean [low] [trace: user brief; master plan 018; audit P0-1]

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### 018a SAFE-NOW: Absent Files, Collision-Free

### Additive Hub Artifacts
- [ ] T001 [P] Author deep-loop parent hub description (`.opencode/skills/deep-loop-workflows/description.json`) [medium] [trace: master plan 018a; audit P0-4]
- [ ] T002 [P] Scaffold hub-level manual testing playbook package (`.opencode/skills/deep-loop-workflows/manual_testing_playbook/`) [medium] [trace: master plan 018a; audit P0-5]
- [ ] T003 [P] Create hub-level benchmark baseline package (`.opencode/skills/deep-loop-workflows/benchmark/`) [medium] [trace: master plan 018a; audit P0-6]

### 018a Verification
- [ ] T004 Run parent-skill-check strict and confirm 8a/9a/9b no longer fail for deep-loop-workflows [low] [trace: master plan verify; audit P0-4, P0-5, P0-6]
- [ ] T005 Confirm no 018b target files were modified during 018a (`mode-registry.json`, `hub-router.json`, `changelog/deep-context`) [low] [trace: audit P0-1, P0-7, P0-8]
- [ ] T006 Record that 018a lands 3 of 8 P0 closures while the rest remain gated [low] [trace: master plan verify]

### 018b DEFERRED/GATED: Live Agent Active Refactor

Gate reason for every 018b task: `mode-registry.json dirty — live agent mid-refactor; open only when git-clean`.

### Registry Canon Fields
- [ ] [B] T007 Add `packetKind: "workflow"` to each of the seven workflow modes (`.opencode/skills/deep-loop-workflows/mode-registry.json`) [medium] [trace: master plan 018b; audit P0-2] Blocked: mode-registry.json dirty — live agent mid-refactor; open only when git-clean
- [ ] [B] T008 Add `grandfatheredFolderMismatch: false` to each of the seven workflow modes (`.opencode/skills/deep-loop-workflows/mode-registry.json`) [medium] [trace: master plan 018b; audit P0-2] Blocked: mode-registry.json dirty — live agent mid-refactor; open only when git-clean
- [ ] [B] T009 Add `toolSurface` to each of the seven workflow modes (`.opencode/skills/deep-loop-workflows/mode-registry.json`) [medium] [trace: master plan 018b; audit P0-2] Blocked: mode-registry.json dirty — live agent mid-refactor; open only when git-clean

### Registry Extensions
- [ ] [B] T010 Add `extensions.runtime-loop` to the registry (`.opencode/skills/deep-loop-workflows/mode-registry.json`) [medium] [trace: master plan 018b; audit P0-3] Blocked: mode-registry.json dirty — live agent mid-refactor; open only when git-clean
- [ ] [B] T011 Add `extensions.advisor-projection` with the driftGuard path (`.opencode/skills/deep-loop-workflows/mode-registry.json`) [medium] [trace: master plan 018b; audit P0-3] Blocked: mode-registry.json dirty — live agent mid-refactor; open only when git-clean
- [ ] [B] T012 Add `extensions.deprecated-modes` after live deprecation state settles (`.opencode/skills/deep-loop-workflows/mode-registry.json`) [medium] [trace: master plan 018b; audit P0-3] Blocked: mode-registry.json dirty — live agent mid-refactor; open only when git-clean

### Router and Changelog
- [ ] [B] T013 Author `hub-router.json` only after the settled seven-mode set can satisfy bidirectional check 5b (`.opencode/skills/deep-loop-workflows/hub-router.json`) [medium] [trace: master plan 018b; audit P0-7] Blocked: mode-registry.json dirty — live agent mid-refactor; open only when git-clean
- [ ] [B] T014 Remove dangling `changelog/deep-context` symlink through the live deprecation sweep (`.opencode/skills/deep-loop-workflows/changelog/deep-context`) [low] [trace: master plan 018b; audit P0-8] Blocked: mode-registry.json dirty — live agent mid-refactor; open only when git-clean

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T015 Verify 018a parent-hub checks after safe-now artifacts land [low] [trace: master plan verify; audit P0-4, P0-5, P0-6]
- [ ] T016 Verify no 018b target files changed while the gate was active [low] [trace: audit P0-1, P0-7, P0-8]
- [ ] T017 Verify every 018b task remains blocked with the exact gate reason if `mode-registry.json` is still dirty [low] [trace: user brief; audit P0-1]
- [ ] T018 Record that full deep-loop conformance is pending 018b completion [low] [trace: master plan verify]

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All 018a tasks completed and verified.
- [ ] 018b gate checked; if still dirty, every 018b task remains `[B]` with the required gate reason.
- [ ] Parent-skill-check strict evidence records 018a partial closure and does not claim full deep-loop conformance until 018b is complete.
- [ ] Checklist.md remains synchronized with safe-now versus deferred status.

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`

<!-- /ANCHOR:cross-refs -->
