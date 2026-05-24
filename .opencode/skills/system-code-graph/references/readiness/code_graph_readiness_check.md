---
title: "Code Graph Readiness Check"
description: "Reference for ensureCodeGraphReady() preconditions, gates, failure modes, recovery procedures, handler integration and diagnostics payload."
trigger_phrases:
  - "code graph readiness"
  - "ensureCodeGraphReady"
  - "readiness gates"
  - "code graph recovery procedures"
---

# Code Graph Readiness Check

<!-- sk-doc-template: skill_reference -->

---

<!-- ANCHOR:1-overview -->
## 1. OVERVIEW

`ensureCodeGraphReady()` validates the code graph state before tool dispatch and performs the minimum necessary reindexing. The function lives in `mcp_server/lib/ensure-ready.ts:585-743`. It is the pre-dispatch contract that query, context, verify and detect-changes handlers depend on.

A 10-second timeout guard ensures auto-indexing never blocks queries forever (`mcp_server/lib/ensure-ready.ts:74, 582`). Handler coverage spans the query, context, verify and detect-changes handlers (`mcp_server/handlers/query.ts:7, 1103`, `mcp_server/handlers/context.ts:8, 185`, `mcp_server/handlers/verify.ts:17, 205`, `mcp_server/handlers/detect-changes.ts:15, 249`). The status handler uses a read-only snapshot variant.

---

<!-- /ANCHOR:1-overview -->

<!-- ANCHOR:2-preconditions-checked -->
## 2. PRECONDITIONS CHECKED

The readiness check evaluates six preconditions before deciding whether to serve, repair, or block:

- **Graph emptiness** - Detects zero-node graphs and triggers full scan (`mcp_server/lib/ensure-ready.ts:371-374`).
- **Scope fingerprint validation** - Compares stored vs active scope fingerprints. Mismatches block reads unless the stored value came from a per-call override (`mcp_server/lib/ensure-ready.ts:376-394, 384`).
- **Git HEAD drift classification** - Classifies drift as `in-scope`, `out-of-scope`, or `unknown` via git diff intersection with tracked files (`mcp_server/lib/ensure-ready.ts:130-156, 415-418`).
- **File mtime staleness** - Checks mtime drift on tracked files via `ensureFreshFiles()` (`mcp_server/lib/ensure-ready.ts:421`).
- **Candidate manifest drift** - Detects untracked indexable file changes via `{count, digest}` manifest comparison (`mcp_server/lib/ensure-ready.ts:168-292, 426`).
- **Deleted tracked files** - Partitions tracked files into existing and deleted, then cleans up deleted entries (`mcp_server/lib/ensure-ready.ts:294-316, 420, 592`).

---

<!-- /ANCHOR:2-preconditions-checked -->

<!-- ANCHOR:3-readiness-gates -->
## 3. READINESS GATES

Five gates determine whether the system promotes, repairs, or blocks:

- **Auto-rescan safety gate** - Shared policy in `mcp_server/lib/auto-rescan-policy.ts:106-128` allows auto-rescan only when scope fingerprints match and parse-error backlog stays below threshold.
- **Guarded inline full scan gate** - Evaluated via `evaluateGuardedFullScan()` in `mcp_server/lib/ensure-ready.ts:217-236, 621-624`. Delegates to `shouldAutoRescan()` for scope and backlog checks.
- **Verification gate** - Gold verification status checked via `getVerificationGate()` in `mcp_server/lib/ensure-ready.ts:326-358, 593`. Returns `pass`, `fail`, or `absent`.
- **Scope change promotion block** - Blocks full scan over an existing graph when scope fingerprints differ unless `forceScopeChange:true` (`mcp_server/handlers/scan.ts:388-416`).
- **Zero-node promotion block** - Blocks full scan over an existing graph when candidate persistable nodes equal zero unless `forceZeroNodeReset:true` (`mcp_server/handlers/scan.ts:393-496`).

---

<!-- /ANCHOR:3-readiness-gates -->

<!-- ANCHOR:4-failure-modes -->
## 4. FAILURE MODES

The readiness check exposes six failure surfaces:

