# Idea 7 — Proof-Carrying Prepare / Verify / Commit

> **Planning a route and being allowed to act on it are two different things. Let the router *prepare* a plan freely — but the plan is only evidence, and the destination re-checks it the instant before it touches anything.**

---

## TL;DR

The deepest reframe in the set. Today a route decision quietly bundles three things: classifying the request, acquiring authority, and executing. This idea pulls them apart into three stages:

- **PREPARE** — do everything that has *no side effects*: parse, extract facts, score, look up the registry, check that resources exist, load read-only evidence, run dry-run validation. Emit a short-lived **proof** that says "this plan follows this policy over this observed state." The proof is **evidence, not permission.**
- **VERIFY** — the *destination* re-checks the proof immediately before the first real action: are the policy, registry, and read-set versions still current? Is the authority still valid? If anything drifted, it's a **stale proof** → recompute, clarify once, defer, or reject.
- **COMMIT** — only now does the destination acquire authority and take the first side effect. And once a mutating step happens, any later prepared steps are invalidated and must be re-planned against the new state.

Crucially: the router **never promises atomic rollback** across files, network calls, or deployments — because those aren't universally reversible. After the first mutation, recovery belongs to the destination, not a fake router-level undo.

## The problem today

- A recommendation can slide straight into execution — classification and authority aren't clearly separated, so it's hard to say *when* the system committed.
- "Optimistic" planning is risky if nothing re-checks that the world hasn't changed between deciding and acting.
- Any notion of "just roll back a mis-route" is a false promise once real side effects (edits, deploys, messages) have happened.

## The idea

Borrow three well-understood mechanisms:

- From **proof-carrying code**: the producer emits a proof; the consumer does a small local check. The route proof is that artifact — locally checkable, and it confers *no* capability.
- From **Kubernetes**: dry-run (plan without persisting) and optimistic versioning (reject a stale write with a conflict). A drifted proof is a `STALE_PROOF`.
- From **PostgreSQL's prepared transactions**: the *warning*, not the mechanism — preparation must hold **no locks or leases**, because long-lived reservations are expensive and routing has no shared transaction manager.

## How it would work

```
PREPARE(request, policyHash)
   └─► RouteProofV1 { requestDigest, policyHash, registryHash, readSet[versioned],
                      orderedTargets[{mode,role}], evidence, authorityClass,
                      preconditions, expiresAt, idempotencyKey }     ← evidence, NOT authority

VERIFY_AT_DESTINATION(proof, currentState)
   └─► READY | STALE_PROOF | NEEDS_INPUT | DEFER | REJECT

COMMIT(READY)
   └─► acquire destination authority immediately before first side effect
   └─► execute ONE mutation boundary
   └─► re-plan remaining bundle legs against the resulting state
```

A read-only bundle (e.g. `[code-review, code-webflow]`) can prepare all its legs together. A mutating leg (e.g. `quality` with `Edit`) cannot be speculated, and after it commits, the next leg needs a fresh proof.

## Before vs after

| Aspect | Today | With prepare/verify/commit |
|--------|-------|-----------------------------|
| Classify vs authorize vs execute | Blurred | Three explicit stages |
| A recommendation's power | Can lead into execution | Proof is evidence only |
| World changed between decide + act | Unchecked | `STALE_PROOF` → recompute |
| "Roll back a mis-route" | Implied, often false | Destination-owned recovery; no fake atomic undo |
| Mutating bundle | One decision | Each commit re-plans the rest |

## What it buys us

- **A clear, auditable commitment boundary** — you can point at exactly when authority was acquired and the first side effect crossed.
- **Optimistic-but-safe routing** — plan speculatively, but never act on a stale plan.
- **Honesty about reversibility** — no false promise of rolling back real-world effects.

## Risks, costs, open questions

- It's the most invasive idea: it changes the *lifecycle* of a route, not just its shape.
- "Read-only" isn't automatically safe — some reads cost money or expose sensitive context; the research flags that speculation still needs a policy.
- Open: the exact proof schema and expiry rules, the read-set version vocabulary per hub, and how concurrent acceptance / time-of-check-time-of-use / destination-disappearance resolve.

## Where it fits

- **Relative to Track B:** far downstream — Track B was a config reconciliation; this is an architectural lifecycle. It's the "endgame" frame, not a near-term change.
- **Relative to sibling ideas:** it binds its proofs to Idea 1's policy hash, prepares/commits Idea 6's typed `targets`, and shares destination-local authority with Idea 4 (handoff). It is where the whole set converges: the synthesis calls `prepare → verify → commit` the uniform route lifecycle.

