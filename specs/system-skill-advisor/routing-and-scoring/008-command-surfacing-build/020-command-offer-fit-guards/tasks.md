---
title: "Tasks: Phase 20: command-offer-fit-guards"
description: "Ordered worker-sized tasks that withhold a command where none fits: a mention reader in the attach module, a small-edit gate, an uncertainty bar on the meaning pass, a no-edit gate on commands that write and a weak-cue bar on the doctor hand-off, each with a test written first."
trigger_phrases:
  - "command offer fit guards tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 20: command-offer-fit-guards

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
| `[C]` | Coordinator task: a gate, a rebuild, a full-suite run, a probe run or the close-out. No worker runs it |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

Every command runs from the repository root unless a task says `in ADV`. Set the path names once with `export ADV=.skilled/skills/system-skill-advisor/runtime RAD=.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy PH=specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/020-command-offer-fit-guards SP=specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/020-command-offer-fit-guards/scratch PL=specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/020-command-offer-fit-guards/scratch/planning`.
- `G` is `git -c core.fsmonitor=false`. `BASE` is the commit T001 records. `TSX` is `--import ./.skilled/skills/system-spec-kit/node_modules/tsx/dist/loader.mjs`, so `node TSX <file>` runs a TypeScript probe.
- `TC` is `npm run typecheck` in `ADV`, which must exit 0. `VX <file>` is `env -u AI_SESSION_CHILD npx vitest run <file>` in `ADV`, with `<file>` relative to `ADV`. `VALL` is `env -u AI_SESSION_CHILD npx vitest run` in `ADV`, which must report 0 failed.
- `FLOOR` is `node $RAD/capture-command-routing-baseline.mjs | jq -c '.metrics.typed_recall_at_1, .metrics.false_offer, .attachedMetrics.typed, .attachedMetrics.plain.tune, .attachedMetrics.plain.holdout'`, five lines whose last is the sealed plain count, a number with no row id and no prompt text. `EVAL` is `node $RAD/capture-scorer-eval-baseline.mjs | jq -c '[.metrics.full_corpus_top1.correct,.metrics.holdout_top1.correct,.metrics.ambiguity_top1.correct,.metrics.gold_none_false_fire.value]'`. `REAL` is `node $RAD/capture-command-routing-baseline.mjs --real-embedding | jq -c '.metrics.typed_recall_at_1, .attachedMetrics.plain.tune, .attachedMetrics.plain.holdout'`, which needs the local embedder and is recorded as `embedder not live` with the error line when it refuses.
- `CA` is `$ADV/lib/command-attach.ts`, `FU` is `$ADV/lib/scorer/fusion.ts` and `DH` is `$ADV/lib/scorer/doctor-helper-handoff.ts`. `CAG` is `$ADV/tests/command-attach-guards.vitest.ts`, `CMA` is `$ADV/tests/command-meaning-anchor.vitest.ts`, `DHC` is `$ADV/tests/scorer/doctor-handoff-command.vitest.ts` and `TCO` is `$ADV/tests/scorer/typed-command-owner.vitest.ts`.
- `SINGLE(m)` is the helper `CAG` already defines, `{ action: 'route', selectionKind: 'single', targets: [{ workflowMode: m }] }`.
- `REFUSE8` is the eight prompt and command pairs: `do not run /speckit:complete yet, just explain what it does` with `/speckit:complete`, `I never want to use /create:agent again, delete the agent file` with `/create:agent`, `someone ran /speckit:save by accident, how do I undo what it wrote` with `/speckit:save`, `please do not start /deep:research, I only want a two line summary of the readme` with `/deep:research`, `what does /create:readme do?` with `/create:readme`, `do not run it, just tell me what /doctor:update would change` with `/doctor:update`, `explain /deep:review to me` with `/deep:review` and `skip /create:readme, just append one line to the existing README` with `/create:readme`.
- `REQUEST6` is the six pairs: `run /speckit:complete for the rate limiter` with `/speckit:complete`, `/create:agent security-reviewer` with `/create:agent`, `don't forget to run /speckit:save` with `/speckit:save`, `explain the diff then run /speckit:save` with `/speckit:save`, `use /speckit:plan, not /speckit:complete` with `/speckit:plan` and `I ran /speckit:plan yesterday, now run /speckit:implement` with `/speckit:implement`.
- `QUESTION2` is the two pairs a yes or no question makes: `is /speckit:complete overkill for a two line fix?` with `/speckit:complete` and `should I use /deep:research for this or just read the two files myself?` with `/deep:research`. Both return a command today (`$PL/verify-fix-probe.before.txt`).
- `CONTROL5` is the five requests that hold a refusal word or a question word and still ask for the command: `dont guess, run /speckit:plan` with `/speckit:plan`, `never mind just run /speckit:save` with `/speckit:save`, `not sure, use /create:readme` with `/create:readme`, `without asking, run /speckit:complete` with `/speckit:complete` and `can you run /speckit:plan?` with `/speckit:plan`.
- `FIXP` is `node $PL/probe-offers.mjs --file $PL/verify-fix-prompts.json`, the offer probe over the 18 prompts the plan verification added.

