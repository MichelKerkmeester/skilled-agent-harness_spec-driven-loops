# Review Iteration 004

## Dimension

Maintainability: shared delivery contracts and adapter consistency.

## Files Reviewed

- `.opencode/skills/system-skill-advisor/mcp-server/lib/policy-plan.ts:293-315,485-515`
- `.opencode/skills/system-skill-advisor/mcp-server/lib/render.ts:214-270`
- `.opencode/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:149-169,268-274`
- `.opencode/plugins/mk-skill-advisor.js:620-653,930-961`
- `.opencode/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts:209-243`
- `.opencode/skills/system-skill-advisor/mcp-server/tests/policy-plan-negative-controls.vitest.ts:117-166`

## Findings by Severity

### P1

- **F001 carried forward.** Confirmation policy is encoded three ways: Claude derives it from session identity, OpenCode defaults it to true, and Pi calls `confirmDelivery` unconditionally in a shadow observer. The shared renderer treats the boolean as sufficient, so the contract is difficult to audit and easy to activate with false evidence.
- **F002 carried forward.** The identity helper centralizes dedup state but uses an unescaped separator for both its public identity key and delivery key.

### P2

- **F003 carried forward.** Parent/child status drift remains a maintainability problem for operators reading the phase map.
- **F004 carried forward.** Gate-3 state construction has the same unescaped-composite-input pattern.

## Traceability Checks

- `spec_code`: partial — the shared contract and adapter defaults are not aligned with the receipt-gated wording.
- `checklist_evidence`: partial — positive-path tests are strong, but the shared negative boundary is missing.
- `agent_cross_runtime`: partial — confirmation semantics differ across Claude, OpenCode, and Pi.

## Next Dimension

Correctness: OpenCode transform integration and same-message versus distinct-message behavior.

Review verdict: CONDITIONAL
