---
title: "Feature Specification: Template phrase cleanup, round two"
description: "Phase 11 cleaned exact template blocks from spec and acceptance criteria files. Partial blocks, cut-off seeded phrases and the plan, tasks and implementation summary templates' defaults remain. This phase handles all three."
trigger_phrases:
  - "template phrase cleanup round two"
  - "phase 12 template phrase cleanup round two"
  - "partial template phrase blocks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Template phrase cleanup, round two

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-10-07 |
| **Branch** | `worktrees/091-consolidate-small-packets` |
| **Parent Spec** | ../spec.md |
| **Phase** | 12 of 12 |
| **Predecessor** | 011-template-phrase-census-and-cleanup |
| **Successor** | None |
| **Handoff Criteria** | The census reports no live template default phrase in any of the five templates' documents, and every touched packet passes strict validation |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 12** of the spec folder tooling parent. The operator asked for the three follow-ups that Phase 11 left open: partial blocks, cut-off seeded phrases and the remaining templates.

**Scope Boundary**: the judge, the seeder, the cleanup tool and the cleanup run on live packets. Archived packets stay untouched.

**Dependencies**:
- Phase 11's tools and single phrase lists.

**Deliverables**:
- Default phrase sets for the plan, tasks and implementation summary templates, seeding for those documents, partial-block cleanup, a stop-word trim for description phrases, and the applied cleanup.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
45 live files keep two or three template defaults beside an author phrase, because Phase 11 replaced only the exact four-line block. 49 seeded phrases end on a word like "that" or "a". About 1,213 plan, tasks and implementation summary files still carry their templates' default phrases, such as "implementation plan" and "task breakdown".

### Purpose
No live packet is indexed under a phrase that only describes a template.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Default phrase sets for `plan.md`, `tasks.md` and `implementation-summary.md`, each pinned by a test to its template, in the `template-default` judge class.
- `create.sh` seeds those three documents with one phrase each, built from the packet slug.
- The cleanup tool handles the three new document kinds, and removes individual default phrases when at least one author phrase remains.
- A trailing stop-word trim for the description-derived phrase, the same in `create.sh` and the cleanup tool, and a reseed of the cut-off phrases already written.
- The applied cleanup on live packets, re-derived metadata, strict validation and a rebuilt trigger index.

### Out of Scope
- Archived packets under `z_archive/`.
- The CI rebuild job's push permission, which is Phase 10's and needs an operator decision.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/phrase-judge.mjs` | Modify | Three more default sets |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh` | Modify | Seed three more documents, trim stop words |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/template-phrase-cleanup.mjs` | Modify | New kinds, partial blocks, stop-word trim, reseed |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/template-phrase-census.mjs` | Modify | Counts the new kinds as carriers |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/*.vitest.ts` | Modify | Pins and behavior tests |
| `.skilled/skills/system-spec-kit/references/retrieval/retrieval-conventions.md` | Modify | The class lists all five templates |
| `specs/**` live packets | Modify | The applied cleanup |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The judge flags each default phrase of the five templates as `template-default`, from lists pinned to the templates |
| REQ-002 | The cleanup never removes an author phrase, and a second run changes nothing |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | A new packet's plan, tasks and implementation summary carry seeded phrases, not defaults |
| REQ-004 | A partial block loses its default phrases when an author phrase remains |
| REQ-005 | No description-derived phrase ends on a stop word, in new packets or in the corpus |
| REQ-006 | After the applied cleanup, every touched packet passes strict validation and the trigger index check finds nothing stale |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The census reports 0 live carriers for all five templates.
- **SC-002**: The spec-kit CLI tests stay at 0 failures.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The apply edits about 1,300 files | High | Dry run and sample review first, its own commit, one revert undoes it |
| Risk | A phrase like "verification checklist" is an author's real choice | Low | Only the exact template phrases count, and author phrases are never removed |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The cleanup runs over `specs/` in under two minutes.

### Security
- **NFR-S01**: The tools write only frontmatter `trigger_phrases` lines under `specs/`.

### Reliability
- **NFR-R01**: The cleanup is idempotent.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A description made only of stop words seeds no description phrase.
- A list where every phrase is a default is treated like a full block and seeded.

### Error Scenarios
- A file without frontmatter is skipped and reported, never rewritten.

### State Transitions
- A packet already cleaned in Phase 11 changes only if it has a cut-off phrase or a new-kind default.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 15/25 | Four tools and a large data change |
| Risk | 16/25 | Mass edit gated by dry run and review |
| Research | 3/20 | Counts and approach come from Phase 11 |
| **Total** | **34/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---
