---
title: "Ratified Transition, Versioning & Rollback Policy"
description: "Normative event-envelope, compatibility, authorization, per-mode authority, rollback, and downstream conformance contract for program phases 006 through 015."
trigger_phrases:
  - "ratified transition versioning rollback policy"
  - "canonical typed event envelope"
  - "per-mode authority rollback contract"
importance_tier: "critical"
contextType: "governance"
---
# Ratified Transition, Versioning & Rollback Policy

| Field | Ratified value |
|-------|------------------|
| **Status** | Frozen and binding |
| **Ratified** | 2026-07-20 |
| **First runtime consumer** | Program phase 006 |
| **Bound consumers** | Program phases 006 through 015 |
| **Runtime code in this leaf** | None |

This policy is the single governing contract for every typed-event writer, reader, adapter, projection, authority switch and retirement gate in phases 006 through 015. A downstream phase may add a stricter rule. It MUST NOT weaken, bypass or locally redefine any rule below.

`MUST`, `MUST NOT`, `REQUIRED`, `SHALL` and `SHALL NOT` are binding. A missing case, missing input, unknown value, stale value, broken dependency or unavailable policy service always fails closed.

## 1. Controlling Source Trace

| Source | Controlling statement | Policy gate fixed here |
|--------|-----------------------|------------------------|
| Parent Sequencing Invariant 2 | Freeze transition authority and event compatibility before a typed writer exists. Co-land the authorization gateway with the first writer in phase 006. | This policy is frozen before phase 006. Phase 006 cannot append a typed event outside the gateway. |
| Parent Sequencing Invariant 3 | Keep the new substrate additive, dark and non-authoritative until compatibility adapters, shadow parity and rollback pass in phase 008. | Legacy remains authoritative through `cutover_ready`. Shadow output cannot drive domain effects. |
| Parent Sequencing Invariant 7 | Per-mode gates prove shadow parity. Authority changes only in phase 014. | Only phase 014 may execute `cutover_ready -> new_authoritative_reversible`. |
| Parent Sequencing Invariant 8 | Retire legacy live writers only after state classification, rollback rehearsal, mixed-version replay and cutover certificates. | Phase 015 cannot retire a writer until the mode reaches `new_authoritative_final` and the retirement evidence is complete. |
| Parent Success Criteria 3, 4, 5 and 6 | Hold additive-dark discipline, prove per-mode cutover and rollback, retire legacy safely and gate every typed event. | The authority state machine, rollback closure and gateway rules below are blocking. |
| Manifest `migration_model` | `additive-dark substrate -> compatibility adapters + shadow parity -> staged per-mode authority cutover behind rollback window -> gated legacy retirement` | The legal sequence is phases 006, 008, 014 and 015. No phase may collapse or reorder it. |
| Manifest phase 003 outcome | Pin the baseline, event/state census, replay fixtures and rollback anchors. | Phase 003 supplies evidence inputs. It does not own or redefine this policy. |
| Manifest phase 005 outcome | Change dispatch only and make no canonical-persistence change. | Phase 005 remains outside the typed-event conformance matrix. |
| Manifest phase 011 outcome | Consume fan-in and novelty inputs for termination and health. | Phase 011 consumes registered events and deterministic replay. It does not define a local compatibility policy. |

## 2. Frozen Vocabulary

| Term | Frozen meaning |
|------|----------------|
| **Stored version** | The positive integer `event_version` present in immutable persisted bytes. |
| **Effective version** | The current registered in-memory version produced by a complete upcaster chain. It never replaces stored bytes. |
| **Policy version** | The immutable version of the transition-authorization rules evaluated for one request. |
| **Authority epoch** | The monotonic compare-and-swap generation for one mode's authority record. |
| **Authorization decision** | The append-only allow or deny result for one exact request digest, policy version and authority epoch. |
| **Rejection receipt** | Bounded non-domain audit evidence for a denied request. It is never a domain event or an authorization token. |
| **Cutover certificate** | Evidence that authorizes one named mode and candidate SHA to cross from `cutover_ready` to `new_authoritative_reversible`. |
| **Rollback anchor** | The retained legacy state, code, configuration, adapters and reconciliation position needed to restore legacy authority without deleting events. |
| **Rollback certificate** | Evidence of a completed rollback, including fencing, reconciliation and legacy restoration at a new epoch. |
| **Successful authoritative run** | A completed run under new authority whose transition decisions, event replay, receipts, budgets and state reconciliation have no unresolved failure. |

