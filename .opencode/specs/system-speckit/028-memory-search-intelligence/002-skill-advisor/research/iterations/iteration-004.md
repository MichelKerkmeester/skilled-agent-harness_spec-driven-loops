# Iteration 4: Ambient Harvest (Q5) + Outcome-Capture Close (Q3) + Full Candidate Ranking (Q7)

## Focus
Saturation / close-out iteration. Three goals:
- **Q5** — Locate the doc-trigger harvest path + watcher; is it flag-gated/off? Propose an ambient off-budget harvest cadence (galadriel ambient mining).
- **Q3 close** — Find the durable advisor outcome/telemetry signal that the bounded Beta-posterior (C4) needs. If none exists, declare C4 design-blocked.
- **Q7 + RANK** — Confirm 001 RRF-primitive reuse and produce the full ranked candidate table for the skill advisor.

Candidate proposals only; no implementation. Confirmed vs inferred marked inline.

## Actions Taken
1. Grepped `system-skill-advisor` for `SPECKIT_ADVISOR_DOC_TRIGGERS` / `skill_docs` / doc-trigger and for outcome/telemetry/holdout/posterior signals; enumerated all `SPECKIT_ADVISOR_*` env flags.
2. Read `mcp_server/lib/metrics.ts:70-170` (durable outcome record schema, `durableMetricsPath(..., 'outcomes')`, retention caps).
3. Read `mcp_server/lib/scorer/feedback-calibration.ts:120-179` (shadow per-lane delta estimator from outcome records).
4. Read `mcp_server/lib/skill-graph/doc-frontmatter.ts:1-45` (`isDocTriggerHarvestEnabled`, default-off gate, tier weights).
5. Grepped harvest call sites + feedback-calibration invocation + daemon/watcher presence; read `mcp_server/lib/scorer/lane-registry.ts:55-94` (resolved live + shadow weight registries).

## Findings (file:line)

### Q5 — Ambient trigger harvest (galadriel)

- **F1 [CONFIRMED]** Doc-trigger harvest is **opt-in, default OFF**: `isDocTriggerHarvestEnabled()` returns true only when `SPECKIT_ADVISOR_DOC_TRIGGERS === 'true'` (`doc-frontmatter.ts:22-24`). The whole `skill_docs` projection path short-circuits when off (`projection.ts:257`).
- **F2 [CONFIRMED]** Harvest is invoked at **skill-graph scan time** (`skill-graph-db.ts:1013-1014`, `if (isDocTriggerHarvestEnabled()) docsResult = harvestSkillDocs(...)`) and **on watcher-driven rebuilds** (`lib/daemon/watcher.ts:248`, same gate). So a watcher *does* exist (`watcher.ts`, `watcher-orchestrator.ts`) — but harvest is bound to the same flag and to rebuild events; there is **no standalone harvest cadence**.
- **F3 [CONFIRMED]** Harvest is **content-hash incremental** (`skill-graph-db.ts:754` reads `content_hash FROM skill_docs`; deletes stale rows `:816-821`), so re-harvesting unchanged docs is cheap — the cost barrier to "always harvest" is low.
- **F4 [INFERENCE: based on F1-F3]** The galadriel "ambient auto-classified mining" analog is a **mine-but-don't-route split**: run harvest into `skill_docs` *unconditionally* (or on an off-budget cadence) to keep the corpus enriched, while keeping the *routing contribution* (the `derived.ts:39` doc-trigger lane term) behind `SPECKIT_ADVISOR_DOC_TRIGGERS`. Today both corpus-population and routing share one flag, so flag-off means zero ambient signal accrues — there is nothing to graduate when the flag flips on.

### Q3 close — Outcome-capture for C4 (bounded Beta-posterior)

