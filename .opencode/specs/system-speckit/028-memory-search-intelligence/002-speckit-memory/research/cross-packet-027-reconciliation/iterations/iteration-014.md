# Iteration 14 (Round L): Q5/Q8 determinism residuals — total-comparator + C5-B tiebreak

## Focus
Resolve the two open determinism residuals: (Q5) is the `incremental-index.ts:421` sort exposed to the total_cmp gotcha; (Q8) is C5-B's content-derived tiebreak already-covered by live `sortDeterministicRows`. Read-only.

## Findings (newInfoRatio 0.6)
**RESOLUTION-Q5: NON-ISSUE.** The `ids` sorted at `incremental-index.ts:421` is a `Set<number>` populated only via `ids.add(row.id)` guarded by `if (!row || typeof row.id !== 'number') continue` (`:368,:397,:412`), sourced from `SELECT id FROM memory_index` where `id` is `INTEGER PRIMARY KEY` (`schema-downgrade.ts:115`). NaN/null/undefined cannot originate there — the 028 total_cmp gotcha applies to string/derived ids, not this path. Zero work.

**RESOLUTION-Q8: NET-NEW.** The live `compareDeterministicRows` ties on `resolveEffectiveScore` desc → raw similarity desc → **`a.id - b.id`** (the numeric DB rowid, `ranking-contract.ts:43-53,62-63`), NOT a content-derived canonicalId. C5-B's contract is `score desc, then canonicalId asc` (a content-derived string key) — a genuinely different final tiebreak. The RRF fusion surface sorts on `rrfScore` with **no tiebreak at all** (relies on JS sort stability, `rrf-fusion.ts:255,391,424,551`). So C5-B is net-new on both surfaces. LEVERAGE M, EFFORT S.

## Most-likely-wrong
That C5-B is net-new — hinges on the final-tiebreak `id` being the raw DB rowid; if `row.id` is populated from a canonicalId-derived value somewhere upstream in the fusion pipeline (not audited), C5-B could be effectively already-covered.

## Next Focus
Q5 closed (non-issue, no transfer). Q8 C5-B confirmed net-new — the concrete deterministic-tiebreak transfer; pairs with 028's own C5-B Wave-0 item.
