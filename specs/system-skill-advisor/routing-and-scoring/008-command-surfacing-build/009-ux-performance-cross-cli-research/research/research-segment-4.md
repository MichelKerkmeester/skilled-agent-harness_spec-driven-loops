---
title: "Command surfacing research, segment four: merged ranking and proposed dispositions"
description: "Draft merged synthesis of the embed-text-4, inprocess-timing-4 and residual-limits-4 lineages, run against the built phases 014 and 015, for the coordinator to review and decide."
trigger_phrases:
  - "command surfacing research segment four"
  - "command embedding text and in-process degraded scorer research"
---
# Command Surfacing Research, Segment Four

Draft by Opus 5.5 for coordinator review

Merged synthesis of three lineages run on 2026-11-13 against the built state at `087888ec4a`, after phases 014 (`b3b5ae8314`) and 015 (`3b48f0e5f1`): `lineages/embed-text-4/research.md`, `lineages/inprocess-timing-4/research.md` and `lineages/residual-limits-4/research.md`. Executor: `opencode-go/deepseek-v4.1-flash` at max effort through `cli-opencode`, eight iterations per lineage at most, convergence threshold 0.05 (`deep-research-config-segment-4.json`). The lineages ran 3, 3 and 4 iterations. `fanout-merge.cjs --loop-type research` exited 0 with empty stderr. It merged all 12 lineages into `findings-registry.json` and `deep-research-findings-registry.json` and rewrote `fanout-attribution.md`. The registry now holds 331 key findings against 275 at `HEAD`. The 56 new ones come from embed-text-4 (19), inprocess-timing-4 (17) and residual-limits-4 (20). Every disposition in this file is proposed and not final. Segments one to three stay in `research.md`, `research-segment-2.md` and `research-segment-3.md`.

## 1. What the build showed

Phases 014 and 015 are committed. At `087888ec4a` the committed fixture capture reads typed recall 24 of 44, false offers 0 of 35, plain tune 23 of 45 and plain holdout 1 of 44. It equals `command-routing-baseline.json` in every field but the date and commit (rerun by this draft). The same corpus scored with the live embedder reads tune top-1 13 of 45, tune with attached commands 28 of 45 and holdout 3 of 44 (rerun). The health records for 2026-11-13 number 1,828, with a hook median of 178 ms, a worst of 893 ms and none over 1,000 ms (rerun). The live brief costs 306 bytes at the median over the 44 typed rows (residual-limits-4, not rerun).

Three findings carry the segment:

1. **Richer command text moves two holdout rows and holds every floor.** New intent phrases for five scored commands move holdout from 3 to 5 of 44 and tune top-1 from 13 to 18 of 45. Typed recall stays 24 of 44, false offers stay 0 of 35 and the three doctor-family floor rows stay command-free. The tune gain is built in, because each command's new phrases include its own tune prompt word for word. The holdout gain is the out-of-sample number.
2. **Real traffic did not reach the degraded path, so rank 6 has nothing to fix today.** Phase 015's local-scorer marker sits on 57 of the day's 1,828 records. 44 of them are phase 015's own brief-cost run at 10:37Z and 13 sit in files with one or two records. The eight workspace files with ten or more records hold 1,283 records since the phase 015 build. None of them carries the marker. The in-process handler fits the 2.5 s budget, but it answers with nothing in a state where the Python scorer still answers.
3. **The runtime gaps that remain sit outside the brief.** The brief reached Claude, Devin and Pi on 24 of 24 runs and DSH on 23 of 24. OpenCode's text matches the hook's byte for byte on 9 of 9 probes. Started of judgeable offers runs from 5 of 14 on Claude to 10 of 11 on Devin. All 8 of Claude's start rows are `/create:*` commands its listing hides, which phase 016 targets. OpenCode lost 6 of its 14 offers to the runner's wall-clock cap. Pi's 7 of 14 has no measured cause.

## 2. Checks made on the lineage claims

Each number a ranked item rests on was rerun or re-read by this draft. Reruns used copies of the lineage databases in a private scratch folder and the embedder that was already running. They started no daemon, hook, build or model session. Each result opens with one label: reproduced, read from the lineage's own output, not found or failed where the lineage claim is wrong.

