# Review Report - MCP Retrieval and Causal Slice

## 1. Executive Verdict

Final verdict: FAIL.

Release readiness is blocked by F003. The community-search fallback in `memory_search` can append memory rows outside the caller's scoped retrieval boundary after the main pipeline has already applied `specFolder`, tenant, user, and agent filters.

## 2. Scope Reviewed

The review covered the target spec's five in-scope handlers and supporting modules:

- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-context.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-triggers.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/causal-links-processor.ts`

Supporting reads included `lib/search/community-search.ts`, session management, retrieval session state, causal edge storage, runtime validation schemas, public MCP tool schemas, and focused tests.

## 3. Method

The loop ran five iterations:

| Iteration | Focus | Verdict |
|---:|---|---|
| 001 | Correctness | CONDITIONAL |
| 002 | Security | FAIL |
| 003 | Security follow-up and traceability | FAIL |
| 004 | Maintainability | CONDITIONAL |
| 005 | Stabilization | PASS |

P0/P1 findings include claim adjudication packets in their iteration files. Code Graph was unavailable, so evidence came from direct file reads and exact grep/glob discovery.

## 4. Active Findings

### F003 - P0 - community fallback can bypass retrieval scope

`memory_search` passes `specFolder`, tenant, user, and agent scope into the main pipeline, then on weak results calls `searchCommunities(effectiveQuery, requireDb(), 5)` without scope arguments. The helper scans `community_summaries` globally, the handler fetches member rows by `id IN (...)` only, then appends those rows to already-scoped pipeline results before final formatting.

Primary evidence: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:946`, `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:1000`, `.opencode/skills/system-spec-kit/mcp_server/lib/search/community-search.ts:101`, `.opencode/skills/system-spec-kit/mcp_server/lib/search/community-search.ts:124`, `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:1006`, `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:1227`.

Fix direction: pass the effective retrieval scope into community search and into the member-row fetch, or disable fallback for scoped/governed queries until the fallback can prove scoped membership.

### F004 - P1 - `memory_search` does not validate caller `sessionId`

`memory_search` threads caller-supplied `sessionId` into trace, pipeline config, retrieval goal/anchor state, and session dedup. `memory_context` and `memory_match_triggers` use `sessionManager.resolveTrustedSession` to reject untracked or identity-mismatched sessions; search does not.

