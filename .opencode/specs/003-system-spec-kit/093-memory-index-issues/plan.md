---
title: "Investigation & Fix Plan"
status: in-progress
---

# 📋 Plan: Memory Index Failures

## Phase 1: Investigation — ✅ COMPLETE
1. ✅ Sample and analyze failing files (10-agent parallel investigation)
2. ✅ Sample and analyze succeeding files
3. ✅ Deep dive system-spec-kit indexing code (`memory-save.ts` → `prediction-error-gate.ts`)
4. ✅ Deep dive Voyage embedding generation (voyage-4, 1024d, MAX_TEXT_LENGTH 8000)
5. ✅ Trace error message origin (`userFriendlyError()` in `core.ts:147`)
6. ✅ Analyze validation/parsing logic (pre-flight checks, trigger phrase regex)
7. ✅ Analyze specFolder detection (3-stage extraction, not root cause)
8. ✅ Analyze generate-context.js output format
9. ✅ Categorize all 129 failures (all same code-path failure)

## Phase 2: Root Cause Analysis — ✅ COMPLETE
10. ✅ Synthesize findings → argument order mismatch in `evaluateMemory()` at `memory-save.ts:560`
11. ✅ Identified 4 bugs total (1 primary, 3 secondary)
12. ✅ Documented in `decision-record.md` (DR-001, DR-002, DR-003)

## Phase 3: Fix Implementation — ✅ COMPLETE
13. ✅ Implemented 4 code fixes in `memory-save.ts` (9 locations)
14. ✅ Compiled TypeScript → `memory-save.js` via `tsc --build`
15. ✅ Verified compiled output at `memory-save.js:418`
16. ~~ T12 File-level fixes — NOT NEEDED (code-only root cause)

## Phase 4: Verification — ⏳ BLOCKED (MCP server restart required)
17. ⏳ Force re-index all files — server has stale code (started 09:18, fix compiled 09:35)
18. ⏳ Verify 0 failures
19. ⏳ Validate no regression

## Phase 5: Documentation — ✅ IN PROGRESS
20. ✅ Updated tasks.md, checklist.md, decision-record.md
21. ✅ Created implementation-summary.md
22. ⏳ Save memory context (after verification)
