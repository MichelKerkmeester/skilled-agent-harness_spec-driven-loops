---
title: "Feature Specification: Phase 9: close the four Skilled-side open items of the overlay layout"
description: "Four Skilled defects were left open after the overlay layout re-pin: record-base can record the wrong commit for a vendored consumer, a deep-review fan-out runs with an empty review scope, the overlay engine's pre-commit probe misreads a hook-exported GIT_DIR, and the large-reorg playbook gives a generate-context form that now errors. This phase confirms each one and fixes it with a test."
trigger_phrases:
  - "skilled open items"
  - "phase 9 skilled open items"
  - "record-base pin fetch head"
  - "fan-out review scope files empty"
  - "pre-commit hook git dir top-level"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 9: close the four Skilled-side open items of the overlay layout

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-20 |
| **Branch** | `worktrees/481-overlay-framework-root-layout` |
| **Parent Spec** | ../spec.md |
| **Phase** | 9 of 11 |
| **Predecessor** | 008-push-and-repin |
| **Successor** | 010-barter-open-items |
| **Handoff Criteria** | The four fixes are merged on Skilled main with their tests and every gate in `plan.md` green |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 9** of the overlay framework/root layout packet. It runs in Skilled, on the worktree branch the earlier engine phases used.

**Scope Boundary**: the four Skilled-side open items named below. The Barter-side open items belong to phase 010, and the push and the Barter re-pin to phase 011.

**Dependencies**:
- Phase 008 recorded the open items: `record-base` cannot resolve the pin (`008-push-and-repin/implementation-summary.md` Known Limitations 4), and phase 006 left the pre-commit probe open (`006-review-remediation/implementation-summary.md` Known Limitations 1).
- The archived review report names the fan-out scope defect, D-1 (`review-archive/20261120T163142Z/review-report.md` §1).

**Deliverables**:
- One fix and one test per confirmed item, committed on the branch and merged into Skilled main.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Four Skilled defects were left open after the overlay layout re-pin. `/doctor:update record-base --pin` can record a commit other than the pin: after any fetch that exits 0 the engine reads `FETCH_HEAD`, and in ai-speckit that file held an older `git fetch origin` result whose first line was an ai-speckit commit. A deep-review fan-out writes `reviewScopeFiles: []`, so its `scope` terminal gate fails every finding outside the packet folder. The overlay engine's pre-commit check probes the git top level from the vendored subfolder with the hook's `GIT_DIR`, which in a linked worktree names the subfolder. The large-reorg playbook gives a `generate-context.js` form that now errors.

### Purpose
Each of the four items is confirmed or rejected with evidence, and each confirmed one is fixed at its source with a test that fails before the fix.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ node .skilled/skills/system-spec-kit/runtime/cli/dist/continuity/generate-context.js specs/system-skilled-doctor/007-overlay-framework-root-layout/008-push-and-repin
Error: Direct spec folder mode is no longer supported. Use structured JSON via --json, --stdin, or a JSON temp file.

$ head -1 barter/ai-speckit/.git/FETCH_HEAD
4610f6bd1333a5684df148bd07f1c750ab569bf8	not-for-merge	branch 'backup/jotaesteves-v4.1.0' of https://github.com/Barter-BV/ai-speckit

ai-speckit phase 004 tasks.md T014, quoted: without --offline, record-base --pin 063daaee... printed
"commit 4610f6bd... holds no .skilled units to record"

A pre-commit hook in a linked worktree (temp repository, git 2.50.1):
cwd=/private/tmp/pc-repro.AtqE/wt GIT_DIR=/private/tmp/pc-repro.AtqE/main/.git/worktrees/wt GIT_WORK_TREE=<unset>
toplevel=/private/tmp/pc-repro.AtqE/wt
toplevel-from-sub=/private/tmp/pc-repro.AtqE/wt/sub
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Make `record-base --pin` resolve the pinned commit itself: from the consumer repository when it holds it, from the upstream checkout when the remote is a local folder, and by a fetch whose result is checked against the pin. Refuse with a line naming every place it looked.
- Give a deep-review fan-out a recorded review scope, so the root config and every lineage config carry the discovered files.
- Make the overlay engine's pre-commit top-level probe ignore a hook-exported `GIT_DIR`, as `gitTopLevelOrNull` already does, while its index reads keep the hook's environment.
- Replace the bare `generate-context.js <spec-folder>` line in `large-reorg-playbook.md` with the `--json` form.

### Out of Scope
- The release-tag path of `tagCommit`, beyond what the pin fix shares with it - the open item names the pin.
- Other bare `generate-context.js <spec-folder>` lines elsewhere - they are named in the implementation summary, not fixed.
- Barter-side items - phase 010.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/commands/doctor/scripts/release-update.cjs` | Modify | Pin resolution that never reads `FETCH_HEAD` and can read a local upstream checkout |
| `.skilled/commands/doctor/scripts/tests/release-update.test.cjs` | Modify | Tests for the vendored-consumer pin |
| `.skilled/commands/deep/assets/deep-review.yaml` | Modify | Scope discovery at the fan-out root, passed to the runner |
| `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` and its lineage-config writer | Modify | An optional scope-file input written into each lineage config |
| `.skilled/skills/system-deep-loop/runtime/tests/**` | Modify | A test that a lineage config carries the scope |
| system-deep-loop contract docs that describe fan-out config | Modify | State the scope hand-off |
| `.skilled/commands/doctor/scripts/overlay-engine.cjs` | Modify | The pre-commit top-level probe |
| `.skilled/commands/doctor/scripts/tests/overlay-engine-*.test.cjs` | Modify | A linked-worktree commit test |
| `.skilled/skills/sk-git/references/large-reorg-playbook.md` | Modify | The working `generate-context.js` form |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `record-base --pin <sha>` records that sha or refuses; it never records another commit | A test with a stale `FETCH_HEAD` naming another commit passes, and fails on the unfixed engine |
| REQ-002 | A deep-review fan-out records a non-empty review scope in the root config and every lineage config | A test that a lineage config written from a scope file carries those files passes, and the runner without the input keeps today's behavior |
| REQ-003 | The overlay engine's pre-commit check works in a linked worktree of a vendoring repository with a sibling overlay folder | A test that commits in a real linked worktree passes, and fails on the unfixed engine |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | `large-reorg-playbook.md` gives a `generate-context.js` form that runs | `rg -n 'generate-context.js --json' .skilled/skills/sk-git/references/large-reorg-playbook.md` prints the line, and that form exits 0 on this phase folder |
| REQ-005 | No regression in the gates of `plan.md` | Every gate matches or beats its baseline on the branch and on merged main |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The engine suite, guard suite, doctor contract test, `route-validate`, the release-update tests and the deep-loop fan-out and terminal-gate tests all exit 0 on merged main, each with at least its baseline count.
- **SC-002**: `validate.sh --recursive --strict` on the parent prints `RESULT: PASSED` for every folder.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | A deep review is running on main and reads the deep-loop scripts | A required flag would break its lineages | Any new runner input is optional and absent means today's behavior |
| Risk | Reading the pin from an upstream checkout leaves the consumer without the pin's objects | A later `align` or `apply` could need them | Check how check, align and apply read a pinned base before choosing where the pin is read |
| Risk | Dropping `GIT_INDEX_FILE` from the index reads would read the wrong index under `git commit -a` | The check would judge the wrong staged set | Only the top-level probe drops the hook environment |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None. The operator set the scope, the workers and the failure policy up front on 2026-11-20.
<!-- /ANCHOR:questions -->

---
