# Iteration 1: Deep-Loop Baseline Map + Q1/Q2 Anchors + Q6 Confirmation

## Focus
Establish a code-anchored baseline of the deep-loop runtime convergence/contradiction/fan-out/cost machinery, anchor Q1 (flood-resistant convergence) and Q2 (contradiction quarantine) against the aionforge attestation + consolidation docs, and directly CONFIRM the Q6 reducer-anchor template gap. Reconnaissance only — no implementations.

Selected interpretation note: the dispatch named `external/aionforge-memory-development/docs/...` at repo root, but those docs live under the parent spec folder `028-memory-search-intelligence/external/...`. I used the parent-scoped path (file:line below) rather than failing on the missing repo-root path.

## Actions Taken
1. Read `deep-research-strategy.md` (Q1-Q7 + Known Context) and `deep-research-config.json` (threshold 0.03, 10 iterations, lineageMode `new`); verified packet boundary (iterations/ + deltas/ empty, no overwrite risk).
2. Located all target modules under `.opencode/skills/deep-loop-runtime/` via `find`.
3. Read `lib/deep-loop/bayesian-scorer.ts`, `scripts/convergence.cjs`, `lib/coverage-graph/coverage-graph-signals.ts`, `lib/coverage-graph/coverage-graph-query.ts` (findContradictions), `lib/council/adjudicator-verdict-scoring.cjs`, `lib/council/cost-guards.cjs`, `scripts/fanout-salvage.cjs`.
4. Read reducer `replaceAnchorSection` (`deep-loop-workflows/deep-research/scripts/reduce-state.cjs:699-714`, anchor wiring `:734-745`) and grepped the shipped template `assets/deep_research_strategy.md` for ANCHOR markers (count = 0).
5. Read aionforge `attestation-and-promotion.md` (Beta posterior) and `consolidation.md` (quarantine + transient/fatal + gauges).

## Findings [file:line]

### Convergence scoring (Q1)
1. The composite convergence score is computed in `scripts/convergence.cjs:107-141` (`computeCompositeScore`). For `research` (L111-122) it is a fixed-weight linear blend: `questionCoverage*0.30 + claimVerificationRate*0.25 + (1-contradictionDensity)*0.15 + normalizedDiversity*0.15 + normalizedDepth*0.15`. [SOURCE: scripts/convergence.cjs:111-122]
2. The underlying signals are pure structural counts/ratios, NOT trust-weighted: `computeResearchQuestionCoverageFromData` counts questions with `>= 2` ANSWERS edges (`coverage-graph-signals.ts:295-315`); `contradictionDensity = CONTRADICTS_edges / all_edges` (`:356-367`); `sourceDiversity` averages distinct `quality_class` strings (`:378-416`); `evidenceDepth` scores 2 if a finding cites >=1 source else 1 (`:427-450`). No per-finding reliability or attester weight enters any signal. [SOURCE: coverage-graph-signals.ts:295-450]
3. `bayesian-scorer.ts` is NOT the convergence scorer — it is a Laplace-smoothed model-demotion helper: `computeScore = (success+1)/(total+2)` (`:13-25`) and `shouldDemote = score<0.5 && totalCalls>=3` (`:35-44`). It tracks executor success rate by raw vote count and is not wired into `convergence.cjs`'s composite score. [SOURCE: bayesian-scorer.ts:13-44; absence: no import of bayesian-scorer in convergence.cjs:1-54]
4. Q1 HYPOTHESIS (inference): convergence today IS vote-count-floodable. Coverage requires only `>= 2` ANSWERS edges per question regardless of source reliability (`coverage-graph-signals.ts:309`), and a flood of weak findings citing many low-quality sources can inflate `questionCoverage`, `sourceDiversity` (distinct quality_class), and `evidenceDepth` while `contradictionDensity` stays low — none of which are bounded by attester quality. [INFERENCE: based on Finding 2 + the absence of any reliability term in the research signals]

