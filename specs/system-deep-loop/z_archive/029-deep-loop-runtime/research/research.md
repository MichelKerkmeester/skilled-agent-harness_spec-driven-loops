# Research Report: Deep Loop Runtime — External Mining

> Consolidated synthesis of iterations 001–004. Mines AIONFORGE (Beta-posterior attestation,
> CONTRADICTS-edge quarantine, transient/fatal consolidation recovery, observability gauges,
> bi-temporal status mirror) and GALADRIEL (threaded ambient reflection) for improvements to the
> deep-loop runtime under `.opencode/skills/deep-loop-runtime/` and
> `.opencode/skills/deep-loop-workflows/`. Every candidate and file:line seam is preserved.
> Claims are marked **[CONFIRMED]** (direct read) or **[INFERRED]** (reasoned, names what would confirm).

---

## Executive Summary

The deep-loop research convergence verdict is a **[CONFIRMED]** fixed-weight linear blend
(`convergence.cjs:115-121`) whose two volume terms (`normalizedDiversity`, `normalizedDepth`)
saturate on raw COUNT with no reference to source quality — making STOP **vote-count-floodable**:
a flood of weak, mutually-citing findings monotonically drives the score toward STOP with no
asymptotic reliability bound. A Beta-mean helper (`bayesian-scorer.ts:13-44`) ships but is
**unwired** into convergence and is parameterized by integer counts, not per-source reliability.
The **keystone** is a single derived **D2 reliability signal** read (read-only, no schema
migration) off the existing `upsert.cjs` `metadata`/`weight` slot (`:179`,`:224`) — the shared
substrate that Q1 (flood-resistant convergence), Q2 (trust-keyed contradiction quarantine), and
Q7 (reliability-aware ranking) all consume; design once, use three times. Independent of all that,
there is a **near-zero-effort correctness FIX to ship first**: the **reducer-anchor template bug**
— the shipped `deep_research_strategy.md` template carries **zero** `<!-- ANCHOR:* -->` markers,
but `reduce-state.cjs` (`:699-745`) requires all 7, so a freshly-copied strategy hard-fails
`Missing anchor section key-questions` on the first reduce. **Build order: Q6-anchor FIX → D2 → D3
→ Q2 → D1.** This session's own driver hit the Q6 bug firsthand and hand-patched its strategy.md.

---

## Internal Baseline (file:line)

All entries **[CONFIRMED]** by direct read in the cited iteration unless marked otherwise.

- **Convergence blend — fixed-weight, floodable.** `computeCompositeScore`
  (`convergence.cjs:107-141`); the `research` branch (`:115-121`) is a flat linear sum:
  `questionCoverage*0.30 + claimVerificationRate*0.25 + (1-contradictionDensity)*0.15 +
  normalizedDiversity*0.15 + normalizedDepth*0.15`. `normalizedDiversity = min(sourceDiversity/3.0,
  1.0)` (`:112`) and `normalizedDepth = min(evidenceDepth/5.0, 1.0)` (`:113`) both saturate to their
  0.15 ceiling on raw COUNT (3 sources / 5 evidence items) with no source-quality reference.
  `claimVerificationRate` (`:117`) is a ratio any self-citing finding satisfies. No asymptotic
  reliability bound exists. [CONFIRMED iter-1 F1-2, iter-3 F1]
- **Underlying signals are pure structural counts, NOT trust-weighted.**
  `computeResearchQuestionCoverageFromData` counts questions with `>=2` ANSWERS edges
  (`coverage-graph-signals.ts:295-315`, gate at `:309`); `contradictionDensity = CONTRADICTS_edges
  / all_edges` (`:356-367`); `sourceDiversity` averages distinct `quality_class` strings
  (`:378-416`); `evidenceDepth` scores 2 if a finding cites ≥1 source else 1 (`:427-450`). No
  per-finding reliability or attester weight enters any signal. [CONFIRMED iter-1 F2]
- **Unwired Beta-scorer.** `bayesian-scorer.ts:13-44` is a Laplace-smoothed model-DEMOTION helper:
  `computeScore = (success+1)/(total+2)` (`:13-25`), `shouldDemote = score<0.5 && totalCalls>=3`
  (`:35-44`). It is exported but **never imported** by `convergence.cjs` (grep-confirmed absence),
  and its integer-count signature cannot express per-source fractional reliability `r∈[0,1]`.
  [CONFIRMED iter-1 F3, iter-3 F2]
