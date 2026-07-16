---
title: "Feature Specification: mcp-figma naming closure (032 phase 004)"
description: "The mcp-figma component contains snake_case catalog and manual-testing directories, asset and reference filenames, an uppercase underscored install guide, and a leading-underscore shared shell helper. This phase renames those filesystem paths to safe kebab-compatible targets and updates references without changing Figma transport behavior or shell identifiers."
trigger_phrases:
  - "mcp-figma kebab-case"
  - "figma catalog playbook rename"
  - "032 mcp tooling phase 004"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/032-hyphen-naming-convention/008-component-migration/006-mcp-tooling"
_memory:
  continuity:
    packet_pointer: "sk-doc/032-hyphen-naming-convention/008-component-migration/006-mcp-tooling/004-mcp-figma"
    last_updated_at: "2026-07-14T16:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored phase 004 from the Figma path census"
    next_safe_action: "Execute the Figma catalog/playbook and helper rename closure"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-tooling/mcp-figma/SKILL.md"
      - ".opencode/skills/mcp-tooling/mcp-figma/feature_catalog/"
      - ".opencode/skills/mcp-tooling/mcp-figma/manual_testing_playbook/"
      - ".opencode/skills/mcp-tooling/mcp-figma/scripts/_common.sh"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: mcp-figma Naming Closure

> Phase adjacency under the 006-mcp-tooling parent: predecessor 003-mcp-click-up; successor 005-manual-testing-playbook.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/032-hyphen-naming-convention/008-component-migration/006-mcp-tooling/004-mcp-figma |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Owner skill** | sk-doc |
| **Origin** | Phase 004 of the mcp-tooling component naming migration |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The Figma transport has 14 snake_case directories and 30 underscored filenames across feature_catalog, manual_testing_playbook, assets, references, and scripts. The leading-underscore _common.sh helper is a shared shell source, so blindly substituting underscores would create an invalid-looking target and could leave source commands or path references inconsistent.

This phase moves the Figma filesystem surface to semantic kebab-case targets, including the helper's safe target common.sh, and updates all local references while preserving the read-only transport boundary, Figma command identifiers, shell variables, and tool contracts.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- feature_catalog/ and feature_catalog.md, including a11y_and_analysis, connect_and_daemon, design_system_extract_and_import, optional_mcp, render_and_create, and tokens_and_variables.
- manual_testing_playbook/ and manual_testing_playbook.md, including daemon_health, detection_setup, intra_routing_recall, optional_mcp, read_only, and safety_gate.
- assets/env_template.md and assets/utcp_figma_manual.md.
- INSTALL_GUIDE.md, the feature/playbook files, references/figma_cli_reference.md, references/mcp_wiring.md, references/tool_surface.md, and scripts/_common.sh.
- Relative links, shell source paths, path-derived frontmatter values, and component navigation references.

### Out of Scope
- SKILL.md, README.md, changelog history, mcp-servers/figma-cli, mcp-servers/figma-mcp, and package/tool manifests.
- Figma command names, figma-ds-cli and figma-cli identifiers, shell variables such as _c_red, Code Mode keys, JSON/YAML/TOML keys, and frontmatter fields.
- mcp-chrome-devtools, mcp-click-up, and the hub-level manual-testing-playbook tree.
- Python .py files and Python import-package directories; the component census found none.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .opencode/skills/mcp-tooling/mcp-figma/feature_catalog/ | Rename | Use feature-catalog/ and kebab-case categories/files |
| .opencode/skills/mcp-tooling/mcp-figma/manual_testing_playbook/ | Rename | Use manual-testing-playbook/ and kebab-case categories/files |
| .opencode/skills/mcp-tooling/mcp-figma/assets/ | Rename | Rename env_template.md and utcp_figma_manual.md |
| .opencode/skills/mcp-tooling/mcp-figma/references/ | Rename | Rename underscored reference files |
| .opencode/skills/mcp-tooling/mcp-figma/scripts/_common.sh | Rename | Use the semantic helper target common.sh and update all source paths |
| .opencode/skills/mcp-tooling/mcp-figma/{SKILL.md,README.md} | Modify | Repair path references only |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Rename the complete Figma filesystem closure | The 14 underscored directories, 30 underscored files, INSTALL_GUIDE.md, asset/reference paths, and _common.sh have explicit semantic targets |
| REQ-002 | Repair every local reference | Markdown links, source commands, path tables, index entries, and path-derived values resolve to the new paths |
| REQ-003 | Preserve transport and shell semantics | The mcp-figma allowed-tool boundary, Figma command identifiers, shell variables, JSON/YAML/TOML keys, and frontmatter fields remain unchanged |
| REQ-004 | Honor the 032 exemption boundary | No Python path, generated/lockfile output, changelog history, or tool/package-mandated name is renamed |
| REQ-005 | Prove the Figma packet remains usable | Feature/playbook discovery, shell syntax, and parent-hub checks pass with non-zero resources |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: No in-scope snake_case filesystem name remains under mcp-figma.
- **SC-002**: The Figma catalog, playbook, assets, references, and scripts resolve as one closure.
- **SC-003**: The transport remains read-only in the workspace and the helper still resolves the intended binary.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

The leading-underscore helper is the highest-risk path because its filename and its shell variable names both contain underscores. The map must rename only the filesystem path to common.sh, update source commands, and leave _c_red, _c_grn, and other shell identifiers intact. Figma transport behavior is verified separately from documentation link resolution.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking. The semantic target for scripts/_common.sh is scripts/common.sh; the underscore-prefixed shell variables inside the file remain identifiers and are not renamed.
<!-- /ANCHOR:questions -->
