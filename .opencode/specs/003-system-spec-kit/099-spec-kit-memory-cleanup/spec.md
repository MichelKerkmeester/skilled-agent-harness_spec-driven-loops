# 099: Spec Kit Memory Cleanup

## Overview
Continuation of spec 096 (Bug Audit) deferred items. Database consolidation, type safety cleanup, and test coverage expansion for the Spec Kit Memory MCP server.

## Level
Level 2 (100-499 LOC estimated)

## Scope

### In Scope
1. **Database Consolidation**: Re-index all 258 memory .md files into the active Voyage DB (currently only 85 of potentially hundreds indexed)
2. **Unsafe Cast Removal**: Eliminate 42 `as unknown as` casts and 36 `as any` casts across 17 files (78 total)
3. **Type System Unification**: Migrate from deprecated `MemoryRow`/`MemoryRecord` dual-cased types to canonical `Memory`/`MemoryDbRow` types
4. **Score Field Documentation**: Document score field semantics (`.score` is context-dependent by design, not a naming bug)
5. **Test Coverage**: Add unit tests for ~48 untested modules (from 096 P7 tasks)

### Out of Scope
- New features or capabilities
- Database schema changes
- MCP protocol changes
- Embedding model changes

## Dependencies
- Spec 096 (Bug Audit) — deferred items P6-05, P6-06, P6-07, P7-*
- Active Voyage DB at: mcp_server/dist/database/context-index__voyage__voyage-4__1024.sqlite

## Risks
- Type migration may cause runtime regressions if conversion functions have edge cases
- Re-indexing 258 files will consume Voyage API embedding credits
- Some `as unknown as` casts may be genuinely necessary at JS/TS boundaries

## Success Criteria
- [ ] Voyage DB contains all discoverable memory files (not just 85)
- [ ] Zero `as unknown as` casts in business logic (test casts acceptable)
- [ ] `MemoryRow` and `MemoryRecord` deprecated types removed or migration path documented
- [ ] Score field semantics documented
- [ ] 62/62+ tests passing
- [ ] TypeScript typecheck passes
- [ ] Build succeeds