- **Scope mismatch blocking** - Returns blocked status with stored vs active scope diagnostics (`mcp_server/lib/ensure-ready.ts:385-394`).
- **Git HEAD drift blocking** - Full scan triggered when HEAD drift is significant (`in-scope` or `unknown`) (`mcp_server/lib/ensure-ready.ts:429-438`).
- **Parse error backlog blocking** - Auto-rescan denied when backlog exceeds threshold (`mcp_server/lib/auto-rescan-policy.ts:120-125`).
- **Auto-index timeout** - 10-second timeout aborts indexing via `AbortController` (`mcp_server/lib/ensure-ready.ts:498-533, 74`).
- **Auto-index failure** - Caught and surfaced in the reason field with self-heal tracking (`mcp_server/lib/ensure-ready.ts:714-733`).
- **Guarded full scan denial** - Returns with `autoRescanSafety:'blocked'` and block reason when the gate is disabled or fails (`mcp_server/lib/ensure-ready.ts:625-635`).

---

<!-- /ANCHOR:4-failure-modes -->

<!-- ANCHOR:5-recovery-procedures -->
## 5. RECOVERY PROCEDURES

Three recovery procedures handle the most severe failures:

- **CG-RP-001: SQLite corruption recovery** - `recoverSqliteCorruption()` in `mcp_server/lib/recovery-procedures.ts:160-198` copies the database triplet to a recovery directory, runs an integrity check, moves the bad copy to quarantine and triggers a full scan.
- **CG-RP-002: Partial scan failure recovery** - `recoverPartialScanFailure()` in `mcp_server/lib/recovery-procedures.ts:200-247` runs an integrity check, queries staged files where `file_mtime_ms=0` and decides incremental vs full scan based on the stale count.
- **CG-RP-003: Rollback bad apply** - `rollbackBadApply()` in `mcp_server/lib/recovery-procedures.ts:249-307` moves the current triplet to quarantine, restores from the latest known-good snapshot and triggers a full scan.

Self-heal tracking adds `selfHealAttempted`, `selfHealResult` (`ok`, `failed`, `skipped`) and `lastSelfHealAt` to the `ReadyResult` (`mcp_server/lib/ensure-ready.ts:56-59, 615-616, 674-675, 708-712, 726-730`).

---

<!-- /ANCHOR:5-recovery-procedures -->

<!-- ANCHOR:6-handler-integration -->
## 6. HANDLER INTEGRATION

Five handlers integrate the readiness check:

- **Query handler** - Calls `ensureCodeGraphReady()` before query execution and uses the readiness block for payload enrichment (`mcp_server/handlers/query.ts:7, 1103, 430-461`).
- **Context handler** - Calls `ensureCodeGraphReady()` before context retrieval (`mcp_server/handlers/context.ts:8, 185`).
- **Verify handler** - Calls `ensureCodeGraphReady()` before verification (`mcp_server/handlers/verify.ts:17, 205`).
- **Detect-changes handler** - Calls `ensureCodeGraphReady()` before change detection (`mcp_server/handlers/detect-changes.ts:15, 249`).
- **Status handler** - Uses `getGraphReadinessSnapshot()` for read-only diagnostics without mutation (`mcp_server/lib/ensure-ready.ts:788-817`).

---

<!-- /ANCHOR:6-handler-integration -->

<!-- ANCHOR:7-diagnostics-payload -->
## 7. DIAGNOSTICS PAYLOAD

The readiness diagnostics payload assembles in four steps:

- **ReadyResult structure** - Defined in `mcp_server/lib/ensure-ready.ts:43-60` with freshness, action, files, `inlineIndexPerformed`, reason, scope diagnostics, manifest info, parse error backlog, auto-rescan safety, self-heal tracking and verification gate.
- **Readiness block composition** - `buildReadinessBlock()` in `mcp_server/lib/readiness-contract.ts:241-249` augments the `ReadyResult` with `canonicalReadiness` and `trustState`.
- **Canonical readiness mapping** - `canonicalReadinessFromFreshness()` in `mcp_server/lib/readiness-contract.ts:73-88` maps `fresh` to `ready`, `stale` to `stale`, `empty` to `missing` and `error` to `missing`.
- **Trust state derivation** - `queryTrustStateFromFreshness()` in `mcp_server/lib/readiness-contract.ts:109-124` maps `fresh` to `live`, `stale` to `stale`, `empty` to `absent` and `error` to `unavailable`.

<!-- /ANCHOR:7-diagnostics-payload -->
