---
title: "Feature Specification: Phase 22: workflow-measure-soundness"
description: "The workflow measure misses real loads and miscounts real behaviour. A workflow document read through a shell command or a Pi or Codex prompt mirror is not a load, a write to a temp file makes a run improvised, a model that asked and waited on an ask row scores nothing and a document of the wrong mode counts as followed. This phase makes the classifier count what a run did and adds a followed rate beside the load rate."
trigger_phrases:
  - "workflow measure soundness"
  - "phase 22 workflow measure soundness"
  - "followed rate"
  - "shell read counts as a load"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 22: workflow-measure-soundness

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
| **Phase** | 22 of 23 |
| **Predecessor** | 021-brief-head-parity |
| **Successor** | 023-untuned-outcome-evidence |
| **Handoff Criteria** | Every task in `tasks.md` is `[x]`, the two scorer test files and the advisor suite report 0 failed, `scratch/workflow-after-pre.json` and `scratch/workflow-after-final.json` hold a `followedRate` for every runtime and arm, `scratch/workflow-delta.txt` names the reason for every changed count and strict validation prints `RESULT: PASSED` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 22** of the build that makes the skill advisor surface every tracked slash command with a run, start or ask policy on every supported CLI (`../spec.md`). Phase 019 built the first number for the core need: how often a run loaded a real workflow before it acted. The alignment reviews of 2026-11-14 (`../review/fable-alignment-2026-11-14/`) inferred that the number misses real load shapes and penalises correct behaviour. The planning probes confirmed each claim on hand-built events and counted them over the stored final arm.

**Scope Boundary**: the transcript scorer, the offer module, their two test files and the routing-accuracy README. No session reader, runner, corpus row, model run, target value or edit to phase 019's folder. The numbers phase 019 recorded stay where they are. This phase records its own and says why they differ.

**Dependencies**:
- Phase 019 is Complete and committed, because it edits the same scorer file (T001 checks).
- Phase 021 is Complete, because T013 states a rule about the head row that only holds after it (T001 checks).
- The stored sessions the two run logs name are still readable on this machine (T001 reruns both summaries).

**Deliverables**:
- A classifier that reads a shell read and a prompt mirror as a load, ignores a write outside the checkout, and returns two new values: `asked` and `otherMode`.
- A `followedRate` per runtime and arm beside `loadRate` and the unchanged `share`. `loadRate` keeps its rule, every owned scored run in its denominator, which now means the six path counts.
- An offer parser that says whether the command sat on the head or on its partner, and a delivery check that ignores tool results.
- `scratch/workflow-after-pre.json`, `scratch/workflow-after-final.json` and `scratch/workflow-delta.txt`.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
<!-- FILL: State the problem in two sentences: what breaks, and for whom. GOOD: The rotate-logs script never deletes old archives, so a host that copies `logs/archive` fills its disk. WEAK: The script has issues with output. -->

### Problem Statement
The classifier matches a load only on a read tool or a skill tool, so a model that runs `cat` on the skill's entry document, or reads the command through `.pi/prompts/`, is counted as loading nothing. Over the stored final arm that may hide up to 7 of Pi's 11 unloaded runs and up to 6 of OpenCode's 9. It also treats any write as the boundary, so all 6 improvised runs of that arm are runs whose first write went to a temp file, and it gives nothing to the 10 of 19 ask-row runs that wrote nothing, which is what an ask policy asks for. A reader of the load rate cannot tell a runtime that skips workflows from one that reads them another way.

