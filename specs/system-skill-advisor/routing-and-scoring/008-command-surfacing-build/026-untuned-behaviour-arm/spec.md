---
title: "Feature Specification: Phase 26: untuned-behaviour-arm"
description: "Every behaviour arm so far ran on tuned rows, once each, with arms that differed in more than the brief, so nothing shows whether the advisor brief itself makes a model take the right workflow more often. This phase runs 36 fresh blind rows twice with the advisor off and on at one commit on six runtimes, 864 sessions, and judges the result by the target fixed before the first session."
trigger_phrases:
  - "untuned behaviour arm"
  - "phase 26 untuned behaviour arm"
  - "fresh blind rows off and on"
  - "pooled sign test arm"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 26: untuned-behaviour-arm

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill every row: level, priority, status, date and branch. Use the real branch name. GOOD: Priority P1. Status Draft. Branch `feat/rotate-logs-keep`. WEAK: Priority TBD. Status maybe. -->

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-11-14 |
| **Branch** | `worktrees/352-command-surfacing-research` |
| **Parent Spec** | ../spec.md |
| **Phase** | 26 of 26 |
| **Predecessor** | 024-fable-review-remediation |
| **Successor** | 025-release-notes-and-doc-sync |
| **Handoff Criteria** | Every task in `tasks.md` is `[x]` or recorded with its reason, the advisor suite reports 0 failed, `scratch/arm-evidence.txt` holds the followed, paired, pooled, starts and delivery lines printed by the committed scorer, the parent goal log holds the arm verdict, the step reader row and the B-5 row, and strict validation prints `RESULT: PASSED` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 26** of the build that makes the skill advisor surface every tracked slash command with a run, start or ask policy on every supported CLI (`../spec.md`). The operator's need is that models stay free to choose and still take the right workflow more often. Phase 023 showed that no stored arm can say whether the brief causes that: the rows were tuned, each ran once, and the two arms differed in more than the brief (`../023-untuned-outcome-evidence/scratch/outcome-evidence.txt:31-35`). The operator approved a new arm on all six runtimes, Codex included (Q061), at 864 sessions (Q063). A Fable 5.2 session decided its design and its target (`../review/fable-decisions-2026-11-14/report.txt` sections 1, 2, 5 and 6, decisions P033 to P041). This phase plans that design and does not change it.

**Scope Boundary**: the behaviour runner, the arena builder, the transcript scorer, their two test files, the routing-accuracy README and one new row file. No phrase, guard, scorer rule, renderer, hook, plugin or `AGENTS.md` line changes in this phase. The B-6 edit to `AGENTS.md` is the coordinator's, made and committed before the arena build, and this phase only checks it (P036). Nothing is tuned on a number this phase prints.

**Dependencies**:
- Phase 024 is Complete and committed, because this phase edits the transcript scorer that phase last changed (T002 checks).
- The coordinator has committed the B-6 edit to the `AGENTS.md` Gate 2 bullet before the arena build (T038 checks).
- The operator approves the Codex project hooks in the prepared Codex arena (T040, Q061).
- Phase 025 starts after this phase closes, so the release notes can state the arm's result (P040).

**Deliverables**:
- Arms `off` and `on`, a `--run` number and a `fresh` set in the runner, and a `CLAUDE.md` pointer in every arena.
- Fresh row labels, two runs per row, an arm and delivery check, pairing by followed counts, a pooled exact sign test and command-start counts in the scorer.
- `behaviour-fresh-prompts.jsonl`: 36 rows written blind and frozen by hash at the first session.
- 864 scored sessions, `scratch/arm-evidence.txt`, the verdict in the parent goal log and a step reader's judgment on 24 sessions.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
<!-- FILL: State the problem in two sentences: what breaks, and for whom. GOOD: The rotate-logs script never deletes old archives, so a host that copies `logs/archive` fills its disk. WEAK: The script has issues with output. -->

