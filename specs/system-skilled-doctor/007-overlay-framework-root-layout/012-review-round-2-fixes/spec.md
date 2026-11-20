---
title: "Feature Specification: Phase 12: fix the Skilled findings of the second overlay layout review"
description: "The follow-up deep review of the overlay layout left one P1 and thirteen Skilled-side P2 findings: relayout failures outside its error contract, overlay-folder and layout-link paths the engine does not contain, a git call open to option injection, doc drift and stale packet records. This phase confirms each one against the current code and fixes it at its source with a test, or records why it is already fixed."
trigger_phrases:
  - "review round 2 fixes"
  - "phase 12 review round 2 fixes"
  - "overlay layout second review fixes"
  - "relayout backup failure contract"
  - "layout link path escapes the tree root"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 12: fix the Skilled findings of the second overlay layout review

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
| **Branch** | `worktrees/495-overlay-review-round-2-fixes` |
| **Parent Spec** | ../spec.md |
| **Phase** | 12 of 12 |
| **Predecessor** | 011-push-and-repin-open-items |
| **Successor** | None |
| **Handoff Criteria** | The fixes are merged on local Skilled main with every gate in `plan.md` green, before phase 011 pushes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 12** of the overlay framework/root layout packet. It runs in Skilled, on a fresh worktree branch, and merges into local Skilled main. Phase 011's push and Barter re-pin run after this phase, so the push carries these fixes.

**Scope Boundary**: the Skilled-side findings of the generation 2 review in `../review/review-report.md`. The Barter-side findings belong to an ai-speckit session and are recorded in ai-speckit's record 039.

**Dependencies**:
- Phase 009 merged on local main as `1ac1fba6a25`, including its fix for the pre-commit probe under a hook-exported `GIT_DIR`.
- The generation 2 review report and its two lineages under `../review/lineages/`.

**Deliverables**:
- One fix and one test per confirmed engine finding, the doc and workflow corrections, and the packet record corrections, merged on local Skilled main.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The second review found that a relayout can fail outside its error contract, with a raw error or a misreported completed run, and that its restore-failed line overstates what the backup holds. The engine leaves an in-tree overlay folder that links out of the tree, a sibling that resolves back into the tree and manifest layout-link paths uncontained or misreported, and passes a manifest value to `git cat-file` where a leading dash reads as an option. The docs send a `root/skilled` LAYOUT line to relayout and attribute the outside-repository refusal to pre-commit, and four packet records do not reproduce or are stale.

### Purpose
Every Skilled-side finding is confirmed and fixed at its source with a test that fails before the fix, or recorded as already fixed or false with evidence.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ rg -n -e 'source[L]ayout' -e 'framework-root' -e 'opt[-]in' .skilled/commands/doctor .skilled/skills/system-skilled-doctor -g '!**/scripts/**' -g '!**/changelog/v1.1*'
.skilled/commands/doctor/assets/doctor-env.yaml:48:    Map a setting line to: ... or the description says set 1, set true or opt-in; ...

The pre-commit hook test from phase 009, run against the engine before phase 009 and at main tip 95aa07427ec:
$ git checkout 3ddeef925dd^ -- .skilled/commands/doctor/scripts/overlay-engine.cjs
$ node --test --test-name-pattern='real hook judges a commit in a linked worktree' .skilled/commands/doctor/scripts/tests/overlay-engine-strict-writes.test.cjs
ℹ pass 0
ℹ fail 1
$ git checkout HEAD -- .skilled/commands/doctor/scripts/overlay-engine.cjs   (then the same test)
ℹ pass 1
ℹ fail 0

Baseline gates on the worktree at 95aa07427ec:
engine 263/263, guard 20/20, doctor overlay contract 9/9, route-validate exit 0,
release-update and update contract 95/95, deep-loop vitest 209/209, trigger index --check exit 0
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Keep every relayout failure inside its printed contract: a backup that cannot be written, a rollback that fails and an emptied folder that cannot be pruned, with a restore-failed line that names the files the backup skipped.
- Refuse an in-tree overlay folder that resolves outside the tree, report a sibling that resolves into or around the tree with that reason, and refuse a manifest layout-link path that escapes the tree root before any command writes through it.
- Pass `--end-of-options` before every manifest-derived revision the engine hands to git.
- Correct the presentation, the status and apply workflows and `references/overlays.md` to match what the engine prints, and rename the custom overlay folder value in the fixes test to `custom-overlays`.
- Correct the phase 003 criterion, the parent phase count and the phase 007 and 008 summaries.
- Name the staged tree root a later `status --root` can read when a re-pin stage copies a sibling overlay folder, an upstream item the ai-speckit session handed over.

