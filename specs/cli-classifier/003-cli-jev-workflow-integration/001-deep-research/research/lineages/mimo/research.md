---
title: "Jev typed judgments in .skilled: what the operator notices and what can be proved (mimo lineage synthesis)"
trigger_phrases: []
---
# Jev typed judgments in .skilled: what the operator notices and what can be proved (mimo lineage synthesis)

**Lineage:** `mimo` (UX and measurement lens)
**Session:** `fanout-mimo-1790438758756-5mso8j`
**Loop:** `research`, 10 iterations, `stopPolicy: max-iterations`, `stopReason: maxIterationsReached`
**Artifact root:** `specs/cli-jev/003-cli-jev-workflow-integration/001-deep-research/research/lineages/mimo`
**Package note:** every `jev` here means the Python `jev-cli` 0.6.2 that `.skilled/skills/cli-jev/cli-usage/` wraps. The vendored npm `jevctl` 0.2.3 is research material only.

## 1. Executive summary

Jev earns a place in this repository as measurement before product. Every operator-facing surface found here is gated on a number nobody has recorded yet, and three of the four steps that produce those numbers cost zero Jev calls. The first build is therefore not an integration: it is two local censuses, one operator-labeled excerpt set, one fixture expansion and one offline replay harness. The first billed call buys the single most leveraged number in the research: per-call latency, which decides whether the deadline-dropped hook shapes are dead or alive.

The operator-facing verdict: exactly three surfaces remove a decision rather than adding one (a confirm-mode stop suggestion, a survival-ordered P0 reread, done-gate advisory suppression), and each stays hidden until its measurement gate passes. No new skill, command or hub mode earns existence. Money is not a factor at vendor-claimed prices; privacy is. Every call sends state verbatim off the machine, and the two replay arms send repository internals.

## 2. Answers to RQ1 to RQ7 (this lens)

**RQ1, grading AI responses.** One grading use changes a decision: a `jev` grader arm on the model-benchmark seam (`score-model-variant.cjs:207-226` factory, opened), because the D4 hallucination dimension is `mock` or `noop` today (`run-benchmark.cjs:577`, opened) and the keep-or-revise decision currently rests on an unmeasured dimension. Its gold is the reviewer fixtures' hidden oracle (`reviewer-schema.md:59-68`, opened), but that gold is 8 cases of one class and the fixtures' profile routes through `--scorer reviewer`, not the 5dim factory (both confirmed this lineage, iterations 5 and 8). Uses dropped because nobody acts on the grade: live per-turn reply grading, playbook verdict grading, per-turn grade displays. The reply-harness blinded judge (`reply-harness/README.md:11,20`, opened) is the second keep, gated on a human-scored subset.

**RQ2, skill advisor.** There is measurable headroom but its size is UNKNOWN: the recorded baselines cap a tie-break at 6 rows on the ambiguity slice (18/24) and 17 on the holdout (53/70) (`scorer-eval-baseline.json:25-35`, opened), and nobody has counted the near-tie rows, which is the free census. The arm design is an offline `jev choice` over margin-eligible rows, holdout as headline, never served, never recaptured into the deterministic ratchet (`scorer-eval-baseline.json:8-12`). A separate abstention arm targets the 13 unknowns and 5 false fires, which the rerank loader cannot even score (`score-outcome-rerank.mjs:47`, opened). What the operator sees on disagreement: nothing during measurement; afterwards at most a suggested order inside the existing `ambiguousWith` cluster (`ambiguity.ts:44-58`, opened).

**RQ3, goal hooks.** A Jev `choice` (`met`, `not_met`, `unclear`) beside `verifyGoalHeuristic` (`goal-core.cjs:586-620`, opened) would target the felt failures: spurious nudges and drift, since the verdict drives an observe-only nudge and a `last_check` line (`goal/README.md:77`, opened) the operator never reads directly. It is `later`: no labeled transcripts exist (30 to 50 operator-labeled excerpts is the smallest set), grok's wrapper rule binds it (blocking-pattern match means `not-met`, Jev not asked), and it ships default OFF with the heuristic authoritative.

**RQ4, compaction.** Later, on two named gaps: a transcript-plus-must-survive-facts set (10 to 15 transcripts) and the unmeasured prompt-cache breakage cost. The precompact tests check mechanics, not survival (`hook-precompact.vitest.ts:29-60`, opened). The in-hook shape is dead at current evidence (1800 ms internal versus an unmeasured call), with the mimo-09 lever caveat: measured p95 latency can reopen it. The cheaper move first: enlarging the token budget (`shared.ts:12-14`) before any judge is bought.

