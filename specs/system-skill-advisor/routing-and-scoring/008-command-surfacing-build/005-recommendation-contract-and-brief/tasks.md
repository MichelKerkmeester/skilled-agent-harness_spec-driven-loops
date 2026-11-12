---
title: "Tasks: Phase 5: recommendation-contract-and-brief"
description: "Ordered worker-sized tasks that generate one command table, fill four recommendation fields, print the command and its policy in the brief, state the degraded contract, fix the reach check and retire the legacy ids."
trigger_phrases:
  - "recommendation contract and brief tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 5: recommendation-contract-and-brief

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

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

Every command runs from the repository root unless a task says otherwise.
- `ADV` is `.skilled/skills/system-skill-advisor/runtime`. `HK` is `.skilled/skills/system-skill-advisor/hooks`.
- `D` is `$ADV/scripts/command-bridges/derive-command-bridges.cjs`. `G` is `$ADV/scripts/command-bridges/command-bridges.generated.json`.
- `CA` is `$ADV/lib/command-attach.ts`. `R` is `$ADV/lib/render.ts`. `H` is `$ADV/handlers/advisor-recommend.ts`. `SCH` is `$ADV/schemas/advisor-tool-schemas.ts`. `CLI` is `$ADV/skill-advisor-cli.ts`. `PY` is `$ADV/scripts/skill_advisor.py`. `FB` is `$HK/lib/skill-advisor-cli-fallback.ts`.
- `RC` is `.skilled/skills/sk-doc/sk-create-skill/scripts/ci-router-vocabulary-reach.cjs`. `RT` is `.skilled/skills/sk-doc/sk-create-skill/scripts/tests/ci-router-vocabulary-reach.test.cjs`.
- `REC` is `node .skilled/bin/skill-advisor.cjs advisor_recommend --format json --json`.
- `C` is `$ADV/scripts/routing-accuracy/capture-command-routing-baseline.mjs`. `M` is `jq -c '.metrics.typed_recall_at_1, .attachedMetrics.plain, .metrics.false_offer, .attachedMetrics.typed_same_owner_ambiguous'`.
- `P` is `node $ADV/scripts/routing-accuracy/capture-scorer-eval-baseline.mjs | jq -c '[.metrics.full_corpus_top1.correct,.metrics.holdout_top1.correct,.metrics.ambiguity_top1.correct,.metrics.gold_none_false_fire.value]'`.
- `ROLL` is `jq -c '[.commandPolicies | group_by(.command)[] | (map(.policy) | if index("ask") then "ask" elif index("start") then "start" else "run" end)] | group_by(.) | map({(.[0]): length}) | add' $G`.
- `S` is this phase's `scratch/` folder. `TC` is `npm run typecheck` in `ADV`, which must exit 0 with no output.

Each task is one change to the files it names. No task reads holdout prompt text. A relabel edits a label field by row id and prints no prompt.

