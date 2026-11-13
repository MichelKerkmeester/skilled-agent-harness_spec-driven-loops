---
title: "Tasks: Phase 12: plain-offer-reach"
description: "Ordered worker-sized tasks in five waves: name the matched doctor command in the hand-off, add sk-doc paraphrase aliases, label a hub that needs a mode, pair each deep mode with a scorer anchor and a hub alias and, only when the floors stay put, anchor three create rows. Each wave ends with a recapture and a floor check."
trigger_phrases:
  - "plain offer reach tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 12: plain-offer-reach

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |
| `[C]` | Coordinator task: a decision, a revert, a live hook run or an operator step. No worker runs it |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

Every command runs from the repository root unless a task says otherwise.
- `ADV` is `.skilled/skills/system-skill-advisor/runtime`. `TC` is `npm run typecheck` in `ADV`, which must exit 0. `BLD` is `npm run build` in `ADV`, which must exit 0. `SP` is this phase's `scratch/` folder.
- `DH` is `$ADV/lib/scorer/doctor-helper-handoff.ts` and `DHT` its test `$ADV/tests/doctor-helper-handoff.vitest.ts`. `VDHT` is `npx vitest run tests/doctor-helper-handoff.vitest.ts` in `ADV`.
- `FU` is `$ADV/lib/scorer/fusion.ts`. `FHT` is `$ADV/tests/scorer/doctor-handoff-command.vitest.ts` (new) and `VFHT` is `npx vitest run tests/scorer/doctor-handoff-command.vitest.ts` in `ADV`.
- `DP` is `$ADV/scripts/routing-accuracy/doctor-prompts.jsonl`. `VDS` is `npx vitest run tests/doctor-routing-slice.vitest.ts` in `ADV`.
- `CA` is `$ADV/lib/command-attach.ts` and `CAT` its test `$ADV/tests/command-attach.vitest.ts`. `VCA` is `npx vitest run tests/command-attach.vitest.ts` in `ADV`. `DBC` is `node $ADV/scripts/command-bridges/derive-command-bridges.cjs --check | jq -r .status`, which must print `fresh`.
- `SCH` is `$ADV/schemas/advisor-tool-schemas.ts` and `VSCH` is `npx vitest run tests/schemas/advisor-tool-schemas.vitest.ts` in `ADV`. `SUB` is `$ADV/lib/subprocess.ts`.
- `AR` is `$ADV/handlers/advisor-recommend.ts` and `ARC` its test `$ADV/tests/handlers/advisor-recommend-compiled-route-option.vitest.ts`. `VARC` is `npx vitest run tests/handlers/advisor-recommend-compiled-route-option.vitest.ts` in `ADV`.
- `HFB` is `.skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts` and `HFT` its test `$ADV/tests/hooks/skill-advisor-cli-fallback-envelope.vitest.ts`. `VHFT` is `npx vitest run tests/hooks/skill-advisor-cli-fallback-envelope.vitest.ts` in `ADV`.
- `RD` is `$ADV/lib/render.ts` and `GT` is `$ADV/tests/command-brief-golden.vitest.ts`. `VGT` is `npx vitest run tests/command-brief-golden.vitest.ts tests/command-head-length.vitest.ts` in `ADV`.
- `EX` is `$ADV/lib/scorer/lanes/explicit.ts`. `VEX` is `npx vitest run tests/command-bridge-resolution-guard.vitest.ts` in `ADV`.
- `HRD` is `.skilled/skills/sk-doc/hub-router.json` and `HRL` is `.skilled/skills/system-deep-loop/hub-router.json`. `CF_DOC` is `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/007-sk-doc/fixtures/canary-cases.v1.json` and `CF_LOOP` is `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/002-system-deep-loop/fixtures/canary-cases.v1.json`.
- `MS` is `.skilled/bin/lib/compiled-routing/013-live-activation/activation` (the served manifests) and `MA` is `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/013-live-activation/activation` (their authored twins).
- `REFRESH <hub>` is three commands in order: `node .skilled/bin/compiled-route-manifest.cjs refresh --hub <hub> --skill-root .skilled/skills/<hub>`, then `cp $MS/<hub>/manifest.json $MA/<hub>/manifest.json`, then `node .skilled/bin/compiled-route-guard.cjs --json | jq .failures`, which must print `0`.
- `HUBOK <hub>` is four checks: `node .skilled/bin/compiled-route-manifest.cjs freshness --hub <hub> --skill-root .skilled/skills/<hub> | jq -r .causeCode` prints `fresh`, `cmp $MS/<hub>/manifest.json $MA/<hub>/manifest.json` prints nothing, `node .skilled/bin/compiled-route-sync.cjs --check | tail -1` prints `all 55 served copies match their authored files` and `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/<hub> | tail -1` prints a line that starts with `OK: parent-skill-check`.
- `BINT` is `node --test .skilled/bin/tests/compiled-route-*.test.cjs`, which must print `ℹ fail 0`.
- `CAP` is `$ADV/scripts/routing-accuracy/capture-command-routing-baseline.mjs`. `BASE` is `$ADV/scripts/routing-accuracy/command-routing-baseline.json`. `CORPUS` is `$ADV/scripts/routing-accuracy/command-prompts.jsonl`. `RS` is `npx vitest run tests/command-routing-slice.vitest.ts` in `ADV`.
- `RT` is a shell function that prints the compiled route of every non-holdout corpus row and every canary prompt on one hub, as `<id><TAB>{"action":...,"t":[...]}`, and never prints a prompt. Define it in the shell first: `RT() { { jq -r 'select(.split!="holdout") | [.id, .prompt] | @tsv' "$CORPUS"; jq -r '.cases[] | select(.prompt) | ["canary:" + .id, .prompt] | @tsv' "$2"; } | while IFS=$'\t' read -r id p; do printf '%s\t%s\n' "$id" "$(printf '%s' "$p" | node .skilled/bin/compiled-route.cjs --hub "$1" --prompt-stdin | jq -c '{action, t: [.targets[]? | .workflowMode]}')"; done; }`. Call it as `RT sk-doc $CF_DOC` (154 lines) or `RT system-deep-loop $CF_LOOP` (139 lines).
- `FLOOR` is `node $CAP | jq -c '.metrics.typed_recall_at_1, .metrics.false_offer'`, which must print at least `{"correct":24,"total":44}` and exactly `{"count":0,"total":35}`.
- `TYPED` is `node $CAP | jq -c '.attachedMetrics.false_offer_attached, .attachedMetrics.typed'`, which must print exactly `{"count":0,"total":35}` and the typed line in `$SP/before.txt` (`{"own":24,"attached":20,"combined":44,"total":44}` once phase 011 is committed).
- `PLAIN` is `node $CAP | jq -c '.attachedMetrics.plain.tune, .attachedMetrics.plain.holdout'`. It is a measurement, not a gate. The holdout line is a count and never a prompt.
- `EVAL` is `node $ADV/scripts/routing-accuracy/capture-scorer-eval-baseline.mjs | jq -c '[.metrics.full_corpus_top1.correct,.metrics.holdout_top1.correct,.metrics.ambiguity_top1.correct,.metrics.gold_none_false_fire.value]'`, which must print numbers no lower than `[159,50,20]` and no lower than its line in `$SP/before.txt`, with the fourth no higher than 5.
- `PY` is `python3 $ADV/tests/python/test_skill_advisor.py`, which must exit 0. `PAR` is `npx vitest run tests/parity/python-ts-parity.vitest.ts` in `ADV`, which must report 0 failed. `SUITE` is `npx vitest run` in `ADV`, whose `Test Files` and `Tests` summary lines must name no `failed` count.
- `FLOORCHECK <X>` is: run `BLD`, then `FLOOR`, `TYPED`, `PLAIN`, `EVAL`, `TC`, `PY`, `PAR`, `RS`, `VDS`, `BINT`, `GUARD` (`node .skilled/bin/compiled-route-guard.cjs --json | jq .failures`) and `SUITE`, and write into `$SP/after-<X>.txt` one line per output line, each prefixed with the shorthand name and a colon, such as `FLOOR: {"count":0,"total":35}` or `TC: exit 0`. For the test runners write the summary line. It passes when every gate above prints what it must. `$SP/before.txt` uses the same format.

