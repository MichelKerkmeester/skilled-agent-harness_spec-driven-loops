---
title: "Feature Specification: Phase 19: local-test-speedups"
description: "A local run of the spec-kit and deep-loop test suites takes 667 s and 497 s. One spec-kit test file validates the whole OS temp folder at import time, and the deep-loop tests wait on real fsync calls that no test can observe."
trigger_phrases:
  - "local test speedups"
  - "phase 19 local test speedups"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 19: local-test-speedups

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-11-12 |
| **Branch** | `worktrees/355-local-test-speedups` |
| **Parent Spec** | ../spec.md |
| **Phase** | 19 of 19 |
| **Predecessor** | 018-cli-vitest-shards |
| **Successor** | None |
| **Handoff Criteria** | The spec-kit runtime lane and both deep-loop groups pass with the changes, and each timing in this spec has an after figure from a command |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 19** of the Test Cycle Speed specification.

**Scope Boundary**: Local test wall time for the spec-kit and deep-loop runtimes. No test is deleted and no production code changes.

**Dependencies**:
- Phase 16, which recorded the one-run local timings this phase improves on.
- Phase 18, which already runs the CLI lane as shards on CI.

**Deliverables**:
- A probe in `validation-exit-honesty.vitest.ts` that validates an empty folder.
- A deep-loop test setup file that skips fsync in the worker and in child processes.
- A three-run trial of the spec-kit lanes side by side, kept only if every run passes.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The operator waits 667 s on the spec-kit suite and 497 s on the deep-loop suite before trusting a local change. In spec-kit, 127 of the 129 runtime test files finish within 13 s, and one file then holds the lane open until 373 s because it validates the OS temp folder, which held 39,844 entries, while it is imported. In deep-loop, the tests perform real fsync calls: one file takes 73 s alone and 6 s without them.

### Purpose
Both suites run the same tests in far less wall time, with the saving measured by the same commands that measured the cost.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
Measured 2026-11-12 on the primary checkout, Node v26.13.0, 18 cores, one run per row.

$ (cd .skilled/skills/system-spec-kit/runtime && npx vitest run)                      wall 374 s, exit 0
$ (cd .skilled/skills/system-spec-kit/runtime/cli && npx vitest run --config ../../vitest.config.ts --project cli)   wall 211 s, exit 0
$ (cd .skilled/skills/system-spec-kit/runtime && npm run test:spec-validation)        wall 82 s, exit 0
$ (cd .skilled/skills/system-deep-loop/runtime && npx vitest run --no-coverage --project parallel)   wall 240 s, exit 0
$ (cd .skilled/skills/system-deep-loop/runtime && npx vitest run --no-coverage --project serial)     wall 257 s, exit 0

Runtime lane, from the JSON reporter (seconds from run start):
  127 of 129 files finished by 60 s
  tests/progressive-validation.vitest.ts      start 0    end 162
  tests/validation-exit-honesty.vitest.ts     start 370  end 373

$ node -p 'require("os").tmpdir()' | xargs ls | wc -l
39844
$ bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh "$TMPDIR"   still running after 46 s, then stopped

Deep-loop, one file alone:
$ npx vitest run --no-coverage --project parallel tests/unit/claim-continuity.vitest.ts
  Duration 72.34s, 18 passed
  with fsyncSync and fdatasyncSync replaced by no-ops through NODE_OPTIONS --require: Duration 5.79s, 18 passed

Deep-loop, whole groups with the same no-op preload:
  parallel  wall 34 s, 161 files passed
  serial    wall 178 s, 12 files passed
  parallel with --maxWorkers=8 and real fsync: wall 310 s

Spec-kit CLI lane with the same preload: wall 251 s, so fsync is not its cost.
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Change the import-time probe in `validation-exit-honesty.vitest.ts` to validate a fresh empty folder and remove it afterwards.
- Add a deep-loop test setup file that replaces `fsyncSync` and `fdatasyncSync` with no-ops, and a preload that does the same in child processes. Without the preload a spawned script still waits on fsync.
- Register the setup file in the deep-loop vitest config, so it applies locally and on CI.
- Trial the three spec-kit lanes side by side three times and keep the change only if every run passes.

### Out of Scope
- Cleaning the leftover folders tests leave in the OS temp folder - the probe no longer depends on them, and finding each leaking test is separate work.
- Splitting `fanout-run.vitest.ts` or `progressive-validation.vitest.ts` - phase 4 already tried the first and rejected it.
- Any change under `lib/` - the fsync calls in production code stay as they are.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/tests/validation-exit-honesty.vitest.ts` | Modify | Probe an empty folder |
| `.skilled/skills/system-deep-loop/runtime/tests/_support/skip-fsync.ts` | Create | Setup file: load the preload and pass it to children |
| `.skilled/skills/system-deep-loop/runtime/tests/_support/skip-fsync-preload.cjs` | Create | Replace the two fsync functions with no-ops |
| `.skilled/skills/system-deep-loop/runtime/vitest.config.ts` | Modify | Register the setup file |
| `.skilled/skills/system-spec-kit/runtime/scripts/run-tests.mjs` | Modify | Only if the lane trial holds |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The spec-kit runtime lane no longer waits on the temp folder probe | `npx vitest run` in the runtime folder exits 0 in under 200 s, and `validation-exit-honesty.vitest.ts` alone passes 6 of 6 |
| REQ-002 | The deep-loop groups pass with fsync skipped | Both `--project parallel` and `--project serial` exit 0 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | The lane trial is decided by three runs | Three concurrent runs are recorded with wall time and each lane's exit code, and the runner changes only if all nine exit codes are 0 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The spec-kit runtime lane runs in under 200 s against 374 s.
- **SC-002**: The deep-loop parallel group runs in under 60 s against 240 s.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `syncBuiltinESMExports` from `node:module` | Without it a named `fsyncSync` import keeps the real function | The whole-suite run with the preload passed and fell from 240 s to 34 s, which it could not have done if the patch had missed |
| Risk | Real fsync is never exercised by a deep-loop test | Low: no test observes durability, and none failed without it. A bug in the fsync call itself, such as a closed descriptor, would no longer surface in tests | The stub is two functions in one file. Removing the setup line restores the old behaviour |
| Risk | `fanout-run.vitest.ts` has a test that races an 800 ms deadline against a child starting | Medium: it failed once in five full runs with the stub and in none of two runs without, which is too few runs to assign a cause | Recorded as a limitation. The test's own margin is out of scope |
| Risk | Three lanes at once compete for cores and make timing tests fail | Medium | Three trial runs decide it, and a failure reverts the runner change |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The operator chose the stub for local and CI runs, and a three-run trial for the lanes.
<!-- /ANCHOR:questions -->

---


