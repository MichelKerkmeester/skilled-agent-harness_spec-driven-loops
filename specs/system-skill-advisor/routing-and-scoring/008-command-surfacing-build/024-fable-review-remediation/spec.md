---
title: "Feature Specification: Phase 24: fable-review-remediation"
description: "The review of 2026-11-14 found that every Codex shell step reaches the transcript scorer with no command text, that two refusal wordings still get a command and three real requests lose theirs, that a question after a question mark still gets a start offer, that a command on the partner side counts as offered and that the shell-read rule counts a search and a heredoc line and misses a read after cd. This phase fixes each one, test first, and rescores the stored Codex sessions."
trigger_phrases:
  - "fable review remediation"
  - "phase 24 fable review remediation"
  - "codex shell steps without command text"
  - "refusal wording mention reader"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 24: fable-review-remediation

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill every row: level, priority, status, date and branch. Use the real branch name. GOOD: Priority P1. Status Draft. Branch `feat/rotate-logs-keep`. WEAK: Priority TBD. Status maybe. -->

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-11-14 |
| **Branch** | `worktrees/352-command-surfacing-research` |
| **Parent Spec** | ../spec.md |
| **Phase** | 24 of 25 |
| **Predecessor** | 023-untuned-outcome-evidence |
| **Successor** | 025-release-notes-and-doc-sync |
| **Handoff Criteria** | Every task in `tasks.md` is `[x]`, the advisor suite, the session reader tests and the history lookup tests report 0 failed, the mention probe prints `SHIPPED: 46 of 46 agree`, `scratch/rescore-delta.txt` names the Codex start rate before and after, the five floors equal their before lines and strict validation prints `RESULT: PASSED` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 24** of the build that makes the skill advisor surface every tracked slash command with a run, start or ask policy on every supported CLI (`../spec.md`). The packet exists so an AI that works through skills stays free to choose the command path or the skill path and lands on the best correct workflow more often, never an improvised one. A read-only Fable 5.2 review at 11:40 on 2026-11-14 (`../review/fable-review-2026-11-14-1140/report.txt`) judged the packet on course and not ready to close. It left two P1 and seven P2 findings, and the Opus task checks of phases 020 and 021 carried four more items (`../scratch/carry-to-review.md`). The coordinator handled findings 2, 3 and 8, the `sed -i` part of finding 7 and the row-0 carry item. This phase takes the rest.

**Scope Boundary**: the Codex session reader with its test and its folder README, the mention reader in `command-attach.ts` with its test, the transcript scorer with its test and the routing-accuracy README. No corpus row, no committed baseline, no behaviour run, no model session, no `AGENTS.md` edit and no edit to another phase folder. The scorer file is being built by phases 022 and 023, so no task on it starts before phase 023 is Complete.

**Dependencies**:
- Phases 020 and 021 are Complete and committed, because lane A edits the mention reader phase 020 built (T001 checks).
- Phases 022 and 023 are Complete and committed before lane S starts, because all three phases edit `score-command-transcripts.mjs` (T003 checks).
- The stored Codex sessions of the before and after arm are still readable under the Codex home folder (T002 reruns the probe).

**Deliverables**:
- A Codex reader that keeps the body of a custom tool call, and a scorer that reads the shell commands out of it.
- A mention reader that reads `no need to run` and `stop using` as refusals, reads `why not use`, a later `run it` and a statement before a request as requests, and ends a sentence at a question mark.
- A scorer that does not count a search or a heredoc line as a load, follows a `cd` inside one command and does not count a command on the partner side as offered.
- `scratch/rescore-delta.txt` with the Codex start rate and load rate before and after, and one row in the parent goal log that states whether criterion 3's Codex number moved.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
<!-- FILL: State the problem in two sentences: what breaks, and for whom. GOOD: The rotate-logs script never deletes old archives, so a host that copies `logs/archive` fills its disk. WEAK: The script has issues with output. -->

