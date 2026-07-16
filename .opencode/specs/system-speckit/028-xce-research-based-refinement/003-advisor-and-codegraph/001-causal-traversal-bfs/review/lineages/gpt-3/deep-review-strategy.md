# Deep Review Strategy: Causal Traversal BFS Read Path

## Topic

Review the shipped causal traversal BFS read path in `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/012-causal-traversal-bfs`.

## Review Dimensions

- [x] correctness
- [x] security
- [x] traceability
- [x] maintainability

## Completed Dimensions

| Dimension | Iterations | Verdict |
|-----------|------------|---------|
| correctness | 1, 5 | PASS |
| security | 2, 6 | PASS |
| traceability | 3, 5 | PASS with P2 advisory |
| maintainability | 4, 6 | PASS with P2 advisory |

## Running Findings

| Severity | Active | Notes |
|----------|--------|-------|
| P0 | 0 | None |
| P1 | 0 | None |
| P2 | 2 | F001 stale CTE comments; F002 benchmark flakiness risk |

## What Worked

- Exact scope from spec docs resolved the four target code/test files.
- Targeted vitest run validated the equivalence suite in this workspace.
- Production recursive CTE removal was verified by scoped source reads and grep results.

## What Failed

- No reducer CLI was invoked because this fan-out worker was instructed to bind the artifact root directly and keep all writes inside the lineage directory.

## Exhausted Approaches

- No further P0/P1 search debt remains after correctness, security, traceability, maintainability, and stabilization passes.

## Ruled Out Directions

- Memo external mutation cache concern was not recorded as a finding because scoped production usage constructs a fresh store for planner invalidation and no documented contract supports raw SQL mutation behind a live store.
- Direct OpenCode self-dispatch was not used because this worker is already the dispatched lineage context; executor metadata is preserved in config and JSONL.

## Next Focus

Synthesis complete. If remediation is desired, address the two P2 advisories opportunistically.

## Known Context

- Target spec status is shipped with completion_pct 100.
- `resource-map.md` is not present. Skipping coverage gate.
- Targeted verification command passed: `npx vitest run tests/causal-traversal-bfs-equivalence.vitest.ts --reporter verbose`.

## Cross-Reference Status

| Protocol | Level | Status | Evidence |
|----------|-------|--------|----------|
| spec_code | core | pass | BFS helper and call sites match spec claims |
| checklist_evidence | core | pass | `tasks.md` and `implementation-summary.md` carry concrete evidence |
| feature_catalog_code | overlay | pass | Helper and storage port surfaces exist |
| playbook_capability | overlay | pass | Equivalence suite is executable |

## Files Under Review

| File | Coverage | Notes |
|------|----------|-------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/graph/bfs-traversal.ts` | covered | Correctness/security/stabilization |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/causal-boost.ts` | covered | Correctness/security/traceability |
| `.opencode/skills/system-spec-kit/mcp_server/lib/storage/memo.ts` | covered | Correctness/security/stabilization |
| `.opencode/skills/system-spec-kit/mcp_server/tests/causal-traversal-bfs-equivalence.vitest.ts` | covered | Traceability/maintainability |
| `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/012-causal-traversal-bfs/spec.md` | covered | Traceability |
| `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/012-causal-traversal-bfs/tasks.md` | covered | Checklist evidence |
| `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/012-causal-traversal-bfs/implementation-summary.md` | covered | Checklist evidence |

## Review Boundaries

- Max iterations: 6.
- Severity threshold: P2.
- Target files read-only.
- Writes restricted to `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/012-causal-traversal-bfs/review/lineages/gpt-3`.

## Non-Goals

- No remediation edits.
- No writes to canonical spec docs or implementation files.
- No continuity save outside the lineage artifact directory.

## Stop Conditions

- Stop at convergence or `config.maxIterations`, whichever comes first.
- This lineage stopped at `maxIterationsReached`; replay also showed full coverage, no P0/P1, and legal-stop gates passing.