Worker waves. Tasks in one wave touch different files and can run in parallel. A task that runs `node $D` rewrites the generated blocks in `CA`, `R`, `$ADV/lib/scorer/projection.ts`, `PY` and `G`, so no other task in its wave touches those files.
- Wave 0: T001, T002, T003, T004, T005, T054, T055. Read-only setup, each writes its own `$S` file.
- Gate: no task from wave 1 on starts before the coordinator confirms that phase 007's before-measurement on the branch tip is done.
- Wave 1: T006 (`CA`), T007 (`SCH`), T008 (`subprocess.ts`), T009 (`PY`), T010 (`projection.ts`), T011 (`RC`).
- Wave 2: T012 (`D`, regenerates), T013 (`FB`), T014 (schema test), T015 (`RT`).
- Wave 3: T016 (`H`), T017 (`R`), T018 (`CLI`).
- Wave 4: T019 (`H`), T020 (`D`, `R`, regenerates).
- Wave 5: T021, T022, T023, T024, T025, T026. One test file group each.
- Wave 6: T027 (`D`, `allow-list.json`), T028 (`scoring-compatibility.json`), T029 (`explicit.ts`), T030 (`fusion.ts`), T031 (`scoring-constants.ts`), T032 (`PY`), T033 (same-owner test).
- Wave 7: T034 (`D` run, regenerates), T035 (relabel script and the four label files).
- Wave 8: T036 (`PY`), T037 (rebuild and the command baseline file), T038, T039, T040 (one doc each).
- Wave N1: T056 (the one source file T055 names, and `D` run when that file is a deriver input).
- Wave N2: T057 (rebuild and the command baseline file).
- CARRY-003 wave C1: T041 (`$S` probe), T042 (activation fixture test), T043 (`system-spec-kit/command-metadata.json`).
- CARRY-003 wave C2: T044 (`ambiguity.ts`), T045 (`D` run, regenerates).
- CARRY-003 wave C3: T046.
- Verification, one at a time: T047 to T053.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Record the before numbers (`$S/before.txt`). Verify: `$P` prints `[159,50,20,5]`, `node $C | $M` prints `{"correct":24,"total":44}`, the plain block with tune combined 9 and holdout combined 0, `{"count":0,"total":35}` and `["cmd-create-agent-typed-01"]`, and `$ROLL` prints `{"ask":17,"run":7,"start":20}`.
- [x] T002 Write `$S/brief-heads.mjs`, which pipes six prompts through `.skilled/skills/system-spec-kit/runtime/dist/hooks/claude/user-prompt-submit.js` and prints the first line of each `additionalContext`, and save its output (`$S/brief-heads-before.txt`). The prompts are the five non-skipped hook prompts in the `spec.md` measured block plus `research caching strategies in depth over several iterations`. Verify: the file has six lines, and the first reads `Advisor: live; use command-spec-kit-plan 0.82/0.16 pass.`
- [ ] T003 Copy `../003-plain-chat-command-reach/scratch/hook-latency.mjs` to `$S/hook-latency.mjs` and run it three times (`$S/hook-latency-before-{1,2,3}.json`). Verify: `jq -c '[.n,.medianMs,.p95Ms]'` on each file prints 44 and two numbers.
- [x] T004 Run the reach check with Ollama up (`$S/reach-before.txt`). Verify: `curl -s localhost:11434/api/tags | jq -r '.models[].name'` lists `nomic-embed-text:v1.5`, and `node $RC --hub sk-doc` exits 1 with `outranked=4` and `RESULT: FAILED`.
- [ ] T005 Run the suite once (`$S/suite-before.txt`). Verify: `npm test` in `ADV` prints a summary line, and the file records its failed count.
- [x] T054 Write `$S/nm-sk-doc-probe.mjs`, which sets `VITEST`, imports `scoreAdvisorPrompt` from `$ADV/dist/runtime/lib/scorer/fusion.js` and prints, for `sk-doc`, `system-skilled-doctor`, `sk-code` and `sk-design`, the confidence, the score and each positive lane contribution with its evidence, for the prompt of row `nm-sk-doc-01`. Save the output (`$S/nm-sk-doc-before.txt`). Verify: the output matches the probe block in `spec.md`, with `sk-doc` absent and `sk-code` holding `token:typo` and `token:heading`.
- [x] T055 Trace each token in `$S/nm-sk-doc-before.txt` to the source file and field it is projected from, by reading how `$ADV/lib/scorer/lanes/lexical.ts` and `$ADV/lib/scorer/projection.ts` build a skill's token list, and record why `sk-doc` holds no documentation-edit token (`$S/nm-sk-doc-source.txt`). Verify: the file has one line per token `typo`, `heading`, `guide`, `setup` and `debug`, each naming skill, file and field, and one line naming the `sk-doc` source field that should carry documentation-edit vocabulary.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Wave 1
- [ ] T006 [P] In `CA`, add `export interface CommandRow { readonly command: string; readonly policy?: 'run' | 'start' | 'ask'; readonly ownerSkillId: string }`, an empty marked block `// BEGIN GENERATED COMMAND ROWS` holding `export const COMMAND_ROWS: Readonly<Record<string, CommandRow>> = {};` and `export const COMMAND_POLICIES: Readonly<Record<string, 'run' | 'start' | 'ask'>> = {};` then `// END GENERATED COMMAND ROWS`, and `export function commandRowFor(id: string): CommandRow | undefined` that reads `COMMAND_ROWS` with `Object.hasOwn`. Verify: `$TC` exits 0 and `rg -c "GENERATED COMMAND ROWS" $CA` prints 2.
- [ ] T007 [P] In `AdvisorRecommendationSchema` (`SCH`), add `kind: z.enum(['skill', 'command']).optional()`, `policy: z.enum(['run', 'start', 'ask']).optional()` and `ownerSkillId: z.string().min(1).optional()`. Leave `command` and `.strict()` as they are. Verify: `$TC` exits 0 and `rg -n "^  (kind|policy|ownerSkillId):" $SCH` prints the three new lines.
- [ ] T008 [P] In `AdvisorRecommendation` (`$ADV/lib/subprocess.ts`), add `readonly command?: string`, `readonly policy?: string` and `readonly ownerSkillId?: string`. Verify: `$TC` exits 0.
- [ ] T009 [P] Delete the `HAND_AUTHORED_COMMAND_BRIDGES` and `HAND_AUTHORED_COMMAND_BRIDGE_OWNER_NORMALIZATION` dictionaries from `PY`. Verify: `rg -n "HAND_AUTHORED" $ADV --glob '!dist'` prints nothing, `python3 -m py_compile $PY` exits 0 and `python3 $ADV/tests/python/test_skill_advisor.py` exits 0.
- [ ] T010 [P] In `$ADV/lib/scorer/projection.ts`, change `readonly routingEnabled?: boolean;` to `readonly routingEnabled: boolean;` and the filter in `scoringCommandBridges` to `bridge.routingEnabled === true`. Verify: `$TC` exits 0 and `rg -n "readonly routingEnabled: boolean;" $ADV/lib/scorer/projection.ts` prints one line.
- [ ] T011 [P] In `rankShippedFleet` (`RC`), set `hit` true when `shipped[0].skillId === hub` or `shipped[0].ownerSkillId === hub`, and set `present` true when any shipped entry has `skillId === hub` or `ownerSkillId === hub`. Change nothing else. Verify: `node $RT` exits 0 and prints `[sk-doc] router reach shipped-fleet ranking passed`.

