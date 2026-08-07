# Deep Review Iteration 018

## Dimension

ADVERSARIAL re-verification of the seven open P1 findings requested by the prompt: EMB-1, EMB-2, SEC-1, SEC-2, TRC-1, LEASE-1, and LEASE-2.

Scope class: complex. Code graph and semantic search were unavailable in session context, so this pass used graphless fallback: direct reads of each cited implementation/doc path plus exact `rg` searches for counter-guards, auth/loopback validation, cancellation rereads, fail-closed locks, and listener/lease recovery paths.

## Files Reviewed

- `.opencode/skills/system-spec-kit/mcp_server/context-server.ts:1641`
- `.opencode/skills/system-spec-kit/mcp_server/context-server.ts:1659`
- `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/schema.ts:130`
- `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/schema.ts:139`
- `.opencode/skills/system-spec-kit/shared/embeddings/auto-select.ts:478`
- `.opencode/skills/system-spec-kit/shared/embeddings/auto-select.ts:482`
- `.opencode/skills/system-spec-kit/shared/embeddings/factory.ts:720`
- `.opencode/skills/system-spec-kit/shared/embeddings/factory.ts:765`
- `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:426`
- `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:432`
- `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:446`
- `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:552`
- `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:564`
- `.opencode/bin/hf-model-server.cjs:81`
- `.opencode/bin/hf-model-server.cjs:146`
- `.opencode/bin/hf-model-server.cjs:629`
- `.opencode/bin/hf-model-server.cjs:704`
- `.opencode/skills/system-spec-kit/shared/embeddings/providers/hf-local.ts:266`
- `.opencode/skills/system-spec-kit/shared/embeddings/providers/hf-local.ts:293`
- `.opencode/skills/system-spec-kit/shared/embeddings/providers/hf-local.ts:835`
- `.opencode/skills/system-spec-kit/scripts/core/workflow.ts:411`
- `.opencode/skills/system-spec-kit/scripts/core/workflow.ts:436`
- `.opencode/skills/system-spec-kit/scripts/core/workflow.ts:460`
- `.opencode/skills/system-spec-kit/scripts/core/workflow.ts:513`
- `.opencode/skills/system-spec-kit/scripts/core/workflow.ts:525`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/013-standalone-save-second-writer-guard/tasks.md:75`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/013-standalone-save-second-writer-guard/implementation-summary.md:97`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/009-shutdown-durability/tasks.md:70`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/010-at-rest-wal-durability/checklist.md:76`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/012-boot-integrity-retention-probe/tasks.md:78`
- `.opencode/bin/lib/model-server-supervision.cjs:20`
- `.opencode/bin/lib/model-server-supervision.cjs:591`
- `.opencode/bin/lib/model-server-supervision.cjs:604`
- `.opencode/bin/lib/model-server-supervision.cjs:649`
- `.opencode/bin/lib/model-server-supervision.cjs:811`
- `.opencode/bin/lib/model-server-supervision.cjs:817`
- `.opencode/bin/lib/model-server-supervision.cjs:995`
- `.opencode/bin/lib/model-server-supervision.cjs:1082`
- `.opencode/bin/lib/model-server-supervision.cjs:1153`
- `.opencode/bin/lib/model-server-supervision.cjs:1157`
- `.opencode/bin/lib/model-server-supervision.cjs:1198`
- `.opencode/bin/lib/model-server-supervision.cjs:1199`
- `.opencode/bin/lib/model-server-supervision.cjs:1200`
- `.opencode/bin/lib/model-server-supervision.cjs:1261`

## Findings by Severity

### P0

None.

### P1

No new P1 findings. All seven targeted prior P1s remain active after adversarial re-verification:

- `DR-001-P1-001` / EMB-1 remains P1. Startup still calls `ensureActiveEmbedder()` before `resolveStartupEmbeddingConfig()`, while the former goes through local-first auto-select and the latter honors explicit provider precedence.
- `DR-001-P1-002` / EMB-2 remains P1. `cancelJob()` still marks running jobs cancelled, but `runJob()` does not reread job status inside the batch loop or before completion/active embedder flip.
- `DR-002-P1-001` / SEC-1 remains P1. TCP targets still bind/connect to configured hosts without loopback enforcement or request authentication, and `/api/embed` accepts embedding payloads without an auth gate.
- `DR-002-P1-002` / SEC-2 remains P1. Both workflow-level and per-folder filesystem locks still return `false` on timeout and the guarded operation still executes.
- `DR-003-P1-001` / TRC-1 remains P1. Daemon child packet ledgers still conflict: task/checklist rows remain unchecked while implementation summaries claim verification passed.
- `DR-005-P1-001` / LEASE-1 remains P1. Respawn-lock stale detection still expires a live-owner lock by age alone, despite the demand listener intentionally holding that lock for its lifetime.
- `DR-006-P1-001` / LEASE-2 remains P1. The demand handler still tears down the listener before launch succeeds, and lock release is still not protected by `finally`.

### P2

No new P2 findings.

## Traceability Checks

- `spec_code`: partial. The rechecked P1s remain tied to committed code or packet docs; no counter-spec was found that intentionally permits the observed behavior.
- `checklist_evidence`: fail for TRC-1. Required daemon child verification ledgers remain unreconciled with implementation summaries.
- `skill_agent`: not applicable for this adversarial re-verification pass.
- `agent_cross_runtime`: not applicable for this adversarial re-verification pass.
- `feature_catalog_code`: partial. The transport, provider-selection, workflow-lock, and lease behaviors are code-visible but still conflict with the hardening claims.
- `playbook_capability`: not applicable for this pass.

## SCOPE VIOLATIONS

None.

## Verdict

CONDITIONAL. No new findings were added, but the seven targeted P1s were not refuted or downgraded. Current pass result: 0 ruled out, 0 downgraded, 7 reconfirmed.

## Next Dimension

Continue final adversarial stabilization only if the reducer needs another pass; otherwise route to remediation planning for the reconfirmed P1 set.
