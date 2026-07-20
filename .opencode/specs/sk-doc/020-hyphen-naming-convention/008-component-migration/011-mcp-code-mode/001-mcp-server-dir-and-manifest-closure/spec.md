---
title: "Feature Specification: mcp-server directory and manifest closure (020 component 011 phase 001)"
description: "The skill stores its embedded Node MCP server under mcp_server, and installers, diagnostics, guides, and generated metadata refer to that path. This phase moves the permitted directory name to mcp-server while preserving package-lock.json, tool-mandated filenames, package metadata, and the dist/index.js entrypoint."
trigger_phrases:
  - "mcp-server directory closure"
  - "mcp-code-mode phase 001"
  - "mcp_server kebab-case"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/011-mcp-code-mode"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/011-mcp-code-mode/001-mcp-server-dir-and-manifest-closure"
    last_updated_at: "2026-07-14T16:30:00Z"
    last_updated_by: "codex"
    recent_action: "Authored mcp-server closure docs"
    next_safe_action: "Execute the directory closure after the baseline is pinned"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr_rules.md -->

# Feature Specification: mcp-server directory and manifest closure
> Phase adjacency — successor `002-scripts`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/020-hyphen-naming-convention/008-component-migration/011-mcp-code-mode/001-mcp-server-dir-and-manifest-closure |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Owner skill** | sk-doc |
| **Origin** | Phase 001 of the 020 mcp-code-mode component migration |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The embedded Node package lives at .opencode/skills/mcp-code-mode/mcp_server, while scripts and installation guidance construct that path directly. Renaming the directory without its launchers and package-path consumers would leave npm installation, diagnostics, and the dist/index.js entrypoint broken.

This phase performs the single permitted directory rename to mcp-server and updates its active path consumers as one dependency-closed closure. The package-lock.json, tsconfig.json, .nvmrc, index.ts, and check-node.cjs names remain unchanged.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The directory .opencode/skills/mcp-code-mode/mcp_server/ and its target .opencode/skills/mcp-code-mode/mcp-server/.
- The package layout beneath that directory: package-lock.json, tsconfig.json, .nvmrc, README.md, index.ts, scripts/check-node.cjs, and any manifest present at execution time.
- Active path-valued references in scripts/install.sh, scripts/doctor.sh, INSTALL_GUIDE.md, graph-metadata.json, and any additional consumer found by the phase-wide reference scan.
- The install, diagnostic, and entrypoint paths that must resolve to mcp-server/dist/index.js.

### Out of Scope
- Python .py filenames and Python import-package directories, including scripts/validate_config.py.
- Renaming package-lock.json, tsconfig.json, .nvmrc, or other tool-mandated names; rewriting lockfile/generated contents; or changing package identifiers and code identifiers.
- Frozen changelog history, the references/assets tree, the runtime tree, the manual-testing tree, and any migration execution during this authoring pass.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The live package directory is classified against the program exemption boundary | The census records mcp_server as the one permitted rename candidate in this package subtree and records all Python, lockfile, and tool-mandated names as exempt |
| REQ-002 | The directory rename is semantic and collision-safe | The rename map contains exactly mcp_server → mcp-server, with no casefold/NFC collision and no second physical package root |
| REQ-003 | All active package-path consumers move with the directory | A repository reference scan finds no stale mcp_server path outside frozen history or an explicitly documented non-path identifier |
| REQ-004 | The manifest and entrypoint closure remains coherent | The package root, npm install working directory, diagnostic MCP_DIR, configured command, and dist/index.js path all resolve under mcp-server |
| REQ-005 | Exempt filesystem names and package semantics are preserved | package-lock.json, tsconfig.json, .nvmrc, index.ts, scripts/check-node.cjs, package identifiers, and Python paths are not renamed or semantically rewritten |
| REQ-006 | The phase leaves evidence for the next component phase | The candidate report records the path map, consumer inventory, validation commands, and the preserved exemption list |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The embedded server is addressed only through mcp-server in active path references, with its package and dist entrypoint closure intact.
- **SC-002**: The package subtree has no unclassified filesystem name and no altered Python, lockfile, tool-mandated, or identifier contract.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

The primary risk is a split closure: install.sh and doctor.sh can pass different directory strings from the configured MCP command. The phase depends on the 020 baseline, semantic rename map, and reference checker; phase 002 must consume the resulting path state without changing this package closure.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking. At setup, confirm whether a package.json is intentionally absent from the tracked tree while graph metadata names it; do not create or infer a manifest during this documentation pass.
<!-- /ANCHOR:questions -->
