---
title: "Implementation Plan: Logical Branch IDs, Leases & Waves"
description: "Implementation plan for stable logical branch registration, fenced worker ownership, deterministic wave admission, and ledger-driven resume over the existing capped fan-out pool."
trigger_phrases:
  - "logical branch ids leases waves implementation plan"
  - "durable wave scheduler plan"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/009-fanout-fanin-durable-orchestration/003-logical-branch-ids-leases-waves"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/009-fanout-fanin-durable-orchestration/003-logical-branch-ids-leases-waves"
    last_updated_at: "2026-07-15T14:44:21Z"
    last_updated_by: "codex"
    recent_action: "Mapped branch, lease, and wave contracts onto the capped pool and ledger"
    next_safe_action: "Implement deterministic branch registration before enabling leased wave dispatch"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Logical Branch IDs, Leases & Waves

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | system-deep-loop runtime + typed orchestration ledger |
| **Change class** | Durable identity, fenced ownership, and scheduling control |
| **Execution** | Wave admission above the existing capped work-conserving pool |

### Overview
Implement one durable orchestration layer around `.opencode/skills/system-deep-loop/runtime/scripts/fanout-pool.cjs`: register the phase-002 expansion as immutable logical branches, claim each runnable branch through the phase-004 fenced lease service, admit branches in deterministic ordered waves, and record every decision on the transition-authorized ledger. The pool keeps its current concurrency, retry, stall, orphan, and ordered-settlement mechanics. Resume becomes a pure ledger fold plus manifest/wave fingerprint validation rather than a directory-label guess.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase 002's normalized expansion coordinates and invocation-fingerprint contract are pinned
- [ ] The canonical ledger event namespace and transition gateway expose branch/wave record types
- [ ] The phase-004 lease API proves monotonic fencing and mutation-side token validation
- [ ] Predecessor result envelopes and salvage records carry a stable branch-reference field
- [ ] The write-surface manifest lists every dispatch, status, retry, result, salvage, and terminal mutation
- [ ] Wave policy inputs and later advance/stop authorization boundaries are explicit

### Definition of Done
- [ ] Logical branch IDs and registrations are stable, directory-safe, collision-checked, and idempotent
- [ ] Lease acquire/renew/expire/release/takeover rejects stale workers at every protected mutation
- [ ] Wave plans replay deterministically and submit only the admitted wave to the unchanged capped pool
- [ ] Resume preserves terminal branches, safely reclaims expired work, and reconstructs the next wave from ledger state
- [ ] Crash, reorder, collision, duplicate-worker, stale-fence, wave-drift, and replay gates pass
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Manifest-to-branch compiler**: consume phase 002's explicit model ID, branch ID, replica ordinal, effective invocation fingerprint, and normalized manifest fingerprint. Apply a versioned canonical encoder, validate directory safety, and detect both ID collisions and coordinate aliases before the first registration event.
- **Immutable branch registry**: append one idempotent registration per logical branch with derivation version, coordinates, run ID, wave ID/ordinal, plan fingerprint, dispatch linkage, and branch-registration key. Re-registration must be byte/semantic equivalent or fail closed.
- **Fenced branch resource**: map `(run_id, logical_branch_id)` through the phase-004 canonical resource-key encoder. Acquire before moving a branch from eligible to leased; renew during long execution; release only with matching lease ID and token; takeover always advances the token.
- **Guarded mutation adapter**: require current lease/fence for dispatch acceptance, attempt/status writes, retry requeue, result-envelope commit, salvage merge, and terminal transition. Phase-003 expected-head/transition checks and phase-004 fence checks occur in the same protected commit.
- **Wave planner**: compile deterministic stable membership and prerequisites into a versioned plan fingerprint. Keep the planner above the pool: select the single ledger-authorized wave, pass only its runnable branches to `runCappedPool`, and persist close/advance state before admitting the next wave.
- **Pool compatibility boundary**: adapt logical branches into the existing pool item shape while treating input index and label as ephemeral. Preserve `runCappedPool`'s work-conserving concurrency cap, retry classifier, lag-ceiling abort/requeue, post-exit orphan watchdog, never-throw settlement, and ordered result array.
- **Resume fold**: replay registration, wave, lease, attempt, and result events; verify manifest and plan fingerprints; mark terminal branches satisfied; retain unexpired ownership; reclaim expired branches with higher fences; and calculate one next eligible wave without scanning leaf directories.
- **Policy handoff**: accept explicit close/advance/stop authorization from conditional budget-aware fan-in and partial-failure policy. Those phases decide whether to proceed; this phase guarantees that any decision is ordered, durable, and cannot bypass identity or fencing.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Pin the phase-002 expansion schema, predecessor result-envelope branch reference, phase-003 transition vocabulary, phase-004 lease API, and the phase-tree outcome.
- Inventory every current `fanout-pool.cjs` status, retry, orphan, settlement, and summary mutation plus the caller-side dispatch/checkpoint paths that need guarded adapters.
- Freeze fixtures for manifest reorder, replica expansion, legacy pool behavior, partial wave completion, and stale worker takeover.

