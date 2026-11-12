---
title: "Tasks: Phase 20: test-speed-followups"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "test speed followups tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 20: test-speed-followups

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup


- [x] T001 Read how the failed `main` run lost its install (`.github/workflows/spec-kit-check.yml`). Verify: `gh run view 43275933572 --log-failed` shows `npm error code ECONNRESET` in shard 2. Evidence: spec.md, Measured Behavior.
- [x] T002 Find why the fan-out resume test fails on a slow start (`.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs`). Verify: `normalizeWaitCheckpoint` sets `waiting` only when `nextRunAtMs > nowMs`, so a passed deadline logs no `resume_waiting`.
- [x] T003 Count the temp folders each suite leaves (`.skilled/skills/system-spec-kit/runtime/vitest.config.ts`). Verify: a snapshot of the OS temp folder before and after each lane. Evidence: the core lane left 11 `hf-local-readiness` and 2 `dist-freshness` folders, the CLI lane 2 `inline-gate-renderer` folders, and each lane 3 `speckit-test-db` folders.

<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation


- [x] T004 Add the install retry wrapper (`.github/scripts/npm-ci-retry.sh`). Verify: `shellcheck .github/scripts/npm-ci-retry.sh` exits 0.
- [x] T005 Add its fixture test (`.github/scripts/tests/npm-ci-retry.test.sh`). Verify: the test prints `passed: 4, failed: 0`.
- [x] T006 Call the wrapper from every install line, run its test in the `check` job and name both files in the two path filters (`.github/workflows/spec-kit-check.yml`). Verify: `grep -c 'npm-ci-retry.sh' .github/workflows/spec-kit-check.yml` prints 22 and `actionlint` exits 0.
- [x] T007 Set the checkpoint deadline 5,000 ms ahead (`.skilled/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts`). Verify: `npx vitest run tests/unit/fanout-run.vitest.ts -t "persisted wait checkpoint"` prints `3 passed`. Evidence: three runs, each 3 passed.
- [x] T008 Write the late payload at the latest allowed exit and cancel it when the hook has exited (`.skilled/skills/system-spec-kit/runtime/hooks/lib/hook-stdin-deadline.test.mjs`). Verify: `node --test hooks/lib/hook-stdin-deadline.test.mjs` prints `pass 56` and `fail 0`.
- [x] T009 Put the hook deadline suite back into the blocking job (`.github/workflows/advisory-checks.yml`). Verify: `grep -c 'test.mjs' .github/workflows/advisory-checks.yml` prints 13.
- [x] T010 Remove the temp repositories the sk-git contract test creates (`.skilled/skills/sk-git/scripts/lib/message-contract.test.mjs`). Verify: `node --test` on the file prints `pass 38` and leaves no `message-contract-` folder.
- [x] T011 Remove the temp folders three spec-kit test files and one deep-loop test file create (`.skilled/skills/system-spec-kit/runtime/tests/embedders/hf-local-client.vitest.ts`, `.skilled/skills/system-spec-kit/runtime/tests/dist-freshness.vitest.ts`, `.skilled/skills/system-spec-kit/runtime/cli/tests/inline-gate-renderer.vitest.ts`, `.skilled/skills/system-deep-loop/runtime/tests/unit/deep-research-authority-composition.vitest.ts`). Verify: each file passes and the prefix counts stay the same.

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification


- [x] T012 Run the hook deadline suite under load (`.skilled/skills/system-spec-kit/runtime/hooks/lib/hook-stdin-deadline.test.mjs`). Verify: six copies started together, twice, exit 0. Evidence: 12 of 12 exit 0, each with 56 passed.
- [x] T013 Count the temp folder prefixes before and after the patched files run (`.skilled/skills/sk-git/scripts/lib/message-contract.test.mjs`). Verify: the two counts match. Evidence: 5,193 before and 5,193 after the sk-git and core files, 404 before and 404 after the CLI file.
- [x] T014 Update the documents that count the blocking suites and cite workflow lines (`.github/workflows/README.md`, `.skilled/skills/sk-code/sk-code-ci/references/job-shape-rules.md`). Verify: `grep -c 'blocks on 13 gate-critical' .github/workflows/README.md` prints 1 and `bash .github/scripts/check-gate-inputs.sh` prints `RESULT: PASSED`.
- [ ] T015 Push the branch and read the checks on the runner (`.github/workflows/advisory-checks.yml`). Verify: `gh pr checks` shows every check passing.

<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
