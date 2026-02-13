# Spec 102: MCP Server Cleanup & Documentation Alignment

**Status:** ✅ COMPLETE (2026-02-10)
**Level:** 2
**Parent:** 003-memory-and-spec-kit

## Overview

Comprehensive cleanup of the MCP memory server addressing pre-existing test/TypeScript failures, documentation-code misalignments from the Spec 101 audit, and missing ADR documentation.

## Workstreams

### WS-1: Pre-existing Test Failures (2 fixes)
Fix 2 test failures present since before Spec 098:
- `scoring-gaps.test.ts`: Tests expected throws but production code returns false
- `vector-index-impl.js`: CREATE TABLE schema missing `is_archived` column

### WS-2: Pre-existing TypeScript Errors (6 fixes)
Fix 5 known + 1 newly-exposed TS errors:
- `core/db-state.ts`: DatabaseLike missing `transaction` method
- `handlers/memory-index.ts`: IndexResult `title` null vs undefined
- `handlers/memory-search.ts`: `last_accessed` type widening
- `lib/parsing/trigger-matcher.ts`: Missing index signature
- `hooks/memory-surface.ts`: unknown vs Record type cast
- `lib/search/vector-index.ts`: Unexportable names from JS module (exposed after above fixes)

### WS-3: Spec 101 Misalignment Audit Fixes (31/36 findings)
Execute fixes from the Spec 101 documentation-code misalignment audit:
- Phase 1 (Quick Wins): 13 findings — 8 FIXED, 5 ALREADY-DONE
- Phase 2 (Moderate): 11 findings — 7 FIXED, 4 ALREADY-DONE
- Phase 3 (Remaining): 12 findings — 4 FIXED, 3 ALREADY-DONE, 5 DEFERRED

### WS-4: ADR-008 sqlite-vec Decision
Document the sqlite-vec adoption decision that was never formally recorded (T305 gap from Spec 098).

## Deferred Items (5 findings requiring architectural decisions)

| Finding | Description | Decision Needed |
|---------|-------------|-----------------|
| F-002 | `memory_match_triggers()` never called by commands | Add to commands or remove claim? |
| F-003 | L1 `memory_context` orchestrator bypassed | Refactor commands to use L1? |
| F-008 | Circuit breaker spec inconsistencies | Standardize config across commands? |
| F-022 | Quality gate thresholds differ | Standardize to 70 everywhere? |
| F-034 | Resume MCP docs duplicated | Consolidate to single source? |

## Verification

- TypeScript: 0 errors (was 5+1)
- Tests: 104 pass, 0 fail (was 102 pass, 2 fail)
- No regressions introduced
