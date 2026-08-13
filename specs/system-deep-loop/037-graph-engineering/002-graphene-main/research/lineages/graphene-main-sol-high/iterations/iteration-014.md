# Iteration 014 — Integrated Runtime Control Plane Without Second Authority

## Focus

Integrate `BeliefProjectionV1`, temporal supersession and prospective nogood checks, `TransitionRefusalV1`, claim/fence mutation safety, durable human gates, and `GraphProjectionReducerV1` into one runtime control plane. The narrow question is which component may observe, propose, decide, commit, or explain a transition while the 036 gateway and ledgers remain the only authority.

## Findings

1. **REFINE repo 1 — Use one six-stage control loop: observe → propose/preview → authorize → fenced commit → reduce → explain.** A caller reads a verified projection and forms a typed transition intent; a deterministic preview evaluates temporal, belief, nogood, gate, claim, budget, and policy prerequisites against one exact ledger head; the gateway records allow or deny; an allowed event is appended only after commit-time head/epoch/fence revalidation; `GraphProjectionReducerV1` then derives the new disposable state; `TransitionRefusalV1` explains an expected rejection. No graph row, preview, refusal, claim, human click, or checkpoint is independently executable. This closes the composition without changing repo 1's rule that every graph transition becomes a 036 intent and only the gateway can append it. [SOURCE: specs/system-deep-loop/037-graph-engineering/001-agent-swarms/research/research.md:19-21] [SOURCE: specs/system-deep-loop/037-graph-engineering/001-agent-swarms/research/research.md:31-31] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/transition-authorization-gateway.ts:570-618] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/transition-authorization-gateway.ts:720-776] [INFERENCE: the six-stage protocol composes the separately established P1/P2/P4-P7 boundaries]

   **When not to use:** do not introduce this control plane for a single deterministic, non-evidentiary local transform with no concurrent mutation, gate, effect, or convergence decision; keep the direct harness path. [SOURCE: specs/system-deep-loop/037-graph-engineering/001-agent-swarms/research/research.md:99-108]

2. **EXTEND repo 1 — Add an explicit `ProjectionProofV1` interface between disposable state and authorization.** The proof must bind domain ledger ID/head/hash, any declared audit cut or authorization references, replay fingerprint, event/upcaster registry digests, graph reducer implementation and schema digests, policy/nogood identities, canonical projection digest, selected claim/gate/belief dependency digests, and proof purpose. The current gateway carries `priorStateVersion` and `priorStateFingerprint`, but those caller-supplied fields do not by themselves identify which reducer, dependencies, or verified reader established them. The policy boundary must positively verify this proof or rebuild it from verified history; missing, stale, unknown-version, or unavailable proof yields a typed denial, never an optimistic fallback. [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/authorized-ledger-types.ts:212-225] [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-002.md:17-23] [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/006-transition-authorized-ledger-core/003-replay-fingerprints/spec.md:52-81] [INFERENCE: a purpose-bound proof closes the trust gap between a generic caller fingerprint and an authority-verifiable projection]

   **When not to use:** do not make a reusable bearer token from the proof, accept a digest reported only by the proposing process, or require the full belief projection when the policy depends only on a smaller verified state slice.

3. **REFINE P5 — Prospective temporal/nogood evaluation is a counterfactual policy input, not a second state machine.** Starting from a verified G8-clean base at an exact head, the authority applies the canonical candidate in isolation with the same pinned reducer/settling contract used after commit. It checks composite observation order, unique acyclic terminal supersession, full fixed-point dependent closure, and every active or proposed nogood. A clean preview supports an allow decision but creates no sequence, relation, truth state, or validity interval; a violating preview produces a denial audit decision and zero domain append. Head movement invalidates the preview and forces recomputation inside the commit protocol. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-008.md:7-31] [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-009.md:7-24] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graphene-main/crates/graphene-core/src/fold.rs:693-777] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graphene-main/crates/graphene-check/src/gates.rs:416-438]

   **When not to use:** do not append then compensate for a prospectively known violation, use post-hoc G8 as routine admission, let an older observation displace the terminal claim, or use a preview result after the domain head, reducer/policy identity, nogood set, authority epoch, or relevant fence changes.