### Wave 2
- [ ] T012 In `D`, add `renderCommandRows(entries, policies)` and register `CA`'s `GENERATED COMMAND ROWS` block in `generatedSources`. Emit one `COMMAND_ROWS` row per id a scorer can return for an enabled entry: its TypeScript id, its Python id and its entry id. `command` is the doctor runnable string from `DOCTOR_DETAILS` or the entry's `command`. `policy` is the `commandPolicies` record whose route matches the runnable's target, or the route-null record. When the runnable names no target and the command has several route records, take the strictest of `ask`, `start` and `run`. `ownerSkillId` is the entry's `skillId`. Emit `COMMAND_POLICIES` keyed by runnable string the same way. Run `node $D`. Verify: `node $D --check | jq -r .status` prints `fresh`, `rg -n "'command-doctor-update': \{ command: '/doctor:update', policy: 'ask'" $CA` prints one line, `rg -n "'command-speckit-search': \{ command: '/speckit:search', policy: 'run'" $CA` prints one line, `rg -n "'create:agent': \{ command: '/create:agent', policy: 'start', ownerSkillId: 'sk-doc'" $CA` prints one line and `$TC` exits 0.
- [ ] T013 [P] In `recommendationFromCli` (`FB`), keep `value.kind` when it is `skill` or `command` (default `skill`), keep `value.policy` when it is `run`, `start` or `ask`, and keep `value.ownerSkillId` when it is a non-empty string. Verify: in `ADV`, `npx vitest run tests/hooks/skill-advisor-cli-fallback-envelope.vitest.ts tests/hooks/skill-advisor-cli-fallback-no-match.vitest.ts` reports 0 failed.
- [ ] T014 [P] In `$ADV/tests/schemas/advisor-tool-schemas.vitest.ts`, add one case that parses a recommendation with all four fields and one that rejects it with `consequence: 'x'` added. Verify: in `ADV`, `npx vitest run tests/schemas/advisor-tool-schemas.vitest.ts` reports 0 failed.
- [ ] T015 [P] In `RT`, add two cases through the stand-in advisor: a `create:agent` row with `ownerSkillId: 'sk-doc'` first and `sk-doc` second counts as a hit for `--hub sk-doc`, and a `command-doctor-git-hooks` row with `ownerSkillId: 'sk-git'` first and `sk-doc` second still prints `outranked`. Verify: `node $RT` exits 0.

