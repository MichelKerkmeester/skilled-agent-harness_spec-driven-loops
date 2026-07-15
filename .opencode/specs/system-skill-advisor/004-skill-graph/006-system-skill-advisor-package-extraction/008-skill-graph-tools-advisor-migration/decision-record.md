---
title: "Decision Record: Move skill_graph_* tools to advisor ownership"
description: "ADR set for stable skill_graph_* ids, advisor-local handlers, one-window proxy, consumer cutover order, and namespace semantics."
trigger_phrases:
  - "013/009/008 decision record"
  - "skill graph advisor ownership ADR"
  - "skill_graph proxy ADR"
importance_tier: "critical"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/004-skill-graph/006-system-skill-advisor-package-extraction/008-skill-graph-tools-advisor-migration"
    last_updated_at: "2026-05-14T00:00:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Packet scaffolded by cli-codex"
    next_safe_action: "Implement accepted ADRs"
    blockers: []
    completion_pct: 0
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: Move skill_graph_* tools to advisor ownership

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Keep `skill_graph_*` Tool Ids Stable

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-14 |
| **Deciders** | Operator directive, Codex under 013/009 parent constraints |

### Context
<!-- ANCHOR:adr-001-context -->

Parent ADR-001 kept `advisor_*` public ids stable while moving server ownership to `system_skill_advisor`. The same caller-stability invariant applies here. Renaming `skill_graph_scan`, `skill_graph_query`, `skill_graph_status`, or `skill_graph_validate` would multiply migration risk while the server prefix is already changing.
<!-- /ANCHOR:adr-001-context -->

### Decision
<!-- ANCHOR:adr-001-decision -->

**Summary**: Keep the four public tool ids unchanged: `skill_graph_scan`, `skill_graph_query`, `skill_graph_status`, and `skill_graph_validate`.

**Details**: Primary calls move from `mcp__mk_spec_memory__skill_graph_*` to `mcp__system_skill_advisor__skill_graph_*`. The tool id after the server prefix does not change.
<!-- /ANCHOR:adr-001-decision -->

### Alternatives Considered
<!-- ANCHOR:adr-001-alternatives -->

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Stable `skill_graph_*` ids** | Lowest caller churn; mirrors parent ADR-001 | Requires docs to explain server-prefix migration | 9/10 |
| Rename to advisor-prefixed ids | Makes ownership obvious in the id | Breaks every caller and weakens parent stability pattern | 3/10 |
| Keep tools in memory server | No caller migration | Leaves extraction incomplete | 2/10 |
<!-- /ANCHOR:adr-001-alternatives -->

### Consequences
<!-- ANCHOR:adr-001-consequences -->

- Consumers must update server prefix only.
- Grep for `skill_graph_*` remains useful across old and new surfaces.
- Documentation must distinguish stable public ids from changed MCP server ownership.
<!-- /ANCHOR:adr-001-consequences -->

### Five Checks Evaluation
<!-- ANCHOR:adr-001-five-checks -->

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The server ownership move is the explicit packet goal. |
| 2 | **Beyond Local Maxima?** | PASS | Compared stable ids, renamed ids, and keeping memory ownership. |
| 3 | **Sufficient?** | PASS | Server-prefix migration solves ownership without extra tool churn. |
| 4 | **Fits Goal?** | PASS | It directly mirrors parent advisor tool-id stability. |
| 5 | **Open Horizons?** | PASS | Future callers can rely on stable public tool ids. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

### Implementation
<!-- ANCHOR:adr-001-impl -->

Register unchanged public tool ids on `system_skill_advisor`, keep old server names available only through the temporary proxy, and remove old descriptors after zero-caller evidence.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Move Handlers To Advisor-Local Ownership

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-14 |
| **Deciders** | Codex under parent ADR-001 Constraint A/B |

### Context

The current handler files live under `system-spec-kit/mcp_server/handlers/skill-graph/`. Keeping primary handlers there while registering descriptors on `system_skill_advisor` would preserve the cross-package coupling this packet is meant to remove.

### Decision

**Summary**: Move `skill_graph_*` handler entrypoints to advisor-local files under `.opencode/skills/system-skill-advisor/mcp_server/handlers/`.

