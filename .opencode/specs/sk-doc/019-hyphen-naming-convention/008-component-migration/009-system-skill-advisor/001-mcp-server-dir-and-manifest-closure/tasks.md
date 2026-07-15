---
title: "Tasks: MCP server directory and manifest closure"
description: "Concrete tasks for the system-skill-advisor package-boundary rename, manifest/entrypoint closure, exemption preservation, and runtime verification."
trigger_phrases:
  - "mcp-server closure tasks"
  - "advisor package root tasks"
  - "manifest rename tasks"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/019-hyphen-naming-convention/008-component-migration/009-system-skill-advisor/001-mcp-server-dir-and-manifest-closure"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-hyphen-naming-convention/008-component-migration/009-system-skill-advisor/001-mcp-server-dir-and-manifest-closure"
    last_updated_at: "2026-07-14T18:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored package-boundary tasks"
    next_safe_action: "Begin with the pinned package-boundary inventory"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/mcp_server"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "The package manifest state is recorded before execution; no missing manifest is invented."
---

# Tasks: MCP server directory and manifest closure

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| [ ] | Pending |
| [x] | Completed |
| [P] | Parallelizable |
| [B] | Blocked |

Task format: T### [P?] Description (file path)
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Inventory mcp_server, plugin_bridges, stress_test, test-magic, generated, and Python/package paths
- [ ] T002 Record package manifest, package-lock, CLI manifest, launcher, doctor, and build-config consumers
- [ ] T003 Freeze source-to-target map, collision report, symlink/mode manifest, and BASE discovery counts
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Rename the mcp_server package root to mcp-server
- [ ] T005 Rename ordinary plugin_bridges and stress_test directories to plugin-bridges and stress-test
- [ ] T006 Update TypeScript path construction, build/test configuration, launchers, doctor probes, docs, and bridge paths
- [ ] T007 Preserve package-lock.json, generated dist/node_modules, Python names, and test-magic names under their contracts
- [ ] T008 Rebuild generated output through the package workflow after source paths are stable
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 Verify one physical package root and zero stale live mcp_server path consumers
- [ ] T010 Run typecheck/build, launcher/doctor smoke, plugin bridge smoke, and stress-test discovery
- [ ] T011 Compare file, symlink, executable-bit, test, and discovery counts to BASE
- [ ] T012 Record the package map and handoff evidence for the scripts phase
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked [x]
- [ ] No [B] blocked tasks remain
- [ ] Every requirement in spec.md has pinned evidence
- [ ] The phase checklist is fully satisfied by the central verifier
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See spec.md
- **Plan**: See plan.md
- **Checklist**: See checklist.md
- **Decision record**: See decision-record.md
<!-- /ANCHOR:cross-refs -->
