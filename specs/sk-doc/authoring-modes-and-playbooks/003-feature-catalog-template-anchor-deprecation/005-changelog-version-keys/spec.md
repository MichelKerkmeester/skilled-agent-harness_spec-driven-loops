---
title: "Feature Specification: Phase 5: changelog-version-keys"
description: "217 older changelog entries across the touched skills had no version key in their frontmatter, which validate_skill_package.py --strict reports as an unmet contract. This phase adds the key from each file name."
trigger_phrases:
  - "changelog version keys"
  - "phase 5 changelog version keys"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 5: changelog-version-keys

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
| **Phase** | 5 of 7 |
| **Predecessor** | 004-leftover-template-comments |
| **Successor** | 006-skill-package-doc-findings |
| **Handoff Criteria** | No changelog entry in the touched skills lacks a version key |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 5** of the feature catalog template-anchor deprecation. It remediates pre-existing findings that phases 1 and 2 surfaced.

**Scope Boundary**: existing changelog/v*.md entries in the 28 skills and modes the anchor sweep touched, plus the version carriers and new entries of the units they belong to.

**Dependencies**:
- None. The version key is plain frontmatter that no reader parses.

**Deliverables**:
- `scratch/add_changelog_version_keys.py`, run once
- A version key in 217 entries and a patch bump for each non-hub unit
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The frontmatter versioning standard requires a four-part `version` key on every changelog entry, but 217 older entries across 14 skills and modes carried the five search keys without it. `validate_skill_package.py --strict` failed every one of those packages on this finding.

### Purpose
Every changelog entry in the touched skills names its version in frontmatter, equal to its file name.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Insert `version: <file-name version>` above the closing frontmatter fence of each entry that lacks it
- Patch-bump each non-hub unit whose changelog folder changed

### Out of Scope
- Skills the anchor sweep did not touch - their findings were not assessed in this packet
- Hub version bumps - a hub's version also lives in JSON routing files that another owner keeps in step, so each needed hub bump is handed off

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/**/changelog/**/v*.md` (217 files) | Modify | Add the version key |
| Ten unit `SKILL.md` files and READMEs that carried the old version | Modify | Patch version |
| Ten `changelog/v*.md` entries | Create | One entry per bumped unit |
| `scratch/add_changelog_version_keys.py` | Create | The one-run script |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Every changelog entry in the 28 touched units carries a `version` key equal to its file name |
| REQ-002 | No other line of any entry changes |

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

- **SC-001**: `package_skill.py --check --strict` reports no missing-version finding in any of the 28 units.
- **SC-002**: `git diff` adds exactly one line per changed entry and deletes none.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | An entry without frontmatter | Low | The script skips and lists it; it found none |
| Risk | A hub bump needs JSON fields owned elsewhere | Med | Recorded as a handoff with the exact versions |
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
- Invalid format: entries in generation folders such as `changelog/v0+/` are matched too.

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
| Scope | 10/25 | 217 entries in 14 units |
| Risk | 3/25 | Documentation and metadata edits |
| Research | 4/20 | Reader and owner inventory |
| **Total** | **17/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---
