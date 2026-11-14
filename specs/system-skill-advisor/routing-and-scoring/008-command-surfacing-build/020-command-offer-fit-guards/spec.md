---
title: "Feature Specification: Phase 20: command-offer-fit-guards"
description: "The advisor hands a command to prompts where no command fits. A command the reader only refuses or asks about still arrives with a start policy, a typo fix gets a creation workflow, an app problem that shares doctor words gets a doctor command, a no-edit request gets a command that writes and a meaning match the hooks drop still counts as passing. This phase withholds the command in each case and keeps the skill."
trigger_phrases:
  - "command offer fit guards"
  - "phase 20 command offer fit guards"
  - "withhold a command where none fits"
  - "command only mentioned"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 20: command-offer-fit-guards

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
| **Phase** | 20 of 23 |
| **Predecessor** | 019-workflow-outcome-measure |
| **Successor** | 021-brief-head-parity |
| **Handoff Criteria** | Every task in `tasks.md` is `[x]`, the advisor suite reports 0 failed, every floor line equals its line in `scratch/before.txt`, `scratch/repro-after.txt` holds the after counts T014 names and strict validation prints `RESULT: PASSED` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 20** of the build that makes the skill advisor surface every tracked slash command with a run, start or ask policy on every supported CLI (`../spec.md`). The operator's core need is that an AI working through skills stays free to choose and lands on the best correct workflow more often. A command offered where none fits pulls the model off the skill path, which works against that need. Two read-only alignment reviews of 2026-11-14 (`../review/fable-alignment-2026-11-14/`) found five such cases. This phase fixes the ones a probe reproduced.

**Scope Boundary**: three source files (`lib/command-attach.ts`, `lib/scorer/fusion.ts`, `lib/scorer/doctor-helper-handoff.ts`) and three existing test files in the advisor runtime. No renderer, handler, plugin, corpus row, committed baseline, hook, `AGENTS.md` wording or model run.

**Dependencies**:
- The advisor suite is green on the start commit and the five floor lines are recorded, the sealed plain count among them (T001).
- The two planning probes in `scratch/planning/` still print the lines T002 names.
- Phase 021 edits the renderer, the recommend handler and the OpenCode plugin. The two phases share no file, so they may be built side by side.

**Deliverables**:
- `commandOnlyMentioned` in `lib/command-attach.ts`, read by the typed path, the hub attach path and the scorer.
- A small-edit gate on `/create:*` commands in `attachCommand`.
- Three scorer gates in `lib/scorer/fusion.ts`: a meaning pass that holds the uncertainty bar, a no-edit gate on every command that writes and a weak problem cue that no longer lowers the hand-off bar.
- Test cases written first for each, and `scratch/repro-after.txt` with the probe counts after the change.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
<!-- FILL: State the problem in two sentences: what breaks, and for whom. GOOD: The rotate-logs script never deletes old archives, so a host that copies `logs/archive` fills its disk. WEAK: The script has issues with output. -->

### Problem Statement
The advisor attaches a command whenever a prompt names one or a hub route picks its mode, without asking whether the reader wants that command. A reader who writes `do not run /speckit:complete yet, just explain what it does` gets `/speckit:complete` with a `start` policy, and `update the README typo in line 3` gets the README creation workflow. The doctor hand-off also reads the bare words `missing`, `broken` and `stale` as a toolkit problem, so `the environment variable for the database url is missing in production` gets `/doctor:env list` as its only recommendation. Each of these is a command where the skill path, or no path, was the best correct answer.

