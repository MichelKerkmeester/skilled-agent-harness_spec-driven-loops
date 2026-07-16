# Deep Review Strategy

## Topic

MCP Retrieval + Causal Review Slice.

## Review Dimensions

- [x] correctness
- [x] security
- [x] traceability
- [x] maintainability

## Completed Dimensions

All configured dimensions were covered by iteration 005.

## Running Findings

P0: 0 | P1: 3 | P2: 1

## Files Under Review

| File | Scope Source | Coverage |
| --- | --- | --- |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts` | `spec.md` in-scope implementation list | Reviewed: F002 |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-context.ts` | `spec.md` in-scope implementation list | Reviewed: F001 |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-triggers.ts` | `spec.md` in-scope implementation list | Reviewed: F003 |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts` | `spec.md` in-scope implementation list | Reviewed: F004 |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/causal-links-processor.ts` | `spec.md` in-scope implementation list | Reviewed: no finding |

## Cross-Reference Status

| Protocol | Gate | Status | Notes |
| --- | --- | --- | --- |
| `spec_code` | hard | Covered | Findings map to the read-only retrieval and causal review scope. |
| `checklist_evidence` | hard | N/A-covered | No `checklist.md` exists in the Level 1 packet; iteration evidence is source-cited. |
| `feature_catalog_code` | advisory | Covered | Causal-stats handler hints and schema were compared. |
| `playbook_capability` | advisory | Covered | Public MCP tool behavior was checked against handler capability and session-boundary contracts. |

## Known Context

- `resource-map.md` was not present at init; synthesis emitted a lineage-local resource map from review deltas.
- `plan.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md` are absent from the target Level 1 review packet.
- Code Graph was unavailable; the lineage used direct reads, `rg`, and line-cited source evidence.
- Requested executor was `cli-codex model=gpt-5.5`; current runtime is Codex, so nested CLI self-invocation is refused and this lineage ran in-process.

## Review Boundaries

- Artifact directory was bound directly to `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/002-mcp-retrieval-causal/review/lineages/codex-3`.
- Writes were limited to this lineage directory.
- Reviewed implementation files remained read-only.

## What Worked

- Trusted-session validation in `memory_context` and `memory_match_triggers` provided a useful baseline for finding the missing guard in `memory_search`.
- Direct line reads were sufficient to adjudicate the active P1 findings despite graph unavailability.

## What Failed

- `memory_context` advertises omitted-session ephemerality but uses a process-wide fallback ID.
- `memory_search` lacks the trusted-session guard used by sibling retrieval handlers.
- Scoped trigger matching limits globally before exact scope filtering.
- `memory_causal_stats` handler and public schema disagree about the `backfill` capability.

## Exhausted Approaches

- Causal-link fuzzy matching was inspected and not promoted to a finding because existing tests cover the intended behavior.
- `memory_search` canonical-source filtering was inspected and not promoted to a finding because Gate-D tests assert the behavior.

## Ruled-Out Directions

- No mutation/save-path findings were recorded because that path is out of scope for this slice.
- No implementation files were modified in this lineage.

## Next Focus

Synthesis complete. Remediation should start with session isolation (F001 and F002), then scoped trigger recall (F003), then causal-stats schema alignment (F004).