- **Contradictions listed, not quarantined.** `findContradictions`
  (`coverage-graph-query.ts:221-252`) SELECTs CONTRADICTS edge pairs (`:225-251` pulls `e.weight,
  e.metadata, s.name, t.name`) and returns both endpoints as a symmetric `ContradictionPair` — no
  victim selection, no trust comparison, no suppression. The trust inputs are in scope but unused
  for keying. [CONFIRMED iter-1 F7, iter-4 F-Q2a]
- **Symmetric contradiction penalty.** Both contradicting findings stay live and penalize each
  other equally. Research `contradictionDensity` trips a blocker above 0.15
  (`convergence.cjs:203,216-218`); `findingStability` counts any FINDING touching a CONTRADICTS
  edge as unstable via an `OR` over `source_id`/`target_id`
  (`coverage-graph-signals.ts:511-522`) — so a weak finding contradicting a strong one drags the
  strong one's stability down too. [CONFIRMED iter-1 F8, iter-4 F-Q2b]
- **Upsert metadata/weight slot — no-migration reliability carrier.** `upsert.cjs` threads a
  free-form `metadata` field onto nodes (`:179`) and edges (`:226`) through to `batchUpsert`
  (`:241`); the only structured numeric edge attribute is `weight` via `clampWeight(e.weight ??
  1.0)` (`:224`). A per-source `reliability` field can ride in `metadata.reliability` or reuse
  `weight` with zero schema migration — though no current writer populates a reliability value.
  [CONFIRMED iter-2 F16, iter-3 F4]
- **Fan-out ledger — observability-only, no retry/classification.** `fanout-run.cjs:376` opens
  `orchestration-status.log`; the pool emits `started`/`completed`/`failed` JSONL with
  `duration_ms` (`fanout-pool.cjs:81-117,235-238`) and a final `orchestration-summary.json`
  (`fanout-pool.cjs:207-220`, `fanout-run.cjs:495-502`). But `runCappedPool` dispatches each item
  exactly once (`nextIndex += 1`, no requeue, `fanout-pool.cjs:174-194`); `settleItem` records one
  terminal `rejected` (`:100-118`); the worker collapses every non-zero/timed-out CLI exit into one
  undifferentiated `throw` carrying `{exitCode, timedOut}` (`fanout-run.cjs:472-489`), with
  `timedOut` (`signal === 'SIGTERM'`, `:473`) the only distinguishing flag and it is unused for
  retry gating. No transient/fatal split, no durable per-branch retry budget. [CONFIRMED iter-2
  F1-4]
- **Advisory cost guards — count caps, no enforcement, no live gauges.**
  `DEFAULT_COUNCIL_COST_GUARDS = {max_rounds_per_topic:3, max_topics_per_session:5,
  seats_per_round:3, saturation_threshold:0.2}` (`cost-guards.cjs:15-20`).
  `evaluateCouncilCostGuards` only RETURNS `{continue_allowed, stop_reasons, upper_bound}`
  (`:114-140`) — never aborts/throws; honoring the stop is the caller's job. Signals are static
  counts + a verdict-delta saturation check (`:122-133`); `computeCouncilCostUpperBound`
  (`:83-90`) pre-computes worst-case budget but nothing meters live consumption. No
  lag/pending/failed gauge. [CONFIRMED iter-1 F14, iter-2 F7-9]
- **Stateless prompt-pack.** `renderPromptPack` reads a template and substitutes `{var}` tokens
  from a `variables` map, throwing `PromptPackError` on any missing token (`prompt-pack.ts:55-73`);
  `extractTemplateTokens`/`validatePromptPackTemplate` just diff tokens (`:29-40,82-96`). ZERO
  iteration/finding/open-question awareness; its only callers are the module itself and its vitest
  (grep-confirmed). Cross-iteration continuity is carried by the reducer rewriting strategy.md
  anchors, not by the prompt pack. [CONFIRMED iter-2 F12-13]