Rules for every task:
- Each task is one change to the files it names. A task that names a module and its test writes the test case first, runs it and sees it fail for the reason the task names, then makes the change and sees it pass. Its verify names both runs.
- Re-read every file a task names before the first edit. When a line, string or name the task quotes is not in the file, change nothing and mark the task `[B]` with the line found in its place.
- No task reads or prints the prompt text of a row whose `split` is `holdout`, and no task opens `command-prompts.jsonl` except through `jq 'del(.prompt)'`.
- No worker runs a build, the full suite, a daemon or a model session, and no worker writes under the home folder.
- No code comment may name a spec path, a phase number, a task id, a finding id, an ADR or a REQ id. State the durable reason instead. T015 checks it.
- Do not edit `AGENTS.md`, another phase folder, any `package.json`, any routing corpus, any committed baseline, `lib/render.ts`, `handlers/advisor-recommend.ts` or the OpenCode plugin. Add no dependency.
- A code edit routes through `sk-code` before the first write.
- Run Vitest with `env -u AI_SESSION_CHILD`, because a dispatched worker inherits `AI_SESSION_CHILD=1`.
- A row written with `goal.cjs packet-log` is cut by that command: the item at 200 characters, the state at 40 and the evidence at 400, with `...` in place of the rest. Keep each cell inside its limit and write a second row rather than a longer one. After the command, `rg -c -e '\.\.\. \|$'` over the parent `goal.md` must print the count it printed before the command.
- When a verify prints something other than the expected output, do not change code or a word list to match it. Mark the task `[B]` with the printed line.

Worker lanes. Lane A owns `CA` and `CAG`. Lane B owns `FU`, `CMA`, `DHC` and `TCO`. Lane C owns `DH`. Lane A runs T003 to T006 in order. Lane B runs T007, T008, T017, T018, T009 and T010 in that order and starts T008 only after T003 is verified, because T008 imports the function T003 adds. Lane C runs T011 after T010. `[P]` marks only the first task of lane A and of lane B, which may start side by side. Every other task waits for the task before it in its lane.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
<!-- FILL: Replace the sample tasks with the real setup steps. Each task names a file and a verify command. GOOD: T001 Confirm `logs/archive/` holds 10 archives. Verify: `ls logs/archive | wc -l` prints 10. WEAK: T001 Set up the project. -->

- [ ] T001 [C] Record the before numbers (`$SP/before.txt`). Run `G rev-parse --short HEAD`, `G status --porcelain -- $ADV/lib $ADV/tests`, `npm run build` in `ADV`, `TC`, `VALL`, `FLOOR`, `EVAL` and `REAL`, and write each command with its last output lines or its exit code into `before.txt`. When a gate is red, stop and mark the phase `[B]` with that line. Verify: the `status` prints nothing, the build and `TC` exit 0, `VALL` reports 0 failed, `FLOOR` prints typed recall `correct` at least 24 of 44, false offers `count` 0 of 35, typed `combined` 44 of 44 and a fifth line for the sealed plain rows whose `total` is 44, and `wc -l < $SP/before.txt` prints at least 10.
- [ ] T002 [C] Record the reproductions (`$SP/repro-before.txt`). Run `node $PL/probe-offers.mjs` and `node TSX $PL/probe-doctor-cue.mts` after the build and write both outputs. Verify: `rg -c 'command=/' $SP/repro-before.txt` prints 26, `rg -c -F 'command=/speckit:complete ' $SP/repro-before.txt` prints 3, `rg -c -F 'command=/create:readme ' $SP/repro-before.txt` prints 6, `rg -c -F 'command=/doctor:' $SP/repro-before.txt` prints 9 and `rg -c -F 'score=8.361' $SP/repro-before.txt` prints 1. When a count differs, the advisor changed since planning: record the new counts, do not stop, and restate the T014 expectations from them. Then run `FIXP > $SP/repro-fix-before.txt`. Verify: `rg -c 'command=/' $SP/repro-fix-before.txt` prints 19, `rg -c -F 'command=/speckit:complete ' $SP/repro-fix-before.txt` prints 3, `rg -c -F 'command=/deep:research ' $SP/repro-fix-before.txt` prints 1, `rg -c -F 'command=/speckit:plan ' $SP/repro-fix-before.txt` prints 3 and `rg -c -F 'command=/create:readme ' $SP/repro-fix-before.txt` prints 4, the counts in `$PL/verify-fix-probe.before.txt`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
<!-- FILL: Write one implementation task per file change. Add a `Verify:` line with the command and its expected output. GOOD: T002 Add the `--keep <n>` branch. Verify: `--keep 3` leaves 3 archives. WEAK: T002 Implement the feature. -->

