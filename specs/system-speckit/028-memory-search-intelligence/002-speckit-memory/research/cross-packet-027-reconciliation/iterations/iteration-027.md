# Iteration 27 (Round M): C5-B canonicalId tiebreak plumbing

## Focus
Is a content-derived key already plumbed onto the rows the comparator + RRF sort see. Read-only.

## Findings (newInfoRatio 0.6)
**RESOLUTION: NEEDS-PLUMBING (S-M, lean M).** `content_hash` is a DB column/PK but is NOT carried onto the search-result rows.
- `compareDeterministicRows` ties on effectiveScore → raw similarity → `a.id - b.id` (raw rowid), no content key (`ranking-contract.ts:46-53`).
- `PipelineRow` declares id/similarity/score/rrfScore/content but **no content_hash/canonicalId** (only via the untyped `extends Record<string,unknown>` escape hatch, `pipeline/types.ts:15-55`).
- All 3 RRF sorts are `b.rrfScore - a.rrfScore` with **zero tiebreak**; `RrfItem` surfaces no content key (`rrf-fusion.ts:254-255,390-391,550-551`).
- **Refutes the prior worry:** `canonicalResultId(r.id)` is derived FROM the numeric id for dedup-map keys — so `row.id` IS the raw rowid, not a content value (`hybrid-search.ts:643-645`). Cost: add content_hash to the candidate SELECT + mirror onto RrfItem + the comparator/sort tiebreak. LEVERAGE M, EFFORT S-M.

## Most-likely-wrong
Could not confirm content_hash is selected at `hybrid-search.ts:752-766` (grep of lib/search found only canonicalResultId at 643/1250). IF a channel SELECT (FTS5/semantic) already projects content_hash onto rows, C5-B collapses to the one-line comparator/ORDER BY tweak (true S). → Round N spot-check.

## Next Focus
C5-B = needs-plumbing (S-M); reuses Primitive A / content_hash. Pairs with the two-primitive module (Wave-0) → C5-B Wave-1.
