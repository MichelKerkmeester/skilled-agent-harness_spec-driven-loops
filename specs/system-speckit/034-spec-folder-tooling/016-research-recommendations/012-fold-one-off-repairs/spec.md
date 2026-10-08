---
title: "Feature Specification: Fold one-off repairs"
description: "Phase 15 and earlier phases used one-off scripts for archive and frontmatter fixes. This phase retires them and folds their logic into permanent tools with better testing and alignment."
trigger_phrases:
  - "fold one off repairs"
  - "fold remaining one-offs"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Fold one-off repairs

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-10-08 |
| **Branch** | `worktrees/091-consolidate-small-packets` |
| **Parent Spec** | ../spec.md |
| **Phase** | 12 of 16 |
| **Predecessor** | 011-anchor-repair-mode |
| **Successor** | 013-anchor-contract-alignment |
| **Handoff Criteria** | Frontmatter value-source respects document class with tests, grouped-detail report implemented with tests, suite passes with 0 failures |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 12** of the Research recommendations specification. Phase 13 used one-off scripts to repair issues. `fix-specfolder.mjs` to rewrite description.json specFolder is already replaced by Phase 15's repair-derived.cjs call in archive.sh. `add-fm-fields.mjs` to fill frontmatter is not in the repo but its role can be folded into permanent tools. `fix-dup-anchors.mjs` belongs to Phase 11 (anchor repair mode).

This phase folds the remaining one-off logic (frontmatter value-source) into permanent tools and adds grouped-detail reporting.

**Scope Boundary**: Frontmatter value-source order, grouped-detail reporting, and consolidation of one-off repair logic.

**Dependencies**:
- None. This phase is independent.

**Deliverables**:
- Fill-frontmatter value-source order: template literal per document class first, spec.md copy only where the template leaves the field to the author (e.g., goal.md uses `important` and `planning`).
- Grouped-detail report mode in upgrade-legacy: show failures grouped by rule with a detail count.
- Tests pinning both behaviors.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 13 used one-off scripts for repairs. `fix-specfolder.mjs` is replaced, but `add-fm-fields.mjs` logic (not in repo) copies from spec.md without respecting document class (goal.md uses `important` and `planning`, not standard fields). Upgrade-legacy has no grouped-detail report mode to show which rules block the most packets.

### Purpose
Fold frontmatter fill logic into permanent tools with correct value-source order per document class, add grouped-detail reporting in upgrade-legacy, and ensure every repair step is testable and idempotent.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Fill-frontmatter value-source order: template literal per document class first, spec.md second.
- Grouped-detail report mode in upgrade-legacy showing failures grouped by rule with count.
- Retire add-fm-fields.mjs's role by folding into permanent tools.
- Tests pinning both behaviors.

### Out of Scope
- Archive re-derivation (Phase 15 completed it, Phase 003 verifies it).
- Anchor repair logic (covered by Phase 011).
- Fix-dup-anchors.mjs (belongs to Phase 011).
- What documents say (only metadata fields).
- Validator rules themselves.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs` | Modify | Add grouped-detail report mode and wire fillMissingFrontmatter |
| `.skilled/skills/system-spec-kit/runtime/cli/lib/frontmatter-migration.ts` | Modify | Ensure template literal per document class comes before fallback source |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/upgrade-legacy.vitest.ts` | Modify | Add tests for grouped-detail report format and frontmatter value-source |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Fill-frontmatter value-source order respects document class and template literal takes precedence |
| REQ-002 | Grouped-detail report in upgrade-legacy output groups failures by rule with count |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | Tests pin value-source behavior for document classes like goal.md |
| REQ-004 | Tests pin grouped-detail report format and behavior |
| REQ-005 | Suite passes with no regressions |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Frontmatter fill prioritizes template literal and respects document-class rules (goal.md uses `important` and `planning`).
- **SC-002**: Grouped-detail report shows "### folder / x RULE" format with counts.
- **SC-003**: Tests pin value-source and grouped-detail behavior; suite passes with no regressions.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Changing frontmatter value-source may regress packets relying on old order | Med | Tests pin the value-source order and document class rules before change |
| Risk | Grouped report format may differ from operator expectations | Low | Clarify format in review before wide deployment |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Upgrade-legacy runs within minutes on the full corpus as before.

### Reliability
- **NFR-R01**: A second run on the same packets is a no-op (idempotent).
- **NFR-R02**: Grouped report never omits a failing packet.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A document with no frontmatter gets frontmatter built from the template.
- A document with no spec.md (rare) does not attempt to copy from missing source.
- Goal.md with `important` and `planning` respects those fields.

### Error Scenarios
- A missing template class: use generic defaults.
- A malformed frontmatter the detector refuses: leave it untouched.

### State Transitions
- A document upgraded from v3: frontmatter is filled from template, not overwritten.
- A document with an authored frontmatter: template defaults do not overwrite authored values.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | One tool, fill logic, report format |
| Risk | 8/25 | Value-source change affects all packets, but tests pin behavior |
| Research | 0/20 | Phase 14 and Phase 13 completed the investigation |
| **Total** | **18/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. The research and Phase 15 resolved the archive and frontmatter approach.

<!-- /ANCHOR:questions -->

---


