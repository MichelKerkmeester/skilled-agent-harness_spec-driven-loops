# Iteration 017 — Adversarial Safety Audit of P1–P7 Contracts

## Focus

Adversarially compose the P1–P7 contracts rather than re-reviewing them in isolation. This pass constructs counterexamples and pinned negative controls for projection authority leakage, fixed-point oscillation or silent nontermination, stale mutation fences, inconsistent domain/audit cuts, supersession/nogood admission races, refusal misuse, and human-gate invalidation races. The outcome is a retain/modify decision for every P contract.

## Findings

1. **MODIFY P1/P2; REFINE repo 1 — a verified projection still needs an explicit non-authority type and selected-authority guard at every control consumer.** Counterexample `A1`: the dark `BeliefProjectionV1` reaches domain head `D10`, reports every required answer usable, and emits no convergence blocker while the selected legacy authority still has a pending gate. A convergence consumer that accepts the freshest verified projection stops the loop even though no governed authority flip occurred. Replay validity, freshness, completeness, and truth-state quality do not select authority; the current authority state and epoch do. The projection envelope therefore must carry `authorityDisposition: shadow|selected`, selected owner/state/epoch evidence, and a type that cannot satisfy a transition, STOP, gate, dispatch, budget, or effect interface until a current authority guard converts it. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-003.md:17-23] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/authorized-ledger-types.ts:147-159] [INFERENCE: a replay-verified shadow view can be more current than the selected authority and still be operationally false]

   **Negative control:** mutate the convergence adapter to prefer the highest projection head regardless of `authorityDisposition`; the fixture must fail at the consumer boundary before STOP and show zero domain/effect mutation. Repeat with a selected-authority epoch change after projection publication; the old projection must become advisory-only even when its digest still verifies.

   **When not to use:** do not require the authority guard for offline explanation, historical replay, parity comparison, or diagnostics that cannot change control flow; label those observations advisory instead of making them unusable.

2. **MODIFY P1; EXTEND repo 1 — fixed-point settlement is legal only with a checked termination proof, not a comment, round cap, or deterministic iteration order.** Graphene states that each pass moves beliefs down a lattice, but the implementation can exit its `rounds <= |beliefs| + 1` loop while `changed` is still true and does not reject or withhold that non-fixed state. Its support calculation reads mutable peer truth state, so a corrupt replay, a missed cycle admission check, or a future non-monotone rule can oscillate or require more rounds than assumed even though `BTreeMap` order makes the wrong result repeatable. Counterexample `A2`: a mutant admits a support cycle and alternates a premise between usable and contested across passes; the cap publishes the parity-dependent last value, allowing a required answer on one insertion order and blocking it on another. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graphene-main/crates/graphene-core/src/fold.rs:23-41] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graphene-main/crates/graphene-core/src/fold.rs:693-776] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graphene-main/crates/graphene-core/src/belief.rs:136-178] [INFERENCE: a deterministic bounded loop is not a fixed-point proof when the bound can expire with pending changes]

   `BeliefProjectionV1` must pin a reducer-version termination argument: validate support-DAG acyclicity and referenced-node closure on admission and replay; settle via a stable worklist; bound transitions by a declared monotone measure; detect repeated whole-state digests; and, at exhaustion, run one no-write verification pass. Any pending change, repeated digest before quiescence, unknown rule, or bound breach yields `projectionUnavailable(non_convergent)` and leaves the last verified projection stale rather than publishing a partial state.

   **Negative control:** single-defect mutants remove cycle rejection, invert one support transition, and reduce the work bound by one. Each must fail with `non_convergent` or `invalid_support_graph`; none may produce a checkpoint, answer coverage, or STOP vote. A long acyclic chain of length `N` is the positive boundary and must settle identically under reversed insertion order.

   **When not to use:** do not run iterative settlement for an acyclic reducer whose truth value is computable in one topological pass; the simpler topological evaluator still must validate the DAG and withhold partial output on failure.

