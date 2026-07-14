---
title: "Decision Record: Keep Hub and Executor Identities Distinct"
description: "Defines cli-external-orchestration as the parent hub and cli-opencode as its routed executor packet."
trigger_phrases: ["advisor routing decision", "cli-external-orchestration cli-opencode"]
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/028-cli-hub-rename/002-advisor-realign"
    last_updated_at: "2026-07-13T06:08:29Z"
    last_updated_by: "claude-code"
    recent_action: "Authored and validated the phase spec docs"
    next_safe_action: "Orchestrator gate and commit"
    blockers: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Decision Record: Keep Hub and Executor Identities Distinct
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- ANCHOR:adr-001 -->
## ADR-001: Project the Nested Executor Through the Parent Hub
### Metadata
| Field | Value |
|---|---|
| Status | Accepted |
| Date | 2026-07-13 |
| Deciders | Repository maintainers |
<!-- ANCHOR:adr-001-context -->
### Context
The advisor needs one parent hub identity while users still request the concrete `cli-opencode` workflow. Flattening those names would erase the routing boundary.

### Constraints
- Preserve one advisor-visible parent hub.
- Resolve concrete executor intent deterministically.
<!-- /ANCHOR:adr-001-context -->
<!-- ANCHOR:adr-001-decision -->
### Decision
**We chose**: Keep `cli-external-orchestration` as the hub and `cli-opencode` as the nested workflow packet.

**How it works**: Advisor metadata discovers the hub, and routing metadata projects matching requests to the executor.
<!-- /ANCHOR:adr-001-decision -->
<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered
| Option | Pros | Cons | Score |
|---|---|---|---:|
| **Hub plus nested executor** | Clear ownership and routing | Requires projection checks | 9/10 |
| Flatten executor as hub | Fewer names | Breaks parent routing model | 4/10 |
| Expose both as peer hubs | Easy discovery | Creates duplicate advisor identities | 2/10 |

**Why this one**: It preserves the established parent-packet contract and produces the verified resolver result.
<!-- /ANCHOR:adr-001-alternatives -->
<!-- ANCHOR:adr-001-consequences -->
### Consequences
**What improves**: routing ownership is explicit and extensible.

**What it costs**: projection freshness must be checked after metadata changes.

| Risk | Impact | Mitigation |
|---|---|---|
| Stale projection | High | Pin the fresh projection hash in phase evidence |
<!-- /ANCHOR:adr-001-consequences -->
<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation
| Check | Result | Evidence |
|---|---|---|
| Necessary | PASS | Advisor must route a concrete executor |
| Alternatives explored | PASS | Three identity models compared |
| Sufficient | PASS | Existing hub router reused |
| Fits goal | PASS | Smoke resolves `cli-opencode` |
| Open horizons | PASS | Additional executors can remain nested |
<!-- /ANCHOR:adr-001-five-checks -->
<!-- ANCHOR:adr-001-impl -->
### Implementation
- Repoint hub metadata and routing projections.
- Verify the local advisor result and fresh projection hash.

**How to roll back**: restore the prior hub metadata and regenerate the prior projection.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
