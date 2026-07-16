---
title: "Implementation Plan: MCP-server consumer rewrites (032 subtree 008 phase 003)"
description: "Renaming the MCP package and its inner directories changes path-valued references across the skill, sibling skills, scripts, manifests, hooks, and documentation. This phase rewrites every consumer and import/config path without renaming exempt Python targets or changing the @spec-kit/mcp-server package identity."
trigger_phrases:
  - "mcp-server consumer rewrites"
  - "mcp_server import references"
  - "system-spec-kit path consumers"
  - "kebab-case phase 003"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/032-hyphen-naming-convention/008-component-migration/008-system-spec-kit"
_memory:
  continuity:
    packet_pointer: "sk-doc/032-hyphen-naming-convention/008-component-migration/008-system-spec-kit/003-mcp-server-consumer-rewrites"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Planned MCP consumer-rewrite execution"
    next_safe_action: "Execute the repository-wide MCP consumer sweep after the tree is stable"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Implementation Plan: MCP-server consumer rewrites

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | .opencode/skills/system-spec-kit (MCP-server consumer rewrites) |
| **Change class** | Repository-wide reference closure |
| **Execution** | Isolated worktree pinned to BASE; planning only |

### Overview
Consume the approved MCP rename map as data. Inventory every active reference, classify whether it is a filesystem path, and rewrite only path-bearing uses. Resolve static and dynamic consumers from the actual target tree, then hand off script-name references to phase 004.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phases 001 and 002 produced stable source-to-target maps.
- [ ] Active and frozen search roots are explicitly listed.
- [ ] The reference checker distinguishes path values from identifiers and historical content.

### Definition of Done
- [ ] All active MCP consumers resolve against the target tree.
- [ ] Dynamic sites have explicit dispositions and no unknown entries.
- [ ] The candidate diff contains no unrelated content or exemption changes.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
- Use one normalized rename map for path segments and semantic directory targets.
- Run exact token discovery first, then syntax/path resolution for code, config, shell, registry, and Markdown consumers.
- Treat frozen content as an evidence class; do not rewrite it, but record old paths as intentionally historical.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Load the phase 001 and 002 maps and collect active, generated, and frozen root boundaries.
- Search .opencode, active skill trees, commands, agents, scripts, manifests, tests, and docs for old and new path tokens.

### Phase 2: Implementation
- Classify every match as filesystem path, identifier/key, historical/frozen, generated, tool-mandated, or unknown.
- Rewrite active path consumers and update dynamic path construction sites with target segments.
- Resolve imports, links, shell sources, config globs, registries, and launcher commands from the renamed tree.

### Phase 3: Verification
- Run static and dynamic reference checks with a nonzero scan assertion.
- Review the disposition ledger for zero unknown entries and compare the active path graph before and after.
- Hand off script references and remaining candidate names to phase 004.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Consumer inventory lists every active old-token match with file, line, class, and disposition. |
| REQ-002 | Run import/require, shell-source, config-path, registry, and Markdown-link resolution against the target tree. |
| REQ-003 | Diff audit proves package names, identifiers, keys, fields, Python targets, and frozen content are unchanged. |
| REQ-004 | Inspect dynamic require/source/path.join/glob entries and require a non-unknown disposition for each. |
| REQ-005 | Re-run the old-script-token search and emit the next-phase handoff list. |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 001 and 002 rename maps | Internal | Required | A consumer rewrite against an unstable map can encode the wrong target. |
| Code and link resolvers | Internal | Required | Text search alone cannot prove runtime resolution. |
| Frozen-history boundary | Policy | Required | Without it, the sweep would corrupt historical evidence. |
| Phase 004 script tree | Internal | Downstream | Script filenames are handled after their current consumers are known. |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

If any consumer cannot be classified, stop before broad rewriting. Revert only the path-scoped consumer commit and retain the inventory/disposition report; never repair an ambiguous match with a global replacement.
<!-- /ANCHOR:rollback -->

