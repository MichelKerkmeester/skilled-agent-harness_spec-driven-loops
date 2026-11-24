---
title: "Tasks: Phase 5: request-pipeline"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "request pipeline tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 5: request-pipeline

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation
<!-- FILL: Keep the prefix table and add the two shell variables this task list uses. GOOD: `R` is `scripts/rotate-logs.sh`. `A` is `logs/archive/`. WEAK: Variables are defined below. -->

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

`L` is `.skilled/skills/system-skilled-bots/runtime/lib/`. `Q` is `<state root>/<repository identity>/requests/` for the test fixture's temp state root.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
<!-- FILL: Replace the sample tasks with the real setup steps. Each task names a file and a verify command. GOOD: T001 Confirm `logs/archive/` holds 10 archives. Verify: `ls logs/archive | wc -l` prints 10. WEAK: T001 Set up the project. -->

- [x] T001 Read the phase 1 state-root layout and the `gitHookTrigger` key (`../001-contracts-and-state-root/spec.md`, ADR-009). Verify: `rg -n 'Request queue|gitHookTrigger' ../001-contracts-and-state-root/spec.md` prints the queue layout row and the Config keys row. Done: phase 1 spec.md lines 177 and 354 print the `gitHookTrigger` reader and the request queue layout row.
- [x] T002 Read the phase 3 runner entry and its outcome classes (`../003-manual-runner/spec.md`). Verify: `rg -n 'outcome|refus' ../003-manual-runner/spec.md` names the refusal classes drain maps to quarantine. Done: runner.ts `REFUSAL_CAUSES` names `definition-malformed`, `disabled`, `paused`, `precheck-failed` and `awaiting-decision-hold`. Drain maps each.
- [x] T003 Record the baseline of the three hook tests before any edit (`.skilled/scripts/git-hooks/tests/source-root-selection.test.sh`). Verify: it, `autostash-orphan-guard.test.sh` and `gate-config.test.sh` each exit 0, and the three exit codes are written in `implementation-summary.md`. Done: 74, 14 and 25 passed, exit 0 each (`scratch/hook-baseline-*.txt`).
- [x] T004 List every file that names the hook (`.skilled/scripts/git-hooks/post-commit`). Verify: `rg -ln 'post-commit' .skilled/scripts .skilled/skills/sk-git` matches the Affected Surfaces table in `plan.md`. Done: 15 files, matching the Affected Surfaces table.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
<!-- FILL: Write one implementation task per file change. Add a `Verify:` line with the command and its expected output. GOOD: T002 Add the `--keep <n>` branch. Verify: `--keep 3` leaves 3 archives. WEAK: T002 Implement the feature. -->