### Wave 3
- [ ] T016 In `publicRecommendation` (`H`), add `kind: recommendation.kind`, and when `commandRowFor(recommendation.skill)` returns a row, add its `command`, its `policy` when present and its `ownerSkillId`. Verify: `$TC` exits 0, and after `npm run build` in `ADV`, `$REC '{"prompt":"save context"}' | jq '[.data.recommendations[] | select(.command == "/speckit:save")] | length'` prints 1.
- [ ] T017 In `R`, render the label of a recommendation that has a command, from its fields or else from `commandRowFor(skill)`, as `<ownerSkillId or skill> → <command> (<policy>)`, dropping the parenthesis when no policy is known. Use it for the `use` head and both sides of the `ambiguous` head. Every part passes `sanitizeSkillLabel`. Rewrite `doctorCommandString` to return `commandRowFor(id)?.command` for a doctor id. Leave the `Also:` line's trigger unchanged. Verify: `$TC` exits 0 and `rg -n "DOCTOR_COMMAND_STRINGS\[" $R` prints nothing.
- [ ] T018 In `CLI`, pass the prompt to `degradedRecommendations` and export it. For an entry with a `commandRowFor(entry.skill)` row: when the prompt contains the row's bare slash command (the text before the first space), emit `skillId`, `kind: 'command'`, `command`, `policy` and `ownerSkillId`. Otherwise emit the row's `ownerSkillId` as `skillId` with `kind: 'skill'`, and drop it when that skill is already in the list. Verify: `$TC` exits 0.

### Wave 4
- [ ] T019 In `enrichCompiledRoutes` (`H`), build `alreadyOffered` from the `command` fields of the recommendations and delete `BRIDGE_COMMAND_BY_ID`. When a hub gets an attached command, also set `policy: COMMAND_POLICIES[command]` when that key exists. Verify: after `npm run build` in `ADV`, `$REC '{"prompt":"create a readme for the utils folder","options":{"includeCompiledRoute":true}}' | jq -c '.data.recommendations[0] | {skillId,command,policy}'` prints `{"skillId":"sk-doc","command":"/create:readme","policy":"start"}`, and `npx vitest run tests/handlers/advisor-recommend-compiled-route-option.vitest.ts` reports 0 failed.
- [ ] T020 Delete `renderDoctorCommandStrings` and the `R` entry from `generatedSources` in `D`, then delete the `GENERATED DOCTOR COMMANDS` block from `R`, then run `node $D`. Verify: `rg -n "GENERATED DOCTOR COMMANDS|renderDoctorCommandStrings" $D $R` prints nothing, `node $D --check | jq -r .status` prints `fresh` and `$TC` exits 0.

