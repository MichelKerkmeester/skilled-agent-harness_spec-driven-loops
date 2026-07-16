---
title: "Implementation Plan: Upcasters & Dual-Read/Single-Write Adapters"
description: "Implementation plan for deterministic compatibility registries and reversible legacy-authoritative shadow adapters over the phase-006 dark ledger."
trigger_phrases:
  - "upcaster and dual-read adapter implementation plan"
  - "deep-loop shadow compatibility implementation"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/008-compatibility-shadow-and-rollback-bridge/001-upcasters-and-dual-read-adapters"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/008-compatibility-shadow-and-rollback-bridge/001-upcasters-and-dual-read-adapters"
    last_updated_at: "2026-07-15T14:17:04Z"
    last_updated_by: "codex"
    recent_action: "Planned registry, reconciliation, and reversible shadow-write implementation"
    next_safe_action: "Inventory legacy families and bind each to explicit version fixtures"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Upcasters & Dual-Read/Single-Write Adapters

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | system-deep-loop runtime compatibility boundary |
| **Change class** | Compatibility logic, shadow reads, and non-authoritative mirror writes |
| **Execution** | Additive behind compatibility gates; legacy remains authoritative |

### Overview
Implement one deterministic compatibility layer between the current producer-native state shapes and the phase-006 current envelope/ledger contracts. The layer has three separable responsibilities: validate and chain registered event/state upcasters; obtain comparable legacy and dark observations and reconcile their normalized current models; and preserve one authoritative legacy mutation while appending at most one idempotent, non-authoritative dark mirror. The implementation must not rewrite historical data, infer versions from arbitrary JSON, fail over from legacy to dark, repair either store during reads, or expose an authority switch. Detailed module names are selected against the pinned state census, but behavior is fixed by the phase-004 policy, phase-006 envelope and ledger specs, `atomic-state.ts`, and `manifest/phase-tree.json`.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The pinned state census identifies every legacy event/snapshot/JSONL family, reader, writer, version discriminator, and rollback anchor in scope
- [ ] The phase-004 transition/versioning policy and phase-006 envelope, ledger, authorization, and replay contracts are frozen at exact revisions
- [ ] Each admitted historical version has canonical input/output fixtures and an explicit adjacent transform path to current
- [ ] The comparison token binds logical identity, authority epoch, legacy position, verified dark head, and correlation identity
- [ ] The legacy direct path and its value/error/retry semantics are captured before adapter insertion

### Definition of Done
- [ ] Registry startup validation rejects every incomplete or non-deterministic version graph
- [ ] Dual-read reconciliation implements every matrix row without dark fallback or read-repair
- [ ] Write instrumentation proves one legacy mutation and zero-or-one idempotent dark mirror per accepted transition
- [ ] Dark read/append failures are observable and block parity evidence without changing legacy behavior
- [ ] Disabling compatibility gates reproduces the pinned direct-legacy baseline with no storage migration
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Version registry**: immutable after startup, keyed by record family and stable event/state type. It declares the current version, validators, canonicalizers, and exactly one adjacent transform for each supported historical version. Startup validation rejects gaps, forks, cycles, duplicates, non-positive versions, multiple current versions, and non-deterministic discovery order.
- **Upcast executor**: validates the stored form, resolves the complete chain, executes one pure hop at a time, validates each intermediate result, and returns an effective current model plus stored/effective versions, immutable source reference, registry identity, and ordered trace. It returns no partial model on failure.
- **Legacy codec boundary**: explicit codecs wrap inventoried call sites that currently pass arbitrary `unknown` shapes to `writeStateAtomic`, `writeStateIfChangedAtomic`, `appendJsonlIfChangedAtomic`, or deferred writers. The atomic utility remains a persistence primitive, not a schema or version detector.
- **Dual-read sampler**: reads legacy and verified dark sources under one comparison token. It does not race arbitrary latest values; it records exact positions and classifies causal skew before semantic comparison.
- **Reconciler**: compares normalized current models using the phase-006 canonical/replay fingerprint inputs. It returns the legacy operational value or error plus typed evidence: `parity`, `divergence`, `dark_lagging`, `dark_missing`, `dark_failure`, `legacy_failure_dark_success`, or `not_comparable`.
- **Single-authoritative-write adapter**: calls the legacy writer once. After accepted legacy mutation, it constructs the current canonical envelope and requests one idempotent authorized dark append. The dark receipt or failure is diagnostic; neither changes the legacy command result.
- **Compatibility controls**: independent gates for upcasting, dual reads, and dark mirroring permit a direct legacy-only rollback. No gate selects dark authority, and no read path performs repair or writeback.
- **Evidence boundary**: reconciliation and mirror-failure records are bounded, correlation-safe, and do not copy sensitive payloads. They feed later shadow-parity and cutover evidence but are not domain events that advance operational state.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Pin the phase-003 legacy state census and exact phase-004/phase-006 contract revisions.
- Build the legacy family manifest with read/write call sites, stored discriminators, supported version ranges, canonical fixtures, and baseline error/retry behavior.
- Freeze adapter gates, typed error vocabulary, reconciliation outcomes, and comparison-token fields before inserting runtime seams.

