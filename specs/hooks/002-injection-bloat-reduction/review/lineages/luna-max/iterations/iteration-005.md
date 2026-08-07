# Review Iteration 005

## Dimension

Correctness: OpenCode transform integration and dedup boundaries.

## Files Reviewed

- `.opencode/plugins/mk-skill-advisor.js:659-669,930-1040`
- `.opencode/plugins/mk-spec-memory.js:1-80,430-520`
- `.opencode/plugins/lib/opencode-message-identity.js:149-207,258-314`
- `.opencode/plugins/tests/mk-skill-advisor.test.cjs:500-575`
- `.opencode/plugins/tests/mk-spec-memory.test.cjs:430-520`
- `.opencode/specs/hooks/002-injection-bloat-reduction/003-opencode-transform-dedup/spec.md:60-78,99-113`

## Findings by Severity

### P1

- **F001 carried forward.** The OpenCode transform has no host receipt path in the observer call; the default `deliveryConfirmed=true` is the only signal reaching `render.ts`.
- **F002 carried forward.** Dedup state is shared across transforms, so a key collision is not isolated to one plugin: the second transform can observe the first transform's delivered contribution.

### P2

- **F003 carried forward.** Parent phase status remains stale after the terminal child evidence.
- **F004 carried forward.** The Gate-3 fallback key remains a separate composite-input collision risk.

## Traceability Checks

- `spec_code`: partial — phase 003's first/distinct-message contract is not fully protected by the key encoding.
- `checklist_evidence`: partial — same-message and ordinary identical-text cases exist, but no control exercises separator-bearing IDs.
- `playbook_capability`: not applicable — no playbook capability is declared for this packet.

## Next Dimension

Security: cross-plugin state contamination and reset/rollback boundaries.

Review verdict: CONDITIONAL
