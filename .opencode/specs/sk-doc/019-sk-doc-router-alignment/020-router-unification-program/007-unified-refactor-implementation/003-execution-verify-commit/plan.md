---
title: "Implementation Plan: Execution Plane — PREPARE → VERIFY → COMMIT"
description: "Build approach for the destination-local execution plane: the RouteProofV1 evidence contract, the pure PREPARE emitter, the destination VERIFY state machine (READY|STALE_PROOF|NEEDS_INPUT|DEFER|REJECT), COMMIT with destination-local authority + receipt + fencing epoch, the idempotency ledger with a duplicate-key single-effect guarantee, read-only-before-mutating ordering, the N=1 degenerate proof, and the deterministic route-gold fixtures added via the compatibility projector without touching the shared scorer."
trigger_phrases:
  - "execution plane build plan"
  - "prepare verify commit implementation"
  - "idempotency ledger receipt fixtures"
importance_tier: "critical"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Implementation Plan: Execution Plane — PREPARE → VERIFY → COMMIT

## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Plane** | Execution (Idea 7) — the only plane that consumes authority [synthesis §2 diagram; §3 Idea 7] |
| **Upstream** | `RouteProofV1` schema + deterministic hashing (phase `000`); the positive `route` decision (phase `002`) |
| **Downstream** | Recovery ladder (phase `004`); per-hub live rollout (phases `006/*`) |
| **Authority model** | Destination-local; proof/recommendation is evidence, never a capability [synthesis §10] |
| **Blast radius** | Zero live authority in this phase (shadow only); phase-local executable artifacts, no live router/registry/scorer/skill edits |

### Overview

The execution plane turns a single positive `route` decision into an effect through three destination-local steps and a ledger. The build is deliberately staged so that authority is *structurally* impossible to consume before a destination's own VERIFY, and so exactly-once is a property of the **idempotency ledger** rather than a sentence written into the proof [synthesis §3 Idea 7 "exactly-once is an adapter property, not proof text"].

The implementation delivers the contract, state machine, ledger design (resolving open-q 5), fencing/epoch rules, and deterministic route-gold fixtures as phase-local shadow artifacts. No live routing config, registry, scorer, or skill is modified in this phase.

## 2. QUALITY GATES

### Definition of Ready
- [x] `RouteProofV1` field set is fixed by phase `000` and cited [synthesis §2.1]
- [x] The positive `route` decision shape (single/orderedBundle/surfaceBundle, `authority: WithheldUntilVerify`) is fixed by phase `002` [synthesis §2.3]
- [x] Stage 6 gate criteria and rollback semantics are read from the master plan [`../spec.md`; synthesis §9]

### Definition of Done
- [x] Contract + state machine + ledger design authored and internally consistent
- [x] Stale-proof and duplicate-key route-gold fixtures execute through the compatibility projector (scorer untouched)
- [x] N=1 degenerate correctness exercised explicitly (no name conditionals)
- [x] Migration Gate (Stage 6) satisfaction path documented; rollback drill executed
- [x] `tasks.md` fully enumerates and records the build steps in dependency order

## 3. ARCHITECTURE

### The three-step protocol (per target leg)

```
route decision (targets, authority: WithheldUntilVerify)   [phase 002]
        |
        v
PREPARE (router-side adapter, pure)
  emit RouteProofV1 {
    requestFactsHash, effectivePolicyHash, registry/authorityHash,
    readSet[versioned], targets[ordered], authorityClass,
    preconditions[], expiry, idempotencyKey
  }                                   -- NO side effect
        |
        v
VERIFY (destination-side, immediately before first side effect)
  recompute bound digests + CURRENT authority
    -> READY        (digests match, authority held/grantable, not expired)
    -> STALE_PROOF  (any bound hash drifted | generation superseded | expired)
    -> NEEDS_INPUT  (precondition needs a value)  --> routed to phase 004 ladder
    -> DEFER        (recoverable missing evidence/dependency)
    -> REJECT       (forbidden/invalid at verify time)
        |
        v (READY only)
COMMIT (destination-local)
  acquire destination-local authority
  perform effect
  write receipt { idempotencyKey, epoch, effectivePolicyHash, target, outcome, ts }
  stamp fencing epoch; invalidate every later prepared leg
  mutation => open NEW planning epoch (downstream legs must re-PREPARE)
```

