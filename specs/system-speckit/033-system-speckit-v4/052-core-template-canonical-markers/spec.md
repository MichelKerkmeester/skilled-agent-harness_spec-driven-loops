---
title: "Feature Specification: Phase 52: Core template canonical markers"
description: "The four core spec templates write their fill-in slots as free bracket prose and plain instruction text instead of the canonical marker the strict gate checks, so an unfilled slot passes validation and survives into finished packets."
trigger_phrases:
  - "core template canonical markers"
  - "your_value_here placeholder"
  - "placeholder filled gate blind spot"
  - "check-placeholders punctuation"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 52: Core template canonical markers

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Planned |
| **Created** | 2026-09-23 |
| **Branch** | Not created. Branches come from `sk-git` when implementation starts |
| **Parent Spec** | ../spec.md |
| **Phase** | 52 of 53 |
| **Predecessor** | 051-save-writer-continuity-fields |
| **Successor** | 053-legacy-template-default-detection |
| **Handoff Criteria** | A fresh scaffold fails `PLACEHOLDER_FILLED` once per unfilled slot and passes once they are filled, the broad scan flags every canonical marker, no existing packet changes its validation result, and the final list of retired default strings is recorded for phase 053. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 52** of the system-spec-kit v4 specification. It prevents new unfilled slots. Phase 053 handles the ones already in the tree.

**Scope Boundary**: the four core templates, the slots `create.sh` injects in phase mode, and the broad placeholder scan. The strict gate's marker pattern stays as it is.

**Dependencies**:
- The canonical marker defined in `references/templates/template-style-guide.md:92`, which the addon templates and the phase-parent template already use.
- The strict gate's marker pattern at `runtime/lib/validation/orchestrator.ts:618`, which already catches the canonical marker.

**Deliverables**:
- Every author-fill slot in the core templates written as `[YOUR_VALUE_HERE: guidance]`.
- The same form for the slots `create.sh` writes into parent and child phase docs.
- A broad scan that flags the canonical marker whatever punctuation its guidance contains.
- The list of default strings the core templates shipped before this phase, handed to phase 053.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The four core spec templates write their fill-in slots as free bracket prose and plain instruction text instead of the canonical marker the strict gate checks, so an unfilled slot passes validation and survives into finished packets. The strict gate flags only `[YOUR_VALUE_HERE:` and `[NEEDS CLARIFICATION:`, and the core templates contain neither. The broad scan in `spec/check-placeholders.sh:136` needs an uppercase first letter and allows almost no punctuation, so it misses `[2-3 sentences: ...]`, `[Opening hook: ...]` and the canonical marker itself, and no scan sees an unbracketed default such as "Open with a hook: ...".

### Purpose
An unfilled slot in any newly scaffolded packet fails strict validation by name, using the placeholder form the style guide already prescribes.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Rewrite each author-fill slot in `spec.md.tmpl`, `plan.md.tmpl`, `tasks.md.tmpl` and `implementation-summary.md.tmpl` as a canonical marker, frontmatter descriptions included. The tasks template's description, "Task Format: T### [P?] Description (file path)", becomes a slot too.
- Rewrite the slots `create.sh` injects in phase mode (`[Phase N scope]`, `[Criteria TBD]`, `[Verification TBD]`, `[To be defined during planning]`) the same way.
- Make the broad scan flag the canonical markers with the same pattern the strict gate uses.
- Update tests and fixtures that encode the old default text.
- Record the retired default strings for phase 053.

### Out of Scope
- Docs already in the tree that carry old defaults - phase 053 reports them.
- The addon and phase-parent templates - they already use the canonical marker.
- Render-time level markers such as `[template:level-2/...]` - they are template machinery, not author slots.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/templates/core/spec.md.tmpl` | Modify | Slots become canonical markers |
| `.skilled/skills/system-spec-kit/templates/core/plan.md.tmpl` | Modify | Slots become canonical markers |
| `.skilled/skills/system-spec-kit/templates/core/tasks.md.tmpl` | Modify | Slots become canonical markers |
| `.skilled/skills/system-spec-kit/templates/core/implementation-summary.md.tmpl` | Modify | Slots become canonical markers |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh` | Modify | Phase-mode slots become canonical markers |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/check-placeholders.sh` | Modify | Flag canonical markers regardless of punctuation |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/` | Modify | Fixtures and expectations for the new slot text |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every author-fill slot in the four core templates and in `create.sh`'s phase-mode output is a canonical marker. | A fresh `create.sh` scaffold at each level fails `PLACEHOLDER_FILLED` with one finding per slot, and passes once every slot is filled. |
| REQ-002 | The broad scan flags a canonical marker whatever its guidance contains. | `check-placeholders.sh` reports `[YOUR_VALUE_HERE: 2-3 sentences on the approach]`, which it passes today. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Existing suites pass with fixtures updated where they encoded the old default text. | `test-phase-system.sh`, `test-validation-extended.sh` and the vitest suite pass. |
| REQ-004 | Every workflow that scaffolds and then validates still completes. | Each caller in the Setup inventory either fills its slots before validating or is exempt as a workflow-owned doc. |
| REQ-005 | The retired default strings are recorded for phase 053, the tasks description included. | A list in this phase's `implementation-summary.md` quotes every default string the core templates shipped before this phase. |
| REQ-006 | No existing packet changes its validation result because of this phase, so nobody is forced to fix an older spec retroactively. | A recursive strict run over `specs/` before and after the change yields the same set of passing and failing folders. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: No newly scaffolded packet can reach `RESULT: PASSED` with an unfilled core-template slot.
- **SC-002**: The broad scan and the strict gate agree on the canonical markers: each flags every one of them.
- **SC-003**: Older packets pass or fail exactly as they did before the change.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A workflow that scaffolds and validates before filling, such as an authoring swarm or a deep loop, starts failing | High | Inventory the callers first (T001) and fix or exempt each one before the templates change |
| Risk | Guidance text grows when rewritten into a marker | Low | Keep each marker's guidance to the slot's existing wording |
| Dependency | Phase 053 needs the exact retired strings | Med | REQ-005 records them before this phase closes |
| Risk | A change reaches existing docs and fails packets that passed before | Med | Existing docs hold the old text, not the marker, so the strict gate cannot see them. REQ-006 proves it with a before-and-after run |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None open. Answered by the operator on 2026-09-23:

- The tasks template's description becomes a slot. The ~1,600 existing `tasks.md` files that carry it are not forced to change (REQ-006). Phase 053 reports them as warnings and measures whether a cheap model can draft replacements.
<!-- /ANCHOR:questions -->

---