**RQ5, cross-cutting judgment points.** Today's typed judgments and where Jev could second them: loop stop (three weighted signals, `convergence-signals.md:41-47`, opened; gold derivable free from deltas, iteration 4), finding severity (adjudication derivable from registry `transitions`, iteration 5), completion claims (regex with `occurred`/`happened` false-fire words, `completion-evidence-sentinel.cjs:64`, opened), routing clarify and defer (13 gold rows total, iteration 6), validation triage (Gate 3 at F1 0.9843, no headroom as product). Jev makes each of these measurable cheaper and more accurately than today's unmeasured state; it makes none of them more accurate than the current judge until a replay says so. Authority transfers (stop decision, severity write, verdict replacement) are dropped on cross-lens grounds.

**RQ6, new surfaces.** None. The transport posture and the UX test agree: a `jev-judge` command or second hub mode adds routing without removing a decision (deepseek-07's wiring finding, this lens's UX finding). What is worth building are three workflow-step surfaces: the confirm-mode stop suggestion, the P0 reread order, the done-gate suppression. From the vendored integrations, the patterns carry (policy-in-code, fail-open to stock, missing-is-error, content-hash cache, estimate-before-send, egress warning, shadow-before-serve) and the surfaces do not (MCP server, function hooks, `screen` gates, smell catalogues).