### Out of Scope
- The Barter-side findings, such as the hooks, the write gate and the manifest's checkout path - an ai-speckit session owns them.
- The pre-commit probe under a hook-exported `GIT_DIR` - phase 009 fixed it, and this phase only proves that.
- Pushing Skilled and re-pinning Barter - phase 011. Its re-pin must first rebase Barter's `fanout-run.cjs` overlay, because a stage to Skilled `HEAD` blocks on it until then; that rebase is Barter's overlay and is not edited here.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/commands/doctor/scripts/overlay-engine.cjs` | Modify | Relayout error contract, overlay-folder and layout-link containment, `--end-of-options`, the staged tree root |
| `.skilled/commands/doctor/scripts/tests/overlay-engine-*.test.cjs` | Modify | One test per fix, and the neutral custom folder value |
| `.skilled/commands/doctor/assets/doctor-overlay-presentation.txt` | Modify | Refusal row, LAYOUT rows, two relayout rows |
| `.skilled/commands/doctor/assets/doctor-overlay-apply.yaml`, `doctor-overlay-status.yaml` | Modify | Rules for the new relayout lines and the `root/skilled` LAYOUT exception |
| `.skilled/skills/system-skilled-doctor/references/overlays.md` | Modify | The setting refusals and the relayout failure contract |
| `../003-engine-docs-and-release/goal.md`, `../goal.md`, `../007-barter-review-fixes/implementation-summary.md`, `../008-push-and-repin/implementation-summary.md` | Modify | Reproducible criteria and current records |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A commit through a real hook in a linked worktree refuses an unowned vendored change | Phase 009's linked-worktree hook test fails on the engine before `3ddeef925dd` and passes at main tip |
| REQ-002 | Every relayout failure prints a line the apply workflow has a rule for, and a finished relayout never exits as a failure | Tests for a failed backup, a failed rollback, an unremovable backup and a failed prune pass. The tests for a changed line fail on the unfixed engine; the rollback-only and unremovable-backup cases already printed the right line, so their tests are regression guards |
| REQ-003 | No overlay-folder setting or manifest layout-link path lets a command write outside the tree or repository it belongs to | Tests for an in-tree link out of the tree and an escaping layout-link path pass, and fail on the unfixed engine |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | A sibling that resolves into or around the tree is refused with that reason | A test asserts the new reason and fails on the unfixed engine |
| REQ-005 | A manifest revision starting with `-` reaches git as a revision, never an option | A test that records git's arguments sees `--end-of-options` before it, and fails on the unfixed engine |
| REQ-006 | The docs and workflows name the lines the engine prints | `rg -n 'refused by .pre-commit.' .skilled/commands/doctor/assets/doctor-overlay-presentation.txt` prints nothing, and the contract test passes |
| REQ-007 | The packet records reproduce | The amended phase 003 search prints nothing, and `validate.sh --recursive --strict` on the parent prints `RESULT: PASSED` |
| REQ-008 | A re-pin stage with a sibling overlay folder names a staged tree root that `status --root` reads | A test runs `status --root` on the printed `staged tree root:` path and on JSON `stagedRoot` without `no overlay manifest`, and fails on the unfixed engine |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The engine suite passes on merged main with more than 263 tests, and the guard suite, contract test, `route-validate`, release-update tests and deep-loop tests keep their baseline counts with exit 0.
- **SC-002**: `validate.sh --recursive --strict` on the parent prints `RESULT: PASSED` for every folder, and `generate-trigger-index.mjs --check` exits 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Barter's vendored engine copy runs the same code after phase 011's re-pin | A stricter setting check could refuse Barter's layout | Barter names `../overlays`, a direct sibling inside its repository, and has no in-tree link out of the tree |
| Risk | Refusing an in-tree link out of the tree could break a consumer that relied on one | That consumer's commands would exit 2 | The refusal names the setting and the remedy, a `../<name>` sibling, which the engine supports |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The custom folder value `barter-overlays` in the fixes test was kept by decision in phase 005; the operator's standing decision to fix every finding supersedes it here.
<!-- /ANCHOR:questions -->

---