### Problem Statement
Codex runs its shell through a custom tool whose body is JavaScript, the session reader drops that body and the scorer therefore sees 58 shell steps with no command text in the before arm, so a Codex run can never show a load. The mention reader still hands a command to a reader who wrote `no need to run` or `stop using`, and withholds one from a reader who wrote `I have not run it yet, please start it`. A reader of the packet's numbers cannot trust a Codex row, and a person who refused a command still gets it.

### Purpose
A Codex shell step reaches the scorer with its command text, a refusal loses its command and a real request keeps it, and the measure counts only a read as a load, so the stored runs and the brief both say what happened.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
<!-- FILL: Run the command this change affects and paste the command and its verbatim output. Quote every number the spec states about current behavior from this block. Write `N/A:` and a reason when no command applies. GOOD: `bash scripts/rotate-logs.sh` with 10 archives, then `ls logs/archive | wc -l` prints 10. WEAK: The script deletes old logs. -->
```text
# node scratch/planning/probe-codex-shell.mjs, 2026-11-14, over ../007-per-runtime-behaviour-proof/scratch/runs-pre.jsonl.
# Counts only. Body shape lines are left out here and kept in scratch/planning/probe-codex-shell.before.txt.
codex lines: 24
custom tool call name:exec: 58
custom tool calls: 58
custom tool calls with an input string: 58
exec bodies the planned helper reads no command from: 8
of those, read before the first write: 4
owned rows: 16
path now:none: 16
path with the body read:command: 2
path with the body read:none: 12
path with the body read:skill: 2
sessions read: 24
sessions whose wrote fact changes: 0
sessions with a shell read of a skill or command document: 4
shell events: 58
shell events with no command text: 58
started now: 0
started with the body read: 0
tools called inside exec bodies: exec_command=65, mcp__codex_apps__github_fetch=1, web__run=4

# The same probe over runs-post.jsonl (scratch/planning/probe-codex-shell.post.txt).
shell events: 53
shell events with no command text: 53
path now:none: 16
path with the body read:command: 1
path with the body read:none: 13
path with the body read:skill: 2
started now: 0
started with the body read: 0

# node --import ./.skilled/skills/system-spec-kit/node_modules/tsx/dist/loader.mjs scratch/planning/probe-mention-reader.mts, last two lines.
SHIPPED: 40 of 46 agree
PLANNED: 46 of 46 agree

# node ../020-command-offer-fit-guards/scratch/planning/probe-offers.mjs --top-only --file scratch/planning/review-prompts.json, row 0 of each prompt.
PROMPT: no need to run /doctor:setup, the hooks are fine
  row 0: command-doctor-setup 0.826/0.16 command=/doctor:setup policy=run owner=system-skilled-doctor ambiguous=false
PROMPT: stop using /create:changelog for this, write the changelog entry by hand
  row 0: sk-doc 0.8923/0.12 command=/create:changelog policy=ask owner=sk-doc ambiguous=false
PROMPT: I have not run /speckit:plan yet, please start it for the login feature
  row 0: system-spec-kit 0.82/0.22 command=- policy=- owner=- ambiguous=false
PROMPT: I already ran /create:readme but the output was wrong, run it again for the hooks folder
  row 0: sk-doc 0.9175/0.12 command=- policy=- owner=- ambiguous=false
PROMPT: why not use /create:agent for this? go ahead and make a security reviewer agent
  row 0: sk-doc 0.82/0.22 command=- policy=- owner=- ambiguous=false
PROMPT: quick question? is /speckit:resume safe to run twice
  row 0: system-spec-kit 0.8218/0.16 command=/speckit:resume policy=start owner=system-spec-kit ambiguous=false

# node scratch/planning/probe-shell-read-rule.mjs, the hand-built events and both stored arms.
rg over the owner entry document: skill
grep over the owner entry document: skill
rg whose pattern is the document name: none
heredoc body line that starts with a reader: skill
heredoc body line that starts with head: skill
cd into the skill folder, then cat: none
cd into the mode folder, then sed: none
cd elsewhere, then cat a bare name: none
cat with the full path, the control: skill
claude: owned=32, loads resting on rg or grep alone=0, cd then a bare document name=0, heredoc body line with a reader verb=0
codex: owned=16, loads resting on rg or grep alone=0, cd then a bare document name=0, heredoc body line with a reader verb=0
devin: owned=32, loads resting on rg or grep alone=0, cd then a bare document name=0, heredoc body line with a reader verb=0
dsh: owned=31, loads resting on rg or grep alone=0, cd then a bare document name=0, heredoc body line with a reader verb=0
opencode: owned=32, loads resting on rg or grep alone=1, cd then a bare document name=0, heredoc body line with a reader verb=0
pi: owned=32, loads resting on rg or grep alone=1, cd then a bare document name=1, heredoc body line with a reader verb=1

# rg -c "offeredAs" over score-command-transcripts.mjs prints nothing: the scorer never reads the field.

# node --import ./.skilled/skills/system-spec-kit/node_modules/tsx/dist/loader.mjs scratch/planning/probe-skill-label.mts.
needs-mode hub, label sent as the hub: Advisor: live; use sk-doc (needs a mode) 0.91/0.12 pass.
needs-mode hub, no label sent: Advisor: live; use sk-doc (needs a mode) 0.91/0.12 pass.
same head with and without the label: true
failing row 0, label taken from row 0: Advisor: live; use sk-git 0.82/0.20 pass.
failing row 0, label taken from the first passing row: Advisor: live; use sk-code 0.82/0.20 pass.
CLI rows over 5 prompts: 10, below the bars: 0, row 0 below the bars: 0

# node scratch/planning/probe-plugin-flake.mjs 20.
termination grace test: 20 passed, 0 failed of 20 runs, slowest process 251 ms

# jq -c 'select(.id=="sv-09" or .id=="sv-11" or .id=="sv-12") | del(.prompt)' over command-prompts.jsonl.
{"id":"sv-09","row_type":"slash-variant","split":"none","expected_command":"/speckit:resume","expected_top":null,"expected_policy":null,"source":"authored-deepseek"}
{"id":"sv-11","row_type":"slash-variant","split":"none","expected_command":"/doctor:git","expected_top":null,"expected_policy":null,"source":"authored-deepseek"}
{"id":"sv-12","row_type":"slash-variant","split":"none","expected_command":"/prompt:improve","expected_top":null,"expected_policy":null,"source":"authored-deepseek"}
```
<!-- /ANCHOR:measured-behavior -->

