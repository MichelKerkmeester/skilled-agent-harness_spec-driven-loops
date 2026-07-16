---
title: "Implementation Plan: Result Envelopes & Resume/Salvage"
description: "Implementation plan for typed leaf result envelopes, deterministic ledger resume, and provenance-preserving partial-result salvage."
trigger_phrases:
  - "result envelope resume implementation plan"
  - "fanout salvage ledger plan"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/034-deep-loop-innovation/009-fanout-fanin-durable-orchestration/002-result-envelopes-and-resume-salvage"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/034-deep-loop-innovation/009-fanout-fanin-durable-orchestration/002-result-envelopes-and-resume-salvage"
    last_updated_at: "2026-07-15T14:42:33Z"
    last_updated_by: "codex"
    recent_action: "Defined envelope pairing, reconstruction, salvage, and verification phases"
    next_safe_action: "Implement the ledger reducers and artifact salvage adapters"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Result Envelopes & Resume/Salvage

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | system-deep-loop runtime + phase-006 ledger adapters |
| **Change class** | Additive typed persistence and recovery logic |
| **Execution** | Dark-write/shadow-compare before any authoritative resume path |

### Overview
Implement a registered per-attempt result event paired to the sibling-001 dispatch receipt, then build a pure verified-ledger reducer that reconstructs fan-out progress and excludes completed leaves. Add provenance-bearing salvage adapters over the shipped stdout, state-log, iteration-artifact, and registry recovery paths. Reconcile unsettled dispatch effects through phase 007 before retry eligibility is exposed. Preserve existing `fanout-run.cjs` behavior until shadow parity, crash fixtures, and later cutover gates authorize the typed path.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Sibling 001 freezes the canonical dispatch-receipt ID, attempt identity, invocation fingerprint, and causation fields consumed here
- [ ] Phase-006 event registry, typed append, verified reader, authorization proof, and replay-fingerprint APIs are available
- [ ] Phase-007 effect-recovery adapter exposes not-applied, applied, in-doubt, and conflict reconciliation outcomes
- [ ] Legacy fixtures pin `fanout-run.cjs`, `fanout-salvage.cjs`, `fanout-merge.cjs`, and `fanout-pool.cjs` result/retry/salvage behavior
- [ ] Result success criteria and required evidence sets are declared per supported leaf kind rather than inferred from process exit

### Definition of Done
- [ ] Every terminal dispatch attempt joins to one conflict-detecting typed result envelope
- [ ] Verified-ledger resume is deterministic and never re-runs a durably completed leaf
- [ ] Unsettled attempts reconcile before retry; in-doubt and corrupt states fail closed
- [ ] Partial salvage is append-only, provenance-bound, idempotent, and honest about completeness
- [ ] Legacy and dark typed paths pass shadow parity and crash-boundary fixtures with no authority movement
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Result-envelope registry and canonicalizer**: register the leaf-result event and status enum; validate receipt/attempt identity, result schema, bounded parsed value or digest reference, evidence/artifact set, timing, usage/cost provenance, error/salvage fields, replay fingerprint, authority epoch, and correlation/causation. Canonical bytes become the phase-006 idempotency/conflict boundary.
- **Receipt/result join index**: derive a map keyed by `dispatch_receipt_id` and attempt identity from verified events. One exact terminal pair is valid; missing, duplicate-with-different-facts, unknown-version, or dangling results are explicit invalid states. This is a projection only and is rebuildable from the ledger.
- **Resume reducer**: fold the expected leaf set, dispatch receipts, terminal results, salvage events, and effect-recovery outcomes in ledger sequence order. Emit a deterministic progress snapshot with completed exclusions, unresolved attempts, retry-eligible leaves, salvaged partials, conflicts, and unreadable blockers. The reducer performs no dispatch or file writes.
- **Recovery coordinator**: consume the reducer snapshot. For an unsettled attempt, call the phase-007 recovery gateway under its stable idempotency identity; append the observed reconciliation/result event; refold; expose only proved retry eligibility. The coordinator never retries an in-doubt or conflicted effect.
- **Salvage adapters**: generalize `runSalvageSweep` and merge reconstruction into typed extractors for captured stdout, state events, iteration artifacts, and missing registries. Each extractor emits canonical fragment metadata and an external artifact digest; a deterministic assembler derives an effective partial result without mutating source evidence.
- **Compatibility/shadow adapter**: instrument existing fan-out boundaries to dark-write receipt/result/salvage candidates and compare their reconstructed snapshot with legacy summaries, failure classes, required artifacts, recovered-iteration counts, reconstructed findings, and attribution. Mismatch blocks later cutover evidence but does not change legacy authority.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Freeze the sibling-001 receipt join contract and phase-006 event registration inputs.
- Capture legacy golden fixtures for success, partial failure, timeout, signal stop, orphaned start, retry, recovered iteration, failed salvage, and state-log registry reconstruction.
- Define per-leaf result schemas, required evidence sets, safe inline-size limits, usage/cost sources, and secret-redaction rules.

