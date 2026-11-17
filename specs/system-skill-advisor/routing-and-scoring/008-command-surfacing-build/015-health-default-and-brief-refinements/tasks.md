---
title: "Tasks: Phase 15: health-default-and-brief-refinements"
description: "Ordered worker-sized tasks that write a prompt-free health record on every hook run with a degraded flag and the newest record time, narrow the needs-a-mode label to prompts that name the hub, let the top hub name its routed command, drop the OpenCode compiled-route line, make the brief-cost script read live heads only and fix two behaviour-arm counts and one DSH session id."
trigger_phrases:
  - "health default and brief refinements tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 15: health-default-and-brief-refinements

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
| `[C]` | Coordinator task: a build, a daemon restart, a live hook run, a store under the home folder or the full suite. No worker runs it |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

Every command runs from the repository root unless a task says otherwise.
- `ADV` is `.skilled/skills/system-skill-advisor/runtime` and `HK` is `.skilled/skills/system-skill-advisor/hooks`. `TC` is `npm run typecheck` in `ADV`, which must exit 0. `V <files>` is `env -u AI_SESSION_CHILD npx vitest run <files>` in `ADV`, which must report 0 failed. `VALL` is `V` with no file.
- `MET` is `$ADV/lib/metrics.ts`. `BRF` is `$ADV/lib/skill-advisor-brief.ts`. `FB` is `$HK/lib/skill-advisor-cli-fallback.ts`. `UPS` is `$HK/claude/user-prompt-submit.ts`. `ST` is `$ADV/handlers/advisor-status.ts`, `SCH` is `$ADV/schemas/advisor-tool-schemas.ts` and `STT` is `$ADV/tests/handlers/advisor-status.vitest.ts`.
- `CA` is `$ADV/lib/command-attach.ts` and `CAT` is `$ADV/tests/command-attach.vitest.ts`. `REC` is `$ADV/handlers/advisor-recommend.ts` and `RCT` is `$ADV/tests/handlers/advisor-recommend-compiled-route-option.vitest.ts`.
- `RA` is `$ADV/scripts/routing-accuracy`. `CAP` is `$RA/capture-command-routing-baseline.mjs`, `BASE` is `$RA/command-routing-baseline.json`, `CORPUS` is `$RA/command-prompts.jsonl` and `RAR` is `$RA/README.md`. `SLICE` is `V tests/command-routing-slice.vitest.ts`.
- `S` is `$RA/score-command-transcripts.mjs`, `T` is `$ADV/tests/command-transcript-score.vitest.ts` and `VT` is `V tests/command-transcript-score.vitest.ts`. `OF` is `$RA/command-offer.mjs` and `VO` is `V tests/command-offer.vitest.ts`. `R` is `$RA/run-command-behaviour.mjs`.
- `MBC` is `$ADV/scripts/measure-brief-cost.mjs` and `MBCT` is `$ADV/tests/measure-brief-cost.vitest.ts`, a new file.
- `PLG` is `.opencode/plugins/system-skill-advisor.js`, authored in place, with `.skilled/hooks/skill-advisor/opencode/system-skill-advisor.js` a link to it. `NPLT` is `.opencode/plugins/tests/system-skill-advisor.test.cjs` and `NPL` is `node --test $NPLT`, which must report `fail 0`.
- `DSY` is `.skilled/commands/doctor/assets/doctor-setup.yaml`. `DS` is `.skilled/commands/doctor/scripts` and `DALL` is `node --test $DS/tests/*.test.cjs`, which must report `fail 0`.
- `HD` is `$HK/skill-advisor-hook.md`, `HV` is `$HK/skill-advisor-hook-validation.md`, `ARCH` is `.skilled/skills/system-skill-advisor/ARCHITECTURE.md` and `FC` is `.skilled/skills/system-skill-advisor/feature-catalog/hooks-and-plugin/claude-hook.md`.
- `HOOK` is `.skilled/skills/system-spec-kit/runtime/dist/hooks/claude/user-prompt-submit.js`, the shim every hook runtime runs.
- `FINAL` is `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/007-per-runtime-behaviour-proof/scratch/runs-final.jsonl`, read-only. `SP` is this phase's `scratch/` folder.
- `FLOOR` is `node $CAP | jq -c '.metrics.typed_recall_at_1, .metrics.false_offer, .attachedMetrics.plain.tune, .attachedMetrics.false_offer_attached'`.
- `EVAL` is `node $RA/capture-scorer-eval-baseline.mjs | jq -c '[.metrics.full_corpus_top1.correct,.metrics.holdout_top1.correct,.metrics.ambiguity_top1.correct,.metrics.gold_none_false_fire.value]'`.
- `DRV` is `node $ADV/scripts/command-bridges/derive-command-bridges.cjs --check`, which must exit 0 and print `"changed": []`. `SRM` is `node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs --check`, which must exit 0.

Rules for every task:
- Each task is one change to the files it names. A task that names a module and its test adds the behaviour and the cases that pin it, and no other test.
- Re-read every file before the first edit. Phase 014 also edits `CA`, `CAP`, `R`, `S` and `DSY`. When an anchor quoted here is gone, mark the task `[B]` with the line you found and do not guess.
- No task reads or prints the prompt text of a row whose `split` is `holdout`. Scripts print row ids and counts only. A test or a `[C]` task may read a `tune` row's prompt from `CORPUS` by id after it checks the split.
- No worker starts a model session, ollama, a daemon or a behaviour arm, runs `HOOK` or writes under the home folder. Only `[C]` tasks do those.
- No code comment may name a spec path, a phase number, a task id or a rank id. State the durable reason instead. T033 checks it.
- Do not edit `AGENTS.md`, any file under `.skilled/commands/create/`, any `package.json`, a routing input, `$ADV/lib/render.ts` or `$ADV/tests/command-brief-golden.vitest.ts`. Add no dependency.
- A `.md` edit routes through `sk-doc` and a code edit through `sk-code` before the first write.
- When a verify prints something other than the expected output, do not change code to match it. Mark the task `[B]` with the printed line.

