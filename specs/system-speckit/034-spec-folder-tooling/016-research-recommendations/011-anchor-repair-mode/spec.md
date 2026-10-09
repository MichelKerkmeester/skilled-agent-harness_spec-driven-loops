---
title: "Feature Specification: Anchor repair mode"
description: "Promote fix-dup-anchors.mjs into an anchor-repair mode with dry run, collision-checked suffixes, atomic write and un-nesting of the old questions layout across 549 spec.md files."
trigger_phrases:
  - "anchor repair mode"
  - "phase 11 anchor repair mode"
  - "fix duplicate anchors"
  - "un-nest questions anchor"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Anchor repair mode

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
| **Phase** | 11 of 16 |
| **Predecessor** | 010-upgrade-reversibility |
| **Successor** | 012-fold-one-off-repairs |
| **Handoff Criteria** | An anchor-repair mode passes dry run and apply on both glued template pairs and the 549 nested questions layouts, with no unintended marker changes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 11** of the Research recommendations (SH-11). Phase 1 (SH-01) plans the template fix so new scaffolds get the correct anchor layout. It is not built yet, and this phase must wait for it. This phase handles the 549 existing spec.md files that still carry the old nested layout. Phase 13's one-off script `fix-dup-anchors.mjs` deleted glued template pairs and numbered ambiguous duplicates, but it has limitations: dry run always writes a leftovers TSV, it does not check for suffix collisions and it does not handle the un-nesting of the questions layout.

**Scope Boundary**: `heal-spec-docs.cjs`, `upgrade-legacy.mjs` and their tests, to add an anchor-repair mode that handles both the one-off defects and the systematic un-nesting.

**Dependencies**:
- Phase 1 (SH-01) must be built first so the un-nesting target (the fixed template) is available.
- Phase 13 (anchor-contract-alignment) waits for this phase before it makes nesting an error.

**Deliverables**:
- An anchor-repair mode in `heal-spec-docs.cjs` that performs dry run correctly (writes nothing), checks suffix collisions and moves anchors by recognized pattern.
- Integration with `upgrade-legacy.mjs` so the mode runs as one of the repair steps.
- The marker-only un-nesting also runs on archived documents, as the one document step `upgrade-legacy` applies to them.
- Tests covering both glued template pairs and the un-nesting of the questions layout.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 13's one-off script `fix-dup-anchors.mjs` handled duplicate anchor pairs (two anchor copies in one document, paired by literal position). The script had shortcomings: its dry-run mode always wrote a TSV leftovers file, it did not prevent suffix collisions when numbering ambiguous duplicates, and it paired anchors inside code fences by literal position, missing the fence semantics. It also did not handle the un-nesting of the systematic 549 spec.md files where the questions anchor wraps L2 and L3 sections. It is also not integrated into the normal repair pipeline.

