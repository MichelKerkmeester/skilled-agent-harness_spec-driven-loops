# Iteration 020

## Dimension

Final cross-cutting completeness: cross-phase state-machine gaps, error-path data loss, idempotency under retry, and confirmation that the honestly-gated flag-flip/dtype/cache-into-reindex items are documented deferrals rather than defects.

## Files Reviewed

- `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:258`
- `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:418`
- `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:437`
- `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:484`
- `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:552`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:527`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:550`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:90`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:278`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:318`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:1325`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:1331`
- `.opencode/specs/system-spec-kit/031-embedding-stack-hardening/spec.md:51`
- `.opencode/specs/system-spec-kit/031-embedding-stack-hardening/spec.md:114`
- `.opencode/specs/system-spec-kit/031-embedding-stack-hardening/spec.md:115`
- `.opencode/specs/system-spec-kit/031-embedding-stack-hardening/004-perf-instrumentation-batching/implementation-summary.md:85`
- `.opencode/specs/system-spec-kit/031-embedding-stack-hardening/005-live-validation-bench-hardening/implementation-summary.md:90`
- `.opencode/specs/system-spec-kit/031-embedding-stack-hardening/005-live-validation-bench-hardening/implementation-summary.md:91`
- `.opencode/specs/system-spec-kit/031-embedding-stack-hardening/005-live-validation-bench-hardening/implementation-summary.md:117`

## Findings by Severity

### P0

None.

### P1

#### DR-020-P1-001 [P1] Failed same-dimension reindex can partially overwrite the active vector shard before the model switch commits

- File: `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:437`
- Evidence: `runJob` resolves `tableName` from the target dimension, sets the job running, and writes every completed batch through `writeVectors(db, tableName, rows, embeddings)` before the completion transaction flips the active embedder pointer. The unqualified `vec_<dim>` name is a temp alias to `active_vec.vec_<dim>` for the currently attached active shard, so same-dimension or no-op reindex writes land in the live search table. If a later batch fails, the catch block only marks the job failed; it does not roll back or restore the vectors already written. `cancelJob` can also mark a running job cancelled while the worker has no in-loop cancellation check, which leaves this pre-commit write path exposed to mixed states.
- Claim adjudication:
  - Claim: a reindex that targets the active dimension can mutate the currently active search vectors before the active pointer commits, then leave those partial writes live if the job fails or is cancelled mid-run.
  - Evidence refs: `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:258`, `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:266`, `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:418`, `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:424`, `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:437`, `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:446`, `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:456`, `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:484`, `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:486`, `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:527`, `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:550`, `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:555`, `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:90`, `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:93`, `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:318`.
  - Counterevidence sought: checked whether reindex writes only to a staging shard before commit, whether active queries ignore the alias until completion, whether failures roll back prior batch writes, and whether same-dimension/no-op targets are rejected before queuing.
  - Alternative explanation: current shipped registry has a narrow local manifest set, so the most common production switch is different-dimension or no-op; however the code path is generic, the operator model-switch contract is not dimension-exclusive, and a no-op/same-dimension reindex still violates atomicity by mutating live search rows before job success.
  - Final severity: P1.
  - Confidence: 0.81.
  - Downgrade trigger: downgrade if the public reindex entry point is made unreachable for active-name/active-dimension targets, or if `writeVectors(db, tableName, ...)` is proven not to resolve to the active shard alias under an attached active profile.
- Finding class: cross-consumer.
- Scope proof: direct read covered the reindex writer, active-shard alias creation, active vector query source selection, failure handling, and cancellation handling. This is distinct from EMB-2 because it is about pre-commit active-vector mutation on failure/idempotency paths, not only cancellation continuing to completion.
- Affected surface hints: reindex worker, active vector shard alias, vector search query source, model-switch status.
- Recommendation: stage all target vectors exclusively in the target shard until the completion transaction, and avoid writing through the active `vec_<dim>` alias before the active pointer flips. Add a same-dimension failure test that proves active search vectors remain unchanged after a mid-run embed failure or cancellation.

### P2

None new.

## Traceability Checks

- `spec_code`: covered. The final pass cross-checked the model-switch/reindex code against the phase parent and child implementation summaries.
- `checklist_evidence`: partial. Existing reindex tests cover completion and first-batch failure leaving the active pointer unchanged, but not same-dimension partial vector rollback or active-search invariance after a later batch failure.
- `skill_agent`: not applicable for this code-only leaf pass.
- `agent_cross_runtime`: not applicable for this code-only leaf pass.
- `feature_catalog_code`: partial. Existing P2 ENV reference drift remains separate and was not re-reported.
- `playbook_capability`: not applicable.

## Ruled Out / Adjudication

- WAL-1/WAL-2 are treated as fixed for this pass. `vector-index-store.ts:1325-1362` now checkpoints tracked non-active and active connections before close, and `reindex.ts:378-383` explicitly flushes/truncates the reindex shard WAL before close.
- The honestly-gated items remain documented deferrals, not defects: parent status gates flag-flip and live perf/dtype numbers on a working onnxruntime tree; phase 005 keeps the flag default-off, leaves dtype as `q8`, and documents cache-into-reindex as re-deferred pending the pre-existing reindex-vs-query normalization fix.
- The prior P1 clusters for provider override, running reindex cancellation, TCP unauthenticated transport, workflow lock fail-open, daemon child ledger drift, and model-server lease/listener lifecycle remain prior findings and were not re-reported as new.

## Verdict

CONDITIONAL. No P0 found. One new P1 was found in the final cross-cutting pass, so release readiness still requires remediation planning before PASS.

## Next Dimension

Review loop max iteration reached. Next action should be synthesis/remediation planning, with DR-020-P1-001 added to the reindex/model-switch workstream.