| Claim | Check | Result |
|---|---|---|
| Before capture at `HEAD`: typed 24 of 44, tune top-1 13 of 45, tune with attached 28 of 45, holdout 3 of 44, false offers 0 of 35 (embed-text-4) | `capture-command-routing-baseline.mjs --real-embedding` against a copy of `scratch/db-before` | Reproduced. The output equals `before-capture.json` in every field but the date |
| After capture: tune top-1 18 of 45, tune with attached 33 of 45, holdout 5 of 44, typed 24 of 44, false offers 0 of 35 (embed-text-4) | The same capture against a copy of `scratch/db-after` | Reproduced. The output equals `after-capture.json` in every field but the date. Attached false offers also stay 0 of 35 |
| The five moved tune rows are the five scored commands. Holdout moves on `/doctor:install` and `/doctor:speckit` (embed-text-4) | Published rows and per-command counts of both reruns, holdout as counts only | Reproduced. Five published rows change, each from no top to its own command. No other published row changes |
| The three doctor-family floor rows still pass (embed-text-4) | Published rows of both reruns | Reproduced. `mns-chat-03`, `nm-system-skilled-doctor-01` and `sv-03` top `system-skilled-doctor` with no command in the top three, before and after. Their 0.82 confidence: not found. The capture does not print it and neither run re-read it |
| Only the five command vectors changed and all 14 skill vectors are identical (embed-text-4) | Row diff of `vec_768` and `vec_cmd_768` across the two copies | Reproduced. 0 of 14 skill rows and 5 of 46 command rows differ. The five are the scored commands |
| The re-embed path is faithful at cosine 1.000000 (embed-text-4) | `scratch/metadata/reembed-report.json` | Read from the lineage's own output |
| The gain covers the vector half only (embed-text-4) | `capture-command-routing-baseline.mjs:59` | Reproduced. The capture reads lexical evidence from the tracked `command-bridges.generated.json`, so the new phrases reached the vectors alone |
| The 5 tune rows are gain (embed-text-4 section 6) | Word overlap between each command's new phrases and its tune prompt, no text printed | Failed as a gain claim. For all 6 commands one new phrase matches the tune prompt word for word. The lineage's own iteration 3 says the phrases came from those rows. The tune gain is built in. The holdout gain is not |
| `agreement`, not mentioned by the lineage | Both reruns | Reproduced. It moves from 8 of 9 to 8 of 8 because one disagreeing row stops qualifying. It is not a floor |
| Cold handler, import and one call: median 224.7 ms, worst 337.7 ms (inprocess-timing-4) | Recomputed from `scratch/cold.jsonl`, then ten fresh processes rerun | Failed on the worst. 337.7 ms is the call alone. Import and call peak at 428.6 ms in the same file. The rerun gives 215.2 and 303.6 ms |
| Every timing median (inprocess-timing-4) | Recomputed from each timing file | Reproduced as printed. Each is the lower middle of ten values. The usual median of the same rows is 2 to 6 ms higher |
| Warm call 76.5 and 93.6 ms, Python fallback 238.5 and 377.7 ms (inprocess-timing-4) | Rerun of `timing-handler.mjs warm` and `fallback` | Reproduced within noise: 74.8 and 102.4 ms, then 200.3 and 258.9 ms |
| Composed proposed 231.1 and 428.5 ms against today 219.9 and 544.3 ms, so the worst case improves by 115.8 ms (inprocess-timing-4) | Rerun of `compose-timing.mjs`, ten fresh processes per path | Failed on the worst case. The rerun gives 206.8 and 568.2 ms against 217.6 and 247.4 ms, so the worst-case order flips. Medians agree within 25 ms. Both paths stay far inside 2.5 s |
| The in-process top differs on 5 of 10 prompts, the literal filter drops the typed `/create:readme` and only raw handler rows carry `needsMode` (inprocess-timing-4) | Rerun of `timing-handler.mjs shape-live` | Reproduced row for row |
| The gain is the correct top (inprocess-timing-4) | Rerun tops against each expected command's owner in `command-bridges.generated.json` | Failed in part. The handler names the owner on readme, agent and repo-rule. The fallback names it on save, because `/speckit:save` belongs to `system-spec-kit` and the handler tops `sk-doc`. Neither does on doctor setup |
| The floors hold, because the change touches no scoring input (inprocess-timing-4) | Fixture capture rerun | Reproduced for the live path: 24 of 44 and 0 of 35, equal to the committed baseline. It is not a check of rank 6, because the capture never runs the degraded path |
| With no generation file the handler returns nothing (inprocess-timing-4, ruled out there as a setup issue) | `timing-handler.mjs cold` on a database copy with no generation file, beside `compose-timing.mjs today` in the same state | Reproduced. It is a risk the lineage did not carry. 0 recommendations on the plain and the typed readme prompt. The Python scorer still answers `system-spec-kit` |
| The same empty answer after a daemon stops and its PID file stays (this draft, from code) | `lifecycle.ts:121-127`, `advisor-status.ts:453-461`, `trust-state.ts:119-121`, `advisor-recommend.ts:130` and `:595-600` | Inferred, not run. A daemon that stops with its lease writes `unavailable`. `renderableStatus` rescues that unless a PID file names a dead process |
| Delivery: Claude, Devin and Pi 24 of 24, DSH 23 of 24 with 1 unknown, OpenCode 24 unknown with 8 runs at exit 143 (residual-limits-4) | Tally of `007/scratch/runs-final.jsonl` | Reproduced |
| Hook and plugin briefs identical on 9 probes at 244 to 305 bytes (residual-limits-4) | Re-read of `015/scratch/render-entries-after.json` | Reproduced. 9 of 9 are byte-identical |
| The directive is 219 bytes, about 72 percent of the brief (residual-limits-4) | Byte split of the same probe | Reproduced within 2 bytes. The block after the head line is 217 bytes on 8 of 9 probes. The no-match brief is a 26-byte head, a newline and that block |
| The CLI answers the hook's and the plugin's options the same on 44 of 44 typed rows (residual-limits-4) | `scratch/cli-parity.json` | Read from the lineage's own output. Not rerun, because the probe asks the live CLI |
| Live brief median 306, p95 337, max 350 bytes, 44 of 44 live (residual-limits-4) | `scratch/live-brief-ts.json` | Read from the lineage's own output. Not rerun, because the harness runs the hook handler, which spawns the CLI against the daemon |
| Hook latency over the day: median 178, p95 294, p99 396, max 893 ms, none over 1,000 (residual-limits-4) | A read-only pass over the health records in the OS temp metrics folder | Reproduced on 1,828 records, 2 more than the lineage saw, with the same percentiles |
| 325 records sent a brief at 265.6 bytes each (residual-limits-4) | Same pass | Reproduced: 325 of 1,828 at 265.6 bytes |
| 47 stale records (2.6 percent) and 6 degraded (0.33 percent) (residual-limits-4) | Same pass grouped by file and minute, plus `skill-advisor-brief.ts:218` | Failed. 44 of the 47 stale records sit in one file in the minute 10:37Z, when phase 015's T030 cost run wrote its 44-row result (`015/scratch/brief-cost-live.json`, stamped 10:37:29Z). Without them 3 records are stale. The 6 count `status: degraded`, which marks an unavailable advisor that sent no brief. The local-scorer marker is the separate `degraded: true` field (`metrics.ts:410`). It sits on 57 records |
| Started of judgeable offers: Claude 5 of 14, Devin 10 of 11, DSH 11 of 13, Pi 7 of 14, OpenCode 3 of 8 (residual-limits-4) | `015/scratch/summary-final-after.json` | Reproduced |
| Every start row is a `/create:*` command. Claude started 2 of 8 against Devin 7 and DSH 6 (residual-limits-4) | Same file and `runs-final.jsonl` against the corpus | Reproduced. Each runtime has 8 start rows, all `/create:*`. 7 of them drew a start offer. The eighth, `cmd-create-agent-plain-tune-01`, drew none in this pre-015 arm |
| The OpenCode store holds 562 rows for the 24 sessions and no injected row (residual-limits-4) | Its iteration 4 | Read from the lineage's own output. Not rerun, because it reads the operator's own OpenCode store outside the repository |
| Re-scoring the 24 committed OpenCode lines proves the receipt, `deliveryUnknown` 24 to 0 (residual-limits-4) | `command-offer.mjs:220` and the run lines | Failed. Those lines were recorded with no receipt, so a re-score cannot change them. Its iteration 3 planned a stub-marker check and iteration 4 did not run it |
| The compiled hook is stale, so the committed cost script cannot run (residual-limits-4 iteration 2) | Build times and contents of the shim and the advisor hook | Failed. `system-spec-kit/runtime/dist/hooks/claude/user-prompt-submit.js` is a dispatcher whose source last changed on 2026-10-10 and whose constants match the build. It spawns the advisor hook build, compiled at 11:22 local from source saved at 11:18, which carries the phase 015 `degraded` field. Phase 015 traced the refusal to the sandbox socket |
| Each lineage stayed in its folder | `git -c core.fsmonitor=false status --short` after the merge, plus each lineage's `containment/quarantine` | Reproduced. 26 lines, all under `specs/`. No tracked file outside `specs/` changed. The quarantines hold only the coordinator's two operator rows in `goal.md` and the review fan-out's `review/observability-events.jsonl`. Both are still in place |
| No holdout prompt text in any lineage file | A scan of all 335 lineage files for the 108 holdout prompts of 12 or more characters, printing counts only | Reproduced. 0 files match. The same scan finds all 108 in the corpus files |

