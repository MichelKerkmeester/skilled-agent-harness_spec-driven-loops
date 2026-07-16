# Deep Review Report - MCP Retrieval + Causal Review Slice

## Executive Summary

Verdict: CONDITIONAL.

The review found 0 P0, 3 P1, and 1 P2 active findings. The release slice is not clean: the retrieval path has two session-boundary problems and one scoped-trigger correctness problem that can blend, suppress, or miss context across requests. The causal read path has one schema drift issue that should be fixed before operators rely on the advertised backfill command.

## Planning Trigger

The packet asks for a read-only audit of MCP retrieval and causal-graph read-path correctness, security, and traceability drift [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/002-mcp-retrieval-causal/spec.md`:36] to [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/002-mcp-retrieval-causal/spec.md`:40]. The in-scope files are the five handler files listed in [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/002-mcp-retrieval-causal/spec.md`:52] to [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/002-mcp-retrieval-causal/spec.md`:56].

## Active Finding Registry

### F001 - P1 - `memory_context` omitted-session calls reuse a process-wide fallback

`memory_context` calls `resolveTrustedSession(null)` but discards the UUID it returns when no session is requested. It instead uses `SPECKIT_MEMORY_SESSION_ID` or a deterministic `PROCESS_MEMORY_SESSION_ID` [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-context.ts`:1128] to [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-context.ts`:1131]. That fallback is derived from process identity [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-context.ts`:164] to [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-context.ts`:167], while the schema promises a server-generated session when omitted [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts`:44]. The reused ID is forwarded to retrieval options [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-context.ts`:1561] to [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-context.ts`:1568] and persisted to session state [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-context.ts`:1634] to [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-context.ts`:1640].

Fix: use the trusted session manager's minted UUID for omitted-session calls and add a two-call regression test proving omitted calls do not share effective IDs.

### F002 - P1 - `memory_search` trusts raw caller `sessionId`

`memory_search` destructures `sessionId` from caller args [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts`:646] to [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts`:683] and uses it for scope normalization [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts`:687], dedup [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts`:1301] to [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts`:1334], and retrieval-state mutation [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts`:1375] to [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts`:1391]. Sibling handlers reject untrusted session IDs through `resolveTrustedSession` [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-context.ts`:1111] to [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-context.ts`:1126] and [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-triggers.ts`:223] to [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-triggers.ts`:245].

Fix: validate `memory_search.sessionId` through `resolveTrustedSession` before dedup/cache/state paths and reject untrusted IDs with `E_SESSION_SCOPE`.

### F003 - P1 - `memory_match_triggers` filters scoped matches after a capped global query

`memory_match_triggers` clamps the caller limit [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-triggers.ts`:248] to [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-triggers.ts`:250], then asks the trigger matcher for only `limit * 2` global matches [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-triggers.ts`:304]. Scope filtering happens after that small global set is returned [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-triggers.ts`:307] to [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-triggers.ts`:340]. Valid scoped matches below the global cutoff are unreachable.

Fix: move scope into matching or keep fetching/refilling until the scoped limit is met or the corpus is exhausted. Add a test with out-of-scope high-ranked entries filling the first `limit * 2` results.

### F004 - P2 - `memory_causal_stats` backfill is implemented but blocked by schema

The handler defines and executes `backfill` args [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts`:92] to [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts`:110] and [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts`:825] to [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts`:834], but the public `memory_causal_stats` schema has empty properties with `additionalProperties: false` [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts`:454] to [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts`:457]. The output test asserts a backfill command is advertised [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/tests/causal-stats-output.vitest.ts`:71] to [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/tests/causal-stats-output.vitest.ts`:75].

Fix: either expose the bounded `backfill` object in the tool schema or remove the public hint and keep the capability internal.

## Remediation Workstreams

1. Session isolation: fix F001 and F002 together. Both need the same trusted-session boundary and regression tests for omitted, untrusted, and accepted server-minted session IDs.
2. Scoped trigger recall: fix F003 by moving scope filtering before or inside result limiting, then test the out-of-scope saturation case.
3. Public schema alignment: fix F004 by choosing whether `memory_causal_stats.backfill` is public. Then make schema, handler, and tests agree.

## Spec Seed

Title: Retrieval session isolation and scoped trigger recall hardening.

Problem: MCP retrieval tools currently have inconsistent session trust semantics and one scoped trigger path can miss valid in-scope context after global limiting.

Scope: `memory-context.ts`, `memory-search.ts`, `memory-triggers.ts`, session manager integration, trigger matcher or trigger cache query path, tool schemas for causal stats, and focused tests.

Acceptance criteria:

- Omitted `memory_context.sessionId` calls receive distinct server-minted IDs unless an explicitly documented continuity override is requested.
- `memory_search` rejects untrusted caller session IDs the same way `memory_context` and `memory_match_triggers` do.
- Scoped trigger matching returns in-scope matches even when out-of-scope matches dominate the global top results.
- `memory_causal_stats` schema and handler agree about `backfill`.

## Plan Seed

1. Add failing tests for F001, F002, F003, and F004.
2. Route `memory_context` omitted-session calls through the minted `trustedSession.effectiveSessionId`.
3. Add trusted-session validation to `memory_search` before any use of `sessionId`.
4. Refactor trigger matching to scope before limit or refill after filtering.
5. Align `memory_causal_stats` schema and hints.
6. Run the MCP server test subset for memory context, search, triggers, and causal stats.

## Traceability Status

| Protocol | Status | Evidence |
| --- | --- | --- |
| `spec_code` | covered | Spec scope and every listed handler were reviewed. |
| `checklist_evidence` | not applicable | The Level 1 packet has no `checklist.md`; iteration evidence is source-cited. |
| `feature_catalog_code` | covered | Tool schema, handler feature comments, and causal-stats hints were compared. |
| `playbook_capability` | covered | Retrieval session behavior and causal stats public capability were checked against tool contracts. |

## Deferred Items

- No reviewed source files were modified in this lineage.
- Code Graph was unavailable, so the review used direct reads and `rg`/line-cited evidence.
- Mutation/save path and session/index path were intentionally out of scope per [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/002-mcp-retrieval-causal/spec.md`:58] to [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/002-mcp-retrieval-causal/spec.md`:60].

## Audit Appendix

Iterations:

- `iterations/iteration-001.md`: correctness pass, F001 and F003.
- `iterations/iteration-002.md`: security pass, F002.
- `iterations/iteration-003.md`: traceability pass, F004.
- `iterations/iteration-004.md`: maintainability and edge-integrity pass, no new findings.
- `iterations/iteration-005.md`: stabilization pass, no new findings.

Final state:

- Stop reason: converged.
- Active findings: F001, F002, F003, F004.
- Highest severity: P1.
- Final verdict: CONDITIONAL.