### Wave 5
- [ ] T021 [P] Create `$ADV/tests/command-brief-golden.vitest.ts`. It renders six constructed results through `renderAdvisorBrief` and asserts the six heads in `plan.md` section 3 exactly, that each head before `\nDirectives:` is at most 320 characters and that no head contains `command-`. Add one row each for a missing field filled from `COMMAND_ROWS`, an id with no row and a missing policy. Verify: in `ADV`, `npx vitest run tests/command-brief-golden.vitest.ts` reports 0 failed.
- [ ] T022 [P] Create `$ADV/tests/cli-degraded-command-contract.vitest.ts`. It calls the exported `degradedRecommendations` with a typed prompt `/speckit:save this session` over a `command-speckit-save` entry and expects `command` `/speckit:save` and `policy` `start`, then with `create a readme for the utils folder` over `sk-doc` and `command-create-readme` entries and expects one `sk-doc` entry with no `command`. Verify: in `ADV`, `npx vitest run tests/cli-degraded-command-contract.vitest.ts` reports 0 failed.
- [ ] T023 [P] In `$ADV/tests/hooks/skill-advisor-cli-fallback-envelope.vitest.ts`, add a case where the CLI JSON row is `{"skillId":"command-speckit-save","confidence":0.89,"uncertainty":0.12}` with no new field, and assert the rendered head contains `system-spec-kit → /speckit:save (start)`. Verify: in `ADV`, `npx vitest run tests/hooks/skill-advisor-cli-fallback-envelope.vitest.ts` reports 0 failed.
- [ ] T024 [P] In `$ADV/tests/doctor-brief-render.vitest.ts` and `$ADV/tests/doctor-command-bridges.vitest.ts`, change each expected doctor head to the new label form, such as `sk-git → /doctor:git hooks (ask)`, and nothing else. Verify: in `ADV`, `npx vitest run tests/doctor-brief-render.vitest.ts tests/doctor-command-bridges.vitest.ts` reports 0 failed.
- [ ] T025 [P] In `$ADV/tests/legacy/advisor-renderer.vitest.ts` and `$ADV/tests/legacy/advisor-brief-producer.vitest.ts`, change each expected head that named a command row to the new label form, and nothing else. Verify: in `ADV`, `npx vitest run tests/legacy` reports 0 failed.
- [ ] T026 [P] In the files under `$ADV/tests/hooks/` other than the envelope test, change each expected head that named a command row to the new label form, and nothing else. Verify: in `ADV`, `npx vitest run tests/hooks` reports 0 failed.

### Wave 6
- [ ] T027 [P] Remove the allow-list read, its drop rule for matching metadata entries and the `allowList` count from `D`, and delete `$ADV/scripts/command-bridges/allow-list.json`. Do not run `D`. Verify: `rg -n "allow-list|allowList" $D` prints nothing and `test ! -e $ADV/scripts/command-bridges/allow-list.json` exits 0.
- [ ] T028 [P] In `$ADV/scripts/command-bridges/scoring-compatibility.json`, delete the four `python` rows whose `id` is `command-spec-kit-plan`, `-complete`, `-implement` or `-resume`, and the `command-spec-kit-resume` key of `pythonOwnerNormalization`. Verify: `jq -c '[.python[].id | select(test("^command-spec-kit-(plan|complete|implement|resume)$"))]' $ADV/scripts/command-bridges/scoring-compatibility.json` prints `[]`.
- [ ] T029 [P] In `$ADV/lib/scorer/lanes/explicit.ts`, replace `command-spec-kit-resume` with `command-speckit-resume` on its two lines. Verify: `rg -c "command-spec-kit-(plan|complete|implement|resume)" $ADV/lib/scorer/lanes/explicit.ts` prints nothing.
- [ ] T030 [P] In `$ADV/lib/scorer/fusion.ts`, replace each `command-spec-kit-plan` or `command-spec-kit-resume` with `command-speckit-plan` or `command-speckit-resume`. Verify: `rg -c "command-spec-kit-(plan|complete|implement|resume)" $ADV/lib/scorer/fusion.ts` prints nothing.
- [ ] T031 [P] In `$ADV/lib/scorer/scoring-constants.ts`, replace `command-spec-kit-plan` with `command-speckit-plan` in its comment. Verify: `rg -c "command-spec-kit-plan" $ADV/lib/scorer/scoring-constants.ts` prints nothing.
- [ ] T032 [P] In `PY`, outside the generated blocks, replace each of the four `command-spec-kit-*` ids with its `command-speckit-*` id. Leave `SPECKIT_COMMAND_BRIDGE_PREFIXES` and the deep ids alone. Verify: `rg -n "command-spec-kit-(plan|complete|implement|resume)" $PY` prints only lines inside `BEGIN GENERATED COMMAND BRIDGES`, which T034 regenerates.
- [ ] T033 [P] In `$ADV/tests/scorer/same-owner-ambiguity.vitest.ts`, replace the two old ids with their new ids. Verify: `rg -c "command-spec-kit-" $ADV/tests/scorer/same-owner-ambiguity.vitest.ts` prints nothing.

