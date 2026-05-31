---
title: "Feature Specification: mcp-click-up — ClickUp skill via cupt CLI + official MCP"
description: "No dedicated ClickUp skill exists for AI agents. This spec covers creating mcp-click-up: a skill wrapping the cupt CLI (primary) for daily task operations and the official ClickUp MCP server (secondary) for advanced features like documents, goals, and bulk operations."
trigger_phrases:
  - "clickup"
  - "cupt"
  - "mcp-click-up"
  - "task management skill"
  - "clickup skill"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/124-mcp-click-up-task-management"
    last_updated_at: "2026-05-31T00:00:00Z"
    last_updated_by: "speckit-complete"
    recent_action: "Wrote spec.md (Level 3) for mcp-click-up skill creation"
    next_safe_action: "Execute implementation per tasks.md"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-click-up/SKILL.md"
      - ".opencode/skills/mcp-click-up/scripts/install.sh"
      - ".opencode/skills/mcp-click-up/references/cupt_commands.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000001"
      session_id: "speckit-124-mcp-click-up"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

# Feature Specification: mcp-click-up — ClickUp Skill via cupt CLI + Official MCP

---

<!-- ANCHOR:executive-summary -->
## EXECUTIVE SUMMARY

This specification covers the creation of the `mcp-click-up` skill under `.opencode/skills/mcp-click-up/`. The skill gives AI agents a structured, orchestrated interface to ClickUp using two complementary tools: the `cupt` Python CLI for daily task operations, and the official ClickUp MCP server for advanced features. The skill follows the `mcp-chrome-devtools` structural template and embeds its own installation logic.

**Key Decisions**: cupt CLI as primary (ADR-001); official ClickUp MCP as secondary (ADR-002); operation-based routing over availability-based fallback (ADR-003).

**Critical Dependencies**: Python 3.8+, pipx or pip, cupt v0.7.1+, ClickUp API token (`pk_xxx`).

<!-- /ANCHOR:executive-summary -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | In Progress |
| **Created** | 2026-05-31 |
| **Spec Folder** | `.opencode/specs/skilled-agent-orchestration/124-mcp-click-up-task-management` |
| **Skill Target** | `.opencode/skills/mcp-click-up/` |
| **Estimated LOC** | ~2,100 |

<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

No `mcp-click-up` skill exists in `.opencode/skills/`. AI agents working with ClickUp have no structured guidance for tool selection, installation, authentication, or operation-to-tool routing. Without a skill, agents must infer the correct tool, which leads to inconsistent behavior: hardcoded status names, ignoring dry-run patterns, confusion between `cupt` and `cu` (the @krodak/clickup-cli), and no embedded install path.

### Purpose

Create a production-ready `mcp-click-up` skill that:
1. Routes agents to `cupt` CLI for daily task operations (list, show, done, note, time, tag)
2. Routes agents to the official ClickUp MCP for advanced operations (documents, goals, bulk ops, webhooks)
3. Embeds a self-contained `scripts/install.sh` that installs `cupt` via pipx/pip and prints MCP config
4. Documents all critical agent invariants from the cupt bundled skill (status-per-list, dry-run, empty-queue handling)

<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- `SKILL.md` with 8 sections, routing pseudocode, operation-to-tool table
- `README.md` — public overview with quick-start
- `INSTALL_GUIDE.md` — AI-first install block with validation gates
- `graph-metadata.json` — skill graph registration with intent signals
- `scripts/install.sh` — cupt install (pipx→pip fallback) + MCP config snippet output
- `references/cupt_commands.md` — full cupt command reference + agent invariants
- `references/mcp_tools.md` — 46 official MCP tools, priority table, invocation pattern
- `references/troubleshooting.md` — auth, status, team-filter, MCP connection failures
- `examples/README.md` + `examples/task-queue-workflow.sh` + `examples/time-tracking-workflow.sh`
- `manual_testing_playbook/` — 5 phases (~15 test files)
- `changelog/v1.0.0.0.md`

### Out of Scope

