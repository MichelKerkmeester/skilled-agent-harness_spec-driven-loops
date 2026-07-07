---
title: "Decision Record: Full MCP extraction of skill graph library and lifecycle"
description: "Accepted ADRs for council-locked clean cut of skill graph code and lifecycle into system_skill_advisor."
trigger_phrases:
  - "013/009/011 ADR"
  - "skill graph council decisions"
importance_tier: "critical"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/011-mcp-server-package-extraction"
    last_updated_at: "2026-05-14T17:45:00Z"
    last_updated_by: "codex"
    recent_action: "ADR-001 through ADR-008 authored from council verdicts"
    next_safe_action: "Dispatch D2b (hooks + tests + schemas verification)"
    blockers: []
    completion_pct: 60
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: Full MCP extraction of skill graph library and lifecycle

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Move `lib/skill-graph/` Physically To Advisor

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-14 |
| **Deciders** | D1 council Q1, operator D2a dispatch |

### Context
<!-- ANCHOR:adr-001-context -->

The advisor server exposed `skill_graph_*` tools while its DB/query implementation lived in `system-spec-kit/mcp_server/lib/skill-graph/`. That preserved the coupling this extraction is meant to remove.
<!-- /ANCHOR:adr-001-context -->

### Decision
<!-- ANCHOR:adr-001-decision -->

Move `skill-graph-db.ts`, `skill-graph-queries.ts`, and `README.md` to `system-skill-advisor/mcp_server/lib/skill-graph/` using `git mv`.
<!-- /ANCHOR:adr-001-decision -->

### Alternatives Considered
<!-- ANCHOR:adr-001-alternatives -->

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| Physical move | Clear ownership and history preservation | Requires import rewires | 10/10 |
| Import from spec-kit | Fast | Leaves private dependency | 2/10 |
<!-- /ANCHOR:adr-001-alternatives -->

### Consequences
<!-- ANCHOR:adr-001-consequences -->

Advisor owns the skill graph DB/query library. Memory no longer has a skill graph library path.
<!-- /ANCHOR:adr-001-consequences -->

### Five Checks Evaluation
<!-- ANCHOR:adr-001-five-checks -->

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | Necessary? | PASS | The old private import kept extraction incomplete. |
| 2 | Beyond Local Maxima? | PASS | Physical move and import-only options were compared. |
| 3 | Sufficient? | PASS | Moving the three files solves this ownership layer. |
| 4 | Fits Goal? | PASS | It directly implements council Q1. |
| 5 | Open Horizons? | PASS | Advisor can evolve skill graph internals locally. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

### Implementation
<!-- ANCHOR:adr-001-impl -->

Run `git mv` for the three files, then rewire runtime imports and grep for old advisor to spec-kit skill graph paths.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Move DB Init And Startup Scan To Advisor

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-14 |
| **Deciders** | D1 council Q2 |

### Context

Memory startup previously called `initSkillGraphDb()` and `startupSkillGraphScan()`. That made memory a writer for advisor state.

### Decision

`advisor-server.ts` initializes the advisor-local skill graph DB and runs the startup scan before MCP connect.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| Advisor startup ownership | One writer and local lifecycle | Slightly heavier advisor startup | 9/10 |
| Keep memory startup ownership | No server startup change | Preserves split-brain risk | 2/10 |

### Consequences

R1 is mitigated because memory no longer initializes the skill graph database.
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Move File Watcher Lifecycle To Advisor

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-14 |
| **Deciders** | D1 council Q3 |

### Context

The old memory watcher could race advisor freshness publication if advisor also watched skill metadata.

### Decision

Use the advisor package daemon watcher as the only skill graph watcher. It already has 2 second debounce, serialized flushing, and generation publication.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| Advisor daemon watcher | Reuses tested local lifecycle | Requires explicit watch factory loading | 9/10 |
| Clone memory watcher | Simple copy | Duplicates logic and risks drift | 4/10 |

### Consequences

R2 is mitigated because only advisor starts a skill graph watcher.
<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-004: Publish Skill Graph Generation From Advisor

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-14 |
| **Deciders** | D1 council Q4 |

### Context

Generation metadata is the freshness signal consumed by advisor status and hook brief surfaces. Publishing it from memory made the signal owner different from the runtime owner.

