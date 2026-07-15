# Deep Review Report - MCP Retrieval + Causal Review Slice

## 1. Executive Summary
Verdict: FAIL. The review converged after four iterations, but release readiness is blocked by an active P0 in `memory_search`: the community fallback can bypass governed retrieval scope and append out-of-scope rows.

Open findings: P0 = 1, P1 = 1, P2 = 1.

## 2. Scope and Method
The lineage reviewed the target packet `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/002-mcp-retrieval-causal` and the implementation files listed in its spec:

- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-context.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-triggers.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/causal-links-processor.ts`

Supporting libraries, schemas, and tests were followed where needed for evidence. Code Graph was unavailable, so this lineage used direct reads and `rg`-based fallback coverage.

## 3. Findings

### F001 - P0 Security - Community fallback bypasses scoped retrieval
`memory_search` passes normalized governance scope into the main pipeline at `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:946`, with `tenantId`, `userId`, and `agentId` set at lines 955-957. The weak-result community fallback then calls `searchCommunities(effectiveQuery, requireDb(), 5)` at line 1000, fetches `memory_index` members by id only at line 1006, and appends them at line 1031.

The fallback source reads all community summaries without scope at `.opencode/skills/system-spec-kit/mcp_server/lib/search/community-search.ts:124` and returns member ids at line 170. With `includeContent`, formatted results can read the row file path at `.opencode/skills/system-spec-kit/mcp_server/formatters/search-results.ts:934`.

Fix: carry the same normalized scope into community search and the member-row query, or post-filter returned members by exact scope before appending. Fail closed when scoped fallback cannot be enforced.

### F002 - P1 Security - `memory_search` accepts untrusted session state ids
`memory_search` accepts caller-provided `sessionId` at `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:664` and uses it for retrieval state at lines 1085 and 1375. Neighboring handlers validate session ids through `sessionManager.resolveTrustedSession`: `memory_context` does so at `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-context.ts:1112`, and `memory_match_triggers` does so at `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-triggers.ts:228`.

The resolver rejects untracked sessions at `.opencode/skills/system-spec-kit/mcp_server/lib/session/session-manager.ts:429` and identity mismatches at line 448. Direct `memory_search` does not apply that trust boundary.

Fix: resolve and validate `sessionId` in `memory_search` before cache keys, dedup, retrieval-session state, feedback logging, or response metadata use it. Return the same `E_SESSION_SCOPE` shape as neighboring handlers on mismatch.

### F003 - P2 Traceability - Trigger limit contract drifts from behavior
The public tool schema advertises `memory_match_triggers.limit` with maximum 100 at `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:210`, and the runtime schema allows the same at `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:206`. The handler silently caps the accepted value at 50 in `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-triggers.ts:248` and later slices to the capped value at line 500.

The existing limit test uses `requestedLimit = 2` at `.opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-triggers.vitest.ts:252`, so it misses the 51-100 band.

Fix: align the schema maximum and handler cap, then add boundary coverage for 50, 51, and 100.

## 4. Evidence and Claim Adjudication
F001 was adjudicated as P0 with high confidence because a governed retrieval request can leave the scoped pipeline and append globally selected fallback rows. The default-on feature flags at `.opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts:704` and line 713 make this a normal runtime path unless explicitly disabled.

F002 was adjudicated as P1 because it crosses the server-managed session boundary, but the observed impact is retrieval-state and session-memory contamination rather than direct evidence of scoped content disclosure.

F003 was not escalated beyond P2 because it is contract drift and missing boundary coverage, not a correctness or security break in returned scoped records.

## 5. Coverage and Traceability
All requested dimensions were covered: correctness, security, traceability, and maintainability.

Traceability gates:

- `spec_code`: pass. The target spec names the reviewed files, and each named file was covered.
- `checklist_evidence`: skipped. The target is Level 1 and had no `checklist.md` at initialization.
- `feature_catalog_code`: partial because F003 records schema/runtime drift.
- `playbook_capability`: skipped because no playbook file is in scope.

## 6. Release Readiness
Release readiness: release-blocking.

The loop converged on review saturation, not implementation readiness. F001 must be fixed before this slice can pass release review. F002 should be fixed in the same patch if possible because it touches the same retrieval/session boundary.

## 7. Remediation Recommendations
1. Patch `memory_search` community fallback first. The safest shape is to pass `normalizedScope` into community lookup and require exact scope predicates when fetching member rows.
2. Add a direct regression test where scoped `memory_search` gets weak primary results and community summaries contain members from a different tenant or user.
3. Add trusted-session validation to `memory_search` and test an invented or mismatched `sessionId`.
4. Align `memory_match_triggers.limit` across public schema, runtime schema, handler clamp, and tests.

## 8. Residual Risk and Limitations
Code Graph was unavailable, so the lineage did not use structural caller/import traversal. Direct reads covered the named handlers, supporting libraries, schemas, and tests, but a graph-backed pass could still find indirect callers that need contract updates after the fixes.

The target packet had no resource map at initialization, so resource coverage was reconstructed in `resource-map.md` inside this lineage artifact directory.

## 9. Convergence Record
Iterations completed: 4.

| Iteration | Focus | Result |
|---|---|---|
| 1 | Security/correctness | F001 P0 and F002 P1 |
| 2 | Traceability/contracts | F003 P2 |
| 3 | Causal/maintainability | No new findings |
| 4 | Stabilization/replay | No new findings; release-blocking P0 remains |

Stop reason: converged. New findings stabilized at zero after full dimension coverage. Final verdict: FAIL.