- @krodak/clickup-cli (`cu` command) — not supported by this skill
- Community MCP servers (@taazkareem/clickup-mcp-server) — skill uses official MCP only
- ClickUp browser automation / Playwright integration
- Write-back to `opencode.json` for MCP registration (user applies config snippet manually)

### Files to Create/Modify

| Path | Type | Description |
|------|------|-------------|
| `.opencode/skills/mcp-click-up/SKILL.md` | Create | Core skill definition |
| `.opencode/skills/mcp-click-up/README.md` | Create | Public overview |
| `.opencode/skills/mcp-click-up/INSTALL_GUIDE.md` | Create | Install guide |
| `.opencode/skills/mcp-click-up/graph-metadata.json` | Create | Skill graph registration |
| `.opencode/skills/mcp-click-up/scripts/install.sh` | Create | Embedded install script |
| `.opencode/skills/mcp-click-up/references/cupt_commands.md` | Create | cupt reference |
| `.opencode/skills/mcp-click-up/references/mcp_tools.md` | Create | MCP tools reference |
| `.opencode/skills/mcp-click-up/references/troubleshooting.md` | Create | Error resolution |
| `.opencode/skills/mcp-click-up/examples/README.md` | Create | Examples guide |
| `.opencode/skills/mcp-click-up/examples/task-queue-workflow.sh` | Create | Task queue example |
| `.opencode/skills/mcp-click-up/examples/time-tracking-workflow.sh` | Create | Time tracking example |
| `.opencode/skills/mcp-click-up/manual_testing_playbook/` | Create | 5 phases, ~15 files |
| `.opencode/skills/mcp-click-up/changelog/v1.0.0.0.md` | Create | Initial changelog |

<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 — Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | SKILL.md exists with all 8 canonical sections | Validate sections 1–8 present; routing pseudocode includes operation table |
| REQ-002 | scripts/install.sh installs cupt via pipx or pip | `bash install.sh` succeeds; `cupt --version` prints version after run |
| REQ-003 | cupt agent invariants documented | Section 4 Rules includes: no hardcoded statuses, dry-run before batch, empty-queue handling |
| REQ-004 | Operation-based routing table present | SKILL.md Section 2 maps each cupt operation to cupt CLI; each MCP-only operation to MCP |
| REQ-005 | graph-metadata.json registered with intent signals | Skill is discoverable via skill_advisor.py at threshold 0.7 for "clickup task management" |

### P1 — Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | references/cupt_commands.md covers all cupt commands | All groups (auth, list, show, done, note, time, tag, attach, summary, teams) documented |
| REQ-007 | references/mcp_tools.md covers official MCP tools | HIGH/MEDIUM/LOW priority table present; call_tool_chain invocation pattern shown |
| REQ-008 | INSTALL_GUIDE.md has AI-first install block | Copy-paste prompt for AI assistants at top; validation checkpoints present |
| REQ-009 | examples/ contains two runnable shell scripts | task-queue-workflow.sh and time-tracking-workflow.sh are executable with set -euo pipefail |

### P2 — Optional

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-010 | manual_testing_playbook/ covers 5 phases | Index file + 5 phase directories with test markdown files |
| REQ-011 | README.md has quick-start and feature table | Quick-start in ≤5 steps; CLI vs MCP feature comparison table |

