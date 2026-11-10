---
title: "Feature Specification: Phase 2: phase-scaffold-graph-metadata"
description: "The create.sh --phase command exits before running graph-metadata derivation, leaving phase scaffolds with stubs that fail strict validation. The fix runs derivation for the parent and all children before exit, and refreshes the parent's children_ids table."
trigger_phrases:
  - "phase scaffold graph metadata"
  - "create.sh --phase derives graph metadata"
  - "phase scaffolds pass their own gate"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 2: phase-scaffold-graph-metadata

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-08 |
| **Branch** | `worktrees/091-consolidate-small-packets` |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 16 |
| **Predecessor** | 001-spec-template-anchor-nesting |
| **Successor** | 003-archive-path-follow-ups |
| **Handoff Criteria** | A phase parent and all its children scaffolded with --phase pass strict validation, and scaffold-passes-its-own-gate.vitest.ts covers the --phase case |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the Research recommendations specification. SH-02 is a small fix at the source of one failure class: phase scaffolds that fail their own validation gate.

**Scope Boundary**: The `create.sh` script's --phase mode control flow and the test suite that verifies scaffold validity.

**Dependencies**:
- None. This phase stands alone.

**Deliverables**:
- The create.sh --phase mode runs graph-metadata derivation for the parent and each child before exit
- The parent packet's graph-metadata.json children_ids list is refreshed to include the newly created children
- A test case covers the --phase scaffold path in the same way root scaffolds are tested

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The `create.sh --phase` command scaffolds a parent packet and all its child packets, but exits at line 1919 before running the graph-metadata backfill code (lines 2006 to 2021) that root scaffolds reach. Every new phase scaffold starts with a stub graph-metadata.json containing no `source_fingerprint` and pre-derived field values that disagree with what the documents actually say. This causes every phase scaffold to fail strict validation on `GENERATED_METADATA_INTEGRITY` and `GENERATED_METADATA_DRIFT` the moment it is created.

### Purpose
Run the graph-metadata derivation for the phase parent and every child before `create.sh --phase` exits, so that a fresh phase scaffold passes strict validation immediately. Also refresh the parent's children_ids field with the list of newly created children.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Extract the graph-metadata backfill code (currently at create.sh lines 2006-2021) into a reusable helper function
- Call the helper for the parent packet before the --phase mode exit at line 1919
- Call the helper for each child packet before the --phase mode exit
- The parent packet's graph-metadata.json children_ids field is refreshed automatically by the backfill derivation from on-disk directories (no separate writer needed)
- Add a --phase test case to scaffold-passes-its-own-gate.vitest.ts

### Out of Scope
- Changes to how root (non-phase) scaffolds are created (the root path will continue to call the helper as it does today)
- Changes to the graph-metadata derivation logic itself
- Validating historical phase scaffolds (that is handled by separate repair tooling)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh` | Modify | Extract backfill helper (lines 2006-2021), call it for parent and children before --phase exit at line 1919 |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/scaffold-passes-its-own-gate.vitest.ts` | Modify | Add --phase test case that scaffolds a parent with two children and validates strict on all three |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | A phase parent scaffolded with `create.sh --phase` passes strict validation on graph-metadata rules without manual repair |
| REQ-002 | Every child of a scaffolded phase parent passes strict validation on graph-metadata rules without manual repair |
| REQ-003 | The parent's graph-metadata.json children_ids field lists every newly created child by specs-root-relative path |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | The test suite includes a --phase case that creates a parent with multiple children and validates all of them |
| REQ-005 | The spec-kit CLI test suite passes with no new failures |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A fresh phase parent scaffolded with --phase passes `validate.sh --strict` with no errors on generated-metadata rules
- **SC-002**: Each child of a fresh phase scaffold passes `validate.sh --strict` with no errors on generated-metadata rules
- **SC-003**: The test suite covers --phase scaffolding and validates all three packets before and after the change
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Graph derivation fails silently during scaffold | Phase scaffold silently fails validation | Error handling: report derivation failures and name the recovery command |
| Risk | Children count or path is wrong in parent's children_ids | Stale graph metadata | Backfill pulls current children from the filesystem and from document discovery |
| Dependency | backfill-graph-metadata.ts tool | Cannot complete without the deriver | Tool exists in the codebase as of this branch |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Derivation adds a few milliseconds per child to the scaffold operation

### Security
- **NFR-S01**: No new security surface; the deriver is already used in the normal root scaffold path

### Reliability
- **NFR-R01**: Derivation failures are reported as warnings, not hard errors, so the scaffold completes
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### File System
- A TSX loader missing or broken: report warning and continue (the parent already does this)
- A backfill script missing: report warning and continue

### Parent-Child Relationships
- A child packet directory that was created but has no spec.md: the backfill derives from what the docs say
- A stale children_ids list: refresh it from the discovered children on disk
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 3/25 | Two small functions in one file, one test case |
| Risk | 2/25 | Low risk; fails clearly if the deriver is broken |
| Research | 0/20 | Fully specified by SH-02 research |
| **Total** | **5/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

None open. SH-02 was fully specified, and three points settled during the build:

- The backfill code became one helper, `backfill_graph_metadata`, that takes a list of folders. The phase block calls it once with the parent followed by the `_child_paths` list, and the child loop in the root path was removed because it never ran for `--phase`: the phase block exits first, and `_child_paths` is only filled inside it.
- The parent's `children_ids` needed no separate writer. A throwaway `create.sh --phase` run with two children produced `["001-evidence-phase-probe/001-first","001-evidence-phase-probe/002-second"]` from the on-disk directories.
- Two P2 review findings were not applied. Their reasons are in `implementation-summary.md`.
<!-- /ANCHOR:questions -->

---


