---
title: "Feature Specification: Phase 3: Goal Authoring Standards and Exemplars"
description: "This phase sets a reviewable quality bar for packet goals and checks it against known corpus failures."
trigger_phrases:
  - "goal authoring standards"
  - "goal criteria checkability"
  - "goal exemplars"
  - "phase goal objective rubric"
importance_tier: "important"
contextType: "specification"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 3: Goal Authoring Standards and Exemplars

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-25 |
| **Branch** | worktrees/068-create-goal-mode |
| **Parent Spec** | ../spec.md |
| **Phase** | 3 of 9 |
| **Predecessor** | 002-mode-scaffold |
| **Successor** | 004-parent-and-nested-goal-authoring |
| **Handoff Criteria** | Each standard names the failure it prevents and cites a real goal example; the rubric rejects every known-bad example and passes the known-good child objective |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the Create the sk-create-goal sk-doc mode that authors packet goals specification.

**Scope Boundary**: Add the goal-content standards and corpus exemplars to the mode packet, then make the authoring reference reachable from its reference index and skill workflow.

**Dependencies**:
- Phase 2 delivers the sk-create-goal packet in the create-skill shape, with no fork of the system-spec-kit goal template, as required by the parent handoff (specs/sk-doc/060-create-goal-mode/spec.md:122,143).
- The goal template and Human Voice Rules define the source contracts for this phase (.skilled/skills/system-spec-kit/templates/addons/goal.md.tmpl:49,53,96-115; .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md:39-97).

**Deliverables**:
- references/authoring-standards.md with five standards and the failure each prevents.
- assets/goal-exemplars.md with three known-bad examples and one known-good child objective.
- Updates to references/README.md and SKILL.md that load and index the standards and exemplars.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Goal files can retain a template objective, include criteria that require checking other files or state a child count that conflicts with the binding table (specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/030-mutation-suite/goal.md:43; specs/system-speckit/033-system-speckit-v4/010-goal-file-addon/goal.md:84-90; specs/sk-git/028-crawlable-commit-history/goal.md:81-90,111). The goal template defines the objective, frozen-decision, criteria and volatile-log sections, but it does not decide whether their content is clear and checkable (.skilled/skills/system-spec-kit/templates/addons/goal.md.tmpl:49,53,96-115; specs/sk-doc/060-create-goal-mode/001-goal-inventory-and-mode-contract/scratch/wave1-goal-system-audit.md:39-45).

### Purpose
Give sk-create-goal a reader-checkable standard for goal content, with corpus examples that show where the standard passes and fails.

<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Define standards for the one-sentence objective, phase-local frozen decisions, self-contained completion criteria, the volatile log and human voice.
- State the failure each standard prevents and give a reader a concrete check for applying it.
- Record three known-bad corpus examples and one known-good phase-child objective, with verified source citations and rubric outcomes.
- Update the mode reference index and skill workflow so authors see the standard at the authoring step.

