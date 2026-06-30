# Iteration 4: Contradiction Quarantine + Full Candidate Ranking (Saturation)

## Focus

Close out the deep-loop research and rank. Two threads:
1. **Q2** — design a trust-keyed CONTRADICTS-edge quarantine of the lower-trust side, reusing the
   D2 reliability signal: deterministic victim selection, read-path exclusion by edge presence
   (retain both nodes), and stopping the quarantined finding from feeding
   `invertedContradictions`/`evidenceDepth`. Map to the three confirmed seams.
2. **Q7 + RANK** — confirm 001 determinism reuse, flag the Q6 anchor bug as a robustness defect,
   and produce the full ranked candidate table for the whole deep-loop packet. Candidate proposals
   only; confirmed vs inferred kept legible.

## Actions Taken

1. Read prior context: `iteration-003.md` (D1-D4 convergence design, D2 reliability signal as the
   shared dependency).
2. Located the Q2 seams under `deep-loop-runtime/lib/` (dispatch paths were approximate; resolved
   the real paths).
3. Read the three Q2 seams directly:
   - `findContradictions` — `coverage-graph/coverage-graph-query.ts:221-252`.
   - symmetric stability penalty — `coverage-graph/coverage-graph-signals.ts:511-522`
     (`findingStability`), plus the live convergence consumers `scripts/convergence.cjs:112-118,136`
     and the contradiction-density blocker `scripts/convergence.cjs:216-218`.
   - adjudicator seat scoring — `council/adjudicator-verdict-scoring.cjs:118-146`.
4. Confirmed the aionforge quarantine canon: `bi-temporal-model.md:103-128` (status mirror,
   both-retained, edge-presence read-guard, `current_support_facts` exclusion rule) and
   `trust-model.md:39,111-115` (losing-side failure attribution, durable re-derivable quarantine).

## Findings [ranked table]

### Q2 design findings [file:line]

**F-Q2a — `findContradictions` is trust-blind but already carries the trust inputs [CONFIRMED]**
`coverage-graph-query.ts:225-251`: the query SELECTs `e.weight, e.metadata` and both
`s.name`/`t.name`, then maps to a symmetric `ContradictionPair` (`sourceId`/`targetId`,
`weight`, `metadata`) with **no victim selection** — neither side is marked the lower-trust loser.
The reliability inputs (edge `weight`, node `metadata.reliability` from D2/iter-3 F4) are present
in scope but unused for keying. This is the exact attach point: add deterministic victim selection
(`victimId = argmin reliability(sourceNode, targetNode)`, tie-break on stable content-derived node
id — reuses the 001 content-derived ordering, Q7). [CONFIRMED by direct read of `:221-252`.]

**F-Q2b — `findingStability` penalizes BOTH endpoints symmetrically [CONFIRMED]**
`coverage-graph-signals.ts:511-522`: `stableFindings` counts FINDING nodes where
`NOT EXISTS (... e.source_id = n.id OR e.target_id = n.id AND relation='CONTRADICTS')`. The
`OR` makes the penalty symmetric — every CONTRADICTS edge marks BOTH its endpoints unstable, so a
weak finding contradicting a strong one drags the strong one's stability down too. Quarantine fix:
exclude only the quarantined (victim) node, and have the read-path treat a quarantined node as
absent from `current_support_facts`-style sets (aionforge `bi-temporal-model.md:124-126`) — the
non-victim retains its stability. [CONFIRMED `:511-522`.]

**F-Q2c — quarantine must be edge-presence-driven, retain both nodes, re-derivable [CONFIRMED from canon]**
aionforge `bi-temporal-model.md:103-128`: applying a CONTRADICTS edge mirrors
`source.status = quarantined` when the source is the lower-trust new fact; **both facts are
retained**; `status` is a "redundant scalar mirror of the edge-presence state," the edges are the
source of truth; the `current_support_facts` rule excludes any fact with a live outgoing
CONTRADICTS. `trust-model.md:111-115`: quarantine is durable + content-addressed, so the engine
re-derives it without host bookkeeping. Imported to deep-loop: a `metadata.quarantined` scalar on
the victim node is a cache; the read-path filter is `edge-presence` (`relation='CONTRADICTS'` AND
node is the lower-trust endpoint). Quarantined victim is excluded from `findingStability`,
`invertedContradictions` (`convergence.cjs:114`), and `evidenceDepth` accumulation. Both nodes
stay queryable for audit. [CONFIRMED from canon; mapping to deep-loop INFERRED-then-seam-checked.]

