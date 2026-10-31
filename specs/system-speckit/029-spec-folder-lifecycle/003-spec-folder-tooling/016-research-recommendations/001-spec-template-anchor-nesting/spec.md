---
title: "Feature Specification: Spec template anchor nesting"
description: "The spec.md template wraps L2 and L3 sections inside the questions anchor, which breaks retrieval and merges. Move the anchor opener to just above Open Questions and regenerate golden snapshots."
trigger_phrases:
  - "spec template anchor nesting"
  - "phase 1 spec template anchor nesting"
  - "fix nested questions anchor"
  - "questions anchor scope"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Spec template anchor nesting

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-10-08 |
| **Branch** | `worktrees/091-consolidate-small-packets` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 16 |
| **Predecessor** | None |
| **Successor** | 002-phase-scaffold-graph-metadata |
| **Handoff Criteria** | New scaffolds render with the fixed template and the golden snapshot test passes with pairing and order assertions for all levels |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the Research recommendations (SH-01). The template's `questions` anchor opens at line 184, before the L2 and L3 NFR, edge-cases and complexity sections, and closes at line 399 or 425, wrapping those sections inside it. This breaks anchor-based retrieval and merges.

**Scope Boundary**: `templates/core/spec.md.tmpl`, the golden snapshot test and its `.snap` file.

**Dependencies**:
- None. This is independent.

**Deliverables**:
- Move the anchor opener to directly above the Open Questions heading for each level.
- Regenerate golden snapshots for L2, L3 and L3+.
- Add pairing, order and no-nesting assertions to the snapshot test.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The spec.md template opens the questions anchor at line 184, before the level 2, 3 and 3+ block that renders NFR, edge-cases and complexity sections. The anchor closes at line 399 (for levels 1, 2, 3) or 425 (for level 3+). This nesting breaks `parseAnchoredSections` in `template-structure.js`, which skips the whole anchor once it finds its close and never returns the nested sections. It also misguides retrieval systems and makes merges incorrect. The validator does not detect the nesting and the golden snapshot test pinned the nested layout as expected output. About 549 spec.md files carry the layout (405 live, 144 archived, snapshot), and every new scaffold inherits it.

### Purpose
Move the anchor opener to just above each level's Open Questions heading so the questions anchor contains only the questions themselves, leaving NFR, edge-cases and complexity outside it and retrievable.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Move the questions anchor opener for L1, L2, L3 and L3+ to directly above each level's Open Questions heading
- Move the questions anchor closer to directly before the RELATED DOCUMENTS section (from line 399 for levels 1/2/3 and line 425 for level 3+)
- Render every level and capture the new golden snapshots for L2, L3 and L3+ in `scaffold-golden-snapshots.vitest.ts.snap`
- Add an `assert noNesting` check to the snapshot test for every level

### Out of Scope
- Changing what any level's template says. The text, field names and structure stay the same.
- Fixing existing 549 files that carry the old layout. That is part of SH-11.
- Changing other anchors or the validator rules.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/templates/core/spec.md.tmpl` | Modify | Move the anchor opener and closer |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/scaffold-golden-snapshots.vitest.ts` | Modify | Add noNesting assertion and regenerate snapshots |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/snapshots/scaffold-golden-snapshots.vitest.ts.snap` | Modify | New snapshots after template change |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The questions anchor opens directly above Open Questions and closes after questions end, nesting no sections |
| REQ-002 | Golden snapshots capture the L2, L3 and L3+ renders with the fixed anchor layout |
| REQ-003 | A new scaffold using the fixed template passes strict validation on ANCHORS_VALID |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | The snapshot test asserts no anchor nesting, order and pairing for every level |
| REQ-005 | The spec-kit test suite passes with no regression |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A new L2 scaffold renders with the questions anchor at the right depth and contains only the questions.
- **SC-002**: The snapshot test passes and documents the fixed anchor layout for all three levels.
- **SC-003**: Running `create.sh` on a test path produces a spec.md that passes strict validation on ANCHORS_VALID.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The snapshot has 24 entries per level to regenerate | Med | Verify the line-by-line diff matches expectations and covers all four levels |
| Dependency | `template-structure.js` behavior after anchor is moved | The retrieval surface depends on correct nesting | Verify `parseAnchoredSections` now finds the right regions |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Template rendering stays sub-second per level.

### Security
- **NFR-S01**: No change to security-sensitive content or paths.

### Reliability
- **NFR-R01**: Template rendering is deterministic and produces identical output for the same inputs.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- The anchor opener/closer positions are fixed literal text, no whitespace variance.

### Error Scenarios
- A template syntax error during render is reported early.

### State Transitions
- Level 1 and level 3+ have different closing line numbers, both must move correctly.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | One template file, one test file, snapshots |
| Risk | 5/25 | Template change is isolated, low blast radius |
| Research | 2/20 | Research named exact line numbers and the cause |
| **Total** | **15/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

None open. The research named the exact fix, and three points settled during the build:

- Only the L3+ closer needed to move. The L1, L2 and L3 closer already sat directly after the last question, so only their opener moved and the closer stayed where it was. The L3+ closer sat after the RELATED DOCUMENTS section and now sits directly after Question 1, which is the only question the L3+ template carries.
- `review.spec.md.tmpl` is flat and needed no template change, but the golden test never rendered it. Review round 1 raised that as a P1; the test now renders it and asserts its anchors too, which added one snapshot entry.
- The existing 549 spec.md files that carry the old layout stay out of scope and go to the anchor-repair phase. The doubled blank line the removed opener leaves in the L2 and L3 renders is cosmetic and was left unchanged.
<!-- /ANCHOR:questions -->

---