## What the 5-iteration deep-dive found

The dive ran all five iterations (forced to the cap, not early-converged) and answered all five design questions. It landed a coherent V1 contract — `RouteProofV1` for the plan, an ordered VERIFY that returns one of five outcomes, an atomic COMMIT with receipts and epochs, and an effect lattice for safe speculation — while keeping two hard limits explicit: a local ledger cannot make a non-idempotent remote effect happen exactly once, and VERIFY still has to trust the destination's clock.

What it pinned down:

- **The proof is a canonical claim, not a key.** `RouteProofV1` is a short-lived, hashed record of the plan and the state it observed — request digest, policy hash, registry hash, versioned read-set, ordered targets, evidence, authority class, preconditions, an idempotency key, and an expiry. It's serialized in a fixed canonical form (JCS / RFC 8785) and hashed with a domain-separated SHA-256, so two implementations produce byte-identical proofs. It still confers **no** authority.
- **Read-set versions are per-adapter, not one scheme.** Each hub tags how its versions compare — content hash, monotonic generation, opaque resource version, strong ETag, or composite — because "unchanged" means different things in different places (a content hash tolerates an A→B→A round-trip; a generation counter does not).
- **VERIFY is an ordered checklist with five outcomes.** It parses and digests, then checks destination/target, then current authority *before* it touches sensitive state (so a bad proof can't be used to probe what exists), then expiry, policy, registry, read-set, target order, preconditions, and epoch — ending in `READY | STALE_PROOF | NEEDS_INPUT | DEFER | REJECT`. `READY` is a one-shot, destination-internal fence, never a portable token.
- **COMMIT is one atomic compare.** It consumes the fence and does a single atomic check of authority, proof digest, epoch, and idempotency state, writing an immutable receipt plus an append-only status trail (`not_started → in_flight → succeeded / failed / unknown`). Same key and digest replays the same receipt; same key with a different digest is rejected; two keys racing one mutation epoch yield exactly one winner.
- **The key decision: exactly-once is an adapter property, never the router's.** A local receipt and a non-idempotent remote effect can't be made atomic without a shared transaction, so idempotent remote calls get a durable attempt record and a stable downstream token, and non-idempotent ones must offer compensation, accept weaker semantics, or refuse to run autonomously. The first mutating commit also bumps the bundle's epoch, which invalidates every already-prepared later leg.
- **"Safe to speculate" is a typed budget, not "read-only."** An `EffectManifestV1` classifies each operation (pure-local, bounded-local-read, versioned-remote-read, verified-dry-run, metered-or-sensitive-read, mutating-or-unknown), and only declared, authorized, budgeted classes may run during PREPARE — anything unknown fails closed.

### Three-dimension read

- **Advisor integration** — When the Layer-0 system-skill-advisor's pick actually drove the route, the proof binds a sanitized `AdvisorRouteEvidenceV1` (selected skill, ranked alternatives, confidence, scorer/graph digests) — never the raw prompt or volatile telemetry — so stale advisor evidence only invalidates a proof when it was decision-bearing, and an absent advisor on an explicit/manual route isn't an error. Corrections from verify/commit feed a separate, after-the-fact learning plane; they never change the serving scorer mid-request, which preserves the advisor's existing split between right-skill scoring and hub/surface file routing.
- **Benchmark integration** — The design maps cleanly onto route-gold-style determinism through four separate fixture families (proof bytes, verify precedence/redaction, commit/receipt histories, and speculation budgets), each pinning clock, hashes, adapters, and schema versions so runs are reproducible. The scorer reports each contract on its own rather than as one aggregate (an aggregate would hide a proof, authority, or receipt failure), and live advisor selection stays deliberately unscored in offline Mode A instead of being approximated.
- **Standalone on docs alone** — With neither advisor nor benchmark, an AI routing purely off SKILL.md and skill docs can still run the discipline as a `PREPARED_DRAFT`: ordered targets, observed versions, stated assumptions, effect classes, a named destination authority, a bounded expiry, one idempotency key, and "replan after any mutation." But prose alone can't establish a canonical digest, a current `READY`, an atomic commit, linearizable receipts, hidden-effect coverage, or exactly-once delivery — so it's a genuinely useful auditable handoff, but explicitly not a machine proof.