Envelope field meanings are immutable under this policy. A meaning change requires an explicit envelope-contract revision and compatibility review. It cannot silently reuse an existing field or event version.

## 3. Canonical Event Envelope

Every persisted domain event MUST contain every field in this table. Validation happens before authorization and append. Missing, malformed, unknown or unregistered values reject the request.

| Field | Required contract |
|-------|-------------------|
| `event_id` | Immutable globally unique event identity. A retry for the same authorized append reuses the recorded result and MUST NOT create a second event. |
| `event_type` | Stable namespaced discriminator, formatted as `<domain>.<aggregate>.<event>`. A registered name is never reused for another meaning. |
| `event_version` | Positive integer versioned independently for its `event_type`. Version sequences start at 1 and advance by one. |
| `stream_id` | Immutable identity of the logical domain stream that owns the event. |
| `stream_sequence` | Positive, gap-free ordering position within `stream_id`, assigned atomically at append. |
| `occurred_at` | RFC 3339 UTC timestamp supplied by the authorized transition and bound into the request digest. |
| `recorded_at` | RFC 3339 UTC append timestamp assigned by the ledger. It cannot be supplied as authority evidence by the caller. |
| `producer` | Stable producer descriptor containing the component identity and candidate build or commit identity. |
| `authority_epoch` | The exact per-mode authority epoch accepted by the gateway for this append. |
| `correlation_id` | Non-empty identity shared by the complete logical operation. A boundary creates one before authorization when the caller starts a root operation. |
| `causation_id` | Identity of the direct cause. The field is present and may be null only for a declared root event. |
| `idempotency_key` | Non-empty caller key scoped to mode, authority epoch and stream. It is bound to one request digest. |
| `payload` | Value conforming to the immutable registered schema for this exact `event_type@event_version`. |

### 3.1 Type and version registry

For every `event_type`, the registry MUST record the stable name, current writer version, immutable schema for every retained version, supported stored-version range and every adjacent upcaster needed to reach the current in-memory shape. Registry entries are append-only while any persisted event can reference them.

A writer MUST emit only the registry's current version for its event type. A writer MUST NOT emit a historical version for convenience, use a global version shared across types, skip an integer or reuse a version after changing semantics.

A registry change is valid only when its schema digest, upcaster digest and supported-version range are frozen together. Phase 006 owns the registry implementation. This policy owns its semantics.

### 3.2 Append invariants

The append boundary MUST validate the envelope, obtain an allow decision for the exact request and commit the decision plus event append atomically. The stored serialization is immutable after append. `event_id`, `event_type`, `event_version`, `stream_id`, `stream_sequence`, both timestamps, `producer`, `authority_epoch`, correlation, causation and idempotency values MUST survive replay unchanged.

A failed envelope check, authorization denial, sequence conflict, idempotency conflict or append failure creates no domain event and advances no stream sequence.

## 4. Compatibility and Upcasting

Compatibility is asymmetric. Current writers know one output shape. Current readers may know several stored shapes. Old readers never infer a newer shape.

| Case | Required behavior |
|------|-------------------|
| Current writer | Emit only the latest registered version for the event type. |
| Current reader, current stored version | Validate the registered schema and use the current shape without transformation. |
| Current reader, supported old stored version | Apply every registered adjacent upcaster until the current effective version is reached. |
| Old reader, newer stored version | Refuse the event or route the whole read to a reader that explicitly supports it. Never guess, drop fields or partially decode it. |
| Unknown event type or unregistered version | Fail closed before projection, domain mutation or side effect. |
| Mixed-version stream | Resolve every historical event through a complete registered chain. If one event cannot resolve, abort the complete replay and publish no partial projection. |

