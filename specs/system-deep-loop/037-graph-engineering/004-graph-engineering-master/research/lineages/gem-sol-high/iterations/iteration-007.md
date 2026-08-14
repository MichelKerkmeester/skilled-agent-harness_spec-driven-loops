# Iteration 7: P1 Fusion Pipeline

## Focus
Evaluate the fusion stage as a production boundary.

## Actions Taken
Traced blocking, matching, merge policy, ontology alignment, and error asymmetry.

## Findings
1. **[TEXT-CLAIMED][ADOPT]** Candidate blocking avoids all-pairs comparison; matching layers string, attributes, neighborhoods, and model adjudication only for the ambiguous band. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-engineering-master/graph-engineering/references/fusion-and-llm.md:20-34]
2. **[TEXT-CLAIMED][ADOPT]** Merge policy is deterministic: retain canonical name, aliases, edges, and conflicting source values with provenance; record `merged_from` for undo. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-engineering-master/graph-engineering/references/fusion-and-llm.md:35-41]
3. **[TEXT-CLAIMED][ADOPT]** Schema fusion aligns types/relations before translating and merging instances. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-engineering-master/graph-engineering/references/fusion-and-llm.md:43-49]
4. **[TEXT-CLAIMED][REFINE]** An erroneous merge is treated as more damaging than a missed merge; therefore thresholds need explicit auto-merge, review, and reject bands with measured false-merge cost. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-engineering-master/WORKFLOWS.md:130-146]
5. **[INFERENCE: reversible provenance-preserving fusion requires immutable source assertions plus a derived canonical-entity projection]** Do not destroy evidence records when canonical identities change; rebuild the fused projection from recorded decisions.

## Questions Answered
- Adopt the full fusion sequence and make reversibility a release gate.

## Questions Remaining
- How to serve and evaluate the fused graph.

## Ruled Out
- Silent overwrite, model-owned merge policy, instance fusion before schema alignment.

## Edge Cases
- Same names with disjoint neighborhoods must not be auto-merged.

## Sources Consulted
- Fusion reference and `/kg-fuse` workflow.

## Assessment
- New information ratio: 0.58
- Status: complete

## Reflection
Fusion is a truth-maintenance proposal layer, not truth settlement itself.

## Recommended Next Focus
P1 GraphRAG serving and hybrid routing.
