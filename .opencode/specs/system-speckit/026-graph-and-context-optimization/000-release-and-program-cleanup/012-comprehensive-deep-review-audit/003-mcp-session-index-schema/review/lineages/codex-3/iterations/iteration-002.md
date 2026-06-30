# Deep Review Iteration 002

## Focus
Security and trust-boundary pass over governed ingest, retention metadata, direct memory saves, bulk scans, and async ingest jobs.

## Finding F001 - P1
`retentionPolicy: "ephemeral"` does not trigger governed-ingest enforcement.

### Evidence
- `.opencode/skills/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:225-230` says any scope, provenance, governed timestamp, or retention field should make `provenanceActor` mandatory.
- `.opencode/skills/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:235-242` only requires enforcement for scope/provenance/governedAt, or `deleteAfter` when the retention policy is not `ephemeral`.
- `.opencode/skills/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:261-280` allows the non-governed branch and computes a default `deleteAfter` for ephemeral rows.
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:3051-3061` trusts `validateGovernedIngest` before saving.
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:3196-3200` derives save scope from the normalized governance decision.
- `.opencode/skills/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:325-348` maps the normalized decision into persisted governance columns, including `retention_policy` and `delete_after`.

### Impact
A caller can set ephemeral retention without tenant/session/provenance metadata and still get an allowed decision with a computed deletion time. That contradicts the local governance contract and can produce retention-controlled rows without the actor/audit identity the contract says should be required.

### Concrete Fix
Make `requiresGovernedIngest` return true whenever `retentionPolicy` is provided, and require an explicit future `deleteAfter` plus the governed scope/provenance fields for ephemeral rows. If unscoped ephemeral retention is intentionally allowed, update the comment, tool contracts, and audit expectations to say so explicitly.

### Claim Adjudication
- Claim: ephemeral retention can bypass governed-ingest enforcement.
- Alternate explanation considered: ephemeral could be intentionally treated as safe-by-default because it is deleted later.
- Decision: accepted as P1. The file-level contract explicitly includes retention fields in the governed-ingest trigger, and the persistence path writes the normalized retention metadata after the allowed decision.

Review verdict: CONDITIONAL
