---
title: "Feature Specification: Canonical Dispatch Receipts"
description: "Promote each phase-002 resolved leaf invocation into a canonical, authorized, durable pre-spawn ledger receipt so resume can detect prior dispatch intent without duplicating work."
trigger_phrases:
  - "canonical dispatch receipts"
  - "fanout pre-spawn receipt"
  - "durable invocation fingerprint"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/009-fanout-fanin-durable-orchestration"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/009-fanout-fanin-durable-orchestration/001-canonical-dispatch-receipts"
    last_updated_at: "2026-07-15T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored the canonical dispatch-receipt planning contract"
    next_safe_action: "Implement pre-spawn ledger append and resume duplicate detection"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: Canonical Dispatch Receipts

> Phase adjacency under `009-fanout-fanin-durable-orchestration` (navigation order, not a hard runtime dependency): predecessor none (first sibling); successor `002-result-envelopes-and-resume-salvage`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/065-deep-loop-innovation/009-fanout-fanin-durable-orchestration/001-canonical-dispatch-receipts |
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Planned |
| **Created** | 2026-07-15 |
| **Owner skill** | system-deep-loop |
| **Origin** | First child of the phase-006 durable fan-out/fan-in parent; promotes the phase-002 adapter fingerprint into durable state |
| **Depends on** | None (`[]`); sibling planning contracts are independent, while phase-006 implementation inherits phases 002-005 as program prerequisites |
| **Authority posture** | Additive-dark until the program's staged authority cutover; legacy execution remains authoritative |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Phase 002 deliberately stops at the dispatch boundary. Its executor adapters resolve `{ command, args, input, effectiveConfig, invocationFingerprint }`, including executor kind, model, effort, web-search policy, executable version, and prompt digest, but its specification states that the fingerprint is an adapter return value rather than a ledger event. A process crash therefore loses the durable fact that a particular leaf launch contract was resolved, and resume cannot distinguish a leaf that was never planned from one whose launch crossed the persistence boundary (`../../../005-fanout-live-tools-unblock/spec.md`).

The phase-003 typed ledger already plans immutable, conflict-detecting idempotent append, authorized event linkage, monotonic sequence, and a durable append receipt (`../../../006-transition-authorized-ledger-core/002-typed-append-only-ledger/spec.md`). Phase 004 adds semantic receipts and intent-before-effect recovery, including the rule that an unresolved external effect must be reconciled rather than replayed speculatively (`../../../007-shared-evidence-and-control-services/001-receipts-and-effect-recovery/spec.md`). The shipped `runtime/lib/deep-loop/receipt-crypto.ts` supplies deterministic per-dispatch key derivation, recursively canonical JSON, HMAC signing that excludes the `mac` field, and constant-time verification, but its run-master secret remains outside the receipt and its process-local MAC cannot by itself establish restart-verifiable authority.

This phase composes those contracts into one canonical pre-spawn event, `lineage_dispatch_resolved`, for every leaf launch. The event records the stable dispatch identity, resolved executor contract, phase-002 invocation fingerprint, safe input/config digests, authorization linkage, and idempotency facts before the subprocess starts. Spawn is forbidden until the phase-003 ledger returns a durable append receipt. On resume, a verified exact receipt marks the dispatch slot as already resolved and prevents a second blind launch; receipt-without-result is explicitly unresolved and must flow to the phase-004 recovery contract and the successor result-envelope/salvage phase. The program phase tree assigns this outcome to phase 006 after phases 002-005 (`../../../manifest/phase-tree.json`).
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Register a versioned canonical `lineage_dispatch_resolved` event in the phase-003 envelope/type registry and define it as a dispatch receipt recording durable intent, not proof that a process started or completed.
- Carry the phase-002 adapter's `invocationFingerprint` unchanged, with an explicit fingerprint version/algorithm, alongside the independently normalized resolved launch facts that produced it.
- Record stable receipt, dispatch, run, leaf/logical-branch, and attempt identities; correlation/causation links; executor kind; model; effort; effective search policy; adapter/executable identity and version; safe prompt/input/config digests; and authorization/idempotency references.
- Exclude raw prompts, credentials, unrestricted environment values, run-master secrets, and other sensitive launch material from the event.
- Build the event only after config expansion, capability validation, manifest expansion, and adapter resolution, then authorize and durably append it before invoking the pool worker or subprocess spawn boundary.
- Reuse phase-003 exact-repeat idempotency: the same dispatch identity and canonical event bytes return the original ledger append receipt; the same identity with changed launch facts or fingerprint fails closed.
- Use `canonicalReceiptJson`, `deriveReceiptKey`, `signReceipt`, and `verifyReceipt` from `receipt-crypto.ts` where the registered integrity profile permits, while labeling process-local HMAC advisory unless a durable key provider can re-derive and verify it after restart.
- Add a verified dispatch-receipt projection used by resume to classify a leaf as `not_dispatched`, `dispatch_resolved`, `result_recorded`, `unresolved`, `conflict`, or `corrupt` without trusting mutable checkpoint state.
- Cover crash cuts before append, after durable append but before spawn, during spawn, and after subprocess exit but before a result envelope; enforce no-spawn-on-append-failure and no-blind-respawn-on-unresolved-receipt.
- Preserve legacy execution authority and emit/consume the new receipt in dark or hermetic paths until the later cutover phase authorizes it.

