# Iteration 12: Test Pi extension feasibility

## Focus

Map the desired behavior to documented extension hooks and lifecycle surfaces.

## Findings

- `before_agent_start` can inspect and replace the chained system prompt; `systemPromptOptions` exposes the structured inputs Pi used to build it. [SOURCE: https://pi.dev/docs/latest/extensions]
- Extensions can register commands, tools, event listeners, footer state, and persisted session entries. [SOURCE: https://pi.dev/docs/latest/extensions]
- Provider and model metadata include normalized costs and cache usage, while provider registration can supply custom API behavior. [SOURCE: https://pi.dev/docs/latest/extensions]
- This proves a prompt-discipline and observability companion is technically feasible. It does not prove an extension can guarantee byte identity after every provider adapter or upstream proxy rewrite.

## Sources Consulted

- `https://pi.dev/docs/latest/extensions`
- `https://pi.dev/docs/latest/models`

## Assessment

- newInfoRatio: 0.58
- Novelty justification: Connects each feasible responsibility to a documented Pi hook and identifies the serialization blind spot.
- Confidence: High for API feasibility; medium for final-wire control.

## Reflection

- Worked: Hook-level documentation supports a bounded implementation design.
- Failed/ruled out: Claiming byte-stable final payloads without provider-adapter tests is ruled out.

## Recommended Next Focus

Classify MCP as core gap, package-covered capability, or caching concern.
