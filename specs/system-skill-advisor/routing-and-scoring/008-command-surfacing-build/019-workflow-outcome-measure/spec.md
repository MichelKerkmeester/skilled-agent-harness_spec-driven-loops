---
title: "Feature Specification: Phase 19: workflow-outcome-measure"
description: "The transcript scorer counts how often a command is offered and started but has no number for how often a model followed a real workflow, the command's own or the owning skill's own, before it acted. This phase adds one workflowPath classification per scored run, reports per runtime and arm the share of acting runs that loaded a real workflow before their first write and scores the stored before and final arms with no new model run and no target."
trigger_phrases:
  - "workflow outcome measure"
  - "phase 19 workflow outcome measure"
  - "workflow path share"
  - "followed a real workflow against improvising"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 19: workflow-outcome-measure

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
| **Created** | 2026-11-13 |
| **Branch** | `worktrees/352-command-surfacing-research` |
| **Parent Spec** | ../spec.md |
| **Phase** | 19 of 19 |
| **Predecessor** | 018-holdout-row-retirement |
| **Successor** | None |
| **Handoff Criteria** | Every task in `tasks.md` is `[x]`, the scorer test file and the full advisor suite report 0 failed, `scratch/workflow-pre.json` and `scratch/workflow-final.json` hold a `workflow` block for every runtime and arm, the shares are recorded in `implementation-summary.md`, the parent Open Questions and the parent goal log, and strict validation prints `RESULT: PASSED` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 19** of the build that makes the skill advisor surface every tracked slash command with a run, start or ask policy on every supported CLI (`../spec.md`). It answers the third parent open question (`../spec.md` section 4): the packet counts offers and starts and has no number for the outcome it exists for. The operator chose through the question tool on 2026-11-13 to build that number now, from the stored sessions of the phase 007 behaviour runs, with no new model run and no target.

**Scope Boundary**: the transcript scorer, its test file, the routing-accuracy README row that lists the summary fields, two scratch outputs in this folder and the three close-out records. No session reader, corpus row, runner, model run or target value.

**Dependencies**:
- Phase 018 is committed and the advisor suite is green on the start commit (T001 records it).
- The stored sessions named by `../007-per-runtime-behaviour-proof/scratch/runs-pre.jsonl`, `runs-pre-dsh-rerun.jsonl` and `runs-final.jsonl` are still readable on this machine (T001 to T003 measure it).
- The generated bridge table `command-bridges.generated.json` names an owner skill for every expected command in those logs (T004).

**Deliverables**:
- One exported classifier, `workflowPath`, and one `workflow` block per runtime and arm in the `--summary` output, text and `--json`.
- New test cases in the scorer test file, one per value and one per named edge.
- `scratch/workflow-pre.json` and `scratch/workflow-final.json`, the before and final arm scored by the committed script.
- The per-runtime before and final shares, written into `implementation-summary.md`, the parent Open Questions line and a parent goal log row.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
<!-- FILL: State the problem in two sentences: what breaks, and for whom. GOOD: The rotate-logs script never deletes old archives, so a host that copies `logs/archive` fills its disk. WEAK: The script has issues with output. -->

### Problem Statement
The scorer reports how often a command was offered, seen and started, but nothing it prints says whether the model loaded the command's own workflow or the owning skill's own workflow before it acted. `followedBeforeWrite` already decides the command half of that question and `scoreRun` never calls it, and no rule matches a read of a skill's `SKILL.md` or `ROUTER.md` or a `compiled-route.cjs` call. So the operator cannot tell, per runtime, whether the brief moved models away from improvising, which is the outcome the packet exists for.

### Purpose
Every scored run carries one `workflowPath` value and every summary block prints how many acting runs followed a real workflow as `N of M`, for the before arm and the final arm.

