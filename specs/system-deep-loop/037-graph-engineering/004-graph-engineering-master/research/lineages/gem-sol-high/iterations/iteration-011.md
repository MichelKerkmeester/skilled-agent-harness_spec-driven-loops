# Iteration 11: P3 Ontology as Specification

## Focus
Determine which ontology artifacts are load-bearing specifications.

## Actions Taken
Mapped competency questions, schema rules, prompts, and evaluation back to one ontology source.

## Findings
1. **[TEXT-CLAIMED][ADOPT]** Competency questions are both ontology spec and test suite; missing traversals expose missing types or relations. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-engineering-master/graph-engineering/references/modeling.md:30-47]
2. **[TEXT-CLAIMED][ADOPT]** The ontology declares precise relation verbs, domain/range, cardinality, canonical-name rules, and minimal hierarchy, and is embedded verbatim in extraction prompts. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-engineering-master/graph-engineering/references/modeling.md:49-59]
3. **[TEXT-CLAIMED][REFINE]** LLM-induced schemas require evidence quotes and manual pruning; they are proposals, not accepted schema. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-engineering-master/graph-engineering/references/modeling.md:80-86]
4. **[INFERENCE: the ontology governs extraction validity and evaluation interpretation]** Its accepted version is a dependency of every producer, fusion decision, competency test, and serving result; changing it invalidates downstream comparability until re-evaluated.

## Questions Answered
- Ontology is the knowledge-plane specification, not merely documentation.

## Questions Remaining
- Version/change semantics without inventing a wire format.

## Ruled Out
- Auto-accepting induced schemas; treating ontology prompts as free-form context.

## Edge Cases
- Cross-graph fusion requires schema alignment before instance decisions.

## Sources Consulted
- GEM modeling and fusion references.

## Assessment
- New information ratio: 0.43
- Status: complete

## Reflection
The ontology's load-bearing role follows from its consumers, even though GEM does not define runtime version envelopes.

## Recommended Next Focus
P3 ontology versioning and compatibility.
