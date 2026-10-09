---
title: "Feature Specification: Phase 1: release-line-split"
description: "The Skilled framework release notes get their own line under .skilled/changelog/skilled/, system-spec-kit writes a changelog that describes only itself, and sk-create-changelog learns to write to both."
trigger_phrases:
  - "release-line-split"
  - "skilled release line"
  - "framework release notes folder"
  - "system-spec-kit own changelog"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 1: release-line-split

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-27 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 2 |
| **Predecessor** | None |
| **Successor** | 002-changelog-findability |
| **Handoff Criteria** | This phase's lanes have stopped, its edits are verified, and `validate.sh --strict` passes on this folder |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the Skilled release changelog: the framework release line and findable changelogs specification.

**Scope Boundary**: The release line itself, system-spec-kit's own entries, sk-create-changelog's support for the release line, the Gate 1 corpus root and the references that name the release notes. Search metadata across every changelog belongs to phase 2.

**Dependencies**:
- None. Phase 2 depends on this phase's edits to sk-create-changelog, the retrieval roots and the notes in the release line.

**Deliverables**:
- `.skilled/changelog/skilled/` with 45 entries and a README
- system-spec-kit entries 4.0.0.0, 4.1.0.0 and 4.1.1.0, with `SKILL.md` and `README.md` at 4.1.1.0
- sk-create-changelog 1.2.0.0 with release-line support and three playbook scenarios
- `.skilled/changelog/skilled` as a Gate 1 corpus root

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The system-spec-kit changelog folder had become the repository's release notes. Its v4 entries describe the whole framework, the skill's own history stopped at 3.9.0.0, and sk-create-changelog named a spec-kit entry as its canonical exemplar. The root README's release-notes link pointed at a file that had moved into `v3+/`.

### Purpose
Every Skilled release has one entry in `.skilled/changelog/skilled/`, system-spec-kit has a changelog that describes only itself, and sk-create-changelog writes to either line on request.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The notes whose version carries a GitHub release, plus the upcoming v4.0.0.2, in `.skilled/changelog/skilled/` with their generation folders and their bytes unchanged
- system-spec-kit's own entries 4.0.0.0, 4.1.0.0 and 4.1.1.0, and its `SKILL.md` and `README.md` at 4.1.1.0
- sk-create-changelog: whole-segment component matching, `skilled` only by name, a release step that publishes for `skilled` alone with an editorial title, a version reader that counts generation folders, the exemplar's new path, three playbook scenarios and the mode's own entry 1.2.0.0
- `.skilled/changelog/skilled` as a Gate 1 corpus root, with its parity test and conventions row
- The root `README.md`, `PUBLIC-RELEASE.md` and sk-git's finish workflow pointing at the release line
- A README for the release line

### Out of Scope
- Search metadata across every changelog - phase 2 owns it
- Rewriting the notes in the release line - they keep their bytes so their history reads as renames
- Restoring the deleted `00--opencode-environment` history - it was deleted before this work
- The Barter coder copy of the framework - it is a separate tree

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/changelog/skilled/**` | Create | 45 release notes and a README |
| `.skilled/skills/system-spec-kit/changelog/v4.0.0.0.md`, `v4.1.0.0.md`, `v4.1.1.0.md` | Create | The skill's own entries |
| `.skilled/skills/system-spec-kit/SKILL.md`, `README.md` | Modify | Version 4.1.1.0 |
| `.skilled/commands/create/assets/create-changelog-auto.yaml`, `create-changelog-confirm.yaml`, `create-changelog-presentation.txt` | Modify | Matching, the release guard and title, the version reader, the exemplar path |
| `.skilled/skills/sk-doc/sk-create-changelog/**` | Modify | Rules, docs, template, playbook and the entry 1.2.0.0 |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/corpus.mjs` and its tests | Modify | The corpus root |
| `README.md`, `PUBLIC-RELEASE.md`, `.skilled/skills/sk-git/references/finish-workflows.md` | Modify | References to the release line |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Every note whose version carries a GitHub release, plus v4.0.0.2, lives under `.skilled/changelog/skilled/` with its bytes unchanged, and no note left in system-spec-kit's changelog carries a release |
| REQ-002 | system-spec-kit's changelog holds entries that describe only the skill from 4.0.0.0 on, and its `SKILL.md`, `README.md` and newest entry agree on 4.1.1.0 |
| REQ-003 | sk-create-changelog resolves `skilled` only from an explicit hint, matches components by whole path segment and publishes a release only for `skilled` |
| REQ-004 | Gate 1 still finds the release notes: a lookup for "v4.0.0.0 release notes" returns `.skilled/changelog/skilled/v4.0.0.0.md` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | The version reader counts generation folders and never parses a README or a mode folder |
| REQ-006 | No live reference outside `specs/` points at a moved note's old path |
| REQ-007 | The playbook covers the release line with three scenarios that pass the playbook validator |
| REQ-008 | The mode records the change in its own changelog as 1.2.0.0 |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `find .skilled/changelog/skilled -name 'v*.md'` counts 45, and a comparison against the GitHub release list finds no note on the wrong side
- **SC-002**: The retrieval suites pass and the lookup for "v4.0.0.0 release notes" returns the note in its new home
- **SC-003**: The playbook validator reports 10 scenarios across 4 categories with no violation
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Commit order | A note edited before the move commit loses its clean rename | Phase 2 holds those paths until the move commit lands |
| Risk | A path substring selects `skilled` | High | Whole-segment matching and a rule that only a hint selects `skilled` |
| Risk | A component version becomes a release tag | High | The release guard in both command YAMLs |
| Risk | The git index is shared with live sessions | Med | Stage paths one by one and read the staged list before each commit |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Gate 1 lookups keep reading the committed index with no daemon
- **NFR-P02**: The version reader is two `find` calls, so it stays fast on any changelog folder

### Security
- **NFR-S01**: The release step never runs `git tag` or `gh release create` for a component other than `skilled`
- **NFR-S02**: No dispatched lane runs a git write

### Reliability
- **NFR-R01**: The move keeps every note's bytes, proven by hashes taken before and after
- **NFR-R02**: Both command YAMLs parse after every lane
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: a folder with no entry at its top level still resolves its newest entry from its generation folders
- Maximum length: a folder whose entries all sit in generation folders resolves the same way
- Invalid format: a `README.md` in a changelog folder is never parsed as a version

### Error Scenarios
- External service failure: without an authenticated `gh`, the release step pauses and reports
- Network timeout: a tag that already exists makes the release step pause rather than overwrite it
- Concurrent access: other sessions share the git index, so only this phase's paths are staged

### State Transitions
- Partial completion: a lane that stops midway has its diff reviewed, then is rerun or corrected by hand
- Session expiry: continuity lives in this folder's documents and resumes with `/speckit:resume`
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 20/25 | About 90 files, most of them byte-identical moves |
| Risk | 12/25 | Release publishing and a git index shared with live sessions |
| Research | 8/20 | Which component owns each part of the framework notes |
| **Total** | **40/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None open. The operator settled the history rule, the spec-kit versioning and the executor on 2026-09-27.
<!-- /ANCHOR:questions -->

---
