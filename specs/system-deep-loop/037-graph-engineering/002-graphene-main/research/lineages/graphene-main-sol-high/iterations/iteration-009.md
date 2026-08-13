# Iteration 009 — P5 Prospective Nogood Admission

## Focus

Close P5's prospective nogood admission contract: prove state usability before evaluation, preview the candidate through the real fixed-point closure before allocating a domain sequence, return a stable actionable refusal with no domain mutation, retain G8 as a corruption/replay backstop, and close the check/commit race.

**Relation to repo #1: EXTEND.** Repo #1 already fixes the 036 ledger as sole history and the graph as a proposal/projection layer; prospective nogood admission therefore belongs inside the 036 transition-policy/gateway boundary, not in a second Graphene authority. [SOURCE: specs/system-deep-loop/037-graph-engineering/001-agent-swarms/research/research.md:3-7] [SOURCE: specs/system-deep-loop/037-graph-engineering/001-agent-swarms/research/research.md:31]

## Findings

### 1. EXTEND — A verified, G8-clean base state is a prerequisite, not an optimistic input

The admission input is usable only after verified replay at an exact domain head, under pinned event/reducer/policy identities, produces a projection whose current active nogoods all pass G8. Graphene's fold is deterministic and fixed-point based, but its current G8 test intentionally constructs and folds an already-invalid all-`IN` nogood; therefore deterministic state is not necessarily admissible state. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graphene-main/crates/graphene-core/src/fold.rs:175-201] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graphene-main/crates/graphene-check/tests/gates.rs:353-371]

If the base projection already violates G8, normal candidate admission must stop with an invariant-breach/quarantine outcome before evaluating the request. It must not blame the new request with `WouldCompleteNogood`, because the request did not create the invalidity. Repair/import tooling may operate only through a separately authorized recovery contract that preserves the original stream and proves the repaired projection from replay. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graphene-main/crates/graphene-check/src/gates.rs:416-438] [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/006-transition-authorized-ledger-core/002-typed-append-only-ledger/spec.md:102-110] [INFERENCE: separating dirty-base quarantine from candidate refusal preserves truthful attribution and prevents an invalid projection from becoming an authorization premise]

**When not to use:** Do not use prospective refusal to bless, compensate for, or silently repair a legacy/imported stream that already fails G8. Do not treat successful replay alone as state usability.

### 2. EXTEND — Admission must evaluate the hypothetical settled closure, not the immediate event shape

For every candidate that can add a belief or relation, change support, contradiction, retraction, supersession, staleness, scope, or declare a nogood, the authority constructs an isolated copy of the verified projection, applies the exact canonical candidate logically, and runs the same pinned reducer to its fixed point. The check rejects when the settled prospective projection makes every member of any active (or candidate-declared) nogood exactly `IN`. Checking only the directly named belief misses dependent cascades; Graphene's reducer can change beliefs repeatedly until closure and defines only `IN` as a usable premise. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graphene-main/crates/graphene-core/src/fold.rs:693-699] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graphene-main/crates/graphene-core/src/fold.rs:717-777] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graphene-main/crates/graphene-core/src/belief.rs:157-177]

The preview is sequence-free with respect to authority: it may use a deterministic provisional next-position token only as a reducer input, but it cannot allocate, reserve, or expose an authoritative domain sequence. The gateway contract explicitly places authorization before sequence allocation, projection, receipt, or side effect. [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/006-transition-authorized-ledger-core/004-transition-authorization-gateway/spec.md:62-70] [INFERENCE: a provisional reducer token is acceptable only when the closure result is bound to the expected head and the real sequence is assigned exclusively by commit]

**When not to use:** Do not test only the candidate's direct members, one reducer round, or the pre-candidate truth states. Do not append and then compensate when closure was knowable prospectively.

### 3. EXTEND — Nogood declaration admission is distinct from belief admission

A proposed nogood must first canonicalize distinct existing members, reject cardinality below two, and deterministically attempt best-effort minimality reduction. It then previews the declaration against the current settled truth state. If the canonical set is already all `IN`, the declaration cannot enter normal domain history as though it established a preserved invariant: return `NogoodUnenforceable` when protected/user-authority members leave no authorized eviction, otherwise return a typed conflict requiring an explicit prior repair or human decision. Graphene's current fold only sorts/deduplicates and inserts, with no cardinality, existence, minimality, or truth-state admission. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graphene-main/specs/02-belief-layer.md:251-265] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graphene-main/crates/graphene-core/src/fold.rs:614-628] [INFERENCE: a declaration that is false on arrival cannot serve as an invariant without an explicit recovery decision]

The current golden nogood fixture is a negative control, not a positive oracle: it adds two independent beliefs that settle `IN`, then records their nogood successfully. A corrected admission harness must expect the declaration to be refused or routed to unenforceable recovery, with unchanged domain head and projection. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graphene-main/crates/graphene-core/tests/golden/nogood.jsonl:2-4] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graphene-main/specs/10-verification.md:85-100]

