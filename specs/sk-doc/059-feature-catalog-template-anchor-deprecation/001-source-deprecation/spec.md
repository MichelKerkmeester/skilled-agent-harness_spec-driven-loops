---
title: "Feature Specification: Phase 1: source-deprecation"
description: "The feature catalog templates stamp a template-name HTML comment under every catalog heading that nothing reads and no other sk-doc mode stamps. This phase removes it from the templates, the checklist and the worked examples."
trigger_phrases:
  - "source deprecation"
  - "phase 1 source deprecation"
  - "feature catalog template marker source"
  - "sk-doc-template comment removal"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 1: source-deprecation

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-10 |
| **Branch** | `worktrees/096-feature-catalog-anchor-deprecation` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 2 |
| **Predecessor** | None |
| **Successor** | 002-retroactive-removal |
| **Handoff Criteria** | No sk-create-feature-catalog asset or reference carries the marker, and the mode is bumped with a changelog |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the feature catalog template-anchor deprecation. It stops the marker at its source so phase 2 can remove the existing copies without new ones arriving.

**Scope Boundary**: the sk-create-feature-catalog mode packet and its Hermes copy only. Existing catalog documents belong to phase 2.

**Dependencies**:
- None. No validator, router, script or test reads the marker (see the reader inventory in section 3).

**Deliverables**:
- Marker-free root and per-feature scaffolds, checklist and worked examples.
- sk-create-feature-catalog 1.0.2.0 with a changelog entry, and its regenerated Hermes copy.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The feature catalog scaffolds stamp a template-name HTML comment under the H1 of every new catalog document, `<!-- sk-doc-template: skill_asset_feature_catalog -->`. The comment comes from the per-feature scaffold in `assets/feature-catalog-template.md:193` and `assets/feature-catalog-snippet-template.md:77`, and the snippet checklist at `assets/feature-catalog-snippet-template.md:178` required it. Commit `7d7650471d` added it to the template and stamped it into 588 snippets in one sweep. No other create-* mode template carries such a marker, and no code in the repository reads it.

### Purpose
New feature catalog documents no longer receive the marker, and nothing asks for it.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Remove the marker line from both scaffolds and drop the checklist item that required it.
- Remove the marker from the two worked examples in `references/examples.md` and from the prose that named it.
- Bump sk-create-feature-catalog to 1.0.2.0 with a changelog entry and regenerate its Hermes copy.

### Out of Scope
- Existing catalog documents - phase 2 removes their copies.
- The other stray `sk-doc-template:` comments (manual_testing_playbook, skill_readme, skill_md, code_folder_readme, skill_reference) in system-skill-advisor and a few playbooks - no template emits them and the request names only the feature catalog anchor.

### Reader inventory
`git grep` for `sk-doc-template`, `doc_template` and `template_marker` across `.py`, `.cjs`, `.mjs`, `.js`, `.ts`, `.sh`, `.json`, `.yaml` and `.toml` outside `specs/` finds no reader. The only non-markdown hits are the generated trigger index and retrieval fixtures, which echo document text. `validate_document.py` and `validate_catalog_package.py` contain no reference to it.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-doc/sk-create-feature-catalog/assets/feature-catalog-template.md` | Modify | Drop the marker from the per-feature scaffold |
| `.skilled/skills/sk-doc/sk-create-feature-catalog/assets/feature-catalog-snippet-template.md` | Modify | Drop the marker from the scaffold and its checklist item |
| `.skilled/skills/sk-doc/sk-create-feature-catalog/references/examples.md` | Modify | Drop the marker from both worked examples |
| `.skilled/skills/sk-doc/sk-create-feature-catalog/SKILL.md` | Modify | Version 1.0.1.2 to 1.0.2.0 |
| `.skilled/skills/sk-doc/sk-create-feature-catalog/changelog/v1.0.2.0.md` | Create | Changelog entry |
| `.hermes/skills/sk-create-feature-catalog/SKILL.md` | Modify | Regenerated copy |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | No file under `.skilled/skills/sk-doc/sk-create-feature-catalog/` outside `changelog/` contains `sk-doc-template:` |
| REQ-002 | Every edited file passes `validate_document.py` and the mode's fixture tests still pass |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | sk-create-feature-catalog is at 1.0.2.0 with a changelog entry and an in-sync Hermes copy |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `grep -rn 'sk-doc-template' .skilled/skills/sk-doc/sk-create-feature-catalog --exclude-dir=changelog` returns no match.
- **SC-002**: `sync-skills-hermes.cjs --check` prints PASS.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A hidden reader expects the marker | Low | Repository-wide grep over code and config found none |
| Risk | Template parity tests pin template bytes | Low | The mode's fixture tests ran after the edit and pass |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Not applicable. The change removes one comment line from documentation templates.
- **NFR-P02**: Not applicable.

### Security
- **NFR-S01**: Not applicable. No code path, secret or permission changes.
- **NFR-S02**: Not applicable.

### Reliability
- **NFR-R01**: Validators report the same result for a catalog with or without the comment.
- **NFR-R02**: Not applicable.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: not applicable.
- Maximum length: not applicable.
- Invalid format: a hyphenated spelling `skill_asset_feature-catalog` exists in older catalogs. Phase 2 handles it.

### Error Scenarios
- External service failure: not applicable.
- Network timeout: not applicable.
- Concurrent access: the worktree is isolated from the main checkout.

### State Transitions
- Partial completion: each edit is a tracked-file change that `git checkout` reverts.
- Session expiry: not applicable.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 5/25 | Six files in one mode packet |
| Risk | 3/25 | No reader of the marker exists |
| Research | 8/20 | Origin and reader inventory needed |
| **Total** | **16/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---
