# Deep Review Strategy - codex-4

## Topic

MCP Memory Mutation + Save + Reconcile Review Slice.

## Review Dimensions

| Dimension | Status | Verdict |
|---|---|---|
| correctness | complete | CONDITIONAL |
| security | complete | PASS |
| traceability | complete | CONDITIONAL |
| maintainability | complete | PASS |
| stabilization | complete | PASS |

## Completed Dimensions

- correctness: F001 and F002 recorded as active P1 findings.
- security: no new security findings.
- traceability: F003 recorded as active P1; F004 recorded as active P2.
- maintainability: no new findings; test gaps noted.
- stabilization: all active findings replayed; legal stop gates passed.

## Running Findings

| Severity | Active | New In Last Iteration |
|---|---:|---:|
| P0 | 0 | 0 |
| P1 | 3 | 0 |
| P2 | 1 | 0 |

Active findings:

| ID | Severity | Category | Summary |
|---|---|---|---|
| F001 | P1 | cache-invalidation | `memory_update` can leave entity-density cache stale after title/trigger phrase changes. |
| F002 | P1 | dry-run-apply-parity | `repairSuccessCoverage` dry-run undercounts rowid-present/dimension-missing success rows. |
| F003 | P1 | operator-contract-drift | Operator docs still instruct unsupported `dryRun:false` for reconcile apply mode. |
| F004 | P2 | public-option-noop | `activeOnly` is exposed but not read by the reconcile implementation. |

## What Worked

- Replaying calibration claims against current code avoided over-reporting delete-path cache staleness; current delete and bulk-delete paths already invalidate entity-density.
- Comparing dry-run SQL and apply SQL exposed the exact predicate mismatch in `repairSuccessCoverage`.
- Reading schema, whitelist, handler hint, install guide, and feature catalog together made the operator-contract drift unambiguous.

## What Failed

- Code Graph was unavailable, so the lineage used graphless source reads and `rg`.
- No live MCP invocation was run; this was a read-only source audit with writes limited to the lineage artifact directory.

## Exhausted Approaches

- Re-checking `memory_delete` as a stale entity-density finding is exhausted for this code snapshot; vector delete already invalidates.
- Treating `activeOnly` as P1 is not supported by current evidence; the default behavior is the safer behavior.

## Ruled-Out Directions

- No security finding for caller-controlled vector shard paths: the handler attaches the active shard from runtime metadata and apply fails closed on attach/verification failure.
- No maintainability finding for `handlers/save/` decomposition: the package boundaries are explicit and most stage code has focused ownership.

## Next Focus

Synthesis complete. Remediation should prioritize F001, F002, and F003 before release PASS.

## Known Context

- The target spec is Level 1 and has no checklist.
- `resource-map.md` is not present. Skipping coverage gate.
- The requested executor was `cli-codex model=gpt-5.5`; the local `cli-codex` skill forbids nested Codex self-invocation, so this lineage executed directly.

## Cross-Reference Status

| Level | Protocol | Status | Notes |
|---|---|---|---|
| core | `spec_code` | partial | Target files were reviewed, but F001/F002 show implementation drift. |
| core | `checklist_evidence` | not applicable | Level 1 slice has no `checklist.md`. |
| overlay | `feature_catalog_code` | partial | Feature catalog still describes `dryRun:false` and stale response shape. |
| overlay | `playbook_capability` | partial | Install-guide troubleshooting gives unsupported repair command. |

## Files Under Review

| File | Coverage | Notes |
|---|---|---|
| `.opencode/skills/system-spec-kit/mcp_server/handlers/mutation-hooks.ts` | reviewed | Shared hook lacks entity-density invalidation. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts` | reviewed | Direct entity-density invalidation present after save and background enrichment. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/save/` | reviewed | Maintainability pass found no new issues. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-update.ts` | reviewed | F001 active. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts` | reviewed | Delete path invalidates through vector delete helper. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts` | reviewed | Explicit entity-density invalidation present. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-embedding-reconcile.ts` | reviewed | Live handler uses `mode:"apply"` and active-shard fail-closed behavior. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/embedding-reconcile.ts` | reviewed | F002 and F004 active. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/entity-density.ts` | reviewed | TTL/cache contract confirmed. |
| `.opencode/skills/system-spec-kit/mcp_server/INSTALL_GUIDE.md` | reviewed | F003 active. |
| `.opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md` | reviewed | F003 active. |
| `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts` | reviewed | F004 active; live mode schema checked. |
| `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts` | reviewed | F003/F004 schema evidence. |

## Review Boundaries

| Boundary | Value |
|---|---|
| maxIterations | 7 |
| completedIterations | 5 |
| convergenceThreshold | 0.10 |
| rollingStopThreshold | 0.08 |
| minStabilizationPasses | 1 |
| finalVerdict | CONDITIONAL |

## Non-Goals

- Implementing fixes.
- Modifying reviewed implementation files.
- Running live MCP mutation commands.

## Stop Conditions

- All four dimensions covered.
- At least one stabilization pass completed.
- P0 count remained zero.
- Required traceability protocols executed or marked not applicable.
- Last two iterations produced no new findings.
