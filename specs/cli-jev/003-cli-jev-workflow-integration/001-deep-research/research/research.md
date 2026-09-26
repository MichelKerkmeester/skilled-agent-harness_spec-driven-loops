---
title: "Deep Research: Jev Typed Judgments Across .skilled Skills and Workflows [cli-jev/003-cli-jev-workflow-integration/001-deep-research/research]"
description: "Three-lineage synthesis of where Python jev-cli typed judgments earn a measured, opt-in place in .skilled. One build-now offline advisor tie-break arm, one next goal-verifier measurement, 16 later items and 32 dropped ideas."
trigger_phrases:
  - "jev workflow integration synthesis"
  - "jev advisor tie-break arm"
  - "jev goal verifier shadow"
  - "jev what not to build"
importance_tier: "important"
contextType: "research"
---

# Deep Research: Jev Typed Judgments Across .skilled Skills and Workflows

Merged synthesis of three lineages (DeepSeek, MiMo and Grok, 10 iterations each) for `specs/cli-jev/003-cli-jev-workflow-integration/001-deep-research`. Every `jev` in this file is the Python `jev-cli` 0.6.2 that `.skilled/skills/cli-jev/cli-usage/` wraps, unless the sentence names the npm `jevctl` 0.2.3 vendored under `context/external repo's/jev-cli-main`.

## Table of Contents

1. Executive Summary
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

- Jev earns its first place here as an offline measurement, not a live feature. Every live seam either sits inside a hook deadline a Jev call cannot promise to meet (the advisor child is killed at 2500 ms and PreCompact has 3 s) or lacks the gold that would prove a judgment helps.
- Start with the one build-now item, `002-advisor-jev-tiebreak-arm`: an offline `choice` over the advisor's own near-tie cluster, run by hand on the existing routing corpus, census first at zero calls, scored by MRR and right@3 on held-out rows, never served and never written into the ratchet.
- Next is `003-goal-verifier-jev-shadow`. An operator-labeled excerpt set gives the goal heuristic its first measured error rates, and an opt-in shadow `jev` mode joins the OpenCode goal plugin only if an offline arm clears a threshold fixed before the build.
- Grading and compaction earn no build yet. The reviewer fixtures are 8 cases of one class whose verdict lines the regex already parses, D4 has no gold and the one reported Jev compaction took 5.6 s (a user report) against a 3 s hook.
- Verdicts: 1 build-now, 1 next, 16 later and 32 drop, plus 3 dead-end approaches recorded under What Not To Build.

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

**Inputs read.** All 30 iteration files. The three lineage `research.md` files. Each lineage's state log, registry and strategy. The merge files under `research/`: `findings-registry.json` and `deep-research-findings-registry.json` (byte-identical by `cmp`), `fanout-attribution.md`, `resource-map.md`, `orchestration-summary.json` and `observability-events.jsonl`. Also `spec.md`, the four digests and `research-angles.md` under `context/`. Also the operator's ideas file, plus the vendored material and posts that the lineages cited. DeepSeek's and MiMo's state records carry no findings arrays, so their findings were read from iteration markdown rather than from the merged count.

**Verification.**

1. Reopened every `file:line` cited for a ranked recommendation, drops included. Section 14 records each one.
2. Ran read-only local counts with no model call:
   - 409 tracked `deep-review-findings-registry.json` files, for severities and transitions.
   - 84 canary cases across 7 compiled-routing hubs, for expected actions.
   - Row, gold-none and split counts in the three routing corpora, plus their sha256 against the pinned values in `scorer-eval-baseline.json`.
   - Research lineage directories under `specs/**/research/lineages/` that carry `deltas/iter-*.jsonl`.
   - A Python replay of `extractVerdict`'s regex (`reviewer-scorer.cjs:119`) over the 8 recorded reviewer outputs.
3. Did not run any `jev` command of either package, any test suite, `validate.sh`, `generate-context.js`, the H1 ratchet, `score-outcome-rerank.mjs` or any install. No `.env` file was opened.

**Claim markers.**

- **Confirmed**: read in code or data, or counted by a command I ran.
- **Inferred**: reasoned from confirmed facts, with what would confirm it.
- **Vendor claim** and **user report**: figures from vendored READMEs or posts, never reproduced in this repository.
- **UNKNOWN**: measured nowhere, with what would resolve it.

Short file names in this document map to full paths in section 16.

---

## 3. RQ1 Grading AI Responses

*Where would a Jev grade of a model's output change a decision here, and what harness measures whether the grade agrees with the current judge?*

**Answer.** No grading use earns a build yet. Every seam that could consume a Jev grade lacks gold, and the one set the lineages treated as gold never reaches the seams they proposed.

1. **The 5dim grader seam (S22).** All three lineages found it in wave 1. Its D4 grader defaults to `mock` (`score-model-variant.cjs:20-21`), so a default 5dim run carries a mock D4 at weight 0.15 (`:58`). D4 is the grader's score (`:300`), and the deterministic `hallucination-flag` check is recorded but never feeds D4 (`:284`). Confirmed.
2. **Its proposed gold does not reach it.** `reviewer-regression.json` says its fixtures run "through the reviewer scorer, NOT run-benchmark.cjs --scorer pattern/5dim", and the runner offers only `pattern` and `5dim` (`run-benchmark.cjs:571`). MiMo-08 caught this. Confirmed. D4 therefore has no oracle of its own, and the only comparison available is agreement between two model graders.
3. **The reviewer scorer's grading path is a verdict classifier.** `classifyWithGrader` (`reviewer-scorer.cjs:155-167`) runs only for `--grader llm`, and only when the regex in `extractVerdict` (`:117-123`) finds no verdict line (`:171`). A `choice` over `pass`, `fail` and `block` fits it exactly. Confirmed.
4. **That classifier is reached on none of today's cases.** The four reviewer fixtures hold 8 cases. All 8 expect `fail`, and all 8 carry a recorded `reviewer_output` that replaces live dispatch (`reviewer-schema.md:74-76`, `reviewer-scorer.cjs:192`). Replaying the regex over those outputs finds a `fail` line in all 8. Confirmed by count. The digest's "three-way `jev choice` target with gold already written" does not exist.
5. **The reply harness (H13) has an empty blinded-judge slot.** No script calls a model, and the judge scores by `rubric.json` outside the scripts (`reply-harness/README.md:3`, `:20`). A Jev `score` per rubric dimension fits, but only against a human-scored subset nobody has made.
6. **Per-turn grading drops.** This is the form the idea takes in the Pi post (`:231`). It has no gold and taxes every turn. A third-party report shows context alone moving a harmless command from 0.22 to 0.58 (Pi post `:1121`). The vendor's own review run kept a planted false positive at 0.57 (claude-jev `README.md:85-93`).
7. **Adjacent defect, reported and not fixed.** `--grader` is never validated (`run-benchmark.cjs:577`), and any kind other than `noop` or `llm` becomes `mock` (`score-model-variant.cjs:211`). Anyone trying `--grader jev` today gets mock D4 scores with no warning. Confirmed.

**Harness.** H9 with the gap row "Grader agreement with oracle", and H13. Agreement is UNKNOWN for both.

**What would change the answer.** Reviewer outputs that miss the verdict line on a live run (promotes R5), a D4 hallucination gold set (promotes R7) or a human-scored H13 subset (promotes R6).

---

## 4. RQ2 Active Skill-Advisor Recommendations

*Can a Jev judgment settle cases the advisor scorer handles poorly, and does it beat the scorer on the advisor corpus and ratchets?*

**Answer.** A live Jev call in the advisor cannot meet its deadline. The testable form is an offline `choice` over the advisor's own near-tie cluster (R1, build-now), and whether any served form follows depends on R1's number.