- **F5 [CONFIRMED — C4 UNBLOCKED]** A **durable outcome-capture pipeline already exists**. `advisor-validate.ts:502-508` ingests `outcomeEvents` with `outcome ∈ {accepted, corrected, ignored}`, `skillId`, `correctedSkillId`; `metrics.ts:81-96` defines the durable `AdvisorHookOutcomeRecord` schema and `durableMetricsPath(workspaceRoot, 'outcomes')` (`metrics.ts:234`) persists them (cap `MAX_DURABLE_OUTCOME_RECORDS = 200`, `metrics.ts:152`). This is the outcome source iter-2 marked OPEN for C4.
- **F6 [CONFIRMED — C4 partially pre-built]** `feedback-calibration.ts:154` (`reduceAdvisorFeedbackCalibration`) is effectively a **shadow-mode precursor of C4**: it reads outcome records, computes per-lane `acceptancePressure - correctionPressure` (`:173-174`), and emits `clamp`-bounded `weightDeltas` (`:175-178`) gated on `minSamples`, sample-concentration, and lane-attribution guards (`signalReason`, `:122-132`). Flag-gated SHADOW (`SPECKIT_ADVISOR_FEEDBACK_CALIBRATION_SHADOW`, default off, `:142-147`).
- **F7 [CONFIRMED]** The lane registry already carries a **parallel shadow-weight channel**: `RESOLVED_SHADOW_WEIGHTS` via `SPECKIT_ADVISOR_LANE_SHADOW_WEIGHTS_JSON` (`lane-registry.ts:71-74`) and a per-lane `shadowWeight` field (`:79,85`). `advisor-recommend.ts:371-372` emits a `_shadow` channel (`advisor-shadow-learned-weights-v1`). So a learned-weight scaffold (shadow estimator → shadow weights → shadow recommendation diff) is **complete end-to-end in shadow**.
- **F8 [INFERENCE: based on F5-F7]** C4 is therefore **NOT design-blocked**. It is a *graduation*: replace the current point-estimate `acceptancePressure - correctionPressure` delta with a **bounded Beta(α,β) reliability posterior** (aionforge attestation pattern), keep the existing `clamp(±MAX_WEIGHT_DELTA)` bounds and `minSamples`/concentration guards, and add a promotion gate (shadow→live) governed by holdout (`advisor-validate.ts:516-519`). The hard part (durable outcomes + bounded shadow weights + holdout eval) is already shipped.

### Q7 — 001 primitive reuse (determinism spine)

- **F9 [CONFIRMED, carried from iter-2]** The shared `fuseResultsMulti` / deterministic-RRF primitive from 001 is reusable at the advisor fusion injection point (`fusion.ts:69-82` effective-weights / `:425+` post-rank). C3 (import shared RRF) remains the determinism spine that C1/C2/C6 ordering-stability claims depend on. Reuse is an **import**, not a re-implementation.

## Findings (ranked candidate table)

Leverage = expected routing-quality gain; Effort S/M/L; Conflict-risk = chance of disturbing existing scores/ordering.