### Purpose
A prompt that refuses a command, asks about it, wants a small in-place edit, describes an ordinary app problem with a weak cue or rules out a change gets its skill and no unfit command, while every typed and plain request that gets its command today keeps it.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
<!-- FILL: Run the command this change affects and paste the command and its verbatim output. Quote every number the spec states about current behavior from this block. Write `N/A:` and a reason when no command applies. GOOD: `bash scripts/rotate-logs.sh` with 10 archives, then `ls logs/archive | wc -l` prints 10. WEAK: The script deletes old logs. -->
```text
# node scratch/planning/probe-offers.mjs, 2026-11-14, commit 16c9757ac0, advisor daemon live.
# Full output: scratch/planning/probe-offers.before.txt (26 prompts, 26 lines that hold command=/).
PROMPT: do not run /speckit:complete yet, just explain what it does
  row 0: command-speckit-complete 0.8225/0.16 command=/speckit:complete policy=start owner=system-spec-kit ambiguous=false
PROMPT: I never want to use /create:agent again, delete the agent file
  row 0: create:agent 0.82/0.16 command=/create:agent policy=start owner=sk-doc ambiguous=false
PROMPT: someone ran /speckit:save by accident, how do I undo what it wrote
  row 0: command-speckit-save 0.8709/0.16 command=/speckit:save policy=start owner=system-spec-kit ambiguous=false
PROMPT: please do not start /deep:research, I only want a two line summary of the readme
  row 0: system-deep-loop 0.8575/0.16 command=/deep:research policy=ask owner=system-deep-loop ambiguous=true
PROMPT: what does /create:readme do?
  row 0: sk-doc 0.95/0.12 command=/create:readme policy=start owner=sk-doc ambiguous=false
PROMPT: update the README typo in line 3
  row 0: sk-doc 0.927/0.12 command=/create:readme policy=start owner=- ambiguous=false
PROMPT: do not run it, just tell me what /doctor:update would change
  row 0: system-skilled-doctor 0.82/0.26 command=/doctor:update policy=ask owner=system-skilled-doctor ambiguous=true
  row 2: command-doctor-update 0.82/0.2 command=/doctor:update policy=ask owner=system-skilled-doctor ambiguous=true
PROMPT: the environment variable for the database url is missing in production
  row 0: command-doctor-env 0.8/0.34 command=/doctor:env list policy=run owner=system-skilled-doctor ambiguous=false
PROMPT: the install step in our dockerfile is broken, the overlay filesystem is stale
  row 0: command-doctor-overlay-status 0.8/0.34 command=/doctor:overlay status policy=run owner=system-skilled-doctor ambiguous=false
PROMPT: the trigger index lookup returns nothing for my packet, do not change anything
  row 2: command-doctor-speckit 0.82/0.22 command=/doctor:speckit policy=run owner=system-skilled-doctor ambiguous=false
PROMPT: my deep research loop never converges, dont touch anything just tell me why
  row 1: command-doctor-deep-loop 0.8/0.34 command=/doctor:deep-loop policy=run owner=system-deep-loop ambiguous=false
PROMPT: document the new skill and create a feature catalog for it
  row 0: command-doctor-sk-skill-convert 0.8/0.42 command=/doctor:sk-skill convert policy=ask owner=sk-doc ambiguous=false
  row 1: sk-doc 0.95/0.12 command=- policy=- owner=- ambiguous=false

# node --import <tsx loader> scratch/planning/probe-doctor-cue.mts. Full output: scratch/planning/probe-doctor-cue.before.txt
cue=weak first=/doctor:env list score=8.361 noEdit=false :: the environment variable for the database url is missing in production
cue=weak first=/doctor:overlay status score=6.529 noEdit=false :: the install step in our dockerfile is broken, the overlay filesystem is stale
cue=weak first=/doctor:mcp debug score=10.009 noEdit=false :: the mcp tool call fails with a wrong argument error in my weather server code
cue=strong first=/doctor:git hooks score=9.761 noEdit=false :: turn off the dark mode toggle in the settings page
cue=weak first=/doctor:runtime-mirrors score=14.255 noEdit=false :: the runtime mirrors are out of sync with .skilled
cue=weak first=/doctor:agents-md check score=15.398 noEdit=false :: AGENTS.md is missing the shipped sections
cue=weak first=/doctor:symlink link score=11.428 noEdit=false :: the symlink to the skilled checkout is broken
```
<!-- /ANCHOR:measured-behavior -->

