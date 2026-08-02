# Independent Deep Review — 015-mcp-webflow

- **Date**: 2026-08-02 (evening)
- **Reviewer**: independent read-only opencode session (GPT 5.6 LUNA FAST), dispatched with gate pre-approval; no files modified by the reviewer.
- **Scope**: parent spec + all eight phase children (001 research artifacts, 002 contract, 003 integration, 004 skill, 005 catalog/playbook, 006 hub registration, 007 benchmark, 008 closeout) + hub surfaces (mode-registry, hub-router, leaf-manifest, smart-routing, mcp-webflow packet) + the `.utcp_config.json` webflow manual. Sibling `mcp-magnific` excluded per scope.

## Verdict: REJECTED → resolved (all findings fixed and re-verified by direct inspection)

| Finding | Severity | Resolution | Evidence |
|---|---|---|---|
| Hub transport registration omits Webflow pairing/model details (mode-registry transport-axis, SKILL.md two-axis, smart-routing) | P1 | transport-axis description now names `code-mode-stdio-mcp` + conditional pairing; `crossHubPairing` gained `mcp-webflow: sk-design (Designer-family only)`; SKILL.md two-axis model lists webflow | `mode-registry.json` extensions.transport-axis; `SKILL.md` two-axis model |
| Phase summaries claim artifacts absent while present (004/005/006) | P1 | All three implementation-summary bodies rewritten to record the delivered artifacts | `004/005/006 .../implementation-summary.md` What Was Built |
| Phase 003 marks live discovery complete while documenting it blocked | P1 | T008 + completion criteria unmarked with explicit BLOCKED annotations | `003 .../tasks.md` T008, completion criteria |
| Phase 007 claims/metadata stale; strict validation fails | P1 | Summary body rewritten; metadata regenerated; `validate.sh --strict` Errors 0 Warnings 0 | 007 validation output |
| Completion states not reconciled across parent/children | P2 | Reconciled in Phase 8 closeout (parent phase map + status + continuity) | `spec.md` phase map; this review record |

## Checks passed by the reviewer

- No credential values found; only `WEBFLOW_TOKEN` names/placeholders.
- No comment-hygiene violations in the packet.
- Safety contract consistent across decision record, matrix, skill, wiring, catalog, playbook, examples.
- No production mutation path; `customDomains` forbidden in smoke; publish requires confirmation.
- JSON configs parse; parent-skill check passed all webflow-specific invariants (sole failure = pre-existing sibling `mcp-magnific`, out of scope).

## Residual notes (accepted, non-blocking)

- Advisor live recall unproven while the advisor daemon is down (B-002); static coverage in place.
- Compiled route-gold for mcp-tooling predates webflow (B-001); regenerate via the 019 program after this packet lands.
- Live read smoke remains blocked pending operator token/test-site provisioning (recorded in 003).