### Key components / contracts touched (design targets)

- **`RouteProofV1`** — the evidence artifact. Consumed here, defined in phase `000`. This phase specifies its *binding and lifecycle* semantics, not its serialization.
- **PREPARE adapter (router side)** — pure function `routeDecision → RouteProofV1 | none`. Emits `none` for every non-`route` decision (target-free, authority-free) [synthesis §4 Seam A]. Never touches destination state.
- **VERIFY (destination side)** — the closed state machine `READY | STALE_PROOF | NEEDS_INPUT | DEFER | REJECT`. Recomputes the bound digests against the *current* pinned generation and re-reads current authority. This is the authority checkpoint; the advisory `mcp-route-guard.cjs` must **not** be wired here (it fails open, stays `allow`/`warn`) [synthesis §5.2 line 168].
- **COMMIT (destination side)** — acquires destination-local authority, performs the effect, writes the receipt, stamps the fencing epoch, invalidates later legs.
- **Idempotency ledger** — keyed on `idempotencyKey = hash(requestFactsHash, target, effectivePolicyHash)` (deterministic; a duplicate submission recomputes the same key). Design fixes storage location, partition key, retention window, and the duplicate-key → single-effect + original-receipt read path. This is the concrete resolution of open-q 5 [synthesis §11 item 5].
- **Fencing / epoch model** — requests pin one generation [synthesis §9]; a committed mutating leg stamps a new epoch and invalidates not-yet-committed legs prepared against the prior generation, forcing re-PREPARE (a new planning epoch).
- **Compatibility projector fixtures** — map typed execution outcomes into the existing `observedIntents`/`observedResources` gold shape so the scorer replays them unchanged [synthesis §8.2]. `router-replay.cjs` is never edited.

### Authority & ordering invariants (load-bearing)

1. **Evidence, not capability.** Nothing in a proof authorizes an effect; only a destination's VERIFY → COMMIT consumes authority [synthesis §2.3; §10].
2. **Negatives never reach PREPARE.** `clarify | defer | reject` are structurally target-free and authority-free, so PREPARE emits nothing for them [synthesis §4 Seam A].
3. **COMMIT requires a matching READY VERIFY.** A COMMIT without VERIFY hard-blocks [synthesis §9 line 261].
4. **Read-only legs before mutating legs.** The leg scheduler orders read-only legs first; a mutating leg fences the rest [synthesis §9 Stage 6].
5. **Single effect per key.** The ledger guarantees exactly-once; a duplicate key creating a second effect hard-blocks [synthesis §9 line 261].
6. **No atomic cross-effect rollback.** Router owns pre-effect rollback (disable adapter) only; post-COMMIT external recovery is destination-owned [synthesis §9 Stage 6].

### N=1 degeneracy

The plane is cardinality-agnostic. For `mcp-code-mode` the decision has one target, `selectionKind = single`, `crossTargetEdges = []`, `handoffEdges = []` — the leg scheduler walks a one-element ordered set and the fencing/invalidation logic operates on an empty "later legs" set, both free operations, not a special case [synthesis §5.2 retained; §5.3 dial]. There is no skill-name conditional anywhere in PREPARE/VERIFY/COMMIT.

## 4. IMPLEMENTATION PHASES

### Phase A: Contract + lifecycle
- [x] Fix the `RouteProofV1` binding + lifecycle semantics (fields consumed from phase `000`)
- [x] Define `idempotencyKey` derivation and the "proof is evidence" invariant

### Phase B: State machines
- [x] Implement the pure PREPARE adapter (route → proof | none)
- [x] Implement the VERIFY state machine + digest/authority recomputation
- [x] Implement COMMIT: authority acquisition, receipt, fencing epoch, later-leg invalidation

