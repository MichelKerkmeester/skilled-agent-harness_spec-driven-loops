# P5 — Graph, Subgraph, and LEAF Execution Boundary

## Ownership

The graph owns admitted topology, scheduling, readiness, reducers, and escalation routing. A sealed subgraph owns a narrowed delegated scope. A LEAF owns bounded tactics only. [SOURCE: specs/system-deep-loop/037-graph-engineering/001-agent-swarms/research/research.md:33] [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/research.md:83]

## Closed vocabularies

`LeafAction = READ_CONTEXT | CALL_MODEL | CALL_TOOL | EMIT_ARTIFACT | REQUEST_SUBGRAPH | RETURN_RESULT`

`LeafEscalation = ASK_HUMAN | REQUEST_BUDGET | REQUEST_CAPABILITY | REPORT_BLOCKER | ABSTAIN`

Unknown kinds are refused. Escalation closes the local claim and returns to the workflow-owned reducer; it never widens its own scope. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/research.md:330] [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/research.md:55] [INFERENCE: a closed algebra retains programmable tactics without programmable authority.]

## Recursive sealed-subgraph invariants

- Bind parent digest, schemas, action/capability subsets, evaluator set, policy digest, budget, deadline, max depth, child limit.
- Children only narrow policy and capability.
- Budget transfers conserve the parent's remaining amount.
- Child lease/deadline cannot outlive the parent.
- Child outputs return through parent evaluation and reduction.
- No child or LEAF calls 036 directly.

S1 supports typed subgraphs; S3 requires sealed admission and TOCTOU protection. [SOURCE: specs/system-deep-loop/037-graph-engineering/001-agent-swarms/research/research.md:61] [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/research.md:55]

## Claim/fence

Every dispatch and return binds graph/subgraph/node, attempt, lease, monotonic fence, input digest, and policy digest. Late or duplicate results are retained as evidence but cannot mutate the canonical reducer. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/research.md:226] [SOURCE: specs/system-deep-loop/037-graph-engineering/001-agent-swarms/research/research.md:33]
