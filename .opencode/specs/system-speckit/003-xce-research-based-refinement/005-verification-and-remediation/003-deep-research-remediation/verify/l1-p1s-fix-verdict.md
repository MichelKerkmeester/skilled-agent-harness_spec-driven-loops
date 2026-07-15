# Adversarial Fix Verification — L1 P1 pair (tri-050, tri-005)

**Verifier:** Fable 5 (fresh context) · **Date:** 2026-06-12 · **State verified:** uncommitted working tree on `028-mcp-to-cli-tool-transition`

```
tri-050: INCOMPLETE
tri-005: INCOMPLETE
```

Both fixes are correct as far as they go — neither is a regression. Both leave a specific, small piece of the original problem standing.

---

## tri-050 — query fingerprints persisted raw query prefixes: INCOMPLETE

### What's right (the code fix itself is correct)

- **(a) Hash-only fingerprint.** `computeQueryFingerprint` is now `sha256(query).hex.slice(0,16)` with no prefix (`mcp_server/lib/telemetry/consumption-logger.ts:114-117`); module header updated to "no prefix, no substring, no recoverable content" (`:12-14`). All four `getConsumptionPatterns` example builders emit only `fingerprint:${query_hash}` (`:352`, `:380`, `:416-421`, `:447`); the session-heavy example truncates `session_id`, which is a derived internal id documented as non-PII (`:42-44`). No raw query substring is produced by any current code path.
- **(b) Dedup/grouping preserved.** The fingerprint remains a deterministic sha256 of the full query; grouping assertions T004-B/D/E now compute the expected hash via a mirrored `fp()` helper and pass (`tests/consumption-logger.vitest.ts:40-44`, `:386`, `:420`, `:434`). The privacy suite's mirrored recipe was updated identically (`tests/consumption-logger-privacy.vitest.ts:24-28`).
- **(d) Tests run by verifier:** `npx vitest run tests/consumption-logger.vitest.ts tests/consumption-logger-privacy.vitest.ts tests/handler-checkpoints.vitest.ts` → **3 files, 96/96 passed** (1.00s).
- **No regression in shadow replay:** `lib/feedback/shadow-evaluation-runtime.ts:204-212` probes for the absent `query_text` column and returns an empty replay pool — clean-schema DBs skip the cycle instead of throwing.

### Why INCOMPLETE — the persisted leak still exists

1. **Legacy prefix-bearing rows were not purged.** The live DB (`mcp_server/database/context-index.sqlite`) holds **204/204** `consumption_log` rows in the old `prefix:hash` format — raw 8-char query prefixes are persisted right now (verified read-only: `Check co:0a78…`, `Dual Cla:ec0b…`, `Read the:d20b…`). `getConsumptionPatterns` will re-surface these prefixes verbatim in its example strings, so check (a) fails against the data even though it passes against the code. The fix shipped no migration, despite the module's own precedent that these rows are disposable telemetry (`initConsumptionLog` drops the whole table when the older `query_text` column is found, `consumption-logger.ts:131-142`). A one-line purge in `initConsumptionLog` (`DELETE FROM consumption_log WHERE query_hash LIKE '%:%'` or instr-based equivalent) closes this.
2. **The running daemon still executes the old recipe.** `dist/lib/telemetry/consumption-logger.js` (built Jun 11 21:01, before the Jun 12 13:43 source fix) still contains `query.slice(0, 8)` + `${prefix}:${hex}`. `dist/` is gitignored, but the MCP launcher only rebuilds when artifacts are **missing**, not stale (`buildIfNeeded` / `artifactsReady`, `.opencode/bin/mk-spec-memory-launcher.cjs:1046-1080`), and `package.json` `start` runs `dist/context-server.js`. Without an explicit `npm run build` (workspace `@spec-kit/mcp-server`) the daemon keeps writing prefix-bearing fingerprints indefinitely — which also keeps re-creating the rows item 1 purges.

**To close tri-050:** add the legacy-row purge to `initConsumptionLog`, rebuild dist (and restart the daemon), re-verify the table contains no `%:%` fingerprints.

### Follow-ons (same leak class in other loggers — not pass-blockers per dispatch)

- **`lib/eval/eval-logger.ts:151-158`** — `logSearchQuery` INSERTs the **full raw query text** into `eval_queries.query`. Confirmed live: `database/speckit-eval.db` holds 110 raw queries (e.g. "what is the learning index formula used…"). Worse than the prefix leak tri-050 fixed.
- **`lib/cognitive/adaptive-ranking.ts:403-413`** — `recordAdaptiveSignal` persists raw `event.query` into `adaptive_signal_events.query` (and callers can pass `queryText` in `metadata`, read back at `shadow-evaluation-runtime.ts:131-135`). Gated by adaptive mode ≠ disabled.
- **`lib/cognitive/adaptive-ranking.ts:795-798`** — shadow runs persist raw `query` into `adaptive_shadow_runs.query` **and again inside `proposal_json`**.

