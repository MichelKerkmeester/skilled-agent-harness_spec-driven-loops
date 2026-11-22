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

- [ ] T001 Read the phase 1 state-root layout and the `gitHookTrigger` key (`../001-contracts-and-state-root/spec.md`, ADR-009). Verify: `rg -n 'Request queue|gitHookTrigger' ../001-contracts-and-state-root/spec.md` prints the queue layout row and the Config keys row.
- [ ] T002 Read the phase 3 runner entry and its outcome classes (`../003-manual-runner/spec.md`). Verify: `rg -n 'outcome|refus' ../003-manual-runner/spec.md` names the refusal classes drain maps to quarantine.
- [ ] T003 Record the baseline of the three hook tests before any edit (`.skilled/scripts/git-hooks/tests/source-root-selection.test.sh`). Verify: it, `autostash-orphan-guard.test.sh` and `gate-config.test.sh` each exit 0, and the three exit codes are written in `implementation-summary.md`.
- [ ] T004 List every file that names the hook (`.skilled/scripts/git-hooks/post-commit`). Verify: `rg -ln 'post-commit' .skilled/scripts .skilled/skills/sk-git` matches the Affected Surfaces table in `plan.md`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
<!-- FILL: Write one implementation task per file change. Add a `Verify:` line with the command and its expected output. GOOD: T002 Add the `--keep <n>` branch. Verify: `--keep 3` leaves 3 archives. WEAK: T002 Implement the feature. -->

- [ ] T005 Build and validate the §9 request record and derive the key from source plus source event id, with a caller key winning (`L/request-record.ts`). Verify: vitest on its unit test exits 0, and two records with one source event and different prompts share one key.
- [ ] T006 Create the folder layout and the temp-and-rename enqueue with the exclusive seen-key marker (`L/request-queue.ts`). Verify: the unit test exits 0, and `stat -f %d` prints one device id for every folder under `Q`.
- [ ] T007 Add the claim rename, the retry move with `attempts` raised and the quarantine move with a reason file (`L/request-queue.ts`). Verify: the unit test exits 0, and a claimed file exists in exactly one folder after each move.
- [ ] T008 Add the drain loop that claims, calls the runner and routes `ran`, `retry` and `quarantined: <reason>` (`L/request-drain.ts`). Verify: with a stub runner, `bots drain` prints one line per request and `ls -A Q/inbox` prints nothing.
- [ ] T009 Add the `enqueue` and `drain` verbs to the phase 3 CLI entry (`.skilled/bin/bots.cjs`). Verify: `node .skilled/bin/bots.cjs enqueue --help` and `node .skilled/bin/bots.cjs drain --help` exit 0, and a misspelled option exits non-zero.
- [ ] T018 Add kind `resume` to the record, with source `answer` and the needs-you item id as the key, and refuse enqueue while identity is unknown (`L/request-record.ts`, `L/request-queue.ts`). Verify: the unit test exits 0, a `resume` record keys on its item id and an enqueue with unknown identity exits non-zero.
- [ ] T021 Add `bots answer <item-id> "<text>"`: exit 2 with no text, refuse an unknown item, an expired item and a different answer to an answered item, run phase 3's body-secret predicate over the answer, record the answer through phase 1's item helpers, enqueue one `resume` request keyed by the item id, write its id into `resumeRequestId`, then rewrite phase 3's generation stamp (`L/answer.ts`, `.skilled/bin/bots.cjs`). Verify: the unit test exits 0, and a stub enqueue records that the item already reads `answered` when it is called.
- [ ] T023 Map the runner refusal `awaiting-decision-hold` to quarantine with reason `held-needs-you`, never replayed (`L/request-drain.ts`). Verify: with a stub runner that returns the hold refusal, `bots drain` prints `quarantined: held-needs-you` and `ls -A Q/inbox` prints nothing.
- [ ] T010 Add the opt-in enqueue leg between the end of the `SPECKIT_AUTOSYNC` branch and `exit 0`, calling the CLI only by a `$SOURCE_ROOT` path (`.skilled/scripts/git-hooks/post-commit`). Verify: `bash -n .skilled/scripts/git-hooks/post-commit` exits 0, and the leg's last command ends in `|| true`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
<!-- FILL: Write one verification task per requirement. Each one runs a command. GOOD: T003 Run both invocations. Verify: `ls logs/archive | wc -l` prints 3 and 10. WEAK: T003 Test everything. -->

