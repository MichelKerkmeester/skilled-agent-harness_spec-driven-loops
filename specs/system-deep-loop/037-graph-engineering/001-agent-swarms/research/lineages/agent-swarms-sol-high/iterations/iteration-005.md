# Iteration 5: Conflict-Safe Wave Admission

## Focus

Current fan-out explicitly rejects `wave`, `depends_on`, and `touches` metadata until a conflict-safety substrate exists. This pass defines the missing admission contract. [SOURCE: .opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:332-412]

## Findings

1. The current runtime correctly fails closed: it forces all fan-out to a flat pool and records wave metadata rejection, so unsupported scheduling cannot masquerade as dependency-aware safety. [SOURCE: .opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:332-435]
2. The 036 write-set graph already defines the needed evidence model: canonical resource identities, read/write sets, write-write/write-read/shared-backend/fence conflicts, hard-order edges, source digests, deterministic antichains, and `unknown_as_conflict`. [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/012-shared-mode-contracts-and-fixtures/004-write-set-conflict-graph/spec.md:83-105] [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/012-shared-mode-contracts-and-fixtures/004-write-set-conflict-graph/spec.md:135-156]
3. Decision: a node is wave-admissible only when its declared read/write/effect sets normalize without ambiguity, every predecessor is authorized-complete, no active node conflicts on a canonical resource, and required leases/fences are acquired. Absence of an edge is not proof of independence; a digest-bound independence assertion is. [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/012-shared-mode-contracts-and-fixtures/004-write-set-conflict-graph/spec.md:124-133]
4. Decision: wave planning is optimistic only for pure/read-only nodes; effectful or workspace-writing nodes require a declared atomicity domain and fence-enforced mutation boundary. A lease alone is not authority: the protected store must compare the current durable token in the same commit as the mutation. [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/007-shared-evidence-and-control-services/006-locks-and-fencing/spec.md:65-83] [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/007-shared-evidence-and-control-services/006-locks-and-fencing/spec.md:91-102]
5. Decision: the wave scheduler emits a `WavePlan` with topology/source digests, admitted nodes, serialized nodes, resource reasons, lease/fence requirements, aggregate budgets, and refusal reasons. Gateway authorization binds this plan; stale plans or changed write sets revert to serial-single-writer. [INFERENCE: composes 036 write-set graph, budgets, and fencing into the current fan-out guard]
6. This also addresses the blog's “false independence” failure: shared files, workspaces, APIs, rate limits, or effect targets are hidden edges even when data prompts are independent. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/Graph Engineering explained: what it is, when to use it and when not to.md:165-179]

## Ruled Out

- User-authored `depends_on`/`touches` as sufficient safety evidence.
- Lease acquisition without mutation-side fencing.
- Treating unknown resources as parallel-safe.

## Dead Ends

Flat-pool concurrency is not a conflict-aware wave; it remains valid for isolated lineage directories but cannot authorize shared writes.

## Edge Cases

- Ambiguous input: broad resource declarations over-serialize; narrowing requires reviewed evidence, never heuristics.
- Contradictory evidence: none.
- Missing dependencies: live wave planner is intentionally absent.
- Partial success: exact planner schema remains a design decision, not implementation.

## Sources Consulted

- [SOURCE: .opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:332-435]
- [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/012-shared-mode-contracts-and-fixtures/004-write-set-conflict-graph/spec.md:83-156]
- [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/007-shared-evidence-and-control-services/006-locks-and-fencing/spec.md:65-102]

## Assessment

- New information ratio: 0.84
- Novelty: converts an explicit runtime rejection into a fail-closed, evidence-bearing wave admission design.
- Questions addressed/answered: q-scheduler conflict-safe waves.

## Reflection

- What worked and why: 036 already contains the missing conflict and fence primitives.
- What did not work and why: prompt-level independence cannot see shared effects.
- What I would do differently: require resource manifests at graph compile time.

## Recommended Next Focus

Define a first-class `GateVerdict` edge schema and deterministic-first evaluation pipeline.
