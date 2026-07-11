---
title: "Working Memory Session Cleanup Timestamp Fix"
description: "Tracks the fix for incorrect session cleanup caused by mismatched timestamp formats between SQLite and JavaScript."
trigger_phrases:
  - "working memory timestamp fix"
  - "session cleanup timestamp mismatch"
  - "sqlite javascript timestamp format fix"
  - "active session deleted incorrectly"
  - "cleanupoldsessions datetime fix"
version: 3.6.0.13
---

# Working Memory Session Cleanup Timestamp Fix

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Tracks the fix for incorrect session cleanup caused by mismatched timestamp formats between SQLite and JavaScript.

The system was accidentally deleting active sessions because it compared timestamps written in two different formats. It is like comparing "March 14" to "14/03" and getting confused about which date is newer. The fix makes both sides use the same format so active sessions are kept and only truly expired ones are cleaned up.

---

## 2. HOW IT WORKS

The `cleanupOldSessions()` method in the working memory manager compared `last_focused` timestamps (stored via SQLite `CURRENT_TIMESTAMP` as `YYYY-MM-DD HH:MM:SS`) against JavaScript `toISOString()` output (`YYYY-MM-DDTHH:MM:SS.sssZ`). The lexicographic comparison failed because space (ASCII 32) sorts before `T` (ASCII 84), causing active sessions to be incorrectly deleted. The fix replaces the JavaScript Date comparison with SQLite-native `datetime()` math: `DELETE FROM working_memory WHERE datetime(last_focused) < datetime(?, '-' || ? || ' seconds')`, keeping the comparison entirely within SQLite's datetime system.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/cognitive/working-memory.ts` | Lib | Session lifecycle and cleanup logic |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `mcp_server/tests/working-memory.vitest.ts` | Automated test | Working-memory module coverage (including `cleanupOldSessions` export and `working_memory` table usage) |
| `mcp_server/stress_test/session/session-manager-stress.vitest.ts` | Automated test | Direct cleanup regression coverage for expired vs active sessions with SQLite `CURRENT_TIMESTAMP` format |

---

## 4. SOURCE METADATA
- Group: Bug Fixes And Data Integrity
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `bug-fixes-and-data-integrity/working-memory-timestamp-fix.md`
Related references:
- [chunking-orchestrator-safe-swap.md](chunking-orchestrator-safe-swap.md) — Chunking Orchestrator Safe Swap
- [scope-normalizer-canonicalization-and-lint.md](scope-normalizer-canonicalization-and-lint.md) — Scope normalizer canonicalization and lint
