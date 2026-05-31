# Iteration 007 - Claim Adjudication

## Dimension

claim-adjudication + adversarial verification of all accumulated findings. This pass did not hunt for new findings; it verified each active P1/P2 claim against the current cited files and looked for counter-evidence, intended-design explanations, and downgrade triggers.

Scope class: complex. Code graph and semantic search were unavailable, so this pass used graphless fallback: prior iteration/delta reconstruction, direct reads of cited source/spec/doc ranges, and targeted exact searches around verification gates and env references.

## Files Reviewed

- `.opencode/skills/system-spec-kit/mcp_server/context-server.ts:1641`
- `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/schema.ts:139`
- `.opencode/skills/system-spec-kit/shared/embeddings/auto-select.ts:478`
- `.opencode/skills/system-spec-kit/shared/embeddings/factory.ts:765`
- `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:421`
- `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:547`
- `.opencode/bin/hf-model-server.cjs:81`
- `.opencode/bin/hf-model-server.cjs:146`
- `.opencode/bin/hf-model-server.cjs:155`
- `.opencode/bin/hf-model-server.cjs:629`
- `.opencode/skills/system-spec-kit/shared/embeddings/providers/hf-local.ts:266`
- `.opencode/skills/system-spec-kit/shared/embeddings/providers/hf-local.ts:835`
- `.opencode/skills/system-spec-kit/scripts/core/workflow.ts:411`
- `.opencode/skills/system-spec-kit/scripts/core/workflow.ts:436`
- `.opencode/skills/system-spec-kit/scripts/core/workflow.ts:481`
- `.opencode/skills/system-spec-kit/scripts/core/workflow.ts:513`
- `.opencode/bin/lib/model-server-supervision.cjs:20`
- `.opencode/bin/lib/model-server-supervision.cjs:591`
- `.opencode/bin/lib/model-server-supervision.cjs:649`
- `.opencode/bin/lib/model-server-supervision.cjs:811`
- `.opencode/bin/lib/model-server-supervision.cjs:817`
- `.opencode/bin/lib/model-server-supervision.cjs:1082`
- `.opencode/bin/lib/model-server-supervision.cjs:1153`
- `.opencode/bin/lib/model-server-supervision.cjs:1198`
- `.opencode/bin/lib/model-server-supervision.cjs:1200`
- `.opencode/bin/lib/model-server-supervision.cjs:1225`
- `.opencode/bin/lib/model-server-supervision.cjs:1259`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/009-shutdown-durability/checklist.md:67`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/009-shutdown-durability/implementation-summary.md:90`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/010-at-rest-wal-durability/checklist.md:76`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/010-at-rest-wal-durability/implementation-summary.md:117`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/012-boot-integrity-retention-probe/tasks.md:78`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/013-standalone-save-second-writer-guard/tasks.md:75`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/013-standalone-save-second-writer-guard/implementation-summary.md:97`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/011-embedding-stack-hardening/005-live-validation-bench-hardening/spec.md:115`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/011-embedding-stack-hardening/005-live-validation-bench-hardening/implementation-summary.md:56`
- `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:415`

## Findings by Severity

### P0

None.

### P1

- `DR-001-P1-001` remains P1. The current startup path still calls `ensureActiveEmbedder()` and attaches the active shard before `resolveStartupEmbeddingConfig()`, while the bootstrap selector persists a local-first auto-selected provider and the factory contract gives explicit `EMBEDDINGS_PROVIDER` precedence.
- `DR-001-P1-002` remains P1. `cancelJob()` still marks non-terminal jobs cancelled, but `runJob()` never rereads persisted job status inside the batch loop or before completing the model switch.
- `DR-002-P1-001` remains P1. TCP/http targets are still accepted by server, client, bridge, and launcher env propagation without loopback allowlisting or request authentication for `/api/embed`.
- `DR-002-P1-002` remains P1. Both workflow-level and per-folder locks still return `false` after timeout/unexpected errors, and callers still execute the guarded operation after lock acquisition failure.
- `DR-003-P1-001` remains P1 as a traceability gate issue. This is not a runtime code defect, but the daemon child ledgers still conflict: open task/checklist verification rows coexist with implemented/PASS completion claims.
- `DR-005-P1-001` remains P1. The respawn lock is documented as long-lived across the lazy listener window, but stale detection still age-reclaims locks older than 60 seconds even when the owner PID is not known dead.
- `DR-006-P1-001` remains P1. The demand handler still closes/unlinks the lazy listener before `launch()` and releases the respawn lock only after launch returns; no failure branch re-arms the listener or finally-protects lock release.

### P2

- `DR-001-P2-001` remains P2. The direct `hf-model-server.cjs` binary still unlinks a Unix socket after `EADDRINUSE`, while the supervised listener has the live-resident guard.
- `DR-003-P2-001` remains P2. The phase 005 spec matrix still assigns idle eviction to `hf-model-server.cjs`, while summary/code place it in `model-server-supervision.cjs`.
- `DR-004-P2-001` remains P2. Prefix overrides, `EMBEDDER_REINDEX_BATCH_SIZE`, and `HF_LOCAL_MODEL` remain code/test-visible but absent from the embedding env reference table.

## Traceability Checks

- `spec_code`: partial. Active code-backed P1/P2 claims were verified against current source ranges; the honestly gated flag-flip, dtype, and cache deferrals were not treated as defects.
- `checklist_evidence`: fail. `DR-003-P1-001` still leaves daemon child packet verification ledgers unreconciled.
- `skill_agent`: pending. No new overlay-specific adjudication was needed.
- `agent_cross_runtime`: pending. No new overlay-specific adjudication was needed.
- `feature_catalog_code`: partial. ENV reference drift remains advisory.
- `playbook_capability`: pending. No new overlay-specific adjudication was needed.

## SCOPE VIOLATIONS

None.

## Verdict

CONDITIONAL, `hasAdvisories=true`. All 7 active P1 findings have adjudication packets in `deltas/iter-007.jsonl`; none were ruled out or downgraded in this pass. New findings ratio is `0.0` because this was an adjudication pass.

## Next Dimension

Remediation planning or synthesis. Group the two model-server listener/respawn-lock P1s as one lifecycle workstream, and keep the provider/reindex/workflow/transport/traceability P1s separate unless implementation proves a shared fix boundary.
