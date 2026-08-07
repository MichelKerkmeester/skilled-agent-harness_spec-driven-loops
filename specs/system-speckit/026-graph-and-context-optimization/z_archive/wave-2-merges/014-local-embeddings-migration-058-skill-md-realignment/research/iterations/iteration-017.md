---
title: "Iter 017 — Track 8: code-graph-readiness-check.md spec"
iteration: 17
track: 8
focus: "code-graph-readiness-check.md spec"
status: complete
newInfoRatio: 1.00
findings: 42
timestamp: 2026-05-15T17:31:35Z
---

## Iter 017 Findings

### Frontmatter Shape

```yaml
---
title: Code Graph Readiness Check
spec_id: CG-RC-001
component: system-code-graph
owner: code-graph-team
status: draft
created: 2026-05-15
version: 1.0.0
---
```

### Section Outline

1. **Purpose & Scope**
   - What `ensureCodeGraphReady()` validates
   - Pre-tool-dispatch contract
   - Handler coverage

2. **Preconditions Checked**
   - Graph emptiness detection
   - Scope fingerprint validation
   - Git HEAD drift classification
   - File mtime staleness detection
   - Candidate manifest drift detection
   - Deleted tracked file cleanup

3. **Readiness Gates**
   - Auto-rescan safety gate
   - Guarded inline full scan gate
   - Verification gate
   - Scope change promotion block
   - Zero-node promotion block

4. **Failure Modes**
   - Scope mismatch blocking
   - Git HEAD drift blocking
   - Parse error backlog blocking
   - Auto-index timeout
   - Auto-index failure
   - Guarded full scan denial

5. **Recovery Procedures**
   - CG-RP-001: SQLite corruption recovery
   - CG-RP-002: Partial scan failure recovery
   - CG-RP-003: Rollback bad apply
   - Self-heal attempt tracking

6. **Handler Integration**
   - Query handler integration
   - Context handler integration
   - Status handler integration
   - Verify handler integration
   - Detect-changes handler integration

7. **Diagnostics Payload**
   - ReadyResult structure
   - Readiness block composition
   - Canonical readiness mapping
   - Trust state derivation

### Facts Per Section with Line Cites

#### 1. Purpose & Scope

- **Main function**: `ensureCodeGraphReady()` in `lib/ensure-ready.ts:585-743` validates code graph state before tool dispatch and performs minimum necessary reindexing
- **Contract**: 10-second timeout guard ensures auto-indexing never blocks queries forever (`lib/ensure-ready.ts:74,582`)
- **Handler coverage**: Called by query, context, verify, detect-changes handlers (`handlers/query.ts:7,1103`, `handlers/context.ts:8,185`, `handlers/verify.ts:17,205`, `handlers/detect-changes.ts:15,249`)

#### 2. Preconditions Checked

- **Graph emptiness**: Detects 0-node graphs and triggers full scan (`lib/ensure-ready.ts:371-374`)
- **Scope fingerprint validation**: Compares stored vs active scope fingerprints; blocks reads when mismatch detected unless stored from per-call override (`lib/ensure-ready.ts:376-394,384`)
- **Git HEAD drift classification**: Classifies HEAD drift as 'in-scope', 'out-of-scope', or 'unknown' via git diff intersection with tracked files (`lib/ensure-ready.ts:130-156,415-418`)
- **File mtime staleness**: Checks mtime drift on tracked files via `ensureFreshFiles()` (`lib/ensure-ready.ts:421`)
- **Candidate manifest drift**: Detects untracked indexable file changes via {count, digest} manifest comparison (`lib/ensure-ready.ts:168-292,426`)
- **Deleted tracked files**: Partitions tracked files into existing/deleted and cleanup up deleted entries (`lib/ensure-ready.ts:294-316,420,592`)

#### 3. Readiness Gates

