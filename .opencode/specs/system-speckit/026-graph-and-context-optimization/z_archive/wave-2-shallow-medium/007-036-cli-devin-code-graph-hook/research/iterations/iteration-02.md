# Iteration 02: Hook Source Migration ADR — `system-spec-kit/mcp_server/hooks/` → `system-code-graph/hooks/`?

## Question

The SessionStart hooks (`claude/session-prime.ts`, `gemini/session-prime.ts`, `codex/session-start.ts`) currently live under `system-spec-kit/mcp_server/hooks/` even though the data layer (readiness marker, code graph database) extracted to `system-code-graph/`. They import from `system-code-graph/mcp_server/lib/code-graph-boundary.js` (via the spec-kit boundary layer).

**Decision**: Should we migrate hook source to `.opencode/skills/system-code-graph/hooks/{claude,gemini,codex,devin}/` (Option A) or keep at current location and add only Devin variant (Option B)?

## Investigation Steps

1. **Examined current hook locations**: Listed `.opencode/skills/system-spec-kit/mcp_server/hooks/` and `.opencode/skills/system-code-graph/hooks/` (which does not exist)
2. **Checked advisor pattern**: Verified that advisor hooks are skill-owned at `.opencode/skills/system-skill-advisor/hooks/{claude,gemini,codex}/`
3. **Analyzed import dependencies**: Read session-prime.ts imports and the code-graph-boundary.ts boundary layer
4. **Checked build configuration**: Examined system-spec-kit package.json and finalize-dist.mjs to understand compilation setup
5. **Surveyed path references**: Grep for `system-spec-kit/mcp_server/dist/hooks` to assess migration scope
6. **Reviewed registration paths**: Checked `.claude/settings.local.json` hook command paths

## Findings

### Finding 1: Code-Graph Has No Hooks Directory

`.opencode/skills/system-code-graph/hooks/` does not exist. The skill currently has no hook source directory at all.

**Evidence**: `ls -la .opencode/skills/system-code-graph/hooks/` returns "No such file or directory".

### Finding 2: Advisor Pattern is Skill-Owned Hooks

The advisor skill (which was also extracted from system-spec-kit) follows the skill-owned pattern:

- `.opencode/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts`
- `.opencode/skills/system-skill-advisor/hooks/gemini/user-prompt-submit.ts`
- `.opencode/skills/system-skill-advisor/hooks/codex/user-prompt-submit.ts`

This matches the intended post-extraction pattern.

**Evidence**: <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/hooks/" />

### Finding 3: Current Code-Graph Hooks are Partial-Extraction Residue

The SessionStart hooks live under `system-spec-kit/mcp_server/hooks/{claude,gemini,codex}/` even though:
- The data layer (readiness marker at `system-code-graph/mcp_server/database/.code-graph-readiness.json`) extracted to system-code-graph
- The startup brief builder (`system-code-graph/mcp_server/lib/startup-brief.ts`) lives in system-code-graph
- The MCP server (`mk-code-index`) is owned by system-code-graph

This is explicitly identified as "partial-extraction residue" in the plan.

**Evidence**: Plan §2 Insight states: "Anomaly: the SessionStart hook variants for Claude/Gemini/Codex still live under `.opencode/skills/system-spec-kit/mcp_server/hooks/{claude,gemini,codex}/session-prime.ts` even though the data layer extracted to `system-code-graph/`."

### Finding 4: Hooks Import via Boundary Layer

The session-prime.ts hook imports from the spec-kit boundary layer:

```typescript
import { getStartupBriefFromMarker } from '../../lib/code-graph-boundary.js';
```

The boundary layer (`system-spec-kit/mcp_server/lib/code-graph-boundary.ts`) is explicitly documented as "Spec-kit side of the system-code-graph process boundary" and reads from the system-code-graph database directory:

```typescript
const MARKER_BASE_DIR = fileURLToPath(new URL(
  '../../../system-code-graph/mcp_server/database/',
  import.meta.url,
));
```

**Evidence**: <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-prime.ts" line="26" /> and <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/lib/code-graph-boundary.ts" lines="4,30-36" />

### Finding 5: Build Process Bundles System-Code-Graph

The system-spec-kit build process bundles system-code-graph as a sibling:

```javascript
const bundledSiblingNames = new Set(['system-code-graph', 'system-skill-advisor']);
```

This means system-spec-kit's TypeScript compilation includes system-code-graph sources, and the finalize-dist script rewrites sibling import paths.

