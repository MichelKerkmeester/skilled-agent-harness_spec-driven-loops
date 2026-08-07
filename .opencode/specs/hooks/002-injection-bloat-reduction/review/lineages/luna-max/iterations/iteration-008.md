# Review Iteration 008

## Dimension

Maintainability: rollback, flag-off behavior, and shared-boundary fixes.

## Files Reviewed

- `.opencode/specs/hooks/002-injection-bloat-reduction/007-guardrail-controls-and-activation/rollback-procedure.md:1-38`
- `.opencode/specs/hooks/002-injection-bloat-reduction/007-guardrail-controls-and-activation/activation-matrix.schema.json:76-140`
- `.opencode/plugins/lib/opencode-message-identity.js:258-349`
- `.opencode/skills/system-skill-advisor/mcp-server/lib/render.ts:214-263`
- `.opencode/skills/system-spec-kit/mcp-server/hooks/lib/spec-gate/spec-gate-core.mjs:281-314,327-330`

## Findings by Severity

### P1

- **F001 carried forward.** Rollback can clear state and restore full emission, but activation evidence remains untrustworthy until confirmation provenance is centralized.
- **F002 carried forward.** A one-point encoding fix in the shared identity helper is needed; plugin-local workarounds would leave `mk-spec-memory.js` exposed.

### P2

- **F003 carried forward.** Parent/child status reconciliation is still manual.
- **F004 carried forward.** Gate-3’s state-key fix should use the same canonical composite encoding policy as OpenCode identity.

## Traceability Checks

- `spec_code`: partial — rollback policy is sound but cannot make false-positive evidence valid.
- `checklist_evidence`: partial — the activation matrix correctly keeps candidates off, which limits immediate blast radius but does not close the shared bugs.
- `skill_agent`: not applicable to this spec-folder review.

## Next Dimension

Correctness: identity resolution fallbacks and lifecycle epoch edge cases.

Review verdict: CONDITIONAL