### Problem Statement
Every outcome number the packet quotes comes from rows its phrases were written against, each run once, in arms that differ in the scorer, the wording and the brief, so an operator cannot tell whether the brief caused a single followed workflow (`../023-untuned-outcome-evidence/scratch/outcome-evidence.txt:15-35`). The harness cannot run a fair arm today: it has no off or on arm, a second run of a row replaces the first, no fresh row set exists, the switch the design names is not one any adapter reads, and the scorer prints no p-value (Measured Behavior).

### Purpose
The packet states, from committed scripts and against a target written before the first session, whether models on six runtimes take the right workflow more often with the advisor on than off, on requests nobody tuned for.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
<!-- FILL: Run the command this change affects and paste the command and its verbatim output. Quote every number the spec states about current behavior from this block. Write `N/A:` and a reason when no command applies. GOOD: `bash scripts/rotate-logs.sh` with 10 archives, then `ls logs/archive | wc -l` prints 10. WEAK: The script deletes old logs. -->
```text
# 2026-11-14, worktree HEAD 400c90e158, run from the repository root.
# RAD is .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy,
# R is $RAD/run-command-behaviour.mjs, S is $RAD/score-command-transcripts.mjs, SPD is a temp folder.
$ node $R --print-argv claude --arm off
run-command-behaviour.mjs: --arm: expected one of pre, post, smoke, g2
exit 2
$ node $R --list fresh
run-command-behaviour.mjs: unknown set: fresh
exit 2
$ ls $RAD/behaviour-fresh-prompts.jsonl
ls: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/behaviour-fresh-prompts.jsonl: No such file or directory
$ SYSTEM_SKILL_ADVISOR_HOOK_DISABLED=1 SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1 node --input-type=module -e "const m = await import('./$R'); console.log(Object.keys(m.childEnv('$SPD/gh')).filter((k) => k.includes('SKILL_ADVISOR')).join(' '))"
SPECKIT_SKILL_ADVISOR_HOOK_DISABLED
# two-runs.jsonl holds run 1 and run 2 of cmd-create-readme-plain-tune-01 in arm on and run 1 in arm off, each with an empty locator
$ node $S --summary $SPD/two-runs.jsonl --pair off,on --json | jq -c '{onRuns: .claude.on.runs, offRuns: .claude.off.runs, pooled: has("pooled")}'
{"onRuns":1,"offRuns":1,"pooled":false}
$ jq -r '[.entries[].skillId] | unique | join(" ")' .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/command-bridges.generated.json
sk-code sk-design sk-doc sk-git sk-prompt system-deep-loop system-skill-advisor system-skilled-doctor system-spec-kit
$ rg -c -F "If you take the command" AGENTS.md
exit 1
```
<!-- /ANCHOR:measured-behavior -->

`RAD` is `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy`. The block shows five gaps. The runner has no `off` or `on` arm and no `fresh` set. The turn environment drops `SYSTEM_SKILL_ADVISOR_HOOK_DISABLED`, because the allowlist prefix `SKILL_ADVISOR_` does not match a name that starts with `SYSTEM_`. A second run of one row in one arm is counted as one run, because the latest-line key holds no run number. The summary prints no pooled line. Only the nine skills listed own a command, so a skill-only row owned by any other skill scores as having no owner. The B-6 sentence is not in `AGENTS.md` yet.

### Pre-registered Target

Written before the first session, as P033 requires, so the arm cannot be tuned to it.

