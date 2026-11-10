---
title: "Tasks: Phase 1: hook-stdin-deadlines"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "hook stdin deadlines tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 1: hook-stdin-deadlines

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

- [x] T001 Classify all ten stdin readers by registration and host timeout
- [x] T002 [P] Build the sk-git open-stdin test through DeepSeek V4.1 Flash at max and confirm it fails 2 of 2 before the fix (`stdin-deadline.test.mjs`)
- [x] T003 [P] Build the sk-vision open-stdin case and confirm it fails before the fix (`sk-vision-devin.test.mjs`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 [P] Switch `git-message-gate.mjs` to the shared reader
- [x] T005 [P] Switch `git-preflight-advisory.mjs` to the shared reader
- [x] T006 [P] Switch `sk-vision.mjs` to the shared reader
- [x] T007 Bump both skills and write both changelogs
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Rerun the new tests and the existing hook suites
- [x] T009 Feed the message gate a real payload and confirm it still denies a bad commit message
- [x] T010 Regenerate Hermes copies and run `--check`, then strict validation
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
