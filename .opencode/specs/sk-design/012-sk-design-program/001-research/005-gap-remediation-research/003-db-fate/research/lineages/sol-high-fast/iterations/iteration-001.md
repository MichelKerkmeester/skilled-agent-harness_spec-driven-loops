# Iteration 1: Actual Consumer Contract and Runtime Path

## Focus

Determine what the four design-mode corpus modules ask from the styles library and whether their contract inherently requires SQLite.

## Findings

1. All four consumers call the same storage-neutral `runQuery` and `runHydrate` facade. That facade delegates through `persistent-adapter.mjs`, so the consumer API already isolates backend choice; a keep or shelf decision need not change corpus-module call sites. [SOURCE: .opencode/skills/sk-design/styles/_engine/style-library.mjs:181-207]
2. Every mode forces `usage: 'reference'`, `exactReuse: false`, and a bounded `limit`; the workloads are selection-oriented, not open-ended analytics or bulk traversal. Interface, motion, and foundations ultimately select specifically identified cards, while audit builds only zero to two comparisons. [SOURCE: .opencode/skills/sk-design/design-interface/corpus/relational-exemplar.mjs:593-632] [SOURCE: .opencode/skills/sk-design/design-motion/corpus/motion-evidence.mjs:752-822] [SOURCE: .opencode/skills/sk-design/design-audit/corpus/comparison-lane.mjs:468-515] [SOURCE: .opencode/skills/sk-design/design-foundations/corpus/relationship-blueprint.mjs:818-867]
3. Generation identity is a hard semantic contract: every consumer rejects or degrades when `query.generationHash` differs from the context plan, and hydration repeats that generation hash. This favors preserving deterministic generation semantics, but not a specific storage technology. [SOURCE: .opencode/skills/sk-design/design-interface/corpus/relational-exemplar.mjs:622-647] [SOURCE: .opencode/skills/sk-design/design-motion/corpus/motion-evidence.mjs:808-822] [SOURCE: .opencode/skills/sk-design/design-audit/corpus/comparison-lane.mjs:503-515] [SOURCE: .opencode/skills/sk-design/design-foundations/corpus/relationship-blueprint.mjs:854-875]
4. Hydration remains flat-file based even after database selection: consumers request bounded `DESIGN.md`, `source.md`, and sometimes `design-tokens.json` content by ID and generation. SQLite is therefore an index/select layer, not the authoritative content store. [SOURCE: .opencode/skills/sk-design/design-interface/corpus/relational-exemplar.mjs:566-575] [SOURCE: .opencode/skills/sk-design/design-audit/corpus/comparison-lane.mjs:448-457] [SOURCE: .opencode/skills/sk-design/design-foundations/corpus/relationship-blueprint.mjs:798-807]
5. The current legacy query pays a freshness cost on every call: it loads the committed manifest, rebuilds a live manifest from the corpus, byte-compares both, then performs eligibility/ranking/card assembly. SQLite could remove repeated corpus-walk work from normal reads, but only if its generation is built and published reliably. [SOURCE: .opencode/skills/sk-design/styles/_engine/style-library.mjs:123-159]

## Ruled Out

- Treating the consumers as database-specific: their imported contract is the storage-neutral style-library facade.
- Treating SQLite as the content source: hydration still reads authoritative artifacts from the corpus.

## Dead Ends

- Rewriting the four design-mode modules as part of either option is unnecessary unless the response DTO changes, which the current adapter is designed to prevent.

## Edge Cases

- Ambiguous input: "single source" could mean metadata/index truth or content truth. This iteration distinguishes them: flat files remain content authority under both options.
- Contradictory evidence: none.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted

- `.opencode/skills/sk-design/styles/_engine/style-library.mjs:73-207`
- `.opencode/skills/sk-design/design-interface/corpus/relational-exemplar.mjs:535-659`
- `.opencode/skills/sk-design/design-motion/corpus/motion-evidence.mjs:700-834`
- `.opencode/skills/sk-design/design-audit/corpus/comparison-lane.mjs:420-539`
- `.opencode/skills/sk-design/design-foundations/corpus/relationship-blueprint.mjs:770-899`

## Assessment

- New information ratio: 1.00
- Novelty justification: First iteration established five new contract-level findings from the actual consumers.
- Questions addressed: consumer contract and workload.
- Questions answered: the consumers need a bounded, generation-safe query/hydration facade, not SQLite specifically.
- Confidence: high for static runtime behavior; call frequency in real design sessions is not instrumented here.

## Reflection

- What worked and why: tracing all consumers to the shared facade exposed stable invariants without assuming storage needs.
- What did not work and why: repository-wide wildcard Grep did not accept the initial include shape; a narrower exact call-site search resolved it.
- What I would do differently: inspect adapter and database internals next, preserving the facade as the fixed boundary.

## Recommended Next Focus

Assess persistent-backend completeness: database opening, indexing/build, query parity, hydration behavior, publish/rollback, and the exact missing default-path wiring.
