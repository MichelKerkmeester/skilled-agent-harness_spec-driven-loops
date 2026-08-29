---
title: "Tasks: Phase 18 deep-loop canon alignment and benchmark"
description: "Executed task list: 018a SAFE-NOW additive artifacts and 018b (formerly gated) registry, router, extension, and changelog work all complete."
trigger_phrases:
  - "deep-loop canon tasks"
  - "018a safe-now"
  - "018b executed"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/001-sk-code-parent/018-deep-loop-canon-alignment"
    last_updated_at: "2026-07-05T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Phase executed; deep-loop STRICT 0/0, benchmark frozen"
    next_safe_action: "Phase 019: validator WARN->FAIL promotion + 124 rollup"
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

- [x] T000 Confirm the split before execution: 018a SAFE-NOW is add-only, 018b was gated until git-clean [low] [trace: user brief; master plan 018; audit P0-1]

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### 018a SAFE-NOW: Absent Files, Collision-Free

### Additive Hub Artifacts
- [x] T001 [P] Author deep-loop parent hub description (`.opencode/skills/deep-loop-workflows/description.json`) [medium] [trace: master plan 018a; audit P0-4] — `e1a266b07c`
- [x] T002 [P] Author hub-level manual testing playbook package (`.opencode/skills/deep-loop-workflows/manual_testing_playbook/`) [medium] [trace: master plan 018a; audit P0-5] — `2b03b419a6` (20 scenarios / 5 categories)
- [x] T003 [P] Freeze hub-level benchmark baseline package (`.opencode/skills/deep-loop-workflows/benchmark/`) [medium] [trace: master plan 018a; audit P0-6] — `50fbe53094` (Lane-C router CONDITIONAL 71/100)

### 018a Verification
- [x] T004 Run parent-skill-check strict and confirm 8a/9a/9b pass for deep-loop-workflows [low] [trace: master plan verify; audit P0-4, P0-5, P0-6]
- [x] T005 Confirm no 018b target files were modified during 018a (`mode-registry.json`, `hub-router.json`, `changelog/deep-context`) [low] [trace: audit P0-1, P0-7, P0-8]
- [x] T006 Record that 018a closed 3 of 8 P0 findings while the rest stayed gated pending the git-clean registry [low] [trace: master plan verify]

### 018b (formerly GATED): executed after `mode-registry.json` returned git-clean

Gate cleared: the registry returned git-clean and the seven-mode set settled, so the following opened and shipped.

### Registry Canon Fields
- [x] T007 Add `packetKind: "workflow"` to each of the seven workflow modes (`.opencode/skills/deep-loop-workflows/mode-registry.json`) [medium] [trace: master plan 018b; audit P0-2] — `e1a266b07c`
- [x] T008 Add `grandfatheredFolderMismatch: false` to each of the seven workflow modes (`.opencode/skills/deep-loop-workflows/mode-registry.json`) [medium] [trace: master plan 018b; audit P0-2] — `e1a266b07c`
- [x] T009 Add `toolSurface` to each of the seven workflow modes (`.opencode/skills/deep-loop-workflows/mode-registry.json`) [medium] [trace: master plan 018b; audit P0-2] — `e1a266b07c`

### Registry Extensions
- [x] T010 Add `extensions.runtime-loop` to the registry (`.opencode/skills/deep-loop-workflows/mode-registry.json`) [medium] [trace: master plan 018b; audit P0-3] — `e1a266b07c`
- [x] T011 Add `extensions.advisor-projection` with the driftGuard path (`.opencode/skills/deep-loop-workflows/mode-registry.json`) [medium] [trace: master plan 018b; audit P0-3] — `e1a266b07c`
- [x] T012 Declare deprecated modes via top-level `deprecatedModes: []` (no `extensions.deprecated-modes` needed — zero deprecated modes) (`.opencode/skills/deep-loop-workflows/mode-registry.json`) [medium] [trace: master plan 018b; audit P0-3] — `e1a266b07c`

### Router and Changelog
- [x] T013 Author `hub-router.json` after the settled seven-mode set satisfies bidirectional check 5b (`.opencode/skills/deep-loop-workflows/hub-router.json`) [medium] [trace: master plan 018b; audit P0-7] — `e1a266b07c`
- [x] T014 Remove dangling `changelog/deep-context` symlink (with the other four hub changelog symlinks) under the real-files-only policy (`.opencode/skills/deep-loop-workflows/changelog/deep-context`) [low] [trace: master plan 018b; audit P0-8] — `a5e81198c9`

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T015 Verify 018a parent-hub checks after safe-now artifacts land [low] [trace: master plan verify; audit P0-4, P0-5, P0-6]
- [x] T016 Verify 018b landed cleanly: drift-guard 7/7 GREEN (advisorRouting byte-preserved), vocab-sync exit 0, no unintended file changes [low] [trace: audit P0-1, P0-7, P0-8]
- [x] T017 Verify the 018b gate was respected: registry edited only after it returned git-clean [low] [trace: user brief; audit P0-1]
- [x] T018 Record full deep-loop conformance: parent-skill-check STRICT 0 failures / 0 warnings [low] [trace: master plan verify]

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All 018a tasks completed and verified.
- [x] 018b gate cleared; all 018b tasks executed with commit evidence.
- [x] Parent-skill-check strict evidence records full deep-loop conformance (0 failures / 0 warnings).
- [x] Checklist.md synchronized with the executed safe-now + 018b status.

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`

<!-- /ANCHOR:cross-refs -->
