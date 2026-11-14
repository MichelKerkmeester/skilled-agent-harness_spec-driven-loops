---
title: "Tasks: Phase 27: review-pass-four-remediation"
description: "Ordered worker-sized tasks that carry a decline lead over an or-list, read the article before a questioned command, keep offeredAs in both run-log writers, count a shell read of a command document as a start, fix the heredoc end word, the Codex read path, the live holdout guard and five documents, then rescore every stored arm, restate each moved start figure, run a confirming review and write the pass-four synthesis."
trigger_phrases:
  - "review pass four remediation tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 27: review-pass-four-remediation

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
| `[C]` | Coordinator task: a gate, a full-suite run, a capture, a summary over the stored sessions, a probe run, a commit, a review round or the close-out. No worker runs it |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

Every command runs from the repository root unless a task says `in ADV` or `in SKR`. Set the path names once with `export ADV=.skilled/skills/system-skill-advisor/runtime RAD=.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy SKR=.skilled/skills/system-spec-kit/runtime SR=.skilled/hooks/shared PK=specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build RL=specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/007-per-runtime-behaviour-proof/scratch PH=specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/027-review-pass-four-remediation SP=specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/027-review-pass-four-remediation/scratch PRB=specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/verify-4/probes` and run `unset OPENCODE_DB`, as the Measured Behavior block ran.
- `G` is `git -c core.fsmonitor=false`. `BASE` is the commit T001 records and `FIX` the one T023 records. `TSX` is `--import ./.skilled/skills/system-spec-kit/node_modules/tsx/dist/loader.mjs`.
- `CA` is `$ADV/lib/command-attach.ts` and `CAT` is `$ADV/tests/command-attach-guards.vitest.ts`. `CO` is `$RAD/command-offer.mjs` and `COT` is `$ADV/tests/command-offer.vitest.ts`. `R` is `$RAD/run-command-behaviour.mjs` and `CBG` is `$ADV/tests/command-behaviour-guards.vitest.ts`. `S` is `$RAD/score-command-transcripts.mjs` and `CTS` is `$ADV/tests/command-transcript-score.vitest.ts`. `CR` is `$SR/session-readers/codex.mjs` and `CRT` is `$SR/tests/session-readers/codex.test.mjs`. `SL` is `$ADV/tests/command-routing-slice.vitest.ts`.
- `RA` is `$RAD/README.md`, `AR` is `.skilled/skills/system-skill-advisor/README.md`, `FA` is `.skilled/skills/system-skill-advisor/feature-catalog/cli-surface/advisor-recommend.md`, `FM` is `.skilled/skills/system-skill-advisor/feature-catalog/scorer-fusion/command-meaning-matching.md` and `DP` is `.skilled/commands/doctor/assets/doctor-agents-md-presentation.txt`.
- `FILES` is the sixteen files above: `CA`, `CAT`, `CO`, `COT`, `R`, `CBG`, `S`, `CTS`, `CR`, `CRT`, `SL`, `RA`, `AR`, `FA`, `FM` and `DP`.
- `VX <file>` is `env -u AI_SESSION_CHILD npx vitest run <file>` in `ADV`. `VALL` is `env -u AI_SESSION_CHILD npx vitest run` in `ADV`, which must report 0 failed. `TC` is `npm run typecheck` in `ADV`, which must exit 0. `BUILD` is `npm run build` in `ADV`, which must exit 0, because the CLI and both captures load the compiled `dist`. `RT` is `node --test $SR/tests/session-readers/*.test.mjs`, which must report `fail 0`. `HT` is `env -u AI_SESSION_CHILD npx vitest run tests/history-lookup-cli.vitest.ts tests/history-lookup-adapters-e2e.vitest.ts` in `SKR`, which must report 0 failed. `DT` is `node --test .skilled/commands/doctor/scripts/tests/*.test.cjs`, which must report `fail 0`. `VP` is `env -u AI_SESSION_CHILD node --test .opencode/plugins/tests/system-skill-advisor.test.cjs`, which must report `fail 0`.
- `FLOOR` is `node $RAD/capture-command-routing-baseline.mjs | jq -c '.metrics.typed_recall_at_1, .metrics.false_offer, .attachedMetrics.typed, .attachedMetrics.plain.tune, .attachedMetrics.plain.holdout'`, five lines. `FIT` is the same capture through `jq -c '.attachedMetrics.fit.decline.carried, .attachedMetrics.fit.skillOnly.carried'`, two lines. `EVAL` is `node $RAD/capture-scorer-eval-baseline.mjs | jq -c '[.metrics.full_corpus_top1.correct,.metrics.holdout_top1.correct,.metrics.ambiguity_top1.correct,.metrics.gold_none_false_fire.value]'`, one line. Each prints counts and no row id and no prompt text.
- `ROWS` is `bash $PRB/cli-rows.sh`, given the seven prompts of the Measured Behavior block in its order. `ROUTE` is the two `compiled-route.cjs` commands of that block. `SHELLP` is `node $PRB/transcript-shell.mjs`. `BACKFILL` is `node $PRB/offeredas-backfill.mjs "$(mktemp -d)"`. `RACE` is `node $PRB/codex-toctou.mjs "$(mktemp -d)"`. `OFFERS` is `node $PK/020-command-offer-fit-guards/scratch/planning/probe-offers.mjs`, which reads review-authored prompts only. `MENTION` is `node TSX $PK/024-fable-review-remediation/scratch/planning/probe-mention-reader.mts`. Each probe writes nothing inside the repository.
- `SSTART` is `node $S --summary $RL/runs-pre.jsonl $RL/runs-post.jsonl --json`, `SPRE` is `node $S --summary $RL/runs-pre.jsonl $RL/runs-pre-dsh-rerun.jsonl --json` and `SFIN` is `node $S --summary $RL/runs-final.jsonl --json`, as phases 022 and 024 name them.
- `ARMS` is `jq -r 'to_entries[] | .key as $r | .value | del(.unscored) | to_entries[] | "\($r) \(.key) start \(.value.startRate) startedOfOffered \(.value.startedOfOffered) unsafe \(.value.unsafe) loops \(.value.loops) noinit \(.value.loopsWithoutInit) load \(.value.workflow.loadRate) followed \(.value.workflow.followedRate)"'`, one line per runtime and arm. `WFROW`, `SUMOK` and `DEN` are the three `jq` filters of the notation block of `$PK/022-workflow-measure-soundness/tasks.md`, copied from there word for word.
- `PERROW <scorer> <logs>` is `for id in $(cat <logs> | jq -r .rowId | sort -u); do node <scorer> --summary <logs> --row-id "$id" --json | jq -r --arg id "$id" 'to_entries[] | .key as $r | .value | del(.unscored) | to_entries[] | select(.value.scored > 0) | "\($r) \(.key) \($id) started=\(.value.startRate) sOO=\(.value.startedOfOffered) unsafe=\(.value.unsafe) loops=\(.value.loops) noinit=\(.value.loopsWithoutInit)"'; done`, one line per runtime, arm and row that scored. It reads row ids from the run logs and never a prompt.
- `LABEL <id>` is `jq -c --arg id <id> 'del(.prompt) | select(.id == $id) | {id, row_type, split, decline_kind, expected_command, expected_policy}' $RAD/command-prompts.jsonl`.
- `PLOG "<item> | <state> | <evidence>"` is `node .skilled/hooks/goal/bin/goal.cjs packet-log $PK "<item> | <state> | <evidence>" --workspace .`.
- `ev(seq, kind, fields)`, `oneTurn(...)`, `toolCall(name, args)`, `row(overrides)`, `loadableSession(root, records)` and `summarize(build)` are the builders the cases in `CTS` already use.

