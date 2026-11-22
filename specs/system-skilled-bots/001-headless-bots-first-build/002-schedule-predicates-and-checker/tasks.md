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

- [x] T001 Write the probe plist by hand: label `com.skilled.probe.weekday`, `StartCalendarInterval` of one dictionary with `Hour`, `Minute` and one `Weekday`, program `/bin/sh -c` appending `date` to a log outside the checkout (`P`). Verify: `plutil -lint P` prints `OK`. Evidence: [DEVIATION: the orchestrator barred writing into `~/Library/LaunchAgents`] written as `scratch/com.skilled.probe.weekday.plist` with a weekday placeholder plus `scratch/probe-weekday.sh` (install, status, remove), not run. `plutil -lint` on a copy with Weekday 1 printed `OK`, exit 0. `bash -n` exit 0.
- [B] T002 Bootstrap the probe on the first day of the phase and copy its plist text into the decision record (`P`, `decision-record.md`). Verify: `launchctl print gui/$(id -u)/com.skilled.probe.weekday` exits 0 and shows `state`. [B] Blocked: awaiting operator approval to load the launchd probe. Install command: `scratch/probe-weekday.sh install <weekday>`.
- [x] T003 [P] Confirm the phase 1 parser, field predicates and identity resolver import from a scratch script (`scratch/import-check.cjs`). Verify: `node scratch/import-check.cjs` exits 0. Evidence: [DEVIATION: no scratch file kept, so scratch stays clean] the checker loads the definition parser, config reader, identity resolver, translator and label grammar through the runtime tsx, and its run over `scripts/fixtures/clean` exited 0.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
<!-- FILL: Write one implementation task per file change. Add a `Verify:` line with the command and its expected output. GOOD: T002 Add the `--keep <n>` branch. Verify: `--keep 3` leaves 3 archives. WEAK: T002 Implement the feature. -->

- [x] T004 Create the cron translator: five-field parse, list, range and step expansion, weekday `7` mapped to `0`, both day fields kept in one dictionary, every-minute as `StartInterval 60` (`S/runtime/lib/cron-translator.ts`). Verify: the translator test prints 48 dictionaries for `*/15 0-23/2 * * *` and 1 for `0 9 1 * 1`. Evidence: `tests/cron-translator.vitest.ts` asserts 48 and 1; suite 109 passed.
- [x] T005 Add the refusals with their own invariant ids: `@reboot`, `@AppleNotOnBattery`, percent-stdin, empty string, past the dictionary cap (`S/runtime/lib/cron-translator.ts`). Verify: each refusal test asserts its id and `@reboot` parses before it is refused. Evidence: refusal tests assert `cron-reboot`, `cron-apple-not-on-battery`, `cron-percent-stdin`, `cron-empty`, `cron-over-cap`; `@reboot` parses first.
- [x] T006 Create the label grammar: build and parse `com.skilled.bots.<identity>.<bot-id>.<schedule-index>` from the phase 1 identity (`S/runtime/lib/label.ts`). Also build and parse the drain form `com.skilled.bots.<identity>.drain` (ADR-004). Verify: two identities with bot id `review` give two labels, each parses back to its three parts, and a drain label parses back to its identity with no bot id. Evidence: `tests/label.vitest.ts` covers two identities, round trips and the drain form.
- [x] T007 Create the slot lister from translator output only, with the daylight-saving rule chosen in `decision-record.md` and the `StartInterval 60` case (`S/runtime/lib/slot-lister.ts`). Verify: `rg -n 'parseCron|cron-parser' S/runtime/lib/slot-lister.ts` prints nothing and the lister tests pass. Evidence: the `rg` for `parseCron\|cron-parser` over `slot-lister.ts` printed nothing, exit 1; lister tests pass.
- [x] T008 Create the clean fixture (it declares `isolation: shared`, since an undeclared isolation with no config default is refused) and one defect fixture per hard invariant: missing id, duplicate id, missing trigger, unknown kind, empty body, unknown executor kind, bad budget, `timeoutSeconds` over 3600, cron that parses but does not translate, `bots/config.json` with no `identity` in a repository with no remote (`S/scripts/fixtures/`). The body-secret invariant and its fixture wait for phase 3's detector, and the worktree invariant for phase 4. Verify: `ls S/scripts/fixtures | wc -l` matches the invariant list count plus one. Evidence: `ls S/scripts/fixtures \| wc -l` printed 14: clean plus 13 hard invariants, which adds reserved id, undeclared isolation and invalid identity to the listed ten.
- [x] T009 Create the checker: read a definitions folder, import phase 1 and phase 2 predicates, print one `PASS|FAIL|WARN|INFO: <id>: <message>` line per finding, exit 0, 1 or 2, honor the strict switch, fail a definition whose `id` is the reserved `drain` (ADR-004), and fail a definition set whose `bots/config.json` has no `identity` when the repository has no remote, with its own invariant id (`S/scripts/bot-check.cjs`). Verify: `node S/scripts/bot-check.cjs S/scripts/fixtures/clean; echo $?` prints no `FAIL:` line and then `0`. Evidence: `node S/scripts/bot-check.cjs S/scripts/fixtures/clean; echo $?` printed seven `PASS:` lines and `0`.
- [x] T010 Add the checker tests: one per defect fixture asserting the invariant id, one for a missing target asserting exit 2, one showing the strict switch changes only advisory lines (`S/runtime/tests/bot-check.vitest.ts`). Verify: the test file passes under the phase 1 runner. Evidence: `tests/bot-check.vitest.ts`, 22 tests pass.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
<!-- FILL: Write one verification task per requirement. Each one runs a command. GOOD: T003 Run both invocations. Verify: `ls logs/archive | wc -l` prints 3 and 10. WEAK: T003 Test everything. -->

