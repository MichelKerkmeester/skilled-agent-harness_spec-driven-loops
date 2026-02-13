# Implementation Summary: 097 — Memory Save Auto-Detect Spec Folder

## Problem
When saving memory context at end of session, the AI agent asked "Which spec folder?" even though Gate 3 had already established it. This created unnecessary friction on every memory save.

## Solution: Two-Layer Defense

### Layer 1: AGENTS.md — MEMORY SAVE RULE Update
**File:** `AGENTS.md` (lines 197-202, within MEMORY SAVE RULE box at lines 193-215)

Added a Priority 0 step before the existing validation logic:
```
│   0. If spec folder was established at Gate 3 in this conversation →
│      USE IT as the folder argument (do NOT re-ask the user).
│      Gate 3's answer is the session's active spec folder.
│   1. If NO folder AND Gate 3 was never answered → HARD BLOCK → Ask user
```

This ensures the AI agent reuses the Gate 3 answer from conversation context before falling back to asking the user.

### Layer 2: folder-detector.ts — Session Learning DB Lookup
**File:** `.opencode/skill/system-spec-kit/scripts/spec-folder/folder-detector.ts` (lines 138-163)

Added **Priority 2.5** in the `detectSpecFolder()` cascade, between Priority 2 (JSON data field) and Priority 3 (CWD detection):

1. Opens `context-index.sqlite` database (readonly)
2. Queries `session_learning` table for most recent `spec_folder` within the last 24 hours (`WHERE created_at > datetime('now', '-24 hours')`, `ORDER BY created_at DESC`)
3. Resolves path via `path.join(specsDir, row.spec_folder)`
4. Validates folder exists via `fs.access()`
5. Returns resolved path if valid; falls through on error with optional debug log (`DEBUG=1`)

**Key detail:** Uses absolute require path `path.join(CONFIG.PROJECT_ROOT, '.opencode/skill/system-spec-kit/node_modules/better-sqlite3')` since the script may run from any CWD where `better-sqlite3` isn't in the local `node_modules`.

### Detection Cascade (Updated)
| Priority | Source | Behavior |
|----------|--------|----------|
| 1 | CLI argument | Explicit `--spec-folder` flag |
| 2 | JSON data `SPEC_FOLDER` field | From collected data passed as JSON file |
| **2.5** | **session_learning DB** | **Most recent preflight record (NEW)** |
| 3 | CWD detection | If running from within a spec folder |
| 4 | Auto-detect + interactive prompt | Score-based alignment with user selection |

## Files Modified
| File | Change |
|------|--------|
| `AGENTS.md:197-202` | Added Priority 0 Gate 3 reuse step to MEMORY SAVE RULE |
| `.opencode/skill/system-spec-kit/scripts/spec-folder/folder-detector.ts:138-163` | Added Priority 2.5 session_learning DB lookup |
| `.opencode/skill/system-spec-kit/scripts/dist/spec-folder/folder-detector.js:142-160` | Compiled output |

## Verification
- TypeScript: Clean compile (0 errors)
- Positive case: Test record with `003-memory-and-spec-kit/097-memory-save-auto-detect` correctly resolved and returned
- Negative case (missing folder): `fs.access()` throws, caught by try/catch, falls through with debug log
- Negative case (empty table): `row?.spec_folder` evaluates to undefined, skips return, falls through
- Negative case (no DB): `require()` or `new Database()` throws, caught by try/catch, falls through with debug log
- Negative case (stale data): Records older than 24h excluded by WHERE clause
