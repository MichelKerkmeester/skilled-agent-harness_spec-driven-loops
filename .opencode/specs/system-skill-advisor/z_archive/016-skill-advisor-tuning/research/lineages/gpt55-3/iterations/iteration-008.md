# Iteration 8: Metadata-Derived Command Bridges

## Focus
Angle 8. Replace hardcoded command bridges with a generated projection surface.

## Findings
1. `COMMAND_BRIDGES` hardcodes six command-like projection nodes directly in `projection.ts`. [SOURCE: file:.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/projection.ts:58]
2. Those hardcoded bridges are appended to SQLite projection results and filesystem projection results. [SOURCE: file:.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/projection.ts:620] [SOURCE: file:.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/projection.ts:692]
3. Executor delegation provides a precedent for metadata-derived alias tables: it builds active aliases from cli-family projection skill name variants, intent signals, and derived trigger phrases, plus model aliases from the filesystem. [SOURCE: file:.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/executor-delegation.ts:230]
4. The `/deep:research` command is currently rendered through a command contract script, implying command metadata can be compiled outside the scorer hot path. [SOURCE: file:.opencode/commands/deep/research.md:7]

## Proposal
Introduce a build/reindex-time `command_projection` table or JSON artifact with:
- command id, kind, family, category, description;
- command names and aliases from frontmatter/contract render;
- intent signals from allowed mode metadata;
- source path and lifecycle.

Then replace `COMMAND_BRIDGES` with `loadCommandBridgeProjection()` that reads the generated projection and falls back loud if missing in development/test.

## Sources Consulted
- `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/projection.ts`
- `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/executor-delegation.ts`
- `.opencode/commands/deep/research.md`

## Assessment
newInfoRatio: 0.36. Novelty: derives design from in-repo executor resolver precedent. Confidence: medium because command contract schema needs a separate read.

## Reflection
What worked: executor delegation provides a near-copyable pattern.
What failed: hot-path command markdown scanning would be the wrong abstraction.
Ruled out: read all command files inside `scoreAdvisorPrompt`.

## Recommended Next Focus
Map the three intent taxonomies.
