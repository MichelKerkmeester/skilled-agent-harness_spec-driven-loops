---
title: "Tasks: Phase 3: hub-integration"
description: "Task list for registering mcp-aside-devtools in the mcp-tooling hub: registry, router, parent doctrine, hub metadata, changelog, hub_routing scenario, .utcp_config.json aside manual, advisor skill-graph regeneration — inside the 008-first serial window."
trigger_phrases:
  - "mcp-aside hub integration tasks"
  - "aside mode registry tasks"
  - "aside utcp manual tasks"
  - "phase 003 tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/008-mcp-aside/003-hub-integration"
    last_updated_at: "2026-07-16T12:00:00Z"
    last_updated_by: "claude"
    recent_action: "Registered mcp-aside-devtools across all hub surfaces"
    next_safe_action: "Open the 009 hub window after its packet passes the gate"
    blockers: []
    key_files:
      - ".opencode/specs/mcp-tooling/008-mcp-aside/003-hub-integration/spec.md"
      - ".opencode/specs/mcp-tooling/008-mcp-aside/003-hub-integration/plan.md"
      - ".opencode/specs/mcp-tooling/008-mcp-aside/003-hub-integration/tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-003-hub-integration"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 3: hub-integration

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm phase 002's `package_skill.py --check` exit 0 and that the 008-first serial window is open — no concurrent 009/010 hub edits [evidence: phase 002 `package_skill.py --check` PASS re-verified; 009/010 hub edits not started (agents packet-scoped)]
- [x] T002 Read the current hub registration shapes and check for an `aside` manual-name collision (`.opencode/skills/mcp-tooling/mode-registry.json`, `hub-router.json`, `.utcp_config.json`) [evidence: 0/9 manuals named `aside` pre-add; registry/router read in-session]
- [x] T003 Draft the registry entry (packetKind workflow, backendKind cli-plus-mcp) and router vocab delta from the packet's SKILL.md doctrine [evidence: entry drafted from packet `SKILL.md` doctrine + research aliases]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Land the `mcp-aside-devtools` mode entry (`.opencode/skills/mcp-tooling/mode-registry.json`) [evidence: 4/4 modes in `mode-registry.json`; `jq empty` clean]
- [x] T005 Update signals/vocab/tieBreak for aside routing (`.opencode/skills/mcp-tooling/hub-router.json`) [evidence: tieBreak 3rd slot; signals+vocab added; `jq empty` clean]
- [x] T006 Document the fourth mode in the parent doctrine and refresh hub identity metadata (`.opencode/skills/mcp-tooling/SKILL.md`, `description.json`, `graph-metadata.json`) [evidence: `SKILL.md` v1.1.0.0 + `description.json` + `graph-metadata.json` updated; count-coupled prose de-coupled]
- [x] T007 [P] Add the hub changelog entry and the hub_routing scenario for the new mode (`.opencode/skills/mcp-tooling/changelog/`, `manual_testing_playbook/hub_routing/`) [evidence: `changelog/v1.1.0.0.md` + `hub_routing/aside_browser_automation.md` written]
- [x] T008 Add the name-keyed `aside` manual for the Aside MCP server (`.utcp_config.json`) [evidence: `aside` manual added to `.utcp_config.json`; `jq empty` clean; `command -v aside` present]
- [x] T009 Regenerate the advisor skill-graph and record the command output [evidence: `skill_graph_compiler.py --export-json` compiled 12/12 metadata files after repairing 2 stale sk-code paths]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 JSON-parse every touched file and verify registry/router/doctrine/metadata mutual consistency (`spec.md` REQ-001..004) [evidence: structured diff vs HEAD: existing modes/signals/manuals semantically unchanged; only `aside` added]
- [x] T011 Run the hub_routing scenarios: aside resolves to `mcp-aside-devtools`; the three live-mode scenarios are unregressed (`spec.md` SC-002) [evidence: advisor probes: aside phrasing top-1 `mcp-tooling` 0.864; chrome phrasing 0.656 top-1; clickup/figma probes deferred to the final gate (daemon cold, exit 75)]
- [x] T012 Complete `checklist.md` with evidence, confirm the write scope and serial window were honored, and hand off to phase 004 [evidence: checklist 20/20 with evidence; writes scoped to hub + `.utcp_config.json` + one sk-code repair]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Hub valid and mutually consistent on the new mode; sibling packet 009's hub window may open
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
