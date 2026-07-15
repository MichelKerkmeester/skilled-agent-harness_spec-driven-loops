---
title: "Feature Specification: Logical Branch IDs, Leases & Waves"
description: "Plan stable logical branch identities, fenced worker leases, and ordered wave scheduling over the existing capped pool, with canonical ledger records that make fan-out deterministic, durable, and resumable."
trigger_phrases:
  - "logical branch ids leases waves"
  - "durable fanout branch leases"
  - "fenced wave scheduling"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/009-fanout-fanin-durable-orchestration"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/009-fanout-fanin-durable-orchestration/003-logical-branch-ids-leases-waves"
    last_updated_at: "2026-07-15T14:44:21Z"
    last_updated_by: "codex"
    recent_action: "Defined stable branch identities, fenced leases, wave ordering, and ledger resume state"
    next_safe_action: "Implement the branch registry, lease adapter, wave scheduler, and replay fixtures"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: Logical Branch IDs, Leases & Waves

> Phase adjacency under `009-fanout-fanin-durable-orchestration` (navigation order, not a hard runtime dependency): predecessor `002-result-envelopes-and-resume-salvage`; successor `004-conditional-budget-aware-fanin`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/065-deep-loop-innovation/009-fanout-fanin-durable-orchestration/003-logical-branch-ids-leases-waves |
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Planned |
| **Created** | 2026-07-15 |
| **Owner skill** | system-deep-loop |
| **Origin** | Third child of the phase-006 fan-out / fan-in durable-orchestration parent |
| **Depends on** | None (`[]`); sibling planning contracts compose at the phase-006 parent gate |
| **Authority posture** | Additive-dark; legacy execution remains authoritative until staged cutover |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Phase 002 plans deterministic manifest expansion across `models[] × branches[] × replicas`, including stable directory-safe logical branch IDs, but deliberately leaves canonical persistence to phase 006. The shipped `.opencode/skills/system-deep-loop/runtime/scripts/fanout-pool.cjs` then accepts a flat ordered item array, keeps at most `K` workers active, requeues retryable failures, preserves result order by input index, and records local JSONL status. That pool is already work-conserving, but its wave-planner interface is explicitly dormant, labels are not a durable branch registry, and status rows do not prove which worker epoch was entitled to process a branch.

Resume makes those gaps unsafe. Reordering a manifest, restarting after a partially completed wave, or reclaiming an expired worker must not remap a result to another branch, rerun a completed branch, or let the displaced worker append a second accepted result. The phase-004 locks-and-fencing contract supplies the missing safety primitive: a lease is only a liveness claim, while the durable monotonically increasing fencing token must be checked atomically at every protected mutation. This phase applies that primitive per logical branch and places deterministic ordered waves above the existing capped pool rather than replacing its concurrency, retry, stall, or settlement behavior.

