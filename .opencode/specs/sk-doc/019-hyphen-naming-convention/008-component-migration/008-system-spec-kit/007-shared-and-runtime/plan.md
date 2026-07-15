---
title: "Implementation Plan: Shared and runtime (017 subtree 008 phase 007)"
description: "The shared/runtime part of system-spec-kit contains an underscore-bearing shared/mcp_server directory even though its TypeScript/shared-package surface can use kebab-case. This phase verifies the runtime tree, renames the permitted shared directory, updates its references, and preserves package manifests, tool names, generated databases, and Python package directories."
trigger_phrases:
  - "system-spec-kit shared runtime"
  - "shared/mcp_server rename"
  - "runtime path cleanup"
  - "kebab-case phase 007"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/019-hyphen-naming-convention/008-component-migration/008-system-spec-kit"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-hyphen-naming-convention/008-component-migration/008-system-spec-kit/007-shared-and-runtime"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Planned shared-runtime execution"
    next_safe_action: "Execute the shared/mcp-server path closure after reference assets are stable"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Implementation Plan: Shared and runtime

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | .opencode/skills/system-spec-kit (Shared and runtime) |
| **Change class** | Shared/runtime directory closure |
| **Execution** | Isolated worktree pinned to BASE; planning only |

### Overview
Treat shared/mcp_server as a single path closure, with a zero-candidate runtime audit alongside it. Update only active path references and preserve the database subtree and exact tool-facing names.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase 006 link and asset closure is stable.
- [ ] The shared and runtime candidate inventory is captured with file types and package/data dispositions.
- [ ] Database and generated artifact preservation rules are explicit.

### Definition of Done
- [ ] The shared directory is renamed only if policy permits.
- [ ] All active references resolve and database bytes/modes are preserved.
- [ ] Runtime has a recorded zero-candidate or complete semantic map.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
- Use shared/mcp_server -> shared/mcp-server as the only observed semantic map entry.
- Treat the database contents as payload, not rename input; preserve locks, modes, and bytes.
- Use a full basename scan over shared and runtime to prove no other permitted candidate is missed.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Inventory shared and runtime directories/files and inspect package references and database paths.
- Record whether shared/mcp_server has Python package markers or generated ownership.

### Phase 2: Implementation
- Create the shared/runtime map and exemption ledger.
- Rename shared/mcp_server if permitted and update active path references.
- Verify database subtree preservation without changing its contents.

### Phase 3: Verification
- Run shared/runtime path and import resolution.
- Compare database files, modes, and symlink metadata before and after.
- Emit a zero-candidate runtime report or complete remaining map for phase 012.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Inventory report identifies shared/mcp_server and proves the complete runtime result. |
| REQ-002 | Map and changed-path audit show shared/mcp_server -> shared/mcp-server only when permitted. |
| REQ-003 | Resolve shared/runtime imports, config paths, database paths, and links. |
| REQ-004 | Compare manifests, tool names, Python targets, generated files, keys, and database bytes/modes. |
| REQ-005 | Review handoff report and old-path disposition. |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 006 references/assets | Internal | Required | Shared/runtime links may include renamed reference paths. |
| Database preservation contract | Internal | Required | A directory move must not mutate database payload. |
| Phase 008 feature catalog | Internal | Downstream | Catalog migration starts after shared/runtime is stable. |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Stop if package ownership or database preservation is ambiguous. Revert the directory and pointer move together; never recover a failed path move by recreating or editing database files.
<!-- /ANCHOR:rollback -->

