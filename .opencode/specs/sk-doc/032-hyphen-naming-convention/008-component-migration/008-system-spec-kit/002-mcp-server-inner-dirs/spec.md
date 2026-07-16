---
title: "Feature Specification: MCP-server inner directories (032 subtree 008 phase 002)"
description: "The MCP server contains non-Python directories whose names still use underscores, including runtime, bridge, stress, and test-support paths. They need semantic targets and intra-tree reference updates; leading and doubled underscores must never be converted mechanically."
trigger_phrases:
  - "mcp-server inner directories"
  - "matrix_runners rename"
  - "plugin_bridges rename"
  - "stress_test rename"
  - "kebab-case phase 002"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/032-hyphen-naming-convention/008-component-migration/008-system-spec-kit"
_memory:
  continuity:
    packet_pointer: "sk-doc/032-hyphen-naming-convention/008-component-migration/008-system-spec-kit/002-mcp-server-inner-dirs"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored MCP inner-directory docs"
    next_safe_action: "Execute the semantic inner-directory map on the renamed package root"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: MCP-server inner directories

> Phase adjacency under the 008 system-spec-kit subtree (grouping order, not a runtime dependency): predecessor 001-mcp-server-dir-and-manifest-closure; successor 003-mcp-server-consumer-rewrites.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/032-hyphen-naming-convention/008-component-migration/008-system-spec-kit/002-mcp-server-inner-dirs |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Owner skill** | system-spec-kit |
| **Origin** | Phase 002 of the 008 system-spec-kit component migration under the 032 kebab-case program |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

After the package root is renamed, the live MCP tree still contains matrix_runners, plugin_bridges, stress_test, tests/__helpers__, tests/_support, and tests/embedders/__fixtures__. These names are referenced by TypeScript configuration, Vitest setup, README links, and runtime commands, so a character substitution would create invalid names such as --fixtures-- and break discovery.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Rename matrix_runners to matrix-runners, plugin_bridges to plugin-bridges, and stress_test to stress-test under mcp-server.
- Apply semantic targets tests/__helpers__ to tests/helpers, tests/_support to tests/support, and tests/embedders/__fixtures__ to tests/embedders/fixtures when the baseline confirms they are not runner magic names.
- Update intra-tree TypeScript include/exclude globs, Vitest setup paths, README links, stress commands, and bridge references.
- Keep .py files and Python import-package directories exact; preserve explicitly tool-mandated test magic if the verifier proves a runner contract requires the old name.

### Out of Scope
- The mcp_server to mcp-server package-root rename, which phase 001 closes.
- Repository-wide consumers outside the MCP tree, which phase 003 rewrites.
- Script filenames, template/reference files, and catalog/playbook trees owned by later phases.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every non-exempt inner-directory candidate has a semantic source-to-target mapping. | The map records the three runtime directories and each test-support disposition without mechanical leading-hyphen output. |
| REQ-002 | Intra-tree references follow the renamed directories. | tsconfig includes/excludes, vitest setupFiles, npm stress scripts, README links, and relative paths resolve to the targets. |
| REQ-003 | Python and test-runner exemptions are honored explicitly. | Evidence lists every .py/package target and proves any preserved magic directory is a deliberate tool disposition. |
| REQ-004 | Discovery behavior remains stable. | Default and stress Vitest discovery boundaries produce the same intended suites after path updates. |
| REQ-005 | The downstream consumer phase receives a complete disposition ledger. | Every old path token is classified as rewritten, exempt, historical, generated, or tool-mandated. |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The MCP tree has kebab-case inner directory names wherever policy permits a rename.
- **SC-002**: TypeScript, Vitest, stress commands, bridge loading, and documentation links use semantic target paths.
- **SC-003**: No doubled or leading hyphen target is created from a test-support name.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

Test support directories can be convention-sensitive even when they are not formal runner magic names. The phase must inspect vitest.config.ts and discovery configuration before deciding whether a support directory can move. Python benchmark directories and files remain exempt, and the verifier must not infer exemption from a name alone.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

No blocking questions. The only execution-time decision is whether a specific test-support directory is tool-mandated; the verifier must record evidence rather than guess.
<!-- /ANCHOR:questions -->
