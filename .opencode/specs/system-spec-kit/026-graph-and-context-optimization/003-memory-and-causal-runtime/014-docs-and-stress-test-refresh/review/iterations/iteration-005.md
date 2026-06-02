# Deep Review Iteration 005

## Dimension

correctness (pass 2: stress assertions + doc-vs-source claims; duplicate findings suppressed)

## Files Reviewed

- `.opencode/skills/sk-code-review/references/review_core.md:18`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/014-docs-and-stress-test-refresh/review/deep-review-config.json:104`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/014-docs-and-stress-test-refresh/review/deep-review-findings-registry.json:9`
- `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/checkpoint-v2-contention-stress.vitest.ts:180`
- `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/README.md:21`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/014-docs-and-stress-test-refresh/004-stress-test-durability-domain/spec.md:112`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/014-docs-and-stress-test-refresh/004-stress-test-durability-domain/decision-record.md:153`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/014-docs-and-stress-test-refresh/004-stress-test-durability-domain/implementation-summary.md:70`
- `.opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1006`
- `.opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:2665`
- `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/enrichment-marker-backfill-stress.vitest.ts:139`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/save/enrichment-state.ts:230`
- `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/index-scan-coalescing-stress.vitest.ts:48`
- `.opencode/skills/system-spec-kit/mcp_server/core/db-state.ts:389`
- `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/daemon-recycle-transparency-stress.vitest.ts:76`
- `.opencode/skills/system-spec-kit/mcp_server/context-server.ts:1014`
- `.opencode/skills/system-spec-kit/mcp_server/package.json:3`

## Findings by Severity

### P0

- No new P0 findings.

### P1

- `R5-P1-001` [P1] Durability README claims the checkpoint catalog stays bounded after v2 restore cycles. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/README.md:21`]
- Claim: The durability README says the checkpoint-v2 contention case keeps the catalog bounded at `MAX_CHECKPOINTS`.
- Evidence: The stress test explicitly documents the opposite post-restore behavior: catalog rows may outnumber on-disk dirs because v2 restore merges older catalog rows back in, and the actual assertion is only that live on-disk snapshot dirs stay `<= MAX_CHECKPOINTS`. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/checkpoint-v2-contention-stress.vitest.ts:180`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/checkpoint-v2-contention-stress.vitest.ts:186`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/checkpoint-v2-contention-stress.vitest.ts:195`]
- Evidence: The child spec and decision record preserve the correct invariant, and checkpoint source confirms create-time pruning plus post-restore catalog merge. [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/014-docs-and-stress-test-refresh/004-stress-test-durability-domain/spec.md:112`] [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/014-docs-and-stress-test-refresh/004-stress-test-durability-domain/decision-record.md:153`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1006`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:2665`]
- Counterevidence sought: Checked create-time pruning, restore catalog merge, `listCheckpoints`, the child spec, decision record, implementation summary, and stress assertions for any source that intentionally bounds restored catalog rows.
- Alternative explanation: The README sentence may have intended create-time pruning shorthand, but it is attached to a create+restore stress row and contradicts the test's explicit post-restore catalog note.
- Final severity: P1, confidence 0.91.
- Downgrade trigger: Downgrade to P2 only if the README row is clarified as create-time-only pruning or as shorthand for the on-disk snapshot directory catalog while preserving the restore catalog merge behavior.
- Recommended fix: Change the README row to say the on-disk snapshot directory set stays bounded by `MAX_CHECKPOINTS` and no orphaned snapshot/`.tmp-` dirs survive; do not claim the checkpoint catalog row count is bounded after v2 restore.

### P2

- No new P2 findings.

## Traceability Checks

- `checkpoint_catalog_vs_disk_invariant`: FAIL. README scope row says the catalog stays bounded, while the source-backed stress invariant is bounded on-disk snapshot directories. New finding `R5-P1-001` records this as a separate doc-vs-source correctness issue, distinct from prior `R1-P2-001` snapshotFormat masking. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/README.md:21`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/checkpoint-v2-contention-stress.vitest.ts:180`]
- `enrichment_marker_backfill_convergence`: PASS for this pass. The stress floods `pending` markers, bounded repair scans only pending/partial/failed rows, and the test asserts the incomplete set reaches zero with per-pass work bounded by `BACKFILL_LIMIT`. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/enrichment-marker-backfill-stress.vitest.ts:139`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/save/enrichment-state.ts:230`]
- `index_scan_lease_coalescing`: PASS for this pass. The stress assertions match the config-table lease source: active leases return `lease_active`, completed scans stamp `last_index_scan`, cooldown returns `cooldown`, and stale leases are cleared before reservation. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/index-scan-coalescing-stress.vitest.ts:48`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/core/db-state.ts:389`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/core/db-state.ts:455`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/core/db-state.ts:516`]
- `daemon_recycle_replay_model`: DEDUPED. The model-vs-production replay concern is already active as `R1-P1-001`; this pass did not emit a duplicate. [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/014-docs-and-stress-test-refresh/review/deep-review-findings-registry.json:11`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/daemon-recycle-transparency-stress.vitest.ts:76`]
- `server_metadata_version_source`: PASS at the source level. `context-server.ts` and `package.json` both advertise `1.8.0`; prior documentation drift remains covered by `R3-P1-001` and was not duplicated. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/context-server.ts:1014`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/package.json:3`]
- `graph_status`: BLOCKED. `code_graph_status` reports stale readiness because git HEAD changed and stale-file thresholds are exceeded, so this iteration used graphless fallback through direct reads and exact searches.

## Search Depth V2

- Scope class: complex.
- Enforcement: strict.
- Graph coverage mode: graphless fallback.
- Selected targets: four durability stress tests, durability README, checkpoint source, enrichment marker source, index-scan lease source, server metadata source, and prior findings registry.
- Discovery methods: direct reads, exact text search, stale code-graph health check.
- Omitted high-risk targets: remaining lower-risk feature catalog and manual playbook files were not re-sampled in this correctness pass because prior traceability and maintainability iterations already covered those overlays; this pass focused on stress assertions and doc-vs-source claims.

## SCOPE VIOLATIONS

None.

## Verdict

This iteration is conditional because it adds one new P1 documentation-vs-source correctness finding. Loop-level verdict remains conditional with active P1 findings.

## Next Dimension

All configured dimensions are covered. Next focus should be remediation planning for active P1 findings or a stabilization pass after fixes.
Review verdict: CONDITIONAL
