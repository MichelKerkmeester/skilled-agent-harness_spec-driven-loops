# Deep Review Strategy

<!-- ANCHOR:topic -->
## Topic
Fan-out lineage review for `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/015-storage-adapter-ports`, focused on storage adapter ports and behavior-preserving seam extraction.
<!-- /ANCHOR:topic -->

<!-- ANCHOR:review-dimensions -->
## Review Dimensions
| Dimension | Status | Iterations | Verdict |
|-----------|--------|------------|---------|
| correctness | covered | 001, 005 | CONDITIONAL |
| security | covered | 002, 006 | PASS |
| traceability | covered | 003, 005 | CONDITIONAL |
| maintainability | covered | 004, 006 | PASS |
<!-- /ANCHOR:review-dimensions -->

<!-- ANCHOR:completed-dimensions -->
## Completed Dimensions
- [x] Correctness: Found F001, a production/fake VectorStore keying mismatch.
- [x] Security: No P0/P1 security issue confirmed in internal maintenance/contention call paths.
- [x] Traceability: Found F002 and F003 around VectorStore clear scope and missing contract assertions.
- [x] Maintainability: GraphTraversal routing is clean; active residual issues are vector contract boundaries.
<!-- /ANCHOR:completed-dimensions -->

<!-- ANCHOR:running-findings -->
## Running Findings
| Severity | Active | Finding IDs |
|----------|--------|-------------|
| P0 | 0 | none |
| P1 | 2 | F001, F002 |
| P2 | 1 | F003 |
<!-- /ANCHOR:running-findings -->

<!-- ANCHOR:what-worked -->
## What Worked
- Direct source reads were sufficient because the code graph was stale.
- Comparing the production port against fakes exposed substitutability gaps.
- Replaying completion claims against spec/tasks/implementation-summary separated documentation evidence from contract coverage gaps.
<!-- /ANCHOR:what-worked -->

<!-- ANCHOR:what-failed -->
## What Failed
- Code graph structural context was not trusted because `code_graph_status` reported stale readiness.
- The current contract test shape did not catch caller-ID parity or clear-boundary behavior.
<!-- /ANCHOR:what-failed -->

<!-- ANCHOR:exhausted-approaches -->
## Exhausted Approaches
- Security review of maintenance/contention paths did not produce a confirmed issue.
- GraphTraversal routing replay did not produce a maintainability issue.
<!-- /ANCHOR:exhausted-approaches -->

<!-- ANCHOR:ruled-out-directions -->
## Ruled-Out Directions
- Hybrid lexical routing was not reopened; implementation-summary documents it as a deliberate coupling exception after a prior failed attempt.
- No P0 classification was used because findings affect substitutability and data-boundary risk, not confirmed data loss in an active production path.
<!-- /ANCHOR:ruled-out-directions -->

<!-- ANCHOR:next-focus -->
## Next Focus
Plan remediation for F001 and F002: either narrow/document VectorStore as a memory-index adapter or make the production adapter honor the declared `VectorStore` record-ID and clear semantics. Add contract tests for caller-supplied IDs and clear boundaries.
<!-- /ANCHOR:next-focus -->

<!-- ANCHOR:known-context -->
## Known Context
- Spec claims all five ports are complete and behavior-preserving.
- Implementation summary records targeted gates passing and full-suite residuals as unrelated.
- `resource-map.md` was not present in the spec folder at init, so resource-map coverage was skipped.
- `memory_match_triggers` rejected the supplied fan-out session ID as not server-managed; the review continued with disk lineage state only.
- `code_graph_status` reported stale readiness (`git HEAD changed`, 882 stale files), so graph queries were not trusted.
<!-- /ANCHOR:known-context -->

<!-- ANCHOR:cross-reference-status -->
## Cross-Reference Status
| Protocol | Gate | Status | Evidence | Finding Refs |
|----------|------|--------|----------|--------------|
| spec_code | hard | partial | `spec.md:74-77`, `vector-store.ts:175-233` | F001, F002 |
| checklist_evidence | hard | partial | `tasks.md:69-71`, `implementation-summary.md:146-173` | F003 |
| feature_catalog_code | advisory | pass | `memo.ts:215-222`, `causal-boost.ts:166-170` | none |
| playbook_capability | advisory | partial | `storage-ports-contract.vitest.ts:301-325` | F003 |
<!-- /ANCHOR:cross-reference-status -->

<!-- ANCHOR:files-under-review -->
## Files Under Review
| File | Coverage | Notes |
|------|----------|-------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/storage/ports/vector-store.ts` | full | F001, F002 |
| `.opencode/skills/system-spec-kit/mcp_server/tests/fakes/storage-ports.ts` | partial | Fake VectorStore parity evidence |
| `.opencode/skills/system-spec-kit/mcp_server/tests/storage-ports-contract.vitest.ts` | partial | F003 |
| `.opencode/skills/system-spec-kit/mcp_server/lib/storage/ports/maintenance.ts` | partial | No finding |
| `.opencode/skills/system-spec-kit/mcp_server/lib/storage/ports/contention-policy.ts` | partial | No finding |
| `.opencode/skills/system-spec-kit/mcp_server/lib/storage/memo.ts` | partial | GraphTraversal routing reviewed |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/causal-boost.ts` | partial | GraphTraversal routing reviewed |
| `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/015-storage-adapter-ports/spec.md` | partial | Traceability source |
| `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/015-storage-adapter-ports/tasks.md` | partial | Completion claims |
| `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/015-storage-adapter-ports/implementation-summary.md` | partial | Verification evidence |
<!-- /ANCHOR:files-under-review -->

<!-- ANCHOR:review-boundaries -->
## Review Boundaries
- Max iterations: 6.
- Artifact directory: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/015-storage-adapter-ports/review/lineages/gpt-3`.
- Write boundary: no paths outside the artifact directory were modified.
- Target files were read-only.
- Executor requested: `cli-opencode model=openai/gpt-5.5-fast`.
<!-- /ANCHOR:review-boundaries -->

## Non-Goals
- Implement fixes.
- Reopen hybrid lexical routing.
- Run a full all-repo Vitest suite.

## Stop Conditions
- Stopped at `config.maxIterations` with all dimensions covered and active P1 findings still present.
