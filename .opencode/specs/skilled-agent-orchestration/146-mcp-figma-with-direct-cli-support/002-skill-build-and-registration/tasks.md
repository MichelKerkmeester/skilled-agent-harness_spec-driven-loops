---
title: "Tasks: mcp-figma skill build and registration"
description: "Task record for the shipped mcp-figma v0.1.0 build: install figma-ds-cli, the gated command surface, the install and safety scripts, the optional Code Mode MCP, graph registration, and live verify. All tasks complete; deliverable is the skill at .opencode/skills/mcp-figma/."
trigger_phrases:
  - "mcp-figma build tasks"
  - "figma skill registration tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/146-mcp-figma-with-direct-cli-support/002-skill-build-and-registration"
    last_updated_at: "2026-06-14T17:00:00Z"
    last_updated_by: "orchestrate"
    recent_action: "All build, registration, and verification tasks complete"
    next_safe_action: "Operator reviews the record; both phases are complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-151-002-skill-build-and-registration"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: mcp-figma skill build and registration

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

- `[x]` complete · `[ ]` pending
- `[P]` parallelizable
- Evidence in parentheses where applicable.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] Read the phase 001 research ground-truth: CLI surface, MCP landscape, install path
- [x] Read the sibling terminal-control skills as the structural model
- [x] Fix the read-only, mutating, and destructive gating policy
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] Author SKILL.md: install, connect, read, author, export directions, the naming and version traps, version 0.1.0
- [x] [P] Author references/figma_cli_reference.md: the command surface and daemon model
- [x] [P] Author references/tool_surface.md: the read-only, mutating, destructive tiers
- [x] [P] Author references/mcp_wiring.md: the optional Code Mode `figma` MCP
- [x] [P] Author references/troubleshooting.md: failure paths and recovery
- [x] Author the eight install and safety scripts (install, connect-safe, connect-yolo, daemon, doctor, unpatch, print-utcp-snippets, _common)
- [x] Author the feature catalog, the manual testing playbook, the README, the INSTALL_GUIDE, the v0.1.0.0 changelog, and graph-metadata
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] `package_skill.py --check` PASS
- [x] Register the schema-2 skill graph and add the reciprocal sibling edges
- [x] Live-install figma-ds-cli 1.2.0 from the repo build (npm publishes only a minimal 1.0.0)
- [x] Confirm the Code Mode `figma` manual exposes `get_figma_data` and `download_figma_images`
- [x] Voice sweep: no em dashes, no prose semicolons in new prose
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] The skill installs and wires the correct figma-cli (full repo build, never npm `figma-cli`)
- [x] The command surface is mapped with a read-only, mutating, and destructive policy
- [x] The connect modes are safe by default and the yolo patch is reversible
- [x] The optional Code Mode `figma` MCP path is documented
- [x] The package follows the sibling terminal-control structure and is graph-registered
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Deliverable skill: `.opencode/skills/mcp-figma/`
- Changelog: `.opencode/skills/mcp-figma/changelog/v0.1.0.0.md`
- Install scripts: `.opencode/skills/mcp-figma/scripts/`
- Parent: `../spec.md` (151 phase map)
<!-- /ANCHOR:cross-refs -->
