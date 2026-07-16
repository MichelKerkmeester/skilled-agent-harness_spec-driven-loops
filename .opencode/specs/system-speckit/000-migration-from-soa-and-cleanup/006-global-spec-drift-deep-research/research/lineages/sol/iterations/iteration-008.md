# Iteration 8: Current Optimization-Surface Verification

## Focus

Test whether the documented context-optimization mechanisms and limitations remain visible in current implementation source.

## Actions Taken

1. Located current session bootstrap, resume, snapshot, metrics, compaction, and session-prime source files.
2. Read status calculation, metric storage, bootstrap telemetry, compaction cache, token-budget, and source-routing code.
3. Attempted a structural caller query for `computeQualityScore`; the code graph refused because the current graph is empty, so caller evidence was limited to direct imports and reads.

## Findings

1. The compaction cache-and-inject mechanism remains implemented. `compact-inject.ts` merges and renders sections under `COMPACTION_TOKEN_BUDGET`, persists `pendingCompactPrime`, and records cache provenance; `session-prime.ts` reads the compact identity and routes `source=compact` separately. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:423-497] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:380-411]
2. Source-aware lifecycle routing remains current for `compact`, `startup`, `resume`, and `clear`, with compact and ordinary session budgets selected separately. This corroborates the archived implementation summary. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:380-413]
3. Hookless bootstrap remains implemented and has expanded: `session_bootstrap` composes resume and health results, adds structural and skill-graph hints, deduplicates hints, and records completeness telemetry. `session_resume` still exposes `minimal` handling and bootstrap events. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:280-325] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/session-resume.ts:629-665,748-759]
4. Context metrics remain process-local module state, and `session_health` still calculates its final `ok`/`warning`/`stale` status before separately computing the quality score. The archived limitation that legacy status remains authoritative is therefore still current. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/session/context-metrics.ts:1-7,62-76,207-245] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/session-health.ts:158-199]
5. One archived limitation is no longer current: `context-metrics.ts` now explicitly uses the same 24-hour graph-freshness threshold as `session-snapshot`, whereas the archived phase summary reported a 1-hour versus 24-hour mismatch. This is a narrow post-phase correction, not a change to the broader in-memory/status-authority limitations. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/session/context-metrics.ts:82-86,178-189] [SOURCE: .opencode/specs/system-speckit/z_archive/024-compact-code-graph/023-context-preservation-metrics/implementation-summary.md:118-124]
6. Structural caller verification could not run because the code graph reported `full_scan_required` with zero nodes. Direct source imports confirm use in session health, resume, and snapshot, but no graph-derived caller claim is made. [SOURCE: code_graph_query(calls_to, computeQualityScore), blocked payload, 2026-07-16] [SOURCE: current Grep for computeQualityScore imports, 2026-07-16]

## Questions Answered

- Q4 remains answered with stronger current-code corroboration and one corrected archived limitation.

## Questions Remaining

- None.

## Ruled Out

- Treating the optimization packets as purely historical designs no longer represented in source.
- Carrying the archived 1-hour versus 24-hour graph-threshold mismatch into the current-state synthesis.
- Claiming structural caller coverage while the code graph is empty.

## Dead Ends

- Code-graph caller analysis is unavailable in this lineage without a full scan, which is unnecessary for the direct-source verification goal.

## Sources Consulted

- Current session handlers and session metric/snapshot modules under `.opencode/skills/system-spec-kit/mcp_server/`.
- Current Claude compaction and session-prime hooks.
- Archived context-preservation implementation summary.
- Code Graph `calls_to` query for `computeQualityScore`.

## Assessment

- New information ratio: 0.03
- Novelty justification: current source corroborated the mechanism map and produced one narrow correction to an archived threshold limitation.
- Confidence: high for direct implementation presence and current status/metric separation; structural caller coverage remains unavailable.

## Reflection

- What worked and why: direct implementation reads distinguished current behavior from archived packet-time limitations.
- What did not work and why: the empty code graph prevented structural caller confirmation.
- What I would do differently: persist code-graph readiness as part of research dispatch context so structural checks can be planned without a failed query.

## Recommended Next Focus

Perform one final negative-knowledge check: verify that standalone deep-context remains a no-write redirect and that automatic narrative compaction remains absent from current supported contracts.
