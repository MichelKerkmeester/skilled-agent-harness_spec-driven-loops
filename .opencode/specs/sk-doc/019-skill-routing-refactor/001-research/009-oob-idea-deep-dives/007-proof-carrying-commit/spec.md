---
title: "Feature Specification: Deep-Dive — Proof-Carrying Prepare/Verify/Commit"
description: "Five-iteration SOL xhigh-fast deep-research lineage on a proof-carrying route lifecycle that splits one opaque commitment into PREPARE (read-only planning that emits a short-lived RouteProofV1 binding request/policy/registry hashes, a versioned read-set, ordered targets, authority class, preconditions, expiry, and idempotency key), destination-local VERIFY (recompute digests and current authority immediately before the first side effect, returning READY/STALE_PROOF/NEEDS_INPUT/DEFER/REJECT), and a narrow COMMIT where a proof is evidence not authority, a mutating leg invalidates later prepared legs, and post-mutation recovery is destination-owned rather than a false router-level atomic rollback."
trigger_phrases:
  - "proof carrying route plan deep dive"
  - "prepare verify commit routing"
  - "route proof is not authority"
importance_tier: "important"
contextType: "research"
---
# Deep-Dive: Proof-Carrying Prepare/Verify/Commit

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: templates/spec.md -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Research synthesized; implementation is out of scope |
| **Created** | 2026-07-18 |
| **Branch** | `0069-skilled-router-refactor-impl` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

A route decision can blur classification, authority acquisition, and execution. Without a destination-local freshness and authority check, a once-valid plan can act on stale state; after a real side effect, a universal router-level rollback promise is false.

### Purpose

Define a proof-carrying lifecycle in which `PREPARE` emits short-lived evidence without capability, the destination `VERIFY`s current state immediately before action, and a narrow `COMMIT` records the effect while invalidating later prepared legs.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- The canonical `RouteProofV1` fields, serialization, hashing, expiry, and read-set version vocabulary.
- Ordered destination-local verification returning `READY`, `STALE_PROOF`, `NEEDS_INPUT`, `DEFER`, or `REJECT`.
- One atomic commit boundary with idempotency state, immutable receipts, and monotonic planning epochs.
- An effect manifest that distinguishes safe speculation from metered, sensitive, mutating, or unknown work.
- Advisor, deterministic benchmark, and document-only behavior.

### Out of Scope

- Runtime implementation or a shared transaction manager.
- A promise of atomic rollback across files, network calls, deployments, or other non-transactional effects.
- Re-deriving the shipped `defaultMode` answer.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `spec.md` | Modify | Conform the research specification to the Level 2 structure |
| `plan.md` | Create | Record the research-document delivery approach |
| `tasks.md` | Create | Track synthesis and verification work |
| `checklist.md` | Create | Record pending verification without invented evidence |
| `implementation-summary.md` | Create | State the research-only delivery boundary |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A route proof is evidence, not authority. | Possessing a proof grants no capability; current destination authority is checked before sensitive reads and effects. |
| REQ-002 | Verification follows a fixed fail-closed order. | Parse, target, authority, expiry, policy, registry, read-set, target order, precondition, and epoch checks precede `READY`. |
| REQ-003 | Commit is a single destination-owned boundary. | The destination atomically checks the ready fence, authority, proof digest, epoch, and idempotency state before recording a receipt. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Read-set versions are adapter-specific and explicit. | Each observed resource declares a comparison vocabulary such as content hash, generation, resource version, strong ETag, or composite. |
| REQ-005 | Safe speculation is policy-typed, not inferred from a read-only label. | Unknown, metered, sensitive, or mutating operations fail closed unless declared, authorized, and budgeted. |
| REQ-006 | Post-mutation recovery remains destination-owned. | A mutating commit advances the epoch, invalidates later prepared legs, and never claims universal atomic rollback. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The proof has canonical bytes and a domain-separated digest but confers no authority.
- **SC-002**: Destination verification returns one of five typed outcomes in a deterministic precedence order.
- **SC-003**: Duplicate and concurrent commit attempts resolve through idempotency state and monotonic epochs.
- **SC-004**: Document-only execution is labeled a prepared draft, not a machine proof or ready fence.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Canonical serialization and hashing | Proof identity is not portable or replayable | Pin the schema and canonical byte representation |
| Dependency | Destination clock and authority source | Expiry and current permission cannot be established | Verify locally at the destination immediately before effect |
| Risk | Sensitive or metered reads are treated as harmless | PREPARE can leak data or spend resources | Require an explicit effect manifest and budget |
| Risk | Remote non-idempotent effects are reported exactly once | A local ledger cannot atomically control an external side effect | Require downstream idempotency, compensation, weaker semantics, or refusal |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Determinism
- **NFR-D01**: Pinned inputs must produce byte-identical proof bytes and verification precedence.

### Authority
- **NFR-A01**: `READY` is a one-shot destination-internal fence and cannot be transferred as a portable capability.

### Auditability
- **NFR-U01**: Commit state retains an immutable receipt and append-only status trail without overstating remote exactly-once guarantees.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Freshness and Concurrency
- Policy promotion, registry change, read-set drift, target reordering, expiry, or epoch change yields a non-ready result.
- Two keys racing one mutation epoch produce at most one winner; the first mutating commit invalidates later prepared legs.

### Idempotency
- The same key and digest replays the same receipt; the same key with another digest rejects.
- A non-idempotent remote effect without compensation or accepted weaker semantics cannot claim autonomous exactly-once delivery.

### Document-Only State
- Prose may record assumptions, versions, effect classes, expiry, and an idempotency key, but cannot establish canonical proof bytes or destination `READY`.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 17/25 | Proof, verification, commit, receipts, epochs, and effect classification |
| Risk | 19/25 | The contract sits immediately before authority acquisition and side effects |
| Research | 18/20 | Five iterations pin the V1 shape while naming hard external limits |
| **Total** | **54/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Which destination adapters can supply trustworthy clocks and version comparisons?
- Which effect classes may run during preparation under each authority and budget?
- Which remote operations support durable idempotency, compensation, or only weaker delivery semantics?
<!-- /ANCHOR:questions -->
