---
title: "Decision Record: Hooks Compat And Consumer Cutover"
description: "ADR set for the 005 consumer cutover: parent ADR reuse, tool-id stability, legacy bridge behavior, plugin bridge strategy, and doctor:update target changes."
trigger_phrases:
  - "013 009 005 adr"
  - "advisor legacy bridge adr"
  - "advisor consumer cutover decisions"
importance_tier: "critical"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/006-system-skill-advisor-package-extraction/005-hook-compatibility-consumer-cutover"
    last_updated_at: "2026-05-14T12:45:00Z"
    last_updated_by: "codex"
    recent_action: "COMPACT authored ADRs"
    next_safe_action: "Implement ADR-003 proxy"
    blockers: []
    key_files:
      - "decision-record.md"
      - "spec.md"
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0130090050000000000000000000000000000000000000000000000000000000"
      session_id: "013-009-005-hooks-compat-consumer-cutover"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "ADR-003 selects proxy with deprecation log."
      - "ADR-004 prefers MCP-level dispatch."
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: Hooks Compat And Consumer Cutover

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Reuse Parent Standalone Advisor MCP Decision

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-14 |
| **Deciders** | Codex, following child 001 ADR-001 |

### Context
<!-- ANCHOR:adr-001-context -->

Child 001 already accepted "Standalone Advisor MCP With Legacy Tool Bridge." That parent decision answers the structural questions for child 005: advisor ownership moves to `.opencode/skills/system-skill-advisor/`, the runtime server id is `system_skill_advisor`, and public tool ids stay `advisor_*`.
<!-- /ANCHOR:adr-001-context -->

### Decision
<!-- ANCHOR:adr-001-decision -->

**We chose**: Treat parent ADR-001 as binding and avoid reopening the architecture in this cutover packet.

**How it works**: Child 005 implements the consumer-facing part of the already accepted migration sequence. It changes callers and compatibility behavior, not scoring logic or package ownership.
<!-- /ANCHOR:adr-001-decision -->

### Alternatives Considered
<!-- ANCHOR:adr-001-alternatives -->

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Reuse parent ADR-001** | Keeps this packet scoped to cutover | Requires readers to follow parent link | 10/10 |
| Reopen standalone MCP design | Could revisit assumptions | Creates churn after source and launcher packets | 2/10 |
<!-- /ANCHOR:adr-001-alternatives -->

### Consequences
<!-- ANCHOR:adr-001-consequences -->

- Child 005 can focus on hook, plugin, shim, doctor, and install-guide consumers.
- Any request to rename advisor tools or keep primary ownership in memory MCP is out of scope for this packet.
<!-- /ANCHOR:adr-001-consequences -->

### Five Checks Evaluation
<!-- ANCHOR:adr-001-five-checks -->

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Parent ADR already controls child 005 scope. |
| 2 | **Beyond Local Maxima?** | PASS | Reuse was compared with reopening the decision. |
| 3 | **Sufficient?** | PASS | The parent ADR covers the server and tool-id boundary. |
| 4 | **Fits Goal?** | PASS | This keeps child 005 on consumer cutover. |
| 5 | **Open Horizons?** | PASS | Child 006 still owns proxy removal. |
<!-- /ANCHOR:adr-001-five-checks -->

### Implementation
<!-- ANCHOR:adr-001-impl -->

Use the parent ADR as the architectural source of truth. Implement only the consumer cutover decisions in this packet.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Preserve Public Advisor Tool Ids

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-14 |
| **Deciders** | Codex |

### Context

Existing hooks, plugin bridges, tests, docs, and operator instructions refer to `advisor_recommend`, `advisor_status`, `advisor_rebuild`, and `advisor_validate`. Changing ids while also changing server ownership would multiply migration risk.

### Decision

**We chose**: Keep the public `advisor_*` tool ids stable and move only the MCP server ownership to `system_skill_advisor`.

**How it works**: Server namespace distinguishes the new boundary. New primary calls use `system_skill_advisor.advisor_*`; legacy memory-side calls are compatibility only.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Stable `advisor_*` ids** | Lowest caller churn, matches parent ADR | Requires clear docs on server ownership | 9/10 |
| Rename to namespaced ids | Makes ownership obvious in the id | Breaks every existing caller and test at once | 4/10 |

### Consequences

- Tool-id grep remains useful for consumer inventory.
- Install guides must say "ids stable, server changed" to prevent old-server assumptions.
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Proxy Legacy `spec_kit_memory` Advisor Calls For One Migration Window

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-14 |
| **Deciders** | Codex |

