---
title: "Tasks: MCP shared dependency startup fix"
description: "Task list for restoring mk_skill_advisor and mk_code_index MCP startup by installing @spec-kit/shared as a local runtime dependency."
trigger_phrases:
  - "mcp startup tasks"
  - "shared dependency task list"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-code-graph/007-code-graph-buildout/001-mcp-shared-dependency-startup-fix"
    last_updated_at: "2026-05-16T10:18:19Z"
    last_updated_by: "main_agent"
    recent_action: "Added doctor and install-guide prevention coverage"
    next_safe_action: "Packet complete; monitor next Codex startup"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0300000000000000000000000000000000000000000000000000000000000003"
      session_id: "030-tasks"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: MCP Shared Dependency Startup Fix

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

- [x] T001 Create Level 2 spec folder (`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-shared-dependency-startup-fix`)
- [x] T002 Capture root-cause evidence from Codex startup logs (`/Users/michelkerkmeester/.codex/log/codex-tui.log`)
- [x] T003 [P] Inventory package manifests and local `node_modules` state (`.opencode/skills/system-skill-advisor`, `.opencode/skills/system-code-graph`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add local `@spec-kit/shared` dependency to skill advisor package (`.opencode/skills/system-skill-advisor/mcp_server/package.json`)
- [x] T005 Add local `@spec-kit/shared` dependency to code graph package (`.opencode/skills/system-code-graph/package.json`)
- [x] T006 Refresh skill advisor package install and lockfile (`.opencode/skills/system-skill-advisor/mcp_server/package-lock.json`)
- [x] T007 Refresh code graph package install and lockfile (`.opencode/skills/system-code-graph/package-lock.json`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Verify local dependency links exist in both package roots
- [x] T009 Run direct import smoke for skill advisor crash site
- [x] T010 Run direct import smoke for code graph crash site
- [x] T011 Run package build/typecheck verification
- [x] T012 Validate spec folder with strict validator
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Prevention Follow-Up

- [x] T013 Add `/doctor:mcp` checks for missing `@spec-kit/shared` links and compiled import failures (`.opencode/commands/doctor/scripts/mcp-doctor.sh`)
- [x] T014 Update doctor install/debug assets with shared dependency health checks and repair actions (`.opencode/commands/doctor/assets/doctor_mcp_install.yaml`, `.opencode/commands/doctor/assets/doctor_mcp_debug.yaml`)
- [x] T015 Update Skill Advisor install guide with shared dependency verification and troubleshooting (`.opencode/skills/system-skill-advisor/INSTALL_GUIDE.md`)
- [x] T016 Update Code Graph install guide to clarify standalone semantics and shared dependency recovery (`.opencode/skills/system-code-graph/INSTALL_GUIDE.md`)
- [x] T017 Verify doctor detects the shared dependency/import probes for both affected MCP servers
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual/runtime verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->
