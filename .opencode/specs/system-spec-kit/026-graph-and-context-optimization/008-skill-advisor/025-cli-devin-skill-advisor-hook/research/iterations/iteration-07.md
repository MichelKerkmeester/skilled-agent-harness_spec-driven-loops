# Iteration 07: Tool-ID Stability Test Plan

## Question

Design a parity smoke test that calls `advisor_recommend` with a known prompt across Claude / Gemini / Codex / OpenCode / Devin, asserts byte-equivalent recommendation, asserts same `skill_graph_*` query data.

## Investigation Steps

1. **Reviewed existing test patterns**: Checked advisor test suite for parity test patterns
2. **Analyzed MCP tool contract**: Reviewed advisor_recommend and skill_graph_* tool schemas

## Findings

### Finding 1: Test Harness Design

Use existing vitest framework in `mcp_server/tests/`. Create `runtime-parity.vitest.ts` with:
- Test prompt: "save this conversation context to memory" (consistent across existing tests)
- Expected output schema: recommendations[], cache state, freshness trust
- Tolerance: byte-equivalent for skill slugs/order; tolerance for confidence values (±0.01)

### Finding 2: Runtime Invocation Strategy

Since we cannot dispatch to external runtimes from within tests, design the test as:
- Unit test: Call `buildSkillAdvisorBrief()` directly with runtime='claude'|'gemini'|'codex'|'opencode'|'devin'
- Assert same recommendations returned regardless of runtime tag
- Assert skill_graph_query returns same data for all runtimes

### Finding 3: Devin Runtime Handling

For Devin, if using Option C (inheritance), the runtime tag would still be 'claude'. If using Option A (explicit variant), runtime tag would be 'devin'. The test should handle both cases.

## Confidence

**MEDIUM** - Test design is straightforward but Devin runtime handling depends on Q1/Q2 outcome.

## Recommendation

Implement runtime-parity.vitest.ts in Phase C after Q1/Q2 decision is finalized. Test should handle both inheritance (runtime='claude') and explicit variant (runtime='devin') cases.

## Actionable

**YES** - This provides the test plan for Phase C verification.

## Category

tool-id-stability
