---
title: "Feature Specification: Phase 23: untuned-outcome-evidence"
description: "The packet quotes its outcome on rows its phrases were tuned on. On the sealed plain rows the brief carries the right command 5 of 44 times against 33 of 45 on the tuned rows, no sealed row tests a request that should carry no command, and the workflow rates are one run each with no range. This phase prints the untuned numbers, the range and the paired counts from committed scripts and states what only a new behaviour arm can show."
trigger_phrases:
  - "untuned outcome evidence"
  - "phase 23 untuned outcome evidence"
  - "sealed fit rows"
  - "followed range and paired arms"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 23: untuned-outcome-evidence

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
| **Phase** | 23 of 23 |
| **Predecessor** | 022-workflow-measure-soundness |
| **Successor** | None |
| **Handoff Criteria** | Every task in `tasks.md` is `[x]`, the advisor suite reports 0 failed, `scratch/outcome-evidence.txt` holds the reach, stage, fit, followed and paired lines printed by the two committed scripts, the parent goal log holds those lines and strict validation prints `RESULT: PASSED` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 23** of the build that makes the skill advisor surface every tracked slash command with a run, start or ask policy on every supported CLI (`../spec.md`). The operator's need is that models stay flexible and still use the right workflow more often. The alignment reviews of 2026-11-14 (`../review/fable-alignment-2026-11-14/`) found that nothing the packet measures shows that on a request nobody tuned for. The planning probes confirmed it from the committed capture script and found that part of the missing evidence already has a count nobody quoted.

**Scope Boundary**: the capture script, the command corpus, its committed baseline, the transcript scorer, their two test files and the routing-accuracy README. No scorer rule, phrase, guard, renderer, hook or `AGENTS.md` line changes here. No model session and no behaviour run. A number this phase prints is recorded as found and tuned by nobody in this phase.

**Dependencies**:
- Phase 020 is Complete, because the fit rows measure its guards after they are built (T001 checks).
- Phase 021 is Complete, because the head the capture models is the one that phase fixes (T001 checks).
- Phase 022 is Complete and committed, because this phase edits the same scorer file and reads its `followedRate` (T001 checks).

**Deliverables**:
- `plain_stages` in the capture: where each plain row fell out, per split, as counts.
- 48 sealed fit rows and a `fit` count: how often a head carries a command on a request that should carry none.
- `followedRange`, `loadRange`, `followedOffered`, `followedNotOffered` and a `paired` block in the workflow summary.
- `scratch/outcome-evidence.txt`, and the same lines in the parent goal log.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
<!-- FILL: State the problem in two sentences: what breaks, and for whom. GOOD: The rotate-logs script never deletes old archives, so a host that copies `logs/archive` fills its disk. WEAK: The script has issues with output. -->

### Problem Statement
Every outcome number the packet quotes comes from rows its phrases were written against. With the real embedding the brief carries the right command on 33 of 45 tuned plain rows and on 5 of 44 sealed ones, and the three families that reach their command through a hub carry it on 0 of 19 sealed rows. The 35 silence rows were visible during tuning, and phase 020's probe found 26 requests outside them that drew a wrong offer, so the 0 of 35 says little about a new request. The workflow rates are 16 tuned rows with one run each and no range, so an operator cannot tell a gain from run to run noise.

### Purpose
The packet states, from committed scripts, how often the brief carries the right command and stays silent on requests nobody tuned for, how wide the range on each workflow rate is and which rows moved between arms, and it names the one question only a new behaviour arm can answer.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
<!-- FILL: Run the command this change affects and paste the command and its verbatim output. Quote every number the spec states about current behavior from this block. Write `N/A:` and a reason when no command applies. GOOD: `bash scripts/rotate-logs.sh` with 10 archives, then `ls logs/archive | wc -l` prints 10. WEAK: The script deletes old logs. -->
```text
# 2026-11-14, commit 16c9757ac0 with phase 019's scorer uncommitted. The full record is scratch/planning/untuned-reach.before.txt.
# node RAD/capture-command-routing-baseline.mjs, read through jq. Fixture regime.
{"regime":"fixture","plain":{"tune":{"own":13,"attached":15,"combined":28,"total":45},"holdout":{"own":1,"attached":0,"combined":1,"total":44}},"holdoutByFamily":{"create":"0 of 13","deep":"0 of 3","design":"0 of 3","doctor":"1 of 17","prompt":"0 of 1","speckit":"0 of 7"},"falseOffer":{"count":0,"total":35},"stages":null,"fit":null}

# node RAD/capture-command-routing-baseline.mjs --real-embedding, read through the same jq filter.
{"regime":"real","plain":{"tune":{"own":18,"attached":15,"combined":33,"total":45},"holdout":{"own":5,"attached":0,"combined":5,"total":44}},"holdoutByFamily":{"create":"0 of 13","deep":"0 of 3","design":"0 of 3","doctor":"5 of 17","prompt":"0 of 1","speckit":"0 of 7"},"tuneByFamily":{"create":"10 of 14","deep":"3 of 3","design":"3 of 3","doctor":"12 of 17","prompt":"1 of 1","speckit":"4 of 7"},"falseOffer":{"count":0,"total":35},"stages":null,"fit":null}

# jq -r 'del(.prompt) | [.split, .row_type] | join(" ")' RAD/command-prompts.jsonl | sort | uniq -c
  44 holdout plain
  22 none must-not-start
   9 none near-miss
  12 none slash-variant
  44 none typed
  45 tune plain

# node RAD/score-command-transcripts.mjs --summary <runs-final.jsonl> --pair pre,post --json
score-command-transcripts.mjs: unknown option: --pair
exit 2
```
<!-- /ANCHOR:measured-behavior -->