### Wave 7
- [ ] T034 Run `node $D`. Verify: `node $D --check | jq -c '{status, counts}'` prints `fresh` with no `allowList` key and `typescriptActive` 45, `jq -c '[.entries[] | .runtime.typescript.id, .runtime.python.id] | map(select(. != null and test("^command-spec-kit-(plan|complete|implement|resume)$")))' $G` prints `[]`, and `$ROLL` prints `{"ask":17,"run":7,"start":20}`.
- [ ] T035 [P] Write `$S/relabel-ids.mjs`, which rewrites any JSON string value equal to one of the four old ids to its new id in `$ADV/scripts/routing-accuracy/holdout-prompts.jsonl`, `$ADV/scripts/fixtures/gate2-golden-prompts.jsonl`, `$ADV/scripts/fixtures/skill-advisor-regression-cases.jsonl` and `$ADV/tests/parity/fixtures/local-native-approved-divergences.json`, never prints a prompt and writes file, row id and field per change to `$S/relabel-list.txt`. Run it. Verify: `rg -c "command-spec-kit-(plan|complete|implement|resume)\b"` over the four files prints nothing, and `wc -l < $S/relabel-list.txt` prints 5.

### Wave 8
- [ ] T036 [P] In `PY`, delete the `"/prompt": [("sk-prompt", 3.2)]` lexical row and the `if command == "/prompt":` branch of `_command_bridge_owner`. Verify: `rg -n '"/prompt"' $PY` prints nothing and `python3 $ADV/tests/python/test_skill_advisor.py` exits 0.
- [ ] T037 [P] Run `npm run build` in `ADV`, then `node $C --write`. Verify: `node $C | $M` prints the T001 lines, and `$P` prints `[159,50,20,5]`.
- [ ] T038 [P] Describe the head form and the degraded contract in `$HK/skill-advisor-hook.md`. Verify: `rg -n "→ /speckit:save \(start\)|degraded" $HK/skill-advisor-hook.md` prints at least two lines.
- [ ] T039 [P] Describe `kind`, `command`, `policy` and `ownerSkillId` in `.skilled/skills/system-skill-advisor/feature-catalog/cli-surface/advisor-recommend.md`. Verify: `rg -c "ownerSkillId" .skilled/skills/system-skill-advisor/feature-catalog/cli-surface/advisor-recommend.md` prints at least 1.
- [ ] T040 [P] In `$ADV/scripts/command-bridges/README.md`, describe the `GENERATED COMMAND ROWS` block and remove the allow-list as a live source. Verify: `rg -n "COMMAND_ROWS" $ADV/scripts/command-bridges/README.md` prints a line and `rg -n "allow-list.json" $ADV/scripts/command-bridges/README.md` prints nothing.

### Wave N1
- [ ] T056 Make one correction at the source T055 names: remove a token a skill holds only through a harvest artifact, or add a general documentation-edit term to the `sk-doc` source field T055 names. The change adds no string of two or more consecutive words from the `nm-sk-doc-01` prompt. When the file is a deriver input, run `node $D`. Verify: for each two-word window of the prompt, `git -c core.fsmonitor=false diff HEAD -U0 -- <changed file> | rg -F "<window>"` prints nothing, `node $D --check | jq -r .status` prints `fresh`, and after `npm run build` in `ADV`, `node $S/nm-sk-doc-probe.mjs` prints `sk-doc` with the highest score.

### Wave N2
- [ ] T057 Run `npm run build` in `ADV`, then `node $C --write`. Verify: `jq -c '.rows["nm-sk-doc-01"] | {top, offered}' $ADV/scripts/routing-accuracy/command-routing-baseline.json` prints `{"top":"sk-doc","offered":false}`, `node $C | $M` prints typed at least 24 of 44, tune combined at least 9 of 45, holdout combined at least 0 of 44 and false offers 0 of 35, and `$P` prints numbers no lower than `[159,50,20]` with false fire no higher than 5. If any is worse, revert T056 and mark it `[B]` with the printed numbers.

