# Idea 4 — No-Wrong-Door Bounded Handoff

> **There should be no wrong door. Any mode can accept a request, then hand it to the right one through a small, bounded protocol — and accepting a handoff is never the same as finishing the work.**

---

## TL;DR

Today routing is one-shot: the router classifies, picks a mode, done. If it's wrong on an ambiguous request, there's no graceful recovery. This idea borrows the "no wrong door" principle from public-service desks: whichever mode receives an ambiguous request **keeps ownership of the conversation** while it finds the right destination and **offers** a transfer. The destination explicitly **accepts or rejects** — and crucially, *accepting* just means "I'll take it," not "it's done."

It's a small state machine — `INTAKE → OFFERED → ACCEPTED → ACTIVE → done` — with hard limits so it can never loop or balloon: an idempotent transfer id, a list of modes already tried, a hop budget, a deadline, and at most one clarification question. **Confident routes never touch this** — they stay one-shot. Only the ambiguous path pays for one offer round-trip.

## The problem today

- One-shot classification has no recovery: a wrong guess on an ambiguous request is just wrong.
- There's no way for a mode to say "this isn't mine, but I'll route it properly" without either acting outside its competence or bouncing the user.
- Nothing distinguishes "a mode agreed to take this" from "a mode finished this" — so a handoff could be mistaken for success.

## The idea

A **bounded, acknowledged handoff** for ambiguous routes only:

- The receiving mode (**intake**) holds the conversation and sends a compact **offer** to a candidate mode.
- The candidate checks it can actually do the work (its registry membership and tool surface) and returns **ACCEPTED / REJECTED / NEEDS_INPUT / TIMED_OUT**.
- **Acceptance transfers execution ownership** — and acquires a short-lived, narrowly-scoped lease — **but is still separate from completion.** The work then runs as `ACTIVE`, and only later reports success or failure.
- If rejected or timed out *before* work begins, control rolls back to intake with no side effects. After work begins, recovery belongs to the destination — the router never fakes a rollback.

## How it would work

```
INTAKE ──offer{transferId, capability, policyHashes, visitedModes, hopBudget, deadline}──►
                              │
        ┌── REJECTED / TIMED_OUT ──► back to INTAKE (no mutation)
        │
     OFFERED ── NEEDS_INPUT ──► one schema-bound clarification ──► OFFERED
        │
     ACCEPTED  (destination validates toolSurface, takes a scoped lease)
        │
      ACTIVE ──► COMPLETED | FAILED | CANCELED   (destination-owned recovery)
```

Hard bounds: repeated `transferId` is idempotent; a candidate already in `visitedModes`, an exhausted hop budget, or an expired deadline yields a typed rejection — never another hop.

## Before vs after

| Aspect | Today | With bounded handoff |
|--------|-------|----------------------|
| Wrong guess on ambiguity | Just wrong | Recoverable via typed transfer |
| Who holds the conversation | The picked mode | Intake, until acceptance |
| "Accepted" vs "done" | Not distinguished | Explicitly separate states |
| Authority on transfer | N/A | Short-lived, destination-scoped lease |
| Loop / cost risk | N/A | Bounded by hop budget + deadline + 1 clarification |
| Confident routes | One-shot | Still one-shot (unchanged) |

## What it buys us

- **Graceful recovery** from ambiguous mis-routes instead of a dead wrong answer.
- **A safety invariant**: accepting a handoff never silently counts as finishing the work, and never widens the destination's authority.
- **Bounded cost**: the structure guarantees a finite number of hops and at most one clarification — the ambiguous path can't spiral.

## Risks, costs, open questions

- Adds a round-trip on ambiguous routes; whether that latency is acceptable **needs a real request corpus to measure** (the research flags this explicitly).
- More states to implement and test correctly; the acceptance/completion split must be enforced or the safety benefit evaporates.
- Open: the final envelope fields, the exact lease scope, and the measured cost.

## Where it fits

- **Relative to Track B:** additive — a new recovery path, unrelated to the `defaultMode` flips.
- **Relative to sibling ideas:** this is the `handoff-required` outcome from Idea 3 fully expanded. It shares the "one clarification turn" budget with Idea 5 (negotiation) and the destination-local-authority principle with Idea 7 (proof-carrying commit).