`RAD` is `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy`. The stored workflow rates are in phase 019's summary files and are not repeated here, because phase 022 rescoring replaces them before this phase starts.

### What Each Source Can Show

| Question | Source | Gate | What it cannot show |
|----------|--------|------|---------------------|
| Does the brief carry the right command on a plain request nobody tuned for? | The capture on the 44 sealed plain rows. It already prints 5 of 44 | None. Recorded here | Whether a model follows the offer |
| Where do the sealed rows fall out: the ranking, the route or the attach step? | `plain_stages`, added here | None | Why. The prompt text stays sealed |
| Does the head stay free of a command where none fits? | 48 sealed fit rows, added here | None | Whether a model would have started the command |
| How often did a run open the right workflow or ask? | The stored sessions through phase 022's `followedRate` | None | Untuned rows and run to run spread. 16 rows, one run each |
| How wide is that rate? | `followedRange`, added here | None | Anything the 16 rows do not hold |
| Did the same rows move between the before arm and the final arm? | `paired`, added here | None | The cause. The arms differ in the scorer, the wording and the brief |
| Do runs that were offered the command follow more often than runs that were not? | `followedOffered` and `followedNotOffered`, added here | None | The cause. A row that draws an offer may be an easier row |
| Does the brief cause more correct workflows on requests nobody tuned for? | A new arm: fresh rows, three runs each, the brief on and off at one commit | The operator. "No more behaviour arms" is in force | Nothing else answers it |
| Did a run follow the workflow's steps after it loaded the document? | Rows built for a step check, run in that arm | The operator, with the arm | Nothing else answers it |

### Mechanism per Finding

| Finding | Reproduction | Planned here |
|---------|--------------|--------------|
| B-1, tuned rows only | 33 of 45 tuned against 5 of 44 sealed with the real embedding | The sealed numbers are recorded as the reach figure (T012, T014). A behaviour number on untuned rows waits on the operator |
| B-1, no skill-only row and no negative row | The corpus has no sealed row whose label is "no command" | 48 sealed fit rows and their count (T004, T005, T017) |
| B-1, one run and no range | The summary prints `k of n` with no range and no option that pairs two arms | The range and the paired counts (T007, T009, T018 to T021). Repeats wait on the operator |
| B-11, plain requests that fit a command get no brief | 0 of 19 sealed rows across the create, deep and design families | The stage split says where they fall out (T003, T016). Raising the number is a matching change, and it waits on the operator |
| B-4, no criterion names the outcome | The parent goal's criteria close on delivery alone | The parent goal amendment names this phase's lines. This phase prints them |

---

<!-- ANCHOR:scope -->
## 3. SCOPE
<!-- FILL: List three to five things this change does, each starting with a verb. Before you list a new file, module, option, layer or dependency, name what fails today without it, or drop it. GOOD: Add a `--keep <n>` option that deletes all but the newest n archives in `logs/archive/`. WEAK: Update the script and docs. -->

### In Scope
- Print, per split, how many plain rows the command led, its owner led, a route answered, a command was attached and the right command was attached.
- Add 48 sealed fit rows, written once and never selected by their result, and count how often a head carries a command on them.
- Print a 95 percent range beside the followed rate and the load rate.
- Split the followed rate by whether the head offered the row's command.
- Add a `--pair <from>,<to>` option that counts the rows that gained, lost or kept a followed workflow between two arms. Without it a reader compares two rates over 16 rows whose ranges overlap and cannot see whether the same rows moved.