<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `python3 .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py "clickup task management" --threshold 0.7` returns `mcp-click-up` as a match
- **SC-002**: `bash .opencode/skills/mcp-click-up/scripts/install.sh` completes without error on macOS and prints MCP config snippet
- **SC-003**: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/skilled-agent-orchestration/124-mcp-click-up-task-management --strict` exits 0
- **SC-004**: All 13 P0/P1 checklist items verified with evidence

<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | cupt v0.7.1+ on PyPI | CLI unavailable | Install script verifies version; fallback to `pip install cupt` |
| Dependency | Official ClickUp MCP (clickup/clickup-mcp-server) | MCP unavailable | Skill works without MCP; all daily ops use cupt |
| Risk | pipx not installed | Install fails | Script falls back to pip; warns user to install pipx for isolation |
| Risk | PATH conflict: system `cu` command | cupt misidentified | install.sh verifies `cupt --version` explicitly, not `cu` |
| Risk | ClickUp API token format | Auth fails | References doc specifies `pk_xxx` format; OAuth path documented |

<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

- **NFR-P01**: install.sh completes within 60s on a fast connection
- **NFR-M01**: SKILL.md routing pseudocode is readable Python-like pseudocode, matching mcp-chrome-devtools style
- **NFR-M02**: All cupt commands in references/ include the `--json` flag variant for programmatic use
- **NFR-S01**: install.sh does not auto-modify opencode.json or system config files — prints config snippet only

<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- **cupt not installed**: SKILL.md Section 3 directs agent to run `bash .opencode/skills/mcp-click-up/scripts/install.sh`
- **Empty task queue**: cupt returns 0 results — documented as valid state; agent must not fabricate tasks
- **Status varies per list**: cupt done resolves status automatically; agents NEVER hardcode status strings
- **Team filter is slow**: Client-side filter on large workspaces — documented in references/cupt_commands.md
- **MCP unavailable**: Skill still fully functional for daily ops via cupt; MCP-only operations deferred
- **Python < 3.8**: install.sh checks Python version; prints upgrade instructions and exits non-zero

<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 20/25 | Files: 15+, LOC: ~2100, Systems: skill framework |
| Risk | 10/25 | Auth: no code auth, API: cupt upstream, Breaking: no |
| Research | 15/20 | cupt source + mcp-chrome-devtools template studied |
| Multi-Agent | 5/15 | Single-agent implementation |
| Coordination | 8/15 | Dependencies: cupt-main, mcp-chrome-devtools |
| **Total** | **58/100** | **Level 3** |

<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:risk-matrix -->
## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | cupt broken release on PyPI | H | L | Pin version in install.sh; test via `cupt --version` |
| R-002 | Official MCP API changes | M | M | Reference docs versioned; MCP section marked "verify version" |
| R-003 | install.sh modifies system state unexpectedly | H | L | Script is read-only except cupt install; no config mutations |
| R-004 | Skill not discoverable via skill_advisor | M | L | graph-metadata.json has rich intent_signals matching cupt/clickup terms |

<!-- /ANCHOR:risk-matrix -->

---

<!-- ANCHOR:user-stories -->
## 10. USER STORIES

### US-001: Agent processes tagged work queue (P0)

**As an** AI agent, **I want** a clear routing decision for ClickUp task operations, **so that** I use `cupt list --tag <tag> --json` rather than guessing tool options.

**Acceptance Criteria**:
1. SKILL.md Section 2 routing table maps `list/filter` → cupt
2. Section 4 rules include "use --json for programmatic output"
3. examples/task-queue-workflow.sh demonstrates the full workflow

### US-002: Agent completes tasks safely (P0)

**As an** AI agent, **I want** enforced dry-run patterns before batch completion, **so that** I don't accidentally close tasks with wrong statuses.

**Acceptance Criteria**:
1. Section 4 Rule: NEVER hardcode status names → always `cupt statuses <id>` first
2. Section 4 Rule: ALWAYS dry-run before batch: `cupt done <id> --dry-run`
3. references/cupt_commands.md documents the statuses command

### US-003: Developer installs cupt in one command (P1)

**As a** developer, **I want** `bash .opencode/skills/mcp-click-up/scripts/install.sh` to install cupt and print MCP config, **so that** I'm set up with both tools without manual steps.

<!-- /ANCHOR:user-stories -->

---

<!-- ANCHOR:questions -->
## 11. OPEN QUESTIONS

All questions resolved before implementation:
- **Q1**: Which MCP server? → **RESOLVED: github.com/clickup/clickup-mcp-server (official)**
- **Q2**: Which CLI? → **RESOLVED: cupt (Python, pipx install cupt), NOT @krodak/clickup-cli**
- **Q3**: Routing model? → **RESOLVED: Operation-based (not availability-based)**
- **Q4**: Install write to opencode.json? → **RESOLVED: No — print config snippet only**

<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Reference**: `external/cupt-main/skill/cupt-clickup/SKILL.md` (upstream cupt agent patterns)
- **Template**: `.opencode/skills/mcp-chrome-devtools/` (structural reference)

<!-- /ANCHOR:related-docs -->