3. **RETAIN P4 with a stronger proof seam; CONFIRM repo 1 — claim identity, projection freshness, and preflight authorization do not replace mutation-side fencing.** Counterexample `A3`: worker C1 previews at resource fence 7 and receives an allow; C1 pauses, its lease expires, C2 acquires fence 8, and C1 resumes with the same claim ID, expected projection digest, and still-fresh allow proof. Any writer that checks the fence before entering the storage mutation, or checks only claim/head inside it, can append stale C1 output under C2. Graphene's `done(node, ...)` demonstrates the weaker form: it accepts no claim or fence and tests only whether some active claim exists for the node. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graphene-main/crates/graphene-exec/src/lib.rs:450-515] [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/007-shared-evidence-and-control-services/006-locks-and-fencing/spec.md:91-102] [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/007-shared-evidence-and-control-services/006-locks-and-fencing/checklist.md:59-62]

   Retain `GraphMutationCommandV1`'s claimant-addressed, per-target `{resourceKey, fenceToken, expectedVersionOrHead}` contract and make the negative-control seam mandatory: pause the old holder after all preflight/authorization work but before the authoritative compare-and-mutate, perform takeover, then resume. The protected store must reject C1 atomically with no domain, projection, budget, or effect mutation; a separate linked denial audit is allowed.

   **When not to use:** read-only projection queries and immutable content-addressed writes need no lease fence when they cannot replace, append to, alias, or externally effect a protected resource.

4. **MODIFY P2/P3; EXTEND repo 1 — domain and authorization heads require a consistency-closed cut, not equality, independent “latest” reads, or an invented total order.** Counterexample `A4a`: a checkpoint claims domain head `D11` while its audit cut is `A15`, but `D11.authorization_ref` points to allow `A16`; the projection includes an event whose admission proof is outside the checkpoint. Counterexample `A4b`: domain remains `D11` while audit advances to `A17` with a denial; rejecting this cut merely because the heads did not advance together loses valid denial evidence. `ProjectionCutV1` must therefore bind independent domain and audit ledger IDs/heads plus a closure proof: every included domain frame's authorization reference exists and verifies at or before the audit cut; every audit entry through the cut is classified deterministically as applied-by-domain-sequence, unapplied allow, or denial; no audit record is converted into domain state. [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/authorized-ledger-types.ts:20-76] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/transition-authorization-gateway.ts:570-618] [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-002.md:17-27] [INFERENCE: cross-ledger consistency is a reference-closure relation, not sequence equality]

   **Negative control:** the impossible `D11/A15` cut must fail as `authorization_link_outside_cut`; valid denial-only advancement `D11/A17` must verify and leave the domain projection unchanged while advancing audit selectors; swapping ledger IDs, deleting one allow, or treating an unapplied allow as a domain event must fail at the earliest prefix.

   **When not to use:** a domain-only read model may omit denial details when its contract cannot claim authorization completeness; it still must verify every included domain event's authorization reference.

5. **MODIFY P5's concurrency clause; REFINE repo 1 — prospective supersession and nogood checks must share one serializable conflict head for every truth-affecting candidate.** Counterexample `A5`: at base `H20`, command S previews `A→B` as the only active successor while command N previews a nogood or belief admission involving `{B,C}` as incomplete. If the commands commit through separate relationship/belief stores or validate only their local heads, both can succeed and leave competing successors or an all-`IN` nogood even though each isolated preview was safe. Graphene exposes both ingredients: supersession mutates immediately without its observed-time comparator, while nogoods are inserted without prospective rejection and G8 detects invalidity only later. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graphene-main/crates/graphene-core/src/fold.rs:561-579] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graphene-main/crates/graphene-core/src/fold.rs:614-628] [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/orientation.md:38-48]

   Retain the exact-head hypothetical fixed-point preview and G8 replay backstop, but require every truth-, support-, staleness-, scope-, supersession-, contradiction-, or nogood-changing command to conflict on one authoritative belief-admission head (or one transactionally equivalent conflict key set). Only one same-base writer commits; the loser replays against the new head and either receives a typed violation refusal or commits a newly safe result.

   **Negative control:** barrier-start S and N from the same base in both winner orders. A mutant with per-relation heads accepts both and must be caught at the second commit/prefix; the conforming implementation yields exactly one first commit and forces the second through fresh preview. G8 must independently reject a hand-injected corrupt ledger where the admission guard was bypassed.

   **When not to use:** independent belief changes may commute only when a manifest proves disjoint transitive support, successor, nogood, scope, and required-answer closures; disjoint direct IDs alone are insufficient.