### aionforge Q1 mapping
5. aionforge confidence is a **bounded reliability-weighted Beta posterior**: each attester contributes reliability `r in [0,1]` (`r` toward correct, `1-r` against) over a prior; "every attester adds exactly one to the denominator, the confidence settles toward the average quality of the attesters and can never be pushed to certainty by sheer numbers" — the explicit flood-resistance property. Hard ceiling: `k` attesters cannot push past `(alpha + k)/(alpha + beta + k)`. [SOURCE: 028.../external/aionforge-memory-development/docs/attestation-and-promotion.md:30-52]
6. Reliability is read, never written, by this layer; an unknown agent contributes the uninformative `0.5` (cold-start: nothing promotes). [SOURCE: attestation-and-promotion.md:60-67]

### Contradiction handling (Q2)
7. `findContradictions` (`coverage-graph-query.ts:221-252`) only SELECTs CONTRADICTS edge pairs and returns both endpoints with names/weights — no quarantine, no trust comparison, no suppression of a "loser." [SOURCE: coverage-graph-query.ts:221-252]
8. Contradictions affect convergence only symmetrically: research `contradictionDensity` raises a blocker when density > 0.15 (`convergence.cjs:203,216-218`); review `findingStability` counts any finding touching a CONTRADICTS edge as unstable (`coverage-graph-signals.ts:511-522`). Both contradicting findings stay live — neither side is retired or excluded from recall. [SOURCE: convergence.cjs:216-218; coverage-graph-signals.ts:511-522]
9. Q2 HYPOTHESIS (inference): contradictions are DROPPED into a symmetric penalty, not quarantined. There is no notion of a lower-trust victim being excluded while the higher-trust side survives. [INFERENCE: Findings 7-8]

### aionforge Q2 mapping
10. aionforge: a contradiction names a deterministic victim — "the lower-trust side is the victim, deterministically." It is *recorded* always but *quarantined* only when either side >= `high_trust_threshold` (default 0.7); quarantine flags the victim, raises a `Quarantine` audit event, and the recall path **excludes the contradiction's source by edge presence so a quarantined value does not surface as current — but nothing is destroyed** (node + CONTRADICTS edge retained). [SOURCE: consolidation.md:119-153]

### Fan-out recovery (Q3, partial)
11. `fanout-salvage.cjs:runSalvageSweep` (`:69-141`) is post-hoc *file* recovery: after a lineage subprocess exits, for each iteration in the state log lacking a non-empty `.md`, it recovers text from captured stdout (`extractTextFromOpencodeJson:26-52`) and appends a `salvaged_from_stdout` event, else writes a `fanout_salvage_failed` placeholder marker. No transient/fatal classification, no per-branch durable retry budget. [SOURCE: fanout-salvage.cjs:69-141]
12. aionforge Q3 mapping: pass failures are CLASSIFIED — `PassError::Transient` (down embedder/rate-limit/timeout) leaves the episode `raw` to retry as oldest-pending; `PassError::Fatal` or transient-exceeding-`max_retries` (default 5) marks `failed`, retained+audited, and the attempt count is read from the durable `consolidation_failed` audit trail "not held in memory, so a crash does not hand a failing episode a fresh retry budget on every restart." [SOURCE: consolidation.md:54,61-68]

### Council adjudicator + cost guards (Q2 weighting, Q4)
13. `adjudicator-verdict-scoring.cjs:scoreVerdictDelta` (`:118-146`) scores round-to-round verdict STABILITY across 5 change-magnitude dimensions (option_changed 0.35, confidence_delta 0.20, risk_jaccard_delta 0.20, axis_flip_rate 0.15, blocking_delta 0.10); `stable` when delta <= 0.2. No seat-reliability weighting — every seat's verdict shift counts equally. [SOURCE: adjudicator-verdict-scoring.cjs:16-22,118-146]
14. `cost-guards.cjs` ceilings are pure counts (`max_rounds_per_topic:3, max_topics_per_session:5, seats_per_round:3, saturation_threshold:0.2`, `:15-20`); `evaluateCouncilCostGuards` (`:114-140`) stops on count limits + saturation + 2 consecutive stable rounds. No live lag/pending/failed backpressure gauges. [SOURCE: cost-guards.cjs:15-20,114-140]
15. aionforge Q4 mapping: per-tick observability emits `consolidation_lag_seconds`, `consolidation_episodes_pending`, `consolidation_episodes_failed` plus per-tick supersession/contradiction/quarantine counters — observable backpressure the cost guards lack. [SOURCE: consolidation.md:194-197]

