# Iteration 5: P1 Relations, Events, and Candidate Quarantine

## Focus
Close the modeling-to-extraction half of P1.

## Actions Taken
Audited relation endpoint constraints, event schemas, evidence spans, and unknown-concept handling.

## Findings
1. **[TEXT-CLAIMED][ADOPT]** Relation extraction may connect only entities already accepted by the entity pass, must use ontology relations, and must validate domain/range; co-occurrence is not assertion. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-engineering-master/graph-engineering/references/extraction.md:43-57]
2. **[TEXT-CLAIMED][ADOPT]** Repeated unmodeled relations belong in a side list for deliberate ontology review, not coerced into existing types. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-engineering-master/graph-engineering/references/extraction.md:52-57]
3. **[TEXT-CLAIMED][ADOPT]** Dynamic domains require first-class event nodes with triggers, typed argument roles, time anchors, and causal/temporal/conditional edges; flattening an n-ary event into pairwise edges loses event identity. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-engineering-master/graph-engineering/references/extraction.md:59-75]
4. **[TEXT-CLAIMED][ADOPT]** Separate entity, relation, and event passes prevent mega-prompt coupling and preserve stage-specific rejection. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-engineering-master/graph-engineering/references/extraction.md:77-98]
5. **[INFERENCE: candidate quarantine is non-authoritative and requires explicit promotion evidence]** Candidate recurrence may propose ontology change, but cannot silently expand accepted vocabulary or make a truth-bearing claim.

## Questions Answered
- The extraction pipeline is complete only when relation and event constraints are first-class and unknowns are quarantined.

## Questions Remaining
- Define knowledge-plane quality gates before fusion.

## Ruled Out
- Mega-prompt extraction; relation invention of endpoints; event flattening.

## Edge Cases
- A reported causal relation must remain distinguishable from actual causation. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-engineering-master/WORKFLOWS.md:114-128]

## Sources Consulted
- GEM extraction reference and event workflow.

## Assessment
- New information ratio: 0.64
- Status: complete

## Reflection
The ontology/extraction boundary must reject invalid shape before confidence scoring.

## Recommended Next Focus
P1/P4 knowledge quality gates.
