---
title: "Tasks: Phase 2: schedule-predicates-and-checker"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "schedule predicates and checker tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 2: schedule-predicates-and-checker

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

`S` is `.skilled/skills/system-skilled-bots`. `P` is `~/Library/LaunchAgents/com.skilled.probe.weekday.plist`. File extensions under `S/runtime/lib/` follow the phase 1 language decision.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
<!-- FILL: Replace the sample tasks with the real setup steps. Each task names a file and a verify command. GOOD: T001 Confirm `logs/archive/` holds 10 archives. Verify: `ls logs/archive | wc -l` prints 10. WEAK: T001 Set up the project. -->

- [ ] T001 Write the probe plist by hand: label `com.skilled.probe.weekday`, `StartCalendarInterval` of one dictionary with `Hour`, `Minute` and one `Weekday`, program `/bin/sh -c` appending `date` to a log outside the checkout (`P`). Verify: `plutil -lint P` prints `OK`.
- [ ] T002 Bootstrap the probe on the first day of the phase and copy its plist text into the decision record (`P`, `decision-record.md`). Verify: `launchctl print gui/$(id -u)/com.skilled.probe.weekday` exits 0 and shows `state`.
- [ ] T003 [P] Confirm the phase 1 parser, field predicates and identity resolver import from a scratch script (`scratch/import-check.cjs`). Verify: `node scratch/import-check.cjs` exits 0.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
<!-- FILL: Write one implementation task per file change. Add a `Verify:` line with the command and its expected output. GOOD: T002 Add the `--keep <n>` branch. Verify: `--keep 3` leaves 3 archives. WEAK: T002 Implement the feature. -->

- [ ] T004 Create the cron translator: five-field parse, list, range and step expansion, weekday `7` mapped to `0`, both day fields kept in one dictionary, every-minute as `StartInterval 60` (`S/runtime/lib/cron-translator.ts`). Verify: the translator test prints 48 dictionaries for `*/15 0-23/2 * * *` and 1 for `0 9 1 * 1`.
- [ ] T005 Add the refusals with their own invariant ids: `@reboot`, `@AppleNotOnBattery`, percent-stdin, empty string, past the dictionary cap (`S/runtime/lib/cron-translator.ts`). Verify: each refusal test asserts its id and `@reboot` parses before it is refused.
- [ ] T006 Create the label grammar: build and parse `com.skilled.bots.<identity>.<bot-id>.<schedule-index>` from the phase 1 identity (`S/runtime/lib/label.ts`). Also build and parse the drain form `com.skilled.bots.<identity>.drain` (ADR-004). Verify: two identities with bot id `review` give two labels, each parses back to its three parts, and a drain label parses back to its identity with no bot id.
- [ ] T007 Create the slot lister from translator output only, with the daylight-saving rule chosen in `decision-record.md` and the `StartInterval 60` case (`S/runtime/lib/slot-lister.ts`). Verify: `rg -n 'parseCron|cron-parser' S/runtime/lib/slot-lister.ts` prints nothing and the lister tests pass.
- [ ] T008 Create the clean fixture (it declares `isolation: shared`, since an undeclared isolation with no config default is refused) and one defect fixture per hard invariant: missing id, duplicate id, missing trigger, unknown kind, empty body, unknown executor kind, bad budget, `timeoutSeconds` over 3600, cron that parses but does not translate, `bots/config.json` with no `identity` in a repository with no remote (`S/scripts/fixtures/`). The body-secret invariant and its fixture wait for phase 3's detector, and the worktree invariant for phase 4. Verify: `ls S/scripts/fixtures | wc -l` matches the invariant list count plus one.
- [ ] T009 Create the checker: read a definitions folder, import phase 1 and phase 2 predicates, print one `PASS|FAIL|WARN|INFO: <id>: <message>` line per finding, exit 0, 1 or 2, honor the strict switch, fail a definition whose `id` is the reserved `drain` (ADR-004), and fail a definition set whose `bots/config.json` has no `identity` when the repository has no remote, with its own invariant id (`S/scripts/bot-check.cjs`). Verify: `node S/scripts/bot-check.cjs S/scripts/fixtures/clean; echo $?` prints no `FAIL:` line and then `0`.
- [ ] T010 Add the checker tests: one per defect fixture asserting the invariant id, one for a missing target asserting exit 2, one showing the strict switch changes only advisory lines (`S/runtime/tests/bot-check.vitest.ts`). Verify: the test file passes under the phase 1 runner.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
<!-- FILL: Write one verification task per requirement. Each one runs a command. GOOD: T003 Run both invocations. Verify: `ls logs/archive | wc -l` prints 3 and 10. WEAK: T003 Test everything. -->