### Phase 2: Implementation
- Implement canonical result-envelope validation, serialization, receipt pairing, exact-repeat idempotency, and changed-facts conflict rejection.
- Implement the pure verified-ledger resume reducer and progress-snapshot schema, including completed-leaf exclusion and explicit unreadable/conflicted states.
- Implement the recovery coordinator that reconciles unresolved effects before appending a result or exposing retry eligibility.
- Implement typed salvage fragment extractors and the deterministic effective-result assembler over stdout, state logs, iteration artifacts, and registries.
- Add dark adapters to the existing fan-out runner and merge boundaries without changing authoritative scheduling, files, exit codes, summaries, or registry outputs.

### Phase 3: Verification
- Run schema/property tests for every result status, required/optional field, canonical digest, secret exclusion, measured/estimated/unknown cost, and receipt-pair conflict.
- Run deterministic replay tests from genesis and intermediate heads; repeated folds and resumes must produce byte-identical snapshots and identical completed exclusions.
- Inject crashes before dispatch, after receipt, during execution, after external application, before result append, after result append, during salvage, and after salvage append.
- Prove completed leaves never re-dispatch, not-applied attempts follow the governing retry policy, applied attempts reconcile, and in-doubt/conflict states stop.
- Compare legacy and dark outputs for salvage counts, failed markers, required-artifact failures, registry reconstruction, lineage attribution, summaries, and exit classification.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Join-property fixtures prove one terminal envelope per dispatch receipt and reject dangling results |
| REQ-002 | Schema matrices cover all statuses, parsed-result forms, evidence, artifacts, errors, usage, cost, salvage, replay, and authority fields |
| REQ-003 | Duplicate append tests return the original receipt for exact facts and reject every changed-fact dimension |
| REQ-004 | Exit-zero/missing-evidence and file-present/digest-mismatch fixtures remain non-successful |
| REQ-005 | Randomized event-order inputs are rejected unless ledger-valid; repeated valid folds are byte-identical |
| REQ-006 | Crash-and-resume counters prove each durably completed leaf executes once across repeated process restarts |
| REQ-007 | Effect-recovery fixtures cover not-applied, applied, in-doubt, conflict, and changed-idempotency inputs |
| REQ-008 | Salvage fixtures bind every fragment to source, digest, parser, scope, and completeness without rewriting originals |
| REQ-009 | Partial/mixed/failed salvage cannot satisfy success until every required evidence contract validates |
| REQ-010 | Hash gaps, forks, unknown schemas, stale artifacts, missing receipts, pair conflicts, and unknown costs fail closed |
| REQ-011 | Golden shadow fixtures preserve shipped salvage, merge reconstruction, attribution, failure classes, and exit codes |
| REQ-012 | Redaction and size-bound tests keep secrets/raw bulk outside ledger payloads and preserve explicit cost provenance |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

This planning child has `depends_on: []`; predecessor and successor references express sibling navigation only. Implementation composes with sibling 001's canonical dispatch receipt, phase-006's versioned envelope and typed append-only ledger, phase-007's receipt/effect-recovery gateway, and phase-008's compatibility/shadow bridge. Successor 003 may later add stable logical branch IDs, but this phase keys correctness to the dispatch receipt and attempt identity available at implementation time. Siblings 004-006 consume result/recovery projections without changing this child's pairing or no-rerun rules.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

All implementation is additive and dark. Disable the result/resume shadow adapter and continue using the existing `fanout-run.cjs` orchestration-status, artifact, salvage, and merge paths; committed typed events remain immutable audit evidence but non-authoritative. Revert the phase's path-scoped commits to remove new readers/writers and registry entries. Do not truncate the phase-006 ledger or rewrite result/salvage events. If dark/legacy parity diverges, stop cutover evidence, retain both outputs and the exact replay head, and reopen this phase before phase 014 can authorize fan-out authority.
<!-- /ANCHOR:rollback -->