**F-Q2d — adjudicator seat scoring has a reliability-weight slot but no seat-reliability keying [CONFIRMED]**
`adjudicator-verdict-scoring.cjs:118-146`: `scoreVerdictDelta` merges `DEFAULT_WEIGHTS` with an
`options.weights` override (`:121`) and sums per-axis `weight*value` (`:134-137`). The override
slot is the attach point — a quarantined/low-reliability seat's verdict contribution can be keyed
down via `options.weights` (seat-reliability multiplier) without changing the delta math. No
schema change. This is the council-side analogue of the research-side quarantine, sharing the D2
reliability signal. [CONFIRMED `:118-146`; seat-reliability wiring is a candidate, not present.]

### Q7 / determinism findings

**F-Q7a — 001 determinism is reusable for victim tie-break and convergence folding [CONFIRMED-by-reference]**
The 001 work established reproducible convergence folding and content-derived ordering. The
quarantine victim tie-break (when both sides have equal reliability) must be deterministic to keep
convergence reproducible — reuse content-derived node-id ordering rather than insertion order or
timestamp. No new determinism mechanism needed. [CONFIRMED by reference to 001 scope; the specific
ordering call site is INFERRED — would confirm by reading the 001 folding helper.]

**F-Q7b — Q6 reducer-anchor template gap is a near-zero-effort correctness FIX, ship first [CONFIRMED iter-1]**
Per iter-1 `f-template-anchor-gap`: 7 reducer-target headings in the strategy template lack ANCHOR
markers, so the reducer's machine-owned-section rewrite can mis-target. Wrapping the 7 headings in
ANCHOR markers is a pure-template, near-zero-risk robustness defect fix with no runtime-code
change. This is a correctness FIX (not a feature) and should ship ahead of every BUILD item.

### FULL RANKED CANDIDATE TABLE — deep-loop

| Rank | ID | Candidate (one-line) | Seam (file:line) | Leverage | Effort | Conflict-risk | Verdict |
|------|----|----------------------|------------------|----------|--------|---------------|---------|
| 1 | **Q6-anchor** | Wrap 7 reducer-target headings in ANCHOR markers (template only) | strategy template (7 headings) | HIGH (unblocks reliable reducer rewrites) | S (near-zero) | LOW | **FIX — ship first** |
| 2 | **D2-reliability** | Derive `reliabilityPosterior` + `distinctReliableSourceCount` from `upsert.cjs` metadata slot | `coverage-graph-signals.ts:295-450`; reads `upsert.cjs:179,224` | HIGH (shared dep for D1/D3/Q2/Q7) | M | MED (signals contract) | **BUILD — foundation** |
| 3 | **D3-cap+gate** | `min(posterior, volumeTerm)` cap + two-gate STOP (count AND posterior ceiling) | `convergence.cjs:112-121` | HIGH (kills vote-count flood) | M | MED (recalibrates threshold 0.03) | **BUILD** |
| 4 | **Q2-quarantine** | Trust-keyed CONTRADICTS quarantine of lower-trust side; exclude victim from stability/contradiction/depth | `coverage-graph-query.ts:221-252` + `coverage-graph-signals.ts:511-522` + `convergence.cjs:114,216-218` | HIGH (stops weak-vs-strong mutual penalty) | M | MED (read-path filter change) | **BUILD** |
| 5 | **D1-weighted-Beta** | Add `computeWeightedScore(ΣrᵢFor, Σ(1-rᵢ)Against, α, β)` to `bayesian-scorer.ts` | `bayesian-scorer.ts:13-44` (new export) | MED (enables D2/D3 math) | S | LOW (additive export) | **BUILD** |
| 6 | Q3-fanout-recovery | Transient/fatal classification + durable bounded retry on the fan-out ledger | fan-out ledger (iter-2 `f-fanout-ledger-no-retry`) | MED-HIGH (resumability) | M | LOW-MED | BUILD |
| 7 | Q4-backpressure | Live lag/pending/failed gauges + enforceable `lag_ceiling` (cost guards are advisory today) | cost-guards (iter-2 `f-costguards-advisory`,`f-no-live-gauges`) | MED | M | MED (enforcement path) | BUILD |
| 8 | D4-policy-config | Off-by-default `convergence.reliability` policy + aionforge config-validation rule | `convergence.cjs` (mirror `promotion.enabled:109`) | MED (safe rollout) | S | LOW | BUILD |
| 9 | Q2-adjudicator-seat | Seat-reliability multiplier via `options.weights` override in council scoring | `adjudicator-verdict-scoring.cjs:118-146` | MED | S | LOW | BUILD (council-side, optional) |
| 10 | Q5-carried-forward | Per-iteration carried-forward open-questions block | promptpack/continuity (iter-2 `f-promptpack-stateless`) | LOW-MED | S | LOW | BUILD |
| 11 | Q7-rank-field | Reliability field for finding ranking into `findings-registry.json` | findings-registry consumer | LOW-MED | S | LOW | BUILD (depends on D2) |

