# Iteration 22: Round D Cross-System Synthesis Verification — The Determinism Spine (PARTIAL: 2 of 4)

## Focus
Round D synthesis verification of the roadmap's HEADLINE claim that "determinism is the strongest unifying spine" — does ONE shared root defect + ONE shared fix genuinely recur across all 4 subsystems? Default-to-refute/qualify if the four seams are materially different. Read-only across all 4 subsystem seams.

## Verdict: **PARTIAL — 2 of 4** (newInfoRatio 0.55)
| Subsystem | Same root (non-content-derived order)? | Same fix shape? | Evidence |
|---|---|---|---|
| Memory (recall serialization) | **NO** — `envelope.ts` is bare `JSON.stringify` + a `Date.now` LATENCY stamp, not a ranking tiebreak; the real ordering primitive (RRF `fuseResultsMulti`) is ALREADY content-derived | already-implemented | envelope.ts:99-101,136-138,180; hybrid-search.ts:14 imports fuseResultsMulti |
| Code Graph (impact/dep walk) | **PARTIAL** — node/symbol reads ARE content-ordered (ORDER BY), but edge-expansion queries lack ORDER BY + the walk doesn't re-sort → edge visitation is rowid-order | yes, but "add ORDER BY/sort edges", NOT RRF | code-graph-db.ts:1273,1296,325,357 (no ORDER BY) vs :1241,:1208 (ordered); code-graph-context.ts:540-595 |
| Deep Loop (fan-out merge) | **YES** — first-write-wins by arrival; output is Map-insertion (arrival) order | yes — content-tiebreak / RRF-merge of ranked finding-lists fits | fanout-merge.cjs:125-132,136 |
| Skill Advisor (weighted-sum fold) | **NO** — already ends the sort with `localeCompare` (content-derived stable tiebreak) — the FIX EXEMPLAR, not a defect | already-implemented | fusion.ts:425-433 |

## Key correction to the roadmap
- The headline "**determinism is the strongest unifying spine**" is **OVERSTATED**. The four "instances" are materially different mechanisms (JSON serialization-layout / SQL traversal-order / Map-merge / ranked-sort). Only **2 are genuine current defects** (Code Graph edge-walk order; Deep Loop fan-out merge). Memory + Advisor **already** order by content.
- The roadmap's Memory anchor (`envelope.ts` "bare JSON.stringify w/ clock-derived tiebreak") is **MISLOCATED** — envelope is serialization, the `Date.now` is a latency stamp, and the real fusion ordering is already deterministic.
- `fuseResultsMulti` cleanly serves **2** (Memory — already in use; Deep Loop — good fit for lineage finding-list merge), NOT ≥3. Advisor could be refactored to it but doesn't need to be; Code Graph is a traversal (ORDER BY), not a list-merge. **The roadmap's "≥3 reuse" is optimistic.**

## Synthesis impact
Re-frame the determinism spine in `roadmap.md` from "the strongest unifying spine across 4 subsystems" to "**2 genuine determinism defects (Code Graph edge-walk + Deep Loop merge) + a shared *principle* (order by content)**; Memory + Advisor already comply; `fuseResultsMulti` reuse = 2 clean, not ≥3." This is the single most important honesty correction of the broadening campaign.

## Next Focus
Determinism spine corrected to 2-of-4. The real determinism work: det-context-order-global (Code Graph edge-walk ORDER BY) + DL-order-independent-merge-tiebreak (Deep Loop). Both Round-C GOs. Feed the synthesis re-tag.
