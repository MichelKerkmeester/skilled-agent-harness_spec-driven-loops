# Iteration 04: Plugin Rename Safety — Who Consumes the Legacy Name?

## Question

Grep all current code/docs/tests for references to `'spec-kit-skill-advisor'` (the legacy PLUGIN_ID string). Categorize hits as:
- **Source ownership** (the plugin file itself — needs rename)
- **Cross-reference** (tests, docs, INSTALL_GUIDE, etc. — needs update)
- **Backcompat consumer** (anything that imports/relies on the old name programmatically)
- **z_archive / changelog** (historical, hands-off)

Also list every env var: `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED`, `SPECKIT_SKILL_ADVISOR_PLUGIN_DISABLED` (legacy), etc. Decide which env vars get new `MK_SKILL_ADVISOR_*` aliases vs which stay as-is.

## Investigation Steps

1. **Grep for legacy name**: Searched for `spec-kit-skill-advisor` across the codebase (293 files found)
2. **Grep for legacy env var**: Searched for `SPECKIT_SKILL_ADVISOR_PLUGIN_DISABLED` (42 matches found)
3. **Read plugin file**: Examined `.opencode/plugins/spec-kit-skill-advisor.js` to understand the PLUGIN_ID constant
4. **Read bridge file**: Examined `.opencode/skills/system-spec-kit/mcp_server/plugin_bridges/spec-kit-skill-advisor-bridge.mjs`
5. **Read plugins README**: Checked `.opencode/plugins/README.md` for the table that needs updating
6. **Categorized hits**: Analyzed the grep results to categorize by type

## Findings

### Finding 1: Source Ownership (Needs Rename)

The plugin file itself needs renaming:
- Current: `.opencode/plugins/spec-kit-skill-advisor.js`
- Target: `.opencode/plugins/mk-skill-advisor.js`
- PLUGIN_ID constant at line 26: `const PLUGIN_ID = 'spec-kit-skill-advisor';`

**Evidence**: <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/spec-kit-skill-advisor.js" lines="26" />

### Finding 2: Bridge Module (Needs Rename)

The bridge module needs renaming:
- Current: `.opencode/skills/system-spec-kit/mcp_server/plugin_bridges/spec-kit-skill-advisor-bridge.mjs`
- Target: `.opencode/skills/system-skill-advisor/mcp_server/plugin_bridges/mk-skill-advisor-bridge.mjs`

Note: The bridge currently lives in `system-spec-kit` (legacy from pre-extraction). Per Q5, we need to decide whether to move it to `system-skill-advisor` as part of the rename.

**Evidence**: <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/plugin_bridges/spec-kit-skill-advisor-bridge.mjs" lines="1-50" />

### Finding 3: Cross-Reference Files (Needs Update)

The following files reference the legacy name and need updating:

**Docs**:
- `.opencode/plugins/README.md:43` - Table entry for `spec-kit-skill-advisor.js`
- `.opencode/plugins/README.md:52` - Bridge module list entry
- `.opencode/skills/system-skill-advisor/SET-UP_GUIDE.md:136` - OpenCode plugin reference
- `.opencode/skills/system-skill-advisor/INSTALL_GUIDE.md:142` - Plugin path reference
- `.opencode/skills/system-skill-advisor/feature_catalog/07--hooks-and-plugin/05-opencode-plugin-bridge.md` - Multiple references
- `.opencode/skills/system-skill-advisor/manual_testing_playbook/02--cli-hooks-and-plugin/005-opencode-plugin-bridge.md` - Multiple references

**Tests**:
- `.opencode/skills/system-skill-advisor/mcp_server/tests/spec-kit-skill-advisor-plugin.vitest.ts` - Test filename and imports
- `.opencode/skills/system-skill-advisor/mcp_server/tests/compat/plugin-bridge.vitest.ts` - Bridge test imports
- `.opencode/skills/system-skill-advisor/mcp_server/stress_test/skill-advisor/opencode-plugin-bridge-stress.vitest.ts` - Stress test imports
- `.opencode/skills/system-skill-advisor/mcp_server/tests/compat/plugin-bridge-smoke.vitest.ts` - Smoke test imports

**Spec docs** (current packet):
- Current packet spec/docs reference the old name (expected, will be updated in Phase B)

**Evidence**: Grep results show 293 files total; key cross-references listed above.

### Finding 4: Backcompat Consumer (Env Var)

The env var `SPECKIT_SKILL_ADVISOR_PLUGIN_DISABLED` is used in:
- The plugin file itself (disable logic)
- Test files (env snapshot/restore)
- Feature catalog documentation
- Manual testing playbook

Current env vars:
- `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED` - Current canonical disable flag
- `SPECKIT_SKILL_ADVISOR_PLUGIN_DISABLED` - Legacy alias (documented as one-release legacy alias in research notes)

