# Deep Review Strategy

## Topic

MCP retrieval and causal review slice.

## Review Charter

Audit the five named MCP retrieval and causal handlers for correctness, security, traceability, and maintainability. The reviewed implementation files stayed read-only. Review artifacts were written only under this lineage directory.

## Review Dimensions

- [x] correctness
- [x] security
- [x] traceability
- [x] maintainability

## Completed Dimensions

- correctness: iteration 001
- security: iterations 002 and 003
- traceability: iteration 003
- maintainability: iteration 004
- stabilization: iteration 005

## Running Findings

| Severity | Active | New In Last Iteration |
|---|---:|---:|
| P0 | 1 | 0 |
| P1 | 4 | 0 |
| P2 | 1 | 0 |

## Files Under Review

| File | Coverage | Notes |
|---|---|---|
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts` | covered | F003 scope bypass, F004 untrusted session ID |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-context.ts` | covered | F001 no-session lifecycle collapse |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-triggers.ts` | covered | Session/scope checks reviewed; no finding |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts` | covered | F002 orphan edge path, F005 stats schema drift |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/causal-links-processor.ts` | covered | F006 ambiguous fuzzy causal-link resolution |

## Cross-Reference Status

| Protocol | Gate | Status | Notes |
|---|---|---|---|
| spec_code | hard | covered | All in-scope files reviewed against the target spec |
| checklist_evidence | hard | not applicable | Target is Level 1 and has no `checklist.md` |
| feature_catalog_code | advisory | partial | Causal stats handler capability drifts from public schema |
| playbook_capability | advisory | partial | MCP `ListTools` schema is the operative public capability surface |

## Known Context

- Startup context only; no cached continuity was available.
- Code Graph was unavailable, so review used direct reads and exact grep/glob discovery.
- The target spec has no `resource-map.md`; this lineage emitted a local coverage map instead.
- `cli-codex` self-invocation is forbidden by the local skill, so this process ran as the already-spawned Codex lineage executor.

## What Worked

- Handler-to-helper tracing found both direct correctness issues and cross-surface contract drift.
- Stabilization replay found no new P0/P1 findings after all dimensions were covered.

## What Failed

- The reviewed slice is release-blocking because F003 can return out-of-scope memories through community fallback.
- Public schema drift means schema-driven MCP clients cannot discover the live `memory_causal_stats.backfill` capability.

## Exhausted Approaches

- Rechecked `memory_match_triggers` for the same session and scope issues found in search/context. It already validates sessions and exact-scopes trigger results.
- Rechecked downstream search formatting after community fallback. No later scope filter was found.

## Ruled-Out Directions

- No implementation fixes were made; this lineage is review-only.
- No findings were added for `memory_match_triggers` because the inspected trust and scope paths fail closed.

## Next Focus

Synthesis complete. The parent audit should prioritize F003 first, then F004/F001 session-boundary consistency, then causal graph integrity and schema cleanup.

## Review Boundaries

- Maximum iterations: 7.
- Completed iterations: 5.
- Convergence threshold: 0.10.
- Minimum stabilization passes after coverage: 1.
- Reviewed implementation files were not modified.
- All lineage outputs were written under this lineage directory.

## Stop Conditions

Satisfied. All dimensions have evidence, and the stabilization pass found no new P0/P1 findings.
