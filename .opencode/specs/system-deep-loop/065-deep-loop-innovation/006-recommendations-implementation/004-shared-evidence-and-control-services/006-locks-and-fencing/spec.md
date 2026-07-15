---
title: "Feature Specification: Locks & Fencing"
description: "Plan the shared concurrency-safety service for ledger append, projections, and per-lineage state: scoped leases allocate durable monotonic fencing tokens, every protected mutation rejects stale holders, and bounded timeout/deadlock policy prevents split-brain across legacy, dark, fan-out, and resumed writers."
trigger_phrases:
  - "locks and fencing"
  - "deep-loop fencing tokens"
  - "safe concurrent writers and resume"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/006-recommendations-implementation/004-shared-evidence-and-control-services"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/006-recommendations-implementation/004-shared-evidence-and-control-services/006-locks-and-fencing"
    last_updated_at: "2026-07-15T14:01:58Z"
    last_updated_by: "codex"
    recent_action: "Defined lock scope, lease lifecycle, fencing, and timeout policy"
    next_safe_action: "Implement the fenced coordinator and guarded mutation adapters"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: Locks & Fencing

> Phase adjacency under `004-shared-evidence-and-control-services` (navigation order, not a hard runtime dependency): predecessor `005-stream-fold-gauges`; successor `007-continuity-identities`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/065-deep-loop-innovation/006-recommendations-implementation/004-shared-evidence-and-control-services/006-locks-and-fencing |
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Planned |
| **Created** | 2026-07-15 |
| **Owner skill** | system-deep-loop |
| **Origin** | Sixth child of the phase-004 shared evidence-and-control-services parent |
| **Depends on** | None (`[]`); sibling planning contracts compose at the phase-004 parent gate |
| **Authority posture** | Additive-dark; legacy state remains authoritative until the phase-011 cutover |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The shipped runtime has several local mutual-exclusion mechanisms, but no shared fencing contract. `runtime/lib/deep-loop/loop-lock.ts` persists PID, heartbeat, TTL, packet, runtime kind, and an acquisition nonce; it can reclaim a dead or heartbeat-expired holder and optionally adds host-local single flight. `runtime/scripts/lib/cli-guards.cjs` uses `wx` acquisition, PID/time/nonce stamping, bounded retry, and stale-lock reclamation for graph and repair writers. Those nonces prevent a displaced holder from deleting or refreshing a successor's lock, but neither lock family issues a durable monotonic epoch that the protected store validates when the write commits. A live process reclaimed after expiry can therefore still be dangerous if it resumes past its last ownership check.

Other shipped surfaces expose the same gap at narrower scopes. `runtime/lib/council/round-state-jsonl.cjs` takes a bare `wx` lock around repair-and-append and releases it without a nonce or lease; `runtime/lib/deep-loop/jsonl-repair.ts` merges under the CLI writer lock; `runtime/scripts/fanout-pool.cjs` appends orchestration status without a lock; and `runtime/scripts/fanout-run.cjs` atomically replaces a persisted wait checkpoint, then emits `resume_waiting` and continues dispatch without a durable resume-owner epoch. The in-memory one-shot resolver in `runtime/lib/deep-loop/lifecycle-taxonomy.cjs` prevents one stale signal inside one process, while `runtime/scripts/reduce-state.cjs` derives `PAUSED`/`RECOVERING` from events; neither prevents two processes from resuming the same lineage.