The Codex probe hands the body to the scorer the way T011 plans to, so its `path with the body read` lines are a forecast and not a result. T021 prints the result from the committed scorer. The shell-read probe runs on the scorer as phase 022 has it mid-build, so its stored counts may shift by the time lane S starts.

### Mechanism per Finding

| Finding | Where it comes from | Decision |
|---------|---------------------|----------|
| 1, Codex shell steps carry no command text | `codex.mjs` `recordsFromLines` parses `payload.arguments`, which a custom tool call does not have. Its body is the string `payload.input`. The scorer's `normalize` reads a `command` key only | Fix. The reader keeps the body as `arguments.input` (T009). The scorer reads the `cmd` strings of an `exec` body as that step's command, one per line (T011). Both arms are rescored and the Codex start rate is restated (T021) |
| 4, refusal wording not read as a refusal | `COMMAND_DECLINE_LEADS` holds no `no need to` lead, and `stop using` fails because `using` is not a use verb and `stop` is not a skip word | Fix (T004, T005) |
| 5, `not ... run`, `ran` and `why not` withhold a real request | The first decline lead matches `not run` and `not use` wherever they stand, and the `ran` ask lead has no way back | Fix. `not` after `why` is no refusal (T006). A later clause that opens with a use verb and `it` asks for the named command (T007) |
| P022, a bare ask word after a question mark | The sentence-start set of the bare lead holds `.`, `!` and a line break | Fix, reverses P022 as P024 (T008). A comma stays out, because a comma ends a clause and not a sentence, and no prompt reproduced it |
| 6, `offeredAs` never read | `offerOf` reads `offeredCommand` alone | Fix. A command on the partner side is not counted as offered and gets its own count (T015, T016). A stored line has no `offeredAs`, so no stored number moves, and no backfill is planned because a replay today would print the head of today's code |
| 7, `rg` or `grep` counts as a load | Both verbs are in `SHELL_READERS` | Fix. A search prints matching lines, not the workflow (T012). Two stored runs rest on a search alone |
| 7, a heredoc body line counts | `shellReadTargets` splits on line breaks and reads a body line as a command | Fix (T013). One stored run holds the shape |
| 7, `cd dir && cat SKILL.md` is missed | The bare name carries no folder, so the owner pattern fails | Fix. A `cd` earlier in the same command names the folder (T014). One stored run holds the shape |
| 7, `sed -i` counts | Handled by phase 022 T032 | Not planned here |
| 9, rows sv-09, sv-11 and sv-12 keep `expected_command` | The three rows name a full command inside a question, and phase 020 withholds a command there by design | Declined as a build task, waits on the operator. A relabel to no command moves the three rows into the false-offer tally (`capture-command-routing-baseline.mjs`, the `wantsSilence` branch), so the floor `0 of 35` in completion criterion 2 would read `0 of 38`. That criterion is the operator's. T017 states the three designed withholds in the README instead |
| Carry, OpenCode plugin always fills `skillLabel` | The renderer's owner fallback runs only with no label | Declined. The probe prints the same head with and without the label, because the handler marks `needsMode` on hub ids only and a hub owns itself |
| Carry, Claude hook `skillLabelFor` falls back to row 0 | The label goes to the diagnostic record, and the brief builder also labels row 0 | Declined. A wrong label needs a row 0 below the bars, and the scorer drops such rows before the handler (goal log row "Row-0 route lookup"). The probe counts 0 of 10 CLI rows below the bars |
| Carry, timing-flaky plugin test | `elapsedMs < 200` on a 40 ms timeout | Fixed in T024 after T002 showed it: 2 of 20 runs failed under load. The test checks the delays the plugin scheduled, decision P032 |
| Carry, row-0 route lookup | Probed by the coordinator | Not reachable, no task |
| 2, 3, 8 | Handled by the coordinator in phase 022 and the goal log | Not planned here |