### Lane A: the attach module
- [ ] T003 [P] Add the mention reader `commandOnlyMentioned` (`CA`, `CAG`). Before any edit run `node $PL/probe-mention-leads.mjs | tail -1` and see `RESULT: 24 of 24 agree`, which proves the pattern sources below on every case this task names, and run `node $PL/probe-mention-leads-loose.mjs` and see four lines that start `loose reading returns true`, which is the reading this task must not write. Test first: in `CAG`, add `describe('a command the prompt only mentions')` with `it.each(REFUSE8)('reads %s as a mention of %s', ...)` expecting `commandOnlyMentioned(prompt, command)` to be `true`, `it.each(QUESTION2)('reads the question %s as a mention of %s', ...)` expecting `true`, `it.each(REQUEST6)('reads %s as a request for %s', ...)` expecting `false`, `it.each(CONTROL5)('reads %s as a request for %s beside a refusal word', ...)` expecting `false`, `it('reads each command of a two-command prompt on its own')` expecting `commandOnlyMentioned('use /speckit:plan, not /speckit:complete', '/speckit:complete')` to be `true`, `it('reads a curly apostrophe as a straight one')` expecting `commandOnlyMentioned('don’t run /speckit:save', '/speckit:save')` to be `true`, and `it('does not read a longer command name as the shorter one')` expecting `commandOnlyMentioned('do not run /create:sk-skill-parent', '/create:sk-skill')` to be `false`. Import `commandOnlyMentioned` beside `isNoEditRequest`. Run `VX tests/command-attach-guards.vitest.ts` and see the file fail on the missing export. Then in `CA`, below `isNoEditRequest`, add two constants, two exported lists and the function. Copy the four pattern values character for character from `$PL/probe-mention-leads.mjs`, where they are named `USE`, `GAP`, `COMMAND_DECLINE_LEADS` and `COMMAND_ASK_LEADS`, and name the first two `COMMAND_USE_VERB` and `COMMAND_GAP_WORDS`. `COMMAND_USE_VERB` is the string `(?:run|start|use|invoke|launch|execute|call|trigger|open|rerun|re-run|kick off)`. `COMMAND_GAP_WORDS` is the string `(?:[a-z']+ ){0,2}`: a gap word is one or more of the letters a to z and the apostrophe followed by one space, so a gap never crosses a comma, a digit, a slash or any other punctuation. Do not write `\S+` or `\w+` for a gap word. `COMMAND_DECLINE_LEADS` holds two pattern sources. The first is `(?:do not|don't|dont|never|not|won't|wont|no longer|cannot|can't) `, then the lookahead `(?!(?:forget|hesitate|fail|mind)\b)`, then `COMMAND_GAP_WORDS`, then `COMMAND_USE_VERB`, then one space, then `COMMAND_GAP_WORDS`. The second is the bare lead `(?:skip|skipping|without|instead of|rather than|avoid|not) ` followed by at most two gap words of which none is a use verb, written `(?:(?!USE\b)[a-z']+ ){0,2}` with `COMMAND_USE_VERB` in the place of `USE`. `COMMAND_ASK_LEADS` holds three pattern sources. The first is `(?:what does|what is|what's|what would|what will|what did|how does|how did|why does|why did|explain|describe|tell me what|tell me how|tell me about|tell me why|difference between|differ from|differs from|different from|undo what|ran|already ran|was running) (?:the )?(?:command )?`. The second is `(?:should i|should we|do i need to|when would i) `, then `COMMAND_USE_VERB`, then ` (?:the )?(?:command )?`. The third is `(?:is|does|can|will|would) `, which matches only when the command follows it directly. `commandOnlyMentioned(prompt: string, command: string): boolean` lower-cases the prompt, folds `‘` and `’` to `'`, collapses whitespace runs to one space, lower-cases the command, escapes it with `escapePhrase` and returns whether, for one lead of the two lists, the pattern `(?:^|[^a-z0-9_/])` then the lead then the escaped command then `(?![a-z0-9_-])` matches the text. Give each list a comment saying a command the reader refuses or asks about is named without being asked for, that a lead must sit directly before the command so a later clause cannot refuse an earlier request, and that a gap holds plain words only so a refusal before a comma cannot swallow the request after it. Verify: the first run fails as described, then `VX tests/command-attach-guards.vitest.ts` reports 0 failed, `TC` exits 0, `rg -c "^import" $CA` prints nothing and `rg -c -F "[a-z']+ ){0,2}" $CA` prints at least 1.
- [ ] T004 Withhold a mentioned command on the typed path (`CA`, `CAG`). Test first: in `CAG`, inside `describe('typed command boundaries')`, add `it('delivers no typed command the prompt refuses')` expecting `typedCommandForTop('system-spec-kit', 'do not run /speckit:complete yet, just explain what it does')` to be `undefined`, and `it('still delivers a typed command the prompt asks for')` expecting `typedCommandForTop('system-spec-kit', 'run /speckit:complete for the rate limiter')?.command` to be `'/speckit:complete'`. Run `VX tests/command-attach-guards.vitest.ts` and see the first case return an object. Then in `CA`'s `typedCommandForTop`, after the line that returns `undefined` for an untracked command, add `if (commandOnlyMentioned(prompt, command)) return undefined;`. Verify: the first run fails as described, then `VX tests/command-attach-guards.vitest.ts` reports 0 failed and `TC` exits 0.
- [ ] T005 Withhold a mentioned command on the hub attach path (`CA`, `CAG`). Test first: in `CAG`, inside `describe('a command the prompt only mentions')`, add `it.each(['what does /create:readme do?', 'skip /create:readme, just append one line to the existing README'])('offers no hub command for %s', ...)` expecting `attachCommand('sk-doc', SINGLE('sk-create-readme'), prompt)` to be `undefined`, `it('offers no deep-loop command the prompt refuses')` expecting `attachCommand('system-deep-loop', SINGLE(mode), 'please do not start /deep:research, I only want a two line summary of the readme')` to be `undefined`, where `mode` is the key of `MODE_COMMANDS['system-deep-loop']` whose value is `/deep:research`, and `it('still offers the hub command a plain request routes to')` expecting `attachCommand('sk-doc', SINGLE('sk-create-readme'), 'write a readme for the doctor scripts folder')` to be `'/create:readme'`. Run the file and see the three refusal cases return a command. Then in `CA`'s `attachCommand`, after the two own-key lookups and before the deep-loop block, add `if (commandOnlyMentioned(prompt, commands[workflowMode])) return undefined;` with a comment saying a route that picked the mode because the prompt named its command must not offer a command the reader refused or asked about. Verify: the first run fails as described, then `VX tests/command-attach-guards.vitest.ts` and `VX tests/command-attach.vitest.ts` report 0 failed and `TC` exits 0.
- [ ] T006 Withhold a creation command from a small in-place edit (`CA`, `CAG`). Test first: in `CAG`, add `describe('command attach on a small edit')` with `it.each(['update the README typo in line 3', 'fix the typo in the README', 'correct the spelling in the hooks readme', 'fix the broken link in the install guide readme'])('offers no creation command for %s', ...)` expecting `attachCommand('sk-doc', SINGLE('sk-create-readme'), prompt)` to be `undefined`, `it.each(['write a readme for the doctor scripts folder', 'create a readme for the payments module, check it for typos when done'])('still offers the creation command for %s', ...)` expecting `'/create:readme'`, and `it('leaves a command outside the create namespace alone')` expecting `attachCommand('system-deep-loop', SINGLE(mode), 'do a thorough deep review of the typo handling')` to be `'/deep:review'`, where `mode` is the key whose value is `/deep:review`. Run the file and see the four small-edit cases return `/create:readme`. Then in `CA`, below `DEPTH_WORDING`, add `export const SMALL_EDIT_WORDING: readonly string[]` holding `typo`, `typos`, `spelling`, `misspelled`, `misspelling`, `grammar`, `punctuation`, `wording`, `broken link`, `dead link`, `one line` and `single line`, with a comment saying a creation workflow scaffolds, reviews and validates a whole document, which is the wrong size for a correction inside one. Build `SMALL_EDIT_REQUEST` from it as `DEPTH_REQUEST` is built, with `line \\d+` as one more alternative, and `CREATION_REQUEST` as `/\b(?:create|write|author|draft|scaffold|generate|make|new)\b/`. In `attachCommand`, after the mention gate, add `if (commands[workflowMode].startsWith('/create:') && SMALL_EDIT_REQUEST.test(prompt.toLowerCase()) && !CREATION_REQUEST.test(prompt.toLowerCase())) return undefined;`. Verify: the first run fails as described, then `VX tests/command-attach-guards.vitest.ts`, `VX tests/command-attach.vitest.ts` and `VX tests/command-brief-golden.vitest.ts` report 0 failed and `TC` exits 0.

