---
title: "Tasks: Chart versions move below 1.0, and the cleanup's residue closes"
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
# Tasks: Chart versions move below 1.0, and the cleanup's residue closes

<!-- SPECKIT_LEVEL: 2 -->

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

- [x] T001 Read the anchor rule at source rather than assuming it (`sk-create-frontmatter/references/frontmatter-versioning.md`)
- [x] T002 Read the version engine's document scope, so the apply could be bounded (`sk-doc/scripts/frontmatter-version.mjs`)
- [x] T003 [P] Inventory every citation of a chart version, inside and outside the changelog directory
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Re-mint the hub leaf manifest from disk (`.opencode/skills/sk-design/leaf-manifest.json`)
- [x] T005 Repoint three manual-test scenarios off the removed deliveries (`manual-testing-playbook/`)
- [x] T006 [P] Correct the catalog count on the hub command metadata (`.opencode/skills/sk-design/command-metadata.json`)
- [x] T007 [P] Correct two counts and the register claim in the release draft (`CHANGELOG-v4.0.0.0.md`)
- [x] T008 Rewrite titles, version fields and citations across the changelog in one derived pass (`changelog/`)
- [x] T009 Rename the twenty-two files under git in release order (`changelog/`)
- [x] T010 Seed the anchor down, because the engine takes a maximum and would otherwise keep the old number (`SKILL.md`)
- [x] T011 Apply the anchor to every in-scope child document on an explicit path list
- [x] T012 Set the two documents the engine refused or does not scope, using its own edit-count formula
- [x] T013 Regenerate the retrieval trigger index with its manifest
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T014 Read every rewritten line before the renames, which caught a boundary bug and a false positive
- [x] T015 Run the corpus check and the unit suite from the final state
- [x] T016 Run the hub doctor check, the packet version verify and the repository version gate
- [x] T017 Prove a lookup resolves a renamed document and no old path survives in the corpus manifest
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
- **Closure gate**: See `acceptance-criteria.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] Dependencies identified and available
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] The repository frontmatter gate exits zero over 2,961 files
- [x] CHK-011 [P0] No checker or test emits a warning from the final state
- [x] CHK-012 [P1] The rewrite refuses to move a number it does not own, rather than guessing
- [x] CHK-013 [P1] The mapping is derived from the directory, matching how the engine derives its own anchor
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met
- [x] CHK-021 [P0] Manual testing complete, by reading every rewritten line and running a live lookup
- [x] CHK-022 [P1] Edge cases tested: a non-owned four-part number, a document with no frontmatter, a document outside engine scope
- [x] CHK-023 [P1] Error scenarios validated: the engine's path guard refusal was observed and handled rather than bypassed
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] The residue findings are `cross-consumer`: one deletion, several surfaces that named it. The renumber is `algorithmic`, since a mapping is applied uniformly.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed: phases 36 and 37 are the only deletions in scope, and every surface naming their files was listed.
- [x] CHK-FIX-003 [P0] Consumer inventory completed for the leaf manifest, the playbook, the command metadata, the retrieval fixtures, the release draft and the historical spec packets.
- [x] CHK-FIX-004 [P0] The rewrite invariant is stated and its adversarial case is covered: a bare four-part number belonging to another tool survives untouched, proven at `design-md-theming.md:148`.
- [x] CHK-FIX-005 [P1] Axes listed: file class (changelog, reference, playbook, fixture), citation form (title, frontmatter, prose), and ownership (this packet's version versus another tool's).
- [ ] CHK-FIX-006 [P1] Hostile env variant not run. No code path here reads process-wide state, so there is nothing for it to observe.
- [x] CHK-FIX-007 [P1] Evidence is pinned to the final working-tree state, with every command rerun after the last edit.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets. Nothing in the diff carries a credential.
- [x] CHK-031 [P0] Input validation implemented. The rewrite validates by refusing any number it cannot map.
- [x] CHK-032 [P1] Auth/authz working correctly. Not applicable, no auth surface is touched.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] Code comments adequate. The one script comment states why a bare number is left alone.
- [x] CHK-042 [P2] README updated. The packet README carries the new anchor.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only. The renumber script ran from the session scratchpad, outside the repository.
- [x] CHK-051 [P1] scratch/ cleaned before completion. The engine's default manifest output landed at the repository root once and was removed.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 12/13 |
| P2 Items | 1 | 1/1 |

The one unverified P1 is CHK-FIX-006, which has nothing to observe here.

**Verification Date**: 2026-09-10
<!-- /ANCHOR:summary -->

---