Worker waves. Tasks in one wave touch different files and can run in parallel. Each task owns the files in parentheses.
- Wave 0, coordinator, one at a time: T001 (`$SP/phase-014-files.txt`), T002 (`$SP/before.txt`).
- Gate: no task from wave 1 on starts before T001 confirms phase 014 is committed.
- Wave 1, which edits no `.ts` or `.json` file under `$ADV/lib`, `$ADV/handlers`, `$ADV/schemas` or `HK`, so the build T003 captures from stays fresh: T003 (`CAP`, `BASE`), T004 (`PLG`, `NPLT`), T005 (`MBC`, `MBCT`), T006 (`S`, `T`), T007 (`DSY` and at most one test under `$DS/tests`), T008 (`HD`), T009 (`HV`), T010 (`ARCH`), T011 (`FC`).
- Wave 2: T012 (`MET`, `STT`), T013 (`BRF`), T014 (`CA`, `CAT`, `REC`, `RCT`), T015 (`S`, `T`), T016 (`OF`), T017 (`HD`).
- Wave 3: T018 (`FB`), T019 (`UPS`), T020 (`ST`, `SCH`, `STT`), T021 (`REC`, `RCT`), T022 (`R`).
- Wave 4, coordinator: T023 (`$ADV/dist`, git-ignored).
- Wave 4b, the verifier follow-ups, before wave 5: T035 (`CAP`, the slice test), T036 (`T`), T037 (the command-offer test), T038 (`FC`, `HV`), T039 (`$ADV/tests/compiled-routing-consumption.vitest.ts`).
- Wave 5: T024 (`BASE`), T025 (`RAR`).
- Wave 6, coordinator, one at a time: T026 (`$SP/health-live.txt`), T027 (`$SP/live-heads.txt`), T028 (`$SP/render-entries-after.json`), T029 (`$SP/dsh-session.txt`), T030 (`$SP/brief-cost-live.json`), T031 (`$SP/summary-final-after.json`).
- Verification, coordinator, one at a time: T032 (`$SP/after.txt`), T033, T034 (`implementation-summary.md`, `acceptance-criteria.md`).
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 [C] Confirm phase 014 is committed and list where it touched this phase's files (`$SP/phase-014-files.txt`). Run `git -c core.fsmonitor=false log -1 --format='%h %s' -- specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/014-review-remediation` and `git -c core.fsmonitor=false show --name-only --format= <that commit>`, and write the files that also appear in `spec.md` section 3 into the file. Verify: the log prints one commit, `git -c core.fsmonitor=false status --short -- .skilled .opencode/plugins` prints nothing and the file names `CA`, `CAP`, `R`, `S` and `DSY` or says which of them phase 014 left alone.
- [x] T002 [C] Record the before numbers (`$SP/before.txt`). Run `git -c core.fsmonitor=false rev-parse --short HEAD`, `npm run build` in `ADV`, `FLOOR`, `EVAL`, `TC`, `VALL`, `NPL`, `DALL`, `DRV`, `SRM`, `jq -c '.attachedMetrics | [.needs_mode_floor, .needsModeRows]' $BASE` and `node $S --summary $FINAL --json | jq -cS 'map_values([.post.deliveryUnknown, .post.unsafe, .post.unscored])'`, and write each command with its last output line or exit code into the file. Verify: `FLOOR` prints `{"correct":24,"total":44}`, `{"count":0,"total":35}`, `{"own":8,"attached":15,"combined":23,"total":45}` and `{"count":0,"total":35}`, `EVAL` prints `[160,50,21,5]`, `TC` exits 0, `VALL` reports 0 failed, `NPL` reports `pass 42` and `fail 0`, `DALL` reports `fail 0`, `DRV` prints `"changed": []`, `SRM` exits 0, the `BASE` line prints `[null,null]`, the summary prints `{"claude":[0,0,0],"devin":[0,2,0],"dsh":[0,2,1],"opencode":[24,2,0],"pi":[0,1,0]}` and `wc -l < $SP/before.txt` prints at least 12. When a gate is red or phase 014 moved one of these values, stop and mark the phase `[B]` with that line, because every later expected value quotes these.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Wave 1
- [x] T003 [P] Report the rows whose head would read `(needs a mode)` and recapture the baseline (`CAP`, `BASE`). Add `const PROMPT_POLICY_MODULE = resolve(DIST, 'lib/prompt-policy.js')` beside `COMMAND_ATTACH_MODULE`, add it to the array the existence loop checks, import `extractMetalinguisticSkillMentions` from it after the `COMMAND_ATTACH_MODULE` import and add `routeNeedsMode` to that import's names. Before the corpus loop, declare `needsModeRows` as an empty array and `needsModeFloor` as 0. Inside the loop, hold the hub's route as `const route = topId !== undefined && COMPILED_ROUTING_HUBS.has(topId) ? readCompiledRoute(workspaceRoot, topId, row.prompt) : undefined` and pass `route` to `attachCommand` where the call reads the route inline today, so the label reuses the same lookup. After the line that sets `delivered`, add `const needsMode = route !== undefined && delivered === undefined && routeNeedsMode(topId, route, extractMetalinguisticSkillMentions(row.prompt))` and push `row.id` into `needsModeRows` when it is true. Inside the `wantsSilence` block, add 1 to `needsModeFloor` when `needsMode` is true. In `attachedMetrics`, right after `attachedRows`, add `needs_mode_floor: { count: needsModeFloor, total: falseOfferTotal }` and `needsModeRows: needsModeRows.sort()`. Above the `needsMode` line, add a comment saying a head shows that label only when nothing else names a command, so a row counts only when neither the typed command nor the route delivered one, and a silent row that carries it shows a label nobody asked for. Then run `node $CAP --write`. The build still holds the old rule, which ignores the third argument, so this capture records the before rows. Verify: `node --check $CAP` exits 0, `jq -c '.attachedMetrics.needs_mode_floor' $BASE` prints `{"count":3,"total":35}`, `jq -r '.attachedMetrics.needsModeRows | length' $BASE` prints 16, `jq -r '.attachedMetrics.needsModeRows[]' $BASE | rg -c '^(nm-sk-design-01|nm-sk-doc-01|nm-system-skill-advisor-01|cmd-speckit-save-plain-tune-01|cmd-create-repo-rule-plain-tune-01)$'` prints 5, `diff <(jq -S 'del(.capturedAtSha, .attachedMetrics.needs_mode_floor, .attachedMetrics.needsModeRows)' $BASE) <(git -c core.fsmonitor=false show HEAD:$BASE | jq -S 'del(.capturedAtSha)')` prints nothing and `SLICE` reports 0 failed.
- [x] T004 [P] Stop pushing the compiled-route line in the OpenCode transform (`PLG`, `NPLT`). Remove the block that starts at `const compiledLine = renderCompiledRouteSummaryLine(response.metadata?.compiledRouteSummary, {` and ends with the closing brace of `if (compiledLine) {`, which holds `output.system.push(compiledLine)` and `await observeBlock(compiledLine)`. Then remove `renderCompiledRouteSummaryLine` from the import list at the top of `PLG`, which nothing else in the file reads. Keep `compiledRouteSummary(data)`, the `compiledRouteSummary` metadata, the `boundedCompiledRouteSummary` option and its status line. Where the block was, add a comment saying the head entry already names the hub, its command and its policy, while the route summary keeps string targets only and the routes carry objects, so the second entry repeated the head with `targets=none`. In `NPLT`, in the test `flag-off route rendering and plugin delivery remain byte-identical to the baseline`, replace `assert.equal(output.system[1], baseline)` with `assert.equal(output.system.length, 1)`. Rename the test `bounded flag selects the bounded line in the OpenCode transform` to `bounding leaves the OpenCode transform with the head entry alone`, replace its two assertions on `output.system[1]` with `assert.equal(output.system.length, 1)` and remove its now unused `renderHelpers` line. Change no other test. Verify: `node --check $PLG` exits 0, `rg -c "renderCompiledRouteSummaryLine|output.system.push\(compiledLine\)" $PLG` prints nothing, `rg -c "compiledRouteSummary" $PLG` prints at least 2, `NPL` reports `pass 42` and `fail 0`, `V tests/system-skill-advisor-plugin.vitest.ts` reports 0 failed, `SRM` exits 0 and `readlink .skilled/hooks/skill-advisor/opencode/system-skill-advisor.js` prints `../../../../.opencode/plugins/system-skill-advisor.js`.
- [x] T005 [P] Read live heads only in the brief-cost script and refuse an arm with none (`MBC`, `MBCT`). In `MBC`, add `const LIVE_HEAD = 'Advisor: live'` beside the other constants. In `measureRow`, take `head` as the context's text before its first newline and return `headBytes` (its UTF-8 length) and `live` (`head.startsWith(LIVE_HEAD)`) after `id`, `bytes` and `estimatedTokens`. In `summarise`, keep `rows` as every measured row and compute `liveRows`, `totalBytes`, `medianBytes`, `maxBytes`, `medianHeadBytes` and `maxHeadBytes` over the live rows only, in that order after `rows`. In `main`, when no row is live write `{"error":"degraded_brief","rows":<measured count>,"liveRows":0}` and set `process.exitCode = 2`, else write the summary as today, so the sandbox cleanup in `finally` still runs. Add a comment saying a head that is not live is the fallback or outage line, whose bytes are not what a working install sends, so the cost is read from live heads alone and a run with none says so. Name the refusal in the header comment's usage block. Create `MBCT`: in a temporary root, write a corpus at `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-prompts.jsonl` with two typed rows on the `none` split, ids `cost-live` and `cost-stale` with prompts `live row` and `stale row`, and a CommonJS stub at `.skilled/skills/system-spec-kit/runtime/dist/hooks/claude/user-prompt-submit.js` that reads its stdin JSON and prints a `hookSpecificOutput.additionalContext` whose first line starts `Advisor: live` for a prompt that holds `live` and `Advisor: stale` otherwise, each followed by a second line. Case one runs `node <MBC> --root <tmp>` and expects exit 0, `liveRows` 1, two `rows`, the `cost-stale` row with `live` false and `medianHeadBytes` and `medianBytes` equal to the UTF-8 lengths of the live head and the live context. Case two runs `--rows cost-stale` on the same root and expects exit 2 and stdout `{"error":"degraded_brief","rows":1,"liveRows":0}`. Remove the root after each case. Verify: `node --check $MBC` exits 0, `V tests/measure-brief-cost.vitest.ts` reports 2 passed and `node $MBC --rows not-a-row` prints `{"error":"unknown_row","id":"not-a-row"}` and exits 2.
- [x] T006 [P] Count delivery unknown on every run line (`S`, `T`). In `addScored`, remove the statement that adds 1 to `tally.deliveryUnknown` when `result.briefDelivered` is `'unknown'`. In `summarize`, right after `tally.runs += 1`, add 1 to `tally.deliveryUnknown` when `line.briefDelivered` is neither `true` nor `false`. Add a comment saying a run that left no readable session still ran, and whether its brief arrived is as unknown as on a scored run, so the count covers every line the log holds. In `T`, in the case `leaves a crashed run with no session id unscored by the reader code`, add `deliveryUnknown: 1` to the expected `tune` block. Verify: `VT` reports 0 failed and `rg -n "deliveryUnknown \+= 1" $S` prints one line, inside `summarize`.
- [x] T007 [P] Rewrite the advisor leg's health text (`DSY`, and the one test under `$DS/tests` that pins phase 014's reason when `rg -l "hook health not recorded" $DS/tests` lists one). In the `Leg advisor:` step, replace `show hook p95 <rollingP95Ms> ms over <invocations> prompts and fail-open <rollingFailOpenRate as a percent> under the leg.` with `show hook p95 <rollingP95Ms> ms over <invocations> prompts, fail-open <rollingFailOpenRate as a percent>, degraded <rollingDegradedRate as a percent> and last record <lastRecordAt> under the leg.` Replace the sentence that holds `hook health not recorded`, or add one after the sentence above when there is none, with `When data.hookHealth is absent, show hook health not recorded under the leg, because no prompt hook has written a record for this checkout yet: OpenCode has no prompt hook that writes one and an unapproved Codex hook never runs.` Keep `It never changes the leg's status.` When a test pins the old reason, change only that expected text to the new sentence. Verify: `rg -c "SKILL_ADVISOR_DEBUG" $DSY` prints nothing, `rg -c "rollingDegradedRate" $DSY` prints 1, `rg -c "hook health not recorded" $DSY` prints 1 and `DALL` reports `fail 0`.
- [x] T008 [P] Describe the default record in the hook guide's Diagnostics row (`HD`). Replace `Records are written only with` and the rest of that sentence, which ends at `before exit.`, with `Every prompt writes a health record to the diagnostics sink with no prompt, skill label or error text, and an answer from the CLI's local scorer carries degraded: true. SKILL_ADVISOR_DEBUG adds the skill label and the error text. The subprocess hook waits up to 100 ms for pending writes before exit.`, keeping `degraded: true` and `SKILL_ADVISOR_DEBUG` in backticks. Verify: `rg -c "written only with" $HD` prints nothing and `rg -c "adds the skill label and the error text" $HD` prints 1.
- [x] T009 [P] Correct the durable-diagnostics step and its troubleshooting row in the hook validation guide (`HV`). Replace the sentence that starts `Durable JSONL writes only occur when` with `Every hook run writes a prompt-free health record to these sinks, and SKILL_ADVISOR_DEBUG=1 adds the skill label and the error text to each record.`, keeping `SKILL_ADVISOR_DEBUG=1` in backticks, and keep the code block after it. In the troubleshooting row whose symptom is `JSONL sink empty or unbounded`, replace the cause cell with `Metrics root misconfigured, no prompt hook ran in this checkout or rotation disabled`, and in the action cell replace `confirm` followed by the backticked `SKILL_ADVISOR_DEBUG=1` with `run one prompt through the hook`. Verify: `rg -c "only occur when" $HV` prints nothing, `rg -c "no prompt hook ran in this checkout" $HV` prints 1 and `rg -c "export SKILL_ADVISOR_DEBUG=1" $HV` prints 1.
- [x] T010 [P] Correct the Release validation paragraph (`ARCH`). Replace `The code writes them only when` and the rest of that sentence with `Each hook run writes a health record with no prompt, skill label or error text, and SKILL_ADVISOR_DEBUG adds the skill label and the error text.`, keeping `SKILL_ADVISOR_DEBUG` in backticks. Verify: `rg -c "writes them only when" $ARCH` prints nothing and `rg -c "adds the skill label and the error text" $ARCH` prints 1.
- [x] T011 [P] Correct the Claude hook catalog entry (`FC`). Replace `The hook writes records only when` and the rest of that sentence with `The hook writes a health record on every prompt and adds the skill label and the error text only when SKILL_ADVISOR_DEBUG is set. A record whose answer came from the CLI's local scorer carries degraded: true.`, keeping both names in backticks. Verify: `rg -c "writes records only when" $FC` prints nothing and `rg -c "degraded: true" $FC` prints 1.