### Lane B: the scorer
- [ ] T007 [P] Hold a meaning-passed command to the uncertainty bar (`FU`, `CMA`). Test first: in `CMA`, inside `describe('requireCommandPhraseAnchor')`, copy the case that proves a command passes on meaning, name the copy `leaves a meaning match unpassed when its uncertainty is above the bar`, give its command row `uncertainty: 0.42`, pass `0.35` as a new fifth argument and expect the returned row to have `passes_threshold` `false`, its `confidence` unchanged and the `meaningPassed` set empty. Add `it('passes a meaning match at the bar')` with `uncertainty: 0.35` expecting `passes_threshold` `true`. Run `VX tests/command-meaning-anchor.vitest.ts` and see the first case return `passes_threshold` `true`. Then in `FU`'s `requireCommandPhraseAnchor`, add a fifth parameter `uncertaintyThreshold: number = DEFAULT_UNCERTAINTY_THRESHOLD`, add `&& recommendation.uncertainty <= uncertaintyThreshold` to the meaning condition before `meaningEligible(...)`, and extend the comment above the lift: a row the hooks would drop for its uncertainty must not be reported as passing, or the direct CLI call shows a head no hook renders. In `scoreAdvisorPrompt`, pass `options.uncertaintyThreshold ?? DEFAULT_UNCERTAINTY_THRESHOLD` as the fifth argument. Verify: the first run fails as described, then `VX tests/command-meaning-anchor.vitest.ts` reports 0 failed and `TC` exits 0.
- [ ] T008 Add the gate that stops a mentioned command's own row (`FU`, `CMA`). Start after T003 is verified. This task adds the function `withholdMentionedCommands` and nothing else. T017 and T018 change the two functions that use the reader. Test first: in `CMA`, add `describe('withholdMentionedCommands')` with a passing command row `command-speckit-complete` and a passing skill row `system-spec-kit`, built with the row helper the neighbouring cases use. Expect `withholdMentionedCommands(rows, 'do not run /speckit:complete yet, just explain what it does')` to return the command row with `passes_threshold` `false` and the skill row unchanged, expect the same call with `run /speckit:complete for the rate limiter` to return both rows unchanged, expect the same call with `is /speckit:complete overkill for a two line fix?` to return the command row with `passes_threshold` `false`, and expect a passing row `command-doctor-env` with the prompt `do not run /doctor:env on this machine` to stop passing, which proves a command with a subcommand is matched by its base. Run `VX tests/command-meaning-anchor.vitest.ts` and see it fail on the missing export. Then in `FU`, add `commandOnlyMentioned` and `commandRowFor` to the import from `'../command-attach.js'`, and add `export function withholdMentionedCommands(ranked: readonly AdvisorScoredRecommendation[], prompt: string): AdvisorScoredRecommendation[]` directly above `rankTypedCommandOwnerFirst`. It maps each passing `kind === 'command'` row whose `commandRowFor(row.skill)?.command.split(' ')[0]` satisfies `commandOnlyMentioned(prompt, command)` to `{ ...row, passes_threshold: false }` and returns every other row as it is. Give it a comment saying a command row passes on its typed name, so a prompt that names the command to refuse it would otherwise pass that row. Verify: the first run fails as described, then `VX tests/command-meaning-anchor.vitest.ts` reports 0 failed, `rg -c "^export function withholdMentionedCommands" $FU` prints 1 and `TC` exits 0.
- [ ] T017 Leave a refused typed command's owner where it ranked (`FU`, `TCO`). After T008. This task changes the function `rankTypedCommandOwnerFirst` and nothing else. Test first: in `TCO`, inside `describe('a typed command without a scorer row leads through its owner')`, add `it('keeps the order when the prompt refuses the typed command')` with `const ranked = [recommendation('sk-code'), recommendation('sk-doc'), recommendation('sk-prompt')];` expecting `rankedSkills(ranked, 'do not run /create:goal')` to equal `['sk-code', 'sk-doc', 'sk-prompt']`. Run `VX tests/scorer/typed-command-owner.vitest.ts` and see the case fail with `['sk-doc', 'sk-code', 'sk-prompt']`, the order the planning probe printed. Then in `FU`'s `rankTypedCommandOwnerFirst`, directly after the line `if (command === undefined || !Object.hasOwn(TRACKED_COMMANDS, command)) return [...ranked];`, add `if (commandOnlyMentioned(promptLower, command)) return [...ranked];` with a comment saying a command the reader refused must not pull its owner to the front. Verify: the first run fails as described, then `VX tests/scorer/typed-command-owner.vitest.ts` reports 0 failed, `rg -c -F 'if (commandOnlyMentioned(promptLower, command)) return [...ranked];' $FU` prints 1 and `TC` exits 0.
- [ ] T018 Call the mention gate from the scoring function (`FU`). After T017. This task adds one line to the function `scoreAdvisorPrompt` and nothing else. In `scoreAdvisorPrompt`, find the statement that starts `ranked = applyDoctorHelperHandoff(ranked, {` and ends with `});`, and add on the line directly after that `});` the statement `ranked = withholdMentionedCommands(ranked, prompt);`. The next line stays `ranked = rankTypedCommandOwnerFirst(ranked, promptLower);`. Verify: `rg -c -F 'ranked = withholdMentionedCommands(ranked, prompt);' $FU` prints 1, `rg -A1 -F 'ranked = withholdMentionedCommands(ranked, prompt);' $FU | rg -c -F 'ranked = rankTypedCommandOwnerFirst(ranked, promptLower);'` prints 1, `VX tests/command-meaning-anchor.vitest.ts` and `VX tests/scorer/typed-command-owner.vitest.ts` report 0 failed and `TC` exits 0. The coordinator's probe in T014 is the check that the gate runs on a real prompt.
- [ ] T009 Stop a command that writes from passing on a no-edit request (`FU`, `CMA`). After T018. Test first: in `CMA`, add `describe('withholdWritingCommandsOnNoEdit')` with three passing command rows, `command-doctor-speckit` (class `add-only`), `command-speckit-complete` (class `mutates` or no class) and `command-doctor-env` (class `read-only`), and one passing skill row. Expect `withholdWritingCommandsOnNoEdit(rows, 'the trigger index lookup returns nothing for my packet, do not change anything')` to leave only `command-doctor-env` and the skill row passing, and expect the same rows with `the trigger index lookup returns nothing for my packet` to come back unchanged. Assert in the case that `commandRowFor('command-doctor-speckit')?.mutating` is `'add-only'` and `commandRowFor('command-doctor-env')?.mutating` is `'read-only'`, so a regenerated table that changes a class fails here by name. Run the file and see it fail on the missing export. Then in `FU`, add `export function withholdWritingCommandsOnNoEdit(ranked: readonly AdvisorScoredRecommendation[], promptLower: string): AdvisorScoredRecommendation[]`, which returns `[...ranked]` when `isNoEditRequest(promptLower)` is false and otherwise maps each passing `kind === 'command'` row whose `commandRowFor(row.skill)?.mutating !== 'read-only'` to `{ ...row, passes_threshold: false }`, with a comment saying a reader who ruled out a change must not be handed a command that writes, whichever path chose it, and a command that only reads is still the answer. In `scoreAdvisorPrompt`, add the statement `ranked = withholdWritingCommandsOnNoEdit(ranked, promptLower);` on the line directly after `ranked = withholdMentionedCommands(ranked, prompt);`, which T018 added. The gate reads `isNoEditRequest` as it is, so a no-change wording that pattern does not hold, such as `leave every file as it is`, is not gated by this task. Verify: the first run fails as described, then `VX tests/command-meaning-anchor.vitest.ts`, `VX tests/scorer/doctor-ordering.vitest.ts` and `VX tests/doctor-routing-slice.vitest.ts` report 0 failed and `TC` exits 0.
- [ ] T010 Stop a weak cue from lowering the hand-off bar (`FU`, `DHC`). Test first: in `DHC`, with the scoring helper the existing cases use and no passing skill, add `it.each(['the environment variable for the database url is missing in production', 'the install step in our dockerfile is broken, the overlay filesystem is stale'])('hands off no doctor command for the app problem %s', ...)` expecting no passing row whose id starts `command-doctor-`, and `it.each([['AGENTS.md is missing the shipped sections', 'command-doctor-agents-md-check'], ['the runtime mirrors are out of sync with .skilled', 'command-doctor-runtime-mirrors']])('still hands off %s', ...)` expecting that id to pass. When the second id differs from the probe line `first=/doctor:runtime-mirrors`, take the id `runnableDoctorBridgeId` returns for it. Run `VX tests/scorer/doctor-handoff-command.vitest.ts` and see the two app-problem cases pass `command-doctor-env` and `command-doctor-overlay-status`. Then in `FU`'s `applyDoctorHelperHandoff`, replace `if (match && cue === null && match.score < DOCTOR_HELPER_UNCUED_MIN_SCORE) return [...ranked];` with `if (match && cue !== 'strong' && match.score < DOCTOR_HELPER_UNCUED_MIN_SCORE) return [...ranked];` and put above it a comment saying a weak cue is a bare word ordinary work also uses, so it earns no lower bar than a prompt with no cue. Verify: the first run fails as described, then `VX tests/scorer/doctor-handoff-command.vitest.ts`, `VX tests/doctor-helper-handoff.vitest.ts`, `VX tests/doctor-routing-slice.vitest.ts` and `VX tests/command-routing-slice.vitest.ts` report 0 failed and `TC` exits 0. When a slice test fails because a tune row lost its doctor command, mark the task `[B]` with the row id and restore the line.

