---
title: "Research Report: Skill Advisor — External Mining"
description: Canonical consolidated deep-research report mining aionforge + galadriel for Skill Advisor 5-lane fusion-scorer improvements.
trigger_phrases:
  - "skill advisor external mining research"
  - "skill advisor fusion scorer research"
  - "skill advisor RRF query-class router"
importance_tier: high
contextType: research
---

# Research Report: Skill Advisor — External Mining

> **All file:line citations are repo-root-relative.** Advisor scorer modules live under `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/`; early iterations used the `lib/scorer/...` short form for the same files. External-doc citations resolve under the PARENT spec folder at `.opencode/specs/system-spec-kit/028-memory-search-intelligence/external/` (no repo-root `external/` exists — confirmed iteration 1). Each finding is marked **[CONFIRMED]** (file/code read directly) or **[INFERENCE]** (design reasoning over confirmed evidence).

## Executive Summary

The Skill Advisor fuses five lanes (explicit_author 0.42 / lexical 0.28 / graph_causal 0.13 / derived_generated 0.12 / semantic_shadow 0.05) via a **raw-score weighted SUM that mixes incomparable scales** — per skill, `weightedScore = rawScore * weights[lane]` then `score = Σ weightedScore` (`fusion.ts:366,372`), summing a hint-inflated lexical overlap, a `[0.2..1]` cosine, and a signed `[-1,1]` graph propagation as if they were on one axis. The single highest-leverage, lowest-risk move is the **determinism spine: import memory's (001) shared deterministic `fuseResultsMulti` RRF primitive** (`.opencode/skills/system-spec-kit/shared/algorithms/rrf-fusion.ts`) so fusion reads RANK, not raw score — fixing both cross-lane comparability and the fragile float-determinism of today's `toFixed(6)` + `localeCompare` tiebreaks (`fusion.ts:409,425-433`). Research also **confirmed a `liveTotal` degrade-skew bug**: when a lane (e.g. graph_causal during a skill-graph rebuild) runs but returns `[]`, its weight stays in the normalization denominator (`fusion.ts:343-345,388`), silently penalizing every survivor's confidence by ~13% of live mass rather than degrading-to-remaining. The **highest-ceiling additive change is a query-class router** that reweights lanes per intent class (additive, never replacing the explicit_author lane) — generalizing today's hand-maintained per-(phrase,skill) `primaryIntentBonus` table (`fusion.ts:259-332`). Nine candidates are catalogued; the recommended roadmap is **C3 → C5 → C1 → C5a → QCR** (promote tier), with C6 / C4 / AMB as a build tier. Notably **C4 (Beta-posterior lane auto-tune) is a GRADUATION, not a new build** — durable outcome capture, a bounded shadow delta estimator, and a shadow-weight registry are already shipped end-to-end in shadow mode.

---

## Internal Baseline (file:line)

The live Skill Advisor scorer as it stands today, all confirmed by direct reads:

