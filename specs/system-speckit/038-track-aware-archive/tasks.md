---
title: "Tasks: Keep a track packet inside its own track when archive.sh archives or restores it, and refresh the track list"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "track-aware archive"
  - "archive.sh track"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Keep a track packet inside its own track when archive.sh archives or restores it, and refresh the track list

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

- [x] T001 Read `archive.sh` and its tests: one archive, restore to the specs root, no list refresh, and two path-safety messages the phase tests expect
- [x] T002 Survey the archives in this repository: no root archive, 268 packets in ten tracks' own `z_archive/`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Write the tests and run them red: 6 of 7 failed (`runtime/cli/tests/archive-track.vitest.ts`)
- [x] T004 Archive into the track's own `z_archive/`, refuse anything under a `z_archive/`, refresh after the move (`runtime/cli/spec/archive.sh`)
- [x] T005 Restore to the archive's owner, list every archive, refresh after the move, and update the help text (`runtime/cli/spec/archive.sh`)
- [x] T006 Add the two cases the mutation runs asked for: a symlinked track in the list, and a live phase child given to restore (`runtime/cli/tests/archive-track.vitest.ts`)
- [x] T007 [P] Describe the per-track archive and the refresh (`runtime/cli/spec/README.md`, two catalogue entries, the lifecycle playbook, `SKILL.md`, `README.md`), then regenerate the `.hermes` copy of `SKILL.md`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Remove each guarded rule on purpose, ten in all, and watch the suite fail each time
- [x] T009 `archive-track.vitest.ts` 9 of 9 under `/bin/bash` 3.2, and `test-phase-validation.js` 51 passed, 0 failed
- [x] T010 A read-only `--list` on this repository shows the 268 track-archived packets and leaves out the two symlinked tracks
- [x] T011 The changed docs validate with 0 issues, the Hermes copies are in sync, and strict validation of this packet passes
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
