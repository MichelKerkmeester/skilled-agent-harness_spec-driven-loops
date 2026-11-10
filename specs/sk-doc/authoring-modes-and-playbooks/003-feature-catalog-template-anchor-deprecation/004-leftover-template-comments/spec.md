---
title: "Feature Specification: Phase 4: leftover-template-comments"
description: "97 non-catalog skill documents still opened with an sk-doc-template comment naming a template no generator emits and no code reads. This phase removes every one with a single script run."
trigger_phrases:
  - "leftover template comments"
  - "phase 4 leftover template comments"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 4: leftover-template-comments

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-10-10 |
| **Branch** | `worktrees/096-feature-catalog-anchor-deprecation` |
| **Parent Spec** | ../spec.md |
| **Phase** | 4 of 7 |
| **Predecessor** | 003-feature-catalog-findings |
| **Successor** | 005-changelog-version-keys |
| **Handoff Criteria** | No standalone sk-doc-template comment remains anywhere outside specs/ |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4** of the feature catalog template-anchor deprecation. It remediates pre-existing findings that phases 1 and 2 surfaced.

**Scope Boundary**: playbooks, references, READMEs, INSTALL-GUIDE and SKILL.md files under .skilled/skills that carry a standalone sk-doc-template comment, plus the version carriers of their units.

**Dependencies**:
- Phase 2, which established that the comment family has no reader.

**Deliverables**:
- `scratch/remove_leftover_template_comments.py`, run once
- 97 documents without the comment and a patch bump for each non-hub unit
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
After the feature catalog sweep, 97 other skill documents kept a standalone template comment such as `<!-- sk-doc-template: manual_testing_playbook -->`, 83 of them in system-skill-advisor. A repository grep over code and config outside specs/ found no reader, and no template under any assets/ or templates/ folder carries the comment, so these are leftovers of an old alignment pass.

### Purpose
No skill document opens with an sk-doc-template comment.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Remove each standalone comment line and the blank line after it
- Fix the two H2 heading-case findings in bench-runner.md, which the removal touched and which failed document validation before the change
- Patch-bump each non-hub unit whose documents changed

### Out of Scope
- Changelog prose that names the comment - it records history
- The `<resolved-sk-doc-template-path>` placeholder in the markdown agent - it is not a template comment
- Hub version bumps - handed off with the JSON version owner

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| 97 `.skilled/skills/**` documents | Modify | Remove the comment line and one blank line |
| `system-skill-advisor/manual-testing-playbook/python-compat/bench-runner.md` | Modify | Uppercase two H2 headings |
| Five unit `SKILL.md` files and new changelog entries | Modify, Create | Patch version |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | No standalone sk-doc-template comment remains in `.skilled/` or `.hermes/` |
| REQ-002 | No document's validation result gets worse |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | Every owning skill or mode whose shipped files changed is patch-bumped once, and each hub's bump is recorded as a handoff |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `git grep -E '^\s*<!-- *sk-doc-template:[^>]*-->\s*$' -- . ':!specs/**'` prints nothing.
- **SC-002**: `validate_document.py` passes every changed document.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A hidden reader of the comment | Low | Code and config grep outside specs/ found none |
| Risk | A heading glued to the next section | Low | The blank line goes only when one also precedes the comment |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Not applicable. Documentation and metadata only.
- **NFR-P02**: Not applicable.

### Security
- **NFR-S01**: Not applicable. No permission or secret changes.
- **NFR-S02**: Not applicable.

### Reliability
- **NFR-R01**: Bulk edits run through one deterministic script kept in `scratch/`.
- **NFR-R02**: Each validator result is compared against its baseline.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: a file without the finding is left untouched.
- Maximum length: not applicable.
- Invalid format: a comment that is not alone on its line is left in place and reported; the run found one, in changelog prose.

### Error Scenarios
- External service failure: a DevPass limit switches the builder to the cline route.
- Network timeout: not applicable.
- Concurrent access: the worktree is isolated from the main checkout.

### State Transitions
- Partial completion: every change is a tracked-file edit that `git checkout` reverts.
- Session expiry: not applicable.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | 97 documents in 6 skills |
| Risk | 3/25 | Documentation and metadata edits |
| Research | 5/20 | Reader and owner inventory |
| **Total** | **16/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---