### CARRY-003 wave C1
- [ ] T041 [P] CARRY-003 (a): write `$S/agent-ambiguity.mjs`, which sets `VITEST`, imports `scoreAdvisorPrompt` from `$ADV/dist/runtime/lib/scorer/fusion.js` and prints `ambiguous` and, for the top four rows, `skill`, `confidence`, `score`, `confidenceFloored` and the length of `ambiguousWith`, for `/create:agent dependency-auditor for release checks`. Save the output (`$S/agent-ambiguity.txt`). Verify: the output shows the top row `create:agent` with `confidenceFloored` true clustered with floored rows. If it shows a different cause, mark T044 `[B]` with that cause.
- [ ] T042 [P] CARRY-003 (b): in `$ADV/tests/command-policy-derivation.vitest.ts`, add a case that builds a fixture skills root through the file's existing fixture seam with one standalone skill whose `command-metadata.json` declares a command that `scoring-compatibility.json` does not list, and asserts the derived entry is enabled for both `typescript` and `python`. Verify: in `ADV`, `npx vitest run tests/command-policy-derivation.vitest.ts` reports 0 failed.
- [ ] T043 [P] CARRY-003 (c): add `which packets mention` to `userIntent.ownedSignals` of `/speckit:search` in `.skilled/skills/system-spec-kit/command-metadata.json`. Verify: `jq -c '.[] | select(.command == "/speckit:search") | .userIntent.ownedSignals | index("which packets mention")' .skilled/skills/system-spec-kit/command-metadata.json` prints a number.

### CARRY-003 wave C2
- [ ] T044 CARRY-003 (a): in `clustersWithTop` (`$ADV/lib/scorer/ambiguity.ts`), when both the top and the member carry `confidenceFloored`, cluster on the score margin alone. Verify: in `ADV`, `npx vitest run tests/scorer` reports 0 failed and `$P` prints `[159,50,20,5]`. If `$P` moves, revert the change and mark this task `[B]` with the printed numbers.
- [ ] T045 Run `node $D`. Verify: `node $D --check | jq -r .status` prints `fresh`.

