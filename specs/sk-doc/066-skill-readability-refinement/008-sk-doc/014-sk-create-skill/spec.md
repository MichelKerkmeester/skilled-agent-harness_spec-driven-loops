---
title: "Feature Specification: Phase 14: sk-create-skill"
description: "Read every in-scope doc of the sk-create-skill mode for readability, layout and structure, apply the defects found and prove the result with the render checks and a second read."
trigger_phrases:
  - "sk create skill"
  - "phase 14 sk create skill"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 14: sk-create-skill

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
| **Phase** | 14 of 15 |
| **Predecessor** | 013-sk-create-repo-rule |
| **Successor** | 015-sk-create-with-human-voice |
| **Handoff Criteria** | The DeepSeek review passes the diff and the scope gate prints `render_warnings=0 invalid=0` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This phase covers the `sk-create-skill` mode: 29 docs, listed in `scratch/scope.txt`.

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
The docs of the `sk-create-skill` mode were never read as a whole for readability, layout and structure. The render checks reported `files=29 render_warnings=0 invalid=0` before this phase, and they cannot judge order, density or whether an intro is a hook.

### Purpose
Each doc follows its sk-doc template and the parent rubric, with no claim changed.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ python3 -I specs/sk-doc/066-skill-readability-refinement/010-sk-prompt/scratch/tools/scope-gate.py specs/sk-doc/066-skill-readability-refinement/008-sk-doc/014-sk-create-skill/scratch/scope.txt
files=29 render_warnings=0 invalid=0
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
| `.skilled/skills/sk-doc/sk-create-skill/README.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-doc/sk-create-skill/ROUTER.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-doc/sk-create-skill/SKILL.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-doc/sk-create-skill/assets/parent-skill/parent-skill-hub-template.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-doc/sk-create-skill/assets/parent-skill/parent-skill-readme-template.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-doc/sk-create-skill/assets/parent-skill/parent-skill-root-router-template.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-doc/sk-create-skill/assets/parent-skill/scaffold/hub-skill-scaffold.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-doc/sk-create-skill/assets/parent-skill/scaffold/packet-skill-scaffold.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-asset-template.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-md-template.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-procedure-template.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-reference-template.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-router-template.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-scaffold-template.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-smart-router.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-sync-manifest-template.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-doc/sk-create-skill/references/README.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-doc/sk-create-skill/references/parent-skill/compiled-routing-architecture.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-hub-router-schema.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-doc/sk-create-skill/references/shared/advisor-index-handoff.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-doc/sk-create-skill/references/shared/common-pitfalls.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-doc/sk-create-skill/references/shared/overview.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-doc/sk-create-skill/references/shared/skill-root-metadata-contract.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-doc/sk-create-skill/references/shared/validation-and-packaging.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-doc/sk-create-skill/references/skill/creation-workflow.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-doc/sk-create-skill/references/skill/examples-and-maintenance.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-doc/sk-create-skill/references/skill/upgrading-a-skill-to-v4.md` | Modify | Readability, layout and structure |
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


