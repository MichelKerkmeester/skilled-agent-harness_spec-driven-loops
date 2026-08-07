# Iteration 02: Devin Variant Source Location ADR Input

## Question

Should the Devin hook source live at:
- **A**: `.opencode/skills/system-skill-advisor/hooks/devin/user-prompt-submit.ts` (skill-owned, mirrors claude/gemini/codex variants)
- **B**: `.devin/hooks/scripts/user-prompt-submit.js` (Devin-local, runtime-owned)
- **C**: Reuse compiled Claude variant via Devin's `read_config_from.claude=true` (zero new code)

Compare on: code locality (where future updates flow), runtime contract clarity, diagnostic JSONL isolation, test coverage location, deletion safety post-deprecation. Recommend one with rationale.

## Investigation Steps

1. **Examined existing hook variants**: Read Claude, Gemini, and Codex hook implementations to understand the current pattern
2. **Checked hooks directory structure**: Listed `.opencode/skills/system-skill-advisor/hooks/` to see the current layout
3. **Reviewed documentation**: Read SET-UP_GUIDE.md and ARCHITECTURE.md to understand the hook architecture
4. **Analyzed the three options** against the comparison criteria

## Findings

### Finding 1: Existing Pattern is Skill-Owned (Option A)

All existing hook variants live under the skill's hooks directory:

- Claude: `.opencode/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts`
- Gemini: `.opencode/skills/system-skill-advisor/hooks/gemini/user-prompt-submit.ts`
- Codex: `.opencode/skills/system-skill-advisor/hooks/codex/user-prompt-submit.ts`

This is documented in SET-UP_GUIDE.md:131-136.

**Evidence**: <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/SET-UP_GUIDE.md" lines="131-136" />

### Finding 2: Option A (Skill-Owned) Advantages

**Code locality**: Future updates to the advisor brief logic flow through the skill's own hooks directory, maintaining consistency with Claude/Gemini/Codex variants.

**Runtime contract clarity**: The hook implementation lives alongside the MCP server it depends on (`../../mcp_server/lib/skill-advisor-brief.js`), making the dependency boundary clear.

**Diagnostic JSONL isolation**: The hook can write to `.mk-skill-advisor-hook-diagnostics.jsonl` using the same diagnostic infrastructure as other variants (workspace-local, runtime-tagged).

**Test coverage location**: Tests live at `mcp_server/tests/hooks/` alongside the hook source, following the existing pattern (claude-user-prompt-submit-hook.vitest.ts, etc.).

**Deletion safety post-deprecation**: If Devin hooks are deprecated later, the entire `hooks/devin/` directory can be deleted without affecting other runtime variants.

### Finding 3: Option B (Devin-Local) Disadvantages

**Code locality**: Hook lives outside the skill boundary, making it harder to keep in sync with advisor brief logic updates.

**Runtime contract clarity**: The hook would need to import from `.opencode/skills/system-skill-advisor/mcp_server/`, creating a cross-boundary dependency that's less clear.

**Diagnostic JSONL isolation**: Would need to ensure diagnostic writes still go to the advisor's JSONL, not a Devin-specific one.

**Test coverage location**: Tests would need to live in a separate location (perhaps `.devin/tests/` or stay in the skill), creating fragmentation.

**Deletion safety post-deprecation**: Would need to separately clean up both `.devin/hooks/` and any test references.

**No precedent**: No existing runtime uses the `.devin/hooks/` pattern for skill-owned hooks.

### Finding 4: Option C (Inheritance) Advantages

**Zero new code**: Relies on `read_config_from.claude=true` to inherit the existing Claude hook.

**Runtime contract clarity**: Devin's documented compatibility promise suggests this should work.

**Deletion safety**: If inheritance doesn't work, we can add Option A later with minimal rework.

### Finding 5: Option C (Inheritance) Disadvantages

**[UNCERTAIN]**: Per Q1 findings, Devin docs are silent on whether `hookSpecificOutput.additionalContext` is actually honored. Empirical verification is blocked.

**No explicit control**: Cannot add Devin-specific logic (e.g., different timeout, different diagnostic tagging) without affecting Claude.

**Diagnostic isolation**: Diagnostic records would still tag runtime as 'claude', not 'devin', making it harder to distinguish Devin-specific behavior in the JSONL.

**Test coverage**: Cannot add Devin-specific tests without either (a) testing the Claude hook under a Devin tag (confusing) or (b) adding a separate Devin variant anyway.

### Finding 6: Hybrid Approach Recommendation

Given the uncertainty from Q1 and the desire for explicit control, the recommended approach is:

**Primary**: Option C (Inheritance) as the initial implementation, relying on `read_config_from.claude=true`.

**Fallback**: If Phase C implementation or testing reveals that inheritance doesn't inject context, then implement Option A (skill-owned) as the explicit Devin variant.

**Rationale**:
- Option C is zero code if it works, aligning with Devin's compatibility promise
- Option A is the safe fallback that maintains consistency with existing patterns
- The hybrid approach allows us to start simple and add complexity only if needed
- This defers the ADR decision until we have empirical evidence

## Confidence

**MEDIUM** - The existing pattern clearly favors Option A, but Option C has strong appeal if it works. The uncertainty from Q1 makes Option C a calculated risk rather than a guaranteed solution.

## Open Follow-Ups

1. **[UNCERTAIN]** Does Option C actually work? This requires empirical testing outside the current session (blocked by self-invocation constraint).
2. If Option C works, should we still implement Option A for diagnostic isolation and Devin-specific customization?
3. What is the timeline for empirical verification? Can this be done in Phase C before finalizing the decision?

## Recommendation

**Hybrid approach**:
1. **Phase B**: Document both Option A and Option C in decision-record.md as ADR-001, with Option C as the primary recommendation and Option A as the fallback.
2. **Phase C**: Attempt Option C first (inheritance). If testing reveals it doesn't work, implement Option A.
3. **Verification**: Add a specific test case in Phase C to verify context injection actually occurs before declaring the implementation complete.

This approach provides a clear path forward while acknowledging the uncertainty from Q1.

## Actionable

**YES** - This finding directly informs the ADR-001 draft for decision-record.md and the implementation plan in Phase C.

## Category

devin-contract