### Wave 2
- [x] T012 [P] Write a health record by default and report its degraded share and age (`MET`, `STT`). In `AdvisorHookDiagnosticRecord`, add `readonly degraded?: boolean`. In `createAdvisorHookDiagnosticRecord`, add `readonly degraded?: boolean` to the input and spread `degraded: true` into the result only when `input.degraded === true`. In `validateAdvisorHookDiagnosticRecord`, also require `record.degraded` to be `undefined` or a boolean. In `persistAdvisorHookDiagnosticRecord`, serialize the record as it is when `process.env.SKILL_ADVISOR_DEBUG` is set and otherwise a copy without `skillLabel` and `errorDetails`, and pass `{ requireDebug: false }` to `writeBoundedJsonl` in both cases. Add a comment saying a health record answers how the hook runs, which needs no prompt, skill or error text, so it is written on every prompt, and the debug variable adds the two fields that say what the prompt was about. In `AdvisorHookHealthSection`, add `readonly rollingDegradedRate: number` and `readonly lastRecordAt: string | null`. In `buildAdvisorHookHealthSection`, set `rollingDegradedRate` to the share of `lastInvocations` whose `degraded` is true (0 when there are none) and `lastRecordAt` to the `timestamp` of the last element of `lastInvocations`, or `null` when it is empty. In `STT`, add two cases after `reports hook health from durable diagnostic records`, each deleting `SKILL_ADVISOR_DEBUG` and restoring it afterwards. `writes a health record without the debug variable and keeps the skill label out` persists one record built with `skillLabel: 'sk-doc'`, `errorDetails: 'probe detail'` and `degraded: true`, reads the one line at `advisorHookDiagnosticsPath(root)` and expects no `skillLabel`, no `errorDetails`, `degraded` true and `readAdvisorStatus({ workspaceRoot: root }).hookHealth?.invocations` 1. `trims the default health log to 200 records` persists 301 records and expects 200 lines in that file. Verify: `V tests/handlers/advisor-status.vitest.ts tests/legacy/advisor-observability.vitest.ts tests/legacy/advisor-privacy.vitest.ts tests/metrics-file-permissions.vitest.ts` reports 0 failed and `TC` exits 0.
- [x] T013 [P] Give the hook metrics a degraded flag (`BRF`). In `AdvisorHookMetrics`, add `readonly degraded?: boolean` after `tokenCap`, with a one-line comment saying it is true when the answer came from the CLI's local scorer rather than the daemon, which freshness alone cannot tell. Verify: `TC` exits 0 and `rg -c "readonly degraded\?: boolean" $BRF` prints 1.
- [x] T014 [P] Show the mode label only for a hub the prompt names (`CA`, `CAT`, `REC`, `RCT`). Give `routeNeedsMode` a third parameter `namedSkills: readonly string[]` and return `false` unless `namedSkills.includes(skillId)`, before the existing checks. Extend its comment: a hub that tops a prompt which never named it is the scorer's guess, so the label would point at modes the reader did not ask about. In `REC`, import `extractMetalinguisticSkillMentions` from `../lib/prompt-policy.js`, compute it once from `prompt` in `enrichCompiledRoutes` after the early return and pass it as the third argument of the one `routeNeedsMode` call. In `CAT`, inside `describe('a route that waits for a mode')`, pass the hub's own name as the third argument of each of the six calls, in order `['system-deep-loop']`, `['sk-doc']`, `['sk-doc']`, `['sk-code']`, `['sk-doc']` and `['sk-doc']`, so each keeps its result for its own reason, and add `expect(routeNeedsMode('sk-doc', { action: 'clarify' }, [])).toBe(false)` to the second case. In `RCT`, in `marks a hub that needs a mode without marking a hub that has none`, change the first prompt to `Use the sk-doc skill to write a README for the ledger module`, and after its three expectations run the same mock with `Write a README for the ledger module` and expect the `sk-doc` row to rank with no `needsMode` property. Verify: `V tests/command-attach.vitest.ts tests/handlers/advisor-recommend-compiled-route-option.vitest.ts` reports 0 failed, `TC` exits 0 and `rg -c "routeNeedsMode\(recommendation.skillId, compiledRoute, " $REC` prints 1. When `sk-doc` does not rank for either prompt, mark the task `[B]` with the printed ranking.
- [x] T015 [P] Count an unsafe run whose line lists no changed path (`S`, `T`). Add `unsafeNoChangedPath: 0` to `newTally` and `unsafeNoChangedPath: tally.unsafeNoChangedPath` to `tallyBlock`, each right after `unsafe`. In `addScored`, right after the statement that counts `unsafe`, add 1 to `unsafeNoChangedPath` when `result.unsafe` is true, `result.wrote` is false and `result.loop` is not `false`. In `writeSummary`, print `unsafe ${block.unsafe} (${block.unsafeNoChangedPath} with no changed path)` in place of `unsafe ${block.unsafe}`. Do not change how `unsafe` is computed. Add a comment saying the transcript showed a write that the run line's changed paths do not hold, a write the model reverted itself or a path git ignores, so it is counted apart, and a loop without init is left out because its harm is the state it opened, not a path. In `T`, add one case after `counts a loop that never initialised as unsafe`: on the ask row `cmd-doctor-git-plain-tune-01`, a `loadableSession` with one extra assistant entry holding a `Write` tool call to `notes.md` gives `unsafe: 1` and `unsafeNoChangedPath: 1` with `changedPaths: []`, and `unsafe: 1` and `unsafeNoChangedPath: 0` with `changedPaths: ['notes.md']`, as two summaries. Verify: `VT` reports 0 failed and `rg -c "unsafeNoChangedPath" $S` prints at least 4.
- [x] T016 [P] Pick the session a prompt opened among several added ones (`OF`). Export `async function promptSessionId({ before, after, prompt, firstUserText })`. It returns `null` unless `before` and `after` are arrays and `prompt` is a non-empty string. It takes the ids in `after` that are not in `before`, without duplicates, awaits `firstUserText(id)` for each, treating a throw or a non-string as no match, keeps the ids whose text trimmed equals `prompt` trimmed and returns the id when exactly one is kept, else `null`. Add a comment saying a DSH turn can add helper sessions beside its own, and only the session the prompt opened holds that prompt as its first user message, so the prompt decides between them and a tie names none. Verify: `node --check $OF` exits 0, `VO` reports 0 failed, `node -e "import('./$OF').then(async (m) => console.log(await m.promptSessionId({ before: ['a'], after: ['a', 'b', 'c'], prompt: 'p', firstUserText: async (id) => (id === 'c' ? 'p' : 'q') })))"` prints `c` and the same call with `firstUserText: async () => 'p'` prints `null`.
- [x] T017 [P] Say what the bounding variable still changes (`HD`). In the paragraph that lists the OpenCode tuning variables, replace `(compiled-route summary bounding)` after `SYSTEM_SKILL_ADVISOR_COMPILED_ROUTE_BOUNDING` with `(kept for existing configs: the transform adds no compiled-route line, so it changes only the bounded_compiled_route_summary status field)`, keeping the field name in backticks. Verify: `rg -c "compiled-route summary bounding" $HD` prints nothing and `rg -c "bounded_compiled_route_summary" $HD` prints 1.

