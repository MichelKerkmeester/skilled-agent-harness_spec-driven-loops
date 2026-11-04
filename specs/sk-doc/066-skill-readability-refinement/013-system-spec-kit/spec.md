---
title: "Feature Specification: Phase 13: system-spec-kit"
description: "Read every in-scope doc of .skilled/skills/system-spec-kit for readability, layout and structure, apply the defects found and prove the result with the render checks and a second read."
trigger_phrases:
  - "system spec kit"
  - "phase 13 system spec kit"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 13: system-spec-kit

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
| **Phase** | 13 of 13 |
| **Predecessor** | 012-system-skill-advisor |
| **Successor** | None |
| **Handoff Criteria** | The DeepSeek review passes the diff and the scope gate prints `render_warnings=0 invalid=0` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This phase covers `.skilled/skills/system-spec-kit`: 61 docs, listed in `scratch/scope.txt`.

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
The docs of `.skilled/skills/system-spec-kit` were never read as a whole for readability, layout and structure. The render checks reported `files=61 render_warnings=49 invalid=0` before this phase, and they cannot judge order, density or whether an intro is a hook.

### Purpose
Each doc follows its sk-doc template and the parent rubric, with no claim changed.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ python3 -I specs/sk-doc/066-skill-readability-refinement/010-sk-prompt/scratch/tools/scope-gate.py specs/sk-doc/066-skill-readability-refinement/013-system-spec-kit/scratch/scope.txt
files=61 render_warnings=49 invalid=0
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
| `.skilled/skills/system-spec-kit/README.md` | Modify | Readability, layout and structure |
| `.skilled/skills/system-spec-kit/ROUTER.md` | Modify | Readability, layout and structure |
| `.skilled/skills/system-spec-kit/SKILL.md` | Modify | Readability, layout and structure |
| `.skilled/skills/system-spec-kit/assets/complexity-decision-matrix.md` | Modify | Readability, layout and structure |
| `.skilled/skills/system-spec-kit/assets/level-decision-matrix.md` | Modify | Readability, layout and structure |
| `.skilled/skills/system-spec-kit/assets/parallel-dispatch-config.md` | Modify | Readability, layout and structure |
| `.skilled/skills/system-spec-kit/assets/template-mapping.md` | Modify | Readability, layout and structure |
| `.skilled/skills/system-spec-kit/references/cli/daemon-cli-reference.md` | Modify | Readability, layout and structure |
| `.skilled/skills/system-spec-kit/references/cli/memory-handback.md` | Modify | Readability, layout and structure |
| `.skilled/skills/system-spec-kit/references/cli/shared-smart-router.md` | Modify | Readability, layout and structure |
| `.skilled/skills/system-spec-kit/references/config/environment-variables.md` | Modify | Readability, layout and structure |
| `.skilled/skills/system-spec-kit/references/config/hook-system.md` | Modify | Readability, layout and structure |
| `.skilled/skills/system-spec-kit/references/config/launcher-lease.md` | Modify | Readability, layout and structure |
| `.skilled/skills/system-spec-kit/references/debugging/troubleshooting.md` | Modify | Readability, layout and structure |
| `.skilled/skills/system-spec-kit/references/debugging/universal-debugging-methodology.md` | Modify | Readability, layout and structure |
| `.skilled/skills/system-spec-kit/references/memory/embedder-pluggability.md` | Modify | Readability, layout and structure |
| `.skilled/skills/system-spec-kit/references/memory/epistemic-vectors.md` | Modify | Readability, layout and structure |
| `.skilled/skills/system-spec-kit/references/memory/memory-system.md` | Modify | Readability, layout and structure |
| `.skilled/skills/system-spec-kit/references/memory/save-workflow.md` | Modify | Readability, layout and structure |
| `.skilled/skills/system-spec-kit/references/memory/trigger-config.md` | Modify | Readability, layout and structure |
| `.skilled/skills/system-spec-kit/references/retrieval/retrieval-conventions.md` | Modify | Readability, layout and structure |
| `.skilled/skills/system-spec-kit/references/structure/folder-routing.md` | Modify | Readability, layout and structure |
| `.skilled/skills/system-spec-kit/references/structure/folder-structure.md` | Modify | Readability, layout and structure |
| `.skilled/skills/system-spec-kit/references/structure/grep-convention.md` | Modify | Readability, layout and structure |
| `.skilled/skills/system-spec-kit/references/structure/phase-definitions.md` | Modify | Readability, layout and structure |
| `.skilled/skills/system-spec-kit/references/structure/phase-system.md` | Modify | Readability, layout and structure |
| `.skilled/skills/system-spec-kit/references/structure/sub-folder-versioning.md` | Modify | Readability, layout and structure |
| `.skilled/skills/system-spec-kit/references/templates/level-selection-guide.md` | Modify | Readability, layout and structure |
| `.skilled/skills/system-spec-kit/references/templates/level-specifications.md` | Modify | Readability, layout and structure |
| `.skilled/skills/system-spec-kit/references/templates/template-guide.md` | Modify | Readability, layout and structure |
| `.skilled/skills/system-spec-kit/references/templates/template-style-guide.md` | Modify | Readability, layout and structure |
| `.skilled/skills/system-spec-kit/references/validation/decision-format.md` | Modify | Readability, layout and structure |
| `.skilled/skills/system-spec-kit/references/validation/five-checks.md` | Modify | Readability, layout and structure |
| `.skilled/skills/system-spec-kit/references/validation/path-scoped-rules.md` | Modify | Readability, layout and structure |
| `.skilled/skills/system-spec-kit/references/validation/phase-checklists.md` | Modify | Readability, layout and structure |
| `.skilled/skills/system-spec-kit/references/validation/template-compliance-contract.md` | Modify | Readability, layout and structure |
| `.skilled/skills/system-spec-kit/references/validation/validation-rules.md` | Modify | Readability, layout and structure |
| `.skilled/skills/system-spec-kit/references/workflows/agent-io-contract.md` | Modify | Readability, layout and structure |
| `.skilled/skills/system-spec-kit/references/workflows/auto-mode-contract.md` | Modify | Readability, layout and structure |
| `.skilled/skills/system-spec-kit/references/workflows/execution-methods.md` | Modify | Readability, layout and structure |
| `.skilled/skills/system-spec-kit/references/workflows/goal-set-string-playbook.md` | Modify | Readability, layout and structure |
| `.skilled/skills/system-spec-kit/references/workflows/intake-contract.md` | Modify | Readability, layout and structure |
| `.skilled/skills/system-spec-kit/references/workflows/nested-changelog.md` | Modify | Readability, layout and structure |
| `.skilled/skills/system-spec-kit/references/workflows/quick-reference.md` | Modify | Readability, layout and structure |
| `.skilled/skills/system-spec-kit/references/workflows/rename-pattern.md` | Modify | Readability, layout and structure |
| `.skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md` | Modify | Readability, layout and structure |
| `.skilled/skills/system-spec-kit/references/workflows/spec-folder-authoring-checklist.md` | Modify | Readability, layout and structure |
| `.skilled/skills/system-spec-kit/references/workflows/spec-folder-write-recipe.md` | Modify | Readability, layout and structure |
| `.skilled/skills/system-spec-kit/references/workflows/worked-examples.md` | Modify | Readability, layout and structure |
| `.skilled/skills/system-spec-kit/shared/README.md` | Modify | Readability, layout and structure |
| `.skilled/skills/system-spec-kit/shared/algorithms/README.md` | Modify | Readability, layout and structure |
| `.skilled/skills/system-spec-kit/shared/embeddings/README.md` | Modify | Readability, layout and structure |
| `.skilled/skills/system-spec-kit/shared/embeddings/adapters/README.md` | Modify | Readability, layout and structure |
| `.skilled/skills/system-spec-kit/shared/embeddings/providers/README.md` | Modify | Readability, layout and structure |
| `.skilled/skills/system-spec-kit/shared/frontmatter/README.md` | Modify | Readability, layout and structure |
| `.skilled/skills/system-spec-kit/shared/ipc/README.md` | Modify | Readability, layout and structure |
| `.skilled/skills/system-spec-kit/shared/parsing/README.md` | Modify | Readability, layout and structure |
| `.skilled/skills/system-spec-kit/shared/predicates/README.md` | Modify | Readability, layout and structure |
| `.skilled/skills/system-spec-kit/shared/scripts/README.md` | Modify | Readability, layout and structure |
| `.skilled/skills/system-spec-kit/shared/utils/README.md` | Modify | Readability, layout and structure |
| `.skilled/skills/system-spec-kit/shared/workspace/README.md` | Modify | Readability, layout and structure |
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


