---
title: "Decision Record: Orphan MCP Leak Prevention"
description: "Architecture decisions for dry-run-first cleanup, repo-local Claude Stop cleanup, and MCP-server-owned idle self-exit."
trigger_phrases:
  - "orphan mcp leak prevention decision"
  - "mcp cleanup adr"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/022-orphan-mcp-leak-prevention"
    last_updated_at: "2026-05-24T06:58:36Z"
    last_updated_by: "codex"
    recent_action: "decision record authored"
    next_safe_action: "implement accepted decisions"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0220220220220220220220220220220220220220220220220220220220220220"
      session_id: "2026-05-24-orphan-mcp-leak-prevention-adr"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: Orphan MCP Leak Prevention

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Dry-Run-First Sweeper And Server-Owned Idle Timeout

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-24 |
| **Deciders** | Operator, Codex |

---

<!-- ANCHOR:adr-001-context -->
### Context

Manual cleanup reclaimed gigabytes of memory, but a non-reviewed automatic sweeper could kill active development work. At the same time, only sweeping is a fallback, not prevention; the MCP servers themselves can know whether primary stdio or secondary IPC clients are active.

### Constraints

- LaunchAgent activation is excluded from this pass.
- Claude cleanup must use the repo-local `.claude/settings.local.json`.
- `devin --print`, `/tmp/devin-*`, active dev servers, and Ollama must be preserved.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: ship a dry-run-first external sweeper and add idle self-exit inside the MCP server processes.

**How it works**: The sweeper classifies stale processes from the process table and only kills when dry-run is absent. The MCP servers update last activity from stdio and IPC events, then close IPC state and exit after `SPECKIT_LAUNCHER_IDLE_TIMEOUT_MIN`.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Sweeper plus server idle timeout** | Covers current leaks and prevents some future accumulation | More test surface | 9/10 |
| Sweeper only | Fastest tactical relief | Leaves launchers dependent on external cleanup | 6/10 |
| Launcher-only timeout | Directly targets lease holders | Misses Codex.app code-mode and ClickUp stacks | 5/10 |

**Why this one**: The mixed approach matches the observed failure modes: external upstream leaks need sweeping, while repo-owned MCP servers can self-limit safely.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Stale MCP helpers become visible and removable through one reviewed script.
- Repo-owned MCP servers stop depending only on external cleanup.

**What it costs**:
- More lifecycle code in three MCP services. Mitigation: share the same behavior shape and cover it with targeted tests.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| False-positive kill | H | Dry-run first and conservative preserve rules. |
| Idle shutdown during use | M | Activity tracking and `0` disable knob. |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Manual cleanup found repeated orphan stacks and high RSS cost. |
| 2 | **Beyond Local Maxima?** | PASS | Compared sweeper-only, launcher-only, and combined designs. |
| 3 | **Sufficient?** | PASS | Uses existing process tools and MCP shutdown paths. |
| 4 | **Fits Goal?** | PASS | Directly targets orphan accumulation. |
| 5 | **Open Horizons?** | PASS | LaunchAgent activation and upstream report remain separate. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `.opencode/scripts/orphan-mcp-sweeper.sh` classifies and optionally terminates stale MCP helpers.
- `.claude/settings.local.json` chains session cleanup after existing session-stop.
- Three MCP services add activity tracking and idle shutdown.

**How to roll back**: Revert the scoped files in this packet and re-run JSON, vitest, typecheck, and spec validation.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