The resulting ledger fold must answer four questions without inspecting process-local state: which canonical branches exist, which wave each belongs to, which wave is currently eligible, and which lease epoch may mutate each branch. The program outcome and sequencing are fixed by `.opencode/specs/system-deep-loop/065-deep-loop-innovation/manifest/phase-tree.json`: durable orchestration consumes the dispatch, ledger, control-service, and compatibility contracts, then hands stable identities and recoverable results to later fan-in and novelty work.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A versioned logical-branch identity contract that consumes phase 002's explicit model ID, branch ID, and replica ordinal; produces one canonical directory-safe ID; rejects collisions and aliases; and is independent of array position, dispatch time, process identity, retry count, wave admission, or resume order.
- A canonical branch registry record containing the logical branch ID, derivation version, source manifest fingerprint, normalized expansion coordinates, wave identity and ordinal, invocation/dispatch linkage, and immutable branch-registration idempotency key.
- Resume validation that re-expands the manifest, matches branches by canonical logical ID, rejects derivation-version or manifest-coordinate drift, and maps phase-002 result envelopes and salvage records back to exactly one registered branch.
- A per-run/per-branch protected resource key compatible with the phase-004 locks-and-fencing registry; branch aliases, traversal variants, and duplicate coordinates must resolve to one key or fail closed before dispatch.
- Worker lease acquire, renew, expire, release, takeover, and rejection using the phase-004 lease service. Every grant carries lease ID, owner/attempt identity, fencing token, acquired/renewed/expiry timestamps, and declared atomicity domain.
- Mutation-side fencing for branch dispatch state, status, result-envelope acceptance, salvage merge, retry ownership, and terminal transition. A stale or duplicate worker may finish locally but cannot commit protected branch state.
- A deterministic wave plan with stable wave IDs, ordered wave ordinals, immutable branch membership, explicit prerequisite references, and a plan fingerprint. The scheduler admits only the current authorized wave to `runCappedPool`.
- Work-conserving execution within an admitted wave: the existing pool retains its concurrency cap, retry classification, stall detection, post-exit orphan handling, ordered result envelope, and never-throw per-item settlement semantics.
- Canonical ledger events for branch registration, wave planning/admission/closure, lease lifecycle and takeover, stale-fence rejection, branch attempt/terminal state, and resume reconstruction, using the phase-001 event vocabulary and phase-003 transition gateway.
- Deterministic replay, reorder, duplicate-worker, expiry, crash, partial-wave, and resume fixtures proving that the ledger fold reconstructs the same branch-to-wave-to-result mapping.

### Out of Scope
- Redefining phase 002's manifest inputs, executor adapters, capability matrix, invocation fingerprint, or Cartesian expansion semantics.
- Replacing or embedding a second concurrency pool. `runCappedPool` remains the execution engine; this phase supplies durable admission and ownership around it.
- Designing the shared lease coordinator or fencing-token store. Phase `007-shared-evidence-and-control-services/006-locks-and-fencing` owns those primitives; this phase consumes and specializes them.
- Result-envelope schema and salvage policy owned by predecessor `002-result-envelopes-and-resume-salvage`.
- Conditional budget/sufficiency decisions, partial-failure tolerance, or provenance-balanced reduction owned by successors 004, 005, and 006. Those policies may authorize wave advance or stop, but cannot change branch identity or bypass fencing.
- Making the dark ledger authoritative, cutting over legacy writers, or retiring legacy fan-out status/checkpoint paths.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Logical branch IDs are stable and directory-safe | Equal normalized model ID, branch ID, replica ordinal, and derivation version produce the same ID across reorder, restart, host, and time; unsafe segments and collisions fail before registration |
| REQ-002 | Branch registration is canonical and idempotent | Replaying the same expansion emits no duplicate branch; conflicting coordinates, manifest fingerprints, or derivation versions for an existing ID fail closed |
| REQ-003 | Every result maps to exactly one registered branch | Dispatch receipts, attempts, result envelopes, salvage records, and terminal events carry the same logical branch ID and validate their immutable registration linkage |
| REQ-004 | Each branch has one canonical fenced resource key | Alias and traversal variants cannot create parallel ownership domains; duplicate claims serialize on the phase-004 lease resource |
| REQ-005 | Lease lifecycle is bounded, renewable, and takeover-safe | Acquire/renew/expire/release records are ledger-visible; expiry permits a higher token; displaced holders cannot renew or release the successor's lease |
| REQ-006 | Every protected branch mutation validates the current fence atomically | Old-token dispatch, status, retry, salvage, result, and terminal writes return typed stale-lease rejection and cannot alter the accepted branch fold |
| REQ-007 | Wave plans and membership are deterministic | Equal normalized manifest plus wave policy yields the same ordered wave IDs, ordinals, membership, prerequisites, and plan fingerprint; membership cannot change after admission |
| REQ-008 | Waves schedule above the existing capped pool | Only eligible current-wave items enter `runCappedPool`; within that set the pool remains capped and work-conserving with unchanged retry, stall, orphan, and ordered-settlement behavior |
| REQ-009 | Wave advancement is ledger-authorized and policy-neutral | A later wave opens only after the current wave has a durable close/advance authorization; budget and partial-failure policy may provide that authorization but cannot silently skip ordering |
| REQ-010 | Resume reconstructs branch, lease, and wave state from the ledger | Completed branches are not re-dispatched, live leases remain owned, expired leases are reclaimable with a higher token, and the next eligible wave is identical under repeated replay |
| REQ-011 | Orchestration decisions are replay-auditable | Registration, admission, lease lifecycle, takeover, stale rejection, attempt, completion, and resume records include run/branch/wave correlation, transition ID, and fence where applicable |
| REQ-012 | Unsupported or ambiguous state fails closed | Manifest drift, unknown derivation version, duplicate branch coordinates, wave-plan drift, ambiguous lease state, unsupported atomicity domain, or ledger head conflict prevents dispatch |
<!-- /ANCHOR:requirements -->

