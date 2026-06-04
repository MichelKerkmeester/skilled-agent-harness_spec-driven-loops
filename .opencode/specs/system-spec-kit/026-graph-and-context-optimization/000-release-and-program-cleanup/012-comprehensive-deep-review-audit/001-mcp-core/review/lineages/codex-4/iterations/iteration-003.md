# Iteration 003 - Traceability

Focus: spec/code alignment, operator command contract, and public schema parity.

## Files Reviewed

| File | Coverage |
|---|---|
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/001-mcp-core/spec.md` | Scope and acceptance claims |
| `.opencode/skills/system-spec-kit/mcp_server/INSTALL_GUIDE.md` | Operator-facing reconcile guidance |
| `.opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md` | Catalog contract for reconcile |
| `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts` | Public MCP tool schema |
| `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts` | Runtime input validation and whitelist |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-embedding-reconcile.ts` | Live mode resolution and hints |
| `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/embedding-reconcile.ts` | Accepted option surface |

## Findings

### F003 - P1 - operator docs still instruct unsupported dryRun:false for memory_embedding_reconcile apply mode

Evidence:

- `.opencode/skills/system-spec-kit/mcp_server/INSTALL_GUIDE.md:737`
- `.opencode/skills/system-spec-kit/mcp_server/INSTALL_GUIDE.md:955`
- `.opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md:654`
- `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:306`
- `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:583`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-embedding-reconcile.ts:19`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-embedding-reconcile.ts:76`

The install guide and troubleshooting table still tell operators to run `memory_embedding_reconcile({ dryRun: false })`. The live schema takes `mode: "dry-run" | "apply"` and the allowed-argument whitelist for this tool does not include `dryRun`. The handler itself only enters apply mode when `args.mode === "apply"`, and its own hint uses `mode: "apply"`.

Under strict schema validation this call shape is rejected. Under any permissive path, it silently defaults to dry-run because the handler ignores `dryRun`. Either way, the repair playbook does not do what the docs promise.

Fix: replace the stale examples with `memory_embedding_reconcile({ mode: "apply" })`; update the feature-catalog paragraph to describe `mode`, `plannedMutations`, `applied`, and `coverage` rather than a `dryRun` boolean.

Claim adjudication:

| Field | Value |
|---|---|
| findingId | F003 |
| claim | Public operator docs still use `dryRun:false` even though the live tool requires `mode:"apply"`. |
| evidenceRefs | `.opencode/skills/system-spec-kit/mcp_server/INSTALL_GUIDE.md:737`; `.opencode/skills/system-spec-kit/mcp_server/INSTALL_GUIDE.md:955`; `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:306`; `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:583`; `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-embedding-reconcile.ts:19` |
| counterevidenceSought | Checked tool schema, handler hint, Zod schema, whitelist, and feature catalog for any supported `dryRun` alias. |
| alternativeExplanation | Non-strict validation could allow the field to pass through, but the handler still treats it as dry-run. |
| finalSeverity | P1 |
| confidence | 0.86 |
| downgradeTrigger | Downgrade if `dryRun:false` is restored as a documented alias and mapped to apply in the handler. |

### F004 - P2 - activeOnly is exposed as an option but has no implementation branch

Evidence:

- `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:343`
- `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:308`
- `.opencode/skills/system-spec-kit/mcp_server/tools/types.ts:155`
- `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/embedding-reconcile.ts:20`
- `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/embedding-reconcile.ts:299`
- `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/embedding-reconcile.ts:302`

The public surfaces expose `activeOnly`, but the implementation never reads it. `runMemoryEmbeddingReconcile()` extracts `mode`, `resetMissing`, `requireActiveShard`, and `repairSuccessCoverage`; active-shard verification always happens through the runtime active profile.

This is lower severity because the default behavior is the safer behavior, and there is no clear caller need for `activeOnly:false`. It is still public contract drift: callers can set an option that changes nothing.

Fix: remove/deprecate `activeOnly` from schema/type surfaces, or implement explicit semantics and tests for `activeOnly:false`.

## Cross-Reference Protocols

| Protocol | Status | Evidence |
|---|---|---|
| `spec_code` | partial | The target files were reviewed, but F001/F002 show implementation drift from the freshness and dry-run/apply safety goals. |
| `checklist_evidence` | not applicable | The target is a Level 1 slice with no `checklist.md`. |
| `feature_catalog_code` | partial | Feature catalog still mentions `dryRun:false` and stale response wording. |
| `playbook_capability` | partial | Install-guide troubleshooting gives an unsupported repair command. |

Review verdict: CONDITIONAL