---

<!-- ANCHOR:scope -->
## 3. SCOPE
<!-- FILL: List three to five things this change does, each starting with a verb. Before you list a new file, module, option, layer or dependency, name what fails today without it, or drop it. GOOD: Add a `--keep <n>` option that deletes all but the newest n archives in `logs/archive/`. WEAK: Update the script and docs. -->

### In Scope
- Keep the body of a Codex custom tool call in the neutral record and read its shell commands in the scorer.
- Read two more refusal wordings as refusals and three request wordings as requests in the mention reader, and end a sentence at a question mark.
- Stop counting a search and a heredoc line as a load, and follow a `cd` inside one shell command.
- Stop counting a command on the partner side of an ambiguous head as offered.
- Rescore both stored arms with the committed scorer and state the Codex start rate before and after.

### Out of Scope
- A relabel of rows sv-09, sv-11 and sv-12 - it changes the denominator of a floor a completion criterion quotes. It waits on the operator.
- A backfill of `offeredAs` onto stored run lines - the head a stored run saw cannot be replayed from today's code.
- A fix for the two skill label fallbacks - neither produced a wrong output in a probe. The plugin timing test is in scope through T024, decision P032.
- A new behaviour run, the Codex-only arm included - it waits on the operator.
- The release notes and the reference pages - phase 025.

### Files to Change

