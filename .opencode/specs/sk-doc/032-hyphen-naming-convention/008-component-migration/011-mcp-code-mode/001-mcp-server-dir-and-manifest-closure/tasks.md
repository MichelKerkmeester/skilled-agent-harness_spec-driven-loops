---
title: "Tasks: mcp-server directory and manifest closure (032 component 011 phase 001)"
description: "Tasks for the semantic mcp_server to mcp-server directory rename and its package, installer, diagnostic, metadata, and entrypoint reference closure."
trigger_phrases:
  - "mcp-server closure tasks"
  - "mcp-code-mode phase 001 tasks"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/032-hyphen-naming-convention/008-component-migration/011-mcp-code-mode/001-mcp-server-dir-and-manifest-closure"
_memory:
  continuity:
    packet_pointer: "sk-doc/032-hyphen-naming-convention/008-component-migration/011-mcp-code-mode/001-mcp-server-dir-and-manifest-closure"
    last_updated_at: "2026-07-14T16:30:00Z"
    last_updated_by: "codex"
    recent_action: "Authored mcp-server closure tasks"
    next_safe_action: "Inventory package path consumers"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: mcp-server directory and manifest closure

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
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Record the pinned BASE and inventory every filesystem name beneath mcp_server
- [ ] T002 [P] Inventory active mcp_server path consumers and classify frozen, generated, identifier, and path-value hits
- [ ] T003 Confirm the preservation ledger for package-lock.json, tsconfig.json, .nvmrc, Python paths, and package identifiers
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Apply the semantic mcp_server → mcp-server directory rename
- [ ] T005 Update install.sh, doctor.sh, INSTALL_GUIDE.md, graph metadata, configured commands, package working directories, and dist/index.js path values
- [ ] T006 [P] Verify that package-lock.json and other tool-mandated names remain unchanged
- [ ] T007 Reconcile the active consumer inventory with the final path map
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Verify the active tree has no stale mcp_server path segment
- [ ] T009 Verify the package root, npm install directory, diagnostic MCP_DIR, configured command, and dist/index.js all resolve under mcp-server
- [ ] T010 Verify syntax, reference, exemption, and collision checks and record their exit codes
- [ ] T011 Pin the candidate SHA, BASE SHA, rename-map hash, and consumer inventory in the phase evidence
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks complete
- [ ] All requirements in spec.md met with evidence
- [ ] Phase gate green (validate/build/test/link as applicable)
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See spec.md
- **Plan**: See plan.md
<!-- /ANCHOR:cross-refs -->
