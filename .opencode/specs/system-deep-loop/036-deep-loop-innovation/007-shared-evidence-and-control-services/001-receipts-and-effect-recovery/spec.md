---
title: "Feature Specification: Receipts & Effect Recovery"
description: "Plan durable boundary receipts and an effect-recovery gateway that records intent before execution, confirms observed outcomes, and reconciles interrupted external effects without unsafe replay."
trigger_phrases:
  - "receipts and effect recovery"
  - "deep-loop boundary receipts"
  - "idempotent external effect recovery"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/007-shared-evidence-and-control-services"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/007-shared-evidence-and-control-services/001-receipts-and-effect-recovery"
    last_updated_at: "2026-07-15T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored the Level 2 receipts and effect-recovery planning contract"
    next_safe_action: "Implement boundary receipts and the effect gateway behind the phase 006 substrate"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: Receipts & Effect Recovery

> Phase adjacency under `007-shared-evidence-and-control-services` (navigation order, not a hard runtime dependency): predecessor none (first sibling); successor `002-sealed-reference-artifacts`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/036-deep-loop-innovation/007-shared-evidence-and-control-services/001-receipts-and-effect-recovery |
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Planned |
| **Created** | 2026-07-15 |
| **Owner skill** | system-deep-loop |
| **Origin** | First child of the phase-007 shared evidence-and-control-services parent |
| **Depends on** | None (`[]`); sibling planning contracts are independent |
| **Program substrate** | Phase 007 consumes the completed phase-006 envelope, typed ledger, replay fingerprint, and transition-authorization gateway |
| **Authority posture** | Additive-dark; no authoritative effect path or mode cutover occurs in this phase |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The program requires proof that phase and mode boundaries were crossed with a specific result, and it requires every external side effect to survive a crash or resume without being applied twice. The phase tree assigns those shared services to phase 007 after the phase-006 typed ledger and fail-closed transition gateway (`.opencode/specs/system-deep-loop/036-deep-loop-innovation/spec.md`, `.opencode/specs/system-deep-loop/036-deep-loop-innovation/manifest/phase-tree.json`). The phase-006 ledger already plans immutable, conflict-detecting idempotent append and durable append receipts, while its authorization gateway forbids a receipt or side effect from following a denied transition (`../../006-transition-authorized-ledger-core/002-typed-append-only-ledger/spec.md`, `../../006-transition-authorized-ledger-core/004-transition-authorization-gateway/spec.md`). What remains is the shared semantic contract above those primitives: which boundaries emit certificates, what they bind, and how external effects move from durable intention to confirmed outcome or recovery.

The shipped runtime contains useful but narrower recovery mechanisms. `runtime/lib/deep-loop/executor-audit.ts` writes atomic intent/completion dispatch receipts, but its MAC proves same-process integrity only because the run secret is not persisted across restart; `runtime/lib/deep-loop/receipt-crypto.ts` supplies canonical HMAC primitives without a durable cross-process trust root. `runtime/scripts/fanout-run.cjs` persists pre-dispatch waits and resumes them, `runtime/scripts/fanout-salvage.cjs` reconstructs missing iteration artifacts from captured stdout, `runtime/lib/deep-loop/jsonl-repair.ts` repairs or merges legacy JSONL under a lock, and `runtime/lib/deep-loop/atomic-state.ts` provides fsync-plus-rename writes. These are shipped contracts to preserve and adapt, not evidence that arbitrary subprocess, file, or API effects are already exactly-once (`.opencode/skills/system-deep-loop/runtime/`).