### Purpose
Promote `fix-dup-anchors.mjs` into a permanent anchor-repair mode with dry-run that writes nothing, collision detection, atomic writes and fence-aware pairing. Include the un-nesting of the systematic 549 questions layouts as a recognized marker-only move within the mode, so the fix applies at corpus scale in `upgrade-legacy` without special scripting.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Dry-run mode that writes nothing, reporting findings on stdout.
- Suffix collision detection: when numbering ambiguous duplicates, check no collision with existing suffixes.
- Atomic writes: all edits to one document are atomic or all-fail, never partial.
- Fence awareness: pairing logic respects code fence boundaries (`` ``` `` and `~~~`).
- Un-nesting of the questions anchor: recognize the marker-only move from the old nested layout to the fixed layout, moving only the anchor openers and closers, no prose.
- Integration with `upgrade-legacy.mjs` as one repair step that detects and fixes when needed.
- Archived documents: the marker-only un-nesting runs on them too, because it changes marker lines only and never prose. About 164 archived packets carry the old layout (measured 2026-10-08, approximate). The other anchor repairs stay off archived documents.

### Out of Scope
- Changing the semantics of what anchors do or how they are validated.
- Rebuilding or rewriting documents. Only anchor markers move, no prose edits.
- Creating new tests for glued template pairs beyond what phase 13's lane rules covered.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs` | Modify | Add anchor-repair mode with dry run, collision check and atomic write |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs` | Modify | Call anchor-repair as a repair step, and run the un-nesting move on archived packets in `repairArchived`. Update the header comment that says archived documents are never rewritten |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/*.vitest.ts` | Modify | Cover anchor-repair mode for all three defect classes |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Dry-run mode produces findings on stdout and writes no files |
| REQ-002 | Collision detection prevents suffix conflicts when numbering ambiguous duplicates |
| REQ-003 | The questions anchor un-nesting recognizes the systematic nested layout and moves anchors only |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | Atomic writes: all anchor edits in a document complete together or not at all |
| REQ-005 | Fence-aware pairing: code fence boundaries are respected when pairing anchors |
| REQ-006 | The mode runs in `upgrade-legacy --apply` as one repair step |
| REQ-007 | The spec-kit test suite passes with no regression |
| REQ-008 | The un-nesting move also runs on archived packets, changing marker lines only. No other anchor repair touches an archived document |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Dry-run on a document with glued template pairs reports them and writes nothing.
- **SC-002**: Dry-run on a document with the nested questions layout reports the un-nesting and writes nothing.
- **SC-003**: Apply on 50 randomly selected documents from the 549 leaves all documents valid after repair.
- **SC-004**: The anchor-repair step runs in `upgrade-legacy` and the full upgrade passes.
- **SC-005**: An archived fixture with the nested layout is un-nested, and its prose is byte-identical apart from the moved marker lines.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Suffix collision is a subtle defect that may not surface until retrieval breaks | Med | Collision detection is deterministic and tested before any apply |
| Risk | 549 documents are a large batch to un-nest in one fix | High | Batch the changes, validate each group separately, and keep before/after images for rollback |
| Dependency | Phase 1 (SH-01) must be built first | The un-nesting target is the fixed template | Coordinate ordering: SH-01 ships before SH-11 starts |
| Risk | Archived documents change for the first time | An archived record's marker lines move | Marker lines only, checked by a prose-identity test. The existing archived test in upgrade-legacy.vitest.ts (the one that pinned archived documents as never rewritten) is replaced by the un-nesting test, which allows exactly this move |
| Dependency | Phase 13 waits on this phase | Nesting becomes an error only after this lands | Land this before 013's error step |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Dry-run on a 50-document batch completes in under a minute.
- **NFR-P02**: Collision detection is O(n) in the document size.

### Security
- **NFR-S01**: No change rewrites what a document says. Only markers move.

### Reliability
- **NFR-R01**: A failed atomic write leaves the document unchanged.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A document with multiple duplicate pairs handles each independently.
- A document where the old and new questions anchor both exist (manually edited) is reported as ambiguous.

### Error Scenarios
- A code fence that is not closed is treated as extending to EOF.
- A document with unreadable JSON frontmatter is left to the validator.

### State Transitions
- After un-nesting, the document retains all sections but in a different anchor nesting.
- The validator's rules do not change; the document still must carry the same anchors.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | Four tools (heal, upgrade, tests, and fence parser) |
| Risk | 16/25 | Large batch, marker boundaries are semantically loaded |
| Research | 2/20 | Research identified exact pattern and examples |
| **Total** | **32/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None open. The research identified the patterns. Phase 1 will fix the template that is the un-nesting target, and this phase starts after it lands.
- **Archived documents. Decided 2026-10-08 by the operator:** the marker-only un-nesting also runs on archived documents, since it changes marker lines only and never prose. This covers about 164 archived packets. Phase 13 waits for this phase before nesting becomes an error.
<!-- /ANCHOR:questions -->

---
