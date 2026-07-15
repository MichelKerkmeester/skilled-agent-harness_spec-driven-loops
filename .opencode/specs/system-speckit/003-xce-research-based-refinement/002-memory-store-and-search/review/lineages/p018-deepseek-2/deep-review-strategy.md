# Deep Review Strategy — 018-reindex-scan-responsiveness-and-cancellation

## 1. TOPIC
Review of the reindex-scan responsiveness and cancellation fix: tail-loop event-loop yields, processBatches `shouldAbort` early-abort, and in-memory cancel flag (`isCancelRequestedFast`). Target: spec folder `003-xce-research-based-refinement/002-memory-store-and-search/018-reindex-scan-responsiveness-and-cancellation`.

## 2. REVIEW CHARTER

- **Target**: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/018-reindex-scan-responsiveness-and-cancellation` (spec-folder, Level 1)
- **Dimensions**: correctness, security, traceability, maintainability
- **Stop conditions**: maxIterations=1 OR convergence reached
- **Success criteria**: No P0 findings in correctness; all spec requirements (REQ-001 through REQ-004) verified against shipped implementation

## 3. NON-GOALS
- Evaluating the launcher lease-heartbeat / re-election follow-on (out of scope per spec)
- Reviewing the out-of-process scan worker design question (open question only)
- Performance benchmarking or quantitative yield-latency measurements
- Review of the test file's internal logic (tests are verified separately via `npm run build` + vitest)

## 4. STOP CONDITIONS
- maxIterations=1 (hard cap) reached
- All applicable review dimensions covered with findings recorded

## 5. REVIEW DIMENSIONS (remaining)
<!-- MACHINE-OWNED: START -->
- [x] D1 Correctness, Logic, behavior, edge cases — yield placement safety, abort-path completeness, cancel-flag lifecycle
- [ ] D2 Security, Injection, auth bypass, secrets exposure, unsafe deserialization
- [ ] D3 Traceability, Spec/code alignment, checklist evidence, cross-reference integrity
- [ ] D4 Maintainability, Patterns, clarity, documentation quality, safe follow-on change cost
<!-- MACHINE-OWNED: END -->

## 6. COMPLETED DIMENSIONS
<!-- MACHINE-OWNED: START -->

| Dimension | Verdict | Iteration | Summary |
|-----------|---------|-----------|---------|
| [D1 Correctness] | [PENDING] | [001] | [tbd after iteration] |
<!-- MACHINE-OWNED: END -->

## 7. RUNNING FINDINGS
<!-- MACHINE-OWNED: START -->
- **P0 (Critical):** 0 active
- **P1 (Major):** 0 active
- **P2 (Minor):** 0 active
- **Delta this iteration:** +0 P0, +0 P1, +0 P2
<!-- MACHINE-OWNED: END -->

## 8. WHAT WORKED
[First iteration — populated after iteration 1 completes]

## 9. WHAT FAILED
[First iteration — populated after iteration 1 completes]

## 10. EXHAUSTED APPROACHES (do not retry)
[None yet]

## 11. RULED OUT DIRECTIONS
[None yet]

## 12. NEXT FOCUS
<!-- MACHINE-OWNED: START -->
D1 Correctness: validate yield placement safety (yields only between transactions), abort-path completeness (processBatches shouldAbort + tail-loop yield-while-checks), cancel-flag lifecycle (Set writes and terminal cleanup). Files: `handlers/memory-index.ts`, `utils/batch-processor.ts`, `lib/ops/job-store.ts`.
<!-- MACHINE-OWNED: END -->

## 13. KNOWN CONTEXT
- The fix shipped in response to a live incident where a background `memory_index_scan` with `{force:true, background:true}` starved the daemon's event loop for over an hour.
- Root cause: two synchronous all-rows tail loops (metadata-edge promotion loop and causal-chain folder loop) plus `processBatches` draining no-op batches after cancel.
- Fix: macrotask yields every ~200 rows / ~50 folders, `shouldAbort` on `processBatches` `RetryOptions`, in-process `isCancelRequestedFast`.
- `resource-map.md` not present. Skipping coverage gate.
- Known limitation: launcher lease-heartbeat re-election recycles daemon mid-scan (separate follow-on).

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->

| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | pending | — | REQ-001..004 vs implementation |
| `checklist_evidence` | core | pending | — | tasks.md completion claims vs shipped files |
| `skill_agent` | overlay | notApplicable | — | Not a skill target |
| `agent_cross_runtime` | overlay | notApplicable | — | Not an agent target |
| `feature_catalog_code` | overlay | pending | — | Feature catalog claims vs implementation surfaces |
| `playbook_capability` | overlay | notApplicable | — | No playbook scenarios |
<!-- MACHINE-OWNED: END -->

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->

| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| `mcp_server/handlers/memory-index.ts` | — | — | — | pending |
| `mcp_server/utils/batch-processor.ts` | — | — | — | pending |
| `mcp_server/lib/ops/job-store.ts` | — | — | — | pending |
| `mcp_server/tests/handler-memory-index-scan-jobs.vitest.ts` | — | — | — | pending |
<!-- MACHINE-OWNED: END -->

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 1
- Convergence threshold: 0.10
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-p018-deepseek-2-1781718236450-bbehhf, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 12 tool calls, unrestricted minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[feature_catalog_code]
- Started: 2026-06-17T14:00:00Z
<!-- MACHINE-OWNED: END -->
