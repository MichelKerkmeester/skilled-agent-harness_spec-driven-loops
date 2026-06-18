# Iteration 15: Round F Verify+Feasibility — Code Graph Remainder

## Focus
Round F verify+feasibility for the iter-8/10 Code Graph remainder. Read-only.

## Assessments (newInfoRatio 0.55)
| Candidate | Real | Feasibility | Note |
|---|---|---|---|
| CG-symbol-timeline-query | PARTIAL | CAUTION | dead-edge half exists (tombstones) but live half IMPOSSIBLE — `code_edges` has no `created_at`; tombstones default-OFF + globally capped at 100, so per-symbol chronology evaporates; needs schema add + per-symbol index |
| CG-rrf-position-only | REAL | GO but **REDUNDANT** | position-only IS standard RRF; the shared `rrf-fusion.ts` fuser already exists and Code-Graph adoption is ALREADY roadmap-tracked (Q8) → fold into 002/Q8, don't double-track |
| CG-per-row-audit-signing | **REFUTED** | NO-GO | over-engineering flag CONFIRMED — local single-writer, fully rebuildable-from-source derived artifact has no untrusted-write threat; `signature` col (:172) is a CODE signature not crypto; crypto keyring adds key-mgmt + per-write cost mitigating nothing |

## Key correction
Code Graph remainder is thin: symbol-timeline blocked by the no-timestamp edge schema + capped tombstones; rrf-position-only is REDUNDANT with the already-tracked Q8 fuser adoption; per-row-signing is confirmed over-engineering for a single-writer rebuildable artifact. Nothing net-new survives as a standalone GO here.

## Next Focus
Code Graph remainder yields no new standalone GO — fold rrf-position-only into Q8, drop per-row-signing, defer symbol-timeline (needs schema). Feeds synthesis.
