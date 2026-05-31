# Deep Review Iteration 001

## Dimension

Inventory first pass plus correctness sampling.

Scope class: complex. The configured review target spans 18 code files and 14,671 LOC across embedding provider selection, the hf-local model server, launcher supervision, reindexing, cache/shard storage, retention sweep, startup/shutdown, and daemon detection/workflow surfaces.

## Files Reviewed

- `.opencode/skills/system-spec-kit/shared/embeddings/auto-select.ts:437`
- `.opencode/skills/system-spec-kit/shared/embeddings/auto-select.ts:478`
- `.opencode/skills/system-spec-kit/shared/embeddings/auto-select.ts:507`
- `.opencode/skills/system-spec-kit/shared/embeddings/factory.ts:757`
- `.opencode/skills/system-spec-kit/mcp_server/context-server.ts:1641`
- `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/schema.ts:130`
- `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:393`
- `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:421`
- `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:441`
- `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:547`
- `.opencode/bin/hf-model-server.cjs:155`
- `.opencode/bin/lib/model-server-supervision.cjs:1225`
- `.opencode/skills/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts:146`
- `.opencode/skills/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts:371`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:1325`
- `.opencode/skills/system-spec-kit/mcp_server/context-server.ts:1473`
- `.opencode/skills/system-spec-kit/mcp_server/tests/embedder-reindex.vitest.ts:214`
- `.opencode/skills/system-spec-kit/mcp_server/tests/embedders/launcher-model-server-live-two-launcher.vitest.ts:159`
- `.opencode/specs/system-spec-kit/031-embedding-stack-hardening/005-live-validation-bench-hardening/implementation-summary.md:117`

## Findings by Severity

### P0

None.

### P1

#### DR-001-P1-001 [P1] Fresh daemon bootstrap can ignore an explicit embedding provider override

- File: `.opencode/skills/system-spec-kit/mcp_server/context-server.ts:1641`
- Claim: On a fresh database, startup calls `ensureActiveEmbedder()` before `resolveStartupEmbeddingConfig()`, and that bootstrap path uses the local-first `autoSelectActiveEmbedder()` cascade instead of honoring `EMBEDDINGS_PROVIDER`.
- Evidence: `context-server.ts:1641` calls `ensureActiveEmbedder(startupDb, ...)`, then immediately attaches the active vector shard at `context-server.ts:1642`; the provider config is resolved later at `context-server.ts:1659`. `ensureActiveEmbedder()` delegates to `autoSelectActiveEmbedder()` and persists its selected result at `schema.ts:139-151`. The auto-select sequence is hard-coded local-first at `auto-select.ts:478-487`, while `factory.ts:765-771` documents and implements explicit `EMBEDDINGS_PROVIDER` precedence.
- Counterevidence sought: I checked whether `ensureActiveEmbedder()` receives or derives the explicit provider from `resolveProvider()`; it does not in `schema.ts:130-153`. I also checked whether auto-select has an explicit-provider gate; its sequence remains Ollama, hf-local, OpenAI, Voyage.
- Alternative explanation: The active embedder bootstrap might be intended as an independent "best available" selector. That does not fit the startup sequence, because the selected pointer is persisted and used to attach the active shard before the explicit provider config is validated.
- Final severity: P1.
- Confidence: 0.86.
- Downgrade trigger: Downgrade to P2 if a later iteration finds a startup invariant that never calls this path when `EMBEDDINGS_PROVIDER` is explicit, or if explicit cloud/local provider mismatch is intentionally rejected before any persisted metadata can survive.
- Finding class: cross-consumer.
- Scope proof: `rg -n "ensureActiveEmbedder|autoSelectActiveEmbedder|resolveStartupEmbeddingConfig|EMBEDDINGS_PROVIDER"` shows the bootstrap path in `context-server.ts`, metadata persistence in `schema.ts`, and provider precedence in `factory.ts`.
- Affected surface hints: daemon startup, active embedder metadata, vector shard attachment, provider override.
- Recommendation: Route fresh active-embedder initialization through the same explicit-provider resolution used by `resolveStartupEmbeddingConfig()`, or make `ensureActiveEmbedder()` fail closed when an explicit non-auto provider conflicts with the auto-selected candidate.

#### DR-001-P1-002 [P1] Cancelling a running embedder reindex does not stop the worker before completion

- File: `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:421`
- Claim: `cancelJob()` can mark a queued or running job as `cancelled`, but `runJob()` never rereads the persisted status inside its batch loop or before the completion transaction, so a cancelled running job can still write every vector and flip the active embedder to the target model.
- Evidence: `cancelJob()` marks any non-terminal job cancelled at `reindex.ts:547-560`. `runJob()` captures `initialJob`, loops only on `processed < initialJob.total` at `reindex.ts:421`, writes vectors at `reindex.ts:432-435`, and completes by calling `setActiveEmbedder()` plus `setJobStatus(..., 'completed')` at `reindex.ts:441-467`. There is no status check between batches. The existing cancellation test only covers a queued, not running, job at `embedder-reindex.vitest.ts:214-219`.
- Counterevidence sought: I searched the reindex module and tests for a cancellation token, status reread, running-cancel test, or adapter abort path; none appeared in the reviewed files.
- Alternative explanation: Cancellation might only be intended for queued jobs. The public state model contradicts that: `cancelJob()` accepts running jobs by excluding only `completed`, `failed`, and `cancelled`.
- Final severity: P1.
- Confidence: 0.90.
- Downgrade trigger: Downgrade to P2 if the intended contract is changed so running jobs are explicitly non-cancellable and callers never expose cancellation for `status === 'running'`.
- Finding class: instance-only.
- Scope proof: `rg -n "cancelJob|cancelled|setJobStatus|runJob"` in `reindex.ts` found the only cancellation path and no in-loop guard.
- Affected surface hints: embedder model switch, reindex job control, active embedder pointer.
- Recommendation: Reread the job status between batches and immediately before the completion transaction; if cancelled, stop without flipping the active embedder and preserve the processed count.

### P2

#### DR-001-P2-001 [P2] Direct hf-model-server startup can unlink a live Unix socket without the launcher guard

- File: `.opencode/bin/hf-model-server.cjs:155`
- Claim: The direct model-server binary unlinks and retries any Unix socket path after `EADDRINUSE`, but the liveness/perimeter guarded reclaim exists only in `model-server-supervision.cjs`.
- Evidence: `listenHttpServer()` catches `EADDRINUSE` and unconditionally `unlinkSync(target)` before retrying at `hf-model-server.cjs:155-173`. The supervised demand listener has a live-resident guard that refuses to reclaim a socket when a live recorded pid exists at `model-server-supervision.cjs:1225-1233`. The live binary test currently covers bind/health and SIGKILL stale-socket residue at `launcher-model-server-live-two-launcher.vitest.ts:142-166`, but not a second direct process colliding with a live resident.
- Finding class: cross-consumer.
- Scope proof: `rg -n "EADDRINUSE|unlinkSync\\(target\\)|live resident|not reclaiming"` shows the direct binary and supervised launcher use different reclaim policies.
- Affected surface hints: direct hf-model-server CLI, launcher-spawned child, Unix socket ownership.
- Recommendation: Move the guarded reclaim policy into `hf-model-server.cjs` as well, or make the direct binary refuse `EADDRINUSE` unless the socket is proven stale by the same pid/liveness probe.

## Traceability Checks

- Core `spec_code`: partial. The reviewed code matches the broad claims that explicit provider resolution exists, model-server supervision has guarded socket reclaim, cache keys are profile/input-kind scoped, and shutdown checkpoints WAL. The fresh-start interaction between active-embedder bootstrap and explicit provider precedence is not aligned with the provider precedence contract.
- Core `checklist_evidence`: not covered in this inventory pass.
- Overlay `skill_agent`: not covered.
- Overlay `agent_cross_runtime`: not covered.
- Overlay `feature_catalog_code`: partial. Cache and model-server surfaces were sampled.
- Overlay `playbook_capability`: not covered.

## SCOPE VIOLATIONS

None.

## Verdict

CONDITIONAL. Two P1 correctness issues need remediation before this review can pass.

## Next Dimension

Continue correctness, focusing on provider-switch/vector-shard consistency and reindex/cache/search normalization. Then move to security for socket-dir, TCP target, and path-perimeter review.

Review verdict: CONDITIONAL
