---
title: "Feature Specification: Phase 2: retroactive-removal"
description: "548 feature catalog files across 27 skills and modes still carry the template-name comment that phase 1 stopped producing. This phase removes every copy with one script and versions each owning skill."
trigger_phrases:
  - "retroactive removal"
  - "phase 2 retroactive removal"
  - "feature catalog template comment sweep"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 2: retroactive-removal

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
| **Phase** | 2 of 2 |
| **Predecessor** | 001-source-deprecation |
| **Successor** | None |
| **Handoff Criteria** | No feature catalog file carries the comment and every owning skill is versioned |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the feature catalog template-anchor deprecation. Phase 1 stopped the mode from producing the comment, and this phase removes the copies already in the repository.

**Scope Boundary**: tracked markdown files under `.skilled/` inside a `feature-catalog/` folder, plus the version carriers and derived copies of the skills that own them.

**Dependencies**:
- Phase 1, so no new copies arrive after the sweep.

**Deliverables**:
- One script in `scratch/` that removes both spellings, and its JSON report.
- A patch bump and changelog entry for each of the 27 owning skills and modes, with Hermes copies, activation manifests and the trigger index regenerated.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A census before the sweep found 548 feature catalog files holding the comment: 529 with `skill_asset_feature_catalog` and 19 in `mcp-aside-devtools` with the hyphenated `skill_asset_feature-catalog`. Each sits alone on the line under the H1, followed by a blank line.

### Purpose
Every feature catalog in the repository is free of the comment and validates exactly as before.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Remove both spellings from every tracked feature catalog file, with the blank line after each.
- Patch-bump each owning skill or mode: `SKILL.md`, plus `ROUTER.md`, `description.json`, `hub-router.json` and `mode-registry.json` for hubs, and README frontmatter where it already equals the skill version.
- Regenerate Hermes copies, re-mint the six hub activation manifests and rebuild the trigger index.

### Out of Scope
- Per-document `version` build counts in the catalog files - the versioning standard calls fleet reconciliation advice, not a gate.
- Pre-existing validator findings in the touched skills - none involve the comment.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/**/feature-catalog/**/*.md` (548 files) | Modify | Remove the comment line and one blank line |
| 27 owning `SKILL.md` files and hub carriers | Modify | Patch version bump |
| 27 `changelog/v*.md` entries | Create | One entry per bumped unit |
| `scratch/remove_template_anchor.py`, `scratch/remove-template-anchor-report.json` | Create | Sweep script and its record |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | No feature catalog file under `.skilled/` contains either spelling of the comment |
| REQ-002 | `validate_catalog_package.py` reports the same violations as before the sweep, line numbers aside |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | Each of the 27 owning units has a bumped version and a changelog entry |
| REQ-004 | Hermes copies, activation manifests and the trigger index pass their checks |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `git grep -E 'sk-doc-template: skill_asset_feature[_-]catalog' -- '.skilled/**/feature-catalog/**'` prints nothing.
- **SC-002**: `compiled-route-guard.cjs`, `sync-skills-hermes.cjs --check` and `generate-trigger-index.mjs --check` exit 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A copy sits mid-line and is half-removed | Med | The script refuses to write any file where a copy remains after line removal, and reported none |
| Risk | Removing a blank line glues the H1 to the next section | Low | The blank line goes only when one also precedes the marker; a scan of all 548 files found no H1 without a following blank line |
| Risk | Version bumps stale the hub activation manifests | Med | Re-minted with the manifest tool and copied byte-for-byte to the authored root, then the guard ran |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Not applicable. Documentation only.
- **NFR-P02**: Not applicable.

### Security
- **NFR-S01**: Not applicable. No code path or permission changes.
- **NFR-S02**: Not applicable.

### Reliability
- **NFR-R01**: The sweep is deterministic: it lists files with `git ls-files` and matches one fixed pattern.
- **NFR-R02**: Validators report the same results before and after.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: a file without the comment is left untouched.
- Maximum length: not applicable.
- Invalid format: the hyphenated spelling is matched by the same pattern.

### Error Scenarios
- External service failure: not applicable.
- Network timeout: not applicable.
- Concurrent access: the worktree is isolated from the main checkout.

### State Transitions
- Partial completion: the script writes a file only after checking it, and every change is a tracked-file edit.
- Session expiry: not applicable.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 15/25 | 548 catalog files and 27 versioned units |
| Risk | 6/25 | Mechanical one-line removal with no reader |
| Research | 6/20 | Version carriers and derived artifacts per hub |
| **Total** | **27/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---
