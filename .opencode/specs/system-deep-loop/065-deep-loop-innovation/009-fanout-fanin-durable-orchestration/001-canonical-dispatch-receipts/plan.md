---
title: "Implementation Plan: Canonical Dispatch Receipts"
description: "Implementation plan for canonical pre-spawn dispatch receipts, durable invocation fingerprints, and resume-time duplicate detection."
trigger_phrases:
  - "canonical dispatch receipts implementation plan"
  - "pre-spawn receipt implementation"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/009-fanout-fanin-durable-orchestration/001-canonical-dispatch-receipts"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/009-fanout-fanin-durable-orchestration/001-canonical-dispatch-receipts"
    last_updated_at: "2026-07-15T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Defined the pre-spawn receipt architecture and verification gates"
    next_safe_action: "Implement the receipt writer, projection, and crash-cut tests"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Canonical Dispatch Receipts

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | system-deep-loop runtime fan-out dispatch boundary |
| **Change class** | Durable orchestration contract: canonical event + pre-spawn barrier + resume projection |
| **Execution** | Additive-dark behind phase-006/004 interfaces; legacy execution remains authoritative |

### Overview
Promote the phase-005 executor adapter's resolved launch contract and invocation fingerprint into a versioned `lineage_dispatch_resolved` event. Resolve and validate the leaf first, authorize and append its canonical receipt through the phase-006 ledger second, and cross the subprocess spawn boundary only after the append receipt proves durability. Resume folds verified receipts into dispatch state, treats an exact match as already resolved, rejects identity/fingerprint conflicts, and routes receipt-without-result to recovery rather than guessing. The implementation composes with the phase-007 receipt/effect service and uses `receipt-crypto.ts` only within its declared canonicalization and verifier-trust limits.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The phase-005 adapter return contract and invocation-fingerprint inputs are pinned by tests
- [ ] The phase-006 envelope registry, authorization proof, ledger append, and append-receipt interfaces are available
- [ ] The phase-007 intent-before-effect and durable-verifier profiles are available or represented by hermetic interfaces
- [ ] The `lineage_dispatch_resolved` event version and canonical field allowlist are registered
- [ ] Dispatch identity, attempt identity, and idempotency-key derivation are stable across resume
- [ ] Legacy phase-005 command/pool/retry/budget baselines are captured before integration

### Definition of Done
- [ ] Every leaf spawn is preceded by a durable authorized receipt carrying the exact adapter fingerprint
- [ ] Exact receipt retry is idempotent; changed facts under one dispatch identity fail closed before spawn
- [ ] Resume distinguishes never-dispatched, receipt-only unresolved, result-recorded, conflict, and corrupt states
- [ ] Crash-cut tests prove no unreceipted spawn and no blind duplicate spawn
- [ ] Secret-exclusion and honest HMAC/durable-verifier labeling tests pass
- [ ] Legacy phase-005 behavior remains unchanged in additive-dark mode
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Resolution boundary**: phase-005 config expansion, capability validation, manifest expansion, and per-kind adapter resolution produce the effective launch contract plus `invocationFingerprint`. No canonical receipt is built from unvalidated requested values.
- **Canonical event builder**: normalize stable dispatch identities, effective executor facts, safe digests, fingerprint metadata, causality, authority epoch, and idempotency key into `lineage_dispatch_resolved`; reject raw secrets, prompt bodies, and unrestricted environment material.
- **Integrity profile**: serialize with the registered canonical JSON profile. Reuse `canonicalReceiptJson`, `deriveReceiptKey`, `signReceipt`, and `verifyReceipt` for the dispatch-receipt MAC profile; persist no run-master secret and label MAC evidence advisory unless the phase-007 durable verifier can re-derive it across restart.
- **Authorization + append barrier**: obtain the phase-006 transition authorization proof, append under the ledger's exclusive lock and expected-head check, wait for the durable sequence/hash append receipt, and only then invoke the pool worker/spawn callback.
- **Idempotency**: derive one stable key from the event version, run ID, dispatch/leaf slot, attempt identity, and invocation fingerprint. An exact canonical repeat returns the original append receipt; same identity with different facts is a typed conflict.
- **Resume projection**: fold only verified ledger events into a dispatch index keyed by stable dispatch slot. Compare the stored fingerprint with the desired resolved fingerprint and combine it with successor result evidence; mutable wait/checkpoint state is diagnostic, not authority.
- **Crash semantics**: receipt absence permits first dispatch; receipt plus result is resolved; receipt without result is unresolved. The last state enters phase-007 reconciliation and successor salvage/result logic, never automatic success or blind respawn.
- **Rollout boundary**: emit receipts and exercise projections in hermetic/shadow paths while legacy remains authoritative. Production resume authority changes only under the later staged cutover contract.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Pin the phase-005 adapter/fingerprint fixtures and the phase-006/004 interface versions used by this child.
- Inventory the exact fan-out path from manifest leaf resolution through pool-worker invocation and subprocess spawn.
- Define the event registry entry, stable dispatch/idempotency identities, safe-field allowlist, and typed error taxonomy.