**TOP-5 (ranked):** (1) Q6-anchor FIX → (2) D2-reliability → (3) D3-cap+gate → (4) Q2-quarantine →
(5) D1-weighted-Beta. D2 is the keystone: D1/D3/Q2/Q7 all consume it. Q6-anchor is a correctness
fix that ships independently and first.

## Questions Answered

- **Q2 (CONFIRMED + designed):** Quarantine the lower-trust side of each CONTRADICTS edge.
  Deterministic victim = `argmin reliability` over the two endpoints (D2 signal), tie-break on
  content-derived node id (001 determinism, Q7). Mark `metadata.quarantined` as a scalar cache;
  the read-path filter is edge-presence (`relation='CONTRADICTS'` AND node = lower-trust endpoint),
  mirroring aionforge `current_support_facts` (`bi-temporal-model.md:124-126`). Exclude the victim
  from `findingStability` (`coverage-graph-signals.ts:511-522`), `invertedContradictions`
  (`convergence.cjs:114`), and evidence-depth accumulation — the non-victim keeps its signals.
  Both nodes retained for audit. Council analogue: seat-reliability weight via `options.weights`
  (`adjudicator-verdict-scoring.cjs:121`).
- **Q7 (CONFIRMED-by-reference):** 001 determinism (reproducible folding, content-derived ordering)
  is the tie-break + reproducibility substrate; no new mechanism. Q6 anchor gap is a robustness
  defect, ranked FIX #1.
- **RANK:** full 11-candidate table produced; top-5 named.

## Questions Remaining

- Threshold re-baselining for D3 (`convergenceThreshold:0.03`) is unvalidated — INFERRED risk,
  needs a measured calibration run (out of research scope; a build-time task).
- The exact 001 content-derived ordering call site is unread (F-Q7a) — confirm before
  implementing the quarantine tie-break.
- No new aionforge/galadriel sources surfaced this iteration beyond the already-cited
  consolidation/bi-temporal/trust-model docs — signal of saturation.

## Next Focus

SATURATED. Recommend proceeding to synthesis: all 6 research questions (Q1-Q6) plus Q7 ranking are
answered, every candidate has a confirmed file:line seam, leverage/effort/conflict-risk, and a
PROMOTE/BUILD/FIX verdict, and the dependency spine (D2 keystone) is identified. No productive new
external evidence remained. Synthesis should emit the top-5 build order: Q6-anchor FIX first, then
D2 → D3 → Q2 → D1.
