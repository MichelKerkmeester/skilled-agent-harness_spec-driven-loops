# Deep Review Iteration 011

## Dimension

correctness - focused stress durability pass over assertion strength, throwaway-only isolation, replaySnapshot modeling fidelity, and enrichment/coalescing/checkpoint contract accuracy.

## Files Reviewed

- `.opencode/skills/sk-code-review/references/review_core.md:18` - severity doctrine loaded before final severity calls.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/014-docs-and-stress-test-refresh/review/deep-review-config.json:104` - review scope manifest confirms the four durability stress files are in scope.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/014-docs-and-stress-test-refresh/review/deep-review-findings-registry.json:11` - prior daemon replay model finding used for deduplication.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/014-docs-and-stress-test-refresh/review/deep-review-findings-registry.json:127` - prior checkpoint snapshotFormat assertion finding used for deduplication.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/014-docs-and-stress-test-refresh/review/deep-review-findings-registry.json:98` - prior checkpoint catalog-vs-disk finding used for deduplication.
- `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/checkpoint-v2-contention-stress.vitest.ts:156` - v2 create assertion and snapshotFormat guard.
- `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/checkpoint-v2-contention-stress.vitest.ts:180` - on-disk orphan and bounded live-dir durability invariant.
- `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/checkpoint-v2-contention-stress.vitest.ts:202` - restore barrier assertion.
- `.opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:2301` - `createCheckpointV2` returns `snapshotFormat: 'v2'`.
- `.opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:2535` - restore barrier acquired before v2 swap work.
- `.opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:2639` - restore journal advances to `swap-done` after file swap.
- `.opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:2730` - restore barrier released in `finally`.
- `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/daemon-recycle-transparency-stress.vitest.ts:76` - local replay model under prior finding `R1-P1-001`.
- `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/daemon-recycle-transparency-stress.vitest.ts:130` - replay partition assertion under load.
- `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/daemon-recycle-transparency-stress.vitest.ts:162` - sampled read-vs-unsafe classifier assertions.
- `.opencode/bin/lib/launcher-session-proxy.cjs:18` - retryable recycle error constant.
- `.opencode/bin/lib/launcher-session-proxy.cjs:113` - production `classifyFrame` implementation.
- `.opencode/bin/lib/launcher-session-proxy.cjs:595` - production `replaySnapshot` implementation.
- `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/enrichment-marker-backfill-stress.vitest.ts:6` - stress claim about partial-index-eligible incomplete markers draining.
- `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/enrichment-marker-backfill-stress.vitest.ts:100` - helper counts every `status != 'complete'` row as incomplete backlog.
- `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/enrichment-marker-backfill-stress.vitest.ts:160` - loop assumes every incomplete row eventually repairs.
- `.opencode/skills/system-spec-kit/mcp_server/handlers/save/enrichment-state.ts:21` - production marker status includes `deferred`.
- `.opencode/skills/system-spec-kit/mcp_server/handlers/save/enrichment-state.ts:208` - production replay repair leaves `deferred` untouched.
- `.opencode/skills/system-spec-kit/mcp_server/handlers/save/enrichment-state.ts:230` - production bounded backfill scans only `pending`, `partial`, and `failed` rows.
- `.opencode/skills/system-spec-kit/mcp_server/tests/enrichment-state.vitest.ts:165` - existing unit coverage confirms deferred rows are not repaired by replay or backfill.
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:144` - partial index predicate is `status != 'complete'`.
- `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/index-scan-coalescing-stress.vitest.ts:48` - single-writer acquisition burst assertions.
- `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/index-scan-coalescing-stress.vitest.ts:76` - cooldown coalescing assertions.
- `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/index-scan-coalescing-stress.vitest.ts:105` - stale lease reclaim assertions.
- `.opencode/skills/system-spec-kit/mcp_server/core/db-state.ts:389` - production `acquireIndexScanLease` contract.
- `.opencode/skills/system-spec-kit/mcp_server/core/db-state.ts:516` - production `completeIndexScanLease` contract.

## Findings by Severity

### P0

None.

### P1

None. The daemon replay model gap remains covered by prior active finding `R1-P1-001`; no new non-duplicate P1 was found in this pass.

### P2

#### R11-P2-001 - Enrichment stress overstates backfill coverage for deferred marker rows

- File: `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/enrichment-marker-backfill-stress.vitest.ts:9`
- Evidence: The stress prose says every marker converges to `complete` and that the partial-index-eligible incomplete set drains to empty. Its helper counts all rows with `post_insert_enrichment_status != 'complete'`, matching the partial-index predicate. Production status includes `deferred`, `repairEnrichmentOnReplay` returns `deferred` without repairing it, and `repairIncompleteMarkers` selects only `pending`, `partial`, and `failed`; existing unit coverage explicitly asserts deferred rows are not repaired by replay or bounded backfill. The stress only proves pending flood convergence, not full partial-index drain semantics.
- Evidence refs: `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/enrichment-marker-backfill-stress.vitest.ts:9`, `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/enrichment-marker-backfill-stress.vitest.ts:100`, `.opencode/skills/system-spec-kit/mcp_server/handlers/save/enrichment-state.ts:21`, `.opencode/skills/system-spec-kit/mcp_server/handlers/save/enrichment-state.ts:208`, `.opencode/skills/system-spec-kit/mcp_server/handlers/save/enrichment-state.ts:230`, `.opencode/skills/system-spec-kit/mcp_server/tests/enrichment-state.vitest.ts:165`, `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:144`
- Finding class: `matrix/evidence`
- Scope proof: Direct reads show this is a stress-contract/assertion-strength gap, not a production behavior bug; production already has focused unit coverage for the deferred marker branch.
- Recommendation: Narrow the stress prose and helper naming to the repairable backlog (`pending`, `partial`, `failed`) or add a dedicated assertion that `deferred` rows remain deferred and are excluded from the bounded backfill result.

## Traceability Checks

- `checkpoint_v2_contention_contract`: Deduped/ruled out for new findings. `createCheckpointV2` now returns `snapshotFormat: 'v2'`, restore takes/releases the barrier around the swap, and the on-disk orphan/live-dir checks align with the current v2 disk invariant. Prior `R1-P2-001` and `R5-P1-001` cover the known snapshotFormat assertion weakness and catalog-vs-disk wording drift.
- `daemon_replay_snapshot_model`: Deduped/ruled out for new findings. The test still locally models `replaySnapshot`, but that is already active as `R1-P1-001`; this pass found no additional non-duplicate correctness issue in the sampled replay partition/classifier assertions.
- `enrichment_marker_backfill_contract`: New P2. The stress conflates all partial-index rows with the repairable backlog and omits the intentionally non-repaired `deferred` status.
- `index_scan_coalescing_contract`: Ruled out. The stress assertions match the config-table lease contract: active lease returns `lease_active`, completion stamps `last_index_scan`, cooldown returns `cooldown`, and stale leases are cleared before reservation.
- `graph_status`: Structural graph traversal was unavailable for trusted use because code graph readiness is stale; this iteration used graphless fallback through direct reads and exact searches.

## Verdict

PASS with advisory. This iteration found one new P2 assertion-strength issue and no new P0/P1 defects.

## Next Dimension

All configured dimensions are already covered. If the loop continues, the next useful pass is traceability or fix-verification for open P1/P2 items rather than another broad correctness pass.

Review verdict: PASS