This phase plans two composed services. Boundary receipts are certified ledger events emitted only after an authorized phase or mode boundary and its result are durable; they bind the transition, result, evidence, replay identity, and resulting head. The effect-recovery gateway is the only planned entry point for recoverable external effects: it durably records a canonical intent before execution, confirms an observed result afterward, and reconciles any intent without confirmation on resume. Exact replay is allowed only when the adapter can prove the effect was not applied or the target honors the same idempotency key. An ambiguous external outcome fails closed for operator reconciliation rather than guessing and double-applying the effect.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A versioned `boundary_receipt` ledger event for registered phase and mode enter, pause, resume, completion, abort, and handoff boundaries; the registry decides which boundary/result pairs are certifiable.
- A receipt payload binding receipt and boundary IDs, boundary kind, mode/phase identity, from/to state and ledger heads, result code and digest, artifact/evidence references, replay fingerprint, authority epoch, correlation/causation IDs, issuer, issuance time, idempotency key, and certification envelope.
- A durable certification profile with explicit scheme, key/provider identifier, verifier version, signed canonical digest, and signature/certificate bytes; same-process HMAC is labeled advisory and cannot satisfy cross-resume verification.
- Receipt issuance after the authorized boundary event and result are committed, with exact-repeat deduplication and same-key/different-facts conflict rejection.
- One effect gateway and adapter contract for subprocess dispatch, atomic file publication, and idempotency-capable API calls, all using phase-006 envelope, authorization, ledger append, and replay-fingerprint inputs.
- The effect lifecycle: `intent_recorded` before execution, `confirmed` after durable outcome verification, and `recovery_started` / `reconciled` when a resume finds an unresolved intent.
- Deterministic idempotency keys derived from versioned effect scope, logical operation, stable target identity, canonical input digest, and run/logical-effect identity; attempt numbers and process IDs are excluded.
- Recovery classifications `not_applied`, `applied`, `in_doubt`, and `conflict`, with replay, confirmation synthesis, operator stop, or fail-closed handling respectively.
- Crash-injection and concurrent-retry fixtures spanning every ledger/effect cut point, plus adapters around the shipped receipt, wait-resume, salvage, atomic-write, and JSONL recovery behavior.

### Out of Scope
- The phase-006 envelope, ledger framing, append lock, hash chain, replay fingerprint, or transition policy; this phase consumes those contracts.
- Sealed reference artifacts and their disclosure/access policy, owned by successor `002-sealed-reference-artifacts`.
- Adjudication, budgets, gauges, locks/fencing, or continuity-identity services owned by other phase-007 siblings.
- Durable fan-out/fan-in orchestration, result envelopes, waves, leases, and partial-failure policy owned by program phase 009.
- Per-mode wiring, shadow parity, authority cutover, or legacy-writer retirement owned by phases 008, 013, 014, and 015.
- Claiming exactly-once execution for a target that exposes neither a durable idempotency key nor a trustworthy read-after-write reconciliation surface.
- Replaying non-reconcilable external effects after an uncertain crash, inventing confirmations from process exit alone, or treating a same-process MAC as a restart-verifiable signature.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Registered phase and mode boundaries emit one certified receipt after durable completion | Every successful registered boundary has exactly one receipt event linked to the authorized boundary/result event and resulting ledger head; no receipt precedes its result |
| REQ-002 | Receipt facts are canonical, complete, and tamper-evident | The receipt binds boundary identity and kind, mode/phase, from/to state heads, result/evidence digests, replay fingerprint, authority epoch, correlation/causation, issuer, time, idempotency key, and certification metadata; mutation breaks verification |
| REQ-003 | Receipt certification is honest across process boundaries | The verifier dispatches by explicit certification scheme and key/provider ID; same-process HMAC receipts are advisory only, while a cross-resume acceptance requires a durable verifier and registered trust policy |
| REQ-004 | Receipt issuance is idempotent and conflict detecting | Reissuing the same boundary ID, key, and canonical facts returns the original receipt; the same key with different facts, result, head, or signer metadata fails closed |
| REQ-005 | Every recoverable external effect records intent before execution | No adapter invokes a subprocess, publishes a file, or sends an API mutation until an authorized `effect.intent_recorded` event containing the canonical request digest and recovery contract is durable |
| REQ-006 | Effect idempotency keys are stable across crash and resume | The key is derived from a versioned namespace, run/logical-effect ID, operation, stable target identity, and canonical input digest; retry uses the identical key and changed inputs conflict |
| REQ-007 | Confirmation proves an observed durable outcome | `effect.confirmed` binds the intent event, idempotency key, adapter, external receipt or postcondition, output digest, completion class, and observed time; dispatch return alone is insufficient where the target can still be uncertain |
| REQ-008 | Resume reconciles unresolved intents before replay | Recovery enumerates intents lacking a valid confirmation, acquires the applicable effect claim/fence, queries the adapter, and records `not_applied`, `applied`, `in_doubt`, or `conflict` before any retry decision |
| REQ-009 | Recovery never double-applies an ambiguous effect | `not_applied` may execute once with the same key; `applied` emits a reconciled confirmation from target evidence; `in_doubt` stops for operator action; `conflict` fails closed and emits no new effect |
| REQ-010 | Adapter semantics are explicit per effect class | Subprocess adapters bind a logical invocation and verifiable artifacts/status, file adapters use content digest plus staging/atomic publication, and API adapters require provider idempotency plus status/read-after-write evidence or declare themselves non-replayable |
| REQ-011 | Receipt and effect records compose with phase-006 authorization and replay | Every record uses the canonical envelope, passes the authorization gateway where it can advance state, appends through the typed ledger, and contributes its registered fields to the replay fingerprint |
| REQ-012 | The implementation remains additive-dark and preserves shipped recovery | Production legacy writers and external-effect authority remain unchanged; hermetic fixtures exercise the new gateway, and shipped dispatch receipts, wait checkpoints, salvage, atomic writes, and JSONL recovery retain their behavior until later migration phases |
| REQ-013 | Sensitive effect material is not persisted in ledger evidence | Intent and confirmation events store canonical digests, bounded target identifiers, safe result metadata, and secret references; credentials, raw tokens, and unrestricted subprocess/API payloads are excluded |
| REQ-014 | Recovery is observable and bounded | Each recovery attempt records reason, adapter verdict, prior intent/head, claimant/fence reference, retry decision, and terminal/manual status; retry limits cannot silently convert uncertainty into success |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every registered phase/mode boundary produces one restart-verifiable receipt bound to the exact durable result and ledger head.
- **SC-002**: Every external effect has an earlier durable intent and a later confirmation or explicit unresolved/recovery verdict; no confirmed effect lacks intent.
- **SC-003**: Repeated execution with the same idempotency key and canonical request performs at most one externally observable mutation for every replay-safe adapter.
- **SC-004**: Crash injection before intent, after intent, during execution, after target application, and after confirmation yields deterministic recovery with no unsafe replay.
- **SC-005**: Tampered receipts, changed payloads under a reused key, stale heads/epochs, unknown certification schemes, and ambiguous target outcomes fail closed.
- **SC-006**: Dark integration preserves authoritative legacy outputs and effects while adapter fixtures cover subprocess, file, and API recovery semantics.