**Core need served:** The operator's need is that "ais using skills are flexible but will more often use the besr correct workflows for said tasks" (2026-11-13). Every earlier phase measured the means: offers, starts and briefs. This phase measures the need itself, the share of runs that loaded the command's or the owning skill's own workflow before acting, against the runs that acted without one. Under decision D7 both paths count as a real workflow, so the model keeps its free choice and only improvising lowers the share. The measure is a proxy. It shows that a workflow was loaded before the model acted, not that every step of it was followed.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
<!-- FILL: Run the command this change affects and paste the command and its verbatim output. Quote every number the spec states about current behavior from this block. Write `N/A:` and a reason when no command applies. GOOD: `bash scripts/rotate-logs.sh` with 10 archives, then `ls logs/archive | wc -l` prints 10. WEAK: The script deletes old logs. -->
Every command ran read-only on 2026-11-13 and 2026-11-14 from the worktree root. `RA` is `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy`, `RL` is `../007-per-runtime-behaviour-proof/scratch` and `BR` is `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/command-bridges.generated.json`. No filter printed a prompt. The scorer's own `--summary` run was refused by the planning sandbox, so T001 records the real per-runtime scored and unscored counts before any edit.

```text
$ wc -l $RL/runs-pre.jsonl $RL/runs-pre-dsh-rerun.jsonl $RL/runs-final.jsonl
     144 runs-pre.jsonl
      24 runs-pre-dsh-rerun.jsonl
     120 runs-final.jsonl
     288 total
$ jq -r '"\(input_filename) \(.runtime) \(.arm)"' $RL/runs-pre.jsonl $RL/runs-pre-dsh-rerun.jsonl $RL/runs-final.jsonl | sort | uniq -c
  24 runs-final.jsonl claude post
  24 runs-final.jsonl devin post
  24 runs-final.jsonl dsh post
  24 runs-final.jsonl opencode post
  24 runs-final.jsonl pi post
  24 runs-pre-dsh-rerun.jsonl dsh pre
  24 runs-pre.jsonl claude pre
  24 runs-pre.jsonl codex pre
  24 runs-pre.jsonl devin pre
  24 runs-pre.jsonl dsh pre
  24 runs-pre.jsonl opencode pre
  24 runs-pre.jsonl pi pre
$ jq -c 'keys' $RL/runs-pre.jsonl $RL/runs-pre-dsh-rerun.jsonl $RL/runs-final.jsonl | sort | uniq -c
 120 ["arm","briefDelivered","changedPaths","exit","locator","offeredCommand","offeredPolicy","restored","rowId","runtime"]
 168 ["arm","changedPaths","exit","locator","restored","rowId","runtime"]
$ jq -c '[.runtime, .arm, (.locator|type), ((.locator|objects|keys)//null)]' $RL/runs-pre.jsonl $RL/runs-pre-dsh-rerun.jsonl $RL/runs-final.jsonl | sort | uniq -c
  24 ["claude","post","object",["projectDir","sessionId","transcriptPath"]]
  24 ["claude","pre","object",["projectDir","sessionId","transcriptPath"]]
  24 ["codex","pre","object",["projectDir","sessionId","transcriptPath"]]
  24 ["devin","post","object",["projectDir","sessionId"]]
  24 ["devin","pre","object",["projectDir","sessionId"]]
  23 ["dsh","post","object",["dshHome","projectDir","sessionId"]]
   1 ["dsh","post","object",["dshHome","projectDir"]]
  48 ["dsh","pre","object",["dshHome","projectDir","sessionId"]]
  24 ["opencode","post","object",["projectDir","sessionId"]]
  24 ["opencode","pre","object",["projectDir","sessionId"]]
  24 ["pi","post","object",["projectDir","sessionId"]]
  24 ["pi","pre","object",["projectDir","sessionId"]]
$ jq -r '.rowId' $RL/runs-pre.jsonl $RL/runs-final.jsonl | sort -u
cmd-create-agent-plain-tune-01
cmd-create-agent-plain-tune-02
cmd-create-benchmark-plain-tune-01
cmd-create-changelog-plain-tune-01
cmd-create-command-plain-tune-01
cmd-create-diff-plain-tune-01
cmd-create-feature-catalog-plain-tune-01
cmd-create-goal-plain-tune-01
cmd-create-manual-testing-playbook-plain-tune-01
cmd-deep-ai-council-plain-tune-01
cmd-deep-research-plain-tune-01
cmd-deep-review-plain-tune-01
cmd-doctor-agents-md-plain-tune-01
cmd-doctor-ci-plain-tune-01
cmd-doctor-deep-loop-plain-tune-01
cmd-doctor-helper-plain-tune-01
mns-chat-01
mns-chat-02
mns-chat-03
mns-chat-04
mns-chat-05
mns-chat-06
mns-chat-07
mns-chat-08
$ jq -c 'del(.prompt) | keys' $RA/command-prompts.jsonl | sort | uniq -c
 176 ["expected_command","expected_policy","expected_top","id","row_type","source","split"]
$ jq -r 'select(.split!="holdout") | select((.expected_command // "") == "") | "\(.expected_top) \(.row_type)"' $RA/command-prompts.jsonl | sort | uniq -c
  22 null must-not-start
   4 null slash-variant
   1 sk-code near-miss
   1 sk-design near-miss
   1 sk-doc near-miss
   1 sk-git near-miss
   1 sk-prompt near-miss
   1 system-deep-loop near-miss
   1 system-skill-advisor near-miss
   1 system-skilled-doctor near-miss
   1 system-spec-kit near-miss
$ jq -c 'select(.id|startswith("mns-chat-0")) | del(.prompt) | {id, expected_command, expected_top, row_type}' $RA/command-prompts.jsonl
{"id":"mns-chat-01","expected_command":null,"expected_top":null,"row_type":"must-not-start"}
{"id":"mns-chat-02","expected_command":null,"expected_top":null,"row_type":"must-not-start"}
{"id":"mns-chat-03","expected_command":null,"expected_top":null,"row_type":"must-not-start"}
{"id":"mns-chat-04","expected_command":null,"expected_top":null,"row_type":"must-not-start"}
{"id":"mns-chat-05","expected_command":null,"expected_top":null,"row_type":"must-not-start"}
{"id":"mns-chat-06","expected_command":null,"expected_top":null,"row_type":"must-not-start"}
{"id":"mns-chat-07","expected_command":null,"expected_top":null,"row_type":"must-not-start"}
{"id":"mns-chat-08","expected_command":null,"expected_top":null,"row_type":"must-not-start"}
{"id":"mns-chat-09","expected_command":null,"expected_top":null,"row_type":"must-not-start"}
$ jq -c 'keys' $BR
["commandPolicies","counts","entries","generatedBy","schemaVersion"]
$ jq -r '[.entries[].skillId] | unique | .[]' $BR
sk-code
sk-design
sk-doc
sk-git
sk-prompt
system-deep-loop
system-skill-advisor
system-skilled-doctor
system-spec-kit
$ jq -r '.entries[] | select(.command|test("^/(create:(agent|benchmark|changelog|command|diff|feature-catalog|goal|manual-testing-playbook)|deep:(ai-council|research|review)|doctor:(agents-md|ci|deep-loop|helper))( |$)")) | "\(.command) \(.skillId)"' $BR
/create:agent sk-doc
/create:benchmark sk-doc
/create:changelog sk-doc
/create:command sk-doc
/create:diff sk-doc
/create:feature-catalog sk-doc
/create:goal sk-doc
/create:manual-testing-playbook sk-doc
/deep:ai-council system-deep-loop
/deep:research system-deep-loop
/deep:review system-deep-loop
/doctor:agents-md system-skilled-doctor
/doctor:agents-md system-skilled-doctor
/doctor:agents-md system-skilled-doctor
/doctor:ci sk-code
/doctor:ci sk-code
/doctor:ci sk-code
/doctor:deep-loop system-deep-loop
/doctor:helper system-skilled-doctor
$ rg -n 'followedBeforeWrite|SKILL\.md|ROUTER\.md|compiled-route' $RA/score-command-transcripts.mjs
153:// and a runtime that loads a skill by reading its SKILL.md leaves that read in place
566:export function followedBeforeWrite(events, command) {
$ rg -c 'followedBeforeWrite' .skilled/skills/system-skill-advisor/runtime/tests/command-transcript-score.vitest.ts
7
$ rg -n -o 'usage: compiled-route.cjs --hub <hubId>' .skilled/bin/compiled-route.cjs
37:usage: compiled-route.cjs --hub <hubId>
52:usage: compiled-route.cjs --hub <hubId>
```

