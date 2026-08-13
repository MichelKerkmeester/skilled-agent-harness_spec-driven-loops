# Iteration 2: Minimum Versioned Executable Graph IR

## Focus

Orientation angle 1 asks for the smallest node/edge/port/reducer/branch/retry/subgraph schema that can express current modes without making checkpoints authoritative. [SOURCE: specs/system-deep-loop/037-graph-engineering/001-agent-swarms/orientation.md:159-165]

## Findings

1. AgentSwarms centralizes useful semantics, but its shared `GraphEdge` is only `{id, source, target}` and `GraphNode` only `{id}`; executable meaning still lives in node data and executor branches. That is insufficient as a durable cross-mode contract. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/agent-swarms/src/lib/swarmGraph.ts:19-28]
2. The blog corpus supplies the missing contract principle: a node has bounded input/output and one job; an edge is a data contract, not “and then.” [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/Graph Engineering Roadmap.md:22-39] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/Graph Engineering Roadmap.md:52-95]
3. Decision: define `GraphDefinitionV1` with `graph_id`, `graph_version`, `topology_digest`, `mode_contract`, `authority_epoch`, `source_digests`, `nodes`, `edges`, `entry_ports`, `exit_ports`, and `policy`. Seal this definition before a run; every event and effect receipt binds `topology_digest`. [INFERENCE: combines typed node/edge contracts with 036 immutable event identity and certificate binding]
4. Decision: each `NodeSpec` carries `id`, registered `kind`, typed input/output ports, executor adapter, capability/tool policy, budget scope, retry policy, effect class (`pure|idempotent|effectful|human_gate`), concurrency/resource declarations, and optional `subgraph_ref`. Arbitrary executable code is not serialized into the IR; it is referenced through versioned adapters whose identities enter the digest. [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/006-transition-authorized-ledger-core/001-versioned-event-envelope/spec.md:62-69] [INFERENCE: prevents unreviewed code from bypassing the gateway]
5. Decision: each `EdgeSpec` carries source/target port IDs, schema ID, readiness (`all|any|quorum|stream`), optional condition/gate reference, reducer reference, and failure action. A node output first validates against its port schema; then the scheduler proposes a transition intent; only the 036 gateway may authorize the corresponding event append. [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/006-transition-authorized-ledger-core/001-versioned-event-envelope/spec.md:84-95]
6. The stored 036 envelope already provides stable event type/version, stream position, authority epoch, correlation/causation, and idempotency identity. The IR should reuse those identities instead of inventing a second graph-event envelope. [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/006-transition-authorized-ledger-core/001-versioned-event-envelope/spec.md:97-115]

## Ruled Out

- Serializing prompts and arbitrary JavaScript as the authoritative graph definition.
- Encoding edge semantics only in labels or human-readable YAML prose.
- Allowing node adapters to append transition events directly.

## Dead Ends

AgentSwarms' minimal shared edge type is valuable for in-process reuse but not sufficient as a durable IR.

## Edge Cases

- Ambiguous input: “typed edge” can mean orchestration data or knowledge relation; this IR reserves separate namespaces.
- Contradictory evidence: none.
- Missing dependencies: exact 036 runtime types were not required to freeze the conceptual schema.
- Partial success: implementation-level field names remain provisional; semantic requirements are extractable.

## Sources Consulted

- [SOURCE: specs/system-deep-loop/037-graph-engineering/context/agent-swarms/src/lib/swarmGraph.ts:19-101]
- [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/Graph Engineering Roadmap.md:22-95]
- [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/006-transition-authorized-ledger-core/001-versioned-event-envelope/spec.md:62-115]

## Assessment

- New information ratio: 0.88
- Novelty: produces an extractable IR schema and explicit gateway seam.
- Questions addressed: q-ir.
- Questions answered: minimum graph envelope, node, port, edge, and transition-intent contracts.

## Reflection

- What worked and why: contrasting AgentSwarms' pure semantic helpers with 036's durable envelope exposed the required boundary.
- What did not work and why: copying AgentSwarms types would leave mode semantics implicit.
- What I would do differently: freeze adapter and schema registries before topology syntax.

## Recommended Next Focus

Specify deterministic reducers, fail-closed branch selection, skip propagation, and edge-event evidence.