6. **RETAIN P6 with explicit authority-zero semantics; REFINE repo 1 — a refusal's mandatory alternative is explanation, never a command, capability, or successful mutation.** Counterexample `A6`: Graphene returns refusals on stdout with exit 0 and a `DropAMember` or `RebindAndReclaim` suggestion; an automation layer classifies exit 0 as success and executes the suggestion using the refused request's identity or allow proof. The refusal has now become an authority escalation and may mutate a nogood, reclaim a node, or retry against stale facts without a new decision. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graphene-main/crates/graphene-core/src/refusal.rs:1-12] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graphene-main/crates/graphene-core/src/refusal.rs:18-64] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graphene-main/crates/graphene-core/src/refusal.rs:81-147]

   `TransitionRefusalV1` retains stable code, boundary provenance, typed detail, bounded advisory actions, and retry predicates, but adds an invariant-equivalent `authority: none`: no embedded request, proof, fence, capability, effect intent, executable callback, or auto-applicable patch. Recovery always constructs a new request, refreshes the boundary-specific prerequisites, and passes the full current authorization path. Exit status and transport success remain orthogonal to semantic outcome.

   **Negative control:** pass every refusal variant to dispatch, mutation, and effect adapters; all must reject it as a non-command and leave domain/budget/effect state unchanged. Reuse its request/idempotency identity after a changed action and require conflict or fresh identity according to the operation contract.

   **When not to use:** deterministic local input validation may return an ordinary typed error without a durable gateway denial when no policy decision or mutation attempt occurred; it still must not be represented as an accepted transition.

7. **MODIFY P7's commit guard; EXTEND repo 1 — decision-time context validation is insufficient when a load-bearing dependency can change after allow but before edge append.** Counterexample `A7`: gate G5 is evaluated against belief/evidence cut `B12` and domain head `D50`; the gateway records an allow, then evidence advances to `B13` and invalidates the gate without changing `D50`; the old allow proof appends `GateEdgeSelectedV1` because the ledger rechecks only domain head, authority epoch, and proof freshness. A gate fence prevents a stale gate writer only if the invalidation advances that same durable fence and the append compares it atomically. [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/transition-authorization-gateway.ts:720-745] [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-012.md:17-33] [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-013.md:7-25] [INFERENCE: a load-bearing context store outside the domain-head CAS creates a post-authorization stale-context window]

   Retain snapshot-bound human intent, versioned invalidation/reopen, separate expiries, positive principal verification, and edge-before-effect composition. Modify the authoritative append seam so its commit guard atomically verifies the current gate version/fence and a versioned semantic dependency vector (belief/evidence/topology/consequence/assignment/policy heads or an equivalent single materialized context version). Every load-bearing invalidation must advance that guarded version before an old decision can commit. If the backend cannot atomically couple those dependencies, it must serialize invalidation and decision through one fenced broker or fail closed.

   **Negative control:** pause after durable allow, advance each dependency class one at a time, then resume append. Every semantic change must reject the old decision with zero edge/effect mutation; display-only changes outside the declared dependency set must not invalidate. Repeat with timeout-versus-reopen and decision-versus-reassignment races.

   **When not to use:** acknowledgements with no consequence edge, mutation, budget, or external effect can use a simpler receipt; do not impose the full gate vector on informational UI interactions.

## Retain / Modify Decision Matrix

| Contract | Decision after adversarial audit | Required proof addition |
|---|---|---|
| P1 `BeliefProjectionV1` | **Modify** | Authority-disposition taint at consumers; explicit termination proof and fail-closed non-convergence |
| P2 `GraphProjectionReducerV1` | **Modify** | `ProjectionCutV1` with cross-ledger authorization-reference closure; no synthetic head equality/order |
| P3 parity | **Retain and extend fixtures** | Add A1–A7 mutants with exact earliest mismatch and zero-mutation assertions |
| P4 mutation fencing | **Retain** | Mandatory pause-after-preflight takeover negative control at the storage compare-and-mutate seam |
| P5 supersession/nogood | **Modify concurrency clause** | One serializable truth-admission head or proven equivalent conflict-key transaction |
| P6 refusals | **Retain** | Machine-enforced authority-zero/non-command shape and adapter rejection tests |
| P7 human gates | **Modify commit guard** | Atomic gate fence/version plus semantic dependency-vector revalidation after allow and before append |

## Cross-Contract Adversarial Matrix