**Details**: The expected shape is `skill-graph-scan.ts`, `skill-graph-query.ts`, `skill-graph-status.ts`, and `skill-graph-validate.ts`, or a local `handlers/skill-graph/` subdirectory if that fits advisor package conventions better. Existing logic may be moved or factored, but `system_skill_advisor` must not import private memory-server handler files as the final state.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Advisor-local handlers** | Clear ownership; testable package boundary | Requires moving imports and tests | 9/10 |
| Thin advisor descriptors importing memory handlers | Fast to wire | Leaves hidden runtime coupling | 4/10 |
| Shared neutral helper package | Clean if broadly reused | More abstraction than this packet may need | 6/10 |

### Consequences

- Handler dependency inventory is required before edits.
- Tests should run from the advisor package and prove no private memory handler dependency remains.
- Memory-side files can exist only as temporary proxy code during the migration window.
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Use One-Window `spec_kit_memory` Deprecation Proxy

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-14 |
| **Deciders** | Operator directive, mirrors 005 ADR-003 |

### Context

The server-prefix migration is a breaking caller change for any runtime, command, hook, or external script that still calls `mcp__mk_spec_memory__skill_graph_*`. 005 already established the pattern for a short compatibility proxy during advisor extraction.

### Decision

**Summary**: Add a one-window proxy in `spec_kit_memory` that forwards `skill_graph_*` calls to `system_skill_advisor`.

**Details**: The proxy logs a bounded deprecation warning once, forwards to the new server, and uses a 10 second timeout. Proxy removal is triggered only after zero-caller grep plus operator confirmation.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Proxy with once-only deprecation log** | Protects hidden callers and mirrors 005 | Adds temporary dual registration | 9/10 |
| Fail fast with migration hint | Simpler | Breaks live old-server callers immediately | 5/10 |
| Keep memory ownership indefinitely | Lowest short-term churn | Defeats topology consolidation | 1/10 |

### Consequences

- Proxy code must be visibly temporary and easy to remove.
- The implementation summary must record proxy addition and removal evidence.
- If zero-caller evidence is not clean, Cluster D blocks.
<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-004: Cut Consumers Over In Risk Order

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-14 |
| **Deciders** | Codex, following 005 cutover risk ordering |

### Context

Consumers vary in blast radius. System-code-graph readiness surfaces and hooks can affect session startup and prompt-time context. Plugin bridges and doctor docs matter next. User-facing docs can be updated after primary runtime callers are safe, but before cleanup is claimed.

### Decision

**Summary**: Cut over in this order: system-code-graph, hooks, plugins, doctor commands/YAMLs, install guides and architecture docs, feature catalogs and playbooks.

**Details**: Each consumer family gets a grep-before, patch, smoke-or-review, and grep-after step. Historical spec references are classified separately from live instruction surfaces.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Risk-ordered cutover** | Protects session-critical surfaces first | Requires inventory discipline | 9/10 |
| Docs first | Easy visible progress | Leaves runtime breakage risk until late | 4/10 |
| One giant replace | Fast | High risk of historical/spec churn and missed semantics | 3/10 |

### Consequences

- `plan.md` and `tasks.md` track one batch per consumer family.
- Cleanup cannot start until all live consumer families are either retargeted or explicitly classified as historical/non-callers.
<!-- /ANCHOR:adr-004 -->

---

<!-- ANCHOR:adr-005 -->
## ADR-005: Server Prefix Changes, Public Tool Namespace Does Not

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-14 |
| **Deciders** | Codex, operator requested tool-id stability |

### Context

MCP client tool names often include the server prefix, so moving from `mcp__mk_spec_memory__skill_graph_scan` to `mcp__system_skill_advisor__skill_graph_scan` is still caller-visible even though the public tool id remains `skill_graph_scan`.

### Decision

**Summary**: Treat the server-prefix migration as a breaking caller change, mitigated by the temporary memory proxy.

**Details**: Documentation must say "public tool id unchanged; MCP server prefix changed." Smoke evidence must call or list the new server-prefixed tools, not the old proxy.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Explicit server-prefix migration** | Honest about caller impact | Requires broad cutover | 9/10 |
| Pretend stable ids mean no breaking change | Easier docs | Hides the real MCP name change | 2/10 |
| Keep both prefixes permanently | Maximum compatibility | Permanent dual ownership confusion | 3/10 |

### Consequences

- Runtime smoke matrix must prove new prefix callability.
- Old prefix is compatibility only and removed after evidence is clean.
- Future docs should mention `system_skill_advisor` for skill graph tools.
<!-- /ANCHOR:adr-005 -->
