# Review Iteration 006

## Dimension

Security: cross-plugin state contamination and lifecycle reset boundaries.

## Files Reviewed

- `.opencode/plugins/lib/opencode-message-identity.js:191-207,328-349`
- `.opencode/plugins/mk-skill-advisor.js:659-669,930-1040`
- `.opencode/plugins/mk-spec-memory.js:430-520`
- `.opencode/skills/system-skill-advisor/mcp-server/lib/policy-plan.ts:400-449,518-548`
- `.opencode/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts:209-272`

## Findings by Severity

### P1

- **F001 carried forward.** Reset and lifecycle handling clear or advance state, but they do not repair the upstream provenance error: an identity-only observation can still become the prior delivered state.
- **F002 carried forward.** The shared `delivered`, `identities`, and `receipts` maps key on the colliding string, so a collision can cross the two OpenCode transform consumers before reset.

### P2

- **F003 carried forward.** The parent status remains stale after the terminal child’s evidence.
- **F004 carried forward.** Gate-3’s fallback state hash has the same composite-boundary weakness.

## Traceability Checks

- `spec_code`: partial — lifecycle reset behavior does not eliminate the identity and receipt-origin risks.
- `checklist_evidence`: partial — reset tests cover ordinary identities, not hostile key encodings.
- `agent_cross_runtime`: partial — Pi confirms shadow delivery unconditionally while OpenCode defaults confirmation.

## Next Dimension

Traceability: test coverage against explicit phase requirements and negative controls.

Review verdict: CONDITIONAL
