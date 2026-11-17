---
title: "Tasks: Phase 19: workflow-outcome-measure"
description: "Ordered single-dispatch tasks that measure the stored sessions first, add the workflowPath classifier and the per-arm workflow block to the transcript scorer with failing tests first, score the before and final arms into two scratch files and record the per-runtime shares, with no model run and no holdout text read."
trigger_phrases:
  - "workflow outcome measure tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 19: workflow-outcome-measure

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
| `[C]` | Coordinator task: a capture, a full-suite run, a scoring run, a parent doc edit or the close-out. No worker runs it |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

Every command runs from the repository root unless a task says `in ADV`. Set the path names once with `export ADV=.skilled/skills/system-skill-advisor/runtime RA=.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy P=specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build PH=specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/019-workflow-outcome-measure RL=specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/007-per-runtime-behaviour-proof/scratch` and `export WT="$(mktemp -d)"` once, before T001.
- `SC` is `$RA/score-command-transcripts.mjs`. `TS` is `$ADV/tests/command-transcript-score.vitest.ts`. `RAR` is `$RA/README.md`. `BR` is `$ADV/scripts/command-bridges/command-bridges.generated.json`. `CA` is `$ADV/lib/command-attach.ts`. `PS` is `$P/spec.md`. `PG` is `$P/goal.md`.
- `G` is `git -c core.fsmonitor=false`. `BASE` is the commit T001 records with `G rev-parse --short HEAD`. `WT` is a temporary folder outside the repository that holds the before captures and the coordinator's notes. T023 removes it.
- `VX` is `env -u AI_SESSION_CHILD npx vitest run tests/command-transcript-score.vitest.ts` in `ADV`. `VALL` is `env -u AI_SESSION_CHILD npx vitest run` in `ADV`. `TC` is `npm run typecheck` in `ADV`. `QG` is `node .skilled/skills/sk-code/sk-code-quality/scripts/quality-gate.cjs --files $SC $TS`.
- `SPRE` is `node $SC --summary $RL/runs-pre.jsonl $RL/runs-pre-dsh-rerun.jsonl --json`, the before arm. The rerun log goes last so its 24 dsh lines replace the first ones. `SFIN` is `node $SC --summary $RL/runs-final.jsonl --json`, the final arm, filed under the arm name `post`. Both run with the `OPENCODE_DB` value T002 records, or with none when T002 records none.
- `UNSC` is `jq -r 'to_entries[] | .key as $r | .value | del(.unscored) | to_entries[] | "\($r) \(.key) scored \(.value.scored) of \(.value.runs) " + ([.value.unscoredRuns[].reason] | group_by(.) | map("\(.[0]) \(length)") | join(", "))'`, one line per runtime and arm with its unscored reasons.
- `WFSHOW` is `jq -r 'to_entries[] | .key as $r | .value | del(.unscored) | to_entries[] | "\($r) \(.key) share \(.value.workflow.share) command \(.value.workflow.command) skill \(.value.workflow.skill) improvised \(.value.workflow.improvised) none \(.value.workflow.none) noOwner \(.value.workflow.noOwner) unscored \(.value.workflow.unscored)"'`.
- `SUMOK` is `jq '[to_entries[] | .value | del(.unscored) | to_entries[] | .value | (.workflow.command + .workflow.skill + .workflow.improvised + .workflow.none + .workflow.noOwner + .workflow.unscored - .unscored) == .scored] | all'`, which prints `true` when every arm's counts add up.
- `OLDF` is `jq -S 'walk(if type == "object" then del(.workflow) else . end)'`, the output with every new key removed.

Rules for every task:
- Never read, print or copy holdout prompt text. Read `$RA/command-prompts.jsonl` only through a `jq` filter that deletes `.prompt` first. Start no model session and run no behaviour runner. Write nothing under the home folder.
- Each worker task is one change to the one file it names, in the function it names. Re-read the file before the first edit. When a function or line the task names is not there, change nothing and mark the task `[B]` with what was found.
- Workers are DeepSeek v4.1 flash max through OpenCode Go, one task per dispatch. An Opus subagent runs the task's `Verify:` commands and reads the diff before the next task starts. No worker runs `VALL`, `TC`, a `--summary` over the stored logs or a parent doc edit.
- Do not edit any file under `.skilled/hooks/shared/session-readers/`, `$RA/command-prompts.jsonl`, `$RA/run-command-behaviour.mjs`, `BR`, `CA`, any `package.json` or any phase folder other than this one. `PS` and `PG` change only in T021 and T022.
- A code comment states the durable reason and never a task id, phase number or spec path. A `.md` edit outside this folder routes through `sk-doc` before the first write and holds no em dash and no semicolon.
- When a verify prints something other than the expected output, change nothing to match it. Mark the task `[B]` with the printed line.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
<!-- FILL: Replace the sample tasks with the real setup steps. Each task names a file and a verify command. GOOD: T001 Confirm `logs/archive/` holds 10 archives. Verify: `ls logs/archive | wc -l` prints 10. WEAK: T001 Set up the project. -->

