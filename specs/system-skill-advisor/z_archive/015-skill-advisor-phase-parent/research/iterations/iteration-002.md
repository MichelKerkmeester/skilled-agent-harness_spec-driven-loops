# Iteration 2: RRF Feasibility + Shared-Primitive Reuse + Bounded Lane Auto-Tune (Q2/Q7/Q3)

## Focus
Resolve three coupled questions from iteration 1:
- **Q2 (deterministic RRF):** Confirm each advisor lane's raw-score scale and whether a stable per-lane RANK is derivable (RRF fuses ranks, not raw scores). Propose replacing the weighted SUM with deterministic RRF and resolve the CRITICAL gap — graph_causal's NEGATIVE (`conflicts_with`) contributions have no rank-fusion meaning.
- **Q7 (001 reuse):** Confirm whether the advisor can import the SAME shared RRF primitive (`fuseResultsMulti`) rather than reimplement, for determinism-spine reuse.
- **Q3 (lane auto-tuning):** Map aionforge's bounded reliability-weighted Beta posterior onto a lane-weight auto-tune from outcomes, with an over-fitting guard.

Candidate proposals only (NOT implementations). All file:line is repo-root-relative. Scorer modules live under `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/` (iteration-1 citations used the `lib/scorer/...` short form; same files).

## Actions Taken
1. Read `mcp_server/lib/scorer/types.ts` (full) — confirmed `LaneMatch` and `LaneContribution` shapes.
2. Read `mcp_server/lib/scorer/lanes/lexical.ts` (full) and `lanes/semantic-shadow.ts` (full) — confirmed per-lane raw-score scales.
3. Re-read `mcp_server/lib/scorer/lanes/graph-causal.ts` (full) — confirmed the negative/conflict emit path.
4. Read `mcp_server/lib/scorer/lane-registry.ts` (full) — confirmed weight source + env override is the ONLY current tuning path.
5. Read the shared `.opencode/skills/system-spec-kit/shared/algorithms/rrf-fusion.ts` (full) — the reuse target for Q7/Q2.
6. Grepped `mcp_server/lib/scorer/fusion.ts` for the lane-index + contribution-build + weighted-sum sites (the RRF injection point).
7. Read aionforge `attestation-and-promotion.md` Beta-posterior section (full first half) for Q3.

## Findings (file:line)

### Q2 — Deterministic RRF feasibility (raw-score scales + rank derivability)

- **F13 — Every lane emits a list of `LaneMatch{skillId, lane, score, evidence}` (a directly rankable list).** `mcp_server/lib/scorer/types.ts:88-96`: `LaneMatch` carries a numeric `score`; `LaneScores = Record<ScorerLane, readonly LaneMatch[]>`. So each lane already produces exactly the per-source ranked-list shape RRF needs — ranking is just `sort by score desc`. [SOURCE: mcp_server/lib/scorer/types.ts:88-96]

- **F14 — The raw-score scales ARE heterogeneous (confirming the comparability problem Q2 targets).**
  - lexical: token-overlap magnitude + additive `+0.38` category-hint bumps, then `Math.min(score, 1)` — a 0..1 overlap-ish magnitude but additively inflated by hints (`mcp_server/lib/scorer/lanes/lexical.ts:71-99`).
  - semantic_shadow: raw cosine in `[COSINE_THRESHOLD=0.2 .. 1]`, rounded to 6 dp (`lanes/semantic-shadow.ts:11,219-235`).
  - graph_causal: signed BFS propagation clamped to `[-1, 1]` (`lanes/graph-causal.ts:101`).
  These three are NOT on a comparable scale (cosine ≥ 0.2 floor vs hint-inflated overlap vs signed propagation), which is precisely the BM25-vs-cosine non-comparability aionforge cites (iter-1 F10, `retrieval.md:39-43`). A weighted SUM of these (`fusion.ts:372`) mixes incomparable magnitudes; RANK fusion sidesteps it. [SOURCE: mcp_server/lib/scorer/lanes/lexical.ts:71-99; lanes/semantic-shadow.ts:11,219-235; lanes/graph-causal.ts:101]