**Evidence**: <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/scripts/finalize-dist.mjs" lines="13,52" />

### Finding 6: Migration Scope is Large

Grep found 110+ files referencing `system-spec-kit/mcp_server/dist/hooks`, including:
- `.claude/settings.local.json` - hook registration paths
- Test files in system-spec-kit/mcp_server/tests/
- Documentation in hook READMEs
- Feature catalog entries
- Manual testing playbooks

**Evidence**: Grep returned 110+ matches across docs, tests, and config files.

### Finding 7: Option A (Migrate to Skill-Owned) Advantages

**Ownership clarity**: Hooks would live in the skill that owns the data layer and MCP server, matching the advisor pattern.

**Future-update flow**: Updates to startup brief logic would be co-located with the data layer they depend on, reducing cross-boundary coordination.

**Breaking change risk**: HIGH - requires atomically updating:
- `.claude/settings.local.json` command paths (lines 56-67 for SessionStart)
- All test file import paths
- All documentation references
- The build configuration (finalize-dist.mjs sibling bundling)

**Dist target relocation**: Hooks would compile to `system-code-graph/mcp_server/dist/hooks/` instead of `system-spec-kit/mcp_server/dist/hooks/`, requiring build script changes.

### Finding 8: Option B (Keep Current Location) Advantages

**Zero breaking changes**: No risk to existing Claude/Gemini/Codex hook registrations.

**Build stability**: No changes needed to finalize-dist.mjs sibling bundling logic.

**Lower risk**: Only add Devin variant (either via inheritance or explicit variant), leaving existing hooks untouched.

**Disadvantages**:
- **Asymmetry**: Code-graph hooks live in system-spec-kit while advisor hooks live in their own skill
- **Cross-boundary ownership**: Hook source lives in a different skill than the data layer it depends on
- **Future confusion**: Developers may not understand why code-graph hooks are in system-spec-kit

### Finding 9: No Boundary Layer in System-Code-Graph

System-code-graph does not have an equivalent boundary layer. If we migrate hooks, they would need to:
- Import directly from system-code-graph lib (e.g., `../lib/startup-brief.ts`)
- Or create a new boundary layer in system-code-graph

The current boundary layer in system-spec-kit serves as the cross-skill interface.

**Evidence**: `ls -la .opencode/skills/system-code-graph/mcp_server/lib/` shows no code-graph-boundary.ts file.

## Confidence

**MEDIUM-HIGH** - The technical implications are clear, but the decision involves trade-offs between symmetry (Option A) and stability (Option B). The large migration scope and breaking change risk are significant factors.

## Open Follow-Ups

1. If Option A is chosen, should we create a new boundary layer in system-code-graph or have hooks import directly from lib?
2. If Option A is chosen, what's the rollback plan if the migration breaks existing hook behavior?
3. Does the build process need changes to support hooks compiling to a different dist target?

## Recommendation

**Option B (Keep Current Location)** with the following rationale:

**Primary recommendation**: Keep the existing SessionStart hooks in `system-spec-kit/mcp_server/hooks/` and add only the Devin variant (either via inheritance per Q1 finding or as an explicit variant in the same location).

**Rationale**:
1. **Breaking change risk**: The migration scope is large (110+ file references) and includes the critical `.claude/settings.local.json` registration path
2. **Build complexity**: The finalize-dist.mjs sibling bundling logic would need updates to support hooks compiling to a different dist target
3. **Boundary layer dependency**: The hooks currently depend on the spec-kit boundary layer; migrating would require either creating a new boundary in system-code-graph or refactoring imports
4. **Stability priority**: The hooks are working correctly for Claude/Gemini/Codex; migration introduces risk without clear benefit
5. **Devin variant can be added locally**: The Devin variant can be added to the existing `system-spec-kit/mcp_server/hooks/` structure (either as inheritance or explicit devin/ subdirectory)

**Mitigation for asymmetry**: Document the architectural decision in decision-record.md as ADR-001, explaining that:
- Advisor hooks were fully migrated (skill-owned) because they had no boundary layer dependencies
- Code-graph hooks remain in system-spec-kit due to boundary layer dependencies and build complexity
- This is a deliberate trade-off favoring stability over symmetry

**Future path**: If system-code-graph later develops its own build setup and boundary layer, a future packet can migrate the hooks with lower risk.

## Actionable

**YES** - This finding directly informs the ADR-001 draft for decision-record.md and determines whether we need to plan a large migration or focus only on adding the Devin variant.

## Category

architecture-decision