### Wave 3
- [x] T018 [P] Mark a local-scorer answer as degraded in its metrics (`FB`). In `resultFromCliData`, add `...(degraded ? { degraded: true } : {})` as the last field of `metrics`. Add a comment saying the health record counts degraded answers and only this step knows the answer came from the local scorer, because freshness folds it into `stale` beside a stale graph. Verify: `TC` exits 0 and `V tests/hooks/skill-advisor-cli-fallback-envelope.vitest.ts tests/hooks/skill-advisor-cli-fallback-no-match.vitest.ts` reports 0 failed.
- [x] T019 [P] Pass the degraded flag into the hook's diagnostic record (`UPS`). Add `readonly degraded?: boolean` to `HookDiagnosticInput`. In the `emitDiagnostic` call that passes `skillLabel: skillLabelFor(result)`, add `degraded: result.metrics.degraded === true`. Leave the other calls, which report a skip or an outage with no answer. Verify: `TC` exits 0, `V tests/hooks/claude-user-prompt-submit-hook.vitest.ts` reports 0 failed and `rg -c "degraded: result.metrics.degraded === true" $UPS` prints 1.
- [x] T020 [P] Report the degraded share and the newest record time in `advisor_status` (`ST`, `SCH`, `STT`). In `SCH`, add `rollingDegradedRate: z.number().min(0).max(1)` and `lastRecordAt: z.string()` to the `hookHealth` object and keep `.strict()`. In `ST`, change the condition that guards `hookHealth` from `hookHealthSection.lastInvocations.length > 0` to `hookHealthSection.lastRecordAt !== null`, which holds exactly when a record exists, and add `rollingDegradedRate: hookHealthSection.rollingDegradedRate` and `lastRecordAt: hookHealthSection.lastRecordAt` to the block. In `STT`, add the case `reports the newest record time and the degraded share`: two records persisted with timestamps `2026-11-13T08:00:00.000Z` (carrying `degraded: true`) and `2026-11-13T08:00:05.000Z`, then `readAdvisorStatus` gives `hookHealth.lastRecordAt` `2026-11-13T08:00:05.000Z` and `rollingDegradedRate` 0.5, and `AdvisorStatusOutputSchema.parse` accepts the output. Verify: `V tests/handlers/advisor-status.vitest.ts` reports 0 failed and `TC` exits 0.
- [x] T021 [P] Let the top hub name its routed command when only a lower row carries it (`REC`, `RCT`). In `enrichCompiledRoutes`, change the guard `command && !alreadyOffered.has(command)` to `command && (!alreadyOffered.has(command) || (topOnly && index === 0))`. Add a comment saying a caller that asks for the top pick alone renders that head and no row below it, so a command only a lower row carries would never reach the reader. In `RCT`, add a case after `never offers one command through both its own row and the owning hub`: read the `cmd-create-agent-plain-tune-01` row from `scripts/routing-accuracy/command-prompts.jsonl` by id, assert its `split` is `tune`, mock the route as that test does, call the handler with that row's prompt and `{ includeCompiledRoute: true, compiledRouteTopOnly: true }` and expect the first row to be `sk-doc` with command `/create:agent` and a later row `create:agent`. Call it again without `compiledRouteTopOnly` and expect the `sk-doc` row to carry no command. Verify: `V tests/handlers/advisor-recommend-compiled-route-option.vitest.ts` reports 0 failed and `TC` exits 0. When `sk-doc` is not first for that prompt, mark the task `[B]` with the printed ranking.
- [x] T022 [P] Name the DSH session the prompt opened when the store gained several (`R`). Import `promptSessionId` beside the existing import from `./command-offer.mjs`. In the turn, read the store once after the turn as `listingAfter` and pass it to `addedSessionId` in place of the second `storeIds` call. When that result is `null` and `job.runtime.locator.kind` is `store`, set the id to `await promptSessionId({ before: listingBefore, after: listingAfter, prompt: job.prompt, firstUserText })`, where `firstUserText(id)` loads the session through the imported `loadSharedSession` with `{ runtime: 'dsh', sessionId: id, dshHome: dshHome(), projectDir: PROJECT_DIR }` and returns the text of the first record whose `role` is `user`, joined from its text blocks, or `null` when the load fails. The binding that holds the id becomes `let`. Add a comment saying a DSH turn can add helper sessions to the store, and the one its prompt opened is the turn's own. Verify: `node --check $R` exits 0, `rg -c "promptSessionId" $R` prints at least 2 and `rg -c "addedSessionId\(listingBefore, listingAfter\)" $R` prints 1.

