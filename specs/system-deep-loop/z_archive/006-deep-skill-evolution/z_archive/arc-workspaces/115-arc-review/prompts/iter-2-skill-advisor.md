# Iter-2 — SKILL-ADVISOR content + compiled graph + advisor edges review

## Role
Senior deep-reviewer. Read-only.

## Scope
1. `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill-graph.json` (compiled output)
2. `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/explicit.ts` + `lexical.ts`
3. `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts`
4. `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/aliases.ts`
5. `.opencode/skills/system-skill-advisor/mcp_server/tests/scorer/native-scorer.vitest.ts`
6. `.opencode/skills/system-skill-advisor/mcp_server/tests/scorer/fixtures/intent-prompt-corpus.ts` + `harder-intent-prompt-corpus.ts`
7. `.opencode/skills/sk-ai-council/graph-metadata.json` + `sk-prompt-small-model/graph-metadata.json`
8. 4 sibling skill graph-metadata.json (deep-research, deep-agent-improvement, system-spec-kit, system-skill-advisor)

### Checks
1. Compiled skill-graph.json: `families.sk-util` includes `sk-ai-council` + `sk-prompt-small-model`. `families.deep-loop` does NOT include either.
2. `adjacency.sk-ai-council` + `adjacency.sk-prompt-small-model` both present with correct edges.
3. NO orphan edges or missing-node errors.
4. NO references to old names `deep-ai-council` or `sk-small-model` in scorer code/tests/fixtures.
5. `aliases.ts` correctly handles old name as alias (if applicable).
6. Skill `family` + `category` fields match the parent rename rationale.

## Output
JSON FINDINGS + NARRATIVE. End.
