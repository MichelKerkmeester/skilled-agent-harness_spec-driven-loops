# Iteration 8 (Round K): Q8 Search Resilience / Score-scale / Response-policy × deterministic RRF + active-channel denominator

## Focus
Reconcile 027's score-scale + reranking + response-policy fixes against 028's deterministic RRF + C-X1 active-channel denominator + C5-B tie-break. Read-only.

## Findings (newInfoRatio 0.4)
**VERDICT: EXTENDS** — different pipeline seam, layers on top; with a key already-live nuance on C-X1.
- 027 normalizes raw per-channel scores to 0-1 and fixes filter-before-truncate visibility/response-policy ordering (`hybrid-search.ts:121-126`; `vector-index-queries.ts:414-424,474-479`). 028's `fuseResultsMulti` fuses by RANK (`rrf-fusion.ts:310` `1/(k+i+1)`), discarding raw magnitude — so RRF **sidesteps** the score-scale fix, not supersedes.
- **C-X1 substance is ALREADY LIVE:** zero-weight/empty channels are excluded from `activeChannelCount` and the bonus denominator already uses active count (`rrf-fusion.ts:296-371`). 028 only formalizes the selectable `{bonusOverChannels:'active'|'configured'}` option (default 'active' = byte-identical). So C-X1 is *partial* already-covered; only the `'configured'` branch is net-new.
- C5-B (content-derived tie-break `score desc, canonicalId asc`) is genuinely net-new on top of 027. LEVERAGE M, EFFORT S.

## Most-likely-wrong
That C-X1 is "already-covered" — the live fuser only implements the 'active' branch, so the selectable 'configured' alternative is genuinely new; the net-new delta may be larger than credited.

## Next Focus
Round L: C5-B tie-break is the concrete net-new search transfer; confirm the live `sortDeterministicRows` (`stage2-fusion.ts:94,287`) vs C5-B's canonicalId tiebreak.