Rules for every task:
- Each task is one change to the files it names. A task that names a module and its test adds the behaviour and the cases that pin it.
- No task reads or prints holdout prompt text. A script filters on `split` before it uses a prompt and prints row ids only. Tune and none rows may be read.
- No code comment may name a spec path, a phase number, a task id, an ADR or a REQ id. State the durable reason instead. T032 checks it.
- No task writes to the home folder, installs anything, adds a dependency, edits `AGENTS.md`, edits a file under `.skilled/commands/create/`, edits a `ROUTER.md` or edits a canary fixture.
- A task that edits a hub `hub-router.json` ends with `REFRESH <hub>` and `HUBOK <hub>` in the same task.
- The brief head keeps the phase 005 form. The `(needs a mode)` label is the one addition, and `GT` is re-pinned in the same task as the renderer.
- A `.md` edit routes through `sk-doc` and a code edit through `sk-code` before the first write. Every task re-reads its anchor text first, because phase 011 edited the same files.

Worker waves. Tasks in one wave touch different files and can run in parallel. Each task owns the files in parentheses. A wave starts only after the previous wave's last task printed its expected output.
- Wave 0: T001 (`$SP/before.txt`), T002 (`$SP/routes-*-before.tsv`), T003 (`$SP/plain-before.json`). Read-only for the repository.
- Gate: no task from wave A1 on starts before the coordinator confirms that phase 011 is committed, because it edits `CA`, `FU`, `AR`, `SCH`, `CAP` and `BASE`.
- Wave A1: T004 (`DH`, `DHT`).
- Wave A2: T005 (`FU`, `FHT`).
- Wave A3: T006 (`DP`), T007 (the doctor feature catalog page).
- Wave A4: T008 (`BASE`). Wave A5: T009 (`$SP/after-A.txt`).
- Wave B1: T010 (`HRD`, both `sk-doc` manifests). Wave B2: T011 (`BASE`). Wave B3: T012 (`$SP/after-B.txt`).
- Wave C1: T013 (`CA`, `CAT`), T014 (`SCH`), T015 (`SUB`).
- Wave C2: T016 (`AR`, `ARC`), T017 (`RD`, `GT`).
- Wave C3: T018 (`HFB`, `HFT`), T019 (the hook guide). Wave C4: T020 (`$SP/after-C.txt`).
- Wave D1: T021 (`EX`), T022 (`HRL`, both deep-loop manifests). Wave D2: T023 (`BASE`). Wave D3: T024 (`$SP/after-D.txt`). Wave D4: T025 [C].
- Wave E1: T026 (`EX`). Wave E2: T027 (`BASE`). Wave E3: T028 (`$SP/after-E.txt`). Wave E4: T029 [C].
- Verification, one at a time: T030, T031, T032, T033 [C], T034.

Expected plain tune line (`.attachedMetrics.plain.tune`) per wave. Only the floors are a hard gate:

