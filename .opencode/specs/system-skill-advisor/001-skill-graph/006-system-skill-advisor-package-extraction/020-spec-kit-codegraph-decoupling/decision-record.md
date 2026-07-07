---
title: "Decision Record: Spec Kit Code Graph Decoupling"
description: "ADR-001 locks full source isolation between system-spec-kit and system-code-graph."
trigger_phrases:
  - "020 ADR"
  - "codegraph decoupling ADR"
  - "supersede ADR-002"
importance_tier: "critical"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/006-system-skill-advisor-package-extraction/020-spec-kit-codegraph-decoupling"
    last_updated_at: "2026-05-15T09:35:00Z"
    last_updated_by: "codex"
    recent_action: "Accepted ADR-001 for full source isolation"
    next_safe_action: "Verify and commit scoped decoupling"
    blockers: []
    key_files:
      - "decision-record.md"
    completion_pct: 90
    open_questions: []
    answered_questions:
      - "014/007 ADR-002 direct-import allowance is superseded for spec-kit to code-graph imports."
---
# Decision Record: Spec Kit Code Graph Decoupling

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

<!-- ANCHOR:adr-001 -->
## ADR-001: Spec-Kit Must Not Import System-Code-Graph Source

### Metadata

| Field | Value |
|-------|-------|
| Status | Accepted |
| Date | 2026-05-15 |
| Deciders | Operator, Codex |
| Supersedes | `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-code-graph/015-mcp-topology-pivot/decision-record.md` ADR-002 |

<!-- ANCHOR:adr-001-context -->
### Context

ADR-002 in the 014/007 topology pivot allowed sibling imports while the code graph was being extracted. The operator has now narrowed that decision: the extraction is not complete while system-spec-kit imports system-code-graph source.

The audit found 38 import lines across 25 spec-kit MCP files. The imports fell into five buckets: shared types, code-graph-owned tests, startup-critical reads, request-time runtime calls, and documented process-boundary plugin bridges.

### Constraints

- `system-spec-kit/mcp_server` may not use `from.*system-code-graph` imports.
- Startup hooks must stay fast and must not require code-graph MCP children to be alive.
- Runtime handler calls may use MCP RPC where latency is acceptable.
- Neutral contracts belong in `@spec-kit/shared`.
- Plugin bridge files are allowed when they are explicit process-boundary gateways.
<!-- /ANCHOR:adr-001-context -->

<!-- ANCHOR:adr-001-decision -->
### Decision

We chose full source isolation. System-spec-kit integrates with system-code-graph only through `@spec-kit/shared` contracts, a code-graph readiness marker, MCP RPC to `mk_code_index`, and documented plugin bridges.

How it works:

- Bucket A: type and small neutral contract helpers live in `@spec-kit/shared/code-graph-contracts`.
- Bucket B: tests that exercise code-graph internals move to `system-code-graph/mcp_server/tests` or `stress_test/code-graph`.
- Bucket C: startup surfaces read `.opencode/skills/system-code-graph/mcp_server/database/.code-graph-readiness.json`.
- Bucket D: request-time graph reads use `lib/code-graph-boundary.ts` to call `code_graph_status` or `code_graph_context`.
- Bucket E: plugin bridges remain allowed only when they call across a process boundary rather than importing source.
<!-- /ANCHOR:adr-001-decision -->

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| Full isolation through shared contracts, marker, and RPC | Real MCP boundary, mirrors 019 advisor decoupling, easy audit | Adds marker/RPC wrapper and some latency | 9/10 |
| Keep ADR-002 sibling imports | Lowest code churn | Preserves hidden coupling and keeps extraction incomplete | 2/10 |
| Move code-graph code back into spec-kit | Removes boundary problem mechanically | Violates extraction architecture and operator mandate | 0/10 |
| Add new RPC tools before refactor | Cleaner canonical API for every helper | Blocks current decoupling on new surface design | 5/10 |

Why this one: it is the only option that satisfies the operator's narrowed mandate without undoing the code-graph extraction.
<!-- /ANCHOR:adr-001-alternatives -->

<!-- ANCHOR:adr-001-consequences -->
### Consequences

What improves:

- The import audit is mechanical and enforceable.
- Startup hooks no longer execute code-graph internals.
- Code-graph tests live with code-graph ownership.
- Future code-graph contracts have a clear neutral home.

What it costs:

- Spec-kit now has a thin RPC wrapper and marker reader to maintain.
- Some moved tests still import spec-kit helper contracts from the code-graph suite because the historical tests span both packages.

### Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Marker stale or missing | Medium | Treat missing marker as unavailable and let runtime RPC/status refresh it. |
| RPC child timeout | Medium | Use bounded timeout and return degraded structural context. |
| Classifier parity diverges | Low | Track `021-codegraph-rpc-surface` if canonical classifier RPC becomes necessary. |
<!-- /ANCHOR:adr-001-consequences -->

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | Necessary? | PASS | Operator explicitly narrowed ADR-002 and required zero imports. |
| 2 | Beyond Local Maxima? | PASS | Compared sibling imports, rollback, and new RPC-first alternatives. |
| 3 | Sufficient? | PASS | Uses shared types, marker, and existing RPC instead of broad rewrites. |
| 4 | Fits Goal? | PASS | Directly removes spec-kit to code-graph source imports. |
| 5 | Open Horizons? | PASS | Leaves future RPC expansion as a named follow-on, not hidden coupling. |

Checks Summary: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

<!-- ANCHOR:adr-001-impl -->
### Implementation

What changes:

- `@spec-kit/shared/code-graph-contracts` owns neutral code-graph readiness/status/startup contracts.
- `system-code-graph/mcp_server/lib/readiness-marker.ts` writes startup readiness state.
- `system-spec-kit/mcp_server/lib/code-graph-boundary.ts` reads the marker and wraps MCP RPC.
- Spec-kit hooks and handlers use the new boundary.
- Code-graph tests move out of spec-kit.

How to roll back: revert the 020 commit(s) and restore ADR-002's direct-import allowance. Do not partially roll back only the marker or only the moved tests, because that would recreate split ownership.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
