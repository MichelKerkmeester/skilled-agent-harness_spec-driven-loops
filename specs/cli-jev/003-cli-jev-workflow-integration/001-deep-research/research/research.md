---
title: "Deep Research: Jev Typed Judgments Across .skilled Skills and Workflows [cli-jev/003-cli-jev-workflow-integration/001-deep-research/research]"
description: "Round 1 re-synthesized from the AI Council review. Two build-now zero-call slices (an offline advisor tie-break arm with a keep rule that can fail, and a compaction recall census), three next items, 14 later and 40 dropped ideas, all dormant without a Jev key."
trigger_phrases:
  - "jev workflow integration synthesis"
  - "jev advisor tie-break arm"
  - "jev goal verifier shadow"
  - "jev what not to build"
  - "jev compaction recall census"
  - "jev goal criteria lint"
importance_tier: "important"
contextType: "research"
---

# Deep Research: Jev Typed Judgments Across .skilled Skills and Workflows

Merged synthesis of three lineages (DeepSeek, MiMo and Grok, 10 iterations each) for `specs/cli-jev/003-cli-jev-workflow-integration/001-deep-research`, re-synthesized on 2026-09-26 from the AI Council review in `ai-council/` by a fresh Opus 5.5 xhigh leaf (parent `goal.md:52`, D4). Every `jev` in this file is the Python `jev-cli` 0.6.2 that `.skilled/skills/cli-jev/cli-usage/` wraps, unless the sentence names the npm `jevctl` 0.2.3 vendored under `context/external repo's/jev-cli-main`. The first synthesis is recoverable from git commit `021437ceda`, and the section after section 1 lists every change against it.

## Table of Contents

1. Executive Summary
   - Changes From the First Synthesis
2. Scope, Method and Inputs
3. RQ1 Grading AI Responses
4. RQ2 Active Skill-Advisor Recommendations
5. RQ3 Goal Hooks, Plugin and Extensions
6. RQ4 Compaction
7. RQ5 Cross-Cutting Judgment Points
8. RQ6 New Skills, Commands and Workflows
9. RQ7 Cost and Restraint
10. Cross-Lineage Agreement
11. Recommendations, then What Not To Build and Divergence Map
12. Open Questions
13. Proposed Build Phases
14. Citation Verification Ledger
15. Evidence Quality and Caveats
16. References
17. Convergence Report

---

## 1. Executive Summary

- Jev still earns its first place here as an offline measurement, not a live feature. The operator's key gate (D5) makes every feature dormant unless `jev auth status` exits 0, but it moves no hook deadline, so every drop that rests on the 2500 ms advisor kill or the 3 s PreCompact hook stands.
- Build now, both at zero calls first:
  - `002-advisor-jev-tiebreak-arm` (R1), with a keep rule that can now fail. The first rule passed a coin-flipping judge. The new one runs an exact sign test over modal picks, requires a per-row flip rate at or below 0.10 and a win over three zero-call comparators, and prints one of `keep`, `kill`, `inconclusive` or `underpowered`.
  - `005-compaction-recall-harness` (R19), a census of the operator's own host compactions. This project's transcripts hold 208 of them today, p50 104.4 s, none under 60 s and 380 minutes in total (counted today). Every one started at 450,019 tokens or more, so the census's first job is to say whether a Jev deletion pass could fit the vendored 25,000-token state budget at all.
- Next:
  - `006-goal-criteria-jev-lint` (R20), which lints goal criteria for the rule the goal judge depends on. It starts lexical, then gets operator labels.
  - The zero-call slice of `003-goal-verifier-jev-shadow` (R2), reshaped around a clamp defect. Evidence longer than 1,200 characters can never reach `met` in the OpenCode heuristic or in goal-core, which Pi uses. As a proxy, 414 of 753 (55.0%) of the operator's own last assistant texts before a native goal verdict are that long (counted today on Claude transcripts, transfer inferred).
  - R21, a Gate 3 calibration arm inside 002 that runs only when R1's census prints `underpowered`, so 002 always yields a Jev latency number.
- Goals are re-aimed at authoring. The goal verdicts on record come from Claude Code's native judge (755 `goal_status` records, counted today), which "sees only the stored string". The OpenCode plugin's default state directory holds 5 active records, all Hermes and all `not_evaluated`.
- Before any session text leaves the machine, one gap must close. The plugin's redaction keyword rule and the repository's own secret scrubber both let `TYPESAFE_API_KEY=` and `SERVICE_TOKEN=` through, confirmed by running copies of both regexes.
- Verdicts: 2 build-now, 3 next (one conditional), 14 later and 40 drop, plus 3 dead ends under What Not To Build. R11 folds into R19, and R14 drops.

---

## Changes From the First Synthesis

The first synthesis is recoverable from git commit `021437ceda` (`git show 021437ceda:specs/cli-jev/003-cli-jev-workflow-integration/001-deep-research/research/research.md`). Every row below was checked against the code or a count during this re-synthesis. Section 14 rows 144 onward hold the citation results.

### Changed verdicts, ranks and phases

| # | Item | Old state | New state | Reason | Evidence |
|---|---|---|---|---|---|
| V1 | Verdict counts | 1 build-now, 1 next, 16 later, 32 drop, 3 dead ends | 2 build-now, 3 next, 14 later, 40 drop, 3 dead ends. R11 folded | The rows below | This section |
| V2 | R19 compaction recall census | Absent | build-now for the zero-call census, later for the Jev arm. Rank 2, phase 005 | The measured cost sits at the host summary, which the first synthesis never examined, and the census sends nothing | `.claude/settings.json:38`, 208 `compactMetadata` records counted today |
| V3 | R20 goal-criteria lint | Absent | next. Rank 3, phase 006 | A rule the goal judge depends on has no machine check | `check-goal.cjs:44-49`, `sk-create-goal/SKILL.md:121-122`, `goal-set-string-playbook.md:55-57` |
| V4 | R21 Gate 3 calibration arm | Absent. Gate 3 was a negative control only | next, conditional inside 002. Rank 5 | 002 could end with no Jev number at all | `labeled-prompts.jsonl`: 127 `yes`, 68 `no` |
| V5 | R2 goal verifier | next for the measurement, plugin mode behind a threshold. Rank 2 | next for the zero-call slice only. The Jev arm and plugin mode move to later behind recorded OpenCode or Pi verifier use and two redaction unit cases. Rank 4 | The verdicts on record are the native judge's, and the redaction gap is confirmed | 5 `hermes` records, all `not_evaluated`. Regex copies of `opencode-goal.js:474` and `secret-scrubber.ts:128` |
| V6 | R3 advisor served forms | later, cached lane and suggested order | Split. Cached lane drops (row 40). Suggested order stays later | A cache hits only exact repeats, and a first ask still meets the 2500 ms kill | `user-prompt-submit.ts:22-24`, `:109-125`. 3.6% exact repeats, seat-reported |
| V7 | R11 compaction brief selection | later | Folded into R19. Its brief question becomes R19's brief column and its Jev pass R19's later arm | One harness measures the host summary and the brief on the same transcripts | `compact-inject.ts:1-8`, `:117-178` |
| V8 | R14 next-focus comparator | later | drop (row 41) | `compareNextFocusShadow` has no runtime caller | rg: only `next-focus/index.ts:13`, its definition at `next-focus-selection.ts:352` and `next-focus.vitest.ts:25`, `:474` |
| V9 | Ranks 3 to 18 | R3 to R18 in id order | R20, R2 and R21 at 3 to 5, then R3 to R18 without R11 and R14 at 6 to 19 | V2 to V8 | Section 11 table |
| V10 | Phase plan | 002 and 003 | 002 and 003 amended, 004 is the existing research phase, new 005 and 006 | New build phases number from 005 because `004-deep-research-expansion` exists | Parent `spec.md:113-118` |
| V11 | What Not To Build | Rows 1 to 35 | Rows 36 to 42 from the council and row 43 from this re-synthesis. Reasons change for rows 1, 5, 6, 7, 9, 21, 22, 27, 30 and 31 (K7 to K15, K2). Row 14 gains seat-001's reopened line, and row 35 carries 44 or 45 by counting method | Each new row and changed reason rests on the evidence in its own row | What Not To Build, section 14 rows 144 to 190 |
| V12 | Open questions | 15 questions | 30 questions, with 15 and 20 answered, ending in a "For round 2" list | New seams, the council's disagreements and the single-family caveat | Section 12 |

### Changed records

| # | Record | Old state | New state | Reason | Evidence |
|---|---|---|---|---|---|
| R-a | R1 keep rule | MRR rises, right@3 does not fall, aggregate stability of at least 0.95, and no win from the tau 0.03 slice alone | `keep` needs an exact one-sided sign test at 0.05 over modal picks, a win over each zero-call comparator, no fall in right@3 and a per-row flip rate of at most 0.10. `kill`, `inconclusive` and `underpowered` are the other outcomes. The tau 0.03 split is reported, not vetoed | The old rule passes a random picker (derived) and one net row flips "MRR rises" | `benchmark-stability.cjs:102-108`, `score-outcome-rerank.mjs:150` |
| R-b | R1 rows | The eval's held-out half (88 rows) plus the 64 skill-firing holdout rows | All 177 skill-firing labeled rows (both halves) plus the 64 holdout rows, with cluster and top-3 columns | The half split protects a trained fold, and Jev trains nothing | `score-outcome-rerank.mjs:17-20`, `:119-121`. 195 minus 18 gold-none counted |
| R-c | R1 matching | The copied eval metric, which matches ids exactly | Alias-aware in every metric | The baseline capture matches through aliases, so an exact metric can mark a baseline-correct row wrong | `score-outcome-rerank.mjs:85-93` against `capture-scorer-eval-baseline.mjs:70-76` |
| R-d | R1 env | The capture's env without `VITEST` | Adds `VITEST=true` | The capture and the slice both set it, and 002's plan omits it | `capture-scorer-eval-baseline.mjs:43`, `derive-ambiguity-slice.mjs:51`, 002 `plan.md:63` |
| R-e | R1 call record | Key only | Adds the pick probability and the `none` probability | DeepSeek-08 had them, and the first synthesis dropped them | DeepSeek `iteration-008.md:31` |
| R-f | R1 cost | At most 456 calls, about $0.05 | At most 723 calls, about $0.03 to $0.06, plus 585 short calls only if R21 runs | The pooled rows | 241 rows times 3 reruns, vendor-claimed price |
| R-g | R1 kill criterion | Any loss drops R3 | Only `kill` closes R3's served order. `inconclusive` and `underpowered` close nothing | An underpowered loss is absence of evidence | Section 4 item 10 |
| R-h | R1 size | 150 to 200 LOC | 250 to 320 LOC, estimate | Census columns, comparators, sign test and flip rate | Council estimate |
| R-i | R2 rows | 30 to 50 excerpts the operator authors and strips | Rows carry the raw last assistant text and its as-ingested form, pre-labeled from native `goal_status` records, with the operator adjudicating disagreements and spot-checking agreements | The tail-window arm needs the raw tail, which capture clamps away. Native records carry `met` and a `reason` but no evidence | `opencode-goal.js:1107`. Field census of 755 records |
| R-j | R2 arms | Heuristic, then Jev | Heuristic, tail-window and goal-core parity at zero calls. Jev later, with a per-row flip rate, recorded confidence and a cascade table | A free fix must be beaten before Jev gets credit | `opencode-goal.js:2199`, `:2209`, `goal-core.cjs:606-607` |
| R-k | R2 egress gate | The operator strips secrets | Two unit cases pass first, one for each redaction regex | Both regexes miss underscore-prefixed names | Regex copies of `opencode-goal.js:474` and `secret-scrubber.ts:128` |
| R-l | R2 visibility | One log line per verification | `show` gains a `verifier_shadow=` field (proposed) beside `verifier_source=` | The plugin's only stderr writer is gated on a debug variable | `opencode-goal.js:835-839`, `:2988-2989` |
| R-m | R4 | An offline audit on R2's set | Adds an optional zero-call claims column in 003. The promote line names a reader | On Claude the advisory reaches a log and an async Stop hook only | `completion-evidence-stop.cjs:132-139`, `.claude/settings.json:172-177` |
| R-n | R7 value | A default 5dim run carries a mock D4 | Through the runner the default grader is `noop`, a fixed 1.0. `mock` is the direct-scorer default and the fallback for unknown kinds | Fact corrected | `run-benchmark.cjs:577`, `score-model-variant.cjs:21`, `:208-211` |
| R-o | R8 slice | Local replay, then a five-lineage check | Target inert-novelty windows first. Note that many configs force max iterations | DeepSeek-04's cheaper target, dropped by the first synthesis | DeepSeek `iteration-004.md:82`. 109 of 225 configs, seat-reported |
| R-p | R10 gold | 45 P0-born findings, none downgraded | 44 or 45 by counting method, none downgraded either way | Seat recount | Seat-reported, not reopened |
| R-q | R15 | Near-line pairs only | Adds cross-body same-point pairs, and promotion needs a named reader | DeepSeek-05's blind spot, dropped by the first synthesis | DeepSeek `iteration-005.md:70`, `fanout-merge.cjs:341`, `:348-351` |

### Corrected claims and drop reasons

| # | Where | Old claim | New claim | Evidence |
|---|---|---|---|---|
| K1 | Section 3 item 1 | "A default 5dim run carries a mock D4" | Through the runner the default is `noop`, a fixed 1.0. `mock` is the default only for a direct call of the scorer | `run-benchmark.cjs:577`, `score-model-variant.cjs:21`, `:208-209` |
| K2 | Section 3 item 6, row 7 | The 0.22-to-0.58 shift cited against per-turn Jev grading | The report concerns meraGPT's "Decider 1", whose relation to Jev the line does not state. It is no longer cited as Jev evidence | Pi post `:1121` |
| K3 | Section 4 item 2 | The cluster "is a closed set of 2 to 4 keys" | The cluster has two or more keys and no size cap in code | `ambiguity.ts:22-36` |
| K4 | Section 5 item 1 | "The vocabulary needs no mapping" | True inside OpenCode only. goal-core returns `met`, `not-met` and `unclear` | `goal-core.cjs:596-620`. DeepSeek `iteration-003.md:66` said so in round 1 |
| K5 | Section 5 | No clamp finding | Evidence over 1,200 characters never reaches `met` in OpenCode or in goal-core | `opencode-goal.js:382-389`, `:1107`, `:2199`, `:2209`. `goal-core.cjs:290-297`, `:606-607` |
| K6 | Section 6 answer | "No live Jev pass fits the Claude compaction hook" | True for the PreCompact command hook. The function-hook route that replaces the host summary is enabled here, and its deadline is UNKNOWN | `.claude/settings.json:38`, `:215-222`. npm `jevctl` `claude-code.d.ts:3024-3026` |
| K7 | Row 1 | A live advisor call cannot fit | The kill is confirmed. That a call cannot fit is inferred until a latency exists, and a revival rule is written | `user-prompt-submit.ts:22-24`, `:105-125` |
| K8 | Row 5 | Drops live compaction outright | Narrowed to the PreCompact command hook | `.claude/settings.json:215-222` |
| K9 | Row 6 | Default-on compaction | Restated under D5, plus the vendored hook's key read outside the gate and its 60% auto-compact | npm `jevctl` `fast-jev.ts:26-31`, `:75`, `:237-253`, `:289-303` |
| K10 | Row 9 | `noop` named among default scores | Appended: `noop` is the runner's default, so every default 5dim run already carries its fixed score | `run-benchmark.cjs:577` |
| K11 | Row 21 | Gate 3 corpus as a negative control | The corpus is R21's calibration input. Row 21 still drops the product | `labeled-prompts.jsonl` |
| K12 | Row 22, disagreement 7 | "No decision reads either output" | The level script reads the flags. The drop stands on low stakes and missing gold | `recommend-level.sh:36-47` |
| K13 | Row 27 | A shared helper waits for its third caller | The trigger is named: whichever of the R19 or R20 Jev arms is built first. Skip lines align now | 002 `spec.md:112`, `:131`, 003 `spec.md:121` |
| K14 | Row 30 | Protects the aggregate coefficient | Protects the per-row flip rate | `benchmark-stability.cjs:102-108` |
| K15 | Row 31 | The live check has 1200 ms | On Claude the sentinel runs in an async 10 s Stop hook. The 1200 ms bound and the host-blocking spawn are OpenCode's. The drop stands on Q11 | `.claude/settings.json:172-177`, `completion-evidence-sentinel.cjs:90-94` |
| K16 | Disagreement 3 | A loss kills R3 outright | Only a `kill` closes R3 | Section 10 |
| K17 | Open question 15 | S12 and S21 unexamined | Answered: no fit (row 39) | `git-preflight-advisory.mjs:113-119`, rg for `bayesian-scorer` |
| K18 | Section 15 merge note | DeepSeek undercounted, cause not traced | The loss happened before the merge: DeepSeek's own lineage registry already holds 8 of its 57 | Counted today |
| K19 | Council mitigation carried into R2 and R19 | (Council) route session payloads through the fail-closed scrubber | Necessary, not sufficient. "Fail-closed" covers scrubber errors, not coverage, and its assignment pattern shares the underscore gap | `secret-scrubber.ts:14-16`, `:124-130`, regex copy executed |

### Council proposals: adopted, modified and rejected

Adopted:
- R1 stays build-now with a keep rule that can fail, alias-aware matching, `VITEST=true` and both corpus files scored whole. The code lines hold.
- The per-row flip rate replaces the aggregate coefficient for R1 and R2. `benchmark-stability.cjs:102-108` holds.
- R19 build-now for the census only. My recount (208, p50 104.4 s) holds and exceeds the council's.
- R20 at next, as a separate script that never changes `check-goal.cjs` exit codes.
- R21 conditional inside 002.
- R14 drops. rg confirms no runtime caller.
- R3's cached lane drops. The 2500 ms kill holds.
- R7's `noop` correction, the row 22 and row 31 corrections and the level-flag reason in disagreement 7.
- New drop rows 36 to 42. Rows 36 and 37 rest partly on vendor pages I did not reopen (section 15), but each also drops on a reason that holds without them.
- R4, R15 and R18 stay later (two of three seats), with seat-002's "no reader" point in each promote line.
- The D5 subsection, one switch per feature, one skip-line form and no global switch.

Modified:
- R1's `underpowered` trigger. The council put it at "fewer than 5 decided rows", which the zero-call census cannot know. The census prints `underpowered` when fewer than 5 rows are movable, because a keep needs at least 5 wins and no loss (5 of 5 gives one-sided p = 0.03125). The arm prints it when fewer than 5 rows are decided.
- R1's comparator rule. The outcome-weighted rerank trains its fold on the train half (`score-outcome-rerank.mjs:119-123`), so Jev is compared with it on held-out rows only. The other two comparators score every row.
- R1's modal pick. With three or more keys three reruns can give three different picks. Such a row is `unstable` and counts as undecided (my addition).
- R2's rows. The council said rows are "taken as ingested, after capture redaction and the clamp". Capture clamps at `opencode-goal.js:1107`, so an as-ingested row has lost the tail the tail-window arm needs. Rows carry both forms.
- R2's pre-labels. The council preferred native `goal_status` records "where they carry evidence". None do: the 755 records carry `met`, `condition` and usually `reason`, never evidence. The evidence is the last assistant text before the record in the same transcript (paired for 753 of 755, pairing inferred).
- The scrubber mitigation (K19).
- Row 7's wording. The council called the 0.22-to-0.58 shift "not Jev". The line names meraGPT's Decider 1 and does not say what model it runs, so its relation to Jev is UNKNOWN.
- The function-hook deadline. The council left it UNKNOWN. The vendored type reference says a hook that overruns its budget is skipped and core runs in its place (`claude-code.d.ts:3024-3026`, `:3799-3818`), and its test-clock text puts a hook's budget at ten seconds of real time (`:10177-10178`). The production value for `session.compact` stays UNKNOWN.
- R19's keep threshold gains one condition: any live hook form must also fit that budget once it is known.
- The goal-criterion citation `goal.md:107` drifted. The parent goal was rewritten at `6c44ac6a26`, and the same kind of criterion now sits at `goal.md:89` ("Each build phase the final synthesis proposes is a Planned child").

Rejected:
- The council's interim ruling to keep R1's tau 0.03 veto "until someone checks" the 11-of-24 negative-margin count. The count is now checked and holds (section 10, disagreement resolution D4 below), so the status quo loses its reason.

### The council's five open disagreements

| # | Disagreement | Ruling | Evidence | If unresolved, the round-2 question |
|---|---|---|---|---|
| D1 | Compaction tier: seat-001 later against build-now for the census | Resolved for the tier: build-now for the zero-call census. seat-001's concern about rule-derived recall stays open and becomes a proof-plan spot check | 208 compactions, p50 104.4 s, 380 minutes, none under 60 s (counted today). The census makes zero calls and sends nothing. Every compaction started at 450,019 tokens or more, which makes the fit question the cheapest decision on idea 4 | Open question 27: does rule-derived must-survive recall agree with an operator's reading on a few sessions? |
| D2 | Parking 003 (seat-002) | Partly resolved. The Jev arm and plugin mode wait on recorded use, which all three seats now accept. The zero-call slice stays next | The clamp defect reaches OpenCode and Pi (`goal-context.ts:233-238` nudges on `unclear`), and 55.0% of the operator's pre-verdict texts exceed 1,200 characters (proxy). Native records pre-label rows, which cuts labeling to disagreements | Open question 19: does any OpenCode or Pi goal session record a verifier verdict in any state directory the operator uses? |
| D3 | R14: drop against later | Resolved: drop | rg finds no runtime caller of `compareNextFocusShadow` | None |
| D4 | R1's tau 0.03 veto | Resolved: report the split, no veto | 11 of 24 frozen margins are negative and 2 are zero (counted today). The slice measures a raw-score margin over all candidates (`derive-ambiguity-slice.mjs:62-66`), while ranking sorts on an adjusted score (`fusion.ts:749-776`) and the live cluster uses score or confidence among passing skills (`ambiguity.ts:22-36`). No failure mode for the veto was ever named, and the comparator rule now guards against "any reorder wins on the hardest rows". The reading is my judgment, grounded on the count the council named as deciding | None |
| D5 | Criteria-lint base rate: 1.5% against about 28% | Unresolved | seat-002's strict regex flags 21 of 1,387. seat-003's one-lens sample finds 7 of 25, whose 95% interval runs from about 14% to 48% (Wilson, my arithmetic). Both are one model family | Open question 22: on about 100 operator labels stratified from the criterion lines, what share fails each rule? |

---

## 2. Scope, Method and Inputs

**Scope.** The research questions RQ1 to RQ7 in the `Research Brief` section of `spec.md`. They start from the operator's four ideas in `specs/cli-jev/003-cli-jev-workflow-integration/context/ideas from michel kerkmeester.md:1-13`, each to stay optional behind an env switch and an active Jev key:

1. Grade AI responses.
2. Active skill-advisor recommendations.
3. Upgrade the goal hook, plugin and extension.
4. Jev with a compressor for compaction, or other context reduction.

Building any recommendation is out of scope for this phase.

**Lineages.**

| Label | Model and effort | Executor | Lens | Iterations | Runner duration | Stop reason |
|---|---|---|---|---|---|---|
| deepseek | DeepSeek V4.1 Flash, max thinking | cli-pi | Integration engineer | 10 | 1210974 ms, about 20 min | `maxIterationsReached` |
| mimo | MiMo V2.6 Pro, high thinking | cli-pi | UX and measurement | 10 | 2618334 ms, about 44 min | `maxIterationsReached` |
| grok | Grok 4.7 xhigh fast | cli-cursor | Contrarian and outside patterns | 10 | 664034 ms, about 11 min | `maxIterationsReached` |

Durations are the runner's own `completed` events in `research/observability-events.jsonl`, not lineage state timestamps. Run `1790438758756-5mso8j` reports 3 succeeded and 0 failed (`research/orchestration-summary.json`). The config set `maxIterations` 10, `convergenceThreshold` 0.05, `convergenceMode` off, an empty `divergent` block, a max-iterations stop policy and concurrency 3 (`research/deep-research-config.json`).