- [ ] T011 Read the probe log after one matching and one non-matching day and record dates, plist text and log lines (`decision-record.md`). Also write one result line naming `Weekday`, the dates and the fire log lines in `implementation-summary.md`, which phase 6 T002 reads. Check the host wake log (`pmset -g log`) so a catch-up fire after wake is not read as a non-matching fire. Verify: `rg -n 'Probe observation' decision-record.md` prints one line with the log excerpt under it, and `rg -n 'Weekday' implementation-summary.md` prints the result line with dates.
- [ ] T012 Set the weekday-only translator rule from the probe result: emit the key alone, or refuse with an invariant id (`S/runtime/lib/cron-translator.ts`). Verify: the test for `0 9 * * 1-5` asserts the outcome the decision record names.
- [ ] T013 If the probe forces a refusal, write the handoff to phase 1 for the worked example in its spec (`implementation-summary.md`). Verify: `rg -n '0 9 \* \* 1-5' implementation-summary.md` prints the handoff line, or the decision record says emit and no handoff is needed.
- [ ] T014 Run the translator and the slot lister over the shared fixture set, including one daylight-saving boundary under a fixed `TZ` (`S/runtime/tests/`). Verify: the agreement test passes and lists the boundary case by name.
- [ ] T015 Prove the checker imports its predicates (`S/scripts/bot-check.cjs`). Verify: `rg -n 'cli-opencode|3600|@reboot' S/scripts/bot-check.cjs` prints nothing.
- [ ] T016 Prove nothing schedules a bot (`S/`). Verify: `rg -n 'launchctl bootstrap|com\.skilled\.bots\.' S --glob '!**/tests/**' --glob '!**/*.md'` prints only the label grammar constant.
- [ ] T017 Remove the probe (`P`). Verify: after `launchctl bootout gui/$(id -u)/com.skilled.probe.weekday` and `rm P`, `ls ~/Library/LaunchAgents | rg com.skilled.probe` prints nothing.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
<!-- FILL: Keep the three completion lines and add the one artifact that proves the phase is done. GOOD: `--keep 3` leaves 3 archives and the suite passes. WEAK: Work is complete. -->

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] The probe observation is in `decision-record.md` and the probe plist is gone
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

The probe wait is not a block. Other tasks continue while it runs. Only T011 waits for the second observed day.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation
<!-- FILL: Write one check per setup fact, each with a command. GOOD: CHK-001 [P0] The start commit is in `goal.md` section 4. WEAK: Setup is ready. -->

- [ ] CHK-001 [P0] Requirements documented in spec.md: `rg -c '^\| REQ-' spec.md` prints 11
- [ ] CHK-002 [P0] Technical approach defined in plan.md: `rg -n '^## 3' plan.md` prints one line
- [ ] CHK-003 [P1] Phase 1 predicates import: `node scratch/import-check.cjs` exits 0
- [ ] CHK-004 [P0] The probe is installed on day one: `launchctl print gui/$(id -u)/com.skilled.probe.weekday` exits 0
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality
<!-- FILL: Write one check per file rule. A command must answer it. GOOD: CHK-010 [P0] `bash -n scripts/rotate-logs.sh` exits 0. WEAK: Code is clean. -->

- [ ] CHK-010 [P0] Code passes lint and type checks under the phase 1 build
- [ ] CHK-011 [P0] `node --check S/scripts/bot-check.cjs` exits 0
- [ ] CHK-012 [P1] Every refusal carries its own invariant id
- [ ] CHK-013 [P1] Code comments carry no packet, phase or requirement id: `rg -n 'REQ-|phase [0-9]' S/runtime S/scripts --glob '!**/fixtures/**'` prints nothing
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist
<!-- FILL: Write one check per acceptance criterion. GOOD: CHK-020 [P0] `--keep 3` leaves 3 archives. WEAK: Tests pass. -->

- [ ] CHK-020 [P0] Every row in `acceptance-criteria.md` is `Met` with its evidence named
- [ ] CHK-021 [P0] The probe was observed on a matching and a non-matching day
- [ ] CHK-022 [P1] The daylight-saving boundary case passes in the agreement test
- [ ] CHK-023 [P1] A missing target makes the checker exit 2
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security
<!-- FILL: Write one check per security surface. Write `N/A` with a reason when none applies. GOOD: CHK-030 [P0] `scripts/rotate-logs.sh` reads no credential. WEAK: Security is fine. -->

- [ ] CHK-030 [P0] No hardcoded secrets in modules, fixtures or the probe plist
- [ ] CHK-031 [P0] The checker writes nothing: a run over the fixtures leaves `git status --porcelain S` unchanged
- [ ] CHK-032 [P1] The probe calls no runner and no agent: its `ProgramArguments` hold only `/bin/sh`, `-c` and a `date` append
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation
<!-- FILL: Write one check per document that must agree. GOOD: CHK-040 [P1] `spec.md` and `tasks.md` both name `--keep <n>`. WEAK: Docs are updated. -->

- [ ] CHK-040 [P1] `spec.md`, `plan.md` and `decision-record.md` name the same weekday rule and dictionary cap
- [ ] CHK-041 [P1] The probe record in `decision-record.md` holds dates, plist text and log lines
- [ ] CHK-042 [P2] The worked-example handoff to phase 1 is written when the probe forces a refusal
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization
<!-- FILL: Write one check per file location rule. GOOD: CHK-050 [P1] Test copies live under `scratch/test/`. WEAK: Files are organized. -->

- [ ] CHK-050 [P1] Temp files in scratch/ only
- [ ] CHK-051 [P1] scratch/ cleaned before completion
- [ ] CHK-052 [P1] No file is written under any consumer `bots/` folder
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary
<!-- FILL: Count the boxes by priority and write the three totals. GOOD: P0 12, P1 13, P2 1. WEAK: Most items done. -->

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 9 | 0/9 |
| P1 Items | 11 | 0/11 |
| P2 Items | 1 | 0/1 |

**Verification Date**: Not verified yet. Nothing is built.
<!-- /ANCHOR:summary -->

---
