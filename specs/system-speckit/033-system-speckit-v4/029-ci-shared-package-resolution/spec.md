---
title: "Feature Specification: CI shared-package resolution"
description: "Every push turned four GitHub Actions workflows red: three checkers require the spec-kit shared workspace package that only resolves after an install the workflows never ran, the shared build lost its js-yaml declaration to a gitignore rule, one playbook link pointed four directories too high, and the runtime mirrors were never regenerated after the design commands moved."
trigger_phrases:
  - "ci shared package resolution"
  - "workflow run failed emails"
  - "cannot find module spec-kit shared"
  - "js-yaml declaration gitignored"
  - "runtime mirror drift design commands"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: CI shared-package resolution

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-07 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 29 of 29 |
| **Predecessor** | 028-header-tags-hook-catch-and-script-test-fixes |
| **Successor** | none |
| **Origin** | Operator: "all pushed to git is causing a ton of run failed error emails, find out why its causing this everytime" |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 29** of the system-speckit v4 program: the fallout of the shared frontmatter-parser adoption in phases 025 to 028, which moved `parse-frontmatter` and `repo-root` into `@spec-kit/shared` and taught the fleet's checkers to import them from there.

**Scope Boundary**: four workflow files, one gitignore rule, one ambient declaration file, one playbook link, and the generated runtime mirrors under `.claude/commands` and `.cursor/commands`.

**Deliverables**:
- The three install-less workflows install the spec-kit workspace and build its shared package before running checkers that import it
- The hand-written `js-yaml` declaration is committed, so the shared build passes on a clean checkout
- The playbook scenario's runbook link resolves
- The runtime mirrors match the command tree after the design commands moved
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Since 2026-09-06 every push to `main` or `skilled/v4.0.0.0` failed four workflows and mailed the operator each time.

**Command Tree Parity, Playbook Operator Contract, and the lean job of Routing Registry Drift Guard** each died with `Cannot find module '@spec-kit/shared/...'`. The frontmatter-parser adoption on 2026-09-06 made the mirror sync, the playbook validator and the root-router contract library import that package. `@spec-kit/shared` is an npm workspace: it resolves only after `npm ci` in the spec-kit root links it into `node_modules/@spec-kit`, and its `.js` subpaths map to the compiled `dist/`. None of the three workflows installed anything, so a bare checkout could not find the module. Command Tree Parity last passed at `b5f68bea8a` and first failed at `89085a4003`, both on 2026-09-06; the playbook workflow never passed.

**The Gate-2 job of Routing Registry Drift Guard and the scheduled Strict Pass Freshness Report** did install and build, and died in `tsc --build` with `TS7016: Could not find a declaration file for module 'js-yaml'`. The shared package types `js-yaml` through a hand-written `shared/js-yaml.d.ts`, and `.gitignore:81` ignores `shared/**/*.d.ts` to keep emitted declarations out of the tree. The rule swallowed the source file, so it existed on every developer machine and on no CI runner.

Two more faults were hidden behind the resolution failure. The playbook validator, once it could run, failed one scenario whose runbook link climbed four directories instead of two. The mirror sync, once it could run, reported real drift: the design commands moved from `create/` to `design/` on 2026-09-06 (`e34e225517`, `e2fca24ec0`) and the mirrors were not regenerated.

### Purpose

A push runs green, and a checker that needs the shared package says so in its workflow rather than assuming a developer's `node_modules`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- An install-and-build step in the three workflows, the same three lines the freshness report already used
- A gitignore negation for the ambient declaration, and the file itself
- The playbook link and the regenerated mirrors

### Out of Scope
- Making the checkers resolve the shared package without an install; their `.js` imports need the compiled output regardless
- Path-filtering the playbook workflow; its comment explains why it runs on every push

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.github/workflows/command-tree-parity.yml`, `playbook-operator-contract.yml`, `routing-registry-drift.yml` | Modify | Install the workspace and build shared before the checkers |
| `.gitignore` | Modify | Negation for `shared/js-yaml.d.ts` |
| `.opencode/skills/system-spec-kit/shared/js-yaml.d.ts` | Add | The ambient declaration, previously ignored |
| `.opencode/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/orphan-mcp-runtime-lifecycle-guardrails.md` | Modify | Runbook link depth |
| `.claude/commands/{create,design}/*`, `.cursor/commands/{create,design}-*` | Regenerate | Mirrors follow the moved commands |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The push that carries this packet turns Command Tree Parity, Playbook Operator Contract and Routing Registry Drift Guard green | `gh run list` for the push shows `success` for all three |
| REQ-002 | The shared build passes on a clean checkout | `shared/js-yaml.d.ts` is tracked and no longer matched by `git check-ignore` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Every checker the workflows run passes locally too | parity `--quiet` exit 0; playbook `--strict` zero violations; parent-skill-check and skill-root-metadata pass |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: No failure mail follows the next push
- **SC-002**: A future checker that imports the shared package has a workflow pattern to copy
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | `npm ci` adds about a minute to three fast workflows | Slower feedback | The freshness report already pays it; the checkers cannot run without it |
| Risk | Another emitted-output ignore rule swallows a source file | The same class of failure returns | The negation carries a comment naming the reason, so the next reader sees the pattern |
| Dependency | The lock file at the spec-kit root | `npm ci` refuses a drifted lock | The Gate-2 job's `npm ci` already succeeded on the current lock |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->