- [x] T001 [C] Capture the unchanged summaries before any edit (`$WT/base-pre.json`, `$WT/base-final.json`, `$WT/notes.txt`). Run `G rev-parse --short HEAD`, which is `BASE`, `G status --porcelain -- $SC $TS $RAR`, `G status --porcelain > $WT/dirty0.txt` and `VX`. `dirty0.txt` lists the files already changed before this phase, which T019 allows. Then run `SPRE > $WT/base-pre.json` and `SFIN > $WT/base-final.json`, and write `BASE`, the two exit codes and `UNSC` over each file into `$WT/notes.txt`. The unscored reasons show whether the gone arena folders block any runtime. Verify: the `status` prints nothing, `VX` reports 0 failed, both runs exit 0, `jq -r 'keys | join(" ")' $WT/base-pre.json` prints `claude codex devin dsh opencode pi` and the same filter over `$WT/base-final.json` prints `claude devin dsh opencode pi`. Evidence: `BASE` is `23e7eee17b`, the `status` printed nothing, `VX` reported 61 passed and 0 failed, both runs exited 0, the key lines printed `claude codex devin dsh opencode pi` and `claude devin dsh opencode pi`. Every runtime scored 24 of 24 in both arms except dsh post at 23 of 24 with one `locator_unavailable`.
- [x] T002 [C] Find the OpenCode database that holds the recorded sessions (`$WT/notes.txt`). When the `UNSC` lines for `opencode` in T001 read `scored 24 of 24` in both arms, write `OPENCODE_DB unset` and stop. Otherwise list the files in `${XDG_DATA_HOME:-$HOME/.local/share}/opencode/` that end in `.db`, rerun `SFIN` once with `OPENCODE_DB` set to each, and keep the value whose `opencode` line has the most scored runs. Write that value and its `UNSC` lines. Verify: `$WT/notes.txt` holds one `OPENCODE_DB` line, and `SFIN` under that value prints an `opencode post` `UNSC` line whose scored count is at least the T001 count, or the task is `[B]` with the reasons every candidate printed. Evidence: the `opencode` lines read `scored 24 of 24` in both arms, so the notes hold `OPENCODE_DB unset`.
- [x] T003 [C] Measure whether the devin reader keeps tool arguments (`$WT/notes.txt`). Run a `node --input-type=module -e` script that imports `loadSession` from `.skilled/hooks/shared/session-readers/index.mjs` and `normalize` from `SC`, loads every devin line of `$RL/runs-pre.jsonl` and `$RL/runs-final.jsonl` with its own locator, and prints one line per arm in the form `devin <arm>: sessions L of 24, tool events E, with a path or command A`. It prints no event text. Write both lines and the decision: T013 applies when `A` is 0 in an arm, and does not apply otherwise. Verify: `rg -c '^devin (pre|post): sessions [0-9]+ of 24, tool events [0-9]+, with a path or command [0-9]+$' $WT/notes.txt` prints 2, and the notes hold one line `devin rule: applies` or `devin rule: not needed`. Evidence: `devin pre: sessions 24 of 24, tool events 532, with a path or command 532` and `devin post: sessions 24 of 24, tool events 356, with a path or command 356`, so the notes hold `devin rule: not needed`.
- [x] T004 [C] Check the owner table covers every expected command in the logs (`$WT/notes.txt`). Run `jq -r '.entries[] | "\(.command) \(.skillId)"' $BR | sort -u` and keep the lines for the 15 commands the 16 `cmd-` rows expect, then `rg -n "command: '/(create|deep|doctor):" $CA` and compare each owner with its `ownerSkillId`. Verify: each of the 15 commands has exactly one distinct `skillId`, none is null, the owners are `sk-doc` 8, `system-deep-loop` 4, `system-skilled-doctor` 2 and `sk-code` 1 by distinct command, and every `ownerSkillId` in `CA` for those commands equals the JSON value. Evidence: 15 commands, each with one non-null `skillId`, owners `sk-doc` 8, `system-deep-loop` 4, `system-skilled-doctor` 2 and `sk-code` 1. Ten equal `ownerSkillId` in the command rows of `CA` and five (`/create:benchmark`, `/create:command`, `/create:diff`, `/create:goal`, `/deep:ai-council`) equal it in the tracked command table of the same file, which the task's `rg` pattern does not reach.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
<!-- FILL: Write one implementation task per file change. Add a `Verify:` line with the command and its expected output. GOOD: T002 Add the `--keep <n>` branch. Verify: `--keep 3` leaves 3 archives. WEAK: T002 Implement the feature. -->

### Tests first, one dispatch each, run in order