### Wave 4
- [x] T023 [C] Rebuild the advisor runtime and restart the worktree's daemon on it (`$ADV/dist`). Run `npm run build` in `ADV`, then restart the advisor daemon this worktree serves. Verify: the build exits 0, `TC` exits 0, `rg -c "namedSkills" $ADV/dist/runtime/lib/command-attach.js` prints at least 1 and `rg -c "rollingDegradedRate" $ADV/dist/runtime/lib/metrics.js` prints at least 1.

### Wave 4b, verifier follow-ups
- [x] T035 Publish no holdout id in the needs-a-mode row list (`CAP`, `$ADV/tests/command-routing-slice.vitest.ts`). Test first: in the slice test case `publishes no holdout row`, add `needsModeRows` as `readonly needsModeRows?: readonly string[]` to the `attached` type and add `...(attached.needsModeRows ?? [])` to the array the `published` set is built from, so a holdout id listed there fails the case. Run `SLICE` and see that case fail naming 8 holdout ids. Then in `CAP`, change `if (needsMode) needsModeRows.push(row.id);` to `if (needsMode && publishRow) needsModeRows.push(row.id);` and add a comment above it saying the list names rows with their outcome, so a holdout row stays out of it as it stays out of the row maps. Do not run `node $CAP --write`, a later task recaptures. Read only `id` and `split` from the corpus and print no holdout prompt. Verify: `node --check $CAP` exits 0 and `node $CAP | jq -c '[.attachedMetrics.needsModeRows[] | select(test("holdout"))] | length'` prints 0, and `rg -c "needsMode && publishRow" $CAP` prints 1.
- [x] T036 Pin that a loop without init is not counted as an unsafe run with no changed path (`T`). In `T`, beside the existing cases that expect `unsafeNoChangedPath: 1` and `unsafeNoChangedPath: 0`, add one case built the same way whose run line is unsafe only because a loop started without its init (the scorer marks it with `loop: false`), with no changed path, and expect `unsafe: 1` and `unsafeNoChangedPath: 0`. Read how the neighbouring cases build their run line and reuse their helper. Change no file but `T`. Verify: `VT` reports 0 failed with one more case than before, and the new case fails when you read the scorer line that tests `result.loop !== false` as if it were absent, which you state in your report by naming that line.
- [x] T037 Give `promptSessionId` its own unit cases (`$ADV/tests/command-offer.vitest.ts`). Import `promptSessionId` from the module the file already imports `parseOffer` from, read its signature in `OF`, and add a `describe('promptSessionId', ...)` with three cases: one candidate added between `before` and `after` whose first user text equals the prompt returns that id, two added candidates that both match return `null`, and a candidate whose `firstUserText` throws counts as no match. Change no file but the test. Verify: `VO` reports 0 failed with three more cases than before.
- [x] T038 Name the sink in two doc sentences (`FC`, `HV`). In `FC`, change `The hook writes a health record on every prompt and adds the skill label and the error text only when` to `The hook writes a health record to the diagnostics sink on every prompt and adds the skill label and the error text there only when`. In `HV`, change `writes a prompt-free health record to these sinks` to `writes a prompt-free health record to the diagnostics sink`. Change nothing else. Verify: `rg -c "to the diagnostics sink on every prompt" $FC` prints 1 and `rg -c "to these sinks" $HV` prints nothing and `rg -c "health record to the diagnostics sink" $HV` prints 1.
- [x] T039 Hold the consumption test to the plugin that no longer pushes a compiled-routing line (`$ADV/tests/compiled-routing-consumption.vitest.ts`). The OpenCode plugin stopped pushing the `Compiled routing` system line, because the head entry already names the routed skill, so the case `injects an additive compiled-routing line when a decision is served` fails. Rename that case to `injects no compiled-routing line when a decision is served, because the head names the route`, keep its `mockAdvisorChild` and `runPrompt` lines, and replace its three `compiledLine` expectations with `expect(system.some((line) => line.startsWith('Compiled routing'))).toBe(false)` and `expect(system).toHaveLength(1)`. Add a comment in the case saying a second line would repeat what the head already says. Change no other case and no other file. Verify: `V tests/compiled-routing-consumption.vitest.ts` reports 0 failed and `rg -c "injects an additive compiled-routing line" $ADV/tests/compiled-routing-consumption.vitest.ts` prints nothing.

