# Review Strategy: 019-maintenance-grace-daemon-survives-reelection

## topic

Review of the maintenance-grace marker and launcher adopt-guard implementation for phase 019.

## review-dimensions

- [ ] correctness
- [ ] security
- [ ] traceability
- [ ] maintainability

## completed-dimensions

- [x] correctness (iteration 001) — one P1 and three P2 findings recorded

## running-findings

- P0: 0 active
- P1: 1 active (F001)
- P2: 4 active (F002, F003, F004, F005)

## what-worked

- Reading the actual marker writer, launcher predicate, and both guard sites in one pass gave a clear picture of runtime behavior.
- Cross-referencing the spec/plan/implementation-summary immediately surfaced doc drift.

## what-failed

- N/A (single-iteration run)

## exhausted-approaches

- N/A

## ruled-out-directions

- N/A

## next-focus

security (dimension not yet covered; maxIterations=1 prevents further dispatch in this lineage)

## known-context

- resource-map.md not present. Skipping coverage gate.
- The phase ships a reference-counted `maintenance-marker.ts` writer used by `memory-index.ts` (index_scan) and `retry-manager.ts` (embedding-queue).
- Launcher adopt logic lives in `.opencode/bin/mk-spec-memory-launcher.cjs` and `.opencode/bin/lib/model-server-supervision.cjs`.
- The phase status in graph-metadata.json is `complete_(code)`.

## cross-reference-status

| Protocol | Level | Status | Notes |
|----------|-------|--------|-------|
| spec_code | core | partial | Marker field name drift (F001) |
| checklist_evidence | core | pass | Completion claims have evidence in implementation-summary.md |
| feature_catalog_code | overlay | N/A | Not exercised this iteration |
| playbook_capability | overlay | N/A | Not exercised this iteration |

## files-under-review

| File | Status | Notes |
|------|--------|-------|
| .opencode/skills/system-spec-kit/mcp_server/lib/storage/maintenance-marker.ts | reviewed | Marker writer and ref-count logic |
| .opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts | reviewed | Background scan integration |
| .opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts | reviewed | Embedding-queue holder |
| .opencode/bin/lib/model-server-supervision.cjs | reviewed | Pure adopt predicate |
| .opencode/bin/mk-spec-memory-launcher.cjs | reviewed | Two guard sites |
| .opencode/skills/system-spec-kit/mcp_server/tests/launcher-maintenance-guard.vitest.ts | reviewed | Predicate unit tests |
| .opencode/skills/system-spec-kit/mcp_server/stress_test/durability/daemon-reelection-adoption-live.vitest.ts | reviewed | Isolated harness cases |

## review-boundaries

- Max iterations: 1
- Convergence threshold: 0.10
- Severity threshold: P2
- Target: spec-folder
- Executor: cli-opencode model=kimi-for-coding/k2p7