**Read order and the wave rule.** No lineage read a sibling file in iterations 1 to 3, so wave 1 agreement is independent. From iteration 4 each lineage read the newest sibling files, and the timing shaped what each could see: Grok finished while DeepSeek was near iteration 5 and MiMo near iteration 1 (the orchestrator's run facts).

- Grok read DeepSeek iteration 2 from its own iteration 4, and DeepSeek iteration 3 at its iteration 8. It never read a MiMo file.
- DeepSeek read grok-003 at iteration 4, grok-007 at 5, grok-010 and mimo-001 at 6, mimo-002 at 8 and Grok's `research.md` with mimo-003 at 10.
- MiMo read finished Grok files and late DeepSeek files from iteration 4, for example deepseek-004, deepseek-009, grok-004 and grok-010.

These come from each iteration's own sibling-check section, by iteration number.

**Inputs read for the first synthesis.** All 30 iteration files. The three lineage `research.md` files. Each lineage's state log, registry and strategy. The merge files under `research/`: `findings-registry.json` and `deep-research-findings-registry.json` (byte-identical by `cmp`), `fanout-attribution.md`, `resource-map.md`, `orchestration-summary.json` and `observability-events.jsonl`. Also `spec.md`, the four digests and `research-angles.md` under `context/`. Also the operator's ideas file, plus the vendored material and posts that the lineages cited. DeepSeek's and MiMo's state records carry no findings arrays, so their findings were read from iteration markdown rather than from the merged count.

**Verification for the first synthesis.**

1. Reopened every `file:line` cited for a ranked recommendation, drops included. Section 14 rows 1 to 143 record each one.
2. Ran read-only local counts with no model call:
   - 409 tracked `deep-review-findings-registry.json` files, for severities and transitions.
   - 84 canary cases across 7 compiled-routing hubs, for expected actions.
   - Row, gold-none and split counts in the three routing corpora, plus their sha256 against the pinned values in `scorer-eval-baseline.json`.
   - Research lineage directories under `specs/**/research/lineages/` that carry `deltas/iter-*.jsonl`.
   - A Python replay of `extractVerdict`'s regex (`reviewer-scorer.cjs:119`) over the 8 recorded reviewer outputs.
3. Did not run any `jev` command of either package, any test suite, `validate.sh`, `generate-context.js`, the H1 ratchet, `score-outcome-rerank.mjs` or any install. No `.env` file was opened.

**Re-synthesis method (2026-09-26).**

- **Inputs.** The first synthesis. `ai-council/council-report.md`, `ai-council/proposed-resynthesis.md`, `ai-council/deliberations/round-001.md` and the three seat files under `ai-council/seats/round-001/`. `spec.md` and the four digests. The parent `goal.md` and `spec.md`, the Planned 002 and 003 specs and the 004 research spec. Ten DeepSeek iteration lines the council says the first synthesis dropped. The code at every `file:line` kept below.
- **Reopened.** Every council claim this file keeps, at its `file:line`. Where the council's lines were close but not exact, section 14 gives the exact ones.
- **Counted today, read-only, no model call.**
  - The frozen ambiguity slice's margins, and the corpus Gate 3 labels and gold-none rows.
  - Callers of `compareNextFocusShadow` and `bayesian-scorer` by rg.
  - In this project's local Claude Code transcripts, numbers and field names only, never content: `compactMetadata` records with `durationMs`, `preTokens`, `postTokens` and `trigger`. `goal_status` records, their field names and `met` values. The character length of the last assistant text before each `goal_status` record.
  - The main checkout's goal state records, by the `runtime`, `lastVerifierVerdict` and `status` fields.
  - DeepSeek's state-log `findingsCount` sum against its lineage registry.
- **Executed.** Node one-liners on copies of two regexes, `opencode-goal.js:474` and `secret-scrubber.ts:128`, over five and three synthetic strings. No repository module was run.
- **Not run.** Any `jev` command of either package, any test suite, `validate.sh`, `generate-context.js`, the H1 ratchet, the rerank eval, any install or any network call. No `.env` file was opened. The vendor pages for jevcache.sh and classifier.dev were not reopened, because the local files hold only their URLs and this leaf has no web tool.

**Claim markers.**

- **Confirmed**: read in code or data, or counted by a command run for this file.
- **Host-verified**: confirmed by the orchestrator on 2026-09-26 and cited as such.
- **Council-reported** and **seat-reported**: a council host or seat reopened it and this file did not.
- **Inferred**: reasoned from confirmed facts, with what would confirm it.
- **Vendor claim** and **user report**: figures from vendored READMEs, vendor pages or posts, never reproduced in this repository.
- **UNKNOWN**: measured nowhere, with what would resolve it.

Short file names in this document map to full paths in section 16.

---

## 3. RQ1 Grading AI Responses

*Where would a Jev grade of a model's output change a decision here, and what harness measures whether the grade agrees with the current judge?*

**Answer.** No grading use earns a build yet. Every seam that could consume a Jev grade lacks gold, and the one set the lineages treated as gold never reaches the seams they proposed. The council review changes no verdict here. It corrects two facts (items 1 and 6).

1. **The 5dim grader seam (S22).** All three lineages found it in wave 1. Confirmed:
   - Through the runner, the grader kind defaults to `noop` (`run-benchmark.cjs:577`, `const graderKind = args.grader || 'noop';`), which returns a fixed D4 of 1.0 (`score-model-variant.cjs:208-209`). A default 5dim run through the runner therefore carries `noop`'s fixed score. The first synthesis said "mock D4" here, which holds only for a direct call of the scorer, whose documented default is `mock` (`:21`).
   - Any kind other than `noop` or `llm` also becomes `mock` (`:211`).
   - D4 carries weight 0.15 (`:58`) and is the grader's score (`:300`). The deterministic `hallucination-flag` check is recorded but never feeds D4 (`:284`).
2. **Its proposed gold does not reach it.** `reviewer-regression.json` says its fixtures run "through the reviewer scorer, NOT run-benchmark.cjs --scorer pattern/5dim", and the runner offers only `pattern` and `5dim` (`run-benchmark.cjs:571`). MiMo-08 caught this. Confirmed. D4 therefore has no oracle of its own, and the only comparison available is agreement between two model graders.
3. **The reviewer scorer's grading path is a verdict classifier.** `classifyWithGrader` (`reviewer-scorer.cjs:155-167`) runs only for `--grader llm`, and only when the regex in `extractVerdict` (`:117-123`) finds no verdict line (`:171`). A `choice` over `pass`, `fail` and `block` fits it exactly. Confirmed.
4. **That classifier is reached on none of today's cases.** The four reviewer fixtures hold 8 cases. All 8 expect `fail`, and all 8 carry a recorded `reviewer_output` that replaces live dispatch (`reviewer-schema.md:74-76`, `reviewer-scorer.cjs:192`). Replaying the regex over those outputs finds a `fail` line in all 8. Confirmed by count, and seat-001 repeated the replay. The digest's "three-way `jev choice` target with gold already written" does not exist.
5. **The reply harness (H13) has an empty blinded-judge slot.** No script calls a model, and the judge scores by `rubric.json` outside the scripts (`reply-harness/README.md:3`, `:20`). A Jev `score` per rubric dimension fits, but only against a human-scored subset nobody has made. seat-002 reports 7 cases and no recorded harness run (seat-reported).
6. **Per-turn grading drops.** This is the form the idea takes in the Pi post (`:231`). It has no gold and taxes every turn.
   - The first synthesis cited Pi post `:1121` here, where context moved a harmless command from 0.22 to 0.58. That line describes meraGPT's "Decider 1", and it also reports a done gate that sent a plan-only answer back at 0.16 and passed a concrete one at 0.90. The line does not say what model Decider 1 is, so its relation to Jev is UNKNOWN and it is no longer cited as Jev evidence (third-party report).
   - The vendor's own review run kept a planted false positive at 0.57 (claude-jev `README.md:85-93`).
7. **Adjacent defect, reported and not fixed.** `--grader` is never validated (`run-benchmark.cjs:577`), and any kind other than `noop` or `llm` becomes `mock` (`score-model-variant.cjs:211`). Anyone trying `--grader jev` today gets mock D4 scores with no warning. Confirmed.

**Harness.** H9 with the gap row "Grader agreement with oracle", and H13. Agreement is UNKNOWN for both.

**What would change the answer.** Reviewer outputs that miss the verdict line on a live run (promotes R5), a D4 hallucination gold set (promotes R7) or a human-scored H13 subset (promotes R6).

---

## 4. RQ2 Active Skill-Advisor Recommendations

*Can a Jev judgment settle cases the advisor scorer handles poorly, and does it beat the scorer on the advisor corpus and ratchets?*

**Answer.** A live Jev call in the advisor cannot meet its deadline on any evidence we have. The testable form is an offline `choice` over the advisor's own near-tie cluster (R1, build-now), and whether any served form follows depends on R1's outcome. The council review found that R1's first keep rule could not fail, and items 10 to 14 replace it.

1. **The live call meets a hard deadline.** The prompt hook spawns the advisor child with `spawnSync`, a 2500 ms timeout and SIGKILL. It returns `{}` on timeout or a nonzero exit (`user-prompt-submit.ts:22-24`, `:109-125`). The advisor's own budget is set to 2200 ms when unset (`:105-107`). Confirmed. All three lineages dropped a live call independently in wave 1. That a Jev call cannot fit is inferred until a latency exists, and R1's per-call record is the first measurement (What Not To Build row 1 carries the revival rule).
2. **The advisor already names its near-ties.** `applyAmbiguity` gives every passing recommendation within 0.05 of the passing top, on score or on confidence, an `ambiguousWith` list (`ambiguity.ts:7-8`, `:22-36`, `:44-58`). It runs after ranking sorts on an adjusted score and the threshold is set (`fusion.ts:749-776`, `:785-789`). The cluster has two or more keys and no size cap in code, so it is a closed option map, the shape a `choice` takes. The first synthesis said "2 to 4 keys", which the code does not cap. Confirmed.
3. **The harness exists.** The rerank eval scores an ordering by MRR, right@1 and right@3 on a deterministic held-out half of the labeled corpus (`score-outcome-rerank.mjs:6-10`, `:96-121`). It flips only when MRR rises and right@3 does not fall (`:149-150`). H1 records holdout top-1 53/70 = 0.7571 and the ambiguity slice 18/24 = 0.75 at tau 0.03 (`scorer-eval-baseline.json:25-35`). Confirmed.
4. **Headroom is small and partly UNKNOWN.** At most 6 rows can move on the ambiguity slice and 17 on the holdout (MiMo-02's arithmetic on those baselines). How many rows have the gold skill inside the cluster but not first is UNKNOWN. R1's census counts it with zero calls.
5. **Two eligibility rules differ.** The frozen ambiguity slice uses tau 0.03 on a raw top-two score margin over all candidates (`derive-ambiguity-slice.mjs:35`, `:62-66`), while the live cluster uses 0.05 on score or confidence among passing skills. Because ranking sorts on an adjusted score, 11 of the slice's 24 frozen margins are negative and 2 are zero (counted today). R1 uses the live cluster and reports the slice split without vetoing on it.
6. **MiMo's abstention arm does not survive.** The capture counts an abstention on a gold-none row as correct (`capture-scorer-eval-baseline.mjs:70-76`) and counts every abstention as unknown (`:96-97`). The corpus has 18 gold-none rows, and the baseline records 5 false fires and 13 unknowns. So all 13 unknowns are correct abstentions, and an abstention arm could fix at most the 5 false fires, not 18 rows. Confirmed by derivation from counted values.
7. **Clarify and defer are too thin to measure.** The 84 canary cases across 7 hubs hold 3 `clarify` and 10 `defer` expectations. Confirmed by count.
8. **One observation, not a measurement.** Both Pi lineages' error logs carry the same advisor-hook event: `fail_open` after 2504 ms with "CLI fallback timed out". The advisor already runs at its deadline in at least one runtime.
9. **An outside opinion.** A commenter on the Hermes post argues that Jev "makes much more sense for choosing which tools and skills to load than for deleting conversation history" (Hermes post `:120`). R1 is how this repository would test that opinion.
10. **The first keep rule could not fail.** Found independently by seats 001 and 003, and rechecked here.
    - The stability coefficient is `1 - sd/|mean|` with sample sd over the passes (`benchmark-stability.cjs:88-92`, `:102-108`), against a 0.95 warning line (`:28`). Host-verified and reopened.
    - Only eligible rows vary between reruns. A judge that flips 20 two-member clusters at random moves held-out MRR by an sd of about 0.25 times the square root of 20, over 88, or 0.013. At a mean near 0.85 that gives a coefficient near 0.985, and near 0.97 even with all 88 rows eligible. A random picker clears 0.95. Derived from the confirmed formula, and the magnitude is inferred until the census counts eligible rows.
    - One net row moves held-out MRR by 0.5/88, about 0.0057, so "MRR rises" can hold on a single lucky row.
    - "right@3 does not fall" binds only when Jev picks a cluster member ranked fourth or lower, because a reorder inside the top 3 keeps gold inside it.
11. **The metric and the baseline match gold differently.** The rerank eval matches the gold id exactly (`score-outcome-rerank.mjs:85-93`). The baseline capture matches through aliases (`capture-scorer-eval-baseline.mjs:70-76`). 002 already applies the alias match to holdout top-1 (002 `plan.md:64`), so the gap is the copied MRR and right@3. Confirmed. seat-001 counts 16 of the 64 skill-firing holdout rows that match only through aliases (seat-reported).
12. **The pinned env has a gap.** The capture sets `process.env.VITEST = 'true'` (`capture-scorer-eval-baseline.mjs:43`), as the slice derivation does (`derive-ambiguity-slice.mjs:51`), and 002's plan omits it (002 `plan.md:63`). Without it the baseline column may not reproduce 53/70. The line is confirmed. Its effect is inferred.
13. **The census covers both files and both halves.** The held-out half is a fixed lexical split (`score-outcome-rerank.mjs:119-121`) that exists to protect a fold trained on the other half (`:17-20`). Jev trains nothing, so scoring it on both halves loses no honesty. The outcome-weighted rerank still scores on the held-out half only. The census therefore counts all 177 skill-firing labeled rows and all 64 skill-firing holdout rows (195 minus 18 and 70 minus 6, counted today).
14. **An underpowered census still yields a Jev number.** A keep needs at least 5 wins and no loss (5 of 5 gives one-sided p = 0.03125). If fewer than 5 rows are movable, R1's arm cannot keep, and R21 runs a `noul` calibration on the 195 Gate 3 labels instead, so 002 always returns a per-call latency record.

---

## 5. RQ3 Goal Hooks, Plugin and Extensions

*Could Jev judge goal progress, drift or criterion completion, and what would it replace or add?*

**Answer.** The OpenCode goal plugin is still the one live seam where a Jev verifier lens fits: an opt-in mode switch, a model-backed precedent and a 30 s budget. Four facts reorder the work.

- Its heuristic, and goal-core's, fail every piece of evidence longer than 1,200 characters through a clamp defect (item 8). A free fix may cure that before any Jev arm.
- The goal verdicts on record come from Claude Code's native judge, not from this plugin (item 9).
- That judge sees only the stored goal string, so criterion quality at authoring is the seam the operator's goals actually pass through (item 10, R20 next).
- Both redaction layers let underscore-prefixed secret names through (item 11), so no session text may leave the machine until two unit cases pass.

R2's zero-call slice stays next. Its Jev arm and the plugin shadow mode move to later, behind recorded OpenCode or Pi verifier use.

| Runtime | What judges completion today | Where | Jev fit |
|---|---|---|---|
| OpenCode | The plugin's own heuristic, or an LLM verifier under `OPENCODE_GOAL_VERIFIER=llm` | `opencode-goal.js:134`, `:226-234`, `:2197-2240`, `goal-plugin.md:52-53` | A third mode value is the smallest extension (R2, later) |
| Pi | The shared `verifyGoalHeuristic` on `turn_end`, then a hidden nudge on any verdict other than `met`, `unclear` included | `goal-context.ts:221-244`, `goal-core.cjs:596-620` | One call per turn, so it follows OpenCode's result rather than leading. The zero-call slice measures its nudge rate through goal-core parity |
| Cursor and Devin | Injection only, with no verify or continue mechanism | `cursor/goal-inject.mjs:11`, `goal/README.md:78-79` | None (dropped) |
| Claude and Codex | The native host goal command, which judges from the stored goal string only | `goal/README.md:81-82`, `goal-set-string-playbook.md:55-57` | No repository verifier to extend. Criterion quality at authoring reaches it (R20) |

1. **The vocabulary needs no mapping inside OpenCode only.** The plugin's verdicts are `met`, `not_met` and `blocked` (`opencode-goal.js:179`), and the `llm` prompt asks for exactly these (`:2232-2240`). goal-core returns `met`, `not-met` and `unclear`, and `not-met` only for blocking language (`goal-core.cjs:596-620`, host-verified). Any comparison across runtimes needs a mapping, as DeepSeek-03 said in round 1 (`iteration-003.md:66`) and 003 REQ-005 already does. Confirmed.
2. **The OpenCode heuristic is binary.** It returns `met` at confidence 0.72 or `not_met`, never `blocked` (`:2197-2230`, `:2308-2317`). Confirmed. A labeled set with a `blocked` class scores the heuristic at zero recall there by construction.
3. **An unknown mode value is silent.** It falls back to `heuristic` with no notice (`:226-229`), so `OPENCODE_GOAL_VERIFIER=jev` today quietly gives the heuristic. Confirmed.
4. **Verifier failures have visible verdicts.** A thrown error becomes `blocked` at confidence 0 (`:2378-2380`), a timeout becomes `not_met` (`:2368-2376`) and an invalid verdict becomes `not_met` (`:2335`). A Jev mode that let a missing key throw would show the operator a false `blocked`. Confirmed. This is why R2 keeps the Jev call outside the authoritative verifier.
5. **Grok's wrapper rule binds any Jev mode.** When the blocking pattern matches, the verdict stays `not_met` and Jev is not asked (`goal-core.cjs:603-604`, `opencode-goal.js:135`). The pattern includes words such as `error` and `failed`, which also appear in real completion messages ("fixed the failing test"). The rule that keeps Jev safe also caps its upside. Inferred, confirmed by the set.
6. **Progress and drift have no consumer.** The Pi verdict drives an observe-only nudge and a `last_check` line (`goal/README.md:77`). A drift score would add a report nobody reads.
7. **A live call from OpenCode must not block the host.** The completion sentinel's own comment records that a spawn from OpenCode blocks the whole plugin host (`completion-evidence-sentinel.cjs:90-94`). A Jev call there must be an async spawn bounded by the verifier timeout. Confirmed from the comment, not measured.
8. **A clamp defect fails every long completion message.** Confirmed from code in both runtimes, host-verified for OpenCode.
   - OpenCode: evidence is redacted at capture (`opencode-goal.js:1107`). `redactEvidence` ends in `sanitizeInlineText` (`:463-475`, `:414-420`), which clamps to 1,200 characters (`:42`) and appends `...` (`clampText`, `:382-389`). The heuristic clamps again (`:2199`), tests the blocking pattern (`:2205`) and then reads a trailing `...` as truncation (`:2209-2211`), returning `not_met` (`:2308-2317`).
   - goal-core, which Pi calls on every `turn_end`: `verifyGoalHeuristic` clamps the same way (`goal-core.cjs:290-297`, `:334-340`, `:597`) and returns `unclear` at the truncation check (`:606-607`). Pi then sends a hidden nudge on any verdict other than `met` (`goal-context.ts:233-238`).
   - So evidence longer than 1,200 characters after whitespace folding can never reach `met` in either runtime. The comment at `opencode-goal.js:2198` says ambiguous evidence "always stays open", so the clamp may look deliberate. It still produces a false `not_met` by construction for a long completion message.
   - Frequency, as a proxy: across this project's Claude Code transcripts, 414 of the 753 last assistant texts before a native goal verdict exceed 1,200 characters after whitespace folding (55.0%, p50 1,586 and p90 3,794 characters, counted today). That these lengths transfer to OpenCode or Pi evidence is inferred.
   - Because capture clamps before storage, a stored `lastEvidence` has already lost its tail. The free fix R2 must test first is a tail-window arm: the same checks on the last 1,200 characters of the raw text, with no appended marker. A live fix would change capture and both heuristics, which belongs to the plugin and goal-core owners.
9. **Recorded use points at Claude Code's native judge.**
   - This project's Claude Code transcripts hold 755 `goal_status` records in 22 files today, 61 with `met` true (counted today). The council counted 750 across 21 sessions, and the difference is consistent with sessions still running.
   - Each record carries `met`, `condition` (the goal string) and in 609 of 755 a `reason`. None carries evidence text (field census today).
   - The plugin's default state directory resolves to `.opencode/skills/.state/goal/` (`opencode-goal.js:36-37`), and `.opencode/skills` is a symlink to `../.skilled/skills`. In the main checkout that directory holds 5 active records, all `runtime: hermes`, `lastVerifierVerdict: not_evaluated`, plus one archive entry (counted today). A custom `OPENCODE_GOAL_STATE_DIR` could hold other records, so OpenCode non-use is inferred, not confirmed.
10. **Criterion quality has no machine check.**
    - `sk-create-goal` requires "three to seven self-contained criteria", each "checkable without opening another file" (`sk-create-goal/SKILL.md:121-122`).
    - `check-goal.cjs` runs four structural checks only: missing binding row, placeholder, criteria count and parent budget (`check-goal.cjs:44-49`). `/create:goal` runs it (`create-goal-auto.yaml:221`).
    - The evaluator sees only the stored string (`goal-set-string-playbook.md:55-57`).
    - This packet's own parent goal breaks the rule today: "Each build phase the final synthesis proposes is a Planned child" (`goal.md:89`) depends on another file. The council cited `goal.md:107`, which drifted when the parent goal was rewritten at `6c44ac6a26`.
    - Confirmed. R20 is the lint.
11. **Both redaction layers miss underscore-prefixed names.**
    - The plugin's keyword rule `\b(api[_-]?key|token|password|secret)\s*[:=]` (`opencode-goal.js:474`) needs a word boundary before the keyword, and `_` is a word character. A copy of the regex, run on `SERVICE_TOKEN=abc123def` and `TYPESAFE_API_KEY=tsk_live_abc123`, left both unchanged, while `token=` and `api_key:` were redacted. Confirmed for the regex copy. The other rules in `redactEvidence` (`:465-473`) can still catch a value with a vendor prefix or 48 or more characters.
    - The repository's secret scrubber is fail-closed on internal errors (`secret-scrubber.ts:14-16`), not on coverage. Its `credential-assignment` rule has the same leading `\b` (`:124-130`). A copy of it left `TYPESAFE_API_KEY=` and `SERVICE_TOKEN=` with 24-character values unchanged. Confirmed for the regex copy.
    - So routing session payloads through the scrubber, the council's mitigation, is necessary and not sufficient. A unit case for each regex must pass before R2's second slice or R19's arm sends anything.
12. **Pi's nudge rate is measurable at zero cost.** Pi nudges on `unclear` (`goal-context.ts:233-238`), so goal-core parity on R2's rows shows how many of those nudges the clamp alone causes. Whether Pi awaits async `turn_end` handlers is UNKNOWN (seat-003).

**Lineage position.** All three agree, independently in wave 1, that a verifier needs a labeled set. The rank was disputed: DeepSeek-03 ranked a `jev` mode next and Grok-08 contested it. DeepSeek-10 and MiMo then moved to later after cross-reading. The council kept next for the zero-call slice only, and seat-002 would park 003 (disagreement D2 above).

---

## 6. RQ4 Compaction

*Can Jev with a compressor decide what survives compaction, and how would recovery quality be measured?*

**Answer.** There are two compaction seams, and the first synthesis examined only one.

- The PreCompact command hook writes a brief under a 3 s limit. No live Jev pass fits it.
- The host's own summary is where the measured cost sits: 208 compactions today, p50 104.4 s. Claude Code function hooks can replace that summary, and they are already enabled in this repository.

Nothing yet measures what either seam keeps. Build the zero-call recall census first (R19, build-now). Build the offline Jev deletion arm only if the census shows a deletion pass can fit and has room to win. At these session sizes, fit is the first thing in doubt.

1. **Two seams.**
   - **The PreCompact command hook.** It precomputes a brief and caches it for SessionStart, and its stdout is not injected on PreCompact (`compact-inject.ts:1-8`). The internal budget is 1800 ms (`shared.ts:12`), the merge warns above 1500 ms (`compact-inject.ts:353-354`) and the hook times out at 3 s (`.claude/settings.json:215-222`). Confirmed.
   - **The host summary.** Claude Code writes its own summary at compaction. A function hook on `session.compact` can answer `{ messages }` of its own, which replaces it (npm `jevctl` `claude-code.d.ts:3311-3322`), and the vendored npm `jevctl` hook does exactly that (`plugin/hooks/fast-jev.ts:269-287`). Function hooks need `CLAUDE_CODE_ENABLE_FUNCTION_HOOKS=1` (npm `jevctl` `CHANGELOG.md:59`), and this repository sets it (`.claude/settings.json:38`, host-verified). It is the only reference outside `specs/`, and no repository module registers a function hook or reads `compactMetadata` (rg today). The hook types include a `precompute` trigger (`claude-code.d.ts:7285`). Confirmed as npm `jevctl` 0.2.3 vendored code, a type reference written by Claude Code 2.1.274 (`fast-jev.ts:9-10`).
2. **The function-hook deadline is partly known.** The vendored type reference says a hook that throws, overruns its budget or answers a wrong shape is skipped, and the hooks beneath and core run in its place (`claude-code.d.ts:3024-3026`, `:3799-3818`). Its test-clock text puts a hook's budget at ten seconds of real time (`:10177-10178`). Whether `session.compact` runs under that budget in the operator's Claude Code 2.1.280 to 2.1.283 (seat-reported versions) is UNKNOWN. If it does, an overrun wastes up to the budget and then falls back to the stock summary.
3. **The measured cost is the host summary.** Counted today in this project's top-level Claude Code transcripts:
   - 208 `compactMetadata` records, 205 auto and 3 manual. The council counted 204 and the orchestrator 206 earlier today.
   - `durationMs`: none under 60 s, 123 at or above 100 s, p50 104.4 s, p90 143.3 s, max 280.3 s and 380.1 minutes in total.
   - `preTokens`: min 450,019, p50 469,399 and p90 969,121. `postTokens`: p50 20,211 and max 46,614.
   - Whether the operator watches these waits is UNKNOWN. Auto-compaction during unattended runs may go unwatched, which would cut R19's value to recall alone (seat-002).
   - The one Jev compaction timing, 5.6 s against 44.8 s for an LLM summarizer, is a user report and was not reproduced (Hermes post `:18-27`).
4. **The vendored library has hard limits.**
   - The placeholder state, prose and tool inputs with tool results replaced by short notes, must fit 25,000 tokens (npm `jevctl` `src/vendor/compaction/compact.ts:24`). Past that it throws "history too large for Jev" (`state.ts:304-306`).
   - The hook falls back to the built-in summary on any error, or when the reduction is under 25% (`fast-jev.ts:26-31`, `:277-285`, `plugin/hooks/README.md:47`).
   - It auto-compacts at 60% of context unless `compactAtPercent` is 0 (`fast-jev.ts:26-31`, `:289-303`).
   - Every compaction here started at 450,019 tokens or more, so fitting prose and tool inputs into 25,000 tokens needs heavy abridging, or the hook falls back. Inferred. R19's census estimates the placeholder-state size per compaction and settles it.
5. **The brief has its own noise.**
   - The path extractor keeps the first 20 paths it matches (`compact-inject.ts:117-127`).
   - The attention extractor counts every capitalized token of 3 or more characters (`:149`), and its noise list holds only JavaScript built-ins (`:151-155`).
   - One observation, not a measurement: seat-003's post-compaction brief listed "The", "Users", "HOME", "MEGA" and "Public" as attention items (seat-reported).
6. **The tests check mechanics.** The precompact tests do not check what survives (`hook-precompact.vitest.ts:29-60`). Confirmed. R19 fills the gap row "Compaction recovery quality".
7. **The prompt-cache hazard, restated.**
   - The brief rewrites no history (`compact-inject.ts:1-8`).
   - A host-summary replacement does rewrite history, but at the compaction boundary, where the stock summary already breaks the cache. Inferred.
   - The vendored hook's auto-compact at 60% would add compactions, and each extra one breaks the cache. Inferred.
8. **Vendored patterns that carry over, and the one that does not.**
   - Off by default, with an egress warning (pi-jev `README.md:35-37`).
   - A missing judgment keeps the item (pi-jev `context.ts:118-126`).
   - Any error falls back to the host summary (`fast-jev.ts:283-285`).
   - The anti-pattern under D5 is the npm `jevctl` hook itself. It runs unless `compaction` is `false` (`fast-jev.ts:75`), reads `TYPESAFE_API_KEY` from its options, the environment or the settings `env` outside any gate (`:237-253`) and auto-compacts. The fast-jev-compaction blog shows the key placed in the settings `env` (blog `:64-68`), which in this repository is the tracked `.claude/settings.json` (What Not To Build row 43).
9. **A cheaper move still comes first.** Measure the brief's 4000-token budget (`shared.ts:14`) inside R19's census. It is a value change with no Jev call (MiMo-03).

---

## 7. RQ5 Cross-Cutting Judgment Points

*Which judgment points are typed judgments today, made by code or by a model, and would Jev make them cheaper, faster or more accurate?*

**Answer.** Jev makes none of them cheaper or more accurate today. It can make several of them measurable, and only a replay or a labeled set can show whether it beats the current judge. The council review drops two more rows here and adds two judgment points no lineage opened.

| Judgment point | Decided today by | Evidence | What Jev could add | Verdict |
|---|---|---|---|---|
| Deep-loop STOP legality | Code: three weighted votes, with authority frozen on legacy convergence | `convergence-signals.md:41-47`, `convergence.cjs:480-486`, `stopping-clock-shadow.ts:10-19` | A second rater, measurable only by replay | Later (R8). Authority drops |
| newInfoRatio | Model self-report | `convergence-signals.md:55-73`, `reduce-state.cjs:965-989` | Same second rater | Later (R8) |
| Finding severity | Model, then its own adversarial self-check. `riskScore` never gates | `completion-criteria.md:61-63`, `:75` | A shadow severity beside the recorded one | Later (R10). Writing severity drops |
| Fan-out near-duplicate merge | Code: content key plus title overlap at 0.15 | `fanout-merge.cjs:341`, `:348-351` | A shadow record of near-line and cross-body pairs | Later (R15). Replacement drops |
| Council verdict delta | Model adjudicator, stop under a 0.20 delta | Seam map S19. seat-001 reopened `convergence-signals.md:56-58` (seat-reported) | It would replace the adjudicator's signal | Drop |
| Next focus | Code: `scoreBps`, with a shadow comparator that nothing calls | `next-focus-selection.ts:351-365`, rg for callers | Nothing: a Jev `choice` there would feed no reader | Drop (row 41) |
| Dispatch guard and linter | Code on repository facts | `dispatch-guard.cjs:80-81`, `:124-132`, `dispatch-rule-checks.mjs:107-117` | Nothing a probability does better | Drop |
| Gate 3 write classification | Code classifier at F1 0.9843 | H3 (digest). `labeled-prompts.jsonl` holds 127 `yes` and 68 `no` | A calibration record, not a product: latency, F1, Brier score and flip rate on labeled prompts | Drop as a product. The corpus is R21's calibration input |
| Spec alignment on save | Code thresholds 70 and 50 | `alignment-validator.ts:73-75`, `:503-520` | A suggestion below 50 | Later (R13) |
| Spec level | Script policy over caller-supplied flags, which add points to the level | `recommend-level.sh:36-47` | Risk flags | Drop, on low stakes and missing gold |
| Post-save quality | Code at a calibrated 0.4 density | Seam map S25 (digest) | A retrievability score | Drop |
| Compiled-routing clarify and defer | Code, behind a tri-state flag | `router.cjs:199-218`, `resolve.cjs:54-64` | A suggested default on clarify | Later (R12). The live front door drops |
| Completion claim at Stop | Code regex over a 400-character tail | `completion-evidence-sentinel.cjs:64`, `:70`, `:113-119` | An offline audit of false fires | Later (R4) |
| Playbook verdicts | Human | Seam map S26 (digest) | A second opinion | Drop |
| Git preflight, MCP route guard, executor demotion | Code | `git-preflight-advisory.mjs:113-119` decides on git rule checks. `bayesian-scorer.ts` is imported only by its own test (rg). Seam map S13 | S12 decides on git facts, and S21 has no production caller | Drop all three. S13 by DeepSeek-05, S12 and S21 by the council review (row 39) |
| What survives host compaction | The host's own summarizer | `.claude/settings.json:38`, transcript counts (section 6) | A `noul` keep-or-drop per old tool call, offline | Build-now census, later Jev arm (R19) |
| Goal criterion checkability | Nobody. `check-goal.cjs` checks structure only | `check-goal.cjs:44-49`, `sk-create-goal/SKILL.md:121-122` | A `noul` per criterion beside a lexical lint | Next (R20) |

---

## 8. RQ6 New Skills, Commands and Workflows

*Which new surfaces are worth building, and what from the vendored integrations carries over or fails to?*

**Answer.** No new skill, command, hub mode or shared helper. Each recommendation calls the transport directly from its one caller.

1. **The transport already covers the need.** `cli-usage` asks all four judgment types with a stable output contract and exit table (`cli-usage/SKILL.md:162-174`), and the hub is one transport mode by design (`hub-router.json:5-14`). Confirmed.
2. **A command or second mode removes no decision.** A `jev-judge` command or second hub mode adds alias replay cost (checklist Q13) and a thing to learn. All three lineages drop it: Grok-07 and DeepSeek-07 from files they opened, MiMo-07 after reading DeepSeek.
3. **A shared client waits for its third certain caller.** A probe, bounded spawn, exit map and strict parse come to about 60 to 80 LOC (DeepSeek-07). R1's script and R2's scorer are callers one and two. The third is whichever of the R19 or R20 Jev arms is built first, and that is when to extract it (What Not To Build row 27). The skip lines align now, before any extraction (section 9).
4. **The patterns carry, the surfaces do not.**

| Pattern | Source | Carries | Why |
|---|---|---|---|
| Thresholds and policy in code, the judgment only as input | claude-jev `review.ts:21-28`, `:91-100`, `integration-patterns.md:43-44` | Yes | The caller owns the threshold here too |
| A missing answer is an error, never a number | claude-jev `question.ts:76-81` | Yes | R1 and R2 mark such rows unmeasured |
| Fail open to stock behavior | pi-jev `context.ts:118-126`, `index.ts:199-207`, npm `jevctl` `fast-jev.ts:283-285` | Yes | Matches the no-key rule |
| Off by default, egress warning at enablement | pi-jev `README.md:35-37` | Yes | R2's plugin mode and R19's arm |
| Estimate before sending | supercov `quality.md:191-196` | Yes | R1 prints its payload class and call count first |
| Content-hash answer cache | supercov `quality.md:198-203` | Yes, never during stability reruns | A cache makes the flip rate zero by construction |
| Shadow before serving | Hermes post `:18` | Yes | R1 is offline and R2 shadows |
| Heuristic first, then a model only where the heuristic is unsure | classifier.dev (vendor claim relayed by the council, not reopened) | Yes, as an offline cascade table in R2 | Costs no extra call once confidence is recorded |
| Record provider and model with each result | `cli-usage/SKILL.md:266-268` | Yes | The transport's completion rule |
| MCP server and slash commands | claude-jev | No | Adds a surface and removes no decision |
| `screen` and `verify` subcommands with `--fail-on` gates | npm `jevctl` `recipes.md:5-11`, `errors.ts:1-9` | No | npm `jevctl` only. The Python `jev-cli` has neither, and its exit 2 means a usage error |
| A missing screen answer becomes 0 | npm `jevctl` `core/screen.ts:56` | No | A silent default score |
| Compaction on unless disabled, key read from settings `env` | npm `jevctl` `fast-jev.ts:75`, `:237-253` | No | Breaks the opt-in rule, and a key in the tracked `.claude/settings.json` is a committed secret |
| Whole-run abort on one failure | jev-review `workflow.ts:48-55` | No | Discards every measured row |
| A smell catalogue | supercov `properties.json:38-42` | No | Near-chance published rate |

---

## 9. RQ7 Cost and Restraint

**Cost.** Only vendor claims exist: $0.042 per million input tokens and answers in roughly 150 ms (claude-jev `README.md:30-31`), and about a cent per megabyte of source in supercov's own table (`quality.md:182-189`). None was reproduced here. At those claimed prices each recommendation costs cents per run (inferred arithmetic on vendor claims), so money is not the limit.

**Latency.** UNKNOWN. The only confirmed numbers are ceilings: the Python client's 60 s timeout (`jev_cli/__init__.py:288`), the advisor child's 2500 ms, PreCompact's 3 s, the sentinel's 1200 ms on OpenCode and the OpenCode verifier's 30 s. A function hook's budget is ten seconds in the vendored test-clock text and UNKNOWN in production (section 6 item 2). The transport docs confirm no latency figure exists (`providers-and-models.md:166`). R1's per-call record, or R21's, is the first measurement.

**Privacy.** This is the real cost, because state goes to the provider verbatim (`cli-usage/SKILL.md:76-77`, `:209`).

| Payload | Sensitivity | Where |
|---|---|---|
| Routing corpus prompts and skill descriptions | Low. Prompt provenance not checked | R1, R3 |
| Gate 3 corpus prompts | Low, the same class as R1 | R21 |
| Committed goal criteria | Low | R20 |
| Fixture material | Low | R5, R7 |
| Reply-harness cases | Low | R6 |
| Transcript counts and timings, no text | Nothing leaves the machine | R19 census |
| Archived findings and evidence | High | R8, R10, R15 |
| Operator session excerpts | High. Scrubbed, with the underscore gap closed first | R2's rows, R4 |
| Live goal evidence on every verification | Highest. Standing conversation egress | R2's plugin mode |
| Whole-session prose, tool inputs and history fragments | Highest. Needs a scrubber with the gap closed, an enablement notice and the operator's acceptance | R19's arm (R11 folded in) |

**D5, the key gate (an operator rule that postdates round 1).**

- **Dormant without a key.** Every feature is opt-in and dormant unless three checks pass in order: `command -v jev`, then `jev --version` printing `jev 0.6.2`, then `jev auth status` exiting 0 (parent `spec.md:90`, `cli-usage/SKILL.md:96-103`). With no key a feature behaves exactly as today. Host-verified: `jev auth status` exits 0 for a stored or exported key, exits 3 with none, never prints the key and spends no quota.
- **Presence is not validity.** `auth status` checks that a key exists. Only `jev auth test` proves it is accepted, at the cost of one billed call (`providers-and-models.md:145-148`). A rejected key passes the gate and fails on the first billed call with exit 3 (`cli-usage/SKILL.md:172`). Each feature prints its own line for that case (proposed wording: `jev arm stopped: key rejected`) and marks the affected rows unmeasured, never scored.
- **One switch per feature.** The key already is the global switch. Each feature keeps its own switch, because each switch consents to a different payload class in the table above. A second global switch adds nothing (What Not To Build row 42).
- **One skip-line form everywhere.** The form is `jev arm skipped: <check>`, naming the failed step (003 `spec.md:121`). 002's `jev arm refused: expected jev 0.6.2` and `jev arm skipped: no credential` (002 `spec.md:112`, `:131`) align to it. When the version check fails, the line also prints the version line it found and the binary's path, so an operator whose npm `jevctl` shadows the Python `jev-cli` on PATH knows what to fix (seat-002, proposed).
- **The gate has a cost.** It is a shell builtin plus two Python spawns, latency UNKNOWN. Offline scripts pay it once per run. A live feature runs it once per session and caches the result (003 REQ-011).
- **Jev gets no secret.** No feature reads, logs or passes a key. `jev` resolves its own from its credential store or an exported `TYPESAFE_API_KEY` (002 REQ-003). The key never goes into the tracked `.claude/settings.json`. Session-derived payloads pass the scrubber, and both redaction unit cases pass first (section 5 item 11).
- **D5 moves no deadline.** No drop that rests on a hook deadline reopens. D5 also does not bind third-party components: the vendored npm `jevctl` hook, jevcache.sh and classifier.dev each read a key or send data outside the gate, so any borrowed component sits behind the gate or stays out.

**Failure modes and no key.** Every recommendation uses the Python `jev-cli` exit contract (`cli-usage/SKILL.md:167-174`):

- Check that `jev --version` prints `jev 0.6.2` before reading any exit code (`cli-reference.md:28`). The npm `jevctl` also installs `jev`, and its exit 2 means a tripped `--fail-on` gate (`errors.ts:1-9`).
- Exit 3 at the gate means skip and say so, never retry. Exit 3 after the gate passed means the key was rejected: stop the arm with its own line.
- Exit 4 means back off once, then mark the row unmeasured.
- Exit 1 and any malformed answer mean unmeasured.
- Errors arrive on stderr with stdout empty (`cli-reference.md:157-159`).
- No path returns a default score.

**Prompt caching.** No kept recommendation edits a provider-cached prompt at a point where the cache survives. R1, R2, R20 and R21 call Jev outside the host conversation. R19's later arm would replace history at a compaction boundary, where the stock summary already breaks the cache (inferred).

**Order, free numbers first.**

1. The R1 and R19 censuses, with zero calls, side by side.
2. The R1 arm: the first billed calls and the first latency record. If the census prints `underpowered`, R21 runs instead.
3. The R20 lexical lint and its labels, with zero calls.
4. The R2 zero-call slice: rows pre-labeled from native records, with the heuristic, tail-window and goal-core arms.
5. The R20 Jev arm, only past its stop rule.
6. The R19 Jev arm, only past its stop boundary, with both redaction unit cases passing.
7. The R2 Jev arm and plugin shadow mode, only with recorded OpenCode or Pi verifier use.

Nothing else gets built until one of these produces a number.

---

## 10. Cross-Lineage Agreement

Totals: 9 agreements independent in wave 1, 7 after cross-reading where the later lineage cited code it opened itself (counted as corroboration) and 9 after cross-reading that cite the sibling only (not counted).

### Independent (wave 1, counted)

| # | Agreement | Lineages |
|---|---|---|
| I1 | No live Jev call in the advisor prompt hook | Grok-02, DeepSeek-02, MiMo-02 |
| I2 | An offline `choice` over the advisor's ambiguity cluster, scored on the routing corpus, is the testable advisor shape | Grok-02, DeepSeek-02, MiMo-02 |
| I3 | No live Jev call in PreCompact | Grok-03, DeepSeek-03, MiMo-03 |
| I4 | The model-benchmark grader factory is the grading seam. Its gold later failed and its rank stayed disputed | Grok-01, DeepSeek-01, MiMo-01 |
| I5 | A missing or failed judgment must never become a score | Grok-01, DeepSeek-01, MiMo-01 |
| I6 | Per-turn reply grading drops | Grok-01, MiMo-01 |
| I7 | Goal authority does not move to Jev | Grok-03, MiMo-03 |
| I8 | A goal verifier needs a labeled set first | Grok-03, DeepSeek-03, MiMo-03 |
| I9 | A Jev arm never enters the advisor ratchet baseline | DeepSeek-02, MiMo-02 |

### After cross-reading, grounded in code the lineage opened (counted)

| # | Agreement | Lineages | Why it counts |
|---|---|---|---|
| C1 | No Jev input to STOP legality | Grok-04, DeepSeek-04 | Each opened the convergence or stopping-clock code itself |
| C2 | Dispatch guards and the linter stay code | Grok-06, DeepSeek-05 | Each opened the guard files |
| C3 | Near-duplicate collapse stays code | Grok-05, DeepSeek-05 | Both opened `fanout-merge.cjs` |
| C4 | No new hub mode, command or skill | Grok-07, DeepSeek-07 | Grok opened `hub-router.json`, DeepSeek the transport contract |
| C5 | Severity only as a non-gating shadow | Grok-05, DeepSeek-05, MiMo-05 | Each opened `completion-criteria.md` or the registries |
| C6 | No live call inside the completion sentinel | DeepSeek-01, MiMo-06 | MiMo reopened the sentinel |
| C7 | Replay before any stop build | DeepSeek-04, MiMo-04 | MiMo counted the lineage corpus itself |

### After cross-reading, citing the sibling only (not counted)

| Agreement | Where | Why it does not count |
|---|---|---|
| The goal mode moves to later | DeepSeek-10 and MiMo-08 after Grok-08 | Both cite Grok's contest |
| The routing arm goes first | Grok-10 after DeepSeek-02, MiMo-10 after both | The order came from the sibling |
| The census goes first | DeepSeek-08 after MiMo-02, then MiMo-10 | Built on MiMo's arithmetic |
| The silent `mock` fallback must be fixed | DeepSeek-06 and DeepSeek-08 after MiMo-01 | DeepSeek credits MiMo-01 |
| STOP authority drops | MiMo-04 after Grok-04 | Cites Grok's one-lens argument |
| No new surface | MiMo-07 after DeepSeek-07 | Cites DeepSeek's wiring finding |
| The D4 grader slice | DeepSeek-06 after MiMo-01 | Cites MiMo's build-now slice |
| Grok's kill criterion | DeepSeek-06 and DeepSeek-10 after Grok-10 | Cites Grok |
| The playbook-verdict drop | MiMo-01, then DeepSeek-06 | DeepSeek rested on digest evidence, not code it opened |

### Found by one lineage, and what verification showed

| Finding | Lineage | Status |
|---|---|---|
| The reviewer fixtures route through the reviewer scorer, not 5dim | MiMo-08 | Confirmed |
| The reviewer gold is 8 cases of one class | MiMo-05 | Confirmed |
| Unknown grader kinds fall through to `mock` | MiMo-01 | Confirmed |
| tau 0.03 slice against the 0.05 live cluster | MiMo-02 | Confirmed. 11 of the 24 frozen margins are negative (counted today) |
| An abstention arm targets 18 rows | MiMo-02 | Refuted. The ceiling is 5 rows |
| Registry transitions give P0-survival gold | MiMo-05 | Refuted. 44 or 45 P0-born findings by counting method, none downgraded |
| 181 replay-eligible lineages | MiMo-04 | Drifted. 178 archived plus this run's 3 |
| The OpenCode mode switch (`heuristic`, `llm`) is the goal seam | DeepSeek-03 | Confirmed |
| Two verdict vocabularies must be mapped | DeepSeek-03 (`iteration-003.md:66`) | Confirmed. The first synthesis contradicted it at section 5 item 1, and this file corrects that |
| Evidence is capped at 1,200 characters before any judge sees it | DeepSeek-03 (`iteration-003.md:70`) | Confirmed. Neither DeepSeek nor the first synthesis saw the `...` interplay that makes it a defect (section 5 item 8) |
| Inert-novelty windows as the cheaper stop target | DeepSeek-04 (`iteration-004.md:82`) | Adopted into R8's slice |
| Fan-out never compares same-point findings with different bodies | DeepSeek-05 (`iteration-005.md:70`) | Adopted into R15 |
| Record the pick probability, the `none` probability and a flip rate per call | DeepSeek-08 (`iteration-008.md:31`, `:33`) | Adopted into R1 |
| On no key, fall back and log once | DeepSeek-09 (`iteration-009.md:39`) | Already adopted by 003 REQ-011 |
| The Harness B run command | DeepSeek-08 | Failed |
| A cache during reruns nullifies the stability measure | DeepSeek-08 | Reasoning, accepted. It now protects the per-row flip rate |
| The wrapper rule for any goal mode | Grok-08 | Confirmed seam, adopted |
| `noop` returns 1.0 and npm `jevctl` `runScreen` coerces to 0 | Grok-01, Grok-06 | Confirmed. `noop` is also the runner's default |
| Measured latency decides whether deadline-dropped shapes revive | MiMo-09 | Reasoning, accepted. R1 or R21 produces the number, and row 1 carries the revival rule |
| A routing loss kills the closed-set `choice` family | Grok-10 | Disputed, below |

### Disagreements

| # | Topic | Positions | Stronger evidence | Resolution |
|---|---|---|---|---|
| 1 | Where a grader belongs, and its rank | MiMo build-now, DeepSeek next, Grok later, all at the 5dim D4 factory | Code: the reviewer profile routes elsewhere (`run-benchmark.cjs:571` and the profile note), and the classifier it does reach runs on 0 of 8 cases | Later for both R5 and R7 |
| 2 | Goal mode rank | DeepSeek-03 next. Grok-08 later, then DeepSeek-10 and MiMo later | Code shows a clean opt-in seam, and all three agree the set comes first | Next for the zero-call slice. The Jev arm and plugin mode are later behind recorded use (council review) |
| 3 | How far a routing loss reaches | Grok: it kills severity `choice`, `next_check` and goal `choice`. DeepSeek: the grader family is not gated. MiMo: it does not kill `score` shapes or measurement | No data either way. Routing a prompt against skill descriptions differs in input and gold from verdicts and goal evidence | Unresolved on data. R1 now prints `kill` only for a loss significant at 0.05, and only `kill` closes R3's served order. `inconclusive` and `underpowered` close nothing, and the report says so. For the other closed-set ideas a `kill` is evidence against, not a verdict |
| 4 | Free-first or billed-first order | MiMo free first. DeepSeek and Grok start with the billed routing arm | They agree the routing arm is the first billed item | Phase 002 opens with its free census and 003 with its free slice. R19's census runs beside 002's |
| 5 | Stop and severity replays as build-now | MiMo build-now, DeepSeek next, Grok later | Counts: no P0 downgrade exists in `transitions`, and the stop replay's local arms are not a Jev integration | Later |
| 6 | Extend the rerank script or add a file | Grok in place at 40 to 80 LOC. DeepSeek and MiMo a new script | The rerank script's read-only header, its flip rule and the fact that it runs on import | A new file, with the climbing sentence in R1 |
| 7 | A defer shadow log and spec-level flags | MiMo and DeepSeek parked them as later | No decision reads a defer log. The level script does read the flags (`recommend-level.sh:36-47`: auth +10, api +8, db +7, architectural +20), so "no decision reads either output" was wrong for the flags | Drop both. The flags drop on low stakes and missing gold for which level a packet should have had, not on a missing reader |

### The council review (2026-09-26), and why it does not count as lineage agreement

- Three seats ran on Claude Opus 5.5 at max effort, the same model family as the first synthesis and as this re-synthesis. Their agreement with each other, or with either synthesis, is one model agreeing with itself. It counts as corroboration only where it rests on code or counts that were reopened, which section 14 rows 144 onward record.
- The seats split on the compaction tier, on R2's tier and on the phase order, so there is no sign of false consensus. They agreed on every drop.
- The five questions the council left open are ruled on in the Changes section above (D1 to D5).

---

## 11. Recommendations

Ranked by value to the operator against cost, latency, privacy and risk, smallest measurable slice first. The Python `jev-cli` 0.6.2 is the package for every item. Every record states its own switch and what happens when the D5 gate (section 9) fails. Switch names, file names and skip-line wordings marked "proposed" do not exist yet.

| Rank | ID | Recommendation | Verdict | Jev type | Phase |
|---|---|---|---|---|---|
| 1 | R1 | Offline advisor tie-break arm, with a keep rule that can fail | build-now | `choice` | 002 |
| 2 | R19 | Compaction recall census, then an offline Jev deletion arm (R11 folded in) | build-now for the census, later for the arm | `noul`, batched with `run` | 005 |
| 3 | R20 | Goal-criteria lint | next | `noul` | 006 |
| 4 | R2 | Goal verifier zero-call slice, then an opt-in shadow mode | next for the zero-call slice, later for the Jev arm and mode | `choice` | 003 |
| 5 | R21 | Gate 3 calibration arm | next, only when R1's census prints `underpowered` | `noul` | 002 |
| 6 | R3 | Advisor suggested order inside the cluster (cached lane dropped) | later | `choice` | not phased |
| 7 | R4 | Completion-claim offline audit | later | `noul` | not phased |
| 8 | R5 | Reviewer verdict classification fallback | later | `choice` | not phased |
| 9 | R6 | Reply-harness blinded judge | later | `score` | not phased |
| 10 | R7 | D4 hallucination grader kind (citation failed) | later | `noul` or `score` | not phased |
| 11 | R8 | Stop second-rater replay, Jev arm | later | `score` | not phased |
| 12 | R9 | Confirm-mode stop suggestion | later | none at use time | not phased |
| 13 | R10 | Severity replay, P0 reread order and a validity funnel log | later | `choice`, `score` or `noul` | not phased |
| 14 | R12 | Compiled-routing clarify suggested default | later | `choice` | not phased |
| 15 | R13 | Alignment below-50 suggestion | later | `choice` | not phased |
| 16 | R15 | Fan-out shadow pair record | later | `noul` | not phased |
| 17 | R16 | Injection screen on fetched text | later | `noul` | not phased |
| 18 | R17 | PR-claims advisory report | later | `noul` | not phased |
| 19 | R18 | Debug `next_check` choice | later | `choice` | not phased |
| none | R11 | Compaction brief selection pass | folded into R19 | `noul` or `run` | 005, as R19's brief column |
| none | R14 | Next-focus shadow comparator | drop (What Not To Build row 41) | `choice` | none |

R11 and R14 keep a record below so their ids stay traceable.

### R1. Offline advisor tie-break arm

| Field | Record |
|---|---|
| **Verdict** | **build-now.** It is the only idea whose harness, corpus and recorded baselines all exist today. It changes no shared contract, its first slice costs zero Jev calls and its keep rule can now fail. |
| **Judgment type and package** | A `choice`, Python `jev-cli` 0.6.2. The keys are the passing top skill, its `ambiguousWith` members and a `none` key. Each description is the skill's projection `description` (`types.ts:43`, `projection.ts:49`), and the state is the prompt text. Each call records the pick, the pick probability and the `none` probability (DeepSeek `iteration-008.md:31`). |
| **Seam** | `ambiguity.ts:22-36` and `:44-58` write `ambiguousWith` on passing recommendations within 0.05 on score or confidence (`:7-8`), with no cluster size cap, after ranking sorts on an adjusted score (`fusion.ts:749-776`) and `applyAmbiguity` runs (`:789`). Eval template: `score-outcome-rerank.mjs:85-93` (metrics, exact match), `:119-123` (split and fold) and `:150` (flip rule). Gold matching follows the capture's alias rule (`capture-scorer-eval-baseline.mjs:70-76`), not the eval's exact match. |
| **Value** | It decides, with a number, which skill goes first when the advisor's own scores call a near-tie. Today the fused order decides. A `keep` is the evidence a served order (R3) needs. A `kill` closes the live form of the operator's second idea with a number. `inconclusive` and `underpowered` close nothing, and the report says so. |
| **Metric, baseline and harness** | **Census, zero calls:** over all 177 skill-firing labeled rows (both halves) and all 64 skill-firing holdout rows, alias-aware: eligible rows (a cluster of 2 or more), movable rows (gold in the cluster but not first), gold-first rows, a top-3 column and tau 0.03 slice membership. <br>**Baselines:** holdout top-1 53/70 = 0.7571, ambiguity slice 18/24 = 0.75 at tau 0.03 and full corpus 152/195 (`scorer-eval-baseline.json:14-35`). The H2 MRR baseline is UNKNOWN because the eval has never been run, and the baseline column produces it. <br>**Zero-call comparators on identical rows:** confidence order inside the cluster, always-second and the outcome-weighted rerank on held-out rows only, since it trains its fold on the train half (`score-outcome-rerank.mjs:123`). <br>**Jev arm:** 3 reruns and one modal pick per eligible row. A row with three different picks is `unstable` and counts as undecided. Each other row scores a win, a loss or a tie on the gold's reciprocal rank against the scorer's order. <br>**Outcome rule, fixed before the build:** <br>- `keep` needs all four: an exact one-sided sign test at 0.05 favoring Jev, a Jev MRR above each comparator on the rows that comparator scores, no fall in right@3 and a per-row flip rate across reruns of at most 0.10. <br>- `kill` when the same test at 0.05 favors the scorer. <br>- `underpowered` when the census finds fewer than 5 movable rows or the arm fewer than 5 decided rows. A keep needs at least 5 wins and no loss (one-sided p = 0.03125). <br>- `inconclusive` otherwise. <br>**Also reported, never vetoing:** the gain inside and outside the frozen tau 0.03 slice, a split by recorded pick probability, the near-tie rate and a live-path line comparing the measured p95, spawn included, with the advisor's remaining budget (What Not To Build row 1). <br>**Gap rows filled:** "Jev latency and cost per call", "Jev judgment accuracy against gold" and "Judgment stability". |
| **Cost, latency and privacy** | One call per eligible row per rerun, plus one `jev auth test`. The ceiling is 723 calls (241 rows times 3 reruns), and the real count follows the census's eligible rows. At the vendor-claimed price and 1 to 2 thousand input tokens a call that is about $0.03 to $0.06 (inferred arithmetic on a vendor claim). R21 adds 585 short calls only when it runs. No deadline applies, because a person runs it. Corpus prompts and cluster skill descriptions leave the machine. Both are authored in this repository, and prompt provenance was not checked. |
| **Key gate and no-key behavior (D5)** | Its switch is an explicit flag (proposed name `--jev`). No existing file changes, so every live path behaves as today by construction. <br>- **Default run:** the census, the baseline column and the comparators, with zero calls. It never spawns `jev`: a stub `jev` placed first on PATH logs nothing. <br>- **With the flag:** the D5 gate runs in order. The first failure prints `jev arm skipped: <check>` (for a missing key, `jev arm skipped: no credential`), and a version mismatch also prints the version line it found and the binary's path (proposed). The rest of the output is byte-identical to the default run. <br>- **A present but rejected key:** the first billed call, `jev auth test`, exits 3. The arm prints `jev arm stopped: key rejected` (proposed) and scores no row. <br>- **Before the first billed call:** the payload class and the planned call count print. <br>- **Failure paths:** exit 4 gets one backoff retry, then the row is `unmeasured`. Exit 1, exit 2 or a key outside the submitted set mark the row `unmeasured`, and exit 2 also stops the arm, because it means the script built a bad command. A `none` answer keeps the scorer's order and counts as an abstention. No path returns a default score. |
| **Smallest slice** | One caller, the script itself, end to end. One new file, `score-jev-tiebreak.mjs` (proposed name), in `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/`. It imports the built `dist` scorer, copies the eval's split and metric functions with alias-aware matching, because the eval exports nothing and runs on import (`score-outcome-rerank.mjs:159`), and sets the capture's pinned env including `VITEST=true` (`capture-scorer-eval-baseline.mjs:35-46`). About 250 to 320 LOC (estimate). Reports and the per-call JSONL go to a directory the operator names. To undo this: delete the script and its reports. |
| **Fitness checklist** | Passes all 15. <br>- Q1: the H2 baseline comes from the same run as the arm. <br>- Q2: the proof plan below can now fail. <br>- Q3: the census and the comparators are the build-nothing tests. Zero movable rows ends the work there. <br>- Q4, climbing sentence: extending `score-outcome-rerank.mjs` in place would put a network arm inside a script whose header promises a read-only eval (`:17-23`) and whose flip rule decides that flag (`:150`), so a separate file keeps that eval's meaning and deletes cleanly. <br>- Q6: one flag, earned by the off-machine call. <br>- Q8: it never writes `scorer-eval-baseline.json` or the corpus, whose hashes H1 pins (`:5-7`). <br>- Q11: a measurement, never served. <br>- Q12: it spawns the installed Python `jev-cli` and adds no package. <br>- Q15: the no-key run is the edge case. |
| **Confidence** | **Confirmed from code:** the cluster rule and its missing cap, the adjusted-score sort, the split, the exact-id metric, the alias capture, `VITEST`, the stability formula, the baselines and the 2500 ms kill. **Derived:** that the old keep rule could not fail. **Inferred:** that movable rows exist, that a `choice` beats the fused order and the comparators, and the per-call latency. The census, the arm and the JSONL confirm or refute each. |
| **Lineage agreement** | All three, independent. Grok-02, DeepSeek-02 and MiMo-02 each proposed an offline cluster `choice` arm before reading a sibling. That it goes first came after cross-reading and is not counted. The keep-rule defect was found independently by council seats 001 and 003, which share one model family with this file. |
| **Citation check** | Resolved (section 14 rows 1 to 29 and 144 to 153). One drift: Grok-02 calls the rerank eval H5, and it is H2. |

**Proof plan, written before the build.**

1. With no key and no flag, the script prints eligible, movable and gold-first counts per file and per split, with cluster and top-3 columns, plus the comparators' MRR, right@1 and right@3. A stub `jev` logs no call. Boundary: zero movable rows prints `no headroom`, and fewer than 5 prints `underpowered`. In both cases R1's arm does not run.
2. The baseline column reproduces 53/70 under the pinned env, `VITEST=true` included. Boundary: any other number prints `baseline mismatch: comparison void` and the arm does not run.
3. With a key and the flag, `calls.jsonl` records for every call: wall time, exit code, `jev` version, provider, model, pick, pick probability and `none` probability. Boundary: an exit 4 row is `unmeasured`, never a pick.
4. The report prints wins, losses and ties, the exact sign-test p, the per-row flip rate and exactly one verdict line, plus R21's accuracy, F1 and Brier score when R21 ran. Boundary: `keep` also needs a flip rate at or below 0.10 and a win over each comparator.
5. `git status` shows no change outside the new script and its report directory. Boundary: any write to the corpus, `scorer-eval-baseline.json` or the ratchet fails the arm.

**Kill criterion.** Only a `kill` closes R3's served order and the live form. `inconclusive` and `underpowered` close nothing. For the other closed-set `choice` ideas a `kill` is evidence, not a verdict (section 10, disagreement 3).

### R2. Goal verifier zero-call slice, then an opt-in shadow `jev` mode

| Field | Record |
|---|---|
| **Verdict** | **next for the zero-call slice. The Jev arm and the plugin shadow mode are later.** The clamp defect (section 5 item 8) gives the zero-call slice a real target: a free fix may remove most false `not_met` before any Jev call. The Jev parts wait on recorded OpenCode or Pi verifier use, because the verdicts on record come from Claude Code's native judge (section 5 item 9). |
| **Judgment type and package** | The zero-call slice judges nothing with Jev. The later arm: a `choice`, Python `jev-cli` 0.6.2, over `met`, `not_met` and `blocked` (`opencode-goal.js:179`), with descriptions from the `llm` prompt's rules (`:2234-2237`). The state is the goal objective and the evidence, scrubbed. |
| **Seam** | `opencode-goal.js:134` (`VALID_VERIFIER_MODES`), `:226-234` (mode normalization and dispatch), `:2197-2230` (the heuristic, which stays authoritative), `:49` (30 s verifier budget) and `:135` plus `goal-core.cjs:603-604` (the wrapper rule). The clamp path: `opencode-goal.js:42`, `:382-389`, `:414-420`, `:463-475`, `:1107`, `:2199`, `:2209-2211`, `:2308-2317`. goal-core parity: `goal-core.cjs:290-297` and `:596-620`, with Pi's consumer at `goal-context.ts:229-238`. |
| **Value** | The decision "is this goal done" in OpenCode autonomous mode, and the hidden nudge Pi sends on every turn that is not `met`. A false `not_met` costs a continuation turn and a nudge, and a false `met` stops a goal early. The first slice shows whether the clamp, rather than the heuristic's logic, drives the false `not_met`, and whether judging the tail fixes them. As a proxy, 55.0% of the operator's own pre-verdict texts exceed 1,200 characters (counted today, transfer inferred). |
| **Metric, baseline and harness** | H12 plus the gap row "Goal verifier accuracy". Today UNKNOWN: H12 has three unit tests and no labeled set (`goal-core.test.cjs:631-651`). <br>**Rows:** 30 to 50, each with the objective, the raw last assistant text (scrubbed), its as-ingested form (clamped as `:1107` does), the raw length and one label. <br>**Labels:** pre-filled from native `goal_status` records. A record carries `met` and usually a `reason` but no evidence, so each row's evidence is the last assistant text before the record in the same transcript (paired for 753 of 755 today, inferred to be what the judge saw). The operator adjudicates rows where the pre-label and the heuristic disagree and spot-checks about 10 agreements (proposed), because shared errors hide there. <br>**Zero-call arms on identical rows:** the plugin heuristic as shipped, on the as-ingested form. A tail-window arm: the same checks on the last 1,200 characters of the raw text, with no appended marker. goal-core parity: `verifyGoalHeuristic` on the raw text, with `not-met` and `unclear` mapped as 003 REQ-005 does. <br>**Columns:** per-check error attribution, the clamp-error count and an optional claims column for R4. <br>**Stop rule:** 003's own (no false `met` and a false `not_met` rate at or below 0.10, or no reachable row), applied to the better of the heuristic and the tail-window arm. <br>**Later Jev arm:** 003's keep threshold (a false `not_met` count at most 0.70 times, no added false `met`, every asked `blocked` row answered `blocked`) read against the best zero-call arm, with a per-row flip rate of at most 0.10 replacing the coefficient, confidence recorded per call and an offline cascade table: heuristic first, then Jev only on rows the heuristic calls `not_met` without blocking language. |
| **Cost, latency and privacy** | The zero-call slice sends nothing. The later offline arm: at most 50 rows times 3 reruns, 150 calls. The later live shadow: one call per verification inside the 30 s budget, latency UNKNOWN until R1 or R21 measures it. What leaves the machine is the operator's own conversation, the most sensitive payload after R19's arm. |
| **Key gate and no-key behavior (D5)** | The zero-call slice needs no key and never spawns `jev`. <br>- **Later offline arm:** an explicit flag (proposed `--jev`) and the D5 gate. With the gate failing it prints `jev arm skipped: <check>` and the zero-call tables print unchanged. <br>- **Later plugin mode:** a new value of the existing switch, `OPENCODE_GOAL_VERIFIER=jev` (proposed name). Today an unknown value silently falls back to `heuristic` (`:226-229`). The gate runs once per session. With it failing, one enablement line names the failed check and the session behaves exactly as `heuristic`. With it passing, the heuristic acts as today and the Jev call runs beside it as an async shadow bounded by the verifier timeout, since a spawn from OpenCode blocks the plugin host (`completion-evidence-sentinel.cjs:90-94`). A rejected key disables the shadow for the session with one line. Exit 4, a timeout or a malformed answer skip that one shadow record. No Jev failure reaches the catch that turns an error into `blocked` (`:2378-2380`). <br>- **Visibility:** `show` gains a `verifier_shadow=` field (proposed) beside `verifier_source=` (`:2988-2989`), because the plugin's only stderr writer is gated on a debug variable (`:835-839`). <br>- **Before any egress:** a unit case for the plugin's keyword regex (`:474`) and one for the scrubber's assignment regex (`secret-scrubber.ts:128`) must pass, since both let underscore-prefixed names through today (section 5 item 11). |
| **Smallest slice** | One caller, the offline scorer, end to end: the labeled rows as a JSONL fixture (proposed path beside `.skilled/hooks/goal/lib/`) and one script that runs the three zero-call arms. The plugin exposes `maybeVerifyGoal`, `setGoal` and `readGoal` through `MkGoalPlugin.__test` but not the heuristic itself (`opencode-goal.js:3359-3385`), so the script drives `maybeVerifyGoal` against a temporary state directory or the build adds one `__test` entry. The tail-window arm is about 10 lines. About 120 to 170 LOC plus 30 to 50 rows (estimate). The plugin mode, only past the threshold, is about 60 to 100 LOC (DeepSeek-10's estimate). To undo this: delete the fixture and the script, and later remove the mode value and its branch. |
| **Fitness checklist** | - Q1 fails until the rows exist, which is acceptable because the rows are the first slice. <br>- Q3: the tail-window arm is the build-nothing competitor, and the `llm` mode already ships as a model-backed one. <br>- Q8: a clamp fix belongs to the plugin and goal-core owners and is reported, not made, here. The goal plugin's documented contract (`goal-plugin.md:52-53`) and the mode set are frozen surfaces, so a later build names every caller of `VALID_VERIFIER_MODES` by search first. <br>- Q9: the later slices send conversation text, acceptable only with both unit cases passing, the scrubber and an announcement. <br>- Q11: the heuristic keeps authority, and the wrapper rule keeps blocking language out of Jev's reach. <br>- Q14: 003 is a Planned phase under an approved plan, amended rather than replaced. <br>- Q15: the no-key run and one malformed answer are the edge cases. |
| **Confidence** | **Confirmed:** the clamp path in both runtimes, Pi's nudge on `unclear`, the vocabularies, the mode switch, the fallback paths, the native record fields, the regex gaps and the 55.0% proxy count. **Inferred:** that the proxy transfers to OpenCode or Pi evidence, that the text before a native record is what the judge saw, and OpenCode non-use, since only the default directory was checked. |
| **Lineage agreement** | All three agree, independently in wave 1, that a verifier needs a labeled set first (Grok-03, DeepSeek-03, MiMo-03). The rank was disputed in round 1. The wrapper rule is Grok-08's, adopted by MiMo-08 after cross-reading. In the council, seats 001 and 003 kept next and seat-002 would park 003. The clamp defect is seat-001's finding, confirmed here. |
| **Citation check** | Resolved, including DeepSeek's `opencode-goal.js:72` and Grok's `goal-core.cjs:603`. The council's `:388` and `:475` sit inside the ranges above, and its `goal-core.cjs:607` is the return after the check at `:606`. |

**Proof plan, written before the build.**

1. The fixture holds at least 30 rows, each with an objective, the raw text, its as-ingested form, the raw length and one label. Boundary: under 30 rows proves nothing, and the phase stops there.
2. The heuristic, tail-window and goal-core arms print confusion tables on identical rows, with per-check attribution and the clamp-error count. A stub `jev` placed first on PATH logs no call. Boundary: the stop rule, applied to the better of the heuristic and the tail-window arm.
3. If the tail-window arm meets the stop rule, the report names the clamp fix for the plugin and goal-core owners, and no Jev arm is built.
4. Only with recorded OpenCode or Pi verifier use and both redaction unit cases passing: the Jev arm under the wrapper rule, with 3 reruns, the flip rate and the cascade table. Boundary: it never asks Jev about a row where the blocking pattern matched, and the script asserts this. Any added false `met` fails the keep.
5. Only past the threshold, and only with a per-call p95 under the 30 s budget: the plugin shadow mode. Boundary: with no key, a session in `jev` mode reaches the same verdicts as `heuristic` mode, with one enablement line and none per verification.

### R3. Advisor suggested order inside the cluster (cached lane dropped)

| Field | Record |
|---|---|
| **Verdict** | **later, for the suggested order only.** It serves a Jev pick, which needs R1's `keep` and a measured latency that fits the live deadline. The cached lane drops (What Not To Build row 40). |
| **Judgment type and package** | The same `choice` as R1, Python `jev-cli` 0.6.2, asked live and only when a near-tie cluster exists. |
| **Seam** | Cluster `ambiguity.ts:44-58`. Deadline `user-prompt-submit.ts:22-24`, `:105-125`. Shadow-first patterns `lane-registry.ts:21-29`, `:33-38` and `shadow-sink.ts:86-100`, `:144-155`. |
| **Value** | A better first skill, or the cluster in a better order, on near-tie prompts. |
| **Metric, baseline and harness** | H1 and H2 offline through R1, then H5 shadow deltas scored offline. Baseline: R1's result. |
| **Cost, latency and privacy** | One call per near-tie prompt, which must fit inside the 2500 ms child with the scorer's own time. Prompt text leaves the machine live. A cache would hit only exact repeats, 16 of 439 typed prompts over 100 characters (3.6%, seat-reported). |
| **Key gate and no-key behavior (D5)** | A default-off flag in the advisor's convention (`fusion.ts:69`, `:111-114`), name UNKNOWN until built, after the D5 gate run once per session. With the gate failing, or on any Jev failure or timeout, the advisor returns today's order. |
| **Smallest slice** | UNKNOWN until R1 prints `keep`. Then a shadow-only record of the live pick beside the fused order. |
| **Fitness checklist** | Fails Q1 until R1 keeps. Q7 until a measured p95 fits. Q8: advisor scoring and its lane registry are shared contracts. |
| **Confidence** | Deadline confirmed. Fit inferred until R1's latency exists. |
| **Lineage agreement** | Two, independent in wave 1: DeepSeek-02 (cached lane) and MiMo-02 (suggested order). Grok-02 keeps the cluster `choice` offline only. All three council seats drop the cached lane in substance. |
| **Citation check** | Resolved. The 3.6% figure is seat-reported and was not reopened. |

**Promote when.** R1 prints `keep`, and its measured p95, spawn included, fits the advisor's remaining budget.

### R4. Completion-claim offline audit

| Field | Record |
|---|---|
| **Verdict** | **later.** The live path cannot host a call, a narrower regex may fix false fires with no Jev code, and on Claude the advisory reaches only a log. |
| **Judgment type and package** | A `noul`, Python `jev-cli` 0.6.2, "does this turn end by claiming the work is complete", offline only. |
| **Seam** | `completion-evidence-sentinel.cjs:64` (the pattern, kept byte-identical to a runtime hook's copy per `:60-63`), `:70` (400-character tail), `:113-119`. The Claude adapter logs the advisory and approves (`completion-evidence-stop.cjs:132-139`) inside an async 10 s Stop hook (`.claude/settings.json:172-177`). |
| **Value** | Fewer advisories on turns that never claimed completion. On Claude that changes a log nobody reads live, so the value to the operator's day is small (seat-002). |
| **Metric, baseline and harness** | False-fire and missed-claim rates on R2's rows through an optional claims column, with zero calls. Baseline: the regex's rate, UNKNOWN. seat-002 reports 238 advisory lines in the last 30 days, 512 of 567 about a missing `implementation-summary.md` (seat-reported). |
| **Cost, latency and privacy** | Under 100 offline calls for a later arm. Session excerpts leave the machine (high), scrubbed with the underscore gap closed. |
| **Key gate and no-key behavior (D5)** | Offline only, behind its own flag (proposed) and the D5 gate. The sentinel's kill switch already exists (`:84`). With the gate failing, the regex measurement prints alone. |
| **Smallest slice** | Label claims on R2's rows and score the regex with zero calls. Reach for Jev only if the regex cannot be narrowed without new misses. |
| **Fitness checklist** | Q3 may end it with a regex change and no Jev code, which is a passing outcome. Q6 needs a named reader before any build. |
| **Confidence** | Pattern words, tail, timeout and adapter confirmed. False-fire rate UNKNOWN. |
| **Lineage agreement** | Two: DeepSeek-01 in wave 1, and MiMo-06 after cross-reading, grounded in code it opened. Council: seat-002 would drop it, seats 001 and 003 keep it later. |
| **Citation check** | Resolved. |

**Promote when.** R2's rows exist with the claims column, the regex cannot cut false fires without new misses, and a reader of the advisory is named.

### R5. Reviewer verdict classification fallback

| Field | Record |
|---|---|
| **Verdict** | **later.** The seam fits a three-key `choice` exactly, but no current case reaches it. |
| **Judgment type and package** | A `choice`, Python `jev-cli` 0.6.2, over `pass`, `fail` and `block`, with the reviewer's output as state. |
| **Seam** | `reviewer-scorer.cjs:155-167` (`classifyWithGrader`), reached only from `:171` when `extractVerdict` (`:117-123`) finds no line. Documented at `reviewer-schema.md:82-90`. Callers: `deep-model-benchmark-auto.yaml:206` and `deep-model-benchmark-confirm.yaml:228`. |
| **Value** | On a live reviewer run, output with no verdict line would get a verdict instead of `unknown`, through a typed call rather than a free-form `llm` classification. |
| **Metric, baseline and harness** | H9, gap row "Grader agreement with oracle", on regex-miss outputs against `expectedVerdict`, beside the `llm` classifier. Today the fallback runs on 0 of 8 cases (confirmed by count), and classifier accuracy is UNKNOWN. Smallest harness: at least 12 recorded outputs with no clean verdict line, covering `pass`, `fail` and `block`. |
| **Cost, latency and privacy** | One call per regex miss, offline. Fixture material leaves the machine (low). |
| **Key gate and no-key behavior (D5)** | A `--grader jev` value (proposed), validated at startup, after the D5 gate. With the gate failing, the run behaves as `noop` does and prints `jev arm skipped: <check>`. Exit 4 or a malformed answer leaves that case's verdict `unknown`, never a guessed one. |
| **Smallest slice** | The regex-miss cases first (fixtures only), then one run with `--grader llm` for the first classifier number, then a `jev` branch of about 30 to 50 LOC. |
| **Fitness checklist** | Fails Q1. Fails Q6 today, because no caller reaches the branch. |
| **Confidence** | Confirmed by code and by replaying the regex. Inferred: that live reviewer outputs miss the verdict line often enough to matter. |
| **Lineage agreement** | One, MiMo-08, which found the runner path after reading DeepSeek-08 and corrected it from files it opened. The 0-of-8 reach is the first synthesis's finding, repeated by council seat-001. |
| **Citation check** | Resolved. |

**Promote when.** A reviewer run on cases without recorded output shows verdict-line misses.

### R6. Reply-harness blinded judge

| Field | Record |
|---|---|
| **Verdict** | **later.** It is the most direct test of the operator's grading idea, but no judge can be trusted before a human-scored subset exists. |
| **Judgment type and package** | A `score` per rubric dimension, Python `jev-cli` 0.6.2, over masked replies. |
| **Seam** | `reply-harness/README.md:11-12` (`blind.mjs` and `compare.mjs`) and `:20` (the judge scores outside the scripts). |
| **Value** | A reply-rule change can be compared without the operator scoring every masked pair: about 98 scores per run at 7 cases, 2 conditions and 7 dimensions (seat-002 arithmetic). |
| **Metric, baseline and harness** | H13, agreement with a human pass per dimension. Baseline: none, and no recorded harness run exists (seat-reported). |
| **Cost, latency and privacy** | Cases times seven dimensions per condition, offline. Authored cases leave the machine (low). |
| **Key gate and no-key behavior (D5)** | A judge step run by hand, behind its own flag (proposed) and the D5 gate. With the gate failing, the manual judge runs as today. |
| **Smallest slice** | The operator scores about 20 masked replies and Jev scores the same. The report gives agreement per dimension. |
| **Fitness checklist** | Fails Q1 until the human subset exists. Fails Q6 as gold in its own right (seat-003's revival attempt). |
| **Confidence** | The empty slot is confirmed. Agreement UNKNOWN. |
| **Lineage agreement** | Two, independent in wave 1: DeepSeek-01 (later) and MiMo-01 (kept, gated on the human subset). |
| **Citation check** | Resolved. |

**Promote when.** A human-scored subset of about 20 masked replies exists.

### R7. D4 hallucination grader kind

| Field | Record |
|---|---|
| **Verdict** | **later, citation failed.** The lineages' gold for it, the reviewer fixtures, never reaches D4, and D4 has no oracle of its own. |
| **Judgment type and package** | A `noul` or `score` of hallucination against the fixture allowlist, Python `jev-cli` 0.6.2. |
| **Seam** | `score-model-variant.cjs:207-226` (`buildGraderFn`), D4 at `:300`, weight at `:58`. Runner flag `run-benchmark.cjs:577`, usage at `:582`. |
| **Value** | Through the runner the default grader is `noop`, a fixed D4 of 1.0 (`run-benchmark.cjs:577`, `score-model-variant.cjs:208-209`). `mock` is the default only for a direct call of the scorer (`:21`) or for an unrecognized kind (`:211`). Either way D4 carries no signal today. A cheap real D4 would make its 0.15 weight mean something. |
| **Metric, baseline and harness** | Gap row "Grader agreement with oracle", with no gold. Smallest harness: model outputs labeled for hallucination against the fixture allowlist, then agreement of `llm`, Jev and the `hallucination-flag` check (`:284`). |
| **Cost, latency and privacy** | One call per graded output, offline. Fixture material (low). |
| **Key gate and no-key behavior (D5)** | `--grader jev` (proposed), after the D5 gate. The silent fallback to `mock` (`:211`) must become a startup error first. With the gate failing, the run refuses at startup like the family-collision refusal (`run-benchmark.cjs:614-621`). A failed grade carries `parse_status: 'failed'` and no score, never 0.0 (`:222-224`). |
| **Smallest slice** | The labeled D4 set, then about 60 to 100 LOC (DeepSeek-10). |
| **Fitness checklist** | Fails Q1 and Q6. Fails Q7 until the silent `mock` fallback is fixed. |
| **Confidence** | Seam, default and defect confirmed. Value inferred. |
| **Lineage agreement** | All three found the seam independently in wave 1. Verdicts disputed (MiMo build-now, DeepSeek next, Grok later), and the code settles it (section 10, disagreement 1). |
| **Citation check** | Failed for the gold, since `reviewer-schema.md:59` does not feed D4, and for DeepSeek-08's Harness B command. The seam lines resolve. The first synthesis's "mock D4" was corrected (row 154). |

**Promote when.** A labeled D4 set exists and the silent `mock` fallback is fixed.

### R8. Stop second-rater replay, Jev arm

| Field | Record |
|---|---|
| **Verdict** | **later.** Local replay arms that measure today's stop model are non-Jev work and come first. The Jev arm is worth buying only if they show the heuristic leaves iterations on the table. |
| **Judgment type and package** | A `score` over the five newInfoRatio rubric levels (`convergence-signals.md:55-73`), or a `noul`, "did this iteration add a new cited finding", Python `jev-cli` 0.6.2. |
| **Seam** | `convergence.cjs:506-549` (`buildNoveltyCorroboration`), `:618-631` and `:805-808`, with the shadow pair `stopping-clock-shadow.ts:10-19`. The reducer rejects unknown record fields, so a second-rater field needs a schema change (DeepSeek `iteration-004.md:62`). |
| **Value** | A second rater beside self-reported novelty. It changes a stop only where a stop can change: about half of lineage configs force max iterations (109 of 225, seat-reported), and there an earlier signal changes nothing. |
| **Metric, baseline and harness** | H11 replay, gap row "Correct stop point". Gold: the last iteration that adds a first-appearance cited source in `deltas/`. Baseline: none. Corpus: 178 archived research lineages with deltas (confirmed by count). |
| **Cost, latency and privacy** | 125 to 250 calls on a 25-lineage sample (MiMo-09). Archived findings leave the machine (high), so the state is stripped and the payload announced. |
| **Key gate and no-key behavior (D5)** | A replay script flag (proposed) after the D5 gate. With the gate failing, the local arms run and the report says the Jev column was skipped. It never enters `shouldBlock`. |
| **Smallest slice** | The local replay with zero calls, aimed first at the windows where `novelty_signal_inert` fires (DeepSeek `iteration-004.md:82`), then a five-lineage manual check of the derived gold. |
| **Fitness checklist** | Fails Q1 until the replay exists. Q9 needs stripping and an announcement. |
| **Confidence** | Mechanics and corpus confirmed. Gold fidelity inferred. |
| **Lineage agreement** | All three touched it. Replay before any stop build is corroborated (DeepSeek-04, MiMo-04). Verdicts: MiMo build-now, DeepSeek next, Grok later. |
| **Citation check** | Resolved. MiMo's 181 lineages drifted to 178 archived plus this run's 3. |

**Promote when.** The local replay shows the heuristic stops later than the derived gold on lineages whose config lets a stop move, and a five-lineage read confirms the gold.

### R9. Confirm-mode stop suggestion

| Field | Record |
|---|---|
| **Verdict** | **later.** It shows a calibrated signal from R8, which does not exist yet. |
| **Judgment type and package** | Nothing at use time. If R8 shows a local signal is enough, it ships with no Jev code. |
| **Seam** | `deep-research-confirm.yaml:1316-1345` (`gate_post_iteration`, its `present` block and options A to D). |
| **Value** | The per-iteration continue-or-stop question arrives with one evidence line on exhausted loops. |
| **Metric, baseline and harness** | Suggestion precision of at least 0.9 and one iteration saved on at least 20% of lineages (MiMo-08), on R8's replay. |
| **Cost, latency and privacy** | Zero calls at use time. |
| **Key gate and no-key behavior (D5)** | No call at use time, so the gate never runs there. The line appears only when a calibrated signal exists. Otherwise the prompt stays as today. |
| **Smallest slice** | One line in the `present` block, after the workflow owner approves the edit. |
| **Fitness checklist** | Fails Q1. Q14: it edits a workflow contract. |
| **Confidence** | Seam confirmed by the first synthesis. MiMo named the step without opening it. |
| **Lineage agreement** | One, MiMo-07. |
| **Citation check** | Resolved. |

**Promote when.** R8 yields a signal with precision of at least 0.9.

### R10. Severity replay, P0 reread order and a validity funnel log

| Field | Record |
|---|---|
| **Verdict** | **later.** The planned gold has no negative class: across 409 registries, 44 or 45 findings entered as P0 depending on deduplication, and none was downgraded. |
| **Judgment type and package** | A `choice` over `P0`, `P1`, `P2` and `not_a_finding`, or a `score` over ordered levels, plus `noul` validity questions for a capped follow-up log with a `noMatch` escape (Grok-05, MiMo-05), Python `jev-cli` 0.6.2. |
| **Seam** | `completion-criteria.md:61-63` and `:75`, plus the reviewer-blind adapter `mode-adapters.ts:59` and `:63-72`. |
| **Value** | Fewer P0 rereads, with likely-real P0s first. |
| **Metric, baseline and harness** | H14, gap row "Finding triage agreement". The transitions gold failed: the whole corpus holds 0 P0 downgrades, 5 P1 to P2, 2 P1 to P0 and 2 P2 to P1. Rejected P0s are downgraded with rationale in the iteration narrative (`completion-criteria.md:63`), so a narrative-mined gold may exist. seat-002 found 3 transition reasons and 41 of 4,236 iteration files with downgrade wording, with false positives in a sample (seat-reported). UNKNOWN. |
| **Cost, latency and privacy** | Tens to hundreds of calls. Finding evidence leaves the machine (high). |
| **Key gate and no-key behavior (D5)** | A replay flag (proposed) after the D5 gate. Registry order and recorded severities never change. With the gate failing, the replay prints the recorded severities only. |
| **Smallest slice** | Mine archived iteration narratives for rejected P0s with zero calls. Promote at 20 or more labeled negatives. |
| **Fitness checklist** | Fails Q1. Q11 holds only as a non-gating shadow. |
| **Confidence** | Confirmed by count. Narrative gold UNKNOWN. |
| **Lineage agreement** | Three, with the non-gating shadow shape corroborated (C5). Verdicts: MiMo build-now, DeepSeek next, Grok later. |
| **Citation check** | The seam resolves. The transitions gold failed on count. seat-001's recount of 44 is seat-reported. |

**Promote when.** A narrative-mined gold holds at least 20 labeled P0 negatives.

### R11. Compaction brief selection pass (folded into R19)

| Field | Record |
|---|---|
| **Verdict** | **Folded into R19.** Its brief-selection question becomes R19's brief column, and its Jev pass becomes R19's later arm. |
| **Judgment type and package** | A `noul` keep-or-drop per brief section, or a `run` batch, Python `jev-cli` 0.6.2, only inside R19's later arm. |
| **Seam** | `compact-inject.ts:284` (`buildMergedCompactResult`), `:404-405` (`pendingCompactPrime`), `:446-448` (optional work skipped when the budget runs out) and `shared.ts:14` (4000-token budget). |
| **Value** | A post-compaction brief that keeps more of what matters. The 3 s limit binds only the PreCompact command hook, so the pass itself can only run offline or through R19. |
| **Metric, baseline and harness** | R19's brief recall and noise-share columns. |
| **Cost, latency and privacy** | As R19. |
| **Key gate and no-key behavior (D5)** | As R19. |
| **Smallest slice** | R19's census. |
| **Fitness checklist** | As R19. |
| **Confidence** | Deadlines confirmed. |
| **Lineage agreement** | All three dropped the live form independently in wave 1. The offline pass is DeepSeek-03 and MiMo-03. All three council seats moved it off its PreCompact framing. |
| **Citation check** | Resolved. |

### R12. Compiled-routing clarify suggested default

| Field | Record |
|---|---|
| **Verdict** | **later.** Three clarify rows exist across all hubs. |
| **Judgment type and package** | A `choice` over the clarify candidates, to suggest a default, offline, Python `jev-cli` 0.6.2. |
| **Seam** | `router.cjs:199-218`. The seam map's `:198-216` drifted. |
| **Value** | A preselected default on a clarify prompt. |
| **Metric, baseline and harness** | H7 admission on clarify gold. Today 3 clarify rows (confirmed by count) and no record of how often clarify happens. |
| **Cost, latency and privacy** | Offline. Prompt text (low). |
| **Key gate and no-key behavior (D5)** | Offline only, behind its own flag (proposed) and the D5 gate. With the gate failing, nothing runs. The live front door is dropped. |
| **Smallest slice** | A clarify gold of 30 or more rows and a count of real clarify frequency. |
| **Fitness checklist** | Fails Q1. |
| **Confidence** | Row counts confirmed. |
| **Lineage agreement** | Two after cross-reading, DeepSeek-06 and MiMo-06, with MiMo on digest evidence. |
| **Citation check** | Drifted: `:198-216` is `:199-218`. |

**Promote when.** A clarify gold of 30 or more rows exists.

### R13. Alignment below-50 suggestion

| Field | Record |
|---|---|
| **Verdict** | **later.** No archived gold says which folder a low-alignment save should have used. |
| **Judgment type and package** | A `choice` over the alternatives the save already lists below 50, Python `jev-cli` 0.6.2. |
| **Seam** | `alignment-validator.ts:73-75` (70 and 50) and `:503-520`. |
| **Value** | A suggested folder when the save is unsure. |
| **Metric, baseline and harness** | No harness. Gap: archived low-alignment saves with their final folder. |
| **Cost, latency and privacy** | One call per low-alignment save. Save content leaves the machine (high). |
| **Key gate and no-key behavior (D5)** | A console suggestion only, behind its own switch (proposed) and the D5 gate. With the gate failing, the save lists its alternatives as today. |
| **Smallest slice** | Count archived below-50 saves first. |
| **Fitness checklist** | Fails Q1. |
| **Confidence** | Seam confirmed. |
| **Lineage agreement** | Two after cross-reading: DeepSeek-06 and MiMo-06. |
| **Citation check** | Resolved, including DeepSeek's `:503-521`. |

**Promote when.** Enough archived below-50 saves with their final folder exist.

### R14. Next-focus shadow comparator (dropped)

| Field | Record |
|---|---|
| **Verdict** | **drop (What Not To Build row 41).** `compareNextFocusShadow` has no runtime caller, so a Jev `choice` there would feed nothing. |
| **Judgment type and package** | Would have been a `choice` over the top next-focus candidates, Python `jev-cli` 0.6.2. |
| **Seam** | `next-focus-selection.ts:351-365`. rg finds only its definition (`:352`), a re-export (`next-focus/index.ts:13`) and one test (`next-focus.vitest.ts:25`, `:474`). |
| **Value** | None while nothing calls the comparator. |
| **Metric, baseline and harness** | None, and no focus gold. |
| **Cost, latency and privacy** | Not applicable. |
| **Key gate and no-key behavior (D5)** | Not applicable. |
| **Smallest slice** | None. |
| **Fitness checklist** | Fails Q1 and Q6, and matches the red flag "a report nobody reads". |
| **Confidence** | Missing caller confirmed by search. |
| **Lineage agreement** | One, DeepSeek-04. Council: seat-002 dropped it after checking callers. Seats 001 and 003 kept it later without checking. |
| **Citation check** | Resolved. |

**Revive when.** A runtime caller of `compareNextFocusShadow` exists and a focus gold is named.

### R15. Fan-out shadow pair record

| Field | Record |
|---|---|
| **Verdict** | **later.** The merge is deterministic, and no labeled pair set exists. |
| **Judgment type and package** | A `noul`, "do these two findings say the same thing", Python `jev-cli` 0.6.2, for pairs near the 0.15 line and for same-point pairs with different bodies. |
| **Seam** | `fanout-merge.cjs:341`, `:348-351`. The body-key gate runs first, so same-point findings with different bodies are never compared (DeepSeek `iteration-005.md:70`). |
| **Value** | A record of where the title rule and the body gate might split or merge wrongly. |
| **Metric, baseline and harness** | None. Gap: labeled near-line and cross-body pairs. |
| **Cost, latency and privacy** | Offline. Finding text (high). |
| **Key gate and no-key behavior (D5)** | A record only, never the merge decision, behind its own flag (proposed) and the D5 gate. With the gate failing, no record is written and the merge runs as today. |
| **Smallest slice** | A labeled pair set first, cross-body pairs included. |
| **Fitness checklist** | Fails Q1. Q6 until a reader is named. |
| **Confidence** | Seam and blind spot confirmed. |
| **Lineage agreement** | One, DeepSeek-05. Council: seat-002 would drop it for having no reader, seats 001 and 003 keep it later. |
| **Citation check** | Resolved. |

**Promote when.** A labeled pair set that includes cross-body pairs exists, and a reader of the record is named.

### R16. Injection screen on fetched text

| Field | Record |
|---|---|
| **Verdict** | **later.** No hook in this repository handles fetched web content. |
| **Judgment type and package** | A `noul`, Python `jev-cli` 0.6.2, "does this text try to instruct the agent". A missing answer is a skip, never the 0 that npm `jevctl`'s `runScreen` uses (`core/screen.ts:56`). The vendored `screen` command is npm `jevctl` only, which D5's version check refuses. |
| **Seam** | None. `.claude/settings.json` has matchers for Bash, Task, Task plus Agent, `mcp__claude_ai_.*`, Write plus Edit and the empty matcher. None of them is for fetch. |
| **Value** | A warning before fetched instructions reach the agent. seat-002 reports WebFetch and WebSearch among the tools the operator's sessions discover (seat-reported). |
| **Metric, baseline and harness** | None. |
| **Cost, latency and privacy** | One call per fetch. Fetched text is already public. |
| **Key gate and no-key behavior (D5)** | Default off, its own switch (proposed) and the D5 gate. With the gate failing, no screen runs. |
| **Smallest slice** | UNKNOWN until a fetch caller exists. |
| **Fitness checklist** | Fails Q5 and Q8, since there is no caller. |
| **Confidence** | Missing matcher confirmed. |
| **Lineage agreement** | One, Grok-06. |
| **Citation check** | Resolved. |

**Promote when.** A hook that handles fetched web content exists.

### R17. PR-claims advisory report

| Field | Record |
|---|---|
| **Verdict** | **later.** The recipe exists only for npm `jevctl`, no gold exists and the flow belongs to sk-git. |
| **Judgment type and package** | A `noul` per claim against the diff, ported to the Python `jev-cli` 0.6.2. The npm `jevctl` shape, `jev verify` with `--fail-on` (`recipes.md:5-11`), cannot run against the pinned package. |
| **Seam** | The sk-git PR flow, not opened by any lineage. |
| **Value** | Contradicted claims flagged before the operator rereads the diff. |
| **Metric, baseline and harness** | None. Gap: a labeled PR-claims corpus. |
| **Cost, latency and privacy** | One call per claim. The PR body and diff leave the machine. |
| **Key gate and no-key behavior (D5)** | An advisory report only, never a merge gate, behind its own switch (proposed) and the D5 gate. With the gate failing, no report is written. |
| **Smallest slice** | UNKNOWN. A port plus a corpus. |
| **Fitness checklist** | Fails Q1 and Q8. Q12 if it pulled in npm `jevctl`. |
| **Confidence** | The package clash is confirmed from the vendored files. |
| **Lineage agreement** | One, MiMo-07. |
| **Citation check** | Resolved. |

**Promote when.** A Python `jev-cli` port and a labeled PR-claims corpus exist, and sk-git's owner asks for it.

### R18. Debug `next_check` choice

| Field | Record |
|---|---|
| **Verdict** | **later.** No caller line exists in this repository. |
| **Judgment type and package** | A `choice`, Python `jev-cli` 0.6.2, over `read_code`, `run_test`, `reproduce` and `instrument` (claude-jev `hypotheses.ts:41-45`). |
| **Seam** | None opened. Grok-09 notes the debug skill already orders the work. |
| **Value** | A cheaper next check per hypothesis, logged only. |
| **Metric, baseline and harness** | None. Grok's kill: it loses to "always read_code". |
| **Cost, latency and privacy** | One call per hypothesis. Code excerpts leave the machine. |
| **Key gate and no-key behavior (D5)** | Logged beside a hypothesis, never reordering the debug phases, behind its own switch (proposed) and the D5 gate. With the gate failing, nothing is logged. |
| **Smallest slice** | UNKNOWN until a caller is named. |
| **Fitness checklist** | Fails Q1 and Q8. |
| **Confidence** | The vendored shape is confirmed. The repository seam is absent. |
| **Lineage agreement** | One, Grok-07. Council: seat-002 would drop it, seats 001 and 003 keep it later. |
| **Citation check** | Resolved for the vendored lines. No repository seam to check. |

**Promote when.** A debug workflow caller line is named, and a reader of the logged choice is named with it.

### R19. Compaction recall census, then an offline Jev deletion arm (R11 folded in)

| Field | Record |
|---|---|
| **Verdict** | **build-now for the zero-call census. The Jev arm is later.** It is the operator's fourth idea at the seam where the measured cost sits, and the census alone can close that idea with a number. |
| **Judgment type and package** | Nothing in the census. In the later arm, two `noul` questions per old tool call, keep the call and keep its result verbatim, batched with `jev run` on the Python `jev-cli` 0.6.2, as a port of the npm `jevctl` 0.2.3 procedure (keep threshold 0.5, newest 6 messages pinned, `compact.ts:20-25`). |
| **Seam** | Host compaction, recorded as `compactMetadata` in local Claude Code transcripts (fields read today: `durationMs`, `preTokens`, `postTokens`, `trigger`, `cumulativeDroppedTokens`, `preservedSegment` and others). The function-hook route: `.claude/settings.json:38`, npm `jevctl` `plugin/hooks/fast-jev.ts:269-287`, `claude-code.d.ts:7285` (`precompute` trigger) and `:3024-3026` (an overrunning hook is skipped and core runs). The repository brief: `compact-inject.ts:117-178`, `:284`, budget `shared.ts:14`. |
| **Value** | 208 host compactions in this project's transcripts, p50 104.4 s, p90 143.3 s, none under 60 s and 380.1 minutes in total (counted today). The census answers two questions with numbers: whether a deletion pass could fit these sessions, which every started at 450,019 tokens or more against a 25,000-token state budget, and what the stock summary and the brief each lose. Whether the waits are watched is UNKNOWN. |
| **Metric, baseline and harness** | **Per compaction, zero calls:** wall time, pre and post tokens, the estimated placeholder-state size against 25,000 tokens, a kept-token lower bound, rule-derived must-survive recall for the stock summary and for the brief, and the brief's attention-noise share. <br>**Must-survive items:** identifiers and files used after the boundary that appeared before it, files written through Write or Edit, the bound spec folder and the last user instruction. <br>**Brief column:** if the transcript does not record the injected brief (UNKNOWN), replay `buildMergedCompactResult` (`compact-inject.ts:284`) over the recorded tail. <br>**Spot check:** the operator reads the rule-derived items on 3 sessions before the recall numbers are trusted (proposed, seat-001's concern). <br>**Stop boundary for the arm:** it is not built if fewer than half the points fit 25,000 tokens without collapse, or if the kept-token lower bound exceeds 3 times stock `postTokens`. <br>**Keep threshold for the later arm, fixed now (proposed):** p50 at most 30 s, recall no lower than stock, kept tokens at most 3 times stock and a fallback rate of at most 20%. Any live hook form also needs a p95 inside the function-hook budget once open question 18 is answered. <br>Harness: one new read-only script (proposed name `score-compaction-recall.mjs`). |
| **Cost, latency and privacy** | The census makes zero calls and nothing leaves the machine. It reads only a transcript directory the operator names and prints counts, never transcript text. The later arm sends whole-session prose and tool inputs, the highest payload class in this research. It needs the scrubber with the underscore gap closed, an enablement notice and the operator's acceptance. |
| **Key gate and no-key behavior (D5)** | The census needs no key and never spawns `jev`. The arm runs behind its own flag (proposed `--jev`) after the D5 gate. With the gate failing it prints `jev arm skipped: <check>` and the census is unchanged. The vendored npm `jevctl` hook reads `TYPESAFE_API_KEY` from its options, the environment or the settings `env` (`fast-jev.ts:237-253`), runs unless `compaction` is `false` (`:75`) and auto-compacts at 60% (`:26-31`, `:289-303`). The upstream fast-jev-compaction plugin it was adapted from (`:1-5`) works the same way by a third-party blog's account (blog `:30-42`), and that blog places the key in the settings `env` (blog `:64-68`). Both bypass the D5 gate, so neither is installed before the census reports, and the key never goes into the tracked `.claude/settings.json` (row 43). On any error the vendored hook falls back to the built-in summary (`:283-285`), which is the fail-open shape a port keeps. |
| **Smallest slice** | The census over 10 to 20 sessions the operator names. One read-only script, its directory chosen at build time from system-spec-kit's layout (seat-002 proposed `system-spec-kit/runtime/cli/metrics/`, not reopened here). It writes nothing under the transcript directory. About 200 to 300 LOC (estimate). To undo this: delete the script and its report. |
| **Fitness checklist** | - Q1 fails until the census runs, which is acceptable because the census is the slice. <br>- Q3: the census may end idea 4 with no Jev code, which is a passing outcome. <br>- Q8: it reads an undocumented host format, so it must fail loudly on an unknown record shape. <br>- Q9 and Q11 fail for the arm until the scrubber gap is closed, a notice exists and the operator accepts the payload. <br>- Q12: the arm needs a Python `jev-cli` port, because D5 refuses the npm package. <br>- Q14: the function-hook API is early access. <br>- The rest pass. |
| **Confidence** | **Confirmed:** the enabled flag, the vendored limits and fallback, the hook-budget semantics in the vendored types and the transcript counts. **Inferred:** that a deletion pass rarely fits at these sizes, that recall differs enough to matter and that the waits are felt. The census confirms or refutes the first two. |
| **Lineage agreement** | None from the lineages, which all dropped the live PreCompact form in wave 1. A council addition (seats 002 and 003). seat-001 would rank it later, and D1 in the Changes section rules on that. |
| **Citation check** | Resolved (section 14 rows 168 to 174 and 190). |

**Proof plan, written before the build.**

1. One row per compaction prints wall time, pre and post tokens, the 25,000-token fit estimate, the kept-token lower bound, summary recall, brief recall and the brief's noise share. Boundary: an unknown record shape stops the run with a named error.
2. The output contains no transcript text, and a stub `jev` placed first on PATH logs no call.
3. The operator's spot check on 3 sessions agrees with the rule-derived items, or the report marks recall as unvalidated.
4. The stop boundary is printed as one line: the arm is either `not built` with its failing condition or `eligible`.
5. `git status` shows only the new script and its report.

### R20. Goal-criteria lint

| Field | Record |
|---|---|
| **Verdict** | **next.** The first slice costs zero calls. |
| **Judgment type and package** | In the later arm, two `noul` questions per criterion, asked with the Python `jev-cli` 0.6.2: can this criterion be checked from its own text, and does it name one observable result? |
| **Seam** | `check-goal.cjs:44-49` (four structural checks), the rule at `sk-create-goal/SKILL.md:121-122` and the runner at `create-goal-auto.yaml:221`. The evaluator sees only the stored string (`goal-set-string-playbook.md:55-57`). |
| **Value** | A criterion the evaluator cannot check leaves completion open, and the rule has no machine check. This packet's own parent goal breaks it at `goal.md:89`. The lint reaches every runtime through `/create:goal`. Against that, native-judge reasons rarely blame an unverifiable criterion (31 of 576, seat-reported), which is why this is next rather than build-now. |
| **Metric, baseline and harness** | **Labels:** about 100 operator labels, stratified from about 1,375 to 1,387 criterion lines outside `z_archive` (the two seat counts differ by method). Precision and recall are scored per rule. <br>**Baseline:** a zero-call lexical lint. <br>**Stop rule:** stop if the labeled violation rate is under 5%. <br>**Keep rule for the Jev arm, proposed:** it beats the lexical lint by at least 0.2 F1, with precision at least 0.8 and a per-row flip rate of at most 0.10. <br>**Base rate, disputed:** 21 of 1,387 by a strict regex against 7 of 25 in a one-lens sample. The labels decide (open question 22). |
| **Cost, latency and privacy** | About 600 offline calls for the arm (100 criteria, 2 questions, 3 reruns). Committed repository text only (low). |
| **Key gate and no-key behavior (D5)** | A separate script, not a fifth check inside `check-goal.cjs`, because check-goal is itself a completion gate. The Jev arm runs behind its own flag (proposed `--jev`) after the D5 gate. With the gate failing, the lexical findings print with `jev arm skipped: <check>`. `check-goal.cjs`'s exit codes never change, and its output is byte-identical to today. |
| **Smallest slice** | The lexical lint plus about 100 labels, with zero calls. One new script beside `.skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs` (proposed placement). About 120 to 200 LOC (estimate). To undo this: delete the script and its labels. |
| **Fitness checklist** | - Q1 fails until the labels exist, which is acceptable because the labels are the slice. <br>- Q3: the lexical lint is the build-nothing competitor and must be beaten by a margin. <br>- Q8: an advisory inside `check-goal.cjs` later needs sk-create-goal's owner, and its callers start at `create-goal-auto.yaml:221`. <br>- The rest pass. |
| **Confidence** | **Confirmed:** the rule, the missing check and one violating criterion in this packet. **Disputed:** the base rate. |
| **Lineage agreement** | None from the lineages. No lineage opened `sk-create-goal`. A council addition (seat-003, with seats 001 and 002 corroborating). |
| **Citation check** | Resolved. The council's `goal.md:107` drifted to `goal.md:89` (row 179). |

**Proof plan.**

1. The per-rule violation rate prints, with lexical precision and recall against the labels.
2. `check-goal.cjs` exit codes are unchanged across all active goals.
3. A stub `jev` logs no call.

### R21. Gate 3 calibration arm (conditional, inside 002)

| Field | Record |
|---|---|
| **Verdict** | **next, conditional.** It runs only when R1's census prints `underpowered`, so 002 still yields a Jev number. Single-seat (seat-003), bounded by the council host. |
| **Judgment type and package** | One `noul` per labeled prompt, Python `jev-cli` 0.6.2: "does this request require writing a file" (proposed wording). |
| **Seam** | `labeled-prompts.jsonl` `gate3_triggers`: 127 `yes` and 68 `no` (counted today). The classifier's archived baseline is F1 0.9843 (H3, digest, seat-001 reopened tp 125, fp 2, fn 2 and tn 66). |
| **Value** | 002 returns Jev's per-call latency p50 and p95, a flip rate and a calibration even when the advisor leaves no headroom. It separates "Jev reads this repository's prompts badly" from "the advisor leaves no room". |
| **Metric, baseline and harness** | Accuracy, F1, Brier score and per-row flip rate over 3 reruns, beside the classifier's 0.9843. It is a calibration, not a race, so What Not To Build row 21 stands. |
| **Cost, latency and privacy** | 585 short calls (195 times 3). The payload is the same corpus prompts R1 already sends. |
| **Key gate and no-key behavior (D5)** | Runs under R1's flag and gate, with no new flag. With the gate failing it prints R1's skip line and nothing else changes. |
| **Smallest slice** | About 40 to 60 LOC inside `score-jev-tiebreak.mjs` (proposed name), reusing its gate, spawn and call record. |
| **Fitness checklist** | All pass. The risk is scope creep in 002, bounded by the `underpowered` condition. |
| **Confidence** | **Confirmed:** the label counts. **Inferred:** that latency on short routing prompts says much about longer payloads such as goal evidence or session state. |
| **Lineage agreement** | None from the lineages. A council addition (seat-003). |
| **Citation check** | Resolved. |

---

## What Not To Build

This is the workflow's eliminated-alternatives section, under the heading this synthesis was asked to use. Rows 1 to 32 and 36 to 43 are dropped ideas, and rows 33 to 35 are dead-end approaches. Rows 36 to 42 come from the council review of 2026-09-26 and were checked here. Row 43 comes from this re-synthesis. Reasons changed since the first synthesis are listed as K7 to K15 in the Changes section.

| # | Idea | Reason | Checklist question or red flag | Evidence | Lineage(s) |
|---|---|---|---|---|---|
| 1 | A live Jev call in the advisor prompt hook, as a whole-catalogue pick or a tie-break | The child is killed at 2500 ms and the hook returns `{}`, and the advisor gets 2200 ms of that. The kill is confirmed. That a Jev call cannot fit is inferred until a latency exists. Revival rule: a cluster-only call comes back to review only if R1 prints `keep` and its measured p95, spawn included, fits the advisor's remaining budget | Q7, and the red flag "delegation that costs more than the work" | `user-prompt-submit.ts:22-24`, `:105-125` (the system-spec-kit Claude wrapper) | All three, independent |
| 2 | Jev as a fused live advisor lane, or Jev writing `passes_threshold` or `ambiguousWith` | Both are code-owned scorer outputs, so a model answer would become a routing verdict | Q8, Q11 | `fusion.ts:785-789`, `ambiguity.ts:44-58` | DeepSeek, Grok |
| 3 | Serving a Jev routing pick before R1 measures it, including a status-bar suggestion | No measured win exists, and no status-bar seam exists in this repository's hooks | Q1, and the red flag "usefulness claim without numbers" | R1 unrun. Grok found no status-bar seam | Grok, MiMo, DeepSeek |
| 4 | An abstention arm, with Jev deciding when the advisor says none | The 13 unknowns are correct abstentions, so the ceiling is the 5 false fires | Q1, Q3 | `capture-scorer-eval-baseline.mjs:70-76`, `:91-99`, 18 gold-none rows counted | MiMo proposed, refuted here |
| 5 | A live keep-or-drop pass inside the PreCompact command hook | 1800 ms internal budget, a warning above 1500 ms and a 3 s hook, while the one reported Jev compaction took 5.6 s (user report). This drop covers the command hook only. The function-hook route, which replaces the host summary, is R19 | Q7 | `shared.ts:12`, `compact-inject.ts:353-354`, `.claude/settings.json:215-222`, Hermes post `:26` | All three, independent |
| 6 | Compaction that runs unless explicitly disabled | D5 makes every Jev feature opt-in and dormant without a key. The vendored npm `jevctl` hook breaks that three ways: it runs unless `compaction` is `false`, reads `TYPESAFE_API_KEY` from its options, the environment or the settings `env` outside any gate and auto-compacts at 60% of context | Q7, Q9 | npm `jevctl` `fast-jev.ts:26-31`, `:75`, `:237-253`, `:289-303`. pi-jev `README.md:35-37` | Grok. Restated under D5 by the council |
| 7 | A per-turn "good response" grade, or any per-turn grade display | No gold, and a tax on every turn. The 0.22-to-0.58 shift cited here before is meraGPT's "Decider 1", whose relation to Jev the source does not state, so it is no longer cited against Jev | Q1, Q11 and a report nobody acts on | Pi post `:231` | Grok, MiMo (independent), DeepSeek |
| 8 | Dropping a review finding live when a `noul` is under 0.5 | The vendor's own run kept a planted false positive at 0.57 (vendor claim) | Q11 | claude-jev `README.md:85-93`, `review.ts:21-28` | Grok |
| 9 | Any no-key or failure path that returns a number: `noop`'s 1.0, a failed grade's 0.0 or `runScreen`'s 0 | A default score is a silent wrong answer, indistinguishable from a real one. `noop` is the runner's default grader, so every default 5dim run through the runner already carries its fixed score | Q7, and the red flag "a default that papers over a missing value" | `score-model-variant.cjs:207-226`, `:222-224`, `run-benchmark.cjs:577`, npm `jevctl` `core/screen.ts:56` | All three, independent |
| 10 | Aborting a whole run when one judgment fails | One transport error would discard every measured row | Q7 | jev-review `workflow.ts:48-55` | Grok |
| 11 | Replacing the near-duplicate collapse, or making Jev the live merge decision | The merge is a pure function with a named constant, deterministic and replayable | Q8, Q11 | `fanout-merge.cjs:341`, `:348-351` | Grok, DeepSeek (C3) |
| 12 | Jev in the dispatch guard, the dispatch linter, the MCP route guard or the Pi Gate 3 sanitizer | These decide on repository facts inside 5 s budgets and must be deterministic | Q11, and "never let a judgment stand in for a repository fact" | `dispatch-guard.cjs:80-81`, `:124-132`, `dispatch-rule-checks.mjs:107-117`, `spec-gate-classify.ts:22-29`, `cli-usage/SKILL.md:219` | Grok, DeepSeek (C2) |
| 13 | Any Jev input to STOP legality | STOP authority is frozen on legacy convergence, and a model answer must not become the blocking signal | Q8, Q11 | `convergence.cjs:480-486`, `stopping-clock-shadow.ts:10-19` | All three (C1, MiMo after cross-reading) |
| 14 | Jev as the AI Council verdict-delta measure | It would replace an adjudicator signal rather than shadow it | Q11 | Seam map S19 (digest). seat-001 reopened `convergence-signals.md:56-58` (seat-reported) | DeepSeek |
| 15 | Jev writing or gating finding severity | `riskScore` is already non-gating, and the verdict reads only confirmed P0s | Q11 | `completion-criteria.md:62`, `:75` | All three (C5) |
| 16 | Replacing the goal heuristic's authority, or letting Jev return `met` over blocking language | Blocking language forces `not_met` before any `met`, which is the safety property | Q11 | `goal-core.cjs:603-604`, `opencode-goal.js:2197-2230` | Grok, MiMo (independent), DeepSeek |
| 17 | A goal drift or progress judgment | Its only consumer is an observe-only nudge and a `last_check` line | A report nobody reads | `goal/README.md:77` | MiMo |
| 18 | A Jev verifier on Cursor or Devin | Those adapters inject only and have no verify or continue mechanism | Q8 | `cursor/goal-inject.mjs:11`, `goal/README.md:78-79` | DeepSeek (Grok cited it) |
| 19 | Live Jev in the compiled-routing front door | One legal stdout shape with a legacy fallback on a synchronous path, and only 13 clarify and defer gold rows | Q1, Q7 | `compiled-route.cjs:25-47`, canary count | DeepSeek, MiMo |
| 20 | A shadow log of Jev defer disagreements | No decision reads it, and only 10 defer gold rows exist | Q1, and a report nobody reads | Canary count | MiMo parked it as later. Dropped here |
| 21 | Gate 3 write classification as a Jev product | F1 is already 0.9843, which leaves at most 4 errors. The corpus is R21's calibration input, and a calibration is not a product | Q1, Q3 | H3 (digest), `labeled-prompts.jsonl` | MiMo, DeepSeek |
| 22 | Spec-level risk flags beside the level script | The level script reads the flags (auth +10, api +8, db +7, architectural +20), so a Jev flag would change a level. It drops on low stakes and on missing gold for which level a packet should have had, not on a missing reader | Q3, Q11 | `recommend-level.sh:36-47` | DeepSeek parked it as later. Dropped here |
| 23 | A retrievability score on the post-save review | No retrieval gold, and an unvalidated number beside a calibrated 0.4 gate | Q1 | Seam map S25 (digest) | DeepSeek, MiMo |
| 24 | A second opinion on manual playbook verdicts | The human verdict wins by contract, and the latest transport run has 22 PASS and 0 FAIL | Q3, Q11 | Seam map S26, H8 (digest) | DeepSeek, MiMo |
| 25 | A new `cli-jev` hub mode, a `jev-judge` command or a new skill | The hub is one mode on purpose, the transport serves all four types and no decision is removed | Q6, Q13 | `hub-router.json:5-14`, `cli-usage/SKILL.md:162-174` | All three (C4, MiMo after cross-reading) |
| 26 | A measurement harness command family | A wrapper that only forwards to scripts | The red flag "a wrapper that only forwards arguments" | Repo-rules digest section 4 | MiMo |
| 27 | A shared Jev client helper now | Zero callers today. Extract a shared probe at the third certain caller, which is whichever of the R19 or R20 Jev arms is built first. Align the skip lines now (section 9) | Q6, and "two is not a pattern" | Repo-rules digest section 2. 002 `spec.md:112`, `:131`, 003 `spec.md:121` | DeepSeek |
| 28 | A supercov smell command | The vendor publishes `duplicated_logic` near chance, and `deep_nesting` asks for a count (vendor data) | Q1, Q11 | supercov `properties.json:38-42` | Grok |
| 29 | Writing a Jev arm into the advisor ratchet baseline | The ratchet is pinned and deterministic, and a network arm is neither | Q8, and the red flag "a test re-baselined to get green" | `scorer-eval-baseline.json:5-12` | DeepSeek, MiMo (independent) |
| 30 | An answer cache during stability reruns | Identical cached answers make the per-row flip rate zero by construction | Q1 | `benchmark-stability.cjs:102-108` | DeepSeek |
| 31 | A live Jev call in `detectCompletionClaim`, or done-gate authority | On Claude the sentinel runs inside an async 10 s Stop hook. The 1200 ms bound and the host-blocking spawn apply to OpenCode. The drop stands on Q11: done-gate authority stays with code | Q7, Q11 | `.claude/settings.json:172-177`, `completion-evidence-sentinel.cjs:90-94`, `:113-119` | DeepSeek, MiMo (C6) |
| 32 | PR-claims verification as a merge gate | The recipe is npm `jevctl` only, it has no gold and it sits in the sk-git flow | Q8, Q12 | npm `jevctl` `recipes.md:5-11`, `errors.ts:1-9` | MiMo |
| 33 | Dead end: Harness B as written, `run-benchmark.cjs --profile reviewer-regression --scorer 5dim --grader jev` | The profile disowns the 5dim path, and `--grader jev` silently becomes `mock` | Q2, a proof plan built on a wrong command | `reviewer-regression.json` note, `run-benchmark.cjs:571`, `:577`, `score-model-variant.cjs:211` | DeepSeek-08 proposed it, MiMo-08 caught it |
| 34 | Dead end: the reviewer fixtures as three-way grading gold | 8 cases, all `fail` and all recorded, while the regex already parses every verdict line | Q1 | Fixture census and regex replay | Digest H9, DeepSeek, MiMo (MiMo-05 found the single class) |
| 35 | Dead end: registry `transitions` as P0-survival gold | 44 or 45 findings entered as P0, by counting method, and none was downgraded, so the gold has no negative class | Q1 | Census of 409 registries. The 44 is seat-reported | MiMo-05 proposed it, refuted here |
| 36 | jevcache.sh as a dependency | By the vendor's page it installs by `curl \| sh` and reads `JEV_API_KEY` outside the D5 gate (vendor claim, not reopened here). Without that page it still drops: an answer cache hits only exact repeats, and a cache during reruns zeroes the per-row flip rate (row 30) | Q7, Q9, Q12 | Vendor site (vendor claim, council-reported). `benchmark-stability.cjs:102-108` | Council |
| 37 | classifier.dev as a service | By the vendor's page it has a keyless free tier, which conflicts with D5 (vendor claim, not reopened here). Without that page it still drops: it adds a second egress vendor beside Jev, and its one useful pattern, heuristic first and a model only where the heuristic is unsure, survives as an offline cascade table in R2 at no extra call | Q9, Q12 | Vendor site (vendor claim, council-reported). R2 record | Council |
| 38 | A Jev PostToolUse filter on Bash output | Command output is the payload most likely to hold secrets, and the scrubber misses underscore-prefixed names (section 5 item 11). A deterministic filter needs no key. Whether a command hook can replace tool output is UNKNOWN | Q9, Q11 | `.claude/settings.json:204-211` (the Bash matcher runs a dispatch audit at 5 s) | Council |
| 39 | Jev at git preflight (S12) or executor demotion (S21) | S12 decides on git rule checks against a live repository context. S21's `bayesian-scorer.ts` is imported only by its own test | Q11, "never let a judgment stand in for a repository fact" and Q6 | `git-preflight-advisory.mjs:113-119`. rg: the only import of `bayesian-scorer` is `bayesian-scorer.vitest.ts:3` | Council (seat-003), checked here |
| 40 | R3's cached advisor lane | A cache hits only exact repeats (16 of 439 typed prompts over 100 characters, 3.6%, seat-reported), and a first ask still meets the 2500 ms kill | Q1, Q7 | `user-prompt-submit.ts:22-24`, `:105-125` | Council |
| 41 | R14's next-focus Jev comparator | `compareNextFocusShadow` has no runtime caller, so a Jev `choice` there would feed nothing | "a report nobody reads", Q6 | rg: `next-focus-selection.ts:352` (definition), `next-focus/index.ts:13` (re-export), `next-focus.vitest.ts:25`, `:474` (test) | Council host (seat-002 in round 1), checked here |
| 42 | A global Jev switch | Under D5 the key already is the global switch. One switch per feature keeps consent per payload class | Q6 | Section 9 | Council (seat-002) |
| 43 | A Jev key in the tracked `.claude/settings.json` `env`, as the fast-jev-compaction blog shows | The file is tracked, so the key would be a committed secret, and a key there is read by the vendored hook outside the D5 gate | Q9, and the red flag "a secret in a tracked file" | `git ls-files` lists `.claude/settings.json`. Blog `:64-68`. npm `jevctl` `fast-jev.ts:247-251` | This re-synthesis |

---

## Divergence Map

**No divergent pivots happened in round 1.** The run set an empty `divergent` block and `convergenceMode` off, and every iteration took its assigned angle from `context/research-angles.md`. The merged registry's `ruledOutDirections` 0 and `iterationsCompleted` 0 are gaps in the merge, not evidence, because each lineage ruled directions out in its iteration markdown.

**The council review was a lens after the fact, not a pivot.** It opened two seams no lineage examined, the host compaction summary and goal-criterion authoring, and two seams the seam map rated weak, S12 and S21. It ran on one model family (section 15).

**Saturated directions.**

- Live calls inside command hooks. All three dropped them on deadlines in wave 1, every later wave reconfirmed that and D5 moves no deadline.
- No new surface. Waves 3 and 4 of all three lineages reach it, and the council kept it.
- The offline routing arm as the first build. Every lineage's final order starts there, two of them after reading the third.
- Never a default score. All three in wave 1.

**Contested ideas.**

- Round 1: section 10, disagreements 1 to 7.
- Council: D1 to D5 in the Changes section. D1, D3 and D4 are resolved here. D2 is partly resolved. D5, the criteria-lint base rate, stays open for round 2.

**Failures.**

- DeepSeek-08's Harness B command and the reviewer-fixture D4 gold failed on the runner path.
- MiMo-05's transitions gold and MiMo-02's abstention arm failed on counts.
- MiMo-04's 181 lineages, Grok-02's H5 label and the digest's 11 cli-jev canary cases drifted.
- The council's `goal.md:107` drifted to `goal.md:89`. Its compaction count of 204 and the orchestrator's 206 are both below today's 208, consistent with sessions still running.
- The first synthesis's "mock D4", "2 to 4 keys" and the Pi post `:1121` citation were corrected (K1, K3, K2).
- Grok's state log carries 11 timestamps after its run window and 1 with none, flagged by the runner.
- The merge wrote incomplete metrics and a resource map with 0 references, and DeepSeek's own lineage registry already held only 8 of its 57 findings before the merge.

**Remaining frontier.**

- The numbers R1, R19 and R2's zero-call slice exist to produce: movable rows, the arm verdict, per-call latency, compaction fit and recall and the verifier's error rates with the clamp share.
- Gold nobody has built: goal-criterion labels, regex-miss reviewer outputs, a D4 hallucination set, a human-scored reply subset, narrative-mined P0 rejections and a clarify gold.
- The completion sentinel's advisory log, which exists only in the main checkout.
- S13 and S19 were examined by DeepSeek alone, with seat-001 reopening S19's delta line. S12 and S21 are now examined and dropped (row 39).

---

## 12. Open Questions

| # | Question | What would resolve it |
|---|---|---|
| 1 | How many rows, across the labeled corpus and the holdout file, are movable, with the gold inside the cluster but not first? (`kq-eligible-rows`) | R1's census over both files, alias-aware, zero calls |
| 2 | Does a Python `jev-cli` `choice` beat the scorer's order and each zero-call comparator on those rows? | R1's arm: 3 reruns, modal picks and the sign test |
| 3 | What are the per-call latency p50 and p95 of the Python `jev-cli` here? (`kq-latency-p95`) | R1's per-call JSONL, or R21's run |
| 4 | How far does an R1 loss reach? | A `kill` from R1, then a second closed-set measurement on different inputs. R2's Jev arm is that measurement once it is unblocked |
| 5 | What are the goal heuristic's error rates, and how many false `not_met` come from the blocking pattern and from the clamp defect? | R2's zero-call slice, with its clamp-error count |
| 6 | Do live reviewer outputs miss the verdict line often enough for a classifier to matter? | One reviewer run on cases without `reviewer_output`, reading the `verdictMethod` counts |
| 7 | Do iteration narratives hold rejected-P0 downgrades usable as severity gold? (`kq-p0-positives`, partly answered: 44 or 45 P0-born findings exist and none was downgraded in `transitions`) | A mining pass over archived review iterations |
| 8 | Does the derived stop gold match the iteration prose? (`kq-gold-sanity`) | MiMo's five-lineage manual read |
| 9 | What is the completion sentinel's real false-fire rate? | Its advisory log in the main checkout, inside the 30-day window, plus labeled excerpts |
| 10 | How often do clarify outcomes happen in real use? (`kq-clarify-rate`) | A count of real clarify events, then a 30-row gold |
| 11 | Would a Jev pass break a provider prompt cache? (`kq-cache-breakage`) | Relevant only if a Pi history-pruning pass is proposed. A cache-hit comparison with and without the pass |
| 12 | What is the H2 rerank baseline today? | One local run of `score-outcome-rerank.mjs` with no Jev call, or R1's baseline column |
| 13 | Can the provider and model be recorded per call from the Python `jev-cli` output, or only through `jev auth test`? | Reading one judgment's JSON output at build time |
| 14 | Is any routing corpus prompt private? | The corpus authoring history |
| 15 | Do git preflight (S12) and executor demotion (S21) have any Jev fit? | Answered: no fit (What Not To Build row 39) |
| 16 | How many rows have the gold in the top 3 but not first? | R1's census, top-3 column |
| 17 | Do the plugin's keyword rule and the scrubber's assignment rule, in their real modules, redact `TYPESAFE_API_KEY=` and `SERVICE_TOKEN=` values? | One unit case per module. Copies of both regexes fail today (section 5 item 11) |
| 18 | Does Claude Code bound a `session.compact` function hook's run time in production, and at what? | The hook API reference for 2.1.280 or later, or one timed run with a stub hook. The vendored test-clock text says ten seconds |
| 19 | Does the operator run OpenCode or Pi goals with a verifier? | Goal state records with a verifier verdict in any state directory the operator uses, including a custom `OPENCODE_GOAL_STATE_DIR` |
| 20 | Are 11 of the 24 frozen ambiguity-slice margins negative, and should R1 veto on the tau 0.03 slice? | Answered: 11 negative and 2 zero, counted today. R1 reports the split and does not veto (disagreement D4) |
| 21 | How often does the live advisor set `ambiguousWith` on real prompts? | A count from the advisor's shadow sink or hook log |
| 22 | What share of goal criteria cannot be checked from their own text? | About 100 operator labels stratified from the criterion lines. The estimates disagree: 21 of 1,387 by strict regex against 7 of 25 in a one-lens sample |
| 23 | How often does live OpenCode or Pi goal evidence exceed 1,200 characters? | Evidence lengths from goal state or the plugin's packet log, if either runtime's verifier is in use (question 19) |
| 24 | Can a Jev deletion pass fit these sessions at all, given every compaction started at 450,019 tokens or more? | R19's census: the placeholder-state estimate per compaction against 25,000 tokens |
| 25 | Does the Claude Code transcript record the brief the PreCompact hook injected, or must R19 replay it? | Reading the records after one compaction boundary in a transcript |
| 26 | Did the DeepSeek registry loss drop a finding that would change a verdict here? | A read of DeepSeek's 57 iteration findings against this file's records and drop rows |
| 27 | Does rule-derived must-survive recall agree with an operator's reading of the same sessions? | R19's spot check on 3 sessions |
| 28 | Does Pi await async `turn_end` handlers, which bounds any Pi verifier call? | Pi's extension runtime source or docs (seat-003 left it UNKNOWN) |
| 29 | Does the operator watch host compaction waits, or do most happen in unattended runs? | Operator answer, or a split of the 208 compactions by whether a user turn followed within a minute |
| 30 | Would a model family other than Claude reach the same calls on R1's keep rule, R19's rank and R2's reshaping? | Round 2's four non-Claude lineages reading the same code and counts |

### For round 2

Round 2 (`004-deep-research-expansion`, four lineages, 5 forced iterations each) can answer these by reading code and counting, with no build and no billed call. Each resolves by the named evidence, cited `file:line` or a count, not by agreement among lineages.

| Question | What would resolve it | Why round 2 |
|---|---|---|
| 30. Do other model families reach the same calls on R1's keep rule, R19's rank and R2's reshaping? | Each lineage restates the keep rule's failure modes, the R19 fit argument and the clamp path from the cited lines, and names any error | The council and both syntheses are one model family |
| 22. What share of goal criteria cannot be checked from their own text? | An independent stratified sample from a non-Claude lineage, scored by the rule in `sk-create-goal/SKILL.md:121-122`, with its interval. The operator's labels still decide | Disagreement D5 is unresolved and both estimates are single-family |
| 18. What is the production budget of a `session.compact` function hook? | A cited Claude Code reference, or the vendored types' budget text traced to its source | It gates any live form of R19 |
| 19 and 23. Is any OpenCode or Pi goal verifier in use, and how long is its evidence? | A search of every goal state directory the operator's configs name, with record counts and evidence lengths | It gates R2's Jev arm and plugin mode |
| 25. Does the transcript record the injected brief? | The record shape after a compaction boundary | It decides whether R19's brief column needs a replay |
| 26. Did the DeepSeek registry loss drop a decisive finding? | A finding-by-finding read of DeepSeek's iteration markdown against this file | The loss is confirmed but its effect is UNKNOWN |
| 28. Does Pi await async `turn_end` handlers? | Pi's extension runtime source, if it is available locally | It bounds any Pi verifier call |
| 7. Is there narrative-mined P0 gold? | A count of rejected-P0 downgrades with rationale in archived review iterations | It decides whether R10 can ever promote |
| 21. How often does the live advisor set `ambiguousWith`? | A count from the shadow sink or hook log | It sizes R3's value if R1 keeps |

---

## 13. Proposed Build Phases

Five phases, all under `specs/cli-jev/003-cli-jev-workflow-integration/`, in this order of need. 002 and 003 are Planned children under an approved plan, so each change below is an amendment the operator approves before their docs change. 004 exists and is research. New build phases number from 005. No separate measurement-only phase is needed, because each build phase's first slice is its own zero-call measurement.

### 002-advisor-jev-tiebreak-arm (Planned, amended)

| Field | Record |
|---|---|
| **Scope** | Measure, offline and by hand, whether a Python `jev-cli` `choice` over the near-tie cluster beats the scorer's order and three zero-call comparators, under a keep rule that can fail |
| **Recommendations** | R1. R21 runs only when the census prints `underpowered` |
| **First slice** | An alias-aware census over both corpus files, with cluster and top-3 columns, the baseline column and the zero-call comparators, under the capture's env including `VITEST=true` |
| **Likely files** | New: `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-jev-tiebreak.mjs` (proposed name). Read only: `labeled-prompts.jsonl`, `holdout-prompts.jsonl` and the built `dist` scorer |
| **Dependency** | The advisor `dist` is built first |
| **Rough size** | 250 to 320 LOC in one file (estimate) |
| **Observable check** | With no key: per-file counts, the baseline at 53/70 and the comparator metrics, and a stub `jev` logs no call. With a key: wins, losses and ties, the exact p, the flip rate, p50 and p95 and one verdict line out of `keep`, `kill`, `inconclusive` and `underpowered`, plus R21's metrics when it ran. `git status` shows only the new script and its reports |

**Proposed amendments to the Planned docs:**

- **REQ-004:** the census covers all skill-firing rows of both files, alias-aware, with cluster and top-3 columns, not the held-out half only.
- **REQ-005:** the env adds `VITEST=true`.
- **REQ-007:** the four-outcome rule in R1, with the comparators on identical rows and the outcome-weighted rerank on held-out rows only.
- **REQ-008:** a per-row flip rate of at most 0.10 replaces the stability coefficient.
- **REQ-009:** each call also records the pick probability and the `none` probability.
- **REQ-010:** a row with three different picks is `unstable` and undecided. Exit 2 stops the arm.
- **REQ-012:** report the tau 0.03 split without a veto (disagreement D4). The council would keep the veto for now, and this file rejects that.
- **Skip lines:** `jev arm refused: expected jev 0.6.2` and `jev arm skipped: no credential` align to `jev arm skipped: <check>`, and a version mismatch also prints the version line found and the binary's path.
- **R21:** added as conditional scope.

### 003-goal-verifier-jev-shadow (Planned, amended)

| Field | Record |
|---|---|
| **Scope** | Give the goal verifier its first measured error rates and test a free fix for the clamp defect, all with zero calls. The Jev arm and the plugin shadow mode follow only with recorded OpenCode or Pi verifier use |
| **Recommendations** | R2, plus R4's optional claims column |
| **First slice** | 30 to 50 rows with the raw text, its as-ingested form and the raw length, pre-labeled from native `goal_status` records and adjudicated by the operator. The heuristic, tail-window and goal-core arms, with per-check attribution and the clamp-error count |
| **Likely files** | New: a labeled JSONL fixture and one offline scorer beside `.skilled/hooks/goal/lib/` (proposed paths). Only if promoted: `.skilled/plugins/opencode-goal.js` (a symlinked directory resolving to `.opencode/plugins/`), `.skilled/hooks/goal/goal-plugin.md` and the plugin tests |
| **Dependency** | None for the zero-call slice. The Jev arm waits on recorded OpenCode or Pi verifier use (question 19) and on both redaction unit cases passing (question 17). Soft: 002's latency record |
| **Rough size** | 30 to 50 rows and 120 to 170 LOC for the zero-call slice (estimate), then 60 to 100 LOC for the plugin mode if promoted (DeepSeek-10's estimate) |
| **Observable check** | Confusion tables for all three zero-call arms on identical rows, with the clamp-error count, and a stub `jev` logs no call. The Jev arm does not start until goal records with a verifier verdict exist |

**Proposed amendments to the Planned docs:**

- **REQ-001 and T001:** rows carry the raw last assistant text, its as-ingested form and the raw length. Labels are pre-filled from native `goal_status` records, with the operator adjudicating disagreements and spot-checking about 10 agreements.
- **REQ-002:** adds the tail-window arm, the goal-core parity arm and the clamp-error count.
- **REQ-006 (d):** a per-row flip rate of at most 0.10 replaces the stability coefficient.
- **REQ-007:** two redaction unit cases, one for `opencode-goal.js:474` and one for `secret-scrubber.ts:128`, pass before any egress.
- **REQ-009:** each call also records confidence, and the report adds the offline cascade table.
- **Slice 2:** gated on recorded OpenCode or Pi verifier use and on the unit cases.
- **`show`:** gains a `verifier_shadow=` field (proposed name) beside `verifier_source=`.

### 004-deep-research-expansion (exists, In Progress, research)

Round 2 of this research. It is not a build phase. It answers the "For round 2" list in section 12, and its final synthesis reconciles 002, 003, 005 and 006 against what it finds. This file is its first deliverable.

### 005-compaction-recall-harness (new)

| Field | Record |
|---|---|
| **Scope** | Measure host compactions, and what the stock summary and the repository brief keep, over transcripts the operator names, with zero calls. Then decide, by the stop boundary, whether an offline Jev deletion arm is worth building |
| **Recommendations** | R19, with R11 folded in |
| **First slice** | The census over 10 to 20 sessions, with the fit estimate first |
| **Likely files** | New: one read-only script (proposed name `score-compaction-recall.mjs`). Its directory is chosen at build time from system-spec-kit's layout. It writes nothing under the transcript directory |
| **Dependency** | None. The operator names the sessions. The Jev arm, if eligible, waits on both redaction unit cases and the operator's acceptance of the payload |
| **Rough size** | 200 to 300 LOC (estimate) |
| **Observable check** | One row per compaction with the fields in R19's proof plan and one stop-boundary line. No transcript text appears in the output, and a stub `jev` logs no call. `git status` shows only the new script and its report |

### 006-goal-criteria-jev-lint (new)

| Field | Record |
|---|---|
| **Scope** | Lint goal criteria for self-containedness and one observable result. Lexical first and labeled next. The Jev arm comes only past the stop rule |
| **Recommendations** | R20 |
| **First slice** | The lexical lint plus about 100 operator labels |
| **Likely files** | New: one script beside `.skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs` (proposed placement). `check-goal.cjs` is read only |
| **Dependency** | None. The labels are the operator's |
| **Rough size** | 120 to 200 LOC (estimate) |
| **Observable check** | Per-rule violation rate and lexical precision and recall print. `check-goal.cjs` exit codes are unchanged across all active goals. A stub `jev` logs no call |

**Build order.** 002 and 005 first, side by side, since both cost zero calls until their censuses report. 002's arm then gives the first billed calls and the first latency number every live idea waits on. 006's lexical lint and 003's zero-call slice follow. No Jev arm in 003, 005 or 006 starts before 002 has a latency record and both redaction unit cases pass.

### Not phased (later), with what would promote each

| Item | Promote when |
|---|---|
| R2 Jev arm and plugin shadow mode (inside 003) | Recorded OpenCode or Pi verifier use exists, the zero-call slice leaves false `not_met` the tail-window arm cannot fix and both redaction unit cases pass |
| R19 Jev arm (inside 005) | The census clears its stop boundary, the scrubber gap is closed and the operator accepts the payload. A live hook form also needs question 18 answered |
| R20 Jev arm (inside 006) | The labeled violation rate is at least 5%, and the lexical lint's F1 leaves room for a 0.2 gain |
| R3 suggested order | R1 prints `keep`, and its measured p95, spawn included, fits the advisor's remaining budget |
| R4 completion-claim audit | R2's rows exist with the claims column, the regex cannot cut false fires without new misses and a reader of the advisory is named |
| R5 reviewer verdict classifier | A reviewer run on cases without recorded output shows verdict-line misses |
| R6 reply-harness judge | A human-scored subset of about 20 masked replies exists |
| R7 D4 grader kind | A labeled D4 set exists and the silent `mock` fallback is fixed |
| R8 stop replay Jev arm | The local replay, aimed first at inert-novelty windows, shows the heuristic stops later than the derived gold on lineages whose config lets a stop move, and a five-lineage read confirms the gold |
| R9 confirm-mode suggestion | R8 yields a signal with precision of at least 0.9 |
| R10 severity replay | A narrative-mined gold holds at least 20 labeled P0 negatives |
| R12 clarify default | A clarify gold of 30 or more rows exists |
| R13 alignment suggestion | Enough archived below-50 saves with their final folder exist |
| R15 fan-out pair record | A labeled pair set that includes cross-body pairs exists, and a reader of the record is named |
| R16 injection screen | A hook that handles fetched web content exists |
| R17 PR-claims report | A Python `jev-cli` port and a labeled PR-claims corpus exist, and sk-git's owner asks for it |
| R18 `next_check` choice | A debug workflow caller line is named, and a reader of the logged choice is named with it |
| R14 next-focus comparator (dropped) | Revive only if a runtime caller of `compareNextFocusShadow` exists and a focus gold is named |

---

## 14. Citation Verification Ledger

Rows 1 to 143 are the first synthesis's ledger, unchanged. Rows 144 onward are this re-synthesis's checks of the council's citations and of its own, each reopened on 2026-09-26 in the worktree at HEAD `6c44ac6a26` with a clean `git status`. In those rows "Synthesis" means this re-synthesis, "host" marks a fact the orchestrator verified before dispatch and three results join the key: **count** (a count rerun today, figure given), **misattributed** (the source says something other than the claim) and **not reopened** (seat-reported, carried as such).

Result key: **resolved** (right file and lines), **drifted** (right file, wrong lines, right lines given), **failed** (the file or the content the claim needs is absent). "Synthesis" marks a citation this synthesis added.

| # | Citation | Cited by | Result | Note |
|---|---|---|---|---|
| 1 | `score-outcome-rerank.mjs:6-10` | Digest H2, DeepSeek | resolved | MRR and right@3 rationale |
| 2 | `score-outcome-rerank.mjs:17-23` | Digest H2 (`:17-19`) | resolved | Train and held-out split, read-only |
| 3 | `score-outcome-rerank.mjs:33-38` | MiMo, digest (`:38`) | resolved | Corpus and `dist` imports |
| 4 | `score-outcome-rerank.mjs:47` | MiMo-02 | resolved | Gold-none rows skipped |
| 5 | `score-outcome-rerank.mjs:95`, `:108` | Digest | resolved | Metric returns |
| 6 | `score-outcome-rerank.mjs:96-121` | Synthesis | resolved | Metrics and deterministic split |
| 7 | `score-outcome-rerank.mjs:125-132` | Digest | resolved | The two arms, which run through `:133` |
| 8 | `score-outcome-rerank.mjs:127-133` | DeepSeek | resolved | The two arms |
| 9 | `score-outcome-rerank.mjs:149-150` | Synthesis | resolved | Flip rule |
| 10 | `score-outcome-rerank.mjs:159` | Synthesis | resolved | Runs on import. A grep found no export |
| 11 | `ambiguity.ts:7-8` | Digest, MiMo | resolved | Both margins 0.05 |
| 12 | `ambiguity.ts:22-36` | DeepSeek | resolved | Cluster over passing recommendations |
| 13 | `ambiguity.ts:44-58` | MiMo | resolved | `ambiguousWith` |
| 14 | `fusion.ts:69`, `:111-114` | Seam map | resolved | Opt-in flag values, default false |
| 15 | `fusion.ts:785-787` | DeepSeek | resolved | `passes_threshold` |
| 16 | `fusion.ts:789` | Synthesis | resolved | Ambiguity applied after the threshold |
| 17 | `types.ts:43`, `projection.ts:49` | Synthesis | resolved | Skill `description` |
| 18 | `scorer-eval-baseline.json:3-4`, `:8-12`, `:14-35` | Digest, MiMo (`:25-35`) | resolved | Baselines and pinned env |
| 19 | `scorer-eval-baseline.json:5-7` | Synthesis | resolved | Pinned corpus hashes, all three matched by sha256 |
| 20 | `capture-scorer-eval-baseline.mjs:70-76`, `:91-99` | Synthesis | resolved | Abstention counted correct and counted as unknown |
| 21 | Corpus rows 195, 70 and 24 | Digest | resolved | Counted. Gold-none 18, 6 and 5. Held-out half 88 |
| 22 | `derive-ambiguity-slice.mjs:35` | MiMo | resolved | tau 0.03 |
| 23 | `benchmark-stability.cjs:20-28` | MiMo-08, digest (`:24-25`) | resolved | 3 replays, `1 - stddev/mean`, warning under 0.95 |
| 24 | `user-prompt-submit.ts:22-24` | DeepSeek | resolved | 2500 ms child, 300 ms margin |
| 25 | `user-prompt-submit.ts:105-122` | DeepSeek | resolved | 2200 ms default, SIGKILL, `{}`, continuing to `:125` |
| 26 | `lane-registry.ts:21-29`, `:33-38` | DeepSeek, digest (`:27`, `:38`) | resolved | Shadow lane pattern |
| 27 | `shadow-sink.ts:86-89`, `:151-155` | DeepSeek, digest | resolved | Opt-in sink |
| 28 | MiMo-02: an abstention arm targeting the 13 unknowns and 5 false fires (`scorer-eval-baseline.json:19-24`) | MiMo-02 | failed | The lines resolve, but the content the claim needs is absent: the 13 unknowns are correct abstentions |
| 29 | Grok-02: the rerank eval as H5 | Grok-02 | drifted | It is H2. H5 is the shadow sink |
| 30 | `hub-router.json:5-14` | Grok (`:11`) | resolved | One mode, bundle unreachable |
| 31 | `score-model-variant.cjs:20-21` | Digest, MiMo | resolved | Default `mock` |
| 32 | `score-model-variant.cjs:58` | Synthesis | resolved | D4 weight 0.15 |
| 33 | `score-model-variant.cjs:207-226` | DeepSeek, MiMo, Grok | resolved | `buildGraderFn`, with `noop` returning 1.0 |
| 34 | `score-model-variant.cjs:211` | MiMo-01, DeepSeek-08 | resolved | Non-`llm` kinds become `mock` |
| 35 | `score-model-variant.cjs:222-224` | DeepSeek, MiMo | resolved | Failure returns 0.0 |
| 36 | `score-model-variant.cjs:284`, `:300` | Synthesis | resolved | Det-check recorded, D4 from the grader |
| 37 | `run-benchmark.cjs:16-17` | Digest | resolved | Different-family grader |
| 38 | `run-benchmark.cjs:571` | Synthesis | resolved | Scorers `pattern` and `5dim` only |
| 39 | `run-benchmark.cjs:577` | DeepSeek, MiMo | resolved | Grader default `noop`, never validated |
| 40 | `run-benchmark.cjs:582` | DeepSeek, digest | resolved | Usage line |
| 41 | `run-benchmark.cjs:614-621` | DeepSeek | resolved | Family-collision refusal, exit 2, `llm` only |
| 42 | `grader/harness.cjs:8-10`, `:43-44` | Digest | resolved | Claude only, `claude-sonnet-4-5`, 120 s |
| 43 | `grader/dispute.cjs:12-19` | Digest | resolved | Triggers described. Constants at `:35-37` |
| 44 | `.skilled/commands/deep/model-benchmark.md:111` | DeepSeek | resolved | Documents the grader values `noop`, `mock` and `llm` |
| 45 | `reviewer-scorer.cjs:11` | Synthesis | resolved | Three verdicts |
| 46 | `reviewer-scorer.cjs:117-123` | Synthesis | resolved | `extractVerdict` |
| 47 | `reviewer-scorer.cjs:155-167` | MiMo-08 | resolved | `classifyWithGrader`, `llm` only |
| 48 | `reviewer-scorer.cjs:169-171` | Synthesis | resolved | The grader runs only after a regex miss |
| 49 | `reviewer-scorer.cjs:190-192` | Synthesis | resolved | A recorded output replaces dispatch |
| 50 | `reviewer-scorer.cjs:231-236` | Synthesis | resolved | D4 flags `llm` use, D5 flags extraction |
| 51 | `reviewer-scorer.cjs:273-292` | Synthesis | resolved | Env gate, usage, default `noop` |
| 52 | `deep-model-benchmark-auto.yaml:206`, `deep-model-benchmark-confirm.yaml:228` | Synthesis | resolved | The only callers |
| 53 | `reviewer-regression.json` scoring note | MiMo-08 | resolved | "NOT run-benchmark.cjs --scorer pattern/5dim" |
| 54 | `reviewer-schema.md:20`, `:59-66` | Digest H9 | resolved | Fields and hidden cases |
| 55 | Digest H9: "a three-way `jev choice` target with gold already written" | Digest | failed | Content absent: 8 cases, all `fail` |
| 56 | `reviewer-schema.md:74-76`, `:82-90` | Synthesis | resolved | Recorded replay, verdict contract, `llm` fallback |
| 57 | Regex replay over the 8 recorded outputs | Synthesis | resolved | 8 of 8 parse to `fail` |
| 58 | DeepSeek-01 and MiMo-01: the reviewer fixtures as D4's oracle | DeepSeek, MiMo | failed | The link is absent: the profile routes to the reviewer scorer, which `run-benchmark.cjs:571` does not offer |
| 59 | DeepSeek-08 Harness B command | DeepSeek-08, DeepSeek-10 | failed | The profile disowns 5dim, and `--grader jev` becomes `mock` |
| 60 | `reply-harness/README.md:3`, `:11-12`, `:20` | Digest, MiMo | resolved | No model call, blind and compare, judge outside the scripts |
| 61 | `completion-evidence-sentinel.cjs:60-64` | MiMo | resolved | Duplicated pattern with `occurred` and `happened` |
| 62 | `completion-evidence-sentinel.cjs:70` | MiMo | resolved | 400-character tail |
| 63 | `completion-evidence-sentinel.cjs:84` | Synthesis | resolved | Kill switch |
| 64 | `completion-evidence-sentinel.cjs:90-94` | DeepSeek | resolved | 1200 ms, and the OpenCode spawn blocks the plugin host |
| 65 | `completion-evidence-sentinel.cjs:113-119` | DeepSeek | resolved | `detectCompletionClaim` |
| 66 | `hooks/claude/completion-evidence-stop.cjs:15-21` | Synthesis | resolved | Never blocks, fails open |
| 67 | `.claude/settings.json:174-176` | Synthesis | resolved | Stop hook 10 s, async |
| 68 | `opencode-goal.js:49` | DeepSeek | resolved | 30 s verifier timeout |
| 69 | `opencode-goal.js:71-72`, `:78` | DeepSeek (`:72`) | resolved | Env names, default `heuristic` |
| 70 | `opencode-goal.js:134` | DeepSeek | resolved | Mode set |
| 71 | `opencode-goal.js:135` | Synthesis | resolved | Blocking pattern |
| 72 | `opencode-goal.js:179` | Synthesis | resolved | Verdict set |
| 73 | `opencode-goal.js:226-234` | Synthesis | resolved | Unknown mode falls back, `llm` dispatch |
| 74 | `opencode-goal.js:2197-2230` | Synthesis | resolved | Binary heuristic |
| 75 | `opencode-goal.js:2232-2240` | Synthesis | resolved | `llm` prompt vocabulary |
| 76 | `opencode-goal.js:2335` | Synthesis | resolved | Invalid verdict becomes `not_met` |
| 77 | `opencode-goal.js:2368-2380` | Synthesis | resolved | Timeout gives `not_met`, error gives `blocked` |
| 78 | `opencode-goal.js:3359-3385` | Synthesis | resolved | `__test` exports |
| 79 | `goal-plugin.md:52-53` | Synthesis | resolved | Verify on idle, `llm` opt-in |
| 80 | `goal-core.cjs:596-620` | MiMo (`:586-620`) | resolved | Shared heuristic |
| 81 | `goal-core.cjs:603-604` | Grok (`:603`), MiMo (`:603-605`) | resolved | Blocking language forces `not-met` |
| 82 | `goal-core.cjs:42`, `:148-150` | Synthesis | resolved | Disable switch |
| 83 | `goal-core.test.cjs:631-651` | Digest | resolved | Three verifier tests starting at `:632`, `:641` and `:649` |
| 84 | `goal-context.ts:221-244` | Synthesis | resolved | `turn_end` heuristic nudge |
| 85 | `cursor/goal-inject.mjs:11` | DeepSeek | resolved | No verify or continue |
| 86 | `goal/README.md:34`, `:46`, `:77-82` | DeepSeek, MiMo (`:77`) | resolved | Runtime table |
| 87 | `shared.ts:12`, `:14`, `:16` | DeepSeek, MiMo | resolved | 1800 ms, 4000 tokens |
| 88 | `compact-inject.ts:1-8` | Synthesis | resolved | Precompute, not injected on PreCompact |
| 89 | `compact-inject.ts:353-357` | DeepSeek | resolved | Warning above 1500 ms |
| 90 | `compact-inject.ts:404-405`, `:446-448`, `:494` | Synthesis | resolved | Prime, budget skip, deadline |
| 91 | `.claude/settings.json:221-222` | Seam map | resolved | PreCompact 3 s |
| 92 | `hook-precompact.vitest.ts:29-60` | MiMo | resolved | Mechanics only |
| 93 | `convergence.cjs:471-472`, `:480-486` | DeepSeek (`:480-481`), Grok | resolved | Agreement blocker, STOP pending agreement |
| 94 | `convergence.cjs:506-549`, `:618-631`, `:805-808` | DeepSeek | resolved | Novelty corroboration guard |
| 95 | `stopping-clock-shadow.ts:10-19` | DeepSeek (`:11-19`), seam map (`:10-20`) | resolved | Frozen `legacy-convergence` authority |
| 96 | `reduce-state.cjs:965-989` | Digest (`:965-985`) | resolved | Flat-ratio warning |
| 97 | `convergence-signals.md:41-47`, `:55-73` | Digest, MiMo | resolved | Weights and rubric |
| 98 | `deep-research-confirm.yaml:1316-1345` | Synthesis, for the step MiMo named | resolved | Post-iteration gate |
| 99 | MiMo-04: 181 replay-eligible lineages | MiMo-04 | drifted | 181 includes this run's 3. The archived corpus is 178 |
| 100 | `completion-criteria.md:48`, `:61-63`, `:75` | MiMo, DeepSeek, Grok (`:62`) | resolved | Report sections, severity, `riskScore`, replay, verdict |
| 101 | `blinded-adjudication/README.md:12`, `:26`, `:43` | Digest, DeepSeek | resolved | Additive-dark, adapters, tests |
| 102 | `mode-adapters.ts:59`, `:63-72` | DeepSeek (`:63`) | resolved | Shadow-only posture |
| 103 | MiMo-05: registry `transitions` as P0-survival gold | MiMo-05 | failed | Content absent: 409 registries, 45 P0-born findings, 0 downgraded |
| 104 | `compiled-route.cjs:25-47` | DeepSeek | resolved | One stdout shape, legacy fallback at `:47` |
| 105 | `router.cjs:198-216` | Seam map | drifted | The clarify block is `:199-218` |
| 106 | `resolve.cjs:56-62` | Seam map | resolved | Tri-state flag, parse at `:54-64` |
| 107 | Canary counts: 62 route, 10 defer, 9 reject, 3 clarify | Digest | resolved | Counted over 84 cases in 7 hubs |
| 108 | Digest H7: the cli-jev canary set has 11 cases | Digest | drifted | 7 cases: 4 route, 2 defer and 1 reject |
| 109 | `alignment-validator.ts:73-75`, `:503-521` | DeepSeek | resolved | 70 and 50, in the `spec-folder` copy |
| 110 | `fanout-merge.cjs:341`, `:348-351` | DeepSeek, Grok | resolved | 0.15 title overlap |
| 111 | `dispatch-guard.cjs:80-81`, `:124-132`, `:526` | DeepSeek (`:526-579`), Grok | resolved | Warn at 2, block at 3, config path on disk |
| 112 | `dispatch-rule-checks.mjs:107-117`, `:258-273` | DeepSeek, seam map | resolved | Jev lint rules |
| 113 | `spec-gate-classify.ts:22-29` | Grok | resolved | Sanitizer |
| 114 | `next-focus-selection.ts:351-365` | DeepSeek | resolved | Shadow comparator |
| 115 | `.claude/settings.json` hook matchers | Grok | resolved | No fetch matcher |
| 116 | `cli-usage/SKILL.md:107-114` | Seam map, DeepSeek (`:113-114`) | resolved | A `choice` is never permission |
| 117 | `cli-usage/SKILL.md:162-174` | Seam map, DeepSeek | resolved | Output contract and exit table |
| 118 | `cli-usage/SKILL.md:76-79`, `:209`, `:219` | MiMo | resolved | Private state, send the minimum, no judgment for a repository fact |
| 119 | `cli-usage/SKILL.md:266-268` | MiMo | resolved | Record provider and model |
| 120 | `cli-usage/SKILL.md:289-300` | Seam map | resolved | Not an executor, the caller owns the threshold |
| 121 | `providers-and-models.md:27-34`, `:60-63`, `:145-148`, `:166` | Seam map | resolved | Providers, exit 3, billed `auth test`, no latency figure |
| 122 | `cli-reference.md:28`, `:157-159` | Seam map | resolved | `jev 0.6.2`, errors on stderr |
| 123 | `integration-patterns.md:43-44`, `:136-141` | Seam map | resolved | Caller owns the threshold, anti-patterns |
| 124 | `jev_cli/__init__.py:288` | Seam map | resolved | 60 s client timeout |
| 125 | npm `jevctl` `errors.ts:1-9` | Grok, digest | resolved | Exit table |
| 126 | npm `jevctl` `core/screen.ts:56` | Grok | resolved | A missing answer becomes 0 |
| 127 | npm `jevctl` `recipes.md:5-11` | MiMo | resolved | `jev verify` with `--fail-on` |
| 128 | npm `jevctl` `fast-jev.ts:75`, `:277-285` | Grok | resolved | Compaction on unless `false`, fallback |
| 129 | npm `jevctl` `package.json` | Seam map | resolved | 0.2.3, bin `jev` |
| 130 | claude-jev `README.md:30-31` | Digest | resolved | Vendor claim: $0.042 per million, about 150 ms |
| 131 | claude-jev `README.md:85-93` | Grok | resolved | Planted false positive kept at 0.57 |
| 132 | claude-jev `question.ts:76-81` | Grok (`:76`) | resolved | `noulOf` throws |
| 133 | claude-jev `hypotheses.ts:17-20`, `:41-45` | Grok | resolved | Weights and `next_check` |
| 134 | claude-jev `review.ts:21-28`, `:91-100` | Grok | resolved | Thresholds and verdicts in code |
| 135 | pi-jev `README.md:35-37`, `:85-87` | MiMo, Grok | resolved | Off by default, egress, cache |
| 136 | pi-jev `index.ts:26-32`, `:184`, `:199-207`, `context.ts:118-126` | Grok, DeepSeek | resolved | Defaults, missing key, pause, keep on undefined |
| 137 | jev-review `workflow.ts:48-55` | Grok (`:52-55`) | resolved | Whole-run abort |
| 138 | supercov `properties.json:38-42` | Grok | resolved | `duplicated_logic` 50.8% |
| 139 | supercov `quality.md:182-189`, `:191-196`, `:198-203` | MiMo | resolved | Vendor-measured cost, estimate, cache |
| 140 | Hermes post `:18-27` | Digest, MiMo | resolved | User report: shadow mode, 5.6 s, $0.002 |
| 141 | Hermes post `:112-120` | Synthesis | resolved | Commenter critique |
| 142 | Pi post `:231`, `:304`, `:464-466`, `:1121` | Digest, Grok | resolved | User reports |
| 143 | `ideas from michel kerkmeester.md:1-13` | Brief | resolved | Four ideas, each opt-in with a key |
| 144 | `benchmark-stability.cjs:102-108` | Council, host | resolved | 1 minus the sample sd over the absolute mean, floored at 0. A coin-flip judge can pass it (derived), so R1 and R2 now use a per-row flip rate |
| 145 | `score-outcome-rerank.mjs:85-93` | Council | resolved | Exact id match in the reciprocal rank and right@k metrics |
| 146 | `score-outcome-rerank.mjs:17-23`, `:118-123`, `:150`, `:159` | Council, Synthesis | resolved | Read-only header, the lexical half split, the fold trained on the train half (`:123`), the flip rule and run-on-import |
| 147 | `capture-scorer-eval-baseline.mjs:35-46`, `:43`, `:70-76` | Council | resolved | Pinned env, `VITEST=true`, alias-aware matching |
| 148 | `derive-ambiguity-slice.mjs:51`, `:62-66` | Synthesis | resolved | `VITEST=true`. The slice margin is a raw score difference over all candidates |
| 149 | 002 `plan.md:63` | Council | resolved | The env list omits `VITEST` |
| 150 | `ambiguity.ts:7-8`, `:22-36`, `:44-58` | Council, Synthesis | resolved | 0.05 margins on score or confidence and no cluster size cap, so the first synthesis's "2 to 4 keys" was corrected (K3) |
| 151 | `fusion.ts:749-776`, `:789` | Synthesis | resolved | Ranking sorts on an adjusted score, then `applyAmbiguity` runs |
| 152 | The frozen ambiguity slice, 24 margins | seat-001 | count | 11 negative and 2 zero, counted today. It decides disagreement D4 |
| 153 | `labeled-prompts.jsonl`, `holdout-prompts.jsonl`, `scorer-eval-baseline.json:14-35` | Council, Synthesis | count | 195 labeled rows, 18 gold-none, 177 skill-firing. 64 skill-firing holdout rows. `gate3_triggers` 127 `yes` and 68 `no`. Baselines 53/70, 18/24 and 152/195 |
| 154 | `run-benchmark.cjs:577`, `score-model-variant.cjs:21`, `:208-211` | Synthesis section 3, council | resolved, fact corrected | The runner's default grader is `noop`. `mock` is the direct-scorer default and the fallback for unknown kinds (K1) |
| 155 | `opencode-goal.js:42`, `:382-389`, `:414-420`, `:463-475`, `:1107`, `:2199`, `:2205`, `:2209-2211`, `:2308-2317` | Council (seat-001), host | resolved | The clamp path, host-verified. The council's `:388` and `:475` sit inside these ranges |
| 156 | `goal-core.cjs:290-297`, `:334-340`, `:596-620` | Council, host | resolved | The same clamp, and `met`, `not-met` and `unclear`. The truncation check is `:606`, and the council's `:607` is its return |
| 157 | `goal-context.ts:221-244`, `:233-238` | Synthesis | resolved | Pi sends a hidden nudge on any verdict other than `met`, `unclear` included |
| 158 | `opencode-goal.js:36-37`, `:134-135`, `:179`, `:226-234`, `:2335`, `:2368-2380` | Synthesis | resolved | Default state directory, modes, blocking pattern, verdicts, silent fallback, invalid verdict, timeout at `:2375` and error to `blocked` at `:2380` |
| 159 | `opencode-goal.js:835-839`, `:2988-2989`, `:3359-3385` | Synthesis | resolved | Stderr gated on a debug variable, the `show` fields and a `__test` export list that omits the heuristic |
| 160 | `opencode-goal.js:474` | Council (seat-001, "likely"), Synthesis | confirmed by running a copy | `SERVICE_TOKEN=` and `TYPESAFE_API_KEY=` values pass unchanged. `token=` and `api_key:` are redacted. The real module was not unit-tested (question 17) |
| 161 | `secret-scrubber.ts:14-16`, `:124-130` | Council (seat-003), Synthesis | resolved, and confirmed by running a copy of `:128` | Fail-closed on internal errors, not on coverage. The same leading `\b` gap |
| 162 | Claude Code `goal_status` records | Council (750 in 21 sessions, council-reported), Synthesis | count | 755 in 22 files, 61 with `met` true, 609 with a `reason` and none with evidence text. The council's 750 is not confirmed as stated. Today's 755 is consistent with sessions still running |
| 163 | The last assistant text before each native verdict | Synthesis | count | Paired for 753 of 755. 414 exceed 1,200 characters after whitespace folding (55.0%), p50 1,586 and p90 3,794. That the pairing is what the judge saw is inferred |
| 164 | `.opencode/skills/.state/goal/` in the main checkout | Synthesis | count | 5 active records, all `runtime: hermes` and `not_evaluated`, plus one archive entry |
| 165 | `completion-evidence-sentinel.cjs:60-64`, `:70`, `:84`, `:90-94`, `:113-119` | Synthesis | resolved | The pattern kept identical to a hook copy, the 400-character tail, the kill switch, the OpenCode spawn comment and the 1200 ms check |
| 166 | `completion-evidence-stop.cjs:132-139`, `.claude/settings.json:162-177` | Council (seat-002), Synthesis | resolved | The Claude adapter logs the advisory and approves. Both Stop hooks are async at 10 s, the sentinel's at `:172-177` |
| 167 | `.claude/settings.json:204-211` | Council | resolved | The Bash PostToolUse matcher runs a dispatch audit at 5 s (row 38) |
| 168 | `.claude/settings.json:38` | Council, host | resolved | `CLAUDE_CODE_ENABLE_FUNCTION_HOOKS` is `"1"`, host-verified. rg finds no other reference outside `specs/` and no repository function hook |
| 169 | `.claude/settings.json:215-222`, `shared.ts:12`, `compact-inject.ts:353-354` | Synthesis | resolved | The PreCompact command hook at 3 s, the 1800 ms budget and the 1500 ms warning |
| 170 | npm `jevctl` `fast-jev.ts:1-5`, `:26-31`, `:75`, `:237-253`, `:269-287`, `:289-303` | Council, Synthesis | resolved | Adapted from fast-jev-compaction. Defaults with 60% auto-compact. On unless disabled. The key from options, env or settings `env`. The `session.compact` handler with fallback at `:277-285` |
| 171 | npm `jevctl` `src/vendor/compaction/compact.ts:20-25`, `state.ts:304-306`, `plugin/hooks/README.md:47`, `CHANGELOG.md:59` | Council, Synthesis | resolved | Keep threshold 0.5, the newest 6 pinned, the 25,000-token state budget, the throw, the fallback and the env flag |
| 172 | npm `jevctl` `claude-code.d.ts:3024-3026`, `:3311-3322`, `:3799-3818`, `:7285`, `:10177-10178` | Synthesis | resolved | An overrunning hook is skipped and core runs. `{ messages }` replaces the summary. The `precompute` trigger. Ten seconds of real time in test-clock text |
| 173 | `compactMetadata` records in this project's Claude Code transcripts | Council (204), orchestrator (206), Synthesis | count | 208 today: 205 auto and 3 manual, none under 60 s, p50 104.4 s, p90 143.3 s, max 280.3 s and 380.1 minutes in total. `preTokens` min 450,019 |
| 174 | `compact-inject.ts:1-8`, `:117-178`, `:149-155`, `:284`, `:404-405`, `:446-448`, `shared.ts:14` | Council, Synthesis | resolved | Brief precompute, the 20-path cap, the JavaScript-only noise list, the merge builder, the cached prime, skipped optional work and the 4000-token budget. The council's `:117-176` sits inside `:117-178` |
| 175 | `next-focus-selection.ts:351-365`, `next-focus/index.ts:13`, `next-focus.vitest.ts:25`, `:474` | Council host, Synthesis | resolved | rg: the definition, a re-export and one test. No runtime caller |
| 176 | `check-goal.cjs:44-49` | Council | resolved | Four structural checks |
| 177 | `sk-create-goal/SKILL.md:121-122`, `create-goal-auto.yaml:221` | Council | resolved | The self-contained rule, and `/create:goal` runs check-goal |
| 178 | `goal-set-string-playbook.md:55-57` | Council | resolved | The evaluator sees the stored string only |
| 179 | Parent `goal.md:107` | Council | drifted | The parent goal was rewritten at `6c44ac6a26`. The criterion that depends on another file now sits at `goal.md:89` |
| 180 | `recommend-level.sh:36-47` | Council | resolved | Risk flags add points to the level. Row 22 and disagreement 7 corrected (K12) |
| 181 | 002 `spec.md:112`, `:131`, 003 `spec.md:121` | Council | resolved | The skip lines diverge |
| 182 | Pi post `:1121` | Synthesis section 3, row 7 | misattributed | meraGPT's "Decider 1". Its relation to Jev is UNKNOWN, so it is no longer cited against Jev (K2) |
| 183 | `git-preflight-advisory.mjs:113-119`, rg for `bayesian-scorer` | Council (seat-003), Synthesis | resolved | Git rule checks against a live repository context. The only import of `bayesian-scorer` is its test (`bayesian-scorer.vitest.ts:3`). seat-003's `:26-34` was not reopened |
| 184 | DeepSeek's lineage `findings-registry.json` | Synthesis | count | 8 of DeepSeek's 57 findings, before the merge (K18) |
| 185 | Parent `spec.md:90`, `cli-usage/SKILL.md:96-103` and the `jev auth status` exits | Host, Synthesis | resolved | The D5 gate. Host-verified: exit 0 for a stored or exported key, exit 3 with none, no key printed and no quota spent |
| 186 | `providers-and-models.md:145-148`, `cli-usage/SKILL.md:172` | Synthesis | resolved | `jev auth test` is billed. Exit 3 is a credential error |
| 187 | `user-prompt-submit.ts:22-24`, `:105-125` | Synthesis (rechecked) | resolved | In the system-spec-kit Claude wrapper: a 2500 ms child with a 300 ms margin, SIGKILL and `{}` on timeout or error. The advisor's own hook also defaults to 2500 ms (`system-skill-advisor/hooks/claude/user-prompt-submit.ts:115`) |
| 188 | The goal-criterion base rate | Council (seat-002 21 of 1,387, seat-003 7 of 25) | not reopened | Seat-reported. Disagreement D5 |
| 189 | 3.6% exact repeats, 109 of 225 forced configs, 238 advisory lines and 31 of 576 native reasons | Council seats | not reopened | Seat-reported and labeled so wherever used |
| 190 | fast-jev-compaction blog `:30-42`, `:64-68` | Council, Synthesis | resolved | A third-party account of the mechanism, and the key placed in the settings `env` |

**Tally.**

- Rows 1 to 143, the first synthesis: 143 checked, 134 resolved, 4 drifted (rows 29, 99, 105 and 108) and 5 failed (rows 28, 55, 58, 59 and 103).
- Rows 144 to 190, this re-synthesis: 47 checked. 35 resolved (row 154 with a fact corrected), 7 counts rerun, 1 confirmed by running a regex copy, 1 drifted (row 179), 1 misattributed (row 182) and 2 not reopened (rows 188 and 189). None failed.
- Row 142's Pi post `:1121` still resolves to its line. What changed is the reading, recorded at row 182.

---

## 15. Evidence Quality and Caveats

**Independence.** Only wave 1 agreement counts as independent. Grok could see only DeepSeek's early iterations and never saw MiMo, so Grok's positions after iteration 4 lean on DeepSeek alone. DeepSeek's and MiMo's later positions lean on Grok's finished run.

**The council was one model family.** Its three seats ran on Claude Opus 5.5 at max effort, the same family as the first synthesis and as this re-synthesis. Agreement among the seats, or between a seat and either synthesis, is one model agreeing with itself. It counts here only where it rests on code or a count reopened in this re-synthesis. Every adopted change above carries that evidence, and the rest is labeled seat- or council-reported. Round 2's four non-Claude lineages are the first cross-family check (question 30).

**D5 postdates round 1.** The key gate and opt-in rule (section 9) was decided after the three lineages and the first synthesis finished. No lineage designed for it. It changes defaults, switches and skip lines, not deadlines, so no drop that rests on a hook deadline reopens. The records in section 11 were rewritten to D5 here, not by any lineage.

**Timestamps.** Not used as evidence of anything, and order here comes from iteration numbers. The runner flagged Grok's state log: 11 of 13 records carry timestamps after the run window, from 16:20:00Z to 17:35:00Z against a window that ended at 16:17:02.808Z, and 1 record carries none (`research/orchestration-summary.json`).

**Self-reported novelty.** The newInfoRatio series are self-report and are kept here as telemetry only. Convergence mode was off, so none of them stopped a lineage.

- DeepSeek: `[0.85, 0.80, 0.75, 0.72, 0.70, 0.68, 0.62, 0.66, 0.64, 0.58]`
- MiMo: `[0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.5, 0.7, 0.7, 0.5]`
- Grok: `[1.0, 0.72, 0.70, 0.64, 0.58, 0.55, 0.52, 0.46, 0.40, 0.34]`

**Two packages.** Every recommendation uses the Python `jev-cli` 0.6.2, and none depends on npm `jevctl` 0.2.3 behavior at run time. The lineage claims about `screen`, `verify`, `--fail-on`, `runScreen` and default-on compaction hold for npm `jevctl` only. R19's later arm would port an npm `jevctl` procedure to the Python `jev-cli`, because D5's version check refuses the npm package. Each lineage named the package correctly wherever I checked.

**Vendor claims, user reports and third-party accounts, none reproduced here.**

- $0.042 per million input tokens and about 150 ms per answer (claude-jev `README.md:30-31`, vendor claim).
- About a cent per megabyte of source (supercov `quality.md:182-189`, vendor claim).
- A planted false positive kept at 0.57 (claude-jev `README.md:85-93`, vendor's own run).
- 5.6 s and $0.002 per compaction over three runs (Hermes post `:26-27`, user report).
- Context moving a harmless command from 0.22 to 0.58 (Pi post `:1121`, third-party report about meraGPT's "Decider 1", not shown to be Jev).
- `duplicated_logic` at 50.8% (supercov `properties.json:42`, vendor-published).
- jevcache.sh's install method and key variable, and classifier.dev's keyless free tier (vendor pages read by the council host, council-reported, not reopened here).
- The fast-jev-compaction mechanism and its key placement (blog `:30-42`, `:64-68`, third-party account).

**Council- and seat-reported figures, not reopened.** The council's 750 Claude Code goal evaluations (today's count is 755, row 162). 3.6% exact prompt repeats. 109 of 225 configs forcing max iterations. 238 completion advisories in 30 days, 512 of 567 about a missing `implementation-summary.md`. 31 of 576 native reasons blaming an unverifiable criterion. The criteria base rates 21 of 1,387 and 7 of 25. 44 P0-born findings by one counting method. Claude Code versions 2.1.280 to 2.1.283. Each is labeled where it is used.

**Containment advisories.** There are three, one per lineage, from the runner's `containment_violation` events (`research/observability-events.jsonl`). Each lineage's quarantine manifest (`lineages/<label>/containment/quarantine/1/manifest.json`) lists exactly one path, `specs/cli-jev/003-cli-jev-workflow-integration/001-deep-research/scratch/synthesis-brief.md`. That file is the orchestrator's post-launch edit of this brief, not a lineage write. No advisory names any other file, so on the runner's record no lineage wrote outside its directory. At the first synthesis `git status` in the worktree was clean at HEAD `d396d3cfc2`, the commit that recorded the fan-out after launch HEAD `2bbefcbdb7`. At this re-synthesis it was clean at HEAD `6c44ac6a26`.

**Other run events.**

- The runner raised a `stall_detected` warning for MiMo early in its run, after 300 s of quiet. MiMo still finished all 10 iterations.
- Both Pi lineages' `logs/fanout-lineage.err` hold one identical advisor-hook event: `fail_open` after 2504 ms, "CLI_RETRYABLE_UNAVAILABLE exit 75: CLI fallback timed out". It is one observation of the advisor's own hook at its deadline, not a measurement. Grok's error log is empty.
- DeepSeek's `research.md` section 9 says "the worktree carried unrelated uncommitted edits". That echoes the brief's wording before the orchestrator corrected it and is superseded: the worktree was clean at launch apart from `research/`.
- Grok's `research.md` says MiMo has no iteration files. That was true when Grok read and is superseded.

**The merge gap.**

- The two merged registries are byte-identical and hold 85 key findings (MiMo 55, Grok 22, DeepSeek 8). The merge metrics read `iterationsCompleted` 0 and `convergenceScore` 0, and `resource-map.md` lists 0 references beside 30 delta sources. None of these numbers is used as evidence here.
- DeepSeek's own lineage registry already holds 8 of its 57 findings (counted today, row 184), so the loss happened in the per-lineage reduction, before the merge step. DeepSeek's and MiMo's state records carry only `findingsCount`, which is consistent with the host's `synthesis_incomplete` event in section 17. Why the reduction kept 8 is not traced further here.
- Both syntheses read DeepSeek's findings from its iteration markdown, which limits the damage. Whether a lost finding would change a verdict is UNKNOWN (question 26).

**Limits of this re-synthesis.**

- The agreement classes rest on each iteration's own sibling-check section, as in the first synthesis.
- Five calls are my judgment and marked so: the D4 ruling on the tau 0.03 veto, R19's census at build-now over seat-001's later, R2's zero-call slice at next, R1's `underpowered` trigger at fewer than 5 movable rows and the `unstable` rule for three-way splits.
- Not run: any `jev` call of either package, any test suite, `validate.sh`, `generate-context.js`, the H1 ratchet, the rerank eval and R1's census. The H2 baseline, the movable-row count and every latency figure stay UNKNOWN.
- Run, read-only: the counts in rows 152, 153, 162 to 164, 173 and 184, the two regex copies (rows 160 and 161), rg searches (rows 168, 175 and 183) and line reads of every cited range in rows 144 to 190 except those marked not reopened.
- The transcript counts cover this project's Claude Code transcripts only, and no transcript text is quoted.
- The sentinel's advisory log was not read, because it exists only in the main checkout.

**Adjacent defects, reported and not fixed.**

- `run-benchmark.cjs:577` never validates `--grader`, and `score-model-variant.cjs:211` turns any kind other than `noop` or `llm` into `mock`. A requested `jev` grader today yields mock D4 scores with no warning.
- `opencode-goal.js:226-229` turns an unknown `OPENCODE_GOAL_VERIFIER` value into `heuristic` with no notice. This may be intended, but an operator who sets `jev` today gets no signal.
- The clamp defect in `opencode-goal.js` and `goal-core.cjs` (section 5 item 8), which belongs to the plugin and goal-core owners.
- The underscore gap in the plugin's keyword rule and the scrubber's assignment rule (section 5 item 11).
- The brief's extractor noise (section 6 item 5).
- 002's env list without `VITEST` (002 `plan.md:63`) and the divergent skip lines (002 `spec.md:112`, `:131`, 003 `spec.md:121`).
- Parent `goal.md:89`, a criterion that depends on another file.
- `compareNextFocusShadow`, exported and tested with no runtime caller.
- This document's own errors, corrected here: K1 to K4, K12 and K15 in the Changes section.

---

## 16. References

**Research inputs** (under `specs/cli-jev/003-cli-jev-workflow-integration/`)

- `001-deep-research/spec.md` and `001-deep-research/scratch/synthesis-brief.md`
- `001-deep-research/context/repo-rules-digest.md`, `seam-map.md`, `jev-material-digest.md`, `measurement-digest.md` and `research-angles.md`
- `context/ideas from michel kerkmeester.md`
- `001-deep-research/research/lineages/{deepseek,mimo,grok}/`: `iterations/iteration-001.md` to `iteration-010.md`, `research.md`, `deep-research-state.jsonl`, `findings-registry.json`, `deep-research-strategy.md`, `logs/` and `containment/quarantine/1/manifest.json`
- `001-deep-research/research/`: `findings-registry.json`, `deep-research-findings-registry.json`, `fanout-attribution.md`, `resource-map.md`, `orchestration-summary.json`, `observability-events.jsonl` and `deep-research-config.json`
- `001-deep-research/ai-council/`: `council-report.md`, `proposed-resynthesis.md`, `deliberations/round-001.md` and the three seat files
- `spec.md` and `goal.md` of the parent, `002-advisor-jev-tiebreak-arm/spec.md` and `plan.md`, `003-goal-verifier-jev-shadow/spec.md` and `004-deep-research-expansion/spec.md`
- The first synthesis, `git show 021437ceda:specs/cli-jev/003-cli-jev-workflow-integration/001-deep-research/research/research.md`

**Skill advisor** (`.skilled/skills/system-skill-advisor/`)

- `runtime/scripts/routing-accuracy/`: `score-outcome-rerank.mjs`, `scorer-eval-baseline.json`, `capture-scorer-eval-baseline.mjs`, `derive-ambiguity-slice.mjs`, `labeled-prompts.jsonl`, `holdout-prompts.jsonl` and `ambiguity-prompts.jsonl`
- `runtime/lib/scorer/`: `ambiguity.ts`, `fusion.ts`, `lane-registry.ts`, `types.ts` and `projection.ts`
- `runtime/lib/shadow/shadow-sink.ts` and `hooks/claude/user-prompt-submit.ts`

**Model benchmark and deep loop** (`.skilled/skills/system-deep-loop/`)

- `deep-improvement/scripts/model-benchmark/`: `run-benchmark.cjs`, `lib/reviewer-scorer.cjs`, `scorer/score-model-variant.cjs`, `scorer/grader/harness.cjs` and `scorer/grader/dispute.cjs`
- `deep-improvement/scripts/agent-improvement/benchmark-stability.cjs`
- `deep-improvement/assets/model-benchmark/benchmark-profiles/reviewer-regression.json` and `benchmark-fixtures/reviewer-schema.md`, `reviewer-ac-coverage.json`, `reviewer-over-read.json`, `reviewer-softened-fail.json` and `reviewer-stale-verdict.json`
- `runtime/scripts/convergence.cjs` and `runtime/scripts/fanout-merge.cjs`
- `runtime/lib/stopping-clocks/stopping-clock-shadow.ts`, `runtime/lib/next-focus/next-focus-selection.ts`, `runtime/lib/next-focus/index.ts`, `runtime/tests/unit/next-focus.vitest.ts`, `runtime/tests/unit/bayesian-scorer.vitest.ts`, `runtime/lib/blinded-adjudication/README.md` and `runtime/lib/blinded-adjudication/mode-adapters.ts`
- `deep-research/scripts/reduce-state.cjs` and `deep-research/references/convergence/convergence-signals.md`
- `deep-review/references/protocol/completion-criteria.md`

**Spec-kit runtime** (`.skilled/skills/system-spec-kit/`)

- `runtime/hooks/claude/user-prompt-submit.ts`, `runtime/hooks/claude/compact-inject.ts`, `runtime/hooks/claude/shared.ts` and `runtime/hooks/claude/completion-evidence-stop.cjs`
- `runtime/lib/hooks/completion-evidence-sentinel.cjs`
- `runtime/tests/hook-precompact.vitest.ts`
- `runtime/cli/spec-folder/alignment-validator.ts` and `runtime/cli/spec/recommend-level.sh`
- `shared/parsing/secret-scrubber.ts`
- `references/workflows/goal-set-string-playbook.md`

**Goal hooks, plugin and authoring**

- `.skilled/plugins/opencode-goal.js`, which resolves to `.opencode/plugins/opencode-goal.js`
- `.skilled/hooks/goal/goal-plugin.md`, `.skilled/hooks/goal/README.md`, `.skilled/hooks/goal/lib/goal-core.cjs`, `.skilled/hooks/goal/lib/goal-core.test.cjs`, `.skilled/hooks/goal/pi/goal-context.ts` and `.skilled/hooks/goal/cursor/goal-inject.mjs`
- `.skilled/skills/sk-doc/sk-create-goal/SKILL.md` and `scripts/check-goal.cjs`, and `.skilled/commands/create/assets/create-goal-auto.yaml`

**Routing, guards and commands**

- `.skilled/bin/compiled-route.cjs`, `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/004-cli-external-orchestration/lib/router.cjs`, `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/resolve.cjs` and `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/*/fixtures/canary-cases.v1.json`
- `.skilled/hooks/task-dispatch/lib/dispatch-guard.cjs`, `.skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs` and `.skilled/hooks/spec-gate/pi/spec-gate-classify.ts`
- `.skilled/skills/sk-git/scripts/hooks/git-preflight-advisory.mjs`
- `.skilled/commands/deep/model-benchmark.md` and `.skilled/commands/deep/assets/deep-model-benchmark-auto.yaml`, `deep-model-benchmark-confirm.yaml` and `deep-research-confirm.yaml`
- `.skilled/skills/sk-communication/benchmark/reply-harness/README.md`
- `.claude/settings.json`

**cli-jev contract**

- `.skilled/skills/cli-jev/hub-router.json` and `.skilled/skills/cli-jev/SKILL.md`
- `.skilled/skills/cli-jev/cli-usage/SKILL.md` and `references/providers-and-models.md`, `references/cli-reference.md` and `references/integration-patterns.md`
- `specs/cli-jev/001-cli-jev-creation/context/jev-cli-main/src/jev_cli/__init__.py`

**Vendored material and posts** (under `specs/cli-jev/003-cli-jev-workflow-integration/context/`)

- `external repo's/claude-jev-main/`: `README.md`, `src/domain/question.ts`, `src/domain/catalog/review.ts` and `src/domain/catalog/hypotheses.ts`
- `external repo's/jev-cli-main/` (npm `jevctl`): `package.json`, `CHANGELOG.md`, `src/errors.ts`, `src/core/screen.ts`, `src/vendor/compaction/compact.ts`, `src/vendor/compaction/state.ts`, `docs/recipes.md`, `plugin/hooks/fast-jev.ts`, `plugin/hooks/README.md` and `plugin/hooks/types/claude-code.d.ts`
- `external repo's/pi-jev-context-main/`: `README.md`, `src/index.ts` and `src/context.ts`
- `external repo's/jev-review-main/src/review/workflow.ts`
- `external repo's/supercov-main/`: `docs/quality.md` and `crates/supercov-cli/src/quality/properties.json`
- `social posts/Reddit - Integrated the Jev context engine into Hermes.md`, `social posts/Reddit - I think i found the best use case for JEV and PI.md` and `social posts/Blog - Claude Code Compaction Without a Lossy Summary.md`
- fast-jev-compaction, <https://github.com/tamaratran/fast-jev-compaction>, named at npm `jevctl` `fast-jev.ts:2-3` and not fetched
- The jevcache.sh and classifier.dev vendor sites, read by the council host and not reopened here

**Local data, counts only and never quoted**

- This project's Claude Code transcripts (`compactMetadata` and `goal_status` records)
- `.opencode/skills/.state/goal/` in the main checkout

---

## 17. Convergence Report

The deep-research workflow appends the convergence report under this heading after this synthesis.

- Stop reason: maxIterationsReached
- Total iterations: 30 (deepseek 10, mimo 10, grok 10)
- Questions answered: 7 / 7
- Remaining questions: none of RQ1 to RQ7; section 12's open questions stay open
- Last 3 iteration summaries: deepseek-10, "Smallest-first build order, engineering view" (newInfoRatio 0.58, self-reported); mimo-10, "Smallest-first build order, measurement view" (0.5); grok-10, "The one slice, and what a loss kills" (0.34)
- Convergence threshold: 0.05, unused, because convergence mode was off and each lineage was forced to 10 iterations
- Divergence summary: no divergent pivots recorded
- Segment transitions, wave scores, and checkpoint metrics are experimental and omitted from the live report.
- Synthesis event: `synthesis_incomplete` (ledger sequence 1), failing invariant `count_only_state_findings_not_reconstructed`. The DeepSeek and MiMo state records carry only `findingsCount`, 112 in total, and the merge rebuilt 85 findings from iteration markdown: mimo 55 of 55, grok 22 of 22, deepseek 8 of 57. This synthesis read all 30 iteration files directly (brief, input 4), so its ranking does not rest on the merged registry. Why the merge parser missed DeepSeek's findings is not traced here; it is recorded, not fixed.
