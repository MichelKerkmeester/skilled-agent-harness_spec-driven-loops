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
- [ ] T007 Add two summary cases to `describe('run log summary')` (`TS`). Extend `loadableSession` entries with a Claude `tool_use` turn and its `tool_result` user turn of the same id, because the reader rejects a tool call left without its result in the middle of a session. Case one: row `cmd-create-agent-plain-tune-01` with a `Read` of `.skilled/skills/sk-doc/SKILL.md` before a `Write` of `out/agent.md` reads `workflow: { command: 0, skill: 1, improvised: 0, none: 0, noOwner: 0, unscored: 0, share: '1 of 1' }` in the `tune` block. Case two: row `mns-chat-01` with the base turn alone reads `noOwner: 1` and `share: '0 of 0'`. The same log without `--json` prints a line that starts with `    workflow: ` and ends with `share 0 of 0`. Verify: `VX` reports exactly 16 failed, the 2 new ones on a missing `workflow` key or line.

### Code, one dispatch each, run in order

- [ ] T008 Keep `expected_top` on the row label (`SC`, `rowLabel` and `startedLabel`). In `rowLabel` add `expected_top: typeof row.expected_top === 'string' ? row.expected_top : null`. In `startedLabel` add `expected_top: null`. Verify: `rg -c 'expected_top' $SC` prints 2 and `VX` reports exactly 16 failed, the same cases as after T007.
- [ ] T009 Read the owner table once per summary (`SC`, a new internal `loadOwners` and `ownerOf`, called from `summarize` beside `loadRowLabels`). `loadOwners` reads `BR` through a path resolved from the script folder, `../command-bridges/command-bridges.generated.json`, and returns a map from `namespace:name`, built with `commandParts`, to `skillId`, plus the set of every `skillId`. `ownerOf(label, owners)` returns the mapped owner of `label.expected_command`, else `label.expected_top` when the set holds it, else `null`. A read or parse error is not caught, so the summary ends non-zero the way a missing corpus does. Verify: `rg -c 'command-bridges.generated.json' $SC` prints 1, `rg -c '^export function (loadOwners|ownerOf)' $SC` prints 0 and `VX` reports exactly 16 failed.
- [ ] T010 Add and export `workflowPath(events, { command, owner, wrote })` with an internal `ownerLoadedBeforeWrite(events, owner)` (`SC`, section 7 after `followedBeforeWrite`). Return `noOwner` when `owner` is null. Return `command` when `command` is a string and `followedBeforeWrite(events, command)` or `hostExpanded(events, commandParts(command))` is true. Return `skill` when an owner load lands before `firstWritePosition(events)`, or anywhere when that is null. An owner load is a `read` or `skill` event whose path, after backslashes become slashes, matches `(?:^|/)skills/<owner>/(?:.*/)?(?:SKILL|ROUTER)\.md$`, a `skill` event whose command equals the owner or a `shell` or `write` event whose command matches `\bcompiled-route\.cjs\b` and holds `--hub <owner>` as a whole word. The owner is escaped before it enters a pattern. Return `improvised` when `wrote` is true or the events hold a write, else `none`. Leave `followedBeforeWrite` and `hostExpanded` unchanged. Verify: `G diff BASE -- $SC` shows no line removed from `followedBeforeWrite` or `hostExpanded`, and `VX` reports exactly 2 failed, the two T007 summary cases.
- [ ] T011 Carry the value into the per-arm JSON block (`SC`, `scoreRun`, `newTally`, `addScored` and `tallyBlock`). `scoreRun` takes the owners as a third argument from `summarize`, computes `wrote` as its existing changed-path fact or a write event, and returns `workflowPath` beside its other fields. `newTally` gains `workflow: { command: 0, skill: 0, improvised: 0, none: 0, noOwner: 0, unscoredOnly: 0 }`. `addScored` adds one to the matching count. `tallyBlock` emits `workflow: { command, skill, improvised, none, noOwner, unscored: tally.unscored + unscoredOnly, share: rate(command + skill, command + skill + improvised) }`. No existing field changes name or value. Verify: `VX` reports exactly 1 failed, the second T007 case, on its missing `workflow:` text line.
- [ ] T012 Print the block on one text line under each arm (`SC`, `writeSummary`). After the arm's main line and before its `unscored` lines, print `    workflow: command C, skill S, improvised I, none N, no owner O, unscored U, share X of Y` from the block. Verify: `VX` reports 0 failed.
- [ ] T013 Count devin as unscored for this measure when T003 recorded `devin rule: applies` (`SC`, `scoreRun` and `addScored`). Add one frozen set, `WORKFLOW_UNREADABLE_RUNTIMES`, holding `devin`, with a comment that says its stored sessions keep no tool arguments, so a load cannot be told from its absence. `scoreRun` returns `workflowPath: 'unreadable'` for those runtimes, `addScored` adds it to `unscoredOnly` and `writeSummary` appends ` (devin keeps no tool arguments)` to that runtime's `workflow:` line. When T003 recorded `devin rule: not needed`, change nothing and write that line into the task. Verify: `VX` reports 0 failed, and `rg -c 'WORKFLOW_UNREADABLE_RUNTIMES' $SC` prints at least 2 when the rule applies, or the task holds `devin rule: not needed` and the same `rg` prints nothing.
- [x] T014 [P] Name the new block in the README row (`RAR`). Re-read the row that starts ``| `score-command-transcripts.mjs` |``. After `` `armIncomplete` and `byPolicy`, `` insert `` `workflow`, `` and, after the sentence that explains `byPolicy`, add ``The `workflow` block sorts each run into `command`, `skill`, `improvised`, `none` or `noOwner` and prints `share` as the runs that loaded the command's or the owning skill's own workflow before their first write, out of every run that acted. It shows a workflow was loaded, not that each step was followed.`` Verify: `rg -c 'The .workflow. block sorts each run' $RAR` prints 1, ``rg -c '^\| `score-command-transcripts.mjs` \|' $RAR`` prints 1 and ``rg '^\| `score-command-transcripts.mjs` \|' $RAR | rg -c '\x{2014}|\x{3B}'`` prints nothing. Evidence: the three `rg` checks printed 1, 1 and nothing, checked by an Opus verifier. Deviation: the list reads `` `armIncomplete`, `byPolicy` and `workflow`, `` because the literal insert would have left `` `armIncomplete` and `byPolicy`, `workflow`, `` which is not a sentence.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
<!-- FILL: Write one verification task per requirement. Each one runs a command. GOOD: T003 Run both invocations. Verify: `ls logs/archive | wc -l` prints 3 and 10. WEAK: T003 Test everything. -->

