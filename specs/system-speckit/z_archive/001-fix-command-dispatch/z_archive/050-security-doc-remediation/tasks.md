---
title: "Tasks: Security & Documentation Remediation"
description: "Reconstructed task breakdown for the security fixes and documentation updates this packet delivered across the system-spec-kit skill."
trigger_phrases:
  - "security documentation remediation tasks"
  - "system spec kit security fix tasks"
importance_tier: "normal"
contextType: "implementation"
---
> Reconstructed on 2026-10-07 from spec.md and git history. It was not written at the time.

# Tasks: Security & Documentation Remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

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

> Per-task state was not recorded at the time, so every task below is listed pending.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Create the packet and record the audit findings and the documentation gaps it addresses (`spec.md`)
- [ ] T002 Define the security fix priorities and the documentation update list (`spec.md`, `plan.md`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Add path validation for CLI input in `generate-context.js` (`scripts/generate-context.js`)
- [ ] T004 Add path validation for database-stored file paths in the context server (`mcp_server/context-server.js`)
- [ ] T005 Add input length limits to the MCP handler parameters (`mcp_server/context-server.js`)
- [ ] T006 Update embedding dimension references to describe dynamic dimensions (`.opencode/skills/system-spec-kit/README.md`, `SKILL.md`, `mcp_server/README.md`, `.opencode/install_guides/MCP/MCP - Spec Kit Memory.md`)
- [ ] T007 Document the `dryRun` parameter on `memory_delete` (`README.md`, `SKILL.md`, `mcp_server/README.md`)
- [ ] T008 Document the `includeConstitutional` parameter on `memory_index_scan` (`README.md`, `SKILL.md`, `mcp_server/README.md`)
- [ ] T009 Add the folder-naming and frontmatter validation rules to the script inventories (`README.md`, `SKILL.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T010 Verify the security fixes leave `memory_health()` and `memory_search()` working (`plan.md`)
- [ ] T011 Test `generate-context.js` with valid and invalid paths (`scripts/generate-context.js`)
- [ ] T012 Confirm the updated documentation renders correctly and matches the current feature set (`README.md`, `SKILL.md`, `mcp_server/README.md`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All listed security fixes pass verification
- [ ] Existing functionality is unaffected (`memory_search`, `generate-context.js`)
- [ ] Documentation reflects the current feature set
- [ ] No regression in MCP server operation
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
