---
title: "Feature Specification: Phase 4: template-section-fill-guidance"
description: "Every core template section gets one imperative fill instruction and a good and a weak example, the addon sections get an instruction, the hand-written examples are aligned, and a golden render test plus a drift guard hold the result."
trigger_phrases:
  - "template section fill guidance"
  - "phase 4 template section fill guidance"
  - "section fill instruction"
  - "example drift guard"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Phase 4: template-section-fill-guidance

<!-- SPECKIT_LEVEL: 3 -->


---

## EXECUTIVE SUMMARY

Phase 003 turns every core hint into a value token. A token still does not tell a weak model what to write. This phase puts one imperative instruction below every section heading, with a good and a weak example, so the model copies a standard instead of inventing one. It also aligns the 14 drifted examples a model imitates and adds two guards so the guidance cannot rot.

**Key Decisions**: the guidance is an HTML comment below the heading, and the example drift guard delegates anchor comparison to the template contract.

**Critical Dependencies**: phase 002 must be closed, because it repairs the 18 leaked example descriptions and the drift guard's description rules pass only on that tree. Phase 003 must be closed, because every locator is written in both the pre-token and post-token form.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Draft |
| **Created** | 2026-10-23 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 4 of 9 |
| **Predecessor** | 003-versioned-placeholder-gate |
| **Successor** | 005-weak-model-authoring-card |
| **Handoff Criteria** | Every core section has one fill line, the fill test prints `16 passed`, the golden test prints `12 passed`, the drift guard prints `EXAMPLE_DRIFT_OK`, and `goal.md` section 4 names what phases 005, 006 and 007 may assume |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4** of the Make system-spec-kit templates and authoring docs followable by a DeepSeek V4.1 Flash agent swarm specification.

**Scope Boundary**: Edits land in `templates/core`, `templates/addons`, `templates/examples`, and three new files under `runtime/cli`. This phase does not edit the router, the references, the commands or the playbooks. Phase 005 owns the card and phase 007 owns the docs.

**Dependencies**:
- Phase 002 is closed and its 18 example description repairs are in place, because the drift guard expects a usable description in every example.
- Phase 003 is closed and the four core templates and the acceptance criteria template carry the value token and the v2.3 stamp.
- The launch preconditions in `../spec.md` section 3 are met and recorded in `../goal.md` section 4.

**Deliverables**:
- One fill line per section in the four core templates.
- One fill line per section in the ten addon templates.
- Aligned anchors in 14 example documents.
- `runtime/cli/spec/check-example-drift.sh` and its vitest wrapper.
- `runtime/cli/tests/template-fill-guidance.vitest.ts`.
- A regenerated `scaffold-golden-snapshots.vitest.ts.snap`.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A fresh Level 2 scaffold holds 97 bracketed hints and validates clean. A weak model leaves many of them in place, or replaces them with a sentence that restates the heading. The template says what field to fill but never what a good answer looks like. The 21 hand-written examples that a model imitates carry 14 anchor drifts and 18 leaked descriptions, so the model copies a skeleton the validator no longer expects.

### Purpose
Every section tells a weak model the one action to take and shows one good and one weak answer. The examples match the templates again, and two commands fail when either property breaks.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- One `<!-- FILL: ... -->` line below every `## ` heading in the four core templates.
- One fill line below every `## ` heading in the ten addon templates.
- Seven anchor repairs, four in `spec.md.tmpl` and three in `research.md.tmpl`.
- Anchor alignment in 14 example documents. Content stays.
- A read-only example drift guard and its vitest wrapper.
- A fill-guidance test that holds the anchor count per level and document.
- One golden snapshot regeneration.