### Context

The main cutover risk is unknown external callers still bound to `spec_kit_memory.advisor_*`. A fail-fast migration hint is cleaner, but it can break live sessions before every runtime and plugin wrapper has moved.

### Decision

**We chose**: Keep a temporary `spec_kit_memory` proxy for `advisor_*` calls with a bounded deprecation log for one minor version. Child 006 removes this proxy after cutover evidence is green.

**How it works**: Memory MCP can register compatibility descriptors and dispatchers, but they do not own advisor logic or write the advisor DB. The proxy forwards to `system_skill_advisor.advisor_*` when possible and returns a prompt-safe migration hint if forwarding is unavailable.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Proxy with deprecation log** | Protects external callers and produces cleanup evidence | Adds temporary dual registration | 9/10 |
| Fail fast with migration hint | Simpler and makes ownership unmistakable | Breaks un-migrated callers immediately | 6/10 |
| Keep primary memory handlers | No short-term caller churn | Violates standalone MCP ownership | 1/10 |

### Consequences

- Proxy code must be small and clearly marked for child 006 removal.
- Deprecation logs become evidence for whether any legacy caller remains.
- The proxy must not open or mutate the advisor SQLite DB directly.
<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-004: Prefer MCP-Level Dispatch For Plugin Bridge Cutover

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-14 |
| **Deciders** | Codex |

### Context

The OpenCode plugin host already uses a subprocess bridge because native modules can be compiled for a different Node ABI than the host runtime. Directly importing standalone advisor handlers into the plugin would keep the host sensitive to package internals and native-module layout.

### Decision

**We chose**: Prefer MCP-level dispatch for the plugin bridge, with package-level compat import allowed only inside the subprocess if MCP dispatch is unavailable or would create a larger dependency cycle.

**How it works**: The plugin remains MCP-server-agnostic from the host perspective. The bridge process calls `system_skill_advisor.advisor_recommend` or a stable package compat export and emits the same prompt-safe JSON response.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **MCP-level dispatch** | Preserves process boundary and server ownership | Needs server availability in smoke tests | 8/10 |
| Direct import from new package | Fast and local to the bridge | Couples bridge to compiled dist paths again | 6/10 |
| Keep old memory dist import | Minimal edit | Breaks standalone ownership and child 006 cleanup | 1/10 |

### Consequences

- Bridge smoke must cover unavailable-server fail-open behavior.
- Any direct import fallback must target `.opencode/skills/system-skill-advisor/`, never old `system-spec-kit/mcp_server/skill_advisor/`.
<!-- /ANCHOR:adr-004 -->

---

<!-- ANCHOR:adr-005 -->
## ADR-005: Point Doctor Update Advisor Probes At The New Server

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-14 |
| **Deciders** | Codex |

### Context

`doctor_skill-advisor.yaml` and `doctor_update.yaml` still encode older skill-advisor assumptions in path lists, DB targets, and rebuild order. After child 004, the authoritative advisor health source is the standalone server and package-local DB.

### Decision

**We chose**: Update doctor skill-advisor and doctor:update workflows so advisor health probes, rebuilds, and cleanup checks target `system_skill_advisor` and `.opencode/skills/system-skill-advisor/mcp_server/database/skill-graph.sqlite`.

**How it works**: The first verification run uses `--cleanup-legacy=false` so the new path is exercised before any old bridge or stale path is removed.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Retarget doctor workflows now** | Validates the actual runtime boundary | Requires YAML and smoke updates | 9/10 |
| Leave doctor on memory DB until child 006 | Less work in 005 | Produces false health evidence | 3/10 |

### Consequences

- Doctor output must distinguish memory MCP health from advisor MCP health.
- Child 006 can use doctor results to decide whether legacy cleanup is safe.
<!-- /ANCHOR:adr-005 -->

---

## Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Consumers still have mixed old/new advisor paths after package extraction. |
| 2 | **Beyond Local Maxima?** | PASS | ADR-003 and ADR-004 compare proxy/fail-fast and dispatch/import options. |
| 3 | **Sufficient?** | PASS | Decisions cover tool ids, legacy bridge, plugin strategy, and doctor workflow. |
| 4 | **Fits Goal?** | PASS | All decisions support ADR-001 step 4 without changing scoring behavior. |
| 5 | **Open Horizons?** | PASS | Proxy removal is cleanly deferred to child 006. |

**Checks Summary**: 5/5 PASS
