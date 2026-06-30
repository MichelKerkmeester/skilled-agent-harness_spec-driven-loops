---
title: "Feature Specification: Phase 40: design-playbook-filename-denumbering"
description: "Remove the numeric prefix from 61 per-feature manual-testing-playbook filenames across the 5 sk-design sub-skills (keeping numbered category folders), aligning them with packet 133's canonical convention, and rewrite all live references."
trigger_phrases:
  - "design playbook filename denumbering"
  - "sk-design numbered playbook files"
  - "remove numeric prefix design playbook"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/040-design-playbook-filename-denumbering"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Phase complete"
    next_safe_action: "Phase complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "remediation/040-design-playbook-filename-denumbering"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 40: design-playbook-filename-denumbering

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-06-29 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
| **Parent Spec** | ../spec.md |
| **Phase** | 40 (sk-design doc hygiene) |
| **Predecessor** | 039-design-enforcement-build |
| **Successor** | None |
| **Handoff Criteria** | 0 numbered per-feature playbook filenames remain in sk-design; every live reference resolves; numbered category folders preserved |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

A sk-doc-routed investigation found **authoring drift in sk-design**, not template drift. sk-doc's templates + creation references correctly model packet 133's convention — *numbered category folders, but per-feature files carry no numeric prefix* (`feature-name.md`). The sk-design design-* sub-skill manual testing playbooks, authored 2026-06-27 during the design-enforcement build (after 133 set the rule), used the old `NNN-feature-name.md` style. 61 files diverge; every other skill complies.

**Scope Boundary**: Rename the 61 numbered per-feature playbook FILES (drop the `NNN-` prefix) and rewrite their references. **Keep** the numbered category FOLDERS (`NN--category/`). No content rewrites beyond the rename + reference fix.

**Dependencies**:
- The canonical convention (packet 133, complete): category folders numbered, per-feature files not.

**Deliverables**:
- 61 files renamed (`NN--category/NNN-name.md` → `NN--category/name.md`) across design-interface (17), design-md-generator (15), design-audit (11), design-motion (10), design-foundations (8).
- ~160 reference occurrences rewritten across the sub-skill root `manual_testing_playbook.md` files + design-md-generator's `feature_catalog` cross-references.

**Changelog**:
- When this phase closes, add the matching file to the sk-design changelog.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The sk-design manual testing playbooks use globally-numbered per-feature filenames (`001-live-extraction.md`, `007-report-generation.md`). Packet 133 removed this exact pattern repo-wide because the numbers force renumbers on insert/reorder, drift out of sequence, and add maintenance cost without navigational value the root document does not already provide. The design playbooks reintroduced the anti-pattern, leaving sk-design inconsistent with every other skill and with sk-doc's own templates.

### Purpose
Bring sk-design's playbooks back onto the canonical convention: numbered category folders for section order, stable un-prefixed per-feature filenames, with order defined by the root playbook listing.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Rename 61 numbered per-feature `.md` files under `sk-design/*/manual_testing_playbook/NN--category/` to drop the leading `NNN-`.
- Rewrite every LIVE reference to the renamed files (sub-skill root playbooks + design-md-generator feature_catalog cross-refs + any sibling cross-links).

### Out of Scope
- The numbered category FOLDERS (`NN--category/`) — kept by design (packet 133).
- Feature/scenario IDs inside content (`M-219`, `EX-001`) — identifiers, not filenames.
- Frozen deep-research lineage logs under `154-.../**/research/**` that mention old filenames — historical artifacts, left as-is (history-care).
- The 36 numbered non-catalog/playbook files in other skills (different doc families) — not this drift.
- sk-doc templates/standards — already correct; no change.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `sk-design/{interface,md-generator,audit,motion,foundations}/manual_testing_playbook/NN--*/NNN-*.md` | Rename | Drop the `NNN-` prefix (61 files) |
| `sk-design/*/manual_testing_playbook/manual_testing_playbook.md` | Modify | Rewrite per-feature link paths |
| `sk-design/design-md-generator/feature_catalog/**` | Modify | Rewrite cross-references to renamed playbook files |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Files denumbered | `find sk-design -path '*manual_testing_playbook*' -name '[0-9][0-9]*.md'` returns 0 |
| REQ-002 | Folders preserved | `NN--category/` folders unchanged (still numbered) |
| REQ-003 | References resolve | No link points to a now-missing `NNN-` filename; the markdown-link guard passes |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | History untouched | Frozen research lineage logs are not rewritten |
| REQ-005 | Convention parity | sk-design matches sk-doc's documented convention and other skills |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: 0 numbered per-feature playbook filenames remain in sk-design; 61 files renamed; numbered category folders intact.
- **SC-002**: `check-markdown-links.cjs` (or `grep` for `NNN-*.md` link paths) shows no dangling reference inside sk-design.
<!-- /ANCHOR:success-criteria -->

### Acceptance Scenarios

- **Given** the renames, **When** a reader opens a sub-skill root `manual_testing_playbook.md`, **Then** every per-feature link resolves to an un-prefixed file.
- **Given** the rename, **When** `find` scans sk-design playbooks for numbered filenames, **Then** it returns nothing.

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A reference missed → dangling link | Broken playbook navigation | Grep sweep + markdown-link guard as a P0 gate |
| Risk | Renaming a category folder by mistake | Loses section order | Rename FILES only; assert folders unchanged |
| Risk | Concurrent session regenerates a design playbook mid-rename | Conflict / re-numbering | Verify against HEAD; commit surgically by explicit path |
| Risk | Rewriting frozen research logs | Falsifies history | Exclude `**/research/**` lineage artifacts |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None — the convention is fixed by packet 133; the only variable is reference completeness, gated by the link sweep.
<!-- /ANCHOR:questions -->
