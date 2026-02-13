# Phase 5: Convert mcp_server/ Upper Layers

> **Parent Spec:** `092-javascript-to-typescript/`
> **Workstream:** W-E
> **Tasks:** T090–T130
> **Milestone:** M6 (MCP Upper Done)
> **SYNC Gate:** SYNC-006
> **Depends On:** Phase 4 (SYNC-005)
> **Session:** 3

---

## Goal

Convert the stateful, complex MCP server modules that depend on the foundation layers. These include the largest and most complex files in the codebase.

## Scope

**Target:** `system-spec-kit/mcp_server/` upper layers — 42 files, ~23,300 lines

### Sub-Layers (dependency chain)

| Layer | Directory | Files | Lines | Key Types |
|-------|-----------|------:|------:|-----------|
| 5a | `lib/embeddings/` | 2 | 662 | `ProviderChain`, `ProviderTier`, `FallbackReason` |
| 5b | `lib/cognitive/` | 11 | 5,577 | `DecayScore`, `FSRSState`, `ConsolidationPhase`, `TierState`, `WorkingMemory` |
| 5c | `lib/search/` | 9 | 5,887 | `SearchResult`, `BM25Document`, `HybridConfig`, `RRFConfig`, `IntentType` |
| 5d | `lib/storage/` | 8 | 3,022 | `CausalEdge`, `Checkpoint`, `HistoryEvent`, `TransactionResult` |
| 5e | `lib/session/` | 4 | 1,217 | `SessionState`, `DeduplicationResult`, `Channel` |
| 5f | `lib/cache/` | 2 | 559 | `CacheEntry<T>`, `CacheStats` |
| 5g | `lib/learning/` | 2 | 712 | `Correction`, `CorrectionType`, `StabilityPenalty` |
| 5h | `lib/providers/` | 3 | 535 | `RetryQueue`, `BackgroundJob` |
| 5i | `hooks/` | 2 | 194 | `SurfaceConfig`, `MemoryAwareTool` |
| 5j | `handlers/` | 10 | 5,029 | `HandlerResult`, per-handler input/output types |
| 5k | `scripts/` | 1 | 119 | CLI entry point |
| 5l | `context-server.ts` | 1 | 525 | MCP server entry point, tool definitions |

### Top Complex Files

1. `lib/search/vector-index.js` — 3,309 lines (SQLite + sqlite-vec, schema v4 migrations)
2. `handlers/memory-save.js` — 1,215 lines (PE gating, FSRS, atomic saves)
3. `lib/cognitive/consolidation.js` — 1,054 lines (4-phase engine)
4. `lib/session/session-manager.js` — 1,045 lines (deduplication, crash recovery)
5. `lib/errors/recovery-hints.js` — 852 lines (error catalog)

### Dependency Chain

```
5a → 5b → 5c → 5d → 5e → 5f/5g/5h (parallel) → 5i → 5j → 5k/5l
```

## Exit Criteria

- [ ] All 42 files compile with `tsc --noEmit` (zero errors)
- [ ] MCP server starts: `node mcp_server/context-server.js` initializes all tools
- [ ] All 20+ MCP tools respond correctly
- [ ] Existing tests pass against compiled output
- [ ] SYNC-006 gate passed
