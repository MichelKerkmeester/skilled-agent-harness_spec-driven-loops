---
title: "Feature Specification: Shared and runtime (032 subtree 008 phase 007)"
description: "The shared/runtime part of system-spec-kit contains an underscore-bearing shared/mcp_server directory even though its TypeScript/shared-package surface can use kebab-case. This phase verifies the runtime tree, renames the permitted shared directory, updates its references, and preserves package manifests, tool names, generated databases, and Python package directories."
trigger_phrases:
  - "system-spec-kit shared runtime"
  - "shared/mcp_server rename"
  - "runtime path cleanup"
  - "kebab-case phase 007"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/032-hyphen-naming-convention/008-component-migration/008-system-spec-kit"
_memory:
  continuity:
    packet_pointer: "sk-doc/032-hyphen-naming-convention/008-component-migration/008-system-spec-kit/007-shared-and-runtime"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored shared-runtime docs"
    next_safe_action: "Execute the shared/mcp-server path closure after reference assets are stable"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: Shared and runtime

> Phase adjacency under the 008 system-spec-kit subtree (grouping order, not a runtime dependency): predecessor 006-references-and-assets; successor 008-feature-catalog.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/032-hyphen-naming-convention/008-component-migration/008-system-spec-kit/007-shared-and-runtime |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Owner skill** | system-spec-kit |
| **Origin** | Phase 007 of the 008 system-spec-kit component migration under the 032 kebab-case program |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The live shared tree contains shared/mcp_server/database, while the runtime tree is already free of underscore-bearing basenames. The shared path is used by package/runtime code and database support files, so leaving it behind would make the final surface inconsistent; renaming unrelated generated data or tool-mandated files would be incorrect.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Rename .opencode/skills/system-spec-kit/shared/mcp_server/ to shared/mcp-server/ if the baseline confirms it is not a Python import package.
- Sweep .opencode/skills/system-spec-kit/runtime/ and shared/ for any additional underscore-bearing filesystem names and classify the result.
- Update shared-package, runtime, database, config, README, and path-valued references to the renamed directory.
- Preserve SKILL.md, mode-registry.json where present, package manifests, tsconfig files, Python .py/package targets, generated database/vector files, and data keys.

### Out of Scope
- The separate MCP package root and inner directories, owned by phases 001 and 002.
- Feature-catalog and manual-playbook content trees.
- Runtime behavior refactors or database content changes unrelated to the path closure.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The shared/runtime candidate inventory is complete. | The report records shared/mcp_server as the observed candidate and proves whether runtime has zero additional candidates. |
| REQ-002 | The permitted shared directory uses a kebab target. | shared/mcp_server maps to shared/mcp-server without changing the database contents or package contract. |
| REQ-003 | All active shared/runtime references resolve. | Imports, config paths, database paths, README links, and package references use the target directory. |
| REQ-004 | Tool and generated exemptions are preserved. | Manifests, SKILL.md, mode-registry.json, Python targets, generated artifacts, and data keys are unchanged. |
| REQ-005 | The phase hands a clean surface to catalog migration. | The old-path scan has zero unknown active matches and the runtime tree is ready for rollup. |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The shared/runtime surface has no permitted underscore-bearing filesystem name.
- **SC-002**: shared/mcp-server and its database support paths resolve everywhere they are active.
- **SC-003**: Tool-mandated and generated names retain their exact contracts.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

shared/mcp_server contains database state files, so a directory move must preserve file bytes and lock semantics rather than recreate or edit the database. The runtime tree may have no rename candidate; the zero-candidate result is valid only when backed by a complete scan.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

No blocking questions. The verifier must confirm whether shared/mcp_server is a package directory or generated/data boundary before moving it.
<!-- /ANCHOR:questions -->