### 4.1 Upcaster contract

Every upcaster MUST satisfy all of these rules:

- It transforms exactly `event_type@N` to the same `event_type@N+1`.
- It is pure, deterministic and side-effect-free. The same validated source bytes and registry produce byte-identical effective output.
- It performs no I/O, clock read, randomness, environment lookup, network call, persistence, event emission, logging side effect or authorization decision.
- It is total over its declared valid input schema. Malformed input is rejected before the transform runs.
- It preserves the original serialized envelope and payload bytes for audit. It returns a derived in-memory value and never rewrites persisted history.
- It preserves every immutable envelope field. Only the effective payload shape and effective version advance.
- It MUST reject an unknown type, unsupported future version, missing adjacent link, lossy conversion, ambiguous default, unregistered field interpretation or output that fails the next schema.

No direct `N -> N+2` transform may substitute for a missing link. A complete chain is registered and verified one version at a time. Replay evidence MUST expose stored version, effective version, source-byte digest, registry digest, chain identities and final effective digest.

### 4.2 Fail-closed replay

Replay is transactional at its declared consumer boundary. A chain gap, transform failure, source corruption, unknown future version or nondeterministic fingerprint aborts the replay. The consumer MUST NOT skip the event, use a partial state, advance a checkpoint, publish a projection or trigger an effect.

## 5. Mandatory Transition Authorization

Every domain append MUST pass the single transition-authorization gateway. This is deny-by-default with no opt-out. Internal callers, migrations, repair tools, shadow writers, retries and administrative paths receive no bypass. A configuration flag, gateway outage, timeout, exception or missing policy cannot turn denial into allowance.

The gateway returns allow only when every required input is present, registered, current and valid for the exact request digest. Missing input, stale state, stale authority epoch, unknown policy or rule, unsupported type or version, evidence mismatch, idempotency conflict and gateway failure MUST return deny.

### 5.1 Authorization request

The canonical request binds:

- request identity and digest
- mode, stream identity, expected stream sequence and prior state or version digest
- requested `event_type`, `event_version`, payload digest and complete immutable envelope inputs
- actor identity and exact capability
- policy version and invariant-evidence digest
- authority state and expected authority epoch
- correlation, causation and idempotency identity

The digest uses canonical serialization. Any change produces a different request. An idempotency key reused with the same digest returns the recorded result. The same key with a different digest denies as `idempotency_conflict`.

### 5.2 Complete decision record

Every allow and deny decision MUST append one immutable record to the non-domain decision log with these fields:

| Field | Requirement |
|-------|-------------|
| `decision_id` | Globally unique immutable identity. |
| `decision` | Exactly `allow` or `deny`. No unknown or advisory state exists. |
| `reason_code` | Registered machine-readable reason, including explicit success. |
| `policy_version` | Exact immutable policy version evaluated. |
| `mode` | One registered workflow mode. |
| `stream_id` | Exact requested domain stream. |
| `prior_state_digest` | Canonical digest of the state evaluated by the policy. |
| `prior_stream_sequence` | Expected stream order before append. |
| `prior_state_version` | Registered state or reducer version used by the decision. |
| `requested_event_type` | Requested stable namespaced type. |
| `requested_event_version` | Requested registered positive integer version. |
| `actor_id` | Stable actor identity. |
| `capability_id` | Exact capability presented and evaluated. |
| `authority_state` | Per-mode authority state observed by the gateway. |
| `authority_epoch` | Exact compare-and-swap epoch observed by the gateway. |
| `request_digest` | Canonical digest of every bound request input. |
| `evidence_digest` | Canonical digest of invariant evidence used by the decision. |
| `decided_at` | RFC 3339 UTC decision timestamp assigned by the gateway. |

An allow record is valid only for its exact request digest, policy version, prior state and authority epoch. The append MUST recheck state, sequence and epoch at the atomic commit boundary. A stale recheck converts the operation to denial and no event is appended.

### 5.3 Rejection receipt