### Canonical ledger fold

The minimal durable fold is keyed by run ID and logical branch ID. Registration fixes identity and wave membership; lease events select the current fencing epoch; attempt and result events are accepted only under that epoch; wave events expose the single admitted ordinal and its closure authorization. Process-local pool indices remain an execution convenience and never become branch identity. Resume replays these records in canonical ledger order, validates the manifest and wave-plan fingerprints, preserves terminal branches, and reacquires only branches whose leases are absent or expired.

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Reordering manifest models, branches, or unrelated entries leaves every unchanged branch ID stable; invalid segments and deliberately colliding coordinates are rejected.
- **SC-002**: A crash after any registration, lease, admission, dispatch, result, or wave-close boundary resumes to the same branch-to-result mapping without re-running a terminal branch.
- **SC-003**: A worker pauses past lease expiry, a successor obtains a higher fence, and every later old-fence status, result, salvage, retry, or terminal mutation is rejected.
- **SC-004**: Wave membership and ordering replay identically; only the current authorized wave is submitted to the existing capped pool, while pool concurrency remains fully utilized inside that wave.
- **SC-005**: Ledger replay alone reconstructs the registered branches, current lease owners, terminal results, current/next wave, and blocked prerequisites with no directory scan or PID inference.
- **SC-006**: Phase-002 manifest expansion, phase-004 fencing, predecessor result envelopes, and successor advance/stop policies compose through explicit IDs and events without duplicating ownership.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

This child has `depends_on: []` as an independent planning contract, while implementation consumes four established interfaces: phase 002's deterministic manifest expansion and invocation fingerprint; phase 003's transition-authorized ledger; phase 004's lease/fencing service; and predecessor result envelopes plus salvage. The program-level dependency and outcome are recorded in `manifest/phase-tree.json`. These are contract dependencies, not sibling-planning prerequisites.

The highest safety risk is treating a directory name, process-local pool label, lease timestamp, or successful pre-write check as ownership. Branch IDs must come from versioned normalized coordinates, and fencing must be checked inside the same atomic boundary as every accepted mutation. A second risk is implementing waves by pausing pool slots or adding a competing scheduler inside `fanout-pool.cjs`; the intended composition filters eligible items before each pool invocation, preserving the proven capped work-conserving core.

Resume can also drift if a changed manifest silently reuses an existing run. The registry therefore binds IDs to derivation and manifest fingerprints and rejects incompatible continuation. Wave policy evolution needs the same treatment: an admitted plan is immutable; a new policy requires a new plan/run identity or an explicit ledger transition, never in-place reinterpretation.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking for planning. Implementation must pin the logical-ID encoder and digest length, lease duration/renewal margin, canonical per-branch resource-key format, wave-policy version, and exact event names against the phase-001 vocabulary before writing production state. The defaults must preserve the contracts above: IDs are coordinate-derived rather than index-derived, token checks are mutation-atomic, and later policy phases authorize wave advance without rewriting wave history.
<!-- /ANCHOR:questions -->
