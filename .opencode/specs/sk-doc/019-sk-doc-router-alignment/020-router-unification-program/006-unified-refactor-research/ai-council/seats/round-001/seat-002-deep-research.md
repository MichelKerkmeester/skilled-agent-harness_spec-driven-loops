---
round: 1
seat: seat-002
executor: deep-research
lens: "Safety / authority hardliner"
status: ok
timestamp: 2026-07-18T00:00:00.000Z
simulated: true
---

# seat-002: Safety / authority hardliner / deep-research (simulated)

## Mandate
Guard the authority boundary and the hard constraints. A recommendation, a rank, a proof, and a compiled policy are all *evidence*; only a destination may consume authority. Enforce: negatives withhold authority and carry no target; the shared scorer is never touched; no over-emission; migration is reversible and gated. Find every place authority could leak.

## Confidence
93 / 100 — the invariants are repository-grounded and survived every lineage's falsification matrix.

## Seat Output

### Proposed plan
Separate planes by authority, not by function. The one non-negotiable structural rule: **only the `route` branch can name a target, and only a destination's VERIFY→COMMIT consumes authority.** `clarify`, `defer`, and `reject` structurally withhold authority — not by convention, by type. Advisor output is one evidence record gated by freshness+identity: `live`+matching ranks; `stale` annotates; `absent`/`unavailable` contributes zero and local policy continues. `rankScore` is never a probability without a validation certificate tied to the policy/risk slice.

The base+overlay is one pinned identity `hash(base, overlay|null, schema, generation)`, pinned once per request; the overlay is immutable and offline-promoted; a mutable online overlay is forbidden because it breaks deterministic replay — the entire safety net. The benchmark integration adds `TypedRouteGoldV1` + a compatibility *projector*; a scorer edit to make the unified route pass is a migration failure, not a licence. Activation is a fenced compare-and-swap; hard gates (negative-with-target, evidence-commits, transport-supplies-judgment, missing authority edge, hash mismatch, mixed generations, COMMIT-without-VERIFY, duplicate-key-second-effect, singular-calls-ranking) hard-block and cannot be overridden by aggregate score.

### Reasoning
The deepest reframe in the set (Idea 7) is temporal: PREPARE creates evidence, VERIFY re-checks at the destination, only COMMIT crosses the effect boundary. Fuse that with Idea 3's invariant and Idea 5's "rank is not probability," and the fusion becomes *safe by construction* — the dangerous states are unrepresentable rather than merely tested-against. Every lineage's threat model reduces to one stop condition: any positive-route, target-set, authority, or receipt mismatch.

### Risks and trade-offs
I add gates and certificates, which the minimalist correctly flags as elegance cost. I accept the cost: the alternative (an implicit fallback, a stale-advisor auto-route, a router-level exactly-once promise) is a silent authority escalation. Exactly-once is explicitly an adapter property (idempotency key + receipt ledger), never proof text — I will not let the proof claim it.

### Assumptions and evidence gaps
- Assumes destinations can implement side-effect-free PREPARE and atomic-or-explicitly-non-atomic COMMIT (open question 5).
- Assumes the advisor projection-hash drift-guard pattern generalizes (Confirmed for the existing projection; unproven for the full compiled projection).

### Alternative challenged
Rejected "stale advisor as lower-confidence positive evidence." Failure mode it prevents: a cached recommendation influencing a positive route after its identity expired — an authority leak dressed as graceful degradation.
