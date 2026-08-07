# Iteration 25 (Round M): TemporalMode recall plumbing — cheap path vs full AsKnownAt

## Focus
Scope the minimal recall-surface plumbing to expose as-of (given resolveLineageAsOf is lib-only). Read-only.

## Findings (newInfoRatio 0.5)
**CHEAP-PATH (S): a dedicated `memory_history` / `memory_lineage` read tool.** Both lib primitives already exist:
- `inspectLineageChain(db, memoryId)` → full History (no new lib code).
- `resolveMemoryAsOf(db,{memoryId,asOf})` → point-in-time valid-time snapshot.
Registration is 3 touches: add to the `TOOL_NAMES` Set (`memory-tools.ts:45-63`), a `handleTool` switch case (`:67`), and a ~50-100 LOC handler. A `memory_search` asOf param is the WORSE shape (as-of is a by-id point lookup, not a ranked sweep).
**FULL-PATH (M/L, gated on C3-B):** C3-C AsKnownAt needs the txn-time columns the snapshot type lacks (`ResolvedLineageSnapshot` carries only valid_from/valid_to, `lineage-state.ts:55-56,106`). Build: C3-B schema → extend resolveLineageAsOf with TemporalMode + asKnownAt → current-support provider → surface the enum. LEVERAGE M.

## Most-likely-wrong
That the cheap path is "S" — `validateToolArgs` (`memory-tools.ts:67`) implies a JSON-schema/inputSchema registry + per-recall-tool guards (scoping, redaction) every existing tool implements; satisfying all of those slips S→M.

## Next Focus
Cheap valid-time as-of exposure (memory_history tool) is a standalone S/M win independent of the C3-B bi-temporal build. Feeds the ledger + sequencing.
