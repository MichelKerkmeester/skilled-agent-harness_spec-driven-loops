---
title: "Feature Specification: Phase 10: real-pipeline-tests"
description: "The relocate and archive suites replace every writer relocate.mjs drives with a stub that exits 0, so no automated test runs the real pipeline or a resume path. This phase adds one suite that runs the true writers in a temp repository and fails when a pipeline step is removed."
trigger_phrases:
  - "real pipeline tests"
  - "phase 10 real pipeline tests"
  - "relocate suite with the true writers"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 10: real-pipeline-tests

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-14 |
| **Branch** | `worktrees/375-subtrack-review-remediation` |
| **Parent Spec** | ../spec.md |
| **Phase** | 10 of 10 |
| **Predecessor** | 009-proposal-search-and-routing |
| **Successor** | None |
| **Handoff Criteria** | `validate.sh --strict --recursive` on the parent prints `RESULT: PASSED` for every folder, and the new suite fails when the migrate call is removed from a scratch `relocate.mjs` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 10** of the Subtrack proposal, deterministic packet relocation, z_archive on every subtrack and opt-in archive search specification.

**Scope Boundary**: One new vitest suite and the fixture builder it needs. No change to `relocate.mjs`, `archive.sh` or any writer.

**Dependencies**:
- Phases 006, 007 and 008, committed, because the suite asserts the behavior they fix
- The true writers: `repair-derived.cjs`, `migrate-generated-json.ts`, `validate.sh`, `sweep-track-roots.mjs`, `generate-trigger-index.mjs` and `cite-drift-scan.mjs`

**Deliverables**:
- A suite that applies a map with the true writers and reads the stores they wrote
- Resume cases through the true writers for the paths phase 006 fixed
- A recorded mutation check: the suite fails when a pipeline step is removed
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`relocate.vitest.ts` and `archive-track.vitest.ts` copy `relocate.mjs` into a temp tree and replace every writer it drives with a stub, as the lines below show. The assertions on `specFolder` and `packet_id` then pass from text substitution alone, so the suites stay green whether or not the pipeline calls its writers, and no test runs a resume path against them. Reviewer A found the resume defects by hand for that reason.