4. **CONTRADICT any design that lets a current projection cache authorize because it is fast or apparently fresh.** Projection publication necessarily follows the authoritative append and can lag, fail, or be rebuilt. UI, scheduling, and explanation may use a cache marked with its verified head and trust state, but authorization must either verify that exact closed prefix and proof or reduce the required slice directly from verified events. A stale cache may continue serving explicitly stale read-only views; it may not admit STOP, supersession, nogood-sensitive belief changes, gate decisions, claim mutations, or effects. This is the operational consequence of projection disposability and the missing bridge in the otherwise correct reducer design. [SOURCE: specs/system-deep-loop/037-graph-engineering/001-agent-swarms/research/research.md:19-20] [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-002.md:19-23] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/transition-authorization-gateway.ts:720-745] [INFERENCE: asynchronous projection refresh cannot be the final authority check for the append it follows]

   **When not to use:** do not block harmless read-only visualization on a rebuild if the response clearly exposes its stale head; fail closed only where the projection is a load-bearing policy premise.

5. **EXTEND P6 — `TransitionRefusalV1` needs a boundary adapter registry, because one generic gateway reason enum cannot faithfully describe every refusal.** Compiler/schema rejection has no gateway decision reference; gateway denial has exactly one immutable audit decision; commit-time stale claim/fence/head rejection names the failed commit guard; effect-in-doubt is a recovery state, not permission to retry. Belief, nogood, gate, supersession, claim, fence, budget, and effect adapters map those authoritative outcomes into a closed detail union and code-owned retry prerequisites. The semantic refusal digest binds the attempted transition, boundary decision/guard reference, and boundary observations; delivery-time `response_current` and prose remain excluded. The refusal itself is a non-authorizing response and is never a domain event. [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/authorized-ledger-types.ts:126-145] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/transition-authorization-gateway.ts:570-618] [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-010.md:7-29] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/receipts-and-effect-recovery/effect-gateway.ts:443-448]

   **When not to use:** do not use a refusal for corrupt storage, reducer nondeterminism, or infrastructure failure; do not branch on prose, treat `response_current` as part of the historical denial, or replay suggested actions as commands/capabilities.

6. **REFINE P1/P4/P7 — Derived invalidation is a safety predicate, while revocation/reopen is an authoritative event.** A source mutation, contradiction, supersession, or nogood change can make a premise unusable and thereby invalidate a worker read set or human gate context in `BeliefProjectionV1`. That derived fact immediately makes a later mutation or decision fail current-head policy revalidation, so safety does not depend on a controller racing to write. If active cancellation, reassignment, gate reopen, or claim revocation is desired, a controller must submit a separately authorized typed event; only its commit changes durable lifecycle state. The remaining interface gap is to name the owner and bounded retry policy for these projection-to-intent reactions so invalid resources do not remain indefinitely open even though they are fail-closed. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graphene-main/crates/graphene-core/src/fold.rs:764-770] [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-006.md:17-35] [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-012.md:9-27] [INFERENCE: separating fail-closed predicate invalidation from explicit lifecycle events prevents a read model from mutating authority while exposing an availability obligation]

   **When not to use:** do not let the reducer emit authoritative revoke/reopen events as side effects, mutate a gate/claim row in place, or assume that an invalidated projection row proves cancellation already committed.

7. **CONFIRM / REFINE P4/P7 — Human gates and worker claims share the commit protocol but not identity or fence namespaces.** Gate opening durably records the exact belief/evidence/topology context shown. A human command binds authenticated principal, gate/version, option, policy, expiry, expected proof/head, and the current gate-resource fence; acceptance atomically revalidates live semantic dependencies and appends exactly one edge-selection event. A separately authorized effect intent may then cite that committed edge. Worker result commands instead bind claimant/attempt identity and the current node/resource fence. Reusing a worker claim as human authority, a gate fence as an effect fence, or one idempotency key across command/edge/effect collapses distinct protected resources. [SOURCE: specs/system-deep-loop/037-graph-engineering/001-agent-swarms/research/research.md:53-59] [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-006.md:13-31] [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-013.md:7-31] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/receipts-and-effect-recovery/effect-gateway.ts:451-506]

   **When not to use:** do not require a human gate for low-blast deterministic transitions allowed by policy; never infer principal authority from eligibility, link possession, timeout, operator recovery, or another gate/version.

