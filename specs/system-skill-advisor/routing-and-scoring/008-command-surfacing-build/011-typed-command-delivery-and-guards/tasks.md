---
title: "Tasks: Phase 11: typed-command-delivery-and-guards"
description: "Ordered worker-sized tasks that generate one table of tracked commands, attach a typed command to the top recommendation, put the owner first for a typed command with no scorer row, measure the typed block in the command capture and add the mirror visibility guard, hook health, a head length test and a brief cost script."
trigger_phrases:
  - "typed command delivery tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 11: typed-command-delivery-and-guards

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
| `[C]` | Coordinator task: a live model session, an arena or an operator step. No worker runs it |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

Every command runs from the repository root unless a task says otherwise.
- `ADV` is `.skilled/skills/system-skill-advisor/runtime`. `TC` is `npm run typecheck` in `ADV`, which must exit 0. `BLD` is `npm run build` in `ADV`, which must exit 0.
- `CA` is `$ADV/lib/command-attach.ts` and `CAT` its test `$ADV/tests/command-attach.vitest.ts`. `VCA` is `npx vitest run tests/command-attach.vitest.ts` in `ADV`.
- `DB` is `$ADV/scripts/command-bridges/derive-command-bridges.cjs`. `DBC` is `node $DB --check | jq -r .status`, which must print `fresh`. `CBR` is `$ADV/scripts/command-bridges/README.md`.
- `FU` is `$ADV/lib/scorer/fusion.ts`. `FT` is `$ADV/tests/scorer/typed-command-owner.vitest.ts` (new) and `VFT` is `npx vitest run tests/scorer/typed-command-owner.vitest.ts` in `ADV`.
- `AR` is `$ADV/handlers/advisor-recommend.ts`. `ART` is `$ADV/tests/handlers/advisor-recommend-typed-command.vitest.ts` (new) and `VART` is `npx vitest run tests/handlers/advisor-recommend-typed-command.vitest.ts` in `ADV`.
- `HT` is `$ADV/tests/command-head-length.vitest.ts` (new) and `VHT` is `npx vitest run tests/command-head-length.vitest.ts` in `ADV`.
- `CAP` is `$ADV/scripts/routing-accuracy/capture-command-routing-baseline.mjs`. `BASE` is `$ADV/scripts/routing-accuracy/command-routing-baseline.json`. `CORPUS` is `$ADV/scripts/routing-accuracy/command-prompts.jsonl`. `RS` is `npx vitest run tests/command-routing-slice.vitest.ts` in `ADV`. `RA` is `$ADV/scripts/routing-accuracy/README.md`.
- `MBC` is `$ADV/scripts/measure-brief-cost.mjs` (new). `OF` is `$ADV/scripts/routing-accuracy/command-offer.mjs`. `HOOK` is `.skilled/skills/system-spec-kit/runtime/dist/hooks/claude/user-prompt-submit.js`.
- `SCH` is `$ADV/schemas/advisor-tool-schemas.ts`. `ST` is `$ADV/handlers/advisor-status.ts`. `STT` is `$ADV/tests/handlers/advisor-status.vitest.ts` and `VST` is `npx vitest run tests/handlers/advisor-status.vitest.ts tests/schemas/advisor-tool-schemas.vitest.ts` in `ADV`.
- `SRM` is `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs`, `SRMT` is `.skilled/skills/system-spec-kit/runtime/cli/tests/sync-runtime-mirrors.test.mjs` and `SRR` is `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/README.md`.
- `DS` is `.skilled/commands/doctor/scripts`. `DSY` is `.skilled/commands/doctor/assets/doctor-setup.yaml`. `DCT` is `node --test $DS/tests/doctor-runtime-mirrors-contract.test.cjs $DS/tests/doctor-setup-orphan-line.test.cjs`. `IG` is `INSTALL-SKILLED.md`. `SP` is this phase's `scratch/` folder.
- `FLOOR` is `node $CAP | jq -c '.metrics.typed_recall_at_1, .metrics.false_offer'`, which must print at least `{"correct":24,"total":44}` and exactly `{"count":0,"total":35}`.
- `EVAL` is `node $ADV/scripts/routing-accuracy/capture-scorer-eval-baseline.mjs | jq -c '[.metrics.full_corpus_top1.correct,.metrics.holdout_top1.correct,.metrics.ambiguity_top1.correct,.metrics.gold_none_false_fire.value]'`, which must print numbers no lower than `[159,50,20]` with the fourth no higher than 5.
- `PY` is `python3 $ADV/tests/python/test_skill_advisor.py`, which must exit 0. `PAR` is `npx vitest run tests/parity/python-ts-parity.vitest.ts` in `ADV`, which must report 0 failed.

