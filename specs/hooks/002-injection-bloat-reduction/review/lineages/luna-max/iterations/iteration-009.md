# Review Iteration 009

## Dimension

Correctness: identity resolution fallbacks and lifecycle epoch edge cases.

## Files Reviewed

- `.opencode/skills/system-skill-advisor/mcp-server/lib/policy-plan.ts:277-316,325-449`
- `.opencode/skills/system-skill-advisor/mcp-server/tests/policy-plan.vitest.ts:119-166`
- `.opencode/plugins/lib/opencode-message-identity.js:57-178,328-349`
- `.opencode/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts:209-272`
- `.opencode/skills/system-spec-kit/mcp-server/hooks/lib/spec-gate/spec-gate-core.mjs:176-215,281-314`

## Findings by Severity

### P1

- **F001 carried forward.** The state machine’s own `recordDelivery` guard is fail-closed, but callers can satisfy its explicit boolean without passing through a host-owned confirmation boundary.
- **F002 carried forward.** Lifecycle reset correctness does not compensate for two identities entering the same map key during one epoch.

### P2

- **F003 carried forward.** The phase parent still advertises a planned terminal child.
- **F004 carried forward.** A component-boundary collision could make a task/scope change appear unchanged if direct fallback inputs are used.

## Traceability Checks

- `spec_code`: partial — the state machine invariant is locally correct, but the adapter precondition is weaker than the contract.
- `checklist_evidence`: partial — lifecycle tests cover epoch changes but not adversarial identity serialization.
- `agent_cross_runtime`: partial — lifecycle signals are normalized centrally, confirmation is not.

## Next Dimension

Security: adversarial separator and unobserved-receipt controls, with no source changes.

Review verdict: CONDITIONAL
