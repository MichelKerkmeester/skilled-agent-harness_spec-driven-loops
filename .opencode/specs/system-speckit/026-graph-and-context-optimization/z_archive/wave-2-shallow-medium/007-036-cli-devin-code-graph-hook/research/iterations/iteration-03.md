# Iteration 03: Devin Variant Source Location ADR (Revised per Q2 Option B)

## Question

Given Q2's decision to keep hooks in `system-spec-kit/mcp_server/hooks/`, where should the Devin variant live?

**Revised options**:
- **A**: `.opencode/skills/system-spec-kit/mcp_server/hooks/devin/session-start.ts` (add to current location alongside claude/gemini/codex)
- **B**: `.devin/hooks/scripts/session-start.js` (Devin-local, runtime-owned)
- **C**: Reuse compiled Claude variant via Devin's `read_config_from.claude=true` (zero new code)

Compare on: code locality, diagnostic isolation, test coverage, deletion safety. Recommend one with rationale.

## Investigation Steps

1. **Reviewed parallel advisor research**: Read advisor iteration-02 which analyzed the same question for UserPromptSubmit
2. **Analyzed Q1 findings**: Devin contract uncertainty affects Option C viability
3. **Evaluated Option A**: Adding devin/ subdirectory to existing system-spec-kit hooks location
4. **Evaluated Option B**: Devin-local hooks pattern (no precedent in codebase)
5. **Evaluated Option C**: Inheritance via read_config_from.claude=true

## Findings

### Finding 1: Advisor Packet Recommended Hybrid Approach

The advisor packet iteration-02 recommended:
- **Primary**: Option C (inheritance) as initial implementation
- **Fallback**: Option A (skill-owned) if inheritance doesn't work
- **Rationale**: Start simple, add complexity only if needed

**Evidence**: <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/025-cli-devin-skill-advisor-hook/research/iterations/iteration-02.md" />

### Finding 2: Option A (system-spec-kit/hooks/devin/) Advantages

**Code locality**: Devin variant lives alongside Claude/Gemini/Codex variants, maintaining consistency.

**Dependency clarity**: Can import from the same boundary layer (`../../lib/code-graph-boundary.js`) as other variants.

**Diagnostic isolation**: Can write to code-graph diagnostic JSONL with runtime tag 'devin'.

**Test coverage**: Tests can live in `system-spec-kit/mcp_server/tests/hooks/` alongside existing hook tests.

**Deletion safety**: Entire `hooks/devin/` directory can be deleted without affecting other variants.

**Precedent**: Matches the existing pattern for claude/gemini/codex subdirectories.

### Finding 3: Option B (.devin/hooks/scripts/) Disadvantages

**No precedent**: No existing hooks use the `.devin/hooks/` pattern in this codebase.

**Cross-boundary dependency**: Would need to import from `.opencode/skills/system-spec-kit/mcp_server/`, creating unclear dependency.

**Diagnostic fragmentation**: Diagnostic writes would need to route to code-graph JSONL across boundaries.

**Test isolation**: Tests would need to live separately from hook source, creating fragmentation.

### Finding 4: Option C (Inheritance) Advantages

**Zero new code**: Relies on existing Claude hook and `read_config_from.claude=true` default.

**Devin compatibility promise**: Aligns with Devin's documented Claude Code compatibility claim.

**Low risk**: If it doesn't work, can fall back to Option A with minimal rework.

### Finding 5: Option C (Inheritance) Disadvantages

**[UNCERTAIN]**: Per Q1, Devin docs are silent on whether plain text hook output is honored for context injection.

**No Devin-specific control**: Cannot add Devin-specific logic (different timeout, diagnostic tagging) without affecting Claude.

**Diagnostic confusion**: Diagnostic records would tag runtime as 'claude', not 'devin'.

**Test coverage**: Cannot add Devin-specific tests without either testing Claude hook under Devin tag (confusing) or adding separate variant anyway.

### Finding 6: Q1 Finding Affects Option C Viability

Q1 found that:
- Devin docs do NOT document `hookSpecificOutput.additionalContext`
- Existing Claude hook uses plain text markdown output, not JSON
- Empirical verification is blocked by self-invocation constraint

This uncertainty makes Option C a calculated risk rather than a guaranteed solution.

**Evidence**: <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/specs/system-spec-kit/026-graph-and-context-optimization/005-code-graph/036-cli-devin-code-graph-hook/research/iterations/iteration-01.md" />

## Confidence

**MEDIUM** - Option A is the safe, pattern-consistent choice. Option C has appeal if it works, but Q1 uncertainty makes it risky. The hybrid approach (try C first, fall back to A) balances these concerns.

## Open Follow-Ups

1. Can Option C be empirically verified in Phase C before finalizing the decision?
2. If Option C works, should we still implement Option A for diagnostic isolation and Devin-specific customization?
3. What is the timeline for empirical verification?

## Recommendation

**Hybrid approach** (matching advisor packet):

1. **Phase B**: Document both Option A and Option C in decision-record.md as ADR-002, with Option C as primary recommendation and Option A as fallback.

2. **Phase C**: Attempt Option C first (inheritance via `read_config_from.claude=true`). If testing reveals it doesn't inject context, implement Option A (add `system-spec-kit/mcp_server/hooks/devin/session-start.ts`).

3. **Verification**: Add a specific test case in Phase C to verify context injection actually occurs before declaring implementation complete.

**Rationale**:
- Option C is zero code if it works, aligning with Devin's compatibility promise
- Option A is the safe fallback that maintains consistency with existing claude/gemini/codex pattern
- The hybrid approach allows starting simple and adding complexity only if needed
- This defers the final decision until we have empirical evidence from Phase C

## Actionable

**YES** - This finding directly informs ADR-002 draft for decision-record.md and the implementation plan in Phase C.

## Category

devin-contract
