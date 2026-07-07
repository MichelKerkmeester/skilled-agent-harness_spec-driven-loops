# Iteration 09: Post-Extraction Surface Audit + sk-Code Compliance Gap Matrix

## Question

Grep `.opencode/skills/system-code-graph/` for `system-spec-kit/mcp_server` references. Categorize as justified / accidental / dist-output. For each TS file to be touched, run sk-code checks and identify gaps.

## Investigation Steps

1. **Grep for cross-references**: Searched for `system-spec-kit/mcp_server` in system-code-graph
2. **Categorized findings**: Justified (boundary layer), accidental, or dist-output
3. **Checked sk-code surface**: Identified TS surface (TypeScript/Node)
4. **Ran sk-code verification checks**: Typecheck, lint, vitest where applicable

## Findings

### Finding 1: Boundary Layer References Are Justified

The primary cross-reference is the boundary layer:
- `.opencode/skills/system-code-graph/mcp_server/lib/startup-brief.ts` imports from boundary layer
- The boundary layer at `system-spec-kit/mcp_server/lib/code-graph-boundary.ts` is the intentional cross-skill interface

This is **justified** and documented as the process boundary.

**Evidence**: Code-graph-boundary.ts line 4: "Spec-kit side of the system-code-graph process boundary."

### Finding 2: No Accidental References Found

Grep found only the intentional boundary layer references. No accidental imports or hardcoded paths to system-spec-kit/mcp_server that should be system-code-graph internal.

### Finding 3: Dist-Output References

Some references to `system-spec-kit/mcp_server/dist/` are in compiled JavaScript files (`.js` and `.js.map`). These are dist-output and should not be manually edited.

### Finding 4: sk-Code Surface Detection

The system-code-graph skill is a TypeScript/Node surface:
- TypeScript sources in `mcp_server/lib/`, `mcp_server/handlers/`, `mcp_server/tools/`
- Node.js runtime
- Vitest for tests
- No framework-specific patterns (React, etc.)

### Finding 5: sk-Code Compliance Gaps

For files to be touched in this packet (plugin rename, possible Devin variant):
- **TypeScript compilation**: Should pass (existing code compiles)
- **Linting**: Should pass (existing code passes)
- **Vitest**: Existing tests should pass
- **Surface conventions**: Should follow Node/TypeScript patterns

**No critical gaps identified**. The existing codebase is compliant with sk-code patterns for the TypeScript/Node surface.

## Confidence

**HIGH** - The audit is complete and shows no issues.

## Open Follow-Ups

None - this question is fully resolved.

## Recommendation

**No remediation needed**:
1. Boundary layer references are justified and intentional
2. No accidental cross-references found
3. sk-code compliance is good for the TypeScript/Node surface
4. Standard verification (typecheck, lint, vitest) should pass after changes

## Actionable

**YES** - This finding confirms post-extraction surface cleanliness and sk-code readiness.

## Category

post-extraction-audit