**When not to use:** Do not infer minimality from sorted members, silently drop an unenforceable declaration, or automatically retract authority-bearing instructions.

### 4. EXTEND — `NogoodRefusalV1` is stable by semantic identifiers; prose is not its contract

For the same canonical request, verified head, projection/reducer identity, and nogood registry, the refusal result is deterministic: stable code `WOULD_COMPLETE_NOGOOD`, sorted violated nogood IDs, sorted member IDs and prospective truth states, candidate event ID/digest, expected domain head, projection/reducer digest, and a bounded ordered repair list. The human-readable reason is explanatory and must not be parsed as authority. Graphene already declares `WouldCompleteNogood`, `NogoodUnenforceable`, `DropAMember`, and structured nogood/member detail, and specifies that every refusal names an alternative. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graphene-main/crates/graphene-core/src/refusal.rs:18-50] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graphene-main/crates/graphene-core/src/refusal.rs:81-100] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graphene-main/crates/graphene-core/src/refusal.rs:123-147]

This refusal is an operation outcome, while the 036 gateway may durably append one bounded deny decision to its separate authorization-audit stream. Stable refusal therefore means no domain sequence allocation, no requested domain event, no projection/budget/effect change, no success-idempotency consumption, and no domain receipt—not "no audit evidence anywhere." [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graphene-main/crates/graphene-core/src/refusal.rs:1-12] [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/006-transition-authorized-ledger-core/004-transition-authorization-gateway/spec.md:52-56] [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/006-transition-authorized-ledger-core/004-transition-authorization-gateway/spec.md:91-96]

**When not to use:** Do not encode the rule only in prose, return a generic exception, represent refusal as a domain event, or claim zero mutation if the audit stream intentionally recorded the deny.

### 5. EXTEND — Repair advice is bounded, deterministic, and never self-authorizing

Repair generation examines the union of newly violated nogoods and proposes only candidate-local or explicitly authorized one-step changes that actually make the hypothetical closure pass: remove one candidate support/edge; omit or replace one candidate-added belief; or request withdrawal/contradiction of one non-pinned, non-authority-bearing member. Suggestions are sorted by `(edit_count, affected_nogood_ids, canonical_member_id)` and capped; each suggestion carries a proof digest of the re-preview that cleared every newly violated nogood. If no bounded one-step repair exists, the only suggestion is human resolution/re-scope, and the result must not call a heuristic hitting set "minimal." [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graphene-main/crates/graphene-check/src/gates.rs:431-436] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graphene-main/specs/02-belief-layer.md:260-265] [INFERENCE: proof-carrying one-edit advice is the smallest actionable contract that avoids auto-mutation and false minimality claims]

Minimality of a recorded nogood and minimality of a repair are different problems. Best-effort member reduction does not prove a globally minimum repair across overlapping nogoods; a bounded deterministic hitting-set search may provide a candidate, but authority must still re-evaluate the resulting new request from the current head. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graphene-main/specs/02-belief-layer.md:251-265] [INFERENCE: overlapping nogoods turn repair selection into a separate optimization problem rather than part of refusal authorization]

**When not to use:** Do not auto-apply a suggestion, suggest dropping a pinned/user instruction, claim global minimality without proof, or reuse a repair after the head changes.

### 6. KEEP — G8 remains an independent full-replay backstop

G8 must run over rebuilt projections and at verification/cutover boundaries to detect corrupted, legacy, imported, or reducer-drift streams that bypassed or predated prospective admission. Its response is quarantine/block-and-diagnose, not append-then-retract normal control flow. This preserves the independent invariant promised by Graphene while acknowledging that its current implementation observes the violation only after the state contains it. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graphene-main/specs/10-verification.md:43-56] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graphene-main/crates/graphene-check/src/gates.rs:416-438]

The admission harness needs both controls: a candidate that would complete a nogood is refused before domain append, and an injected historical stream containing the same invalid state is caught by G8 during full replay. If either control passes through the other's mechanism, the boundary is conflated. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graphene-main/specs/10-verification.md:85-100] [INFERENCE: paired controls prove admission and invariant verification independently]

**When not to use:** Do not call G8 on a post-mutation projection as the ordinary admission mechanism, and do not remove G8 after prospective admission exists.

### 7. EXTEND — The closure certificate is valid only at one serialized commit head

`NogoodClosureProofV1` binds the canonical request digest, expected domain head sequence/hash, verified base projection fingerprint, active-nogood digest, reducer/event/policy identities, prospective projection digest, violated-set result, and authority epoch. The gateway evaluates before allocation; the ledger's exclusive commit path then revalidates the exact allow proof against the current head, fence, event bytes, and single-use decision before assigning the next sequence. The shipped 036 ledger already performs proof validation under its exclusive lock and only then assigns `head.sequence + 1`. [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/append-only-ledger.ts:378-440] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/append-only-ledger.ts:440-485]