### Purpose
The workflow summary counts every real load shape, credits a run that asked and waited on an ask row, names a wrong-mode load apart from a followed one and stops reading a temp-file write as improvising, so the rate describes what the models did.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
<!-- FILL: Run the command this change affects and paste the command and its verbatim output. Quote every number the spec states about current behavior from this block. Write `N/A:` and a reason when no command applies. GOOD: `bash scripts/rotate-logs.sh` with 10 archives, then `ls logs/archive | wc -l` prints 10. WEAK: The script deletes old logs. -->
```text
# node scratch/planning/probe-measure-units.mjs, 2026-11-14, on the working tree with phase 019's uncommitted scorer.
shell cat of the owner entry document, no write: none
shell cat of the command document, then a write: improvised
read of the Pi prompt mirror, no write: none
read of the Codex prompt mirror, no write: none
read of another mode under the right hub, then a write: skill
temp-file write, then the owner entry document, then a repository write: improvised
ask row, the model asked and wrote nothing: none
parseOffer on a head whose command belongs to the partner: {"offeredCommand":"/create:manual-testing-playbook","offeredPolicy":"start"}
brief pattern matches the no-match fallback head: true
brief pattern matches a tool result that quotes a head: true
create-sk-skill-confirm.yaml exists: false
create-skill-confirm.yaml exists: true

# node scratch/planning/probe-stored-runs.mjs over ../007-per-runtime-behaviour-proof/scratch/runs-final.jsonl.
# Counts per runtime on owned rows only. No prompt text is printed.
claude: askRowNoneNoWrite=4, askRows=4, owned=16, path:command=5, path:none=10, path:skill=1, skillHubDocOnly=1
devin: askRowNoneNoWrite=1, askRows=4, modes:sk-create-agent|row:/create:agent=1, owned=16, path:command=14, path:none=1, path:skill=1, skillWithModeDoc=1
dsh: askRows=3, improvisedFirstWriteOutsideRepo=2, improvisedNoChangedPath=2, missedShellLoad=1, modes:deep-research|row:/doctor:deep-loop=1, owned=15, path:command=11, path:improvised=2, path:none=1, path:skill=1, skillWithModeDoc=1, unreadable=1
opencode: askRowNoneNoWrite=2, askRows=4, improvisedFirstWriteOutsideRepo=3, improvisedNoChangedPath=1, missedShellLoad=6, modes:sk-create-agent|row:/create:agent=1, modes:sk-create-goal|row:/create:goal=1, owned=16, path:command=5, path:improvised=3, path:none=6, path:skill=2, skillWithModeDoc=2
pi: askRowNoneNoWrite=3, askRows=4, improvisedFirstWriteOutsideRepo=1, missedPromptMirror=2, missedShellLoad=7, owned=16, path:command=5, path:improvised=1, path:none=10
```
<!-- /ANCHOR:measured-behavior -->

The probe's `missedShellLoad` counts a shell read of any command document or of the owner's entry document, so it is an upper bound. The fix matches the row's own command and owner, and T016 reports the real change.

### Mechanism per Finding