---

## tri-005 — catalog write-ingress claim vs excluded paths: INCOMPLETE

### What's right — the new claims are TRUE as written against the shipped guards (commit `61b529fde3`)

- **(a-1) Retirement carries the manual tier forward — it does not merely skip retirement.** `retirePredecessorForActiveReindex` reads the predecessor's `importance_tier` + `source_kind` (`lib/storage/lineage-state.ts:1373-1375`), still deprecates the row to free the active-row uniqueness slot (`:1397-1400`), and returns a `RetiredPredecessorCarry` for manual source kinds (`:1392-1395`); constitutional rows are exempted entirely (`:1382-1383`). The same-path reindex caller re-applies the carried tier to the successor and re-stamps `source_kind='human'` so protection survives (`handlers/memory-save.ts:2615-2617`, `:2649-2658`). Covered by new tests (`tests/source-kind-safety.vitest.ts:19-69`).
- **(a-2) Auto-promotion refuses manual source kinds before and atomically at update time.** Pre-selection refusal: `checkAutoPromotion` returns `source_kind_not_promotable` for manual kinds (`lib/search/auto-promotion.ts:178-186`). Atomic predicate: the UPDATE carries `AND (source_kind IS NULL OR lower(source_kind) NOT IN (<manual kinds>))` inside a transaction and reports `concurrent_manual_guard` on zero changes (`:273-287`) — the TOCTOU race is genuinely closed.
- **(b) No OTHER unguarded ingress path is documented elsewhere.** The 022 implementation-summary Known Limitations list contains only the same two items plus the intentional `memory_update` human-facing note (`implementation-summary.md:143-145`). The catalog sentence ("the two ingress paths that originally bypassed the guard are now covered") is literally accurate.

### Why INCOMPLETE — the packet now contradicts itself

**`022-provenance-injection/implementation-summary.md:143-144` still states both gaps "remain follow-on work"** ("Same-path save/reindex can retire a manual predecessor without a protected-source check", "Automated tier promotion can still update importance_tier without a source-kind protection check") with no "Addressed" annotation — directly contradicting the new spec.md §9 annotations (`spec.md:241-242`) and the new catalog wording. The fix annotated one of the two packet docs that carried the stale claim. Completion-metadata reconciliation requires both. **To close tri-005:** annotate Known Limitations items 1-2 in `implementation-summary.md` the same way §9 was annotated.

Minor wording nit (not a blocker): the §9 item-1 annotation cites only `lib/storage/lineage-state.ts` as carrying the tier forward; lineage-state only *returns* the carry — the re-application half lives in `handlers/memory-save.ts:2649-2658`, and that is the **only** call site that honors the carry (see follow-ons).

### Follow-ons (same guard class, previously undocumented — discovered by code inspection, so outside check (b)'s "documented elsewhere" scope, but they erode the catalog's broader "skip protected automated overwrites" sentence)

- **PE SUPERSEDE has no source-kind guard at all:** `markMemorySuperseded` sets `importance_tier='deprecated'` by bare id (`handlers/pe-gating.ts:288-310`); the PE decision layer never consults `source_kind` (`lib/cognitive/prediction-error-gate.ts` — zero matches for source_kind/protect/manual). An automated save whose content contradicts a human-authored memory deprecates it with no protection and no carry.
- **PE UPDATE discards the retire carry:** `updateExistingMemory` calls `retirePredecessorForActiveReindex` and ignores the returned carry (`handlers/pe-gating.ts:351`), so a manual predecessor's tier is not carried onto the appended successor.
- **Reconsolidation merge discards the carry and re-stamps `source_kind='system'`:** `lib/storage/reconsolidation.ts:324`, `:332` (and a direct deprecate at `:523`); no manual-row eligibility filter found in the module.
- **`handlers/save/create-record.ts:327`** also discards the carry (PE-routed lineage; reachability for manual predecessors depends on PE decisions, which per above are unguarded).
- **`lib/scoring/confidence-tracker.ts:262-266`** — `promoteToCritical` mutates `importance_tier` with no source-kind check (reachability unverified).

Recommendation: either extend the carry/guard to the PE and reconsolidation retire sites, or hedge the catalog's "skip protected automated overwrites before mutation" sentence to name the guarded surfaces (create/update handlers, same-path reindex retire, auto-promotion).

---

## Verification commands run

- `git diff` on `consumption-logger.ts`, both test files, `feature_catalog.md`, 022 `spec.md`
- `npx vitest run tests/consumption-logger.vitest.ts tests/consumption-logger-privacy.vitest.ts tests/handler-checkpoints.vitest.ts` → 96/96 pass
- Read-only SQLite inspection of `context-index.sqlite` (`consumption_log`) and `speckit-eval.db` (`eval_queries`)
- Direct reads of guard code, all 4 `retirePredecessorForActiveReindex` call sites, PE orchestration/gating, write-provenance, crud-update guard, launcher build logic, stale `dist` artifact
