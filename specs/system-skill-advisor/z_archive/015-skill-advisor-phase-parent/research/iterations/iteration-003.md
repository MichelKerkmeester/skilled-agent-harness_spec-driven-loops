# Iteration 3: Semantic Exact-Rerank (Q4) + Graceful Degrade Renormalization (Q6)

## Focus
Close two lane-quality questions against aionforge patterns:
- **Q4** — Can the semantic-shadow lane (weight 0.05) graduate via an exact-rerank pass over its top candidates? Map to aionforge dense+exact-rerank.
- **Q6** — When graph-causal returns `[]` at runtime (skill-graph rebuild in flight), does `fusion.ts` `liveTotal` renormalization skip+reweight survivors, or skew confidence? Map to aionforge graceful degrade.

Candidate proposals only; no implementation. Confirmed vs inferred marked inline.

## Actions Taken
1. Read `lib/scorer/lanes/semantic-shadow.ts` in full (raw cosine shape, threshold, runtime-health, empty-return paths).
2. Read `lib/scorer/fusion.ts:320-429` (scoring loop, `liveTotal`, `liveNormalized`) and `:185-214` (`buildLaneScores`).
3. Grepped `fusion.ts` for `liveTotal|isLiveScorerLane|disabled` and confirmed `disabled` is config-only.
4. Located `lib/scorer/lanes/graph-causal.ts` (correct path; conflict-edge `conflicts_with:-0.35` at line 18) and its empty/catch behavior.
5. Read aionforge `retrieval.md:25-31` (dense exact-rerank: approximate-then-Flat-oracle) and `:295-301` (graceful degrade: empty dense ranking, degrade-not-error).

## Findings (file:line)

### Q4 — Semantic exact-rerank

- **F1 [CONFIRMED]** The semantic lane already computes *exact* full-precision cosine in production, not an approximate index. `cosineSimilarity()` iterates the raw `Float32Array` vectors element-wise (`semantic-shadow.ts:47-69`), and production vectors come from `loadSkillEmbeddings()` cached full-precision rows (`semantic-shadow.ts:194-199`). There is **no ANN/quantized stage** to "graduate" from — so aionforge's *approximate-then-Flat-oracle* rerank (`retrieval.md:27-29`) has no direct analog here. The lane's ceiling is set by **recall scope**, not precision.
- **F2 [CONFIRMED]** The lane is brute-force over *every* projected skill: `projection.skills.map(...)` scores all candidates then filters `score <= COSINE_THRESHOLD (0.2)` (`semantic-shadow.ts:213-220`). There is no top-K candidate gate. So an "exact-rerank over top candidates" is a *narrowing* (precision/cost) move, not an accuracy gain over the current exhaustive pass.
- **F3 [INFERENCE: based on F1+F2]** The real graduation lever for the 0.05 lane is **cross-lane exact-rerank**: take the fused top-K survivors (post weighted-sum) and re-score *only those* with full-precision cosine as a tiebreak/boost, instead of letting semantic contribute a flat 0.05-weighted term diluted across all skills. This mirrors aionforge's intent ("exact surface matches a visible contribution... so broad queries do not bury a precise memory", `retrieval.md:21-24`) rather than its mechanism.
- **F4 [CONFIRMED]** `COSINE_THRESHOLD = 0.2` (`semantic-shadow.ts:11`) is a hard pre-fusion cutoff. Any graduation that wants semantic to break ties among already-strong candidates must lower/bypass this cutoff for the rerank subset, since 0.2 suppresses mid-range signal that is exactly where tiebreaking matters.

### Q6 — Graceful degrade / `liveTotal` renormalization