Rules for every task:
- Each task is one change to the files it names: one function, or one helper and its one call. A task that names a module and its test writes the test case first, runs it and sees it fail for the reason the task names, then makes the change and sees it pass. Its verify names both runs.
- Re-read every file a task names before the first edit. When a line, string or name the task quotes is not in the file, change nothing and mark the task `[B]` with the line found in its place.
- Every field an earlier summary prints keeps its name and its value rule. A task adds fields and never renames or redefines one.
- No task reads or prints the prompt text of a row whose `split` is `holdout`. `command-prompts.jsonl` and `holdout-prompts.jsonl` are opened only through `jq 'del(.prompt)'`, every `git diff`, `show` or `log -p` over a path that includes a row file adds `':(exclude)**/command-prompts.jsonl' ':(exclude)**/holdout-prompts.jsonl'`, and `capture-scorer-eval-baseline.mjs --misses` is piped through `jq 'del(.prompt)'`.
- No worker runs the full suite, a capture, a summary over the stored logs, a daemon or a model session, and no worker writes under the home folder, under `$PK/review/` or under another phase folder.
- No code comment may name a spec path, a phase number, a task id, a finding id, a decision id, an ADR or a REQ id. T022 checks it.
- Do not edit `AGENTS.md`, another phase folder, any `package.json`, any row file, any committed baseline, `fusion.ts`, a hook, a plugin or a session reader other than `CR`. Add no dependency.
- A `.md` edit routes through `sk-doc` and a code edit through `sk-code` before the first write. A doc sentence holds no em dash and no semicolon.
- A row written with `PLOG` is cut by that command: the item at 200 characters, the state at 40 and the evidence at 400, with `...` in place of the rest. Keep each cell inside its limit and write a second row rather than a longer one.
- When a verify prints something other than the expected output, do not change code to match it. Mark the task `[B]` with the printed line.

Worker lanes. Lane A owns `CA` and `CAT` and runs T004 and T005 in order. Lane O owns `CO`, `COT`, `R` and `CBG` and runs T006 and T007 in order. Lane S owns `S` and `CTS` and runs T008 and T009 in order. Lane R owns `CR` and `CRT` and runs T010. Lane T owns `SL` and runs T011. Lane E owns `FA`, `FM`, `AR` and `DP` and runs T014 to T017 in order. These six lanes share no file and run in parallel after T003. Lane D owns `RA` and runs T012 after T007, then T013 after T009. `[P]` marks the first task of lanes A, O, S, R, T and E. Every other task waits for the task before it in its lane. Every lane task is built by DeepSeek v4.1 flash max on OpenCode Go, one task per session, and checked by an Opus verifier before the next task in its lane.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
<!-- FILL: Replace the sample tasks with the real setup steps. Each task names a file and a verify command. GOOD: T001 Confirm `logs/archive/` holds 10 archives. Verify: `ls logs/archive | wc -l` prints 10. WEAK: T001 Set up the project. -->

- [ ] T001 [C] Confirm the phase can start and record the floors (`$SP/before.txt`, `$SP/floor-before.txt`, `$SP/fit-before.txt`, `$SP/eval-before.txt`). Run `rg -c '\*\*Status\*\* \| Complete' $PK/024-fable-review-remediation/spec.md`, `rg -c -e '^- \[x\] T' $PK/026-untuned-behaviour-arm/tasks.md`, `G status --porcelain -- FILES`, `G rev-parse --short HEAD`, `BUILD`, `TC`, `VALL`, `VP`, `RT`, `HT` and `DT`, then `FLOOR > $SP/floor-before.txt`, `FIT > $SP/fit-before.txt` and `EVAL > $SP/eval-before.txt`, and write each command with its last lines or exit code into `before.txt`. The short hash is `BASE`. When phase 024 is not Complete, a phase 026 task is `[x]` or the status prints a line, stop and mark the phase `[B]` with that line. Verify: the first `rg` prints 1, the second prints nothing, the status prints nothing, `BUILD` and `TC` exit 0, `VALL` and `HT` report 0 failed, `VP`, `RT` and `DT` report `fail 0`, `floor-before.txt` reads `{"correct":24,"total":44}`, `{"count":0,"total":35}`, `{"own":24,"attached":20,"combined":44,"total":44}`, `{"own":13,"attached":15,"combined":28,"total":45}` and `{"own":1,"attached":0,"combined":1,"total":44}`, `fit-before.txt` reads `8` and `0`, and `eval-before.txt` reads `[160,51,21,5]`.
- [ ] T002 [C] Record the reproductions (`$SP/repro-before.txt`). Run `ROWS`, `ROUTE`, `SHELLP`, `BACKFILL`, `RACE`, `OFFERS | rg -c 'command=/'` and `MENTION | tail -2`, and write each command with its output into `repro-before.txt`, leaving out the `readPaths` line of `RACE`, which lists module URLs. Verify: the output matches the Measured Behavior block of `spec.md` line for line: `rg -c -F 'do not run /create:agent or /create:readme => [["sk-doc","/create:readme","start"]' $SP/repro-before.txt` prints 1, `rg -c -e '^heredoc .*END-SCRIPT.* = skill$' $SP/repro-before.txt` prints 3, `rg -c -F 'shellRead startState {"started":false' $SP/repro-before.txt` prints 1, `rg -c -F 'NO offeredAs' $SP/repro-before.txt` prints 1, `rg -c -F "recordsText [ 'OUTSIDE-STORE-FILE' ]" $SP/repro-before.txt` prints 1 and `rg -c -F 'SHIPPED: 46 of 46 agree' $SP/repro-before.txt` prints 1. When a line differs, write it into the parent goal log with `PLOG` and mark the task `[B]`.
- [ ] T003 [C] Record every stored summary before any scorer edit (`$SP/start-before.json`, `$SP/pre-before.json`, `$SP/final-before.json` and the text files below). Run `SSTART > $SP/start-before.json`, `SPRE > $SP/pre-before.json` and `SFIN > $SP/final-before.json`, then `ARMS` over each into `$SP/arms-before-start.txt`, `$SP/arms-before-pre.txt` and `$SP/arms-before-final.txt`, `WFROW` over the pre and final files into `$SP/wf-before-pre.txt` and `$SP/wf-before-final.txt`, `DEN` over the same two into `$SP/den-before-pre.txt` and `$SP/den-before-final.txt`, and `PERROW $S` over the three sets of logs into `$SP/rows-before-start.txt`, `$SP/rows-before-pre.txt` and `$SP/rows-before-final.txt`. Verify: the three summary runs exit 0, `wc -l` prints 12, 6 and 5 for the three `arms-before` files, `SUMOK` over the pre and final files prints `true` twice, `rg -c -e '^codex (pre|post) start 0 of 12 ' $SP/arms-before-start.txt` prints 2, and the three `rows-before` files are not empty.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
<!-- FILL: Write one implementation task per file change. Add a `Verify:` line with the command and its expected output. GOOD: T002 Add the `--keep <n>` branch. Verify: `--keep 3` leaves 3 archives. WEAK: T002 Implement the feature. -->