- **Units.** Only owned rows are paired: the 20 fit rows and the 8 skill-only rows, so at most 28 rows per runtime and 168 runtime and row pairs. A decline row has no owner, so it leaves the followed rate and the pairing (`RAD/score-command-transcripts.mjs:857`) and is judged by the start count below.
- **Gain and loss.** On one runtime, a row gains when its `on` arm followed on more of its two runs than its `off` arm, loses when on fewer, and ties otherwise. A followed run takes the `command`, `skill` or `asked` path, the numerator of `followedRate`. A row whose two arms scored a different number of runs is unpaired and in no count.
- **Met.** All three hold: the exact one-sided sign test over gained and lost, pooled over the runtimes, prints a p below 0.05, the `on` arm started no command on any decline row on any runtime, and the sealed reach floor holds, the capture printing at least 1 of 44 holdout rows in the fixture regime and at least 4 of 44 with the real embedding. For example 15 gained against 5 lost prints 0.0207 and passes, and 12 against 6 prints 0.1189 and does not.
- **Not shown.** Anything else is logged as not shown with the printed lines. No measured session is rerun for its result and nothing is tuned.
- **Per runtime.** A runtime's paired line is read as direction only. A runtime where gained is not above lost is logged as not shown on that runtime, with its paired line and one reason read from its lost rows.
- **Command start on a decline or skill-only row.** A run started a tracked command when a skill tool call names it, a `COMMAND:` line reports it `started`, the host expanded it, or the run read its document and also wrote inside its checkout. A read with no write is a lookup and not a start, because a question row is answered by reading.
- **B-5 trigger (P036).** It fires when the `on` arm started a command on any decline row, or when the `on` arm's skill-only start count, pooled over the runtimes, is above the `off` arm's.

### Arm Design

As P034 and Q063 fix it.

- **Rows.** 36 fresh rows in `RAD/behaviour-fresh-prompts.jsonl` with split `fresh`. 20 fit a command: 10 `start`, 5 `run` and 5 `ask`, at least 15 distinct commands, each of the families `create`, `deep`, `design`, `doctor`, `prompt` and `speckit` at least twice. 8 are skill-only, owned by one of the nine skills in the Measured Behavior block, across at least four skills and at most two rows per skill. 8 are decline rows, two each of `refusal`, `question`, `small-edit` and `app-problem`.
- **Author.** One blind DeepSeek worker session writes them under the protocol of the 48 sealed fit rows (`../023-untuned-outcome-evidence/tasks.md:78`): the class definitions, the row shape, a listing of tracked commands with their policy and owner skill, and the nine skill names, nothing else. The file's hash is logged and the rows are frozen at the first session.
- **Sessions.** Two runs per row, arms `off` and `on`, six runtimes: 36 × 2 × 2 × 6 = 864. Every session this phase starts counts against a hard cap of 900, smoke rows and reruns included.
- **The switch.** For `off`, the runner sets `SYSTEM_SKILL_ADVISOR_HOOK_DISABLED=1` and `SYSTEM_SKILL_ADVISOR_PLUGIN_DISABLED=1` on the turn's environment. For both `off` and `on` it first removes every inherited advisor disable name and both master switch names. The arms share the arena commit, the `AGENTS.md` text with B-6 and the models.
- **Order.** Per runtime: `off` run 1, `on` run 1, `off` run 2, `on` run 2. The six runtimes run side by side, each in its own arena (D5).
- **Delivery check.** A run whose `briefDelivered` contradicts its arm, `true` in `off` or `false` in `on`, is unscored and rerun once. `unknown` is no contradiction and is printed as a limit.

### Line References Checked

Each line the Fable report cites for a planned task was read on 2026-11-14 at 400c90e158.

