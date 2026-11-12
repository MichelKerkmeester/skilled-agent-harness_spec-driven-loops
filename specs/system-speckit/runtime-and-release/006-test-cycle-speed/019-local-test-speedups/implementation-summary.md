---
title: "Implementation Summary"
description: "Local spec-kit tests run in 256 s against 667 s and deep-loop tests in 225 s against 497 s, with every test kept."
trigger_phrases:
  - "local test speedups implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/runtime-and-release/006-test-cycle-speed/019-local-test-speedups"
    last_updated_at: "2026-11-12T20:58:03Z"
    last_updated_by: "generate-context"
    recent_action: "Proved the three speed-ups on pull request 100 and closed the phase"
    next_safe_action: "Verify the local timings again after the next test suite change"
    blockers: []
    key_files:
      - "specs/system-speckit/runtime-and-release/006-test-cycle-speed/019-local-test-speedups/spec.md"
      - ".skilled/skills/system-deep-loop/runtime/vitest.config.ts"
      - ".skilled/skills/system-spec-kit/runtime/scripts/run-tests.mjs"
    session_dedup:
      fingerprint: "sha256:c5679567d690369f148bbe7dd53f8307ac4f41bfa9aa3d80aae611fcbe6120fb"
      session_id: "scaffold-019-local-test-speedups"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "af05cd33-c1ff-46c9-825e-70281e3ca6f1"
      workspace: "/Users/michelkerkmeester/worktrees/public/357-test-speed-followups"
      savedAt: "2026-11-12T20:58:03Z"
      locatorKind: "transcript_path"
      version: 1
    completion_pct: 100
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
| **Spec Folder** | 019-local-test-speedups |
| **Completed** | 2026-11-12 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A local `npm test` now takes 256 s for spec-kit and 225 s for deep-loop. It took 667 s and 497 s. No test was removed and no production code changed.

### Phase 19: local-test-speedups

You get the same test results in less than half the time. Three things made the old runs slow, and none of them was the tests' own work.

One spec-kit test file validated the whole OS temp folder while it was imported. That folder held 39,844 leftover entries, so the file's first test started 370 s into the run while every other file had long finished. It now validates an empty folder. The deep-loop tests waited on real fsync calls, which are slow on macOS and which no test can observe, so a setup file now skips them in the test worker and in child processes. The spec-kit runner also started its three lanes one after another, and it now starts them together.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-spec-kit/runtime/tests/validation-exit-honesty.vitest.ts` | Modified | The import-time probe validates a fresh empty folder |
| `.skilled/skills/system-spec-kit/runtime/scripts/run-tests.mjs` | Modified | Starts the three lanes together, each under its own bound |
| `.skilled/skills/system-deep-loop/runtime/tests/_support/skip-fsync-preload.cjs` | Created | Replaces `fsyncSync` and `fdatasyncSync` with no-ops |
| `.skilled/skills/system-deep-loop/runtime/tests/_support/skip-fsync.ts` | Created | Loads the preload in the worker and passes it to child processes |
| `.skilled/skills/system-deep-loop/runtime/vitest.config.ts` | Modified | Registers the setup file |
| `.skilled/skills/system-spec-kit/runtime/README.md`, `runtime/scripts/README.md` and `.skilled/skills/system-deep-loop/runtime/tests/README.md` | Modified | Describe the new runner behaviour and the fsync skip |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Each lane and project was timed once before any change, with the JSON reporter for per-file figures. Each fix was then proven by the suite it speeds up: the runtime lane after the probe fix, both deep-loop projects after the setup file, and three concurrent runs of the spec-kit lanes before the runner changed. The changed `npm test` then ran once for each suite from the final state, and a 3 s bound proved a timed-out lane still exits 124.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Skip fsync in a test setup file, not through a switch in `lib/` | The production code stays untouched, and one config line restores real fsync |
| Pass the preload to child processes through `NODE_OPTIONS` | Tests spawn `node` scripts that do their own durable writes. Patching only the worker would leave those waits in place |
| Apply the skip on CI as well | The operator chose one behaviour everywhere over a local-only difference |
| Change the runner only after three concurrent runs passed | One run cannot show a timing test that fails under load. The advisor trial earlier in this packet was rejected on exactly that |
| Hold each lane's output and print it as one block | Three lanes writing at once would interleave, and a failure would be unreadable |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Spec-kit runtime lane, `npx vitest run` | 164 s against 374 s |
| `validation-exit-honesty.vitest.ts` alone | 6 passed in 5.03 s |
| Spec-kit lanes side by side, three runs | 250, 247 and 256 s, all nine exit codes 0, against 457 s in sequence after the probe fix |
| Spec-kit `npm test` from the final state | Exit 0 in 256 s against 667 s |
| Deep-loop `npm test` from the final state | Exit 0 in 225 s against 497 s. 173 files, 2,885 tests passed, 8 skipped |
| Deep-loop parallel project | 39 s against 240 s, 161 files passed |
| Pull request 100 | 37 checks pass, 0 fail |
| Deep-loop test step on the runner | 354 s with the skip against 306 s and 370 s on two earlier `main` runs: no gain |
| `SPECKIT_TEST_RUN_TIMEOUT_MS=3000 node scripts/run-tests.mjs` | Exit 124 in 3 s, all three lanes terminated |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The fsync skip is a local gain only.** On the Linux runner the deep-loop test step did not get faster, so fsync is not what it waits on there.
2. **Real fsync is not exercised by any deep-loop test.** A defect in the fsync call itself would not surface. Remove the setup line in `vitest.config.ts` to run against real fsync.
3. **One timing test failed once.** `resumes a future checkpoint before dispatching lineages` in `fanout-run.vitest.ts` races an 800 ms deadline against a child starting. It failed in one of five full-file runs with the skip and in none of two without. That is too few runs to assign a cause.
4. **Every figure is one run, except the lane trial.** The spec-kit suite measured 914 s in the morning and 667 s in the afternoon with no change, so treat the before figures as one sample.
5. **The temp folder still fills up.** Tests leave folders behind, led by `speckit-test-db` and `message-contract`. The probe no longer depends on it, and the leak itself is not fixed here.
6. **The spec-kit lane floor is now two files.** `progressive-validation.vitest.ts` sets the runtime lane at about 162 s and `upgrade-legacy-core-b.vitest.ts` sets the CLI lane at about 201 s.
<!-- /ANCHOR:limitations -->

---