### Lane C: the cue rule in words
- [ ] T011 State the weak-cue rule in the hand-off module header (`DH`). After T010. In the numbered comment block at the top of the file, replace the sentence `With no skill passing, a strong ranker match stands in for the cue.` with `With no skill passing, a weak cue or no cue needs a strong ranker match, and only a strong cue hands off on the lower score.` Verify: `rg -c "only a strong cue hands off on the lower score" $DH` prints 1, `rg -c "stands in for the cue" $DH` prints nothing and `TC` exits 0.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
<!-- FILL: Write one verification task per requirement. Each one runs a command. GOOD: T003 Run both invocations. Verify: `ls logs/archive | wc -l` prints 3 and 10. WEAK: T003 Test everything. -->

- [ ] T012 [C] Rebuild and run every suite (`$SP/after.txt`). Run `npm run build` in `ADV`, `TC`, `VALL` and `REAL`, and write each command with its result lines into `after.txt`. Verify: the build and `TC` exit 0, `VALL` reports 0 failed with more passed tests than `$SP/before.txt`, and the `REAL` lines are written beside their `before.txt` lines with the difference stated as a count, or as `embedder not live`. A lower real count does not block this task. When the `combined` count of the real sealed plain line is lower than its before line, write `DROP: real plain holdout <before> to <after>`, then find the cause in the working tree and write it: change the T010 line back to `cue === null`, rebuild, run `REAL` and write `cause: T010` when the count returns. When it does not return, put the T010 line back, remove T007's `&& recommendation.uncertainty <= uncertaintyThreshold`, rebuild, run `REAL` and write `cause: T007` when the count returns and `cause: unknown` otherwise. Put every line back, rebuild, and see `G diff --stat -- $FU` print the same line it printed before the check. `rg -c -e '^DROP: ' $SP/after.txt` and `rg -c -e '^cause: (T007|T010|unknown)$' $SP/after.txt` print the same count, or both print nothing.
- [ ] T013 [C] Hold every floor equal (`$SP/after.txt`). Run `FLOOR` and `EVAL`, write each beside its `before.txt` line and end the file with `RESULT: every floor equals its before line` only when each line does. When one differs, write the difference, mark this task `[B]` and do not tune a word list to restore it. The fifth `FLOOR` line is the sealed plain count under the fixture regime, so a gate that lowers reach on requests nobody tuned for blocks here. Verify: each of the five `FLOOR` lines and the `EVAL` line equals its `before.txt` line character for character, and `rg -c "^RESULT: every floor equals its before line$" $SP/after.txt` prints 1.
- [ ] T014 [C] Rerun the reproductions (`$SP/repro-after.txt`). Run both probes after the build, as T002 did. Verify: `rg -c 'command=/' $SP/repro-after.txt` prints 8, `rg -c -F 'command=/speckit:complete ' $SP/repro-after.txt` prints 1, `rg -c -F 'command=/create:readme ' $SP/repro-after.txt` prints 2, `rg -c -F 'command=/create:agent ' $SP/repro-after.txt` prints 2, `rg -c -F 'command=/doctor:' $SP/repro-after.txt` prints 2, `rg -c -e 'command=/(speckit:save|deep:research|deep:review|speckit:plan|doctor:update|doctor:env|doctor:overlay|doctor:speckit|doctor:deep-loop|doctor:sk-skill)' $SP/repro-after.txt` prints nothing and `rg -A1 -F 'PROMPT: the environment variable for the database url' $SP/repro-after.txt | rg -c -F '(no recommendation)'` prints 1. The two `/doctor:` lines left are `/doctor:mcp debug` and `/doctor:helper`, which the spec leaves out of scope by name. Of the two `/create:readme` lines left, one is the head of `write a readme for the doctor scripts folder` and the other is the partner row of `please do not start /deep:research, I only want a two line summary of the readme`, which this probe prints because it sends the every-row request. No phase changes that request shape for the direct CLI call, so the count is 2 whether or not phase 021 has landed. Then run `FIXP > $SP/repro-fix-after.txt`. Verify: `rg -c -F 'command=/deep:research ' $SP/repro-fix-after.txt` prints nothing, `rg -c -F 'command=/speckit:complete ' $SP/repro-fix-after.txt` prints 1, `rg -c -F 'command=/speckit:plan ' $SP/repro-fix-after.txt` prints 2, `rg -c -F 'command=/speckit:save ' $SP/repro-fix-after.txt` prints 1 and `rg -c -F 'command=/create:readme ' $SP/repro-fix-after.txt` prints 4. The two question prompts lose their command, the five controls keep theirs, and the three README edits that hold no correction word keep `/create:readme`, which the spec leaves out of scope. Every other line of that file is recorded as found and blocks nothing.
- [ ] T015 [C] Check the boundaries (`$SP/boundaries.txt`). Write each command below with its output or exit code into `boundaries.txt`. Verify: `G diff --quiet BASE -- AGENTS.md` exits 0, `G diff --stat BASE -- '*package.json' '*package-lock.json'` prints nothing, `G diff BASE -U0 -- .skilled .opencode | rg "^\+.*(//|#|\*).*(specs/|REQ-0|ADR-0|T0[0-9]{2}|phase [0-9]|A-[0-9]|B-[0-9])"` prints nothing and `G diff --name-only BASE -- .skilled .opencode` names only `CA`, `FU`, `DH`, `CAG`, `CMA`, `DHC` and `TCO`.
- [ ] T016 [C] Write the results and close the phase (`$PH/implementation-summary.md`). Copy `$SP/implementation-summary.scaffold.md` to `$PH/implementation-summary.md` and fill it: `BASE`, the seven files, the before and after probe counts of both probes, any `DROP` line with its cause, the `REAL` before and after lines and the two cases left out of scope with their ranker scores. Mark each row of `acceptance-criteria.md` with the evidence observed, set the status in `spec.md` and the phase 20 row of `../spec.md` to `Complete`, append one row to the parent goal log with `node .skilled/hooks/goal/bin/goal.cjs packet-log specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build "<item> | <state> | <evidence>" --workspace "$PWD"`, then run `node .skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs --folder $PH --apply`. Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh $PH --strict` prints `RESULT: PASSED` and `rg -c "\| Unmet \|" $PH/acceptance-criteria.md` prints nothing.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
<!-- FILL: Keep the three completion lines and add the one artifact that proves the phase is done. GOOD: `--keep 3` leaves 3 archives and the suite passes. WEAK: Work is complete. -->

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] `scratch/after.txt` ends with `RESULT: every floor equals its before line`
- [ ] `scratch/repro-after.txt` holds 8 lines with `command=/`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
<!-- FILL: Name the spec and plan files. Add the decision record when the packet has one. GOOD: Specification: `spec.md`. Plan: `plan.md`. WEAK: See the other docs. -->

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
- **Findings**: `../review/fable-alignment-2026-11-14/report-code-logic.txt` and `report-purpose-alignment.txt`
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

A `[B]` task stops its lane. The coordinator records the printed line in the parent goal log and decides, and no word list or score is changed to make a verify pass.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation
<!-- FILL: Write one check per setup fact, each with a command. GOOD: CHK-001 [P0] The start commit is in `goal.md` section 4. WEAK: Setup is ready. -->

- [ ] CHK-001 [P0] `$SP/before.txt` holds `BASE`, 0 failed and the five floor lines, the sealed plain count among them (T001).
- [ ] CHK-002 [P0] `$SP/repro-before.txt` holds 26 lines with `command=/` and `$SP/repro-fix-before.txt` holds 19 (T002).
- [ ] CHK-003 [P1] `rg -c "FIX ADDENDUM" $PH/plan.md` prints 1 and its table names every consumer of the changed functions.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality
<!-- FILL: Write one check per file rule. A command must answer it. GOOD: CHK-010 [P0] `bash -n scripts/rotate-logs.sh` exits 0. WEAK: Code is clean. -->

- [ ] CHK-010 [P0] `TC` exits 0 after every task.
- [ ] CHK-011 [P0] `rg -c "^import" $CA` prints nothing, so the attach module still imports nothing.
- [ ] CHK-012 [P1] No added comment names a spec path or an id (T015).
- [ ] CHK-013 [P1] Each word list is exported data with one reason comment, as `DEPTH_WORDING` is.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist
<!-- FILL: Write one check per acceptance criterion. GOOD: CHK-020 [P0] `--keep 3` leaves 3 archives. WEAK: Tests pass. -->

- [ ] CHK-020 [P0] `VALL` reports 0 failed with more passed tests than before (T012).
- [ ] CHK-021 [P0] The five floor lines and the eval line equal their before lines, so the sealed plain count under the fixture regime did not drop (T013).
- [ ] CHK-022 [P0] Each of T003 to T010 and T017 recorded a failing first run for the reason its line names.
- [ ] CHK-023 [P1] The six request prompts and the five controls keep their command (T003, T014).
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS
<!-- FILL: Write this section when the packet fixes a reported finding. Delete it otherwise. GOOD: CHK-FIX-001 [P0] Every finding names one class. WEAK: All findings handled. -->

- [ ] CHK-FIX-001 [P0] Finding classes: A-8, B-9 first half and B-3 are `class-of-bug` (every path that attaches a command), A-4 and A-6 are `cross-consumer` (the scorer against the hooks, the phrase path against the hand-off) and A-5 is `algorithmic`.
- [ ] CHK-FIX-002 [P0] Same-class producers: `rg -n "command:" $ADV/handlers/advisor-recommend.ts $FU $CA` lists the three places a command is attached, and each is gated by T004, T005 or T018.
- [ ] CHK-FIX-003 [P0] Consumers: `rg -n "requireCommandPhraseAnchor|typedCommandForTop|attachCommand\(" $ADV --glob '*.ts' --glob '!tests/**'` lists every caller, and none passes arguments the new parameters break.
- [ ] CHK-FIX-004 [P1] The mention reader has adversarial cases: a longer command name, two commands, a curly apostrophe, `don't forget to run`, a refusal in a later clause, a refusal word before a comma, `never mind`, a yes or no question and `can you run` (T003).
- [ ] CHK-FIX-005 [P1] Matrix: three attach paths by two readings (refused, asked about) by one request control, covered by T003 to T005, T008, T017 and T018.
- [ ] CHK-FIX-006 [P1] Evidence names `BASE`: `$PH/implementation-summary.md` names the commit T001 recorded.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security
<!-- FILL: Write one check per security surface. Write `N/A` with a reason when none applies. GOOD: CHK-030 [P0] `scripts/rotate-logs.sh` reads no credential. WEAK: Security is fine. -->

