---
title: "Tasks: Close eight known gaps in the session relaunch loop"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "known gap fixes tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.3 -->
# Tasks: Close eight known gaps in the session relaunch loop

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

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

`R` is `.skilled/hooks/session-relaunch`. `N` is `node --test $R/tests/*.test.cjs .opencode/plugins/tests/session-relaunch.test.cjs`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Record the baseline pass counts before any edit (`scratch/`). Verify: `scratch/baseline-node.txt` 928 pass, the Pi vitest 59 passed, `hook-flags.test.cjs` 27 pass, each exit 0. Evidence: `scratch/baseline-node.txt` 928 pass exit 0, `scratch/baseline-vitest.txt` 59 passed exit 0, `scratch/baseline-hookflags.txt` 27 pass exit 0, `scratch/baseline-shell.txt` bash-n 0 and shellcheck 0
- [x] T002 [P] Write a failing G1 test with a note path that holds the spec-folder marker (`$R/tests/`). Verify: the nudge's note path and spec folder differ from `parseClaimSeed` and the test exits 1. Evidence: `scratch/gap1-red.txt`, `nudge.test.cjs:747` failed (nudge read `/tmp/odd`), exit 1
- [x] T003 [P] Write failing G2 rows for a Pi hop launched with `--provider X` and with `X/model`, each with a different recorded provider (`$R/tests/skilled-loop-shell.test.cjs`). Verify: both rows keep the effort and the test exits 1. Evidence: `scratch/gap2-red.txt`, `skilled-loop.test.cjs:1529` kept `--thinking low`, exit 1; the rows live in `skilled-loop.test.cjs`
- [x] T004 [P] Write failing G3 tests for `prepare` with the concern off, inside and outside the loop (`$R/tests/session-relaunch-cli.test.cjs`). Verify: the outside-loop case prints a manual claim and the test exits 1. Evidence: `scratch/gap3-red.txt`, `session-relaunch-cli.test.cjs:437` failed outside the loop with exit 3, exit 1
- [x] T005 [P] Write a failing G5 test that every validator git call carries `-c core.fsmonitor=false` (validator test suite under `.skilled/skills/system-spec-kit/runtime/`). Verify: the test names at least one call without it and exits 1. Evidence: `.skilled/skills/system-spec-kit/runtime/cli/tests/validator-git-fsmonitor.vitest.ts:147`, `scratch/ac005-red.txt` 1 failed 1 passed, exit 1, naming `continuity-freshness.ts:312` and `:329`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T006 Make `specFolderFromSeed` and `notePathFromSeed` use `core.parseClaimSeed` (`$R/lib/nudge.cjs`). Verify: the T002 test passes. Evidence: `scratch/gap1-green.txt` 71 pass 0 fail, exit 0
- [x] T007 Compare the launch provider with the recorded provider in `live_model_voids_launch_effort` (`.skilled/bin/skilled-loop`). Verify: the T003 rows pass and the Hermes and empty-launch-model rows still pass. Evidence: `scratch/gap2-green.txt` 179 pass 0 fail, exit 0, the Hermes rows included
- [x] T008 Move the concern check in `prepare` before the outside-loop branch, with one refusal in and out of the loop (`$R/bin/session-relaunch.cjs`). Verify: the T004 tests pass. Evidence: `scratch/gap3-green.txt` 151 pass 0 fail, exit 0. T024 and T025 amend the message to name the deciding switch
- [x] T009 [P] Correct the Codex goal paragraph (`$R/README.md`). Verify: `rg -n "no Codex receiver is ever handed a packet" $R/README.md` prints nothing. Evidence: the `rg` exits 1 with no output at closeout; `scratch/doc-validate.txt` README VALID, 0 issues
- [x] T010 [P] Add `-c core.fsmonitor=false` to every validator git call (`.skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh` and the scripts it runs). Verify: the T005 test passes. Evidence: `cli/validation/continuity-freshness.ts:317` and `:334` spread `GIT_NO_FSMONITOR`, cli dist rebuilt (`npm run build` exit 0); `scratch/ac005-green.txt` 2 passed, exit 0
- [x] T011 Add binding rows for every child that holds a `goal.md` (`specs/hooks/023-session-relaunch-loop/goal.md`). Verify: `goal.cjs packet specs/hooks/023-session-relaunch-loop` prints `packet_budget=ok`. Evidence: rows 033, 034 and 035 added; `packet_durable_chars=3997`, `packet_budget=ok` after cutting decision and criterion prose
- [x] T012 Write the failing G7 precedence table across the four readers (`.skilled/hooks/shared/hook-flags.test.cjs`). Verify: the per-runtime rows fail and the test exits 1. Evidence: `scratch/g7-red.txt`, `hook-flags.test.cjs:497` 27 pass 1 fail, exit 1
- [x] T013 Add the per-runtime answer to the resolver (`.skilled/hooks/shared/hook-flags.cjs`, `.mjs`, `.ts`, `.sh`). Verify: the T012 table passes in all four readers. Evidence: `scratch/g7-green.txt` 28 pass 0 fail; `scratch/closeout-resolver-probe.txt` 0 reader mismatches across seven runtimes, exit 0
- [x] T014 Write a failing test that one adapter stays silent with its runtime off and the global flag on (`$R/tests/claude-adapters.test.cjs`). Verify: the adapter acts and the test exits 1. Evidence: `scratch/g7-red.txt`, `claude-adapters.test.cjs:373` emitted the nudge, exit 1
- [x] T015 Pass the runtime from every session-relaunch caller (`$R/claude/`, `$R/codex/`, `$R/hermes/`, `$R/bin/session-relaunch.cjs`, `.opencode/plugins/session-relaunch.js`, `$R/pi/session-relaunch.ts`). Verify: the T014 test passes and `rg -n "isHookEnabled\(CONCERN" $R .opencode/plugins/session-relaunch.js -g '!**/tests/**'` shows a runtime on every line. Evidence: `scratch/g7-green.txt` adapter test exit 0; the closeout `rg` shows a runtime on all 12 callers
- [x] T016 Fold the two Endless Sessions sections into one short section and repoint its anchors (`README.md`). Verify: `rg -n "Endless Sessions" README.md` prints the one section and no broken anchor. Evidence: `rg -n "Endless Sessions" README.md` prints nothing at closeout; the one section is `#### In-Session Handover` and every old anchor link now points at `#in-session-handover`; `scratch/g8-doc-validate.txt` README VALID
- [x] T017 [P] Document the per-runtime flags (`.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md`, `.env.example`, `.skilled/hooks/hook-flags.env.example`, `.skilled/commands/doctor/assets/doctor-env.yaml`). Verify: `rg -c "SYSTEM_SESSION_RELAUNCH_CLAUDE_ENABLED"` prints at least 1 in each file. Evidence: closeout `rg -c` gives ENV-REFERENCE.md 2, `.env.example` 2, `hook-flags.env.example` 1, `doctor-env.yaml` 1; ENV-REFERENCE count recounted to 188/192; `scratch/g8-doc-validate.txt` and `scratch/closeout-envdrift.txt` 5 of 5
- [x] T018 [P] Document the per-runtime rule in the hook READMEs and playbooks (`$R/README.md`, `.skilled/hooks/shared/README.md`, `.skilled/hooks/README.md`, `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-*.md`). Verify: `rg -c "SYSTEM_SESSION_RELAUNCH_<RUNTIME>_ENABLED|SYSTEM_SESSION_RELAUNCH_CLAUDE_ENABLED"` prints at least 1 in each file. Evidence: closeout `rg -c` gives session-relaunch README 4, shared README 2, hooks README 3, each playbook 1; `scratch/g8-doc-validate.txt` each VALID
- [x] T024 Write failing tests that the `prepare` refusal names the deciding switch and that a refused `prepare` leaves the note's bytes unchanged (`$R/tests/session-relaunch-cli.test.cjs:475` and `:2461`). Verify: both fail and the run exits 1. Evidence: `scratch/review-fix-prepare-red.txt` 0 pass 2 fail, exit 1 (generic message under a kill switch, note rewritten)
- [x] T025 Check the runtime's concern before reading or editing the note and name the deciding switch, exit 2 (`$R/bin/session-relaunch.cjs`). Verify: the T024 tests pass. Evidence: `scratch/review-fix-prepare-green.txt` 2 pass 0 fail, exit 0
- [x] T026 Add failing rows for a spaced runtime name and `MK_HOOKS_DISABLED` in the environment and the file (`.skilled/hooks/shared/hook-flags.test.cjs:516` to `:518`). Verify: the shell reader disagrees and the test exits 1. Evidence: `scratch/review-fix-sh-red.txt` 27 pass 1 fail, exit 1
- [x] T027 Trim the runtime and honour every master alias in the shell reader (`.skilled/hooks/shared/hook-flags.sh`). Verify: the T026 rows pass and the wrapper lint stays 0. Evidence: `scratch/review-fix-sh-green.txt` 28 pass 0 fail, exit 0, spaced probe on under `/bin/bash` 3.2, `bash -n` and `shellcheck` 0
- [x] T028 Widen the shell git-call matcher to control keywords and `VAR=value` prefixes (`.skilled/skills/system-spec-kit/runtime/cli/tests/validator-git-fsmonitor.vitest.ts:129` to `:131`). Verify: a probe of seven wanted and six unwanted lines gives wrong=0 and the vitest passes. Evidence: `scratch/review-fix-matcher-red.txt` wrong=6, probe exit 1; `scratch/review-fix-matcher-green.txt` wrong=0, probe exit 0, vitest 2 passed, exit 0
- [x] T029 Make every relaunch test sandbox strip the relaunch, per-runtime and kill flags it inherits (`$R/tests/*.test.cjs`, `.opencode/plugins/tests/session-relaunch.test.cjs`). Verify: `N` exits 0 with `SYSTEM_SESSION_RELAUNCH_CLAUDE_ENABLED=0` exported. Evidence: red in `scratch/final-gate-claude0-node.txt` (836 pass 98 fail, exit 1); the shared helper `$R/tests/fixtures/relaunch-env.cjs` derives every name from `.skilled/hooks/shared/hook-flags.cjs` (the per-runtime flags, the global flag, the kill switch and its aliases, the master switch and its aliases, the goal kill switch and its aliases) and drops them plus `HOOK_FLAGS_CONFIG`; every relaunch sandbox, the OpenCode plugin test and the Pi vitest (`$R/pi/session-relaunch.test.ts:62`) strip first. Green: `scratch/hermetic-green-claude0.txt` 934 pass 0 fail, EXIT=0. Doc: `$R/tests/README.md:20` and the fixture row at `:76`
- [x] T030 [P] State the Pi provider rule and the no-provider limit (`$R/README.md:43`). Verify: `validate_document.py` exits 0. Evidence: `scratch/amend-doc-validate.txt` VALID, 0 issues, exit 0
- [x] T031 [P] Compare strict `tsc` errors on `hook-flags.ts` between the HEAD copy and the working tree (`scratch/`). Verify: the working tree has no error the HEAD copy lacks. Evidence: `scratch/tsc-hookflags.txt` 53 errors against 54, the one diff line a HEAD-only error
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T019 Run the relaunch node suites (`scratch/`). Verify: `N` prints 0 fail with a pass count at or above 928, exit 0. Evidence: `scratch/closeout-node.txt` 932 pass 0 fail; the final gate `scratch/final-green-clean.txt` 934 pass 0 fail, exit 0
- [x] T020 Run the Pi vitest (`scratch/`). Verify: `npx vitest run --config .skilled/hooks/vitest.config.ts $R/pi/session-relaunch.test.ts` prints at least 59 passed, exit 0. Evidence: `scratch/closeout-vitest.txt` 59 passed; `scratch/final-green-clean.txt` pi-vitest 59 passed, exit 0
- [x] T021 Run the hook-flags tests (`scratch/`). Verify: `node --test .skilled/hooks/shared/hook-flags.test.cjs` prints 0 fail with at least 27 pass, exit 0. Evidence: `scratch/closeout-hookflags.txt` 28 pass 0 fail; `scratch/final-green-clean.txt` hookflags 28 pass 0 fail, exit 0
- [x] T022 Lint the wrapper (`.skilled/bin/skilled-loop`). Verify: `bash -n` and `shellcheck` both exit 0. Evidence: `scratch/closeout-shell.txt` bashn-loop 0, bashn-flags 0, shellcheck 0; `scratch/final-green-clean.txt` the same, exit 0 each
- [x] T023 Run the validator's own tests and strict validation (`scratch/`). Verify: the suite exits 0 and `validate.sh <this packet> --strict` prints `RESULT: PASSED`. Evidence: `scratch/closeout-cite-drift-test.txt` 67 pass exit 0, `scratch/closeout-envdrift.txt` 5 of 5, `scratch/closeout-validate.txt` strict RESULT: PASSED
- [x] T032 Run the full gate from the amended tree with no relaunch or master switch exported (`scratch/`). Verify: each leg exits 0. Evidence: first run `scratch/final-gate-clean.txt`; final run `scratch/final-green-clean.txt` node 934 pass 0 fail, hook-flags 28, Pi vitest 59, validator vitests 13 passed 1 skipped, env drift 5 of 5, `bash -n` and `shellcheck` 0, each exit 0
- [x] T033 Rerun the full gate with `SYSTEM_SESSION_RELAUNCH_CLAUDE_ENABLED=0` exported, and again from a clean environment after T029 (`scratch/`). Verify: each leg exits 0. Evidence: red `scratch/final-gate-claude0.txt` node exit 1 (836 pass 98 fail); green `scratch/hermetic-green-clean.txt` and `scratch/hermetic-green-claude0.txt` 934 pass 0 fail, EXIT=0 each, then the full gate `scratch/final-green-clean.txt` and `scratch/final-green-claude0.txt`: node 934, hook-flags 28, Pi vitest 59, validator vitests 13 passed 1 skipped, env drift 5 of 5, `bash -n` and `shellcheck` 0, every leg exit 0
- [x] T034 Run the full gate with all seven per-runtime flags `0` plus `SYSTEM_SESSION_RELAUNCH_DISABLED=1` and `SYSTEM_HOOKS_DISABLED=1` exported (`scratch/`). Verify: each leg exits 0. Evidence: red `scratch/final-tree-hostile.txt` with the goal kill switches also exported (node 930 pass 4 fail, the four `skilled-loop` goal-hop tests; Pi vitest 38 failed 21 passed; both exit 1); green `scratch/hermetic-green-hostile.txt` 934 pass, EXIT=0, `scratch/hermetic-green-hostile-hookflags.txt` 28 pass, exit 0, `scratch/hostile-pi-vitest-green.txt` 59 passed, `scratch/hostile-goalhops-green.txt` 187 pass 0 fail, and the full gate `scratch/final-green-hostile.txt` (which also exports `MK_HOOKS_DISABLED=1`, `MK_GOAL_DISABLED=1` and `OPENCODE_GOAL_DISABLED=1`, lines 2 to 13): node 934, hook-flags 28, Pi vitest 59, validator vitests 13 passed 1 skipped, env drift 5 of 5, `bash -n` and `shellcheck` 0, every leg exit 0
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Every row in `acceptance-criteria.md` is Met
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
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

