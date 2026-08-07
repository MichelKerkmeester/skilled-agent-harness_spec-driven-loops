# Review Iteration 017

## Dimension

Correctness: final full-scope replay and duplicate-class search.

## Files Reviewed

- `.opencode/skills/system-skill-advisor/mcp-server/lib/policy-plan.ts:277-515`
- `.opencode/skills/system-skill-advisor/mcp-server/lib/render.ts:214-275`
- `.opencode/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:149-169`
- `.opencode/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts:209-272`
- `.opencode/plugins/lib/opencode-message-identity.js:19-349`
- `.opencode/plugins/mk-skill-advisor.js:620-961`
- `.opencode/plugins/mk-spec-memory.js:430-520`
- `.opencode/skills/system-spec-kit/mcp-server/hooks/lib/spec-gate/spec-gate-core.mjs:166-330`

## Findings by Severity

### P1

- **F001 carried forward.** Full producer-consumer replay still finds identity-derived confirmation reaching `recordDelivery` without a receipt object.
- **F002 carried forward.** Full OpenCode identity replay still finds an injective-key violation for accepted strings.

### P2

- **F003 carried forward.** Parent phase map drift remains the only status inconsistency found.
- **F004 carried forward.** Gate-3 state-key collision remains a separate lower-severity composite serialization issue.

## Traceability Checks

- `spec_code`: partial — the four findings are distinct: two runtime correctness issues, one parent status issue, one Gate-3 hardening issue.
- `checklist_evidence`: partial — no additional finding class or closure proof was found.
- `feature_catalog_code`: not applicable — no catalog surface is declared.

## Next Dimension

Security: final fail-open and hostile-input replay.

Review verdict: CONDITIONAL
