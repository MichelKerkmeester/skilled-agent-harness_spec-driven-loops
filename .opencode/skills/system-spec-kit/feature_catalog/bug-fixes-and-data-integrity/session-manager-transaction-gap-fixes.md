---
title: "Session-manager transaction gap fixes"
description: "Tracks the fix that moved `enforceEntryLimit()` calls inside database transactions to prevent concurrent limit violations."
trigger_phrases:
  - "session manager transaction gap fixes"
  - "enforceentrylimit transaction fix"
  - "concurrent limit violation fix"
  - "session entry limit atomicity"
  - "transactional entry limit enforcement"
version: 3.6.0.13
---

# Session-manager transaction gap fixes

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Tracks the fix that moved `enforceEntryLimit()` calls inside database transactions to prevent concurrent limit violations.

When two requests arrived at the same time, they could both slip past a size limit check and add more data than allowed. This fix bundles the check and the write into a single step so they cannot be split apart, preventing the system from exceeding its own limits.

---

## 2. HOW IT WORKS

Three call sites of `enforceEntryLimit()` in `session-manager.ts` now run inside transactional boundaries (lines 496, 557, and 593). `markMemorySent()` (line 557) and `markMemoriesSentBatch()` (line 593) use `db.transaction()` wrappers, while the `shouldSendMemoriesBatch()` `markAsSent` path (line 496) uses explicit `BEGIN IMMEDIATE` / `COMMIT` / `ROLLBACK` control. Concurrent MCP requests could otherwise both pass the limit check then both insert, exceeding the entry limit when check and insert were not atomic.

---

## 3. SOURCE FILES

### Implementation

| File | Role |
|------|------|
| `mcp_server/lib/session/session-manager.ts` | Session lifecycle management: 3 `enforceEntryLimit()` call sites wrapped in transactions |
| `mcp_server/lib/storage/transaction-manager.ts` | Transaction management utilities |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `mcp_server/tests/session-manager-extended.vitest.ts` | Automated test | Session manager extended tests including `enforceEntryLimit` |
| `mcp_server/tests/session-manager.vitest.ts` | Automated test | Session manager core tests |
| `mcp_server/tests/transaction-manager-extended.vitest.ts` | Automated test | Transaction extended tests |
| `mcp_server/tests/transaction-manager.vitest.ts` | Automated test | Transaction manager tests |

---

## 4. SOURCE METADATA
- Group: Bug Fixes And Data Integrity
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `bug-fixes-and-data-integrity/session-manager-transaction-gap-fixes.md`
Related references:
- [mathmax-min-stack-overflow-elimination.md](mathmax-min-stack-overflow-elimination.md) — Math.max/min stack overflow hardening
- [chunking-orchestrator-safe-swap.md](chunking-orchestrator-safe-swap.md) — Chunking Orchestrator Safe Swap