- **Adjudicator — no seat-reliability keying.** `scoreVerdictDelta`
  (`adjudicator-verdict-scoring.cjs:118-146`) scores round-to-round verdict STABILITY across 5
  change-magnitude dimensions (option_changed 0.35, confidence_delta 0.20, risk_jaccard_delta 0.20,
  axis_flip_rate 0.15, blocking_delta 0.10; stable when delta ≤ 0.2). It merges `DEFAULT_WEIGHTS`
  with an `options.weights` override (`:121`) and sums per-axis `weight*value` (`:134-137`) — but
  every seat counts equally; no seat-reliability weighting is applied. The `options.weights`
  override is the unkeyed attach point. [CONFIRMED iter-1 F13, iter-4 F-Q2d]
- **Reducer-anchor template gap — CONFIRMED REAL BUG.** `updateStrategyContent`
  (`reduce-state.cjs:734-745`) calls `replaceAnchorSection` for 7 anchored sections —
  `key-questions`, `answered-questions`, `what-worked`, `what-failed`, `exhausted-approaches`,
  `ruled-out-directions`, `next-focus`. `replaceAnchorSection:699-714` builds regex
  `<!-- ANCHOR:${id} -->[\s\S]*?<!-- /ANCHOR:${id} -->` and **throws `Missing anchor section
  ${anchorId} in strategy file` (`:709-711`)** if absent. The shipped template
  `deep-loop-workflows/deep-research/assets/deep_research_strategy.md` has all 13 section headings
  and a `<!-- MACHINE-OWNED: START -->` marker (`:61`) but **ZERO `<!-- ANCHOR:* -->` markers**
  (grep count = 0). A fresh copy therefore hard-fails `Missing anchor section key-questions in
  strategy file` on the FIRST reduce after iteration 1. Self-evidence: this session's working
  `research/deep-research-strategy.md` carries the 7 anchor pairs (`:24,34,48,52,57,65,73,81,89,93`)
  — the driver hand-patched them after hitting the throw. [CONFIRMED iter-1 F16-18]

---

## Candidate Catalog (full ranked table)

Verdict legend: **FIX** = correctness defect, ships independently; **BUILD** = new capability;
**PROMOTE** = wire an existing-but-dormant artifact.

