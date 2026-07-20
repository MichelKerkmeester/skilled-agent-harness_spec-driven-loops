# Iteration 7: Cross-System Search Core

## Focus

Determine whether three repository search systems share an implementation core or only vocabulary, and avoid designing a framework before a second consumer exists.

## Findings

1. The systems share provider-neutral embedding primitives but not a common retrieval product. Spec memory already has a shared batch `EmbedderAdapter`, model/profile registry, provider cascade, and vector-dimension contracts. Those contracts are reusable as TypeScript interfaces regardless of implementation language. [SOURCE: .opencode/skills/system-spec-kit/shared/embeddings/adapter.ts:1-62] [SOURCE: .opencode/skills/system-spec-kit/shared/embeddings/README.md:17-135]
2. Domain ranking is incompatible. Styles retrieval fuses lexical and semantic lanes with style facets and generation cursors; spec memory has four explicit stages with graph, feedback, rescue, MMR, tier/state, and chunk-collapse semantics; code graph owns symbols, edges, traversal, bitemporal generations, and impact/context queries. Sharing those policies would create a lowest-common-denominator API or cross-domain coupling. [SOURCE: .opencode/skills/sk-design/styles/_db/retrieval.mjs:201-312] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/lib/search/pipeline/README.md:17-118] [SOURCE: .opencode/specs/system-code-graph/035-rust-backend-rewrite/001-research/spec.md:64-113]
3. A coherent pure core is smaller: canonical embedding-profile identity; deterministic text/image preprocessing; batch local inference; float-vector/blob encoding and validation; content-addressed model/artifact cache keys; optional exact top-k and ANN interfaces; and deterministic tie-break utilities. Storage schemas, SQL, feature flags, result DTOs, filters, fusion weights, graph traversal, and transport remain with each TypeScript shell. [INFERENCE: shared contracts and domain boundary comparison]
4. Rust is not necessary to define or share these contracts—the repository already shares TypeScript embedding interfaces across memory and skill-advisor. Rust becomes defensible when at least two systems need the same material native operation, most plausibly local text/image inference or one pinned vector-index implementation. Until then, a Rust crate creates versioning and distribution work without reuse evidence. [SOURCE: .opencode/skills/system-spec-kit/shared/embeddings/adapter.ts:1-13] [SOURCE: .opencode/skills/system-spec-kit/shared/embeddings/registry.ts:1-68]
5. Code graph's strongest possible Rust boundaries differ from styles: JavaScript-resident filesystem traversal, AST walking, capture allocation, node/edge construction, incremental dependency expansion, and orchestration sit between already-native WASM parsing and SQLite. These are not reusable vector-search primitives and must not be used to inflate the styles business case. [SOURCE: .opencode/specs/system-code-graph/035-rust-backend-rewrite/001-research/spec.md:64-92]
6. A shared sidecar is higher risk than a shared library. It adds lifecycle, protocol versioning, failure isolation, concurrency arbitration, model-memory contention, and deployment coupling across otherwise independent tools. A pure crate with separate thin napi-rs adapters preserves per-system fallback and release cadence; a sidecar is warranted only if sharing one loaded model materially reduces measured memory/startup cost. [INFERENCE: repository boundary standard and multi-consumer operations]
7. Gate verdict: do not start a “search core” at today's styles scale. First prove a local multimodal inference feature in sk-design. Extract domain-neutral Rust only after a second committed consumer adopts the same pinned model/profile and measured native workload. The shared core is a strategic integration option, not phase-one infrastructure. [INFERENCE: consumer-count and materiality gate]

## Ruled Out

- One cross-system ranking/fusion pipeline.
- Sharing SQLite schemas or domain result DTOs.
- Crediting code-graph AST/indexing costs to the styles Rust case.
- A multi-system sidecar before shared-model memory/startup measurements.
- A generic crate with only one consumer.

## Dead Ends

- Similar words such as “embedding,” “vector,” and “search” do not establish a stable shared abstraction.

## Edge Cases

- Ambiguous input: “search core” could mean provider contracts, vector primitives, retrieval policy, or a daemon. Only the first two are plausibly shared.
- Contradictory evidence: existing shared TypeScript embedding code proves reuse, but also proves Rust is not required to achieve it.
- Missing dependencies: code-graph phase-two query research is not present; no second consumer has committed to a matching local model.
- Partial success: share profile/DTO tests first; postpone binary code sharing.

## Sources Consulted

- `.opencode/skills/system-spec-kit/shared/embeddings/README.md`
- `.opencode/skills/system-spec-kit/shared/embeddings/adapter.ts`
- `.opencode/skills/system-spec-kit/shared/embeddings/registry.ts`
- `.opencode/skills/system-spec-kit/mcp-server/lib/search/pipeline/README.md`
- `.opencode/specs/system-code-graph/035-rust-backend-rewrite/001-research/spec.md`
- `.opencode/skills/sk-design/styles/_db/retrieval.mjs`

## Assessment

- New information ratio: 0.69
- Questions addressed: cross-system search core
- Questions answered: cross-system search core

## Reflection

- What worked and why: comparing actual contracts separated reusable native primitives from domain semantics.
- What did not work and why: the planned code-graph query research child is absent, so its future retrieval boundary remains unverified.
- What I would do differently: require a second consumer RFC with an identical model/profile and workload before naming the crate.

## Recommended Next Focus

Audit content-addressed caches and deterministic ranking proposals for net-new value versus existing TypeScript behavior.
