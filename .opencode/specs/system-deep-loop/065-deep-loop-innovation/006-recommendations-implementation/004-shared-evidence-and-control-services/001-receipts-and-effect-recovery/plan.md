---
title: "Implementation Plan: Receipts & Effect Recovery"
description: "Implementation plan for certified phase/mode boundary receipts and an intent-confirm-recover gateway for replay-safe external effects."
trigger_phrases:
  - "receipts and effect recovery implementation plan"
  - "boundary receipt implementation"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/006-recommendations-implementation/004-shared-evidence-and-control-services/001-receipts-and-effect-recovery"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/006-recommendations-implementation/004-shared-evidence-and-control-services/001-receipts-and-effect-recovery"
    last_updated_at: "2026-07-15T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Defined receipt issuance and intent-confirm-recover implementation phases"
    next_safe_action: "Freeze phase 003 interfaces and build the crash-injection adapter harness"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Receipts & Effect Recovery

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | system-deep-loop runtime + phase-003 typed ledger composition |
| **Change class** | Shared evidence and external-effect control service |
| **Execution** | Additive-dark modules and hermetic adapters; no authority cutover |
| **Recovery guarantee** | Effectively once only where target idempotency or conclusive reconciliation exists |

### Overview
Implement a receipt issuer/verifier over canonical phase-003 ledger events and an effect gateway whose durable state machine is `intent_recorded -> confirmed`, with `recovery_started -> reconciled` for interrupted work. Boundary receipts are issued after durable phase/mode results and bind the resulting head, replay fingerprint, evidence digests, authority epoch, and explicit certification profile. External-effect adapters must accept stable idempotency keys, expose target-specific reconciliation, and refuse automatic replay when the result is ambiguous. The work preserves shipped runtime recovery behavior and stays dark until later mode migration and authority cutover.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase-003 envelope, ledger append/receipt, replay-fingerprint, and authorization interfaces are frozen for consumption
- [ ] Registered phase/mode boundary points and result codes are mapped to canonical boundary-event types
- [ ] Receipt certification profiles distinguish durable cross-resume verification from advisory same-process HMAC
- [ ] Effect adapter matrix names idempotency propagation, reconciliation evidence, and `in_doubt` behavior for subprocess, file, and API effects
- [ ] Crash-injection fixtures cover every cut point from pre-intent through post-confirmation response loss
- [ ] Additive-dark wiring proves no real irreversible external effect is shadow-executed

### Definition of Done
- [ ] Registered phase/mode boundaries emit one conflict-detecting certified receipt bound to the durable result
- [ ] Every gateway effect has durable intent before execution and confirmation or explicit recovery state afterward
- [ ] Concurrent retry and crash-resume tests show no duplicate mutation for every replay-safe adapter
- [ ] Ambiguous, mismatched, stale, tampered, or unsupported cases fail closed with auditable ledger evidence
- [ ] Shipped receipt, wait-resume, salvage, JSONL recovery, and atomic-write regression suites remain green
- [ ] The phase remains additive-dark and changes no legacy authority or production effect selection
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Boundary registry**: a closed registry maps certifiable phase/mode boundary kinds to required from/to states, result classes, evidence fields, and receipt policy. Intermediate iterations do not emit boundary receipts.
- **Receipt facts**: canonical facts bind `receipt_id`, `boundary_id`, kind, mode/phase, from/to state and heads, result/evidence/artifact digests, replay fingerprint, authority epoch, correlation/causation, issuer, issued time, and idempotency key.
- **Certification envelope**: `scheme`, `key_id` or provider ID, verifier version, canonical signed digest, and signature/certificate bytes are explicit. Durable cross-resume providers are registry-governed; existing process-local HMAC is imported as advisory legacy evidence only.
- **Receipt issuance path**: validate the committed boundary/result event, re-read its verified head, construct canonical facts, authorize the receipt event capability, certify, and append idempotently. Same key plus different facts is a hard conflict.
- **Effect intent**: canonical effect type, logical operation ID, stable target identity, safe request metadata, input digest, adapter/version, idempotency key, recovery policy, expected postcondition, and secret references are authorized and durably appended before the adapter runs.
- **Effect execution**: the adapter receives the immutable intent and same idempotency key. Subprocess uses logical invocation plus durable artifact/status evidence; file publication uses content digest, expected prior state, staging, fsync, and atomic rename; API mutation uses provider idempotency plus status/read-after-write evidence.
- **Confirmation**: after adapter-specific verification, append a confirmation binding intent, target receipt/postcondition, output digest, and completion class. The confirmation is returned only after ledger durability.
- **Recovery scan**: verified replay finds intents with no valid terminal confirmation. Under the applicable claim/fence, the adapter classifies target state as `not_applied`, `applied`, `in_doubt`, or `conflict` and records the verdict before acting.
- **Recovery decision**: replay once with the same key only for `not_applied`; synthesize a confirmation from observed target evidence for `applied`; stop for operator resolution on `in_doubt`; reject on `conflict`.
- **Dark composition**: hermetic adapters and record/replay cassettes exercise the new path. Existing authoritative effect execution is not duplicated; later phase-006 and phase-010 work wire consumers before phase-011 cutover.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Pin the candidate SHA and phase-003 envelope, typed-ledger, fingerprint, and authorization interface digests.
- Inventory phase/mode boundary emitters and shipped effect/recovery surfaces under `.opencode/skills/system-deep-loop/runtime/`.
- Freeze event schemas, stable error codes, certification profiles, idempotency-key grammar, and adapter recovery verdicts in contract tests.
- Build hermetic subprocess, filesystem, and API targets with deterministic fault injection at each lifecycle cut point.