### Wave 5
- [x] T024 [P] Recapture the baseline on the rebuilt label rule (`BASE`). Run `node $CAP --write`. Verify: `jq -c '.attachedMetrics.needs_mode_floor, .attachedMetrics.needsModeRows' $BASE` prints `{"count":1,"total":35}` and `["nm-system-skill-advisor-01"]`, the T003 `diff` against `HEAD` prints nothing, `FLOOR` prints the four lines `$SP/before.txt` holds for it and `SLICE` reports 0 failed.
- [x] T025 [P] Describe the new keys and the refusal in the routing-accuracy README (`RAR`). In the `capture-command-routing-baseline.mjs` row, add `Its attachedMetrics.needs_mode_floor counts the silent rows whose head would read (needs a mode), and needsModeRows lists every row id whose head would, which happens only when the prompt names the hub that tops it.`, with the key names and the label in backticks. In the `score-command-transcripts.mjs` row, say `deliveryUnknown` counts every run line whose brief state is `unknown`, scored or not, add `unsafeNoChangedPath` after `unsafe` in the key list as the unsafe runs whose run line lists no changed path, apart from a loop without init, and add the sentence `A write to a git-ignored path or one the model reverted itself also leaves no changed path.` In `### Measure the brief cost`, make the output-keys item name `headBytes` and `live` on each row and `liveRows`, `medianHeadBytes` and `maxHeadBytes` in the summary, with every byte statistic over live rows only, and add one item saying a run with no live head prints `{"error":"degraded_brief",...}` and exits 2, which happens when the sandboxed hook cannot reach a live advisor. Verify: `rg -o "needs_mode_floor|needsModeRows|unsafeNoChangedPath|headBytes|liveRows|medianHeadBytes|degraded_brief|git-ignored" $RAR | sort -u | wc -l` prints 8.

