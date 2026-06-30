# Iteration 37: Round J Build Sequence — Memory MCP (4-phase, critical path C4-A→C4-C→C-G1)

## Focus
Round J: the ordered build sequence for Memory, applying all broadening corrections. Read-only.

## Build sequence (newInfoRatio 0.25)
| Phase | Candidates | Depends on | Risk |
|---|---|---|---|
| 0 (Wave-0) | C9, C5-B (TOTAL comparator), M-spare-only (fix EXTENDABLE_TIERS={'important'}), M-relative-score-band | none — isolated single-file seams | low/reversible (M-never-truncate is benchmark-gated, excluded) |
| 1 | C4-A (content-addressed idempotent ids), durable-retry (Transient/Fatal + store-counted attempts), recall-trust spine (C8 + non-destructive injection-filter at indexSingleFile + redteam vitest) | durable-retry⟵C4-A; recall-trust independent | med/reversible; recall-trust plugs the INGEST bypass |
| 2 | C4-C (cursor), C2-A/C2-C (router), C3-A (read-side getValidEdges + lineage/causal-edge store reconciliation), C-X1 (AUTHORED), C6-A | C4-C⟵C4-A; C3-A is riskiest (live store fork) | med; C3-A med-high (NOT a clean flip) |
| 3 | C-G1 (clock-driver invoking the existing consolidation.ts cursor) | C4-C→C4-A | med-high (continuous DB-mutating cadence; MUST sit on C4-A idempotency) |

**Critical path:** C4-A → C4-C → C-G1 (confirmed: consolidation.ts:518-548 cursor+gate exist, :594-598 advances, but no periodic caller of runConsolidationCycleIfEnabled — the clock-driver is the missing top link).

## Key note
C-G1's cursor already exists; only the clock-driver is net-new (G5/H3 confirmed). C3-A re-classed to a read-side build + store reconciliation (NOT a flip). Wave-0 ship-now: C9, C5-B, M-spare-only, M-relative-score-band.

## Next Focus
Feeds the roadmap re-sync (Memory build order) + the cross-system shared-infra (C4-A's content-id + C5-B's comparator are shared primitives).