- [ ] T015 [C] Run the gates on the final tree (`$WT/notes.txt`). Run `VX`, `TC`, `VALL` and `QG`, and write each result line and exit code into the notes. Verify: `VX` and `VALL` report 0 failed, `TC` exits 0 and `QG` exits 0.
- [ ] T016 [C] Score the before arm (`$PH/scratch/workflow-pre.json`). Run `SPRE > $PH/scratch/workflow-pre.json`, then `WFSHOW` and `SUMOK` over it. Verify: the run exits 0, `WFSHOW` prints one line for each of `claude`, `codex`, `devin`, `dsh`, `opencode` and `pi` under `pre`, each with a share in the form `N of M` where `M` is at most 16. `SUMOK` prints `true`. When T003 recorded `devin rule: applies`, `jq '.devin.pre.workflow.unscored == .devin.pre.runs'` over the file prints `true`.
- [ ] T017 [C] Score the final arm (`$PH/scratch/workflow-final.json`). Run `SFIN > $PH/scratch/workflow-final.json`, then `WFSHOW` and `SUMOK` over it. Verify: the run exits 0, `WFSHOW` prints one line for each of `claude`, `devin`, `dsh`, `opencode` and `pi` under `post`, each with a share in the form `N of M` where `M` is at most 16. `SUMOK` prints `true`. When T003 recorded `devin rule: applies`, `jq '.devin.post.workflow.unscored == .devin.post.runs'` over the file prints `true`.
- [ ] T018 [C] Prove the old fields did not move (`$WT/notes.txt`). Run `diff <(OLDF $WT/base-pre.json) <(OLDF $PH/scratch/workflow-pre.json)` and the same for `base-final.json` against `workflow-final.json`. Verify: both `diff` runs print nothing and exit 0.
- [ ] T019 [C] Check the boundaries. Verify: `G diff --name-only BASE -- .skilled .opencode .claude AGENTS.md` prints the paths of `SC`, `TS` and `RAR` and otherwise only paths listed in `$WT/dirty0.txt`, `G status --porcelain --untracked-files=all -- .skilled` lists no untracked file, `G diff --quiet BASE -- .skilled/hooks $RA/command-prompts.jsonl $RA/run-command-behaviour.mjs $ADV/scripts/command-bridges $ADV/lib` exits 0, `G diff --stat BASE -- '*package.json' '*package-lock.json'` prints nothing, `G status --porcelain --untracked-files=all -- $PH/scratch` lists exactly `workflow-pre.json` and `workflow-final.json` and ``rg -ln 'score-command-transcripts' . --glob '!specs/**' --glob '!**/node_modules/**' --glob '!**/dist/**'`` lists no file outside `SC`, `TS`, `RAR` and files that only name the script.
- [ ] T020 [C] Write the results (`$PH/implementation-summary.md`). Record `BASE`, the `OPENCODE_DB` value, the devin rule and the unscored reasons from `$WT/notes.txt`, then one row per runtime with its before share and its final share from `WFSHOW` over the two scratch files, with `not run` for the codex final share. State that the share counts a load before the first write rather than each step followed and that a load of a skill other than the owner counts as improvised. Verify: `rg -c '^\| (claude|codex|devin|dsh|opencode|pi) \|' $PH/implementation-summary.md` prints 6 and each share in those rows equals the `WFSHOW` value for that runtime and arm.
- [ ] T021 [C] Record the shares in the parent spec (`PS`). Re-read `PS`. Replace the third bullet of section 4 Open Questions, the one that starts `The packet measures how often a command is offered`, with one bullet that gives each runtime's before and final share as `N of M`, names `019-workflow-outcome-measure/scratch/` as the source, says the measure is a proxy for loading before acting and says the operator sets the target. Set the Status cell of phase map row 19 to `Complete`. Verify: `rg -c 'A measure for it is proposed and not built' $PS` prints nothing, `rg -c '019-workflow-outcome-measure/scratch/' $PS` prints 1 and ``rg -c '^\| 19 \| 019-workflow-outcome-measure/ \|.*\| Complete \|$' $PS`` prints 1.
- [ ] T022 [C] Add one goal log row (`PG`). Re-read `PG` section 4. Add one row to its progress table with the date, `Phase 019 workflow outcome measure`, the per-runtime before and final shares as `N of M` and the two scratch file names. Verify: `rg -c 'Phase 019 workflow outcome measure' $PG` prints 1 and the shares in that row equal the T020 rows.
- [ ] T023 [C] Close out (`$PH/acceptance-criteria.md`, `$PH/spec.md`). Mark each acceptance row with the evidence observed, set `spec.md` Status to `Complete`, run `node .skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs --folder $PH --apply`, then strict validation, then `rm -r "$WT"`. Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh $PH --strict` prints `RESULT: PASSED` and `test -d "$WT"` exits 1.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
<!-- FILL: Keep the three completion lines and add the one artifact that proves the phase is done. GOOD: `--keep 3` leaves 3 archives and the suite passes. WEAK: Work is complete. -->

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed: `SUMOK` prints `true` over both scratch files and both T018 `diff` runs print nothing
- [ ] `scratch/workflow-pre.json` and `scratch/workflow-final.json` exist and their shares match `implementation-summary.md`, `../spec.md` and `../goal.md`
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

- [ ] CHK-001 [P0] `BASE`, both before captures, the `OPENCODE_DB` value, the devin rule and the owner check are in `$WT/notes.txt` before T005 starts (T001 to T004).
- [ ] CHK-002 [P0] Each task line ends with a verify clause: `rg -c '^- \[[ xB]\] T[0-9].*Verify: ' tasks.md` and `rg -c '^- \[[ xB]\] T[0-9]' tasks.md` print the same number.
- [ ] CHK-003 [P1] Every new test case failed at `BASE` for the reason its task names (T005 to T007).
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality
<!-- FILL: Write one check per file rule. A command must answer it. GOOD: CHK-010 [P0] `bash -n scripts/rotate-logs.sh` exits 0. WEAK: Code is clean. -->

- [ ] CHK-010 [P0] `QG` exits 0 and `TC` exits 0 (T015).
- [ ] CHK-011 [P0] `followedBeforeWrite` and `hostExpanded` are unchanged: `G diff BASE -- $SC` removes no line inside either (T010).
- [ ] CHK-012 [P1] No added comment names a task id, phase number or spec path: `G diff BASE -- $SC $TS | rg '^\+.*//.*(T0[0-9]{2}|phase 0?19|specs/)'` prints nothing.
- [ ] CHK-013 [P1] The owner is escaped before it enters a pattern, and an owner with no match returns `improvised` or `none`, never a crash (T006, T010).
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist
<!-- FILL: Write one check per acceptance criterion. GOOD: CHK-020 [P0] `--keep 3` leaves 3 archives. WEAK: Tests pass. -->

- [ ] CHK-020 [P0] `VX` and `VALL` report 0 failed (T015).
- [ ] CHK-021 [P0] `SUMOK` prints `true` over both scratch files (T016, T017).
- [ ] CHK-022 [P0] Both T018 `diff` runs print nothing.
- [ ] CHK-023 [P1] The ordering edge, the nested mode `SKILL.md`, the no-owner row and the run that wrote nothing each have a case that passes (T006, T005).
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS
<!-- FILL: Write this section when the packet fixes a reported finding. Delete it otherwise. GOOD: CHK-FIX-001 [P0] Every finding names one class. WEAK: All findings handled. -->

- [ ] CHK-FIX-001 [P0] The gap has a class: `cross-consumer`, because the summary block is read by phase 007's records, and the T018 equality check covers every old field.
- [ ] CHK-FIX-002 [P0] Consumer inventory: the T019 `rg -ln 'score-command-transcripts'` run lists no file that reads the summary block other than `TS` and `RAR`.
- [ ] CHK-FIX-003 [P1] Matrix axes and their cases are the ones `plan.md` lists, each with one passing case.
- [ ] CHK-FIX-004 [P1] Evidence names `BASE`: `$PH/implementation-summary.md` names the commit T001 recorded.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security
<!-- FILL: Write one check per security surface. Write `N/A` with a reason when none applies. GOOD: CHK-030 [P0] `scripts/rotate-logs.sh` reads no credential. WEAK: Security is fine. -->

- [ ] CHK-030 [P0] No task printed holdout prompt text and the added code reads no `prompt` field: `G diff BASE -- $SC | rg -c '^\+.*\.prompt\b'` prints nothing.
- [ ] CHK-031 [P0] No task started a model session or ran `run-command-behaviour.mjs`, and every session read was a load through the readers.
- [ ] CHK-032 [P1] The scorer reads no credential and writes nothing, and the two scratch files hold counts and row ids only.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation
<!-- FILL: Write one check per document that must agree. GOOD: CHK-040 [P1] `spec.md` and `tasks.md` both name `--keep <n>`. WEAK: Docs are updated. -->

- [ ] CHK-040 [P1] `spec.md`, `plan.md`, `tasks.md` and `acceptance-criteria.md` name the same five values, the same owner rule and the same two arms.
- [ ] CHK-041 [P1] The README row names `workflow` and says the share counts a load, not each step (T014).
- [ ] CHK-042 [P1] `implementation-summary.md`, `../spec.md` and `../goal.md` quote the same shares (T020 to T022).
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization
<!-- FILL: Write one check per file location rule. GOOD: CHK-050 [P1] Test copies live under `scratch/test/`. WEAK: Files are organized. -->

- [ ] CHK-050 [P1] This folder's `scratch/` holds exactly `workflow-pre.json` and `workflow-final.json` (T019).
- [ ] CHK-051 [P1] The temporary folder `WT` is removed at close-out: `test -d "$WT"` exits 1 (T023).
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary
<!-- FILL: Count the boxes by priority and write the three totals. GOOD: P0 12, P1 13, P2 1. WEAK: Most items done. -->

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 0/11 |
| P1 Items | 12 | 0/12 |
| P2 Items | 0 | 0/0 |

**Verification Date**: Not yet verified. Planned 2026-11-14.
<!-- /ANCHOR:summary -->

---



