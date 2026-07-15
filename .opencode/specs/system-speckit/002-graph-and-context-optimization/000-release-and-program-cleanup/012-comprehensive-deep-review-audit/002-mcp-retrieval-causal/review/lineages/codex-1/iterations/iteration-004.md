# Iteration 004 - Maintainability

## Focus

Maintainability and data-integrity review of automatic causal-link resolution.

## Files Reviewed

- `.opencode/skills/system-spec-kit/mcp_server/handlers/causal-links-processor.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/save/post-insert.ts`
- `.opencode/skills/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts`

## Findings

### F006 - P2 - automatic causal-link resolution can bind ambiguous partial references to the newest global match

`processCausalLinks` flattens all causal-link references from the saved memory and resolves them with `resolveMemoryReferencesBatch(database, allReferences)` [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:361] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:367]. That resolver's last-resort path uses leading-wildcard path matching and returns the newest single match by ID [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:290] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:297] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:298]. It also does partial title matching with the same `ORDER BY id DESC LIMIT 1` behavior [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:307] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:310] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:311].

Once that single fuzzy match is found, `processCausalLinks` inserts an edge between the current memory and the resolved ID [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:401] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:412]. The test suite explicitly treats partial title resolution as expected behavior [SOURCE: .opencode/skills/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:568]. There is no source-spec scoping, ambiguity check, or "multiple fuzzy matches" fail-closed path in this resolver.

The practical failure mode is quiet lineage drift: two specs with similar titles or suffix paths can cause a new save to create an edge to the newest unrelated matching memory. This is lower than the explicit orphan-edge issue because it requires ambiguous references, but the resulting graph edge is valid-looking and harder to detect later.

## Non-Findings

- `memory_match_triggers` scope filtering looks fail-closed in this pass. It resolves caller session IDs through the trusted-session manager before using cognitive working memory and filters matched memory IDs by exact `specFolder`/tenant/user/agent fields before returning results [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-triggers.ts:223] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-triggers.ts:307] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-triggers.ts:331].

## Verdict Rationale

This pass found one P2 maintainability/data-integrity risk. It does not add another release-blocking issue, but it should be fixed with scoped exact resolution or an ambiguity-safe fuzzy fallback before relying on auto-created causal edges for audit-grade lineage.

Review verdict: CONDITIONAL
