---
title: Deep Review Iteration 004 - Maintainability
description: Maintainability review of dedicated council graph support surfaces.
---

# Deep Review Iteration 004

## Dispatcher

- Mode: review
- Iteration: 4 of 7
- Focus: maintainability
- Budget profile: scan
- Session: `2026-05-10T18:45:03.440Z`
- Generation: 1
- Lineage mode: new

## Files Reviewed

- `.opencode/skills/system-spec-kit/mcp_server/lib/council-graph/council-graph-db.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/council-graph/council-graph-query.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/council-graph/upsert.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/council-graph/query.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/council-graph/status.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/council-graph/convergence.ts`
- `.opencode/skills/system-spec-kit/mcp_server/tests/council-graph.vitest.ts`
- `.opencode/skills/deep-ai-council/references/graph_support.md`
- `.opencode/specs/skilled-agent-orchestration/101-deep-multi-ai-council-skill/003-deep-ai-council-graph-support/implementation-summary.md`

## Findings - New

### P0 Findings

- None.

### P1 Findings

- None.

### P2 Findings

1. **Replay recovery remains manual despite documented rollback workflow** -- `.opencode/skills/deep-ai-council/references/graph_support.md:96` -- The recovery guidance tells operators to delete or ignore stale `council-graph.sqlite` rows and replay derived nodes/edges from packet-local artifacts [SOURCE: `.opencode/skills/deep-ai-council/references/graph_support.md:96`; SOURCE: `.opencode/skills/deep-ai-council/references/graph_support.md:99`; SOURCE: `.opencode/skills/deep-ai-council/references/graph_support.md:100`], but the reviewed graph implementation exposes only batch upsert semantics for nodes and edges [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/council-graph/council-graph-db.ts:495`; SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/council-graph/council-graph-db.ts:504`; SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/council-graph/council-graph-db.ts:515`] and the status handler only reports readiness/signals [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/council-graph/status.ts:24`; SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/council-graph/status.ts:47`]. This is a maintainability/recovery ergonomics gap rather than a release blocker because packet artifacts remain authoritative, but it increases future operator burden and makes stale-row cleanup dependent on ad hoc SQLite access.
   - Finding class: cross-consumer
   - Scope proof: Reviewed the council graph DB, handlers, tests, and graph guidance; exact searches for `delete|replay|rollback|prune|clear|reset|remove` under both `lib/council-graph` and `handlers/council-graph` returned no implementation hits, while docs explicitly describe stale-row deletion/replay.
   - Affected surface hints: [`graph_support.md recovery guidance`, `council graph DB lifecycle`, `council_graph_status`, `future replay tooling`]
   - Recommendation: Add either a bounded `clear/rebuild` helper or a documented replay command path that uses the existing MCP surfaces, then cover it with a small stale-row recovery test.

## Traceability Checks

- `spec_code`: fail (carried forward via P1-001; empty upsert contract mismatch remains active).
- `checklist_evidence`: fail (carried forward via P1-002; CONTINUE coverage evidence remains incomplete).
- `prompt_safe_output`: fail (carried forward via P1-003; metadata redaction/size bound remains incomplete).
- `maintainability_recovery`: advisory (new P2-001; rollback guidance lacks first-class cleanup/replay ergonomics).

## Integration Evidence

- Reviewed exact integration surfaces only within declared scope: `council_graph_upsert`, `council_graph_query`, `council_graph_status`, `council_graph_convergence`, `graph_support.md`, and `council-graph.vitest.ts`.

## Edge Cases

- Findings registry remains stale relative to JSONL/prompt active findings; prior P1 carry-forward uses the state log and rendered prompt pack as source-of-truth.
- The first BINDING emission included a malformed target line before the corrected canonical bindings; review scope was subsequently kept to the corrected resolved target.
- Resource map is absent, so resource-map coverage remains skipped per rendered prompt pack.

## Confirmed-Clean Surfaces

- The core DB/query/helper split is small and readable: validation/clamping is centralized before persistence, query helpers keep structural traversal separate from handlers, and tests use isolated temporary DB directories.
- Convergence thresholds and trace construction are localized in `convergence.ts`, which keeps future threshold maintenance straightforward.
- Tests cover primary happy paths, STOP_ALLOWED, and empty-graph STOP_BLOCKED behavior, aside from carried-forward evidence gaps.

## Ruled Out

- No new P0/P1 maintainability issue was opened: the replay/rollback gap is advisory because source-of-truth artifacts remain intact and operators can still rebuild derived rows manually.
- Did not retry exhausted SQL injection, cross-session read, or destructive source-of-truth concerns from prior iterations.

## Next Focus

- dimension: cross-reference
- focus area: synthesis/adjudication of active P1 carry-forward plus P2 advisory after all configured dimensions are now covered
- reason: correctness, security, traceability, and maintainability have all been reviewed; convergence remains blocked by active P1s
- rotation status: all dimensions covered once
- blocked/productive carry-forward: carry forward P1-001, P1-002, P1-003 and advisory P2-001
- required evidence: verify remediation or continued activity of empty-upsert contract, convergence coverage, metadata prompt-safety, and replay ergonomics
