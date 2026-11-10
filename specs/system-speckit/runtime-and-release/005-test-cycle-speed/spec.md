---
title: "Feature Specification: Test cycle speed: cut the spec-kit suite time and the gate stacking"
description: "A local npm test in the spec-kit runtime takes 29 minutes, and 86 percent of that is another skill's suite. This packet plans the cuts in order. Nothing is built here."
trigger_phrases:
  - "test cycle speed"
  - "test cycle speed cut the spec kit suite"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Test cycle speed: cut the spec-kit suite time and the gate stacking

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-11-10 |
| **Branch** | `worktrees/339-release-writing-defaults` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A local `npm test` in `system-spec-kit/runtime` took 1767 seconds on the v4.0.2.1 work. Its config also collects the `system-deep-loop` suite, which is 166 of the 299 files and 1199 of the 1396 seconds of test time. CI does not run it that way: `spec-kit-check.yml` runs the `root` project, which leaves the deep-loop files out, and `deep-loop-runtime.yml` runs them alone. The same local command skips the `cli` project, 203 files that CI does run. The v4.0.2.1 work also reran the full suite after every rebase, including one that moved only the trigger index.

### Purpose
A change to the spec-kit runtime is proven locally in about four minutes, by the same test set CI runs for it.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior

### Measured Behavior

```text
$ cd .skilled/skills/system-spec-kit/runtime && npm test
 Test Files  299 passed (299)
      Tests  4511 passed
   Duration  1767s (tests 1396s, import 338s)
```

| Slice | Files | Test time |
|-------|-------|-----------|
| `system-deep-loop` tests | 166 | 1199 s |
| spec-kit's own tests | 126 | 197 s |
| Ten slowest files | 10 | 54% of test time |
| Twenty-five slowest files | 25 | 79% of test time |

The four slowest files are `fanout-run.vitest.ts` at 157 s, `progressive-validation.vitest.ts` at 151 s, `blinded-adjudication` at 85 s and `claim-continuity` at 84 s. The `cli` project ran apart from `npm test`: 203 files, 2518 tests, about ten minutes.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- An ordered plan of five cuts, each with its expected saving and the check that proves it.
- The process rules that go with them: which suite to run for which change, and when a rerun is owed.

### Out of Scope
- Any change to a config, test or workflow - this packet is the plan, and each cut is built in its own packet.
- Deleting tests - no file is removed on speed grounds without a profile that shows it re-proves something another test already covers.
- The sk-doc script suite and `test_readme_verdict_parity.py` - they belong to a different skill.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `specs/system-speckit/runtime-and-release/005-test-cycle-speed/plan.md` | Create | The five cuts in order |
| `specs/system-speckit/runtime-and-release/005-test-cycle-speed/tasks.md` | Create | One task per cut, each with its check |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

REQ ids run in one sequence across the P0 and P1 tables.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Each cut names the file it changes and the saving it expects | `plan.md` section 4 has five rows, each with a file path and a number of seconds |
| REQ-002 | Each cut has a check that would fail if the cut dropped coverage | `tasks.md` gives every cut a `Verify:` command and its expected output |
| REQ-003 | No cut lowers what CI runs | `plan.md` states for each cut whether a workflow changes, and the first three change none |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The plan separates measured facts from estimates | Every saving in `plan.md` is marked measured or estimated |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-speckit/runtime-and-release/005-test-cycle-speed --strict` prints `RESULT: PASSED`.
- **SC-002**: The operator can pick the first cut from `plan.md` without a further question.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A deep-loop test leans on spec-kit's setup file | The deep-loop suite breaks when run alone | No deep-loop test file names `vitest-setup`, and its own workflow already runs the suite without that file |
| Risk | Parallel files collide on shared temp roots | Flaky failures | Parallelism is the last cut and waits for per-file temp roots |
| Dependency | The numbers come from one run on one machine | A saving is off by a margin | Each cut measures again before and after |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Q1: Should cut 1 also drop the `test:council` script's two deep-loop paths, or leave that script as it is?
<!-- /ANCHOR:questions -->

---