- **F15 — The RRF injection point is exact and shallow.** `mcp_server/lib/scorer/fusion.ts:341` already builds a per-lane `buildLaneMatchIndex(laneScores[lane])`; `fusion.ts:359-372` maps each lane to a `LaneContribution{rawScore, weightedScore = rawScore * weights[lane]}` and the fused `score` is `contributions.reduce((t,c)=>t+c.weightedScore,0)` (line 372). An RRF variant would instead: (a) for each lane, sort `laneScores[lane]` by score desc into a `RankedList{source: lane, results: [{id: skillId}], weight: laneWeight}`, (b) call the shared `fuseResultsMulti(lists, {k})`, (c) read each skill's `rrfScore`. The per-skill loop, confidence, and `primaryIntentBonus` reorder (iter-1 F3/F5) layer on top unchanged. [SOURCE: mcp_server/lib/scorer/fusion.ts:341,359-372]

- **F16 — CRITICAL gap CONFIRMED: graph_causal negative contributions cannot ride RRF.** `mcp_server/lib/scorer/lanes/graph-causal.ts:72-103`: `conflicts_with` (`EDGE_MULTIPLIER = -0.35`, line 18) emits a SIGNED score; negatives are deliberately preserved through emit (lines 89-103, clamp `[-1,1]`). But the shared primitive `fuseResultsMulti` only ever adds `weight * 1/(k+rank+1)` (`rrf-fusion.ts:310`) — a strictly POSITIVE rank term; there is no suppression channel and zero/negative weights elide the WHOLE lane (`rrf-fusion.ts:304`). So a naive port would silently drop conflict suppression. [SOURCE: mcp_server/lib/scorer/lanes/graph-causal.ts:18,72-103; .opencode/skills/system-spec-kit/shared/algorithms/rrf-fusion.ts:304,310]