## What the 5-iteration deep-dive found

Five iterations converged on a concrete, bounded protocol — and the headline decision is sharper than the sketch above: a handoff only ever starts from an **explicit "this is ambiguous / hand it off" routing result that already names a viable candidate.** Confident single routes, ordered and surface bundles, idle, no-match, dependency failures, and unsafe fallbacks are all structurally locked out — they create no transfer, offer, lease, or handoff record at all. What the ambiguous path buys is one clean offer round-trip with hard, provable limits.

- **Durable state, not message order.** The truth is a versioned record `(transferId, stateVersion, state)` moving `INTAKE → OFFERED → ACCEPTED → ACTIVE → done`. Every step is a compare-and-set on the expected version, so accept/reject/timeout/cancel races have exactly one winner and every loser just reads the winning snapshot.
- **Acceptance is one atomic commit.** Accepting simultaneously writes destination ownership, the exact offer decision, an acceptance receipt, and a new narrowly-scoped lease — all of it or none of it. `ACCEPTED` stays a distinct pre-execution state, so "I'll take it" can never be mistaken for "it's done."
- **Four fixed envelopes, hashed for identity.** `OfferV1`, `ClarificationV1`, `DecisionV1`, and `StatusV1` are closed schemas; the offer's meaning is canonicalized (RFC 8785 JCS) and hashed into an `offerDigest`. The idempotency key `(transferId, attempt, revision, candidateMode)` makes retries safe: same key + same digest returns the stored decision; same key + different content fails loudly as a conflict.
- **Context by reference, never by dump.** Requests carry authorized, content-addressed, size-capped references — never raw prompts, transcripts, clarification answers, or credentials. A digest proves identity but grants no read access and no execution authority.
- **The lease is not a bearer token.** The source only ever sees an opaque handle; a destination-side mediator re-checks holder, owner/state, offer digest, scope, allowed tool, and a monotonically increasing **fence** on every single effect. TTL gives liveness; the fence is what actually stops a paused, stale worker from writing.
- **The honest limit on "exactly once."** Fencing and idempotency only hold up to external systems that honor them. For APIs that honor neither, the protocol requires a serialized broker, an explicit downgrade to at-least-once, or outright exclusion — no fake rollback promises.
- **`H=1` is the real default.** Only the one-candidate profile supports the literal "one round-trip" claim: at most one clarification, two semantic offer revisions, four control messages, one extra user reply. Multi-candidate recovery (`H>1`) is a separate profile with its own cost class and its own separate reporting.
- **Structure is proven; speed is not.** The hop, clarification, and message bounds are structurally guaranteed. Whether the added latency, byte caps, and recovery yield are acceptable stays **unknown until measured on a real, paired request corpus** — the dive is explicit that a deadline proves termination, not user tolerance.

### Three-dimension read

- **Advisor integration** — The Layer-0 system-skill-advisor feeds the handoff as *evidence only*: typed candidate order, score and margin, calibration identity, and router/registry pins. It never grants authority or owns protocol state, so a missing advisor just falls back to conservative document-derived candidate selection under `H=1`, and a stale advisor result turns into a destination rejection or `POLICY_STALE` rather than a wider execution.
- **Benchmark integration** — This plugs directly into route-gold/skill-benchmark determinism: paired direct-vs-ambiguous fixtures assert that confident routes produce an identical target, resource order, and tool surface with handoff on or off (plus zero handoff artifacts), while ambiguous fixtures pin acceptance, abstention, clarification, timeout, cycles, digest conflicts, concurrent acceptance, and fence/revocation cases. Replay freezes policy, registry, schema, clock, candidate availability, and byte caps, so runs stay reproducible.
- **Standalone on docs alone** — With neither advisor nor benchmark, an AI routing purely off SKILL.md still gets the safe *behaviors*: stay conversationally responsible, offer one documented candidate, ask at most one typed clarification, keep "accepted" separate from "done," and refuse to widen authority. But the dive is blunt that documents alone cannot *prove* the hard guarantees — without a transactional store, a canonicalizer, a lease mediator, or a benchmark there is no atomic ownership, no replay defense, no fencing, no byte caps, and no acceptability evidence, so the only safe standalone posture is non-mutating guidance or a typed abstention.