### Findings per Question
Each finding is marked OBSERVED when a command above or a cited line shows it, and INFERRED when it follows from them without a run that could have contradicted it.

- **What the scorer reads today.** OBSERVED: `normalize` (`score-command-transcripts.mjs:332`) emits `read` events with a path, `shell` events with a command, `write` events with a path and, for a redirect or a shell patch, the command, `skill` events with the skill name and an optional path and, on Claude only, `expanded` events from the command tag (`:346-349`). `followedBeforeWrite` (`:566`) is defined and exported and only the tests call it. `hostExpanded` (`:649`) is internal. No line matches `SKILL.md` or `ROUTER.md` as a load or `compiled-route.cjs`.
- **What the row label keeps.** OBSERVED: `rowLabel` (`:928-936`) keeps `expected_command`, `expected_policy`, `row_type` and `prompt` and drops `expected_top`. `startedLabel` (`:955-969`) carries no `expected_top`. A holdout row is refused at `scoreRun` (`:1158`) before any prompt is read.
- **Where the owner lives.** OBSERVED: the generated bridge table holds the owner as `entries[].skillId`, not as `ownerSkillId`. `ownerSkillId` is the field name in `COMMAND_ROWS` in `runtime/lib/command-attach.ts:65` onward, which a plain `.mjs` script cannot import without a build. Every one of the 15 commands the run logs expect has one owner in the table, and the nine ids it lists cover every `expected_top` of the nine near-miss rows.
- **Which rows sit outside the share.** OBSERVED: the run logs use 24 row ids, 16 command rows and 8 `mns-chat` rows. Every `mns-chat` row has a null `expected_command` and a null `expected_top`, so each runtime and arm has at most 16 runs in the share and at least 8 `noOwner` runs.
- **How the arms are named.** OBSERVED: the before arm is `pre` and the final arm is `post` in the run lines. Codex appears in the before arm only, and the Codex-only arm stays out of scope. One final dsh line has no `sessionId`. 168 of the 288 lines predate the `offeredCommand` and `briefDelivered` fields, which this measure does not read.
- **Whether every runtime can be read.** INFERRED, measured in T001 to T003: the devin reader passes `call.arguments` to `toolCallBlock` (`.skilled/hooks/shared/session-readers/devin.mjs:159-162`, `:283-286`), and `toolCallBlock` replaces anything that is not a plain object with `{}` (`project.mjs:40-47`). When devin stores arguments as a JSON string, every devin read loses its path. The OpenCode reader opens `OPENCODE_DB` or `opencode.db` in its data folder (`opencode.mjs:52-63`), and which database holds the recorded sessions is not known yet.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE
<!-- FILL: List three to five things this change does, each starting with a verb. Before you list a new file, module, option, layer or dependency, name what fails today without it, or drop it. GOOD: Add a `--keep <n>` option that deletes all but the newest n archives in `logs/archive/`. WEAK: Update the script and docs. -->