### Phase 2: Implementation
- Add the canonical `lineage_dispatch_resolved` schema and builder over post-validation adapter output.
- Add fingerprint-version metadata and invariant checks that the stored value equals the phase-005 adapter return.
- Integrate the registered receipt canonicalization/MAC profile without persisting secrets or overstating restart trust.
- Add the authorization and durable ledger-append barrier immediately before the pool/spawn boundary.
- Add exact-repeat idempotency and same-identity/different-facts conflict handling.
- Add a verified dispatch-receipt projection and resume classifier with explicit unresolved handoff data.
- Wire additive-dark emission and comparison without changing legacy command, pool, retry, budget, checkpoint, or result authority.

### Phase 3: Verification
- Prove schema completeness, canonical byte stability, fingerprint parity, and secret exclusion.
- Prove capability rejection and append/authorization failures occur before any pool worker or spawn sentinel.
- Prove exact retries return one original append receipt and changed fingerprints fail closed.
- Inject crashes before append, after append/before spawn, during spawn, and after exit/before result persistence.
- Rebuild resume state from the verified ledger and assert receipt-only leaves are unresolved, not complete or automatically redispatched.
- Re-run phase-005 legacy command, manifest, pool, retry, budget, and persisted-artifact fixtures with dark receipts disabled and enabled.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | A spawn-sentinel matrix proves exactly one registered receipt event exists before each leaf spawn |
| REQ-002 | Schema fixtures cover all effective executor facts and safe digests across executor kinds |
| REQ-003 | Adapter/receipt parity fixtures compare the stored fingerprint byte-for-byte and mutate every phase-005 fingerprint input |
| REQ-004 | Authorization-denied, append-failed, and fsync-failed cases assert zero pool-worker/spawn calls |
| REQ-005 | Exact-repeat and same-ID/different-facts concurrency fixtures verify original-receipt reuse and typed conflict |
| REQ-006 | Redaction fixtures inject credentials, raw prompts, and environment secrets and scan event/MAC/log output for absence |
| REQ-007 | Canonicalization vectors, MAC mutation tests, fixed-length verification, and restart-without-durable-key tests enforce honest trust labels |
| REQ-008 | Ledger replay fixtures rebuild `not_dispatched`, `dispatch_resolved`, `conflict`, and `corrupt` states without checkpoints |
| REQ-009 | Receipt-only crash fixtures require `unresolved` plus recovery handoff and forbid completion or automatic respawn |
| REQ-010 | Desired-contract drift tests reject model, effort, search-policy, executor-version, prompt-digest, and config-digest changes under one slot |
| REQ-011 | Repeated verified replay produces byte-identical dispatch projections and rejects malformed/unauthorized events |
| REQ-012 | Crash injection covers every receipt/spawn/result cut and asserts bounded deterministic classification |
| REQ-013 | Phase-005 baseline snapshots prove legacy command, pool, retry, budget, and artifact parity in dark mode |
| REQ-014 | Contract tests expose stable receipt/dispatch/leaf IDs, fingerprint, ledger sequence/hash, and unresolved state to successor interfaces |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The child has no sibling planning dependency (`depends_on: []`). Program implementation inherits phase 009's prerequisites from `../../../manifest/phase-tree.json`: phase 005 supplies adapter resolution and the invocation fingerprint; phase 006 supplies the canonical envelope, authorization gateway, immutable typed ledger, append receipt, and replay verification; phase 007 supplies semantic receipt integrity and intent-before-effect recovery; phase 008 supplies compatibility/shadow/rollback posture. The concrete sources are `../../../005-fanout-live-tools-unblock/spec.md`, `../../../006-transition-authorized-ledger-core/002-typed-append-only-ledger/spec.md`, `../../../007-shared-evidence-and-control-services/001-receipts-and-effect-recovery/spec.md`, and `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/receipt-crypto.ts`.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

The implementation is additive-dark. Rollback disables canonical receipt emission/consumption at the compatibility boundary and returns resume decisions to the unchanged legacy path; it never deletes, truncates, rewrites, or re-signs committed ledger events. Existing dark receipts remain immutable historical evidence and are ignored by the legacy-authoritative projection. If rollback follows partial rollout, verify phase-005 command/pool/retry/budget parity and retain receipt schema readers so historical events remain replayable. A production authority rollback is owned by phase 014 and cannot be improvised here.
<!-- /ANCHOR:rollback -->
