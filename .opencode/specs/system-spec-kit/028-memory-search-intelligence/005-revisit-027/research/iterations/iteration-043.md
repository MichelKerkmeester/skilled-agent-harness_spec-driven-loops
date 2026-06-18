# Iteration 43 (Round O): C-X1 'configured' branch true delta → marginal

## Focus
Resolve the iter-008 open: how material is C-X1's net-new 'configured' branch. Read-only.

## Findings (newInfoRatio 0.5)
**VERDICT: 'configured'-branch MARGINAL.** No 027/028 candidate needs it; the value is the already-live 'active' half.
- The 'active' denominator is already live + hardcoded: zeroed (`weight<=0`) AND empty channels `continue` and never increment `activeChannelCount`; `totalChannels=activeChannelCount` (`rrf-fusion.ts:304,307,345`). The denominator only matters in calibrated mode (`overlapRatio=(channelsHit-1)/max(1,totalChannels-1)`, `:360`).
- C2-B zeroes channels via `RankedList.weight` (`weight:0` → the `continue`), so it ALREADY gets correct 'active' shrinkage (`:83-86,302`). 'configured' (count zeroed channels) would INFLATE the denominator → deflate survivors' bonus — the precise distortion C-X1 exists to prevent. So 'configured' is the wrong behavior for the only named consumer.
- C-X1's real H-leverage = the already-live 'active' semantics + exposing `bonusOverChannels` as a NAMED param for cross-sibling importers (Advisor C3, Code Graph Q8) — all of whom also want 'active'. The net-new 'configured' code path is L/theoretical. LEVERAGE L (for 'configured'), EFFORT S.

## Most-likely-wrong
A determinism/prompt-cache argument: a fixed (configured-count) denominator makes a candidate's bonus byte-identical ACROSS queries regardless of which channels were active that run — which is the byte-stable spine 028 prizes. If that cross-query stability is judged material, 'configured' flips to a real determinism-spine requirement.

## Next Focus
C-X1 ledger entry: 'active' already-covered (the value); 'configured' marginal (caveat: cross-query-determinism could make it material). Refines iter-008.