### Lane A: the mention reader

- [ ] T004 [P] Carry a decline lead over an or-list (`CAT`, then `CA` new constant `COMMAND_OR_LIST` and its one use in `commandOnlyMentioned`). After T003. Test first: in `CAT`, inside `describe('a command the prompt only mentions')`, add `it.each([['do not run /create:agent or /create:readme', '/create:readme'], ['never use /create:readme or /create:feature-catalog', '/create:feature-catalog'], ['do not run /deep:review, or /deep:research', '/deep:research'], ['skip /create:agent or /create:readme', '/create:readme'], ['do not run /speckit:plan or /speckit:implement or /speckit:complete', '/speckit:complete']])('reads %s as a refusal of %s through an or-list', ...)` expecting `true`, and `it.each([['use /create:agent or /create:readme', '/create:agent'], ['use /create:agent or /create:readme', '/create:readme'], ['use /speckit:plan, not /speckit:complete', '/speckit:plan'], ['do not run /speckit:complete, run /speckit:plan or /speckit:implement', '/speckit:plan'], ['do not run /speckit:complete, run /speckit:plan or /speckit:implement', '/speckit:implement'], ['do not run /speckit:complete or run /speckit:plan', '/speckit:plan']])('still reads %s as a request for %s beside an or-list', ...)` expecting `false`. In the table of the case `offers no hub command for %s`, add the row `'do not run /create:agent or /create:readme'`. Run `VX tests/command-attach-guards.vitest.ts` and see the five refusal rows and the hub row fail while the six request rows pass. Then in `CA`, directly below `COMMAND_DECLINE_LEADS`, add ``const COMMAND_OR_LIST = '(?:\\/[a-z][a-z0-9_-]*(?::[a-z][a-z0-9_-]*)?,? or )*';`` with a comment saying a refusal over an or-list refuses every command the list joins to the one its lead names, while a second use verb opens a clause of its own, so the list joins only `or` and `, or`. In `commandOnlyMentioned`, replace the `const led = [...COMMAND_DECLINE_LEADS, ...COMMAND_ASK_LEADS].some(...)` statement with one that tests each decline lead as ``new RegExp(`(?:^|[^a-z0-9_/])${lead}${COMMAND_OR_LIST}${name}$`)`` and each ask lead as it is tested now. Verify: the first run fails as described, then `VX tests/command-attach-guards.vitest.ts` reports 0 failed, `rg -c 'COMMAND_OR_LIST' $CA` prints 2, `TC` exits 0 and `MENTION` prints `SHIPPED: 46 of 46 agree`.
- [ ] T005 Read the article after a bare ask word (`CAT`, then `CA` constant `COMMAND_BARE_ASK_LEAD`). After T004. This task changes that one constant and its comment. Test first: in `CAT`, add the row `['Is the /doctor:update command safe?', '/doctor:update']` to the table of the case `reads %s as a question about %s`, and the row `['the next step is the /speckit:implement command', '/speckit:implement']` to the table that holds `the next step is /speckit:implement`. Run `VX tests/command-attach-guards.vitest.ts` and see the first row return `false` while the second passes. Then change `COMMAND_BARE_ASK_LEAD` to `'(?:is|does|can|will|would) (?:the )?'` and add one sentence to the comment above it: a question often names the command after `the`, as in `is the /x command safe`. Verify: the first run fails as described, then `VX tests/command-attach-guards.vitest.ts` reports 0 failed, `rg -c -F "(?:is|does|can|will|would) (?:the )?" $CA` prints 1, `TC` exits 0 and `MENTION` prints `SHIPPED: 46 of 46 agree`.

### Lane O: the two run-log writers

- [ ] T006 [P] Keep `offeredAs` on a backfilled line (`COT`, then `CO` function `backfillRunLog`). After T003. This task adds one field to one object in that function and nothing else in `CO`. Test first: in `COT`, inside `describe('backfillRunLog')`, add `it('keeps where the offered command sat in the head')`, built as the case `adds the offer and the brief to every line and warms each checkout once` builds its two lines, whose `replay` returns `{ offeredCommand: '/create:manual-testing-playbook', offeredPolicy: 'start', offeredAs: 'partner', offerError: null }` when `sessionId` is `backfill-row-one` and `{ offeredCommand: null, offeredPolicy: null, offerError: 'no_head' }` otherwise, and which expects the first written line's `offeredAs` to be `'partner'` and the second's to be `null`. Run `VX tests/command-offer.vitest.ts` and see `offeredAs` read `undefined`. Then in the `else` branch that builds `nextLine`, directly after `offeredPolicy: offer.offeredPolicy ?? null,`, add `offeredAs: offer.offeredAs ?? null,`, and add to the comment above it one sentence: where the command sat in the head travels with it, because a command on the partner side was shown and not offered. Verify: the first run fails as described, then `VX tests/command-offer.vitest.ts` reports 0 failed, the case `recomputes only the brief when the offers are already recorded` still passes, `node --check $CO` exits 0 and `BACKFILL` prints `HAS offeredAs`.
- [ ] T007 Keep `offeredAs` on a live run line (`CBG`, then `R` new exported function `offerLineFields` and its one call in `runTurn`). After T006. `runTurn` is not exported and a dry run refuses a tree a worker has edited, so the line fields move into one exported helper. Test first: in `CBG`, add `offerLineFields` to the import from `../scripts/routing-accuracy/run-command-behaviour.mjs` and add `describe('offerLineFields')` with `it('copies the offered command, its policy and where it sat')`, expecting `offerLineFields({ offeredCommand: '/create:readme', offeredPolicy: 'start', offeredAs: 'partner', offerError: null })` to equal `{ offeredCommand: '/create:readme', offeredPolicy: 'start', offeredAs: 'partner' }`, and `it('writes null where the replay found no offer')`, expecting `offerLineFields({ offeredCommand: null, offeredPolicy: null, offerError: 'no_head' })` to equal `{ offeredCommand: null, offeredPolicy: null, offeredAs: null }`. Run `VX tests/command-behaviour-guards.vitest.ts` and see both fail because the function is not exported. Then export `offerLineFields(offer)` from `R`, which returns `{ offeredCommand: offer.offeredCommand ?? null, offeredPolicy: offer.offeredPolicy ?? null, offeredAs: offer.offeredAs ?? null }`, with a comment saying a run line keeps where its offered command sat in the head, because the summary counts a command on the partner side apart from an offer. In `runTurn`, replace the two lines `offeredCommand: offer.offeredCommand,` and `offeredPolicy: offer.offeredPolicy,` inside the `appendRunLine` call with `...offerLineFields(offer),`. Verify: the first run fails as described, then `VX tests/command-behaviour-guards.vitest.ts` reports 0 failed, `rg -c -F '...offerLineFields(offer),' $R` prints 1, `rg -c -F 'offeredPolicy: offer.offeredPolicy,' $R` prints nothing and `node --check $R` exits 0.

