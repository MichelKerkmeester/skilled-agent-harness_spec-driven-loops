---
title: "Startup pending-file recovery"
description: "Covers the startup recovery routine that renames orphaned pending files left by interrupted atomic-write operations."
trigger_phrases:
  - "startup pending-file recovery"
  - "findPendingFiles"
  - "recover orphaned pending files"
  - "atomic-write crash recovery"
  - "startup file recovery routine"
version: 3.6.0.11
---

# Startup pending-file recovery

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Covers the startup recovery routine that renames orphaned pending files left by interrupted atomic-write operations.

If the system crashed or lost power while saving a file, it might leave behind a partially written copy. On the next startup, this feature automatically finds those orphaned files and finishes saving them. You do not have to do anything. It is like your word processor recovering unsaved documents after a crash.

---

## 2. HOW IT WORKS

On server startup, the transaction manager scans for leftover `_pending` files created by interrupted atomic-write operations. If a previous `memory_save` wrote the pending file and committed the DB row but crashed before renaming, the pending file is the only surviving copy of the content. The recovery routine finds these orphans via `findPendingFiles()`, renames each to its final path and increments `totalRecoveries` in the transaction metrics.

Scan roots are derived from allowed memory base paths, then constrained to known memory locations (`specs/`, `.opencode/specs/` and constitutional directories) to balance coverage with startup safety.

Recovery is automatic and requires no user intervention. If the pending file is stale (the DB row was never committed), it is logged and left for manual review rather than silently deleted.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp-server/lib/storage/transaction-manager.ts` | Lib | Atomic write + pending-file recovery |
| `mcp-server/context-server.ts` | Core | Startup hook that triggers recovery |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `mcp-server/tests/transaction-manager.vitest.ts` | Automated test | Transaction manager tests |
| `mcp-server/tests/transaction-manager-recovery.vitest.ts` | Automated test | Startup pending-file recovery edge coverage |

---

## 4. SOURCE METADATA
- Group: Lifecycle
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `lifecycle/startup-pending-file-recovery.md`
Related references:
- [async-ingestion-job-lifecycle.md](../../feature-catalog/lifecycle/async-ingestion-job-lifecycle.md) — Async ingestion job lifecycle
- [constitutional-memory-end-to-end-lifecycle.md](../../feature-catalog/lifecycle/constitutional-memory-end-to-end-lifecycle.md) — Constitutional Memory end-to-end lifecycle
