---
title: "Tasks: Phase 6: standalone-conversion"
description: "Ordered tasks for standalone-conversion, each closed with recorded command evidence."
trigger_phrases:
  - "008 phase 006 tasks"
  - "standalone-conversion tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 6: standalone-conversion

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

- [x] T001 Read the class contract's required and forbidden file matrix — evidence: Standalone roots forbid registry, router, description and command-metadata; require a manifest config plus two derived files
- [x] T002 Confirm the command survives without a command-metadata file — evidence: Two existing standalone skills own slash commands and carry no such file; the binding lives in the command definition
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Flatten assets and references into the root — evidence: Assets merged alongside the preserved canonical card; references moved as a new root directory
- [x] T004 Flatten the playbook, replacing the hub-routing directories — evidence: Hub-only playbook directories removed; the engine's six directories and its index moved up
- [x] T005 Recover from the destination-removed failure — evidence: `git rm` had removed the emptied directories; recreated them, and restored the un-moved changelog from HEAD before completing the move
- [x] T006 Move the surviving SKILL.md and README to the root and delete the hub's own — evidence: The engine's documents become the skill's
- [x] T007 Delete the four forbidden metadata files and the stage-two router — evidence: Root now carries only the class-permitted set
- [x] T008 Author the manifest config and regenerate both derived files — evidence: The gate's fix mode wrote the manifest and the alias projection
- [x] T009 Rewrite frontmatter, README and advisor metadata for one identity — evidence: Name and version updated, family moved to the standalone family, hub-only domains and triggers removed, entities and causal summary rewritten
- [x] T010 Remove the hub-only feature catalog and repoint the command assets — evidence: The catalog documented only the retired routing; command assets now name the flattened skill
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Run the fleet metadata gate — evidence: `OK [S] sk-prompt`; `checked=14 passed=14 failed=0`
- [x] T012 Run the skill-graph compiler — evidence: Two rejections fixed in turn - an invalid entity kind, then an intent-signal count below the floor - then `VALIDATION PASSED`
- [x] T013 Run the link-integrity guard — evidence: `13790 links checked, 0 broken`
- [x] T014 Confirm no command asset references the pre-flatten path — evidence: A search across the command directory returns nothing
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]` — evidence: every task above carries a recorded command result
- [x] No `[B]` blocked tasks remaining — evidence: no task in this phase entered a blocked state
- [x] Manual verification passed — evidence: see the Verification table in `implementation-summary.md`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
