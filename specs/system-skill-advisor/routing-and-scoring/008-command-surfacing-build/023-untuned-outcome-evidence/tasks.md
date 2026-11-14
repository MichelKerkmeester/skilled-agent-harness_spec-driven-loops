---
title: "Tasks: Phase 23: untuned-outcome-evidence"
description: "Ordered worker-sized tasks that print where the sealed plain rows fall out, add 48 sealed fit rows and their count, add a range, an offered split and paired arm counts to the workflow summary, and record every line of evidence from the two committed scripts."
trigger_phrases:
  - "untuned outcome evidence tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 23: untuned-outcome-evidence

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
| `[C]` | Coordinator task: a gate, a full-suite run, a capture, a summary over the stored sessions or the close-out. No worker runs it |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

Every command runs from the repository root unless a task says `in ADV`. Set the path names once with `export ADV=.skilled/skills/system-skill-advisor/runtime RAD=.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy RL=specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/007-per-runtime-behaviour-proof/scratch PK=specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build PH=specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/023-untuned-outcome-evidence SP=specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/023-untuned-outcome-evidence/scratch`.
- `G` is `git -c core.fsmonitor=false`. `BASE` is the commit T001 records.
- `CAP` is `$RAD/capture-command-routing-baseline.mjs` and `CRS` is `$ADV/tests/command-routing-slice.vitest.ts`. `CPJ` is `$RAD/command-prompts.jsonl` and `CRB` is `$RAD/command-routing-baseline.json`.
- `S` is `$RAD/score-command-transcripts.mjs` and `CTS` is `$ADV/tests/command-transcript-score.vitest.ts`. `RA` is `$RAD/README.md`.
- `VX <file>` is `env -u AI_SESSION_CHILD npx vitest run <file>` in `ADV`. `VALL` is `env -u AI_SESSION_CHILD npx vitest run` in `ADV`, which must report 0 failed.
- `FIX` is `node $CAP`, the fixture regime, and `REAL` is `node $CAP --real-embedding`. Both print the capture as JSON and write nothing. When `REAL` exits 2 because the embedder does not answer, write the line `real: embedder not live` where its output would go and start nothing.
- `LOGS` is `$RL/runs-pre.jsonl $RL/runs-pre-dsh-rerun.jsonl $RL/runs-final.jsonl`. `SBOTH` is `node $S --summary $LOGS --pair pre,post --json`, run with the `OPENCODE_DB` value phase 019 recorded in its notes, or with none when it recorded none.
- `FITROWS` is `jq -r 'del(.prompt) | select(.row_type == "skill-only" or .row_type == "decline") | [.row_type, (.decline_kind // "-"), .split] | join(" ")' $CPJ`.
- `REACH` is `jq -r '.attachedMetrics | (.plain | to_entries[] | "reach \(.key) \(.value.combined) of \(.value.total)"), (.plain_stages | to_entries[] | "stage \(.key) " + (.value | to_entries | map("\(.key)=\(.value)") | join(" "))), "fit skill-only \(.fit.skillOnly.carried) of \(.fit.skillOnly.total)", "fit decline \(.fit.decline.carried) of \(.fit.decline.total)"'`, six lines for one capture.
- `FOLLOWED` is `jq -r 'to_entries[] | .key as $r | .value | del(.unscored, .paired) | to_entries[] | "followed \($r) \(.key) \(.value.workflow.followedRate) range \(.value.workflow.followedRange.low) to \(.value.workflow.followedRange.high) offered \(.value.workflow.followedOffered) notOffered \(.value.workflow.followedNotOffered) unknown \(.value.workflow.offerUnknown)"'`, one line per runtime and arm.
- `PAIRED` is `jq -r 'to_entries[] | select(.value.paired != null) | "paired \(.key) \(.value.paired.from) to \(.value.paired.to) " + (.value.paired | del(.from, .to) | to_entries | map("\(.key)=\(.value)") | join(" "))'`, one line per runtime that scored both arms.

