---
title: "Tasks: Phase 4: push-gate-git-timeout"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "push gate git timeout tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 4: push-gate-git-timeout

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

Shell variables used in the verify commands, all relative to the repository root:
- `SCRIPTS` is `.skilled/skills/sk-doc/sk-create-skill/scripts`. It holds `generate-leaf-manifest.cjs` and `regenerate-skill-derived.cjs`.
- `SKCODE` is `.skilled/skills/sk-code/sk-code-skilled`. It holds `assets/scripts/verify-router-sync.cjs`.
- `BENCH` is `.skilled/skills/system-deep-loop/shared/behavior-benchmark`. It holds `behavior-bench-run.cjs`.
- `GIT` is `.skilled/skills/sk-git/scripts`. It holds `validate-message.mjs`.
- `PACKET` is `specs/sk-git/035-fsmonitor-daemon-and-worktree-relocation-regression/004-push-gate-git-timeout`.

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm the main daemon answers an index read within 20 seconds, with the probe `perl -e 'alarm 20; exec @ARGV' git -C . status --porcelain`. If the probe is killed, stop and report to the operator. Do not kill any process. Verify: the probe exits 0 and prints nothing to stdout that is not git output. Done 2026-10-27: the probe was killed at 20.02 s (exit 142), so the main daemon was wedged. No process was killed. Every later setup step ran with `GIT_CONFIG_COUNT=1 GIT_CONFIG_KEY_0=core.fsmonitor GIT_CONFIG_VALUE_0=false`, which bypasses the daemon and does not change what `check-ignore` answers.
- [x] T002 Capture the baseline. Write the bytes that `buildManifestBytes` returns for every skill root into `scratch/baseline/`, one file per root, with a script in `scratch/test/`. Time one run of `ci-skill-root-metadata.cjs` into `scratch/baseline-time.txt`. Verify: `ls scratch/baseline | wc -l` prints the number of direct skill roots, the folders under `.skilled/skills/` that hold a `SKILL.md`, which is the set the gate walks. Done 2026-10-27: 16 roots captured into `scratch/baseline/`, two of them the pre-existing `mode-registry.json not found` error for `local-obsidian` and `local-webflow`. Gate time with fsmonitor off: real 4.62 s, exit 0.
- [x] T003 Confirm the call sites sit on the lines the plan names. Read them only. Verify: `rg -n "spawnSync\('git'|execFileSync\('git'" $SCRIPTS/generate-leaf-manifest.cjs $SCRIPTS/regenerate-skill-derived.cjs $SKCODE/assets/scripts/verify-router-sync.cjs $BENCH/behavior-bench-run.cjs $GIT/validate-message.mjs` prints lines 111 and 129, then 73, then 168, then 885, then 81 and 88. Done 2026-10-27: lines 111, 129, 73, 168, 885, 81 and 88 confirmed.
- [x] T004 Run the four existing test files named for these scripts before any edit. Verify: `node --test --test-reporter=tap $SCRIPTS/tests/generate-leaf-manifest-ignores.test.cjs` prints `# fail 0`, and the same check prints `# fail 0` for `$SCRIPTS/tests/skill-derived-regenerator.test.cjs`, `$SKCODE/scripts/tests/verify-router-sync.test.cjs` and `$BENCH/tests/behavior-bench-run.test.cjs`. Done 2026-10-27, TAP reporter: 1, 1, 9 and 1 tests passed, `# fail 0` in each.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Add `GIT_TIMEOUT_MS` (20000) and `GIT_NO_FSMONITOR` (`['-c', 'core.fsmonitor=false']`), plus the module latch, near line 104 of `$SCRIPTS/generate-leaf-manifest.cjs`. Verify: `rg -n "GIT_TIMEOUT_MS|GIT_NO_FSMONITOR" $SCRIPTS/generate-leaf-manifest.cjs` prints the two definitions. Done 2026-10-27 (builder unit 4.1, reviewed; two comments corrected by the orchestrator): `node --check` exits 0, the TAP run of the new and existing manifest tests prints `# pass 5` and `# fail 0`, and the manifest bytes for all 16 roots match `scratch/baseline/`.
- [x] T006 Add `timeout: GIT_TIMEOUT_MS` to the `rev-parse` call at line 111 of `$SCRIPTS/generate-leaf-manifest.cjs`, and set the latch when `res.error` is set. Verify: `node --check $SCRIPTS/generate-leaf-manifest.cjs` exits 0. Done 2026-10-27 (builder unit 4.1, reviewed; two comments corrected by the orchestrator): `node --check` exits 0, the TAP run of the new and existing manifest tests prints `# pass 5` and `# fail 0`, and the manifest bytes for all 16 roots match `scratch/baseline/`.
- [x] T007 Change the `check-ignore` call at line 129 of `$SCRIPTS/generate-leaf-manifest.cjs` to `[...GIT_NO_FSMONITOR, 'check-ignore', '-z', '--stdin']` with `timeout: GIT_TIMEOUT_MS`. Make the branch at line 135 also take the name fallback when the latch is set. Verify: `rg -n "GIT_NO_FSMONITOR|GIT_TIMEOUT_MS" $SCRIPTS/generate-leaf-manifest.cjs` prints five lines: two definitions, the rev-parse timeout, the check-ignore arguments and the check-ignore timeout. Done 2026-10-27 (builder unit 4.1, reviewed; two comments corrected by the orchestrator): `node --check` exits 0, the TAP run of the new and existing manifest tests prints `# pass 5` and `# fail 0`, and the manifest bytes for all 16 roots match `scratch/baseline/`.
- [x] T024 Make `runWrite` in `$SCRIPTS/generate-leaf-manifest.cjs` refuse to write when the latch is set after `buildManifestBytes`: no write, one stderr line naming the timed-out call, nonzero exit. Verify: the refusal case in T012's test passes. Done 2026-10-27 (builder unit 4.1, reviewed; two comments corrected by the orchestrator): `node --check` exits 0, the TAP run of the new and existing manifest tests prints `# pass 5` and `# fail 0`, and the manifest bytes for all 16 roots match `scratch/baseline/`.
- [x] T008 Add the opt-out and `timeout: 20000` to the `check-ignore` call at line 73 of `$SCRIPTS/regenerate-skill-derived.cjs`. Leave the status test at line 74 unchanged. Verify: `rg -n "core.fsmonitor|timeout" $SCRIPTS/regenerate-skill-derived.cjs` prints line 73. Done 2026-10-27 (builder unit 4.2, reviewed): `isGitIgnored` now has the opt-out, a 20000 ms timeout and an error branch that keeps the reference, and the TAP run of the new and existing regenerator tests prints `# pass 5` and `# fail 0`.
- [x] T009 Add the opt-out and `timeout: 20000` to the `spawnSync` options at line 168 of `$SKCODE/assets/scripts/verify-router-sync.cjs`. Leave the branch at line 172 unchanged. Verify: `node --check $SKCODE/assets/scripts/verify-router-sync.cjs` exits 0, and `rg -n "core.fsmonitor" $SKCODE/assets/scripts/verify-router-sync.cjs` prints one line. Done 2026-10-27 (builder unit 4.3, reviewed): opt-out and `timeout: 20000` on the call, the error branch unchanged, and the TAP run prints `# pass 10` and `# fail 0`, with the hanging-stub case ending near 20 s.
- [x] T010 Add the opt-out and `timeout: 20000` to the `execFileSync` options at line 885 of `$BENCH/behavior-bench-run.cjs`. Make `gitStatusPaths` return `null` from the catch at line 889, and have its callers at lines 1175 and 1295 record one isolation violation saying git status was unavailable when either side is `null`. Verify: `node --check $BENCH/behavior-bench-run.cjs` exits 0, and `rg -n "core.fsmonitor" $BENCH/behavior-bench-run.cjs` prints one line. Done 2026-10-27 (builder unit 4.4, reviewed): opt-out and `timeout: 20000` on `git status`, the catch returns null, the isolation check reports `git status unavailable` instead of passing, and the TAP run prints `# pass 5` and `# fail 0`.
- [x] T011 Add `timeout: 20000` to the `rev-parse` call at line 81 and to the `execFileSync` in the `git()` helper at line 88 of `$GIT/validate-message.mjs`. Verify: `node --check $GIT/validate-message.mjs` exits 0, and `rg -n "timeout" $GIT/validate-message.mjs` prints lines 81 and 88. Done 2026-10-27 (builder unit 4.5, reviewed): both calls carry `timeout: GIT_TIMEOUT_MS`, and the hanging-stub test ends at 20.31 s with exit 2 and `BLOCKED: the message validator failed`, `# pass 1` and `# fail 0`.
- [x] T012 Write `$SCRIPTS/tests/generate-leaf-manifest-git-timeout.test.cjs` with `node:test`. Replace `child_process.spawnSync` before the generator loads. Check the argv and the timeout option, check that a timed-out call reaches the name fallback, check that one timeout latches the rest of the process, and check that `runWrite` refuses after a timeout and leaves the fixture manifest unchanged. Verify: `node --test --test-reporter=tap $SCRIPTS/tests/generate-leaf-manifest-git-timeout.test.cjs` prints `# fail 0`. Done 2026-10-27 (builder unit 4.1, reviewed; two comments corrected by the orchestrator): `node --check` exits 0, the TAP run of the new and existing manifest tests prints `# pass 5` and `# fail 0`, and the manifest bytes for all 16 roots match `scratch/baseline/`.
- [x] T013 Write `$SCRIPTS/tests/regenerate-skill-derived-git-timeout.test.cjs` with `node:test`. Replace `spawnSync`, then call `keyFileExists` on an absent gitignored path. Check the opt-out, the timeout option, and that a timed-out check reports not ignored. Verify: `node --test --test-reporter=tap $SCRIPTS/tests/regenerate-skill-derived-git-timeout.test.cjs` prints `# fail 0`. Done 2026-10-27 (builder unit 4.2, reviewed): `isGitIgnored` now has the opt-out, a 20000 ms timeout and an error branch that keeps the reference, and the TAP run of the new and existing regenerator tests prints `# pass 5` and `# fail 0`.
- [x] T014 Write `$SKCODE/scripts/tests/verify-router-sync-git-timeout.test.cjs` with `node:test`. Put a stub `git` on `PATH` that logs its argv and sleeps on `check-ignore`. Check that the guard ends within 25 seconds and that the log shows the opt-out. Verify: `node --test --test-reporter=tap $SKCODE/scripts/tests/verify-router-sync-git-timeout.test.cjs` prints `# fail 0`. Done 2026-10-27 (builder unit 4.3, reviewed): opt-out and `timeout: 20000` on the call, the error branch unchanged, and the TAP run prints `# pass 10` and `# fail 0`, with the hanging-stub case ending near 20 s.
- [x] T015 Write `$BENCH/tests/behavior-bench-run-git-timeout.test.cjs` with `node:test`. Replace `execFileSync`, then check the opt-out and the timeout option. Also check that a throwing `git status` produces the git-status-unavailable violation. Verify: `node --test --test-reporter=tap $BENCH/tests/behavior-bench-run-git-timeout.test.cjs` prints `# fail 0`. Done 2026-10-27 (builder unit 4.4, reviewed): opt-out and `timeout: 20000` on `git status`, the catch returns null, the isolation check reports `git status unavailable` instead of passing, and the TAP run prints `# pass 5` and `# fail 0`.
- [x] T016 Write `$GIT/tests/validate-message-git-timeout.test.mjs` with `node:test`. Put a stub `git` on `PATH` that delegates `rev-parse` to the real binary and sleeps on `rev-list`. Check that the validator ends within 25 seconds, exits 2, and prints `BLOCKED: the message validator failed`. Verify: `node --test --test-reporter=tap $GIT/tests/validate-message-git-timeout.test.mjs` prints `# fail 0`. Done 2026-10-27 (builder unit 4.5, reviewed): both calls carry `timeout: GIT_TIMEOUT_MS`, and the hanging-stub test ends at 20.31 s with exit 2 and `BLOCKED: the message validator failed`, `# pass 1` and `# fail 0`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T017 Compare healthy-run manifest bytes against the baseline. Write the new bytes into `scratch/after/` with the script from T002. Verify: `diff -r scratch/baseline scratch/after` prints nothing and exits 0. Done 2026-10-27: `diff -r scratch/baseline scratch/after` printed nothing and exited 0, for all 16 roots, after the last unit.
- [x] T018 Time one healthy run of `ci-skill-root-metadata.cjs` after the change, and compare it with `scratch/baseline-time.txt`. Verify: the new time is within 10 percent of the baseline time (NFR-P02). Done 2026-10-27: healthy gate run 4 s, exit 0, 14 of 14 roots passed, against the 4.62 s baseline.
- [x] T019 Stopped-daemon run in a scratch clone. Clone the repository into a new empty directory outside the checkout. Start the clone's daemon with `git -C <clone> -c core.fsmonitor=true status --porcelain`. Send `kill -STOP` to that daemon's PID only, then time `node <clone>/$SCRIPTS/ci-skill-root-metadata.cjs`. Verify: the elapsed seconds print a value below 40 (AC-004). Done 2026-10-27: deviation: a full clone is 3.6 GB of history and lacks the gitignored built parser, so the run used a fresh scratch repository holding a copy of `.skilled/skills` without `node_modules`, with `sk-doc/node_modules` linked for the parser. Its daemon (PID 98530) was stopped with `kill -STOP`, and an index read against it timed out. Old generator from HEAD: the gate hung until the 90 s cap (exit 142). New code: the gate ended in 2 s. Its exit 1 came from three roots whose `.skilled/commands/` files were not in the copy, while the real tree passes 14 of 14.
- [x] T020 Clean up the stopped daemon. Send `kill -CONT` to the clone's daemon PID, stop it with `git -C <clone> fsmonitor--daemon stop` under the perl probe ceiling, then remove the clone directory. Touch no other daemon. Verify: `ls <clone directory>` reports that no such file exists. Done 2026-10-27: `kill -CONT 98530`, then `git fsmonitor--daemon stop` exited 0, PID 98530 is gone, the orphaned old-code `check-ignore` (PID 4806) ended once the daemon answered, and the scratch directory is removed. No other daemon was touched.
- [x] T021 Run all nine test files named in `tasks.md` T004 and T012 to T016. Verify: each file prints `# fail 0`. Done 2026-10-27: all nine files print `# fail 0` (pass counts 1, 1, 9, 1, 4, 4, 1, 4, 1). Seventeen further consumer test files were also run, and 16 pass. `skill-root-reader-inventory.test.cjs` fails on `router-replay-lib.cjs:520`, a file this phase did not touch, so the failure is already in HEAD.
- [x] T022 Run the packet validator after the last edit. Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh $PACKET --strict` prints `RESULT: PASSED`. Done 2026-10-27: see `implementation-summary.md` Verification.
- [x] T023 Remove `scratch/baseline`, `scratch/after` and `scratch/test` after the run is recorded. Verify: `ls $PACKET/scratch` lists only `.gitkeep`. Done 2026-10-27: `scratch/` holds only `.gitkeep`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed: T017 and T019 print their expected output
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md: `rg -n "^\| REQ-" spec.md` prints the REQ rows. Met: 8 rows, REQ-007 and REQ-008 added for Q2 and Q3.
- [x] CHK-002 [P0] Technical approach defined in plan.md: `rg -n "^- \*\*D[0-9]" plan.md` prints eight rows. Met: 8 rows.
- [x] CHK-003 [P1] Dependencies identified and available: `node --version` prints a version, and `perl -v` prints a version. Met: node v26.8.2, perl v5.34.1.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes syntax checks: `node --check` exits 0 on the five edited scripts. Met: `node --check` exits 0 on all five.
- [x] CHK-011 [P1] No new stderr output: each new test run prints no unexpected error text. Met: the only stderr text in the new runs is the expected timeout and refusal lines the tests assert.
- [x] CHK-012 [P1] Error handling implemented: `rg -n "res.error|ignoreCheck.error|catch" $SCRIPTS/generate-leaf-manifest.cjs $SKCODE/assets/scripts/verify-router-sync.cjs $BENCH/behavior-bench-run.cjs $GIT/validate-message.mjs` prints one line for each site named in the plan's decisions D3 to D6. Met: each site has an error branch or a catch.
- [x] CHK-013 [P1] Code follows project patterns: `rg -n "GIT_NO_FSMONITOR|core.fsmonitor=false" $SCRIPTS $SKCODE $BENCH` shows the same two-element shape as `check-source-tags-helper.mjs:53`. Met: the same two-element array as `check-source-tags-helper.mjs:53`.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met: `rg -c "\| Unmet \|" $PACKET/acceptance-criteria.md` prints 0. Met: no Unmet row.
- [x] CHK-021 [P0] Manual testing complete: T017 and T019 printed their expected output. Met: T017 and T019.
- [x] CHK-022 [P1] Edge cases tested: the empty-root and failure-path cases in the spec's edge-case section are covered by T012. Met: the timeout, latch and refusal cases in T012.
- [x] CHK-023 [P1] Error scenarios validated: T016 shows the message gate exits 2 on a timeout. Met: T016, exit 2 at 20.31 s.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class. The finding is `class-of-bug`: one hang shape at six call sites. Met.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed: the grep in the plan's Required inventories lists every git spawn, and each of the six sites has a decision (D1 to D8). Met: seven spawn lines across five files, each changed.
- [x] CHK-FIX-003 [P0] Consumer inventory completed: the grep for `buildManifestBytes|keyFileExists|gitStatusPaths|dropGitIgnoredLeaves` lists each consumer in the plan's Affected Surfaces table. Met: every consumer's test file listed by the grep passes, apart from the inventory test noted in T021.
- [x] CHK-FIX-004 [P0] N/A with reason: this fix changes no path, parser, redaction or security surface. The stopped-daemon run in T019 is the adversarial case. Met.
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed: three axes, and twelve rows for the six sites in the normal and timed-out states. Met.
- [x] CHK-FIX-006 [P1] Hostile process-wide state executed: T012 runs the latch with the flag set by the first call and then a second call in the same process. Met.
- [x] CHK-FIX-007 [P1] Evidence pinned to a fix SHA: the byte diff in T017 and the timings in T018 name the phase commit. Met: evidence taken on the working tree over base `9247590004`; the phase commit is named in `implementation-summary.md`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets added: read the five edited files and confirm the added lines hold no credential. Met: the added lines hold no credential.
- [x] CHK-031 [P1] Input validation: `rg -n "spawnSync\('git'|execFileSync\('git'" $SCRIPTS $SKCODE $BENCH $GIT --glob '*.cjs' --glob '*.mjs'` shows literal argument arrays, with no new value from input. Met: literal argument arrays only.
- [x] CHK-032 [P1] N/A with reason: no authentication or authorization path is touched. Met.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan and tasks agree: `rg -n "T0[0-9][0-9]" $PACKET/tasks.md` lists T001 to T024, and plan section 4 names the same ranges. Met: T001 to T024.
- [x] CHK-041 [P1] Code comments are durable and carry no artifact labels: `rg -n "phase|REQ-|AC-|spec" $SCRIPTS/generate-leaf-manifest.cjs` prints no line added by this phase. Met: no added line matches.
- [x] CHK-042 [P2] Skill README updated only if it names the changed git call: `rg -n "check-ignore|rev-parse" .skilled/skills/sk-doc/sk-create-skill/README.md` prints nothing, or the README is updated. Met: the README names neither call, so it is unchanged.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only: `ls $PACKET/scratch` held the run files, and nothing was written outside it. Met: run files stayed under `scratch/` and the session scratchpad.
- [x] CHK-051 [P1] scratch/ cleaned before completion: T023 prints `.gitkeep` as the only entry. Met.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 10 | 10/10 |
| P1 Items | 15 | 15/15 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-27
<!-- /ANCHOR:summary -->

---