### Phase C: Ledger + ordering
- [x] Design and implement the idempotency ledger (location, partition, retention) — resolve open-q 5
- [x] Implement duplicate-key single-effect + original-receipt read
- [x] Implement read-only-before-mutating leg scheduling + new-planning-epoch-on-mutation

### Phase D: Proof + verification
- [x] Author and replay the stale-proof-rejected and duplicate-key-single-receipt route-gold fixtures via the compatibility projector
- [x] Exercise N=1 correctness (no name conditionals)
- [x] Document and execute the Stage 6 rollback drill (disable pre-effect adapter)

## 5. TESTING STRATEGY

| Test Type | Scope | Approach |
|-----------|-------|----------|
| Deterministic replay | Stale proof rejected at VERIFY; duplicate key → single receipt | `TypedRouteGoldV1` fixtures through the compatibility projector; `router-replay.cjs` unmodified [synthesis §8.2] |
| Invariant / property | No non-`route` decision reaches PREPARE; no COMMIT without READY VERIFY; single effect per key | Structural assertions over the state machines [synthesis §9 line 261] |
| Degeneracy | Identical path for N=1 and multi-target bundle | Assert zero skill/name conditionals; empty-collection walk [synthesis §5.2] |
| Ordering | Read-only legs commit before mutating legs; mutation fences later legs | Leg-scheduler fixture with mixed read-only/mutating legs [synthesis §9 Stage 6] |
| Rollback drill | Disable pre-effect adapter cleanly; assert no atomic router undo of external COMMIT | Adapter toggle + destination-owned recovery note [synthesis §9 Stage 6] |

## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `RouteProofV1` schema + hashing (phase `000`) | Internal | Upstream | Cannot bind/verify digests |
| `route` decision + `authority: WithheldUntilVerify` (phase `002`) | Internal | Upstream | Nothing to PREPARE from |
| Compatibility projector + existing route-gold (phase `002` / benchmark) | Internal | Reuse | Cannot prove fixtures without editing scorer (forbidden) |
| Destination role model (`actor` vs `evidence`; who can COMMIT) | Internal | From `000`/`006` | Cannot enforce evidence-never-commits |
| `mcp-route-guard.cjs` (advisory, fails open) | External infra | Confirmed | Must stay advisory; never becomes VERIFY [synthesis §5.2] |

## 7. ROLLBACK PLAN

- **Trigger**: Execution-plane fixtures fail deterministic replay, or a design flaw lets authority leak before VERIFY.
- **Procedure (this phase, planning)**: revert the three authored docs; no live artifact is touched, so there is nothing to unwind at runtime.
- **Procedure (Stage 6 at rollout, documented for phases `006/*`)**: `disable pre-effect adapter` to fall back to legacy serving authority. A post-COMMIT external effect is **not** router-reversible; recovery is destination-owned [synthesis §9 Stage 6 rollback column].

---

<!-- ANCHOR:l2-phase-deps -->
## L2: PHASE DEPENDENCIES

```
A (Contract) ──> B (State machines) ──> C (Ledger + ordering) ──> D (Proof + fixtures)
        ^ phase 000 (schema)                                   ^ phase 002 (route decision)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| A Contract | phase 000 | B |
| B State machines | A, phase 002 | C |
| C Ledger + ordering | B | D |
| D Proof + fixtures | C | Stage 6 gate → phases 004, 006/* |

<!-- /ANCHOR:l2-phase-deps -->
---

<!-- ANCHOR:l2-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-activation checklist (for downstream 006/* consumers)
- [x] Stale-proof and duplicate-key fixtures replay green at shadow scope (scorer byte-unchanged)
- [x] Pre-effect adapter has a proven disable path
- [x] Destination-owned post-COMMIT recovery is documented per destination role

### Rollback procedure (Stage 6, at live rollout)
1. **Pre-effect**: disable the PREPARE/VERIFY adapter → legacy serving authority resumes.
2. **Post-effect**: no router atomic undo; hand off to the destination's own recovery per its declared role and COMMIT atomicity class (open-q 5 resolution).

<!-- /ANCHOR:l2-rollback -->