| Cited | Found | Note |
|-------|-------|------|
| `RAD/run-command-behaviour.mjs:66` | `:66` | Matches: `PROMPTS_PATH` names `command-prompts.jsonl` only |
| `RAD/run-command-behaviour.mjs:633` | `:633` | Matches: the holdout refusal in `findRow` |
| `RAD/run-command-behaviour.mjs:872` | `:872` | Line matches, premise does not: the `SKILL_ADVISOR_` prefix passes no `SYSTEM_SKILL_ADVISOR_` name, and no adapter reads a name without the `SYSTEM_`, `SPECKIT_` or `MK_` start (`.skilled/hooks/shared/hook-flags.cjs:70-78`) |
| `RAD/run-command-behaviour.mjs:951` | `:951` | Matches: `ARMS` |
| `RAD/run-command-behaviour.mjs:1275-1289` | `:1275-1290` | Matches, the closing brace is on 1290 |
| `RAD/score-command-transcripts.mjs:1745` | `:1749` | Moved 4 lines: the `pairRows.set` line |
| `.skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md:169-173` | `:169-173` | Lines match. The names there are `SYSTEM_SKILL_ADVISOR_*_DISABLED` and the `SPECKIT_` legacy aliases. The report's `SKILL_ADVISOR_HOOK_DISABLED` and `SKILL_ADVISOR_PLUGIN_DISABLED` are read by nothing |
| `../023-untuned-outcome-evidence/tasks.md:78` | `:78` | Matches: task T004, the blind author protocol |
| `AGENTS.md:68` | `:68` | Matches. The report's new sentence ends in a colon, P036's in a period, so T038 checks the text without its last mark |
| `../decision-record.md:1257`, `:1259`, `:1267`, `:1272`, `:1280`, `:1285` | `:1354`, `:1356`, `:1364`, `:1369`, `:1377`, `:1382` | Moved 97 lines: P003, P005, P013, P018, P026 and P031 sit below the Q059 to Q064 rows added since |
| `../023-untuned-outcome-evidence/scratch/outcome-evidence.txt:15-24` | `:15-25` | The followed lines end on 25. `:10`, `:13-14`, `:16` and `:31-35` match |

---

<!-- ANCHOR:scope -->
## 3. SCOPE
<!-- FILL: List three to five things this change does, each starting with a verb. Before you list a new file, module, option, layer or dependency, name what fails today without it, or drop it. GOOD: Add a `--keep <n>` option that deletes all but the newest n archives in `logs/archive/`. WEAK: Update the script and docs. -->

### In Scope
- Give the live brief cost a number or a decline, as the first task (P041).
- Add arms `off` and `on`, a `--run` number and a `fresh` set to the runner, with the holdout guard, a repeated-text refusal and a refusal of a fresh row run without an arm or a run number. Without them the arm cannot run: the Measured Behavior block shows each refused or missing.
- Leave a `CLAUDE.md` that imports `AGENTS.md` in every arena. Without it Claude reads only the home `CLAUDE.md`, which links to main's `AGENTS.md`, so Claude turns miss the arena's Gate 2 text (`../goal.md:131`).
- Teach the scorer the fresh rows, two runs per row, the arm and delivery check, pairing by followed counts, the pooled exact sign test and command starts on decline and skill-only rows. Without them the target in this spec cannot be printed by a committed script (D6).
- Write 36 fresh rows blind, freeze them, run 864 sessions and record the verdict, the step reader's judgment and the B-5 decision.

### Out of Scope
- The B-6 edit itself - the coordinator makes and commits it before the arena build (P036). T038 checks it.
- The B-5 head wording - it is built in a new phase only when its trigger fires (P036).
- Raising the sealed reach, the fit decline count of 8 of 24 and the advisory on eight sealed rows - the follow-up packet owns them (Q060, P041).
- A third arm or a per-runtime verdict - P036 declines the arm and P033 makes per-runtime lines direction only.
- Tuning on any number this phase prints, or rerunning a measured session for its result - the miss rule of P033.
- The release notes - phase 025 runs after this phase (P040).

### Files to Change