Every denial MUST produce one immutable bounded rejection receipt in the non-domain decision store. The receipt contains `receipt_id`, `decision_id`, `reason_code`, `mode`, `stream_id`, requested type and version, authority epoch, request digest, evidence digest, idempotency-key digest and denial timestamp.

A rejection receipt MUST NOT contain payload bytes, secrets, capability material or raw invariant evidence. It MUST NOT advance the domain stream, update a projection, consume a success idempotency result, trigger a receipt-governed effect or be replayed as an event or authorization token.

## 6. Per-Mode Authority State Machine

Each mode owns one authority record. Authority never moves in a cross-mode batch. Every state transition uses compare-and-swap against the exact current state and epoch, then commits the next state with `authority_epoch = prior_epoch + 1`.

| State | Authority and required posture |
|-------|--------------------------------|
| `legacy_authoritative` | Legacy is the sole authoritative writer. The new substrate may be absent or dark. |
| `shadowing` | Legacy remains the sole authoritative writer. The new substrate may record dark output, but shadow output cannot authorize effects or domain projections. |
| `cutover_ready` | Legacy remains the sole authoritative writer. All readiness evidence is complete and bound to the candidate, but no authority has moved. |
| `new_authoritative_reversible` | The new writer is solely authoritative. Legacy is fenced and retained. The rollback window is open. |
| `rollback_pending` | The recorded pre-rollback authority owner remains named, admissions are frozen and both writer paths are fenced while reconciliation runs. |
| `new_authoritative_final` | The new writer is solely authoritative after rollback-window closure. Legacy retirement still waits for phase 015 evidence. |

### 6.1 Legal edges

| From | To | Blocking precondition and evidence |
|------|----|------------------------------------|
| `legacy_authoritative` | `shadowing` | Phase-006 gateway and dark append path are installed. Entry is a successful state-and-epoch CAS. |
| `shadowing` | `cutover_ready` | Candidate SHA, version range, state classification, mixed replay, live shadow evidence, zero unresolved divergence, mode gate and rollback rehearsal are complete. |
| `cutover_ready` | `new_authoritative_reversible` | Phase 014 presents the complete cutover certificate and wins the expected-state and expected-epoch CAS. This edge opens the rollback window. |
| `new_authoritative_reversible` | `new_authoritative_final` | Both rollback minimums are complete, every extension condition is clear and a window-closure certificate wins the CAS. |
| `shadowing` | `rollback_pending` | Abort or safety trigger. Admission freezes and both paths are fenced at a new epoch. |
| `cutover_ready` | `rollback_pending` | Readiness invalidation or safety trigger. Admission freezes and both paths are fenced at a new epoch. |
| `new_authoritative_reversible` | `rollback_pending` | A rollback trigger or operator rollback decision fires while the window is open. Admission freezes and both paths are fenced at a new epoch. |
| `rollback_pending` | `legacy_authoritative` | Reconciliation is complete, the rollback certificate is durable and legacy restoration wins another CAS at a new epoch. |

Every other edge is illegal. No edge may skip `shadowing`, `cutover_ready` or `new_authoritative_reversible`. `new_authoritative_final` has no rollback edge under this policy. A later reversal requires a new governed migration contract.

Every gateway decision and writer lease MUST bind the observed authority epoch. A cutover, rollback entry or legacy restoration invalidates all earlier writer authority. A stale writer always receives denial.

### 6.2 Cutover certificate

A cutover certificate is valid for one mode only. It MUST bind the certificate identity, mode, exact candidate SHA, policy version, envelope and registry digests, supported stored-version range, upcaster-chain registry digest, complete in-flight-state classification digest, mixed-version replay evidence, live shadow interval, zero unresolved divergence result, independent mode-gate result, successful rollback-rehearsal certificate, source authority state and epoch, target epoch, issuer and issue time.

If any bound evidence changes, expires or becomes unresolved before the CAS, the certificate is invalid and legacy remains authoritative.

## 7. Rollback Window and Execution

The rollback window opens when the `cutover_ready -> new_authoritative_reversible` CAS commits. It remains open until the later of:

