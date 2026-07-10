# Iteration 8: Command Bridge Derivation

## Focus

Investigate charter angle 8: hardcoded command bridges in projection.

## Findings

1. `projection.ts` declares six command bridges inline: `command-spec-kit`, `memory:save`, `command-memory-save`, `create:agent`, `create:manual-testing-playbook`, and `deep-model-benchmark` [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/projection.ts:58].
2. SQLite projection appends those bridges after DB skills, so they bypass skill-graph indexing and cannot be refreshed by reindex [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/projection.ts:613].
3. Filesystem projection appends the same bridges, so the hardcoded list is also present in fallback mode [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/projection.ts:692].
4. The executor delegation resolver demonstrates the desired precedent: derive active aliases from projection metadata and model profiles, cache filesystem pieces, and filter alias shapes [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/executor-delegation.ts:17] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/executor-delegation.ts:231].
5. The `deep-loop-workflows` registry already records command bridges by mode for command-bridge routing classes [SOURCE: .opencode/skills/deep-loop-workflows/mode-registry.json:146].

## Sources Consulted

- `lib/scorer/projection.ts`
- `lib/scorer/executor-delegation.ts`
- `deep-loop-workflows/mode-registry.json`

## Assessment

- newInfoRatio: 0.24
- Novelty: identified a migration precedent inside the scorer itself.
- Confidence: medium; command metadata inventory needs implementation-time confirmation.

## Reflection

- Worked: comparing command bridge hardcoding to executor alias derivation.
- Failed: no command metadata generator was run.
- Ruled out: continuing to grow `COMMAND_BRIDGES` as literals.

## Recommended Next Focus

Create a taxonomy crosswalk for query class, hub-router intent classes, and eval buckets.