`ADV` is `.skilled/skills/system-skill-advisor/runtime`, `RAD` is `ADV/scripts/routing-accuracy` and `SR` is `.skilled/hooks/shared`.

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `SR/session-readers/codex.mjs` | Modify | A custom tool call keeps its body |
| `SR/tests/session-readers/codex.test.mjs` | Modify | Two cases for the tool call arguments |
| `SR/session-readers/README.md` | Modify | One sentence on the body of a Codex custom tool call |
| `ADV/lib/command-attach.ts` | Modify | The decline leads, the `not` word, the pronoun request and the sentence start |
| `ADV/tests/command-attach-guards.vitest.ts` | Modify | One case per wording and one guard per edit |
| `RAD/score-command-transcripts.mjs` | Modify | The Codex body reader, the three shell-read edits, `offerOf` and one count |
| `ADV/tests/command-transcript-score.vitest.ts` | Modify | One case per rule |
| `RAD/README.md` | Modify | The new rules and the three designed withholds |
| `.opencode/plugins/tests/system-skill-advisor.test.cjs` | Modify | The timing test checks the scheduled termination delays, the plugin itself is not edited |

No new file, module, option or dependency. The two helpers this phase adds sit in files that already hold their only caller.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
<!-- FILL: Write one testable requirement per row. Name the exact command or output. GOOD: With 10 archives, `bash scripts/rotate-logs.sh --keep 3` exits 0 and `ls logs/archive | wc -l` prints 3. WEAK: The option should work well. -->
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `loadSession` on a Codex rollout returns a `custom_tool_call` whose `arguments` equal `{ input: <the body string> }`, and a `function_call` keeps its parsed JSON arguments. The session reader tests and the two history lookup test files report 0 failed. |
| REQ-002 | `normalize` on a Codex `exec` call whose body holds `tools.exec_command({cmd:"..."})` returns a shell or write event whose `command` holds each `cmd` string on its own line, and a body that calls no shell tool stays one shell event with a null command. |
| REQ-003 | Typed recall stays at least 24 of 44 and false offers stay 0 of 35, and the five `FLOOR` lines equal their before lines. |
| REQ-004 | The summary over `runs-pre.jsonl` and `runs-post.jsonl` prints a Codex start rate for each arm, and the parent goal log states both values beside the values before this phase. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | `commandOnlyMentioned` returns `true` for the two refusal prompts and the question-mark prompt of the review, and `false` for its three request prompts. Every case the test file held before this phase still passes. |
| REQ-006 | `workflowPath` returns `none` for a lone `rg` or `grep` over the owner's entry document and for a heredoc body line that names it, and `skill` for `cd <skill folder> && cat SKILL.md`. |
| REQ-007 | A run line whose `offeredAs` is `partner` is not counted in `offered`, a line with no `offeredAs` is counted as before, and the summary holds the count `offeredAsPartner`. |
| REQ-008 | For every runtime and arm the count identity of phase 022 still prints `true` and the load-rate denominators equal their before values. `scratch/rescore-delta.txt` holds one line per runtime and arm with a reason for each changed count. |
| REQ-009 | The README of the routing-accuracy scripts states the Codex body rule, the three shell-read rules, the partner rule and the three slash-variant rows that carry no command by design. |
| REQ-010 | No code comment added by this phase names a spec path, a phase, a task, a finding or a requirement id, and the phase diff touches no corpus file, no committed baseline and no `AGENTS.md`. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
<!-- FILL: Write one measurable outcome per line. A command can prove it. GOOD: With 10 archives in `logs/archive`, `bash scripts/rotate-logs.sh --keep 3` leaves 3. WEAK: The feature is successful. -->