8. **EXTEND P1 — Convergence is another proposed transition, not an output bit from `BeliefProjectionV1`.** The projection supplies sorted required-answer paths, terminal successors, premise usability, staleness/fidelity, and typed blockers at a proven head. Mode policy then applies novelty/coverage and forms a typed STOP/converged intent. The gateway authorizes or denies that exact terminal transition, and commit-time revalidation rejects it if a new contradiction, supersession, source mutation, nogood, gate decision, or authority epoch changes a load-bearing dependency. This prevents the belief reducer from becoming the loop's second authority while retaining its path-sensitive safety advantage over contradiction density. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-001.md:18-26] [SOURCE: specs/system-deep-loop/037-graph-engineering/001-agent-swarms/research/research.md:61-67] [INFERENCE: repo 1's rule that every transition is a 036 intent also applies to terminal convergence]

   **When not to use:** do not gate STOP on every background contested claim, treat low novelty as authority, or let a projection refresh terminate a running mode without a committed terminal transition.

9. **EXTEND P2/P6 — Preserve two ledger cuts and a causal join; do not invent one cross-ledger order.** Domain events carry the authorization decision reference that allowed them, so successful transitions join the domain frame to one audit decision. Denied attempts exist only in the authorization-audit ledger. A projection proof that needs only domain truth can rely on verified domain frames and their embedded authorization references; a refusal/denial or audit-aware human view additionally names an explicit audit cut. Because the ledgers have independent sequences, comparing bare sequence numbers or requiring one synthetic total order is invalid. The integrated API must therefore distinguish `domainHead`, optional `auditCut`, and per-event authorization references. [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/authorized-ledger-types.ts:20-76] [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-002.md:17-25] [INFERENCE: explicit cuts resolve the dual-ledger proof ambiguity without promoting the audit log or graph projection to domain authority]

   **When not to use:** do not delay domain-only belief reads until unrelated audit traffic is synchronized, infer a denial from absence of a domain event, or sort domain and audit frames by wall time.

## Integrated Control-Plane Contract

```text
verified domain head + optional explicit audit cut
  -> GraphProjectionReducerV1 / BeliefProjectionV1 (disposable, purpose-bound proof)
  -> typed intent + isolated candidate closure
  -> 036 gateway policy (allow/deny audit decision)
  -> commit guard (same head + authority epoch + exact resource claim/fence + idempotency)
  -> authorized domain append or zero domain mutation
  -> reducer refresh / derived invalidations
  -> TransitionRefusalV1 or durable receipt as explanation
```

The control plane has one authority boundary with multiple verified inputs, not multiple authorities. Projection proofs, previews, human choices, and claims are necessary evidence for selected policies; the audit allow plus fenced domain append is the only path that makes a domain transition true. [INFERENCE: synthesis of findings 1-9]

## Contradictions and Interface Gaps

- `priorStateVersion`/`priorStateFingerprint` exist, but there is no explicit purpose-bound proof type naming reducer identity, verified resolver, selected dependency set, and dual-ledger cuts. [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/authorized-ledger-types.ts:212-225]
- A generic authorization reason-code enum does not provide the closed belief/nogood/gate/claim/fence/effect details or boundary provenance required by `TransitionRefusalV1`; adapters and registry ownership remain to be specified. [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/authorized-ledger-types.ts:126-145]
- Derived invalidation is safe because later commits fail closed, but no bounded controller ownership/retry contract yet turns invalid belief context into optional explicit gate/claim lifecycle intents. [INFERENCE: finding 6]
- Temporal/nogood preview and post-commit projection must share exact reducer semantics without sharing authority; implementation must prevent code/config drift between the two call sites. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-009.md:7-24]
- Domain and audit ledgers have separate order domains; proof and API shapes must stop using an ambiguous single `head` when denial/audit context is load-bearing. [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/authorized-ledger-types.ts:20-76]

