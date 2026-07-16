# Deep Review Strategy - Session Tracking

## TOPIC
Review of `020-maintenance-grace-background-embedding` — a shared reference-counted maintenance marker module that widens 019's scan-only marker to also cover the post-scan background-embedding queue, so a daemon busy with either is adopted rather than reaped, and a full reindex plus its post-scan embedding burst survives launcher contention end to end.

## REVIEW DIMENSIONS (remaining)
<!-- MACHINE-OWNED: START -->
- [x] D1 Correctness: Logic, invariants, state transitions, edge cases, behavior against observable intent. **Verdict: PASS**
- [ ] D2 Security: Trust boundaries, authz/authn behavior, input handling, secrets exposure, exploit paths.
- [ ] D3 Traceability: Spec/code alignment, checklist evidence, cross-reference integrity.
- [ ] D4 Maintainability: Patterns, clarity, documentation quality, safe follow-on change cost.
<!-- MACHINE-OWNED: END -->

## NON-GOALS
- Not assessing the 019 launcher-side adopt/reap guard (unchanged, out of scope).
- Not assessing the full live end-to-end reindex run (deploy-time confirmation, per spec).
- Not assessing the cooperative chunk-and-yield follow-on for synchronous phases (noted as future work).

## STOP CONDITIONS
- Max iterations (1) reached.
- All dimensions covered with no active P0/P1.

## COMPLETED DIMENSIONS
<!-- MACHINE-OWNED: START -->
| Dimension | Verdict | Iteration | Summary |
|-----------|---------|-----------|---------|
| D1 Correctness | PASS | 1 | All 4 REQ claims verified against implementation; 3 P2 advisories noted |
<!-- MACHINE-OWNED: END -->

## RUNNING FINDINGS
<!-- MACHINE-OWNED: START -->
- **P0 (Critical):** 0 active
- **P1 (Major):** 0 active
- **P2 (Minor):** 3 active
- **Delta this iteration:** +0 P0, +0 P1, +3 P2
<!-- MACHINE-OWNED: END -->

## WHAT WORKED
- Direct file:line traceability from spec REQ claims to implementation evidence (iteration 1)
- Reference-counted marker design correctly handles overlapping scan and embedding-queue lifetimes (iteration 1)

## WHAT FAILED
[No failures]

## EXHAUSTED APPROACHES (do not retry)
[None]

## RULED OUT DIRECTIONS
- Race between activeCount and file write: Single-threaded Node.js rules this out (iteration 1, evidence: maintenance-marker.ts:58-84)
- Timer leak on overlapping begin/end cycles: guarded by `if (!refreshTimer)` and cleared only at activeCount=0 (iteration 1)

## NEXT FOCUS
<!-- MACHINE-OWNED: START -->
D2 Security — verify input handling (process.pid, label string) in marker module; check atomicWriteFile and marker file write path; verify embedding queue content loading and retry logic for filesystem access boundaries.
<!-- MACHINE-OWNED: END -->

## KNOWN CONTEXT
- 019 made a reindex's scan survive launcher re-election via a maintenance marker scoped to the scan job.
- The scan defers embeddings (`asyncEmbedding`), so the real vector writes run in the post-scan background-embedding queue (`retry-manager.ts` draining `embedding_status='pending'` rows).
- A live run saw a separate re-election recycle the daemon DURING the post-scan embedding burst, because the queue was busy-but-unprotected.
- This phase (020) extracts the marker writer into a shared, reference-counted module so both scan and embedding queue can hold it through their overlap.
- The launcher-side adopt/reap guard from 019 is unchanged; only the writer is widened.
- `resource-map.md` not present. Skipping coverage gate.

## CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | pass | 1 | All 4 REQ claims verified against implementation |
| `checklist_evidence` | core | notApplicable | 1 | No checklist.md present (Level 1 spec) |
| `feature_catalog_code` | overlay | pass | 1 | Catalog claim matches handler implementation |
<!-- MACHINE-OWNED: END -->

## FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| `mcp_server/lib/storage/maintenance-marker.ts` | D1 | 1 | 0 P0, 0 P1, 2 P2 | complete |
| `mcp_server/handlers/memory-index.ts` | D1 | 1 | 0 P0, 0 P1, 1 P2 | complete |
| `mcp_server/lib/providers/retry-manager.ts` | D1 | 1 | 0 P0, 0 P1, 0 P2 | complete |
| `mcp_server/tests/maintenance-marker.vitest.ts` | D1 | 1 | 0 P0, 0 P1, 0 P2 | complete |
<!-- MACHINE-OWNED: END -->

## REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 1
- Convergence threshold: 0.10
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-p020-deepseek-2-1781721166412-nlwse6, lineageMode=new, generation=1
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=["spec_code","checklist_evidence"], overlay=["feature_catalog_code"]
- Started: 2026-06-17T16:30:00Z
<!-- MACHINE-OWNED: END -->
