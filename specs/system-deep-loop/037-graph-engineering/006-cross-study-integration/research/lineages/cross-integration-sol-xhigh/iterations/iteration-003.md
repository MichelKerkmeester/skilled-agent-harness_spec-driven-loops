# Iteration 003 — Memory Locates, Knowledge Asserts, Belief Settles

## Focus

Resolve P3 by assigning non-overlapping semantics and write ownership to memory, knowledge, and belief.

## Findings

1. **DIRECTLY-STATED cross-link — three layers have three jobs.** S5 treats memory as curated retrieval/context support; S4 treats knowledge as evidence-bound assertion production; S2 treats belief as deterministic settlement of usability over a reference-closed ledger. The layers should compose as `memory locates -> knowledge supplies assertions -> belief settles usability`. [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/research.md:50] [SOURCE: specs/system-deep-loop/037-graph-engineering/004-graph-engineering-master/research/research.md:38] [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/research.md:35]

2. **Memory contract.** A memory item is an index entry `{subject, locator, digest, provenance, recency, retentionClass}`. It may rank and retrieve but may not manufacture assertions, settle truth, or carry authorization. The model-callable context facade is read-only and returns bounded, content-addressed handles. [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/research.md:62] [SOURCE: specs/system-deep-loop/037-graph-engineering/001-agent-swarms/research/research.md:85] [INFERENCE: restricting memory to locators prevents retrieval convenience from becoming epistemic authority.]

3. **Knowledge contract.** A knowledge assertion binds subject/predicate/object, source digests, production method, quality gates, contradictions, and validity interval. Knowledge gates K0–K6 decide whether the assertion is publishable, but do not decide whether the runtime may rely on it for a specific transition. [SOURCE: specs/system-deep-loop/037-graph-engineering/004-graph-engineering-master/research/research.md:118] [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/research.md:43] [INFERENCE: publication and graph admission can share evidence references while keeping authorization separate.]

4. **Belief contract and read-through.** A belief view is a deterministic fold over knowledge assertion IDs plus contradiction, supersession, support, recency, and authority context. Reads proceed `memory locator -> digest-verified knowledge assertion -> current belief settlement`; any missing, stale, unresolved, or out-of-scope link returns a typed blocker rather than silently falling back. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/research.md:99] [SOURCE: specs/system-deep-loop/037-graph-engineering/004-graph-engineering-master/research/research.md:50] [INFERENCE: digest-closed read-through joins reference closure with the knowledge identity model.]

5. **Never-forget classes.** Memory compaction may never erase authority decisions, DENY/ASK/refusal records, human decisions, contradiction/supersession lineage, source provenance, negative-test evidence, effect receipts, rollback anchors, or unresolved blockers. It may replace bulky payloads with verified handles, never sever their reference closure. [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/research/research.md:50] [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/research.md:99] [SOURCE: specs/system-deep-loop/037-graph-engineering/004-graph-engineering-master/research/research.md:103] [INFERENCE: this union protects replay, governance, and negative knowledge across all three layers.]

## Sources Consulted

- S1 evidence/knowledge production: lines 85–91.
- S2 belief projection and reference-closed fold: lines 35–145.
- S4 knowledge identity, evidence, and K0–K6: lines 38–65, 118–136.
- S5 memory and context facade: lines 50–81.

## Assessment

- New information ratio: 0.76.
- Novelty justification: introduced typed ownership and a fail-closed read-through chain that separates retrieval, assertion, and usability.
- Confidence: high on semantic layering; medium on retention periods, which remain policy inputs.

## Reflection

- What worked: defining each layer by what it cannot decide.
- What failed: a unified “memory graph” conflates recall, knowledge production, and belief settlement.
- Ruled out: memory as fact store; belief overwrite of knowledge; compaction that drops negative or authority evidence.

## Recommended Next Focus

P4 — inventory the actual dark 036 implementation and identify the cutover-critical missing slice.