### Out of Scope
- The token conversion and the v2.3 stamp. Phase 003 owns both.
- The authoring card and the router. Phase 005 owns both.
- The references, the commands, the agents, the playbooks and the READMEs. Phase 006 and phase 007 own them.
- Any change to the verdict for an existing packet. The gate stays version-stamped.
- Any change to `packet-types`. Those templates serve research and review packets and are not core section templates.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/templates/core/spec.md.tmpl` | Modify | 24 fill lines and four crossing repairs |
| `.skilled/skills/system-spec-kit/templates/core/plan.md.tmpl` | Modify | 18 fill lines |
| `.skilled/skills/system-spec-kit/templates/core/tasks.md.tmpl` | Modify | 22 fill lines |
| `.skilled/skills/system-spec-kit/templates/core/implementation-summary.md.tmpl` | Modify | 6 fill lines |
| `.skilled/skills/system-spec-kit/templates/addons/*.tmpl` | Modify | 61 fill lines across ten templates and three crossing repairs |
| `.skilled/skills/system-spec-kit/templates/examples/level-1/implementation-summary.md` | Modify | Add the `how-delivered` anchor |
| `.skilled/skills/system-spec-kit/templates/examples/level-2/implementation-summary.md` | Modify | Add one anchor and remove two |
| `.skilled/skills/system-spec-kit/templates/examples/level-2/plan.md` | Modify | Rename three anchors |
| `.skilled/skills/system-spec-kit/templates/examples/level-2/spec.md` | Modify | Remove one anchor |
| `.skilled/skills/system-spec-kit/templates/examples/level-2/tasks.md` | Modify | Add nine anchors |
| `.skilled/skills/system-spec-kit/templates/examples/level-3/implementation-summary.md` | Modify | Add one anchor, rename one, remove six |
| `.skilled/skills/system-spec-kit/templates/examples/level-3/plan.md` | Modify | Rename six anchors and remove one |
| `.skilled/skills/system-spec-kit/templates/examples/level-3/spec.md` | Modify | Rename one anchor and remove six |
| `.skilled/skills/system-spec-kit/templates/examples/level-3/tasks.md` | Modify | Add nine anchors and remove one |
| `.skilled/skills/system-spec-kit/templates/examples/level-3+/decision-record.md` | Modify | Remove one anchor |
| `.skilled/skills/system-spec-kit/templates/examples/level-3+/implementation-summary.md` | Modify | Add two anchors and remove ten |
| `.skilled/skills/system-spec-kit/templates/examples/level-3+/plan.md` | Modify | Rename nine anchors and remove one |
| `.skilled/skills/system-spec-kit/templates/examples/level-3+/spec.md` | Modify | Rename three anchors and remove one |
| `.skilled/skills/system-spec-kit/templates/examples/level-3+/tasks.md` | Modify | Add nine anchors and remove four |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/check-example-drift.sh` | Create | Read-only example drift guard |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/example-drift.vitest.ts` | Create | Wires the guard into the suite |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/template-fill-guidance.vitest.ts` | Create | Guards the fill line and the anchor count |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/snapshots/scaffold-golden-snapshots.vitest.ts.snap` | Modify | Regenerated once |
| `spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md`, `goal.md`, `implementation-summary.md` | Modify | Planning and evidence for this phase |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Every `## ` section in the four core templates has exactly one fill line, and the fill test prints `16 passed`. |
| REQ-002 | Every content section in the ten addon templates has one fill line. The `TEMPLATE INSTRUCTIONS` and `Author Instructions` headings are fixed instructions and get none, and the `WHEN TO USE THIS TEMPLATE` heading gets one only in `research.md.tmpl`, where it states the question the research answers. |
| REQ-003 | The anchor count per level and document equals the frozen table in `plan.md` section 3, and T013 prints an empty diff. |
| REQ-004 | The awk crossing command in `plan.md` section 3 prints nothing on every `.tmpl` under `templates`. |
| REQ-005 | Every example in the alignment table passes `check-example-drift.sh`, and the guard prints `EXAMPLE_DRIFT_OK`. |
| REQ-006 | The golden test prints `12 passed` without `-u` after one regeneration. |
| REQ-007 | No path outside the files in section 3 differs from the start commit. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-008 | A read-only frontier review ran, and each finding is applied or recorded in `goal.md` section 4 with the reason it was not. |
| REQ-009 | The failing-first result for both guards is saved in `scratch/test/failing-first.txt`. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A weak model that opens a scaffold sees one imperative action and one good and one weak example for every section it must fill.
- **SC-002**: A filled section leaves no residue that the placeholder gate counts as an unfilled placeholder.
- **SC-003**: A maintainer who edits one example anchor can detect the drift with one command that prints one line per failure.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 003 keeps its conversion rule and stamp | Every locator is stale | Each row in `plan.md` gives the heading, which phase 003 does not change, so the insert point survives either form |
| Dependency | The template contract keeps the required and optional anchor lists | The drift guard reports false drift | The guard calls the contract, so it inherits any change instead of hard-coding a list |
| Risk | A lane edits a file another lane owns | Two writers on one file | The three lanes own disjoint paths and the conductor checks `git status` after each lane |
| Risk | The fill text is too long for a table cell and breaks the template | A scaffold renders broken | Every line is one physical line and the fill test renders all 16 documents |
| Risk | A snapshot regeneration hides a real regression | A broken render passes | The fill test and the anchor count run separately from the snapshot diff, and the frontier review reads the rendered sections |
<!-- /ANCHOR:risks -->

---


## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The 16 renders in the fill test finish under 60 seconds on the build worktree.

### Security
- **NFR-S01**: No brief carries a credential, token or key. Workers inherit provider login from the environment only.

### Reliability
- **NFR-R01**: The drift guard is read-only and exits 1 on any drift, so a second run on the same tree prints the same lines.

---

## 8. EDGE CASES

### Data Boundaries
- Empty input: a template with no `## ` heading fails the fill test with a named message rather than passing silently.
- Maximum length: a fill line that would exceed 400 characters is shortened at authoring time. The test does not enforce a length, the review does.

### Error Scenarios
- External service failure: a provider error stops the lane dispatch. The conductor records it and retries once after 10 minutes, then stops the phase.
- Phase 003 not closed: the token form is absent, but the heading locator still works. The conductor records the deviation and continues with the heading form.
- A section that exists only at one level: the fill line sits inside the same gate as the heading, so it renders only at that level.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 14/25 | Files: 38 changed, 0 external systems |
| Risk | 6/25 | Auth: N, API: N, Breaking: N |
| Research | 12/20 | Seven anchor repairs, 14 example diffs, one renderer contract |
| Multi-Agent | 12/15 | Workstreams: 3 edit lanes and 1 conductor |
| Coordination | 8/15 | Dependencies: phase 003 only |
| **Total** | **52/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Phase 003 changes a heading, not only a hint | M | L | Every row names a heading, and T001 confirms the headings on the post-003 tree |
| R-002 | A lane writes a file another lane owns | H | L | Disjoint paths, and the conductor checks `git status` after each lane |
| R-003 | The drift guard treats an optional section as drift | M | M | The guard reads the contract, which marks optional anchors |
| R-004 | The snapshot diff hides a visible render error | M | L | The fill test and the frontier review read the rendered sections |
| R-005 | A weak model copies the weak example | H | L | The weak example carries a `WEAK:` label and the instruction names the failure |

---

## 11. USER STORIES

### US-001: A section that tells the model what to write (Priority: P0)

**As a** DeepSeek V4.1 Flash worker, **I want** one imperative instruction and one good and one weak example under each heading, **so that** I copy a standard instead of inventing one.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-002: A guard that catches example drift (Priority: P0)

**As a** maintainer, **I want** one read-only command that names every example whose anchors differ from its template, **so that** a template edit cannot silently leave the examples stale.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- None that block this phase. Every choice it needs is frozen in `goal.md` section 1.
- Deferred: should a later gate reject a leftover fill comment in a filled document. The comment is not a placeholder today, so this phase leaves the decision to phase 005.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`
- **Decision Records**: See `plan.md` section L3: ARCHITECTURE DECISION RECORD

---