**Given** an authorized phase or mode boundary whose result and resulting head are durable, **When** receipt issuance retries after a crash, **Then** the ledger returns the same certified receipt and appends no duplicate.

**Given** an effect intent is durable but the adapter was never invoked, **When** recovery classifies the target as `not_applied`, **Then** the gateway executes once with the original idempotency key and records one confirmation.

**Given** an external target applied the effect before the process crashed, **When** recovery observes the target-side idempotency record or postcondition, **Then** it records reconciliation and confirmation without invoking the effect again.

**Given** the external target cannot prove whether an effect applied, **When** recovery returns `in_doubt`, **Then** the gateway stops automatic replay, records the unresolved state, and requires operator resolution.

**Given** the same idempotency key is presented with different canonical inputs or target identity, **When** intent or confirmation is requested, **Then** the gateway reports a conflict and performs no external mutation.

**Given** a shipped same-process dispatch receipt is read after restart, **When** certification is evaluated, **Then** it remains usable as legacy evidence but cannot satisfy the durable cross-resume receipt-verification policy.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

The largest correctness risk is promising exactly-once behavior where the external system cannot support it. A durable local intent cannot reveal whether an opaque remote request committed immediately before a crash. The gateway therefore offers replay-safe, effectively-once behavior only for adapters with target-side idempotency or a conclusive reconciliation query; every other uncertain outcome becomes `in_doubt` and blocks automatic replay. File publication is replay-safe only when stable target identity, expected prior state, content digest, staging, and atomic replacement semantics are all available. Subprocess recovery likewise needs a logical invocation identity and durable postcondition, not a PID alone.

Certification can also be overstated. The existing dispatch receipt MAC is intentionally process-local; persisting or weakening its secret boundary would create a false trust claim. The planned receipt envelope separates canonical facts from certification and requires a registered durable verifier for cross-resume acceptance. Secret material remains outside the ledger, while verifier/key identifiers and certificate bytes remain audit-visible.

This child declares `depends_on: []` because its sibling planning contracts are independent. Program sequencing still places the phase-007 parent after phase 006, so implementation consumes the versioned envelope, typed ledger, replay fingerprint, and transition-authorization gateway described in `manifest/phase-tree.json`. Later phase-009 orchestration and phase-013 mode work consume this service; phase 014 alone may make migrated paths authoritative. Until then, external-effect tests use hermetic targets or cassettes and never shadow-execute a real irreversible mutation.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking for planning. Implementation may choose module names, registered durable certification providers, and adapter-specific status-query APIs after the phase-006 interfaces materialize. It may not weaken canonical receipt binding, cross-resume verifier honesty, intent-before-effect ordering, stable idempotency keys, conflict detection, conclusive reconciliation, `in_doubt` fail-closed behavior, secret exclusion, or the additive-dark authority boundary.
<!-- /ANCHOR:questions -->