- **F5 [CONFIRMED]** `liveTotal` sums **registry-static live weights**, filtered only by the config `disabled` set, never by runtime emptiness: `SCORER_LANES.filter(lane => !disabled.has(lane)).reduce(... isLiveScorerLane(lane) ? total + weights[lane] : total, 0)` (`fusion.ts:343-345`).
- **F6 [CONFIRMED]** `disabled` is a pure config input — `new Set(options.disabledLanes ?? [])` (`fusion.ts:337`) — and `buildLaneScores` only consults `disabled.has('graph_causal')` to decide whether to *call* the lane (`fusion.ts:196`). A lane that runs but returns `[]` (graph-causal during skill-graph rebuild; semantic on `skill_embedding_load_failed`, `semantic-shadow.ts:200-206`) is **not** added to `disabled`.
- **F7 [CONFIRMED — this is the skew]** Therefore when graph-causal returns `[]` at runtime, its `0.13` weight stays in `liveTotal`, but no skill receives any graph-causal `weightedScore`. Every survivor's `liveNormalized = score / liveTotal` (`fusion.ts:388`) is divided by an **inflated denominator** → confidence skews *uniformly downward* by the missing lane's weight share (~13% of the live mass). It does **not** skip+reweight survivors; it silently penalizes them.
- **F8 [CONTRAST — aionforge]** aionforge treats an empty dense ranking as "degrade, not error": "retrieval degrades to the remaining signals... the dense signal returns an empty ranking; it never fails the recall" and reports `embedder_available:false` (`retrieval.md:297-301`). The remaining signals are *not* renormalized against the absent lane's weight — survivors keep their full strength.
- **F9 [INFERENCE: based on F5-F8]** The advisor's `directScore` floor (`fusion.ts:382-385`, max of explicit/lexical raw) partially shields top explicit/lexical hits because `confidenceFor` also reads `directScore`. But borderline graph-dependent recommendations (those that *needed* the graph-causal lift) lose it twice: no boost AND a smaller `liveNormalized`. The degrade is therefore non-uniform in *effect* even though the denominator error is uniform.

## Candidate Proposals (no implementation)

- **C5 — Runtime-empty lane elision in `liveTotal` [size: S]**
  Derive an effective-live set from lanes that actually produced ≥1 match this call, and compute `liveTotal` over that set (mirroring aionforge "degrade to remaining signals"). Touch points: `fusion.ts:343-345` (denominator) and the lane-emptiness signal already available via `laneScores[lane].length` / `scores.graph_causal`. Pairs with the existing `runtimeHealth.disabledReason` channel for observability. **Risk:** changes confidence magnitudes on every rebuild window — needs a baseline capture before/after. *(Answers Q6.)*

- **C6 — Cross-lane semantic exact-rerank tiebreak [size: M]**
  After the weighted-sum ranking (`fusion.ts:425+`), re-score the fused top-K (e.g. K=10) survivors with full-precision cosine and apply a bounded tiebreak/boost, bypassing the 0.2 pre-cutoff for that subset only. Reuses `cosineSimilarity` + cached vectors already present (`semantic-shadow.ts:47-69,194-199`). Lets the 0.05 lane *resolve ties* rather than dilute the sum. **Risk:** ordering stability — must keep deterministic tiebreak by skill id to preserve the byte-identical-output property aionforge guarantees (`retrieval.md:305-310`). *(Answers Q4.)*

- **C5a — `embedder_available`-style explanation flag [size: S]**
  Surface a per-call `liveLaneCount` / degraded-lane list in the result explanation (the field already exists at `fusion.ts:533`) so a graph-causal-absent call is *legible* downstream, matching aionforge's `embedder_available:false` reporting. Cheap companion to C5. *(Supports Q6.)*

## Questions Answered
- **Q4** — ANSWERED. The lane is already exact full-precision cosine over all skills (no ANN to graduate from); the meaningful graduation is a cross-lane top-K exact-rerank tiebreak (C6), not a within-lane rerank. file:line evidence F1-F4.
- **Q6** — ANSWERED. `liveTotal` does NOT skip+reweight survivors on runtime-empty lanes; it skews confidence uniformly downward because `disabled` is config-only and ignores runtime emptiness. Fix: C5 runtime-empty elision. file:line evidence F5-F9.

## Questions Remaining
- Q1 (query-class router lane weighting), Q3 (Beta-posterior outcome-capture close), Q5 (ambient trigger harvest), Q7 partial (ranking-stage reuse beyond RRF import).

## Next Focus
Iteration 4: **Q5 (galadriel ambient trigger-harvest pass — locate trigger indexing + watcher, flag-gated)** + **Q3 close (outcome-capture wiring for bounded Beta-posterior auto-tune)** + **Q7 ranking-stage primitive reuse**. Check `palace.py` ambient mining shape and the advisor trigger-index/watcher path.
