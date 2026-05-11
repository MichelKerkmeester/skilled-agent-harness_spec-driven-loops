---
title: "Decision Record: 101/003 Deep AI Council Graph Support"
description: "Architecture decision record for the dedicated derived council graph implementation."
trigger_phrases:
  - "101/003 decision"
  - "council graph decision"
  - "deep-ai-council graph ADR"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/101-deep-multi-ai-council-skill/003-deep-ai-council-graph-support"
    last_updated_at: "2026-05-10T12:30:00Z"
    last_updated_by: "openai-gpt-5.5-opencode"
    recent_action: "Recorded dedicated derived council graph decision"
    next_safe_action: "Implement council graph storage and MCP handlers"
    blockers: []
    key_files:
      - .opencode/skills/system-spec-kit/mcp_server/lib/council-graph/
      - .opencode/skills/system-spec-kit/mcp_server/handlers/council-graph/
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "101-003-graph-support"
      parent_session_id: null
    completion_pct: 35
    open_questions: []
    answered_questions:
      - "Dedicated derived council graph selected over deep-loop reuse and deferral."
---
# Decision Record: 101/003 Deep AI Council Graph Support

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Dedicated Derived Council Graph

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-10 |
| **Deciders** | User, OpenCode |

---

<!-- ANCHOR:adr-001-context -->
### Context

The council workflow now has a dedicated `deep-ai-council` skill and stable packet-local artifact contracts. The existing deep-loop coverage graph is hard-coded for research/review loop types, node kinds, relation sets, and convergence signals, so direct reuse would couple council deliberation to unrelated coverage semantics.

### Constraints

- `ai-council-state.jsonl` and packet-local `ai-council/**` artifacts remain the source of truth.
- Historical council state rows are append-only and must not be rewritten.
- Council graph tools must not overload existing `deep_loop_graph_*` tools or their `research` / `review` loop types.
- Query outputs must be bounded and prompt-safe.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Implement a dedicated council graph as a derived SQLite projection from council artifacts.

**How it works**: Callers or reducers upsert graph nodes and edges using council-specific kinds and relations. The graph can be deleted and rebuilt from `ai-council/**` artifacts, while query and convergence tools provide bounded structural context for synthesis and audit.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Dedicated derived council graph** | Keeps semantics independent, supports council-specific queries, preserves artifact source-of-truth | Adds new tools and tests | 9/10 |
| Reuse deep-loop graph directly | Less new code | Requires overloading research/review loop types and convergence semantics | 2/10 |
| Adapter on top of deep-loop graph patterns | Reuses implementation style | Easy to blur storage/tool boundaries unless kept separate | 6/10 |
| Continued deferral | No immediate maintenance cost | User requested implementation and council artifacts are stable enough for a first graph slice | 4/10 |

**Why this one**: A dedicated derived graph solves the real need without making council state authoritative or weakening deep-loop research/review boundaries.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Council synthesis can query unresolved disagreements, evidence chains, decision support, and convergence blockers.
- Research/review deep-loop graph tools remain semantically stable.
- Recovery can discard derived graph rows and replay from artifacts.

**What it costs**:
- Additional MCP tools and SQLite schema. Mitigation: keep the first implementation small and covered by targeted handler tests.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Graph rows treated as source-of-truth | High | Document derived-only contract and keep artifacts authoritative |
| Query output leaks too much artifact text | Medium | Return bounded node metadata and explicit limits |
| Convergence math appears more authoritative than council report | Medium | Return trace and blocker details, not a silent score only |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | User requested implementation after review fixes |
| 2 | **Beyond Local Maxima?** | PASS | Compared deep-loop reuse, adapter, deferral, and dedicated graph |
| 3 | **Sufficient?** | PASS | First slice covers storage, status, query, and convergence only |
| 4 | **Fits Goal?** | PASS | Supports council synthesis without changing implementation agents |
| 5 | **Open Horizons?** | PASS | Derived projection can be replayed and extended without rewriting council history |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- Add `lib/council-graph/` for SQLite storage, query helpers, and convergence metrics.
- Add `handlers/council-graph/` for bounded MCP handlers.
- Add tool schemas, strict input schemas, dispatch registration, and targeted tests.
- Update `deep-ai-council` guidance from graph-out-of-scope to derived-graph integration boundaries.

**How to roll back**: Remove `council_graph_*` tool registrations and handlers, delete `council-graph.sqlite`, and continue using packet-local `ai-council/**` artifacts as the source of truth.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