### Out of Scope
- A behaviour arm on untuned rows - the operator ruled out more arms. The design and its cost are in the Open Questions.
- A target for any rate - the operator sets it.
- Raising the sealed reach by matching - a scorer change that needs its own phase and the operator's choice of packet.
- Changing a guard when a fit count is above zero - the count is recorded and handed to the operator, because tuning on a sealed row ends its use.
- A step-level check of a loaded workflow - it needs rows built for it and a run.

### Files to Change

`ADV` is `.skilled/skills/system-skill-advisor/runtime` and `RAD` is `ADV/scripts/routing-accuracy`.

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `RAD/capture-command-routing-baseline.mjs` | Modify | `plain_stages`, the `fit` count and the fit row guard |
| `RAD/command-prompts.jsonl` | Modify | 48 appended fit rows on the `holdout` split |
| `RAD/command-routing-baseline.json` | Modify | Recaptured with `--write`. Every earlier metric unchanged |
| `RAD/score-command-transcripts.mjs` | Modify | The two ranges, the offered split and `--pair` |
| `RAD/README.md` | Modify | The new fields and a section on how to read the outcome |
| `ADV/tests/command-routing-slice.vitest.ts` | Modify | The stage identity and the fit counts |
| `ADV/tests/command-transcript-score.vitest.ts` | Modify | The range, the offered split and the pairing |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
<!-- FILL: Write one testable requirement per row. Name the exact command or output. GOOD: With 10 archives, `bash scripts/rotate-logs.sh --keep 3` exits 0 and `ls logs/archive | wc -l` prints 3. WEAK: The option should work well. -->
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | No prompt text of a sealed row is printed, logged or published by any script or task, and no fit row id appears in a published row map. |
| REQ-002 | Every metric the committed baseline held before this phase keeps its value after the recapture: `metrics`, `unreachable`, `commands` and every earlier key of `attachedMetrics`. |
| REQ-003 | The 48 fit rows are appended in one change and none is edited, replaced or removed after the first capture that scores them. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | `attachedMetrics.plain_stages` holds, for `tune` and `holdout`, the counts `total`, `own`, `ownerLed`, `routed`, `withCommand`, `attached` and `neither`, with `own + ownerLed + neither` equal to `total` and `own` and `attached` equal to the same split's values in `attachedMetrics.plain`. |
| REQ-005 | `attachedMetrics.fit` holds `skillOnly` with `carried` and a `total` of 24, and `decline` with `carried`, a `total` of 24 and a `byKind` count of 6 for each of `refusal`, `question`, `small-edit` and `app-problem`. |
| REQ-006 | Each `workflow` block holds `followedRange` and `loadRange` as a `low` and a `high` to two decimals, and `null` when the rate has no runs. `wilsonRange(8, 16)` returns `{ low: 0.28, high: 0.72 }`. |
| REQ-007 | Each `workflow` block holds `followedOffered`, `followedNotOffered` and `offerUnknown`, and the three denominators add up to the denominator of `followedRate`. |
| REQ-008 | With `--pair <from>,<to>`, a runtime that scored both arms holds `paired` with `rows`, `gained`, `lost`, `bothFollowed` and `neitherFollowed`, and the last four add up to `rows`. Without the option the summary prints what it printed before. |
| REQ-009 | `scratch/outcome-evidence.txt` holds the reach, stage, fit, followed and paired lines, each produced by a `jq` command over a script's output, and five `limit:` lines, the fifth saying the offer on a stored run of a runtime other than Claude is the Claude hook's replay. |
| REQ-010 | No code comment added by this phase names a spec path, a phase, a task, a finding or a requirement id. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
<!-- FILL: Write one measurable outcome per line. A command can prove it. GOOD: With 10 archives in `logs/archive`, `bash scripts/rotate-logs.sh --keep 3` leaves 3. WEAK: The feature is successful. -->