### Phase 2: Implementation
- Implement the boundary registry, canonical receipt facts, certification-provider interface, durable verifier, and idempotent receipt issuer over the phase-003 ledger.
- Add explicit compatibility for shipped dispatch intent/completion receipts without upgrading their process-local MAC trust claim.
- Implement the effect intent and confirmation event schemas plus the deterministic key derivation and conflict index.
- Implement the gateway ordering boundary: authorize and append intent, invoke the adapter, verify outcome, append confirmation, then return.
- Implement subprocess, atomic-file, and idempotent-API adapters with declared capabilities and fail-closed unsupported modes.
- Implement verified unresolved-intent replay, recovery claim/fence integration seam, reconciliation verdict events, retry limits, and operator-resolution records.
- Add dark integration seams around existing wait checkpoints, fan-out salvage, atomic writes, and JSONL recovery without changing legacy authority.

### Phase 3: Verification
- Verify receipt completeness, tamper detection, signer/verifier registry behavior, restart verification, exact-repeat dedupe, and same-key/different-facts conflicts.
- Crash at pre-intent, post-intent/pre-dispatch, mid-dispatch, post-application/pre-confirm, post-confirm/pre-response, and recovery-retry boundaries.
- Race concurrent callers with the same key and with conflicting facts; prove one effect or a typed conflict, never two mutations.
- Exercise `not_applied`, `applied`, `in_doubt`, and `conflict` for every adapter, including unavailable reconciliation and stale target evidence.
- Prove secret exclusion, bounded ledger metadata, exact phase-003 authorization linkage, and deterministic replay-fingerprint contribution.
- Run shipped runtime regression suites and the phase-003/004 composition gate; verify legacy outputs and production effect selection are unchanged.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 / REQ-002 | Boundary fixture matrix proves one post-result receipt with complete canonical binding; field mutation invalidates certification |
| REQ-003 | Same-process HMAC is rejected for durable trust after restart; registered durable provider verifies the unchanged canonical receipt |
| REQ-004 | Exact retry returns the original receipt; changed result, head, key, or certification facts produce a typed conflict |
| REQ-005 / REQ-007 | Ledger ordering assertions show durable intent before adapter invocation and verified confirmation after observed outcome |
| REQ-006 | Cross-restart and concurrent tests reproduce the identical key; target, operation, or input changes produce a different key or conflict |
| REQ-008 / REQ-009 | Crash matrix exercises all four reconciliation verdicts and asserts replay occurs only for conclusive `not_applied` |
| REQ-010 | Adapter conformance suite covers logical subprocess identity, digest-bound atomic file publication, and API provider idempotency/status lookup |
| REQ-011 | Phase-003 integration tests reject missing authorization, invalid envelope, unverified head, or fingerprint mismatch before effect execution |
| REQ-012 | Golden legacy fixtures and shipped runtime tests show receipt, wait, salvage, JSONL, and atomic-state behavior unchanged |
| REQ-013 | Redaction fixtures seed credentials and raw payload secrets and assert neither ledger events nor diagnostics contain them |
| REQ-014 | Recovery telemetry fixtures assert bounded attempts, recorded verdict/reason, claim/fence reference, and terminal/manual status |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

This child has `depends_on: []` within the phase-004 sibling planning set. Its implementation is still behind the program-level phase-003 dependency declared for phase 004 in `.opencode/specs/system-deep-loop/065-deep-loop-innovation/006-recommendations-implementation/manifest/phase-tree.json`. It consumes `003-transition-authorized-ledger-core/001-versioned-event-envelope`, `002-typed-append-only-ledger`, `003-replay-fingerprints`, and `004-transition-authorization-gateway` as one co-landed substrate.

Runtime evidence and compatibility inputs are `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts`, `receipt-crypto.ts`, `atomic-state.ts`, `jsonl-repair.ts`, `runtime/scripts/fanout-run.cjs`, and `runtime/scripts/fanout-salvage.cjs`. A later phase-004 locks/fencing sibling supplies the production claim/fence primitive; this phase defines the seam and uses a deterministic test implementation until that sibling composes. Phase 006 consumes the gateway for durable orchestration, phase 010 wires modes, and phase 011 controls authority cutover.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Before phase 011, rollback disables the dark receipt/effect service registration and leaves authoritative legacy writers and effect paths unchanged. Ledger receipt, intent, confirmation, and recovery events already written remain immutable audit evidence; rollback never deletes or rewrites them. Hermetic external targets are reset through fixture-owned teardown, not production compensation.

If certification, idempotency, or reconciliation semantics fail, stop new dark intents, preserve the verified ledger head and unresolved-intent report, revert the bounded implementation commits, and reopen this phase. Any unresolved real effect is held in `in_doubt` for operator resolution; rollback must not replay or compensate it automatically. Authority rollback is outside this phase because no cutover is authorized here.
<!-- /ANCHOR:rollback -->