- [ ] T011 Race two drains against one request (`.skilled/skills/system-skilled-bots/runtime/tests/race.vitest.ts`). Verify: across 50 rounds, each round leaves exactly one run record that joins the request id.
- [ ] T012 Enqueue one source event twice with a changed prompt (`.skilled/skills/system-skilled-bots/runtime/tests/dedupe.vitest.ts`). Verify: the second enqueue prints `duplicate`, and one run record exists after drain.
- [ ] T013 Drain a malformed definition, a failing precheck, a disabled bot and a paused bot (`.skilled/skills/system-skilled-bots/runtime/tests/quarantine.vitest.ts`). Verify: `ls -A Q/inbox` prints nothing and `Q/quarantine` holds four reason files with four different reasons, one of them `paused` (ADR-004).
- [ ] T014 Drain a request whose run always fails (`.skilled/skills/system-skilled-bots/runtime/tests/retry.vitest.ts`). Verify: the runner stub is called exactly the ADR-002 bound times, then the request is in `Q/quarantine` with reason `retry-bound`.
- [ ] T015 Run the hook matrix from `plan.md` Affected Surfaces (`.skilled/skills/system-skilled-bots/runtime/tests/post-commit-leg.test.sh`). Verify: every row's commit exits 0, only the trusted, opted-in, non-run row with `node` adds a file to `Q/inbox`, the untrusted row with a `bots` shim on `PATH` adds none and no row starts an agent.
- [ ] T016 Rerun the three existing hook tests after the edit (`.skilled/scripts/git-hooks/tests/source-root-selection.test.sh`). Verify: it, `autostash-orphan-guard.test.sh` and `gate-config.test.sh` exit 0, the same as the T003 baseline.
- [ ] T019 Enqueue two `resume` requests for one needs-you item, then drain (`.skilled/skills/system-skilled-bots/runtime/tests/resume.vitest.ts`). Verify: the second enqueue prints `duplicate`, one run record exists and a failing `resume` run is retried and quarantined like any request.
- [ ] T020 Enqueue in a fixture repository with no remote, first without and then with `identity` in `bots/config.json` (`.skilled/skills/system-skilled-bots/runtime/tests/identity-refusal.vitest.ts`). Verify: the first enqueue exits non-zero and leaves the state root empty. The second writes one file to `Q/inbox`.
- [ ] T022 Run `bots answer` end to end on fixture items (`.skilled/skills/system-skilled-bots/runtime/tests/answer.vitest.ts`). Verify: the same answer twice leaves one `resume` request in `Q/inbox` and the second prints `duplicate`. The item reads `answered` with that request id. A different answer, an expired item and an unknown id each exit non-zero. A planted secret in the answer is refused by key. The generation stamp changed once. After `bots drain` with the phase 3 runner, one new run joins the item.
- [ ] T017 Search the phase's code for scheduler calls (`.skilled/skills/system-skilled-bots/runtime/lib/`). Verify: `rg -n 'launchctl|\.plist' .skilled/skills/system-skilled-bots/runtime/lib/request-*.ts .skilled/skills/system-skilled-bots/runtime/lib/answer.ts .skilled/scripts/git-hooks/post-commit` prints nothing.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
<!-- FILL: Keep the three completion lines and add the one artifact that proves the phase is done. GOOD: `--keep 3` leaves 3 archives and the suite passes. WEAK: Work is complete. -->

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] `npm --prefix .skilled/skills/system-skilled-bots/runtime test` exits 0 and its output is pasted in `implementation-summary.md`
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

- [ ] CHK-001 [P0] Requirements documented in spec.md
- [ ] CHK-002 [P0] Technical approach defined in plan.md
- [ ] CHK-003 [P1] Dependencies identified and available: phases 1 and 3 are complete
- [ ] CHK-004 [P0] All three hook test baselines recorded (T003)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality
<!-- FILL: Write one check per file rule. A command must answer it. GOOD: CHK-010 [P0] `bash -n scripts/rotate-logs.sh` exits 0. WEAK: Code is clean. -->

- [ ] CHK-010 [P0] `npx tsc --noEmit` in the skill runtime exits 0 for the `request-*.ts` files, and `bash -n .skilled/scripts/git-hooks/post-commit` exits 0
- [ ] CHK-011 [P0] A commit in a repository with no `bots/config.json` prints nothing new on stderr
- [ ] CHK-012 [P1] Every queue move handles ENOENT as a lost race, not a crash
- [ ] CHK-013 [P1] No code comment names a packet, phase or REQ id
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist
<!-- FILL: Write one check per acceptance criterion. GOOD: CHK-020 [P0] `--keep 3` leaves 3 archives. WEAK: Tests pass. -->

- [ ] CHK-020 [P0] AC-001 race test passes (T011)
- [ ] CHK-021 [P0] AC-002 dedupe test passes (T012)
- [ ] CHK-022 [P0] AC-003 quarantine test passes with an empty watched folder (T013)
- [ ] CHK-023 [P0] AC-004 retry test passes (T014)
- [ ] CHK-024 [P0] AC-005 hook matrix passes (T015, T016)
- [ ] CHK-025 [P0] AC-006 scheduler search prints nothing (T017)
- [ ] CHK-026 [P1] AC-008 resume dedupe test passes (T019)
- [ ] CHK-027 [P0] AC-009 identity refusal test passes (T020)
- [ ] CHK-028 [P1] AC-010 `bots answer` test passes (T021, T022)
- [ ] CHK-029 [P1] AC-011 held-bot quarantine test passes (T023)
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

- [ ] CHK-030 [P0] No request record or reason file holds a secret value
- [ ] CHK-031 [P0] An untrusted clone's commit enqueues nothing and runs none of its own scripts (T015)
- [ ] CHK-032 [P1] A malformed request is quarantined without being parsed into a dispatch
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation
<!-- FILL: Write one check per document that must agree. GOOD: CHK-040 [P1] `spec.md` and `tasks.md` both name `--keep <n>`. WEAK: Docs are updated. -->

- [ ] CHK-040 [P1] spec.md, plan.md and tasks.md name the same folder layout and retry bound
- [ ] CHK-041 [P1] The hook leg carries a short comment that says why it is non-fatal and opt-in
- [ ] CHK-042 [P2] The `post-commit` row in `.skilled/scripts/git-hooks/README.md` names the new leg, after the operator's yes
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization
<!-- FILL: Write one check per file location rule. GOOD: CHK-050 [P1] Test copies live under `scratch/test/`. WEAK: Files are organized. -->

- [ ] CHK-050 [P1] Test state roots live under a temp folder and are removed after each test
- [ ] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary
<!-- FILL: Count the boxes by priority and write the three totals. GOOD: P0 12, P1 13, P2 1. WEAK: Most items done. -->

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 14 | 0/14 |
| P1 Items | 11 | 0/11 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-11-22
<!-- /ANCHOR:summary -->

---
