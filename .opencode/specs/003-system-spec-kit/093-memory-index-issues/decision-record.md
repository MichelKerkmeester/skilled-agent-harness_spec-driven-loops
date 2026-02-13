---
title: "Decision Record"
status: resolved
---

# 🏛️ Decision Record

## DR-001: Root Cause — Argument Mismatch in PE Gate Call

**Status:** RESOLVED (code fixed, pending server restart for verification)
**Date:** 2026-02-08

### Problem
129 of 244 memory files fail to index with `candidates.filter is not a function` error, masked as "An unexpected error occurred" by `userFriendlyError()`.

### Root Cause
**Argument order mismatch** between `evaluateMemory()` function signature and its call site in `memory-save.ts`.

**Function signature** (`prediction-error-gate.ts:159`):
```typescript
evaluateMemory(newContentHash: string, newContent: string, candidates: Array<...>, options: {...})
```

**Buggy call** (`memory-save.ts:560`, compiled JS `memory-save.js:418`):
```typescript
evaluateMemory(candidates, parsed.content, { checkContradictions: true })
```

This caused:
- `newContentHash` ← receives `candidates` array (wrong type)
- `newContent` ← receives `parsed.content` string (correct by accident)
- `candidates` ← receives `{ checkContradictions: true }` options object (wrong type)
- When `filterRelevantCandidates(candidates)` calls `.filter()` on the options object → crash

### Why Only 129 Files Fail (Not All 244)
The PE gate only runs when `candidates.length > 0` (similar memories found in DB). Files indexed when the DB was empty or had few entries bypassed the PE gate entirely. As the DB grew, more files triggered similarity matches → PE gate invoked → crash. The 115 successfully-indexed files either had no similar memories or were indexed before the DB had enough entries to trigger matches.

### Fix Applied (4 Bugs)

| Bug | Location | Issue | Fix |
|-----|----------|-------|-----|
| 1 (PRIMARY) | `memory-save.ts:560-565` | `evaluateMemory()` called with wrong argument order | Added `parsed.contentHash` as 1st arg, `candidates` as 3rd, `{ specFolder: parsed.specFolder }` as options |
| 2 | `memory-save.ts` (5 locations) | Accesses `peDecision.candidate!.id` but return type is `existingMemoryId: number` | Changed to `peDecision.existingMemoryId` |
| 3 | `memory-save.ts:351` | `decision.contradiction?.found` but property is `.detected` | Changed to `.detected` |
| 4 | `memory-save.ts` (2 locations) | Accesses `peDecision.related_ids` but property doesn't exist on return type | Removed references |

### Compilation
- TypeScript compiled via `tsc --build` at `09:35:39`
- Compiled output verified correct at `memory-save.js:418`
- Emitted despite unrelated pre-existing type errors (non-blocking)

### Verification Status
- **Standalone test:** PASSED — `barter-bug-analysis.md` (previously failing) indexed successfully when running compiled code directly
- **MCP server test:** BLOCKED — server PID 39745 started at 09:18:39, fix compiled at 09:35:39. Node.js caches modules at startup, so running server has stale (pre-fix) code. Requires OpenCode restart.

## DR-002: Error Masking Architecture

**Status:** DOCUMENTED (improvement optional)
**Date:** 2026-02-08

### Problem
The real error (`candidates.filter is not a function`) was hidden behind a generic "An unexpected error occurred" message, making debugging extremely difficult.

### Architecture
- `userFriendlyError()` in `core.ts:147` recognizes only 7 error patterns (SQLITE_BUSY, SQLITE_LOCKED, ENOENT, EACCES, ECONNREFUSED, ETIMEDOUT, `embedding.*failed`)
- Any non-matching error → generic message → original error lost from MCP response
- Real error IS logged to `console.error` (server stderr) but invisible to MCP clients/agents
- `batch-processor.ts:82` is the only callsite that uses `userFriendlyError()` for error wrapping

### Recommendation
Patch `batch-processor.ts` to include `originalError` field alongside the user-friendly message. This preserves debuggability without changing the user-facing message. Low priority since the root cause is now fixed.

## DR-003: Stale MCP Server Process

**Status:** DOCUMENTED
**Date:** 2026-02-08

### Problem
After fixing and compiling code, the MCP server continues serving stale (pre-fix) code because Node.js loads and caches modules at startup.

### Timeline
| Event | Time |
|-------|------|
| MCP server started (PID 39745) | 09:18:39 |
| TypeScript source fixed | 09:35:33 |
| TypeScript compiled to JS | 09:35:39 |
| Gap | +17 min — server loaded OLD code |

### Impact
Force re-index still produces 129 failures despite fix being compiled to disk.

### Resolution
Restart OpenCode to spawn a new MCP server process that loads the fixed compiled JS. No code change needed — this is expected Node.js behavior.

## DR-004: Missing `path` Module Import (Bug B)

**Status:** RESOLVED (fixed and verified)
**Date:** 2026-02-08

### Problem
After the Session 1 fix (Bug A — evaluateMemory argument order), ~130 files still failed to index. The previous session identified `path is not defined` as the error when calling `memory_save` directly on a failing file.

### Root Cause
`memory-save.ts` uses `path.basename()` at 4 locations (lines 505, 539, 544, 669) for warning/error logging but **never imported the `path` module**. When any of these lines execute, Node.js throws `ReferenceError: path is not defined`, which gets masked by `userFriendlyError()` into the generic "An unexpected error occurred."

### Why Only Some Files Fail
Lines 505 and 539/544 are in warning/error logging paths — they only execute when there are validation warnings or embedding failures. Files that have clean content and no warnings bypass these code paths entirely and succeed. Files with old formats, missing anchors, or embedding issues trigger warnings → call `path.basename()` → crash.

### Fix Applied
Added `import path from 'path';` to the imports section of `memory-save.ts` (line 10). The compiled JS (`memory-save.js`) already had the import from a previous compilation — confirming this fix was partially applied but the TypeScript source was inconsistent.

### Verification
`memory_index_scan({ force: true })` — 245 scanned, 240 succeed, 5 expected failures (old format/test fixtures). Down from ~130 failures before fix.