Rules for every task:
- Each task is one change to the files it names. A task that names a module and its test adds the behaviour and the cases that pin it.
- No task reads or prints holdout prompt text. A script filters on `split` before it uses a prompt and prints row ids only.
- No worker starts a live model session. Running the Claude prompt hook or the advisor CLI is not a model session, and both run in a sandboxed socket directory here.
- No code comment may name a spec path, a phase number, a task id, an ADR or a REQ id. State the durable reason instead. T024 checks it.
- No task writes to the home folder, installs anything, edits `AGENTS.md`, renames a command or edits a file under `.skilled/commands/create/`.
- A `.md` edit routes through `sk-doc` and a code edit through `sk-code` before the first write.

Worker waves. Tasks in one wave touch different files and can run in parallel. Each task owns the files in parentheses.
- Wave 0: T001 (`$SP/before.txt`), T002 (`$SP/typed-before.json`). Read-only for the repository.
- Gate: no task from wave 1 on starts before the coordinator confirms that phases 005, 008 and 010 are committed, because they edit `AR`, `CA`, `ST`, `SCH`, `DSY`, `IG` and `RA`.
- Wave 1: T003 (`DB`, `CA`), T004 (`SRM`, `SRMT`), T005 (`SCH`), T006 (`MBC`), T007 (`IG`).
- Wave 2: T008 (`CA`, `CAT`), T009 (`ST`, `STT`), T010 (`DSY`), T011 (`SRR`).
- Wave 3: T012 (`FU`, `FT`), T013 (`AR`, `ART`), T014 (`HT`).
- Wave 4: T015 (`CAP`), T016 (`AR`).
- Wave 5: T017 (`BASE`), T018 (`RA`), T019 (`CBR`).
- Wave 6, one at a time because both start a sandboxed daemon: T020 (`$SP/typed-heads.mjs`, `$SP/typed-heads.json`), T021 (`$SP/brief-cost.json`).
- Verification, one at a time: T022, T023, T024, T025.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Record the before numbers (`$SP/before.txt`). Run `FLOOR`, `node $CAP | jq -c '.metrics.slash_variant.reached_top3, .metrics.typed_reach_top3, .metrics.agreement, .attachedMetrics.false_offer_attached, .attachedMetrics.plain'`, `EVAL`, `TC`, `PY`, `DBC`, `RS`, `PAR`, `VCA`, `VST`, `node --test $SRMT`, `node $SRM --check` and `DCT`, and write each command with its last output line or exit code into `before.txt`. Verify: `FLOOR` prints `{"correct":24,"total":44}` and `{"count":0,"total":35}`, `EVAL` prints numbers no lower than `[159,50,20]` and a fourth no higher than 5, `TC` and `PY` exit 0, `DBC` prints `fresh`, `node $SRM --check` exits 0 and `wc -l < $SP/before.txt` prints at least 15. When a gate is red here, stop and mark the phase `[B]` with that line, because a red before number cannot be held.
- [x] T002 Record each typed row's state (`$SP/typed-before.json`): run `node $CAP | jq '[.rows | to_entries[] | select(.key | endswith("-typed-01")) | {id: .key, top: .value.top, top1: .value.top1}] as $t | .attachedMetrics.attachedRows as $a | [$t[] | . + {attached: ($a[.id] // null)}]' > $SP/typed-before.json`. Verify: `jq 'length' $SP/typed-before.json` prints 44, `jq '[.[] | select(.top1)] | length' $SP/typed-before.json` prints 24 and `jq -r '.[] | keys[]' $SP/typed-before.json | sort -u | tr '\n' ' '` prints `attached id top top1 `.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Wave 1
- [x] T003 [P] Generate one table of every tracked command (`DB`, `CA`). In `CA`, above `// BEGIN GENERATED COMMAND ROWS`, add `export interface TrackedCommand { readonly policy: 'run' | 'start' | 'ask'; readonly ownerSkillId: string; readonly scorerRow: boolean; }` with a comment saying the table covers every tracked command, whether or not its bridge is active, so a typed command always has a policy and an owner. In `DB`'s `renderCommandRows(entries, policies)`, build a third map over every entry, with no enabled filter: key `entryRunnable(entry)`, value `{ policy: runnablePolicy(runnable, policies), ownerSkillId: entry.skillId, scorerRow: entry.runtime.typescript.enabled === true }`. Throw `[command-bridges] Conflicting tracked command <runnable>` when one runnable repeats with a different owner or policy. Render it after the `COMMAND_POLICIES` block as `export const TRACKED_COMMANDS: Readonly<Record<string, TrackedCommand>> = {` with one line per key in sorted order, shaped `  '<runnable>': { policy: '<policy>', ownerSkillId: '<owner>', scorerRow: <true|false> },`, and `};`. Run `node $DB`. Do not edit the generated block by hand. Verify: `DBC` prints `fresh`, `rg -c "scorerRow: (true|false) \},$" $CA` prints at least 44, `rg -n "'/create:goal': \{ policy: 'start', ownerSkillId: 'sk-doc', scorerRow: false \}," $CA` and `rg -n "'/speckit:resume': \{ policy: 'start', ownerSkillId: 'system-spec-kit', scorerRow: true \}," $CA` each print one line, `TC` exits 0, `npx vitest run tests/command-bridges-drift-guard.vitest.ts tests/command-attach.vitest.ts` in `ADV` reports 0 failed and `git -c core.fsmonitor=false diff --stat HEAD -- $ADV/scripts/skill_advisor.py $ADV/lib/scorer/projection.ts` prints nothing.
- [x] T004 [P] Add a command visibility count and a collapse guard to the mirror check (`SRM`, `SRMT`). Add `const COLLAPSE_ALLOWLIST = new Set(['create/skill.md'])` with a comment saying Claude Code reads a command folder holding `skill.md` as one skill and hides its siblings, and the existing case is kept until the commands are renamed. Add and export `commandVisibility(expectedLinks)`: it takes the `claude-commands` links whose path below `.claude/commands/` holds a folder, counts them as `total`, and counts Claude's `visible` as one per folder that holds `skill.md` plus every command in the other folders. Cursor's `visible` is `total`, because Cursor uses flat names. Add and export `collapseDrift(expectedLinks)`, which returns `COLLAPSE <folder>/skill.md hides <n> sibling commands on Claude Code` for each folder holding `skill.md` whose path is not in the allowlist. In `checkMirrors`, add those lines to `drift`, and before the PASS line print `[runtime-mirror-sync] visibility claude <visible>/<total>, cursor <total>/<total>`. Keep the PASS line as it is. In `SRMT`, add one case where synthetic links for `create/skill.md`, `create/readme.md` and `deep/review.md` give `{ claude: { visible: 2, total: 3 }, cursor: { visible: 3, total: 3 } }` and no drift, and one where an added `design/skill.md` beside `design/chart.md` gives `['COLLAPSE design/skill.md hides 1 sibling commands on Claude Code']`. Verify: `node --test $SRMT` reports `fail 0`, `node $SRM --check` prints a line containing `visibility claude 32/44, cursor 44/44` and exits 0, and `DCT` reports `fail 0`.
- [x] T005 [P] Add `hookHealth` to the status output schema (`SCH`). In `AdvisorStatusOutputSchema`, after `embeddingsHealth`, add `hookHealth: z.object({ invocations: z.number().int().positive(), rollingP95Ms: z.number().nonnegative(), rollingFailOpenRate: z.number().min(0).max(1), rollingCacheHitRate: z.number().min(0).max(1) }).strict().optional()`. Verify: `TC` exits 0, `rg -c "hookHealth" $SCH` prints 1 and `npx vitest run tests/schemas/advisor-tool-schemas.vitest.ts` in `ADV` reports 0 failed.
- [x] T006 [P] Create `MBC`. `node $MBC [--rows <id,id>] [--root <dir>]` reads `CORPUS` under `--root` (default the current directory), keeps rows with `row_type` `typed` and `split` `none`, and with `--rows` keeps only the named ids, exiting 2 with `{"error":"holdout_row","id":"<id>"}` for a row whose split is `holdout` and `{"error":"unknown_row","id":"<id>"}` for an id it cannot find, before it spawns anything. It makes one directory with `mkdtempSync(join(tmpdir(), 'ssa-cost-'))`, and for each row pipes `{"prompt":<prompt>,"cwd":<root>,"hook_event_name":"UserPromptSubmit","session_id":"cost-<id>"}` into `node <root>/$HOOK` with `SPECKIT_IPC_SOCKET_DIR` set to that directory and a 30,000 ms timeout. It takes `hookSpecificOutput.additionalContext` (or the empty string), and records `bytes` as its UTF-8 length and `estimatedTokens` as `Math.ceil(bytes / 4)`, the renderer's own four characters per token. It prints one JSON object `{ rows: [{ id, bytes, estimatedTokens }], totalBytes, medianBytes, maxBytes }` and never prints a prompt. At the end it sends `SIGTERM` only to a process whose command line names that directory and removes the directory. Verify: `node --check $MBC` exits 0, `node $MBC --rows cmd-speckit-save-typed-01 | jq -c '.rows[0] | [.id, (.bytes > 0), (.estimatedTokens == ((.bytes + 3) / 4 | floor))]'` prints `["cmd-speckit-save-typed-01",true,true]`, `node $MBC --rows "$(jq -r 'select(.split=="holdout") | .id' $CORPUS | head -1)"` exits 2 and prints `holdout_row`, and `ls -d "$TMPDIR"/ssa-cost-* 2>/dev/null` prints nothing.
- [x] T007 [P] In `IG`, under `### Check the Install`, add one paragraph after the paragraph about Codex hook approval: to see the advisor answer a prompt, run `node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"create a readme for the utils folder"}' --format json | jq -r '.data.recommendations[0].skillId'`, which prints one skill id such as `sk-doc`, and when it prints nothing or `null`, run `/doctor:skill-advisor rebuild`. Re-read the section first, because phase 008 also edits section 2. Verify: `rg -c "advisor_recommend --json" $IG` prints 1, and the documented command prints one line that is neither empty nor `null`.

### Wave 2
- [x] T008 [P] Add two typed command helpers (`CA`, `CAT`). `typedCommandIn(prompt)` lowercases the prompt and returns the longest `TRACKED_COMMANDS` key found at a position where the character before it is absent, whitespace, a backtick, a quote or `(`, and the character after it is absent or not a word character, colon or hyphen. It returns undefined when none is found. `typedCommandForTop(topSkillId, prompt)` takes that key and returns `{ command, policy, ownerSkillId }` from its row when `topSkillId` is the row's `ownerSkillId` or `commandRowFor(topSkillId)?.command` equals the key, and undefined otherwise. In `CAT`, add cases: `/create:skill-parent deploy-hub with three modes` gives `/create:skill-parent`, `/create:sk` gives undefined, `see docs/create:goal.md` gives undefined, `typedCommandForTop('system-spec-kit', '/speckit:resume cache work')` gives `{ command: '/speckit:resume', policy: 'start', ownerSkillId: 'system-spec-kit' }`, `typedCommandForTop('command-speckit-resume', '/speckit:resume cache work')` gives the same and `typedCommandForTop('sk-doc', '/speckit:resume cache work')` gives undefined. Verify: `VCA` reports 0 failed and `TC` exits 0.
- [x] T009 [P] Report hook health in the status (`ST`, `STT`). Run after phase 008, which edits `readSemanticLaneHealth` and `handleAdvisorStatus` in the same file. In `readAdvisorStatus`, in the `output` object of the success path (the one inside `try`, right after `laneWeights: DEFAULT_SCORER_WEIGHTS,`), add `hookHealth` from `readAdvisorHookHealthSection(workspaceRoot)` (`$ADV/lib/metrics.ts`) when its `lastInvocations` is not empty: `invocations` is the length of `lastInvocations` and the three rolling fields copy over. Leave the error path as it is. Add a comment saying the p95 counts cache-hit invocations only. In `STT`, add one case that writes two valid diagnostic records with `persistAdvisorHookDiagnosticRecord` for a temporary workspace root and reads `hookHealth.invocations` 2, and one case for a root with no records that reads no `hookHealth` key. Verify: `VST` reports 0 failed and `TC` exits 0.
- [x] T010 [P] Show hook health under the setup advisor leg (`DSY`). Run after phase 008, which adds an embedder leg after this one. In the single list item that starts `- "Leg advisor:`, append before its closing quote: ` When data.hookHealth is present, show hook p95 <rollingP95Ms> ms over <invocations> prompts and fail-open <rollingFailOpenRate as a percent> under the leg. It never changes the leg's status.` Change nothing else. Verify: `rg -c "hookHealth" $DSY` prints 1 and `DCT` reports `fail 0`.
- [x] T011 [P] In `SRR` section 5, add two sentences after the check command: the check also prints how many tracked commands each runtime shows, and it fails when a command folder other than `create/` holds a `skill.md`, because Claude Code would then hide that folder's other commands. Verify: `rg -n "skill.md" $SRR` prints at least one line in section 5.

### Wave 3
- [x] T012 [P] Put the owner first for a typed command with no scorer row (`FU`, `FT`). Import `typedCommandIn` and `TRACKED_COMMANDS` from `../command-attach.js`. Export `rankTypedCommandOwnerFirst(ranked, promptLower)`: when `typedCommandIn(promptLower)` names a row with `scorerRow` false and that row's owner is at an index above 0 with `passes_threshold` true, return the list with the owner moved to index 0 and every other entry in its order. Otherwise return `ranked` unchanged. In `scoreAdvisorPrompt`, call `ranked = rankTypedCommandOwnerFirst(ranked, promptLower);` right after the `applyDoctorHelperHandoff` statement and before `const passing`. Add a comment saying a typed command with no row of its own can only reach the reader through its owner, so the owner must lead. In `FT`, add cases on synthetic lists: `/create:goal x` with `sk-doc` passing at index 1 moves it first, the same with `sk-doc` not passing changes nothing, `/speckit:save x` (a command with a scorer row) changes nothing and a prompt with no slash changes nothing. Verify: `VFT` reports 0 failed and `TC` exits 0.
- [x] T013 [P] Attach a typed command to the top recommendation (`AR`, `ART`). Import `typedCommandForTop` from `../lib/command-attach.js` and export `attachTypedCommand(output, prompt)`: when `output.recommendations[0]` exists and `typedCommandForTop(top.skillId, prompt)` returns a row, return `AdvisorRecommendOutputSchema.parse` of the output with the first recommendation's `command`, `policy` and `ownerSkillId` set from that row, replacing any compiled route command. Otherwise return `output` itself. In `computeRecommendationOutput`, wrap both final returns, the cached one and the last one, as `return attachTypedCommand(<the existing expression>, input.prompt);`. Add a comment saying a typed command is the reader's own choice, so it outranks a routed mode. In `ART`, add cases: a top `system-spec-kit` with prompt `/speckit:resume cache work` carries `/speckit:resume`, `start` and `system-spec-kit`, a top `sk-doc` already carrying `/create:readme` with prompt `/create:goal retrofit` carries `/create:goal` and `start`, a top `mcp-tooling` with that prompt returns the same object and a prompt with no slash returns the same object. Verify: `VART` reports 0 failed and `TC` exits 0.
- [x] T014 [P] Create `HT`. For every key of `TRACKED_COMMANDS`, render `renderAdvisorBrief` with one passing `skill` recommendation for the row's owner that carries the key as `command`, its `policy` and its `ownerSkillId`, freshness `live` and `metrics: { tokenCap: 80 }`, in the shape `$ADV/tests/command-brief-golden.vitest.ts` uses. Do the same for every id in `COMMAND_ROWS` as a `command` recommendation. Take the head before `DIRECTIVES_LABEL` and assert that `Buffer.byteLength(head, 'utf8')` is at most `HEAD_BYTE_LIMIT`, that the head does not end with `...` and that it contains `<command> (<policy>)`. Define `HEAD_BYTE_LIMIT` as `80 * 4` with a comment naming the renderer's default token cap and its four characters per token. Add one case where a synthetic 330-character command fails the same check. Verify: `VHT` reports 0 failed and at least 45 passed tests.

### Wave 4
- [x] T015 Add the typed block to the command capture (`CAP`). Import `typedCommandForTop` and `TRACKED_COMMANDS` from the built attach module the script already loads. For each row with `row_type` `typed`, compute `delivered` as `typedCommandForTop(topId, row.prompt)?.command ?? attached`, the same precedence as the handler, and `policy` as `TRACKED_COMMANDS[delivered]?.policy ?? null`. Count `own` when `top1Hit`, else `attached` when `delivered` equals the expected command and `policy` is not null, in a tally built with `emptyAttachedTally` and `addAttachedRow`. Add `typed: attachedTallyJson(...)` to `attachedMetrics`, and `typedRows`, keyed by row id in sorted order, each `{ expected_command, top, carried, command, policy }`, where `carried` is `own`, `attached` or null. Write no prompt text. Leave every existing key and its computation unchanged. Verify: after `BLD`, `node $CAP | jq -c '.attachedMetrics.typed'` prints `{"own":24,"attached":20,"combined":44,"total":44}`, `node $CAP | jq -c '[.attachedMetrics.typedRows[] | keys] | unique'` prints `[["carried","command","expected_command","policy","top"]]` and `FLOOR` prints `{"correct":24,"total":44}` and `{"count":0,"total":35}`.
- [x] T016 Take a hub-attached command's policy from the new table (`AR`). In `enrichCompiledRoutes`, replace the spread that reads `COMMAND_POLICIES` with `...(Object.hasOwn(TRACKED_COMMANDS, command) ? { policy: TRACKED_COMMANDS[command].policy } : {})`, import `TRACKED_COMMANDS` and drop `COMMAND_POLICIES` from the import when nothing else uses it. Verify: `rg -c "COMMAND_POLICIES" $AR` prints nothing or 0, `rg -c "TRACKED_COMMANDS\[command\]" $AR` prints 1, `TC` exits 0 and `VART` reports 0 failed.

### Wave 5
- [x] T017 Rebuild and recapture the command baseline (`BASE`). Run `BLD`, then `node $CAP --write`. Verify: `jq -c '.attachedMetrics.typed' $BASE` prints `{"own":24,"attached":20,"combined":44,"total":44}`, `jq -c '.metrics.typed_recall_at_1, .metrics.false_offer, .attachedMetrics.false_offer_attached' $BASE` prints `{"correct":24,"total":44}`, `{"count":0,"total":35}` and `{"count":0,"total":35}`, `jq '.metrics.slash_variant.reached_top3' $BASE` prints at least the value in `$SP/before.txt`, `jq -c '.attachedMetrics.plain' $BASE` equals the line in `$SP/before.txt` and `RS` reports 0 failed.
- [x] T018 [P] In `RA`, describe `attachedMetrics.typed` and `attachedMetrics.typedRows`, the rule that a typed command travels on its owner, and `measure-brief-cost.mjs` with its flags, its output keys and its sandbox. Verify: `rg -c "attachedMetrics.typed|typedRows|measure-brief-cost" $RA` prints at least 3.
- [x] T019 [P] In `CBR`, describe `TRACKED_COMMANDS`: one row per bridge entry with its policy, its owner and `scorerRow`, generated whether or not the bridge is active. Verify: `rg -c "TRACKED_COMMANDS|scorerRow" $CBR` prints at least 2.

### Wave 6
- [x] T020 Check the real heads (`$SP/typed-heads.mjs`, `$SP/typed-heads.json`). Write a script that reads `CORPUS`, keeps rows with `row_type` `typed` and `split` `none`, makes one directory with `mkdtempSync(join(tmpdir(), 'ssa-typed-'))`, pipes each row's payload (the shape of T006, session id `typed-<id>`) into `node $HOOK` with `SPECKIT_IPC_SOCKET_DIR` set to it, takes the first line of `additionalContext` and reads it with `parseOffer` from `OF`. It writes `[{ id, offeredCommand, offeredPolicy, commandMatches, policyPresent, labelAgrees }]` to `typed-heads.json`, where `commandMatches` compares the `/<namespace>:<name>` part of the offer with the row's `expected_command`, `policyPresent` is true for `run`, `start` or `ask` and `labelAgrees` compares the policy with the row's `expected_policy`. It stops and removes its sandbox as T006 does and prints no prompt. Verify: `jq '[.[] | select(.commandMatches and .policyPresent)] | length' $SP/typed-heads.json` prints 44, `jq -r '[.[] | select(.labelAgrees | not) | .id] | join(",")' $SP/typed-heads.json` prints `cmd-design-extract-typed-01,cmd-doctor-env-typed-01,cmd-doctor-update-typed-01` and `ls -d "$TMPDIR"/ssa-typed-* 2>/dev/null` prints nothing.
- [x] T021 Measure the brief cost (`$SP/brief-cost.json`). Run `node $MBC > $SP/brief-cost.json`. Verify: `jq '.rows | length' $SP/brief-cost.json` prints 44, `jq '.maxBytes > 0 and .medianBytes > 0' $SP/brief-cost.json` prints `true` and `ls -d "$TMPDIR"/ssa-cost-* 2>/dev/null` prints nothing.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T022 Run every floor. Verify: `FLOOR` prints `{"correct":24,"total":44}` and `{"count":0,"total":35}`, `EVAL` prints numbers no lower than its line in `$SP/before.txt` and no lower than `[159,50,20]` with the fourth no higher than 5, `TC` exits 0, `PY` exits 0, `DBC` prints `fresh`, `RS`, `PAR`, `VCA`, `VFT`, `VART`, `VHT` and `VST` report 0 failed, `node --test $SRMT` and `DCT` report `fail 0` and `node $SRM --check` exits 0. Write the outputs beside the before lines in `$SP/after.txt`.
- [x] T023 Read hook health live. Make one directory with `D=$(mktemp -d "$TMPDIR/ssa-status-XXXXXX")`, run `SPECKIT_IPC_SOCKET_DIR="$D" node .skilled/bin/skill-advisor.cjs advisor_status --workspace-root "$PWD" --format json --no-warm-only | jq -r '.data.hookHealth.rollingP95Ms | type'`, then stop only a process whose command line names `$D` and remove `$D`. The Claude prompt hook runs in T020 and T021 wrote the diagnostic records it reads. Verify: the command prints `number`, and `ls -d "$TMPDIR"/ssa-status-* 2>/dev/null` prints nothing.
- [x] T024 Check the boundaries. Verify: `git -c core.fsmonitor=false diff --quiet HEAD -- AGENTS.md .skilled/commands/create` exits 0, `git -c core.fsmonitor=false diff HEAD -U0 -- .skilled | rg "^\+.*(//|#|\*).*(specs/|REQ-0|ADR-0|T0[0-9]{2}|phase [0-9])"` prints nothing and `git -c core.fsmonitor=false status --short -- .skilled INSTALL-SKILLED.md AGENTS.md` lists only files named in this phase's tasks.
- [x] T025 Write `implementation-summary.md` and mark each row in `acceptance-criteria.md` with its evidence. Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <this folder> --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] The committed baseline reads `attachedMetrics.typed.combined` 44 of 44 and every floor holds against `scratch/before.txt`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
- **Research**: `../009-ux-performance-cross-cli-research/research/research.md`
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

A blocked task gets `[B]` and one line naming what blocks it. A moved floor blocks the phase.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] The before numbers and the typed row state are in `scratch/` (T001, T002). Evidence: `scratch/before.txt` holds 19 lines and `jq length scratch/typed-before.json` prints 44.
- [x] CHK-002 [P0] The coordinator confirmed phases 005, 008 and 010 are committed before wave 1 started. Evidence: phase 005 closed in `48c3207a99`, phase 010 in `c9756510eb` and phase 008's code landed in `c909693acb` at 04:08 on 2026-11-13. The first wave 1 log is from 04:09 and `before.txt` ran at `c909693acb`.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `npm run typecheck` in `ADV` exits 0. Evidence: `TC exit: 0` in `scratch/after.txt`.
- [x] CHK-011 [P0] No code comment names a spec path, a phase number, a task id, an ADR or a REQ id (T024). Evidence: the added-comment scan over `.skilled` printed nothing on rerun.
- [x] CHK-012 [P0] The generated block is written by the deriver only, and its check prints `fresh` (T003, T022). Evidence: `DBC` printed `fresh` in `scratch/after.txt` and again on rerun.
- [x] CHK-013 [P1] A prompt with no typed command leaves the recommendation unchanged (T012, T013). Evidence: `VFT` and `VART` each passed 4 of 4, including the no-slash case that returns the input unchanged.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] Every floor holds (T022). Evidence: every line in `scratch/after.txt` equals or exceeds its line in `scratch/before.txt`, with `EVAL` at `[160,50,21,5]`.
- [x] CHK-021 [P0] The baseline reads 44 of 44 typed and the slice test passes (T017). Evidence: `jq -c '.attachedMetrics.typed' $BASE` printed `{"own":24,"attached":20,"combined":44,"total":44}` on rerun and `RS` passed 4 of 4.
- [x] CHK-022 [P0] The parity test and the Python test pass (T022). Evidence: `PAR` passed 2 of 2 and `PY` exited 0 in `scratch/after.txt`.
- [x] CHK-023 [P1] The real heads of all 44 typed rows carry their command and a policy (T020). Evidence: `scratch/typed-heads.json` holds 44 rows with `commandMatches` and `policyPresent` true.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] The gap is class `delivery`: the scorer finds the owner, and the command is lost between the scorer and the head. Evidence: `spec.md` section 2 traces each of the seven rows to an owner on top or a missing owner rank, with no command attached.
- [x] CHK-FIX-002 [P0] Every reader of the policy table is listed: `rg -n "COMMAND_POLICIES|TRACKED_COMMANDS" .skilled --glob '!**/node_modules/**' --glob '!**/dist/**'`. Evidence: the `rg` lists eight files. Seven changed in this phase. The eighth, `feature-catalog/cli-surface/advisor-recommend.md`, still names `COMMAND_POLICIES` and is recorded in `implementation-summary.md` as a limitation.
- [x] CHK-FIX-003 [P1] Both return paths of the recommend handler apply the typed step (T013). Evidence: `rg -n "attachTypedCommand\(" $AR` prints the definition and the two return sites.
- [x] CHK-FIX-004 [P1] Evidence names the commit it ran on. Evidence: `scratch/before.txt` names `c909693acb` and `scratch/after.txt` names the working tree on `731967bc25`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No task reads or prints holdout prompt text, and the cost script refuses a holdout row (T006). Evidence: `scratch/brief-cost.json` rows hold only `id`, `bytes` and `estimatedTokens`, `scratch/typed-heads.json` holds no prompt key and the T006 log shows a holdout id exiting 2 with `holdout_row`.
- [x] CHK-031 [P0] No task writes to the home folder or installs anything (T024). Evidence: `git status` lists only repository files, the cost and head scripts name no home path and both sandboxes live under the system temp folder.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `spec.md`, `plan.md`, `tasks.md` and `implementation-summary.md` state the same numbers. Evidence: the 44 of 44 typed block, the floors and the visibility line match across `spec.md`, `plan.md`, this file and `implementation-summary.md`.
- [x] CHK-041 [P1] The install guide, the setup asset and the three READMEs match the code (T007, T010, T011, T018, T019). Evidence: on rerun `rg -c` printed 1 for `INSTALL-SKILLED.md`, 1 for the setup asset, 4 for the routing-accuracy README and 2 for the command-bridges README, and the runtime-mirrors README names `skill.md` in section 5.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Probes, measurements and the hook check live in `scratch/` only. Evidence: `typed-heads.mjs`, `typed-heads.json`, `brief-cost.json`, `hook-health.json` and the before and after numbers are all under `scratch/`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 7 | 7/7 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-11-13
<!-- /ANCHOR:summary -->
