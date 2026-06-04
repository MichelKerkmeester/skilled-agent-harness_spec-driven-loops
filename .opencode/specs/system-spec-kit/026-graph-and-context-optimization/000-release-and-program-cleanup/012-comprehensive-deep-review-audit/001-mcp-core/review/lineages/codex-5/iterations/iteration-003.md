# Iteration 003 - Traceability

Focus: public schema, docs, feature catalog, and operator repair contract.

## Findings

### F003 - P1 - operator docs tell users to run unsupported memory_embedding_reconcile({ dryRun: false })
Evidence:
- `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:342`
- `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:583`
- `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:653`
- `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:690`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-embedding-reconcile.ts:75`
- `.opencode/skills/system-spec-kit/mcp_server/INSTALL_GUIDE.md:737`
- `.opencode/skills/system-spec-kit/mcp_server/INSTALL_GUIDE.md:955`
- `.opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md:654`

The live reconcile schema exposes `mode: "dry-run" | "apply"` and its handler hint tells operators to run `memory_embedding_reconcile({ mode: "apply" })`. The validator rejects unrecognized parameters, and `dryRun` is not in the allowed parameter list for `memory_embedding_reconcile`. The install guide and feature catalog still tell operators to pass `dryRun:false`, so the documented repair command either fails schema validation or, if called directly without validation, defaults to dry-run instead of apply.

Concrete fix: replace `dryRun:false` reconcile examples with `mode:"apply"` and update feature-catalog result wording to match current `buckets`, `plannedMutations`, and `applied` fields.

Claim adjudication:
- findingId: F003
- claim: published docs prescribe a rejected or non-applying reconcile call shape.
- evidenceRefs: `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:342`, `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:583`, `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:653`, `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-embedding-reconcile.ts:75`, `.opencode/skills/system-spec-kit/mcp_server/INSTALL_GUIDE.md:737`, `.opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md:654`
- counterevidenceSought: system-spec-kit README; it already uses `mode:"apply"`, so the drift is localized but still operator-facing.
- alternativeExplanation: docs may have lagged an API rename, but strict validation means this is not merely cosmetic.
- finalSeverity: P1
- confidence: 0.90
- downgradeTrigger: downgrade if `dryRun` is restored as an accepted alias for apply or stale docs are removed from release contract.

### F004 - P2 - memory_embedding_reconcile accepts activeOnly but never reads it
Evidence:
- `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:343`
- `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:583`
- `.opencode/skills/system-spec-kit/mcp_server/tools/types.ts:155`
- `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/embedding-reconcile.ts:22`
- `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/embedding-reconcile.ts:299`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-embedding-reconcile.ts:36`

`activeOnly` is part of the public schema and TypeScript request surface, but the reconcile implementation reads only `mode`, `resetMissing`, `requireActiveShard`, and `repairSuccessCoverage`. The handler always resolves and attaches the active profile shard. That makes `activeOnly:false` a no-op public parameter.

Concrete fix: remove/deprecate `activeOnly` from the public surface or implement documented semantics for `false`.

## Traceability Protocols
| Protocol | Status | Evidence |
|---|---|---|
| spec_code | partial | F001 and F002 contradict full write-path readiness. |
| checklist_evidence | pass/skipped | No checklist exists in this Level 1 slice. |
| feature_catalog_code | partial | F003 cites stale feature catalog wording. |
| playbook_capability | partial | F003 cites stale install-guide troubleshooting guidance. |

Review verdict: CONDITIONAL
