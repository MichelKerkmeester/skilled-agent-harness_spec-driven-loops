# Iteration 26 (Round M): Forget-allowlist feasibility + applicability

## Focus
Scope Q1's net-new forget-allowlist transfer onto 027's retention tier predicate. Read-only.

## Findings (newInfoRatio 0.55)
**FEASIBILITY: ADDITIVE-M.** Seam = `isProtectedFromRetentionDelete(row)` (`memory-retention-sweep.ts:185-193`) — a single pure-boolean chokepoint at 2 call sites (dry-run :446, live loop :543). The predicate add is ~1 line, but **no label/tag/category column exists** in the retention surface (`OPTIONAL_RETENTION_COLUMNS` = {importance_tier, decay_half_life_days, is_pinned, access_count, last_accessed}, :126-130) — so a forget-label dimension must be threaded through both SELECT builders (`selectExpiredRows` :150-173 + TOCTOU re-select :214-233), the `RetentionExpiredRow` type, and a new audit reason. Predicate additive; data plumbing is the real cost.
**APPLICABILITY: spare-only = NO.** 027 selects purely on TTL (`delete_after < now`, :169-171); `countRows` is report-only (:244), never a delete precondition. aionforge-forget's "forget only under capacity pressure" presupposes a pressure dimension 027 doesn't model — the allowlist half layers cleanly, the spare-capacity AND-gate half does not fit.
**What-speaks-old-contract:** handler "high-tier/pinned" message (`handlers/memory-retention-sweep.ts:43-44`), `protectedCount`/`protectedIds` consumers, governance audit shape (`reason:'retention_tier_protected'`, :553-570), and a DUPLICATE protection def (reducer `PROTECTED_TIERS` :153 vs sweep `PROTECTED_RETENTION_TIERS` :177) to keep in sync. LEVERAGE M, EFFORT M.

## Most-likely-wrong
Grepped only sweep+reducer, not the full memory_index schema/migrations — a reusable label-ish column (feedback_label/source/category) could already exist, collapsing EFFORT M→S.

## Next Focus
Q1 forget-allowlist = additive-M (allowlist only; spare-only dropped). Ledger notes the duplicate-protection-def sync hazard.