### Phase 2: Implementation
- Implement versioned logical-ID derivation, directory-safety validation, coordinate normalization, collision detection, and immutable branch registration.
- Implement canonical branch resource-key resolution and phase-004 lease acquire/renew/expire/release/takeover adapters.
- Route dispatch, status, retry, result, salvage, and terminal writes through one transition-and-fence guarded mutation boundary.
- Implement deterministic wave-plan compilation, membership/prerequisite validation, admission/closure records, and the adapter that feeds only admitted branches into `runCappedPool`.
- Implement the ledger resume fold, fingerprint drift rejection, terminal-branch preservation, expired-lease takeover, and current/next-wave reconstruction.
- Keep legacy status/checkpoint compatibility additive-dark; no authority cutover or pool rewrite lands in this phase.

### Phase 3: Verification
- Prove ID stability across array reorder, restart, host/time changes, retries, and wave movement; reject unsafe names, alias coordinates, and forced collisions.
- Prove branch registration and replay are idempotent and every dispatch/result/salvage record maps to exactly one branch.
- Pause an old worker through expiry, grant a successor lease, then reject every old-fence mutation while accepting the successor epoch.
- Prove equal inputs generate equal wave plans and that no branch from a future wave reaches the pool before durable advance authorization.
- Compare pool concurrency, retry, stall, orphan, settlement order, and summary behavior against the pinned baseline.
- Crash after each durable boundary and verify repeated resume produces the same branch, lease, result, and wave fold.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Property and fixture tests vary order, timing, host, retry, and wave while asserting stable safe IDs; invalid segments and collision stubs fail |
| REQ-002 | Duplicate identical registration is idempotent; changed coordinates, derivation version, or manifest fingerprint for one ID fails closed |
| REQ-003 | Referential-integrity replay verifies every dispatch, attempt, result envelope, salvage record, and terminal event resolves one branch |
| REQ-004 | Resource-key matrix proves aliases/traversal variants collapse or reject and two workers cannot create separate lease domains |
| REQ-005 | Fake-clock lifecycle tests cover acquire, renew, expiry, release, crash, takeover, and successor-safe stale renew/release rejection |
| REQ-006 | Paused-worker fault injection attempts every protected mutation after takeover and observes typed stale-fence rejection with no state change |
| REQ-007 | Golden wave-plan fixtures prove stable IDs, ordinals, membership, prerequisites, and plan fingerprint under repeated compilation |
| REQ-008 | Baseline parity tests show unchanged concurrency cap, work conservation, retries, lag abort/requeue, orphan watchdog, and ordered settlement |
| REQ-009 | Future-wave sentinel proves no dispatch before ledger authorization; budget/failure-policy stubs can advance or stop only through typed decisions |
| REQ-010 | Boundary crash matrix replays after every event type and asserts completed branches stay terminal and expired work reacquires at a higher fence |
| REQ-011 | Ledger-schema checks require run, branch, wave, transition, lease, attempt, and fence correlation on applicable records |
| REQ-012 | Negative matrix covers manifest/plan drift, unknown version, duplicate coordinates, ambiguous lease, unsupported backend, and head conflict |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The phase has no hard sibling-planning dependency (`depends_on: []`), but implementation consumes the contracts named by the parent program and `.opencode/specs/system-deep-loop/065-deep-loop-innovation/manifest/phase-tree.json`: phase 002 manifest expansion, phase 003 transition-authorized ledger, phase 004 locks/fencing, phase 005 compatibility boundary, predecessor result envelopes/resume salvage, and the existing `.opencode/skills/system-deep-loop/runtime/scripts/fanout-pool.cjs`. Successors 004 and 005 provide policy decisions to the wave-advance boundary without owning identity, leases, or ordering.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Land the registry, lease adapter, wave planner, and resume fold additively behind the existing legacy fan-out path. If parity or fault-injection gates fail, disable durable orchestration admission and return dispatch to the legacy flat pool; retain dark ledger records as non-authoritative evidence. Do not reuse run IDs, branch IDs, wave-plan IDs, or fencing tokens after rollback. Re-entry creates a new compatible orchestration epoch or resumes only when the stored derivation, manifest, and wave fingerprints match exactly.
<!-- /ANCHOR:rollback -->