- [x] T005 Build and validate the §9 request record and derive the key from source plus source event id, with a caller key winning (`L/request-record.ts`). Verify: vitest on its unit test exits 0, and two records with one source event and different prompts share one key. Done: `request-record.vitest.ts` passes. One event with two prompts shares one key and one id.
- [x] T006 Create the folder layout and the temp-and-rename enqueue with the exclusive seen-key marker (`L/request-queue.ts`). Verify: the unit test exits 0, and `stat -f %d` prints one device id for every folder under `Q`. Done: `request-queue.vitest.ts` passes. Every queue folder shares one device id.
- [x] T007 Add the claim rename, the retry move with `attempts` raised and the quarantine move with a reason file (`L/request-queue.ts`). Verify: the unit test exits 0, and a claimed file exists in exactly one folder after each move. Done: `request-queue.vitest.ts` checks the file is in exactly one folder after each move.
- [x] T008 Add the drain loop that claims, calls the runner and routes `ran`, `retry` and `quarantined: <reason>` (`L/request-drain.ts`). Verify: with a stub runner, `bots drain` prints one line per request and `ls -A Q/inbox` prints nothing. Done: `quarantine.vitest.ts` and `retry.vitest.ts`. `inbox/` is empty after each pass.
- [x] T009 Add the `enqueue` and `drain` verbs to the phase 3 CLI entry (`.skilled/bin/bots.cjs`). Verify: `node .skilled/bin/bots.cjs enqueue --help` and `node .skilled/bin/bots.cjs drain --help` exit 0, and a misspelled option exits non-zero. Done: `enqueue --help` and `drain --help` exit 0, a misspelled option exits 2.
- [x] T018 Add kind `resume` to the record, with source `answer` and the needs-you item id as the key, and refuse enqueue while identity is unknown (`L/request-record.ts`, `L/request-queue.ts`). Verify: the unit test exits 0, a `resume` record keys on its item id and an enqueue with unknown identity exits non-zero. Done: `resume.vitest.ts` and `identity-refusal.vitest.ts` pass.
- [x] T021 Add `bots answer <item-id> "<text>"`: exit 2 with no text, refuse an unknown item, an expired item and a different answer to an answered item, run phase 3's body-secret predicate over the answer, record the answer through phase 1's item helpers, enqueue one `resume` request keyed by the item id, write its id into `resumeRequestId`, then rewrite phase 3's generation stamp (`L/answer.ts`, `.skilled/bin/bots.cjs`). Verify: the unit test exits 0, and a stub enqueue records that the item already reads `answered` when it is called. Done: `answer.vitest.ts` proves the item reads `answered` when the stub enqueue is called.
- [x] T023 Map the runner refusal `awaiting-decision-hold` to quarantine with reason `held-needs-you`, never replayed (`L/request-drain.ts`). Verify: with a stub runner that returns the hold refusal, `bots drain` prints `quarantined: held-needs-you` and `ls -A Q/inbox` prints nothing. Done: the real runner's hold refusal lands in quarantine as `held-needs-you` (`quarantine.vitest.ts`).
- [x] T024 Give the runner a `queued` request kind carrying the request id, source, fired slot and prompt, write them in the run's one record, append the request prompt after the bot prompt under a separator and run the body-secret predicate over it, and drop the drain's record rewrite and stamp advance (`.skilled/skills/system-skilled-bots/runtime/lib/runner.ts`, `L/request-drain.ts`). Verify: the drained run's record is unchanged after the drain returns. Done: `queued-run.vitest.ts` passes, typecheck exit 0.
- [x] T010 Add the opt-in enqueue leg between the end of the `SPECKIT_AUTOSYNC` branch and `exit 0`, calling the CLI only by a `$SOURCE_ROOT` path (`.skilled/scripts/git-hooks/post-commit`). Verify: `bash -n .skilled/scripts/git-hooks/post-commit` exits 0, and the leg's last command ends in `|| true`. Done: `bash -n` exits 0 and the leg ends in `} || true`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
<!-- FILL: Write one verification task per requirement. Each one runs a command. GOOD: T003 Run both invocations. Verify: `ls logs/archive | wc -l` prints 3 and 10. WEAK: T003 Test everything. -->

