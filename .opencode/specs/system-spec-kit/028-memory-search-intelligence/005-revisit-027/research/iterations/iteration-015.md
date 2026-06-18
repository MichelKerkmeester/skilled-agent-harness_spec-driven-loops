# Iteration 15 (Round L): Q9 deep — lineage as-of recall-wiring → LIB-ONLY (TemporalMode is net-new UX)

## Focus
Resolve the Round K Q9 open: is `resolveLineageAsOf` wired to the recall surface, or lib-only. Read-only deep-dive.

## Findings (newInfoRatio 0.5)
**RESOLUTION: LIB-ONLY.** The as-of/history read path is reachable only from lib + tests — never a handler, MCP tool, or recall surface.
- `resolveLineageAsOf` (`lineage-state.ts:1025-1043`) + public wrapper `resolveMemoryAsOf` (`:1426-1430`) have **zero non-test callers** across `handlers/` + `tools/` (empty grep). Handlers import only WRITE lineage fns (`memory-save.ts:38`), never the readers. `memory-search.ts` has no temporal axis (no asOf/temporal/known_at/recallMode).
- Resolver is valid-time only (`valid_from <= asOf && (valid_to==null || valid_to>asOf)`, `:1037-1039`); no `ingested_at`/`known_at` column.
- Corroborated by an archived audit ("ln() exists but has no handler or tool surface").
**So 028's TemporalMode is genuinely NEW user-facing capability** — even valid-time AsOf/History is unexposed; AsKnownAt additionally needs the C3-B four-timestamp store. Build path: C3-B schema (M) → C3-C mode plumbing + recall-mode params + provider (M/L). Gauge gap: 027's `getBackgroundEnrichmentStats` is count-based (active/queued/dropped/failure); 028's `lag` (time/staleness) has **no 027 analogue**. LEVERAGE M, EFFORT M/L.

## Most-likely-wrong
That lineage as-of has ZERO recall reachability — did not exhaustively walk the `spec-memory.cjs` CLI front-door or a possible re-export alias; a `memory_history`/`memory_lineage` inspection tool could expose a read path not enumerated.

## Next Focus
Q9 resolved: TemporalMode = net-new UX (not a re-wire); `lag` gauge net-new. Feeds the bi-temporal shared-store synthesis (L9) + the ledger.