The phase-003 typed-ledger contract requires an exclusive append, expected-head comparison, immutable history, and dark coexistence with legacy JSONL (`003-transition-authorized-ledger-core/002-typed-append-only-ledger/spec.md`). This phase supplies the concurrency-safety layer beneath that contract and the later projections: a resource-scoped lease allocates a never-reused fencing token, and the ledger/projection/lineage mutation validates that token atomically with the write. Mutual exclusion is a liveness aid; the fence is the safety boundary. During shadow operation, legacy and dark emissions enter through one guarded mutation boundary so a legacy-only process, dark writer, fan-out worker, or stale resume cannot create a second valid write epoch. The additive-dark and staged-cutover constraints come from the program `spec.md` and `manifest/phase-tree.json`.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A canonical protected-resource registry for ledger append heads, named projections, and per-run/per-lineage mutable state; resource keys include packet/run/lineage identity and reject aliases that would lock the same state under two names.
- A durable per-resource fencing counter. Every successful grant atomically advances the counter; release, expiry, crash, rollback, and cleanup never decrement or reuse a token.
- Lease acquisition, renewal, release, expiry, takeover, and ownership metadata: resource key, token, lease ID/nonce, owner identity, acquired/renewed/expiry times, and declared atomicity domain.
- Mutation-side enforcement: ledger append, projection replace/CAS, checkpoint or pause/resume transition, and lineage-state mutation validate the current fencing token atomically with the protected write.
- A shared shadow-period boundary that serializes the authoritative legacy emission and dark-ledger observation under one write epoch without making the dark result authoritative.
- Fenced fan-out ownership: distinct lineages may proceed concurrently; workers targeting the same lineage, status stream, wait checkpoint, or merge target must use the same canonical resource key.
- Resume takeover: a new process receives a higher token, and any stale process that later wakes is rejected before append, projection update, checkpoint clear, dispatch, salvage merge, or pause/resume transition.
- Deadlock and timeout policy: one canonical lock order, no unbounded waits, bounded acquisition/renewal, typed timeout/lease-lost errors, jittered retry where safe, and no force-unlock path that bypasses token advancement.
- Compatibility adapters for the shipped loop lock, CLI writer lock, council round-state lock, JSONL repair merge, fan-out status/checkpoint paths, and pause/recovery lifecycle events until their protected writes use the shared contract directly.
- Deterministic concurrency, crash, expiry, clock-skew, malformed-lock, and stale-resume tests with observable acquisition, renewal, rejection, takeover, timeout, and release events.