1. Fourteen complete calendar days after the recorded cutover time.
2. Five successful authoritative runs under the new writer for that mode.

Both conditions are mandatory. Fourteen elapsed days with four successful runs is still open. Five successful runs within thirteen days is still open. Traffic volume, release pressure or operator preference cannot shorten either minimum.

### 7.1 Extension and trigger conditions

The window remains open, or rollback begins, while any of these conditions is unresolved:

- shadow or live parity divergence
- replay mismatch, upcaster-chain failure or source-byte mismatch
- authorization bypass, stale-writer acceptance or split-brain evidence
- missing, malformed or mismatched decision and rejection receipts
- effect-receipt, budget or fencing breach
- incomplete in-flight-state classification or state reconciliation
- anomaly that invalidates the cutover certificate or successful-run evidence

Closure evaluation is fail-closed. Missing telemetry, missing evidence, an unavailable evaluator or an unknown result keeps the window open.

### 7.2 Assets retained through the window

The mode MUST retain a runnable legacy writer and configuration, legacy reader, dual-read adapter, complete upcaster registry, rollback switch, rollback anchor, in-flight-state classification, mixed-version fixtures, authority records, cutover and rehearsal certificates, decision and rejection logs, reconciliation tooling and the telemetry needed to prove closure.

No retained event, decision, receipt, state snapshot or certificate may be deleted or rewritten during rollback.

### 7.3 Rollback procedure

Rollback executes in this order:

1. Freeze new admissions for the affected mode.
2. Win the CAS into `rollback_pending`, advance the authority epoch and fence the new writer plus every stale lease.
3. Stop effects and checkpoint consumers at declared safe boundaries.
4. Classify and reconcile in-flight work using the frozen upcast, pin-legacy, fork, migrate or block policy.
5. Verify all persisted events remain intact and replayable. Never delete or rewrite them to imitate legacy history.
6. Restore legacy authority through `rollback_pending -> legacy_authoritative` at another new epoch.
7. Resume admissions only after the gateway, writer lease and projection consumers observe that new legacy epoch.
8. Emit an immutable rollback certificate and keep the failed cutover evidence for audit.

The rollback certificate MUST bind the mode, trigger, cutover certificate, pre-rollback state and epoch, both rollback CAS results, fenced writer identities, admission-freeze interval, reconciliation policy and result, preserved-event range and digest, restored legacy candidate, post-rollback replay result, residual blocked work, issuer and completion time.

### 7.4 Window closure

A mode may enter `new_authoritative_final` only when both minimums are complete, every trigger and extension condition is clear, retained assets are verified and the closure certificate wins the expected-state and expected-epoch CAS. Finalization does not authorize legacy deletion. Phase 015 applies the separate zero-use and archival-read gate.

## 8. Downstream Conformance Ownership

Each program phase MUST trace its listed artifacts and evidence back to this policy. No row grants policy-definition authority.

