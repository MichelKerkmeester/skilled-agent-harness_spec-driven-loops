---
title: "Feature Specification: Phase 8: mcp-obsidian"
description: "Read every in-scope doc of the .skilled/skills/mcp-tooling/mcp-obsidian mode for readability, layout and structure, apply the defects found and prove the result with the render checks and a second read."
trigger_phrases:
  - "mcp obsidian"
  - "phase 8 mcp obsidian"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 8: mcp-obsidian

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
| **Phase** | 8 of 9 |
| **Predecessor** | 007-mcp-notion |
| **Successor** | 009-mcp-refero |
| **Handoff Criteria** | The DeepSeek review passes the diff and the scope gate prints `render_warnings=0 invalid=0` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This phase covers the `.skilled/skills/mcp-tooling/mcp-obsidian` mode: 26 docs, listed in `scratch/scope.txt`.

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
The docs of the `.skilled/skills/mcp-tooling/mcp-obsidian` mode were never read as a whole for readability, layout and structure. The render checks reported `files=26 render_warnings=23 invalid=1` before this phase, and they cannot judge order, density or whether an intro is a hook.

### Purpose
Each doc follows its sk-doc template and the parent rubric, with no claim changed.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ python3 -I specs/sk-doc/authoring-modes-and-playbooks/005-skill-readability-refinement/010-sk-prompt/scratch/tools/scope-gate.py specs/sk-doc/authoring-modes-and-playbooks/005-skill-readability-refinement/005-mcp-tooling/008-mcp-obsidian/scratch/scope.txt
files=26 render_warnings=23 invalid=1
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
| `.skilled/skills/mcp-tooling/mcp-obsidian/README.md` | Modify | Readability, layout and structure |
| `.skilled/skills/mcp-tooling/mcp-obsidian/ROUTER.md` | Modify | Readability, layout and structure |
| `.skilled/skills/mcp-tooling/mcp-obsidian/SKILL.md` | Modify | Readability, layout and structure |
| `.skilled/skills/mcp-tooling/mcp-obsidian/assets/plugins/health-md/health-viz-blocks.example.md` | Modify | Readability, layout and structure |
| `.skilled/skills/mcp-tooling/mcp-obsidian/assets/plugins/iconic/iconic-rules.full.md` | Modify | Readability, layout and structure |
| `.skilled/skills/mcp-tooling/mcp-obsidian/assets/workflows.md` | Modify | Readability, layout and structure |
| `.skilled/skills/mcp-tooling/mcp-obsidian/references/cli-versus-mcp.md` | Modify | Readability, layout and structure |
| `.skilled/skills/mcp-tooling/mcp-obsidian/references/mcp-tools.md` | Modify | Readability, layout and structure |
| `.skilled/skills/mcp-tooling/mcp-obsidian/references/notion-migration.md` | Modify | Readability, layout and structure |
| `.skilled/skills/mcp-tooling/mcp-obsidian/references/obsidian-cli-commands.md` | Modify | Readability, layout and structure |
| `.skilled/skills/mcp-tooling/mcp-obsidian/references/official-cli-agent-usage.md` | Modify | Readability, layout and structure |
| `.skilled/skills/mcp-tooling/mcp-obsidian/references/plugins/health-md/data-model.md` | Modify | Readability, layout and structure |
| `.skilled/skills/mcp-tooling/mcp-obsidian/references/plugins/health-md/health-md.md` | Modify | Readability, layout and structure |
| `.skilled/skills/mcp-tooling/mcp-obsidian/references/plugins/health-md/troubleshooting.md` | Modify | Readability, layout and structure |
| `.skilled/skills/mcp-tooling/mcp-obsidian/references/plugins/health-md/workflows.md` | Modify | Readability, layout and structure |
| `.skilled/skills/mcp-tooling/mcp-obsidian/references/plugins/iconic/data-model.md` | Modify | Readability, layout and structure |
| `.skilled/skills/mcp-tooling/mcp-obsidian/references/plugins/iconic/iconic.md` | Modify | Readability, layout and structure |
| `.skilled/skills/mcp-tooling/mcp-obsidian/references/plugins/iconic/troubleshooting.md` | Modify | Readability, layout and structure |
| `.skilled/skills/mcp-tooling/mcp-obsidian/references/plugins/iconic/workflows.md` | Modify | Readability, layout and structure |
| `.skilled/skills/mcp-tooling/mcp-obsidian/references/plugins/installed-plugins.md` | Modify | Readability, layout and structure |
| `.skilled/skills/mcp-tooling/mcp-obsidian/references/plugins/plugin-operation-logic.md` | Modify | Readability, layout and structure |
| `.skilled/skills/mcp-tooling/mcp-obsidian/references/themes/customization.md` | Modify | Readability, layout and structure |
| `.skilled/skills/mcp-tooling/mcp-obsidian/references/themes/plugin-development.md` | Modify | Readability, layout and structure |
| `.skilled/skills/mcp-tooling/mcp-obsidian/references/themes/theme-development.md` | Modify | Readability, layout and structure |
| `.skilled/skills/mcp-tooling/mcp-obsidian/references/themes/themes.md` | Modify | Readability, layout and structure |
| `.skilled/skills/mcp-tooling/mcp-obsidian/references/troubleshooting.md` | Modify | Readability, layout and structure |
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