### Out of Scope
- Defining the event envelope, ledger frame, replay fingerprint, or transition vocabulary owned by phase 003.
- Implementing continuity-identity semantics owned by successor `007-continuity-identities`; this phase consumes an opaque canonical lineage/resource identity.
- Upcasters, shadow-parity policy, in-flight-state classification, rollback drills, or authority cutover owned by phases 005 and 011.
- Replacing the legacy path as authority, retiring legacy writers, or allowing a dark-path failure to change the legacy operational result.
- A general multi-host consensus system. A backend is valid only inside its declared atomicity domain; unsupported storage/topology combinations fail closed instead of claiming a distributed lock.
- Using wall-clock timestamps, PIDs, random nonces, file mtimes, or process-local mutexes as fencing tokens.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every protected mutation resolves one canonical resource key | A reviewed write-surface manifest maps ledger append, each projection, fan-out status/checkpoint/merge target, and per-lineage state to exactly one resource key; alias and traversal variants are rejected |
| REQ-002 | Lease grant allocates a durable monotonic fencing token | Concurrent acquisition yields one holder; every later grant for the same resource has a strictly greater token, including after release, expiry, crash, and registry restart |
| REQ-003 | Lease lifecycle is bounded and ownership-safe | Acquire/renew/release require resource key, lease ID/nonce, owner, and token; renew/release by a displaced holder cannot extend or delete the successor's lease |
| REQ-004 | Stale writers are rejected at the mutation boundary | After takeover, every write carrying the old token fails with a typed `STALE_FENCE`/lease-lost result even when the old PID remains alive or resumes after its pre-write check |
| REQ-005 | Fence validation and mutation are one atomic operation | No protected backend exposes a check-then-write gap; ledger sequence/head, projection version, and lineage/checkpoint state change only when the supplied token is current in the same commit boundary |
| REQ-006 | Legacy and dark shadow writes cannot form competing epochs | One guarded adapter orders both emissions under the same resource token; legacy remains authoritative, dark failure is observable, and no raw protected legacy/dark writer bypasses the adapter |
| REQ-007 | Fan-out and resume ownership are lineage-safe | Different canonical lineage keys run concurrently; duplicate workers or resumed processes for one key serialize, and a successor token rejects stale dispatch, status append, salvage merge, checkpoint clear, and state update |
| REQ-008 | Deadlock is prevented by construction and contention is bounded | The resource hierarchy and acquisition order are documented and enforced; nested/inverted acquisition fails before blocking, waits end in typed timeout, and retry never force-removes a live successor |
| REQ-009 | Recovery preserves safety and ledger immutability | Malformed coordinator state, token rollback, ambiguous heads, and unsupported atomicity domains fail closed; recovery may reclaim a lease but never reuse a token or truncate/rewrite committed ledger bytes |
| REQ-010 | Existing lock APIs migrate without weakening their proven ownership checks | Loop-lock heartbeats/nonces, CLI nonce-safe release, council append serialization, and lock-held JSONL merge are either adapted or retired only after equivalent fenced tests cover their callers |
| REQ-011 | Concurrency decisions are observable and replay-auditable | Acquisition, renewal, expiry, takeover, rejection, timeout, and release emit typed records containing resource-key digest, token, lease ID, owner, reason, and correlation identity without treating the token as a secret |
| REQ-012 | Clock and process identity affect liveness, never write authority | PID liveness and timestamps may trigger takeover eligibility, but only the current durable token authorizes a mutation; clock-skew and PID-reuse fixtures cannot admit a stale write |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The protected-resource manifest covers every shipped ledger, projection, fan-out, recovery, pause/resume, and lineage-state writer with no ambiguous or duplicate resource key.
- **SC-002**: Stress and fault-injection tests prove per-resource tokens are strictly monotonic and never reused across contention, release, expiry, crash, restart, or rollback.
- **SC-003**: A deliberately paused old holder resumes after a successor acquires; every old-token mutation is rejected and committed state contains only the successor epoch.
- **SC-004**: Ledger append validates fence plus expected head atomically, projections validate fence plus version atomically, and fan-out/resume paths cannot double-dispatch or double-clear one checkpoint.
- **SC-005**: The shadow-period adapter prevents competing legacy/dark writer epochs while preserving legacy authority and recording dark-path failures for later parity/cutover gates.
- **SC-006**: Deadlock, timeout, malformed-state, PID-reuse, clock-skew, and lease-loss tests terminate deterministically with typed errors and no committed corruption.
- **SC-007**: Shipped lock and recovery callers retain their current safe ownership behavior while gaining mutation-side fencing; no protected write remains reachable through an unfenced public path.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

This child has `depends_on: []` as an independent planning contract, but implementation consumes the phase-003 ledger's resource identity, append receipt, expected-head, and immutable-recovery boundaries. The highest risk is mistaking lease ownership for storage enforcement. An expired live holder may continue executing after another process acquires; safety exists only when the protected store compares the durable current token inside the same atomic commit as the mutation. Any backend that cannot provide that property must use a single fenced mutation broker or remain unsupported and fail closed.

The shadow period has a second structural risk: legacy writers currently use heterogeneous helpers, including unlocked `appendFileSync` status writes and replace-style checkpoints. Wrapping only the new dark writer would still permit a legacy-only process to race it. The implementation must inventory every protected entry point and route both paths through the same canonical resource guard before claiming split-brain prevention. Legacy remains authoritative, so a dark observation failure is recorded for parity but cannot rewrite or roll back the successful legacy result.

Deadlock and liveness policy must remain subordinate to safety. The preferred shape is one resource lease per mutation; operations that truly span resources acquire in the documented order and release in reverse, with bounded waits and no automatic force-unlock. Clock skew, long pauses, and slow I/O can cause premature expiry, but fencing makes those cases rejected stale work rather than corruption. Token counters require overflow detection and durable backup/restore discipline; restored state may advance the epoch, never restore an older current token.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking for planning. Implementation may choose a transactional coordinator, a fenced single-writer broker, or another backend after the phase-003 storage boundary is materialized, but the choice must prove atomic compare-current-fence-plus-mutation for every protected store. A file lease plus a pre-write token read is insufficient. The declared atomicity domain, token width/overflow behavior, canonical resource-key encoder, and compatibility-adapter removal point must be pinned in implementation evidence before any writer is migrated.
<!-- /ANCHOR:questions -->
