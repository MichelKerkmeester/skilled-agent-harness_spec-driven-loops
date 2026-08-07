# Review Iteration 002

## Dimension

Security: hostile identity, receipt, and state-key inputs.

## Files Reviewed

- `.opencode/plugins/lib/opencode-message-identity.js:19-23,37-45,149-207`
- `.opencode/plugins/tests/mk-skill-advisor.test.cjs:539-575`
- `.opencode/skills/system-spec-kit/mcp-server/hooks/lib/spec-gate/spec-gate-core.mjs:166-215,281-314`
- `.opencode/skills/system-spec-kit/mcp-server/hooks/lib/spec-gate/spec-gate-core.test.mjs:286-319,383-445`
- `.opencode/skills/system-skill-advisor/mcp-server/lib/policy-plan.ts:293-315,485-510`

## Findings by Severity

### P1

- **F002 carried forward.** The separator collision remains executable: `resolveMessageIdentity` accepts both components and returns the same key for distinct identities.
- **F001 carried forward.** `recordDelivery` correctly requires an explicit boolean or receipt-backed status, but both observed adapters can supply the explicit boolean without a host delivery signal.

### P2

- **F004 — Gate-3 fallback fingerprints are delimiter-ambiguous.** `gate3StateFields` constructs `taskScopeFingerprint` with a raw `|` between two caller-provided strings. A read-only probe showed `{taskFingerprint:"a|b",scopeFingerprint:"c"}` and `{taskFingerprint:"a",scopeFingerprint:"b|c"}` produce the same state hash. If those values reach activation, a changed task/scope can look unchanged.

## Traceability Checks

- `spec_code`: partial — F002 violates the distinct-identity invariant; F004 is a boundary hardening gap against the phase-005 key contract.
- `checklist_evidence`: partial — no separator adversarial case was found for either identity key.
- `skill_agent`: not applicable to this spec-folder review.

## Next Dimension

Traceability: parent phase map, child completion metadata, and evidence claims.

Review verdict: CONDITIONAL
