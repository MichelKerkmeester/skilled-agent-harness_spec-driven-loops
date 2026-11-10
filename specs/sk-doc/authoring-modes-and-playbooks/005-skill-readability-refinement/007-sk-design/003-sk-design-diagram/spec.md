---
title: "Feature Specification: Phase 3: sk-design-diagram"
description: "Read every in-scope doc of the sk-design-diagram mode for readability, layout and structure, apply the defects found and prove the result with the render checks and a second read."
trigger_phrases:
  - "sk design diagram"
  - "phase 3 sk design diagram"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 3: sk-design-diagram

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-04 |
| **Branch** | `worktrees/315-frontend-reference-restructure` |
| **Parent Spec** | ../spec.md |
| **Phase** | 3 of 5 |
| **Predecessor** | 002-sk-design-chart |
| **Successor** | 004-sk-design-fundamentals |
| **Handoff Criteria** | The DeepSeek review passes the diff and the scope gate prints `render_warnings=0 invalid=0` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This phase covers the `sk-design-diagram` mode: 62 docs, listed in `scratch/scope.txt`.

**Scope Boundary**: the files in `scratch/scope.txt`. Changelogs, playbooks, feature catalogs, benchmarks and tests stay out.

**Dependencies**:
- The render checks in `validate_document.py` and the review rubric in the parent `spec.md`.

**Deliverables**:
- The refined docs, `scratch/findings.md`, the review rounds and `scratch/gate-after.txt`.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The docs of the `sk-design-diagram` mode were never read as a whole for readability, layout and structure. The render checks reported `files=62 render_warnings=35 invalid=2` before this phase, and they cannot judge order, density or whether an intro is a hook.

### Purpose
Each doc follows its sk-doc template and the parent rubric, with no claim changed.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ python3 -I specs/sk-doc/authoring-modes-and-playbooks/005-skill-readability-refinement/010-sk-prompt/scratch/tools/scope-gate.py specs/sk-doc/authoring-modes-and-playbooks/005-skill-readability-refinement/007-sk-design/003-sk-design-diagram/scratch/scope.txt
files=62 render_warnings=35 invalid=2
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Audit each doc against the parent rubric with DeepSeek V4.1 Flash max (`cli-opencode`, opencode-go), with any scope write undone.
- Apply the findings with DeepSeek V4.1 Flash high on the DevPass route.
- Re-read the diff with DeepSeek V4.1 Flash max until it passes, at most three rounds.

### Out of Scope
- Changing what a rule, contract or example says - the program refines form only.
- Headings other files link to - `scratch/inbound-anchors.txt` lists them and they keep their text.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-design/sk-design-diagram/README.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-design/sk-design-diagram/ROUTER.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-design/sk-design-diagram/SKILL.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-design/sk-design-diagram/assets/ascii-patterns/approval-workflow-loops.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-design/sk-design-diagram/assets/ascii-patterns/decision-tree-flow.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-design/sk-design-diagram/assets/ascii-patterns/parallel-execution.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-design/sk-design-diagram/assets/ascii-patterns/simple-workflow.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-design/sk-design-diagram/assets/ascii-patterns/system-architecture-swimlane.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-design/sk-design-diagram/assets/ascii-patterns/user-onboarding.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-design/sk-design-diagram/assets/diagrams/README.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-design/sk-design-diagram/assets/style-reference/README.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-design/sk-design-diagram/assets/style-reference/harness-diagram/DESIGN.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-design/sk-design-diagram/assets/style-reference/harness-diagram/origin.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-design/sk-design-diagram/references/ascii-format/README.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-design/sk-design-diagram/references/ascii-format/notation-and-validator.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-design/sk-design-diagram/references/ascii-format/pattern-selection.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-design/sk-design-diagram/references/ascii-format/worked-example.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-design/sk-design-diagram/references/catalog.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-design/sk-design-diagram/references/design-md-theming.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-design/sk-design-diagram/references/foundations/README.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-design/sk-design-diagram/references/foundations/derivation-record.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-design/sk-design-diagram/references/foundations/onboarding.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-design/sk-design-diagram/references/foundations/output-spec.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-design/sk-design-diagram/references/foundations/router-pseudocode.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-design/sk-design-diagram/references/foundations/style-guide.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-design/sk-design-diagram/references/import-export/README.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-design/sk-design-diagram/references/import-export/export.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-design/sk-design-diagram/references/import-export/import-drawio.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-design/sk-design-diagram/references/import-export/import-mermaid.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-design/sk-design-diagram/references/primitives/README.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-design/sk-design-diagram/references/primitives/primitive-annotation.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-design/sk-design-diagram/references/primitives/primitive-icons.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-design/sk-design-diagram/references/primitives/primitive-sketchy.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-design/sk-design-diagram/references/primitives/primitive-terminal.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-design/sk-design-diagram/references/types/README.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-design/sk-design-diagram/references/types/type-architecture.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-design/sk-design-diagram/references/types/type-bar.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-design/sk-design-diagram/references/types/type-data-flow.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-design/sk-design-diagram/references/types/type-dp-integration.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-design/sk-design-diagram/references/types/type-dp-security-matrix.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-design/sk-design-diagram/references/types/type-er.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-design/sk-design-diagram/references/types/type-flowchart.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-design/sk-design-diagram/references/types/type-gantt.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-design/sk-design-diagram/references/types/type-high-level.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-design/sk-design-diagram/references/types/type-it-state.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-design/sk-design-diagram/references/types/type-layers.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-design/sk-design-diagram/references/types/type-line.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-design/sk-design-diagram/references/types/type-loop.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-design/sk-design-diagram/references/types/type-medallion.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-design/sk-design-diagram/references/types/type-nested.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-design/sk-design-diagram/references/types/type-org-chart.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-design/sk-design-diagram/references/types/type-process.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-design/sk-design-diagram/references/types/type-pyramid.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-design/sk-design-diagram/references/types/type-quadrant.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-design/sk-design-diagram/references/types/type-radar.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-design/sk-design-diagram/references/types/type-scatter.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-design/sk-design-diagram/references/types/type-sequence.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-design/sk-design-diagram/references/types/type-state.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-design/sk-design-diagram/references/types/type-swimlane.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-design/sk-design-diagram/references/types/type-timeline.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-design/sk-design-diagram/references/types/type-tree.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-design/sk-design-diagram/references/types/type-venn.md` | Modify | Readability, layout and structure |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every in-scope doc stays valid with no render warning | `scope-gate.py` prints `render_warnings=0 invalid=0` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | A second model family passes the diff | The last `scratch/review-N.md` opens `VERDICT: PASS` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The scope gate prints `render_warnings=0 invalid=0`.
- **SC-002**: The last review opens `VERDICT: PASS`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | opencode-go and llmgateway DeepSeek | A step cannot run | On a quota stop, stop and ask; never re-route |
| Risk | A fix changes a claim while moving text | Med | The review checks claims against the diff each round |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---


