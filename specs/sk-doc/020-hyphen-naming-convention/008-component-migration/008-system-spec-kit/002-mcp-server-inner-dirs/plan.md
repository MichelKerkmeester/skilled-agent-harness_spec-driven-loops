---
title: "Implementation Plan: MCP-server inner directories (020 subtree 008 phase 002)"
description: "The MCP server contains non-Python directories whose names still use underscores, including runtime, bridge, stress, and test-support paths. They need semantic targets and intra-tree reference updates; leading and doubled underscores must never be converted mechanically."
trigger_phrases:
  - "mcp-server inner directories"
  - "matrix_runners rename"
  - "plugin_bridges rename"
  - "stress_test rename"
  - "kebab-case phase 002"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/008-system-spec-kit"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/008-system-spec-kit/002-mcp-server-inner-dirs"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Planned MCP inner-directory execution"
    next_safe_action: "Execute the semantic inner-directory map on the renamed package root"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Implementation Plan: MCP-server inner directories

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | .opencode/skills/system-spec-kit (MCP-server inner directories) |
| **Change class** | Directory rename and intra-tree reference closure |
| **Execution** | Isolated worktree pinned to BASE; planning only |

### Overview
Rename only directories with an explicit semantic map, then rewrite the references that define compilation, test discovery, runtime stress commands, and documentation links. The map must distinguish ordinary support names from test-runner magic and Python package directories.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase 001 established mcp-server as the live package root.
- [ ] The six inner-directory candidates and their source references are inventoried.
- [ ] Vitest and TypeScript discovery contracts are captured before any directory move.

### Definition of Done
- [ ] All permitted inner directories use semantic kebab targets.
- [ ] All intra-tree globs and links resolve, including test support setup and stress paths.
- [ ] Exempt Python and tool-mandated names have an evidence-backed disposition.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
- Use a semantic directory map: matrix_runners -> matrix-runners, plugin_bridges -> plugin-bridges, stress_test -> stress-test, __helpers__ -> helpers, _support -> support, and __fixtures__ -> fixtures.
- Apply the map to path segments only; never alter identifiers, frontmatter fields, object keys, or Python import paths.
- Verify the target tree through TypeScript includes, Vitest setup/discovery, npm scripts, and Markdown link resolution.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Read the phase 001 handoff and enumerate the post-root paths under mcp-server.
- Inspect vitest.config.ts, vitest.stress.config.ts, tsconfig.json, package.json, and test README files for discovery contracts.

### Phase 2: Implementation
- Classify each inner directory as rename, Python/package exempt, test-magic preserved, or other explicit disposition.
- Move permitted directories with semantic targets and rewrite all intra-tree references in the same batch.
- Update test setup paths, stress globs, bridge links, and tree diagrams without changing code identifiers.

### Phase 3: Verification
- Run a path-resolution and test-discovery audit against new directory names.
- Compare discovered suite and fixture counts with the phase 000 baseline where the baseline covers this surface.
- Emit the unresolved old-path disposition ledger for phase 003.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Review the source-to-target map; assert no target begins with a mechanically produced leading or doubled hyphen. |
| REQ-002 | Parse tsconfig and Vitest config paths and resolve every updated glob and setup file. |
| REQ-003 | Compare changed directories with the Python, package, and test-magic exemption inventory. |
| REQ-004 | Run default and stress discovery checks and compare intended suite counts. |
| REQ-005 | Review the old-token disposition ledger and require zero unclassified paths. |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 001 root closure | Internal | Required | Inner references cannot be interpreted until mcp-server is the package root. |
| Vitest and TypeScript discovery configs | Internal | Required | Stale globs can silently drop tests. |
| Phase 003 consumer rewrite | Internal | Downstream | External consumers are intentionally handled after the inner tree is stable. |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Abort before the move if discovery contracts are unclear or a target collides. Revert the directory rename batch and its path rewrites together; do not leave a mixed old/new tree or a half-updated test configuration.
<!-- /ANCHOR:rollback -->