- **SC-001**: `jq -c '.attachedMetrics | [.plain_stages.holdout.total, .fit.skillOnly.total, .fit.decline.total]'` over the committed baseline prints `[44,24,24]`, where both keys print `null` today.
- **SC-002**: The summary over both stored arms with `--pair pre,post` exits 0 and prints a `followedRange` for 11 runtime and arm blocks and a `paired` block for the 5 runtimes that ran both arms, where the option is unknown today.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
<!-- FILL: Name one dependency and one risk. Give each a concrete mitigation. GOOD: A script that reads `--keep` with no value could delete every archive. Mitigation: reject a missing value with exit 2 and test it. WEAK: There may be some risk. -->

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 022 edits the same scorer file and README | A parallel edit loses work | T001 stops until phases 020, 021 and 022 are Complete and the seven files are clean in `git status` |
| Dependency | The stored sessions, approved for deletion once the measure is scored | The range and the paired counts cannot be printed over the real arms | T012 runs before any deletion. The unit tests still prove each rule |
| Risk | The fit rows are written to pass, or replaced after they fail | High: the count would be a tuned number again | The author opens no phrase table and scores no draft. `git diff --numstat` shows 48 additions and 0 deletions, and D2 in the goal forbids a later edit |
| Risk | A fit row repeats a tuned row | Med: it would measure tuned text | The capture refuses a fit row whose text equals another row's, naming the two ids only |
| Risk | The paired counts are read as the brief's effect | High: the arms differ in more than the brief | The README section and the `limit:` lines say so beside the numbers |
| Risk | The recapture moves an earlier metric | Med: a floor would shift unseen | A fit row takes part in the `fit` count only, and T006 compares the earlier metrics line by line |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- FILL: Name one measurable limit per line. Write `N/A` and one reason when the packet runs no service, or delete the whole section. GOOD: The option adds under 5 ms to a run. WEAK: Performance is good. -->
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: The capture scores each fit row once, the same way it scores every other row. No extra pass over the corpus.

### Security
- **NFR-S01**: A sealed row's text leaves the corpus file only as input to the scorer inside the capture. An error about a fit row names ids.

### Reliability
- **NFR-R01**: The baseline is still captured under the fixture regime only, so the slice test reproduces it on a clean checkout.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES
<!-- FILL: Name the empty input, the maximum input and the failure path. One line each. Write `N/A` with one reason, or delete the whole section. GOOD: Empty input: an empty `logs/archive/` deletes nothing and exits 0. Maximum: `--keep 3` over 10,000 archives keeps the newest 3. Failure path: a missing `--keep` value exits 2 with usage. WEAK: Handle edge cases. -->

- Empty input: a rate with no runs prints `null` for its range, and a runtime that ran one arm holds no `paired` block.
- Maximum input: a rate of 16 of 16 prints a range whose `high` is 1 and whose `low` is 0.81.
- Failure path: `--pair` with one arm name, or without `--summary`, exits 2 with the usage text and scores nothing.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT
<!-- FILL: Score each row with the number the change earns. The total must match the level. Write `N/A` with one reason, or delete the whole section. GOOD: Scope 6/25: one option in `scripts/rotate-logs.sh`. Total 18/100. WEAK: Complexity is medium. -->

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 13/25 | Seven files, about 420 lines with tests and 48 corpus rows |
| Risk | 11/25 | Measurement scripts and a sealed corpus. No runtime behaviour changes |
| Research | 10/20 | Each gap reproduced from a committed script's output |
| **Total** | **34/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS
<!-- FILL: Write each open question as one line. Write `None` when nothing blocks. GOOD: Does a missing `--keep` value delete every archive? Decision: no, a missing value exits 2. WEAK: Edge cases are unclear. -->

- Level: `recommend-level.sh --loc 420 --files 7` printed Level 1. Decision: Level 2, because the closure gate is `acceptance-criteria.md`.
- Who writes the fit rows? Decision: one worker whose brief holds the two class definitions, the row shape and the names of the tracked commands and skills, and nothing else. The operator may replace the set with requests from real use before T006 runs. After T006 the set is frozen.
- WAITING ON OPERATOR, a new behaviour arm. It is the only way to show the brief causes more correct workflows on requests nobody tuned for. The proposal is 24 fresh rows that are never tuned on (12 that fit a command, 6 skill-only, 6 decline), three runs each, two arms at one commit with the brief on and off, which is 144 sessions per runtime. "No more behaviour arms" is in force, so this phase builds none of it. When approved it becomes a new phase.
- WAITING ON OPERATOR, the target. Options: a gain target (the brief-on arm follows on more paired rows than the brief-off arm on every runtime measured, with no command started on a decline row), an absolute followed rate the operator names, or a written waiver that closes the packet on delivery and states the outcome was not shown. Recommendation: the gain target, with the sealed reach recorded as a floor that may only rise.
- WAITING ON OPERATOR, the sealed reach. Raising 5 of 44 is a matching change in the scorer. Options: a phase in this packet or a follow-up packet. Recommendation: a follow-up packet, started after `plain_stages` shows whether the rows fall out at the ranking or at the attach step.
<!-- /ANCHOR:questions -->

---