**Evidence**: Grep for `SPECKIT_SKILL_ADVISOR_PLUGIN_DISABLED` shows 42 matches across tests, docs, and the plugin itself.

### Finding 5: z_archive / Changelog (Hands-Off)

Historical references in:
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/022-system-skill-advisor-extraction/` - Extraction packet docs
- `.opencode/skills/system-spec-kit/changelog/v3.4.1.0.md` - Historical changelog
- Various completed packet spec/docs in `026-graph-and-context-optimization/`

These should NOT be updated per the "hands-off historical" rule.

**Evidence**: Grep results show multiple spec folder and changelog references.

### Finding 6: Env Var Alias Strategy

**Recommendation**:
1. Retain `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED` as the canonical hook disable flag (no change)
2. Retain `SPECKIT_SKILL_ADVISOR_PLUGIN_DISABLED` as a legacy alias for backcompat (no change)
3. Add new `MK_SKILL_ADVISOR_HOOK_DISABLED` as a canonical alias aligned with the MCP server name
4. Add new `MK_SKILL_ADVISOR_PLUGIN_DISABLED` as a canonical alias aligned with the new plugin name

This provides:
- Backcompat for existing scripts/settings using old names
- Forward-compatibility with the new naming
- Clear alignment between env var prefixes and component names (MK_* for mk_skill_advisor)

**Evidence**: Inferred from existing pattern (SPECKIT_* prefixes for spec-kit era) and the plan's mention of "legacy env-var consumers still use SPECKIT_SKILL_ADVISOR_PLUGIN_DISABLED" in spec.md:183.

### Finding 7: Touch List Summary

**Source ownership (rename)**:
1. `.opencode/plugins/spec-kit-skill-advisor.js` → `.opencode/plugins/mk-skill-advisor.js`
2. `.opencode/skills/system-spec-kit/mcp_server/plugin_bridges/spec-kit-skill-advisor-bridge.mjs` → `.opencode/skills/system-skill-advisor/mcp_server/plugin_bridges/mk-skill-advisor-bridge.mjs`

**Cross-reference (update)**:
1. `.opencode/plugins/README.md` - Table entries (lines 43, 52)
2. `.opencode/skills/system-skill-advisor/SET-UP_GUIDE.md` - Plugin path reference
3. `.opencode/skills/system-skill-advisor/INSTALL_GUIDE.md` - Plugin path reference
4. `.opencode/skills/system-skill-advisor/feature_catalog/07--hooks-and-plugin/05-opencode-plugin-bridge.md` - Multiple references
5. `.opencode/skills/system-skill-advisor/manual_testing_playbook/02--cli-hooks-and-plugin/005-opencode-plugin-bridge.md` - Multiple references
6. `.opencode/skills/system-skill-advisor/mcp_server/tests/spec-kit-skill-advisor-plugin.vitest.ts` - Filename and imports
7. `.opencode/skills/system-skill-advisor/mcp_server/tests/compat/plugin-bridge.vitest.ts` - Imports
8. `.opencode/skills/system-skill-advisor/mcp_server/stress_test/skill-advisor/opencode-plugin-bridge-stress.vitest.ts` - Imports
9. `.opencode/skills/system-skill-advisor/mcp_server/tests/compat/plugin-bridge-smoke.vitest.ts` - Imports
10. `.opencode/skills/system-spec-kit/mcp_server/plugin_bridges/README.md` - Bridge list entry
11. `.opencode/skills/system-spec-kit/references/hooks/skill-advisor-hook.md` - References
12. `.opencode/skills/system-spec-kit/references/hooks/skill-advisor-hook-validation.md` - References

**Backcompat consumer (env var handling)**:
- Add `MK_SKILL_ADVISOR_HOOK_DISABLED` as new canonical alias
- Add `MK_SKILL_ADVISOR_PLUGIN_DISABLED` as new canonical alias
- Retain existing `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED` and `SPECKIT_SKILL_ADVISOR_PLUGIN_DISABLED` for backcompat

**z_archive / changelog (hands-off)**:
- Do NOT update spec folder historical references
- Do NOT update changelog historical references

## Confidence

**HIGH** - The grep results are comprehensive and the categorization is straightforward. The env var strategy follows established patterns.

## Open Follow-Ups

1. Should the test file `spec-kit-skill-advisor-plugin.vitest.ts` be renamed to `mk-skill-advisor-plugin.vitest.ts` for consistency?
2. Should we add a deprecation warning when the legacy env vars are used, or silently accept them?

## Recommendation

Proceed with the touch list in Finding 7. Add the new MK_* env var aliases alongside the existing SPECKIT_* aliases for backcompat. Do NOT update historical spec folder or changelog references.

## Actionable

**YES** - This finding provides the complete touch list and env var strategy needed for Phase B decision-record.md and Phase C implementation.

## Category

rename-safety