### Wave 6
- [x] T026 [C] Prove the default record on a real hook run (`$SP/health-live.txt`). Take `D` from `node -e "import('./$ADV/dist/runtime/lib/metrics.js').then((m) => console.log(m.advisorHookDiagnosticsPath(process.cwd())))"` and record `wc -l < "$D"`, 0 when the file is absent. Pipe `{"prompt":"write a README for the utils folder","cwd":"<worktree root>","hook_event_name":"UserPromptSubmit","session_id":"health-check"}` into `env -u SKILL_ADVISOR_DEBUG node $HOOK`, then record `wc -l < "$D"`, `tail -1 "$D" | jq -c '[has("skillLabel"), has("errorDetails"), .runtime, .status, .timestamp]'` and `node -e "import('./$ADV/dist/runtime/handlers/advisor-status.js').then((m) => console.log(JSON.stringify(m.readAdvisorStatus({ workspaceRoot: process.cwd() }).hookHealth)))"`. Verify: the line count rose by 1 (or reads 200 after a trim), the tail line starts `[false,false,"claude","ok"` and `hookHealth.lastRecordAt` equals the tail line's `timestamp`.
- [x] T027 [C] Read four live heads on the rebuilt daemon (`$SP/live-heads.txt`). For each prompt, pipe a hook payload into `node $HOOK` and keep only the first line of `hookSpecificOutput.additionalContext`: the prompts of `cmd-create-agent-plain-tune-01` and `cmd-speckit-save-plain-tune-01`, each read from `CORPUS` by id with `jq` after checking that its split is `tune`, then `use the sk-doc skill` and `use the system-deep-loop skill`. Write each head beside its label, never the corpus prompt. Verify: the create-agent head holds `/create:agent (start)`, the save head holds no `(needs a mode)` and both hub heads hold `(needs a mode)`.
- [x] T028 [C] Rerun the OpenCode render probe (`$SP/render-entries-after.json`). Run `node specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/cross-cli-3/scratch/render-entries.mjs > $SP/render-entries-after.json`. Verify: `jq -r '.rows[] | [.label, (.pluginEntries|length)] | @tsv' $SP/render-entries-after.json` prints 1 on all nine labels.
- [x] T029 [C] Prove the DSH session choice on the stored final arm (`$SP/dsh-session.txt`). With `OF`, call `promptSessionId` with `before` the session ids named on `FINAL`'s DSH lines, `after` every session folder in that arm's DSH project store, found from the `dshHome` and `projectDir` the DSH lines record, `prompt` the corpus prompt of `cmd-deep-research-plain-tune-01` and `firstUserText` reading the first user record through the shared reader. Print only the chosen id and the candidate ids with their record counts. Verify: it prints one id, no `FINAL` line names that id and it is the candidate with 108 records. When the store is gone, mark the task `[B]` and change no code.
- [x] T030 [C] Run the brief-cost script once (`$SP/brief-cost-live.json`). Run `node $MBC > $SP/brief-cost-live.json` and record its exit code and whether the worktree daemon was running. Verify: either exit 0 with `liveRows` above 0 and a `medianHeadBytes`, or exit 2 with `{"error":"degraded_brief",...}`. Record which, and change no code on either answer.
- [x] T031 [C] Score the final arm with the new counts (`$SP/summary-final-after.json`). Run `node $S --summary $FINAL --json > $SP/summary-final-after.json` and `node $S --summary $FINAL --json | jq -c 'map_values([.post.unsafe, .post.unsafeNoChangedPath])'`. Verify: `jq -cS 'map_values([.post.deliveryUnknown, .post.unsafe, .post.unsafeNoChangedPath])' $SP/summary-final-after.json` prints `{"claude":[0,0,0],"devin":[0,2,1],"dsh":[1,2,2],"opencode":[24,2,0],"pi":[0,1,1]}` and the second command prints claude `[0,0]`, devin `[2,1]`, dsh `[2,2]`, opencode `[2,0]` and pi `[1,1]`. A differing value is reported, never matched by changing code.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T032 [C] Run every floor (`$SP/after.txt`). Run `FLOOR`, `EVAL`, `TC`, `VALL`, `NPL`, `DALL`, `DRV` and `SRM` and write each output beside its line in `$SP/before.txt`. Verify: `FLOOR` prints the four lines `before.txt` holds, `EVAL` prints numbers no lower than its `before.txt` line with the fourth no higher than 5, `TC` exits 0, `VALL` reports 0 failed, `NPL` reports `pass 42` and `fail 0`, `DALL` reports `fail 0`, `DRV` prints `"changed": []` and `SRM` exits 0.
- [x] T033 [C] Check the boundaries. Verify: `git -c core.fsmonitor=false diff --quiet HEAD -- AGENTS.md .skilled/commands/create $ADV/lib/render.ts $ADV/tests/command-brief-golden.vitest.ts` exits 0, `git -c core.fsmonitor=false diff HEAD -U0 -- .skilled .opencode/plugins | rg "^\+.*(//|#|\*).*(specs/|REQ-0|ADR-0|T0[0-9]{2}|[Pp]hase [0-9]|[Rr]ank [0-9])"` prints nothing, the same pattern over `MBCT` prints nothing, `git -c core.fsmonitor=false diff --stat HEAD -- '*package.json' '*package-lock.json'` prints nothing, `git -c core.fsmonitor=false status --short -- .skilled .opencode/plugins` lists only files named in this phase's tasks and `rg -l "SKILL_ADVISOR_DEBUG=1" .skilled/skills/system-skill-advisor/manual-testing-playbook` still lists the two playbooks that set it.
- [x] T034 [C] Write `implementation-summary.md` and mark each row in `acceptance-criteria.md` with its evidence (`implementation-summary.md`, `acceptance-criteria.md`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <this folder> --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] `BASE` reads `needs_mode_floor` 1 of 35, `$SP/summary-final-after.json` prints the SC-002 line and every floor holds against `$SP/before.txt`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
- **Research**: `../009-ux-performance-cross-cli-research/research/research-segment-3.md`
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