### Phase 2: Implementation
- Implement the immutable registry, adjacent-chain validator, per-hop validators, and auditable upcast result for events and explicitly versioned state families.
- Add explicit legacy codecs at inventoried persistence call boundaries without changing `atomic-state.ts` serialization, fsync, debounce, or diff-gating semantics.
- Implement causal-positioned dual reads, independent source validation/upcasting, deterministic reconciliation, and bounded divergence evidence.
- Implement the one-legacy-call write wrapper and the current-version, authorized, idempotent dark mirror; prohibit dark fallback, retries that repeat legacy mutation, and all read-repair/writeback paths.
- Add independent disablement gates that restore direct legacy reads/writes and leave existing legacy and dark records untouched.

### Phase 3: Verification
- Prove registry determinism and multi-hop output stability; reject gaps, cycles, duplicates, forks, future versions, ambiguous shapes, invalid hops, and identity mutation.
- Exercise every dual-read matrix row at matching and mismatched causal points; confirm the legacy result or error is always operational.
- Instrument success, retry, duplicate, legacy failure, dark failure, and crash boundaries; confirm one legacy mutation and at most one idempotent dark append.
- Compare enabled-then-disabled behavior with the pinned direct-legacy baseline; confirm no storage rewrite, repair, deletion, authority flip, or changed legacy error semantics.
- Produce evidence consumable by successor legacy projections and later shadow-parity/rollback children without claiming cutover readiness.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Registry table tests enumerate one current version and one adjacent path per supported family; malformed graphs fail startup |
| REQ-002 | Purity harness freezes inputs, repeats chains, compares canonical bytes/traces, and fails on I/O, time, randomness, mutation, or identity drift |
| REQ-003 | Read results preserve immutable source references, stored/effective versions, registry identity, and all hops while source hashes remain unchanged |
| REQ-004 | Unknown, future, ambiguous, missing-edge, invalid-hop, and lossy fixtures return typed failures with no partial effective model |
| REQ-005 | Comparison-token fixtures distinguish equal causal positions from lagging or unrelated snapshots before semantic fingerprint comparison |
| REQ-006 | Table-driven reconciliation covers every legacy/dark success, divergence, lag, miss, invalid, and failure combination |
| REQ-007 | Spies and durable idempotency fixtures prove one legacy invocation and zero-or-one dark append per accepted command |
| REQ-008 | Fault injection at dark read/verify/append boundaries preserves the legacy value/error and produces bounded diagnostic evidence |
| REQ-009 | Mutation guards assert no adapter read opens either source for write and no reconciliation result reaches a persistence API |
| REQ-010 | Gate-off comparison replays the pinned legacy corpus and matches values, errors, retry counts, and stored bytes |
| REQ-011 | Integration fixtures use phase-006 validated reads and authorized appends; bypass attempts fail before append or consumer dispatch |
| REQ-012 | Call-site inventory maps each `atomic-state.ts` primitive to an explicit codec and proves utility behavior remains unchanged |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The child declares no hard sibling dependency (`depends_on: []`), but execution requires the frozen phase-004 transition/versioning policy and the phase-006 envelope, typed ledger, replay fingerprint, and authorization contracts. The legacy family inventory comes from the pinned phase-003 census. `runtime/lib/deep-loop/atomic-state.ts` is the concrete persistence boundary whose generic shapes and failure semantics must be preserved. The program `spec.md` and `manifest/phase-tree.json` remain authoritative for additive-dark posture, no-cutover scope, and downstream ordering. Successor `002-legacy-projections` and later phase-008 shadow, classification, and rollback children consume this contract.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Rollback disables dark mirroring first, then dual reads, then compatibility upcasting at the adapter seam, returning all operational reads and writes to the pinned direct-legacy path. No source record is rewritten, no reconciliation performs repair, and dark records remain immutable audit evidence, so rollback requires no reverse data migration. If an upcaster or adapter is defective, quarantine its registry entry and evidence receipts, preserve the exact dark bytes for diagnosis, and rerun the legacy baseline. Authority never moved in this phase; rollback cannot require an epoch flip or ledger-to-legacy projection.
<!-- /ANCHOR:rollback -->