### In Scope
- A. Measure first: record the unchanged summaries, find the OpenCode database, check whether devin keeps tool arguments and check the owner table (T001 to T004).
- B. Add `workflowPath` and its owner lookup to the scorer, reusing `followedBeforeWrite`, and add one `workflow` block per runtime and arm to the text and `--json` summary, tests first (T005 to T014).
- C. Run the gates, score the before arm and the final arm into `scratch/workflow-pre.json` and `scratch/workflow-final.json` and prove the existing fields did not move (T015 to T019).
- D. Record the per-runtime shares in `implementation-summary.md`, the parent Open Questions line and a parent goal log row, and close the phase (T020 to T023).

### Out of Scope
- Any new model run - every number comes from the stored sessions, by the operator's decision and decision D5.
- Any change to `command-prompts.jsonl` - the owner comes from the bridge table and `expected_top`, so no corpus field is needed.
- Any reader under `.skilled/hooks/shared/session-readers/` - a reader that drops arguments is reported as unscored for this measure, not repaired here.
- Any target value - the first numbers are the baseline and the operator sets a target after reading them.
- The Codex-only arm and the after arm in `runs-post.jsonl` - the operator named the before arm and the final arm.
- Judging whether each step of a loaded workflow was followed - the measure is a proxy for loading, by design.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs` | Modify | Keep `expected_top` on the label, read owners from the bridge table, add and export `workflowPath`, carry it through `scoreRun` and print a `workflow` block per arm |
| `.skilled/skills/system-skill-advisor/runtime/tests/command-transcript-score.vitest.ts` | Modify | Add the unit cases for `workflowPath` and the summary cases for the `workflow` block |
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/README.md` | Modify | Add `workflow` to the per-arm field list of the `score-command-transcripts.mjs` row |
| `019-workflow-outcome-measure/scratch/workflow-pre.json` | Create | The before arm scored by the committed script |
| `019-workflow-outcome-measure/scratch/workflow-final.json` | Create | The final arm scored by the committed script |
| `../spec.md` and `../goal.md` | Modify | The Open Questions line, phase map row 19 and one goal log row at close-out, coordinator only |