### CARRY-003 wave C3
- [ ] T046 Run `npm run build` in `ADV`, then `node $C --write`. Verify: `node $C | $M` prints `[]` as its fourth line with the first three lines as in T001, `$P` prints `[159,50,20,5]`, and `$REC '{"prompt":"show me which packets mention the token cap"}' | jq -c '[.data.recommendations[] | select(.command == "/speckit:search") | .policy]'` prints `["run"]`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T047 Run `npm run build` in `ADV` and in `.skilled/skills/system-spec-kit/runtime`. Verify: `$REC '{"prompt":"save context"}' | jq '[.data.recommendations[] | select(.command == "/speckit:save")] | length'` prints 1, and `$REC '{"prompt":"/speckit:plan add a login page"}' | jq -c '.data.recommendations[0] | {kind,command,policy,ownerSkillId}'` prints `{"kind":"command","command":"/speckit:plan","policy":"start","ownerSkillId":"system-spec-kit"}`.
- [ ] T048 Run `node $S/brief-heads.mjs > $S/brief-heads-after.txt`. Verify: the first line reads `Advisor: live; use system-spec-kit → /speckit:plan (start) 0.82/0.16 pass.`, the git hooks line contains `/doctor:git hooks (ask)`, and `rg -c "command-" $S/brief-heads-after.txt` prints nothing.
- [ ] T049 With Ollama up, run `node $RC --hub sk-doc > $S/reach-after.txt`. Verify: it exits 0 and prints `outranked=0` and `RESULT: PASSED`.
- [ ] T050 Run `$S/hook-latency.mjs` three times (`$S/hook-latency-after-{1,2,3}.json`). Verify: the middle median is at most 25 ms over the T003 middle median and the middle p95 at most 40 ms over the T003 middle p95.
- [ ] T051 Run every gate. Verify: `node $D --check | jq -r .status` prints `fresh`, `$ROLL` prints `{"ask":17,"run":7,"start":20}`, `$P` prints `[159,50,20,5]`, `$TC` exits 0, `python3 $ADV/tests/python/test_skill_advisor.py` exits 0, `node $RT` exits 0, `node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs | tail -1` reports `failed=0` and `npm test` in `ADV` reports 0 failed.
- [ ] T052 Check the boundaries. Verify: `git -c core.fsmonitor=false diff --quiet HEAD -- AGENTS.md` exits 0, and `git -c core.fsmonitor=false diff HEAD -U0 -- .skilled | rg "^\+.*(//|#).*(specs/|REQ-0|T0[0-9]{2}|CARRY-003)"` prints nothing.
- [ ] T053 Write `implementation-summary.md` and mark each row in `acceptance-criteria.md` with its evidence. Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <this folder> --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`, or the CARRY-003 tasks T041 to T046 removed by an operator decision to drop the group
- [ ] No `[B]` blocked tasks remaining
- [ ] The six golden briefs pass and `save context` returns one entry carrying `/speckit:save`. The reach check prints `RESULT: PASSED`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
- **Review**: `../../007-command-surfacing-and-workflow-enforcement/research/synthesis-review.md`
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

A blocked task gets `[B]` and one line naming what blocks it. A moved pinned number blocks the phase.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] The before numbers, brief heads, reach check, timing and suite are in `$S` (T001 to T005).
- [x] CHK-002 [P0] The four design questions have an operator answer. Evidence: 2026-11-12, each the recommended option, recorded in `spec.md` section 10.
- [x] CHK-003 [P1] The operator keeps CARRY-003. Evidence: "Carry three, settle five (Recommended)".
- [ ] CHK-004 [P0] The coordinator confirmed phase 007's before-measurement is done before wave 1 started.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `$TC` exits 0.
- [ ] CHK-011 [P0] No code comment names a spec path, a phase number or a task id (T052).
- [ ] CHK-012 [P1] Every command string and policy a reader shows comes from the generated table, and none is hand-kept.
- [ ] CHK-013 [P1] A missing field, an unknown id or a missing policy renders without an error (T021).
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] The schema test and the six golden briefs pass (T014, T021).
- [ ] CHK-021 [P0] The floors hold (T037, T051).
- [ ] CHK-022 [P1] The degraded and older-daemon cases pass (T022, T023).
- [ ] CHK-023 [P1] The reach check passes with real embeddings, and the other-hub fixture still fails (T015, T049).
- [ ] CHK-024 [P1] `nm-sk-doc-01` tops at `sk-doc` with no recall or pinned number lower (T057).
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [ ] CHK-FIX-001 [P0] The gap is class `contract`: the public output lacks fields its readers need.
- [ ] CHK-FIX-002 [P0] Every reader of the old doctor block is updated: `rg -n "DOCTOR_COMMAND_STRINGS|doctorCommandString" $ADV --glob '!dist'`.
- [ ] CHK-FIX-003 [P0] Every reader of `ownerSkillId` and `command` is listed: `rg -n "ownerSkillId|\.command\b" $ADV $HK .skilled/skills/sk-doc/sk-create-skill/scripts --glob '!dist' --glob '!node_modules'`.
- [ ] CHK-FIX-004 [P1] The renderer matrix axes from `plan.md` are each a test row.
- [ ] CHK-FIX-005 [P1] Evidence names the commit it ran on.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] Every label part passes `sanitizeSkillLabel`.
- [ ] CHK-031 [P0] The relabel script prints no prompt text (T035).
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] `spec.md`, `plan.md`, `tasks.md` and `implementation-summary.md` state the same fields and numbers.
- [ ] CHK-041 [P1] The hook doc, the feature catalog entry and the bridges README match the code (T038 to T040).
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Probes, timing runs, the relabel script and capture output live in `scratch/` only.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 1/12 |
| P1 Items | 11 | 1/11 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-11-12
<!-- /ANCHOR:summary -->
