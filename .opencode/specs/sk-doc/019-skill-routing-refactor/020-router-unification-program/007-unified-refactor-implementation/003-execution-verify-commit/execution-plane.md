---
title: "Execution Plane Contract and Operating Decisions"
description: "Destination-local protocol, proof bindings, ledger retention, role atomicity, fencing, and rollback boundaries."
importance_tier: "critical"
contextType: "implementation"
---

# Execution Plane Contract and Operating Decisions

## Protocol boundary

The execution plane is the only plane that consumes authority. A positive `RouteDecisionV1`
arrives with `authority: WithheldUntilVerify`; every negative action remains target-free and emits
no proof. PREPARE produces evidence, VERIFY recomputes current facts and authority at the
destination, and COMMIT re-acquires destination-local authority before the effect. A proof never
contains a capability or authority handle (synthesis §§2.1, 2.3, 3 Idea 7, 4 Seam A, 10).

The frozen `RouteProofV1` schema is not extended. Required bindings are represented through its
versioned `readSet`, and the complete prepared statement is bound by
`attestation.statementHash`:

| Required binding | Frozen representation |
|---|---|
| Request facts | `request-facts.v1` digest |
| Effective policy | `effective-policy.v1` digest |
| Registry/current-authority source | `registry-authority.v1` digest |
| Ordered target list | `ordered-targets.v1` digest |
| Authority class | `authority-class.v1` digest |
| Preconditions | `preconditions.v1` digest |
| Destination reads | Caller-supplied versioned read entries |
| Expiry | `expiresAtEpoch` |
| Planning generation | `epoch` |
| Duplicate identity | `idempotencyKey` |

All digests use the frozen canonical serializer and registered `RouteProofV1` domain tag. PREPARE
does not observe destination state, clock, filesystem, network, or randomness. VERIFY returns only
`READY | STALE_PROOF | NEEDS_INPUT | DEFER | REJECT`; any proof hash, bound digest, attestation,
generation, or expiry mismatch returns `STALE_PROOF` before current-authority evaluation. A
`NEEDS_INPUT` result is data for the downstream recovery ladder and does not open a user turn here
(synthesis §4 Seam B).

## Destination-owned idempotency ledger

The ledger is colocated with the destination adapter, not the router. Production adapters persist
it in the destination's durable transactional store; the phase-local implementation uses an
in-memory store only to prove state transitions under zero live authority.

- **Key derivation:** domain-separated canonical hash of `requestFactsHash`, the complete compound
  target, and `effectivePolicyHash`. Identical resubmission derives the same key.
- **Partition:** canonical compound destination identity plus authority class. Policy identity stays
  in the key and receipt, so separate policy generations cannot alias one effect.
- **Retention window:** retain through the maximum of proof expiry, destination recovery deadline,
  and any external provider idempotency/deduplication deadline. Pruning is allowed only after that
  maximum has passed. This rule is fixed; the numerical horizon is destination configuration
  because the synthesis explicitly requires empirical destination data rather than an invented
  fleet-wide constant (synthesis §11 open question 5).
- **Duplicate path:** a finalized key returns the exact original receipt object and performs no
  second effect. A pending non-atomic key performs no retry effect and routes to destination-owned
  recovery.
- **Receipt:** `idempotencyKey`, fencing `epoch`, `effectivePolicyHash`, complete target, outcome,
  and timestamp.

This makes exactly-once an adapter property instead of proof text, as required by synthesis §3
Idea 7. For an atomic destination, the effect and finalized receipt belong in one destination
transaction. For an external non-atomic destination, the adapter records `pending` before the
call, supplies the same idempotency key to the provider when supported, and finalizes the receipt
after success. An ambiguous or failed external result stays pending; only that destination may
reconcile it.

## Destination role and atomicity declaration

| Role | Side-effect-free PREPARE | VERIFY | COMMIT class |
|---|---|---|---|
| `actor` | Required | Current local authority and preconditions | Atomic when backed by one local transactional store; otherwise explicitly non-atomic |
| `evidence` | Required | Read-set freshness only | Never COMMITs; resolves read-only after READY |
| `transport` | Required | Current transport permission plus upstream authority edge | Explicitly non-atomic for external effects unless the destination proves a transactional provider contract |
| `judgment` | Required | Current approval/judgment authority | Atomic for a local approval receipt; explicitly non-atomic if it also invokes an external effect |

The advisory route guard remains outside this table: its `allow`/`warn` result is neither current
destination authority nor a VERIFY input. This preserves the N=1 retained boundary described in
synthesis §5.2.

## Ordering and fencing

The scheduler stable-partitions targets so all read-only legs precede mutating legs while
preserving authored order within each group. A mutating COMMIT hard-fails until earlier read-only
legs have resolved. On success it increments the planning epoch, stamps the destination ledger's
fence, and invalidates all later unresolved legs. Their next VERIFY returns `STALE_PROOF`; they
must re-PREPARE from current state (synthesis §9 Stage 6).

Cardinality does not affect the path. A one-target route and every leg of a bundle run the same
`PREPARE → VERIFY → COMMIT` functions. Empty later-leg collections make fencing a no-op at N=1;
there is no destination-name conditional (synthesis §§5.1-5.3).

## Rollback and recovery boundary

Before an effect, disabling the adapter suppresses PREPARE and blocks any already-READY COMMIT.
That is the Stage 6 rollback drill. After an external COMMIT, the router cannot atomically undo the
effect. The receipt and pending ledger record identify the owning destination, whose documented
recovery process must reconcile or compensate it (synthesis §§6, 9 Stage 6, 10).

## Shadow verification boundary

The compatibility projector maps typed route decisions to the frozen scorer's
`observedIntents`/`observedResources` shape. Three locally authored fixtures pass the real
read-only `evaluateRouteGold()` export while a corrupted projection fails. This proves projector
shape, deterministic replay, scorer compatibility, and protected bytes at shadow stage. It does
not run real hub scenarios through `routeSkillResources()`; that production route-gold lane is
deferred to per-hub activation as synthesis §§8.2 and 9 prescribe.