### Out of Scope
- Building the mode scaffold or changing the system-spec-kit goal template; phase 2 owns the scaffold and the parent decision keeps the shared template authoritative (specs/sk-doc/060-create-goal-mode/spec.md:122; specs/sk-doc/060-create-goal-mode/goal.md:49-54).
- Authoring packet binding, parent and nested goal workflows, budget handling or chat-slice handoff; the parent assigns those to phases 4 and 5 (specs/sk-doc/060-create-goal-mode/spec.md:124-125).
- Implementing a conformance checker or changing system-spec-kit validation; phase 6 owns the check and the parent keeps system-spec-kit changes out of scope (specs/sk-doc/060-create-goal-mode/spec.md:93-100,126).
- Rewriting the cited corpus goals.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .skilled/skills/sk-doc/sk-create-goal/references/authoring-standards.md | Create | Reader-applied standards and failure statements |
| .skilled/skills/sk-doc/sk-create-goal/assets/goal-exemplars.md | Create | Cited positive and negative corpus examples |
| .skilled/skills/sk-doc/sk-create-goal/references/README.md | Modify | Index the standards and exemplar set |
| .skilled/skills/sk-doc/sk-create-goal/SKILL.md | Modify | Load the standards in the authoring workflow |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Define five standards for objective, decisions, criteria, log and voice. Each standard names the failure it prevents, gives a reader check and cites at least one real goal example. |
| REQ-002 | Require one purpose-led objective sentence, recognisable frozen decisions that change only by amendment, and three to seven criteria whose answers are an exit code, a count or a named artifact without relying on another file. |
| REQ-003 | Keep progress, evidence, deviations and findings in the volatile log, outside the durable directive, and apply the Human Voice Rules to authored goal prose (.skilled/skills/system-spec-kit/templates/addons/goal.md.tmpl:110-128; .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md:39-97). |
| REQ-004 | Include and classify all three known-bad examples as failures and the known-good phase-child objective as a pass, with verified path:line citations (specs/sk-doc/060-create-goal-mode/001-goal-inventory-and-mode-contract/scratch/wave1-goal-system-audit.md:41-45). Use real goal excerpts to demonstrate the decision, criteria, log and voice checks as well (specs/sk-git/028-crawlable-commit-history/001-research/goal.md:43,45-53,75-100). |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | Index and load the standards and exemplar set from the mode's reference index and authoring workflow. |
| REQ-006 | Keep the shared goal template authoritative and preserve parent decisions D1-D6 (specs/sk-doc/060-create-goal-mode/goal.md:49-54). |

> Acceptance criteria for these requirements live in acceptance-criteria.md,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All five standards state the failure they prevent, give a reader check and cite a real goal passage that demonstrates the check.
- **SC-002**: The rubric rejects the three known-bad examples and passes the known-good child objective.
- **SC-003**: The standard follows the Human Voice Rules and scores at least 85 with no hard blockers under the publish checklist (.skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-publish-supplement.md:21-25,67-83).
- **SC-004**: The phase packet passes strict validation after generated metadata is refreshed (specs/sk-doc/060-create-goal-mode/spec.md:131-136).

<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 2 mode packet | The planned reference and skill files must exist before phase 3 can update them | Start after the parent handoff reports the packaging gate and parent-skill check as passing (specs/sk-doc/060-create-goal-mode/spec.md:143) |
| Dependency | Goal template and Human Voice Rules | Standards could contradict their source contracts | Cite the goal template and HVR rules in the standards (.skilled/skills/system-spec-kit/templates/addons/goal.md.tmpl:49-128; .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md:39-97) |
| Risk | A vague rubric may reject the known-good objective or excuse a known-bad one | The outgoing handoff would not distinguish acceptable goal content | Apply one rubric to all four examples and record each outcome with its reason |
| Risk | Voice guidance may become a second copy of HVR | Duplicated rules could drift | Link to HVR and state only the goal-specific consequence of unclear or unsupported prose (.skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md:31-35,39-97) |

<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: No runtime performance target applies; this phase adds reference documentation and authoring instructions only.

### Security
- **NFR-S01**: Do not add executable behavior, credentials or access to runtime goal state.

### Reliability
- **NFR-R01**: Keep each example tied to a source path and line so a later reviewer can reopen the same evidence.

<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Objective Boundaries
- A goal keeps the template's sample objective unchanged; the rubric must flag it as placeholder text (specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/030-mutation-suite/goal.md:43).
- A phase objective names a deliverable but its purpose is still clear; the good child example must pass (specs/sk-git/028-crawlable-commit-history/001-research/goal.md:43).

### Criterion Boundaries
- A criterion needs another file to decide whether it passed; the rubric must flag the dependency (specs/system-speckit/033-system-speckit-v4/010-goal-file-addon/goal.md:84-90).
- A criterion names a child count that disagrees with the binding rows; the rubric must flag the mismatch (specs/sk-git/028-crawlable-commit-history/goal.md:81-90,111).
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | Four mode documentation surfaces are planned |
| Risk | 5/25 | The main risk is a rubric that misclassifies its corpus controls |
| Research | 8/20 | Four goal examples and two authoring references require line-level checks |
| **Total** | **21/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None for this phase. The standards and example paths are fixed in this specification.

<!-- /ANCHOR:questions -->

---
