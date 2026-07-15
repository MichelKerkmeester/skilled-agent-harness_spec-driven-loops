# Deep Review Iteration 015

## Dimension

Auto-select + factory + registry re-examination: provider override precedence, partial-provider fallback behavior, and dimension handling when bootstrap selection and later factory resolution disagree.

Scope class: complex. This pass stayed on the committed embedding provider selection path: `auto-select.ts`, `factory.ts`, `registry.ts`, active metadata persistence, daemon startup, and the first save/search consumers that read provider/model/dimension before provider initialization.

## Files Reviewed

- `.opencode/skills/system-spec-kit/shared/embeddings/auto-select.ts:438`
- `.opencode/skills/system-spec-kit/shared/embeddings/auto-select.ts:478`
- `.opencode/skills/system-spec-kit/shared/embeddings/auto-select.ts:507`
- `.opencode/skills/system-spec-kit/shared/embeddings/registry.ts:146`
- `.opencode/skills/system-spec-kit/shared/embeddings/factory.ts:425`
- `.opencode/skills/system-spec-kit/shared/embeddings/factory.ts:486`
- `.opencode/skills/system-spec-kit/shared/embeddings/factory.ts:599`
- `.opencode/skills/system-spec-kit/shared/embeddings/factory.ts:645`
- `.opencode/skills/system-spec-kit/shared/embeddings/factory.ts:679`
- `.opencode/skills/system-spec-kit/shared/embeddings/factory.ts:720`
- `.opencode/skills/system-spec-kit/shared/embeddings/factory.ts:765`
- `.opencode/skills/system-spec-kit/shared/embeddings/factory.ts:774`
- `.opencode/skills/system-spec-kit/shared/embeddings/factory.ts:782`
- `.opencode/skills/system-spec-kit/shared/embeddings/factory.ts:1079`
- `.opencode/skills/system-spec-kit/shared/embeddings/factory.ts:1164`
- `.opencode/skills/system-spec-kit/shared/embeddings.ts:776`
- `.opencode/skills/system-spec-kit/shared/embeddings.ts:792`
- `.opencode/skills/system-spec-kit/mcp_server/context-server.ts:1641`
- `.opencode/skills/system-spec-kit/mcp_server/context-server.ts:1659`
- `.opencode/skills/system-spec-kit/mcp_server/context-server.ts:1709`
- `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/schema.ts:139`
- `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/schema.ts:149`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:372`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts:134`
- `.opencode/skills/system-spec-kit/mcp_server/tests/embedder-auto-selection.vitest.ts:134`
- `.opencode/skills/system-spec-kit/mcp_server/tests/embeddings.vitest.ts:492`

## Findings by Severity

### P0

None.

### P1

#### DR-015-P1-001 [P1] Startup resolver ignores persisted non-Ollama active embedders, so local-first bootstrap can be overwritten by stale cloud config

- File: `.opencode/skills/system-spec-kit/shared/embeddings/factory.ts:774`
- Claim: `ensureActiveEmbedder()` can persist `hf-local`, `openai`, or `voyage` from the local-first bootstrap cascade, but the later factory startup resolver only recognizes persisted Ollama metadata. If hf-local wins bootstrap while a stale usable `VOYAGE_API_KEY` or `OPENAI_API_KEY` is present, startup validation and `EMBEDDING_DIM` can switch the process back to the cloud provider/dimension even though the active shard was attached for the persisted local profile.
- Evidence: `context-server.ts:1641` calls `ensureActiveEmbedder()` and `context-server.ts:1642` attaches the active shard before validation. `ensureActiveEmbedder()` persists the selected provider through `schema.ts:139-151`; `auto-select.ts:478-487` tries `ollama`, then `hf-local`, then cloud APIs. The next startup stage calls `resolveStartupEmbeddingConfig()` at `context-server.ts:1659`, which uses `resolveProvider()` at `factory.ts:724`. That resolver only consults `resolveActiveOllamaEmbedder()` at `factory.ts:774`; `readActiveOllamaEmbedderFromDb()` rejects non-Ollama names by requiring `getOllamaManifest(name)` at `factory.ts:434-437`, while the generic metadata reader at `factory.ts:486-505` is used only for hf-local drift warnings. The same startup block then writes `process.env.EMBEDDING_DIM` from that factory resolution at `context-server.ts:1709-1712`. Before the provider singleton exists, `embeddings.getEmbeddingDimension()` delegates to `getStartupEmbeddingDimension()` at `embeddings.ts:776-781`, and save paths read model/dimension before generating at `embedding-pipeline.ts:134-136`.
- Counterevidence sought: I checked whether `resolveProvider()` reads generic active metadata, whether `getProviderInfo()` reuses the bootstrap metadata after non-Ollama persistence, and whether tests cover "hf-local selected while cloud key exists". They do not: the provider-flap test covers no-key Ollama recovery at `embeddings.vitest.ts:492-505`, and auto-selection tests cover hf-local selection at `embedder-auto-selection.vitest.ts:134-147` without then re-entering factory startup under stale cloud env.
- Alternative explanation: Operators may treat any usable cloud key as intentional. That does not fit the local-first bootstrap contract, because the system has already persisted and attached the selected active profile before the cloud validation/dimension path runs.
- Final severity: P1.
- Confidence: 0.83.
- Downgrade trigger: Downgrade if startup is changed so `resolveProvider()` consumes the persisted `active_embedder_provider` for all provider kinds, or if `EMBEDDING_DIM` and pre-init model/dimension readers are proven unreachable after a non-Ollama active pointer is persisted.
- Finding class: cross-consumer.
- Scope proof: `rg -n "ensureActiveEmbedder|autoSelectActiveEmbedder|resolveStartupEmbeddingConfig|resolveProvider|getEmbeddingDimension|EMBEDDING_DIM"` ties the same provider choice through bootstrap, factory startup, dimension export, and save/cache callers.
- Affected surface hints: daemon startup, active embedder metadata, factory provider resolution, pre-init embedding dimension, save/cache profile keys.
- Recommendation: Make `resolveProvider()` honor generic persisted active metadata (`provider`, `name`, `dim`) before cloud env keys, or pass the `ensureActiveEmbedder()` result into startup validation/profile derivation so shard attachment, validation, provider metadata, and `EMBEDDING_DIM` share one selected profile.

### P2

None.

## Traceability Checks

- Core `spec_code`: partial. The local-first cascade is present in `auto-select.ts`, and canonical fallback names derive from `registry.ts`; the startup resolver still has a cross-stage mismatch for persisted non-Ollama active providers.
- Core `checklist_evidence`: partial. Existing tests cover hf-local auto-selection and Ollama provider-flap recovery, but not hf-local/bootstrap persistence followed by factory startup with stale cloud env.
- Overlay `skill_agent`: not applicable for this iteration.
- Overlay `agent_cross_runtime`: not applicable for this iteration.
- Overlay `feature_catalog_code`: partial. The status/save provider surfaces were checked only where they consume factory metadata and dimensions.
- Overlay `playbook_capability`: not covered.

## SCOPE VIOLATIONS

None.

## Verdict

CONDITIONAL. One new P1 correctness finding extends the provider-selection workstream; existing open P1s still keep the review from PASS.

Parallel-mode note: I wrote the iteration narrative and per-iteration delta only. I did not append the shared `deep-review-state.jsonl`, because this dispatch explicitly says concurrent agents must not append to the shared log and the orchestrator merges deltas afterward.

## Next Dimension

Continue line-level adversarial passes on provider metadata/status and cache key consumers after remediation groups are planned, with special attention to stale env plus persisted active metadata cases.

Review verdict: CONDITIONAL
