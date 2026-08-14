# Iteration 18: P7 Integrated Staged Rollout

## Focus
Translate curriculum order into deployment evidence without displacing the runtime promotion plan.

## Actions Taken
Mapped the nine-stage course, pilot-first rule, and studies 1–3 shadow-first delivery.

## Findings
1. **[TEXT-CLAIMED][ADOPT]** GEM maps theory/value → representation → ontology → entity/relation/event extraction → quality → fusion → LLM serving, reflecting acquisition, quality, and application bottlenecks. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-engineering-master/graph-engineering/references/curriculum.md:8-18] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-engineering-master/graph-engineering/references/curriculum.md:76-88]
2. **[TEXT-CLAIMED][ADOPT]** Process a ten-document pilot through all nine stages before scaling; do not skip ontology or fusion; the LLM is machinery inside the pipeline. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-engineering-master/graph-engineering/SKILL.md:44-47] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-engineering-master/graph-engineering/SKILL.md:92-102]
3. **[TEXT-CLAIMED][CONFIRM]** Studies 1–3 require deterministic IR, dark/shadow execution, negative controls, causal parity, reversible canaries, selected-writer/effect canaries, and a separate 036 cutover. [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/research.md:131-143] [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/research.md:192-207]
4. **[INFERENCE: the rollout has two orthogonal maturity axes]** Knowledge-product maturity progresses K0 scope/competency corpus, K1 representation/ontology, K2 source-routed pilot, K3 quality gate, K4 reversible fusion, K5 hybrid serving evaluation, K6 incremental maintenance. Runtime promotion progresses G0–G7 under studies 1–3. A release requires the relevant K and G gates; neither axis substitutes for the other.

## Questions Answered
- P7 supports an integrated two-axis rollout, not a reordered authority migration.

## Questions Remaining
- Corpus completeness and explicit when-not-use boundaries.

## Ruled Out
- Big-bang ingestion; production GraphRAG before pilot quality/fusion; using curriculum completion as runtime cutover proof.

## Edge Cases
- A mature knowledge product may be served through legacy/vector paths while graph runtime remains shadow-only.

## Sources Consulted
- Curriculum, GEM skill, study 3 rollout.

## Assessment
- New information ratio: 0.15
- Status: insight

## Reflection
The two-axis model is the curriculum's strongest deployment contribution.

## Recommended Next Focus
All-corpus completeness and when-not-use audit.
