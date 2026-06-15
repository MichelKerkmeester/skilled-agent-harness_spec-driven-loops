---
title: "Decision Record: mcp-click-up Skill Architecture"
description: "Architecture decisions for the mcp-click-up skill: CLI choice, MCP server choice, and routing model."
trigger_phrases:
  - "mcp-click-up decisions"
  - "clickup skill adr"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/124-mcp-click-up-task-management"
    last_updated_at: "2026-05-31T00:00:00Z"
    last_updated_by: "speckit-complete"
    recent_action: "Wrote decision-record.md with 3 ADRs for mcp-click-up"
    next_safe_action: "Run validate.sh and memory:save"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-click-up/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000005"
      session_id: "speckit-124-mcp-click-up"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

# Decision Record: mcp-click-up Skill Architecture

---

<!-- ANCHOR:adr-001 -->
## ADR-001: CLI Tool Selection — cupt over @krodak/clickup-cli

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-31 |
| **Deciders** | User (explicit instruction) |

---

<!-- ANCHOR:adr-001-context -->
### Context

Two CLI tools exist for ClickUp from the terminal:
- `cupt` — Python CLI (`pipx install cupt`), purpose-built for AI agents, bundled SKILL.md + examples.md
- `@krodak/clickup-cli` (`cu` command) — Node.js npm package, broader command set, no agent-specific design

The spec folder included `external/cupt-main/` as a reference. The Barter project at `/MCP/ClickUp` uses `@krodak/clickup-cli`. The user explicitly said: "focus on the cupt cli mainly" and "we don't want that [the Barter approach]".

<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**Use `cupt` (Python CLI, `pipx install cupt`) as the primary CLI tool.**

cupt is purpose-built for AI agent workflows with: bundled SKILL.md, `--json` output on all read commands, `--offline` cache, `--dry-run` on completion, auto-resolution of list-specific status schemas.

<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **cupt** | Agent-focused design, bundled skill, dry-run, --offline, explicit status-per-list | Python dep, pipx recommended | 9/10 |
| @krodak/clickup-cli (`cu`) | Node.js (no Python dep), 30+ commands, sprint support | No --dry-run, no --offline, no agent SKILL.md; `cu` conflicts with system `cu` command | 6/10 |
| Direct ClickUp REST API | Maximum control | Verbose, no CLI ergonomics, auth management burden | 4/10 |

<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**Positive**: Agent invariants (dry-run, --json, statuses-per-list) are documented by cupt itself. Skill content directly maps to the upstream tool's design.

**Negative**: Python 3.8+ and pipx/pip dependency. install.sh must handle version detection and fallback.

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| cupt abandoned/broken release | H | Version-pin in install.sh; test `cupt --version` |
| Python not available | M | install.sh exits with clear instructions |

<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| Check | Question | Result |
|-------|----------|--------|
| Necessary? | Is there a current need for a ClickUp skill? | Yes — no ClickUp skill exists |
| Beyond Local Max? | Explored alternatives? | Yes — cupt vs cu vs direct API |
| Sufficient? | Is cupt the simplest solution? | Yes — agent-optimized, no config needed |
| Fits Goal? | Does cupt advance the goal? | Yes — purpose-built for AI agent use |
| Open Horizons? | Long-term aligned? | Yes — if cupt deprecated, MCP covers all operations |

<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**Affected Systems**:
- `scripts/install.sh` — installs cupt via pipx/pip
- `SKILL.md §3 HOW IT WORKS` — cupt as primary path
- `SKILL.md §4 RULES` — cupt agent invariants
- `references/cupt_commands.md` — complete cupt reference

**Rollback**: Remove `scripts/install.sh` cupt install block; remove `references/cupt_commands.md`; update SKILL.md to use MCP-only routing.

<!-- /ANCHOR:adr-001-impl -->

<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: MCP Server Selection — Official ClickUp MCP

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-31 |
| **Deciders** | User (explicit instruction) |

---

<!-- ANCHOR:adr-002-context -->
### Context

Multiple ClickUp MCP servers exist. The user said "support the mcp secondarily". The Barter reference project documented the official ClickUp MCP (`github.com/clickup/clickup-mcp-server`) with 46 tools.

<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**Use the official ClickUp MCP server (`github.com/clickup/clickup-mcp-server`).**

<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Official ClickUp MCP** | ClickUp-maintained, 46 tools, stable API contract | May lag behind ClickUp API additions | 9/10 |
| @taazkareem/clickup-mcp-server | Community, may update faster | Not official, external maintenance risk | 6/10 |

<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**Positive**: Official support, 46-tool surface, well-documented auth (CLICKUP_API_KEY + CLICKUP_TEAM_ID).

**Negative**: May have slower updates for new ClickUp API features compared to community tools.

<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| Check | Result |
|-------|--------|
| Necessary? | Yes — cupt cannot access documents/goals/bulk ops |
| Beyond Local Max? | Yes — official vs community MCP compared |
| Sufficient? | Yes — 46 tools cover all required advanced operations |
| Fits Goal? | Yes — secondary path for advanced operations |
| Open Horizons? | Yes — official tool reduces maintenance risk |

<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

- `INSTALL_GUIDE.md §2` — MCP config snippet for opencode.json
- `references/mcp_tools.md` — 46 tools + invocation patterns
- `SKILL.md §3` — official MCP as secondary path via Code Mode call_tool_chain()

<!-- /ANCHOR:adr-002-impl -->

<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Routing Model — Operation-Based over Availability-Based

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-31 |
| **Deciders** | Architecture analysis |

---

<!-- ANCHOR:adr-003-context -->
### Context

`mcp-chrome-devtools` uses **availability-based** routing: bdg CLI if available, MCP if not. Both tools cover the same Chrome DevTools surface via different interfaces. cupt and the official MCP cover **different ClickUp surfaces**. cupt cannot create documents or goals; MCP has no dry-run or offline mode.

<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**Use operation-based routing: route by what operation the agent needs, not by which tool is available.**

| Operation Class | Tool |
|----------------|------|
| Daily task ops (list, done, note, time, tag) | cupt |
| Advanced ops (documents, goals, webhooks, bulk) | Official MCP |

<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Decision |
|--------|----------|
| Availability-based (like mcp-chrome-devtools) | Rejected — tools are complementary, not interchangeable |
| Operation-based (this decision) | Accepted — tools cover distinct surfaces |
| Always prefer MCP (more tools) | Rejected — cupt has ergonomic advantages for daily ops (dry-run, offline, status resolution) |

<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**Positive**: Clear decision rule for agents. No ambiguity about which tool to use for common operations. Agents using cupt for daily work don't need MCP configured.

**Negative**: SKILL.md routing pseudocode is more complex. Two separate install paths.

<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| Check | Result |
|-------|--------|
| Necessary? | Yes — tools cover different surfaces; single-tool routing would fail |
| Beyond Local Max? | Yes — availability-based vs operation-based vs MCP-only all considered |
| Sufficient? | Yes — operation table clearly partitions all operations |
| Fits Goal? | Yes — enables daily ops without MCP; advanced ops without cupt |
| Open Horizons? | Yes — if cupt deprecated, all operations move to MCP cleanly |

<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

- `SKILL.md §2 SMART ROUTING` — operation-based routing table in pseudocode
- `SKILL.md §3 HOW IT WORKS` — side-by-side comparison + tool selection guide

<!-- /ANCHOR:adr-003-impl -->

<!-- /ANCHOR:adr-003 -->