Not rerun: the live brief bytes, the CLI parity probe and the OpenCode store census, for the reasons in the table. The embedder's cold first call: no run in this segment found the model unloaded.

## 3. Merged ranking and proposed disposition

Ranked by expected gain per unit of risk to the floors. Gain means commands started when useful or silent failures removed. The floors are typed recall 24 of 44, false offers 0 of 35 and scorer eval `[160,50,21,5]` per phase 015's summary. The ranks below are new numbers. Earlier ranks are named as segment three rank N.

| Rank | Recommendation | Source | Proposed disposition |
|---|---|---|---|
| 1 | Add intent phrases for the five scored no-recommendation commands and re-embed their vectors | embed-text-4, segment three rank 10 | Build now in a new phase, after phase 016. Claim the holdout gain of 2 rows and record the tune gain as built in |
| 2 | Keep the brief-cost script's hook runs out of the operator's health log | New in this merge, from checking residual-limits-4's counts | Build now in the same new phase |
| 3 | Write a prompt-free OpenCode delivery receipt and read it in `briefDelivered` | residual-limits-4 | Wait on the operator. Decision: will another behaviour arm with OpenCode run in this packet? Yes means build the receipt before that arm. No means decline |
| 4 | Give OpenCode a longer wall-clock cap in the behaviour runner | residual-limits-4, declined there as an advisor change | Wait on the operator, on the same decision as rank 3. A hypothesis: no run measured a longer cap |
| 5 | Score the degraded answer with the TypeScript handler in process | inprocess-timing-4, segment three rank 6 | Decline. 0 of 1,283 real records took the local scorer. The handler also returns nothing where the Python scorer answers |
| 6 | Give `/create:skill-parent` a scorer row | embed-text-4, the rest of segment three rank 10 | Decline. A hypothesis: the only numbers are 0 of 1 tune and 0 of 1 holdout without the row |
| 7 | Send `includeCompiledRoute` and `compiledRouteTopOnly` from the OpenCode plugin | residual-limits-4 | Decline. 0 of 44 typed rows change |
| 8 | Make the head more directive for Claude's start rows | residual-limits-4, a hypothesis there | Decline. All 8 Claude start rows are `/create:*` commands that phase 016 plans to restore to Claude's listing. No run measured a head change |
| 9 | Add a tie-break line for ambiguous prompts | residual-limits-4, a hypothesis there | Decline. At most 1 of the 9 probe heads is ambiguous |

