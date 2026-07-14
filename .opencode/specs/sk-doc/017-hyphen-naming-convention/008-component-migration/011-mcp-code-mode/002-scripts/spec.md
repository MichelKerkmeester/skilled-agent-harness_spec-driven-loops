---
title: "Feature Specification: mcp-code-mode scripts (017 component 011 phase 002)"
description: "The mcp-code-mode scripts surface must be audited under the 017 filesystem exemption boundary. The current non-Python script names are already kebab-case, while validate_config.py is an explicitly exempt Python filename; this phase proves that inventory and closes any eligible script reference set without renaming the Python file."
trigger_phrases:
  - "mcp-code-mode scripts naming"
  - "mcp-code-mode phase 002"
  - "script filename exemption audit"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/008-component-migration/011-mcp-code-mode"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/008-component-migration/011-mcp-code-mode/002-scripts"
    last_updated_at: "2026-07-14T16:30:00Z"
    last_updated_by: "codex"
    recent_action: "Authored scripts audit docs"
    next_safe_action: "Execute the script filename census after phase 001"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: mcp-code-mode scripts

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/017-hyphen-naming-convention/008-component-migration/011-mcp-code-mode/002-scripts |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Owner skill** | sk-doc |
| **Origin** | Phase 002 of the 017 mcp-code-mode component migration |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Script paths are consumed by shell sourcing, documentation, manual scenarios, and package tooling. The current inventory is mixed by language: doctor.sh, install.sh, update.sh, and the package check-node.cjs script are already kebab-case, while scripts/validate_config.py contains an underscore but must remain unchanged under the Python exemption.

This phase produces an auditable script-name map, renames only a non-Python snake_case filename if the pinned census finds one, and updates every source/import/registry/path reference in the same closure. A zero eligible candidate result is valid only when the census and reference scan prove it.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The root scripts directory and the post-phase-001 mcp-server/scripts directory.
- The current script inventory: doctor.sh, install.sh, update.sh, validate_config.py, and mcp-server/scripts/check-node.cjs.
- Any additional non-Python script filename found by the pinned-tree census, plus its shell sourcing, imports, registry entries, documentation paths, and manual-scenario pointers.
- Reference and syntax evidence showing the Python filename remains exempt.

### Out of Scope
- Renaming scripts/validate_config.py or any .py file; renaming Python import-package directories; or changing Python identifiers.
- The mcp-server directory closure, references/assets files, runtime names, manual-playbook tree, changelog history, and JSON/YAML/TOML keys.
- Shell behavior, command names, environment variable names, and tool names that are not filesystem paths.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every script filename is classified against the exemption set | The report lists the root scripts and mcp-server/scripts inventories and has no unknown filename |
| REQ-002 | Python script names remain exempt | validate_config.py remains the same filesystem name and all references to it continue to resolve |
| REQ-003 | Eligible non-Python snake_case filenames are renamed semantically | Every eligible candidate has one kebab-case target, or the report proves the candidate set is empty at the pinned baseline |
| REQ-004 | Script consumers move with any rename | Shell source paths, imports, registry entries, documentation links, and manual pointers contain no stale old eligible filename |
| REQ-005 | Script execution contracts are preserved | bash syntax checks and Node checks pass for affected scripts, and no command, environment variable, or code identifier is renamed |
| REQ-006 | The phase leaves an auditable zero-candidate or rename result | The candidate report records the inventory, map hash, consumer dispositions, and verification exit codes |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: No eligible non-Python snake_case script filename remains in the mcp-code-mode surface, with the empty current map accepted only when evidenced.
- **SC-002**: The exempt validate_config.py path and all affected script consumers remain valid without identifier or behavior drift.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

The main risk is treating an underscore in a shell variable, command, or Python filename as a filesystem candidate. This phase depends on phase 001's package-root state, the 017 semantic rename map, and a path-aware reference checker that distinguishes filenames from content identifiers.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking; the execution census decides whether this phase has a non-empty rename set.
<!-- /ANCHOR:questions -->