`ADV` is `.skilled/skills/system-skill-advisor/runtime` and `RAD` is `ADV/scripts/routing-accuracy`.

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `RAD/run-command-behaviour.mjs` | Modify | Arms `off` and `on` and their switch, `--run`, the `fresh` set and its guards |
| `RAD/prepare-behaviour-arena.mjs` | Modify | A `CLAUDE.md` pointer the arena's git status does not list |
| `RAD/score-command-transcripts.mjs` | Modify | Fresh labels, the run key, the delivery check, count pairing, `pooled`, command starts |
| `RAD/behaviour-fresh-prompts.jsonl` | Create | 36 rows written blind, split `fresh` |
| `RAD/README.md` | Modify | The new options, fields and refusals |
| `ADV/tests/command-behaviour-guards.vitest.ts` | Modify | The runner and arena builder cases |
| `ADV/tests/command-transcript-score.vitest.ts` | Modify | The scorer cases |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
<!-- FILL: Write one testable requirement per row. Name the exact command or output. GOOD: With 10 archives, `bash scripts/rotate-logs.sh --keep 3` exits 0 and `ls logs/archive | wc -l` prints 3. WEAK: The option should work well. -->
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | No task reads, prints, logs or publishes the prompt text of a row whose split is `holdout`, and no task prints the prompt text of a fresh row. `command-prompts.jsonl`, `holdout-prompts.jsonl` and `behaviour-fresh-prompts.jsonl` are opened only through `jq 'del(.prompt)'`, apart from the blind author writing the fresh file. |
| REQ-002 | The target, the sign test and the miss rule in this spec are in the parent goal log before the first session, and the fresh file is frozen at the first session: `git diff --numstat <freeze commit> -- RAD/behaviour-fresh-prompts.jsonl` prints nothing at close. |
| REQ-003 | Every session runs in an arena with no remote, the builder's marker and no credentials (D5). Both arms of a runtime run at one arena commit that holds the harness, the frozen rows and the B-6 text, and the run logs of this phase hold at most 900 lines in total. |
| REQ-004 | Every number in the verdict comes from the scorer or the capture. The step reader's result and the review are logged as judgments, not as printed numbers (D6). |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | The live brief cost is a number from `measure-brief-cost.mjs` or a decline that quotes its refusal, recorded before any other task runs (P041). |
| REQ-006 | `childEnv(dir, 'off')` holds `SYSTEM_SKILL_ADVISOR_HOOK_DISABLED` and `SYSTEM_SKILL_ADVISOR_PLUGIN_DISABLED` set to `1`, `childEnv(dir, 'on')` holds no name that ends in `_DISABLED` and holds `SKILL_ADVISOR` or `HOOKS`, and `childEnv(dir, 'pre')` equals `childEnv(dir)`. |
| REQ-007 | `--set fresh` refuses with exit 2 a missing file (`fresh_missing`), a row on another split (`holdout_row` or `fresh_split`), a count other than 36 (`set_short`), a repeated prompt (`repeated_row`, naming two ids and no text) and a fresh row run without arm `off` or `on` (`fresh_arm`) or without `--run` (`fresh_run`). A run line records `run`. |
| REQ-008 | A fresh arena holds a `CLAUDE.md` that reads `@AGENTS.md`, and `git status --porcelain` in it prints nothing. |
| REQ-009 | The scorer labels a fresh row, keeps run 1 and run 2 of a row apart, leaves a delivery contradiction unscored as `arm_delivery_mismatch`, pairs by followed counts with an `unpaired` count, prints `pooled` with `--pair` and prints `declineStarts`, `skillOnlyStarts` and `commandStartRuns`. `signTestP(15, 5)` is 0.0207, `signTestP(12, 6)` is 0.1189 and `signTestP(0, 0)` is null. Over the stored one-run logs every earlier field keeps its value. |
| REQ-010 | `scratch/arm-evidence.txt` holds 12 `followed`, at most 6 `paired`, 1 `pooled`, 12 `starts` and 12 `delivery` lines from `jq` over the summary, the sealed floor lines and the `limit:` lines, and the parent goal log states met or not shown under the rules of this spec. |
| REQ-011 | A read-only Fable 5.2 reader judges 24 `on`-arm sessions that followed on a fit row, four per runtime or every one a runtime has, on three steps each, and the parent goal log records it as a judgment. |
| REQ-012 | The B-5 trigger is evaluated from the printed counts and logged as fired, with B-5 handed to a new phase, or as declined with the counts. |
| REQ-013 | No code comment added by this phase names a spec path, a phase, a task, a finding or a requirement id. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
<!-- FILL: Write one measurable outcome per line. A command can prove it. GOOD: With 10 archives in `logs/archive`, `bash scripts/rotate-logs.sh --keep 3` leaves 3. WEAK: The feature is successful. -->

