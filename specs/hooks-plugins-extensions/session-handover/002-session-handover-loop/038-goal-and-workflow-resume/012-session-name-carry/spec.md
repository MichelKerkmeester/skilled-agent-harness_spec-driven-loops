---
title: "Feature Specification: Phase 12: session-name-carry"
description: "A Claude /rename is lost on a hop, because prepare takes the name from the launch environment and the wrapper never reads a name back from the record. Every receiver also gets the same name as the first session, and the wrapper's option lists claim a name flag for four runtimes whose help has none."
trigger_phrases:
  - "session name carry"
  - "phase 12 session name carry"
  - "hop count name suffix"
  - "claude rename across a hop"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 12: session-name-carry

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-11-13 |
| **Branch** | `main` (the build branch is chosen at the operator's greenlight) |
| **Parent Spec** | ../spec.md |
| **Phase** | 12 of 17 |
| **Predecessor** | 011-permission-mode-carry |
| **Successor** | 013-opencode-child-and-title |
| **Handoff Criteria** | Every acceptance row is Met, the relaunch suites exit 0, and `validate.sh 012-session-name-carry --strict` prints `RESULT: PASSED` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 12** of the State a session hop drops: running workers, session names, permission mode and schedules specification.

**Scope Boundary**: Session names across a hop for Claude and Pi, from research.md section 9 ranks 6, 9 and 11 and section 7 items 3 to 5. Five source files and five test files, named in the Files to Change table. Planned only: nothing is built until the operator gives the greenlight.

**Dependencies**:
- Phase 011 is built first. It also changes `.skilled/bin/skilled-loop` (the consume read and the Claude replay arguments) and `bin/session-relaunch.cjs` (`consume` output), so this phase rebases on 011's diff and must not reorder the arguments 011 adds.
- The relaunch suites pass at baseline before the first test edit.
- One scratch Claude session settles the open point in `REQ-001`. Starting it needs the operator, because this plan starts no runtime session.

**Deliverables**:
- A recorded answer to whether a launch `--name` alone writes a `custom-title` entry.
- `readClaudeSettings` that also returns the last `customTitle`.
- `prepare` that records the live Claude title before `SKILLED_LOOP_NAME`.
- `consume` that prints the record's `name`, and a wrapper that reads it back.
- A hop name with the receiver's session number, `<stem> (N)`, with no stacked suffix.
- Corrected comments on the `-n/--name` entries for Codex, Cursor, Devin and OpenCode.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A Claude session renamed with `/rename` loses that name on a hop. `prepare` records the name from `SKILLED_LOOP_NAME` alone, `consume` prints no `name`, and the wrapper replays the launch name, so every receiver carries the first session's name with no sign of which hop it is. The wrapper's option lists also say Codex, Cursor, Devin and OpenCode take `-n/--name`, under comments that say the lists follow each runtime's help, while their help has no such flag.

### Purpose
A receiver starts with the sender's live name plus its own session number, such as `Work (2)`, the suffix never stacks, and the option comments state what the wrapper really does.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior

```text
$ rg -n --sort path -F -e "name: process.env.SKILLED_LOOP_NAME || null," -e "for (const key of ['model', 'provider', 'effort'])" -e "name: record?.name ?? null," -e "return { model, effort };" -e 'launch_arguments+=(--name "$SKILLED_LOOP_NAME")' -e "codex:-n|codex:--name|cursor:-n|cursor:--name|devin:-n|devin:--name|" -e "opencode:-n|opencode:--name|codex:-m|codex:--model|codex:-n|codex:--name|" -e "# Matches this runtime's --help list of options that take a value." -e "# Identifies record-backed settings; the other option lists follow this runtime's --help." .skilled/hooks/session-relaunch/bin/session-relaunch.cjs .skilled/hooks/session-relaunch/lib/context-usage.cjs .skilled/bin/skilled-loop
.skilled/hooks/session-relaunch/bin/session-relaunch.cjs:560:    name: process.env.SKILLED_LOOP_NAME || null,
.skilled/hooks/session-relaunch/bin/session-relaunch.cjs:641:    name: record?.name ?? null,
.skilled/hooks/session-relaunch/bin/session-relaunch.cjs:793:  for (const key of ['model', 'provider', 'effort']) {
.skilled/hooks/session-relaunch/lib/context-usage.cjs:217:  return { model, effort };
.skilled/bin/skilled-loop:477:# Matches this runtime's --help list of options that take a value.
.skilled/bin/skilled-loop:495:      codex:-n|codex:--name|cursor:-n|cursor:--name|devin:-n|devin:--name|\
.skilled/bin/skilled-loop:590:# Identifies record-backed settings; the other option lists follow this runtime's --help.
.skilled/bin/skilled-loop:596:      opencode:-n|opencode:--name|codex:-m|codex:--model|codex:-n|codex:--name|\
.skilled/bin/skilled-loop:617:        launch_arguments+=(--name "$SKILLED_LOOP_NAME")
.skilled/bin/skilled-loop:632:        launch_arguments+=(--name "$SKILLED_LOOP_NAME")

$ rg -c '"custom-title"|customTitle' .skilled/hooks/session-relaunch/lib .skilled/hooks/session-relaunch/bin .skilled/bin/skilled-loop

$ for b in codex cursor-agent devin opencode, run: perl -e 'alarm 15' -e 'exec @ARGV' $b -n probe-name --version </dev/null, then print exit=$?
## codex
       codex [OPTIONS] <COMMAND> [ARGS]

For more information, try '--help'.
exit=2
## cursor-agent
2026.11.05-86047df
exit=0
## devin
Usage: devin [OPTIONS] [PATH]... [-- <PROMPT>...] [COMMAND]

For more information, try '--help'.
exit=2
## opencode
opencode v2.2.7
exit=0
```

The first `rg` exits 0 and the second prints nothing and exits 1. Each probe shows the last four lines of its output. `prepare` takes the name from the environment at `bin/session-relaunch.cjs:560`. Line 641 is `should-relaunch`, not `consume`: the `consume` loop at line 793 prints only model, provider and effort, so research.md section 4 is wrong that `consume` returns `name`. Line 217 of `context-usage.cjs` is the switch reader that `readClaudeSettings` (lines 229 to 255) returns through, and no relaunch source reads a `custom-title` entry. The wrapper replays the launch name unchanged for Claude (line 617) and Pi (line 632). Codex and Devin reject `-n` with a usage error, while Cursor and OpenCode print their version, so the version probe does not show whether those two accept `-n` in a real launch.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Confirm in one scratch Claude session whether a launch `--name` alone writes a `custom-title` entry, and record the answer.
- Return the last `customTitle` from `readClaudeSettings`, pass it through `resolveSessionSettings`, and record it in `prepare` before `SKILLED_LOOP_NAME`.
- Print the record's `name` from `consume`, read it in the wrapper, and fall back to the launch name when it fails the check.
- Replay the name on a Claude or Pi hop as `<stem> (N)`, where N is the receiver's session number, and strip the sender's own number so suffixes do not stack.
- Correct the two comments that say the `-n/--name` entries for Codex, Cursor, Devin and OpenCode follow each runtime's help.

### Out of Scope
- The OpenCode session title - phase 013 owns it.
- README text, including the sentence at `.skilled/hooks/session-relaunch/README.md:83` that says the name comes from the record - phase 017 owns it.
- Pi live names from the `sessionName` event field - research.md section 9 rank 6 names it as not covered, and it needs a Pi adapter change.
- A launch name on Codex, Cursor or Devin - their help has no name flag, so nothing can carry one.
- Refusing `-n` at a first Codex or Devin launch - the runtime already exits 2, and no hop follows.
- Permission mode - phase 011 owns it.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/hooks/session-relaunch/lib/context-usage.cjs` | Modify | `readClaudeSettings` also returns `name`, the last `customTitle` in the transcript tail. |
| `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs` | Modify | `resolveSessionSettings` passes `name` through and returns `name: ''` when nothing is proven. |
| `.skilled/hooks/session-relaunch/bin/session-relaunch.cjs` | Modify | `prepare` prefers the live name. `consume` prints a non-empty `name`. |
| `.skilled/bin/skilled-loop` | Modify | Read `name` from consume, build the numbered hop name, correct the two option comments. |
| `.skilled/hooks/session-relaunch/tests/context-usage.test.cjs` | Modify | Custom title tests. |
| `.skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs` | Modify | Prepare and consume name tests. |
| `.skilled/hooks/session-relaunch/tests/skilled-loop-wrapper-harness.cjs` | Modify | The stub record takes a `RECORD_NAME` override. |
| `.skilled/hooks/session-relaunch/tests/skilled-loop-wrapper-launch-arguments.test.cjs` | Modify | Hop suffix tests and three amended guards. |
| `.skilled/hooks/session-relaunch/tests/skilled-loop-wrapper-claim-goal.test.cjs` | Modify | One amended guard for the goal hop name. |
| `.skilled/hooks/session-relaunch/tests/skilled-loop-wrapper-decline-manual.test.cjs` | Modify | The manual-versus-automatic guard expects the suffix only on the automatic hop. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The open point is settled before any code edit. One scratch Claude session started with `--name probe-name` and never renamed is read by entry type only, and `goal.md` section 4 records whether its log holds a `custom-title` entry. Existing logs do not settle it: 4 of 80 project logs start with a `custom-title` entry before any user entry, which fits a launch name writing one but does not prove which flags started them. The plan holds either way, because the stem rule in `REQ-005` strips a carried number. |
| REQ-002 | `readClaudeSettings` in `lib/context-usage.cjs` returns `name`, the `customTitle` of the last `custom-title` entry with a non-empty string title, searched with the widening tail reader up to its 16 MiB cap. With no such entry, `name` is `''`, and a log with only a title returns it instead of `null`. Test `readClaudeSettings returns the last custom title` in `.skilled/hooks/session-relaunch/tests/context-usage.test.cjs` writes two titles and an assistant turn after them and asserts the second title. Today `name` is `undefined`. |
| REQ-003 | `prepare` in `bin/session-relaunch.cjs` records `settings.name` when it is non-empty, and `SKILLED_LOOP_NAME` otherwise. `resolveSessionSettings` in `lib/relaunch-core.cjs` carries `name` and returns `name: ''` on every path that proves nothing. Test `prepare records the Claude custom title over SKILLED_LOOP_NAME` in `.skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs` sets `SKILLED_LOOP_NAME=launch`, writes a log with `customTitle: "renamed"`, and asserts `record.name` is `renamed`. Today it is `launch`. |
| REQ-004 | `consume` in `bin/session-relaunch.cjs` prints `name` when the record holds a non-empty string, and no key otherwise. Test `consume reports the record name` in `.skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs` asserts `name: "Work"` in the output. Today the key is absent. |
| REQ-005 | On a Claude or Pi hop, `.skilled/bin/skilled-loop` builds the name from the consumed `name`, or from `SKILLED_LOOP_NAME` when the consumed value is empty, starts with `-` or holds a control character. With H the hop count after the increment at line 1194, the stem is that name with a trailing ` (H)` removed only when H is 2 or more. The wrapper exports the stem as `SKILLED_LOOP_NAME` and replays `--name "<stem> (H+1)"`. Tests in `.skilled/hooks/session-relaunch/tests/skilled-loop-wrapper-launch-arguments.test.cjs`: `a Claude hop numbers the replayed name` (launch `X`, receiver `X (2)`), `a hop replays the sender's live name with the next number` (record name `Renamed`, receiver `Renamed (2)`), `a second hop replaces the sender's number instead of stacking it` (record name `X (2)` at hop 2, receiver `X (3)`), `a name that ends in another number keeps it` (record name `Phase (7)` at hop 1, receiver `Phase (7) (2)`), `a consumed name that fails the check falls back to the launch name` and `a Pi hop numbers the replayed name`. |
| REQ-006 | The manual command keeps the stem with no number, because a manual claim starts a new wrapper whose hop count starts at 0. Test `the manual command carries the name stem without a number` in `.skilled/hooks/session-relaunch/tests/skilled-loop-wrapper-launch-arguments.test.cjs` asserts the printed command holds `--name X` and no `(2)`. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-007 | The comments at `.skilled/bin/skilled-loop` lines 477 and 590 say that `-n/--name` for Codex, Cursor, Devin and OpenCode is not in those runtimes' help and is listed only so a hop strips it. The entries stay, because the existing `forbiddenArguments` cases for Codex, Cursor and Devin in `skilled-loop-wrapper-harness.cjs` rely on the strip, and dropping them would turn a Cursor or OpenCode `-n` launch into an ambiguous one that never relaunches. `rg -n 'no name flag' .skilled/bin/skilled-loop` prints 2 lines. |
| REQ-008 | The guards whose expected hop name changes are amended in the same commit as `REQ-005`, and no other assertion in them changes: `second invocation uses only the seed and name, recorded cwd, and the same loop id`, `Claude carries --model value before the seed and name on relaunch` and `pi relaunch carries provider and model before name and seed` in `skilled-loop-wrapper-launch-arguments.test.cjs`, `a Claude hop with a goal starts on the goal command and carries the claim in the environment` in `skilled-loop-wrapper-claim-goal.test.cjs`, and `manual commands preserve carried flags and match automatic relaunch argv` in `skilled-loop-wrapper-decline-manual.test.cjs`, which now expects the automatic name to be the manual name plus ` (2)`. |
| REQ-009 | Every other existing relaunch test passes unchanged, including `second invocation omits --name when the first launch had no name`, `consume reports the model and effort the record holds and nothing it lacks`, and every `readClaudeSettings` test. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `goal.md` section 4 records the scratch session answer to whether a launch `--name` writes a `custom-title` entry.
- **SC-002**: `env -u AI_SESSION_CHILD node --test --test-name-pattern 'custom title|consume reports the record name' .skilled/hooks/session-relaunch/tests/context-usage.test.cjs .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs` exits 0 with `fail 0`.
- **SC-003**: `env -u AI_SESSION_CHILD node --test --test-name-pattern 'numbers the replayed name|live name with the next number|instead of stacking|ends in another number|fails the check falls back|name stem without a number' .skilled/hooks/session-relaunch/tests/skilled-loop-wrapper-launch-arguments.test.cjs` exits 0 with `fail 0`.
- **SC-004**: `env -u AI_SESSION_CHILD node --test .skilled/hooks/session-relaunch/tests/*.test.cjs` exits 0 with `fail 0`.
- **SC-005**: `rg -n 'no name flag' .skilled/bin/skilled-loop` prints 2 lines.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 011 edits the same wrapper and CLI | A rebase conflict in `consume` or in the Claude replay arguments | Build 011 first and rerun its wrapper tests after this phase's edits |
| Dependency | One scratch Claude session for `REQ-001` | The open point stays UNCONFIRMED | The stem rule works either way. The answer only decides whether the strip runs on the normal path |
| Risk | An operator name that really ends in ` (H)` loses it on hop H | Low | The strip runs only for the sender's own number H, from hop 2 on, so `Phase (7)` keeps its number at every hop but the seventh |
| Risk | A title older than the 16 MiB tail cap is missed | Low | The reader falls back to `SKILLED_LOOP_NAME`, as today |
| Risk | The widening search reads up to 16 MiB in an unnamed long session | Medium | Measure `prepare` time on a large log before and after, and record both numbers in `goal.md` |
| Risk | A test passes for the wrong reason | High | Record each failing run in `scratch/red.txt` and the passing run in `scratch/green.txt` |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: `prepare` on a Claude log with no title stays within 200 ms of its baseline on the same 16 MiB log, measured with `/usr/bin/time` before and after.
- **NFR-P02**: N/A: no throughput path changes.

### Security
- **NFR-S01**: N/A: no credential path changes.
- **NFR-S02**: A consumed name that starts with `-` or holds a C0 control character or DEL is never replayed, so it cannot become an option or break the printed manual command.

### Reliability
- **NFR-R01**: N/A: no service and no uptime target.
- **NFR-R02**: A transcript that cannot be read yields `name: ''`, and the hop goes on with the launch name.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: no launch name and no title gives no `--name` on the hop, as the guard `second invocation omits --name when the first launch had no name` holds today.
- Maximum input: at hop 10 a name `X (10)` from the sender becomes `X (11)`, and the stem never grows.
- Failure path: a consumed name `-x` or `a<newline>b` is ignored with a warning on stderr and the launch name is used.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 9/25 | Four source files and six test files, no new module |
| Risk | 6/25 | The hop argv changes for every named Claude and Pi loop, and five guards change their expected name |
| Research | 5/20 | One open point needs a live session, the rest is read from code and help |
| **Total** | **20/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Does a launch `--name` alone write a `custom-title` entry? UNCONFIRMED. `REQ-001` settles it in one scratch session before the first edit.
- Do Cursor and OpenCode accept `-n` in a real launch? UNCONFIRMED, since the version probe exits before any launch. Decision: no answer changes this phase, because the entries stay and only their comments change.
<!-- /ANCHOR:questions -->

---
