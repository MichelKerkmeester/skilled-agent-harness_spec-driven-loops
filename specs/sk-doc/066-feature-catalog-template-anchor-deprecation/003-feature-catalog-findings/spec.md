---
title: "Feature Specification: Phase 3: feature-catalog-findings"
description: "The strict feature catalog validator reported 761 findings (42 fail, 719 warn) across the shipped catalogs. This phase repairs them with four one-run scripts and four judgment passes, and records the 15 that stay with a reason."
trigger_phrases:
  - "feature catalog findings"
  - "phase 3 feature catalog findings"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 3: feature-catalog-findings

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
| **Phase** | 3 of 7 |
| **Predecessor** | 007-sk-code-script-kebab-names |
| **Successor** | None |
| **Handoff Criteria** | The catalog validator reports 15 findings, each with a recorded reason |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the feature catalog template-anchor deprecation. It remediates pre-existing findings that phases 1 and 2 surfaced.

**Scope Boundary**: feature catalog docs under .skilled/skills/**/feature-catalog/, the warn-tier package list in validate_catalog_package.py, and the version carriers and new entries of the non-hub units they belong to.

**Dependencies**:
- The leaf parity rule in the snippet template: a leaf title equals its root H3 and its description matches the root Description after normalization.

**Deliverables**:
- Four scripts in `scratch/`, each run once
- Judgment fixes for stale paths, unshipped labels and orphan leaves
- A warn-tier list narrowed to the five packages that still carry findings
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`validate_catalog_package.py` reported 761 findings: 303 off-taxonomy validation types, 110 packet-history lines, 166 root and leaf title or description mismatches, 91 plain-text root rows, 23 orphan leaves, 44 missing prose paths, 20 missing source paths and 4 unshipped labels on shipped features. Most packages sat in the warn tier, so the validator could not fail closed for them.

### Purpose
Every catalog finding is fixed or carries a stated reason, and every repaired package fails closed.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Map off-taxonomy Type values to the canonical taxonomy
- Delete packet-history lines
- Set leaf title and description to the root entry
- Turn plain-text root paths into links where the target exists
- Point stale paths at the real files or remove claims about removed files
- Reword unshipped labels on shipped features
- Narrow the warn-tier package list
- Patch-bump each non-hub unit

### Out of Scope
- Validator rule changes - a path the text names on purpose (an output file, a legacy alias, a gitignored runtime file) still trips the check, handed off
- Hub version bumps - their JSON version fields belong to another owner, handed off

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/**/feature-catalog/**/*.md` (about 380 files) | Modify | Catalog fixes |
| `sk-create-feature-catalog/scripts/validate_catalog_package.py` | Modify | Warn-tier list |
| 20 unit `changelog/v*.md` entries and 19 `SKILL.md` version carriers | Modify and create | Patch bump |
| Four `scratch/*.py` scripts | Create | One-run fixes |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The validator reports no finding without a recorded reason |
| REQ-002 | Every package with zero findings leaves the warn tier |

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

- **SC-001**: `validate_catalog_package.py` reports 15 findings, down from 761.
- **SC-002**: Each of the 15 is listed with its reason.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Root text wins a parity conflict where the leaf was newer | Med | The template names the root H3 as the anchor; descriptions remain one sentence |
| Risk | A parity sync copies em dashes into leaves | Low | Replaced with commas in the eight synced descriptions; normalization ignores punctuation |
| Risk | A fail-closed package regresses later | Low | That is the intended behavior once clean |
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
- Invalid format: the sk-vision plugin path is a symlink into a gitignored build folder, so it resolves in a built checkout but not in a fresh worktree.

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
| Scope | 18/25 | 761 findings across 30 packages |
| Risk | 5/25 | Documentation and metadata edits |
| Research | 8/20 | Reader and owner inventory |
| **Total** | **31/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---
