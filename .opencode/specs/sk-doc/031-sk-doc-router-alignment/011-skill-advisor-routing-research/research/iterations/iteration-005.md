# Iteration 5: Named end-to-end threshold parity suite

## Focus

This iteration strengthened the test inventory by defining one concrete end-to-end parity suite for advisor thresholds and proving which surfaces can legitimately participate in each parity case.

## Actions Taken

1. Inventoried the advisor handler, hook, compatibility, CLI-fallback, runtime-parity, and descriptor-parity suites.
2. Traced threshold observability from the compatibility resolver into the MCP handler, shared brief builder, and Claude hook entrypoint.
3. Compared existing test seams against the cross-surface matrix required by the prior iteration.
4. Designed a named suite, fixture matrix, observable assertions, and isolation strategy without modifying the researched test surface.

## Findings

1. No existing suite proves threshold policy through the full routing surfaces. `advisor-recommend.vitest.ts` proves handler forwarding and output, `advisor-recommend-descriptor-parity.vitest.ts` proves schema preservation, hook suites inject already-built results, and the CLI envelope suite checks fallback transport. Those tests are useful unit/integration slices, but none applies one threshold case to MCP dispatch, shared brief filtering, Claude hook output, and CLI-fallback forwarding. [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/tests/handlers/advisor-recommend.vitest.ts:126-460] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/tests/handlers/advisor-recommend-descriptor-parity.vitest.ts:21-49] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/tests/hooks/claude-user-prompt-submit-hook.vitest.ts:40-74] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/tests/hooks/skill-advisor-cli-fallback-envelope.vitest.ts:1-220]

2. The current `runtime-parity.vitest.ts` is not the missing end-to-end suite. It exercises the shared brief builder/renderer, declares `RUNTIMES = ['claude', 'opencode', 'opencode']`, and never crosses the MCP tool dispatcher or Claude hook entrypoint. Its “3-runtime” label therefore overstates both runtime diversity and surface coverage. [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/tests/hooks/runtime-parity.vitest.ts:15-109]

3. The implementable suite should be named `.opencode/skills/system-skill-advisor/mcp_server/tests/integration/advisor-threshold-surface-parity.vitest.ts`, with `describe('advisor threshold surface parity')`. Its table should cover: unset environment -> `0.80/0.35`; valid environment -> configured values; invalid/non-numeric/out-of-range environment -> defaults; and call-specific overrides -> caller values. Each environment row must run after `vi.resetModules()` and fresh dynamic imports because the brief defaults snapshot environment values at module load. [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/compat/contract.ts:17-35] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/skill-advisor-brief.ts:112-147]

4. Assertions must reflect the real capability boundary. Default and environment rows can compare MCP `effectiveThresholds`, shared-brief inclusion/exclusion, Claude `additionalContext`, and CLI fallback arguments. Call-specific rows can compare MCP dispatch and direct shared-brief construction, but must not claim hook-entry override parity: `handleClaudeUserPromptSubmit` passes runtime, workspace, and timeout only, and exposes no threshold-config input. [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/handlers/advisor-recommend.ts:369-424] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/skill-advisor-brief.ts:137-164] [SOURCE: .opencode/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:202-218]

5. To qualify as surface parity rather than another handler unit test, the MCP assertion should enter through `dispatchTool('advisor_recommend', input)`, and the hook assertion should enter through `handleClaudeUserPromptSubmit` with only lower-level scorer/subprocess/CLI transport seams controlled. A boundary fixture should include one recommendation immediately inside and one immediately outside the effective thresholds, then assert identical acceptance, rendered skill label, and resolved values wherever the surface publishes them. [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/tests/handlers/advisor-recommend.vitest.ts:19-24] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/tests/hooks/claude-user-prompt-submit-hook.vitest.ts:40-48] [INFERENCE: cross-surface assertions required to close the observed inventory gap]

## Questions Answered

- The carried-forward test-inventory question is answered: add `tests/integration/advisor-threshold-surface-parity.vitest.ts` with a two-layer matrix—environment/default parity across MCP, brief, hook, and CLI fallback; call-specific parity across MCP and the shared brief builder.
- Q3 is strengthened: the suite design tests the supported synchronization contract without conflating prompt eligibility or inventing a hook call-override API.
- Q5 is partially advanced: this suite is a high-priority correctness guard because it joins currently isolated contracts at their public boundaries.

## Questions Remaining

- Q1 remains: quantify RRF normalization, confidence-floor saturation, ambiguity clusters, and held-out correctness.
- Q5 remains: rank this suite against transport-budget reservation, diagnostic taxonomy, output-contract reconciliation, vocabulary coverage, and calibration changes.
- Whether the existing `runtime-parity.vitest.ts` should be renamed/fixed or absorbed into the new suite is an implementation decision; the research evidence supports either, provided the duplicate runtime label is removed.

## Ruled Out

- A single matrix asserting call-specific threshold overrides through the Claude hook entrypoint. The hook does not expose that input, so such a test would encode a nonexistent contract rather than parity.
- Treating the existing runtime-parity file as end-to-end coverage; it does not cross the MCP dispatcher or Claude hook entrypoint.

## Sources Consulted

- `.opencode/skills/system-skill-advisor/mcp_server/lib/compat/contract.ts:5-35`
- `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-advisor-brief.ts:112-180,395-535`
- `.opencode/skills/system-skill-advisor/mcp_server/handlers/advisor-recommend.ts:369-435`
- `.opencode/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:170-245`
- `.opencode/skills/system-skill-advisor/mcp_server/tests/handlers/advisor-recommend.vitest.ts`
- `.opencode/skills/system-skill-advisor/mcp_server/tests/handlers/advisor-recommend-descriptor-parity.vitest.ts`
- `.opencode/skills/system-skill-advisor/mcp_server/tests/hooks/runtime-parity.vitest.ts`
- `.opencode/skills/system-skill-advisor/mcp_server/tests/hooks/claude-user-prompt-submit-hook.vitest.ts`
- `.opencode/skills/system-skill-advisor/mcp_server/tests/hooks/settings-driven-invocation-parity.vitest.ts`
- `.opencode/skills/system-skill-advisor/mcp_server/tests/hooks/skill-advisor-cli-fallback-envelope.vitest.ts`
- `.opencode/skills/system-skill-advisor/mcp_server/package.json`

## Assessment

- New information ratio: 0.74
- Novelty justification: The iteration converted a general coverage gap into one named, runnable suite and found an asymmetric public capability boundary plus an overstated existing runtime-parity label.
- Confidence: High for inventory and source-level capability claims; medium-high for the exact lower-level mocking seam because implementation may choose process fixtures instead.
- Tests: Not rerun. Prior targeted tests were already recorded as passing, and this iteration's allowed-write boundary excludes any test-created files outside the research artifacts.

## Reflection

- What worked: Tracing observable outputs and accepted inputs per surface prevented an invalid all-surfaces-same-options test design.
- What failed: No existing file could be promoted unchanged into the required suite; coverage is intentionally split across handler and hook tests.
- Negative knowledge: Runtime-label parity, transport-envelope parity, and threshold-policy parity are separate contracts even when they share fixtures.

## Next Focus

Q1: run a held-out scorer calibration pass that reports RRF normalization, confidence-floor saturation, ambiguity clusters, and correctness together, then use those results to finish the Q5 priority order.

## SCOPE VIOLATIONS

None. The proposed suite is a research recommendation only; no investigated test or source file was modified.