Rules for every task:
- Each task is one change to the files it names. A task that names a module and its test writes the test case first, runs it and sees it fail for the reason the task names, then makes the change and sees it pass. Its verify names both runs.
- Re-read every file a task names before the first edit. Phases 019, 020 and 022 edited these files after this plan was written. When a line, string or name the task quotes is not in the file, change nothing and mark the task `[B]` with the line found in its place.
- No task reads or prints the prompt text of a row whose `split` is `holdout`. No task opens `CPJ` except through `jq 'del(.prompt)'`, and T004 only appends to it. No output field, error or log line carries prompt text.
- No task changes a phrase, a guard, a scorer rule, a renderer, a hook or `AGENTS.md`. A count this phase prints is recorded as found. When a fit count is above zero, nothing is tuned and the count goes to the operator.
- Every field an earlier summary or capture prints keeps its name and its value rule. A task adds fields and never renames or redefines one.
- No worker runs the full suite, a capture, a summary over the stored logs, a daemon or a model session, and no worker writes under the home folder or another phase folder.
- No code comment may name a spec path, a phase number, a task id, a finding id, an ADR or a REQ id. T013 checks it.
- Add no dependency and edit no `package.json`, session reader, runner or other corpus.
- A `.md` edit routes through `sk-doc` and a code edit through `sk-code` before the first write. A doc sentence holds no em dash and no semicolon.
- A row written with `goal.cjs packet-log` is cut by that command: the item at 200 characters, the state at 40 and the evidence at 400, with `...` in place of the rest. Keep each cell inside its limit and write a second row rather than a longer one. After the command, `rg -c -e '\.\.\. \|$'` over the parent `goal.md` must print the count it printed before the command.
- When a verify prints something other than the expected output, do not change code to match it. Mark the task `[B]` with the printed line.

Worker lanes. Lane R owns `CAP`, `CRS` and `CPJ` and runs T003, T016, T004, T005 and T017 in that order. Lane S owns `S` and `CTS` and runs T007, T008, T009, T018, T019, T020 and T021 in that order. Lane D owns `RA` and runs T010 after both lanes end. Lanes R and S run in parallel after T002. T006 is the coordinator's recapture and runs after lane R. T016 to T021 were split out of T003, T005 and T009 so that each task changes one function, or one helper and its one call.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
<!-- FILL: Replace the sample tasks with the real setup steps. Each task names a file and a verify command. GOOD: T001 Confirm `logs/archive/` holds 10 archives. Verify: `ls logs/archive | wc -l` prints 10. WEAK: T001 Set up the project. -->

- [ ] T001 [C] Confirm the three earlier phases are closed and record the before numbers (`$SP/before.txt`). Run `rg -c '\*\*Status\*\* \| Complete' $PK/020-command-offer-fit-guards/spec.md $PK/021-brief-head-parity/spec.md $PK/022-workflow-measure-soundness/spec.md`, `G status --porcelain -- $CAP $CRS $CPJ $CRB $S $CTS $RA`, `G rev-parse --short HEAD`, `VX tests/command-routing-slice.vitest.ts`, `VX tests/command-transcript-score.vitest.ts`, `VALL`, then `FIX > $SP/capture-before-fixture.json`, `REAL > $SP/capture-before-real.json` and `node $S --summary $LOGS --json > $SP/summary-before.json`, and write each command with its last lines or exit code into `before.txt`. When a phase is not Complete or the status prints a line, stop and mark the phase `[B]` with that line. Verify: the `rg` prints 1 for each of the three files, the `status` prints nothing, both `VX` runs and `VALL` report 0 failed, `jq -c '.attachedMetrics.plain.holdout.total' $SP/capture-before-fixture.json` prints 44, and `before.txt` holds the fixture and real `plain` lines beside the planning values `{"own":1,"attached":0,"combined":1,"total":44}` and `{"own":5,"attached":0,"combined":5,"total":44}` with any difference named as an earlier phase's change.
- [ ] T002 [C] Record the reproductions (`$SP/repro-before.txt`). Run `jq -c '[.attachedMetrics.plain_stages, .attachedMetrics.fit]' $SP/capture-before-fixture.json`, `jq -c '[.[] | del(.unscored) | .[] | .workflow.followedRange] | all(. == null)' $SP/summary-before.json`, `node $S --summary $RL/runs-final.jsonl --pair pre,post --json` with its error output and exit code, and `FITROWS | wc -l`, and write each command with its output. Verify: the first prints `[null,null]`, the second prints `true`, the third names `unknown option: --pair` and exits 2, and the fourth prints 0.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
<!-- FILL: Replace the sample tasks with the real change, one per task. Each task names the file it edits and the verify command. GOOD: T003 Add the `--keep <n>` branch to `scripts/rotate-logs.sh`. Verify: `bash scripts/rotate-logs.sh --keep 3` leaves 3 archives. WEAK: T003 Implement the feature. -->

