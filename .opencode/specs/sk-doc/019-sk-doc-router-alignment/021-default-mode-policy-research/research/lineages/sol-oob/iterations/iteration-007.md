# Iteration 7: Proof-Carrying, Reversible Route Plans

## Focus

This forced lateral falsification pass treated `defaultMode` as a symptom of premature commitment: classification, authority acquisition, and execution can collapse into one opaque choice. It tested mechanisms from proof-carrying code, Kubernetes dry-run and optimistic versioning, and two-phase commit. The narrow interpretation is route preparation before the first side effect; post-mutation transactional recovery remains out of scope.

## Findings

1. **Speculation is safe only while effects are absent.** Parsing, typed-fact extraction, candidate scoring, registry lookup, resource existence/readability checks, read-only evidence loading, and deterministic dry-run validation can run speculatively. Kubernetes dry-run traverses admission, validation, merge, defaulting, and schema checks but stops before persistence; it rejects handlers that cannot promise no side effects and warns that generated values may differ from the eventual write. In this repository, surface packets are read-only while `quality` is `mutatesWorkspace: true`. [SOURCE: https://kubernetes.io/docs/reference/using-api/api-concepts/] [SOURCE: .opencode/skills/sk-code/mode-registry.json:17] [SOURCE: .opencode/skills/sk-code/mode-registry.json:23] [SOURCE: .opencode/skills/sk-code/mode-registry.json:62]

2. **The proof object is a prepared plan, not a recommendation string.** Proof-carrying code transfers the producer-proof/consumer-check split: the producer supplies an artifact tied to a consumer-defined policy, and the consumer performs a small local check. `RouteProofV1` binds `requestDigest`, `policyHash`, `registryHash`, a versioned `readSet`, ordered `targets[{modeId, role}]`, evidence, alternatives, `authorityClass`, preconditions, expiry, and an idempotency key. It says “this plan follows this policy over this observed state”; it does not confer a tool capability. [SOURCE: https://www.usenix.org/legacy/publications/library/proceedings/osdi96/full_papers/necula/html/node1.html] [SOURCE: .opencode/skills/sk-code/SKILL.md:50] [SOURCE: .opencode/skills/sk-doc/create-skill/references/parent_skill/parent_hub_router_schema.md:102] [INFERENCE: binding every decision-bearing input makes the proof locally replayable without copying authority]

3. **Commit remains a single destination-authority gate.** The destination-local resolver verifies proof structure, recomputes its digest, checks immutable policy/registry identities and every read-set version, confirms target membership/order, rechecks current scope and authority, and only then issues its execution lease. Kubernetes rejects stale updates with `409 Conflict` when `resourceVersion` changed; the analogous response is `STALE_PROOF`, followed by recompute, one bounded clarification, defer, or reject. Request, policy, registry, resource, health, authority, precondition, or expiry changes invalidate the proof. [SOURCE: https://kubernetes.io/docs/reference/using-api/api-concepts/] [SOURCE: .opencode/skills/sk-code/SKILL.md:124] [SOURCE: .opencode/skills/sk-code/mode-registry.json:23] [INFERENCE: local verification preserves packet authority while optimistic checks prevent stale commitment]

4. **Composite and mutation tests reject universal reversibility.** For “review my Webflow animation for jank,” `[code-review, code-webflow]` preserves workflow-first/surface-second order; both tracked-workspace roles are non-mutating, so resource loading and analysis may be prepared together, while the review cache write waits for commit. By contrast, `quality` allows `Edit` and mutates the workspace. Its proof may preview checks but cannot speculatively execute `Edit` or write-capable `Bash`. In quality-then-review, the first edit changes the second leg's state, so review needs a new proof. [SOURCE: .opencode/skills/sk-code/SKILL.md:57] [SOURCE: .opencode/skills/sk-code/mode-registry.json:23] [SOURCE: .opencode/skills/sk-code/mode-registry.json:42] [SOURCE: .opencode/skills/sk-code/mode-registry.json:62] [SOURCE: .opencode/skills/sk-doc/create-skill/references/parent_skill/parent_hub_router_schema.md:113] [INFERENCE: a bundle crossing mutation is a serial saga, not one reversible transaction]

5. **Two-phase commit supplies a boundary and a warning, not a router implementation.** PostgreSQL can prepare and later commit or roll back, but prepared transactions keep locks, impede maintenance, and require prompt closure by an external transaction manager. Route preparation should reserve no lock, tool lease, or mutable resource; it is a short-lived proof over a read set. Once execution crosses the first side effect, generic rollback is impossible or too expensive for non-transactional files, network calls, messages, deployments, and user-visible outputs. Recovery is destination-owned rollback, explicit compensation, or halt-and-report. [SOURCE: https://www.postgresql.org/docs/current/sql-prepare-transaction.html] [INFERENCE: without a shared transaction manager and rollback protocol, router-level atomicity is a false guarantee]

### Concrete Route Contract

```text
PREPARE(request, policyHash)
  -> RouteProofV1(requestDigest, policyHash, registryHash, readSet,
                  orderedTargets, evidence, authorityClass,
                  preconditions, expiresAt, idempotencyKey)

VERIFY_AT_DESTINATION(proof, currentState)
  -> READY | STALE_PROOF | NEEDS_INPUT | DEFER | REJECT

COMMIT(READY)
  -> acquire destination-local authority immediately before first side effect
  -> execute one mutation boundary
  -> re-plan remaining bundle legs against resulting state
```

## Ruled Out

- Treating a valid proof as execution authority.
- Holding locks, tool leases, or reservations while a proof awaits commit.
- Reusing a proof after any bound input or precondition changes.
- Claiming atomic router-owned rollback across filesystem or external mutations.

## Dead Ends

- “Speculate everything, roll back on misroute”: external effects and some generated values are not reproducibly reversible.
- One proof for a mutating ordered bundle: each commit changes later targets' state.
- Literal two-phase commit with long-lived reservations: lock and recovery-manager costs exceed routing needs.

## Edge Cases

- Ambiguous input: none; the prompt selected preparation versus mutation as the boundary.
- Contradictory evidence: none; the analogies agree on local verification but expose different limits.
- Missing dependencies: none.
- Partial success: none. Proof expiry and retry counts remain synthesis/benchmark parameters.

## Sources Consulted

- https://www.usenix.org/legacy/publications/library/proceedings/osdi96/full_papers/necula/html/node1.html
- https://kubernetes.io/docs/reference/using-api/api-concepts/
- https://www.postgresql.org/docs/current/sql-prepare-transaction.html
- .opencode/skills/sk-code/SKILL.md:48
- .opencode/skills/sk-code/SKILL.md:57
- .opencode/skills/sk-code/SKILL.md:120
- .opencode/skills/sk-code/mode-registry.json:17
- .opencode/skills/sk-code/mode-registry.json:23
- .opencode/skills/sk-code/mode-registry.json:42
- .opencode/skills/sk-code/mode-registry.json:62
- .opencode/skills/sk-doc/create-skill/references/parent_skill/parent_hub_router_schema.md:102

## Assessment

- New information ratio: 0.90
- Questions addressed: forced lateral falsification only; all tracked questions were already resolved
- Questions answered: none
- Novelty accounting: 3 fully new, 2 partially new, plus a 0.10 simplicity bonus for `prepare -> verify -> commit`

## Reflection

- What worked and why: proof-carrying code supplied local verification, Kubernetes supplied dry-run and stale-read rejection, and PostgreSQL exposed the cost of pretending preparation is free.
- What did not work and why: transaction-wide rollback does not transfer because route targets share no transactional substrate or recovery manager.
- What I would do differently: define the smallest read-set version vocabulary per hub before choosing expiry or retry numbers.

## Recommended Next Focus

Synthesize all seven iterations into one decision model. Reconcile typed no-destination outcomes, bounded handoff, calibrated negotiation, the compiled minimal contract, and this `prepare -> verify -> commit` boundary. Do not start an eighth iteration.