### Q6 reducer-anchor gap — CONFIRMED REAL BUG
16. The reducer requires 7 anchored sections: `updateStrategyContent` (`reduce-state.cjs:734-745`) calls `replaceAnchorSection` for `key-questions`, `answered-questions`, `what-worked`, `what-failed`, `exhausted-approaches`, `ruled-out-directions`, `next-focus`. `replaceAnchorSection:699-714` builds regex `<!-- ANCHOR:${id} -->[\s\S]*?<!-- /ANCHOR:${id} -->` and **throws `Missing anchor section ${anchorId} in strategy file` (`:709-711`)** if the pattern is absent. [SOURCE: reduce-state.cjs:699-714,734-745]
17. The shipped template `deep-loop-workflows/deep-research/assets/deep_research_strategy.md` has all 13 section headings (`## 1.`..`## 13.`) and a `<!-- MACHINE-OWNED: START -->` marker (`:61`) but **ZERO `<!-- ANCHOR:* -->` markers** (grep `ANCHOR:` count = 0). A freshly-copied strategy therefore makes the reducer throw `Missing anchor section key-questions in strategy file` on the FIRST reduce after iteration 1. [SOURCE: assets/deep_research_strategy.md grep ANCHOR: -> 0; headings at :19,34,39,46,51,56,62,68,74,88,94,100,105]
18. Self-evidence corroboration: this session's working `research/deep-research-strategy.md` DOES carry the 7 anchor pairs (`:24,33,47,50,55,58,62,65,69,72,76,79,83,86`) — the driver hand-patched them after hitting the throw, matching the Known Context firsthand-hit note. [SOURCE: 004-deep-loop/research/deep-research-strategy.md:24-87]

## Questions Answered
- **Q6 — ANSWERED (confirmed real bug).** The shipped `deep_research_strategy.md` template lacks all 7 `<!-- ANCHOR:* -->` marker pairs that `reduce-state.cjs replaceAnchorSection` requires; a fresh copy hard-fails `Missing anchor section key-questions in strategy file` on the first reduce. **Fix (one structural edit):** wrap each of the 7 machine-owned headings in the template with its anchor pair, i.e. insert `<!-- ANCHOR:key-questions -->` immediately before `## 3. KEY QUESTIONS (remaining)` and `<!-- /ANCHOR:key-questions -->` after that section's body, and likewise for `answered-questions` (§6), `what-worked` (§7), `what-failed` (§8), `exhausted-approaches` (§9), `ruled-out-directions` (§10), `next-focus` (§11) — mirroring the already-correct shape in this session's `research/deep-research-strategy.md:24-87`. (Optionally also relocate `<!-- MACHINE-OWNED: START -->` to bracket §7-§11 as in the working file.)

## Questions Remaining
- **Q1** — anchored, not closed: confirmed convergence is structural/count-based and (hypothesis) floodable; need to (a) confirm no reliability term exists anywhere upstream (upsert/metadata), (b) map exactly where a bounded reliability-weighted term could fold into `computeCompositeScore` / the research signals.
- **Q2** — anchored, not closed: confirmed symmetric contradiction penalty with no quarantine; need to confirm whether any recall/exclusion-by-edge path exists and where a trust-keyed victim-exclusion would attach.
- **Q3** — partially anchored: salvage is file-recovery only; need the fan-out router (`fanout-run.cjs`/`fanout-pool.cjs`) to see whether branch state is durable enough for transient/fatal retry-from-state.
- **Q4** — anchored: count ceilings, no live gauges; need to confirm there is no existing telemetry sink.
- **Q5** — untouched: galadriel threaded ambient reflection + prompt-pack injection (`lib/deep-loop/prompt-pack.ts`).
- **Q7** — untouched: 001 determinism primitives reuse.

## Next Focus
Iteration 2: (a) Read `lib/deep-loop/prompt-pack.ts` + the fan-out router (`scripts/fanout-run.cjs`, `fanout-pool.cjs`) to anchor Q3 (durable branch state) and Q5 (prompt-pack injection / cross-iteration continuity). (b) Trace where node/edge metadata is written (`upsert.cjs`) to confirm whether ANY reliability/trust field already exists that a Beta-posterior term could read — closing the Q1 "where does the score get computed and could a reliability weight fold in" sub-question. (c) Read galadriel threaded-reflection doc to anchor Q5.
