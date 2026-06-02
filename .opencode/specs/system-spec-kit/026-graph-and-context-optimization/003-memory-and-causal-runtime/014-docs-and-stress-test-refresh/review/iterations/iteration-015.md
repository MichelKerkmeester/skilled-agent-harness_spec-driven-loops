# Deep Review Iteration 015

## Dimension

correctness — enrichment-marker-backfill-stress + index-scan-coalescing-stress vitest deep logic: do mocks/assertions match real `repairIncompleteMarkers` + `acquireIndexScanLease` behavior?

## Files Reviewed

- `.opencode/skills/sk-code-review/references/review_core.md:18` — severity baseline loaded before final severity calls.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/014-docs-and-stress-test-refresh/review/deep-review-config.json:104` — review scope manifest confirmed.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/014-docs-and-stress-test-refresh/review/deep-review-findings-registry.json:243` — prior `R11-P2-001` enrichment deferred-marker overstatement confirmed active and not duplicated.
- `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/enrichment-marker-backfill-stress.vitest.ts:20` — post-insert enrichment is the only mocked dependency.
- `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/enrichment-marker-backfill-stress.vitest.ts:139` — flood test drives real marker mutation and `repairIncompleteMarkers` over pending markers.
- `.opencode/skills/system-spec-kit/mcp_server/handlers/save/enrichment-state.ts:230` — real repair selection and result accounting checked.
- `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/index-scan-coalescing-stress.vitest.ts:48` — concurrent lease acquisition stress checked.
- `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/index-scan-coalescing-stress.vitest.ts:76` — cooldown transition stress checked.
- `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/index-scan-coalescing-stress.vitest.ts:105` — stale lease reclamation stress checked.
- `.opencode/skills/system-spec-kit/mcp_server/core/db-state.ts:389` — real lease acquisition implementation checked.
- `.opencode/skills/system-spec-kit/mcp_server/core/db-state.ts:516` — real lease completion implementation checked.

## Findings by Severity

### P0

None.

### P1

None.

### P2

No new P2 finding. The only enrichment mismatch found in this slice is already active as `R11-P2-001`: the stress narrative/counting overstates deferred-marker coverage while real repair selects only `pending`, `partial`, and `failed`. This iteration did not re-report it.

## Traceability Checks

- `stress_to_repair_contract`: PASS for the pending-marker scenario. The stress creates only `pending` markers with `markEnrichmentPending`, calls the real `repairIncompleteMarkers`, and the real repair query selects `pending`, `partial`, and `failed`, so the tested scenario matches production repair behavior. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/enrichment-marker-backfill-stress.vitest.ts:143`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/save/enrichment-state.ts:230`]
- `mock_fidelity`: PASS. The stress mocks `runPostInsertEnrichmentIfEnabled` to return a complete result, but still drives the real repair path: `repairIncompleteMarkers` scans rows, calls `repairEnrichmentOnReplay`, and counts repaired rows from the real result status mapping. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/enrichment-marker-backfill-stress.vitest.ts:20`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/save/enrichment-state.ts:245`]
- `index_scan_lease_coalescing`: PASS. The concurrent acquisition test matches the real SQLite transaction reservation: one call writes `scan_started_at`, and later calls at the same logical `now` return structured `lease_active` waits. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/index-scan-coalescing-stress.vitest.ts:54`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/core/db-state.ts:422`]
- `index_scan_cooldown_and_stale_reclaim`: PASS. The test's completion, cooldown, and stale-reclaim assertions match `completeIndexScanLease`, cooldown refusal, and `clearStaleScanLease`. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/index-scan-coalescing-stress.vitest.ts:79`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/core/db-state.ts:364`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/core/db-state.ts:455`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/core/db-state.ts:516`]

## SCOPE VIOLATIONS

None. Writes were limited to this iteration narrative and the per-iteration delta file. The shared state log, registry, strategy, reviewed source files, and reviewed spec files were not modified.

## Verdict

PASS for this iteration slice. Existing prior active findings keep the overall loop provisional verdict at CONDITIONAL, but this focused correctness pass found no new P0/P1/P2 issue.

## Next Dimension

Continue with the orchestrator-selected next stabilization or traceability slice; do not re-open the already-recorded `R11-P2-001` deferred-marker wording issue unless remediation evidence appears.

Review verdict: PASS
