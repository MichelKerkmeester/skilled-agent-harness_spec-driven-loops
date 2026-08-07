# Iteration 9: Intent Taxonomy Crosswalk

## Focus

Investigate charter angle 9: query-class, hub-router intent classes, and 007 buckets.

## Findings

1. `classifyAdvisorQuery` produces coarse classes: `implementation`, `review`, `documentation`, `memory`, `tooling`, and `unknown` [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts:121].
2. Query classes only affect lane multipliers when `SPECKIT_ADVISOR_QUERY_CLASS_ROUTING` is enabled [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts:638].
3. Parent hub routers use mode-scoped vocabulary classes, such as `code-review-aliases`, `code-review-findings`, and `code-review-security` in `sk-code` [SOURCE: .opencode/skills/sk-code/hub-router.json:48].
4. 007's eval baseline tracks buckets like `review`, `memory_save`, and `delegation`, which are measurement buckets, not router modes [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/scripts/routing-accuracy/scorer-eval-baseline.json:36].
5. Full derivation would collapse distinct concepts; the safer contract is a crosswalk table plus drift guard that says which query classes and eval buckets each hub-router class is expected to influence.

## Sources Consulted

- `lib/scorer/fusion.ts`
- `sk-code/hub-router.json`
- `scripts/routing-accuracy/scorer-eval-baseline.json`

## Assessment

- newInfoRatio: 0.16
- Novelty: established why validation, not derivation, is the right relationship.
- Confidence: high.

## Reflection

- Worked: treating each taxonomy as purpose-specific.
- Failed: looking for a single source of truth would overconstrain the system.
- Ruled out: making query-class routing the hub router.

## Recommended Next Focus

Synthesize semantic-shadow hygiene and final proposal order.
