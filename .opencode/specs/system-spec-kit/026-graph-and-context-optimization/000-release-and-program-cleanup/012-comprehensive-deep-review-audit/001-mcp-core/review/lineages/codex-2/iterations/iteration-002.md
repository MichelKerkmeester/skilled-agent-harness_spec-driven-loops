# Iteration 2: Security

## Focus
Reviewed active-shard verification, dynamic SQL interpolation boundaries, path validation, and destructive mutation gates.

## Scorecard
- Dimensions covered: security
- Files reviewed: 6
- New findings: P0=0 P1=0 P2=0
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.0000

## Findings

### P0, Blocker
None.

### P1, Required
None.

### P2, Suggestion
None.

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|---|---|---|---|---|
| spec_code | pass | hard | `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/embedding-reconcile.ts:188` | Reconcile dimension table interpolation follows active dimension verification. |

## Assessment
- New findings ratio: 0.0000
- Dimensions addressed: security
- Novelty justification: negative security evidence only.

## Ruled Out
- SQL injection via `dimTable`: `verifyActiveShard()` constructs `vec_<dim>` only after parsing the active dim as an integer and confirming the table exists [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/embedding-reconcile.ts:188`].
- Caller-supplied shard path: the handler attaches the active vector shard through vector-index runtime authority, not from request input [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-embedding-reconcile.ts:43`].
- Unconfirmed bulk delete: bulk delete requires `confirm: true` and blocks high-safety unscoped tier deletes [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:94`].

## Dead Ends
- No credential or raw provider-error exposure found in the reviewed save embedding path; provider errors are sanitized before persistence/response [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts:194`].

## Recommended Next Focus
Traceability pass across public schemas, install guide, and feature catalog.
Review verdict: PASS