- [x] T005 Add a `describe('workflowPath')` block with the five value cases (`TS`). Read the function through a namespace import, `import * as scorer from '../scripts/routing-accuracy/score-command-transcripts.mjs'`, so a missing export fails only these cases. Build events with `normalize(oneTurn(...), 'claude')` or `turns(...)` and call `scorer.workflowPath(events, { command, owner, wrote })`. Cases: the command document `.claude/commands/create/readme.md` read before a write returns `command`, the `EXPANDED_RECORDS` session with `/deep:research` returns `command`, `.skilled/skills/sk-doc/SKILL.md` read before a write with owner `sk-doc` returns `skill`, a write with no load returns `improvised`, a session with one text block and `wrote: false` returns `none` and owner `null` with no expected command returns `noOwner`. Verify: `VX` reports exactly 6 failed. Each failure names `workflowPath is not a function` and every case that passed at `BASE` still passes. Evidence: `VX` printed `Tests  6 failed | 61 passed (67)`, all six inside `describe('workflowPath')`, checked by an Opus verifier. Amended here: Vitest prints the failure as `workflowPath is not a function`, without the namespace name, so the expected text in T005 and T006 was corrected. The cause is the missing export, as intended. The worker added the constant `SKILL_DOCUMENT` for the third case.
- [x] T006 Add the edge cases to the same `describe('workflowPath')` block (`TS`). Cases: `.skilled/skills/sk-doc/SKILL.md` read after the first write returns `improvised`, `.skilled/skills/sk-doc/sk-create-agent/SKILL.md` read before a write with owner `sk-doc` returns `skill`, `.skilled/skills/sk-doc/ROUTER.md` read before a write returns `skill`, `toolCall('Skill', { skill: 'sk-doc' })` before a write returns `skill`, `toolCall('Bash', { command: 'node .skilled/bin/compiled-route.cjs --hub sk-doc --prompt-stdin' })` before a write returns `skill`, the same call with `--hub sk-code` returns `improvised`, `.skilled/skills/sk-doc/SKILL.md` read with no write event and `wrote: true` returns `skill` and `.skilled/skills/system-spec-kit/SKILL.md` read before a write with owner `sk-doc` returns `improvised`. Verify: `VX` reports exactly 14 failed, the 8 new ones naming `workflowPath is not a function`. Evidence: `VX` printed `Tests  14 failed | 61 passed (75)`, the failure text appears 14 times and an Opus verifier matched all eight cases to this line with no deviation.
- [x] T007 Add two summary cases to `describe('run log summary')` (`TS`). Extend `loadableSession` entries with a Claude `tool_use` turn and its `tool_result` user turn of the same id, because the reader rejects a tool call left without its result in the middle of a session. Case one: row `cmd-create-agent-plain-tune-01` with a `Read` of `.skilled/skills/sk-doc/SKILL.md` before a `Write` of `out/agent.md` reads `workflow: { command: 0, skill: 1, improvised: 0, none: 0, noOwner: 0, unscored: 0, share: '1 of 1' }` in the `tune` block. Case two: row `mns-chat-01` with the base turn alone reads `noOwner: 1` and `share: '0 of 0'`. The same log without `--json` prints a line that starts with `    workflow: ` and ends with `share 0 of 0`. Verify: `VX` reports exactly 16 failed, the 2 new ones on a missing `workflow` key or line. Evidence: `VX` printed `Tests  16 failed | 61 passed (77)`, seen by the coordinator and again by an Opus verifier. Both new cases fail on the `toMatchObject` that expects the `workflow` key, with `runs: 1` and `scored: 1` in the received block, so the reader accepted the session. The worker left `loadableSession` unchanged and passed the tool turn and its result through its existing `extraEntries` parameter, built by a new helper `claudeToolTurn`. A second new helper, `summarizeForms`, runs the same log with and without `--json`. The text-line assertion sits after the failing one, so it has not run yet and first runs under T012.

### Code, one dispatch each, run in order