| ID | Schedule | Plausible-wrong implementation | Required earliest failure |
|---|---|---|---|
| A1 | Shadow projection fresher than selected legacy authority | Consumer chooses freshest verified head | Consumer authority guard before STOP/dispatch |
| A2 | Cyclic/non-monotone support settlement reaches round cap | Reducer publishes last deterministic pass | Reducer `non_convergent` before checkpoint/publication |
| A3 | C1 pauses; C2 takes fence; C1 resumes | Preflight fence check or node-only active claim | Atomic protected-store commit guard |
| A4 | Domain cut references allow beyond audit cut | Independent latest heads or equal-sequence assumption | Checkpoint cut-closure verification |
| A5 | Supersession and nogood-changing writers preview same base | Separate local heads accept both | Second serializable truth-admission commit |
| A6 | Transport-successful refusal reaches executor | Suggestion auto-applied as recovery command | Command decoder/authorization boundary |
| A7 | Gate allow recorded; belief/topology/assignment invalidates before append | Append rechecks only domain head/expiry | Gate dependency/fence commit guard |

## Ruled-Out Directions

- **Trust the freshest verified projection.** Freshness and replay validity do not select operational authority. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-003.md:17-23]
- **Treat a round cap as convergence.** A cap can deterministically publish a non-fixed state unless quiescence is checked. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graphene-main/crates/graphene-core/src/fold.rs:717-776]
- **Bind all safety to the domain head.** Resource fences, audit closure, belief context, and gate invalidation can advance on distinct protected identities. [INFERENCE: A3, A4, and A7]
- **Use per-relation CAS for truth admission.** Transitive support, successor, and nogood closures cross direct relation keys. [INFERENCE: A5]
- **Execute refusal suggestions automatically.** Advice carries no current proof or capability. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graphene-main/crates/graphene-core/src/refusal.rs:18-64]
- **Invalidate every gate on any projection churn.** Only declared semantic dependencies belong in the commit vector; unrelated churn becomes a denial-of-service surface. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-012.md:25-33]

## Sources Consulted

- `specs/system-deep-loop/037-graph-engineering/002-graphene-main/orientation.md`
- `specs/system-deep-loop/037-graph-engineering/001-agent-swarms/research/research.md`
- `specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/lineages/graphene-main-sol-high/iterations/iteration-001.md` through `iteration-016.md`, with emphasis on 001–003, 006–014, and 016
- `specs/system-deep-loop/037-graph-engineering/context/graphene-main/crates/graphene-core/src/{belief.rs,event.rs,fold.rs,refusal.rs}`
- `specs/system-deep-loop/037-graph-engineering/context/graphene-main/crates/graphene-exec/src/lib.rs`
- `.opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/{authorized-ledger-types.ts,transition-authorization-gateway.ts}`
- `.opencode/skills/system-deep-loop/runtime/lib/{coverage-graph,contradiction-supersession,locks-and-fencing}`
- `specs/system-deep-loop/036-deep-loop-innovation/007-shared-evidence-and-control-services/006-locks-and-fencing/{spec.md,checklist.md}`

## Assessment

- **newInfoRatio:** 0.68
- **Novelty justification:** prior iterations specified each contract and the P3 schedule model; this audit adds seven compositional counterexamples, exposes a silent fixed-point-cap failure, defines a consistency-closed dual-ledger cut, requires one serializable truth-admission conflict domain, and closes the post-authorization human-context invalidation window.
- **Questions addressed:** P1, P2, P3, P4, P5, P6, P7
- **Questions answered:** P1–P7 retained or modified with pinned adversarial negative controls
- **Confidence:** high for authority leakage, stale-fence, dual-cut, refusal, and gate-race conclusions; medium-high for the fixed-point counterexample family until the proposed reducer schema pins its exact transition measure.

## Reflection

- **What worked:** schedule composition across independent authority identities exposed failures that per-contract happy paths and terminal parity cannot show.
- **What failed:** freshness, deterministic iteration, preflight validation, local CAS, transport success, and decision-time snapshots are all weaker than their corresponding authority or commit guarantees.
- **Ruled out:** projection-as-authority; cap-as-fixed-point; preflight fencing; equal or synthetic dual-head order; per-relation truth CAS; executable refusals; pre-append-only gate freshness.

## Recommended Next Focus

Concrete versioned schemas, implementation seams, and staged adoption order