### Out of Scope
- Changing the phase-002 capability matrix, adapter command shapes, manifest Cartesian expansion, model selection, effort policy, or invocation-fingerprint inputs.
- Redefining the phase-003 envelope, ledger frame/hash chain, transition vocabulary, replay fingerprint, append durability, or authorization gateway.
- General boundary receipts, external-effect adapter policy, or durable certification-provider design owned by phase 004.
- Result-envelope schemas, stdout/artifact salvage, terminal outcome reconciliation, or result authority owned by successor `002-result-envelopes-and-resume-salvage`.
- Logical-branch lifecycle, leases, waves, budget-aware fan-in, partial-failure policy, provenance-balanced reduction, or convergence.
- Claiming exactly-once subprocess execution. A pre-spawn receipt proves durable intent; an absent result after a crash remains unresolved until recovery obtains conclusive evidence.
- Activating ledger-derived resume decisions for authoritative production paths before the staged phase-011 cutover.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every resolved leaf dispatch emits one canonical receipt event | Each fan-out leaf has one registered `lineage_dispatch_resolved` event keyed to its stable dispatch slot before any subprocess spawn |
| REQ-002 | The receipt captures the resolved launch contract | Executor kind, model, effort, effective search policy, adapter/executable identity and version, and safe prompt/input/config digests are present and canonical |
| REQ-003 | The phase-002 invocation fingerprint is promoted without semantic drift | The stored fingerprint equals the adapter return value byte-for-byte, carries a version/algorithm, and changes whenever the phase-002 contract says it must change |
| REQ-004 | Authorization and durable append precede execution | Capability validation and transition authorization pass, the ledger append is fsynced and acknowledged, and only then may the pool worker or spawn stub be invoked |
| REQ-005 | Receipt identity is idempotent and conflict detecting | An exact repeated event returns the original sequence/hash append receipt; the same dispatch/idempotency identity with different contract facts or fingerprint is rejected before spawn |
| REQ-006 | Receipt payloads exclude secrets and unsafe raw material | Fixtures prove no credentials, run-master secret, unrestricted environment values, or raw prompt bodies enter the event, MAC input diagnostics, or logs |
| REQ-007 | Cryptographic claims match the available trust root | Canonical serialization and MAC verification use `receipt-crypto.ts`; process-local HMAC is marked advisory, and restart-verifiable acceptance requires the registered durable verifier policy |
| REQ-008 | Resume derives dispatch state from the verified ledger | No receipt means eligible for first dispatch; an exact verified receipt means already resolved; malformed, unauthorized, unknown-version, or hash-invalid evidence fails closed |
| REQ-009 | Receipt-without-result is never mistaken for completion | Resume classifies it as unresolved, suppresses blind duplicate spawn, and hands it to effect recovery plus successor result-envelope/salvage logic |
| REQ-010 | Changed desired launch contracts cannot reuse a prior dispatch slot | A resume-time desired fingerprint mismatch produces a typed conflict requiring a new authorized dispatch identity or operator resolution |
| REQ-011 | The receipt is replay-deterministic and projection-safe | The phase-003 verified stream rebuilds byte-identical dispatch-state projections; mutable checkpoint caches cannot override ledger evidence |
| REQ-012 | Crash behavior closes every pre-spawn ambiguity | Crash-injection tests prove no spawn before durable append, no duplicate event after exact retry, and no automatic re-execution after a receipt-only crash |
| REQ-013 | Legacy behavior remains authoritative during dark rollout | Existing phase-002 command, pool, retry, budget, and persisted-artifact behavior is unchanged when canonical receipt consumption is not enabled |
| REQ-014 | Event and resume APIs expose typed evidence for later siblings | Result, salvage, lease, and fan-in phases can consume receipt ID, dispatch ID, leaf identity, invocation fingerprint, ledger sequence/hash, and unresolved classification without parsing logs |