### Purpose
One suite runs the real pipeline end to end, and it turns red when a pipeline step is removed.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ grep -n "^  stub(" .skilled/skills/system-spec-kit/runtime/cli/tests/relocate.vitest.ts
60:  stub(path.join(spec, 'repair-derived.cjs'), 'process.exit(0);\n');
61:  stub(path.join(spec, 'sweep-track-roots.mjs'), 'process.exit(0);\n');
62:  stub(path.join(spec, 'validate.sh'), '#!/usr/bin/env bash\nprintf "RESULT: PASSED\\n"\nexit 0\n', 0o755);
63:  stub(path.join(cli, 'graph', 'migrate-generated-json.ts'), 'process.exit(0);\n');
64:  stub(path.join(cli, 'retrieval', 'generate-trigger-index.mjs'), 'process.exit(0);\n');
65:  stub(path.join(skill, 'node_modules', 'tsx', 'dist', 'loader.mjs'), 'export {};\n');
66:  stub(path.join(repo, '.skilled', 'skills', 'sk-doc', 'shared', 'scripts', 'cite-drift-scan.mjs'), 'process.exit(0);\n');
```
Seven stubs replace the six writers and the TypeScript loader. That the suite stays green with a pipeline step removed is the reviewer's inference from reading and has not been run.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

`C` is `.skilled/skills/system-spec-kit/runtime/cli`. The finding id is that of reviewer A, `../scratch/review-20261114-core-code.md`.

### In Scope
- Add a suite that builds a temp repository holding the true writers and applies a relocation map twice (A10).
- Add resume cases through the true writers: a late step that fails once, and a failed identity step (A10).
- Add one restore case through `archive.sh` and the true writers, onto a taken number (A10).
- Record the mutation check that proves the suite reads the writers' output (A10).

### Out of Scope
- Removing the stubs from the two existing suites - they keep the fast cases, and this suite covers what they cannot.
- A case per relocate branch - the floor is one happy path and one edge case per surface, and the stubbed suites already hold the branch cases.
- Running a relocate against the real `specs/` tree - every run stays in a temp repository.
- Fixing a defect the new suite exposes in a writer - it is recorded in `goal.md` and raised to the operator.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `C/tests/relocate-real-pipeline.vitest.ts` | Create | The suite: apply twice, two resume cases and one renumbering restore, all with the true writers |
| `C/tests/fixtures/real-pipeline-tree.mjs` | Create | The builder for a temp repository the true writers can run against. Created only if T002 shows `fixtures/subtrack-tree.mjs` cannot be extended |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

`V` is `../../node_modules/.bin/vitest run --config ../../vitest.config.ts --project cli`, run from `C`. `NEW` is `tests/relocate-real-pipeline.vitest.ts`. `GUARD` is `git status --porcelain -- specs .skilled/skills/sk-doc/shared/scripts .skilled/skills/system-spec-kit/runtime/data .skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures`, limited to the stores the writers touch: the packets, the ledger and redirect table beside `cite-drift-scan.mjs`, and the trigger index with its sidecar files, which `generate-trigger-index.mjs:93-96` places in the last two folders.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Closes A10 at `tests/relocate.vitest.ts:60-66` and `tests/archive-track.vitest.ts:130-136`. Failing scenario: with the call to `migrate-generated-json` removed from a scratch copy of `relocate.mjs`, both suites stay green, because the stub exits 0 either way. A suite must fail when a pipeline step is removed | With that call removed from the scratch copy, `V NEW` against the copy exits 1 and names the `parentChain` assertion. Against the unchanged script `V NEW` exits 0. T001 first records the two existing suites staying green on the same mutation, or states the difference |
| REQ-002 | Closes A10 for the happy path. Failing scenario: no test applies a map with the true writers. The suite must apply a sub-track map twice and read what the writers wrote | In the temp repository, the first `--apply` exits 0 and the moved packet's `description.json` holds the new `specFolder` and `parentChain`, its `graph-metadata.json` holds the new `packet_id`, the track's `children_ids` list the new id and `validate.sh --strict` prints `RESULT: PASSED` for it. The second `--apply` prints `relocate: nothing to do` and exits 0 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Closes A10 for the resume paths. Failing scenario: no automated test runs a resume path. The suite must cover a rerun after a late step failed once and a rerun after the identity step failed once, both with the true writers | For each case the first `--apply` exits 2, the second exits 0 with the failed step printed as `ok`, and the stores hold the values REQ-002 names. The failure is induced by a wrapper around the true writer that exits 1 on its first call |
| REQ-004 | Closes A10 for the restore path. Failing scenario: `archive-track.vitest.ts` drives a renumbering restore through stubs. The suite must run one through `archive.sh` and the true writers | `archive.sh --restore` onto a taken number exits 0, the packet is live under the next free number and its `description.json` and `graph-metadata.json` hold the new id |
| REQ-005 | The suite never writes to the real checkout. Failing scenario: `relocate.mjs` takes the repository from the working directory at line 58 and finds its writers beside its own file at lines 61 to 70. Whether each writer writes under the working directory or under its own location is UNKNOWN, so a writer run in place could write to the real tree | The suite compares the output of `GUARD` in its own checkout before and after and fails on any difference. The whole checkout is not compared, because another session or suite touching any file during `npm test` would fail the guard. T002 confirms the four paths against what each writer writes. A writer that T002 shows writing under its own location runs from a copy inside the temp repository, never in place |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `V NEW` exits 0 against the committed scripts and exits 1 against a scratch copy of `relocate.mjs` with the migrate call removed.
- **SC-002**: `bash C/spec/validate.sh <parent> --strict --recursive` prints `RESULT: PASSED` for the parent and all ten children, and `cd C && npm test` exits 0 with no failure absent from the baseline.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The true writers need the compiled runtime and `node_modules` | The suite cannot start in a bare temp tree. Reviewer A met two stale-dist failures in a copy | T002 lists what each writer loads and whether it can be linked read-only. The suite fails with the build command when the compiled runtime is stale |
| Risk | A writer run in place writes to the real checkout | High: a test run changes the working tree | T002 finds where each writer writes, REQ-005 runs the ones that write under their own location from a copy, and the suite compares `GUARD` before and after |
| Risk | The suite outlasts the test timeout | Med: a slow or flaky gate | T003 measures one apply with the true writers. A measured need sets a per-test timeout. The writers are not stubbed to save time |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Which files each true writer loads from outside its own folder, and whether it writes under the working directory or under its own location, is UNKNOWN. T002 lists both, and that list decides what the temp repository copies and what runs in place.
- How long one apply with the true writers takes is UNKNOWN. The two stubbed suites ran in 31.66 s on 2026-11-14. T003 measures the real one.
<!-- /ANCHOR:questions -->

---
