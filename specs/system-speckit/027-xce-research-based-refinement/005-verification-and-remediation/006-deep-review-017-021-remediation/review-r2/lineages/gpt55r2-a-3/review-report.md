# Deep Review Report - gpt55r2-a-3

## Executive Summary

- Verdict: CONDITIONAL
- Active findings: P0=0, P1=2, P2=1
- hasAdvisories: true
- Scope: Search/retrieval subsystem review scope A-search-retrieval.
- Stop reason: `maxIterationsReached` after one fan-out iteration.
- Release readiness: in-progress.

## Planning Trigger

Remediation planning is required because two active P1 findings affect scoped retrieval correctness and large-corpus recall behavior. No P0 was confirmed, so the result is CONDITIONAL rather than FAIL.

## Active Finding Registry

| ID | Severity | Dimension | Title | Evidence | Status |
|----|----------|-----------|-------|----------|--------|
| F001 | P1 | correctness/traceability | Community fallback bypasses the caller's specFolder boundary | `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:1166-1219`; `.opencode/skills/system-spec-kit/mcp_server/lib/search/community-search.ts:101-170` | active |
| F002 | P1 | correctness/maintainability | Summary-embedding channel only ranks an arbitrary first-1000 row sample | `.opencode/skills/system-spec-kit/mcp_server/lib/search/memory-summaries.ts:167-175`; `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1301-1357` | active |
| F003 | P2 | traceability | includeArchived is still advertised as functional while the handler deliberately ignores it | `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:336-340`; `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:818-831` | active |

## Remediation Workstreams

1. Scope-aware fallback path: update community fallback to pass and enforce `specFolder`, `tier`, `contextType`, and canonical/active projection constraints before appending member rows; add regression coverage for weak-result scoped searches.
2. Summary-channel retrieval: replace prefix sampling with an indexed vector search, a scoped candidate prefilter, or a deterministic partitioned scan that cannot make later rows unreachable; add a test with a relevant summary beyond the first fetch cap.
3. Public contract cleanup: either restore `includeArchived` behavior end-to-end or update/remove the schema field and CLI docs to say it is intentionally ignored.

## Spec Seed

- `memory_search.specFolder` must constrain every result injection path, including fallback and recovery layers.
- Summary-embedding recall must not depend on insertion order or arbitrary table prefix sampling.
- Public tool schema fields must describe actual runtime behavior, especially no-op compatibility fields.

## Plan Seed

1. Add a failing test where primary pipeline returns weak scoped results and community fallback has out-of-folder member IDs; assert only scoped rows are returned.
2. Add a failing summary-channel test with more than `fetchCap` summaries and a relevant tail summary; assert it can be retrieved or the channel clearly reports bounded partial coverage.
3. Decide `includeArchived` contract direction and align schema, handler metadata, cache key tests, and any CLI help text.

## Traceability Status

| Protocol | Status | Notes |
|----------|--------|-------|
| spec_code | partial | One fan-out iteration covered selected high-risk search/retrieval seams with direct file evidence. |
| checklist_evidence | notApplicable | Scope target has no checklist and states there is no new implementation to verify. |
| feature_catalog_code | partial | F003 records schema/runtime drift for `includeArchived`. |
| playbook_capability | notApplicable | No playbook target in this review scope. |

## Deferred Items

- Broader review should inspect remaining `lib/search` modules not deeply read in this one-iteration fan-out, especially vector aliasing, retrieval rescue, and channel representation.
- Code graph was stale, so no graph-backed caller/import impact answer was used.

## Audit Appendix

| Item | Result |
|------|--------|
| Iterations | 1 |
| Stop reason | maxIterationsReached |
| Claim adjudication | passed for F001 and F002 |
| P0 adversarial replay | not applicable, no P0 |
| Evidence gate | passed, each active finding has file:line evidence |
| Scope gate | passed for output writes; reviewed code is inside declared search/retrieval target |
| Resource map coverage | skipped, source scope has no `resource-map.md` |
| Graph state | stale; direct Grep/Glob/Read fallback used |

Final verdict: CONDITIONAL
