# Phase 4: Convert mcp_server/ Foundation Layers

> **Parent Spec:** `092-javascript-to-typescript/`
> **Workstream:** W-D
> **Tasks:** T050–T085
> **Milestone:** M5 (MCP Foundation Done)
> **SYNC Gate:** SYNC-005
> **Depends On:** Phase 3 (SYNC-004)
> **Session:** 2

---

## Goal

Convert `mcp_server/` bottom-up from leaf modules. Foundation layers have no internal dependencies beyond `shared/`, so type errors don't cascade.

## Scope

**Target:** `system-spec-kit/mcp_server/` — 34 files across 12 sub-layers, ~8,500 lines

### Sub-Layers (dependency-aware order)

| Layer | Directory | Files | Key Types |
|-------|-----------|------:|-----------|
| 4a | `lib/utils/` | 4 | `formatAgeString`, `TokenConfig`, `PathValidation` |
| 4b | `lib/errors/` | 4 | `MemoryError`, `ErrorCode` enum, `RecoveryHint` |
| 4c | `lib/interfaces/` | 3 | Already well-structured -> proper TS interfaces |
| 4d | `lib/config/` | 3 | `MemoryType`, `MemoryTypeConfig`, `TypeInference` |
| 4e | `lib/scoring/` | 6 | `CompositeScore`, `FiveFactorWeights`, `ImportanceTier` |
| 4f | `lib/response/` | 2 | `MCPResponse<T>`, `ResponseEnvelope` |
| 4g | `lib/architecture/` | 3 | `Layer`, `ToolLayerMap`, `TokenBudget` |
| 4h | `lib/validation/` | 2 | `PreflightResult`, `PreflightConfig`, `PreflightError` |
| 4i | `lib/parsing/` | 5 | `MemoryMetadata`, `ParsedMemory`, `TriggerMatch` |
| 4j | `formatters/` | 3 | `TokenMetrics`, `FormattedSearchResult` |
| 4k | `utils/` (top-level) | 4 | `InputLimits`, `BatchOptions`, `JsonParseResult` |
| 4l | `core/` | 3 | `ServerConfig`, `DatabaseState`, `ConstitutionalCache` |

### Parallelization

Sub-layers 4a–4h have no inter-dependencies within this phase — they can be converted in parallel. Layers 4i–4l depend on earlier layers and must follow sequentially.

### Agent Allocation (Session 2)

| Agent | Layers | Files |
|-------|--------|------:|
| Agent 4 | 4a + 4b | 8 |
| Agent 5 | 4c + 4d | 6 |
| Agent 6 | 4e + 4f | 8 |
| Agent 7 | 4g + 4h | 5 |
| Agent 8 | 4i | 5 |
| Agent 9 | 4j + 4k | 7 |
| Agent 10 | 4l | 3 |

## Exit Criteria

- [ ] All 34 files compile with `tsc --noEmit` (zero errors)
- [ ] All barrel `index.ts` files re-export correctly
- [ ] Foundation types available for Phase 5 upper layers
- [ ] Existing tests pass against compiled output
- [ ] SYNC-005 gate passed