1. **The live call dies on the deadline.** The prompt hook spawns the advisor child with `spawnSync`, a 2500 ms timeout and SIGKILL. It returns `{}` on timeout or a nonzero exit (`user-prompt-submit.ts:22-24`, `:109-125`). The advisor's own budget is set to 2200 ms when unset (`:105-107`). Confirmed. All three lineages dropped a live call independently in wave 1.
2. **The advisor already names its near-ties.** `applyAmbiguity` gives every passing recommendation within 0.05 of the passing top, on score or on confidence, an `ambiguousWith` list (`ambiguity.ts:7-8`, `:22-36`, `:44-58`). It runs after the threshold is set (`fusion.ts:785-789`). That cluster is a closed set of 2 to 4 keys, which is the shape a `choice` takes. Confirmed.
3. **The harness exists.** The rerank eval scores an ordering by MRR, right@1 and right@3 on a deterministic held-out half of the labeled corpus (`score-outcome-rerank.mjs:6-10`, `:96-121`). It flips only when MRR rises and right@3 does not fall (`:149-150`). H1 records holdout top-1 53/70 = 0.7571 and the ambiguity slice 18/24 = 0.75 at tau 0.03 (`scorer-eval-baseline.json:25-35`). Confirmed.
4. **Headroom is small and partly UNKNOWN.** At most 6 rows can move on the ambiguity slice and 17 on the holdout (MiMo-02's arithmetic on those baselines). How many held-out rows have the gold skill inside the cluster but not first is UNKNOWN. R1's census counts it with zero calls.
5. **Two eligibility rules differ.** The frozen ambiguity slice uses tau 0.03 (`derive-ambiguity-slice.mjs:35`), while the live cluster uses 0.05. R1 uses the live cluster and reports both. MiMo-02 found this. Confirmed.
6. **MiMo's abstention arm does not survive.** The capture counts an abstention on a gold-none row as correct (`capture-scorer-eval-baseline.mjs:70-76`) and counts every abstention as unknown (`:91-99`). The corpus has 18 gold-none rows, and the baseline records 5 false fires and 13 unknowns. So all 13 unknowns are correct abstentions, and an abstention arm could fix at most the 5 false fires, not 18 rows. Confirmed by derivation from counted values.
7. **Clarify and defer are too thin to measure.** The 84 canary cases across 7 hubs hold 3 `clarify` and 10 `defer` expectations. Confirmed by count.
8. **One observation, not a measurement.** Both Pi lineages' error logs carry the same advisor-hook event: `fail_open` after 2504 ms with "CLI fallback timed out". The advisor already runs at its deadline in at least one runtime.
9. **An outside opinion.** A commenter on the Hermes post argues that Jev "makes much more sense for choosing which tools and skills to load than for deleting conversation history" (Hermes post `:120`). R1 is how this repository would test that opinion.

---

## 5. RQ3 Goal Hooks, Plugin and Extensions

*Could Jev judge goal progress, drift or criterion completion, and what would it replace or add?*

**Answer.** Jev can add a verifier lens in one place, the OpenCode goal plugin, which already has an opt-in verifier mode switch, a model-backed precedent and a 30 s budget. It should not replace the heuristic, and no accuracy claim is possible until a labeled excerpt set exists (R2, next).

| Runtime | What judges completion today | Where | Jev fit |
|---|---|---|---|
| OpenCode | The plugin's own heuristic, or an LLM verifier under `OPENCODE_GOAL_VERIFIER=llm` | `opencode-goal.js:134`, `:226-234`, `:2197-2240`, `goal-plugin.md:52-53` | A third mode value is the smallest extension (R2) |
| Pi | The shared `verifyGoalHeuristic` on `turn_end`, then a hidden nudge when not met | `goal-context.ts:221-244`, `goal-core.cjs:596-620` | One call per turn, so it follows OpenCode's result rather than leading |
| Cursor and Devin | Injection only, with no verify or continue mechanism | `cursor/goal-inject.mjs:11`, `goal/README.md:78-79` | None (dropped) |
| Claude and Codex | The native host goal command | `goal/README.md:81-82` | No repository verifier to extend |

1. **The vocabulary needs no mapping.** OpenCode's verdicts are `met`, `not_met` and `blocked` (`opencode-goal.js:179`), and the `llm` prompt already asks for exactly these (`:2232-2240`). Confirmed.
2. **The OpenCode heuristic is binary.** It returns `met` at confidence 0.72 or `not_met`, never `blocked` (`:2197-2230`). Confirmed. A labeled set with a `blocked` class scores the heuristic at zero recall there by construction.
3. **An unknown mode value is silent.** It falls back to `heuristic` with no notice (`:226-229`), so `OPENCODE_GOAL_VERIFIER=jev` today quietly gives the heuristic. Confirmed.
4. **Verifier failures have visible verdicts.** A thrown error becomes `blocked` at confidence 0 (`:2378-2380`), a timeout becomes `not_met` (`:2368-2376`) and an invalid verdict becomes `not_met` (`:2335`). A Jev mode that let a missing key throw would show the operator a false `blocked`. Confirmed. This is why R2 keeps the Jev call outside the authoritative verifier.
5. **Grok's wrapper rule binds any Jev mode.** When the blocking pattern matches, the verdict stays `not_met` and Jev is not asked (`goal-core.cjs:603-604`, `opencode-goal.js:135`). The pattern includes words such as `error` and `failed`, which also appear in real completion messages ("fixed the failing test"). The rule that keeps Jev safe also caps its upside, so the labeled set must show how many false `not_met` come from that pattern. Inferred, confirmed by the set.
6. **Progress and drift have no consumer.** The Pi verdict drives an observe-only nudge and a `last_check` line (`goal/README.md:77`). A drift score would add a report nobody reads.
7. **A live call from OpenCode must not block the host.** The completion sentinel's own comment records that a spawn from OpenCode blocks the whole plugin host (`completion-evidence-sentinel.cjs:90-93`). A Jev call there must be an async spawn bounded by the verifier timeout. Confirmed from the comment, not measured.

**Lineage position.** All three agree, independently in wave 1, that a verifier needs a labeled set. The rank was disputed: DeepSeek-03 ranked a `jev` mode next and Grok-08 contested it. DeepSeek-10 and MiMo then moved to later after cross-reading. I rank the measurement slice next and keep the plugin mode behind its threshold (section 11).

---

## 6. RQ4 Compaction

*Can Jev with a compressor decide what survives compaction, and how would recovery quality be measured?*

**Answer.** No live Jev pass fits the Claude compaction hook, and nothing measures recovery quality. The live form drops and an offline brief-selection pass stays later (R11).

1. **The hook writes a brief, it does not rewrite history.** PreCompact precomputes a brief and caches it for SessionStart, and its stdout is not injected on PreCompact (`compact-inject.ts:1-8`). Confirmed.
2. **The deadlines are short.** The internal budget is 1800 ms (`shared.ts:12`), the merge warns above 1500 ms (`compact-inject.ts:353-354`) and the hook times out at 3 s (`.claude/settings.json:221-222`). Confirmed.
3. **The only Jev compaction timing is a user report.** It records 5.6 s per compaction over three paired runs, against 44.8 s for an LLM summarizer, at $0.002 each (Hermes post `:18-27`). Never reproduced here. On its own it is over the 3 s hook.
4. **The prompt-cache hazard does not transfer as stated.** A Hermes commenter and pi-jev warn that editing history breaks provider caching (Hermes post `:116`, pi-jev `README.md:85-87`). This hook writes a brief after the host has already compacted, so it rewrites no history. Inferred from `compact-inject.ts:1-8`. The hazard would apply to a Pi extension that prunes history, which nothing here proposes.
5. **The tests check mechanics.** The precompact tests do not check what survives (`hook-precompact.vitest.ts:29-60`). Confirmed. The gap row is "Compaction recovery quality": 10 to 15 transcripts with 5 to 10 must-survive facts each.
6. **A cheaper move comes first.** On that same set, test the brief's 4000-token budget (`shared.ts:14`), a value change with no Jev call (MiMo-03).
7. **Vendored patterns that carry over.** Off by default with an egress warning (pi-jev `README.md:35-37`). A missing judgment keeps the item (pi-jev `context.ts:118-126`), and an error pauses Jev and leaves existing judgments alone (`index.ts:199-207`). The npm `jevctl` hook that runs unless `compaction` is `false` (`fast-jev.ts:75`) is the anti-pattern.

---

## 7. RQ5 Cross-Cutting Judgment Points

*Which judgment points are typed judgments today, made by code or by a model, and would Jev make them cheaper, faster or more accurate?*

**Answer.** Jev makes none of them cheaper or more accurate today. It can make several of them measurable, and only a replay or a labeled set can show whether it beats the current judge.

| Judgment point | Decided today by | Evidence | What Jev could add | Verdict |
|---|---|---|---|---|
| Deep-loop STOP legality | Code: three weighted votes, with authority frozen on legacy convergence | `convergence-signals.md:41-47`, `convergence.cjs:480-486`, `stopping-clock-shadow.ts:10-19` | A second rater, measurable only by replay | Later (R8). Authority drops |
| newInfoRatio | Model self-report | `convergence-signals.md:55-73`, `reduce-state.cjs:965-989` | Same second rater | Later (R8) |
| Finding severity | Model, then its own adversarial self-check. `riskScore` never gates | `completion-criteria.md:61-63`, `:75` | A shadow severity beside the recorded one | Later (R10). Writing severity drops |
| Fan-out near-duplicate merge | Code: content key plus title overlap at 0.15 | `fanout-merge.cjs:341`, `:348-351` | A shadow record of near-line pairs | Later (R15). Replacement drops |
| Council verdict delta | Model adjudicator, stop under a 0.20 delta | Seam map S19 (not reopened) | It would replace the adjudicator's signal | Drop |
| Next focus | Code: `scoreBps`, with a shadow comparator built | `next-focus-selection.ts:351-365` | A `choice` in that shadow path | Later (R14) |
| Dispatch guard and linter | Code on repository facts | `dispatch-guard.cjs:80-81`, `:124-132`, `dispatch-rule-checks.mjs:107-117` | Nothing a probability does better | Drop |
| Gate 3 write classification | Code classifier at F1 0.9843 | H3 (digest, archived baseline not reopened) | At most 4 errors to fix | Drop as a product. The corpus stays a negative control |
| Spec alignment on save | Code thresholds 70 and 50 | `alignment-validator.ts:73-75`, `:503-520` | A suggestion below 50 | Later (R13) |
| Spec level | Script policy | Seam map S24 (digest) | Risk flags | Drop |
| Post-save quality | Code at a calibrated 0.4 density | Seam map S25 (digest) | A retrievability score | Drop |
| Compiled-routing clarify and defer | Code, behind a tri-state flag | `router.cjs:199-218`, `resolve.cjs:54-64` | A suggested default on clarify | Later (R12). The live front door drops |
| Completion claim at Stop | Code regex over a 400-character tail | `completion-evidence-sentinel.cjs:64`, `:70`, `:113-119` | An offline audit of false fires | Later (R4) |
| Playbook verdicts | Human | Seam map S26 (digest) | A second opinion | Drop |
| Git preflight, MCP route guard, executor demotion | Code | Seam map S12, S13, S21 (digest) | The seam map rates all three weak | S13 dropped by DeepSeek-05. S12 and S21 were examined by no lineage |

---

## 8. RQ6 New Skills, Commands and Workflows

*Which new surfaces are worth building, and what from the vendored integrations carries over or fails to?*

**Answer.** No new skill, command, hub mode or shared helper. Each recommendation calls the transport directly from its one caller.

1. **The transport already covers the need.** `cli-usage` asks all four judgment types with a stable output contract and exit table (`cli-usage/SKILL.md:162-174`), and the hub is one transport mode by design (`hub-router.json:5-14`). Confirmed.
2. **A command or second mode removes no decision.** A `jev-judge` command or second hub mode adds alias replay cost (checklist Q13) and a thing to learn. All three lineages drop it: Grok-07 and DeepSeek-07 from files they opened, MiMo-07 after reading DeepSeek.
3. **A shared client waits for its third caller.** A probe, bounded spawn, exit map and strict parse come to about 60 to 80 LOC (DeepSeek-07). R1 and R2 are callers one and two.
4. **The patterns carry, the surfaces do not.**

| Pattern | Source | Carries | Why |
|---|---|---|---|
| Thresholds and policy in code, the judgment only as input | claude-jev `review.ts:21-28`, `:91-100`, `integration-patterns.md:43-44` | Yes | The caller owns the threshold here too |
| A missing answer is an error, never a number | claude-jev `question.ts:76-81` | Yes | R1 and R2 mark such rows unmeasured |
| Fail open to stock behavior | pi-jev `context.ts:118-126`, `index.ts:199-207` | Yes | Matches the no-key rule |
| Off by default, egress warning at enablement | pi-jev `README.md:35-37` | Yes | R2's plugin mode |
| Estimate before sending | supercov `quality.md:191-196` | Yes | R1 prints its payload class and call count first |
| Content-hash answer cache | supercov `quality.md:198-203` | Yes, never during stability reruns | A cache makes the flip rate zero by construction |
| Shadow before serving | Hermes post `:18` | Yes | R1 is offline and R2 shadows |
| Record provider and model with each result | `cli-usage/SKILL.md:266-268` | Yes | The transport's completion rule |
| MCP server and slash commands | claude-jev | No | Adds a surface and removes no decision |
| `screen` and `verify` subcommands with `--fail-on` gates | npm `jevctl` `recipes.md:5-11`, `errors.ts:1-9` | No | npm `jevctl` only. The Python `jev-cli` has neither, and its exit 2 means a usage error |
| A missing screen answer becomes 0 | npm `jevctl` `core/screen.ts:56` | No | A silent default score |
| Compaction on unless disabled | npm `jevctl` `fast-jev.ts:75` | No | Breaks the opt-in rule |
| Whole-run abort on one failure | jev-review `workflow.ts:48-55` | No | Discards every measured row |
| A smell catalogue | supercov `properties.json:38-42` | No | Near-chance published rate |

---

## 9. RQ7 Cost and Restraint

**Cost.** Only vendor claims exist: $0.042 per million input tokens and answers in roughly 150 ms (claude-jev `README.md:30-31`), and about a cent per megabyte of source in supercov's own table (`quality.md:182-189`). None was reproduced here. At those claimed prices each recommendation costs cents per run (inferred arithmetic on vendor claims), so money is not the limit.

**Latency.** UNKNOWN. The only confirmed numbers are ceilings: the Python client's 60 s timeout (`jev_cli/__init__.py:288`), the advisor child's 2500 ms, PreCompact's 3 s, the sentinel's 1200 ms and the OpenCode verifier's 30 s. The transport docs confirm no latency figure exists (`providers-and-models.md:166`). R1's per-call record is the first measurement.

**Privacy.** This is the real cost, because state goes to the provider verbatim (`cli-usage/SKILL.md:76-77`, `:209`).

| Payload | Sensitivity | Where |
|---|---|---|
| Routing corpus prompts and skill descriptions | Low. Prompt provenance not checked | R1, R3 |
| Fixture material | Low | R5, R7 |
| Reply-harness cases | Low | R6 |
| Archived findings and evidence | High | R8, R10, R15 |
| Operator session excerpts | High, authored and stripped by the operator | R2's set, R4 |
| Live goal evidence on every verification | Highest. Standing conversation egress | R2's plugin mode |
| History fragments | Highest | R11 |

**Failure modes and no key.** Every recommendation uses the Python `jev-cli` exit contract (`cli-usage/SKILL.md:167-174`):

- Check that `jev --version` prints `jev 0.6.2` before reading any exit code (`cli-reference.md:28`). The npm `jevctl` also installs `jev`, and its exit 2 means a tripped `--fail-on` gate (`errors.ts:1-9`).
- Exit 3 (no key) means skip and say so, never retry.
- Exit 4 means back off once, then mark the row unmeasured.
- Exit 1 and any malformed answer mean unmeasured.
- Errors arrive on stderr with stdout empty (`cli-reference.md:157-159`).
- No path returns a default score.

**Prompt caching.** No kept recommendation edits a provider-cached prompt. DeepSeek-09 reached this for its survivors, and it holds for R1 and R2 because both call Jev outside the host conversation.

**Order, free numbers first.**

1. R1 census, zero calls.
2. R1 arm, the first billed calls and the first latency record.
3. R2 labeled set and heuristic baseline, zero calls.
4. R2 offline arm.
5. R2 plugin shadow mode, only past its threshold.

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
| tau 0.03 slice against the 0.05 live cluster | MiMo-02 | Confirmed |
| An abstention arm targets 18 rows | MiMo-02 | Refuted. The ceiling is 5 rows |
| Registry transitions give P0-survival gold | MiMo-05 | Refuted. 45 P0-born findings, none downgraded |
| 181 replay-eligible lineages | MiMo-04 | Drifted. 178 archived plus this run's 3 |
| The OpenCode mode switch (`heuristic`, `llm`) is the goal seam | DeepSeek-03 | Confirmed |
| The Harness B run command | DeepSeek-08 | Failed |
| A cache during reruns nullifies the stability measure | DeepSeek-08 | Reasoning, accepted |
| The wrapper rule for any goal mode | Grok-08 | Confirmed seam, adopted |
| `noop` returns 1.0 and npm `jevctl` `runScreen` coerces to 0 | Grok-01, Grok-06 | Confirmed |
| Measured latency decides whether deadline-dropped shapes revive | MiMo-09 | Reasoning, accepted. R1 produces the number |
| A routing loss kills the closed-set `choice` family | Grok-10 | Disputed, below |

### Disagreements

| # | Topic | Positions | Stronger evidence | Resolution |
|---|---|---|---|---|
| 1 | Where a grader belongs, and its rank | MiMo build-now, DeepSeek next, Grok later, all at the 5dim D4 factory | Code: the reviewer profile routes elsewhere (`run-benchmark.cjs:571` and the profile note), and the classifier it does reach runs on 0 of 8 cases | Later for both R5 and R7 |
| 2 | Goal mode rank | DeepSeek-03 next. Grok-08 later, then DeepSeek-10 and MiMo later | Code shows a clean opt-in seam, and all three agree the set comes first | Next for the measurement slice, with the plugin mode behind a threshold |
| 3 | How far a routing loss reaches | Grok: it kills severity `choice`, `next_check` and goal `choice`. DeepSeek: the grader family is not gated. MiMo: it does not kill `score` shapes or measurement | No data either way. Routing a prompt against skill descriptions differs in input and gold from verdicts and goal evidence | Unresolved. My judgment: a loss kills R3 outright and is evidence against, not a verdict on, the others. R2's offline arm would test it |
| 4 | Free-first or billed-first order | MiMo free first. DeepSeek and Grok start with the billed routing arm | They agree the routing arm is the first billed item | Phase 002 opens with its free census and 003 with its free set |
| 5 | Stop and severity replays as build-now | MiMo build-now, DeepSeek next, Grok later | Counts: no P0 downgrade exists in `transitions`, and the stop replay's local arms are not a Jev integration | Later |
| 6 | Extend the rerank script or add a file | Grok in place at 40 to 80 LOC. DeepSeek and MiMo a new script | The rerank script's read-only header, its flip rule and the fact that it runs on import | A new file, with the climbing sentence in R1 |
| 7 | A defer shadow log and spec-level flags | MiMo and DeepSeek parked them as later | No decision reads either output | Drop |

---

## 11. Recommendations

Ranked by value to the operator against cost, latency, privacy and risk, smallest measurable slice first. The Python `jev-cli` 0.6.2 is the package for every item.

| Rank | ID | Recommendation | Verdict | Jev type | Phase |
|---|---|---|---|---|---|
| 1 | R1 | Offline advisor tie-break arm | build-now | `choice` | 002 |
| 2 | R2 | Goal verifier measurement, then an opt-in shadow mode | next | `choice` | 003 |
| 3 | R3 | Advisor served forms: cached lane and suggested order | later | `choice` | not phased |
| 4 | R4 | Completion-claim offline audit | later | `noul` | not phased |
| 5 | R5 | Reviewer verdict classification fallback | later | `choice` | not phased |
| 6 | R6 | Reply-harness blinded judge | later | `score` | not phased |
| 7 | R7 | D4 hallucination grader kind (citation failed) | later | `noul` or `score` | not phased |
| 8 | R8 | Stop second-rater replay, Jev arm | later | `score` | not phased |
| 9 | R9 | Confirm-mode stop suggestion | later | none at use time | not phased |
| 10 | R10 | Severity replay, P0 reread order and a validity funnel log | later | `choice`, `score` or `noul` | not phased |
| 11 | R11 | Compaction brief selection pass | later | `noul` or `run` | not phased |
| 12 | R12 | Compiled-routing clarify suggested default | later | `choice` | not phased |
| 13 | R13 | Alignment below-50 suggestion | later | `choice` | not phased |
| 14 | R14 | Next-focus shadow comparator | later | `choice` | not phased |
| 15 | R15 | Fan-out shadow pair record | later | `noul` | not phased |
| 16 | R16 | Injection screen on fetched text | later | `noul` | not phased |
| 17 | R17 | PR-claims advisory report | later | `noul` | not phased |
| 18 | R18 | Debug `next_check` choice | later | `choice` | not phased |

### R1. Offline advisor tie-break arm

| Field | Record |
|---|---|
| **Verdict** | **build-now.** It is the only idea whose harness, corpus and recorded baselines all exist today. It changes no shared contract, and its first phase costs zero Jev calls. |
| **What Jev judges** | A `choice`, Python `jev-cli` 0.6.2. The keys are the passing top skill, its `ambiguousWith` members and a `none` key. Each description is the skill's projection `description` (`types.ts:43`, `projection.ts:49`), and the state is the prompt text. |
| **Seam** | `ambiguity.ts:44-58` writes `ambiguousWith` on passing recommendations within 0.05 on score or confidence (`:7-8`, `:22-36`), after `fusion.ts:785-789` sets the threshold. The eval template is `score-outcome-rerank.mjs:96-121` (metrics and split), `:127-133` (the two arms) and `:149-150` (the flip rule). |
| **Value** | It decides, with a number, which skill the advisor should put first when its own scores call a near-tie. Today the fused order decides. A win is the evidence a served form (R3) needs. A loss closes the live form of the operator's second idea with a number instead of a guess. |
| **Metric, baseline and harness** | H2: MRR and right@3 on the eval's held-out half of the labeled corpus, plus H1-style top-1 on the 70-row holdout file. Today: holdout top-1 53/70 = 0.7571 and ambiguity slice 18/24 = 0.75 at tau 0.03 (`scorer-eval-baseline.json:25-35`). The H2 baseline is UNKNOWN because the eval has never been run, and the arm's own baseline column produces it. Design: a paired A/B on identical rows, the scorer's order against the same order with Jev's pick moved first inside the cluster. Keep only if held-out MRR rises and right@3 does not fall, stability is at least 0.95 over 3 reruns (`benchmark-stability.cjs:20-28`) and the win does not come from the tau 0.03 slice alone. It also fills the gap rows "Jev latency and cost per call", "Jev judgment accuracy against gold" and "Judgment stability". |
| **Cost, latency and privacy** | One call per eligible row per rerun. The eligible count is UNKNOWN until the census. The ceiling is 88 held-out rows plus 64 skill-firing holdout rows, times 3 reruns, for 456 calls. At the vendor-claimed price and 1 to 2 thousand input tokens a call, that is about $0.05 (inferred arithmetic on a vendor claim). No deadline, since a person runs it. Corpus prompts and cluster skill descriptions leave the machine. Both are authored in this repository, and prompt provenance was not checked. |
| **Opt-in and no key** | No existing file changes, so every live path behaves as today by construction. The default run is the census plus the baseline column, with zero calls. The Jev arm runs only behind an explicit flag (proposed name `--jev`) and prints its payload class and call count before the first call. With no key, `jev auth status` exits 3 (`providers-and-models.md:60-63`), the report says `jev arm skipped: no credential` and the census and baseline print unchanged. Exit 3 mid-run stops the arm and reports the finished rows as partial. Exit 4 gets one backoff retry, then the row is `unmeasured` (`cli-usage/SKILL.md:172`). Exit 1, exit 2 or a key outside the submitted set mark the row `unmeasured`, and exit 2 also stops the arm, because it means the arm built a bad command. Unmeasured rows leave both columns, and their count prints beside the metric. A `none` answer keeps the scorer's order and counts as an abstention. If `jev --version` does not print `jev 0.6.2`, the arm refuses to run. The model comes from one `jev auth test` at the start, which is one billed call (`providers-and-models.md:145-148`). |
| **Smallest slice** | One caller, the script itself, end to end. One new file, `score-jev-tiebreak.mjs` (proposed name from DeepSeek-07 and MiMo-08), in `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/`. It imports the built `dist` scorer as `score-outcome-rerank.mjs:35-38` does and copies that script's split and metric functions (`:85-121`, about 40 lines), because that script exports nothing and runs its eval on import (`:159`). It sets the capture's deterministic env (`scorer-eval-baseline.json:8-12`), since the rerank eval reads the live skill graph (`:22-23`). About 150 to 200 LOC. Reports and the per-call JSONL go to a directory the operator names. To undo this: delete the script and its reports. |
| **Fitness checklist** | Passes all 15. Q1: the H2 baseline comes from the same run as the arm. Q3: the census is the build-nothing test, and zero movable rows ends the work there. Q4, climbing sentence: extending `score-outcome-rerank.mjs` in place (Grok-10's shape) would put a network arm inside a script whose header promises a read-only eval of outcome weights (`:17-23`) and whose flip rule decides that flag (`:149-150`), so a separate file keeps that eval's meaning and deletes cleanly. Q6: one flag, earned by the off-machine call. Q8: it reads the corpus and `dist` only and never writes `scorer-eval-baseline.json` or the corpus, whose hashes H1 pins (`:5-7`). Q11: a measurement, never served. Q12: it spawns the installed Python `jev-cli` and adds no package. Q15: the no-key run is the edge case. |
| **Confidence** | Confirmed from code: the cluster rule, split, metrics, baselines and the 2500 ms kill that rules out a live call. Inferred: that movable rows exist (the census confirms), that a `choice` beats the fused order (the arm confirms) and the per-call latency (the JSONL confirms). |
| **Lineage agreement** | All three, independent. Grok-02, DeepSeek-02 and MiMo-02 each proposed an offline cluster `choice` arm before reading a sibling. That it goes first came after cross-reading and is not counted. |
| **Citation check** | Resolved. One drift: Grok-02 calls the rerank eval H5, and it is H2. |

**Proof plan, written before the build.**

1. `node score-jev-tiebreak.mjs` with no key prints eligible and movable row counts per split. Boundary: zero movable held-out rows means the report says "no headroom" and the work stops.
2. The baseline column on the holdout file reproduces 53/70 under the pinned env. Boundary: any other number means a stale `dist` or a different scorer, and the comparison is void. Inferred to hold if the H1 ratchet is green at HEAD.
3. With a key and the flag, the report carries MRR, right@1 and right@3 for both columns on identical rows, and the per-call JSONL carries wall time, exit code, `jev` version, provider and model for every call. Boundary: an exit 4 row is `unmeasured`, never a pick.
4. Three reruns give a stability coefficient of at least 0.95. Boundary: below that, a mean gain does not count.
5. `git status` shows no change outside the new script and its report directory. Boundary: any write to the corpus, `scorer-eval-baseline.json` or the ratchet fails the arm.

**Kill criterion (Grok-10).** The arm does not beat the scorer's order on held-out MRR or right@3. A loss drops R3 directly. For the other closed-set `choice` ideas a loss is evidence, not a verdict (section 10, disagreement 3).

### R2. Goal verifier measurement, then an opt-in shadow `jev` mode

| Field | Record |
|---|---|
| **Verdict** | **next.** The OpenCode plugin is the one live seam with an opt-in mode switch, a model-backed precedent and a deadline a Jev call can plausibly meet. Its first slice costs zero Jev calls and produces the first verifier accuracy numbers this repository has. It is not build-now because it needs operator labeling time and the heuristic's error rates are UNKNOWN. |
| **What Jev judges** | A `choice`, Python `jev-cli` 0.6.2, over `met`, `not_met` and `blocked`, the plugin's own verdicts (`opencode-goal.js:179`). The descriptions follow the `llm` prompt's rules (`:2234-2237`). The state is the goal objective and the latest assistant evidence, sanitized and capped as the plugin already does. |
| **Seam** | `opencode-goal.js:134` (`VALID_VERIFIER_MODES`), `:226-234` (mode normalization and dispatch), `:2197-2230` (the heuristic, which stays authoritative) and `:49` (30 s verifier budget). The wrapper rule anchors on `VERIFIER_BLOCKING_PATTERN` (`:135`, plus `goal-core.cjs:603-604` in the shared core). |
| **Value** | The decision "is this goal done" after each idle in OpenCode autonomous mode. A false `not_met` costs a continuation turn and a nudge, and a false `met` stops a goal early. The first slice tells the operator how often each happens today, which is worth knowing even if no Jev mode ever ships. |
| **Metric, baseline and harness** | H12 plus the gap row "Goal verifier accuracy". Today UNKNOWN: H12 has three unit tests and no labeled set (`goal-core.test.cjs:631-651`). Smallest harness: 30 to 50 excerpts the operator labels `met`, `not_met` or `blocked`, scored for the heuristic (each error attributed to the check that produced it) and for a Jev arm under the wrapper rule, 3 reruns each. Keep only if the Jev arm cuts false `not_met` by at least 30% relative, adds no false `met`, misses no `blocked` row and holds stability of at least 0.95 (MiMo-08's thresholds, fixed here before the build). Afterwards the live shadow design: the heuristic acts, and the Jev result is logged beside it with its `source`. |
| **Cost, latency and privacy** | Offline, at most 50 excerpts times 3 reruns, for 150 calls. Live shadow: one call per verification, inside the 30 s budget, latency UNKNOWN until R1 measures it. What leaves the machine is the operator's own conversation, the most sensitive payload in this research. The set's author strips secrets before any call, and the plugin mode announces egress at enablement in the pi-jev pattern (`README.md:35-37`). |
| **Opt-in and no key** | First slice: an offline script with the Jev arm behind an explicit flag. With no key the heuristic baseline prints and the arm reports `skipped: no credential`. Second slice: a new value of the existing switch, `OPENCODE_GOAL_VERIFIER=jev` (proposed, and today it silently falls back to `heuristic` at `:226-229`). In that mode the heuristic acts exactly as today and the Jev call runs beside it as a shadow. No key, exit 4, a timeout or a malformed answer produce no shadow record for that verification and one log line naming the reason. Because the Jev call sits outside the authoritative verifier, its failures never reach the catch path that turns an error into `blocked` (`:2378-2380`). The call is an async spawn bounded by the verifier timeout, since a spawn from OpenCode blocks the plugin host (`completion-evidence-sentinel.cjs:90-93`). |
| **Smallest slice** | One caller, the offline scorer, end to end: the labeled set as a JSONL fixture (proposed path beside `.skilled/hooks/goal/lib/goal-core.test.cjs`) and one script that runs the heuristic and the Jev arm over it. The plugin exposes `maybeVerifyGoal` through `MkGoalPlugin.__test` but not the heuristic itself (`opencode-goal.js:3359-3385`), so the script either drives `maybeVerifyGoal` or the build adds one entry to `__test`, decided after reading `maybeVerifyGoal`. About 100 to 150 LOC plus 30 to 50 rows. The plugin mode, only past the threshold, is about 60 to 100 LOC (DeepSeek-10's estimate). To undo this: delete the fixture and the script, and later remove the mode value and its branch. |
| **Fitness checklist** | Q1 fails until the set exists, which is acceptable because the set is the first slice. Q9: the payload is the operator's conversation, acceptable only because the operator authors and strips the set and the live mode announces egress. Q11: the heuristic keeps authority, the wrapper rule keeps blocking language out of Jev's reach and no acting `jev` mode is proposed here. Q8 and Q14: the goal plugin's documented contract (`goal-plugin.md:52-53`) and the mode set are frozen surfaces, so the build names every caller of `VALID_VERIFIER_MODES` by search before editing. Q15: the no-key run and one malformed answer are the edge cases. |
| **Confidence** | Confirmed: the mode switch, the vocabulary, the fallback paths, the 30 s budget, the silent unknown-mode fallback and the error-to-`blocked` path. Inferred: that the heuristic's errors leave headroom, and that enough false `not_met` come from checks other than the blocking pattern for Jev to fix under the wrapper rule. The labeled set confirms both. |
| **Lineage agreement** | All three agree, independently in wave 1, that a verifier needs a labeled set first (Grok-03, DeepSeek-03, MiMo-03). The rank is disputed: DeepSeek-03 said next and Grok-08 contested it. DeepSeek-10 and MiMo then moved to later after cross-reading. My next covers the measurement slice only. The wrapper rule is Grok-08's, adopted by MiMo-08 after cross-reading. |
| **Citation check** | Resolved, including DeepSeek's `opencode-goal.js:72` (default mode) and Grok's `goal-core.cjs:603`. |

**Proof plan, written before the build.**

1. The labeled set holds at least 30 rows, each with an objective, an evidence excerpt and one label. Boundary: under 30 rows proves nothing, and the phase stops there.
2. The heuristic baseline runs with zero calls and prints a confusion table with each error attributed to the check that produced it. Boundary: if the heuristic has no false `met` and a false `not_met` rate at or below 0.10, stop and build nothing (proposed threshold, fixed now).
3. The Jev arm runs under the wrapper rule with 3 reruns. Boundary: it never asks Jev about a row where the blocking pattern matched, and the script asserts this.
4. The keep threshold above is read against the heuristic's numbers. Boundary: any added false `met` fails the keep whatever else improves.
5. Only then the plugin shadow mode. Boundary: with no key, a session in `jev` mode must reach the same verdicts as `heuristic` mode, apart from one log line per verification.

### R3. Advisor served forms: cached shadow lane and suggested order inside the cluster

| Field | Record |
|---|---|
| **Verdict** | **later.** It serves a Jev pick, which needs R1's win first, and a cached lane needs a producer that does not exist. |
| **What Jev judges** | The same `choice` as R1, computed ahead of time and read from a cache. |
| **Seam** | Shadow lane pattern `lane-registry.ts:21-29`, `:33-38`. Shadow sink `shadow-sink.ts:86-100`, `:144-155`. Cluster `ambiguity.ts:44-58`. |
| **Value** | A better first skill, or the cluster in a better order, on near-tie prompts. |
| **Metric, baseline and harness** | H5 shadow deltas scored offline by H1 and H2. Baseline: R1's result. |
| **Cost, latency and privacy** | Zero calls at prompt time when served from cache. Any live read must fit the 2500 ms child. Prompt text leaves the machine when the cache fills. |
| **Opt-in and no key** | A default-off flag in the advisor's convention (`fusion.ts:69`, `:111-114`). No key or no cache entry means today's order. |
| **Smallest slice** | UNKNOWN until R1 reports. A cache producer is a new process, the costly move. |
| **Fitness checklist** | Fails Q1 until R1 wins. Q8: advisor scoring and its lane registry are shared contracts. |
| **Confidence** | Seam confirmed. Value inferred from R1. |
| **Lineage agreement** | Two, independent in wave 1: DeepSeek-02 (cached lane) and MiMo-02 (suggested order). Grok-02 keeps the cluster `choice` offline only. |
| **Citation check** | Resolved. |

### R4. Completion-claim offline audit

| Field | Record |
|---|---|
| **Verdict** | **later.** The live path cannot host a call, and a narrower regex may fix false fires with no Jev code, so the labeled set decides before any Jev arm. |
| **What Jev judges** | A `noul`, "does this turn end by claiming the work is complete", offline only. |
| **Seam** | `completion-evidence-sentinel.cjs:64` (the pattern, including `occurred` and `happened`, kept byte-identical to a runtime hook's copy per `:60-63`), `:70` (400-character tail) and `:113-119`. |
| **Value** | Fewer advisories on turns that never claimed completion. |
| **Metric, baseline and harness** | False-fire and missed-claim rates on R2's excerpt set, relabeled for claims. Baseline: the regex's rate, UNKNOWN. The advisory log exists only outside this worktree and was not read. |
| **Cost, latency and privacy** | Under 100 offline calls. Session excerpts leave the machine (high). The live check has 1200 ms (`:90-94`). |
| **Opt-in and no key** | Offline only, and the sentinel's kill switch already exists (`:84`). No key means the regex measurement alone. |
| **Smallest slice** | Label claims on R2's set and score the regex with zero calls. Reach for Jev only if the regex cannot be narrowed without new misses. |
| **Fitness checklist** | Q3 may end it with a regex change and no Jev code, which is a passing outcome. |
| **Confidence** | Pattern words, tail and timeout confirmed. False-fire rate UNKNOWN. |
| **Lineage agreement** | Two: DeepSeek-01 in wave 1, and MiMo-06 after cross-reading, grounded in code it opened. Counted as corroboration. |
| **Citation check** | Resolved. |

### R5. Reviewer verdict classification fallback

| Field | Record |
|---|---|
| **Verdict** | **later.** The seam fits a three-key `choice` exactly, but no current case reaches it. |
| **What Jev judges** | A `choice` over `pass`, `fail` and `block`, with the reviewer's output as state. |
| **Seam** | `reviewer-scorer.cjs:155-167` (`classifyWithGrader`), reached only from `:171` when `extractVerdict` (`:117-123`) finds no line. Documented at `reviewer-schema.md:82-90`. Callers: `deep-model-benchmark-auto.yaml:206` and `deep-model-benchmark-confirm.yaml:228`. |
| **Value** | On a live reviewer run, output with no verdict line would get a verdict instead of `unknown`, through a typed call rather than a free-form `llm` classification. |
| **Metric, baseline and harness** | H9, gap row "Grader agreement with oracle", on regex-miss outputs against `expectedVerdict`, beside the `llm` classifier. Today the fallback runs on 0 of 8 cases (confirmed by count), and classifier accuracy is UNKNOWN. Smallest harness: at least 12 recorded outputs with no clean verdict line, covering `pass`, `fail` and `block`. |
| **Cost, latency and privacy** | One call per regex miss, offline. Fixture material leaves the machine (low). |
| **Opt-in and no key** | A `--grader jev` value (proposed), validated at startup. No key means the run behaves as `noop` does and prints `verdict classification skipped: no credential`. Exit 4 or a malformed answer leaves that case's verdict `unknown`, never a guessed one. |
| **Smallest slice** | The regex-miss cases first (fixtures only), then one run with `--grader llm` for the first classifier number, then a `jev` branch of about 30 to 50 LOC. |
| **Fitness checklist** | Fails Q1. Fails Q6 today, because no caller reaches the branch. |
| **Confidence** | Confirmed by code and by replaying the regex. Inferred: that live reviewer outputs miss the verdict line often enough to matter. |
| **Lineage agreement** | One, MiMo-08, which found the runner path after reading DeepSeek-08 and corrected it from files it opened. The 0-of-8 reach is this synthesis's finding. |
| **Citation check** | Resolved. |

### R6. Reply-harness blinded judge

| Field | Record |
|---|---|
| **Verdict** | **later.** It is the most direct test of the operator's grading idea, but no judge can be trusted before a human-scored subset exists. |
| **What Jev judges** | A `score` per rubric dimension over masked replies. |
| **Seam** | `reply-harness/README.md:11-12` (`blind.mjs` and `compare.mjs`) and `:20` (the judge scores outside the scripts). |
| **Value** | A reply-rule change can be compared without the operator scoring every masked pair. |
| **Metric, baseline and harness** | H13, agreement with a human pass per dimension. Baseline: none. |
| **Cost, latency and privacy** | Cases times seven dimensions per condition, offline. Authored cases leave the machine (low). |
| **Opt-in and no key** | A judge step run by hand. No key means the manual judge, as today. |
| **Smallest slice** | The operator scores about 20 masked replies and Jev scores the same. The report gives agreement per dimension. |
| **Fitness checklist** | Fails Q1 until the human subset exists. |
| **Confidence** | The empty slot is confirmed. Agreement UNKNOWN. |
| **Lineage agreement** | Two, independent in wave 1: DeepSeek-01 (later) and MiMo-01 (kept, gated on the human subset). |
| **Citation check** | Resolved. |

### R7. D4 hallucination grader kind

| Field | Record |
|---|---|
| **Verdict** | **later, citation failed.** The lineages' gold for it, the reviewer fixtures, never reaches D4, and D4 has no oracle of its own. |
| **What Jev judges** | A `noul` or `score` of hallucination against the fixture allowlist. |
| **Seam** | `score-model-variant.cjs:207-226` (`buildGraderFn`), D4 at `:300`, weight at `:58`. Runner flag `run-benchmark.cjs:577`, usage at `:582`. |
| **Value** | The default 5dim composite carries a mock D4 (`:20-21`). A cheap real D4 would make its 0.15 weight mean something. |
| **Metric, baseline and harness** | Gap row "Grader agreement with oracle", with no gold. Smallest harness: model outputs labeled for hallucination against the fixture allowlist, then agreement of `llm`, Jev and the `hallucination-flag` check (`:284`). |
| **Cost, latency and privacy** | One call per graded output, offline. Fixture material (low). |
| **Opt-in and no key** | `--grader jev` (proposed). The silent fallback to `mock` (`:211`) must become a startup error first. No key refuses at startup like the family-collision refusal (`run-benchmark.cjs:614-621`). A failed grade carries `parse_status: 'failed'` and no score, never 0.0 (`:222-224`). |
| **Smallest slice** | The labeled D4 set, then about 60 to 100 LOC (DeepSeek-10). |
| **Fitness checklist** | Fails Q1 and Q6. Fails Q7 until the silent `mock` fallback is fixed. |
| **Confidence** | Seam and defect confirmed. Value inferred. |
| **Lineage agreement** | All three found the seam independently in wave 1. Verdicts disputed (MiMo build-now, DeepSeek next, Grok later), and the code settles it (section 10, disagreement 1). |
| **Citation check** | Failed for the gold, since `reviewer-schema.md:59` does not feed D4, and for DeepSeek-08's Harness B command. The seam lines resolve. |

### R8. Stop second-rater replay, Jev arm

| Field | Record |
|---|---|
| **Verdict** | **later.** Local replay arms that measure today's stop model are non-Jev work and come first. The Jev arm is worth buying only if they show the heuristic leaves iterations on the table. |
| **What Jev judges** | A `score` over the five newInfoRatio rubric levels (`convergence-signals.md:55-73`), or a `noul`, "did this iteration add a new cited finding". |
| **Seam** | `convergence.cjs:506-549` (`buildNoveltyCorroboration`), `:618-631` and `:805-808`, with the shadow pair `stopping-clock-shadow.ts:10-19`. |
| **Value** | A second rater beside self-reported novelty. |
| **Metric, baseline and harness** | H11 replay, gap row "Correct stop point". Gold: the last iteration that adds a first-appearance cited source in `deltas/`. Baseline: none. Corpus: 178 archived research lineages with deltas (confirmed by count). |
| **Cost, latency and privacy** | 125 to 250 calls on a 25-lineage sample (MiMo-09). Archived findings leave the machine (high), so the state is stripped and the payload announced. |
| **Opt-in and no key** | A replay script flag. No key runs the local arms and says the Jev column was skipped. It never enters `shouldBlock`. |
| **Smallest slice** | The local replay with zero calls, then a five-lineage manual check of the derived gold. |
| **Fitness checklist** | Fails Q1 until the replay exists. Q9 needs stripping and an announcement. |
| **Confidence** | Mechanics and corpus confirmed. Gold fidelity inferred. |
| **Lineage agreement** | All three touched it. Replay before any stop build is corroborated (DeepSeek-04, MiMo-04). Verdicts: MiMo build-now, DeepSeek next, Grok later. |
| **Citation check** | Resolved. MiMo's 181 lineages drifted to 178 archived plus this run's 3. |

### R9. Confirm-mode stop suggestion

| Field | Record |
|---|---|
| **Verdict** | **later.** It shows a calibrated signal from R8, which does not exist yet. |
| **What Jev judges** | Nothing at use time. If R8 shows a local signal is enough, it ships with no Jev code. |
| **Seam** | `deep-research-confirm.yaml:1316-1345` (`gate_post_iteration`, its `present` block and options A to D). |
| **Value** | The per-iteration continue-or-stop question arrives with one evidence line on exhausted loops. |
| **Metric, baseline and harness** | Suggestion precision of at least 0.9 and one iteration saved on at least 20% of lineages (MiMo-08), on R8's replay. |
| **Cost, latency and privacy** | Zero calls at use time. |
| **Opt-in and no key** | The line appears only when a calibrated signal exists. Otherwise the prompt stays as today. |
| **Smallest slice** | One line in the `present` block, after the workflow owner approves the edit. |
| **Fitness checklist** | Fails Q1. Q14: it edits a workflow contract. |
| **Confidence** | Seam confirmed by this synthesis. MiMo named the step without opening it. |
| **Lineage agreement** | One, MiMo-07. |
| **Citation check** | Resolved. |

### R10. Severity replay, P0 reread order and a validity funnel log

| Field | Record |
|---|---|
| **Verdict** | **later.** The planned gold has no negative class: across 409 registries, 45 findings entered as P0 and all 45 are still P0. |
| **What Jev judges** | A `choice` over `P0`, `P1`, `P2` and `not_a_finding`, or a `score` over ordered levels, plus `noul` validity questions for a capped follow-up log with a `noMatch` escape (Grok-05, MiMo-05). |
| **Seam** | `completion-criteria.md:61-63` and `:75`, plus the reviewer-blind adapter `mode-adapters.ts:59` and `:63-72`. |
| **Value** | Fewer P0 rereads, with likely-real P0s first. |
| **Metric, baseline and harness** | H14, gap row "Finding triage agreement". The transitions gold failed: the whole corpus holds 0 P0 downgrades, 5 P1 to P2, 2 P1 to P0 and 2 P2 to P1. Rejected P0s are downgraded with rationale in the iteration narrative (`completion-criteria.md:63`), so a narrative-mined gold may exist. UNKNOWN. |
| **Cost, latency and privacy** | Tens to hundreds of calls. Finding evidence leaves the machine (high). |
| **Opt-in and no key** | A replay flag. Registry order and recorded severities never change. |
| **Smallest slice** | Mine archived iteration narratives for rejected P0s with zero calls. Promote at 20 or more labeled negatives. |
| **Fitness checklist** | Fails Q1. Q11 holds only as a non-gating shadow. |
| **Confidence** | Confirmed by count. Narrative gold UNKNOWN. |
| **Lineage agreement** | Three, with the non-gating shadow shape corroborated (C5). Verdicts: MiMo build-now, DeepSeek next, Grok later. |
| **Citation check** | The seam resolves. The transitions gold failed on count. |

### R11. Compaction brief selection pass

| Field | Record |
|---|---|
| **Verdict** | **later.** The only reported timing is over the 3 s hook, and nothing measures what must survive. |
| **What Jev judges** | A `noul` keep-or-drop per brief section, or a `run` batch. |
| **Seam** | `compact-inject.ts:404-405` (`pendingCompactPrime`), `:446-448` (optional work skipped when the budget runs out) and `shared.ts:14` (4000-token budget). |
| **Value** | A post-compaction brief that keeps more of what matters. |
| **Metric, baseline and harness** | Gap row "Compaction recovery quality": must-survive fact recall at equal length on 10 to 15 transcripts. Baseline: none. |
| **Cost, latency and privacy** | User report: $0.002 and 5.6 s per compaction (Hermes post `:26-27`). History fragments leave the machine (highest). |
| **Opt-in and no key** | Default off. No key means today's merge. |
| **Smallest slice** | The transcript set and a budget-only arm with zero calls, first. |
| **Fitness checklist** | Fails Q1 and the deadline part of Q7. Q9 needs an enablement warning. |
| **Confidence** | Deadlines confirmed. The timing is a user report. |
| **Lineage agreement** | All three dropped the live form independently in wave 1. The offline pass is DeepSeek-03 and MiMo-03. |
| **Citation check** | Resolved. |

### R12. Compiled-routing clarify suggested default

| Field | Record |
|---|---|
| **Verdict** | **later.** Three clarify rows exist across all hubs. |
| **What Jev judges** | A `choice` over the clarify candidates, to suggest a default, offline. |
| **Seam** | `router.cjs:199-218`. The seam map's `:198-216` drifted. |
| **Value** | A preselected default on a clarify prompt. |
| **Metric, baseline and harness** | H7 admission on clarify gold. Today 3 clarify rows (confirmed by count) and no record of how often clarify happens. |
| **Cost, latency and privacy** | Offline. Prompt text (low). |
| **Opt-in and no key** | Offline only. The live front door is dropped. |
| **Smallest slice** | A clarify gold of 30 or more rows and a count of real clarify frequency. |
| **Fitness checklist** | Fails Q1. |
| **Confidence** | Row counts confirmed. |
| **Lineage agreement** | Two after cross-reading, DeepSeek-06 and MiMo-06, with MiMo on digest evidence. |
| **Citation check** | Drifted: `:198-216` is `:199-218`. |

### R13. Alignment below-50 suggestion

| Field | Record |
|---|---|
| **Verdict** | **later.** No archived gold says which folder a low-alignment save should have used. |
| **What Jev judges** | A `choice` over the alternatives the save already lists below 50. |
| **Seam** | `alignment-validator.ts:73-75` (70 and 50) and `:503-520`. |
| **Value** | A suggested folder when the save is unsure. |
| **Metric, baseline and harness** | No harness. Gap: archived low-alignment saves with their final folder. |
| **Cost, latency and privacy** | One call per low-alignment save. Save content leaves the machine (high). |
| **Opt-in and no key** | A console suggestion only. No key means today's list. |
| **Smallest slice** | Count archived below-50 saves first. |
| **Fitness checklist** | Fails Q1. |
| **Confidence** | Seam confirmed. |
| **Lineage agreement** | Two after cross-reading: DeepSeek-06 and MiMo-06. |
| **Citation check** | Resolved, including DeepSeek's `:503-521`. |

### R14. Next-focus shadow comparator

| Field | Record |
|---|---|
| **Verdict** | **later.** A shadow comparator exists, but nothing says which focus was right. |
| **What Jev judges** | A `choice` over the top next-focus candidates. |
| **Seam** | `next-focus-selection.ts:351-365` (`compareNextFocusShadow`). |
| **Value** | Evidence on whether `scoreBps` picks good foci. |
| **Metric, baseline and harness** | None. |
| **Cost, latency and privacy** | One call per iteration in shadow. Strategy text leaves the machine. |
| **Opt-in and no key** | Shadow only. No key means no comparison. |
| **Smallest slice** | UNKNOWN until a focus gold exists. |
| **Fitness checklist** | Fails Q1. |
| **Confidence** | Seam confirmed. |
| **Lineage agreement** | One, DeepSeek-04. |
| **Citation check** | Resolved. |

### R15. Fan-out shadow pair record

| Field | Record |
|---|---|
| **Verdict** | **later.** The merge is deterministic, and no labeled pair set exists. |
| **What Jev judges** | A `noul`, "do these two findings say the same thing", for pairs near the 0.15 line. |
| **Seam** | `fanout-merge.cjs:341`, `:348-351`. |
| **Value** | A record of where the title rule might split or merge wrongly. |
| **Metric, baseline and harness** | None. Gap: labeled near-line pairs. |
| **Cost, latency and privacy** | Offline. Finding text (high). |
| **Opt-in and no key** | A record only, never the merge decision. |
| **Smallest slice** | A labeled pair set first. |
| **Fitness checklist** | Fails Q1. |
| **Confidence** | Seam confirmed. |
| **Lineage agreement** | One, DeepSeek-05. |
| **Citation check** | Resolved. |

### R16. Injection screen on fetched text

| Field | Record |
|---|---|
| **Verdict** | **later.** No hook in this repository handles fetched web content. |
| **What Jev judges** | A `noul`, "does this text try to instruct the agent". A missing answer is a skip, never the 0 that npm `jevctl`'s `runScreen` uses (`core/screen.ts:56`). |
| **Seam** | None. `.claude/settings.json` has matchers for Bash, Task, Task plus Agent, `mcp__claude_ai_.*`, Write plus Edit and the empty matcher. None of them is for fetch. |
| **Value** | A warning before fetched instructions reach the agent. |
| **Metric, baseline and harness** | None. |
| **Cost, latency and privacy** | One call per fetch. Fetched text is already public. |
| **Opt-in and no key** | Default off. No key means no screen. |
| **Smallest slice** | UNKNOWN until a fetch caller exists. |
| **Fitness checklist** | Fails Q5 and Q8, since there is no caller. |
| **Confidence** | Missing matcher confirmed. |
| **Lineage agreement** | One, Grok-06. |
| **Citation check** | Resolved. |

### R17. PR-claims advisory report

| Field | Record |
|---|---|
| **Verdict** | **later.** The recipe exists only for npm `jevctl`, no gold exists and the flow belongs to sk-git. |
| **What Jev judges** | A `noul` per claim against the diff, ported to the Python `jev-cli`. The npm `jevctl` shape, `jev verify` with `--fail-on` (`recipes.md:5-11`), cannot run against the pinned package. |
| **Seam** | The sk-git PR flow, not opened by any lineage. |
| **Value** | Contradicted claims flagged before the operator rereads the diff. |
| **Metric, baseline and harness** | None. Gap: a labeled PR-claims corpus. |
| **Cost, latency and privacy** | One call per claim. The PR body and diff leave the machine. |
| **Opt-in and no key** | An advisory report only, never a merge gate. |
| **Smallest slice** | UNKNOWN. A port plus a corpus. |
| **Fitness checklist** | Fails Q1 and Q8. Q12 if it pulled in npm `jevctl`. |
| **Confidence** | The package clash is confirmed from the vendored files. |
| **Lineage agreement** | One, MiMo-07. |
| **Citation check** | Resolved. |

### R18. Debug `next_check` choice

| Field | Record |
|---|---|
| **Verdict** | **later.** No caller line exists in this repository. |
| **What Jev judges** | A `choice` over `read_code`, `run_test`, `reproduce` and `instrument` (claude-jev `hypotheses.ts:41-45`). |
| **Seam** | None opened. Grok-09 notes the debug skill already orders the work. |
| **Value** | A cheaper next check per hypothesis, logged only. |
| **Metric, baseline and harness** | None. Grok's kill: it loses to "always read_code". |
| **Cost, latency and privacy** | One call per hypothesis. Code excerpts leave the machine. |
| **Opt-in and no key** | Logged beside a hypothesis, never reordering the debug phases. |
| **Smallest slice** | UNKNOWN until a caller is named. |
| **Fitness checklist** | Fails Q1 and Q8. |
| **Confidence** | The vendored shape is confirmed. The repository seam is absent. |
| **Lineage agreement** | One, Grok-07. |
| **Citation check** | Resolved for the vendored lines. No repository seam to check. |

---

## What Not To Build

This is the workflow's eliminated-alternatives section, under the heading this synthesis was asked to use. Rows 1 to 32 are dropped ideas and rows 33 to 35 are dead-end approaches.

| # | Idea | Reason | Checklist question or red flag | Evidence | Lineage(s) |
|---|---|---|---|---|---|
| 1 | A live Jev call in the advisor prompt hook, as a whole-catalogue pick or a tie-break | The child is killed at 2500 ms and the hook returns `{}`. The advisor gets 2200 ms of that | Q7, and the red flag "delegation that costs more than the work" | `user-prompt-submit.ts:22-24`, `:105-125` | All three, independent |
| 2 | Jev as a fused live advisor lane, or Jev writing `passes_threshold` or `ambiguousWith` | Both are code-owned scorer outputs, so a model answer would become a routing verdict | Q8, Q11 | `fusion.ts:785-789`, `ambiguity.ts:44-58` | DeepSeek, Grok |
| 3 | Serving a Jev routing pick before R1 measures it, including a status-bar suggestion | No measured win exists, and no status-bar seam exists in this repository's hooks | Q1, and the red flag "usefulness claim without numbers" | R1 unrun. Grok found no status-bar seam | Grok, MiMo, DeepSeek |
| 4 | An abstention arm, with Jev deciding when the advisor says none | The 13 unknowns are correct abstentions, so the ceiling is the 5 false fires | Q1, Q3 | `capture-scorer-eval-baseline.mjs:70-76`, `:91-99`, 18 gold-none rows counted | MiMo proposed, refuted here |
| 5 | A live keep-or-drop pass inside PreCompact | 1800 ms internal budget, a warning above 1500 ms and a 3 s hook, while the one reported Jev compaction took 5.6 s | Q7 | `shared.ts:12`, `compact-inject.ts:353-354`, `.claude/settings.json:221-222`, Hermes post `:26` | All three, independent |
| 6 | Compaction that runs unless explicitly disabled | The repository pattern is off by default with an egress warning | Q7, Q9 | npm `jevctl` `fast-jev.ts:75`, pi-jev `README.md:35-37` | Grok |
| 7 | A per-turn "good response" grade, or any per-turn grade display | No gold and a tax on every turn. Context alone moved a harmless command from 0.22 to 0.58 in a third-party report | Q1, Q11 and a report nobody acts on | Pi post `:231`, `:1121` | Grok, MiMo (independent), DeepSeek |
| 8 | Dropping a review finding live when a `noul` is under 0.5 | The vendor's own run kept a planted false positive at 0.57 | Q11 | claude-jev `README.md:85-93`, `review.ts:21-28` | Grok |
| 9 | Any no-key or failure path that returns a number: `noop`'s 1.0, a failed grade's 0.0 or `runScreen`'s 0 | A default score is a silent wrong answer, indistinguishable from a real one | Q7, and the red flag "a default that papers over a missing value" | `score-model-variant.cjs:207-226`, `:222-224`, npm `jevctl` `core/screen.ts:56` | All three, independent |
| 10 | Aborting a whole run when one judgment fails | One transport error would discard every measured row | Q7 | jev-review `workflow.ts:48-55` | Grok |
| 11 | Replacing the near-duplicate collapse, or making Jev the live merge decision | The merge is a pure function with a named constant, deterministic and replayable | Q8, Q11 | `fanout-merge.cjs:341`, `:348-351` | Grok, DeepSeek (C3) |
| 12 | Jev in the dispatch guard, the dispatch linter, the MCP route guard or the Pi Gate 3 sanitizer | These decide on repository facts inside 5 s budgets and must be deterministic | Q11, and "never let a judgment stand in for a repository fact" | `dispatch-guard.cjs:80-81`, `:124-132`, `dispatch-rule-checks.mjs:107-117`, `spec-gate-classify.ts:22-29`, `cli-usage/SKILL.md:219` | Grok, DeepSeek (C2) |
| 13 | Any Jev input to STOP legality | STOP authority is frozen on legacy convergence, and a model answer must not become the blocking signal | Q8, Q11 | `convergence.cjs:480-486`, `stopping-clock-shadow.ts:10-19` | All three (C1, MiMo after cross-reading) |
| 14 | Jev as the AI Council verdict-delta measure | It would replace an adjudicator signal rather than shadow it | Q11 | Seam map S19 (digest, not reopened) | DeepSeek |
| 15 | Jev writing or gating finding severity | `riskScore` is already non-gating, and the verdict reads only confirmed P0s | Q11 | `completion-criteria.md:62`, `:75` | All three (C5) |
| 16 | Replacing the goal heuristic's authority, or letting Jev return `met` over blocking language | Blocking language forces `not_met` before any `met`, which is the safety property | Q11 | `goal-core.cjs:603-604`, `opencode-goal.js:2197-2230` | Grok, MiMo (independent), DeepSeek |
| 17 | A goal drift or progress judgment | Its only consumer is an observe-only nudge and a `last_check` line | A report nobody reads | `goal/README.md:77` | MiMo |
| 18 | A Jev verifier on Cursor or Devin | Those adapters inject only and have no verify or continue mechanism | Q8 | `cursor/goal-inject.mjs:11`, `goal/README.md:78-79` | DeepSeek (Grok cited it) |
| 19 | Live Jev in the compiled-routing front door | One legal stdout shape with a legacy fallback on a synchronous path, and only 13 clarify and defer gold rows | Q1, Q7 | `compiled-route.cjs:25-47`, canary count | DeepSeek, MiMo |
| 20 | A shadow log of Jev defer disagreements | No decision reads it, and only 10 defer gold rows exist | Q1, and a report nobody reads | Canary count | MiMo parked it as later. Dropped here |
| 21 | Gate 3 write classification as a Jev product | F1 is already 0.9843, which leaves at most 4 errors | Q1, Q3 | H3 (digest) | MiMo, DeepSeek |
| 22 | Spec-level risk flags beside the level script | The level is a deterministic policy the script owns, with weak gold | Q3, Q11 | Seam map S24 (digest) | DeepSeek parked it as later. Dropped here |
| 23 | A retrievability score on the post-save review | No retrieval gold, and an unvalidated number beside a calibrated 0.4 gate | Q1 | Seam map S25 (digest) | DeepSeek, MiMo |
| 24 | A second opinion on manual playbook verdicts | The human verdict wins by contract, and the latest transport run has 22 PASS and 0 FAIL | Q3, Q11 | Seam map S26, H8 (digest) | DeepSeek, MiMo |
| 25 | A new `cli-jev` hub mode, a `jev-judge` command or a new skill | The hub is one mode on purpose, the transport serves all four types and no decision is removed | Q6, Q13 | `hub-router.json:5-14`, `cli-usage/SKILL.md:162-174` | All three (C4, MiMo after cross-reading) |
| 26 | A measurement harness command family | A wrapper that only forwards to scripts | The red flag "a wrapper that only forwards arguments" | Repo-rules digest section 4 | MiMo |
| 27 | A shared Jev client helper now | Zero callers today, and it earns existence at the third | Q6, and "two is not a pattern" | Repo-rules digest section 2 | DeepSeek |
| 28 | A supercov smell command | The vendor publishes `duplicated_logic` near chance, and `deep_nesting` asks for a count | Q1, Q11 | supercov `properties.json:38-42` | Grok |
| 29 | Writing a Jev arm into the advisor ratchet baseline | The ratchet is pinned and deterministic, and a network arm is neither | Q8, and the red flag "a test re-baselined to get green" | `scorer-eval-baseline.json:5-12` | DeepSeek, MiMo (independent) |
| 30 | An answer cache during stability reruns | Identical cached answers make the flip rate zero by construction | Q1 | `benchmark-stability.cjs:20-28` | DeepSeek |
| 31 | A live Jev call in `detectCompletionClaim`, or done-gate authority | The check has a 1200 ms timeout and a spawn from OpenCode blocks the plugin host | Q7 | `completion-evidence-sentinel.cjs:90-94`, `:113-119` | DeepSeek, MiMo (C6) |
| 32 | PR-claims verification as a merge gate | The recipe is npm `jevctl` only, it has no gold and it sits in the sk-git flow | Q8, Q12 | npm `jevctl` `recipes.md:5-11`, `errors.ts:1-9` | MiMo |
| 33 | Dead end: Harness B as written, `run-benchmark.cjs --profile reviewer-regression --scorer 5dim --grader jev` | The profile disowns the 5dim path, and `--grader jev` silently becomes `mock` | Q2, a proof plan built on a wrong command | `reviewer-regression.json` note, `run-benchmark.cjs:571`, `:577`, `score-model-variant.cjs:211` | DeepSeek-08 proposed it, MiMo-08 caught it |
| 34 | Dead end: the reviewer fixtures as three-way grading gold | 8 cases, all `fail` and all recorded, while the regex already parses every verdict line | Q1 | Fixture census and regex replay | Digest H9, DeepSeek, MiMo (MiMo-05 found the single class) |
| 35 | Dead end: registry `transitions` as P0-survival gold | 45 findings entered as P0 and all 45 are still P0, so the gold has no negative class | Q1 | Census of 409 registries | MiMo-05 proposed it, refuted here |

---

## Divergence Map

**No divergent pivots happened.** The run set an empty `divergent` block and `convergenceMode` off, and every iteration took its assigned angle from `context/research-angles.md`. The merged registry's `ruledOutDirections` 0 and `iterationsCompleted` 0 are gaps in the merge, not evidence, because each lineage ruled directions out in its iteration markdown.

**Saturated directions.**

- Live calls inside hooks. All three dropped them on deadlines in wave 1, and every later wave reconfirmed that with no new evidence.
- No new surface. Waves 3 and 4 of all three lineages reach it.
- The offline routing arm as the first build. Every lineage's final order starts there, two of them after reading the third.
- Never a default score. All three in wave 1.

**Contested ideas.** Section 10, disagreements 1 to 7: the grader's seam and rank, the goal mode rank, the kill radius of a routing loss, free-first order, the stop and severity replays, in-place or new script and the defer log with spec-level flags.

**Failures.**

- DeepSeek-08's Harness B command and the reviewer-fixture D4 gold failed on the runner path.
- MiMo-05's transitions gold and MiMo-02's abstention arm failed on counts.
- MiMo-04's 181 lineages, Grok-02's H5 label and the digest's 11 cli-jev canary cases drifted.
- Grok's state log carries 11 timestamps after its run window and 1 with none, flagged by the runner.
- The merge wrote incomplete metrics and a resource map with 0 references.

**Remaining frontier.**

- The numbers R1 and R2 exist to produce: movable rows, the arm deltas, per-call latency and the goal heuristic's error rates.
- Gold nobody has built: regex-miss reviewer outputs, a D4 hallucination set, a human-scored reply subset, narrative-mined P0 rejections, a compaction fact set and a clarify gold.
- The completion sentinel's advisory log, which exists only in the main checkout.
- Seams no lineage examined: S12 git preflight and S21 executor demotion. S13 and S19 were examined by DeepSeek alone.

---

## 12. Open Questions

| # | Question | What would resolve it |
|---|---|---|
| 1 | How many held-out rows are movable, with the gold inside the cluster but not first? (`kq-eligible-rows`) | R1's census, zero calls |
| 2 | Does a Python `jev-cli` `choice` beat the scorer's order on those rows? | R1's arm with 3 reruns |
| 3 | What are the per-call latency p50 and p95 of the Python `jev-cli` here? (`kq-latency-p95`) | R1's per-call JSONL |
| 4 | How far does an R1 loss reach? | A second closed-set measurement on different inputs, R2's offline arm |
| 5 | What are the goal heuristic's error rates, and how many false `not_met` come from the blocking pattern? | R2's labeled set |
| 6 | Do live reviewer outputs miss the verdict line often enough for a classifier to matter? | One reviewer run on cases without `reviewer_output`, reading the `verdictMethod` counts |
| 7 | Do iteration narratives hold rejected-P0 downgrades usable as severity gold? (`kq-p0-positives`, partly answered: 45 P0-born findings exist and none was downgraded in `transitions`) | A mining pass over archived review iterations |
| 8 | Does the derived stop gold match the iteration prose? (`kq-gold-sanity`) | MiMo's five-lineage manual read |
| 9 | What is the completion sentinel's real false-fire rate? | Its advisory log in the main checkout, inside the 30-day window, plus labeled excerpts |
| 10 | How often do clarify outcomes happen in real use? (`kq-clarify-rate`) | A count of real clarify events, then a 30-row gold |
| 11 | Would a Jev pass break a provider prompt cache? (`kq-cache-breakage`) | Relevant only if a Pi history-pruning pass is proposed. A cache-hit comparison with and without the pass |
| 12 | What is the H2 rerank baseline today? | One local run of `score-outcome-rerank.mjs`, no Jev call |
| 13 | Can the provider and model be recorded per call from the Python `jev-cli` output, or only through `jev auth test`? | Reading one judgment's JSON output at build time |
| 14 | Is any routing corpus prompt private? | The corpus authoring history |
| 15 | Do git preflight (S12) and executor demotion (S21) have any Jev fit? | A look by any lens. The seam map rates both weak |

---

## 13. Proposed Build Phases

No separate measurement-only phase is needed first. R1's harness exists (H1 and H2), and R2's missing harness is its own first slice. Both phases go under `specs/cli-jev/003-cli-jev-workflow-integration/`.

### 002-advisor-jev-tiebreak-arm

| Field | Record |
|---|---|
| **Scope** | Measure, offline and by hand, whether a Python `jev-cli` `choice` over the advisor's near-tie cluster beats the scorer's own order. |
| **Recommendations** | R1. |
| **First slice** | The census with zero calls, then the arm on held-out rows with its per-call record. It measures movable rows, MRR and right@3 for both columns, stability over 3 reruns and per-call latency. |
| **Likely files** | New: `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-jev-tiebreak.mjs` (proposed name). Read only: `labeled-prompts.jsonl`, `holdout-prompts.jsonl` and the built `dist` scorer. |
| **Dependency** | None. The advisor `dist` must be built first. |
| **Rough size** | 150 to 200 LOC in one file. |
| **Observable check** | With no key set, the census prints eligible and movable counts. The baseline column reproduces holdout top-1 53/70. With a key, the report shows both columns on identical rows and the JSONL shows a wall time for every call. `git status` shows nothing outside the new script and its reports. |

### 003-goal-verifier-jev-shadow

| Field | Record |
|---|---|
| **Scope** | Give the goal verifier its first measured error rates on an operator-labeled set, then add an opt-in shadow `jev` mode to the OpenCode goal plugin only if an offline Jev arm clears the keep threshold. |
| **Recommendations** | R2. Its labeled set is also the input R4 needs later. |
| **First slice** | The labeled set and the heuristic baseline with zero calls, then the offline Jev arm under the wrapper rule. It measures a confusion table per arm, error attribution per heuristic check and stability. |
| **Likely files** | New: a labeled JSONL fixture and one offline scorer script beside `.skilled/hooks/goal/lib/` (proposed paths). Only if promoted: `.skilled/plugins/opencode-goal.js` (`:134`, `:231-234`), `.skilled/hooks/goal/goal-plugin.md` (`:52-53`) and the goal plugin tests under `.skilled/plugins/tests/`. |
| **Dependency** | None hard. The labels are the operator's to write. Soft: 002's per-call latency confirms the 30 s budget has room before the plugin mode. |
| **Rough size** | 30 to 50 labeled rows and 100 to 150 LOC, then 60 to 100 LOC for the plugin mode if promoted. |
| **Observable check** | The script prints both arms' confusion tables on the same rows. If promoted, a no-key session in `jev` mode reaches the same verdicts as `heuristic` mode, plus one log line per verification. |

**Do 002 first.** It is the smallest, everything it needs exists, it costs cents at vendor-claimed prices and it touches no shared contract. Its per-call latency record is also the one number every other Jev idea here waits on, including 003's plugin mode.

### Not phased (later), with what would promote each

| Item | Promote when |
|---|---|
| R3 advisor served forms | R1 keeps its win on held-out rows, and a cache producer is designed and accepted |
| R4 completion-claim audit | R2's labeled set exists and the regex cannot cut false fires without new misses |
| R5 reviewer verdict classifier | A reviewer run on cases without recorded output shows verdict-line misses |
| R6 reply-harness judge | A human-scored subset of about 20 masked replies exists |
| R7 D4 grader kind | A labeled D4 set exists and the silent `mock` fallback is fixed |
| R8 stop replay Jev arm | The local replay shows the heuristic stops later than the derived gold, and a five-lineage read confirms the gold |
| R9 confirm-mode suggestion | R8 yields a signal with precision of at least 0.9 |
| R10 severity replay | A narrative-mined gold holds at least 20 labeled P0 negatives |
| R11 compaction pass | A 10 to 15 transcript fact set exists, a budget-only arm leaves a gap and measured latency fits the hook |
| R12 clarify default | A clarify gold of 30 or more rows exists |
| R13 alignment suggestion | Enough archived below-50 saves with their final folder exist |
| R14 next-focus comparator | A focus gold exists |
| R15 fan-out pair record | A labeled near-line pair set exists |
| R16 injection screen | A hook that handles fetched web content exists |
| R17 PR-claims report | A Python `jev-cli` port and a labeled PR-claims corpus exist, and sk-git's owner asks for it |
| R18 `next_check` choice | A debug workflow caller line is named |

---

## 14. Citation Verification Ledger

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

**Tally:** 143 checked, 134 resolved, 4 drifted (rows 29, 99, 105 and 108) and 5 failed (rows 28, 55, 58, 59 and 103).

---

## 15. Evidence Quality and Caveats

**Independence.** Only wave 1 agreement counts as independent. Grok could see only DeepSeek's early iterations and never saw MiMo, so Grok's positions after iteration 4 lean on DeepSeek alone. DeepSeek's and MiMo's later positions lean on Grok's finished run.

**Timestamps.** Not used as evidence of anything, and order here comes from iteration numbers. The runner flagged Grok's state log: 11 of 13 records carry timestamps after the run window, from 16:20:00Z to 17:35:00Z against a window that ended at 16:17:02.808Z, and 1 record carries none (`research/orchestration-summary.json`).

**Self-reported novelty.** The newInfoRatio series are self-report and are kept here as telemetry only. Convergence mode was off, so none of them stopped a lineage.

- DeepSeek: `[0.85, 0.80, 0.75, 0.72, 0.70, 0.68, 0.62, 0.66, 0.64, 0.58]`
- MiMo: `[0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.5, 0.7, 0.7, 0.5]`
- Grok: `[1.0, 0.72, 0.70, 0.64, 0.58, 0.55, 0.52, 0.46, 0.40, 0.34]`

**Two packages.** Every recommendation uses the Python `jev-cli` 0.6.2, and none depends on npm `jevctl` 0.2.3 behavior. The lineage claims about `screen`, `verify`, `--fail-on`, `runScreen` and default-on compaction hold for npm `jevctl` only. Each lineage named the package correctly wherever I checked.

**Vendor claims and user reports, none reproduced here.**

- $0.042 per million input tokens and about 150 ms per answer (claude-jev `README.md:30-31`, vendor claim).
- About a cent per megabyte of source (supercov `quality.md:182-189`, vendor claim).
- A planted false positive kept at 0.57 (claude-jev `README.md:85-93`, vendor's own run).
- 5.6 s and $0.002 per compaction over three runs (Hermes post `:26-27`, user report).
- Context moving a harmless command from 0.22 to 0.58 (Pi post `:1121`, third-party report).
- `duplicated_logic` at 50.8% (supercov `properties.json:42`, vendor-published).

**Containment advisories.** There are three, one per lineage, from the runner's `containment_violation` events (`research/observability-events.jsonl`). Each lineage's quarantine manifest (`lineages/<label>/containment/quarantine/1/manifest.json`) lists exactly one path, `specs/cli-jev/003-cli-jev-workflow-integration/001-deep-research/scratch/synthesis-brief.md`. That file is the orchestrator's post-launch edit of this brief, not a lineage write. No advisory names any other file, so on the runner's record no lineage wrote outside its directory. At synthesis time `git status` in the worktree was clean at HEAD `d396d3cfc2`, the commit that recorded the fan-out after launch HEAD `2bbefcbdb7`.

**Other run events.**

- The runner raised a `stall_detected` warning for MiMo early in its run, after 300 s of quiet. MiMo still finished all 10 iterations.
- Both Pi lineages' `logs/fanout-lineage.err` hold one identical advisor-hook event: `fail_open` after 2504 ms, "CLI_RETRYABLE_UNAVAILABLE exit 75: CLI fallback timed out". It is one observation of the advisor's own hook at its deadline, not a measurement. Grok's error log is empty.
- DeepSeek's `research.md` section 9 says "the worktree carried unrelated uncommitted edits". That echoes the brief's wording before the orchestrator corrected it and is superseded: the worktree was clean at launch apart from `research/`.
- Grok's `research.md` says MiMo has no iteration files. That was true when Grok read and is superseded.

**Merge quality.** The two merged registries are byte-identical and hold 85 key findings (MiMo 55, Grok 22, DeepSeek 8). DeepSeek's and MiMo's state records carry no findings arrays, so DeepSeek is undercounted and its findings were read from iteration markdown. The merge metrics read `iterationsCompleted` 0 and `convergenceScore` 0, and `resource-map.md` lists 0 references beside 30 delta sources. None of these numbers is used as evidence here.

**Limits of this synthesis.**

- The agreement classes rest on each iteration's own sibling-check section.
- Three calls are my judgment and marked so: the kill radius, ranking R2 next where all three lineages ended at later and dropping the defer log and spec-level flags that two lineages parked.
- Not run: any `jev` call of either package, any test suite, `validate.sh`, `generate-context.js`, the H1 ratchet and the rerank eval. The H2 baseline, the census counts and every latency figure stay UNKNOWN.
- The read-only counts I did run are listed in section 2.
- The sentinel's advisory log was not read, because it exists only in the main checkout.

**Adjacent defects, reported and not fixed.**

- `run-benchmark.cjs:577` never validates `--grader`, and `score-model-variant.cjs:211` turns any kind other than `noop` or `llm` into `mock`. A requested `jev` grader today yields mock D4 scores with no warning.
- `opencode-goal.js:226-229` turns an unknown `OPENCODE_GOAL_VERIFIER` value into `heuristic` with no notice. This may be intended, but an operator who sets `jev` today gets no signal.

---

## 16. References

**Research inputs** (under `specs/cli-jev/003-cli-jev-workflow-integration/`)

- `001-deep-research/spec.md` and `001-deep-research/scratch/synthesis-brief.md`
- `001-deep-research/context/repo-rules-digest.md`, `seam-map.md`, `jev-material-digest.md`, `measurement-digest.md` and `research-angles.md`
- `context/ideas from michel kerkmeester.md`
- `001-deep-research/research/lineages/{deepseek,mimo,grok}/`: `iterations/iteration-001.md` to `iteration-010.md`, `research.md`, `deep-research-state.jsonl`, `findings-registry.json`, `deep-research-strategy.md`, `logs/` and `containment/quarantine/1/manifest.json`
- `001-deep-research/research/`: `findings-registry.json`, `deep-research-findings-registry.json`, `fanout-attribution.md`, `resource-map.md`, `orchestration-summary.json`, `observability-events.jsonl` and `deep-research-config.json`

**Skill advisor** (`.skilled/skills/system-skill-advisor/runtime/`)

- `scripts/routing-accuracy/`: `score-outcome-rerank.mjs`, `scorer-eval-baseline.json`, `capture-scorer-eval-baseline.mjs`, `derive-ambiguity-slice.mjs`, `labeled-prompts.jsonl`, `holdout-prompts.jsonl` and `ambiguity-prompts.jsonl`
- `lib/scorer/`: `ambiguity.ts`, `fusion.ts`, `lane-registry.ts`, `types.ts` and `projection.ts`
- `lib/shadow/shadow-sink.ts`

**Model benchmark and deep loop** (`.skilled/skills/system-deep-loop/`)

- `deep-improvement/scripts/model-benchmark/`: `run-benchmark.cjs`, `lib/reviewer-scorer.cjs`, `scorer/score-model-variant.cjs`, `scorer/grader/harness.cjs` and `scorer/grader/dispute.cjs`
- `deep-improvement/scripts/agent-improvement/benchmark-stability.cjs`
- `deep-improvement/assets/model-benchmark/benchmark-profiles/reviewer-regression.json` and `benchmark-fixtures/reviewer-schema.md`, `reviewer-ac-coverage.json`, `reviewer-over-read.json`, `reviewer-softened-fail.json` and `reviewer-stale-verdict.json`
- `runtime/scripts/convergence.cjs` and `runtime/scripts/fanout-merge.cjs`
- `runtime/lib/stopping-clocks/stopping-clock-shadow.ts`, `runtime/lib/next-focus/next-focus-selection.ts`, `runtime/lib/blinded-adjudication/README.md` and `runtime/lib/blinded-adjudication/mode-adapters.ts`
- `deep-research/scripts/reduce-state.cjs` and `deep-research/references/convergence/convergence-signals.md`
- `deep-review/references/protocol/completion-criteria.md`

**Spec-kit runtime** (`.skilled/skills/system-spec-kit/runtime/`)

- `hooks/claude/user-prompt-submit.ts`, `hooks/claude/compact-inject.ts`, `hooks/claude/shared.ts` and `hooks/claude/completion-evidence-stop.cjs`
- `lib/hooks/completion-evidence-sentinel.cjs`
- `tests/hook-precompact.vitest.ts`
- `cli/spec-folder/alignment-validator.ts`

**Goal hooks and plugin**

- `.skilled/plugins/opencode-goal.js`
- `.skilled/hooks/goal/goal-plugin.md`, `.skilled/hooks/goal/README.md`, `.skilled/hooks/goal/lib/goal-core.cjs`, `.skilled/hooks/goal/lib/goal-core.test.cjs`, `.skilled/hooks/goal/pi/goal-context.ts` and `.skilled/hooks/goal/cursor/goal-inject.mjs`

**Routing, guards and commands**

- `.skilled/bin/compiled-route.cjs`, `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/004-cli-external-orchestration/lib/router.cjs`, `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/resolve.cjs` and `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/*/fixtures/canary-cases.v1.json`
- `.skilled/hooks/task-dispatch/lib/dispatch-guard.cjs`, `.skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs` and `.skilled/hooks/spec-gate/pi/spec-gate-classify.ts`
- `.skilled/commands/deep/model-benchmark.md` and `.skilled/commands/deep/assets/deep-model-benchmark-auto.yaml`, `deep-model-benchmark-confirm.yaml` and `deep-research-confirm.yaml`
- `.skilled/skills/sk-communication/benchmark/reply-harness/README.md`
- `.claude/settings.json`

**cli-jev contract**

- `.skilled/skills/cli-jev/hub-router.json` and `.skilled/skills/cli-jev/SKILL.md`
- `.skilled/skills/cli-jev/cli-usage/SKILL.md` and `references/providers-and-models.md`, `references/cli-reference.md` and `references/integration-patterns.md`
- `specs/cli-jev/001-cli-jev-creation/context/jev-cli-main/src/jev_cli/__init__.py`

**Vendored material and posts** (under `specs/cli-jev/003-cli-jev-workflow-integration/context/`)

- `external repo's/claude-jev-main/`: `README.md`, `src/domain/question.ts`, `src/domain/catalog/review.ts` and `src/domain/catalog/hypotheses.ts`
- `external repo's/jev-cli-main/` (npm `jevctl`): `package.json`, `src/errors.ts`, `src/core/screen.ts`, `docs/recipes.md` and `plugin/hooks/fast-jev.ts`
- `external repo's/pi-jev-context-main/`: `README.md`, `src/index.ts` and `src/context.ts`
- `external repo's/jev-review-main/src/review/workflow.ts`
- `external repo's/supercov-main/`: `docs/quality.md` and `crates/supercov-cli/src/quality/properties.json`
- `social posts/Reddit - Integrated the Jev context engine into Hermes.md` and `social posts/Reddit - I think i found the best use case for JEV and PI.md`

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