| Finding | Where it comes from | Fix |
|---------|---------------------|-----|
| A-9, shell reads | `followedBeforeWrite` and `ownerLoadedBeforeWrite` read `read` and `skill` events only | A shell command that reads a file names that file as a load (T003) |
| A-9, prompt mirrors | `documentTails` holds the `commands/` layouts only | The `prompts/<namespace>-<name>.md` layout is a tail (T004) |
| A-12 | `confirmTails` builds `create-sk-skill-confirm`, and the file is `create-skill-confirm.yaml` | The one renamed command maps to the asset it ships, with a guard over the assets on disk (T005) |
| B-7 | Any `SKILL.md` or `ROUTER.md` under the owner hub counts | A document of another mode returns `otherMode` (T006, with T020 to T022 carrying the row's mode) |
| B-2 | An ask row that asked and wrote nothing is `none` | It returns `asked`, and `followedRate` counts it (T007, T023, T009). `askedActed` counts the `asked` runs that worked the task first, as `noneActed` does for `none` (T028) |
| B-8 | Any write sets the boundary | A write outside the run's checkout does not (T008, T024 to T027) |
| A-11, the partner's command | `parseOffer` takes the first slash command on the line | It reports `offeredAs` as `head` or `partner` (T011) |
| A-11, tool results | `recordsHaveBrief` tests every record | A tool result is not a delivery (T012) |
| A-3 | The offer is a Claude hook replay | True for a run made after phase 021 fixes the head row and the plugin's request, and stated in the module with that condition (T013). A stored run of another runtime keeps the Claude replay it was recorded with, which the summary document and the phase summary state as a limit (T014, T019) |
| A-1, B-2 first half | The share drops `none` runs | Fixed in phase 019 by `loadRate` and `noneActed`. This phase must not undo it: a run it names `asked` or `otherMode` would leave the phase 019 denominator, so T009 widens that denominator to the six path counts and `SUMOK` checks it |
| A-10 | A redirected compiled-route call never counted | Fixed in phase 019. Not changed here |
| A-11, the fallback head | `BRIEF_PATTERN` matches `Advisor: no skill matched.` | Declined: a fallback head that reached the session is a delivery, and the offer on that line is recorded as null. T014 says so in the README |

---

<!-- ANCHOR:scope -->
## 3. SCOPE
<!-- FILL: List three to five things this change does, each starting with a verb. Before you list a new file, module, option, layer or dependency, name what fails today without it, or drop it. GOOD: Add a `--keep <n>` option that deletes all but the newest n archives in `logs/archive/`. WEAK: Update the script and docs. -->

### In Scope
- Count a shell read and a Pi or Codex prompt mirror as a load of the row's command or owner.
- Return `otherMode` for a load of a different mode under the owner hub, and `asked` for an ask row that asked and wrote nothing.
- Ignore a write outside the run's checkout when the first-write boundary is set.
- Add `asked`, `otherMode` and `followedRate` to the summary, with every existing field unchanged.
- Report where an offered command sat on the head, and stop counting a tool result as a delivered brief.

### Out of Scope
- A step-level check that a run executed the workflow's own setup - the stored sessions were not built to show it and it needs its own rows. It is named in the phase 023 spec as a limit of the measure.
- Rescoring inside phase 019's folder - that phase is closed by its own tasks, and this phase writes its own outputs.
- A target for any rate - the operator sets it (parent goal log).
- Repeats, intervals and untuned rows - phase 023.

### Files to Change

`ADV` is `.skilled/skills/system-skill-advisor/runtime` and `RAD` is `ADV/scripts/routing-accuracy`.

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `RAD/score-command-transcripts.mjs` | Modify | Load shapes, the two new path values, the checkout boundary and the summary fields |
| `RAD/command-offer.mjs` | Modify | `offeredAs`, the tool-result rule and the module header |
| `RAD/README.md` | Modify | The summary fields, the load shapes and the delivery rule |
| `ADV/tests/command-transcript-score.vitest.ts` | Modify | One case per load shape and per new value |
| `ADV/tests/command-offer.vitest.ts` | Modify | The partner case and the tool-result case |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
<!-- FILL: Write one testable requirement per row. Name the exact command or output. GOOD: With 10 archives, `bash scripts/rotate-logs.sh --keep 3` exits 0 and `ls logs/archive | wc -l` prints 3. WEAK: The option should work well. -->
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Every summary field phase 019 wrote keeps its name and its meaning: `command`, `skill`, `improvised`, `none`, `noneActed`, `noOwner`, `unscored`, `loadRate` and `share`. The meaning of `loadRate` is every owned scored run in the denominator, so its denominator equals `command + skill + asked + otherMode + improvised + none` and equals the denominator the same arm printed before this phase. |
| REQ-002 | `workflowPath` returns `skill` for a shell read of the owner's entry document and `command` for a shell read or a prompt-mirror read of the row's command document, before the first write inside the checkout. |
| REQ-003 | For every runtime and arm, `command + skill + asked + otherMode + improvised + none` equals the owned scored runs, and `followedRate` is `command + skill + asked` over that count. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | `workflowPath` returns `otherMode` when the only owner document a run loaded sits in a mode folder that is not the row's mode, and `skill` when a hub-level document or the right mode's document was loaded. |
| REQ-005 | `workflowPath` returns `asked` for an ask row whose run wrote nothing, loaded nothing and either printed `COMMAND: [<command>] → offered` or ended on a question that names the command. |
| REQ-006 | A write outside the run's checkout sets no boundary and does not make a run improvised. |
| REQ-007 | A late read of `create-skill-confirm.yaml` fails `followedBeforeWrite` for `/create:sk-skill`, and every confirm asset on disk belongs to a tracked command. |
| REQ-008 | `parseOffer` returns `offeredAs` `partner` for a command that sits after ` vs ` and `head` otherwise, and `briefDelivered` returns `false` when only a tool result holds a head. |
| REQ-009 | `scratch/workflow-delta.txt` holds one line per runtime and arm with the counts before and after and the reason for each change. |
| REQ-010 | No code comment added by this phase names a spec path, a phase, a task, a finding or a requirement id. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
<!-- FILL: Write one measurable outcome per line. A command can prove it. GOOD: With 10 archives in `logs/archive`, `bash scripts/rotate-logs.sh --keep 3` leaves 3. WEAK: The feature is successful. -->

- **SC-001**: `node scratch/planning/probe-measure-units.mjs` prints `skill`, `command`, `command`, `command`, `otherMode`, `skill` and `asked` on its first seven lines, where it printed `none`, `improvised`, `none`, `none`, `skill`, `improvised` and `none`.
- **SC-002**: Both summary runs exit 0 and print a `followedRate` for every runtime and arm, and the count check of REQ-003 prints `true`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
<!-- FILL: Name one dependency and one risk. Give each a concrete mitigation. GOOD: A script that reads `--keep` with no value could delete every archive. Mitigation: reject a missing value with exit 2 and test it. WEAK: There may be some risk. -->

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 019 is still being built in the same scorer file | A parallel edit loses work | T001 stops until phase 019 is Complete and the file is clean in `git status` |
| Dependency | The stored sessions and the 34 GB arenas, which the operator has approved for deletion after the measure is scored | The after numbers cannot be produced | T001 reruns both summaries first. The arenas are deleted only after T016 |
| Risk | A shell command that only mentions a document counts as a load | Med: the rate would rise for the wrong reason | Only a command whose first word reads a file counts, a redirect target is excluded and an `echo` case is tested |
| Risk | The new rate is read as proof of the outcome | High: it is still 16 tuned rows with one run each | The README and the summary say what the rate counts, and phase 023 owns the evidence question |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- FILL: Name one measurable limit per line. Write `N/A` and one reason when the packet runs no service, or delete the whole section. GOOD: The option adds under 5 ms to a run. WEAK: Performance is good. -->
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: The classifier stays one pass over a run's events. No new file read per run beyond the bridge table the summary already loads.

### Security
- **NFR-S01**: The scorer still refuses a holdout row before it reads a prompt, and no new output field carries prompt text.

### Reliability
- **NFR-R01**: A run line with no `projectDir` falls back to the temp-folder rule, so an old log still scores.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES
<!-- FILL: Name the empty input, the maximum input and the failure path. One line each. Write `N/A` with one reason, or delete the whole section. GOOD: Empty input: an empty `logs/archive/` deletes nothing and exits 0. Maximum: `--keep 3` over 10,000 archives keeps the newest 3. Failure path: a missing `--keep` value exits 2 with usage. WEAK: Handle edge cases. -->

- Empty input: a run with no events on an ask row is `none`, because nothing shows it asked.
- Maximum input: a run that loaded the command document, a wrong-mode document and asked a question is `command`, because the expected command's load wins.
- Failure path: a shell command the splitter cannot read (an unclosed quote) names no file, so the run keeps the value it has today.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT
<!-- FILL: Score each row with the number the change earns. The total must match the level. Write `N/A` with one reason, or delete the whole section. GOOD: Scope 6/25: one option in `scripts/rotate-logs.sh`. Total 18/100. WEAK: Complexity is medium. -->

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | Five files, about 320 lines with tests |
| Risk | 10/25 | A measurement script. It changes reported numbers, not runtime behaviour |
| Research | 10/20 | Every claim reproduced on hand-built events and counted on the stored final arm |
| **Total** | **32/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS
<!-- FILL: Write each open question as one line. Write `None` when nothing blocks. GOOD: Does a missing `--keep` value delete every archive? Decision: no, a missing value exits 2. WEAK: Edge cases are unclear. -->

- Level: `recommend-level.sh --loc 320 --files 6` printed Level 1. Decision: Level 2, because the closure gate is `acceptance-criteria.md`.
- Is a run that asked on an ask row "following a workflow"? Decision: yes, as its own value. The ask policy tells the model to offer the command in one question and wait, so asking is the policy's own step. It is counted in the numerator of `followedRate` and never in the numerator of `loadRate`, so a reader who disagrees still has the old number. It stays in both denominators, and `askedActed` says how many such runs worked the task before they asked.
<!-- /ANCHOR:questions -->

---