### Lane S: the transcript scorer

- [ ] T008 [P] Read a heredoc end word that holds a hyphen or a dot (`CTS`, then `S` constant `HEREDOC_BODY`). After T003. This task changes that one pattern and its comment. Test first: in `CTS`, in the table of the case `does not count $command as a load`, add the rows `{ command: "python3 - <<'END-SCRIPT'\nhead .skilled/skills/sk-doc/SKILL.md\nEND-SCRIPT", expected: 'none' }` and `{ command: 'node - <<END.JS\nmore .skilled/skills/sk-doc/SKILL.md\nEND.JS', expected: 'none' }`. Run `VX tests/command-transcript-score.vitest.ts` and see both return `'skill'`. Then in `HEREDOC_BODY` replace `([A-Za-z_][A-Za-z0-9_]*)` with `([A-Za-z_][A-Za-z0-9_.-]*)`, and add to the comment above it one sentence: an end word may hold a hyphen or a dot, as `END-SCRIPT` does. Verify: the first run fails as described, then `VX tests/command-transcript-score.vitest.ts` reports 0 failed, the case `still counts a read after a heredoc ends` still passes, `rg -c -F '([A-Za-z_][A-Za-z0-9_.-]*)' $S` prints 1 and `node --check $S` exits 0.
- [ ] T009 Count a shell read of the command document as a start and as a loop taken (`CTS`, then `S` function `readDocument`). After T008. This task adds one line to that function and extends its comment, and nothing else in `S`. Test first: in `CTS`, inside `describe('startState')`, add `it.each([{ command: 'cat .skilled/commands/create/readme.md', started: true }, { command: 'rg -n step .skilled/commands/create/readme.md', started: false }, { command: "sed -i '' 's/a/b/' .skilled/commands/create/readme.md", started: false }, { command: "node - <<'EOF'\ncat .skilled/commands/create/readme.md\nEOF", started: false }])('reports a start ($started) for the shell step $command', ...)`, whose events are `normalize(oneTurn(toolCall('Bash', { command }), toolCall('Write', { file_path: OUTSIDE_SPECS, content: 'x' })), 'claude')` and which expects `startState(events, row({})).started` to be `started`. Inside `describe('run log summary')`, directly after the case `counts a loop that never initialised as unsafe`, add `it('counts a loop a run took through a shell read')`, built as that case builds its session with two `tool_use` blocks, a `Bash` call with `{ command: 'cat .skilled/commands/deep/review.md' }` and a `Write` of `specs/x/review/notes.md`, and the one line `{ rowId: SUMMARY_ROW, arm: 'tune', exit: 0, locator }`, expecting `claude.tune` to match `{ runs: 1, scored: 1, loops: 1, loopsWithoutInit: 1, unsafe: 1 }`. Run `VX tests/command-transcript-score.vitest.ts` and see the `cat` row return `false` and the loop case read `loops` 0, while the other three rows pass. Then in `readDocument`, directly above the line `if (event.kind !== 'read' && event.kind !== 'skill') continue;`, add `if (event.kind === 'shell' && shellReadTargets(event.command).some((value) => tailMatches(value, documents))) return true;`, and add to the comment above the function: a shell read of the document is a start by the rule a load already uses, so a search, an in-place `sed` and a heredoc line are not. Verify: the first run fails as described, then `VX tests/command-transcript-score.vitest.ts` reports 0 failed, every earlier `startState` and `loopInit` case still passes, `rg -c "event.kind === 'shell' && shellReadTargets" $S` prints 1, `node --check $S` exits 0 and `SHELLP` prints `shellRead startState {"started":true,"unsafe":false,"selfAuto":false}`.

### Lane R: the Codex session reader

- [ ] T010 [P] Read the rollout at the path containment resolved (`CRT`, then `CR` function `loadCodexSession`). After T003. This task changes one argument and adds one comment in `CR`. Consumers that must keep working: `S`, `CO` and `R` through `loadSession`, the history lookup in `$SKR/hooks/lib/history/` through `readSession`, and the hooks that import the reader index. Test first: in `CRT`, add `realpathSync` and `symlinkSync` to an import from `node:fs` and add `test('a rollout reached through a link inside the store is read at the resolved path')`. Inside `withTempAsync('codex-link', async (root) => { ... })`, build `codexSession({ root })`, make `link` as `join(fixture.root, 'link.jsonl')` with `symlinkSync(fixture.filePath, link)`, start `trackFileOpens()`, call `loadSession({ runtime: 'codex', sessionId: SESSION, codexRoot: fixture.root, transcriptPath: link })`, and assert `result.ok` is `true`, `tracker.opened.includes(link)` is `false` and `tracker.opened.includes(realpathSync(fixture.filePath))` is `true`, restoring the tracker in a `finally`. Run `RT` and see the link path in `opened`. Then in `loadCodexSession` replace `raw = readFileSync(transcriptPath, 'utf8');` with `raw = readFileSync(storePath, 'utf8');` and add a comment saying the file read is the one containment resolved, so a path repointed after the check is not read in its place. Leave `recordedSessionId(lines, transcriptPath)` as it is. Verify: the first run fails as described, then `RT` reports `fail 0` with one more passed test than `$SP/before.txt`, `HT` reports 0 failed, `node --check $CR` exits 0, `RACE` prints `recordsText [ 'APPROVED-FILE' ]` and `G diff --stat BASE -- $SR/session-readers` names `codex.mjs` and at most its declaration map `codex.d.mts.map`.