Not re-ranked, because an earlier segment or the operator settled them: Codex hook approval (waiting on the operator in the goal log), the Claude `create` skill (segment three rank 7, a phase 016 build on the operator's answer), trimming the directive (segment one) and cutting the head's status, scores and pass mark (segment three section 4 (f)). residual-limits-4 reopened rank 7 with a start-side number. That number becomes a check for phase 016 in section 4 (c).

Detail for every ranked item:

| Rank | Files | Measurable gain | Verify | Floor risk |
|---|---|---|---|---|
| 1 | `.skilled/commands/doctor/_routes.yaml` (the `/doctor:speckit`, `/doctor:setup`, `/doctor:install` and `/doctor:update` routes at lines 65, 376, 626 and 758) and `.skilled/skills/system-spec-kit/command-metadata.json` (`/speckit:search` at line 215). Then `derive-command-bridges.cjs`, a re-embed through `skill_graph_scan` (`handlers/skill-graph/scan.ts:53-54`) and a `--write` recapture of `command-routing-baseline.json`. The 23 phrases are in `lineages/embed-text-4/scratch/metadata/enriched-embedding-text.json` | Holdout 3 to 5 of 44, on `/doctor:install` and `/doctor:speckit`. Tune top-1 13 to 18 of 45, built in. Both from the vector half alone (rerun) | The real capture against the rebuilt database prints holdout 5 of 44 or more, typed 24 of 44 and false offers 0 of 35 in both columns. `mns-chat-03`, `nm-system-skilled-doctor-01` and `sv-03` stay command-free. The fixture recapture diff is read before commit. `route-validate.sh` and `doctor-phrase-reach.cjs` pass for the four doctor routes | Medium. The same phrases feed the lexical lanes, which no run measured. A phrase copied from a tune prompt is the likeliest to reach a near-miss row. Phase 016's doctor default also changes doctor routing, so this capture should run on top of it (inferred) |
| 2 | `.skilled/skills/system-skill-advisor/runtime/scripts/measure-brief-cost.mjs` (the child env at line 167 gains `TMPDIR` set to the sandbox folder the script already deletes, which moves the metrics root of `metrics.ts:185`) and `runtime/tests/measure-brief-cost.vitest.ts` | One run wrote 44 records into the health file of the workspace it ran in, each marked stale and local-scorer (rerun). That is 44 of the day's 47 stale records and 44 of its 57 marked ones. `rollingDegradedRate` reads a workspace's last 30 records (`metrics.ts:482-492`), so right after a run that workspace reads 1.0 and falls to 0 only after 30 more real prompts | One script run leaves the line count of every file in the metrics folder unchanged and still prints its row count. The test asserts the child env names the sandbox folder | None. A measurement script. Rank 5's reopen trigger reads this rate |
| 3 | `.opencode/plugins/system-skill-advisor.js` (after `observeEmittedAdvisorBlock` at line 975), `runtime/scripts/routing-accuracy/command-offer.mjs` (an `opencode` branch in `briefDelivered` at line 220), `.opencode/plugins/tests/system-skill-advisor.test.cjs` and `runtime/tests/command-offer.vitest.ts` | 0 rows on the committed arm, because its 24 OpenCode lines carry no receipt (derived). In a new arm, up to 24 of 24 OpenCode lines move from `deliveryUnknown` to a stored answer (inferred). Today 24 of 24 read `deliveryUnknown` (rerun) | A plugin test asserts one prompt-free receipt per emitted block. One OpenCode row in the next arm scores `briefDelivered` true | None to commands. A new file beside the health records |
| 4 | `runtime/scripts/routing-accuracy/run-command-behaviour.mjs` (`CAP_MS` at lines 73-75: 300,000 ms for a chat turn and 900,000 ms for a started one, keyed by prompt kind and not by runtime) | A hypothesis. 8 of 24 OpenCode runs ended at exit 143 and 6 of 14 offers were capped (rerun). No run measured whether a longer cap lets them finish | In the next arm OpenCode's `cappedOfferRows` falls below 6 and its judgeable offers rise above 8 | None to commands. Each capped OpenCode turn costs up to the new cap in arena time |
| 5 | `runtime/skill-advisor-cli.ts` (`runLocalScorer` at lines 1455-1475 and `degradedRecommendations` at lines 1481-1526) and `runtime/tests/cli-degraded-command-contract.vitest.ts` | Nothing in real traffic: 0 of 1,283 records took the local scorer. On the 10 probe prompts the named skill changes on 5, gaining the right owner on 3 and losing it on 1 (rerun). No untyped prompt gains a command under Q026 (rerun) | If reopened: `hookHealth.rollingDegradedRate` above 0 in a real workspace across a week, after rank 2. Then a vitest forces exit 75 with no generation file and asserts the Python answer survives | Medium. The literal wiring drops the typed `/create:readme` and an absent generation file empties the answer (both rerun) |
| 6 | `.skilled/skills/sk-doc/command-metadata.json` at line 48 and `runtime/scripts/command-bridges/scoring-compatibility.json`. Then `derive-command-bridges.cjs` flips `scorerRow` at `runtime/lib/command-attach.ts:135` | None measured. 0 of 1 tune and 0 of 1 holdout without the row (rerun). The typed row already reaches `/create:skill-parent` through the `sk-doc` route (fixture rerun, `carried: attached`) | If reopened: a scratch capture with the row prints its plain counts beside typed 24 of 44 | Medium. A new scorer row is a new candidate on every create prompt (inferred) |
| 7 | `.opencode/plugins/system-skill-advisor.js` (`advisorCliRequest` at line 866) | 0 of 44 typed rows differ in top, command, policy or ambiguity (residual-limits-4, not rerun) | `lineages/residual-limits-4/scratch/cli-parity.mjs` already prints the zero | None |
| 8 | `runtime/lib/render.ts` and the golden brief test | A hypothesis. Claude started 2 of 8 start rows where Devin started 7 and DSH 6 (rerun) | If reopened: Claude's start count on the 8 create rows in an arm after phase 016 | Bytes on every brief that carries a start command |
| 9 | `runtime/lib/render.ts` | A hypothesis. At most 1 of 9 probe heads, the 305-byte `ambiguous` probe (rerun from the render probe) | None proposed | Bytes on every ambiguous brief |

## 4. Answers to the carried questions

### (a) Richer command embedding text: segment three rank 10 and open question 5

Answer: build for the five scored commands and claim only the holdout gain.

| Measure | Before | After | Status |
|---|---|---|---|
| Typed recall at 1 | 24 of 44 | 24 of 44 | Reproduced |
| Plain tune top-1 | 13 of 45 | 18 of 45 | Reproduced, built in |
| Plain tune with attached commands | 28 of 45 | 33 of 45 | Reproduced, built in |
| Plain holdout top-1 | 3 of 44 | 5 of 44 | Reproduced, counts only |
| False offers in the top three | 0 of 35 | 0 of 35 | Reproduced |
| Attached false offers | 0 of 35 | 0 of 35 | Reproduced |
| `needs_mode_floor` | 1 of 35 | 1 of 35 | Reproduced. Phase 015 accepted the one row, `nm-system-skill-advisor-01` |

Source: `capture-command-routing-baseline.mjs --real-embedding` with `SYSTEM_SKILL_ADVISOR_DB_DIR` on copies of the lineage's `scratch/db-before` and `scratch/db-after`. Both outputs equal the lineage's files in every field but the date.

- The five tune rows that moved are `cmd-doctor-install-plain-tune-01`, `cmd-doctor-setup-plain-tune-01`, `cmd-doctor-speckit-plain-tune-01`, `cmd-doctor-update-plain-tune-01` and `cmd-speckit-search-plain-tune-01`. Each went from no top to its own command.
- Holdout moved on `/doctor:install` and `/doctor:speckit`. It did not move on `/doctor:setup`, `/doctor:update` or `/speckit:search`.
- The three doctor-family floor rows pass. `mns-chat-03`, `nm-system-skilled-doctor-01` and `sv-03` keep `system-skilled-doctor` on top with no command in the top three. Their 0.82 confidence was not re-read, because the capture does not print it. The 14 skill vectors are identical across the two copies, so the skill's own vector did not change.
- The tune gain is built in. Each command's new phrases include its own tune prompt word for word. Segment three declined rank 8 for that pattern because its holdout gain was 0. Here the holdout gain is 2, so the pattern does not block the build. It does set what the build may claim: 2 of 44.
- What is not measured: the lexical half. The capture reads lexical evidence from the tracked bridge file (`capture-command-routing-baseline.mjs:59`). In the build the same phrases also reach the lexical lanes. Rank 1's verify column is the control.
- Open question 5 is answered for command vectors: richer text moved 2 holdout rows. Skill vectors were not tested, so segment three rank 16 stays declined.
- `/create:skill-parent` cannot move from text alone. It has no stored vector and no scorer row (rank 6).

### (b) The in-process degraded scorer: segment three rank 6

Answer: decline, with the reopen trigger below.

Timing, as median and worst over ten runs, with the embedder warm in both runs:

| Measure | Lineage | This draft's rerun |
|---|---|---|
| Cold handler, import and one call | 224.7 and 428.6 ms | 215.2 and 303.6 ms |
| Cold whole process, one prompt | 239.4 and 443.0 ms | 229.6 and 318.7 ms |
| Warm handler call | 76.5 and 93.6 ms | 74.8 and 102.4 ms |
| Today's Python fallback spawn | 238.5 and 377.7 ms | 200.3 and 258.9 ms |
| Composed proposed path, whole process | 231.1 and 428.5 ms | 206.8 and 568.2 ms |
| Composed today's path, whole process | 219.9 and 544.3 ms | 217.6 and 247.4 ms |

Sources: `lineages/inprocess-timing-4/scratch/` and this draft's rerun of the same `timing-handler.mjs` and `compose-timing.mjs` on a copy of its database. Both columns use the lineage's median, the lower middle of ten values. The lineage printed 337.7 ms as the first worst, which is the call alone.

- Against the hook's 2.5 s budget: the worst value in either run, 568.2 ms, uses 22.7 percent. Both paths fit. Neither path is faster beyond noise, because the worst-case order flipped between the two runs. The budget figure counts the fallback alone. A fallback that follows a daemon timeout starts later, for both paths alike.
- Against today's fallback: the medians differ by less than 25 ms in both runs.
- Floors: the live path is unchanged. The fixture capture still reads 24 of 44 and 0 of 35. That capture never runs the degraded path, so it does not test rank 6. On the degraded path the literal wiring drops the typed `/create:readme` on 1 of 1 typed probe. The corrected filter keeps it and adds no command to the 9 untyped probes. With no generation file the handler returns 0 recommendations on both readme probes, while the Python scorer still answers. By code the handler also answers empty when a stopped daemon wrote `unavailable` (`lifecycle.ts:121-127`) and its PID file names a dead process (`advisor-status.ts:453-461`, `trust-state.ts:119-121`, `advisor-recommend.ts:130` and `:595-600`). That case is inferred and not run. So false offers stay 0 on the degraded path, but typed recall does not hold as rank 6 is written.
- How often the path runs: phase 015's marker `degraded: true` (`user-prompt-submit.ts:426`, `metrics.ts:410`) is on 57 of the 1,828 records for 2026-11-13. 44 are the T030 cost run at 10:37Z. 13 sit in files with one or two records each, the shape of test workspaces (inferred). Outside the cost run's minute, the eight files with ten or more records hold 1,283 records since the phase 015 build at 10:22Z, with 0 marked. Records written before phase 015 needed `SKILL_ADVISOR_DEBUG`, which also writes the skill label. 226 of the 1,283 carry a recommendation brief of over 250 bytes and no skill label, so the phase 015 writer wrote them. It is the only writer that can set the marker. Segment three's upper bound of 2.5 percent would predict about 32 of 1,283.
- Value without rank 12: on 2026-11-13 the operator kept the degraded brief typed-command only. So rank 6 can never add a command. It can only change the skill the degraded brief names, a net gain on 2 of 10 probe prompts. It can also add the `(needs a mode)` label once the filter passes it through. The path it changes did not run in real traffic in this window.
- Reopen when `hookHealth.rollingDegradedRate` shows real use over a week, after rank 2 removes the cost run's records. A build then needs a fall-through to the Python scorer on an empty fail-open answer. Its filter must also keep the handler row's own typed command.

### (c) What the reader sees on each runtime

| Runtime | Brief delivered | Started of judgeable offers | Start rows started | What limits it |
|---|---|---|---|---|
| claude | 24 of 24 | 5 of 14 | 2 of 8 | All 8 start rows are `/create:*` commands its listing hides. Phase 016 targets it |
| devin | 24 of 24 | 10 of 11 | 7 of 8 | Nothing measured |
| dsh | 23 of 24, 1 unknown | 11 of 13 | 6 of 8 | Nothing measured |
| pi | 24 of 24 | 7 of 14 | 4 of 8 | No measured cause |
| opencode | 24 unknown | 3 of 8 | 2 of 8, 6 capped | Delivery unproven. 8 of 24 runs hit the wall-clock cap |
| codex | 0 of 24 | Not measurable | Not measurable | Hooks unapproved, waiting on the operator |

Sources: `007/scratch/runs-final.jsonl` and `015/scratch/summary-final-after.json`, rerun. Codex comes from the goal log. The arm ran at `320e7b64d4`, before phases 014 and 015. Phase 015 rescored it.

Brief content is not the difference. The hook and the OpenCode plugin send byte-identical text on 9 of 9 probes at 244 to 305 bytes (rerun). The CLI answers the hook's and the plugin's options the same on 44 of 44 typed rows (residual-limits-4, not rerun). For phase 016, Claude's start count on these 8 rows is the number that shows whether restoring the listing changes behaviour. It reads 2 of 8 today. residual-limits-4 notes that the run log cannot say which 2 rows Claude started, because it stores the offer and not the start.

### (d) Brief size and hook latency

| Measure | Value | Source |
|---|---|---|
| Live brief, 44 typed rows | Median 306, p95 337, max 350 bytes. 44 of 44 live | residual-limits-4 `scratch/live-brief-ts.json`, not rerun |
| Head line of the same briefs | Median 88, p95 119, max 132 bytes | Same, not rerun |
| Directive block | 217 bytes after the head line, about 71 percent of a 306-byte brief | `015/scratch/render-entries-after.json`, rerun |
| Hook duration, 1,828 records on 2026-11-13 | Median 178, p95 294, p99 396, max 893 ms. 0 over 1,000 ms | Health records, rerun |
| Briefs sent | 325 of 1,828 records, 265.6 bytes on average | Same, rerun |

Neither size nor latency limits the brief. The p99 of 396 ms uses 15.8 percent of the 2.5 s budget. The only head decoration left is the status word, the two scores and the pass mark, about 30 bytes by residual-limits-4's estimate. Segment three eliminated cutting them. Segment one decided the directive. The live median also closes phase 015's open limitation 1 with a number, read from the lineage and not rerun.

### (e) Segment three open questions this segment answers

- Question 2, the share of stale briefs that came from the fallback: in the health log for 2026-11-13 no record in the eight busy workspace files carries the local-scorer marker. The marked records are the T030 cost run (44) and one record in each of 13 files that hold one or two records. 44 of the 47 stale records are that same cost run. The transcript count of 132 stale briefs was not re-measured.
- Question 5: answered for command vectors in (a).
- Question 6: answered in (b), with the embedder warm.
- Question 8, the embedder's cold first call: still UNKNOWN. Every run in this segment found the model loaded.

## 5. Eliminated alternatives

- Feeding handler rows to `degradedRecommendations` as it stands: it drops the typed `/create:readme` (rerun).
- Relying on "keep the Python path when the import or the call throws": an empty fail-open answer throws nothing (rerun with no generation file).
- Proving the OpenCode receipt by re-scoring the committed arm: those lines hold no receipt.
- A store reader for OpenCode delivery: the store holds no injected row. A reader would count 10 model quotes as delivery (residual-limits-4, not rerun).
- Reading `status: degraded` as the degraded-path rate: it marks an unavailable advisor that sent no brief (`skill-advisor-brief.ts:218`).
- Treating the cost script's refusal as a stale hook build: the shim and the advisor build are both current.
- Editing the shared vitest setup so hook tests stop writing health records: the file belongs to `system-spec-kit` (`vitest.config.ts:37-39`) and the source of the 13 records is inferred. Phase 015 already records it as known limitation 3.
- Not reopened, because no new measurement changes them: trimming the directive, cutting the head's status and scores, warming the embedder, `keep_alive`, skill intent signals (segment three rank 16) and Codex hook approval.

## 6. Convergence

Values confirmed from each lineage's `deep-research-state.jsonl`.

| Lineage | Iterations | Stop reason | Novelty per iteration |
|---|---|---|---|
| `embed-text-4` | 3 | `all_questions_answered` | 0.45, 0.88, 0.35 |
| `inprocess-timing-4` | 3 | `all_questions_answered` | 1.0, 1.0, 1.0 |
| `residual-limits-4` | 4 | `converged`, on question coverage | 0.80, 0.90, 0.83, 0.75 |

`residual-limits-4` wrote minute-rounded timestamps. Three of them fall after its run window closed at 12:10:28Z (`orchestration-summary.json`, `timestamp_anomalies`). Its novelty values are its own report. No lineage came near 0.05. None used its cap of eight iterations.

Segment four has not converged against the 0.05 threshold. Segments one to three did not either: no lineage's last novelty in `fanout-attribution.md` is at or below 0.05. Segment four has converged on what a research segment can still measure. This draft judges that a fifth segment is unlikely to find a new measured gain, because every open item needs something a research lane may not create. Rank 1's lexical half needs a build-phase capture. Ranks 3, 4 and 8 need a live arm. Rank 5 needs a week of real traffic. Codex needs the operator's approval. The two levers this segment could measure were measured. The brief's bytes and latency leave no cut that loses nothing. That is this draft's reading of the evidence. A lever that a lane could measure without a build or an arm would change it.

This draft proposes no segment five. It proposes recording the goal's research criterion as converged on coverage, with the 0.05 threshold never reached.

## 7. Open questions

1. Does rank 1's lexical half move any floor row? Owner: the new phase's fixture and real captures.
2. Will a behaviour arm with OpenCode run again in this packet? Owner: the operator (ranks 3 and 4).
3. Does Claude start the 8 create rows once phase 016 restores its listing? Owner: phase 016's check or the next arm (rank 8).
4. Does real traffic reach the local scorer at all? Owner: `hookHealth.rollingDegradedRate` over a week, after rank 2 (rank 5).
5. Which runs wrote the 13 marked records in small health files? Phase 015 records that hook tests without a persist stub write real logs (known limitation 3). Owner: whoever takes up that limitation.
6. What does the embedder's cold first call add to the in-process path? Owner: the next run that finds the model unloaded.
7. Does Codex under `workspace-write` block the hook's socket and with which error? Owner: the operator's approval, then one Codex run. Carried from segment three question 3.
8. The three typed policy labels phase 011 found in disagreement. Owner: the operator. Segment three question 9 named them. The answers of 2026-11-13 in the goal log do not cover them.