| After | own | attached | combined |
|-------|-----|----------|----------|
| Wave 0 | 2 | 7 | 9 |
| A | 7 | 7 | 14 |
| B | 7 | 10 | 17 |
| C | 7 | 10 | 17 |
| D | 7 | 13 | 20 |
| E | 8 | 15 | 23 |
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Record the before numbers (`$SP/before.txt`). Run `BLD` only if `node $CAP` refuses a stale build, then run `FLOOR`, `TYPED`, `PLAIN`, `EVAL`, `TC`, `PY`, `PAR`, `RS`, `VDS`, `VCA`, `VGT`, `VDHT`, `VARC`, `VHFT`, `VSCH`, `VEX`, `DBC`, `BINT`, `SUITE`, `node .skilled/bin/compiled-route-guard.cjs --json | jq .failures`, `node .skilled/bin/compiled-route-sync.cjs --check | tail -1` and `HUBOK sk-doc` and `HUBOK system-deep-loop`, and write them into `before.txt` in the `FLOORCHECK` line format. Verify: `FLOOR` prints `{"correct":24,"total":44}` and `{"count":0,"total":35}`, `TYPED` prints `{"count":0,"total":35}` and a typed line, `PLAIN` prints `{"own":2,"attached":7,"combined":9,"total":45}` first, `EVAL` prints numbers no lower than `[159,50,20]` with a fourth no higher than 5, `TC` and `PY` exit 0, the guard prints `0` and `wc -l < $SP/before.txt` prints at least 25. When a gate is red here, stop and mark the phase `[B]` with that line, because a red before number cannot be held. When `SUITE` names failed files, list them in `before.txt`, and from then on the `SUITE` gate is "no failed file outside that list".
- [x] T002 Record every compiled route before any hub edit (`$SP/routes-sk-doc-before.tsv`, `$SP/routes-deep-loop-before.tsv`). Define `RT` and run `RT sk-doc $CF_DOC > $SP/routes-sk-doc-before.tsv` and `RT system-deep-loop $CF_LOOP > $SP/routes-deep-loop-before.tsv`. Verify: `wc -l < $SP/routes-sk-doc-before.tsv` prints 154, `wc -l < $SP/routes-deep-loop-before.tsv` prints 139, `rg -c 'holdout' $SP/routes-*-before.tsv` prints nothing or 0 for both and `rg -n '^nm-system-deep-loop-01' $SP/routes-deep-loop-before.tsv` prints `nm-system-deep-loop-01	{"action":"route","t":["research"]}`.
- [x] T003 Record each plain tune row's state (`$SP/plain-before.json`): run `node $CAP | jq '.attachedMetrics.attachedRows as $a | [.rows | to_entries[] | select(.key | test("plain-tune")) | {id: .key, expected: .value.expected_command, top: .value.top, top1: .value.top1, top3: .value.top3, attached: ($a[.key] // null)}]' > $SP/plain-before.json`. Verify: `jq 'length' $SP/plain-before.json` prints 45, `jq '[.[] | select(.top1)] | length' $SP/plain-before.json` prints 2 and `jq -r '.[] | select(.id=="cmd-doctor-ci-plain-tune-01") | .top' $SP/plain-before.json` prints `command-doctor-helper`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Wave A1: the doctor hand-off module
- [x] T004 Return the ranked runnable, add the gerund cue and add a repair request cue (`DH`, `DHT`). In `DH`: (1) in `interface HelperCandidate` add `readonly runnable?: string;` after `readonly command: string;`. (2) In `interface DoctorProblemMatch` add `readonly runnable: string;` after `readonly command: string;`, with the doc comment `` /** The command with its subcommand, such as `/doctor:agents-md check`. */ ``. (3) In `matchDoctorProblem`, change the returned object to `{ command: first.command, runnable: typeof first.runnable === 'string' && first.runnable !== '' ? first.runnable : first.command, score: first.score }`. (4) In `STRONG_PROBLEM_CUE`, add the line `  '\\bstopped converg\\w*\\b',` right after the line that starts `  '\\bnever (?:converg`. (5) After the `WEAK_PROBLEM_CUE` declaration add `const GENERIC_REPAIR_CUE = /\b(?:repair path|i have a problem)\b/i;` with the comment: a request for a repair route that names no problem the ranker knows still belongs to /doctor:helper, which lists the routes and their reasons, and the two phrases are exact so ordinary work requests never carry them. (6) After `doctorProblemCue` add `export function genericRepairCue(prompt: string): boolean { return GENERIC_REPAIR_CUE.test(prompt); }` with the doc comment `/** True when the prompt asks for a repair route without naming the problem. */`. (7) In the module header, replace `and if it does the advisor offers` and the line after it, `/doctor:helper, which then names the command.`, with `and if it does the advisor offers the command the ranker named, or` and `/doctor:helper when that command asks before it runs.`. In `DHT` add cases: `doctorProblemCue('my research loop stopped converging and I cannot see why')` is `'strong'`, `matchDoctorProblem('confirm the AGENTS.md sections in this repo have not drifted', WORKSPACE)?.runnable` is `'/doctor:agents-md check'`, `matchDoctorProblem('show me every GitHub Actions workflow and whether each is enabled', WORKSPACE)?.runnable` is `'/doctor:ci report'`, `genericRepairCue('I have a problem and want the right repair path suggested with reasons')` is true and `genericRepairCue('much appreciated, that fixed the problem completely')` is false. Verify: `VDHT` reports 0 failed, `TC` exits 0 and `rg -c "stopped converg" $DH` prints 1.

### Wave A2: the hand-off inserts the named command
- [x] T005 Insert the ranked `run` command instead of the helper (`FU`, `FHT`). In `FU`: (1) add `COMMAND_ROWS` to the import from `'../command-attach.js'` and `genericRepairCue` to the import from `'./doctor-helper-handoff.js'`. (2) Right above the comment block that precedes `export function applyDoctorHelperHandoff(`, add `export function runnableDoctorBridgeId(runnable: string, projection: AdvisorProjection): string | undefined` with this body: for each `[id, row]` of `Object.entries(COMMAND_ROWS)`, skip it unless `id.startsWith(DOCTOR_BRIDGE_PREFIX)`, `row.command === runnable` and `row.policy === 'run'`, and return `id` when `projection.skills.some((skill) => skill.id === id)`. After the loop return `undefined`. Its comment says the ranker names a runnable such as `/doctor:agents-md check`, and this returns that bridge when it runs without asking and the projection holds it. (3) Replace the four comment lines above `applyDoctorHelperHandoff` with: `// A doctor problem described in other words than a bridge's own phrases reaches`, `// no doctor bridge. When none passes and none was typed, /doctor:helper's ranker`, `// decides whether the prompt is a doctor problem. If it is, the command it ranks`, `// first passes when that command runs without asking, and the helper passes`, `// otherwise. A plain request for a repair route with no ranked command and no`, `// passing skill also gets the helper.`. (4) In the function, replace `if (!match) return [...ranked];` with `if (!match && (skillPasses || !genericRepairCue(context.prompt))) return [...ranked];`, and prefix the next condition with `match && ` so it reads `if (match && cue === null && match.score < DOCTOR_HELPER_UNCUED_MIN_SCORE) return [...ranked];`. (5) Before `const existing =` add `const handoffId = (match ? runnableDoctorBridgeId(match.runnable, context.projection) : undefined) ?? DOCTOR_HELPER_BRIDGE_ID;` and `const handoffSkill = context.projection.skills.find((skill) => skill.id === handoffId) ?? helperSkill;`. (6) In `existing`, in the `skill:` field of `handoff` and in the `ranked.filter` of `withHandoff`, use `handoffId` where the code reads `DOCTOR_HELPER_BRIDGE_ID`. Set `lifecycleStatus` from `handoffSkill`. (7) Make `reason` read `doctor helper hand-off: /doctor:helper ranks ${match.runnable} first for this problem` when `match` is set and the plain string `doctor helper hand-off: a repair request with no matched doctor route` when it is null. Create `FHT` under the frozen regime of `$ADV/tests/doctor-routing-slice.vitest.ts` (its `freezeEvalEnv`, its fake `Date` at the `capturedAt` of `scorer-eval-baseline.json` and `scoreAdvisorPrompt` imported after the freeze). Cases on `result.recommendations` ids in order: `confirm the AGENTS.md sections in this repo have not drifted` starts with `command-doctor-agents-md-check`, `show me every GitHub Actions workflow and whether each is enabled` starts with `command-doctor-ci-report`, `my research loop stopped converging and I cannot see why` starts with `system-deep-loop` then `command-doctor-deep-loop`, `I have a problem and want the right repair path suggested with reasons` starts with `command-doctor-helper`, `much appreciated, that fixed the problem completely` holds no id that starts with `command-doctor-` and `I have a problem with my CSS layout` holds no id that starts with `command-doctor-`. Add pure cases for `runnableDoctorBridgeId` with `{ skills: [{ id: 'command-doctor-agents-md-check' }, { id: 'command-doctor-git-hooks' }] } as unknown as AdvisorProjection`: `/doctor:agents-md check` gives `command-doctor-agents-md-check`, `/doctor:git hooks` gives undefined (policy `ask`) and `/doctor:ci report` gives undefined (not in that projection). Verify: `VFHT` reports 0 failed, `VDHT` reports 0 failed and `TC` exits 0.

### Wave A3
- [x] T006 [P] Relabel the three hand-off rows that now get a named command (`DP`). Change exactly three lines and nothing else. In the line with `"id":"doctor-b-helper-handoff-01"`, replace `"expected_top":"command-doctor-helper"` with `"expected_top":"command-doctor-agents-md-check"`. In the line with `"id":"doctor-b-helper-handoff-02"`, replace `"expected_second":"command-doctor-helper"` with `"expected_second":"command-doctor-deep-loop"`. In the line with `"id":"doctor-b-helper-handoff-04"`, replace `"expected_top":"command-doctor-helper"` with `"expected_top":"command-doctor-setup"`. Verify: `VDS` reports 0 failed, `rg -c '"expected_top":"command-doctor-helper"' $DP` prints 3, `rg -c '"expected_second":"command-doctor-helper"' $DP` prints 1 and `wc -l < $DP` prints 78.
- [x] T007 [P] In `.skilled/skills/system-skill-advisor/feature-catalog/scorer-fusion/doctor-command-routing.md`, in the paragraph that starts `A doctor bridge passes on its own wording`, replace the text `` and if it does the `/doctor:helper` bridge passes so the operator is offered the command that names the right one. `` with the text `` and if it does the command the ranker puts first passes by name when its policy is `run`, and `/doctor:helper` passes instead when that command asks first or has no bridge. A prompt that asks for a `repair path` or says `I have a problem`, with no ranked command and no passing skill, gets `/doctor:helper`. `stopped converging` counts as a wrong state beside a passing skill. `` (both without the outer spaces). Verify: `rg -c "repair path" .skilled/skills/system-skill-advisor/feature-catalog/scorer-fusion/doctor-command-routing.md` prints 1 and `rg -c "is offered the command that names the right one" .skilled/skills/system-skill-advisor/feature-catalog/scorer-fusion/doctor-command-routing.md` prints nothing or 0.

### Wave A4
- [x] T008 Rebuild and recapture after wave A (`BASE`). Run `BLD`, then `node $CAP --write`. Verify: `jq -c '.attachedMetrics.plain.tune' $BASE` prints `{"own":7,"attached":7,"combined":14,"total":45}` (expectation), `jq -r '.rows["cmd-doctor-agents-md-plain-tune-01"].top, .rows["cmd-doctor-ci-plain-tune-01"].top, .rows["cmd-doctor-helper-plain-tune-01"].top, .rows["cmd-doctor-deep-loop-plain-tune-01"].top3' $BASE` prints `command-doctor-agents-md-check`, `command-doctor-ci-report`, `command-doctor-helper` and `true`, `jq -c '.metrics.false_offer, .attachedMetrics.false_offer_attached' $BASE` prints `{"count":0,"total":35}` twice and `RS` reports 0 failed. When the tune line differs from the expectation but the floors hold, write the actual line into `$SP/after-A.txt` in T009 and continue.

### Wave A5
- [x] T009 Floor check after wave A (`$SP/after-A.txt`). Run `FLOORCHECK A`. Verify: every gate in `FLOORCHECK` prints what it must, and `diff <(rg '^(TYPED|EVAL): ' $SP/before.txt) <(rg '^(TYPED|EVAL): ' $SP/after-A.txt)` prints nothing, because the simulation moved no typed or scorer eval row. When a gate fails or that diff prints a line, mark T010 `[B]` with that line and stop.

### Wave B1: sk-doc paraphrase aliases
- [x] T010 Add six task-shaped aliases to the `sk-doc` hub and refresh it (`HRD`, `$MS/sk-doc/manifest.json`, `$MA/sk-doc/manifest.json`). In `HRD` `vocabularyClasses`, append to the end of each `keywords` array: `create-agent-aliases` gets `"agent definition"` and `"specialist persona file"`, `create-diff-aliases` gets `"before and after my rewrite"`, `create-goal-aliases` gets `"intent file"` and `create-command-aliases` gets `"prompt shortcut"` and `"confirm flag"`. Change nothing else, and keep the file's two-space indentation. Then run `REFRESH sk-doc`, `HUBOK sk-doc`, `RT sk-doc $CF_DOC > $SP/routes-sk-doc-after.tsv` and `BINT`. Verify: `jq '[.vocabularyClasses[].keywords | length] | add' $HRD` prints 6 more than before the edit, `diff $SP/routes-sk-doc-before.tsv $SP/routes-sk-doc-after.tsv | rg '^>' | cut -f1 | tr '\n' ' '` prints `> cmd-create-agent-plain-tune-01 > cmd-create-agent-plain-tune-02 > cmd-create-command-plain-tune-01 > cmd-create-diff-plain-tune-01 > cmd-create-goal-plain-tune-01 `, `rg -n 'sk-create-(agent|command|diff|goal)' $SP/routes-sk-doc-after.tsv | rg -c 'plain-tune'` prints at least 5, `REFRESH` printed `0`, every `HUBOK` check prints what it must and `BINT` prints `ℹ fail 0`. When the diff lists any other id, in particular an `mns-`, `nm-`, `sv-` or `canary:` id, revert `HRD`, run `REFRESH sk-doc` again and mark the task `[B]` with that id.

### Wave B2
- [x] T011 Rebuild and recapture after wave B (`BASE`). Run `BLD`, then `node $CAP --write`. Verify: `jq -c '.attachedMetrics.plain.tune' $BASE` prints `{"own":7,"attached":10,"combined":17,"total":45}` (expectation), `jq -r '.attachedMetrics.attachedRows["cmd-create-agent-plain-tune-01"], .attachedMetrics.attachedRows["cmd-create-agent-plain-tune-02"], .attachedMetrics.attachedRows["cmd-create-diff-plain-tune-01"]' $BASE` prints `/create:agent`, `/create:agent` and `/create:diff`, `jq -c '.metrics.false_offer, .attachedMetrics.false_offer_attached' $BASE` prints `{"count":0,"total":35}` twice and `RS` reports 0 failed. Deviation: the T011 worker was killed after its runner was stopped. Satisfied by the merged B, C and D step: one recapture and one floor check, `scratch/after-BCD.txt`.

### Wave B3
- [x] T012 Floor check after wave B (`$SP/after-B.txt`). Run `FLOORCHECK B`. Verify: every gate in `FLOORCHECK` prints what it must. When a gate fails, mark T013 `[B]` with that line and stop. Satisfied by the merged B, C and D step: one recapture and one floor check, `scratch/after-BCD.txt`.

### Wave C1: the mode flag
- [x] T013 [P] Add `routeNeedsMode` (`CA`, `CAT`). At the end of `CA`, after `attachCommand`, add `export function routeNeedsMode(skillId: string, compiledRoute: unknown): boolean` whose body is: `const route = asRecord(compiledRoute);`, return false when `!route`, return false when `route.action !== 'defer' && route.action !== 'clarify'`, and return `Object.prototype.hasOwnProperty.call(MODE_COMMANDS, skillId)`. Its comment says a hub that withholds its command because the prompt names no single mode must still tell the reader why no command came with it, and only a hub whose modes map to commands withholds one. Do not touch the generated blocks. In `CAT` add cases: `routeNeedsMode('system-deep-loop', { action: 'defer' })` is true, `routeNeedsMode('sk-doc', { action: 'clarify' })` is true, `routeNeedsMode('sk-doc', { action: 'route', selectionKind: 'single', targets: [{ workflowMode: 'sk-create-readme' }] })` is false, `routeNeedsMode('sk-code', { action: 'defer' })` is false, `routeNeedsMode('sk-doc', undefined)` is false and `routeNeedsMode('sk-doc', ['defer'])` is false. Verify: `VCA` reports 0 failed, `TC` exits 0 and `DBC` prints `fresh`.
- [x] T014 [P] Add `needsMode` to the recommendation schema (`SCH`). In `AdvisorRecommendationSchema`, right after `ownerSkillId: z.string().min(1).optional(),`, add `needsMode: z.literal(true).optional(),` with the comment: set only when a hub held back its command because the prompt names no single mode, so the head can say so. Verify: `rg -c "needsMode" $SCH` prints 1, `VSCH` reports 0 failed and `TC` exits 0.
- [x] T015 [P] Add `needsMode` to `AdvisorRecommendation` (`SUB`). In `export interface AdvisorRecommendation`, right after `readonly ownerSkillId?: string;`, add `readonly needsMode?: boolean;` with the comment: true when a hub held back its command because the prompt names no single mode. Verify: `rg -c "readonly needsMode" $SUB` prints 1 and `TC` exits 0.

### Wave C2
- [x] T016 [P] Set `needsMode` in the compiled route enrichment (`AR`, `ARC`). Add `routeNeedsMode` to the import from `'../lib/command-attach.js'`. In `enrichCompiledRoutes`, replace the last branch of the return, `: { ...recommendation, compiledRoute };`, with `: { ...recommendation, compiledRoute, ...(!command && routeNeedsMode(recommendation.skillId, compiledRoute) ? { needsMode: true as const } : {}) };`. In `ARC`, add `needsMode?: boolean` to the recommendation type of `ResponsePayload` and add one case: mock `execFileSync` to return `JSON.stringify({ action: 'defer', hubId: 'sk-doc', selectionKind: null, targets: [] })`, call `handleAdvisorRecommend` with prompt `Write a README for the ledger module` and `options: { includeCompiledRoute: true }`, and expect the `sk-doc` row to have `needsMode` true and no `command`. In the same case, mock a `defer` for `sk-code` and call it with prompt `Implement a TypeScript feature with focused tests for the ledger.`, and expect the `sk-code` row to have no `needsMode` key. Use prompts no other case in the file uses, because the handler caches by prompt. Verify: `VARC` reports 0 failed and `TC` exits 0.
- [x] T017 [P] Print `(needs a mode)` and re-pin the golden heads (`RD`, `GT`). In `renderAdvisorBrief`, right after the `if (!topLabel) { ... }` block, add `` const headLabel = top.needsMode === true && top.command === undefined && commandRowFor(top.skill) === undefined ? `${topLabel} (needs a mode)` : topLabel; `` with the comment: a hub that withheld its command because the prompt names no single mode says so, so the reader asks for the mode instead of improvising one. In both head strings, the ambiguous one and the `use` one, replace `${topLabel}` with `${headLabel}`. Change nothing else in `RD`. In `GT`, add `readonly needsMode?: boolean;` to `RecommendationInput` and add two `HEAD_CASES`: name `a hub that needs a mode says so instead of naming a command` with `{ skill: 'system-deep-loop', needsMode: true, confidence: 0.82, uncertainty: 0.2 }` and `expectedHead` `Advisor: live; use system-deep-loop (needs a mode) 0.82/0.20 pass.`, and name `a command on the hub wins over the mode flag` with `{ skill: 'system-deep-loop', kind: 'command', command: '/deep:review', policy: 'ask', ownerSkillId: 'system-deep-loop', needsMode: true, confidence: 0.82, uncertainty: 0.16 }` and `expectedHead` `Advisor: live; use system-deep-loop → /deep:review (ask) 0.82/0.16 pass.`. Every existing case keeps its `expectedHead`. Verify: `VGT` reports 0 failed, `git -c core.fsmonitor=false diff HEAD -- $GT | rg -c '^-.*expectedHead'` prints nothing or 0 and `TC` exits 0.

### Wave C3
- [x] T018 [P] Keep `needsMode` from the CLI (`HFB`, `HFT`). In `recommendationFromCli`, right after the spread that keeps `ownerSkillId`, add `...(value.needsMode === true ? { needsMode: true } : {}),` with the comment: a hub that held back its command for want of a mode keeps that signal, so the head can say why no command came with it. In `HFT` add one case in the shape of `renders a CLI row without command fields from the generated table`: `resultFromCliData` with `recommendations: [{ skillId: 'system-deep-loop', confidence: 0.89, uncertainty: 0.12, needsMode: true }]`, and expect the first line of `renderAdvisorBrief(result)` to contain `use system-deep-loop (needs a mode)`. Verify: `VHFT` reports 0 failed and `TC` exits 0.
- [x] T019 [P] In `.skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md`, after the paragraph that starts `The ambiguous head applies the same label to both sides`, add one paragraph: A hub whose compiled route defers or asks to clarify, and whose modes have commands, renders as `<hub> (needs a mode)` with no command, for example `Advisor: live; use system-deep-loop (needs a mode) 0.82/0.20 pass.` The recommendation carries `needsMode: true`. A command on the same recommendation wins and the label is dropped. Verify: `rg -c "needs a mode" .skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md` prints at least 2.

### Wave C4
- [x] T020 Floor check after wave C (`$SP/after-C.txt`). Run `FLOORCHECK C`. Verify: every gate in `FLOORCHECK` prints what it must, `RS` reports 0 failed against the wave B baseline with no recapture and `PLAIN` prints the same tune line as `$SP/after-B.txt`. When a gate fails, mark T021 `[B]` with that line and stop. Satisfied by the merged B, C and D step: one recapture and one floor check, `scratch/after-BCD.txt`.

### Wave D1: deep pairs
- [x] T021 [P] Add one plain-wording anchor per deep mode (`EX`). In `PHRASE_BOOSTS`, right after the line `  'multi-ai-council': [['system-deep-loop', 1.2]],`, add the comment line `  // Plain wording for a deep run: each phrase asks for the effort a deep loop exists for.` and these three lines: `  'find out everything': [['system-deep-loop', 1]],`, `  'findings stop changing': [['system-deep-loop', 1.2], ['sk-code', -0.6]],` and `  'several models': [['system-deep-loop', 1]],`. Verify: `rg -c "'find out everything'|'findings stop changing'|'several models'" $EX` prints 3, `VEX` reports 0 failed and `TC` exits 0.
- [x] T022 [P] Add one alias per deep mode to the deep-loop hub and refresh it (`HRL`, `$MS/system-deep-loop/manifest.json`, `$MA/system-deep-loop/manifest.json`). In `HRL` `vocabularyClasses`, append `"find out everything"` to the end of `research-aliases`, `"findings stop changing"` to the end of `review-aliases` and `"several models"` to the end of `ai-council-aliases`. Keep each array on its one line. Then run `REFRESH system-deep-loop`, `HUBOK system-deep-loop`, `RT system-deep-loop $CF_LOOP > $SP/routes-deep-loop-after.tsv` and `BINT`. Verify: `diff $SP/routes-deep-loop-before.tsv $SP/routes-deep-loop-after.tsv | rg '^>'` prints exactly `> cmd-deep-ai-council-plain-tune-01	{"action":"route","t":["ai-council"]}`, `> cmd-deep-research-plain-tune-01	{"action":"route","t":["research"]}` and `> cmd-deep-review-plain-tune-01	{"action":"route","t":["review"]}`, `rg -n '^nm-system-deep-loop-01' $SP/routes-deep-loop-after.tsv` prints the same line as in the before file, `REFRESH` printed `0`, every `HUBOK` check prints what it must and `BINT` prints `ℹ fail 0`. When the diff lists any other id, revert `HRL`, run `REFRESH system-deep-loop` again and mark the task `[B]` with that id.

### Wave D2
- [x] T023 Rebuild and recapture after wave D (`BASE`). Run `BLD`, then `node $CAP --write`. Verify: `jq -c '.attachedMetrics.plain.tune' $BASE` prints `{"own":7,"attached":13,"combined":20,"total":45}` (expectation), `jq -r '.rows["cmd-deep-research-plain-tune-01"].top, .attachedMetrics.attachedRows["cmd-deep-research-plain-tune-01"], .attachedMetrics.attachedRows["cmd-deep-review-plain-tune-01"], .attachedMetrics.attachedRows["cmd-deep-ai-council-plain-tune-01"]' $BASE` prints `system-deep-loop`, `/deep:research`, `/deep:review` and `/deep:ai-council`, `jq -r '.attachedMetrics.attachedRows["nm-system-deep-loop-01"] // "none"' $BASE` prints `none`, `jq -c '.metrics.false_offer, .attachedMetrics.false_offer_attached' $BASE` prints `{"count":0,"total":35}` twice and `RS` reports 0 failed. Satisfied by the merged B, C and D step: one recapture and one floor check, `scratch/after-BCD.txt`. On rerun the baseline attaches the three deep commands and `nm-system-deep-loop-01` reads `none`.

### Wave D3
- [x] T024 Floor check after wave D (`$SP/after-D.txt`). Run `FLOORCHECK D`. Verify: every gate in `FLOORCHECK` prints what it must, and `diff <(rg '^(FLOOR|TYPED|EVAL): ' $SP/after-C.txt) <(rg '^(FLOOR|TYPED|EVAL): ' $SP/after-D.txt)` is run and its output, empty or not, is left for T025. Satisfied by the merged B, C and D step: one recapture and one floor check, `scratch/after-BCD.txt`.

### Wave D4
- [x] T025 [C] Decide whether wave E runs. Wave E runs only when `diff <(rg '^(FLOOR|TYPED|EVAL): ' $SP/after-C.txt) <(rg '^(FLOOR|TYPED|EVAL): ' $SP/after-D.txt)` prints nothing (a rise counts as a change), `PY` exits 0, `PAR`, `RS`, `VDS` and `SUITE` report 0 failed and T023 printed the three deep commands. Then append `wave E: runs` to `$SP/after-D.txt`. Otherwise mark T026 to T029 `[B]` with the first line that differs, append `wave E: skipped, <line>` and go to T030. Verify: `rg -c '^wave E: (runs|skipped)' $SP/after-D.txt` prints 1. Deviation: compared `after-A.txt` with `after-BCD.txt`, whose `FLOOR`, `TYPED` and `EVAL` lines are identical. The decision is recorded at the end of `after-BCD.txt` as wave E runs.

### Wave E1: create anchors, only when T025 says runs
- [x] T026 Add one narrow anchor per wrong-top create row (`EX`). In `PHRASE_BOOSTS`, right after the line that starts `  'create testing playbook':`, add the comment line `  // Plain wording for three create modes whose rival skills share their words.` and these three lines: `  'prompt shortcut': [['sk-doc', 1]],`, `  'intent file': [['sk-doc', 1]],` and `  'test script package': [['create:manual-testing-playbook', 1.8], ['command-create-manual-testing-playbook', 1.2], ['sk-doc', 0.2]],`. Verify: `rg -c "'prompt shortcut'|'intent file'|'test script package'" $EX` prints 3, `VEX` reports 0 failed and `TC` exits 0.

### Wave E2
- [x] T027 Rebuild and recapture after wave E (`BASE`). Run `BLD`, then `node $CAP --write`. Verify: `jq -c '.attachedMetrics.plain.tune' $BASE` prints `{"own":8,"attached":15,"combined":23,"total":45}` (expectation), `jq -r '.attachedMetrics.attachedRows["cmd-create-command-plain-tune-01"], .attachedMetrics.attachedRows["cmd-create-goal-plain-tune-01"], .rows["cmd-create-manual-testing-playbook-plain-tune-01"].top1' $BASE` prints `/create:command`, `/create:goal` and `true`, `jq -c '.metrics.false_offer, .attachedMetrics.false_offer_attached' $BASE` prints `{"count":0,"total":35}` twice and `RS` reports 0 failed.

### Wave E3
- [x] T028 Floor check after wave E (`$SP/after-E.txt`). Run `FLOORCHECK E`. Verify: every gate in `FLOORCHECK` prints what it must, and `diff <(rg '^(FLOOR|TYPED|EVAL): ' $SP/after-D.txt) <(rg '^(FLOOR|TYPED|EVAL): ' $SP/after-E.txt)` prints nothing.

### Wave E4
- [x] T029 [C] Keep or revert wave E. When T028's diff prints a line, or any gate fails, revert `EX` to its wave D state, rerun T027's commands and write `wave E: reverted, <line>` into `$SP/after-E.txt`. Otherwise write `wave E: kept`. Verify: `rg -c '^wave E: (kept|reverted)' $SP/after-E.txt` prints 1.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T030 Run every floor from the final state (`$SP/after-final.txt`). Run `FLOORCHECK final`, plus `VCA`, `VGT`, `VDHT`, `VFHT`, `VARC`, `VHFT`, `VSCH`, `VEX`, `DBC`, `HUBOK sk-doc` and `HUBOK system-deep-loop`. Verify: every gate prints what it must, `EVAL` is no lower than its line in `$SP/before.txt`, `jq -c '.attachedMetrics.plain.tune.combined' $BASE` prints a number above 9 and each command's line sits beside its before line in `after-final.txt`.
- [x] T031 Count the 16 plain chat rows that now carry their command (`$SP/chat-after.json`). Run `IDS='["cmd-create-agent-plain-tune-01","cmd-create-agent-plain-tune-02","cmd-create-benchmark-plain-tune-01","cmd-create-changelog-plain-tune-01","cmd-create-command-plain-tune-01","cmd-create-diff-plain-tune-01","cmd-create-feature-catalog-plain-tune-01","cmd-create-goal-plain-tune-01","cmd-create-manual-testing-playbook-plain-tune-01","cmd-deep-ai-council-plain-tune-01","cmd-deep-research-plain-tune-01","cmd-deep-review-plain-tune-01","cmd-doctor-agents-md-plain-tune-01","cmd-doctor-ci-plain-tune-01","cmd-doctor-deep-loop-plain-tune-01","cmd-doctor-helper-plain-tune-01"]'` and `jq --argjson ids "$IDS" '.attachedMetrics.attachedRows as $a | [.rows | to_entries[] | select(.key as $k | $ids | index($k)) | {id: .key, top: .value.top, top1: .value.top1, top3: .value.top3, attached: ($a[.key] // null), carried: (.value.top1 or .value.top3 or (($a[.key] // null) == .value.expected_command))}]' $BASE > $SP/chat-after.json`. Verify: `jq 'length' $SP/chat-after.json` prints 16 and `jq '[.[] | select(.carried)] | length' $SP/chat-after.json` prints 16 when wave E was kept, or 13 when it was skipped or reverted. A lower count is recorded in `implementation-summary.md` with the row ids, not hidden.
- [x] T032 Check the boundaries. Verify: `git -c core.fsmonitor=false diff --quiet HEAD -- AGENTS.md .skilled/commands/create .skilled/skills/sk-doc/ROUTER.md .skilled/skills/system-deep-loop/ROUTER.md "$CF_DOC" "$CF_LOOP"` exits 0, `git -c core.fsmonitor=false diff HEAD -U0 -- .skilled | rg "^\+.*(//|#|\*).*(specs/|REQ-0|ADR-0|T0[0-9]{2}|phase [0-9])"` prints nothing, `git -c core.fsmonitor=false diff HEAD --name-only | rg 'package(-lock)?\.json$'` prints nothing and `git -c core.fsmonitor=false status --short -- .skilled specs/sk-doc` lists only files named in this phase's tasks.
- [x] T033 [C] Read three live heads through the Claude prompt hook. Make one folder with `D=$(mktemp -d "$TMPDIR/ssa-head-XXXXXX")` and, for each prompt `use the sk-doc skill`, `use the system-deep-loop skill` and `confirm the AGENTS.md sections in this repo have not drifted`, pipe `{"prompt":<prompt>,"cwd":"<repo root>","hook_event_name":"UserPromptSubmit","session_id":"head-<n>"}` into `node .skilled/skills/system-spec-kit/runtime/dist/hooks/claude/user-prompt-submit.js` with `SPECKIT_IPC_SOCKET_DIR="$D"`, and keep the first line of `hookSpecificOutput.additionalContext`. Then stop only a process whose command line names `$D` and remove `$D`. Verify: the first two lines contain `use sk-doc (needs a mode)` and `use system-deep-loop (needs a mode)`, the third contains `/doctor:agents-md check (run)` and `ls -d "$TMPDIR"/ssa-head-* 2>/dev/null` prints nothing. When the hook answers from the Python scorer (no `compiledRoute`, as seen on 2026-11-13), record the three lines and the cause as found, and mark this task `[B]` rather than passing it on the unit tests alone. Amendment: the first run matched two of three heads because the prompt policy skipped `use the system-deep-loop skill`, reading only `sk-` names as skill markers. The coordinator fixed `prompt-policy.ts` and its test as a scope amendment under goal decision D1, and the rerun at the end of `scratch/live-heads.txt` matched all three. `scratch/after-final-policy.txt` holds the full floor check after the fix.
- [x] T034 Write `implementation-summary.md` with the per-wave plain tune line, the chat count, the wave E decision and every deviation, and mark each row in `acceptance-criteria.md` with its evidence. Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/012-plain-offer-reach --strict` prints `RESULT: PASSED`. Evidence: the strict validate run printed `RESULT: PASSED`. Every row in `acceptance-criteria.md` is `Met`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`, or wave E's four tasks `[B]` with the line T025 recorded
- [x] No other `[B]` task remaining
- [x] The committed baseline reads `attachedMetrics.plain.tune.combined` above 9 and every floor holds against `scratch/before.txt`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
- **Research**: `../009-ux-performance-cross-cli-research/research/research-segment-2.md`
- **Planning simulations**: `scratch/planning/`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

A blocked task gets `[B]` and one line naming what blocks it. A moved floor blocks the next wave.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] The before numbers, the route tables and the plain row state are in `scratch/` (T001 to T003). Evidence: `scratch/before.txt` holds 35 lines, the two route tables hold 154 and 139 lines and `jq length scratch/plain-before.json` prints 45.
- [x] CHK-002 [P0] The coordinator confirmed phase 011 is committed before wave A1 started. Evidence: phase 011 landed in `99b68d8b3d` and `scratch/before.txt` names that commit as its base.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `npm run typecheck` in `ADV` exits 0 after every wave (`FLOORCHECK`). Evidence: `TC: exit 0` in `after-A.txt`, `after-BCD.txt`, `after-E.txt` and `after-final.txt`.
- [x] CHK-011 [P0] No code comment names a spec path, a phase number, a task id, an ADR or a REQ id (T032). Evidence: on rerun the added-comment scan over `.skilled` printed nothing.
- [x] CHK-012 [P0] The generated blocks in `command-attach.ts` are untouched and the deriver check prints `fresh` (T013, T030). Evidence: `DBC` printed `fresh` in `scratch/after-final.txt`.
- [x] CHK-013 [P1] A ranked `ask` command and a hub outside `MODE_COMMANDS` keep today's behaviour (T005, T013, T016). Evidence: `FHT` pins `/doctor:git hooks` (policy `ask`) to no bridge, `CAT` pins `routeNeedsMode('sk-code', { action: 'defer' })` false and `ARC` expects the `sk-code` row to have no `needsMode`. The focused run in `after-final.txt` passed 200 of 200.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] Every floor holds after every wave (T009, T012, T020, T024, T028, T030). Evidence: `after-A.txt`, `after-BCD.txt`, `after-E.txt` and `after-final.txt` hold the before `FLOOR`, `TYPED` and `EVAL` lines. B, C and D were measured together in `after-BCD.txt`, as `implementation-summary.md` records.
- [x] CHK-021 [P0] No silence row and no canary prompt changes route after either hub edit (T010, T022). Evidence: the `sk-doc` route diff changes only the five named tune rows and the deep-loop diff only the three deep tune rows. No `mns-`, `nm-`, `sv-` or `canary:` id moved.
- [x] CHK-022 [P0] Each hub serves fresh, its served and authored manifests match and the guard reports 0 failures (T010, T022, T030). Evidence: `after-final.txt` reports both hubs fresh, cmp identical and parent-skill-check OK, and `GUARD: 0`.
- [x] CHK-023 [P0] The parity test and the Python test pass (`FLOORCHECK`). Evidence: `PAR` passed 2 of 2 and `PY` exited 0 in every after file.
- [x] CHK-024 [P1] The chat rows carry their command in the baseline (T031), and the live heads show the label and the named doctor command (T033). Evidence: `scratch/chat-after.json` counts 16 of 16 carried, and after the prompt policy amendment the end of `scratch/live-heads.txt` shows `use system-deep-loop (needs a mode)`, `use sk-doc (needs a mode)` and `/doctor:agents-md check (run)` for the three exact prompts.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] The gap is class `cross-consumer`: the hand-off, two hub vocabularies, the phrase table and the brief each lose a different family of rows. Evidence: `spec.md` section 2 traces each family to a different cause: the hand-off insertion, the two hub vocabularies, the phrase table and the bare head.
- [x] CHK-FIX-002 [P0] Every reader of the new field is listed: `rg -n "needsMode" .skilled --glob '!**/node_modules/**' --glob '!**/dist/**'` names `command-attach.ts`, the schema, `subprocess.ts`, the handler, the fallback, the renderer and their tests. Evidence: the `rg` names the schema, `subprocess.ts`, the handler, the fallback, the renderer, the hook guide and three tests. `command-attach.ts` carries the field as `routeNeedsMode` and its case is pinned in `CAT`.
- [x] CHK-FIX-003 [P1] Every reader of the inserted doctor id is listed: `rg -n "DOCTOR_HELPER_BRIDGE_ID" $ADV --glob '!dist/**'`. Evidence: the `rg` lists `doctor-helper-handoff.ts` and `fusion.ts` only.
- [x] CHK-FIX-004 [P1] Evidence names the commit it ran on. Evidence: `scratch/before.txt` and `scratch/after-final.txt` both name `99b68d8b3d`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No task reads or prints holdout prompt text, and `RT` filters `split` before it reads a prompt (T002). Evidence: `plain-before.json` and `chat-after.json` hold no `prompt` key and the before route tables hold no `holdout` id.
- [x] CHK-031 [P0] No task writes to the home folder, installs anything or adds a dependency (T032). Evidence: on rerun the `package.json` scan printed nothing and `git status` lists only repository files.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `spec.md`, `plan.md`, `tasks.md` and `implementation-summary.md` state the same numbers. Evidence: the per-wave tune lines 14, 20 and 23 in `implementation-summary.md` match the expectations in `spec.md` SC-001 and the table at the top of this file for A, D and E.
- [x] CHK-041 [P1] The hook guide and the doctor feature catalog page match the code (T007, T019). Evidence: `rg -c "needs a mode"` prints 2 for the hook guide and `rg -c "repair path"` prints 1 for the doctor catalog page.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Route tables, floor checks, the chat count and the planning simulations live in `scratch/` only. Evidence: route tables, floor checks, `chat-after.json`, `live-heads.txt` and `planning/` are all under `scratch/`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 13 | 13/13 |
| P1 Items | 7 | 7/7 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-11-13
<!-- /ANCHOR:summary -->
