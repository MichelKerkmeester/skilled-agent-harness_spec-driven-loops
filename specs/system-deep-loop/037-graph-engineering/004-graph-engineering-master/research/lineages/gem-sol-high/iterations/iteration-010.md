# Iteration 10: P2 Four-Valued Belief Boundary

## Focus
Clarify how fused evidence feeds purpose-bound belief without collapsing contradiction.

## Actions Taken
Audited study-2 belief doctrine and runtime relationship evidence semantics.

## Findings
1. **[TEXT-CLAIMED][CONFIRM]** Runtime relationship evidence records distinguish supporting, refuting, and qualifying positions and preserve assertion and withdrawal evidence separately. [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/contradiction-supersession/types.ts:19-39] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/contradiction-supersession/types.ts:150-168]
2. **[TEXT-CLAIMED][CONFIRM]** Contradiction is symmetric, while supersession is a directed predecessor-to-successor relation with stable identities; active supersession must remain acyclic. [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/contradiction-supersession/event-registry.ts:156-190] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/contradiction-supersession/projection.ts:216-250]
3. **[INFERENCE: GEM's merge confidence is evidence about identity, not one of IN/OUT/BOTH/NEITHER]** Identity decisions may change which evidence is grouped, but the settlement engine must recompute purpose-bound belief from the grouped assertions and their contradiction/supersession relations.
4. **[TEXT-CLAIMED][REFINE]** GEM's conflict-preserving merge policy is compatible with BOTH/contested belief, but it lacks required-answer blockers, checked quiescence, and prospective nogood admission. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/research.md:537-547]

## Questions Answered
- P2 separation is complete: identity proposal → evidence grouping → belief settlement → authority admission.

## Questions Remaining
- P3 ontology versioning and dependency behavior.

## Ruled Out
- Encoding fusion confidence directly as belief status; overwriting refuted evidence.

## Edge Cases
- Identity split/merge reversal requires belief recomputation without rewriting immutable source evidence.

## Sources Consulted
- Runtime contradiction/supersession types, registry, projection; study 2.

## Assessment
- New information ratio: 0.47
- Status: complete

## Reflection
The runtime already supplies the relationship vocabulary GEM needs downstream, but not identity resolution itself.

## Recommended Next Focus
P3 ontology as specification and versioned dependency.