- [B] T011 Read the probe log after one matching and one non-matching day and record dates, plist text and log lines (`decision-record.md`). Also write one result line naming `Weekday`, the dates and the fire log lines in `implementation-summary.md`, which phase 6 T002 reads. Check the host wake log (`pmset -g log`) so a catch-up fire after wake is not read as a non-matching fire. Verify: `rg -n 'Probe observation' decision-record.md` prints one line with the log excerpt under it, and `rg -n 'Weekday' implementation-summary.md` prints the result line with dates. [B] Blocked: awaiting operator approval to load the launchd probe.
- [B] T012 Set the weekday-only translator rule from the probe result: emit the key alone, or refuse with an invariant id (`S/runtime/lib/cron-translator.ts`). Verify: the test for `0 9 * * 1-5` asserts the outcome the decision record names. [B] Blocked: awaiting operator approval to load the launchd probe. Until then the rule is refuse (`SINGLE_DAY_FIELD_RULE`), the conservative choice.
- [B] T013 If the probe forces a refusal, write the handoff to phase 1 for the worked example in its spec (`implementation-summary.md`). Verify: `rg -n '0 9 \* \* 1-5' implementation-summary.md` prints the handoff line, or the decision record says emit and no handoff is needed. [B] Blocked: awaiting operator approval to load the launchd probe. The handoff is written provisionally in `implementation-summary.md`.
- [x] T014 Run the translator and the slot lister over the shared fixture set, including one daylight-saving boundary under a fixed `TZ` (`S/runtime/tests/`). Verify: the agreement test passes and lists the boundary case by name. Evidence: the agreement test passes with `spring-forward boundary, 02:30 daily` and a fall-back case under `TZ=Europe/Amsterdam`.
- [x] T015 Prove the checker imports its predicates (`S/scripts/bot-check.cjs`). Verify: `rg -n 'cli-opencode|3600|@reboot' S/scripts/bot-check.cjs` prints nothing. Evidence: the `rg` printed nothing, exit 1.
- [x] T016 Prove nothing schedules a bot (`S/`). Verify: `rg -n 'launchctl bootstrap|com\.skilled\.bots\.' S --glob '!**/tests/**' --glob '!**/*.md'` prints only the label grammar constant. Evidence: the `rg` printed one line, the `LABEL_PREFIX` constant in `runtime/lib/label.ts`.
- [B] T017 Remove the probe (`P`). Verify: after `launchctl bootout gui/$(id -u)/com.skilled.probe.weekday` and `rm P`, `ls ~/Library/LaunchAgents | rg com.skilled.probe` prints nothing. [B] Blocked: awaiting operator approval to load the launchd probe. Nothing was loaded, so `ls ~/Library/LaunchAgents \| rg com.skilled.probe` prints nothing today; removal is `scratch/probe-weekday.sh remove`.
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

- [x] CHK-001 [P0] Requirements documented in spec.md: `rg -c '^\| REQ-' spec.md` prints 11 Evidence: prints 12, not 11: REQ-012 (the no-identity invariant) was added by the 2026-11-22 operator decision after this line was written.
- [x] CHK-002 [P0] Technical approach defined in plan.md: `rg -n '^## 3' plan.md` prints one line Evidence: `## 3. ARCHITECTURE` at plan.md line 55.
- [x] CHK-003 [P1] Phase 1 predicates import: `node scratch/import-check.cjs` exits 0 Evidence: the checker imports them through the runtime tsx; the clean run exits 0 (see T003).
- [B] CHK-004 [P0] The probe is installed on day one: `launchctl print gui/$(id -u)/com.skilled.probe.weekday` exits 0 [B] Blocked: awaiting operator approval to load the launchd probe.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality
<!-- FILL: Write one check per file rule. A command must answer it. GOOD: CHK-010 [P0] `bash -n scripts/rotate-logs.sh` exits 0. WEAK: Code is clean. -->