- **CANDIDATE C1 (Q2) — Split graph_causal into a positive RRF lane + a separate post-fusion conflict RE-RANK signal. Effort: M.** Feed only the positive graph_causal entries into RRF as one ranked list (preserving its high-signal causal boost, mirroring aionforge's `GRAPH_WEIGHT_BOOST=1.5`, `rrf-fusion.ts:42,302`). Apply the negative `conflicts_with` mass AFTER fusion as a bounded multiplicative/subtractive demotion on the fused rank — never as a fused rank term. This keeps RRF's "rank-only, comparable" invariant while preserving conflict suppression. [INFERENCE — aionforge explicitly notes negatives have "no rank-fusion meaning" (iter-1 F10/F11); the existing signed-emit at graph-causal.ts:96-103 already separates positive (enqueued) from negative (emit-only, line 77 `if (signed > 0)`), so the split is cheap to derive.]

- **CANDIDATE C2 (Q2) — Adopt deterministic tiebreak from the shared primitive instead of `toFixed(6)` + `localeCompare`. Effort: S.** Today's determinism rests on `Number(score.toFixed(6))` + `localeCompare` (iter-1 F3, `fusion.ts:409,425-433`), fragile under float non-associativity of a weighted sum. RRF's `1/(k+rank+1)` over a fixed-order lane iteration plus stable id tiebreak is deterministic by construction. [INFERENCE — `rrf-fusion.ts` sorts `b.rrfScore - a.rrfScore` (line 391); a stable secondary id sort gives the node-id tiebreak aionforge mandates (iter-1 F10).]

### Q7 — Shared-primitive reuse (determinism-spine reuse vs reimplement)

- **F17 — The advisor CAN import the SAME `fuseResultsMulti` primitive; signatures align.** `.opencode/skills/system-spec-kit/shared/algorithms/rrf-fusion.ts:272-399` exports `fuseResultsMulti(lists: RankedList[], options)` where `RankedList = {source, results: RrfItem[], weight?}` and `RrfItem = {id: number|string, ...}` (lines 63-87). The advisor's `LaneMatch{skillId}` maps to `RrfItem{id: skillId}` with zero schema friction; lane weight maps to `RankedList.weight`. The primitive already implements every aionforge-mandated property: k via `resolveRrfK` (`SPECKIT_RRF_K`, default 40, lines 150-164), zero/negative-weight elision (`weight <= 0 ... continue`, line 304), graph-source boost (line 302), deterministic descending sort (line 391), and optional `[0,1]` min-max normalization (lines 394,590-623). [SOURCE: .opencode/skills/system-spec-kit/shared/algorithms/rrf-fusion.ts:63-87,150-164,272-399,590-623]

- **F18 — Reuse caveat (both sides): the primitive is monotonic-positive only and has no conflict/negative channel.** As in F16, `fuseResultsMulti` accumulates only positive rank terms; the advisor's signed graph lane has no home inside it. Determinism-spine reuse therefore means: import the primitive for the 4 positive lanes (explicit / lexical / derived / positive-graph / semantic), keep conflict suppression OUTSIDE the primitive (C1). The shared k constant default is 40, not aionforge's 60 (`rrf-fusion.ts:38`, tuned for the ~1000-memory corpus per changelog v3.1.4.0) — the advisor has far fewer than 1000 skills, so it would likely want its OWN k (lower, more top-heavy) via the `options.k` param rather than the shared default. [SOURCE: .opencode/skills/system-spec-kit/shared/algorithms/rrf-fusion.ts:38,272-304]

- **CANDIDATE C3 (Q7) — Import `fuseResultsMulti` for determinism-spine reuse; do NOT reimplement RRF. Effort: M.** Net: one import, a lane→RankedList adapter (sort each `laneScores[lane]` by score desc), an advisor-specific `k`, and the C1 conflict re-rank bolted on after. Avoids a second RRF implementation drifting from the spec-kit one. [INFERENCE — drop-in is feasible because F13/F17 confirm shape compatibility; the only non-reusable piece is the negative-conflict signal (F16/F18).]

### Q3 — Bounded reliability-weighted Beta-posterior lane auto-tune

- **F19 — Lane weights today are STATIC: defaults + a one-shot env-JSON override, no outcome feedback.** `mcp_server/lib/scorer/lane-registry.ts:8-19` defines the 0.42/0.28/0.13/0.12/0.05 defaults; `lane-registry.ts:41-70` resolves a `SPECKIT_ADVISOR_LANE_WEIGHTS_JSON` env override (validated `>=0 && <=1`) ONCE at module load. There is no path that updates weights from recommendation outcomes. [SOURCE: mcp_server/lib/scorer/lane-registry.ts:8-19,41-70]

- **F20 — aionforge Beta posterior is bounded by evidence quality and cold-starts to "do nothing".** `attestation-and-promotion.md`: each piece of evidence contributes reliability `r∈[0,1]` (`r` toward correct, `1-r` against) over a Beta prior; because every voter adds exactly 1 to the denominator, the posterior "settles toward the average quality... can never be pushed to certainty by sheer numbers", capped at `(alpha+k)/(alpha+beta+k)`; an unscored/cold-start contributor adds the uninformative `0.5` so "nothing promotes" by default; prior default `1,1` is uninformative. [SOURCE: external/aionforge-memory-development/docs/attestation-and-promotion.md §"How the substrate decides", §"Reliability comes from elsewhere"]

- **CANDIDATE C4 (Q3) — Bounded per-lane reliability posterior that nudges lane weights toward lanes whose top pick was confirmed. Effort: L.** Treat each recommendation outcome (was the dominant-lane's top skill the one the user actually invoked?) as one Beta observation per lane: a confirmed pick adds `r` toward "this lane is reliable", a disconfirmed pick adds `1-r`. Maintain per-lane `Beta(alpha_lane, beta_lane)`; derive a bounded multiplier `m_lane = posterior_mean / global_mean` and apply it to the registry default at the `effectiveScorerWeights()` merge point (`fusion.ts:336`, already the `laneWeightsOverride` seam — iter-1 F-Q1). Persist counts in the daemon/projection layer, NOT in the hot recommend path. [INFERENCE — `effectiveScorerWeights` already merges an override (iter-1 hypothesis), so a posterior-derived multiplier slots in without touching the per-skill loop.]

- **F21 — Over-fitting guard maps directly from aionforge's two properties (count gate + quality-capped posterior).** Anti-overfit shape for C4: (1) **cold-start neutrality** — start every lane at the uninformative prior so until enough confirmed outcomes accrue the multiplier is ~1.0 and the static 0.42/0.28/... split is preserved (mirrors "nothing promotes" / `0.5` cold-start, F20); (2) **count floor** — require ≥k confirmed outcomes per lane before the multiplier deviates from 1.0 (mirrors the quorum-of-≥2 count gate); (3) **bounded deviation** — clamp `m_lane` to a narrow band (e.g. [0.7, 1.3]) so no lane can be driven to dominance or zero by a streak — the analog of the posterior being capped by `(alpha+k)/(alpha+beta+k)` so "a flood... can't manufacture a high posterior". explicit_author must retain a floor (Known Context: "additive, not a substitute for explicit-author lane"). [SOURCE: external/aionforge-memory-development/docs/attestation-and-promotion.md §"How the substrate decides"; mcp_server/lib/scorer/lane-registry.ts:8-19] [INFERENCE — the clamp band + count floor are the design choice, not in the source.]

## Questions Answered
- **Q2 — ANSWERED (feasibility + critical-gap resolution).** Deterministic RRF is feasible: every lane is already a rankable `LaneMatch[]` (F13), scales are confirmed incomparable (F14), the injection point is shallow (F15). The conflict-edge gap is resolved by C1 (positive lane in RRF + separate post-fusion conflict re-rank). Determinism upgrade = C2.
- **Q7 — ANSWERED.** The advisor can import the SAME shared `fuseResultsMulti` (F17, shape-compatible, all RRF properties present), reimplementation is unnecessary (C3); the ONE non-reusable piece is the negative-conflict signal which must stay outside the primitive (F18). Advisor likely wants its own smaller `k` than the shared default 40.
- **Q3 — PARTIALLY ANSWERED (design candidate established).** Auto-tune is plausible and anti-overfit (C4 + F21) by mapping the bounded Beta posterior onto per-lane outcome evidence with cold-start neutrality, a count floor, and a clamped deviation band. OPEN: where outcome/confirmation signal is actually captured today (no outcome-logging site located yet) — needed before C4 is more than a design.

## Questions Remaining
- **Q1** — open (router design from iter-1 hypothesis; not advanced this iteration).
- **Q3** — design-complete but the outcome-capture source (what tells us a recommendation was "confirmed") is unlocated; needed to make C4 concrete.
- **Q4** — open (semantic-shadow exact-rerank graduation; semantic lane raw shape now confirmed in F14, ready to advance).
- **Q5** — open (ambient trigger harvest; watcher modules located in iter-1 F7, contents unread).
- **Q6** — open (graceful degrade; graph-causal + semantic-shadow already show degrade-not-error patterns — semantic returns `[]` on db/embedder failure, `lanes/semantic-shadow.ts:180,206`).

## Next Focus
Iteration 3: advance Q4 + Q5 + Q6.
- **Q4 (semantic exact-rerank):** the semantic lane is LIVE at weight 0.05 producing capped cosine ≥ 0.2 (F14); read aionforge `retrieval.md` dense+exact-rerank section + check whether a top-N exact rerank pass could graduate it. Where the embedder adapter feeds (`lanes/semantic-shadow.ts:128`).
- **Q5 (ambient harvest):** read `lib/daemon/watcher.ts` + `watcher-orchestrator.ts` (iter-1 F7) and the `docTriggers`/`SkillDocTriggerProjection` harvest path (`types.ts:29-35,59`); map galadriel ambient mining.
- **Q6 (graceful degrade):** confirm the graph_causal lane skips+reweights (not fails) when the skill-graph is absent — trace the `liveTotal` renormalization (iter-1 F4, `fusion.ts:343-345`) when a lane returns `[]`; compare to aionforge `embedder_available: false` (iter-1 F11).