### Mechanism per Finding

| Finding | Where it comes from | Fix |
|---------|---------------------|-----|
| A-8, B-9 first half, B-3 question case | `typedCommandForTop` and `attachCommand` attach any command the prompt names, and the command's own scorer row passes on the typed string | `commandOnlyMentioned` reads a refusal or a question about the command, and all three paths withhold it (T003 to T005, T008, T017, T018) |
| B-3 edit case | A hub route that picks the README mode attaches `/create:readme` whatever the size of the edit | `attachCommand` withholds a `/create:*` command when the prompt names a correction, such as a typo, a spelling or a broken link (T006). An edit that names no correction word is not gated |
| A-4 | `requireCommandPhraseAnchor` lifts a meaning match to the confidence bar and keeps its uncertainty of 0.42, above the 0.35 the hooks use | The meaning pass holds the uncertainty bar, so the scorer and the hooks agree (T007) |
| A-6 | `/doctor:speckit` and `/doctor:deep-loop` are `run` commands of class `add-only`, and neither the phrase path nor the hand-off checks the no-edit request | Every command row that is not `read-only` stops passing on a no-edit request (T009) |
| A-5, the two prompts with only a doctor row | A weak cue with no passing skill needs only the ranker score 6 | A weak cue needs the score 10 that a prompt with no cue needs (T010, T011) |

---

<!-- ANCHOR:scope -->
## 3. SCOPE
<!-- FILL: List three to five things this change does, each starting with a verb. Before you list a new file, module, option, layer or dependency, name what fails today without it, or drop it. GOOD: Add a `--keep <n>` option that deletes all but the newest n archives in `logs/archive/`. WEAK: Update the script and docs. -->

### In Scope
- Add `commandOnlyMentioned(prompt, command)` to `lib/command-attach.ts`. Without it nothing can tell `run /speckit:complete` from `do not run /speckit:complete`.
- Withhold a typed command the prompt refuses or asks about, on the typed path, the hub attach path and the command's own scorer row.
- Withhold a `/create:*` command from a prompt that asks for a small in-place edit.
- Hold a meaning-passed command to the uncertainty bar the hooks already apply.
- Stop a command that writes from passing on a no-edit request, and stop a weak problem cue from lowering the doctor hand-off bar.

### Out of Scope
- `/doctor:mcp debug` on `the mcp tool call fails ... in my weather server code` and `/doctor:helper` beside `sk-code` on `turn off the dark mode toggle` - the ranker scores both at 10.009 and 9.761, inside the range real toolkit problems score (7.491 to 23.471). Telling them apart needs the ranker to know the subject is foreign, which is the matching change the operator logged for a follow-up packet on 2026-11-13. Raising a bar to move two probes would be tuning on the probes.
- A plain request that clearly fits a command and gets no brief (B-11) - the same matching change, and it waits on the operator (parent goal log).
- The `run` policy of an `add-only` doctor command on a prompt that allows a change - the policy is derived from the risk class the inventory phase fixed, and this phase does not reopen it.
- An in-place edit that names no correction word - `change the title of the README in the hooks folder` and `add a troubleshooting section to the existing README` still return `sk-doc` with `/create:readme (start)` (`scratch/planning/verify-fix-probe.before.txt`). The small-edit gate reads correction wording only. Telling an edit of an existing document from a request to write one needs the route to know the document exists, which no word list can state, so the class is left to the head-wording decision that waits on the operator.
- A problem in the user's own project that shares a doctor target's words and scores above the bar - a class, not two prompts. Beside the two prompts above, `the symlink in my node_modules folder is broken after npm install` returns only `/doctor:symlink check (run)`. The weak-cue bar removes the low scores and leaves this class to the matching follow-up.
- A no-change wording `NO_EDIT_REQUEST` does not hold - T009 reads `isNoEditRequest` as it is, so `the trigger index lookup returns nothing for my packet, leave every file as it is` still returns `/doctor:speckit (run)`. Widening that pattern changes the existing attach gate and the read-only routes that share it, so it is not folded into this phase.
- The brief wording, the `Also:` line and the OpenCode head - phase 021.

