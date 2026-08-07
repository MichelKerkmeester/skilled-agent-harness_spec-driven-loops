# Iteration 004 - Maintainability

## Focus
Comment hygiene, durable rationale, and low-risk maintainability drift.

## Actions
- Searched reviewed handlers for transient bug/finding/task labels in comments.
- Checked whether comments carried durable rationale independent of temporary fix provenance.
- Re-reviewed the target files for broad readability or abstraction problems.

## Findings

### F004 - P2 - Handler comments retain perishable bug/finding labels instead of durable rationale
Several reviewed handlers include labels like `BUG-001`, `BUG-007`, `F050`, and fix-batch labels in comments. The project contract forbids perishable tracking labels in code comments; these comments should keep the durable why and drop the temporary provenance.

Evidence:
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:73`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:643`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:738`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:850`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-context.ts:1454`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-context.ts:1630`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-context.ts:1692`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-triggers.ts:43`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-triggers.ts:113`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-triggers.ts:307`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-triggers.ts:329`

Fix:
Remove transient labels and keep only durable rationale, such as what invariant is being protected and why.

## Coverage
- correctness: covered
- security: covered
- traceability: covered
- maintainability: covered

Review verdict: CONDITIONAL
