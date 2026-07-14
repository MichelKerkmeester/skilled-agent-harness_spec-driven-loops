---
title: "Feature Specification: code-opencode filesystem names (017 phase 008/002)"
description: "The code-opencode evidence packet contains snake_case asset, playbook, reference, benchmark, and symlink names that are embedded in OpenCode routing documentation. This phase renames those filesystem names to kebab-case and repairs their references while preserving SKILL.md, Python files, Python package directories, and other exact-name contracts."
trigger_phrases:
  - "code-opencode naming migration"
  - "OpenCode packet kebab-case"
  - "OpenCode reference rename"
  - "OpenCode playbook path migration"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/008-component-migration/001-sk-code"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/008-component-migration/001-sk-code/002-code-opencode"
    last_updated_at: "2026-07-14T18:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored code-opencode phase spec"
    next_safe_action: "Execute the OpenCode packet rename closure"
    blockers: []
    key_files:
      - ".opencode/skills/sk-code/code-opencode/SKILL.md"
      - ".opencode/skills/sk-code/code-opencode/assets/"
      - ".opencode/skills/sk-code/code-opencode/references/"
      - ".opencode/skills/sk-code/code-opencode/manual_testing_playbook/"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "OpenCode .py scripts and Python import-package directories are exempt."
      - "SKILL.md, README.md, package manifests, and other tool-mandated names remain exact."
      - "The phase owns the code-opencode subtree and its path/reference closure."
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: code-opencode filesystem names

> Phase adjacency under the sk-code component parent: predecessor 001-hub-root-and-shared; successor 003-code-quality.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/017-hyphen-naming-convention/008-component-migration/001-sk-code/002-code-opencode |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Owner skill** | sk-code |
| **Origin** | Phase 002 of the sk-code component migration under the 017 kebab-case filesystem-naming program |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The code-opencode packet is a large evidence tree with snake_case names across assets/checklists, manual-testing-playbook categories, language-reference directories, Rust checklists, shared organization references, and benchmark labels. Its SKILL.md and resource documents load those names as relative paths, so a physical rename without a reference closure would break OpenCode surface discovery and authoring guidance.

### Purpose

Rename every in-scope snake_case directory and file in code-opencode to kebab-case, update all packet and cross-surface path references, and prove that the Python exemption and tool-mandated-name boundary remains intact.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Asset/checklist names such as assets/checklists/agent_authoring.md, command_authoring.md, config_checklist.md, javascript_checklist.md, mcp_server_authoring.md, python_checklist.md, shell_checklist.md, skill_authoring.md, typescript_checklist.md, universal_checklist.md, and the rust_checklist/ tree.
- The code-opencode/manual_testing_playbook/ root, its authoring_verification/, config_hooks/, and language_standards/ categories, and their scenario/index files.
- Reference names under config/, javascript/, python/, rust/, shared/, shell/, and typescript/, including quality_standards, quick_reference, style_guide, code_organization, universal_patterns, and the files with names such as overview_modules_and_docs.md and security_testing_and_exemptions.md.
- The nested benchmark labels live_mode_b/ and router_mode_a/ plus all OpenCode packet documentation, markdown links, registry/resource paths, and workflow symlink consumers that point into this subtree.
- A semantic rename-map disposition for every underscore-bearing path segment, with .py filenames and Python package directories explicitly classified as exempt.

### Out of Scope

- SKILL.md, README.md, package manifests, mode-registry.json, hub-router.json, and other tool-mandated exact names.
- Python files including assets/scripts/test_verify_alignment_drift.py, verify_alignment_drift.py, and verify_stack_folders.py.
- Python import-package directories, generated or lockfile output, code identifiers, JSON/YAML/TOML keys, frontmatter fields, and frozen changelog/history.
- The hub/shared source files owned by 001-hub-root-and-shared and the independent code-quality, code-review, code-webflow, root-playbook, and root-benchmark physical renames.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .opencode/skills/sk-code/code-opencode/assets/** | Rename and reference update | Rename in-scope checklist directories/files and update links; preserve the Python scripts. |
| .opencode/skills/sk-code/code-opencode/manual_testing_playbook/** | Rename and reference update | Rename the playbook root, categories, and scenario/index files. |
| .opencode/skills/sk-code/code-opencode/references/** | Rename and reference update | Rename language/reference names and repair all relative links and workflow symlink edges. |
| .opencode/skills/sk-code/code-opencode/benchmark/** | Rename and path update | Rename live_mode_b and router_mode_a storage labels and update packet benchmark paths. |
| .opencode/skills/sk-code/code-opencode/SKILL.md and README.md | Reference update | Replace old path literals without changing the OpenCode surface contract. |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every in-scope code-opencode snake_case name is renamed to a unique kebab-case target | The frozen-map report covers assets, manual playbook, references, and benchmark labels with zero unknown or collision rows. |
| REQ-002 | OpenCode path consumers are repaired in the same closure | SKILL.md, README.md, internal markdown links, resource indexes, benchmark paths, and symlink targets resolve without old active basenames. |
| REQ-003 | Python and tool-mandated exemptions are honored | The named .py scripts and any Python package directories retain their names; SKILL.md, README.md, manifests, keys, and identifiers are unchanged. |
| REQ-004 | OpenCode resource discovery remains equivalent | TypeScript, Python, shell, Rust, JavaScript, config, and universal reference routing loads the same logical resources after the rename. |
| REQ-005 | The child hands off a scope-clean component | The final path/reference manifest contains only the code-opencode closure and records every cross-component edge for downstream reconciliation. |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: No in-scope snake_case filesystem name remains under code-opencode.
- **SC-002**: All OpenCode links, resource paths, benchmark labels, and workflow symlinks resolve.
- **SC-003**: Python exemptions and exact-name contracts are unchanged, and OpenCode routing behavior matches BASE.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

The packet mixes documentation paths with executable-adjacent resource loading and contains Python scripts that must not be renamed. A blind sweep could either break resource routing or make an import package unavailable. The mitigation is a classified map, a path-value/reference scan, explicit .py/package fixtures, and language-specific discovery checks. The phase depends on the shared-name handoff and the 017 frozen map.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking. The execution report must attach the final disposition for every .py path and Python package directory encountered, even when no physical rename occurs.
<!-- /ANCHOR:questions -->
