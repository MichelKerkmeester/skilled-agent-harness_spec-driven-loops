# Iteration 003 - Memory Correctness Impact

## Focus

Assess real operational impact for memory-correctness findings.

## Findings

1. The entity-density cache feeds graph-channel routing for entity-rich short queries. It uses terms from high-degree memory rows and refreshes lazily on a 60 second TTL unless explicitly invalidated. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/search/entity-density.ts:4`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/search/entity-density.ts:21`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/search/entity-density.ts:136`]

2. Shared CRUD update/delete hooks clear trigger, tool, constitutional, graph-signal, degree, and coactivation caches, but do not invalidate the entity-density cache. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/mutation-hooks.ts:4`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/mutation-hooks.ts:20`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/mutation-hooks.ts:68`]

3. `memory_update` and `memory_delete` delegate to those shared hooks only, while `memory_save` and `memory_bulk_delete` explicitly invalidate entity density. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:304`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:244`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:197`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:9`]

4. Atomic save indexes the prepared content before promoting the pending file to the final path. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/save/atomic-index-memory.ts:360`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/save/atomic-index-memory.ts:362`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/save/atomic-index-memory.ts:378`]

5. The memory-save transaction commits the DB row before final file persistence in the quality-loop path, and the code warns that DB row committed while manual file recovery may be needed. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:2534`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:2639`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:2653`]

## Sources Consulted

- `.opencode/skills/system-spec-kit/mcp_server/lib/search/entity-density.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/mutation-hooks.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-update.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/save/atomic-index-memory.ts`

## Assessment

Impact class 1 is transient routing correctness: after update/delete of high-degree memory rows, graph-channel routing can use stale terms until TTL expiry or another save/bulk-delete invalidation. That is real user-visible search behavior, but bounded.

Impact class 2 is durable DB/file inconsistency on failure paths: if indexing commits and file promotion or finalization fails, memory_index can contain content not reflected in the file system. That is lower probability under local use, but higher impact because it can survive process restart.

## Reflection

The cache issue should be P1 correctness, not P0. The atomicity issue deserves stronger remediation because its failure mode is persistent and hard to diagnose after the fact.

## Recommended Next Focus

Calibrate security findings against the actual trust boundary rather than the theoretical multi-tenant interpretation alone.
