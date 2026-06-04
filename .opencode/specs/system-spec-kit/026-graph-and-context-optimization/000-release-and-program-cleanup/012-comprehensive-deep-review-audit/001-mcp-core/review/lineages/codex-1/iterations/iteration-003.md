# Iteration 003 - Traceability

Focus: spec/code alignment, checklist evidence, public schema parity, feature catalog, and operator playbook drift.

## Findings

### F003 - P1 - Operator docs use unsupported `dryRun:false` for `memory_embedding_reconcile`

Evidence:

- `.opencode/skills/system-spec-kit/mcp_server/INSTALL_GUIDE.md:737`
- `.opencode/skills/system-spec-kit/mcp_server/INSTALL_GUIDE.md:955`
- `.opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md:654`
- `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:341`
- `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:306`
- `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:583`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-embedding-reconcile.ts:19`

The install guide and feature catalog say writes occur when callers pass `dryRun:false`. The live public tool schema has `additionalProperties:false` and exposes `mode: "dry-run" | "apply"` instead. The Zod schema and allowed-field list likewise expose `mode` and do not include `dryRun`. The handler also derives apply mode only from `args.mode === "apply"`.

This is P1 because the troubleshooting table gives operators a concrete repair command for degraded vector state, and that command does not match the live interface.

Claim adjudication:

```json
{
  "findingId": "F003",
  "claim": "The install guide and feature catalog tell operators to use dryRun:false, but the live memory_embedding_reconcile schema and handler use mode:'apply' and reject undeclared fields under the public schema contract.",
  "evidenceRefs": [
    ".opencode/skills/system-spec-kit/mcp_server/INSTALL_GUIDE.md:737",
    ".opencode/skills/system-spec-kit/mcp_server/INSTALL_GUIDE.md:955",
    ".opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md:654",
    ".opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:341",
    ".opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:306",
    ".opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:583",
    ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-embedding-reconcile.ts:19"
  ],
  "counterevidenceSought": "Checked public tool schema, zod input schema, allowed field list, handler mode selection, install-guide maintenance section, troubleshooting table, and feature catalog entry.",
  "alternativeExplanation": "A non-strict caller might ignore the extra dryRun field and silently perform dry-run, but strict schema validation is the documented default and the command would not apply repairs.",
  "finalSeverity": "P1",
  "confidence": 0.89,
  "downgradeTrigger": "Downgrade if the docs are updated to mode:'apply' or the public schema intentionally supports dryRun as a backward-compatible alias."
}
```

### F004 - P2 - `activeOnly` is accepted and advertised but ignored

Evidence:

- `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:343`
- `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:308`
- `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:583`
- `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/embedding-reconcile.ts:20`
- `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/embedding-reconcile.ts:299`

`activeOnly` appears in the public tool schema, the validation schema, the allowed-field list, and the TypeScript argument interface. `runMemoryEmbeddingReconcile()` reads `mode`, `resetMissing`, `requireActiveShard`, and `repairSuccessCoverage`, but it never reads `args.activeOnly`. Passing `activeOnly:false` has no observable effect, so this option is either stale or missing implementation.

## Traceability Protocol Results

| Protocol | Status | Notes |
|---|---|---|
| spec_code | partial | Core review scope was honored, but active correctness findings remain. |
| checklist_evidence | pass/skipped | Level 1 slice has no `checklist.md`. |
| feature_catalog_code | partial | Feature catalog reconcile mode wording is stale. |
| playbook_capability | partial | Install guide troubleshooting gives an unsupported apply call shape. |

Review verdict: CONDITIONAL
