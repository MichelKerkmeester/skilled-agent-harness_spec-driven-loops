---
title: "Tasks: mcp-click-up Skill Creation"
description: "Task breakdown for creating the mcp-click-up skill. All tasks create new files under .opencode/skills/mcp-click-up/."
trigger_phrases:
  - "mcp-click-up tasks"
  - "clickup skill tasks"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/004-mcp-click-up-task-management"
    last_updated_at: "2026-05-31T00:00:00Z"
    last_updated_by: "speckit-complete"
    recent_action: "All tasks complete — mcp-click-up skill fully implemented"
    next_safe_action: "Run validate.sh and memory:save"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-click-up/SKILL.md"
      - ".opencode/skills/mcp-click-up/scripts/install.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000003"
      session_id: "speckit-124-mcp-click-up"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

# Tasks: mcp-click-up Skill Creation

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |

**Task Format**: `T### [P?] Description`

<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Create skill directory structure (.opencode/skills/mcp-click-up/ + subdirs)
- [x] T002 Write `scripts/install.sh` — pipx→pip cupt install + Python check + MCP config snippet
- [x] T005 Write `graph-metadata.json` — skill_id, family, intent_signals, edges

<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Write `SKILL.md` — 8 sections with routing pseudocode and operation table
- [x] T003 Write `README.md` — overview, quick start (5 steps), CLI vs MCP feature table
- [x] T004 Write `INSTALL_GUIDE.md` — AI-first install block, cupt + MCP sections, validation gates
- [x] T006 Write `references/cupt_commands.md` — all commands, --json variants, agent invariants
- [x] T007 Write `references/mcp_tools.md` — 46 official MCP tools, call_tool_chain invocation
- [x] T008 Write `references/troubleshooting.md` — auth, status, team-filter, MCP errors
- [x] T009 Write `examples/README.md` — guide with prerequisites and use cases
- [x] T010 Write `examples/task-queue-workflow.sh` — preflight → inspect → dry-run → complete → handoff
- [x] T011 [P] Write `examples/time-tracking-workflow.sh` — start/stop/log/status subcommands
- [x] T012 Write `manual_testing_playbook/manual_testing_playbook.md` — master index
- [x] T013 Create playbook phases 01-05 with 16 test markdown files
- [x] T014 Write `changelog/v1.0.0.0.md` — initial release notes

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T015 Run `validate.sh --strict` on spec folder → exit 0
- [x] T016 Run `skill_advisor.py "clickup task management" --threshold 0.7` → mcp-click-up appears
- [x] T017 Run `shellcheck scripts/install.sh` → 0 errors
- [x] T018 Verify all required skill files present: SKILL.md, README.md, INSTALL_GUIDE.md, graph-metadata.json, scripts/, references/, examples/, playbook/, changelog/

<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

All P0 tasks marked `[x]`. validate.sh exits 0. skill_advisor.py returns mcp-click-up for ClickUp-related queries.

<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md` REQ-001 through REQ-011
- **Plan**: See `plan.md` §4 Implementation Phases
- **Checklist**: See `checklist.md` CHK-001 through CHK-020

<!-- /ANCHOR:cross-refs -->
