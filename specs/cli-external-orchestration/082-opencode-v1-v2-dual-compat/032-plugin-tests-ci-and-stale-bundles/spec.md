---
title: "Feature Specification: Phase 32: plugin-tests-ci-and-stale-bundles"
description: "No workflow ran the 436 OpenCode plugin tests, Spec-Kit Check did not rerun the plugins purity test on a plugin-only change, and provisioning built a listed output only when it was missing, so an existing checkout kept a stale built plugin after its source changed. This phase adds a blocking plugin-test workflow, widens Spec-Kit Check's trigger, and rebuilds an output that is older than a tracked file in its package."
trigger_phrases:
  - "plugin tests ci and stale bundles"
  - "phase 32 plugin tests ci and stale bundles"
  - "opencode plugin tests workflow"
  - "stale bundle provisioning"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 32: plugin-tests-ci-and-stale-bundles

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | In Progress |
| **Created** | 2026-10-20 |
| **Branch** | `worktrees/171-plugin-tests-ci-and-stale-bundles` |
| **Parent Spec** | ../spec.md |
| **Phase** | 32 of 32 |
| **Predecessor** | 031-plugin-scanner-ast |
| **Successor** | None |
| **Handoff Criteria** | The new plugin-test workflow passes on CI at the pushed main commit and a broken plugin test fails its command, Spec-Kit Check names the plugins folder in both triggers, and a stale-output test fails on the old provisioning script |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 32** of the OpenCode v1 and v2 dual-compatibility specification. It closes the three CI and provisioning gaps that phases 028 and 031 found, which the operator approved as one more group on 2026-10-20.

**Scope Boundary**: The new plugin-test workflow, the path filters of Spec-Kit Check, the build rule in `provision_worktree` and its tests, and the docs that describe them: the workflow README, the sk-git skill's provisioning rule and the provision list's header.

**Dependencies**:
- `../031-plugin-scanner-ast/`, which found that no workflow runs `.opencode/plugins/tests` and that Spec-Kit Check ignores `.opencode/plugins/**`.
- `../028-plugin-kill-switch-coverage/`, whose kill switch reached `src/plugin.ts` while the main checkout's built `dist/plugin.js` stayed at the old code.
- `../022-worktree-provision-completeness/`, which owns the provision list.

**Deliverables**:
- `.github/workflows/opencode-plugin-tests.yml`, the Spec-Kit Check trigger, the stale-output rule and its tests, the doc lines, and the evidence under `scratch/`.
- This folder's spec, plan, tasks and implementation summary, and the parent phase map row.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
No workflow ran `.opencode/plugins/tests/`: a grep of every workflow at `origin/main` finds no reference to the folder. Its 436 tests, the plugin inventory guard and the v2 registration test among them, ran only on a developer's machine. Spec-Kit Check owns the plugins purity test but did not list `.opencode/plugins/**` in either trigger, so a plugin-only change never reran it. Separately, `provision_worktree` built a listed output only when the file was missing (`[ ! -e "$dir/$pkg/$artifact" ]`), so a checkout whose output already existed kept the old build after its source changed: the main checkout's `vision-runtime/dist/plugin.js`, built on 2026-10-19, lacks the `visionHooksEnabled` that `src/plugin.ts` now has three times.

### Purpose
The plugin suites block a bad change on CI, a plugin-only change reruns the purity test, and provisioning refreshes a built output whose sources moved on.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Part 1: a blocking workflow that provisions every listed tree and runs `node --test '.opencode/plugins/tests/*.test.cjs'` on Node 22, triggered by any change under `.skilled/**`, `.opencode/**` or `.pi/**`, or to the runtime and spec files the goal checks read (`.claude`, `.codex`, `.cursor`, `.devin`, `.env.example` and one archived spec folder).
- Part 2: `.opencode/plugins/**` and `.skilled/plugins/**` in both of Spec-Kit Check's trigger lists.
- Part 3: `provision_worktree` rebuilds a listed output when a git-tracked file in its package, or in a source path its list line names, is newer than the output, and says so; tests that fail on the old script.
- The workflow README rows (the new workflow and the missing `sk-code-script-tests.yml`), the sk-git provisioning rule and the provision list's header comment.

### Out of Scope
- Rebuilding the main checkout's sk-vision bundle - the operator's checkout; the operator runs `bun run build` there once, or `worktree-naming.sh provision` now does it.
- Rows for `opencode-dual-version.yml`, `pi-extension-tests.yml`, `sk-git-script-tests.yml` and `sk-code-script-tests.yml` in the README's push-versus-pull-request table - pre-existing gaps of other phases; recorded as a finding.
- Running the battery's own unit tests or the `.pi` type checks - not in this group's directive.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.github/workflows/opencode-plugin-tests.yml` | Create | Provision, then run every plugin suite on Node 22 |
| `.github/workflows/spec-kit-check.yml` | Modify | Both trigger lists name the plugins folder in both roots |
| `.skilled/skills/sk-git/scripts/worktree-naming.sh` | Modify | `_wn_output_stale` and the missing-or-stale build rule |
| `.skilled/skills/sk-git/scripts/tests/worktree-naming.test.sh` | Modify | Fourteen checks over git-tracked fixtures and a tree outside git |
| `.skilled/skills/sk-git/scripts/worktree-provision-paths.txt` | Modify | Header states the new build rule and the extra-source fields; three lines name the sources their builds compile |
| `.skilled/skills/sk-git/SKILL.md` | Modify | One sentence in the provisioning rule |
| `.github/workflows/README.md` | Modify | Rows for the new workflow and `sk-code-script-tests.yml`, and the path-filtered coverage row |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Part 1: the plugin suites run in a blocking job. | The new workflow passes on CI at the pushed main commit with 436 tests, and the same command with one broken test exits 1 under Node 22 (`scratch/mutation/broken-plugin-test.txt`). |
| REQ-002 | Part 3: a stale output rebuilds. | The rebuild checks fail on the old script (`scratch/mutation/old-script-new-tests.txt`) and pass on the new one; a repeat provision of a fresh worktree builds nothing. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Part 2: a plugin-only change reruns Spec-Kit Check. | Both trigger lists name `.opencode/plugins/**` and `.skilled/plugins/**`; `actionlint` and `check-gate-inputs.sh` pass. |
| REQ-004 | Part 3: untracked build output never marks an output stale. | The untracked-file checks fail on a mutant that counts every file (`scratch/mutation/m1-untracked-counted.txt`). |
| REQ-005 | The docs describe the new behavior. | The workflow README, the sk-git provisioning rule and the provision list header state it. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The plugin-test workflow is green on CI at the pushed main commit, and a broken plugin test fails its command.
- **SC-002**: Every CI run on the pushed main commit is read and green.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The plugin workflow runs on most changes to the three source roots | Low | The suites read files across all three roots, so a narrower filter would miss a change that breaks them; one run is about one minute of provisioning plus 25 seconds of tests |
| Risk | macOS `/bin/bash` 3.2 compares modification times in whole seconds | Low | A source edited in the same second as its build is not seen as newer; a real build takes longer than that, and the tests use fixed timestamps |
| Risk | A tracked file in a nested package counts toward its parent's output | Low | A change under `runtime/cli` also rebuilds `runtime`; an extra build, never a skipped one |
| Dependency | Other groups may edit the parent phase map | Low | The merge keeps every row from both sides |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---
