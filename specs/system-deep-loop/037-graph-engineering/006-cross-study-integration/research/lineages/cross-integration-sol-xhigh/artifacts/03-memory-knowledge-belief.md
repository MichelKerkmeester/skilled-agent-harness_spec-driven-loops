# P3 — Memory, Knowledge, and Belief Layering

## Non-collision rule

`memory locates -> knowledge supplies assertions -> belief settles usability`

S5 assigns curated retrieval/context to memory, S4 assigns evidence-bound assertion production to knowledge, and S2 assigns deterministic usability settlement to belief. [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/research.md:50] [SOURCE: specs/system-deep-loop/037-graph-engineering/004-graph-engineering-master/research/research.md:38] [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/research.md:35]

## Types and owners

- `MemoryLocator`: subject, artifact locator, digest, provenance, recency, retention class. It ranks/retrieves only.
- `KnowledgeAssertion`: subject/predicate/object, source digests, method, K0–K6 results, contradictions, validity interval.
- `BeliefSettlement`: assertion IDs, support/contradiction/supersession fold, authority context, usability state and reason.

Knowledge publication does not authorize runtime use; belief never rewrites knowledge; memory never fabricates assertions. [SOURCE: specs/system-deep-loop/037-graph-engineering/004-graph-engineering-master/research/research.md:118] [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/research.md:43]

## Read-through

1. Resolve the memory locator.
2. Verify the knowledge assertion digest and reference closure.
3. Read the current belief settlement for the exact authority/policy context.
4. Return typed `usable`, `missing`, `stale`, `contradicted`, `insufficient`, or `authority_zero`.

No layer silently falls back across a missing link. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/research.md:99] [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/research.md:62] [INFERENCE: digest-closed read-through preserves reference closure through model-callable context.]

## Never-forget classes

Authority decisions; DENY/ASK/refusal; human decisions; contradiction/supersession lineage; source provenance; negative tests; effect receipts; rollback anchors; unresolved blockers. Payloads may become verified handles; their closure cannot disappear.
