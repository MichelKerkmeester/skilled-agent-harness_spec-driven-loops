---
title: "Tasks: Phase 24: plugin-inventory-guards"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "plugin inventory guards tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 24: plugin-inventory-guards

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

- [x] T001 Take the baseline before any edit (`scratch/baseline/`) Done: plugin suite 397 passed, 0 failed; battery v1 exit 0; battery v2 exit 1 inside the nested worktree, every plugin "Duplicate plugin ID" because OpenCode 2 also loads the main checkout's plugins, and exit 0 with all 17 active from a clone of origin/main at `8c9a14bd59` (`scratch/baseline/battery-v2-clone-origin-main.txt`).
- [x] T002 Observe v2 event delivery on a private OpenCode 2.0.32 host, read-only toward the shared service (row 8) (`scratch/v2-events/`) Done: a probe plugin received `session.created` and `session.deleted`, then `location.shutdown` and its cleanup; `server.instance.disposed` and `global.disposed` never arrived. PID 46220 kept its start time.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Read the plugin list from the folder with a manifest of named exceptions (row 6) (`.opencode/plugins/tests/helpers/plugin-inventory.cjs`, `.opencode/plugins/tests/plugin-inventory.json`) Done: bridged means the file contains `dualPlugin('<stem>'`; sk-vision is the one `nativeDual` entry with its reason.
- [x] T004 Drive both v2 suites from the inventory (row 6) (`.opencode/plugins/tests/v2-registration.test.cjs`, `.opencode/plugins/tests/v2-hard-plugins.test.cjs`) Done: the registration suite covers all 16 bridged plugins instead of 12; the hard-plugin suite requires a case for every native-dual exception and an inventory file for every case.
- [x] T005 Guard the folder, the skipped hooks and the event names (rows 6, 7, 8) (`.opencode/plugins/tests/plugin-inventory.test.cjs`, one export line in `.opencode/plugins/lib/v2-bridge.js`) Done: 13 tests; every bridged plugin's `cleanup.skippedKeys` is empty today; every handled event name is a bridge alias or mapping target or listed; checks the scan cannot read must be listed with the events they cover.
- [x] T006 Correct the docs and date the counts (rows 6, 30) (`.opencode/plugins/README.md`, `.opencode/plugins/ARCHITECTURE.md`, `.opencode/plugins/tests/README.md`, `../011-two-version-proof-and-closeout/proof.md`) Done: no "12 and 5" pinned-list wording or fixed bridged count remains; the proof's battery table is labelled with its 2026-10-19 date and points at the 17-plugin main-merge runs.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Prove each new or changed test fails on a mutation in a temporary copy (rows 6, 7, 8) (`scratch/mutation/README.txt`) Done: m1 to m22 each exit 1 with the intended message (m16's first run exited 0 and exposed a comment-stripping bug, fixed before the recorded run); m2 also shows the old pinned registration suite passing (12 pass, exit 0) on the same broken copy.
- [x] T008 Rerun the plugin suite and both batteries (`scratch/after/`) Done: plugin suite 417 passed, 0 failed (397 baseline plus 20 new); battery v1 exit 0; battery v2 exit 0 with all 17 active from a clone outside the main checkout.
- [x] T009 Luna read-only review until PASS (rows 6, 7, 8, 30) Done: eight rounds, every round FAIL; all P1s of rounds 1 to 7 fixed, the event scan made fail closed after round 6, and round 8's two P1s (further spellings the static scan cannot see) recorded as a known limit under the coordinator's stop rule, with the open P2s as follow-ups (`implementation-summary.md`). Luna never returned PASS.
- [x] T010 Fill this folder's records and the parent phase map (`spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md`, `../spec.md`) Done: the phase 24 row and the 014-to-024 handoff row.
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