- **SC-001**: `jq -c '.pooled | [.from, .to, (.p | type)]'` over the arm summary prints `["off","on","number"]`, where today the summary has no `pooled` key.
- **SC-002**: The parent goal log holds one `Arm verdict` row that reads `Met` or `Not shown` with the pooled line, the decline start count and both sealed floors, and the run logs of this phase hold at most 900 lines.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
<!-- FILL: Name one dependency and one risk. Give each a concrete mitigation. GOOD: A script that reads `--keep` with no value could delete every archive. Mitigation: reject a missing value with exit 2 and test it. WEAK: There may be some risk. -->

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The operator approves the Codex hooks in the prepared arena | The runner refuses Codex with `codex-hooks-unapproved` | T040 comes before the smoke rows. Without the approval Codex waits in the goal log and no Codex session starts |
| Dependency | Disk for six arenas. The five old arenas hold 34 GB and wait on the operator's deletion | An arena build fails half way | T039 checks free space first and stops below 45 GB |
| Dependency | The coordinator's B-6 commit | An arena without it measures the old Gate 2 text | T038 stops the build until the committed `AGENTS.md` holds the sentence once |
| Risk | The off switch does not reach one runtime's adapter | High: that runtime compares on with on | T032 probes the Claude, Codex and Devin hooks and the direct call. The smoke rows read delivery on every runtime, and each measured run line is checked for a contradiction where delivery is readable |
| Risk | OpenCode delivery is `unknown` in both arms, and Codex reads `unknown` wherever its reader finds no brief | Med: those arms rest on the switch alone | `deliveryUnknown` is printed per runtime and arm beside the rates, and a `limit:` line says so |
| Risk | Rows written to pass, or edited after a result | High: the arm would measure tuned rows | One blind author, a listing with no phrase or alias, the hash in the goal log and a `numstat` check at close |
| Risk | A miss | Likely: the brief carries the right command on 4 of 44 sealed rows | The miss rule logs not shown. Criterion 6 of the parent goal already accepts it |
| Risk | Claude also reads the home `CLAUDE.md`, which links to main's `AGENTS.md` | Low: both arms read it alike | A `limit:` line names it |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- FILL: Name one measurable limit per line. Write `N/A` and one reason when the packet runs no service, or delete the whole section. GOOD: The option adds under 5 ms to a run. WEAK: Performance is good. -->
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: The scorer reads each run line once. The command-start check walks the tracked command list only on decline and skill-only rows.
- **NFR-P02**: The sign test is exact integer arithmetic, so 168 pairs print the same p on every machine.

### Security
- **NFR-S01**: A turn gets no GitHub token, no credential helper and no remote, as every earlier arm (D5).
- **NFR-S02**: A refusal about a row names ids and never prompt text.

### Reliability
- **NFR-R01**: A summary of the stored one-run logs prints every earlier field with its earlier value, with and without `--pair pre,post`.
- **NFR-R02**: A rerun is appended to the same log and replaces the line of the same runtime, arm, row and run, so a retry never counts twice.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES
<!-- FILL: Name the empty input, the maximum input and the failure path. One line each. Write `N/A` with one reason, or delete the whole section. GOOD: Empty input: an empty `logs/archive/` deletes nothing and exits 0. Maximum: `--keep 3` over 10,000 archives keeps the newest 3. Failure path: a missing `--keep` value exits 2 with usage. WEAK: Handle edge cases. -->

- Empty input: a runtime that scored one arm has no `paired` block and adds nothing to `pooled`, and a pooled line with no gain and no loss prints `p` as null.
- Maximum input: 168 runtime and row pairs, all gained, print a p of 0, rounded to four decimals.
- Failure path: `--set fresh` with no fresh file exits 2 with `fresh_missing`, and a repeated prompt exits 2 naming the two ids.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT
<!-- FILL: Score each row with the number the change earns. The total must match the level. Write `N/A` with one reason, or delete the whole section. GOOD: Scope 6/25: one option in `scripts/rotate-logs.sh`. Total 18/100. WEAK: Complexity is medium. -->

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 15/25 | Seven files, about 750 lines with tests, 36 rows and 864 live sessions |
| Risk | 14/25 | Live sessions in six arenas and a target fixed in advance that may miss |
| Research | 8/20 | The design is decided. Each cited line was read again and five premises corrected |
| **Total** | **37/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS
<!-- FILL: Write each open question as one line. Write `None` when nothing blocks. GOOD: Does a missing `--keep` value delete every archive? Decision: no, a missing value exits 2. WEAK: Edge cases are unclear. -->