| Rank | ID | Description | Seam (file:line) | Leverage | Effort | Conflict-risk | Verdict |
|------|----|-------------|------------------|----------|--------|---------------|---------|
| 1 | **Q6-anchor** | Wrap the 7 reducer-target headings in `<!-- ANCHOR:* -->` marker pairs (template-only); stops the reducer hard-failing `Missing anchor section` on a fresh strategy copy | `deep_research_strategy.md` (7 headings) vs `reduce-state.cjs:699-745` | HIGH (unblocks every reliable reducer rewrite) | S (near-zero) | LOW | **FIX — ship first** |
| 2 | **D2-reliability** | Derive `reliabilityPosterior` + `distinctReliableSourceCount`: walk finding/source nodes, read `metadata.reliability` (default 0.5, read-only), accumulate `Σr`/`Σ(1−r)`, call `computeWeightedScore` | `coverage-graph-signals.ts:295-450`, reads `upsert.cjs:179,224` | HIGH (shared dep — D1/D3/Q2/Q7 all consume it) | M | MED (signals emitter contract) | **BUILD — keystone foundation** |
| 3 | **D3-cap+gate** | Replace unbounded volume terms with `min(reliabilityPosterior, normalizedDiversity/Depth)` cap, plus a two-gate STOP: `reliabilityPosterior ≥ stopThreshold` AND `distinctReliableSourceCount ≥ kMin` | `convergence.cjs:112-121` (+ STOP path) | HIGH (kills the vote-count flood) | M | MED (recalibrates `convergenceThreshold:0.03` — NOT a no-op) | **BUILD** |
| 4 | **Q2-quarantine** | Trust-keyed CONTRADICTS quarantine of the lower-trust side: deterministic victim `argmin reliability`, tie-break on content-derived node id; edge-presence read-path exclusion; retain both nodes; victim stops feeding stability/contradiction/depth | `coverage-graph-query.ts:221-252` + `coverage-graph-signals.ts:511-522` + `convergence.cjs:114,216-218` | HIGH (stops weak-vs-strong mutual penalty) | M | MED (read-path filter change) | **BUILD** |
| 5 | **D1-weighted-Beta** | Add `computeWeightedScore(evidenceFor=Σrᵢ, evidenceAgainst=Σ(1−rᵢ), α=1, β=1) = (α+evidenceFor)/(α+β+evidenceFor+evidenceAgainst)` — additive export; integer `computeScore`/`shouldDemote` untouched | `bayesian-scorer.ts:13-44` (new export) | MED (enables D2/D3 math) | S | LOW (additive export only) | **BUILD** (+ PROMOTE: wires the dormant scorer toward convergence) |
| 6 | Q3-fanout-recovery | Transient/fatal classification keyed on `timedOut`/exit-code + durable bounded per-branch retry read from the ledger (aionforge `max_retries=5`, count-from-audit); re-dispatch a failed branch alone instead of re-running all siblings | fan-out ledger: `fanout-run.cjs:472-489`, `fanout-pool.cjs:174-194,100-118,235-238` | MED-HIGH (resumability) | M | LOW-MED | BUILD |
| 7 | Q4-backpressure | Live in-flight/oldest-pending-lag/failure-rate gauges sampled from the pool's `started/completed/failed` ledger events + enforceable `lag_ceiling` tripwire (default-5s warn) the loop honors | cost-guards `:114-140`; gauges from `fanout-pool.cjs:90,108,235-238` | MED | M | MED (enforcement path) | BUILD |
| 8 | D4-policy-config | Off-by-default `convergence.reliability` policy (`priorAlpha=1, priorBeta=1, stopThreshold∈(0.5,1.0], kMin≥2`) mirroring `promotion.enabled`, with aionforge's config-validation rule: refuse a config whose `kMin` can't reach `stopThreshold` under `(α+kMin)/(α+β+kMin)` | `convergence.cjs` (mirror `promotion.enabled:109`) | MED (safe rollout) | S | LOW | BUILD |
| 9 | Q2-adjudicator-seat | Seat-reliability multiplier via the existing `options.weights` override (council-side analogue of research quarantine; shares D2) | `adjudicator-verdict-scoring.cjs:118-146` (`:121`) | MED | S | LOW | BUILD (council-side, optional) |
| 10 | Q5-carried-forward | Per-iteration self-owned "open-questions carried forward" block (distinct from the reducer's machine-owned fold) so an iteration threads its own thread cheaply; reuses the existing JSONL/strategy spine, no new model call | promptpack/continuity (`prompt-pack.ts:55-73` stateless) | LOW-MED | S | LOW | BUILD |
| 11 | Q7-rank-field | Reliability field for finding ranking into `findings-registry.json` | findings-registry consumer | LOW-MED | S | LOW | BUILD (depends on D2) |

---

## Top-5 Ranked + Build Order

| # | Candidate | Why this position |
|---|-----------|-------------------|
| 1 | **Q6-anchor FIX** | A confirmed correctness defect, near-zero effort/risk, template-only, no runtime-code change, no dependencies. Ships independently and first. |
| 2 | **D2-reliability** | The keystone. The shared reliability substrate D1/D3/Q2/Q7 all consume — design once, use three times. Nothing trust-aware works until this exists. |
| 3 | **D3-cap+gate** | The payoff: caps the volume terms at average source quality and adds the two-gate STOP, directly killing the vote-count flood. Depends on D2. |
| 4 | **Q2-quarantine** | Stops the symmetric weak-vs-strong mutual penalty by quarantining the lower-trust side. Depends on D2 (victim selection needs reliability). |
| 5 | **D1-weighted-Beta** | The additive `computeWeightedScore` helper D2/D3 call. Small, low-risk; logically a leaf the others depend on, sequenced last because it's a thin enabler. |

**BUILD ORDER:** `Q6-anchor FIX (ship first) → D2 → D3 → Q2 → D1`.

> Sequencing note: D1 is the math primitive D2/D3 invoke, so in strict dependency terms it could
> land alongside or just before D2; it is listed 5th because it is a small additive export whose
> value is realized only once D2/D3 consume it. The headline order above reflects the synthesis
> across iterations 003–004.

---

## Cross-Cutting Reuse from 001 (memory) — Determinism Spine

001 established the determinism spine this packet reuses: **reproducible convergence/newInfoRatio
folding** and **content-derived ordering**. Two reuse points:

- **Quarantine victim tie-break (Q2).** When both CONTRADICTS endpoints have equal reliability,
  victim selection must be deterministic to keep convergence reproducible — reuse 001's
  content-derived node-id ordering, not insertion order or timestamp. No new determinism mechanism
  needed. [CONFIRMED-by-reference iter-4 F-Q7a; the exact 001 ordering call site is **[INFERRED]** —
  would confirm by reading the 001 folding helper.]
- **The reducer-anchor gap is itself a robustness/determinism defect.** A reducer that hard-fails
  `Missing anchor section` on a fresh strategy is non-deterministic at the workflow level (the loop
  cannot reliably fold state). The Q6 FIX restores deterministic reducer behavior, making it a
  determinism-spine repair, not merely a template tidy. [CONFIRMED iter-4 F-Q7b]

---

## Key Questions — Answers (Q1–Q7)

- **Q1 — CONFIRMED + designed.** Yes, convergence is vote-count-floodable: the research blend
  (`convergence.cjs:115-121`) caps `normalizedDiversity`/`normalizedDepth` on raw count, quality-blind,
  and `claimVerificationRate` is self-citing-satisfiable. Fix path: D1 weighted Beta → D2 reliability
  signal off `upsert.cjs:179,224` → D3 `min(posterior, volumeTerm)` cap + two-gate STOP at the
  `(α+k)/(α+β+k)` ceiling → D4 off-by-default policy. [iter-1 F1-4, iter-3 F1-5]
- **Q2 — CONFIRMED + designed.** Contradictions are a symmetric penalty with no quarantine
  (`coverage-graph-query.ts:221-252` lists both sides; `coverage-graph-signals.ts:511-522` penalizes
  both via `OR`). Design: quarantine the lower-trust side (`argmin reliability`, content-derived
  tie-break), edge-presence read-path exclusion mirroring aionforge `current_support_facts`
  (`bi-temporal-model.md:124-126`), retain both nodes, exclude the victim from
  `findingStability`/`invertedContradictions` (`convergence.cjs:114`)/evidence-depth. Council analogue:
  seat-reliability via `options.weights` (`adjudicator-verdict-scoring.cjs:121`). [iter-1 F7-8, iter-4
  F-Q2a-d]
- **Q3 — CONFIRMED.** Durable per-branch state exists only as the write-only `orchestration-status.log`
  ledger (`fanout-run.cjs:376`, `fanout-pool.cjs:235-238`); each lineage dispatches once
  (`fanout-pool.cjs:174-194`), every non-zero/timeout exit collapses to one undifferentiated throw
  (`fanout-run.cjs:472-489`), recovery is post-hoc file salvage only. Candidate: consume the ledger's
  `failed` events as resumable state + transient/fatal classification + durable bounded retry
  (aionforge `consolidation.md:61-68`). [iter-2 F1-6]
- **Q4 — CONFIRMED.** Cost guards are advisory count caps that only return `stop_reasons` and never
  enforce (`cost-guards.cjs:114-140`); no live gauge. The fan-out ledger already records per-lineage
  `duration_ms`/status (`fanout-pool.cjs:90,108`) but only post-run. Candidate: live lag/pending/failed
  gauges + enforceable `lag_ceiling` tripwire (aionforge `consolidation.md:192-201`). [iter-2 F7-11]
- **Q5 — CONFIRMED.** Continuity is reducer-mediated, not prompt-pack-mediated: `prompt-pack.ts` is a
  stateless `{var}` substituter (`:55-73`) with iteration-blind continuity; threading happens by the
  reducer folding findings into strategy.md anchors re-read cold next iteration. galadriel's threaded
  ambient reflection (README:536-538) is the cheaper model. Candidate: per-iteration self-owned
  carried-forward open-questions block. [iter-2 F12-15]
- **Q6 — CONFIRMED REAL BUG + fix.** The shipped `deep_research_strategy.md` template carries ZERO
  `<!-- ANCHOR:* -->` markers, but `reduce-state.cjs` `replaceAnchorSection` (`:699-714`, wired at
  `:734-745`) throws `Missing anchor section key-questions in strategy file` on a fresh copy's first
  reduce. **Fix (one structural template edit, no runtime-code change):** wrap each of the 7
  machine-owned headings in its `<!-- ANCHOR:id -->`…`<!-- /ANCHOR:id -->` pair — `key-questions`
  (§3), `answered-questions` (§6), `what-worked` (§7), `what-failed` (§8), `exhausted-approaches`
  (§9), `ruled-out-directions` (§10), `next-focus` (§11) — mirroring the already-correct shape in this
  session's `research/deep-research-strategy.md`. [iter-1 F16-18, iter-4 F-Q7b]
- **Q7 — CONFIRMED-by-reference.** 001 determinism (reproducible folding, content-derived ordering) is
  the reproducibility + tie-break substrate for the quarantine victim selection and the convergence
  fold; no new mechanism. Reliability-aware finding ranking into `findings-registry.json` depends on
  the D2 signal. [iter-4 F-Q7a]

---

## Open / Implementation-Time Items

- **D3 threshold re-baselining is unmeasured [INFERRED risk].** D3 changes the composite scale, so
  `convergenceThreshold:0.03` will likely need recalibration. With all `r=0.5` (no reliability
  metadata anywhere), `reliabilityPosterior ≈ prior mean` and the `min(...)` reduces to today's
  volume terms ONLY when those are ≤ 0.5 — so D3 is **NOT a pure no-op**. A measured calibration run
  is required at build time (out of research scope). [iter-3 D3, iter-4 remaining]
- **001 content-derived ordering call site is an unread inference [INFERRED].** The quarantine
  tie-break and convergence reproducibility assume 001's content-derived ordering helper; the exact
  call site was not read in this session. Confirm by reading the 001 folding helper before
  implementing the tie-break. [iter-4 F-Q7a, remaining]
- **Non-prompt-pack continuity-injection path — open question [INFERRED].** Q5 confirmed the prompt
  pack is stateless and the reducer carries continuity, but whether any OTHER continuity-injection
  path exists (beyond reducer anchors and prompt-pack `variables`) was not exhaustively traced.
  Confirm before assuming the carried-forward block (Q5) is the only threading addition needed. [iter-2
  F12-15]

---

## References

### Internal seams (file:line)

- `convergence.cjs:107-141` — `computeCompositeScore`; research blend `:115-121`; volume terms
  `:112-113`; `claimVerificationRate` `:117`; `invertedContradictions` `:114`; contradiction-density
  blocker `:203,216-218`; `promotion.enabled` reference point `:109`.
- `bayesian-scorer.ts:13-44` — Laplace `computeScore` `:13-25`, `shouldDemote` `:35-44` (unwired into
  convergence).
- `coverage-graph-signals.ts:295-450` — research signal emitters (question coverage `:295-315`, gate
  `:309`; contradiction density `:356-367`; source diversity `:378-416`; evidence depth `:427-450`);
  symmetric stability penalty `findingStability` `:511-522`.
- `coverage-graph-query.ts:221-252` — `findContradictions` (lists CONTRADICTS pairs, no victim;
  SELECT at `:225-251`).
- `upsert.cjs:179` (node metadata), `:224` (edge `weight` via `clampWeight`), `:226` (edge metadata),
  `:241` (`batchUpsert`).
- `fanout-run.cjs:164-168` (`computeLineageTimeoutMs`), `:376` (ledger open), `:462-470`
  (`runSalvageSweep`), `:472-489` (undifferentiated throw), `:495-502` (summary).
- `fanout-pool.cjs:81-117` (status events), `:90,108` (`duration_ms`/counts), `:100-118` (`settleItem`
  single terminal `rejected`), `:174-194` (`runCappedPool` dispatch-once), `:207-220` (summary),
  `:235-238` (`appendStatusLedger`).
- `cost-guards.cjs:15-20` (`DEFAULT_COUNCIL_COST_GUARDS`), `:83-90`
  (`computeCouncilCostUpperBound`), `:114-140` (`evaluateCouncilCostGuards`, advisory), `:122-133`
  (saturation check).
- `prompt-pack.ts:29-40` (token extract/validate), `:55-73` (`renderPromptPack`), `:82-96`
  (template validation).
- `adjudicator-verdict-scoring.cjs:16-22` (`DEFAULT_WEIGHTS`), `:118-146` (`scoreVerdictDelta`),
  `:121` (`options.weights` override), `:134-137` (per-axis sum).
- `reduce-state.cjs:699-714` (`replaceAnchorSection`, throw at `:709-711`), `:734-745`
  (`updateStrategyContent`, 7 anchor calls).
- `deep-loop-workflows/deep-research/assets/deep_research_strategy.md` — shipped template, ZERO
  `<!-- ANCHOR:* -->` markers (grep count = 0); 13 headings + `<!-- MACHINE-OWNED: START -->` `:61`.
- `004-deep-loop/research/deep-research-strategy.md:24-93` — this session's hand-patched working copy
  carrying the 7 correct anchor pairs (self-evidence of the Q6 bug).

### External docs (doc:section)

- **aionforge `attestation-and-promotion.md`** — `:30-52` bounded reliability-weighted Beta
  posterior + flood-resistance property ("every attester adds exactly one to the denominator…can
  never be pushed to certainty by sheer numbers"); `:34-40` per-source `r`/`1−r` fractional evidence;
  `:42-58` two-gate promotion (`k≥2` AND posterior, neither trades off) + `:48-54` config-validation
  rule (refuse a policy whose `k` can't reach threshold); `:60-67` scoring layer reads reliability,
  never writes; unknown agent contributes uninformative 0.5.
- **aionforge `consolidation.md`** — `:54,61-68` `PassError::Transient` vs `Fatal`/`max_retries=5`,
  attempt count from durable `consolidation_failed` audit ("a crash does not hand a failing episode a
  fresh retry budget"); `:119-153` CONTRADICTS-edge quarantine (deterministic lower-trust victim,
  recorded always, quarantined when a side ≥ `high_trust_threshold` 0.7, recall excludes by edge
  presence, nothing destroyed); `:192-201` per-tick observability gauges (`consolidation_lag_seconds`,
  `consolidation_episodes_pending`, `consolidation_episodes_failed`, `lag_ceiling` default-5s warn).
- **aionforge `bi-temporal-model.md`** — `:103-128` status mirror (`source.status = quarantined` as a
  redundant scalar mirror of edge-presence state, both facts retained, `current_support_facts`
  excludes any fact with a live outgoing CONTRADICTS); `:124-126` the read-guard exclusion rule.
- **aionforge `trust-model.md`** — `:39,111-115` losing-side failure attribution; durable,
  content-addressed, re-derivable quarantine without host bookkeeping.
- **galadriel `README.md`** — `:514-524` ambient reflection as a silent side-effect-only turn
  (`_send_agent_silent`) filing open questions/changed facts to durable memory; `:534-541,536-538` the
  threading trajectory ("reflection that reads its own recent diary + open-questions and *threads*
  across ticks…rather than starting fresh each time") — the cheaper cross-iteration continuity model
  the deep loop lacks.

> External docs resolved under the parent spec folder
> `028-memory-search-intelligence/external/aionforge-memory-development/docs/...` (the dispatch named
> a repo-root path that does not exist; iter-1 used the parent-scoped path). [iter-1 interpretation note]

---

## Broadening Addendum (100-iteration campaign — Deep Loop corrections)

> Pass-1 was 4 iterations; broadened to **20**. Authoritative cross-cutting record: `../../research/roadmap.md` → "BROADENING ADDENDUM". Deep-Loop-specific corrections:

- **D2 is a wholly-absent net-new build, NOT a present keystone.** No `metadata.reliability` is written anywhere (`upsert.cjs:179,224`) — **every input is `r=0.5` today**. Therefore **D3 is NOT a no-op** under all-0.5, and **Q2 is NO-GO until D2 exists**. D2 is a keystone *by design*, not a signal that ships today.
- **Merge-tiebreak and failure-class are WEAKER than "SOLID."** `fanout-merge.cjs:123-131` keys on `id‖title` with first-seen-wins dedup (a dedup, not a total-order tiebreak); `fanout-pool.cjs:103-106` (`settleItem`) computes **no** class — it flattens `{name,message}`; the class is computed **upstream in fanout-run**.
- **New gap:** the self-graded `newInfoRatio` is computed but **never ingested** back into the stop/continue decision (`convergence.cjs:285, :107-141, :378-381`) — a self-assessment that is dropped.
- **Q6-anchor FIX remains the one unconditional ship-first win** (template-only; the shipped strategy template carries zero of the 7 `<!-- ANCHOR:* -->` markers `reduce-state.cjs` requires).
- **Shared infra:** the anti-flood Beta posterior (D2/D1) is shared with Skill Advisor **C4** — build once.
