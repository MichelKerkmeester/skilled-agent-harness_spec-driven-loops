---
title: "Feature Specification: MCP-server consumer rewrites (017 subtree 008 phase 003)"
description: "Renaming the MCP package and its inner directories changes path-valued references across the skill, sibling skills, scripts, manifests, hooks, and documentation. This phase rewrites every consumer and import/config path without renaming exempt Python targets or changing the @spec-kit/mcp-server package identity."
trigger_phrases:
  - "mcp-server consumer rewrites"
  - "mcp_server import references"
  - "system-spec-kit path consumers"
  - "kebab-case phase 003"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/008-component-migration/008-system-spec-kit"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/008-component-migration/008-system-spec-kit/003-mcp-server-consumer-rewrites"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored MCP consumer-rewrite docs"
    next_safe_action: "Execute the repository-wide MCP consumer sweep after the tree is stable"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: MCP-server consumer rewrites

> Phase adjacency under the 008 system-spec-kit subtree (grouping order, not a runtime dependency): predecessor 002-mcp-server-inner-dirs; successor 004-scripts-tree.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/017-hyphen-naming-convention/008-component-migration/008-system-spec-kit/003-mcp-server-consumer-rewrites |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Owner skill** | system-spec-kit |
| **Origin** | Phase 003 of the 008 system-spec-kit component migration under the 017 kebab-case program |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The MCP paths are consumed beyond their defining package. A search shows mcp_server references in the system-spec-kit skill and changelog prose, scripts and package metadata, and sibling runtime surfaces. If only the defining directories are renamed, callers retain broken imports, commands, configuration values, and links.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Sweep all active repository consumers of mcp_server, matrix_runners, plugin_bridges, stress_test, __helpers__, _support, and __fixtures__ path segments after phases 001 and 002.
- Rewrite filesystem path values, import and require specifiers, shell source paths, registry entries, config globs, Markdown links, and launcher commands to semantic kebab targets.
- Include system-spec-kit, sibling skills, .opencode commands, agents, hooks, scripts, manifests, tests, and active documentation; exclude frozen history and changelog content except for a disposition record.
- Preserve the @spec-kit/mcp-server package name, code identifiers, JSON/YAML/TOML keys, frontmatter fields, .py files, Python package directories, and tool-mandated filenames.

### Out of Scope
- Any additional filesystem rename; phase 003 rewrites consumers for the already-approved map.
- Feature-catalog or manual-playbook root renames, which belong to phases 008 and 009.
- Historical changelog and completed-history surfaces that the program explicitly freezes.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every active MCP path consumer is found and classified. | The inventory covers code, config, shell, registry, tests, links, and launchers with no zero-scan or unknown disposition. |
| REQ-002 | All path-valued consumers use renamed targets. | A whole-repository reference sweep resolves imports, requires, shell sources, globs, registry entries, and Markdown links. |
| REQ-003 | Non-path tokens remain stable. | Package names, identifiers, object keys, frontmatter fields, and historical content are not rewritten as filesystem paths. |
| REQ-004 | Dynamic consumers are dispositioned. | Every dynamic require, source, path.join, glob, or generated path resolves in the target tree or has a documented exemption. |
| REQ-005 | The consumer closure is ready for script-tree renames. | The report identifies remaining script path consumers for phase 004 without leaving broken MCP references. |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: No active consumer resolves an old MCP filesystem path.
- **SC-002**: The reference sweep reports zero broken path-valued imports, links, globs, registry entries, or shell sources.
- **SC-003**: The package identity and all exemption boundaries remain unchanged.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

A literal search can over-match identifiers and historical prose, while a path-only parser can miss dynamic path construction. The plan combines token discovery with resolver checks and a disposition ledger. Frozen changelogs and completed history remain readable evidence, not rewrite targets.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

No blocking questions. The execution report must state search roots and the frozen/exempt exclusions used by the consumer sweep.
<!-- /ANCHOR:questions -->