### Lane R: the capture and the corpus

- [ ] T003 Add the reach-stage tally and the function that fills it (`$CAP` functions `emptyStageTally` and `addStageRow`). Edit the functions in the order named, one at a time, and run the named test after each. One tally: its empty shape and its one writer. Nothing reads them until T016 publishes the tally, so this task has no failing first run. Directly below the function `addAttachedRow`, add `emptyStageTally()`, which returns `{ total: 0, own: 0, ownerLed: 0, routed: 0, withCommand: 0, attached: 0, neither: 0 }`, and `addStageRow(tally, facts)`, which adds 1 to `total` and adds 1 to each of `own`, `ownerLed`, `routed`, `withCommand`, `attached` and `neither` whose value in `facts` is `true`. Give the pair one comment saying a plain row leaves the path to its command at one stage and the tally says which. Change no other function. Verify: `node --check $CAP` exits 0, `rg -c -e '^function (emptyStageTally|addStageRow)\(' $CAP` prints 2 and `VX tests/command-routing-slice.vitest.ts` reports 0 failed.
- [ ] T016 Print where each plain row fell out (`$CRS`, then `$CAP` function `scoreCommandCorpus`). After T003. This task changes the function `scoreCommandCorpus` and nothing else in `$CAP`. Test first: in `describe('command routing slice')` add the case `splits each plain row into one reach stage`, which reads `live.attachedMetrics.plain_stages` and asserts for `tune` and for `holdout` that `own + ownerLed + neither` equals `total`, that `attached <= withCommand`, `withCommand <= routed` and `routed <= ownerLed`, and that `own` and `attached` equal the same split's values in `live.attachedMetrics.plain`. It fails because `plain_stages` is undefined. Then in `scoreCommandCorpus` build a map from each bridge entry's `command` to its `skillId` out of the `idToCommand` values, create one `emptyStageTally()` for `tune` and one for `holdout`, and inside the `if (isPlainSplit)` block call `addStageRow` with `own: top1Hit`, `ownerLed` true when `top1Hit` is false and `topId` is the owner of `expected`, `routed` true when `ownerLed` holds and `route` is defined, `withCommand` true when `routed` holds and `attached` is defined, `attached: attachedHit` and `neither` true when neither `own` nor `ownerLed` holds. Publish the two tallies as `attachedMetrics.plain_stages` with the keys `tune` and `holdout`. The block holds counts only. Verify: `VX tests/command-routing-slice.vitest.ts` reports the new case failed before the change, and after it only the case `matches the captured totals` fails, on the `attachedMetrics` comparison, until T006 recaptures.
- [ ] T004 Append the 48 sealed fit rows (`$CPJ`). The worker's brief holds only the two class definitions below, the row shape, the output of `ls .skilled/commands/*/` and the skill names under `.skilled/skills/`. In that session the worker opens no file under `$ADV/lib`, no bridge table, no file under `$PK` other than this task and no existing row of `CPJ`, and runs the advisor on no draft. Each row is written once and appended as one JSON line. A `skill-only` row is a request one skill owns and no tracked command's workflow fits, such as a code fix, a commit or a question about the code. Write 24, across at least four skills and at most eight per skill, with the shape `{"id":"fit-skill-only-01","row_type":"skill-only","split":"holdout","prompt":"<text>","expected_command":null,"expected_policy":null,"expected_top":"<skill id>","source":"authored-blind"}`. A `decline` row names or resembles a command's subject and must not start it. Write six of each kind: `refusal` (the user says not to use the command or its workflow), `question` (the user asks what a command does or whether to use it), `small-edit` (a fix of a few characters in an artifact a create command owns) and `app-problem` (a fault in the user's own application that shares words with a doctor target). Their shape adds `"decline_kind":"<kind>"`, sets `"expected_top":null` and uses ids of the form `fit-decline-<kind>-01`. Verify: `FITROWS | sort | uniq -c` prints `6 decline app-problem holdout`, `6 decline question holdout`, `6 decline refusal holdout`, `6 decline small-edit holdout` and `24 skill-only - holdout`, `G diff --numstat -- $CPJ` prints `48` then `0` then the path, and `jq -r 'del(.prompt) | .id' $CPJ | sort | uniq -d | wc -l` prints 0.
- [ ] T005 Refuse a fit row that repeats another row (`$CRS`, then `$CAP` function `assertFitRowsUnique` and its one call in `scoreCommandCorpus`). After T004. Test first: in `$CRS`, add `assertFitRowsUnique` to the import from the capture script and add the case `refuses a fit row that repeats another row`, which uses made-up rows and no corpus row: it expects `assertFitRowsUnique([{ id: 'fit-skill-only-91', row_type: 'skill-only', prompt: 'Rename  the Helper function' }, { id: 'made-up-92', row_type: 'plain', prompt: 'rename the helper function' }])` to throw an error whose message is `fit row fit-skill-only-91 repeats row made-up-92`, and expects the same call with the second prompt changed to `rename the other function` not to throw. It fails because `assertFitRowsUnique` is not exported. Then in `$CAP`, export `assertFitRowsUnique(rows)`: for each row whose `row_type` is `skill-only` or `decline`, compare its prompt, lower-cased, trimmed and with every whitespace run collapsed to one space, with the prompt of every other row folded the same way, and throw `new Error` with the message `fit row <id> repeats row <id>` on the first match. The message names the two ids and no prompt text. Call it in `scoreCommandCorpus` on the line directly after the rows are read with `readCorpus`. Verify: `VX tests/command-routing-slice.vitest.ts` reports the new case failed before the change and passes after it, and only the `attachedMetrics` and corpus hash comparisons fail until T006.
- [ ] T017 Count the fit rows apart from every other tally (`$CRS`, then `$CAP` function `headCarriesCommand` and the row loop of `scoreCommandCorpus`). After T005. Test first: add the case `counts the sealed fit rows and publishes none`, which asserts `live.attachedMetrics.fit.skillOnly.total` is 24, `fit.decline.total` is 24, each of the four `fit.decline.byKind` totals is 6, every `carried` is at most its `total`, and no key of `live.rows`, `attachedMetrics.attachedRows` or `attachedMetrics.typedRows` starts with `fit-`. It fails because `fit` is undefined. Then add `headCarriesCommand(landed, delivered)`, true when `landed[0]` is not null or `delivered` is defined. In the row loop of `scoreCommandCorpus`, once `delivered` is known, a row whose `row_type` is `skill-only` or `decline` adds 1 to the `total` of its `fit` tally, adds 1 to `carried` when `headCarriesCommand` is true, and continues to the next row, so it takes part in no other count, row map or list. A `decline` row also adds to the `byKind` entry named by its `decline_kind`. Publish `attachedMetrics.fit` as `{ skillOnly: { carried, total }, decline: { carried, total, byKind } }`. Verify: `VX tests/command-routing-slice.vitest.ts` reports the new case failed before the change and passes after it, the case `publishes no holdout row` passes, and only the `attachedMetrics` and corpus hash comparisons fail until T006.
- [ ] T006 [C] Recapture the baseline and prove the earlier metrics did not move (`$CRB`, `$SP/recapture.txt`). Run `node $CAP --write`, then `jq -c '[.metrics, .unreachable, .commands, (.attachedMetrics | del(.plain_stages, .fit))]' $SP/capture-before-fixture.json > $SP/earlier-before.json` and the same filter over `$CRB` into `$SP/earlier-after.json`, then `cmp $SP/earlier-before.json $SP/earlier-after.json`, `jq -c '.rows | length' $SP/capture-before-fixture.json $CRB` and `VX tests/command-routing-slice.vitest.ts`, and write each command with its output into `recapture.txt`. From this task on no fit row is edited, replaced or removed. Verify: `cmp` prints nothing and exits 0, the two row counts are equal, the slice file reports 0 failed and `jq -c '.attachedMetrics | [.plain_stages.holdout.total, .fit.skillOnly.total, .fit.decline.total]' $CRB` prints `[44,24,24]`.

