# Iteration 4: P1 Source-Routed Entity Extraction

## Focus
Test deterministic-first extraction doctrine.

## Actions Taken
Compared structured, semi-structured, and unstructured routes; traced provenance and ambiguity requirements.

## Findings
1. **[TEXT-CLAIMED][ADOPT]** Structured sources map deterministically; semi-structured sources use layout parsers with models only for messy cells; unstructured sources use staged entity/relation/event extraction. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-engineering-master/graph-engineering/references/extraction.md:12-21]
2. **[TEXT-CLAIMED][ADOPT]** Closed vocabularies use exact rules before LLM extraction. Every entity candidate carries surface form, canonical guess, type, source span, and confidence. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-engineering-master/graph-engineering/references/extraction.md:23-41]
3. **[TEXT-CLAIMED][REFINE]** “Exact match” is deterministic but not universally 100% precise when aliases or reused identifiers exist; treat the stated precision as a closed-vocabulary precondition, not an unconditional guarantee. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-engineering-master/graph-engineering/references/extraction.md:30-36]
4. **[INFERENCE: source pointers plus extraction configuration are necessary for replayable evidence production]** Each batch should bind source digest, parser/prompt version, ontology version, extraction time, and confidence rubric; GEM text directly requires the pointer but leaves the other version identities implicit.

## Questions Answered
- Source routing should be canonical and deterministic-first; LLM output remains evidence candidates.

## Questions Remaining
- Relation/event constraints and candidate quarantine.

## Ruled Out
- Running NLP over already structured data; one model path for every source type.

## Edge Cases
- Nested/discontinuous mentions and contextual ambiguity require evidence sentences rather than isolated surface matching.

## Sources Consulted
- GEM extraction reference and `/kg-extract` workflow. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-engineering-master/WORKFLOWS.md:80-95]

## Assessment
- New information ratio: 0.68
- Status: complete

## Reflection
The source router is a quality and cost boundary before it is an optimization.

## Recommended Next Focus
P1 relation and event extraction.