**RQ7, cost and restraint.** Money: cents a day at vendor-claimed prices (marked vendor claims throughout; supercov's measured rows suggest about a cent per MB of source, `quality.md:182-189`, opened). Latency: unmeasured, and it is the gate on the deadline-dropped shapes. Privacy: the real cost; replays send repository internals (`SKILL.md:76-77,209`, opened), the goal shadow would be standing conversation egress with pi-jev's enablement warning as the mandatory announcement pattern (`pi-jev-context-main/README.md:37`, opened). Failure modes: exit 3/4/malformed/slow/wrong-package all map to "skip and say so", never a default score. Build order: free numbers first (census, labels, fixtures, local replay), then the routing arm with its latency record, then the replays, then nothing until a threshold is met.

## 3. Ranked recommendations (mimo lens)

Verdicts measure against the mimo-08 proof plans. Seam citations are repo-relative `file:line`, marked opened-this-lineage or digest-attributed.

### Build now

1. **Routing tie-break arm (offline `jev choice` on near-tie rows).** Seam: `scripts/routing-accuracy/` beside `score-outcome-rerank.mjs:33-38` (opened). Value: settles the closed-set `choice` family's fate on the one harness with recorded baselines. Metric/baseline/harness: held-out MRR and right@3 against the similarity-only arm (holdout 53/70), stability coefficient 0.95 over 3 reruns (`benchmark-stability.cjs:20-28`, opened); H1/H2. Cost/latency/privacy: 100 to 300 billed calls per evaluation (cents, vendor arithmetic), offline, synthetic prompts; the per-call JSONL doubles as the latency probe. Opt-in/no-key: script flag; no key means phase 0 census only, arm reports skipped. Smallest slice: the census phase first (0 calls), then one script `score-jev-tiebreak.mjs` (~150-200 LOC), no shared-contract change. Verdict: **build-now** — it is the only idea whose harness and baselines exist today. Confidence: confirmed for corpus and baselines (opened); inferred for any gain.
2. **Stop replay harness (recorded versus heuristic versus Jev stops over archived lineages).** Seam: 181 replay-eligible lineage state logs and deltas (counted, iteration 4). Value: the first measurement of the current stop model itself; gates every stop idea. Metric/baseline/harness: iterations saved at zero first-appearance-source loss; baseline is the heuristic's replayed curve; H11 gap filler. Cost: local arms free; Jev arm 125 to 250 calls on a 25-lineage sample; archived findings leave the machine (high sensitivity, strip and announce). Opt-in/no-key: replay flag; no key runs the two local arms and says the Jev column is skipped. Smallest slice: one replay script (~150-250 LOC), corpus filter, derived gold from deltas. Verdict: **build-now, second** — free gold, and if the heuristic already stops at gold every stop idea dies cheaply. Confidence: confirmed corpus and record fields (opened); the derived gold's fidelity is inferred, check 4 of its proof plan.
3. **Severity replay arm (offline `jev score` against adjudicated gold).** Seam: archived `deep-review-findings-registry.json` `severity` + `transitions` (opened). Value: measures whether a Jev severity call can shrink the P0 reread pass. Metric/baseline/harness: P0-survival recall (keep threshold 0.9) plus reread reduction (keep threshold 30%); baseline is rereading 100% of post-replay P0s; H14 adapter keeps the arm blinded. Cost: 69 to a few hundred calls; finding evidence leaves the machine (high sensitivity). Opt-in/no-key: replay flag, skipped column with no key. Smallest slice: transitions miner plus replay (~150-250 LOC), after the free P0 census shows at least 20 surviving positives. Verdict: **build-now, third, census-gated.** Confidence: confirmed gold shape and P0 sparsity in the sample (opened); recall claim inferred.

### Next (gated on measurements above)

4. **Done-gate advisory suppression.** Seam: `completion-evidence-sentinel.cjs:64,70` (opened). Value: fewer false advisories for the operator. Metric: false-fire rate on the shared 30-50 excerpt set, threshold 0.10; the cheapest fix wins and a regex change with zero Jev code is a passing outcome. Opt-in/no-key: the sentinel's kill switch; no key is today's regex. Smallest slice: the labeled set, then measurement, then possibly one regex constant changed in its two mirrored copies. Verdict: **next.** Confidence: confirmed regex words and 1200 ms budget; false-fire rate inferred.
5. **P0 reread order in review reports.** Seam: the review report's registry section (`completion-criteria.md:48`, opened in iteration 5). Value: fewer P0s to reread, early-stop possible. Metric: recall 0.9 and reduction 30% (thresholds proposed and fixed before build). Opt-in/no-key: registry order stays the default. Smallest slice: report ordering after arm 3 meets thresholds. Verdict: **next,** conditional. Confidence: inferred operator behavior.
6. **Confirm-mode stop suggestion.** Seam: the deep-research confirm workflow step (workflow-owned). Value: pre-annotated continuation decisions on exhausted loops. Metric: suggestion precision 0.9 plus one iteration saved on 20% of lineages. Opt-in/no-key: the line never appears without calibration. Smallest slice: one evidence line reading replay output. Verdict: **next,** conditional on recommendation 2. Confidence: inferred.

### Later (parked on named gaps)

7. **Goal verifier shadow** — parked on the labeled set, grok's wrapper rule and the latency number; default OFF, heuristic authoritative. Seam `goal-core.cjs:586-620` (opened).
8. **Clarify suggested default** — parked on a 30-plus-row clarify gold build and a clarify-rate count (today: 3 rows). Seam S06 (digest-attributed).
9. **Compaction keep-or-drop pass** — parked on a transcript/fact set and the cache-cost measurement; the token-budget move is cheaper and comes first. Seam S14 (digest-attributed).
10. **Second-rater novelty column** — parked on the stop replay's disagreement analysis; a dashboard column is a report before it is anything else.
11. **Defer shadow recording** — parked on gold and on an answer to who reads the log.
12. **PR-claims verify step** — parked on a labeled corpus and a Python-contract port; advisory only, never a merge gate.

### Drop

- Live per-turn reply grading (per-turn cost and attention tax, no gold).
- Playbook verdict grading (the human verdict wins by contract; H8 has no quality score).
- Done-gate authority, severity writes, Jev input to the STOP decision (authority before measurement; one-lens rule; cross-lens agreement with grok's kill criteria).
- Gate 3 as product (F1 0.9843, no headroom, policy-owned question). Its corpus stays as a negative control.
- A `jev-judge` command or second hub mode; a harness command wrapper; smell catalogues; save-flow signals (S24/S25); per-turn grade displays.
- In-hook live calls at current latency evidence (mimo-09's lever can revive).

## 4. Measurement program at a glance

Free first: routing eligible-row census, P0 corpus census, the shared 30-50 excerpt set (operator labels), reviewer-fixture class expansion (pass and block cases), stop replay local arms. Then cents: routing arm phase 1 with the latency and cost record (gap row 1), stop replay Jev arm, severity replay, done-gate measurement, grader agreement runs. Every arm: package probe first (`jev --version` expecting 0.6.2), provider and model recorded, egress announced before the first call (pi-jev warning + supercov estimate and dry-run), unmeasured rows on any failure, never a default score.

## 5. Cross-lens status for the merger

Agreement after cross-reading (not independent): routing arm first (all three lineages), in-hook deadline drops (deepseek-09 plus this lens), goal mode demoted to later (grok-08's contest, this lens's labeled-set design), no new surface (deepseek-07 wiring grounds, this lens's UX grounds), STOP authority dropped (grok-04's one-lens argument, this lens's serve-after-measure rule). Contests this lineage raises: the grader's gold is 8 single-class cases and its run command is disowned by the fixture profile (deepseek-08/10's Harness B must pass two checks before its number is quotable); the free-first ordering (sibling orders start with a billed arm). Unique to this lens: the derived-gold replay design over 181 lineages, the transitions-derived severity gold with its P0 sparsity, the tau 0.03 versus 0.05 eligibility mismatch, the silent-0.0 grader exception path, the shared labeled set serving two seams, the latency probe as the revive gate, and the payload sensitivity classification.

## 6. Boundary

This lineage wrote only inside its artifact root. No spec writeback, no continuity save, no validation run, no test suite, no git operation, no live `jev` call. Every claim above carries its citation; those marked opened were read in this lineage's iterations, the rest are attributed to the digests or sibling lineage files that named them.
