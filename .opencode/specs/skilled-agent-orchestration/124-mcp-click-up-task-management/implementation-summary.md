---
title: "Implementation Summary: mcp-click-up Skill"
description: "mcp-click-up skill created — gives AI agents a structured, safe interface to ClickUp via cupt CLI (primary) and official ClickUp MCP (secondary). Includes embedded install, operation-based routing, and all critical agent invariants."
trigger_phrases:
  - "mcp-click-up summary"
  - "clickup skill summary"
  - "clickup implementation"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/124-mcp-click-up-task-management"
    last_updated_at: "2026-05-31T00:00:00Z"
    last_updated_by: "speckit-complete"
    recent_action: "Completed mcp-click-up skill — validate.sh passed, skill_advisor returns confidence 0.95"
    next_safe_action: "Run memory:save to index in continuity DB"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-click-up/SKILL.md"
      - ".opencode/skills/mcp-click-up/scripts/install.sh"
      - ".opencode/skills/mcp-click-up/references/cupt_commands.md"
      - ".opencode/skills/mcp-click-up/references/mcp_tools.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000006"
      session_id: "speckit-124-mcp-click-up"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Which CLI? cupt (Python) — NOT @krodak/clickup-cli"
      - "Which MCP? Official github.com/clickup/clickup-mcp-server"
      - "Routing model? Operation-based (cupt=daily ops, MCP=advanced)"
      - "Install writes to config? No — stdout only"
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary | v2.2 -->

# Implementation Summary: mcp-click-up Skill

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `.opencode/specs/skilled-agent-orchestration/124-mcp-click-up-task-management` |
| **Skill Created** | `.opencode/skills/mcp-click-up/` |
| **Level** | 3 |
| **Status** | Complete |
| **Date** | 2026-05-31 |
| **validate.sh** | PASSED (0 errors, 0 warnings) |
| **skill_advisor.py** | mcp-click-up — confidence 0.95 |

<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The `mcp-click-up` skill gives AI agents a structured, safe interface to ClickUp. Unlike ad-hoc tool usage, this skill provides:

1. **Operation-based routing** — 14 operations mapped to the correct tool (cupt for daily ops, official MCP for advanced features)
2. **Embedded install** — `scripts/install.sh` handles cupt installation via pipx/pip and prints official MCP config snippet
3. **Agent invariants** — SKILL.md Section 4 enforces: no hardcoded status names, dry-run before batch, --json for programmatic output, empty-queue is valid
4. **Complete reference suite** — 3 reference files covering cupt commands, 46 MCP tools, and troubleshooting

**Files created (18 in skill, 9 in spec folder):**

| Path | Purpose |
|------|---------|
| `.opencode/skills/mcp-click-up/SKILL.md` | Core: 8 sections + routing pseudocode + operation table |
| `.opencode/skills/mcp-click-up/README.md` | Public overview + quick start + CLI vs MCP table |
| `.opencode/skills/mcp-click-up/INSTALL_GUIDE.md` | AI-first install block + validation gates |
| `.opencode/skills/mcp-click-up/graph-metadata.json` | Skill graph registration (18 intent signals) |
| `.opencode/skills/mcp-click-up/scripts/install.sh` | cupt install (pipx→pip) + MCP config snippet |
| `.opencode/skills/mcp-click-up/references/cupt_commands.md` | Full cupt reference + agent patterns |
| `.opencode/skills/mcp-click-up/references/mcp_tools.md` | 46 official MCP tools + call_tool_chain invocation |
| `.opencode/skills/mcp-click-up/references/troubleshooting.md` | Auth, status, team filter, MCP errors |
| `.opencode/skills/mcp-click-up/examples/task-queue-workflow.sh` | Tagged queue processing workflow |
| `.opencode/skills/mcp-click-up/examples/time-tracking-workflow.sh` | Timer management workflow |
| `.opencode/skills/mcp-click-up/manual_testing_playbook/` | 5 phases, 16 test files |
| `.opencode/skills/mcp-click-up/changelog/v1.0.0.0.md` | Initial release notes |

<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

1. **Planning** — Sequential thinking used to design operation-based routing (vs availability-based like mcp-chrome-devtools). Three ADRs captured in decision-record.md.
2. **Scaffolding** — `create.sh --level 3 --number 124` scaffolded spec docs; templates moved to correct `.opencode/specs/` location.
3. **Spec docs** — spec.md, plan.md, tasks.md, checklist.md, decision-record.md all written using Level 3 templates with full anchor coverage.
4. **Skill files** — All 18 skill files created in order: core (SKILL.md, install.sh, graph-metadata.json), references (3 files), examples (3 files), playbook (16 files), changelog.
5. **Validation** — validate.sh passed (0 errors, 0 warnings). skill_advisor.py returns confidence 0.95. shellcheck passes on install.sh.

<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Primary CLI | cupt (Python, `pipx install cupt`) | Agent-focused: dry-run, --offline, --json, bundled SKILL.md |
| Secondary | Official ClickUp MCP (github.com/clickup/clickup-mcp-server) | Official, 46 tools, stable API |
| Routing model | Operation-based | cupt and MCP cover different surfaces (not interchangeable) |
| Install | pipx preferred, pip fallback | Isolation without system contamination |
| MCP config | Print snippet to stdout only | Never auto-modify opencode.json |

See `decision-record.md` for full ADRs.

<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result | Evidence |
|-------|--------|---------|
| `validate.sh --strict` | PASSED (exit 0) | 0 errors, 0 warnings across all 6 spec docs |
| `skill_advisor.py "clickup task management"` | mcp-click-up, confidence 0.95 | skill-graph.json compiled successfully (22 skills) |
| `shellcheck install.sh` | PASSED (exit 0) | No errors after removing unused CUPT_MIN_VERSION |
| Skill in registry | YES | mcp-click-up appears in skill list with correct description |
| All P0 checklist items | PASSED | CHK-001 through CHK-031 verified with evidence |
| All P1 checklist items | PASSED | CHK-014 through CHK-042 verified with evidence |

<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- **cupt team filter performance** — Client-side filter is slow on large workspaces (5-20s). Documented in references/cupt_commands.md and troubleshooting.md.
- **cupt community tool** — Not maintained by ClickUp officially. Future versions may break. Version not pinned in install.sh (installs latest); pin if stability required.
- **MCP requires Node.js/npx** — Not auto-installed by install.sh. User must have Node.js installed separately.
- **Official MCP config** — User must manually add config snippet to opencode.json; install.sh prints but does not apply it.

<!-- /ANCHOR:limitations -->