### Lane S: the workflow summary

- [ ] T007 [P] Print a range beside the followed rate and the load rate (`$CTS`, then `$S` functions `wilsonRange` and `tallyBlock`). Edit the functions in the order named, one at a time, and run the named test after each. Test first: add a `describe('wilsonRange')` block with the cases `wilsonRange(8, 16)` equals `{ low: 0.28, high: 0.72 }`, `wilsonRange(0, 16)` equals `{ low: 0, high: 0.19 }`, `wilsonRange(16, 16)` equals `{ low: 0.81, high: 1 }` and `wilsonRange(0, 0)` is `null`, and in `describe('run log summary')` add the case `prints a range beside each workflow rate`, which asserts the `workflow` block holds `followedRange` and `loadRange` equal to `wilsonRange` of each rate's two counts. They fail because `wilsonRange` is not exported. Then export `wilsonRange(successes, total)`, the Wilson score interval at 1.96 rounded to two decimals and clamped to 0 and 1, and add the two fields to the `workflow` object in `tallyBlock`. `followedRate`, `loadRate` and `share` keep their text. Verify: `VX tests/command-transcript-score.vitest.ts` reports the new cases failed before the change and 0 failed after it.
- [ ] T008 Split the followed rate by whether the head offered the row's command (`$CTS`, then `$S` functions `newTally`, `addScored` and `tallyBlock`). Edit the functions in the order named, one at a time, and run the named test after each. Test first: in `describe('run log summary')` add the case `splits the followed rate by the offer`, built on a log whose owned rows hold one offered run that followed, one offered run that did not, one run with no offer that followed and one line with no `offeredCommand` key, and assert `followedOffered` is `1 of 2`, `followedNotOffered` is `1 of 1` and `offerUnknown` is 1. It fails because the fields are undefined. Then count, for each owned scored run, whether its path is one `followedRate` counts, under `offered` when `result.offered` is true, under `offerUnknown` when `result.offerFieldAbsent` is true and under `notOffered` otherwise, and print the three fields in the `workflow` object. Verify: the file reports the new case failed before the change and 0 failed after it, and in that case the three denominators add up to the denominator of `followedRate`.
- [ ] T009 Read the `--pair` option (`$CTS`, then `$S` function `parseArgs`). After T008. This task changes the function `parseArgs` and the `USAGE` text and nothing else. Test first: in `$CTS`, give the helper `summarize` a second parameter `extraArgs: readonly string[] = []` and change its scorer call to `runScorer(['--summary', logPath, ...extraArgs, '--json'])`. Add the case `reads a pair option`, which calls `summarize` with one scored line whose `arm` is `pre` and with `['--pair', 'pre,post']`, and expects the call not to throw. It fails because the scorer exits with `unknown option: --pair` and the helper expects status 0. Then in `$S`'s `parseArgs`, add `pair: null,` to the `options` object, and before the final `else` add a branch for `token === '--pair'` that does `index += 1;` and `options.pair = valueAfter(argv, index, '--pair');`, as the `--row-id` branch does. In `USAGE`, add ` [--pair <from>,<to>]` to the `--summary` line before `[--json]`. Verify: the file reports the new case failed before the change and 0 failed after it, and `node $S --summary $RL/runs-final.jsonl --pair pre,post --json | jq -c '[.[] | has("paired")] | any'` prints `false`, because nothing reads the option yet.
- [ ] T018 Refuse a pair the summary cannot use (`$CTS`, then `$S` function `selectMode`). After T009. This task changes the function `selectMode` and nothing else. Test first: add the case `refuses a pair without a summary or with one arm name`, which expects `runScorer(['--runtime', 'claude', '--locator', '{}', '--pair', 'pre,post'])` to exit with a status other than 0 and an error output that holds `--pair needs --summary`, and expects `runScorer(['--summary', 'missing-log.jsonl', '--pair', 'pre'])` to exit with a status other than 0 and an error output that holds `--pair needs two arm names`. It fails because neither message exists. Then in `selectMode`, inside the `if (options.summaryLogs !== null)` block before `return 'summary';`, throw `new UsageError('--pair needs two arm names, as <from>,<to>')` when `options.pair` is a string that does not split on `,` into exactly two non-empty names. After that block, before the `--runtime` check, throw `new UsageError('--pair needs --summary')` when `options.pair` is not `null`. Verify: the file reports the new case failed before the change and 0 failed after it.
- [ ] T019 Return the row id of a scored run (`$S` function `scoreRun`). After T018. This task adds one line to the function `scoreRun` and nothing else. In the object `scoreRun` returns for a scored run, directly after the line `scored: true,`, add `rowId,`. The name `rowId` is already a constant at the top of that function. Verify: `rg -c -e '^    rowId,$' $S` prints 1, `node --check $S` exits 0 and `VX tests/command-transcript-score.vitest.ts` reports 0 failed.
- [ ] T020 Keep which owned rows followed (`$S` functions `newTally` and `addScored`). After T019. One tally field and the one line that fills it. In `newTally`, add the field `pairRows: new Map(),` beside `workflow`. In `addScored`, directly after the line `tally.workflow[result.workflowPath] += 1;`, add `if (result.workflowPath !== 'noOwner') tally.pairRows.set(result.rowId, ['command', 'skill', 'asked'].includes(result.workflowPath));` with a comment saying two arms are compared row by row, so each owned row keeps whether its run took a path the followed rate counts. `tallyBlock` is not edited, so no output changes. Verify: `rg -c 'pairRows' $S` prints 2, `node --check $S` exits 0 and `VX tests/command-transcript-score.vitest.ts` reports 0 failed.
- [ ] T021 Count the rows that moved between two arms (`$CTS`, then `$S` functions `project` and `writeSummary` and the one call to `project` in `summarize`). Edit the functions in the order named, one at a time, and run the named test after each. After T020. Test first: add the cases `pairs two arms row by row` (a log with arms `pre` and `post` over four owned rows of one runtime, where one row gains a followed path, one loses it, one follows in both and one in neither, read through `summarize` with `['--pair', 'pre,post']`, gives `paired` equal to `{ from: 'pre', to: 'post', rows: 4, gained: 1, lost: 1, bothFollowed: 1, neitherFollowed: 1 }`), `pairs only the rows both arms scored` (a row scored in one arm is in no count) and `leaves a one-arm runtime unpaired` (no `paired` key). They fail because `paired` is undefined. Then give `project` a second parameter `pair`, pass `options.pair` from `summarize`, and in `project` add `paired` to a runtime's block when `pair` is a string, both named arms exist for that runtime and their `pairRows` maps share at least one row id. `rows` is the number of shared ids, `gained` counts ids false in the first arm and true in the second, `lost` the reverse, `bothFollowed` true in both and `neitherFollowed` false in both. In `writeSummary`, print one `paired` line per runtime that has the key and skip the key where the text form lists arms. Without `--pair` the output is what it was. Verify: the file reports the three cases failed before the change and 0 failed after it, and `node $S --summary $RL/runs-final.jsonl --json | jq -c '[.[] | has("paired")] | any'` prints `false`.

