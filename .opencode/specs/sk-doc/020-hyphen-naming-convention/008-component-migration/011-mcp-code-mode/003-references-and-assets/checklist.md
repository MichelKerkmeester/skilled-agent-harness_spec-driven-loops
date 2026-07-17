---
title: "Checklist: mcp-code-mode references and assets (032 component 011 phase 003)"
description: "Blocking SOL verifier contract for the four reference/asset renames and active link closure."
trigger_phrases:
  - "mcp-code-mode references assets checklist"
  - "mcp-code-mode phase 003 checklist"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/011-mcp-code-mode/003-references-and-assets"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/011-mcp-code-mode/003-references-and-assets"
    last_updated_at: "2026-07-14T16:30:00Z"
    last_updated_by: "codex"
    recent_action: "Authored references-assets verifier contract"
    next_safe_action: "Run the link closure verifier"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: mcp-code-mode references and assets

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for phase 003. The report pins the candidate SHA, BASE SHA, and
rename-map hash, records the four-file map, link-resolution output, stale-hit dispositions, commands, and exit codes,
and fails on a broken active link or an unclassified source-path hit.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Phase 001 package-path closure is present and the four source files are inventoried from the pinned BASE
- [ ] CHK-002 [P2] The BASE SHA, four-entry map hash, and active link inventory are recorded in the candidate report
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-003 [P1] Changes are limited to the four reference/asset paths and active path consumers; no adjacent prose cleanup is included
- [ ] CHK-004 [P0] Tool names, JSON/YAML/TOML keys, frontmatter fields, Python paths, and frozen changelog content are unchanged
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-005 [P0] The exact map is naming_convention.md → naming-convention.md, tool_catalog.md → tool-catalog.md, config_template.md → config-template.md, and env_template.md → env-template.md
- [ ] CHK-006 [P0] Active Markdown links and path values in SKILL.md, README.md, references, assets, and scripts resolve to final paths
- [ ] CHK-007 [P0] Cross-links among the renamed reference and asset files resolve from their new relative locations
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-008 [P1] Strict packet validation and the active link scan report zero broken links
- [ ] CHK-009 [P1] Every stale-source or underscore-bearing hit has a path, identifier, key, Python, generated, or frozen disposition
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-010 [P2] No credentials, environment variable names, tool allowlists, or executable behavior changed beyond path rewriting
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-011 [P2] The phase evidence lists the four final paths and records the preserved non-filesystem and frozen references
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-012 [P1] The four renames and their link updates land in dependency-closed, path-scoped commits
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase is complete when every P0 check passes, all active links resolve, the four-file map matches the tracked
change set, and no unexpected tracked mutation remains after verification.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the SOL verifier confirms the P0 contract and the reference/asset link graph has no active broken edge.
<!-- /ANCHOR:sign-off -->
