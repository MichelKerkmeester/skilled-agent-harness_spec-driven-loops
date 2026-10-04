---
title: "Tasks: Phase 1: Make Pi the default Jev transport when it is available"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "task breakdown"
  - "implementation tasks"
  - "verification checklist"
  - "task dependencies"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 1: Make Pi the default Jev transport when it is available

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

- [x] T001 Read `.skilled/skills/cli-classifier/shared/scripts/jev-transport.mjs`, its tests and the eight scorers' jev call sites
- [x] T002 Capture the suite baselines before any change
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Add the automatic route to `resolveTransport` and `spawnClassifierCall` (.skilled/skills/cli-classifier/shared/scripts/jev-transport.mjs)
- [x] T004 Map `noul` requests to a Pi classifier question and back to the CLI payload (.skilled/skills/cli-classifier/shared/scripts/jev-transport.mjs)
- [x] T005 Return the route name on every outcome (.skilled/skills/cli-classifier/shared/scripts/jev-transport.mjs)
- [x] T006 Route each of the eight scorers through the transport, keeping its auth gate and call records
- [x] T007 Pin `JEV_TRANSPORT=jev` in every suite that stubs `jev`
- [x] T008 Check the Pi transport benchmark needs no route change (score-pi-transport.mjs)
- [x] T009 Update the transport README, the cli-jev gate table, the catalog entry and the playbook scenario
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Run the transport suite and each changed scorer suite, with the key set and unset
- [x] T011 Run the live smoke with the key from the Keychain, then without it
- [x] T012 Run `validate_document.py` on each changed doc
- [x] T013 Cross-family review: fix P0 and P1, record P2
- [x] T014 Run `validate.sh --strict` on this phase
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