### Files to Change

`ADV` is `.skilled/skills/system-skill-advisor/runtime`.

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `ADV/lib/command-attach.ts` | Modify | `commandOnlyMentioned`, two lead lists, the small-edit list, and the two gates in `typedCommandForTop` and `attachCommand` |
| `ADV/lib/scorer/fusion.ts` | Modify | The uncertainty bar in `requireCommandPhraseAnchor`, `withholdMentionedCommands`, `withholdWritingCommandsOnNoEdit`, the weak-cue line in `applyDoctorHelperHandoff` and their three calls in `scoreAdvisorPrompt` |
| `ADV/lib/scorer/doctor-helper-handoff.ts` | Modify | The header comment that states the cue rule |
| `ADV/tests/command-attach-guards.vitest.ts` | Modify | Cases for the mention reader, the typed gate, the attach gate and the small-edit gate |
| `ADV/tests/command-meaning-anchor.vitest.ts` | Modify | Cases for the uncertainty bar and the two scorer gates |
| `ADV/tests/scorer/doctor-handoff-command.vitest.ts` | Modify | Cases for the weak cue |
| `ADV/tests/scorer/typed-command-owner.vitest.ts` | Modify | One case: a refused typed command does not pull its owner first |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
<!-- FILL: Write one testable requirement per row. Name the exact command or output. GOOD: With 10 archives, `bash scripts/rotate-logs.sh --keep 3` exits 0 and `ls logs/archive | wc -l` prints 3. WEAK: The option should work well. -->
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The five floor lines and the eval line equal their lines in `scratch/before.txt`: typed recall at least 24 of 44, false offers 0 of 35, typed delivery 44 of 44, the plain tune count unchanged and the sealed plain count under the fixture regime unchanged. A lower sealed plain count under the real embedding is recorded with the task that caused it. |
| REQ-002 | `commandOnlyMentioned` returns `true` for the eight refusal and question prompts in the Measured Behavior block and for the two yes or no questions T003 names, and `false` for the six request prompts and the five controls T003 names, in which a refusal word or a question word sits near a real request. A lead gap holds letters and apostrophes only, so no lead crosses a comma. |
| REQ-003 | The advisor CLI returns no row that carries the command for the seven prompts that refuse or ask about a command, and `run /speckit:complete for the rate limiter` and `/create:agent security-reviewer` still lead with their command. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | `update the README typo in line 3` and `fix the typo in the README` return `sk-doc` with no command, and `write a readme for the doctor scripts folder` still returns `sk-doc` with `/create:readme`. The gate covers correction wording only: an edit that names no correction word keeps its command and is listed under Out of Scope. |
| REQ-005 | A meaning-passed command row whose uncertainty is above the threshold does not pass, so `document the new skill and create a feature catalog for it` leads with `sk-doc`. |
| REQ-006 | On a no-edit request no command row of class `add-only` or `mutates` passes, and a `read-only` command row still passes. |
| REQ-007 | A weak problem cue with no passing skill hands off only at ranker score 10 or more, so the two app-problem prompts return no recommendation and the three weak-cue toolkit prompts in the probe keep their doctor command. |
| REQ-008 | No code comment added by this phase names a spec path, a phase, a task, a finding or a requirement id. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
<!-- FILL: Write one measurable outcome per line. A command can prove it. GOOD: With 10 archives in `logs/archive`, `bash scripts/rotate-logs.sh --keep 3` leaves 3. WEAK: The feature is successful. -->