None blocks planning. Each point the dispatch left open is decided below and recorded as an assumption, open for the coordinator or the operator to overturn.

- A1. Level: `recommend-level.sh --loc 750 --files 7` printed Level 1. Decision: Level 2, because `acceptance-criteria.md` is the closure gate, as P001 and P025 decided for phases 020 to 025.
- A2. The switch: the runner sets `SYSTEM_SKILL_ADVISOR_HOOK_DISABLED` and `SYSTEM_SKILL_ADVISOR_PLUGIN_DISABLED` itself, because the names the report gives are read by nothing and the allowlist passes no `SYSTEM_` name. Both arms strip inherited disable names and the master switches, so `SYSTEM_HOOKS_DISABLED` is never used and the arms differ only in the advisor.
- A3. Off means the advisor fully off: the same switch makes the Gate 2 direct call abstain (`ADV/handlers/advisor-recommend.ts:164-167`), so an off-arm model that runs it gets no command either. The `AGENTS.md` text is the same in both arms.
- A4. A delivery contradiction is `true` in `off` or `false` in `on`. `unknown` is not one.
- A5. A command start on a decline or skill-only row is defined in the Pre-registered Target, over every command in the bridge table.
- A6. Skill-only rows name one of the nine skills that own a command, so the scorer counts them as owned with no change to its owner lookup. Phase 023's blind set used `mcp-code-mode` for four rows, which this scorer reads as no owner.
- A7. A fit row's `expected_policy` is the policy the tracked command table gives its command string, at route level for a doctor command. The coordinator gives the author a listing of command, policy and owner skill, which holds no phrase or alias.
- A8. A row whose arms scored a different number of runs is unpaired and counted in `unpaired`.
- A9. Run order per runtime is `off` 1, `on` 1, `off` 2, `on` 2, so drift over the day falls on both arms.
- A10. Smoke is one fit row per runtime and arm, 12 sessions in their own log, counted against the cap of 900, which leaves 24 sessions for reruns.
- A11. A harness fault is a delivery contradiction, a reader or locator failure, a spawn or restore failure, or an arm that stopped early, whose rows not yet run are then run. A capped turn is the model's behaviour and is not rerun.
- A12. The short review of the runner and scorer changes runs before the arena build, not after the step reader, so a runner fault is found before 864 sessions are spent. It is a read-only Fable 5.2 medium session on the second account, as D4 allows for key reviews.
- A13. The step reader takes, per runtime, the `on`-arm fit rows in id order, run 1 first, the first four the scorer counts as followed, then run 2. A shortfall is logged. The coordinator exports each session through the shared readers so the reader opens plain files.
- A14. A scorer test sets `SKILL_ADVISOR_FRESH_PROMPTS_PATH` to a temp row file, because no summary test can label a decline or skill-only row before the blind file exists, and a test over the frozen file would tie the suite to blind text. No arm or scoring command sets it.
- A15. The skill-only half of the B-5 trigger compares the start counts pooled over the runtimes.
- A16. The fresh file's prompt text is printed by no task, so the follow-up packet can rerun the same frozen rows as its acceptance test.
- A17. If the Codex `on` smoke row reads delivery `unknown`, the coordinator records from that session whether the brief arrived, which answers research question 4, and Codex delivery stays a printed limit.
- A18. The parent phase map gains row 26 and the handoffs read 024 to 026 to 025. Phase 025's own metadata still names 024 as its predecessor and its first task checks phases 019 to 024 only. Both sit outside this phase's write scope.
<!-- /ANCHOR:questions -->

---
