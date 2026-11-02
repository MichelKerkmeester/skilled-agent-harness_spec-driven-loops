---
title: "Feature Specification: Phase 6: doctor-update-local-state"
description: "/doctor:update keeps its records and run state in .skilled/release/, which Skilled ships as a folder holding only a .gitignore. The operator wants that folder gone from .skilled, with everything kept as local, uncommitted state."
trigger_phrases:
  - "doctor update local state"
  - "phase 6 doctor update local state"
  - ".skilled/release folder"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 6: doctor-update-local-state

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | In Progress |
| **Created** | 2026-11-02 |
| **Branch** | `worktrees/308-doctor-update-local-state` |
| **Parent Spec** | ../spec.md |
| **Phase** | 6 of 6 |
| **Predecessor** | 005-advisor-linked-project-workspace |
| **Successor** | None |
| **Handoff Criteria** | Tests pass, no `.skilled/release/` ships, the change is committed on the worktree branch and Barter's `skilled/` is re-pinned to that commit |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 6** of the doctor audit and fixes packet.

**Scope Boundary**: where `/doctor:update` keeps its state, and the documents that name that place. The update engine's planning, merge and apply logic is unchanged.

**Dependencies**:
- `.gitignore` already ignores `.skilled/skills/.state/*/*` in Skilled (line 132) and in Barter's `skilled/.gitignore` (line 33).

**Deliverables**:
- `release-update.cjs` keeps all state in `.skilled/skills/.state/doctor-update/` and reads a legacy `.skilled/release/` record once.
- `.skilled/release/` no longer ships.
- The workflow assets, presentation text, command doc and playbook pages name the new place and no longer ask the operator to commit the records.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Skilled ships `.skilled/release/` holding only a `.gitignore`, so every installed copy, Barter's `skilled/` included, carries an empty-looking folder in `.skilled/`. `/doctor:update` keeps `base.json` and `divergence.json` there as tracked files the operator must commit, plus `runs/` and `.apply.lock` as local state.

### Purpose
No `.skilled/release/` folder ships. All `/doctor:update` state lives in the ignored `.skilled/skills/.state/doctor-update/`, and a repository that already committed `.skilled/release/base.json` keeps working.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ node .skilled/commands/doctor/scripts/release-update.cjs --help | grep -E "run directory|base manifest|divergence log"
  run directory   .skilled/release/runs/<release>-<utc-stamp>/
  base manifest   .skilled/release/base.json
  divergence log  .skilled/release/divergence.json
$ git ls-files .skilled/release
.skilled/release/.gitignore
$ node .skilled/commands/doctor/scripts/tests/release-update.test.cjs
ℹ tests 73
ℹ pass 73
ℹ fail 0
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Move the state paths in `release-update.cjs` to `.skilled/skills/.state/doctor-update/` and drop the refusals that treated the records as tracked files.
- Read a legacy `.skilled/release/base.json` or `divergence.json` when the new one is missing, write the new path on the next write, and print a one-time notice naming the old tracked copies.
- Delete `.skilled/release/.gitignore`, so the folder stops shipping.
- Update the apply-lock path that `upgrade-legacy.mjs` checks.
- Update the workflow assets, presentation text, command doc, playbook pages and the playbook validator's installed-state exception.

### Out of Scope
- Moving the records anywhere tracked. The operator chose local, uncommitted state; each clone records its own base.
- Removing a consumer's committed `.skilled/release/` copy. The tool never writes git; the notice tells the operator the command.
- Changelog entries. The release notes are written when a release is cut.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/commands/doctor/scripts/release-update.cjs` | Modify | State paths, legacy read, record dirty checks, unit and rollback filters, help text |
| `.skilled/commands/doctor/scripts/tests/release-update.test.cjs` | Modify | New paths, legacy-read test, untracked-record test |
| `.skilled/release/.gitignore` | Delete | The folder stops shipping |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs` and its vitest | Modify | Apply-lock path |
| `.skilled/commands/doctor/assets/doctor-update-*.yaml`, `doctor-update-presentation.txt`, `update.md` | Modify | Paths and operator instructions |
| `.skilled/manual-testing-playbook/doctor-commands/doctor-update-*.md`, `manual-testing-playbook.md` | Modify | Paths and steps |
| `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs` | Modify | Installed-state path exception also accepts the new folder |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `release-update.cjs --help` names `.skilled/skills/.state/doctor-update/` for the run directory, base manifest and divergence log, and `git ls-files .skilled/release` prints nothing. |
| REQ-002 | `node .skilled/commands/doctor/scripts/tests/release-update.test.cjs` exits 0 with every test passing, including a test that a legacy `.skilled/release/base.json` is read when the new one is missing and the next `record-base` writes the new path. |
| REQ-003 | `record-base` and `apply` no longer refuse because a record differs from HEAD, and still refuse a dirty framework file. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | `upgrade-legacy.mjs` refuses a layout move while `.skilled/skills/.state/doctor-update/.apply.lock` exists, shown by its vitest. |
| REQ-005 | `rg -n "\.skilled/release" .skilled -g '!**/changelog/**'` finds only legacy-fallback references, and no asset, doc or playbook page tells the operator to commit `base.json`. |
| REQ-006 | `validate-playbook-package.test.cjs` passes, and the doctor-commands playbook package validates with no new warning. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A fresh copy of `.skilled/` has no `release/` folder, and `/doctor:update record-base` creates only files under `.skilled/skills/.state/doctor-update/`, which `git status` does not show.
- **SC-002**: Barter's `skilled/`, re-pinned to the commit, has no `.skilled/release/` and still replays every overlay with `miss=0`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The `.state/*/*` ignore rule in each consumer's `.gitignore` | Without it the records would show as untracked files | Verified in Skilled and Barter; the playbook names the rule |
| Risk | A consumer with a committed `.skilled/release/base.json` loses its base after upgrading | Med | Legacy read when the new file is missing, then the new path on the next write; covered by a test |
| Risk | Teammates no longer share one base | Low | The operator's choice; each clone runs `record-base` once |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: N/A: a path change; the engine's work per run is unchanged.

### Security
- **NFR-S01**: Rollback still restores only the record files and paths inside the plan's units; legacy record paths are added to that list and nothing else.

### Reliability
- **NFR-R01**: A legacy record is never deleted or rewritten by the tool.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: no record in either place, so `check` and `align` behave as before with no base recorded.
- Both present: the new record wins and the legacy one is ignored.
- Failure path: an unreadable record still fails with the existing `cannot read <path>` error.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | One script, one cross-consumer, about 16 text files |
| Risk | 10/25 | Changes where a shipped command keeps its state; legacy fallback covers existing users |
| Research | 4/20 | All references found by one `rg` |
| **Total** | **24/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. Operator decisions (2026-11-02): all state local and uncommitted; worktree; commit in Skilled, then re-pin Barter.
<!-- /ANCHOR:questions -->

---
