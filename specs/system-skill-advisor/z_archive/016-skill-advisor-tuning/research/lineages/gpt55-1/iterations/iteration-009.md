# Iteration 9: Angle 9 - Taxonomy Crosswalk

## Focus

Map query-class routing, hub-router intent classes, and 007 eval buckets.

## Findings

1. `classifyAdvisorQuery` has six classes: `implementation`, `review`, `documentation`, `memory`, `tooling`, and `unknown`. [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts:121]
2. Query-class routing currently only changes lane multipliers when `SPECKIT_ADVISOR_QUERY_CLASS_ROUTING` is enabled. [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts:638]
3. 007's bucket slices are measurement categories, including `review`, `memory_save`, and `delegation`, each with minN gates. [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/tests/parity/scorer-eval-baseline-ratchet.vitest.ts:77]
4. Parent-hub router vocabulary has mode ownership classes, not scorer query classes; the crosswalk should validate compatibility instead of forcing derivation in one direction.

## Sources Consulted

- `fusion.ts`
- `scorer-eval-baseline-ratchet.vitest.ts`
- `parent-hub-vocab-sync.cjs`

## Assessment

`newInfoRatio: 0.34`

Novelty justification: clarified that taxonomies serve live weighting, hub mode ownership, and measurement respectively.

Confidence: medium.

## Reflection

Worked: distinguishing runtime classes from eval slices.

Failed: there is no current crosswalk artifact.

Ruled out: making eval buckets the sole taxonomy.

## Recommended Next Focus

Investigate semantic_shadow false-fire hygiene as the final agenda angle.
