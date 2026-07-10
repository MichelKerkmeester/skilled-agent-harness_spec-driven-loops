# Iteration 8: Angle 8 - Command Bridge Hardcoding

## Focus

Assess the six hardcoded command bridges in `projection.ts` and derive a safer replacement from metadata.

## Findings

1. `projection.ts` hardcodes `COMMAND_BRIDGES` as inline `SkillProjection` objects. [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/projection.ts:58]
2. The hardcoded bridge list includes `command-spec-kit`, `memory:save`, `command-memory-save`, `create:agent`, `create:manual-testing-playbook`, and `deep-model-benchmark`. [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/projection.ts:58]
3. `buildExecutorAliasTable` is the closest in-repo precedent for deriving aliases from live projected metadata plus filesystem metadata while retaining suppression for archived entries. [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/executor-delegation.ts:230]
4. The executor alias code intentionally excludes derived keywords from alias matching to avoid overmatching file paths and doc names; command bridge derivation should apply the same exclusion. [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/executor-delegation.ts:245]

## Sources Consulted

- `projection.ts`
- `executor-delegation.ts`

## Assessment

`newInfoRatio: 0.42`

Novelty justification: identified a bounded derivation pattern that avoids arbitrary command-body scraping.

Confidence: medium.

## Reflection

Worked: leveraging an existing alias table pattern.

Failed: hardcoded command bridges are easy to reason about but drift-prone.

Ruled out: generating bridge aliases from arbitrary markdown body text.

## Recommended Next Focus

Map the three intent taxonomies so command and hub routing stay comparable.