- **Lane weights** — `LANE_DEFINITIONS` in `lane-registry.ts:8-19`: `explicit_author 0.42`, `lexical 0.28`, `graph_causal 0.13`, `derived_generated 0.12`, `semantic_shadow 0.05`; all `live: true`, each with a separate `defaultShadowWeight`. Env-overridable via `SPECKIT_ADVISOR_LANE_WEIGHTS_JSON` (`lane-registry.ts:41-70`, validated `>=0 && <=1`, resolved ONCE at module load). Re-exported as `DEFAULT_SCORER_WEIGHTS` / `SCORER_LANES` (`weights-config.ts:14-22`). **[CONFIRMED]**
- **Weighted-sum fusion (the comparability surface)** — per skill, each lane yields `weightedScore = rawScore * weights[lane]` (`fusion.ts:366`); fused `score = contributions.reduce((t,c) => t + c.weightedScore, 0)` (`fusion.ts:372`). This sums RAW per-lane scores scaled by weight — it does NOT fuse by rank. **[CONFIRMED]**
- **Fragile float tiebreaks** — the score field is `Number(score.toFixed(6))` (`fusion.ts:409`); ranking sorts by `(score + commandBonus + intent)` desc, then `confidence` desc, then `skill.localeCompare` (`fusion.ts:425-433`). Float rounding + locale id sort, not a fixed-order deterministic sum — fragile under float non-associativity of a weighted sum. **[CONFIRMED]**
- **No query-class router** — intent enters only via two ad-hoc surfaces: (i) `TASK_INTENT` / breadth / multi-concern regexes for confidence + abstention (`fusion.ts:44-56,484-513`), and (ii) `primaryIntentBonus()` — a long hand-maintained per-(phrase,skill) additive bonus/penalty table applied at sort time (`fusion.ts:259-332,428-430`). This is per-phrase hardcoding, NOT a class→lane-weight router. **[CONFIRMED]**
- **graph_causal signed conflict** — BFS over projection edges, `maxDepth=2`, `maxBreadth=4`; `EDGE_MULTIPLIER` enhances 0.55 / siblings 0.35 / depends_on 0.35 / prerequisite_for 0.30 / `conflicts_with -0.35` (`graph-causal.ts:13-19`, conflict at `:18`); propagation `strength * edge.weight * |mult| * 1/(depth+1)`, pruned `< 0.05`, output clamped `[-1,1]` (`graph-causal.ts:70-103`, clamp `:101`). Negative (conflict) contributions are preserved through emit (`:89-103`, `if (signed > 0)` enqueue at `:77`) but not enqueued for further BFS. **[CONFIRMED]**
- **semantic-shadow: exact cosine over ALL skills** — `cosineSimilarity()` iterates raw `Float32Array` vectors element-wise (`semantic-shadow.ts:47-69`); vectors are cached full-precision rows from `loadSkillEmbeddings()` (`semantic-shadow.ts:194-199`). Brute-force over `projection.skills.map(...)`, then filter `score <= COSINE_THRESHOLD (0.2)` (`semantic-shadow.ts:11,213-220`). No ANN/quantized stage and no top-K candidate gate — the lane is already an exact oracle, bounded by recall scope not precision. **[CONFIRMED]**
- **liveTotal skew** — `liveTotal` sums registry-static live weights filtered only by config `disabled`, never by runtime emptiness (`fusion.ts:343-345`); `liveNormalized = score / liveTotal` (`fusion.ts:388`) feeds confidence. `disabled = new Set(options.disabledLanes ?? [])` is config-only (`fusion.ts:337`); a lane that runs but returns `[]` is NOT added to it. **[CONFIRMED — this is the bug; see Q6.]**
- **doc-trigger harvest default-OFF** — `isDocTriggerHarvestEnabled()` returns true only when `SPECKIT_ADVISOR_DOC_TRIGGERS === 'true'` (`doc-frontmatter.ts:22-24`); the `skill_docs` projection short-circuits when off (`projection.ts:257`). Harvest runs at scan-time (`skill-graph-db.ts:1013-1014`) and on watcher rebuilds (`watcher.ts:248`), content-hash incremental (`skill-graph-db.ts:754,816-821`). No standalone cadence. **[CONFIRMED]**
- **Shadow pipeline exists (end-to-end)** — durable outcome capture `advisor-validate.ts:502-508` (`outcome ∈ {accepted, corrected, ignored}`); a bounded shadow delta estimator `feedback-calibration.ts:154` (`reduceAdvisorFeedbackCalibration`, `clamp`-bounded `weightDeltas`, `minSamples`/concentration guards, default-off shadow flag); a parallel shadow-weight channel `RESOLVED_SHADOW_WEIGHTS` / per-lane `shadowWeight` (`lane-registry.ts:71-74,79,85`) plus a `_shadow` recommendation channel (`advisor-recommend.ts:371-372`). **[CONFIRMED]**

---

## Candidate Catalog (ranked)

> Leverage = expected routing-quality gain. Effort = S/M/L. Conflict-risk = chance of disturbing existing scores/ordering. **PROMOTE** = ship-tier; **BUILD** = second-tier or needs scaffolding. C2 folds into C3; C5a pairs with C5.

| ID | Description | Seam (file:line) | Leverage | Effort | Conflict-risk | Verdict |
|---|---|---|---|---|---|---|
| **C3** | Import 001 shared `fuseResultsMulti` + deterministic RRF (fixed order, stable id tiebreak, weight:0 elision); advisor uses its OWN smaller `k` | `fusion.ts:69-82`, `:425+`; `rrf-fusion.ts:272-399` | High (determinism spine for C1/C2/C6) | M | Low (additive import; preserves outputs) | **PROMOTE** |
| **C5** | Runtime-empty lane elision in `liveTotal` (degrade-to-remaining, not skew-down) | `fusion.ts:343-345`, `:388` | High (fixes confirmed ~13% confidence skew during graph rebuild) | S | Med (changes confidence magnitudes — needs baseline) | **PROMOTE** |

---

## Broadening Addendum (100-iteration campaign — Skill Advisor corrections)

> Pass-1 was 4 iterations; broadened to **18**. Authoritative cross-cutting record: `../../research/roadmap.md` → "BROADENING ADDENDUM". Advisor-specific corrections:

- **C4 is a BUILD, not a Beta-posterior "graduation."** The shipped shadow estimator is a **raw-frequency** estimator with shadow guardrails — there is **no Beta math** to graduate (`feedback-calibration.ts:173-177, :230-237`). C4 = add the Beta posterior.
- **C5's "~13% confidence skew" is UNSOURCED.** `grep` for `13%`/`~13`/`0.13`/confidence-skew across `.opencode/specs` + `system-skill-advisor` returns **ZERO** matches (fails the regression-baseline rule). The skew *mechanism* is real (`feedback-calibration.ts:167-189`, shadow-gated), but **capture a baseline before quoting any number.**
- **Shared infra:** the anti-flood Beta posterior is shared with Deep Loop **D2** — build the math once, wire it into both.
- **Follow-up (iter-101 territory):** mine `aionforge-procedural` — outcome-weighted skill ranking (Beta-posterior reliability `(α₀+s)/(α₀+β₀+s+f)`, blended `similarity × reliability × penalty`) + per-skill failure-mode recall. Net-new for the advisor (candidate `SA-outcome-weighted-ranking`).