### Lane T: the holdout guard

- [ ] T011 [P] Make the holdout guard read the live capture too (`SL`, new local function `publishedHoldoutIds` and the case `publishes no holdout row`). After T003. Test first: in `SL`, inside `describe('command routing slice')`, add `it('finds a holdout id in any published map')`, which passes a made-up capture `{ rows: { 'made-up-holdout-01': {} }, attachedMetrics: { attachedRows: {}, typedRows: { 'made-up-holdout-02': {} }, needsModeRows: ['made-up-holdout-03'] } }`, cast through `unknown` to `CommandRoutingBaseline`, and the set `new Set(['made-up-holdout-01', 'made-up-holdout-02', 'made-up-holdout-03'])` to `publishedHoldoutIds` and expects the three ids sorted. Run `VX tests/command-routing-slice.vitest.ts` and see it fail because the function does not exist. Then add, above the `describe`, `function publishedHoldoutIds(capture: CommandRoutingBaseline, holdoutIds: ReadonlySet<string>): string[]`, which returns the sorted distinct ids of `capture.rows`, `attachedRows`, `typedRows` and `needsModeRows` that `holdoutIds` holds, moving the cast and the list the case builds now. Make the case `publishes no holdout row` expect `publishedHoldoutIds(baseline, holdoutIds)` and `publishedHoldoutIds(live, holdoutIds)` to equal `[]`, each with a message that names the capture, and keep its check that the corpus marks a holdout row. Give the function one comment: the live capture is what the next recapture writes, so a holdout id it publishes is caught before it reaches the baseline. Verify: the first run fails as described, then `VX tests/command-routing-slice.vitest.ts` reports 0 failed. When the live capture already publishes a holdout id, the guard fails on it: change nothing more and mark the task `[B]` with the count the message prints, never the id.

### Lane D: the routing-accuracy README

- [ ] T012 State `offeredAs` in both field lists (`RA`). After T007. In the paragraph that starts `Each line a behaviour run appends carries three fields`, replace `three fields` with `four fields`, and directly after the `offeredPolicy` item add the item: ``- `offeredAs` says where that command sat in the head: `head`, `partner` when it followed `vs` on an ambiguous head, or `null` when the head named none.`` In the sentence that starts `The output log holds the same lines plus`, replace `` `offeredCommand`, `offeredPolicy`, `offerError` `` with `` `offeredCommand`, `offeredPolicy`, `offeredAs`, `offerError` ``. Verify: `rg -c -F 'carries four fields' $RA` prints 1, ``rg -c -F '`offeredPolicy`, `offeredAs`, `offerError`' $RA`` prints 1 and `rg -c -e '\x{2014}|;' $RA` prints the count `G show BASE:$RA | rg -c -e '\x{2014}|;'` prints, or nothing when that prints nothing.
- [ ] T013 State the shell-read start rule and the heredoc end word (`RA`). After T009 and T012. In the `score-command-transcripts.mjs` row, directly after the sentence that starts `A search with` and ends `the same command entered.`, add: ``A start and a loop the run took are read from the same reads a load is, so a `cat` of the command's document counts and a search, an in-place `sed` or a heredoc line does not. A heredoc's end word may hold a hyphen or a dot.`` Verify: `rg -c -F 'read from the same reads a load is' $RA` prints 1, `rg -c -F 'may hold a hyphen or a dot' $RA` prints 1 and the em dash and semicolon count equals the one T012 printed.

### Lane E: four documents

- [ ] T014 [P] Say that the head keeps its command (`FA`). After T003. Replace the sentence that starts ``A hub also leaves `command` off when the same command already ranks in the result`` and the sentence after it with: ``A hub below the head leaves `command` off when the same command already ranks in the result through its own command row, because `enrichCompiledRoutes()` takes the `command` fields present in the result as the commands already offered. The head keeps its command even then, because every caller renders the head and at most one partner.`` Verify: `rg -c -F 'The head keeps its command even then' $FA` prints 1, `rg -c -F 'A hub below the head leaves' $FA` prints 1, and `rg -n -F 'index === 0' $ADV/handlers/advisor-recommend.ts` prints one line.
- [ ] T015 Correct the case count of the meaning anchor test (`FM`). After T014. In the row for `command-meaning-anchor.vitest.ts`, replace `17 cases:` with `28 cases:`. Before the edit, run `rg -c -e '^\s*it\(' $ADV/tests/command-meaning-anchor.vitest.ts`. When it prints another number than 28, write that number in place of 28 and say so in the evidence. Verify: `rg -c -F '28 cases:' $FM` prints 1, or the printed count does, and `rg -c -F '17 cases' $FM` prints nothing.
- [ ] T016 Name the child form on the companion line (`AR`). After T015. In the paragraph that holds `Also: /doctor:<command> <target> (<policy>)`, replace `where the policy is run, start or ask` with ``where the policy is run, start or ask, or `parent-named only` in a child session for a command the child must not start on its own``. Verify: `rg -c -F 'parent-named only' $AR` prints 1, `rg -c -F "PARENT_NAMED_POLICY = 'parent-named only'" $ADV/lib/render.ts` prints 1 and the em dash and semicolon count of `AR` equals its count at `BASE`.
- [ ] T017 Name the by-hand fix for a malformed router row (`DP`). After T016. Directly below the row that starts ``| `A11` reports missing router rows``, add the row: ``| `A11` reports a malformed router row | `/doctor:agents-md embed` adds missing rows only and never rewrites one, so fix the row in `REPO RULES.md` by hand until its cell count matches the header, then run the check again |``. Verify: `rg -c -F 'reports a malformed router row' $DP` prints 1, `rg -c -F 'malformed' .skilled/commands/doctor/scripts/agents-md-check.cjs` prints at least 1 and `DT` reports `fail 0`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
<!-- FILL: Write one verification task per requirement. Each one runs a command. GOOD: T003 Run both invocations. Verify: `ls logs/archive | wc -l` prints 3 and 10. WEAK: T003 Test everything. -->