- [x] T011 Race two drains against one request (`.skilled/skills/system-skilled-bots/runtime/tests/race.vitest.ts`). Verify: across 50 rounds, each round leaves exactly one run record that joins the request id. Done: 50 rounds, one joined record each, lost claim in 49 of 50 rounds (`scratch/race-run.txt`).
- [x] T012 Enqueue one source event twice with a changed prompt (`.skilled/skills/system-skilled-bots/runtime/tests/dedupe.vitest.ts`). Verify: the second enqueue prints `duplicate`, and one run record exists after drain. Done: `dedupe.vitest.ts` passes.
- [x] T013 Drain a malformed definition, a failing precheck, a disabled bot and a paused bot (`.skilled/skills/system-skilled-bots/runtime/tests/quarantine.vitest.ts`). Verify: `ls -A Q/inbox` prints nothing and `Q/quarantine` holds four reason files with four different reasons, one of them `paused` (ADR-004). Done: five reasons, `inbox/` empty (`quarantine.vitest.ts`).
- [x] T014 Drain a request whose run always fails (`.skilled/skills/system-skilled-bots/runtime/tests/retry.vitest.ts`). Verify: the runner stub is called exactly the ADR-002 bound times, then the request is in `Q/quarantine` with reason `retry-bound`. Done: the stub runner is called exactly 3 times, then `retry-bound`.
- [x] T015 Run the hook matrix from `plan.md` Affected Surfaces (`.skilled/skills/system-skilled-bots/runtime/tests/post-commit-leg.test.sh`). Verify: every row's commit exits 0, only the trusted, opted-in, non-run row with `node` adds a file to `Q/inbox`, the untrusted row with a `bots` shim on `PATH` adds none and no row starts an agent. Done: 27 passed, 0 failed (`scratch/post-commit-leg.txt`).
- [x] T016 Rerun the three existing hook tests after the edit (`.skilled/scripts/git-hooks/tests/source-root-selection.test.sh`). Verify: it, `autostash-orphan-guard.test.sh` and `gate-config.test.sh` exit 0, the same as the T003 baseline. Done: 74, 14 and 25 passed, exit 0 each, the same as T003 (`scratch/hook-after-*.txt`).
- [x] T019 Enqueue two `resume` requests for one needs-you item, then drain (`.skilled/skills/system-skilled-bots/runtime/tests/resume.vitest.ts`). Verify: the second enqueue prints `duplicate`, one run record exists and a failing `resume` run is retried and quarantined like any request. Done: `resume.vitest.ts` passes.
- [x] T020 Enqueue in a fixture repository with no remote, first without and then with `identity` in `bots/config.json` (`.skilled/skills/system-skilled-bots/runtime/tests/identity-refusal.vitest.ts`). Verify: the first enqueue exits non-zero and leaves the state root empty. The second writes one file to `Q/inbox`. Done: `identity-refusal.vitest.ts` passes.
- [x] T022 Run `bots answer` end to end on fixture items (`.skilled/skills/system-skilled-bots/runtime/tests/answer.vitest.ts`). Verify: the same answer twice leaves one `resume` request in `Q/inbox` and the second prints `duplicate`. The item reads `answered` with that request id. A different answer, an expired item and an unknown id each exit non-zero. A planted secret in the answer is refused by key. The generation stamp changed once. After `bots drain` with the phase 3 runner, one new run joins the item. Done: `answer.vitest.ts` passes.
- [x] T025 Drain a queued request with a prompt and a fired slot (`.skilled/skills/system-skilled-bots/runtime/tests/queued-run.vitest.ts`). Verify: the stub receipt holds the request prompt after the body, the record carries the request id, fired slot and source, a secret prompt is quarantined `body-secret` with no dispatch, and the record and stamp are unchanged after the drain returns. Done: 3 tests failed before the fix (`scratch/queued-run-negative-control.txt`) and pass after it.
- [x] T017 Search the phase's code for scheduler calls (`.skilled/skills/system-skilled-bots/runtime/lib/`). Verify: `rg -n 'launchctl|\.plist' .skilled/skills/system-skilled-bots/runtime/lib/request-*.ts .skilled/skills/system-skilled-bots/runtime/lib/answer.ts .skilled/scripts/git-hooks/post-commit` prints nothing. Done: `rg` printed nothing, exit 1.
- [x] T026 Apply the review's minor fixes: a text pre-check for `"gitHookTrigger": true` before the hook leg starts node, the last attempt's cause in a `retry-bound` detail, dash-led values for `--prompt`, `--origin` and `--key`, the hand re-send of a quarantined resume in ADR-002 and ADR-005 accepted with its follow-up (`.skilled/scripts/git-hooks/post-commit`, `L/request-drain.ts`, `.skilled/bin/bots.cjs`, `decision-record.md`). Verify: the hook matrix's opted-out row asserts no node starts, the three hook tests keep their counts, and the retry and dedupe tests pass. Done: hook matrix 28 passed, hook tests 74, 14 and 25 passed (`scratch/review-fix-*.txt`), whole suite 263 passed three times in a row (`scratch/review-fix-suite-1.txt` to `-3.txt`).
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
<!-- FILL: Keep the three completion lines and add the one artifact that proves the phase is done. GOOD: `--keep 3` leaves 3 archives and the suite passes. WEAK: Work is complete. -->

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: the hook matrix commits through the real hook in temp repositories, 28 passed after the review fixes (`scratch/review-fix-post-commit-leg.txt`)
- [x] `npm --prefix .skilled/skills/system-skilled-bots/runtime test` exits 0 and its output is pasted in `implementation-summary.md`: 29 files, 263 passed, exit 0, three runs in a row after the review fixes (`scratch/review-fix-suite-1.txt` to `-3.txt`)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
<!-- FILL: Name the spec and plan files. Add the decision record when the packet has one. GOOD: Specification: `spec.md`. Plan: `plan.md`. WEAK: See the other docs. -->

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Decisions**: See `decision-record.md`
- **Closure gate**: See `acceptance-criteria.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist
<!-- FILL: Fill each checklist section below. GOOD: Each CHK line names the command that answers it. WEAK: The checklist is done. -->

<!-- ANCHOR:protocol -->
## Verification Protocol
<!-- FILL: Keep the three rows and add the rule this packet uses for a blocked task. GOOD: P0 blocks close. P1 needs a recorded reason. WEAK: Follow the priorities. -->

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

A task blocked on phase 1 or phase 3 is marked `[B]` with the missing contract named on the line.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation
<!-- FILL: Write one check per setup fact, each with a command. GOOD: CHK-001 [P0] The start commit is in `goal.md` section 4. WEAK: Setup is ready. -->

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] Dependencies identified and available: phases 1 and 3 are complete Phases 1 and 3 committed at `555101d8c23`.
- [x] CHK-004 [P0] All three hook test baselines recorded (T003) T003.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality
<!-- FILL: Write one check per file rule. A command must answer it. GOOD: CHK-010 [P0] `bash -n scripts/rotate-logs.sh` exits 0. WEAK: Code is clean. -->

- [x] CHK-010 [P0] `npx tsc --noEmit` in the skill runtime exits 0 for the `request-*.ts` files, and `bash -n .skilled/scripts/git-hooks/post-commit` exits 0 Typecheck exit 0, `bash -n` exit 0.
- [x] CHK-011 [P0] A commit in a repository with no `bots/config.json` prints nothing new on stderr Hook matrix row 7.
- [x] CHK-012 [P1] Every queue move handles ENOENT as a lost race, not a crash Every move returns `claim-lost` or `request-vanished` on ENOENT (`request-queue.vitest.ts`).
- [x] CHK-013 [P1] No code comment names a packet, phase or REQ id `rg` for ids over the new files hit only run-id timestamps.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist
<!-- FILL: Write one check per acceptance criterion. GOOD: CHK-020 [P0] `--keep 3` leaves 3 archives. WEAK: Tests pass. -->

- [x] CHK-020 [P0] AC-001 race test passes (T011) T011.
- [x] CHK-021 [P0] AC-002 dedupe test passes (T012) T012.
- [x] CHK-022 [P0] AC-003 quarantine test passes with an empty watched folder (T013) T013.
- [x] CHK-023 [P0] AC-004 retry test passes (T014) T014.
- [x] CHK-024 [P0] AC-005 hook matrix passes (T015, T016) T015, T016.
- [x] CHK-025 [P0] AC-006 scheduler search prints nothing (T017) T017.
- [x] CHK-026 [P1] AC-008 resume dedupe test passes (T019) T019.
- [x] CHK-027 [P0] AC-009 identity refusal test passes (T020) T020.
- [x] CHK-028 [P1] AC-010 `bots answer` test passes (T021, T022) T021, T022.
- [x] CHK-029 [P1] AC-011 held-bot quarantine test passes (T023) T023.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS
<!-- FILL: Write this section when the packet fixes a reported finding. Delete it otherwise. GOOD: CHK-FIX-001 [P0] Every finding names one class. WEAK: All findings handled. -->

N/A: this phase builds new behavior and fixes no reported finding.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security
<!-- FILL: Write one check per security surface. Write `N/A` with a reason when none applies. GOOD: CHK-030 [P0] `scripts/rotate-logs.sh` reads no credential. WEAK: Security is fine. -->

- [x] CHK-030 [P0] No request record or reason file holds a secret value A secret answer is refused before it is stored (`answer.vitest.ts`). Reason files carry refusal causes, which name keys only.
- [x] CHK-031 [P0] An untrusted clone's commit enqueues nothing and runs none of its own scripts (T015) Hook matrix row 8.
- [x] CHK-032 [P1] A malformed request is quarantined without being parsed into a dispatch `quarantine.vitest.ts` drains two non-request files with a runner that is never called.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation
<!-- FILL: Write one check per document that must agree. GOOD: CHK-040 [P1] `spec.md` and `tasks.md` both name `--keep <n>`. WEAK: Docs are updated. -->

- [x] CHK-040 [P1] spec.md, plan.md and tasks.md name the same folder layout and retry bound All three name the six sibling folders and the bound of 3.
- [x] CHK-041 [P1] The hook leg carries a short comment that says why it is non-fatal and opt-in `post-commit` lines 120 to 130.
- [x] CHK-042 [P2] The `post-commit` row in `.skilled/scripts/git-hooks/README.md` names the new leg, after the operator's yes Operator yes ("Hook leg plus both docs").
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization
<!-- FILL: Write one check per file location rule. GOOD: CHK-050 [P1] Test copies live under `scratch/test/`. WEAK: Files are organized. -->

- [x] CHK-050 [P1] Test state roots live under a temp folder and are removed after each test Every vitest uses `tests/support.ts` temp folders. The hook test removes its temp folder on exit.
- [x] CHK-051 [P1] scratch/ cleaned before completion. Evidence: scratch/ was reviewed on 2026-11-24 and kept on purpose. Every file is cited by a row, by name or as part of a range such as `-1.txt` to `-3.txt`, except `bots-suite-baseline.txt` and `typecheck-after.txt`: they hold the suite baseline and the first typecheck run behind figures the rows quote, so they stay as evidence. Nothing temporary is left.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary
<!-- FILL: Count the boxes by priority and write the three totals. GOOD: P0 12, P1 13, P2 1. WEAK: Most items done. -->

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 14 | 14/14 |
| P1 Items | 11 | 10/11 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-23
<!-- /ANCHOR:summary -->

---
