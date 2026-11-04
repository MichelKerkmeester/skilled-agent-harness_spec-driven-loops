---
title: "Feature Specification: Phase 6: sk-code-skilled"
description: "Read every in-scope doc of the sk-code-skilled mode for readability, layout and structure, apply the defects found and prove the result with the render checks and a second read."
trigger_phrases:
  - "sk code skilled"
  - "phase 6 sk code skilled"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 6: sk-code-skilled

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
| **Phase** | 6 of 6 |
| **Predecessor** | 005-sk-code-review |
| **Successor** | None |
| **Handoff Criteria** | The DeepSeek review passes the diff and the scope gate prints `render_warnings=0 invalid=0` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This phase covers the `sk-code-skilled` mode: 69 docs, listed in `scratch/scope.txt`.

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
The docs of the `sk-code-skilled` mode were never read as a whole for readability, layout and structure. The render checks reported `files=69 render_warnings=0 invalid=0` before this phase, and they cannot judge order, density or whether an intro is a hook.

### Purpose
Each doc follows its sk-doc template and the parent rubric, with no claim changed.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ python3 -I specs/sk-doc/066-skill-readability-refinement/010-sk-prompt/scratch/tools/scope-gate.py specs/sk-doc/066-skill-readability-refinement/006-sk-code/006-sk-code-skilled/scratch/scope.txt
files=69 render_warnings=0 invalid=0
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
| `.skilled/skills/sk-code/sk-code-skilled/README.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-code/sk-code-skilled/ROUTER.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-code/sk-code-skilled/SKILL.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-code/sk-code-skilled/assets/checklists/agent-authoring.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-code/sk-code-skilled/assets/checklists/command-authoring.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-code/sk-code-skilled/assets/checklists/config-checklist.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-code/sk-code-skilled/assets/checklists/javascript-checklist.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-code/sk-code-skilled/assets/checklists/js-css-style/naming-init-formatting-and-css.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-code/sk-code-skilled/assets/checklists/js-css-style/overview-header-and-comments.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-code/sk-code-skilled/assets/checklists/js-css-style/verification-quick-reference-and-related.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-code/sk-code-skilled/assets/checklists/mcp-server-authoring.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-code/sk-code-skilled/assets/checklists/python-checklist.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-code/sk-code-skilled/assets/checklists/rust-checklist/overview-and-p0-parity.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-code/sk-code-skilled/assets/checklists/rust-checklist/p0-safety-and-boundary-discipline.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-code/sk-code-skilled/assets/checklists/rust-checklist/p1-required.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-code/sk-code-skilled/assets/checklists/rust-checklist/p2-evidence-validation-and-resources.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-code/sk-code-skilled/assets/checklists/shell-checklist.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-code/sk-code-skilled/assets/checklists/skill-authoring.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-code/sk-code-skilled/assets/checklists/typescript-checklist.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-code/sk-code-skilled/assets/checklists/universal-checklist.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-code/sk-code-skilled/assets/scripts/README.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-code/sk-code-skilled/references/config/quality-standards.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-code/sk-code-skilled/references/config/quick-reference.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-code/sk-code-skilled/references/config/style-guide.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-code/sk-code-skilled/references/javascript/quality-standards/overview-modules-and-docs.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-code/sk-code-skilled/references/javascript/quality-standards/security-testing-and-exemptions.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-code/sk-code-skilled/references/javascript/quick-reference.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-code/sk-code-skilled/references/javascript/style-guide.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-code/sk-code-skilled/references/python/quality-standards.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-code/sk-code-skilled/references/python/quick-reference.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-code/sk-code-skilled/references/python/style-guide.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-code/sk-code-skilled/references/rust/quality-standards/build-and-organization.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-code/sk-code-skilled/references/rust/quality-standards/determinism-and-parity.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-code/sk-code-skilled/references/rust/quality-standards/docs-errors-and-async.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-code/sk-code-skilled/references/rust/quality-standards/modeling-collections-and-api.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-code/sk-code-skilled/references/rust/quality-standards/overview-and-data-ownership.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-code/sk-code-skilled/references/rust/quick-reference/collections-imports-and-errors.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-code/sk-code-skilled/references/rust/quick-reference/determinism-parity-and-related.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-code/sk-code-skilled/references/rust/quick-reference/naming-ordering-and-signatures.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-code/sk-code-skilled/references/rust/quick-reference/overview-and-boundary-template.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-code/sk-code-skilled/references/rust/quick-reference/rustdoc-and-cargo.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-code/sk-code-skilled/references/rust/style-guide/commenting-and-rustdoc.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-code/sk-code-skilled/references/rust/style-guide/formatting-and-imports.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-code/sk-code-skilled/references/rust/style-guide/interop-errors-and-parity.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-code/sk-code-skilled/references/rust/style-guide/interop-model.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-code/sk-code-skilled/references/rust/style-guide/naming-conventions.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-code/sk-code-skilled/references/rust/style-guide/overview-and-file-header.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-code/sk-code-skilled/references/rust/style-guide/toolchain-and-project-structure.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-code/sk-code-skilled/references/shared/alignment-verification-automation.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-code/sk-code-skilled/references/shared/code-organization/directory-and-test-conventions.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-code/sk-code-skilled/references/shared/code-organization/imports-and-exports.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-code/sk-code-skilled/references/shared/code-organization/overview-and-module-organization.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-code/sk-code-skilled/references/shared/hooks.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-code/sk-code-skilled/references/shared/universal-patterns/naming-and-commenting.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-code/sk-code-skilled/references/shared/universal-patterns/organization-security-and-examples.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-code/sk-code-skilled/references/shared/workflow-guardrails.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-code/sk-code-skilled/references/shell/quality-standards/overview-and-priority-blockers.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-code/sk-code-skilled/references/shell/quality-standards/validation-security-and-shellcheck.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-code/sk-code-skilled/references/shell/quick-reference/functions-strings-and-checklist.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-code/sk-code-skilled/references/shell/quick-reference/template-variables-and-loops.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-code/sk-code-skilled/references/shell/style-guide/overview-structure-and-naming.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-code/sk-code-skilled/references/shell/style-guide/variables-functions-and-output.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-code/sk-code-skilled/references/typescript/quality-standards/overview-and-type-system.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-code/sk-code-skilled/references/typescript/quality-standards/tsconfig-and-modules.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-code/sk-code-skilled/references/typescript/quality-standards/tsdoc-errors-and-async.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-code/sk-code-skilled/references/typescript/quick-reference/imports-errors-and-tsconfig.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-code/sk-code-skilled/references/typescript/quick-reference/template-naming-and-types.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-code/sk-code-skilled/references/typescript/style-guide/formatting-imports-and-coexistence.md` | Modify | Readability, layout and structure |
| `.skilled/skills/sk-code/sk-code-skilled/references/typescript/style-guide/overview-strict-and-naming.md` | Modify | Readability, layout and structure |
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