- **SC-001**: `node scratch/planning/probe-codex-shell.mjs` prints `shell events with no command text` as a count below its `shell events` count, where both read 58.
- **SC-002**: The mention probe prints `SHIPPED: 46 of 46 agree`, where it printed 40 of 46.
- **SC-003**: `scratch/rescore-delta.txt` holds the Codex start rate of both arms before and after, and the parent goal log repeats them.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
<!-- FILL: Name one dependency and one risk. Give each a concrete mitigation. GOOD: A script that reads `--keep` with no value could delete every archive. Mitigation: reject a missing value with exit 2 and test it. WEAK: There may be some risk. -->

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phases 022 and 023 are still building the scorer file | A parallel edit loses work | T003 holds lane S until both read Complete and the file is clean in `git status` |
| Dependency | The stored Codex rollouts under the Codex home folder | T021 cannot rescore | T002 reruns the probe first. The unit tests still prove each rule |
| Risk | The Codex reader is shared with the history lookup and four hooks | High: a changed record shape breaks a reader that is not in this packet | The record keeps its shape, `arguments` stays an object and only one key is added. T009 and T018 run the reader tests and the history lookup tests |
| Risk | A new refusal lead withholds a real request | Med: a person who asked for a command loses it | Each edit ships with a guard case that must stay a request, and the planned patterns agree with all 46 probe cases, 32 of them the cases the test file already pins |
| Risk | A changed mention reader moves a row of the committed baseline | Med: the slice test fails | T019 compares the floors and names the moved row ids without a prompt. A recapture is the coordinator's decision, never a worker's |
| Risk | A rescored Codex number is read as an outcome | High: the rows are tuned, each ran once and Codex received no brief | T021 writes counts and reasons only, and the goal log row starts with those limits |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- FILL: Name one measurable limit per line. Write `N/A` and one reason when the packet runs no service, or delete the whole section. GOOD: The option adds under 5 ms to a run. WEAK: Performance is good. -->
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: The mention reader stays one pass per named command, and the scorer stays one pass over a run's events.

### Security
- **NFR-S01**: The scorer still refuses a holdout row before it reads a prompt, no probe or task prints a prompt, and the corpus is read only through `jq 'del(.prompt)'`.

### Reliability
- **NFR-R01**: A Codex rollout written before this phase still loads, and a tool call with neither `arguments` nor `input` keeps an empty object.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES
<!-- FILL: Name the empty input, the maximum input and the failure path. One line each. Write `N/A` with one reason, or delete the whole section. GOOD: Empty input: an empty `logs/archive/` deletes nothing and exits 0. Maximum: `--keep 3` over 10,000 archives keeps the newest 3. Failure path: a missing `--keep` value exits 2 with usage. WEAK: Handle edge cases. -->

- Empty input: an `exec` body that calls no shell tool, such as a web search, stays one shell event with a null command, as it is today.
- Maximum input: an `exec` body that runs several commands becomes one event whose command holds one command per line. A body that holds a gate lookup and a task command reads as a gate step, which the README states as a limit.
- Failure path: an `exec` body whose commands sit in a list has no `cmd` string, so every string of that body is read as a command line. One of 58 stored bodies has that shape.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT
<!-- FILL: Score each row with the number the change earns. The total must match the level. Write `N/A` with one reason, or delete the whole section. GOOD: Scope 6/25: one option in `scripts/rotate-logs.sh`. Total 18/100. WEAK: Complexity is medium. -->

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 13/25 | Eight files, about 420 lines with tests |
| Risk | 12/25 | One shared reader with five other consumers, one prompt-facing reader |
| Research | 10/20 | Every finding reproduced by a probe, three carry items declined on probe output |
| **Total** | **35/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS
<!-- FILL: Write each open question as one line. Write `None` when nothing blocks. GOOD: Does a missing `--keep` value delete every archive? Decision: no, a missing value exits 2. WEAK: Edge cases are unclear. -->

- Level: `recommend-level.sh --loc 420 --files 12` printed Level 1. Decision: Level 2, because the closure gate is `acceptance-criteria.md`, as in phases 020 to 023.
- WAITING ON OPERATOR: relabel rows sv-09, sv-11 and sv-12 to no command. Options: (a) keep the labels and state the three designed withholds in the README, which T017 does, (b) relabel them, recapture the baseline and reword completion criterion 2 to `0 of 38`, (c) give a question about a command its own row type. Recommendation: (a), because (b) files a full command name under partial mentions and moves a floor the operator set, and phase 023 already counts this class on sealed `decline` rows.
- Is a search over a workflow document a load? Decision: no. A search prints the lines that match a word, and the measure counts a workflow that was opened. The two stored runs that move are named in `scratch/rescore-delta.txt`.
- Does the Codex start rate move? Forecast: no, the probe prints 0 started with the body read in both arms. T021 prints the result.
<!-- /ANCHOR:questions -->

---