- [x] CHK-001 [P0] Requirements documented in spec.md. Evidence: spec.md section 4
- [x] CHK-002 [P0] Technical approach defined in plan.md. Evidence: plan.md sections 3 and 5
- [x] CHK-003 [P1] Dependencies identified and available. Evidence: plan.md section 6
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `node --check` on every changed `.cjs` and `.mjs` file and `bash -n` plus `shellcheck` on `skilled-loop` exit 0. Evidence: closeout `node --check` on every changed `.cjs`, `.mjs` and the OpenCode plugin printed nothing; `scratch/closeout-shell.txt` 0
- [x] CHK-011 [P0] No console errors or warnings in the closeout runs. Evidence: `scratch/closeout-node.txt`, `-vitest.txt`, `-hookflags.txt` show 0 fail, as do the final gate per-suite logs `scratch/final-green-<variant>-*.txt`
- [x] CHK-012 [P1] A missing or unreadable config file leaves the concern off for every runtime. Evidence: `hook-flags.test.cjs` row `nothing set` gives off for every runtime; the missing-file test stays green in `scratch/closeout-hookflags.txt`
- [x] CHK-013 [P1] The four readers share one per-runtime rule and one truthy set. Evidence: `scratch/closeout-resolver-probe.txt` 0 reader mismatches; `hook-flags.test.cjs:497` runs one table through four readers, and the spaced-runtime and `MK_HOOKS_DISABLED` rows agree in all four (`scratch/review-fix-sh-green.txt`)
- [x] CHK-014 [P1] `hook-flags.ts` gains no new type errors. Evidence: `scratch/tsc-hookflags.txt` working tree 53 against HEAD 54, no error the HEAD copy lacks
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met. Evidence: AC-001 to AC-019 Met in `acceptance-criteria.md`; AC-017 from `scratch/hermetic-green-clean.txt`, `-claude0.txt` and `-hostile.txt` (934 pass, EXIT=0 each) and the final gate `scratch/final-green-clean.txt`, `-claude0.txt` and `-hostile.txt` (every leg exit 0)
- [x] CHK-021 [P0] Each new test failed before its fix and passes after it. Evidence: the G1, G2, G3 and G7 red and green files above, the G5 test `.skilled/skills/system-spec-kit/runtime/cli/tests/validator-git-fsmonitor.vitest.ts:147` red in `scratch/ac005-red.txt` (exit 1) and green in `scratch/ac005-green.txt` (exit 0), and the review fixes red and green in `scratch/review-fix-prepare-*.txt`, `scratch/review-fix-sh-*.txt` and `scratch/review-fix-matcher-*.txt`
- [x] CHK-022 [P1] Edge cases tested: empty per-runtime value, env falsy over file truthy, a marker twice in a note path. Evidence: empty per-runtime row in `hook-flags.test.cjs:513`, env against file in `scratch/closeout-resolver-probe.txt`, two markers in the `nudge.test.cjs:747` seed
- [x] CHK-023 [P1] No existing assertion weakened. Evidence: the only test diff outside new tests is the cite-drift git shim, which parses past `-c` and `-C`; no assertion removed
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each gap has a finding class: G1 `class-of-bug`, G2 `instance-only`, G3 `instance-only`, G5 `class-of-bug`, G7 `cross-consumer`.. Evidence: classes recorded in this row
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed: claim-seed parsers, validator git calls and the four resolver readers.. Evidence: the G5 test traces the validator git-call inventory from code (92 files reached from `validate.sh`); its only misses were `continuity-freshness.ts:312` and `:329`, now fixed
- [x] CHK-FIX-003 [P0] Consumer inventory completed for every `isHookEnabled` session-relaunch caller.. Evidence: closeout `rg` of `isHookEnabled(` shows 12 callers, each naming its runtime; the pre-commit review checked 13 call sites and found each passing its runtime, seed parsing unchanged for real seeds and the provider check sound under bash 3.2
- [x] CHK-FIX-004 [P0] The parser fix has table tests for a marker inside the note path, a marker twice and no marker.. Evidence: `nudge.test.cjs:747` (marker in the note path, so two in the seed) and the seed table before it (no marker)
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed.. Evidence: axes in plan.md; the table has seven rows by five answers by four readers, and the probe five rows by seven runtimes by three readers
- [x] CHK-FIX-006 [P1] Hostile env variant run: a stray per-runtime flag in the shell does not leak into the resolver tests.. Evidence: `hook-flags.test.cjs:522` strips every `SYSTEM_SESSION_RELAUNCH_` name, the master switch and `MK_HOOKS_DISABLED` from the shell env before the probe; `scratch/final-green-hostile.txt` shows hook-flags 28 pass and node 934 pass, each exit 0, with every relaunch, master and goal kill switch exported (T029, T034)
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range.. Evidence: fix commit `6541f9284e` on origin/main (`git show --stat 6541f9284e`, 170 files); the gate evidence in `scratch/final-green-*.txt` ran on the tree that commit holds
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets. Evidence: no secret in the diff
- [x] CHK-031 [P0] Per-runtime values go through the same `resolve` and truthy rules as the kill switches. Evidence: per-runtime values read through the same resolve and truthy rules, `hook-flags.test.cjs:497`
- [x] CHK-032 [P1] No new file read outside `hook-flags.env`. Evidence: only `hook-flags.env` is read
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized. Evidence: status Complete in spec.md, tasks.md, acceptance-criteria.md and implementation-summary.md, and each names the 2026-10-25 scope amendment (REQ-015 to REQ-019)
- [x] CHK-041 [P1] No code comment names a spec, phase or task id. Evidence: closeout grep of added lines for spec, phase and task ids found none
- [x] CHK-042 [P1] Every doc surface in scope names the per-runtime flags. Evidence: AC-013 grep
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only. Evidence: evidence in scratch/ only
- [x] CHK-051 [P1] scratch/ cleaned before completion, or kept where an AC row cites it. Evidence: scratch/ kept, every file cited by an AC row or task
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 15 | 15/15 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-10-25
<!-- /ANCHOR:summary -->

---