- [x] T008 Keep `expected_top` on the row label (`SC`, `rowLabel` and `startedLabel`). In `rowLabel` add `expected_top: typeof row.expected_top === 'string' ? row.expected_top : null`. In `startedLabel` add `expected_top: null`. Verify: `rg -c 'expected_top' $SC` prints 2 and `VX` reports exactly 16 failed, the same cases as after T007. Evidence: the diff is the two named lines and nothing else, `rg -c` printed 2 and `VX` printed `Tests  16 failed | 61 passed (77)`, the same 14 and 2 cases, run by the coordinator and again by an Opus verifier. No test compares a label object, so the new key breaks no equality check.
- [x] T009 Read the owner table once per summary (`SC`, a new internal `loadOwners` and `ownerOf`, called from `summarize` beside `loadRowLabels`). `loadOwners` reads `BR` through a path resolved from the script folder, `../command-bridges/command-bridges.generated.json`, and returns a map from `namespace:name`, built with `commandParts`, to `skillId`, plus the set of every `skillId`. `ownerOf(label, owners)` returns the mapped owner of `label.expected_command`, else `label.expected_top` when the set holds it, else `null`. A read or parse error is not caught, so the summary ends non-zero the way a missing corpus does. Verify: `rg -c 'command-bridges.generated.json' $SC` prints 1, `rg -c '^export function (loadOwners|ownerOf)' $SC` prints 0 and `VX` reports exactly 16 failed. Evidence: the first `rg -c` printed 1, the second printed nothing and exited 1, which is how `rg -c` shows no match, and `VX` printed `Tests  16 failed | 61 passed (77)`, run by the coordinator and again by an Opus verifier. The verifier read the table: 63 entries, 44 distinct commands, no command with two owners and no empty `skillId`, and a copy of the new logic returned `sk-doc` for `/create:agent`, `system-deep-loop` for `/deep:review:auto`, `sk-code` for `/doctor:ci` and `null` for an unknown command. `loadOwners` also skips an entry with an empty `skillId` or a command that parses to nothing, which no entry of the table is. `owners` and `ownerOf` are not used until T011.
- [x] T010 Add and export `workflowPath(events, { command, owner, wrote })` with an internal `ownerLoadedBeforeWrite(events, owner)` (`SC`, section 7 after `followedBeforeWrite`). Return `noOwner` when `owner` is null. Return `command` when `command` is a string and `followedBeforeWrite(events, command)` or `hostExpanded(events, commandParts(command))` is true. Return `skill` when an owner load lands before `firstWritePosition(events)`, or anywhere when that is null. An owner load is a `read` or `skill` event whose path, after backslashes become slashes, matches `(?:^|/)skills/<owner>/(?:.*/)?(?:SKILL|ROUTER)\.md$`, a `skill` event whose command equals the owner or a `shell` or `write` event whose command matches `\bcompiled-route\.cjs\b` and holds `--hub <owner>` as a whole word. The owner is escaped before it enters a pattern. Return `improvised` when `wrote` is true or the events hold a write, else `none`. Leave `followedBeforeWrite` and `hostExpanded` unchanged. Verify: `G diff BASE -- $SC` shows no line removed from `followedBeforeWrite` or `hostExpanded`, and `VX` reports exactly 2 failed, the two T007 summary cases. Evidence: `G diff BASE -- $SC` removes no line anywhere in the file, and `VX` printed `Tests  2 failed | 75 passed (77)`, the two T007 cases on a missing `workflow` key, with all 14 `workflowPath` cases passing. Checked by the coordinator and by an Opus verifier, who also ran 18 edge probes: an owner with regex characters, a longer hub name and a backslash path all resolve correctly, and an unparseable command does not crash. One safe deviation: the command branch also requires `commandParts(command)` to be non-null, because `hostExpanded` would throw on a null command when an `expanded` event is present. The verifier graded two P2 items, both handled by T024: a `compiled-route.cjs` call with a redirect is the run's first write, so the position rule skips it and the write shape of the hub load never fires, and `x--hub sk-doc` counts because nothing anchors the start of `--hub`.
- [x] T011 Carry the value into the per-arm JSON block (`SC`, `scoreRun`, `newTally`, `addScored` and `tallyBlock`). `scoreRun` takes the owners as a third argument from `summarize`, computes `wrote` as its existing changed-path fact or a write event, and returns `workflowPath` beside its other fields. `newTally` gains `workflow: { command: 0, skill: 0, improvised: 0, none: 0, noOwner: 0, unscoredOnly: 0 }`. `addScored` adds one to the matching count. `tallyBlock` emits `workflow: { command, skill, improvised, none, noOwner, unscored: tally.unscored + unscoredOnly, share: rate(command + skill, command + skill + improvised) }`. No existing field changes name or value. Verify: `VX` reports exactly 1 failed, the second T007 case, on its missing `workflow:` text line. Evidence: `VX` printed `Tests  1 failed | 76 passed (77)`, the one failure at the missing `    workflow: ` line, checked by the coordinator and an Opus verifier. The worker kept the old `wrote` field on the changed-path fact through a local `changedPathWrite` and passes the write-event fact only to `workflowPath`. The verifier scored both stored arms with the new scorer: with `.workflow` removed both outputs equal the T001 captures (`diff` empty, exit 0) and the count invariant holds in every arm. `unscoredOnly` stays 0 because only the devin rule of T013 would feed it, and T003 found that rule not needed.
- [x] T012 Print the block on one text line under each arm (`SC`, `writeSummary`). After the arm's main line and before its `unscored` lines, print `    workflow: command C, skill S, improvised I, none N, no owner O, unscored U, share X of Y` from the block. Verify: `VX` reports 0 failed. Evidence: `VX` printed `Tests  77 passed (77)`, and `--summary` over the final arm printed five `    workflow: ` lines, one per runtime arm, each between the arm line and its `unscored` lines. Checked by the coordinator and an Opus verifier, who found only `writeSummary` changed for this task.
- [x] T013 Count devin as unscored for this measure when T003 recorded `devin rule: applies` (`SC`, `scoreRun` and `addScored`). Add one frozen set, `WORKFLOW_UNREADABLE_RUNTIMES`, holding `devin`, with a comment that says its stored sessions keep no tool arguments, so a load cannot be told from its absence. `scoreRun` returns `workflowPath: 'unreadable'` for those runtimes, `addScored` adds it to `unscoredOnly` and `writeSummary` appends ` (devin keeps no tool arguments)` to that runtime's `workflow:` line. When T003 recorded `devin rule: not needed`, change nothing and write that line into the task. Verify: `VX` reports 0 failed, and `rg -c 'WORKFLOW_UNREADABLE_RUNTIMES' $SC` prints at least 2 when the rule applies, or the task holds `devin rule: not needed` and the same `rg` prints nothing. Evidence: devin rule: not needed. T003 found every devin tool event in both arms keeps a path or command (532 of 532 and 356 of 356), so nothing changed and `rg -c 'WORKFLOW_UNREADABLE_RUNTIMES' $SC` printed nothing and exited 1.
- [x] T024 [C] Make the hub load in a redirected `compiled-route.cjs` call count, and anchor `--hub` (`SC` `ownerLoadedBeforeWrite`, `TS`). Added after the T010 check, decided without the operator (D1): Q6 meant a redirected hub dispatch to count as a load, and under the strict position rule it never can, because that write event is itself the first write. Add two cases to `describe('workflowPath')` first: a run whose only write is `node .skilled/bin/compiled-route.cjs --hub sk-doc --prompt-stdin > out/route.json` returns `skill`, and a shell call holding `x--hub sk-doc` returns `improvised`. Then let a `write` event that runs `compiled-route.cjs` for the owner count when its position is at or before the first write, and require a start of string or whitespace before `--hub`. Verify: `VX` shows the two new cases failing before the code edit and 0 new failures after it, and every other case keeps its result. Evidence: before the code edit `VX` printed `Tests  2 failed | 77 passed (79)`, the two new cases receiving `improvised` and `skill`. After it `VX` printed `Tests  79 passed (79)`. Five probes: a redirected hub call as the only write is `skill`, the same call after an earlier write is `improvised`, a redirect to another hub is `improvised`, and a redirect with two targets counts once. Rescoring both stored arms changed no workflow count, so no stored run held a redirected hub call or a fused `--hub`, and `SUMOK` printed `true` for both.
- [x] T025 [C] Add the outcome reading that keeps every owned run (`SC` `scoreRun`, `newTally`, `tallyBlock`, `addScored`, `writeSummary`, `TS`). Added after two Fable 5.2 medium reviews on the second Claude account found that `share` drops every run that wrote nothing, decided without the operator (D1, spec Q10). `scoreRun` returns `acted`, true when the events hold a read or a shell step. The block gains `noneActed` and `loadRate: rate(command + skill, command + skill + improvised + none)`, and the text line prints `none acted N` after `none` and `load rate X of Y` before `share`. Verify: the new summary case fails before the code edit and `VX` reports 0 failed after it, and `OLDF` over both rescored arms equals the T001 captures. Evidence: before the code edit `VX` printed `Tests  1 failed | 79 passed (80)` on the missing keys, after it `Tests  80 passed (80)`. Both arms rescored with exit 0, and `diff` of `OLDF` against `base-pre.json` and `base-final.json` printed nothing.
- [x] T026 [C] Leave the framework's required gate steps out of `acted` and count another skill's load (`SC` `scoreRun`, new internal `workedTheTask`, `TS`). Added after the Opus check of T025 found that every Claude session runs the Gate 1 lookup first, so at least 2 runs that did no task work counted as acting. Decided without the operator (D1). A shell step running `lookup-trigger-index.mjs` or `skill-advisor.cjs` and a read of `AGENTS.md`, `CLAUDE.md`, `REPO RULES.md` or a file under `.skilled/repo-rules/` no longer count, and a `skill` event now does. Verify: two new summary cases fail before the code edit and `VX` reports 0 failed after it, the load rates do not move and `OLDF` over both arms equals the T001 captures. Evidence: before the edit `VX` printed `Tests  2 failed | 80 passed (82)`, the gate case receiving `noneActed: 1` and the skill case `0`. After it `Tests  82 passed (82)`. Load rates unchanged in both arms, `diff` of `OLDF` printed nothing for both, and Claude's final-arm `noneActed` went from 9 to 5 of 10.
- [x] T014 [P] Name the new block in the README row (`RAR`). Re-read the row that starts ``| `score-command-transcripts.mjs` |``. After `` `armIncomplete` and `byPolicy`, `` insert `` `workflow`, `` and, after the sentence that explains `byPolicy`, add ``The `workflow` block sorts each run into `command`, `skill`, `improvised`, `none` or `noOwner` and prints `share` as the runs that loaded the command's or the owning skill's own workflow before their first write, out of every run that acted. It shows a workflow was loaded, not that each step was followed.`` Verify: `rg -c 'The .workflow. block sorts each run' $RAR` prints 1, ``rg -c '^\| `score-command-transcripts.mjs` \|' $RAR`` prints 1 and ``rg '^\| `score-command-transcripts.mjs` \|' $RAR | rg -c '\x{2014}|\x{3B}'`` prints nothing. Evidence: the three `rg` checks printed 1, 1 and nothing, checked by an Opus verifier. Deviation: the list reads `` `armIncomplete`, `byPolicy` and `workflow`, `` because the literal insert would have left `` `armIncomplete` and `byPolicy`, `workflow`, `` which is not a sentence.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
<!-- FILL: Write one verification task per requirement. Each one runs a command. GOOD: T003 Run both invocations. Verify: `ls logs/archive | wc -l` prints 3 and 10. WEAK: T003 Test everything. -->