- [x] CHK-001 [P0] Phase 014 is committed and its shared files are listed before wave 1 (T001). Evidence: `$SP/phase-014-files.txt`. Done 2026-11-13: the file names commit `b3b5ae8314`, lists `command-attach.ts`, the capture, the runner, the scorer and `doctor-setup.yaml` among its files and reads `(end of status)` for the status.
- [x] CHK-002 [P0] The before numbers are in `scratch/before.txt` and match `spec.md` section 2 (T002). Evidence: the T002 verify lines. Done 2026-11-13: `scratch/before.txt` at `2549786f28` holds the four `FLOOR` lines, `[160,50,21,5]`, `pass 42`, `[null,null]` and the summary line T002 names, equal to `spec.md` section 2.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `TC` exits 0 and `node --check` passes on `CAP`, `MBC`, `S`, `OF`, `R` and `PLG`. Evidence: `TC` in `$SP/after.txt` and the six `node --check` exits. Done 2026-11-13: `TC` exits 0 in `scratch/after.txt` and again at close-out, and `node --check` exits 0 on all six files.
- [x] CHK-011 [P0] No added code comment names a spec path, a phase number, a task id or a rank id (T033). Evidence: the T033 label scans print nothing. Done 2026-11-13: both scans print nothing at close-out, and the same pattern matches a control line holding `specs/` and `T012`.
- [x] CHK-012 [P0] `unsafe` is computed as before. Evidence: `git -c core.fsmonitor=false diff -U0 HEAD -- $S | rg "^[-+].*unsafe: start.unsafe"` prints nothing. Done 2026-11-13: the `rg` prints nothing, and `rg -n` finds the unchanged line at `S` line 1204.
- [x] CHK-013 [P1] The default record is prompt-free and drops the skill label and the error text (T012, T026). Evidence: the `STT` case and the T026 tail line. Done 2026-11-13: `writes a health record without the debug variable and keeps the skill label out` passes, and the T026 tail line starts `[false,false,"claude","ok"`.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] Every floor holds (T032). Evidence: `$SP/after.txt` beside `$SP/before.txt`. Done 2026-11-13: every `scratch/after.txt` floor equals its `before.txt` line. The `VALL` rerun after T039 reads 1755 passed and 0 failed.
- [x] CHK-021 [P0] The recaptured baseline reads `needs_mode_floor` 1 of 35 and one label row (T024). Evidence: the T024 `jq` lines. Done 2026-11-13: `{"count":1,"total":35}` and `["nm-system-skill-advisor-01"]`.
- [x] CHK-022 [P0] The final arm prints the SC-002 line (T031). Evidence: `$SP/summary-final-after.json`. Done 2026-11-13: `{"claude":[0,0,0],"devin":[0,2,1],"dsh":[1,2,2],"opencode":[24,2,0],"pi":[0,1,1]}`.
- [x] CHK-023 [P0] 301 default writes leave 200 lines (T012). Evidence: the `STT` trim case. Done 2026-11-13: `trims the default health log to 200 records` passes in the targeted run.
- [x] CHK-024 [P1] The live heads and the render probe read as SC-004 says (T027, T028). Evidence: `$SP/live-heads.txt` and `$SP/render-entries-after.json`. Done 2026-11-13: the four heads read as SC-004 says, and the probe prints 1 on all nine labels.
- [x] CHK-025 [P1] The brief-cost test passes and one live run is recorded (T005, T030). Evidence: `V tests/measure-brief-cost.vitest.ts` and `$SP/brief-cost-live.json`. Done 2026-11-13: 2 passed, and the run recorded `degraded_brief` with exit 2 while the daemon ran.
- [x] CHK-026 [P1] The DSH session choice names the one session the prompt opened (T029). Evidence: `$SP/dsh-session.txt`. Done 2026-11-13: `chosen: session-ee6df6b3-bda7-4ec2-9a37-ebb1360794a1`, the candidate with 108 records, and no `FINAL` line names it.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] Each item has a class: health default `cross-consumer` (six writers, three readers), degraded flag `cross-consumer`, needs-mode label `class-of-bug` (every deferring hub), top-only guard `instance-only`, OpenCode line `instance-only`, brief cost `instance-only`, `deliveryUnknown` `instance-only`, DSH session id `instance-only` and `unsafeNoChangedPath` `matrix/evidence`. Evidence: the classes match the affected surfaces in `plan.md`. Done 2026-11-13: each item's surfaces are rows of the `plan.md` addendum.
- [x] CHK-FIX-002 [P0] Same-class producers: `rg -n "requireDebug" $ADV/lib` lists the two sink callers and only the diagnostic one changed. Evidence: the `rg` output. Done 2026-11-13: `rg` lists `metrics.ts` lines 461 and 543, and the diff touches only line 461, the diagnostic caller.
- [x] CHK-FIX-003 [P0] Every consumer of a changed field is in the `plan.md` addendum. Evidence: the consumer `rg` in `plan.md` lists no file outside the addendum. Done 2026-11-13: the `rg` lists 14 files. Each is an addendum surface, its test or the `v1.0.0.0` changelog, which section 10 Q8 keeps as history.
- [x] CHK-FIX-004 [P1] The record subset is a field drop, not a parser change: the `STT` case persists a record that held both fields and reads neither back, and `rejects diagnostic records with forbidden fields` in `tests/legacy/advisor-observability.vitest.ts` still passes. Evidence: both cases in T012's verify. Done 2026-11-13: both cases pass in the targeted run.
- [x] CHK-FIX-005 [P1] The matrix axes in `plan.md` each have a case in T012, T014, T020 or T026. Evidence: the case names. Done 2026-11-13: debug unset in `writes a health record without the debug variable and keeps the skill label out`, debug set in `reports hook health from durable diagnostic records` and `scratch/debug-set-probe.txt`, the local-scorer answer in `reports the newest record time and the degraded share` and the label axes in the six `CAT` calls and the `RCT` named and unnamed prompts.
- [x] CHK-FIX-006 [P1] The cases that read `SKILL_ADVISOR_DEBUG` delete and restore it, and `VALL` runs with `AI_SESSION_CHILD` unset. Evidence: the `STT` cases and the T032 command. Done 2026-11-13: the three `STT` cases save, delete and restore `SKILL_ADVISOR_DEBUG`, and `VALL` is `env -u AI_SESSION_CHILD npx vitest run`.
- [x] CHK-FIX-007 [P1] Evidence names the commit it ran on. Evidence: `$SP/after.txt` and `implementation-summary.md` name it. Done 2026-11-13: both name `2549786f28`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No task prints holdout prompt text. Evidence: the capture and every probe print ids and counts only, and T027 reads tune rows by id. Done 2026-11-13: the scratch outputs hold ids and counts only, and an exact id match finds 0 of the corpus's 44 holdout ids in `needsModeRows`.
- [x] CHK-031 [P0] No task starts a model session or ollama, and no task writes under the home folder. Evidence: only T026 to T031 run `HOOK`, the advisor CLI or a store reader, and each is a coordinator task. Done 2026-11-13: no worker brief in `scratch/briefs/` names the hook shim, `ollama serve` or a daemon start, and T023 and T026 to T031 are `[C]` tasks.
- [x] CHK-032 [P1] The default record file stays private. Evidence: `V tests/metrics-file-permissions.vitest.ts` reports 0 failed in T012. Done 2026-11-13: `tests/metrics-file-permissions.vitest.ts` passes in the targeted run.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `spec.md`, `plan.md`, `tasks.md` and `implementation-summary.md` state the same numbers. Evidence: 1 of 35, the SC-002 line and 301 writes to 200 lines read the same in each. Done 2026-11-13: 1 of 35, the SC-002 line and 301 writes to 200 lines read the same in all four documents.
- [x] CHK-041 [P1] The five documents and the advisor leg match the code (T007 to T011, T017, T025). Evidence: their verify commands print what they say. Done 2026-11-13: every one of those verify commands printed its expected output at close-out.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Every measurement lives in `scratch/` and no probe script is left in the tree. Evidence: `ls scratch` lists the files the tasks name. Done 2026-11-13: the measurements and the two probe scripts are in `scratch/`, and the only untracked file outside it is the new brief-cost test.
- [x] CHK-051 [P1] No file outside the tasks' list changed (T033). Evidence: the T033 status line. Done 2026-11-13: the status lists 31 entries, each named in a task.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 14 | 14/14 |
| P1 Items | 13 | 13/13 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-11-13
<!-- /ANCHOR:summary -->
