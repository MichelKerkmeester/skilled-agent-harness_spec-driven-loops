---
title: "Implementation Summary"
description: "A dropped npm download is retried, two tests no longer race process start time, and five test files clean up their temp folders."
trigger_phrases:
  - "test speed followups implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/runtime-and-release/006-test-cycle-speed/020-test-speed-followups"
    last_updated_at: "2026-11-12T21:15:47Z"
    last_updated_by: "generate-context"
    recent_action: "Built and locally proved the three test speed followups"
    next_safe_action: "Verify the pull request checks pass, then close the phase"
    blockers: []
    key_files:
      - ".github/scripts/npm-ci-retry.sh"
      - ".github/workflows/spec-kit-check.yml"
      - ".github/workflows/advisory-checks.yml"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-020-test-speed-followups"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "af05cd33-c1ff-46c9-825e-70281e3ca6f1"
      workspace: "/Users/michelkerkmeester/worktrees/public/357-test-speed-followups"
      savedAt: "2026-11-12T21:15:47Z"
      locatorKind: "transcript_path"
      version: 1
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 020-test-speed-followups |
| **Completed** | Not yet: the pull request checks are still to be read |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Three causes of a red check that a rerun turns green are closed. A dropped npm download is retried, two tests stop racing the start time of a child process, and five test files remove the temp folders they create.

### Phase 20: test-speed-followups

You should see fewer checks fail for reasons that have nothing to do with your change. Every `npm ci` in `spec-kit-check.yml` now runs through a wrapper that repeats a failed install up to three times. One `main` run failed when shard 2 lost a registry connection, and the three shards from phase 18 made that three times as likely as before.

Two tests failed on a busy host because they compared a fixed deadline with the time a child process takes to start. The fan-out resume test now sets its checkpoint 5,000 ms ahead, not 800 ms. The hook deadline test writes its late payload at the latest allowed exit, not 800 ms after the spawn. That suite is back in the blocking `gate-critical` job, which runs 13 suites again.

Five test files left 36 temp folders behind on every full run of the three suites. They now remove what they create. The folders already on the machine are not touched.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.github/scripts/npm-ci-retry.sh` | Created | Repeats a failed `npm ci` up to three times with a 10 s pause |
| `.github/scripts/tests/npm-ci-retry.test.sh` | Created | Four cases against a stand-in npm |
| `.github/workflows/spec-kit-check.yml` | Modified | 17 install lines call the wrapper, the `check` job runs its test, both path filters name the two files |
| `.github/workflows/advisory-checks.yml` | Modified | `hook-stdin-deadline.test.mjs` is in the blocking job again |
| `.github/workflows/README.md` and `.skilled/skills/sk-code/sk-code-ci/references/job-shape-rules.md` | Modified | The suite count, the retry and four cited line numbers |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts` | Modified | The checkpoint deadline lies 5,000 ms ahead |
| `.skilled/skills/system-spec-kit/runtime/hooks/lib/hook-stdin-deadline.test.mjs` | Modified | The late write waits for the latest allowed exit and is cancelled when the hook has exited |
| `.skilled/skills/sk-git/scripts/lib/message-contract.test.mjs` | Modified | Removes its 17 temp repositories |
| `hf-local-client.vitest.ts`, `dist-freshness.vitest.ts` and `inline-gate-renderer.vitest.ts` in the spec-kit runtime | Modified | Remove their temp folders |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/deep-research-authority-composition.vitest.ts` | Modified | Removes its temp folders |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The cause of each failure was read before any change: the failed run's log, the runner's checkpoint code and a count of the temp folder before and after each lane. The wrapper was then run against a stand-in npm, the hook suite six copies at a time, the fan-out tests three times, and the patched files with a folder count on both sides. `actionlint`, `shellcheck` and the gate-input check ran on the final workflow files.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Retry at the step, not through npm's own retry settings | The failed run ended in `ECONNRESET` after npm's built-in request retries, so raising them is not known to help |
| Retry only in `spec-kit-check.yml` | It is the one workflow that failed this way, and it runs six installs side by side |
| A 5,000 ms checkpoint deadline | The runner treats a passed deadline as expired, so the deadline has to outlast a slow process start. It adds about 4 s to one test |
| Write the late payload at the 2,500 ms exit bound | The hook's deadline runs from when it starts reading. Any earlier write can still arrive in time on a slow start, and a hook still reading at 2,500 ms fails the exit bound anyway |
| Leave the protected `gate-inputs.yml` alone | The wrapper's test runs in the `check` job of the workflow that uses it, so no protected workflow changed |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `bash .github/scripts/tests/npm-ci-retry.test.sh` | `passed: 4, failed: 0`, exit 0 |
| `shellcheck` on the wrapper and its test | Exit 0 for both |
| `actionlint` on `spec-kit-check.yml` and `advisory-checks.yml` | Exit 0 for both |
| `bash .github/scripts/check-gate-inputs.sh` | `failures=0`, `RESULT: PASSED` |
| `hook-stdin-deadline.test.mjs`, six copies started together, twice | 12 of 12 exit 0, each 56 passed and 0 failed |
| `fanout-run.vitest.ts -t "persisted wait checkpoint"`, three runs | 3 passed each time |
| `message-contract.test.mjs` | 38 passed, 0 failed |
| `dist-freshness.vitest.ts` and `hf-local-client.vitest.ts` | 2 files, 38 tests passed |
| `inline-gate-renderer` in the CLI project | 2 files, 26 tests passed |
| Temp folder prefixes of the patched files | 5,193 before and 5,193 after the sk-git and core files. 404 before and 404 after the CLI file. 579 before and 579 after the deep-loop file |
| Deep-loop `npm test` from the final state of the fan-out change | Exit 0 in 224 s. 173 files, 2,885 tests passed, 8 skipped |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The retry was not seen recovering a real dropped connection.** It was proven against a stand-in npm. A real `ECONNRESET` on the runner cannot be produced on demand.
2. **Each spec-kit lane still leaves three `speckit-test-db` folders.** The setup file removes its folder in `afterAll`, so three test files skip that hook in a way this phase did not trace.
3. **Other suites still leak.** The session-relaunch tests left 190 `session-relaunch-wrapper` folders in one run. Those tests belong to another session's work.
4. **The existing 41,171 temp entries stay.** Removing them is a deletion on the operator's machine and was not done.
5. **One deep-loop run exited 1 and was not explained.** It ran with no log while the fan-out test was being edited and the hook suite ran six copies at a time in the same worktree. The rerun from the final state exited 0.
6. **The late payload now rarely reaches a live hook.** By 2,500 ms the hook has exited, so that test mostly proves the exit bound. The first test in the file proves the deadline itself.
<!-- /ANCHOR:limitations -->

---
