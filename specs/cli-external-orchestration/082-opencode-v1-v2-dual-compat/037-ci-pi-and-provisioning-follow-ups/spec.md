---
title: "Feature Specification: Phase 37: ci-pi-and-provisioning-follow-ups"
description: "Four follow-ups recorded by phases 029, 030 and 032 were left open: one intermittent sk-doc cite-drift failure with no subtest named, Pi extension type and pack checks that no workflow runs from a hand-written matrix, no end-to-end battery test through a symlinked root, and a provisioning stamp taken after the build. This phase closes them and lists every workflow in the workflows README."
trigger_phrases:
  - "ci pi and provisioning follow ups"
  - "phase 37 ci pi and provisioning follow ups"
  - "pi extension discovery matrix"
  - "provision stamp fingerprint before build"
  - "cite drift flake"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 37: ci-pi-and-provisioning-follow-ups

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
| **Branch** | `worktrees/179-ci-pi-and-provisioning-follow-ups` |
| **Parent Spec** | ../spec.md |
| **Phase** | 37 of 37 |
| **Predecessor** | 034-live-plugin-playbook |
| **Successor** | None |
| **Handoff Criteria** | The Pi, sk-git, sk-doc and dual-version workflows pass on CI at the pushed commit, and every workflow file has a row in both README tables |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 37** of the OpenCode v1 and v2 dual compatibility specification. It closes the CI, Pi and provisioning follow-ups that phases 029, 030 and 032 recorded and the open-work goal of 2026-10-20 assigned to one group.

**Scope Boundary**: `.github/workflows/pi-extension-tests.yml`, `.github/workflows/README.md`, the sk-doc cite-drift test and the runner that names its failures, the battery unit tests, the provisioning stamp in `worktree-naming.sh` with its test suite, and this packet. The plugins, the battery's own legs and every other workflow stay as they are.

**Dependencies**:
- `../029-unrun-tests-ci-coverage/`, which added the Pi workflow and the cite-drift test to CI and recorded the flake.
- `../030-nested-worktree-battery/`, which added the nested-root isolation and recorded the missing symlinked-root test.
- `../032-plugin-tests-ci-and-stale-bundles/`, which added the build stamp and recorded the after-the-build fingerprint and the missing README rows.

**Deliverables**:
- A Pi workflow that discovers each extension and runs its test, typecheck and pack scripts when present.
- A stamp written from the fingerprint taken before the build, with a test that fails on the old order.
- An end-to-end battery test through a symlinked nested root.
- The cite-drift finding, its fix or its recorded limit, and README rows for every workflow.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Run 39424650739 failed `test-cite-drift-scan.mjs` on its first attempt and passed on its second at the same commit, and the runner then printed only the log tail, so the failing subtest has no name. The Pi workflow names its two extensions by hand and runs only their test scripts, so a third extension or a type or pack error reaches main unseen. The nested-root battery isolation has unit tests for a symlinked root but no end-to-end run through `main()`. Provisioning fingerprints the sources after the build, so an edit made while a build runs is recorded as built and the next provision skips it. The workflows README lists neither `message-contract.yml`, `opencode-dual-version.yml` nor `dependabot-auto-merge.yml`, and its push and pull-request table misses seven workflows.

### Purpose
Each recorded follow-up is either fixed with a test that fails on the old code or recorded with the evidence that bounds it.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Reproduce or bound the cite-drift failure and remove the causes the evidence supports.
- Discover Pi extensions from the tree, run each one's required `test` script, and run `typecheck` and `check:pack` when it defines them.
- Add an end-to-end battery test through a symlinked root nested under another checkout.
- Take the provisioning fingerprint before the build and write it only after the build succeeds.
- Add every workflow file to both README tables.

### Out of Scope
- The battery's legs and the nested-root detection itself - only a test is added.
- Any other workflow's triggers or jobs.
- Provisioning in the main checkout.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.github/workflows/pi-extension-tests.yml` | Modify | Discovery job and per-extension test, typecheck and pack steps |
| `.github/workflows/README.md` | Modify | Rows for every workflow in both tables |
| `.skilled/skills/sk-git/scripts/worktree-naming.sh` | Modify | Fingerprint before the build, stamp after success |
| `.skilled/skills/sk-git/scripts/tests/worktree-naming.test.sh` | Modify | A build that edits a source while it runs is rebuilt next time |
| `.skilled/commands/doctor/scripts/tests/opencode-version-battery.test.cjs` | Modify | End-to-end run through a symlinked nested root |
| `.skilled/skills/sk-doc/scripts/tests/test-cite-drift-scan.mjs` | Modify | Only if the evidence names a cause in the test |
| `specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/037-ci-pi-and-provisioning-follow-ups/` | Create | This packet |
| `specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/spec.md` | Modify | Phase map row and handoff row for 037 |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The Pi workflow finds every extension under `.pi/extensions/` that has a `package.json`, runs its `test` script, which every extension must define, and runs `typecheck` and `check:pack` when defined. | A dry run of the discovery step lists both extensions, and a third fixture extension is listed with no workflow edit; both extensions pass every script they define locally. |
| REQ-002 | A provision stamp records the fingerprint taken before the build and is written only when the build succeeds. | A new test with a build that edits a tracked source while it runs passes on the new code and fails on the old order; a second provision of the real worktree builds nothing. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | The battery isolates a symlinked root nested under another checkout, end to end. | A `main()` test through a symlinked alias of a nested root passes plugin-active with the isolated line and records both switches. |
| REQ-004 | The cite-drift failure is fixed or bounded. | The finding names the evidence; the test passes on every repeated run recorded. |
| REQ-005 | Every workflow file is listed in both README tables. | A scripted comparison of `*.yml` against both tables finds no file missing. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The Pi, sk-git, sk-doc and dual-version workflows pass on CI at the pushed commit.
- **SC-002**: Each changed behaviour has a test that fails on the old code.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A build that rewrites one of its own tracked inputs would loop once the fingerprint is taken before it | Med | A second provision of the real worktree must build nothing |
| Risk | The cite-drift failure may not reproduce | Med | Record the run counts and the evidence that rules each candidate in or out |
| Dependency | GitHub's matrix accepts a JSON list from a discovery job output | Low | `fromJSON` on a job output is the documented form |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---
