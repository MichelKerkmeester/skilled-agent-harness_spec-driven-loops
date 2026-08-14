# Iteration 3: P1 Scope, Representation, and Modeling

## Focus
Build the first rows of the pipeline adopt/refine/reject matrix.

## Actions Taken
Read GEM's pipeline and modeling doctrine; checked its scope test against hybrid retrieval evidence.

## Findings
1. **[TEXT-CLAIMED][ADOPT] Scope/value gate.** Use a graph only for recurring entities, relationship-centric, multi-hop, temporal, or synthesis questions; use a table for aggregation or simple lookup. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-engineering-master/graph-engineering/SKILL.md:44-55] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-engineering-master/WORKFLOWS.md:47-62]
2. **[TEXT-CLAIMED][ADOPT] Representation decision.** Choose property graph, RDF, or typed JSON/SQLite before ingestion and decide how every fact carries time and provenance. Retrofitting provenance after fusion is described as effectively impossible. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-engineering-master/graph-engineering/SKILL.md:53-55] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-engineering-master/graph-engineering/references/modeling.md:23-28]
3. **[TEXT-CLAIMED][ADOPT] Competency questions.** Ten-to-twenty real questions are simultaneously ontology specification and acceptance corpus; every schema path must be walked against them. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-engineering-master/graph-engineering/references/modeling.md:30-47]
4. **[TEXT-CLAIMED][REFINE] Minimal ontology.** Precise verb relations, domain/range, cardinality, restrained hierarchy, and canonical naming are sound; the numeric type-count guidance is heuristic, not a runtime invariant. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-engineering-master/graph-engineering/references/modeling.md:49-59]
5. **[INFERENCE: studies 1–3 already bind executable graph IR versions, while GEM only names an ontology file as source of truth]** Ontology identity must become a versioned evidence dependency for extraction/evaluation, but not be conflated with executable graph IR or 036 policy identity.

## Questions Answered
- Adopt scope, representation, and competency-question gates; refine numeric heuristics; reject authority conflation.

## Questions Remaining
- How source routing and staged extraction preserve these constraints.

## Ruled Out
- A graph-first mandate for simple lookup or aggregation.

## Edge Cases
- A small project may collapse extraction stages, but ontology and fusion remain mandatory. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-engineering-master/graph-engineering/SKILL.md:44-47]

## Sources Consulted
- GEM SKILL, modeling reference, and `/kg-scope` workflow.

## Assessment
- New information ratio: 0.72
- Status: complete

## Reflection
The production plane begins with an evidence-product contract, not an extractor.

## Recommended Next Focus
P1 source-routed extraction and provenance capture.