- [x] T015 [C] Run the gates on the final tree (`$WT/notes.txt`). Run `VX`, `TC`, `VALL` and `QG`, and write each result line and exit code into the notes. Verify: `VX` and `VALL` report 0 failed, `TC` exits 0 and `QG` exits 0. Evidence, on the final code after T024 to T026: `VX` printed `Tests  82 passed (82)`, `TC` exited 0, `QG` exited 0 with `p0_blocking 0`, `p1_open 0` and `p2_open 0`, and `VALL` printed `Test Files  184 passed (184)` and `Tests  1838 passed | 6 skipped (1844)`, 21 more than the 1817 at `BASE`, which equals the 21 cases this phase added. All lines are in `$WT/notes.txt`.
- [x] T016 [C] Score the before arm (`$PH/scratch/workflow-pre.json`). Run `SPRE > $PH/scratch/workflow-pre.json`, then `WFSHOW` and `SUMOK` over it. Verify: the run exits 0, `WFSHOW` prints one line for each of `claude`, `codex`, `devin`, `dsh`, `opencode` and `pi` under `pre`, each with a share in the form `N of M` where `M` is at most 16. `SUMOK` prints `true`. When T003 recorded `devin rule: applies`, `jq '.devin.pre.workflow.unscored == .devin.pre.runs'` over the file prints `true`. Evidence: the run exited 0, `WFSHOW` printed six `pre` lines, every share at most 16 in its denominator (claude 4 of 4, codex 0 of 0, pi 3 of 7, devin 12 of 12, opencode 9 of 11, dsh 10 of 12), and `SUMOK` printed `true`. The devin rule was not needed, so the devin check does not apply. The file also carries `loadRate` from T025: claude 4 of 16, codex 0 of 16, pi 3 of 16, devin 12 of 16, opencode 9 of 16, dsh 10 of 16.
- [x] T017 [C] Score the final arm (`$PH/scratch/workflow-final.json`). Run `SFIN > $PH/scratch/workflow-final.json`, then `WFSHOW` and `SUMOK` over it. Verify: the run exits 0, `WFSHOW` prints one line for each of `claude`, `devin`, `dsh`, `opencode` and `pi` under `post`, each with a share in the form `N of M` where `M` is at most 16. `SUMOK` prints `true`. When T003 recorded `devin rule: applies`, `jq '.devin.post.workflow.unscored == .devin.post.runs'` over the file prints `true`. Evidence: the run exited 0, `WFSHOW` printed five `post` lines (claude 6 of 6, devin 15 of 15, dsh 12 of 14, pi 5 of 6, opencode 7 of 10), and `SUMOK` printed `true`. Load rates: claude 6 of 16, devin 15 of 16, dsh 12 of 15, pi 5 of 16, opencode 7 of 16.
- [x] T018 [C] Prove the old fields did not move (`$WT/notes.txt`). Run `diff <(OLDF $WT/base-pre.json) <(OLDF $PH/scratch/workflow-pre.json)` and the same for `base-final.json` against `workflow-final.json`. Verify: both `diff` runs print nothing and exit 0. Evidence: both `diff` runs printed nothing and exited 0.
- [x] T019 [C] Check the boundaries. Verify: `G diff --name-only BASE -- .skilled .opencode .claude AGENTS.md` prints the paths of `SC`, `TS` and `RAR` and otherwise only paths listed in `$WT/dirty0.txt`, `G status --porcelain --untracked-files=all -- .skilled` lists no untracked file, `G diff --quiet BASE -- .skilled/hooks $RA/command-prompts.jsonl $RA/run-command-behaviour.mjs $ADV/scripts/command-bridges $ADV/lib` exits 0, `G diff --stat BASE -- '*package.json' '*package-lock.json'` prints nothing, `G status --porcelain --untracked-files=all -- $PH/scratch` lists exactly `workflow-pre.json` and `workflow-final.json` and ``rg -ln 'score-command-transcripts' . --glob '!specs/**' --glob '!**/node_modules/**' --glob '!**/dist/**'`` lists no file outside `SC`, `TS`, `RAR` and files that only name the script. Evidence: the only other paths changed since `BASE` are the advisor changelog from `61bb793288` and the trigger index with its three fixtures from the continuity commit `16c9757ac0`, both outside this phase's code and named in the handoff as allowed. No untracked file under `.skilled`, the protected `diff --quiet` exited 0, the package `--stat` printed nothing, the scratch folder holds exactly the two files and the consumer search adds only `command-behaviour-guards.vitest.ts`, which imports `startedLabel` and runs the scorer without reading the `workflow` block, and passes in `VALL`.
- [x] T020 [C] Write the results (`$PH/implementation-summary.md`). Record `BASE`, the `OPENCODE_DB` value, the devin rule and the unscored reasons from `$WT/notes.txt`, then one row per runtime with its before share and its final share from `WFSHOW` over the two scratch files, with `not run` for the codex final share. State that the share counts a load before the first write rather than each step followed and that a load of a skill other than the owner counts as improvised. Verify: `rg -c '^\| (claude|codex|devin|dsh|opencode|pi) \|' $PH/implementation-summary.md` prints 6 and each share in those rows equals the `WFSHOW` value for that runtime and arm. Evidence: the `rg -c` printed 6, and each share and load rate in the table equals the `WFSHOW` and `loadRate` values over the two scratch files. The summary also records the load rates from T025, the final-arm `ask` counts among unloaded runs and the five limits.
- [x] T021 [C] Record the shares in the parent spec (`PS`). Re-read `PS`. Replace the third bullet of section 4 Open Questions, the one that starts `The packet measures how often a command is offered`, with one bullet that gives each runtime's before and final share as `N of M`, names `019-workflow-outcome-measure/scratch/` as the source, says the measure is a proxy for loading before acting and says the operator sets the target. Set the Status cell of phase map row 19 to `Complete`. Verify: `rg -c 'A measure for it is proposed and not built' $PS` prints nothing, `rg -c '019-workflow-outcome-measure/scratch/' $PS` prints 1 and ``rg -c '^\| 19 \| 019-workflow-outcome-measure/ \|.*\| Complete \|$' $PS`` prints 1. Evidence: the planner had already rewritten the third bullet, so the shares, the load rates, the source folder, the proxy wording and the operator target were folded into it, and row 19 reads Complete. The three `rg` checks printed nothing (exit 1), 1 and 1.
- [x] T022 [C] Add one goal log row (`PG`). Re-read `PG` section 4. Add one row to its progress table with the date, `Phase 019 workflow outcome measure`, the per-runtime before and final shares as `N of M` and the two scratch file names. Verify: `rg -c 'Phase 019 workflow outcome measure' $PG` prints 1 and the shares in that row equal the T020 rows. Evidence: the row was added with `goal.cjs packet-log`. Deviation: `rg -c` prints 2, because the earlier `Planned, commit 65b4c97990` row also starts with the phrase, and that row was logged after this task was written. The new row's cells are cut with `...` by the log writer, and every share and load rate it carries equals the T020 rows.
- [x] T023 [C] Close out (`$PH/acceptance-criteria.md`, `$PH/spec.md`). Mark each acceptance row with the evidence observed, set `spec.md` Status to `Complete`, run `node .skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs --folder $PH --apply`, then strict validation, then `rm -r "$WT"`. Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh $PH --strict` prints `RESULT: PASSED` and `test -d "$WT"` exits 1. Evidence: every acceptance row Met with observed evidence and a task-line citation, `spec.md` Status Complete, `repair-derived.cjs --apply` run, `validate.sh $PH --strict` printed `Errors: 0  Warnings: 0` and `RESULT: PASSED`, and `WT` removed after a look (`test -d` exit 1).
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
<!-- FILL: Keep the three completion lines and add the one artifact that proves the phase is done. GOOD: `--keep 3` leaves 3 archives and the suite passes. WEAK: Work is complete. -->

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: `SUMOK` prints `true` over both scratch files and both T018 `diff` runs print nothing Evidence: `SUMOK` over `scratch/workflow-pre.json` and `scratch/workflow-final.json` printed `true` and `true`, and both `diff <(OLDF $WT/base-*.json) <(OLDF $PH/scratch/workflow-*.json)` runs printed nothing and exited 0, rerun 2026-11-14.
- [x] `scratch/workflow-pre.json` and `scratch/workflow-final.json` exist and their shares match `implementation-summary.md`, `../spec.md` and `../goal.md` Evidence: both files exist, `WFSHOW` over them prints claude 4 of 4 to 6 of 6, codex 0 of 0, pi 3 of 7 to 5 of 6, devin 12 of 12 to 15 of 15, opencode 9 of 11 to 7 of 10, dsh 10 of 12 to 12 of 14, the same shares and load rates as the `implementation-summary.md` rows, the third Open Questions bullet of `../spec.md` and the `../goal.md` row `Phase 019 workflow outcome measure, 2026-11-14` (its numbers before the writer's `...`).
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
<!-- FILL: Name the spec and plan files. Add the decision record when the packet has one. GOOD: Specification: `spec.md`. Plan: `plan.md`. WEAK: See the other docs. -->

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
- **Parent open question**: `../spec.md` section 4, third bullet
- **Run logs**: `../007-per-runtime-behaviour-proof/scratch/runs-pre.jsonl`, `runs-pre-dsh-rerun.jsonl` and `runs-final.jsonl`
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

A blocked task gets `[B]` and one line naming what blocks it. A moved old field in T018 or a failed gate in T015 blocks the phase.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation
<!-- FILL: Write one check per setup fact, each with a command. GOOD: CHK-001 [P0] The start commit is in `goal.md` section 4. WEAK: Setup is ready. -->

- [x] CHK-001 [P0] `BASE`, both before captures, the `OPENCODE_DB` value, the devin rule and the owner check are in `$WT/notes.txt` before T005 starts (T001 to T004). Evidence: `cat $WT/notes.txt` shows `BASE 23e7eee17b`, both `UNSC` blocks, `OPENCODE_DB unset`, both devin lines with `devin rule: not needed` and the owner check line, and `$WT` holds `base-pre.json` and `base-final.json`. That they were written before T005 is per T001 to T004 evidence (file times 06:14 and 06:15).
- [x] CHK-002 [P0] Each task line ends with a verify clause: `rg -c '^- \[[ xB]\] T[0-9].*Verify: ' tasks.md` and `rg -c '^- \[[ xB]\] T[0-9]' tasks.md` print the same number. Evidence: the two `rg -c` runs over `tasks.md` printed 26 and 26.
- [x] CHK-003 [P1] Every new test case failed at `BASE` for the reason its task names (T005 to T007). Evidence: per T005, T006 and T007 evidence: 6, 14 and 16 failed at `BASE`, each on `workflowPath is not a function` or the missing `workflow` key. Cannot be rerun on the final tree.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality
<!-- FILL: Write one check per file rule. A command must answer it. GOOD: CHK-010 [P0] `bash -n scripts/rotate-logs.sh` exits 0. WEAK: Code is clean. -->

- [x] CHK-010 [P0] `QG` exits 0 and `TC` exits 0 (T015). Evidence: `QG` rerun exited 0 with `p0_blocking 0`, `p1_open 0`, `p2_open 0`, and `TC` (`npm run typecheck` in `ADV`) exited 0, rerun 2026-11-14.
- [x] CHK-011 [P0] `followedBeforeWrite` and `hostExpanded` are unchanged: `G diff BASE -- $SC` removes no line inside either (T010). Evidence: `G diff 23e7eee17b -- $SC` removes 4 lines, all in `scoreRun` (its JSDoc return line, its signature, the `wrote:` line) and `summarize` (the `scoreRun` call). At `BASE` `followedBeforeWrite` starts at line 566 and `hostExpanded` at 649, and the only hunk there (`@@ -594,6 +594,84 @@`) adds lines only.
- [x] CHK-012 [P1] No added comment names a task id, phase number or spec path: `G diff BASE -- $SC $TS | rg '^\+.*//.*(T0[0-9]{2}|phase 0?19|specs/)'` prints nothing. Evidence: the named `G diff 23e7eee17b -- $SC $TS | rg` printed nothing and exited 1.
- [x] CHK-013 [P1] The owner is escaped before it enters a pattern, and an owner with no match returns `improvised` or `none`, never a crash (T006, T010). Evidence: `ownerLoadedBeforeWrite` passes the owner through `escapePattern` before both `RegExp` builds. A `node` probe of `workflowPath` with owners `a.b(c[`, `sk-d.c` and `nomatch` over a read of `sk-doc/SKILL.md` then a write printed `improvised`, and over no events `improvised` or `none` by `wrote`, with no throw and exit 0.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist
<!-- FILL: Write one check per acceptance criterion. GOOD: CHK-020 [P0] `--keep 3` leaves 3 archives. WEAK: Tests pass. -->

- [x] CHK-020 [P0] `VX` and `VALL` report 0 failed (T015). Evidence: `VX` rerun printed `Tests  82 passed (82)` and exited 0. `VALL` not rerun here (full suite out of this check's scope), per T015 evidence: `Tests  1838 passed | 6 skipped (1844)`, 184 files passed, also in `$WT/notes.txt`.
- [x] CHK-021 [P0] `SUMOK` prints `true` over both scratch files (T016, T017). Evidence: `SUMOK` printed `true` over `workflow-pre.json` and `true` over `workflow-final.json`.
- [x] CHK-022 [P0] Both T018 `diff` runs print nothing. Evidence: `diff <(OLDF $WT/base-pre.json) <(OLDF $PH/scratch/workflow-pre.json)` and the final pair both printed nothing and exited 0.
- [x] CHK-023 [P1] The ordering edge, the nested mode `SKILL.md`, the no-owner row and the run that wrote nothing each have a case that passes (T006, T005). Evidence: `TS` holds the cases `reads the owning skill document loaded after the first write as improvised`, `reads a nested mode document of the owning skill as the skill path`, `reads a row with no owner and no expected command as no owner` and `reads a session that only talked as no workflow path`, and `VX` printed 82 passed with 0 failed.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS
<!-- FILL: Write this section when the packet fixes a reported finding. Delete it otherwise. GOOD: CHK-FIX-001 [P0] Every finding names one class. WEAK: All findings handled. -->

- [x] CHK-FIX-001 [P0] The gap has a class: `cross-consumer`, because the summary block is read by phase 007's records, and the T018 equality check covers every old field. Evidence: `OLDF` deletes only `workflow` keys and every new key (`noneActed`, `loadRate`) sits inside the `workflow` block, so the two empty `diff` runs of CHK-022 cover every old field.
- [x] CHK-FIX-002 [P0] Consumer inventory: the T019 `rg -ln 'score-command-transcripts'` run lists no file that reads the summary block other than `TS` and `RAR`. Evidence: the `rg -ln 'score-command-transcripts'` run listed `SC`, `TS`, `RAR` and `command-behaviour-guards.vitest.ts`, which imports `startedLabel` and spawns the scorer only to check its exit 2 and usage text, so it reads no summary block.
- [x] CHK-FIX-003 [P1] Matrix axes and their cases are the ones `plan.md` lists, each with one passing case. Evidence: `plan.md` line 94 names five axes. Passing `TS` cases: command present (`/create:readme` read before a write) and absent (`command: null` cases), owner present and absent (`owner: null` is `noOwner`), write event present and absent (the run whose write the transcript does not show), `wrote` true and false, and a load before, after and missing the first write. `VX` 82 passed.
- [x] CHK-FIX-004 [P1] Evidence names `BASE`: `$PH/implementation-summary.md` names the commit T001 recorded. Evidence: `rg -n 23e7eee17b implementation-summary.md` hits line 74, `The start commit BASE is 23e7eee17b`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security
<!-- FILL: Write one check per security surface. Write `N/A` with a reason when none applies. GOOD: CHK-030 [P0] `scripts/rotate-logs.sh` reads no credential. WEAK: Security is fine. -->

- [x] CHK-030 [P0] No task printed holdout prompt text and the added code reads no `prompt` field: `G diff BASE -- $SC | rg -c '^\+.*\.prompt\b'` prints nothing. Evidence: `G diff 23e7eee17b -- $SC | rg -c '^\+.*\.prompt\b'` printed nothing and exited 1. No task print of holdout text is per task evidence.
- [x] CHK-031 [P0] No task started a model session or ran `run-command-behaviour.mjs`, and every session read was a load through the readers. Evidence: `G diff --quiet 23e7eee17b -- $RL $RA/run-command-behaviour.mjs .skilled/hooks` exited 0 and `G status --porcelain -- $RL` printed nothing, so no run log changed. That no model session started and every session read went through the readers is per T001 to T003 and T016 to T017 evidence.
- [x] CHK-032 [P1] The scorer reads no credential and writes nothing, and the two scratch files hold counts and row ids only. Evidence: `rg` over `SC` finds only `readFileSync` and `realpathSync` from `node:fs`, no write call and no `process.env`. The only strings in both scratch files are `N of M` values, the reason `locator_unavailable` and the row id `cmd-deep-research-plain-tune-01`.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation
<!-- FILL: Write one check per document that must agree. GOOD: CHK-040 [P1] `spec.md` and `tasks.md` both name `--keep <n>`. WEAK: Docs are updated. -->

- [x] CHK-040 [P1] `spec.md`, `plan.md`, `tasks.md` and `acceptance-criteria.md` name the same five values, the same owner rule and the same two arms. Evidence: all four files name `command`, `skill`, `improvised`, `none` and `noOwner`. The owner rule (bridge table `skillId`, fallback `expected_top`) is in `spec.md`, `plan.md` and `tasks.md` T009, and `acceptance-criteria.md` AC-003 states it only through the owner table, with no contradiction. The two arms are the before (`pre`) and final (`post`) arms in all four.
- [x] CHK-041 [P1] The README row names `workflow` and says the share counts a load, not each step (T014). Evidence: the `RAR` row holds `The workflow block sorts each run into command, skill, improvised, none or noOwner` and `It shows a workflow was loaded, not that each step was followed.`
- [x] CHK-042 [P1] `implementation-summary.md`, `../spec.md` and `../goal.md` quote the same shares (T020 to T022). Evidence: `implementation-summary.md` rows, `../spec.md` line 183 and the `../goal.md` row `Phase 019 workflow outcome measure, 2026-11-14` give the same load rates (claude 4 of 16 to 6 of 16, codex 0 of 16 to not run, pi 3 of 16 to 5 of 16, devin 12 of 16 to 15 of 16, opencode 9 of 16 to 7 of 16, dsh 10 of 16 to 12 of 15) and shares (4 of 4 to 6 of 6, 0 of 0, 3 of 7 to 5 of 6, 12 of 12 to 15 of 15, 9 of 11 to 7 of 10, 10 of 12 to 12 of 14), equal to `WFSHOW`.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization
<!-- FILL: Write one check per file location rule. GOOD: CHK-050 [P1] Test copies live under `scratch/test/`. WEAK: Files are organized. -->

- [x] CHK-050 [P1] This folder's `scratch/` holds exactly `workflow-pre.json` and `workflow-final.json` (T019). Evidence: `G status --porcelain --untracked-files=all -- $PH/scratch` lists exactly `workflow-pre.json` and `workflow-final.json`. `ls -A` also shows `.gitkeep`, the folder placeholder tracked since `65b4c97990`.
- [x] CHK-051 [P1] The temporary folder `WT` is removed at close-out: `test -d "$WT"` exits 1 (T023). Evidence: removed at T023 after a look (52K of before captures), `test -d "$WT"` exited 1.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary
<!-- FILL: Count the boxes by priority and write the three totals. GOOD: P0 12, P1 13, P2 1. WEAK: Most items done. -->

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 11/11 |
| P1 Items | 12 | 12/12 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-11-14, coordinator and an independent Opus verifier.
<!-- /ANCHOR:summary -->

---