- [ ] CHK-030 [P0] The command name is escaped before it enters a pattern (T003).
- [ ] CHK-031 [P1] No task reads holdout prompt text, and no probe prints a corpus prompt.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation
<!-- FILL: Write one check per document that must agree. GOOD: CHK-040 [P1] `spec.md` and `tasks.md` both name `--keep <n>`. WEAK: Docs are updated. -->

- [ ] CHK-040 [P1] `spec.md`, `tasks.md` and `acceptance-criteria.md` name the same after counts: 8, 1, 2, 2 and 2.
- [ ] CHK-041 [P1] `implementation-summary.md` names the two cases left out of scope with their scores (T016).
- [ ] CHK-042 [P2] `rg -n "no-edit|NO_EDIT_REQUEST" .skilled/skills/system-skill-advisor --glob '*.md' --glob '!changelog/**'` is read once, and a page that states a rule this phase changed is listed in `implementation-summary.md` for the changelog entry the packet close writes.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization
<!-- FILL: Write one check per file location rule. GOOD: CHK-050 [P1] Test copies live under `scratch/test/`. WEAK: Files are organized. -->

- [ ] CHK-050 [P1] Probes and their outputs live under `scratch/planning/`, and the run records under `scratch/`.
- [ ] CHK-051 [P1] `G status --short -- .skilled .opencode` names no file outside the seven this phase edits (T015).
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary
<!-- FILL: Count the boxes by priority and write the three totals. GOOD: P0 12, P1 13, P2 1. WEAK: Most items done. -->

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 0/11 |
| P1 Items | 12 | 0/12 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-11-14
<!-- /ANCHOR:summary -->

---