### Decision

Advisor startup scan, explicit scan, rebuild, and daemon watcher publish skill graph generation. Memory publishes none of it.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| Advisor-only publication | Aligns state and signal ownership | D2b must verify hooks | 9/10 |
| Memory publication | Keeps old startup behavior | Preserves wrong owner | 2/10 |

### Consequences

R3 and R4 are visible through advisor startup smoke and D2b hook verification.
<!-- /ANCHOR:adr-004 -->

---

<!-- ANCHOR:adr-005 -->
## ADR-005: Final Import Direction Is Spec-Kit To Advisor

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-14 |
| **Deciders** | D1 council Q5 |

### Context

`system_skill_advisor` imported private spec-kit skill graph code. The council locked the target direction as spec-kit to advisor, plus neutral `@spec-kit/shared` when necessary.

### Decision

Remove advisor imports of the private spec-kit skill graph library during D2a. D2b classifies remaining non-skill-graph private seams such as shared payload and tests.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| Package-local skill graph imports | Clean ownership for this subsystem | Leaves broader D2b seams to classify | 8/10 |
| Broad shared extraction now | More complete | Exceeds D2a hook/test/schema boundary | 5/10 |

### Consequences

The D2a grep gate for `system-spec-kit.*lib/skill-graph` is zero.
<!-- /ANCHOR:adr-005 -->

---

<!-- ANCHOR:adr-006 -->
## ADR-006: Delete Empty Spec-Kit Handler Orphan

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-14 |
| **Deciders** | D1 council Q6 |

### Context

`system-spec-kit/mcp_server/handlers/skill-graph/` was empty after packet 008 moved handlers to advisor.

### Decision

Physically delete the empty orphan directory.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| Delete | Removes false ownership signal | None; directory is empty | 10/10 |
| Keep empty directory | Avoids filesystem churn | Misleads future readers | 1/10 |

### Consequences

Old handler path is absent and no placeholder or archive remains.
<!-- /ANCHOR:adr-006 -->

---

<!-- ANCHOR:adr-007 -->
## ADR-007: Use Clean Cut, No Proxy Window

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-14 |
| **Deciders** | D1 council Q7 |

### Context

Packet 008 used a proxy during public tool ownership migration. This packet is different: the public tool ids and server id stay stable, and the moved surface is private implementation plus lifecycle.

### Decision

Move code and lifecycle atomically with no proxy layer.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| Clean cut | No dual-owner window | Requires careful single commit | 9/10 |
| Proxy window | Familiar migration pattern | Council explicitly forbids it here | 1/10 |

### Consequences

Rollback is the single D2a commit, not a long-lived compatibility layer.
<!-- /ANCHOR:adr-007 -->

---

<!-- ANCHOR:adr-008 -->
## ADR-008: R1-R8 Mitigation Strategy

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-14 |
| **Deciders** | D1 council Q8 |

### Context

The council surfaced eight risks. R1-R3 are D2a blockers; R4-R8 need explicit evidence or D2b handoff.

### Decision

Mitigate R1-R3 in source and startup smokes now. Record R4-R8 as either targeted D2a checks or explicit D2b verification items.

### Risk Handling

| Risk | Severity | D2a Handling |
|------|----------|--------------|
| R1 split-brain DB state | High | Memory lifecycle removed; advisor initializes and closes DB. |
| R2 watcher race | High | Memory watcher removed; advisor daemon watcher starts. |
| R3 inert advisor lifecycle | High | Advisor smoke logs startup scan and daemon active. |
| R4 stale hook notice | Medium | Deferred to D2b hook verification. |
| R5 old test imports | Medium | Targeted moved-lib imports fixed; broad tests deferred. |
| R6 topology summary loss | Medium | No direct session-bootstrap DB dependency found; D2b verifies behavior. |
| R7 shared/private import confusion | Medium | Skill graph private import gate is zero; remaining seams deferred. |
| R8 smoke hides inert lifecycle | Medium | Smoke evidence checks lifecycle-specific log lines. |

### Consequences

D2a can land safely at 60% packet completion. D2b must close hooks, schemas, and broad verification before the full extraction is complete.
<!-- /ANCHOR:adr-008 -->