### Lane D: the document

- [ ] T010 Describe the new fields and how to read the outcome (`$RA`). In the capture's row add `plain_stages` with its seven counts and `fit` with the two fit classes and the rule that a fit row is frozen once captured. In the scorer's row add `followedRange`, `loadRange`, `followedOffered`, `followedNotOffered`, `offerUnknown`, `--pair` and `paired`. Add one section named `Reading the outcome` with five sentences that each state one limit: a loaded document is not a followed step, the behaviour rows are tuned rows, each row ran once, two arms differ in more than the brief, and the offer on a stored run of a runtime other than Claude is the Claude hook's replay, so the split by offer says what the Claude head carried for that row. Verify: `rg -c -e 'plain_stages|followedRange|followedNotOffered|--pair' $RA` prints at least 4, `rg -c -F 'Reading the outcome' $RA` prints at least 1 and `rg -c -e '—|;' $RA` prints the count `G show BASE:$RA | rg -c -e '—|;'` prints, or nothing when that prints nothing.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
<!-- FILL: Replace the sample tasks with the real checks. Each task names the command and the output it must print. GOOD: T005 Run `bash scripts/rotate-logs.sh --keep 3`. Verify: `ls logs/archive | wc -l` prints 3. WEAK: T005 Test the change. -->

- [ ] T011 [C] Run every suite (`$SP/after.txt`). Run `VX tests/command-routing-slice.vitest.ts`, `VX tests/command-transcript-score.vitest.ts` and `VALL`, and write each command with its result lines into `after.txt`. Verify: each reports 0 failed and `VALL` reports more passed tests than the `VALL` line in `$SP/before.txt`.
- [ ] T012 [C] Record the evidence from the two scripts (`$SP/outcome-evidence.txt`). Run `FIX > $SP/capture-after-fixture.json`, `REAL > $SP/capture-after-real.json` and `SBOTH > $SP/summary-after.json`. Write the line `regime fixture`, the output of `REACH` over the fixture file, the line `regime real`, the output of `REACH` over the real file or the line `real: embedder not live`, then the output of `FOLLOWED` and of `PAIRED` over the summary file, then five lines that start with `limit: ` and state that a loaded document is not a followed step, that the behaviour rows are tuned rows, that each row ran once, that the two arms differ in more than the brief, and that the offer on a stored run of a runtime other than Claude is the Claude hook's replay, recorded when the run was made, so `offered` and `notOffered` on those lines say what the Claude head carried. No number in the file is typed by hand. The stored sessions and arenas are not deleted before this task ends. Verify: over `$SP/outcome-evidence.txt`, `rg -c '^reach '` prints 4, `rg -c '^stage '` prints 4 and `rg -c '^fit '` prints 4, or 2 for each when the real line reads `embedder not live`, `rg -c '^followed '` prints 11, `rg -c '^paired '` prints 5, `rg -c '^limit: '` prints 5, `rg -c -e "^limit: .*Claude hook's replay"` prints 1, and `rg -c -e '^fit .* 0 of 0$'` prints nothing.
- [ ] T013 [C] Check the scope, the comments and the sealed rows (`$SP/scope.txt`). Run `G diff --stat BASE -- . ':!specs'`, `G diff --numstat BASE -- $CPJ`, `G diff BASE -- $CAP $S | rg -e '^\+\s*(//|\*|/\*)' | rg -c -e 'specs/|[0-9]{3}-[a-z]|\b(T|REQ-|AC-|CHK-|ADR-|[AB]-)[0-9]+'` and `rg -c -e 'fit-(skill-only|decline)' $CRB $SP/outcome-evidence.txt`, and write each with its output. Verify: the stat names the seven files of the spec's table and no other, the numstat prints `48` then `0`, the comment search prints nothing and the id search prints nothing.
- [ ] T014 [C] Hand the numbers to the operator (`$PK/goal.md` through the log command only). For each of the reach, fit, followed and paired groups run `node .skilled/hooks/goal/bin/goal.cjs packet-log $PK "<item> | Recorded | <the lines of that group, joined by a comma>" --workspace .`. When a group's lines are longer than 400 characters, write them as several rows whose item ends ` 1 of N`, ` 2 of N` and so on, so no number is cut. Add one row that reads `Outcome target | Waiting on the operator | <the three options of this phase's spec>`. Change no criterion and tick none. Verify: `rg -c -e '^\| (Sealed reach|Sealed fit|Followed range|Paired arms|Outcome target)( [0-9]+ of [0-9]+)? \|' $PK/goal.md` prints at least 5, `rg -c -e '^\| (Sealed reach|Sealed fit|Followed range|Paired arms).*\.\.\. \|$' $PK/goal.md` prints nothing and `node .skilled/hooks/goal/bin/goal.cjs packet $PK --workspace .` prints `packet_budget=ok`.
- [ ] T015 [C] Close the phase (`$PH/implementation-summary.md`). Copy `$SP/implementation-summary.scaffold.md` to `$PH/implementation-summary.md` and fill it with `BASE`, the seven files, the evidence lines, the five limits and every `[B]` task. Set each `acceptance-criteria.md` row to `Met` with the command output that showed it or leave it `Unmet` with the reason, set the status in `spec.md` and the phase 23 row of `../spec.md` to match, tick the goal criteria that hold, then run `node .skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs --folder $PH --apply` and `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh $PH --strict`. Verify: the validation prints `RESULT: PASSED`, and `rg -c "\| Unmet \|" $PH/acceptance-criteria.md` prints nothing when the status is Complete.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
<!-- FILL: Keep the three checks and add the one command that proves the change. GOOD: `ls logs/archive | wc -l` prints 3 after `--keep 3` and 10 after a plain run. WEAK: Everything is done. -->

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] `VALL` reports 0 failed
- [ ] `jq -c '.attachedMetrics | [.plain_stages.holdout.total, .fit.skillOnly.total, .fit.decline.total]' $CRB` prints `[44,24,24]`
- [ ] `$SP/outcome-evidence.txt` holds 11 `followed` lines, 5 `paired` lines and 5 `limit:` lines
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
<!-- FILL: Keep the links to `spec.md` and `plan.md`. Add no other link unless the task list needs it. GOOD: Specification: `spec.md`. Plan: `plan.md`. WEAK: See the other docs. -->

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance**: See `acceptance-criteria.md`
- **Reproductions**: See `scratch/planning/untuned-reach.before.txt`
- **Findings**: `../review/fable-alignment-2026-11-14/report-purpose-alignment.txt`
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

A `[B]` task stops its lane. The coordinator records the printed line in the parent goal log and decides. No fit row is rewritten and no guard is changed to move a count.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation
<!-- FILL: Write one check per setup fact, each with a command. GOOD: CHK-001 [P0] The start commit is in `goal.md` section 4. WEAK: Setup is ready. -->

- [ ] CHK-001 [P0] Phases 020, 021 and 022 read `Complete` and the seven files are clean in `git status` (T001).
- [ ] CHK-002 [P0] `$SP/capture-before-fixture.json` and `$SP/summary-before.json` exist (T001).
- [ ] CHK-003 [P1] `$SP/repro-before.txt` holds `[null,null]`, `true`, the unknown option line and 0 (T002).
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality
<!-- FILL: Write one check per file rule. A command must answer it. GOOD: CHK-010 [P0] `bash -n scripts/rotate-logs.sh` exits 0. WEAK: Code is clean. -->

- [ ] CHK-010 [P0] `node --check $CAP` and `node --check $S` exit 0.
- [ ] CHK-011 [P0] `G diff BASE -U0 -- $S | rg -c "^-.*(followedRate|loadRate|share):"` prints nothing, so no existing field expression changed.
- [ ] CHK-012 [P1] No added comment names a spec path or an id (T013).
- [ ] CHK-013 [P1] `--pair` is the one new option, and `node $S --summary $RL/runs-final.jsonl --json` prints what it printed before it existed (T009, T021).
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist
<!-- FILL: Write one check per acceptance criterion. GOOD: CHK-020 [P0] `--keep 3` leaves 3 archives. WEAK: Tests pass. -->

- [ ] CHK-020 [P0] `VALL` reports 0 failed (T011).
- [ ] CHK-021 [P0] `cmp $SP/earlier-before.json $SP/earlier-after.json` prints nothing (T006).
- [ ] CHK-022 [P0] Each of T016, T005, T017, T007, T008, T009, T018 and T021 recorded a failing first run for the reason its line names.
- [ ] CHK-023 [P1] The baseline prints `[44,24,24]` for the stage and fit totals (T006).
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS
<!-- FILL: Write this section when the packet fixes a reported finding. Delete it otherwise. GOOD: CHK-FIX-001 [P0] Every finding names one class. WEAK: All findings handled. -->

- [ ] CHK-FIX-001 [P0] Finding classes: B-1 and B-11 are `matrix/evidence`. Neither is closed by a scorer rule here.
- [ ] CHK-FIX-002 [P0] Consumers: `rg -n "attachedMetrics|command-prompts.jsonl|summaryLogs" $ADV --glob '*.mjs' --glob '*.ts' --glob '!**/dist/**'` lists every reader, and each still receives the fields it reads.
- [ ] CHK-FIX-003 [P1] Matrix: row class (plain tune, plain holdout, typed, silence, skill-only, decline) by tally (earlier metrics, stages, fit).
- [ ] CHK-FIX-004 [P1] Evidence names `BASE`, the regime and the three run logs each line came from (T012, T015).
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security
<!-- FILL: Write one check per security surface. Write `N/A` with a reason when none applies. GOOD: CHK-030 [P0] `scripts/rotate-logs.sh` reads no credential. WEAK: Security is fine. -->

- [ ] CHK-030 [P0] `VX tests/command-routing-slice.vitest.ts` passes the case `publishes no holdout row` with the fit rows in the corpus (T017).
- [ ] CHK-031 [P0] No fit row id appears in the baseline or the evidence file (T013).
- [ ] CHK-032 [P1] The repeated-row error names two ids and no text (T005).
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation
<!-- FILL: Write one check per document that must agree. GOOD: CHK-040 [P1] `spec.md` and `tasks.md` both name `--keep <n>`. WEAK: Docs are updated. -->

- [ ] CHK-040 [P1] `RA` names `plain_stages`, `fit`, `followedRange`, `--pair` and the section `Reading the outcome` (T010).
- [ ] CHK-041 [P1] `implementation-summary.md`, the evidence file and the parent goal log rows quote the same lines (T014, T015).
- [ ] CHK-042 [P2] The five limits read the same in `RA` and in the evidence file.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization
<!-- FILL: Write one check per file location rule. GOOD: CHK-050 [P1] Test copies live under `scratch/test/`. WEAK: Files are organized. -->

- [ ] CHK-050 [P1] Every capture, summary and evidence file lives under `scratch/` (T012).
- [ ] CHK-051 [P1] `G diff --stat BASE -- . ':!specs'` names the seven files of the spec's table and no other (T013).
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary
<!-- FILL: Count the boxes by priority and write the three totals. GOOD: P0 12, P1 13, P2 1. WEAK: Most items done. -->

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 0/11 |
| P1 Items | 11 | 0/11 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-11-14
<!-- /ANCHOR:summary -->

---