Primary evidence: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:664`, `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:882`, `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:970`, `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:1085`, `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-context.ts:1112`, `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-triggers.ts:223`, `.opencode/skills/system-spec-kit/mcp_server/lib/session/session-manager.ts:429`.

Fix direction: route `memory_search` session lifecycle through `resolveTrustedSession` before any trace, pipeline, cache, goal, anchor, or dedup state uses the session ID.

### F001 - P1 - `memory_context` collapses no-session callers onto one process session

`sessionManager.resolveTrustedSession(null)` mints a fresh UUID, but `memory_context` replaces that generated ID with `SPECKIT_MEMORY_SESSION_ID` or a deterministic process hash when no `sessionId` was requested. Strategy execution and session-state persistence then use that shared process ID.

Primary evidence: `.opencode/skills/system-spec-kit/mcp_server/lib/session/session-manager.ts:421`, `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-context.ts:1128`, `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-context.ts:1561`, `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-context.ts:1634`, `.opencode/skills/system-spec-kit/mcp_server/lib/search/session-state.ts:272`.

Fix direction: preserve the generated `effectiveSessionId` from `resolveTrustedSession(null)` for ephemeral calls, unless a deliberate server-scoped session is explicitly configured and isolated.

### F002 - P1 - explicit causal links can create orphan edges

`handleMemoryCausalLink` validates relation type, then calls `causalEdges.insertEdge` with caller source/target IDs. The storage layer explicitly defers FK validation for synthetic test IDs, so production handler calls can create edges whose endpoints do not exist in `memory_index`.

Primary evidence: `.opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts:745`, `.opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts:756`, `.opencode/skills/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:279`, `.opencode/skills/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:344`.

Fix direction: add handler-level endpoint existence validation for public tool calls, while keeping test helpers able to seed synthetic edges through a private/testing path if needed.

### F005 - P1 - `memory_causal_stats.backfill` is live but absent from public schema

The runtime handler and strict validation schema accept `backfill`, tests confirm valid payloads, and the dispatcher forwards the validated args. The public MCP `ListTools` schema still advertises `memory_causal_stats` as an object with no properties.

Primary evidence: `.opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts:803`, `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:414`, `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:592`, `.opencode/skills/system-spec-kit/mcp_server/tools/causal-tools.ts:36`, `.opencode/skills/system-spec-kit/mcp_server/context-server.ts:1029`, `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:454`, `.opencode/skills/system-spec-kit/mcp_server/tests/relation-backfill-conflict.vitest.ts:209`.

Fix direction: update the public MCP tool schema to include the nested `backfill` object, or remove/privatize the runtime argument if it is intentionally not public.

### F006 - P2 - automatic causal-link resolution can bind ambiguous partial references globally

`processCausalLinks` resolves all causal-link references through a batch resolver whose fuzzy fallback uses leading-wildcard path/title matching and chooses `ORDER BY id DESC LIMIT 1`. It then inserts an edge to that single resolved ID. Ambiguous title/path references can therefore create valid-looking edges to the newest unrelated match.

Primary evidence: `.opencode/skills/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:290`, `.opencode/skills/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:297`, `.opencode/skills/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:307`, `.opencode/skills/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:401`, `.opencode/skills/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:568`.

Fix direction: require exact canonical references for edge creation, or make fuzzy resolution scope-aware and fail closed when multiple rows match.

## 5. Remediation Order

1. F003: close the scoped retrieval bypass.
2. F004 and F001: normalize session trust and ephemeral session handling across search/context/triggers.
3. F002: validate causal edge endpoints in public mutation paths.
4. F005: align `ListTools` schema with runtime validation.
5. F006: make auto causal-link fuzzy resolution scope-aware and ambiguity-safe.

## 6. Traceability Status

| Protocol | Status | Evidence |
|---|---|---|
| `spec_code` | covered | All listed implementation files reviewed |
| `checklist_evidence` | not applicable | Target is Level 1 and has no `checklist.md` |
| `feature_catalog_code` | partial | F005 shows causal stats feature/schema drift |
| `playbook_capability` | partial | Public MCP schema capability surface reviewed |

## 7. Deferred Items

- No implementation fixes were attempted in this lineage.
- No full repository test suite was run because the task was a read-only review loop.
- Code Graph convergence scoring remained unavailable.

## 8. Convergence

The loop converged after iteration 005. All four dimensions were covered and the stabilization pass found no new P0/P1 issues. The active finding set is stable at one P0, four P1, and one P2.

## 9. Audit Appendix

Artifacts:

- `deep-review-config.json`
- `deep-review-state.jsonl`
- `deep-review-findings-registry.json`
- `deep-review-strategy.md`
- `deep-review-dashboard.md`
- `deltas/iter-001.jsonl`
- `deltas/iter-002.jsonl`
- `deltas/iter-003.jsonl`
- `deltas/iter-004.jsonl`
- `deltas/iter-005.jsonl`
- `prompts/iteration-001.md`
- `prompts/iteration-002.md`
- `prompts/iteration-003.md`
- `prompts/iteration-004.md`
- `prompts/iteration-005.md`
- `logs/fanout-codex-1.log`
- `resource-map.md`
- `iterations/iteration-001.md`
- `iterations/iteration-002.md`
- `iterations/iteration-003.md`
- `iterations/iteration-004.md`
- `iterations/iteration-005.md`

Artifact root:

`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/002-mcp-retrieval-causal/review/lineages/codex-1`

The artifact root was bound directly from `config.fanout_lineage_artifact_dir`; `resolveArtifactRoot` was not executed.