### Canonical receipt event shape

| Field group | Required facts | Contract |
|-------------|----------------|----------|
| Envelope | event type/version, event ID, run ID, correlation/causation IDs, authority epoch | Supplied by the phase-003 canonical envelope and authorization gateway |
| Dispatch identity | receipt ID, dispatch ID, leaf/logical-branch ID, attempt ID, idempotency key | Stable across retry; changed facts under the same identity conflict |
| Resolved launch | executor kind, model, effort, search policy, adapter version, executable identity/version | Values are effective post-expansion facts, not unvalidated requested values |
| Safe inputs | prompt digest, input digest, effective-config digest, declared capability-row ID | Raw prompt, environment, credentials, and secret-bearing argv fields are excluded |
| Fingerprint | invocation fingerprint, fingerprint version, algorithm/namespace | Fingerprint is copied from the phase-002 adapter result and checked against the normalized facts |
| Integrity | canonicalization version, optional MAC scheme/key-provider ID/MAC | Ledger integrity is durable authority; process-local HMAC is advisory without a durable verifier |
| Append evidence | ledger ID, committed sequence, event hash, resulting head, authorization proof reference | Returned by the ledger append receipt and exposed with, not self-embedded inside, the pre-append payload |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every leaf spawn is preceded by one durable, authorized `lineage_dispatch_resolved` ledger event carrying its phase-002 invocation fingerprint.
- **SC-002**: Exact retries return the original append receipt, while reused dispatch identities with changed launch facts fail before spawn.
- **SC-003**: Resume rebuilds dispatch state from verified ledger evidence and never treats a receipt-only leaf as completed.
- **SC-004**: Crash injection at every receipt/spawn/result boundary produces no unreceipted spawn and no blind duplicate execution.
- **SC-005**: Canonicalization, MAC labeling, secret exclusion, and ledger integrity claims match `receipt-crypto.ts` and the phase-004 durable-verifier policy.
- **SC-006**: Legacy phase-002 commands, pool behavior, retries, budgets, and persisted artifacts remain unchanged during additive-dark rollout.

**Given** a phase-002 adapter has resolved a valid launch contract, **When** fan-out reaches the execution boundary, **Then** the authorized receipt is durably committed before the spawn stub is called.

**Given** the same dispatch identity and canonical launch facts are retried, **When** append runs again, **Then** the original ledger sequence/hash receipt is returned and no second subprocess is launched.

**Given** a verified dispatch receipt exists but no result envelope is present, **When** resume rebuilds leaf state, **Then** it reports `unresolved` and invokes recovery/salvage coordination without blind respawn.

**Given** a prior dispatch identity is paired with a different invocation fingerprint, **When** resume or retry attempts dispatch, **Then** a typed conflict stops execution before spawn.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

The highest risk is collapsing durable intent into proof of execution. The receipt is intentionally written before spawn, so a crash can leave a valid receipt for a subprocess that never started. Resume must therefore use three-valued evidence: no receipt permits first dispatch, receipt plus terminal result is resolved, and receipt without result is unresolved pending recovery. Treating the middle crash window as either safe-to-retry or completed would respectively duplicate effects or lose work.

The next risk is split fingerprint authority. Phase 002 owns adapter resolution and the invocation fingerprint; this phase stores that exact value and the normalized effective facts but does not invent a second competing fingerprint. A mismatch between the stored fingerprint, the reconstructed desired contract, and the event facts is a conflict. The phase-003 ledger supplies durable integrity and idempotent append; the phase-004 receipt/effect service supplies intent-before-effect and reconciliation policy; `receipt-crypto.ts` supplies canonical HMAC primitives without authorizing a false cross-resume trust claim.

This child declares `depends_on: []` because the phase-006 sibling planning contracts are independent. Program execution still inherits phase 006's dependencies on phases 002, 003, 004, and 005 as recorded in `../../../manifest/phase-tree.json`. The implementation remains additive-dark and cannot move production resume authority before phase 011. Later result, salvage, lease, and fan-in children depend on the typed evidence boundary defined here but may not reinterpret a dispatch receipt as a terminal outcome.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking for planning. Implementation may finalize module names, the registered event-version number, and the durable MAC provider after phase-003/004 interfaces materialize. It may not weaken pre-spawn durability, exact fingerprint promotion, idempotent conflict detection, secret exclusion, honest verifier labeling, unresolved receipt recovery, or the additive-dark authority boundary.
<!-- /ANCHOR:questions -->