If another accepted event changes the head between preview and commit, the proof is stale and no domain append occurs; the caller retries by rebuilding the verified projection and recomputing closure. A per-request mutex or cache cannot replace the ledger-head comparison because a different request can change a nogood member or dependency. The ledger specification requires an exclusive writer lock plus expected-head comparison for race-safe order. [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/006-transition-authorized-ledger-core/002-typed-append-only-ledger/spec.md:78-86] [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/006-transition-authorized-ledger-core/002-typed-append-only-ledger/spec.md:100-110] [INFERENCE: binding the prospective closure to the serialized head closes the check/commit TOCTOU without making the graph projection authoritative]

**When not to use:** Do not reuse a clean closure preview after any head, reducer, policy, authority epoch, or nogood-registry change; do not serialize only by candidate ID; and do not allocate a sequence during preview.

## Closed P5 Prospective Nogood Admission Contract

1. Rebuild and verify the base projection at exact head `H`; require pinned reducer/policy identities and current G8-clean state.
2. Canonicalize the exact request and identify every event class that can affect belief truth, support, scope, contradiction, supersession, staleness, or nogood membership.
3. Apply the candidate to an isolated copy and run the same reducer to fixed point; include a candidate-declared nogood in this preview.
4. Refuse if the prospective closure makes every member of any active/candidate nogood exactly `IN`; emit stable, sorted semantic detail and bounded proof-checked repair proposals.
5. Record at most the 036 authorization-audit deny; allocate no domain sequence and change no domain projection, budget, effect, receipt, or success-idempotency state.
6. Keep G8 as independent replay/corruption/cutover verification and quarantine any already-invalid base state.
7. Bind a clean closure proof to request bytes, base head/fingerprint, nogood/reducer/policy identities, fence, and authority epoch; under serialized append, reject staleness and recompute from the new head.

This is an integration proposal rather than a claim that Graphene or 036 already implements domain-specific nogood admission. Graphene supplies the truth lattice, fixed-point reducer, refusal vocabulary, and G8; 036 supplies the sole gateway, audit/domain separation, exact-head authorization, fencing, and append serialization. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graphene-main/crates/graphene-core/src/fold.rs:693-777] [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/006-transition-authorized-ledger-core/004-transition-authorization-gateway/spec.md:52-70]

## Sources Consulted

- `specs/system-deep-loop/037-graph-engineering/002-graphene-main/orientation.md`
- `specs/system-deep-loop/037-graph-engineering/001-agent-swarms/research/research.md`
- `specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-008.md`
- `specs/system-deep-loop/037-graph-engineering/context/graphene-main/specs/02-belief-layer.md`
- `specs/system-deep-loop/037-graph-engineering/context/graphene-main/specs/10-verification.md`
- `specs/system-deep-loop/037-graph-engineering/context/graphene-main/crates/graphene-core/src/fold.rs`
- `specs/system-deep-loop/037-graph-engineering/context/graphene-main/crates/graphene-core/src/belief.rs`
- `specs/system-deep-loop/037-graph-engineering/context/graphene-main/crates/graphene-core/src/refusal.rs`
- `specs/system-deep-loop/037-graph-engineering/context/graphene-main/crates/graphene-core/tests/golden/nogood.jsonl`
- `specs/system-deep-loop/037-graph-engineering/context/graphene-main/crates/graphene-check/src/gates.rs`
- `specs/system-deep-loop/037-graph-engineering/context/graphene-main/crates/graphene-check/tests/gates.rs`
- `specs/system-deep-loop/036-deep-loop-innovation/006-transition-authorized-ledger-core/002-typed-append-only-ledger/spec.md`
- `specs/system-deep-loop/036-deep-loop-innovation/006-transition-authorized-ledger-core/004-transition-authorization-gateway/spec.md`
- `.opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/append-only-ledger.ts`

## Assessment

- `newInfoRatio`: 0.58
- Novelty: Iteration 008 isolated the admission gap; this pass supplies the complete precondition/preview/refusal/repair/backstop/serialization contract, distinguishes dirty-base quarantine from candidate refusal, and closes stale-preview reuse under concurrent writers.
- Confidence: High for observed Graphene and 036 behavior; medium-high for the proposed proof/refusal field placement because P6 intentionally owns the final stable schema and authority/retry semantics.

## Reflection

- What worked: Following one invalid nogood through the belief spec, fold, refusal vocabulary, golden fixture, G8, and then the 036 gateway/ledger boundary made the admission-versus-backstop and audit-versus-domain distinctions explicit.
- What failed: Treating G8, deterministic replay, or a request-local mutex as sufficient prospective safety; each leaves either mutation-before-check or a stale-head race.
- Ruled out: append-then-compensate, direct-member-only checks, single-pass closure, dirty-base candidate refusal, generic exceptions, refusal-as-domain-event, auto-applied repairs, globally minimal repair claims without proof, and reuse of a closure preview after head change.

## Recommended Next Focus

P6 TransitionRefusalV1 stable schema and authority/retry semantics.
