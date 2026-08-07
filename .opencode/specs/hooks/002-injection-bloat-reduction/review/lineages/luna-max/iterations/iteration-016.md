# Review Iteration 016

## Dimension

Maintainability: final remediation shape and finding deduplication.

## Files Reviewed

- `.opencode/skills/system-skill-advisor/mcp-server/lib/policy-plan.ts:485-515`
- `.opencode/skills/system-skill-advisor/mcp-server/lib/render.ts:214-263`
- `.opencode/plugins/lib/opencode-message-identity.js:149-207`
- `.opencode/skills/system-spec-kit/mcp-server/hooks/lib/spec-gate/spec-gate-core.mjs:183-209`
- `.opencode/specs/hooks/002-injection-bloat-reduction/007-guardrail-controls-and-activation/rollback-procedure.md:1-38`

## Findings by Severity

### P1

- **F001 carried forward.** Fixing the renderer alone would leave adapter provenance errors; the remediation must make confirmation receipt-backed at the producer boundary.
- **F002 carried forward.** Fixing one plugin alone would leave the shared identity key used by the other transform consumer.

### P2

- **F003 carried forward.** The metadata drift is independent of runtime fixes and needs a parent-document reconciliation.
- **F004 carried forward.** Gate-3 can reuse the same canonical serialization approach as the identity fix.

## Traceability Checks

- `spec_code`: partial — active findings map to separate shared-contract and parent-document workstreams.
- `checklist_evidence`: partial — rollback is documented, but the guard tests do not cover the identified inputs.
- `agent_cross_runtime`: partial — F001 spans multiple adapter producers.

## Next Dimension

Correctness: final full-scope replay and search for duplicate finding classes.

Review verdict: CONDITIONAL
