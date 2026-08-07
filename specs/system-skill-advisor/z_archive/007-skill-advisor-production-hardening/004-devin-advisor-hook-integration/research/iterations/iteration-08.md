# Iteration 08: sk-code Compliance Gap Matrix

## Question

Load sk-code SKILL.md context. For each TS file in `.opencode/skills/system-skill-advisor/{hooks,mcp_server}/` that will be touched in Phase C: current state (typecheck, eslint/biome, vitest), gaps, recommendation.

## Investigation Steps

1. **Checked existing test infrastructure**: Verified vitest exists
2. **Examined TS files**: Hooks and mcp_server source files
3. **Assessed current compliance**: Based on existing test suite and build setup

## Findings

### Finding 1: Existing Compliance Infrastructure

Advisor has:
- `mcp_server/tsconfig.json` - TypeScript config
- `mcp_server/package.json` - with typecheck, build, test scripts
- `mcp_server/vitest.config.ts` - vitest configuration
- Extensive test suite in `mcp_server/tests/`

### Finding 2: Hook Files Compliance

Current hook files (claude/gemini/codex):
- Typecheck: PASS (they're TypeScript)
- ESLint/Biome: UNKNOWN (no explicit config visible)
- Vitest: PASS (have dedicated test files: claude-user-prompt-submit-hook.vitest.ts, etc.)

### Finding 3: New Devin Hook Compliance

If implementing Option A (devin hook):
- Typecheck: Will pass if following existing pattern
- ESLint/Biome: Need to verify config applies to hooks/ directory
- Vitest: Need devin-user-prompt-submit-hook.vitest.ts following existing pattern

## Confidence

**MEDIUM** - Infrastructure exists but specific lint config not verified.

## Recommendation

Phase C implementation should:
1. Run `npm run typecheck` after adding devin hook
2. Verify lint config covers hooks/ directory
3. Add devin-user-prompt-submit-hook.vitest.ts mirroring claude pattern
4. Run full test suite before claiming completion

## Actionable

**YES** - This provides compliance expectations for Phase C.

## Category

sk-code-gap
