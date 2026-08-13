# Iteration 4: Barrier Versus Pipeline Scheduling

## Focus

Orientation angle 2 contrasts AgentSwarms' level barriers with the desired barrier/pipeline/conflict-safe scheduler. This pass isolates readiness semantics before adding write conflicts.

## Findings

1. AgentSwarms topologically partitions nodes into levels: every node in a level depends only on earlier levels; loop self-edges are ignored and every other cycle fails. This is deterministic and easy to checkpoint, but it makes the whole level a barrier even when individual downstream items could start earlier. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/agent-swarms/src/lib/swarmGraph.ts:196-231]
2. The roadmap says barriers are justified only when a consumer genuinely needs the whole set; a per-item transform between two parallel stages should pipeline instead. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/Graph Engineering Roadmap.md:126-143]
3. Decision: make readiness an edge/join contract: `all` waits for every required live predecessor; `any` fires on the first accepted input and deterministically closes alternatives; `quorum(k)` fires after a declared threshold with named missing inputs; `stream` creates one child activation per input item. Barrier is therefore one readiness mode, not the scheduler's global architecture. [INFERENCE: generalizes level barriers without losing explicit dependency semantics]
4. Decision: a fan-in node declares `expected_inputs`, `minimum_inputs`, `deadline_policy`, and `partial_failure_policy`. It cannot call a partial set complete without recording missing branch IDs. The blog's silent-node-failure warning and AgentSwarms' aggregate failure behavior both motivate this. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/Graph Engineering explained: what it is, when to use it and when not to.md:180-192] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/agent-swarms/src/lib/swarmRuntime.ts:1990-2021]
5. Decision: each activation has an immutable logical activation ID derived from topology digest, node ID, input event IDs, and attempt ordinal. Pipelines may run concurrently, but their result commits remain gateway-authorized and reducer-ordered, so faster completion never changes semantic order. [INFERENCE: combines pipeline width with 036 idempotency and deterministic reducers]
6. When a graph is small, linear, or genuinely sequential, `all` on a single predecessor is the correct degenerate graph; the runtime should not invent pipelines merely because it can. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/From Loops to Graphs: The Next Paradigm in AI Agent Engineering.md:160-173]

## Ruled Out

- Global level barriers as the only readiness model.
- Best-effort fan-in that drops failures silently.
- Opportunistic completion-order semantics.

## Dead Ends

A “pipeline” without per-item identity, bounded in-flight work, and deterministic commit rules is only untracked concurrency.

## Edge Cases

- Ambiguous input: `any` can be nondeterministic if several inputs arrive together; canonical tie-breaking or explicit race semantics must be declared.
- Contradictory evidence: none.
- Missing dependencies: none.
- Partial success: conflict-safe wave admission is deferred to iteration 5.

## Sources Consulted

- [SOURCE: specs/system-deep-loop/037-graph-engineering/context/agent-swarms/src/lib/swarmGraph.ts:196-231]
- [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/Graph Engineering Roadmap.md:96-153]
- [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/Graph Engineering explained: what it is, when to use it and when not to.md:180-209]

## Assessment

- New information ratio: 0.73
- Novelty: introduces four explicit readiness modes and a completeness envelope.
- Questions addressed: q-scheduler.
- Questions answered: when barriers are required and how pipelines remain deterministic.

## Reflection

- What worked and why: separating readiness from execution width removed a false barrier/pipeline binary.
- What did not work and why: level-only scheduling cannot exploit per-item flow.
- What I would do differently: require readiness/failure declarations in graph validation.

## Recommended Next Focus

Bind wave admission to canonical read/write sets, leases, fencing, and conservative unknown-resource conflicts.