- [x] CHK-010 [P0] Code passes lint and type checks under the phase 1 build Evidence: `npm run typecheck` exit 0; suite 109 passed.
- [x] CHK-011 [P0] `node --check S/scripts/bot-check.cjs` exits 0 Evidence: exit 0.
- [x] CHK-012 [P1] Every refusal carries its own invariant id Evidence: `CRON_REFUSALS` lists eleven ids and a test asserts every refusal comes from it; the checker reports each refusal under its own id.
- [x] CHK-013 [P1] Code comments carry no packet, phase or requirement id: `rg -n 'REQ-|phase [0-9]' S/runtime S/scripts --glob '!**/fixtures/**'` prints nothing Evidence: the `rg` over the new and edited code printed nothing, exit 1.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist
<!-- FILL: Write one check per acceptance criterion. GOOD: CHK-020 [P0] `--keep 3` leaves 3 archives. WEAK: Tests pass. -->

- [B] CHK-020 [P0] Every row in `acceptance-criteria.md` is `Met` with its evidence named Blocked: AC-001, AC-002 and AC-011 stay Unmet, awaiting operator approval to load the launchd probe. The other ten are Met.
- [B] CHK-021 [P0] The probe was observed on a matching and a non-matching day [B] Blocked: awaiting operator approval to load the launchd probe.
- [x] CHK-022 [P1] The daylight-saving boundary case passes in the agreement test Evidence: `spring-forward boundary, 02:30 daily` passes, plus the explicit gap and repeat test.
- [x] CHK-023 [P1] A missing target makes the checker exit 2 Evidence: `node bot-check.cjs /nope` printed `FAIL: target-missing: /nope is not a folder`, exit 2.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security
<!-- FILL: Write one check per security surface. Write `N/A` with a reason when none applies. GOOD: CHK-030 [P0] `scripts/rotate-logs.sh` reads no credential. WEAK: Security is fine. -->

- [x] CHK-030 [P0] No hardcoded secrets in modules, fixtures or the probe plist Evidence: a case-insensitive `rg` for secret, token, password and api key over the new code, fixtures and scratch printed nothing, exit 1.
- [x] CHK-031 [P0] The checker writes nothing: a run over the fixtures leaves `git status --porcelain S` unchanged Evidence: the `git status --porcelain S` hash was identical before and after running the checker over all 14 fixtures; a test also compares the checked tree before and after.
- [x] CHK-032 [P1] The probe calls no runner and no agent: its `ProgramArguments` hold only `/bin/sh`, `-c` and a `date` append Evidence: `ProgramArguments` in `scratch/com.skilled.probe.weekday.plist` hold `/bin/sh`, `-c` and one `date` append.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation
<!-- FILL: Write one check per document that must agree. GOOD: CHK-040 [P1] `spec.md` and `tasks.md` both name `--keep <n>`. WEAK: Docs are updated. -->

- [x] CHK-040 [P1] `spec.md`, `plan.md` and `decision-record.md` name the same weekday rule and dictionary cap Evidence: `rg -n '128\|refuse'` finds the cap of 128 and the interim refuse rule in spec.md (In Scope), plan.md (section 5) and decision-record.md (ADR-001, ADR-002).
- [B] CHK-041 [P1] The probe record in `decision-record.md` holds dates, plist text and log lines [B] Blocked: awaiting operator approval to load the launchd probe.
- [B] CHK-042 [P2] The worked-example handoff to phase 1 is written when the probe forces a refusal [B] Blocked: awaiting operator approval to load the launchd probe. A provisional handoff for `0 9 * * 1-5` is already in implementation-summary.md.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization
<!-- FILL: Write one check per file location rule. GOOD: CHK-050 [P1] Test copies live under `scratch/test/`. WEAK: Files are organized. -->

- [x] CHK-050 [P1] Temp files in scratch/ only Evidence: temp files lived in the session scratchpad and test temp folders; the phase scratch holds only the probe plist and script.
- [x] CHK-051 [P1] scratch/ cleaned before completion Evidence: [DEVIATION: the probe plist and script stay in scratch on purpose, as the ready-to-run handoff the orchestrator asked for] nothing else is in it.
- [x] CHK-052 [P1] No file is written under any consumer `bots/` folder Evidence: tests copy fixtures into temp repositories; nothing writes a `bots/` folder in a consumer repository.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary
<!-- FILL: Count the boxes by priority and write the three totals. GOOD: P0 12, P1 13, P2 1. WEAK: Most items done. -->

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 9 | 6/9 |
| P1 Items | 11 | 10/11 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-11-22. CHK-004, CHK-020, CHK-021, CHK-041 and CHK-042 are blocked, awaiting operator approval to load the launchd probe.
<!-- /ANCHOR:summary -->

---
