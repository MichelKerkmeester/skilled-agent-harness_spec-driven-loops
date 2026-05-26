# Iteration 06: Post-Extraction Surface Audit

## Question

Grep `.opencode/skills/system-skill-advisor/` for any path containing `system-spec-kit/mcp_server`. For each hit: file path + line number, exact path referenced, categorize (justified, accidental, dist-output). Also check `.claude/settings.local.json` for advisor-related command paths that still point to `system-spec-kit/mcp_server/dist/hooks/claude/user-prompt-submit.js`.

## Investigation Steps

1. **Grep for system-spec-kit/mcp_server**: Found 20 matches in advisor code
2. **Categorized each hit**: Analyzed context to determine if justified, accidental, or dist-output

## Findings

### Finding 1: Bridge Path References (Accidental - Fixed by Q5)

Test files reference the old bridge location:
- `mcp_server/tests/compat/plugin-bridge-smoke.vitest.ts:30`
- `mcp_server/tests/compat/plugin-bridge.vitest.ts:13`

These will be fixed when the bridge moves to system-skill-advisor per Q5.

### Finding 2: Shared Utility Imports (Justified)

Lib files import from system-spec-kit shared utilities:
- `mcp_server/lib/freshness.ts:22` - imports `shared-payload.js`
- `mcp_server/lib/skill-advisor-brief.ts:14` - imports `shared-payload.js`

This is justified - these are shared utilities that haven't been extracted yet.

### Finding 3: Build Commands in Docs (Justified)

SET-UP_GUIDE and manual testing playbook reference system-spec-kit build commands:
- `SET-UP_GUIDE.md:72-73,246,249` - npm install/build commands
- Manual testing playbook - npm build commands

This is justified - advisor's tsconfig extends system-spec-kit, so build happens there.

### Finding 4: Test Directory References (Accidental - Legacy)

Test READMEs reference system-spec-kit test directories:
- `mcp_server/tests/schemas/README.md:71`
- `mcp_server/tests/parity/README.md:71`
- `mcp_server/tests/legacy/README.md:79`
- `mcp_server/stress_test/skill-advisor/README.md:156`

These are legacy from pre-extraction; tests now live in advisor directory.

### Finding 5: Claude Hook Registration (Accidental - Shim)

`.claude/settings.local.json:38` points to:
`.opencode/skills/system-spec-kit/mcp_server/dist/hooks/claude/user-prompt-submit.js`

This is the shim discovered in Q3 - it forwards to the advisor implementation. This is intentional for backward compatibility but could be updated to point directly to advisor dist.

## Confidence

**HIGH** - Categorization is straightforward based on context.

## Recommendation

**Fix in Phase C**:
1. Bridge path references - fixed by Q5 rename + move
2. Test directory references - update to point to advisor test directories
3. Claude hook registration - update to point directly to advisor dist (optional, shim is fine for backcompat)
4. Shared utility imports - leave as-is (justified)
5. Build commands - leave as-is (justified)

## Actionable

**YES** - This finding provides the remediation list for Phase C.

## Category

post-extraction-audit