The restraint pass: no new source file, module, option, dependency or corpus field. Without the classification the summary has no field that separates a run that loaded a workflow from one that improvised, so the share cannot be computed from any output the scorer prints today. The owner lookup reads the generated JSON the repository already ships, because the TypeScript table is unreachable from a plain script without a build. `followedBeforeWrite` is reused rather than rewritten. The two scratch outputs are the only added files, and the before captures T001 takes live in a temporary folder outside the repository.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
<!-- FILL: Write one testable requirement per row. Name the exact command or output. GOOD: With 10 archives, `bash scripts/rotate-logs.sh --keep 3` exits 0 and `ls logs/archive | wc -l` prints 3. WEAK: The option should work well. -->
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `workflowPath(events, { command, owner, wrote })` is exported and returns `command` when `followedBeforeWrite` passes for the command or the host expanded it, `skill` when the owner's own workflow was loaded before the first write, `improvised` when the run acted and loaded neither in time, `none` when it neither wrote nor loaded and `noOwner` when the owner is null. |
| REQ-002 | An owner load is a read or skill-tool path ending in `/SKILL.md` or `/ROUTER.md` with a `skills/<owner>/` segment at any depth, a skill event whose name is the owner and a shell or write event whose command runs `compiled-route.cjs` with `--hub <owner>`. A load counts only before the first write event, and a run with no write event counts any load. |
| REQ-003 | The owner of a row is the `skillId` of its expected command in `command-bridges.generated.json`, else its `expected_top` when that value is a `skillId` in the same table, else null. |
| REQ-004 | Every per-arm block in `--summary` output gains `workflow` with `command`, `skill`, `improvised`, `none`, `noOwner`, `unscored` and `share`, where `share` is `rate(command + skill, command + skill + improvised)`. The text summary prints the same values on one `workflow:` line under each arm. |
| REQ-005 | Every field the summary printed before this phase keeps its name and value: the before captures from T001 and the new outputs with every `workflow` key deleted are equal. |
| REQ-006 | Each new test case fails on the start commit and passes after the code change, and the scorer test file, `npm run typecheck`, the full advisor suite and the quality gate report 0 failures. |
| REQ-007 | No task starts a model session, reads holdout prompt text, edits a session reader, the corpus or a `package.json`, or sets a target. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-008 | When T003 finds that devin events keep no path or command, every devin run is counted in `workflow.unscored` and outside the four values, and the text summary says why on that runtime's `workflow:` line. |
| REQ-009 | `scratch/workflow-pre.json` and `scratch/workflow-final.json` are written by the committed scorer over the before logs and the final log, and in each arm the four values plus `noOwner` plus the runs unscored for this measure alone equal `scored`. |
| REQ-010 | The per-runtime before and final shares appear in `implementation-summary.md`, replace the third parent Open Questions line in `../spec.md` and fill one row in the `../goal.md` log, each with the share as `N of M`. |
| REQ-011 | The routing-accuracy README row for `score-command-transcripts.mjs` lists `workflow` among the per-arm fields and says the share counts a load before the first write, not each step followed. |
| REQ-012 | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh` on this folder with `--strict` prints `RESULT: PASSED`. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
<!-- FILL: Write one measurable outcome per line. A command can prove it. GOOD: With 10 archives in `logs/archive`, `bash scripts/rotate-logs.sh --keep 3` leaves 3. WEAK: The feature is successful. -->

- **SC-001**: The scorer test file reports 0 failed with one new case per `workflowPath` value and one per named edge, each seen failing before the code change.
- **SC-002**: `scratch/workflow-pre.json` and `scratch/workflow-final.json` print a `workflow.share` as `N of M` for every runtime and arm, and the sum check in `tasks.md` prints `true` for both.
- **SC-003**: The before captures and the new outputs agree on every field other than `workflow`.
- **SC-004**: The parent Open Questions line and the goal log row quote the same per-runtime shares as `implementation-summary.md`, and strict validation prints `RESULT: PASSED`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
<!-- FILL: Name one dependency and one risk. Give each a concrete mitigation. GOOD: A script that reads `--keep` with no value could delete every archive. Mitigation: reject a missing value with exit 2 and test it. WEAK: There may be some risk. -->

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The stored sessions in each runtime's home store and the OpenCode database | A runtime whose sessions cannot be opened reports no share | T001 records unscored reasons per runtime before any edit and T002 finds the database. A runtime that stays unreadable is reported as unscored, not dropped |
| Dependency | `command-bridges.generated.json` owner ids | A missing or renamed `skillId` turns a command row into `noOwner` | T004 checks every expected command in the logs has one owner and the summary counts `noOwner` apart |
| Risk | The devin reader drops tool arguments | High: every devin run would read as `improvised` or `none` | T003 measures it first, and REQ-008 counts devin as unscored for this measure when it is so |
| Risk | The share is read as proof that a workflow was followed step by step | Med: the operator might set a target on a number that means less than it seems | The spec, the README row and every place the share is recorded name it a proxy for loading before acting |
| Risk | A skill load on a different skill counts as improvised | Med: a run that loaded `system-spec-kit` for its gates on a `sk-doc` row lowers the share | The rule is owner-specific by design, because D7 names the skill's own workflow. `implementation-summary.md` states the limit beside the shares |
| Risk | A new field changes an existing value | Low: phase 007 numbers would shift | REQ-005 and T017 compare every old field before and after |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- FILL: Name one measurable limit per line. Write `N/A` and one reason when the packet runs no service, or delete the whole section. GOOD: The option adds under 5 ms to a run. WEAK: Performance is good. -->
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: The bridge table is read once per summary, so a `--summary` run over the 168 before lines takes no more than one second longer than the T001 capture of the same run.
- **NFR-P02**: `workflowPath` walks the event list once per run, with no file read per event.

### Security
- **NFR-S01**: No task reads, prints or copies holdout prompt text. A holdout row stays unscored by the existing refusal and the new code reads no prompt field.
- **NFR-S02**: No task starts a model session or writes under the home folder. The reads of stored sessions are read-only.

### Reliability
- **NFR-R01**: Every number comes from the committed scorer, so a rerun of the two `--summary` commands on the same machine prints the same `workflow` blocks.
- **NFR-R02**: A run the reader cannot open stays unscored with its reader code, and the share never counts it in either side.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES
<!-- FILL: Name the empty input, the maximum input and the failure path. One line each. Write `N/A` with one reason, or delete the whole section. GOOD: Empty input: an empty `logs/archive/` deletes nothing and exits 0. Maximum: `--keep 3` over 10,000 archives keeps the newest 3. Failure path: a missing `--keep` value exits 2 with usage. WEAK: Handle edge cases. -->

- Empty input: a run with no events and no changed path is `none`, and an arm with no acting run prints `share 0 of 0`.
- Maximum input: the before arm reads 168 lines in two logs. The DSH rerun log goes last, so its 24 lines replace the 24 DSH lines of `runs-pre.jsonl` by the existing latest-line rule.
- Failure path: a missing or unreadable bridge table ends the summary with a non-zero exit and the read error, the same way a missing corpus file does today, because every owner would be null and the share would read as zero.
- Ordering: an owner `SKILL.md` read after the first write is `improvised`, and the command document read before the write with its confirm workflow read only after it is not `command` under the existing rule.
- Transcript without a write: a run whose `changedPaths` is not empty but whose events hold no write has no boundary, so any load counts and the run is `skill` or `command`, else `improvised`.
- Nested mode: a read of `.skilled/skills/sk-doc/sk-create-agent/SKILL.md` on a `sk-doc` row is an owner load.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT
<!-- FILL: Score each row with the number the change earns. The total must match the level. Write `N/A` with one reason, or delete the whole section. GOOD: Scope 6/25: one option in `scripts/rotate-logs.sh`. Total 18/100. WEAK: Complexity is medium. -->

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 7/25 | One script, one test file and one README row. About 120 added lines in the scorer and 200 in the tests |
| Risk | 6/25 | The scorer's existing fields feed phase 007 numbers, guarded by an equality check. No reader, corpus or gate changes |
| Research | 8/20 | The owner source, the label gap, the arm names and two reader risks were traced at planning and two are measured first |
| **Total** | **21/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS
<!-- FILL: Write each open question as one line. Write `None` when nothing blocks. GOOD: Does a missing `--keep` value delete every archive? Decision: no, a missing value exits 2. WEAK: Edge cases are unclear. -->

### Resolved

- Q1. Build the measure now, from stored sessions, with no target? Decision (operator, question tool, 2026-11-13): yes, as this phase.
- Q2. Where does the owner come from, given `ownerSkillId` is not in the generated JSON? Decision: read `entries[].skillId` from `command-bridges.generated.json`, the same values `COMMAND_ROWS` holds as `ownerSkillId`. The TypeScript table needs a build to import, and T004 checks the two agree for every command the logs expect.
- Q3. How does `expected_top` reach the classifier, given `rowLabel` drops it? Decision: `rowLabel` keeps it and `startedLabel` sets it to null (T008).
- Q4. Does a host-expanded command count, given that rule sits in `hostExpanded` and not in `followedBeforeWrite`? Decision: `workflowPath` calls both, and neither changes.
- Q5. A run that read the command document before writing and its confirm workflow only after it fails `followedBeforeWrite`. Decision: keep that rule. The run falls to `skill` or `improvised`, so `command` keeps the one meaning the existing tests pin.
- Q6. A `compiled-route.cjs` call with a redirect becomes a write event, not a shell event. Decision: match the command text of shell and write events alike under the same position rule.
- Q7. The design names `/skills/<owner>/`, which misses a relative path that starts at `skills/`. Decision: match the segment at the start of the path or after a slash.
- Q8. What does `changedPaths` without a write event mean for ordering? Decision: it marks the run as acting, and with no write event in the transcript there is no boundary, so any load counts.
- Q9. Which arms? Decision: the before arm (`pre`, from `runs-pre.jsonl` then `runs-pre-dsh-rerun.jsonl`) and the final arm (`post`, from `runs-final.jsonl`). The after arm in `runs-post.jsonl` and the Codex-only arm stay out.

### Open

- Whether devin keeps tool arguments in its stored sessions. T003 measures it and REQ-008 decides what the summary does with the answer.
- Which OpenCode database holds the recorded sessions. T002 finds it and records the `OPENCODE_DB` value it used.
<!-- /ANCHOR:questions -->

---