| Rank | ID | One-line | file:line seam | Leverage | Effort | Conflict-risk | Verdict |
|---|---|---|---|---|---|---|---|
| 1 | **C3** | Import 001 shared `fuseResultsMulti` + deterministic RRF (fixed order, stable id tiebreak, weight:0 elision) | `fusion.ts:69-82`, `:425+` | High (determinism spine for C1/C2/C6) | M | Low (additive import; preserves outputs) | **PROMOTE** |
| 2 | **C5** | Runtime-empty lane elision in `liveTotal` (degrade-to-remaining, not skew-down) | `fusion.ts:343-345`, `:388` | High (fixes confirmed ~13% confidence skew during graph rebuild) | S | Med (changes confidence magnitudes — needs baseline) | **PROMOTE** |
| 3 | **C1** | Split-conflict conflict-edge re-rank using `conflicts_with:-0.35` graph edge | `graph-causal.ts:18`, `fusion.ts:425+` | High (resolves comparable-score conflict gap) | M | Low (rides C3 RRF) | **PROMOTE** |
| 4 | **C5a** | `embedder_available`-style degraded-lane explanation flag (`liveLaneCount`) | `fusion.ts:533` | Med (legibility; cheap companion to C5) | S | Low (explanation-only) | **PROMOTE** |
| 5 | **QCR** | Query-class router → intent-aware lane weights (additive, never replaces explicit-author lane) | `fusion.ts:69-82` (`effectiveScorerWeights`) | High (best ceiling lift; broadest behavior change) | M | Med (alters weighting on every call) | **PROMOTE (with shadow rollout)** |
| 6 | **C2** | Deterministic RRF ordering guarantee (byte-stable output) | `fusion.ts:425+` | Med (subsumed once C3 lands) | S | Low | **PROMOTE (folds into C3)** |
| 7 | **C6** | Cross-lane semantic exact-rerank tiebreak on fused top-K (bypass 0.2 cutoff for subset) | `semantic-shadow.ts:47-69,194-199`; `fusion.ts:425+` | Med (graduates 0.05 lane to tiebreaker) | M | Med (ordering stability; depends on C3 tiebreak) | **BUILD** |
| 8 | **C4** | Bounded Beta-posterior lane auto-tune (graduate the shadow estimator) | `feedback-calibration.ts:154`; `lane-registry.ts:71-74`; outcomes `metrics.ts:234` | High (long-term self-tuning) | L | High (live weight mutation; needs holdout promotion gate) | **BUILD (shadow-first)** |
| 9 | **AMB** | Ambient mine-but-don't-route harvest split (decouple corpus population from routing flag) | `doc-frontmatter.ts:22`; `skill-graph-db.ts:1013`; `watcher.ts:248`; `projection.ts:257` | Med (enables future doc-signal with no routing risk) | S/M | Low (corpus-only when routing flag off) | **BUILD** |

### Top-5 (ranked)
1. **C3** — import shared RRF (determinism spine; unblocks C1/C2/C6).
2. **C5** — runtime-empty lane elision (fixes confirmed confidence skew; smallest high-value fix).
3. **C1** — split-conflict conflict-edge re-rank (closes the comparable-score conflict gap).
4. **C5a** — degraded-lane explanation flag (cheap legibility; pairs with C5).
5. **QCR** — query-class router lane weighting (highest ceiling; ship behind shadow weights first).

## Questions Answered
- **Q5** — ANSWERED. Harvest is opt-in/default-off (`doc-frontmatter.ts:22`), invoked at scan-time (`skill-graph-db.ts:1013`) and watcher rebuilds (`watcher.ts:248`), content-hash incremental (cheap). No ambient cadence. Galadriel analog = mine-but-don't-route split (candidate AMB). file:line F1-F4.
- **Q3** — CLOSED. C4 is NOT blocked. Durable outcome capture exists (`advisor-validate.ts:502`, `metrics.ts:234`), a bounded shadow delta estimator is already shipped (`feedback-calibration.ts:154`), and a shadow-weight registry + `_shadow` channel exist (`lane-registry.ts:71`, `advisor-recommend.ts:371`). C4 becomes a *graduation to Beta-posterior + holdout promotion gate*, effort L, shadow-first. file:line F5-F8.
- **Q7** — ANSWERED. 001 RRF primitive reuse is an import at `fusion.ts:69-82`/`:425+`; it is the spine for the ordering-dependent candidates. file:line F9.

## Questions Remaining
None blocking. All 7 key questions (Q1-Q7) are now evidence-backed and code-mapped. Residual implementation-design detail (exact Beta prior, QCR class taxonomy, holdout promotion thresholds) belongs to synthesis/spec, not further research iterations.

## Next Focus
**Recommend SYNTHESIS.** 003 is saturated: every candidate has an ID, file:line seam, leverage/effort/conflict-risk, and a PROMOTE/BUILD verdict; the prior OPEN blocker (C4 outcome source) is closed; newInfoRatio is in the saturation band. Synthesis should emit the ranked roadmap (C3→C5→C1→C5a→QCR promote tier; C6/C4/AMB build tier) into `research.md` and a memory save.
