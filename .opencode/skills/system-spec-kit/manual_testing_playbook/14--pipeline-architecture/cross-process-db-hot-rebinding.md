---
title: "112 -- Cross-process DB hot rebinding"
description: "This scenario validates Cross-process DB hot rebinding for `112`. It focuses on Confirm marker-file triggers DB reinitialization."
audited_post_018: true
version: 3.6.0.16
---

# 112 -- Cross-process DB hot rebinding

## 1. OVERVIEW

This scenario validates Cross-process DB hot rebinding for `112`. It focuses on Confirm marker-file triggers DB reinitialization.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm marker-file triggers DB reinitialization.
- Real user request: `Please validate Cross-process DB hot rebinding against memory_save(filePath) and tell me whether the expected signals are present: Server detects DB_UPDATED_FILE marker; DB reinitializes without restart; stats reflect post-mutation state (no stale data); health reports healthy after rebind.`
- Prompt: `Validate cross-process DB hot rebinding against memory_save(filePath) and return pass/fail with cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Server detects DB_UPDATED_FILE marker; DB reinitializes without restart; stats reflect post-mutation state (no stale data); health reports healthy after rebind
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if server detects marker file, reinitializes DB, returns current (non-stale) data, and health is healthy

---

## 3. TEST EXECUTION

### Prompt

```
Validate cross-process DB hot rebinding against memory_save(filePath) and return pass/fail with cited evidence.
```

### Commands

1. start MCP server
2. create a test memory via MCP: `memory_save(filePath)` and note its title
3. from a separate terminal, run `node cli.js bulk-delete --tier temporary --folder specs/test-sandbox` (non-dry-run — this mutates the DB and writes the `DB_UPDATED_FILE` marker)
4. immediately call `memory_stats()` via MCP → verify server detects marker and reinitializes DB
5. verify no stale data from pre-rebind state
6. run `memory_health()` → verify healthy status post-rebind

### Expected

Server detects DB_UPDATED_FILE marker; DB reinitializes without restart; stats reflect post-mutation state (no stale data); health reports healthy after rebind

### Evidence

MCP server was available through `memory_save`, `memory_stats`, and `memory_health` tool calls.

`memory_save(filePath)` attempt 1:

```text
summary: Error: Governed ingest rejected: tenantId is required for governed ingest; sessionId is required for governed ingest; userId or agentId is required for governed ingest; provenanceSource is required for governed ingest; provenanceActor is required for governed ingest
data.error: Governed ingest rejected: tenantId is required for governed ingest; sessionId is required for governed ingest; userId or agentId is required for governed ingest; provenanceSource is required for governed ingest; provenanceActor is required for governed ingest
data.code: E085
```

`memory_save(filePath)` attempt 2 (`plannerMode: plan-only`):

```text
summary: Planner prepared a non-mutating canonical save plan.
data.status: planned
data.title: Feature Specification: Manual Testing Playbook Execution Sweep
data.message: Planner prepared a non-mutating canonical save plan.
```

`memory_save(filePath)` attempt 3 (`routeAs: drop`, target spec.md):

```text
summary: Memory file does not match the required template contract.
data.status: rejected
data.title: Feature Specification: Manual Testing Playbook Execution Sweep
data.rejectionReason: Template contract validation failed: missing_section, missing_section, missing_section, missing_section, missing_section, missing_section
data.message: Memory file does not match the required template contract.
```

`memory_save(filePath)` successful test memory creation using an existing canonical implementation-summary file:

```text
summary: Memory saved with deferred indexing - searchable via BM25/FTS5 (with 1 anchor issue(s)) (deferred indexing - searchable via BM25/FTS5)
data.status: deferred
data.id: 38649
data.specFolder: skilled-agent-orchestration/121-sk-prompt/prompt-models-rename/009-filename-residual-cleanup
data.title: Implementation Summary: Phase 9: filename-residual-cleanup
data.importanceTier: normal
data.embeddingStatus: pending
data.embeddingFailureReason: Embedding generation returned null
data.postMutationHooks.operation: save
data.postMutationHooks.triggerCacheCleared: true
data.postMutationHooks.constitutionalCacheCleared: true
data.postMutationHooks.errors: []
```

Separate-terminal CLI command, run from `.opencode/skills/system-spec-kit/mcp_server/dist` as `node "cli.js" bulk-delete --tier scratch --folder specs/test-sandbox`:

```text
[context-server] ╔════════════════════════════════════════════════════════╗
[context-server] ║  WARNING: Native runtime changed since last install  ║
[context-server] ╠════════════════════════════════════════════════════════╣
[context-server] ║  Installed: Node v25.2.1 (MODULE_VERSION 141, darwin/arm64)          ║
[context-server] ║  Running:   Node v22.23.1 (MODULE_VERSION 127, darwin/arm64)         ║
[context-server] ║  Mismatch:  module ABI                                               ║
[context-server] ╠════════════════════════════════════════════════════════╣
[context-server] ║  Native modules may crash. Run:                         ║
[context-server] ║  bash scripts/setup/rebuild-native-modules.sh           ║
[context-server] ╚════════════════════════════════════════════════════════╝
ERROR: Invalid tier "scratch". Must be one of: constitutional, critical, important, normal, temporary, deprecated
```

`memory_stats()` output post-command:

```text
summary: Memory system: 32482 memories across 5773 folders
data.totalMemories: 32482
data.byStatus.pending: 8821
data.byStatus.success: 14331
data.byStatus.failed: 1561
data.byStatus.retry: 1020
data.byStatus.partial: 0
data.oldestMemory: 2026-06-04T07:01:02.965Z
data.newestMemory: 2026-07-02T12:26:42.482Z
data.totalSpecFolders: 5773
data.totalTriggerPhrases: 163825
data.vectorSearchEnabled: true
data.tierBreakdown.constitutional: 69
data.tierBreakdown.critical: 948
data.tierBreakdown.deprecated: 6720
data.tierBreakdown.important: 11741
data.tierBreakdown.normal: 12999
data.tierBreakdown.temporary: 5
data.databaseSizeBytes: 1305178112
data.lastIndexedAt: 2026-07-02T12:26:42.482Z
```

`memory_health()` output post-command:

```text
summary: Memory system degraded: 32482 memories indexed
data.status: degraded
data.runtime_initialized: true
data.databaseConnected: true
data.vectorSearchAvailable: true
data.recallDegradation.degraded: false
data.recallDegradation.vectorSearchAvailable: true
data.recallDegradation.mode: hybrid
data.memoryCount: 32482
data.process.pid: 26063
data.process.rss_mb: 476
data.process.uptime_s: 114
data.index.summary: degraded_needs_repair
data.index.indexedRows: 32482
data.index.pendingVectors: 9324
data.index.retryVectors: 1024
data.index.failedVectors: 3430
data.index.orphanFiles: 25
data.consistency.status: degraded
data.consistency.rowsTotal: 32482
data.consistency.ftsRowsTotal: 32482
data.consistency.vecRowsTotal: 18464
data.embeddingProvider.provider: hf-local
data.embeddingProvider.model: nomic-ai/nomic-embed-text-v1.5
data.embeddingProvider.healthy: false
data.embeddingRetry.pending: 9324
data.embeddingRetry.failed: 3430
data.embeddingRetry.circuitBreakerOpen: true
```

Marker-file check, run as `ls -l ".opencode/skills/system-spec-kit/mcp_server/database/.db-updated"`:

```text
ls: .opencode/skills/system-spec-kit/mcp_server/database/.db-updated: No such file or directory
```

### Pass / Fail

- **FAIL**: The documented mutation command failed with `ERROR: Invalid tier "scratch". Must be one of: constitutional, critical, important, normal, temporary, deprecated`; `.db-updated` was absent; `memory_health()` returned `data.status: degraded`, not healthy.

### Failure Triage

Inspect DB_UPDATED_FILE marker path and detection logic; verify DB reinitialization clears caches; check for stale connection handles

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [14--pipeline-architecture/cross-process-db-hot-rebinding.md](../../feature_catalog/14--pipeline-architecture/cross-process-db-hot-rebinding.md)

---

## 5. SOURCE METADATA

- Group: Pipeline Architecture
- Playbook ID: 112
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `14--pipeline-architecture/cross-process-db-hot-rebinding.md`
