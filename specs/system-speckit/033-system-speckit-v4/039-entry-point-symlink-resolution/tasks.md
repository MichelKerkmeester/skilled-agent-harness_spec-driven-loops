---
title: "Tasks: Entry-point resolution through a link"
description: "The ordered work for canonicalizing the entry-point comparison, migrating its hand-rolled copies, and proving the result."
trigger_phrases:
  - "entry point tasks"
importance_tier: "supporting"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Entry-point resolution through a link

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:phase-1 -->
## 1. TASKS

| ID | Task | Status |
|----|------|--------|
| T001 | Canonicalize both sides in the typed helper, falling back on resolution failure | Done |
| T002 | Add the plain-JavaScript twin for callers that run before any build | Done |
| T003 | Migrate the seven standalone scripts onto the twin | Done |
| T004 | Give the cross-package script a local copy, with the reason recorded | Done |
| T005 | Migrate the twelve TypeScript callers onto the typed helper | In Progress |
| T006 | Leave the filename-matching guard alone; it is already immune | Done |
| T007 | Cover both directions, in-process and through a spawned child | Done |
| T008 | Refresh the committed compiled output beside the source | Done |
| T009 | Run the spec-kit suite and account for the delta | In Progress |
| T010 | Triage the compiled files tracked beside their own sources | Done |
| T011 | Remove the orphaned one; confirm its source test still passes | Done |
<!-- /ANCHOR:phase-1 -->