| Program phase | Binding implementation or evidence obligation | Blocking conformance evidence |
|---------------|-----------------------------------------------|-------------------------------|
| 006 | Implement the canonical envelope, per-type registry, append boundary, replay fingerprint inputs, deny-by-default gateway, complete decision log and rejection receipts together. Keep the substrate dark and legacy-authoritative. | Envelope and registry fixtures, gateway failure matrix, atomic append proof, stale-epoch proof and dark-mode evidence. |
| 007 | Bind effect receipts, recovery, budgets, gauges, locks, fencing and continuity identities to authorized event identity plus authority epoch. No shared service may bypass the gateway. | Receipt, budget, lock and continuity fixtures that reject unauthorized or stale-epoch work. |
| 008 | Implement adjacent upcasters, dual-read and single-write adapters, mixed-version replay, in-flight-state classification, shadow parity and rollback rehearsals. Move no authority. | Complete-chain and gap fixtures, source-byte proof, parity evidence, state classifications and rehearsal certificate. |
| 009 | Emit only registered current event versions for durable orchestration and consume stored history only through the shared reader. Preserve correlation, causation, idempotency and authority identity through dispatch and fan-in. | Orchestration replay fingerprints, current-version writer fixtures and stale-authority rejection evidence. |
| 010 | Emit registered current versions for novelty, claims and continuity. Build projections transactionally from deterministic effective events without local compatibility rules. | Mixed-version projection fixtures, deterministic gauge fingerprints and no-partial-projection failure evidence. |
| 011 | Consume registered effective events for convergence, termination and health. Keep any uncalibrated authority-affecting result shadow-only until the mode gate and phase 014 cutover. | Deterministic replay and shadow-only enforcement evidence. |
| 012 | Freeze shared and per-mode schemas, mixed-version fixtures, mode gates, adapters, rollback switches and write ownership against this policy. | Registry/schema digests, executable fixtures, dependency graph and write-set conflict proof. |
| 013 | Make each mode writer, reducer, resume adapter, certificate, shadow path and rollback switch conform before its independent mode gate. Do not move authority. | Per-mode current-version fixtures, parity result, rollback switch proof and independent gate certificate. |
| 014 | Classify and migrate eligible state, execute one mode's legal CAS edges at a time, issue cutover, rollback and closure certificates and enforce the full rollback window. | Per-mode authority history, certificates, five-run evidence, elapsed-day evidence and any rollback execution record. |
| 015 | Retire legacy live writers only after every affected mode is final, zero-use telemetry is complete, rollback evidence remains valid and retained archival readers replay historical packets. | Retirement certificate, zero-use interval, archival-read suite and retained-reader inventory. |

A phase fails conformance if it creates a local envelope, emits an old writer version, guesses a future version, bypasses authorization, creates a permissive failure mode, moves more than one mode's authority, changes authority outside phase 014, shortens the rollback window or retires legacy before phase 015 gates pass.

## 9. Challenge Matrix

| Scenario | Required outcome |
|----------|------------------|
| Supported historical event | Complete adjacent chain reaches the current effective shape. Stored bytes and immutable envelope fields remain unchanged. |
| Unknown type or future version | Reader refuses or routes the complete read to a compatible reader. No guessing or partial projection. |
| Missing, lossy or ambiguous upcaster | Complete replay aborts. No checkpoint, projection, domain mutation or effect advances. |
| Missing authorization input or unknown policy | Gateway denies and emits a bounded rejection receipt. No domain state changes. |
| Stale state, sequence or authority epoch | Commit-time recheck denies, creates no event and advances no sequence. |
| Duplicate idempotency key and same digest | Return the recorded decision and append result without a second event. |
| Duplicate idempotency key and different digest | Deny as `idempotency_conflict` and emit a rejection receipt. |
| Gateway timeout, exception or outage | Deny. No fallback writer or deferred unauthorized append exists. |
| Two writers present or multi-mode cutover requested | Gateway and CAS reject the request. Existing authority remains unchanged. |
| Unresolved shadow divergence | Mode cannot enter `cutover_ready` or cut over. Legacy remains authoritative. |
| Fourteen days elapsed with fewer than five successful runs | Rollback window stays open. |
| Five successful runs before fourteen days | Rollback window stays open. |
| Mid-window safety trigger | Enter `rollback_pending`, freeze admission, fence writers, reconcile, restore legacy at a new epoch, preserve events and issue a rollback certificate. |
| Missing closure telemetry | Window stays open. |
| Retirement request before final state or archival-read proof | Phase 015 rejects retirement. |

## 10. Amendment and Ratification Boundary

This policy is frozen before phase 006 writes a typed event. A later phase may add stricter validation or retain more compatibility and rollback evidence. It MUST NOT make denial optional, change the envelope field meanings, loosen upcaster purity, allow future-version guessing, skip an authority state, batch mode cutovers, reduce either rollback minimum or retire an archival reader required by historical packets.

Any amendment MUST identify the changed clause and enumerate every affected writer, reader, adapter, schema, fixture, projection, mode gate, cutover certificate, rollback anchor, rollback certificate and retirement gate. The amendment reopens each stale conformance gate and reruns mixed-version replay, authorization, cutover and rollback evidence before a consumer can adopt it.
