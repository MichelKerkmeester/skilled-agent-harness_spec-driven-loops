---
title: "Tasks: MCP-server directory and manifest closure (032 subtree 008 phase 001)"
description: "The system-spec-kit workspace still exposes mcp_server as a filesystem path even though kebab-case is canonical. The package workspace, lockfile links, package scripts, and entrypoint references must move as one path closure while manifest filenames, package names, Python files, and Python package directories remain exempt."
trigger_phrases:
  - "mcp-server directory closure"
  - "system-spec-kit mcp server manifest"
  - "mcp_server to mcp-server"
  - "kebab-case phase 001"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/032-hyphen-naming-convention/008-component-migration/008-system-spec-kit"
_memory:
  continuity:
    packet_pointer: "sk-doc/032-hyphen-naming-convention/008-component-migration/008-system-spec-kit/001-mcp-server-dir-and-manifest-closure"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Planned mcp-server closure tasks"
    next_safe_action: "Execute the root closure on the pinned baseline"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Tasks: MCP-server directory and manifest closure

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Confirm the pinned baseline and enumerate the package manifest closure.
- [ ] T002 Record the mcp_server -> mcp-server map and its exemption dispositions.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Rename the MCP package root with the semantic map.
- [ ] T004 Rewrite workspace, lockfile, package-script, and entrypoint path values.
- [ ] T005 Preserve manifest filenames, package names, Python targets, and code/data identifiers.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T006 Verify: The root map is collision-free and bijective — evidence: rename-map report and changed-path manifest.
- [ ] T007 Verify: The workspace and lockfile resolve the renamed package — evidence: parsed metadata and central clean-install check.
- [ ] T008 Verify: All entrypoints remain addressable — evidence: package script and dist-path checks.
- [ ] T009 Verify: No exemption was renamed — evidence: exemption diff audit.
- [ ] T010 Verify: The phase handoff is complete — evidence: map hash, candidate SHA, and verifier report.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks complete
- [ ] All requirements in spec.md met with evidence
- [ ] Phase gate green in the central validation worktree
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Decision record**: See `decision-record.md`
<!-- /ANCHOR:cross-refs -->
