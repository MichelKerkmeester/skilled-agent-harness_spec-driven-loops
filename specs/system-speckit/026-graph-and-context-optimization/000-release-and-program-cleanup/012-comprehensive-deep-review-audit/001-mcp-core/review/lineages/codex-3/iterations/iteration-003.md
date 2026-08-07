# Iteration 003 - Traceability

## Focus

Traceability pass over the slice spec, live tool schema, input validation, handler hints, install guide, and feature catalog claims.

## Findings

### F003 - P1 - operator docs use unsupported `dryRun:false` for `memory_embedding_reconcile`

Evidence:

- [SOURCE: .opencode/skills/system-spec-kit/mcp_server/INSTALL_GUIDE.md:737] The install guide says no writes occur unless the caller passes `dryRun: false`.
- [SOURCE: .opencode/skills/system-spec-kit/mcp_server/INSTALL_GUIDE.md:955] The degraded-health troubleshooting row instructs `memory_embedding_reconcile({ dryRun: false })`.
- [SOURCE: .opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:583] The allowed parameter list for `memory_embedding_reconcile` excludes `dryRun`.
- [SOURCE: .opencode/skills/system-spec-kit/mcp_server/tools/memory-tools.ts:99] Tool dispatch validates args before calling `handleMemoryEmbeddingReconcile`.
- [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-embedding-reconcile.ts:76] The live handler hint uses the supported `mode: "apply"` shape.
- [SOURCE: .opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md:654] The feature catalog repeats the stale `dryRun: false` contract.

Impact: the operator-facing repair command for degraded embedding health is rejected by live argument validation, so the documented recovery path fails at the moment it is needed.

Concrete fix: replace `dryRun: false` with `mode: "apply"` in install-guide and feature-catalog surfaces. Add a docs/schema parity check for maintenance tool examples if practical.

Claim adjudication packet:

- findingId: F003
- claim: the documented `memory_embedding_reconcile({ dryRun: false })` repair command is not accepted by the live tool contract.
- evidenceRefs: `.opencode/skills/system-spec-kit/mcp_server/INSTALL_GUIDE.md:955`, `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:583`, `.opencode/skills/system-spec-kit/mcp_server/tools/memory-tools.ts:99`
- counterevidenceSought: checked handler hints and schema; the live path consistently uses `mode: "apply"` and validates before dispatch.
- alternativeExplanation: docs might be describing a legacy version, but this packet is auditing current release readiness and the stale guide is bundled with the current MCP server.
- finalSeverity: P1
- confidence: 0.88
- downgradeTrigger: downgrade to P2 only if clients bypass `validateToolArgs()` for this tool or `dryRun` is intentionally accepted elsewhere before handler dispatch.

### F004 - P2 - `activeOnly` is advertised but ignored by reconcile implementation

Evidence:

- [SOURCE: .opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:343] The public tool schema advertises `activeOnly`.
- [SOURCE: .opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:308] Runtime input validation accepts `activeOnly`.
- [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/embedders/embedding-reconcile.ts:22] The library args interface includes `activeOnly`.
- [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/embedders/embedding-reconcile.ts:299] The implementation reads `mode`, `resetMissing`, `requireActiveShard`, and `repairSuccessCoverage`; no behavior branches on `activeOnly`.

Impact: callers can set `activeOnly: false`, but it does not change reconcile scope or shard behavior. Because active-shard-only behavior is the safer default, this is an API clarity issue rather than a release blocker.

Concrete fix: either remove/deprecate `activeOnly` from public schemas or implement explicit semantics and tests.

## Cross-Reference Protocols

| Protocol | Status | Notes |
|---|---|---|
| `spec_code` | partial | Implementation scope was reviewed; F001 and F002 record write-path contract bugs. |
| `checklist_evidence` | pass/skipped | The Level 1 slice has no checklist. |
| `feature_catalog_code` | partial | F003 records stale feature-catalog wording. |
| `playbook_capability` | partial | F003 records an unsupported troubleshooting command. |

Review verdict: CONDITIONAL