- **SC-001**: `node scratch/planning/probe-offers.mjs` prints 8 lines that hold `command=/` where it printed 26 before: `/speckit:complete` 1, `/create:readme` 2, `/create:agent` 2, `/create:manual-testing-playbook` 1 and `/doctor:` 2.
- **SC-002**: The advisor suite reports 0 failed with more passed tests than `scratch/before.txt`, and the five floor lines and the eval line are unchanged.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
<!-- FILL: Name one dependency and one risk. Give each a concrete mitigation. GOOD: A script that reads `--keep` with no value could delete every archive. Mitigation: reject a missing value with exit 2 and test it. WEAK: There may be some risk. -->

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The advisor daemon and its embedder answer the CLI probe | The after counts cannot be read | T014 marks itself `[B]` with the CLI error. The unit tests prove each gate without the daemon |
| Risk | A lead list reads a real request as a refusal and a typed row loses its command | High: typed delivery is a pinned floor | Six request prompts are tested first, `don't forget to run` is excluded by name and T013 fails when typed delivery leaves 44 of 44 |
| Risk | The weak-cue bar drops a tune row whose ranker score is between 6 and 10 | Med: the plain tune count is a floor | T013 compares the count. On a drop the task is `[B]` and no pattern is tuned to restore it |
| Risk | The lists are tuned to the review's own probes | Med: that is the failure the reviews named | Each list holds general wording, the tests hold counter-examples and phase 023 scores sealed rows nobody saw |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- FILL: Name one measurable limit per line. Write `N/A` and one reason when the packet runs no service, or delete the whole section. GOOD: The option adds under 5 ms to a run. WEAK: Performance is good. -->
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: Each new gate is one regular expression test per prompt or per command row, with no file read and no subprocess.

### Security
- **NFR-S01**: A command name is escaped before it enters a pattern, so a name holding a regular expression character cannot change what the pattern matches.

### Reliability
- **NFR-R01**: Every gate fails toward no offer: a prompt the gate misreads keeps its skill and loses only the command.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES
<!-- FILL: Name the empty input, the maximum input and the failure path. One line each. Write `N/A` with one reason, or delete the whole section. GOOD: Empty input: an empty `logs/archive/` deletes nothing and exits 0. Maximum: `--keep 3` over 10,000 archives keeps the newest 3. Failure path: a missing `--keep` value exits 2 with usage. WEAK: Handle edge cases. -->

- Empty input: an empty prompt or a prompt that names no command returns `false` from `commandOnlyMentioned` and changes no row.
- Maximum input: a prompt that names two commands is read once per command, so `use /speckit:plan, not /speckit:complete` keeps the first and withholds the second.
- Failure path: a prompt that asks about a command and then asks for it with a pronoun (`what does /create:readme do? run it on the hooks folder`) loses the command and keeps `sk-doc`. A retired name such as `/create:skill` is not read as a mention of its successor and keeps today's behaviour.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT
<!-- FILL: Score each row with the number the change earns. The total must match the level. Write `N/A` with one reason, or delete the whole section. GOOD: Scope 6/25: one option in `scripts/rotate-logs.sh`. Total 18/100. WEAK: Complexity is medium. -->

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | Six files, about 260 lines with tests, one runtime |
| Risk | 14/25 | Changes what passes in the scorer, guarded by four pinned floors |
| Research | 8/20 | Every finding reproduced by a probe before planning |
| **Total** | **32/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS
<!-- FILL: Write each open question as one line. Write `None` when nothing blocks. GOOD: Does a missing `--keep` value delete every archive? Decision: no, a missing value exits 2. WEAK: Edge cases are unclear. -->

- Level: `recommend-level.sh --loc 260 --files 8` printed Level 1. Decision: Level 2, because the dispatch requires `acceptance-criteria.md` as the closure gate and the plan workflow says to go higher when its answer and judgment differ.
- Does the real-embedding capture lose rows when a meaning pass must hold the uncertainty bar? Not measured at planning. T012 runs the capture with `--real-embedding` before and after T007 and records both counts. A lower count is the honest one, because the hooks never delivered those rows.
<!-- /ANCHOR:questions -->

---