- [ ] T018 [C] Run every suite (`$SP/after.txt`). After every lane. Run `BUILD`, `VX tests/command-attach-guards.vitest.ts`, `VX tests/command-offer.vitest.ts`, `VX tests/command-behaviour-guards.vitest.ts`, `VX tests/command-transcript-score.vitest.ts`, `VX tests/command-routing-slice.vitest.ts`, `RT`, `HT`, `DT`, `VP`, `TC` and `VALL`, and write each command with its result lines into `after.txt`. When `VALL` fails on a timing or load case, rerun that file alone twice and then `VALL` once, and record all three. Verify: every run reports 0 failed, `fail 0` or exit 0, and `VALL` and `RT` report more passed tests than their lines in `$SP/before.txt`.
- [ ] T019 [C] Prove the floors did not move (`$SP/floor-after.txt`, `$SP/fit-after.txt`, `$SP/eval-after.txt`). After T018. Run `FLOOR > $SP/floor-after.txt`, `FIT > $SP/fit-after.txt` and `EVAL > $SP/eval-after.txt`. Verify: `cmp` of each after file with its before file prints nothing and exits 0. When a line differs or the slice test of T018 failed, write the moved row ids, read from the test message or from `jq -c '.rows | keys'` over the live capture and never with a prompt, and the moved counts into the parent goal log with `PLOG`, and mark the task `[B]`. A recapture of the committed baseline is the coordinator's decision and needs a decision-record entry, as P020 did.
- [ ] T020 [C] Rerun the reproductions (`$SP/repro-after.txt`). After T019. Run the commands of T002 in the same order and write each with its output. Verify: `rg -e '^(do not run /create:agent or|never use /create:readme or|do not run /deep:review, or)' $SP/repro-after.txt | sed 's/.* => //' | rg -c -e '"/(create:(readme|feature-catalog|agent)|deep:(review|research))"'` prints nothing. `rg -e '^Is the /doctor:update' $SP/repro-after.txt | sed 's/.* => //' | rg -c -F '"/doctor:update"'` prints nothing. The lines for `use /create:agent or /create:readme`, `use /speckit:plan, not /speckit:complete` and `The /doctor:update command is documented in the README`, and both `ROUTE` lines, equal their lines in `repro-before.txt`. Every `heredoc` line ends in `improvised`, the `shellRead startState` line reads `{"started":true,"unsafe":false,"selfAuto":false}`, `BACKFILL` prints `HAS offeredAs`, `RACE` prints `recordsText [ 'APPROVED-FILE' ]`, the `OFFERS` count prints 9 and `MENTION` prints `SHIPPED: 46 of 46 agree`. When the `OFFERS` count differs, list the changed lines from its review-authored prompt file, and the task holds when each is a refusal over an or-list or an `is the` question. Any other difference marks the task `[B]` with the line.
- [ ] T021 [C] Rescore every stored arm and restate each moved start figure (`$SP/rescore-delta.txt`, the parent goal log through `PLOG` only). After T020. Run `SSTART > $SP/start-after.json`, `SPRE > $SP/pre-after.json` and `SFIN > $SP/final-after.json`, then `ARMS`, `WFROW`, `DEN` and `PERROW $S` over them into the after files named as T003 named the before files. Write a copy of `S` with the line T009 added removed and its relative imports and paths made absolute, as `$PRB/make-shell-start-variant.sh` does, to `$TMPDIR/score-undone.mjs`, outside the repository, and run `PERROW $TMPDIR/score-undone.mjs` over the three sets into `$TMPDIR/rows-undone-<set>.txt`. Write into `rescore-delta.txt`: one line per runtime and arm of the three sets in the form `<set> <runtime> <arm> start <before> -> <after>, startedOfOffered <before> -> <after>`, one line per runtime and arm of `SPRE` and `SFIN` in the form `<set> <runtime> <arm> workflow <counts before> -> <counts after>`, the `diff` of each `rows-before` file with its `rows-after` file, and one line per moved run with its runtime, arm and row, the output of `LABEL` for its row, and its rule, which is T009 when its line in the undone file equals its before line. Then find each place a stored start figure is quoted with `rg -n -i -e '\b(claude|codex|devin|dsh|opencode|pi)\b[^|.]{0,40}\b[0-9]+ of (5|10|11|12)\b' $PK --glob '*.md' --glob '!**/review/**' --glob '!**/scratch/**' --glob '!**/research/**' --glob '!**/027-review-pass-four-remediation/**'`, which also finds a figure written without the word start, such as Codex at 0 of 12, and list each hit whose runtime, arm and number match a moved line with its file and line. Then write one `PLOG` row per set that moved, `PLOG "Stored start rates rescored with the shell-read start rule, <set> | Supersedes the earlier quotes | tuned rows, one run each, no brief reached Codex. <the moved start lines of that set>"`, and one more row that names the quoted places it supersedes, `../goal.md` and the closed phases included, which are never edited. Remove both temp copies and the undone files after. Verify: the three summary runs exit 0, `SUMOK` over the pre and final after files prints `true` twice, `cmp` of each `wf-before` file with its `wf-after` file and of each `den-before` file with its `den-after` file prints nothing and exits 0, no `load` or `followed` field and no `unsafe`, `loops` or `noinit` field differs between an `arms-before` line and its `arms-after` line, `rg -c -e '^(start|pre|final) (claude|codex|devin|dsh|opencode|pi) (pre|post) start ' $SP/rescore-delta.txt` prints 23, `rg -c -e '^(pre|final) (claude|codex|devin|dsh|opencode|pi) (pre|post) workflow ' $SP/rescore-delta.txt` prints 11, every moved run names T009 as its rule, no moved run's `LABEL` holds a `row_type` other than `plain` or `typed` or a `decline_kind` of `refusal`, `question` or `small-edit`, and `rg -c -F 'no brief reached Codex' $PK/goal.md` prints at least one more than before. A load, followed, workflow, `unsafe` or loop count that moved, a moved run with another rule, or a moved run on such a row is a finding: mark the task `[B]` with its line, and the coordinator decides a fix or a reason before T023. No rate is called a gain or a loss in that file or in those rows.
- [ ] T022 [C] Check the boundaries (`$SP/boundaries.txt`). After T021. Write each command below with its output or exit code into `boundaries.txt`. Verify: `G diff --quiet BASE -- AGENTS.md` exits 0. `test "$(G rev-parse BASE:$RAD/command-prompts.jsonl)" = "$(G hash-object $RAD/command-prompts.jsonl)"` and the same for `$RAD/holdout-prompts.jsonl` exit 0, so neither row file is diffed. `G diff --quiet BASE -- $RAD/command-routing-baseline.json` exits 0, unless T019 recorded a recapture. `G diff --stat BASE -- '*package.json' '*package-lock.json'` prints nothing. `G diff BASE -U0 -- .skilled .opencode ':(exclude)**/command-prompts.jsonl' ':(exclude)**/holdout-prompts.jsonl' | rg -e '^\+\s*(//|#|\*|/\*)' | rg -c -e 'specs/|[0-9]{3}-[a-z]|\b(T|P|Q)[0-9]{3}\b|\b(REQ|AC|CHK|ADR)-[0-9]+|\b(SA4|R4|DR4)-P[0-9]|\biter[0-9]-P[0-9]'` prints nothing. `G diff --name-only BASE -- .skilled .opencode ':(exclude)**/command-prompts.jsonl' ':(exclude)**/holdout-prompts.jsonl'` names `FILES` and at most `codex.d.mts.map` beside them.
- [ ] T023 [C] Commit the fix (`FILES` and this phase's documents). After T022. Commit `FILES`, the regenerated `codex.d.mts.map` when T022 named it and this phase folder with a conventional commit message, and record the short hash as `FIX`. Verify: `G status --porcelain -- FILES` prints nothing and `G log -1 --format=%h` prints `FIX`.
- [ ] T024 [C] Run the confirming review round (`$PK/review/review-scope-4b.txt`, `$PK/review/deep-review-fanout-config-pass-4b.json`, `$PK/review/review-brief-4b.txt`). After T023. Write `review-scope-4b.txt` in the shape of `review-scope-4.txt`: a header line naming `BASE`, `FIX` and the command, then one line per path of `G diff --name-only BASE FIX -- .skilled .opencode ':(exclude)**/command-prompts.jsonl' ':(exclude)**/holdout-prompts.jsonl'`, with the area `scorer-attach` for `CA`, `CAT`, `S`, `CTS`, `SL`, `AR`, `FA` and `FM`, and `accuracy-runner` for every other path. Write `deep-review-fanout-config-pass-4b.json` in the shape of `deep-review-fanout-config-pass-3b.json` with two `cli-opencode` executors on `opencode-go/deepseek-v4.1-flash` at reasoning effort `max`, three iterations each, labelled `scorer-attach-confirm-4b` and `accuracy-runner-confirm-4b`. Write `review-brief-4b.txt` from `review-brief-4.txt`, naming the scope file, the commit range and that this round confirms the fixes for the findings of `verify-4/report.md` and looks for defects they added. Run `/deep:review` with that config at threshold 0.10, as pass three ran its confirming round. Verify: `jq -r '.executors[].label' $PK/review/deep-review-fanout-config-pass-4b.json` prints the two labels, each lineage folder under `$PK/review/lineages/` holds a `deep-review-state.jsonl`, and `grep -o '"newFindingsRatio":[0-9.]*' <that file> | tail -1` is written into `$SP/review-rounds.txt` for each lineage.
- [ ] T025 [C] Adjudicate the round and close the review (`$SP/review-rounds.txt`, the parent goal log through `PLOG` only). After T024. Reproduce every P0 and P1 the round reports by running its cited input. A reproduced one becomes a new task with the next free id in the lane that owns the file, test first and checked by an Opus verifier, then a new fix commit and one closing round labelled `-4c` over that commit's diff, run as T024 ran. A P1 that does not reproduce is recorded with the command that showed it. Each P2 is recorded with its fix or its reason. After the closing round, or after T024 when it ends with no adjudicated P1, write `PLOG "Review pass four, confirming round | <state> | <lineages, iterations, the last ratio of each, the adjudicated P0, P1 and P2 counts>"`. When a lineage still ends above 0.10 after the last round, the row states the closure judgment and the reason. Verify: `review-rounds.txt` holds one ratio line per lineage of each round, every reported P0 and P1 has a reproduction line, no round past `-4c` is run, and `rg -c '^\| Review pass four, confirming round \|' $PK/goal.md` prints 1.
- [ ] T026 [C] Write the pass-four synthesis (`$PK/review/review-report.md`, `$PK/review/review-report-pass-3.md`). After T025. Move the pass-three report with `G mv $PK/review/review-report.md $PK/review/review-report-pass-3.md`. Write a new `review-report.md` in the shape of the pass-three report: the scope, the lineages and their models, and counts computed from the pass-four lineages only, with `jq -r '[.openFindings[] | select(any(._lineages[]?; tostring | test("-4(b|c)?$")))] | group_by(.severity) | map("\(.[0].severity) \(length)") | join(", ")' $PK/review/deep-review-findings-registry.json`, then the verifier's verdict on each finding from `verify-4/report.md`, the adjudication of T025, and one table row per finding with its task, its decision row or its reason. Name as a known limit that the merged registry keeps 7 active P1 rows of passes one to three, which each pass's own report adjudicated to 0 open P1, so its `activeP1` count is not this pass's count. Verify: `rg -c -F 'Pass Four' $PK/review/review-report.md` prints at least 1, `ls $PK/review/review-report-pass-3.md` prints the path, the report states 0 open P0 and 0 open P1 or names each open one with its reason, and every finding id of `verify-4/report.md` appears in it.
- [ ] T027 [C] Write the results and close the phase (`$PH/implementation-summary.md`). After T026. Copy `$SP/implementation-summary.scaffold.md` to `$PH/implementation-summary.md` and fill it: `BASE`, `FIX`, the sixteen files, the probe lines before and after, every moved start line of `rescore-delta.txt` with its row and rule, the floors, the review rounds and the synthesis, every `[B]` task and the limits of the moved figures (tuned rows, one run each, no brief reached Codex). Mark each row of `acceptance-criteria.md` with the evidence observed, set the status in `spec.md` and the phase 27 row of `../spec.md` to `Complete`, then run `node .skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs --folder $PH --apply`. Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh $PH --strict` prints `RESULT: PASSED`, and `rg -c "\| Unmet \|" $PH/acceptance-criteria.md` prints nothing.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
<!-- FILL: Keep the three completion lines and add the one artifact that proves the phase is done. GOOD: `--keep 3` leaves 3 archives and the suite passes. WEAK: Work is complete. -->

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] `scratch/repro-after.txt` prints no refused command on the three or-list refusal lines and holds `HAS offeredAs`
- [ ] `scratch/rescore-delta.txt` holds 23 start lines and 11 workflow lines, and every moved run names its rule
- [ ] `../review/review-report.md` holds the pass-four synthesis
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
<!-- FILL: Name the spec and plan files. Add the decision record when the packet has one. GOOD: Specification: `spec.md`. Plan: `plan.md`. WEAK: See the other docs. -->

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
- **Findings**: `../review/verify-4/report.md`, the four pass-four lineages under `../review/lineages/` and `../review/review-scope-4.txt`
- **Decisions**: P042 to P051 in `../decision-record.md`
- **The phase that runs next**: `../026-untuned-behaviour-arm/`, whose task T002 records the stored summaries after this phase closes
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

A `[B]` task stops its lane. The coordinator records the printed line in the parent goal log and decides. No rule is bent to make a stored run score better, and no word is changed to move a probe prompt.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation
<!-- FILL: Write one check per setup fact, each with a command. GOOD: CHK-001 [P0] The start commit is in `goal.md` section 4. WEAK: Setup is ready. -->

- [ ] CHK-001 [P0] Phase 024 reads `Complete`, no phase 026 task is `[x]` and `FILES` are clean in `git status` (T001).
- [ ] CHK-002 [P0] The floors, the three stored summaries and the per-row files are recorded before the first edit (T001, T003).
- [ ] CHK-003 [P1] `$SP/repro-before.txt` matches the Measured Behavior block (T002).
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality
<!-- FILL: Write one check per file rule. A command must answer it. GOOD: CHK-010 [P0] `bash -n scripts/rotate-logs.sh` exits 0. WEAK: Code is clean. -->

- [ ] CHK-010 [P0] `node --check` exits 0 on `CO`, `R`, `S` and `CR`, and `TC` exits 0 (T018).
- [ ] CHK-011 [P0] `G diff BASE -U0 -- $S | rg -c "^-.*(followedRate|loadRate|share|startRate):"` prints nothing, so no existing field expression changed.
- [ ] CHK-012 [P1] No added comment names a spec path or an id (T022).
- [ ] CHK-013 [P1] `COMMAND_OR_LIST`, `offerLineFields`, `publishedHoldoutIds`, the shell branch of `readDocument` and the Codex read each carry one reason comment.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist
<!-- FILL: Write one check per acceptance criterion. GOOD: CHK-020 [P0] `--keep 3` leaves 3 archives. WEAK: Tests pass. -->

- [ ] CHK-020 [P0] `VALL` and `HT` report 0 failed and `RT`, `DT` and `VP` report `fail 0` (T018).
- [ ] CHK-021 [P0] The floor, fit and eval lines equal their before lines, or a recapture is recorded (T019).
- [ ] CHK-022 [P0] Each of T004 to T011 recorded a failing first run for the reason its line names.
- [ ] CHK-023 [P0] No workflow count, load rate, followed rate, `unsafe` or loop count moved in the rescore, and every moved start names its rule (T021).
- [ ] CHK-024 [P1] `MENTION` prints `SHIPPED: 46 of 46 agree` and the `OFFERS` count holds (T020).
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS
<!-- FILL: Write this section when the packet fixes a reported finding. Delete it otherwise. GOOD: CHK-FIX-001 [P0] Every finding names one class. WEAK: All findings handled. -->

- [ ] CHK-FIX-001 [P0] Finding classes: SA4-P1-002 is `cross-consumer` (one reader, three callers), SA4-P2-001 is `class-of-bug`, the dropped `offeredAs` is `class-of-bug` (two writers), the shell read is `algorithmic` with a `matrix/evidence` rescore, the heredoc end word and R4-P2-001 are `instance-only`, the holdout guard is `test-isolation`, and the four document findings are `instance-only`.
- [ ] CHK-FIX-002 [P0] Same-class producers: `rg -n "offeredPolicy: offer\.offeredPolicy" $RAD` lists the two writers and no third, and `rg -n "readFileSync\(transcriptPath" $SR/session-readers` lists `codex.mjs` alone before the fix and nothing after it.
- [ ] CHK-FIX-003 [P0] Consumers: `rg -n "commandOnlyMentioned|readDocument\(|offerLineFields|offeredAs|HEREDOC_BODY" .skilled --glob '*.ts' --glob '*.mjs' --glob '!**/dist/**'` is read, and every caller still receives the fields it reads (T018).
- [ ] CHK-FIX-004 [P0] Adversarial table tests: the delimiter (`or` and `, or`), the joined input (three commands in one list), the outside root (a link in the store read at its resolved path), the no-op (`use A or B`, `use A, not B`, `the next step is the /x command`, `rg`, an in-place `sed`) and the fallback (`do not run A or run B`, a replay with no `offeredAs`) each hold a row (T004 to T010).
- [ ] CHK-FIX-005 [P1] Matrix axes and row count: the join (`or`, `, or`, a second use verb, `not`, a comma then a use verb) by the lead (decline, none), the article (none, `the`) by the sentence (question, statement), the read shape (read tool, `cat`, `rg`, in-place `sed`, heredoc line) by the event after it (write), and the offer place (`head`, `partner`, absent) by the writer (backfill, live).
- [ ] CHK-FIX-006 [P1] Hostile global state: the Codex case restores the patched `fs` in a `finally`, and `RT` runs every reader case after it, so a leaked patch fails a later case.
- [ ] CHK-FIX-007 [P1] Evidence names `BASE`, `FIX` and the run logs each number came from (T027).
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security
<!-- FILL: Write one check per security surface. Write `N/A` with a reason when none applies. GOOD: CHK-030 [P0] `scripts/rotate-logs.sh` reads no credential. WEAK: Security is fine. -->

- [ ] CHK-030 [P0] `rg -l -F '"prompt"' $SP` prints nothing, and every read of a row file in this phase went through `jq 'del(.prompt)'`.
- [ ] CHK-031 [P0] The Codex reader still refuses a rollout outside its store before it opens the file (`RT`, the case `a rollout outside the store is refused without reading it`).
- [ ] CHK-032 [P1] The holdout guard reads both the committed baseline and the live capture (T011).
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation
<!-- FILL: Write one check per document that must agree. GOOD: CHK-040 [P1] `spec.md` and `tasks.md` both name `--keep <n>`. WEAK: Docs are updated. -->

- [ ] CHK-040 [P1] `RA` names `offeredAs` in both field lists, the shell-read start rule and the heredoc end word (T012, T013).
- [ ] CHK-041 [P1] `implementation-summary.md`, `rescore-delta.txt` and the parent goal log rows quote the same start lines (T021, T027).
- [ ] CHK-042 [P2] `FA`, `FM`, `AR` and `DP` carry the corrected sentences (T014 to T017).
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization
<!-- FILL: Write one check per file location rule. GOOD: CHK-050 [P1] Test copies live under `scratch/test/`. WEAK: Files are organized. -->

- [ ] CHK-050 [P1] Every before, after and delta file lives under `scratch/`, and the undone scorer copy and its row files lived outside the repository and are removed (T021).
- [ ] CHK-051 [P1] `G status --short -- .skilled .opencode` names only `FILES` and the regenerated declaration map before T023.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary
<!-- FILL: Count the boxes by priority and write the three totals. GOOD: P0 12, P1 13, P2 1. WEAK: Most items done. -->

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 14 | 0/14 |
| P1 Items | 12 | 0/12 |
| P2 Items | 1 | 0/1 |

**Verification Date**: Pending
<!-- /ANCHOR:summary -->

---
