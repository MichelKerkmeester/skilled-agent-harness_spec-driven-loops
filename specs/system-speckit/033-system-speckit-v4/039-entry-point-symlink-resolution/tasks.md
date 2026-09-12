---
title: "Tasks: Entry-point resolution through a link"
description: "The ordered work for canonicalizing the entry-point comparison, migrating its hand-rolled copies onto shared helpers, and proving the result in both directions."
trigger_phrases:
  - "entry point tasks"
  - "isMainModule tasks"
importance_tier: "supporting"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Entry-point resolution through a link

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:notation -->
## Notation

`[x]` done, `[ ]` outstanding, `[P]` may run in parallel with its neighbours.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Fix the comparison

- [x] T001 Canonicalize both sides in the CLI workspace's helper, falling back rather than raising
- [x] T002 Add the runtime workspace's own copy, since the two projects exclude each other's trees
- [x] T003 Add the plain-JavaScript twin for callers that run before anything is built
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Migrate the hand-rolled copies

- [x] T004 Point the seven standalone scripts at the twin
- [x] T005 [P] Give the script in the package below both helpers a local copy, with the reason recorded
- [x] T006 [P] Point the twelve TypeScript callers at the helper in their own project
- [x] T007 Leave the guard that matches on a filename alone; a link cannot displace it
- [x] T008 Refresh the compiled copy committed beside the source, which had gone stale
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Prove it

- [x] T009 Cover both directions, in-process and through a spawned child
- [x] T010 Assert the three copies answer identically
- [x] T011 Correct the parity case that had recorded the defect as the contract
- [x] T012 Run the whole suite from the final state and account for the delta
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Close out the neighbourhood

- [x] T013 Triage the four compiled files tracked beside their own sources
- [x] T014 Remove the orphaned one and confirm its source test still passes
- [x] T015 Remove the leftover that shadowed the source, once the builds proved it unneeded
- [x] T016 Teach the alignment eval to refuse a compiled file beside its own source
<!-- /ANCHOR:phase-4 -->