## Ruled Out

- A projection cache as the final authorization source: it necessarily lags the append it derives from and may be stale or unavailable. [INFERENCE: finding 4]
- A reducer that emits revoke, reopen, STOP, or repair events during settling: that would make derived state an authority writer. [INFERENCE: findings 6 and 8]
- Refusal-as-event, refusal-as-capability, or suggestion-as-retry permission: denial is the authoritative audit fact; the response only explains it. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-010.md:31-49]
- Claim/lease admission, human approval, or gate selection as sufficient effect authority: every protected mutation/effect needs its own current policy, fence, identity, and idempotency proof. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-013.md:19-31]
- One synthetic order across domain and audit ledgers: explicit cuts and authorization references preserve causality without inventing sequence comparability. [INFERENCE: finding 9]

## Edge Cases

- Ambiguous input: none; the dispatch explicitly selected cross-angle composition and named the participating contracts.
- Contradictory evidence: resolved at the authority boundary. Graphene's fold and G8 can detect invalid state after append, while P5 requires prospective refusal; the integrated design uses isolated preview before the 036 append and retains full-replay G8 only as a corruption backstop. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graphene-main/crates/graphene-check/src/gates.rs:416-438]
- Missing dependencies: exact runtime type names for `ProjectionProofV1`, refusal adapters, and invalidation controller ownership do not exist; they are recorded as design gaps, not described as shipped behavior.
- Partial success: none. This iteration resolves the composition decision but intentionally does not implement or synthesize it.

## Sources Consulted

- `specs/system-deep-loop/037-graph-engineering/002-graphene-main/orientation.md`
- `specs/system-deep-loop/037-graph-engineering/001-agent-swarms/research/research.md`
- Prior lineage iterations `001`, `002`, `006`, `008`-`013`
- `.opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/authorized-ledger-types.ts`
- `.opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/transition-authorization-gateway.ts`
- `.opencode/skills/system-deep-loop/runtime/lib/locks-and-fencing/fenced-ledger-writer.ts`
- `.opencode/skills/system-deep-loop/runtime/lib/contradiction-supersession/types.ts`
- `.opencode/skills/system-deep-loop/runtime/lib/contradiction-supersession/projection.ts`
- `.opencode/skills/system-deep-loop/runtime/lib/receipts-and-effect-recovery/effect-gateway.ts`
- `specs/system-deep-loop/037-graph-engineering/context/graphene-main/crates/graphene-core/src/fold.rs`
- `specs/system-deep-loop/037-graph-engineering/context/graphene-main/crates/graphene-check/src/gates.rs`

## Assessment

- New information ratio: 0.73
- Novelty justification: two of nine findings add new proof/cut interfaces, six partially integrate prior P1/P2/P4-P7 decisions, and the resulting single-authority model earns the simplicity bonus by resolving their apparent control-plane overlap.
- Questions addressed: P1, P2, P4, P5, P6, P7
- Questions answered: P1, P2, P4, P5, P6, P7 at the integrated decision level
- Confidence: high on the single-authority and commit-time revalidation rules; medium-high on proposed proof/adapter/controller type names because they are design outputs, not current runtime APIs.

## Reflection

- What worked and why: following one candidate transition from projection read through preview, denial/allow, fenced append, reducer refresh, and explanation exposed the exact authority boundary and the projection-lag trap.
- What did not work and why: treating all components as peers obscured that refusals, gate choices, claims, and projection facts have different persistence and authority semantics.
- What I would do differently: the next corpus pass should test each blog claim against this end-to-end protocol rather than mapping blogs to individual components in isolation.

## Recommended Next Focus

All-12-blog corpus triangulation against the integrated decision set.