- **Auto-rescan safety gate**: Shared policy in `auto-rescan-policy.ts:106-128` allows auto-rescan only when scope fingerprints match AND parse error backlog ≤ threshold
- **Guarded inline full scan gate**: Evaluated via `evaluateGuardedFullScan()` in `lib/ensure-ready.ts:217-236,621-624`; delegates to `shouldAutoRescan()` for scope + backlog checks
- **Verification gate**: Gold verification status checked via `getVerificationGate()` in `lib/ensure-ready.ts:326-358,593`; returns 'pass'/'fail'/'absent'
- **Scope change promotion block**: Blocks full scan over existing graph when scope fingerprints differ unless `forceScopeChange:true` (`handlers/scan.ts:388-416`)
- **Zero-node promotion block**: Blocks full scan over existing graph when candidate persistable nodes = 0 unless `forceZeroNodeReset:true` (`handlers/scan.ts:393-496`)

#### 4. Failure Modes

- **Scope mismatch blocking**: Returns blocked status with stored vs active scope diagnostics (`lib/ensure-ready.ts:385-394`)
- **Git HEAD drift blocking**: Full scan triggered when HEAD drift is significant (in-scope or unknown) (`lib/ensure-ready.ts:429-438`)
- **Parse error backlog blocking**: Auto-rescan denied when backlog exceeds threshold (`lib/auto-rescan-policy.ts:120-125`)
- **Auto-index timeout**: 10-second timeout aborts indexing via AbortController (`lib/ensure-ready.ts:498-533,74`)
- **Auto-index failure**: Caught and surfaced in reason with self-heal result tracking (`lib/ensure-ready.ts:714-733`)
- **Guarded full scan denial**: Returns with `autoRescanSafety:'blocked'` and block reason when gate disabled or fails (`lib/ensure-ready.ts:625-635`)

#### 5. Recovery Procedures

- **CG-RP-001 (SQLite corruption)**: `recoverSqliteCorruption()` in `lib/recovery-procedures.ts:160-198` copies DB triplet to recovery dir, runs integrity check, moves to quarantine, triggers full scan
- **CG-RP-002 (Partial scan failure)**: `recoverPartialScanFailure()` in `lib/recovery-procedures.ts:200-247` runs integrity check, queries staged files (file_mtime_ms=0), decides incremental vs full scan based on stale count
- **CG-RP-003 (Rollback bad apply)**: `rollbackBadApply()` in `lib/recovery-procedures.ts:249-307` moves current triplet to quarantine, restores from latest known-good snapshot, triggers full scan
- **Self-heal tracking**: `selfHealAttempted`, `selfHealResult` ('ok'/'failed'/'skipped'), `lastSelfHealAt` tracked in ReadyResult (`lib/ensure-ready.ts:56-59,615-616,674-675,708-712,726-730`)

#### 6. Handler Integration

- **Query handler**: Calls `ensureCodeGraphReady()` before query execution, uses readiness block for payload enrichment (`handlers/query.ts:7,1103,430-461`)
- **Context handler**: Calls `ensureCodeGraphReady()` before context retrieval (`handlers/context.ts:8,185`)
- **Verify handler**: Calls `ensureCodeGraphReady()` before verification (`handlers/verify.ts:17,205`)
- **Detect-changes handler**: Calls `ensureCodeGraphReady()` before change detection (`handlers/detect-changes.ts:15,249`)
- **Status handler**: Uses `getGraphReadinessSnapshot()` for read-only diagnostics without mutation (`lib/ensure-ready.ts:788-817`)

#### 7. Diagnostics Payload

- **ReadyResult structure**: Defined in `lib/ensure-ready.ts:43-60` with freshness, action, files, inlineIndexPerformed, reason, scope diagnostics, manifest info, parse error backlog, auto-rescan safety, self-heal tracking, verification gate
- **Readiness block composition**: `buildReadinessBlock()` in `lib/readiness-contract.ts:241-249` augments ReadyResult with canonicalReadiness (ops-hardening vocabulary) and trustState (shared-payload axis)
- **Canonical readiness mapping**: `canonicalReadinessFromFreshness()` in `lib/readiness-contract.ts:73-88` maps 'fresh'→'ready', 'stale'→'stale', 'empty'→'missing', 'error'→'missing'
- **Trust state derivation**: `queryTrustStateFromFreshness()` in `lib/readiness-contract.ts:109-124` maps 'fresh'→'live', 'stale'→'stale', 'empty'→'absent', 'error'→'unavailable'

ITER_017_COMPLETE: 42 findings, newInfoRatio=1.00
