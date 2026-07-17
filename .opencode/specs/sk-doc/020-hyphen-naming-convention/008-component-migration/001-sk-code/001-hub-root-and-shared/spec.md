---
title: "Feature Specification: hub root and shared sk-code names (032 phase 008/001)"
description: "The sk-code hub's shared assets and references still use snake_case names, including workflow documents, shared checklists, router references, and reusable pattern files. This phase defines the hub/shared rename closure while keeping exact tool names, Python exemptions, and shared symlink behavior intact."
trigger_phrases:
  - "sk-code hub shared naming"
  - "shared sk-code kebab-case"
  - "workflow reference rename"
  - "hub root naming phase"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/001-sk-code"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/001-sk-code/001-hub-root-and-shared"
    last_updated_at: "2026-07-14T18:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored hub shared phase spec"
    next_safe_action: "Execute the hub shared rename closure against the frozen map"
    blockers: []
    key_files:
      - ".opencode/skills/sk-code/SKILL.md"
      - ".opencode/skills/sk-code/shared/README.md"
      - ".opencode/skills/sk-code/shared/references/"
      - ".opencode/skills/sk-code/shared/assets/"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "The hub's SKILL.md, README.md, mode-registry.json, hub-router.json, and metadata files remain exact."
      - "Shared workflow source files and their path consumers must move as one reference closure."
      - "Kebab-case is the only target form; Python files, package directories, generated output, tool-mandated names, and frozen history remain exempt."
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: Hub root and shared sk-code names

> Phase adjacency under the sk-code component parent: predecessor 007-shared-and-cross-cutting-closures; successor 002-code-opencode.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/020-hyphen-naming-convention/008-component-migration/001-sk-code/001-hub-root-and-shared |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Owner skill** | sk-code |
| **Origin** | Phase 001 of the sk-code component migration under the 032 kebab-case filesystem-naming program |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The shared sk-code layer is the source for surface detection, routing, universal verification, workflow doctrine, and reusable asset patterns. Its filesystem still contains names such as workflow_implement.md, performance_loading_checklist.md, universal/code_quality_standards.md, and assets/patterns/validation_patterns.js, while the hub documents and surface symlinks refer to those exact paths.

### Purpose

Rename every in-scope snake_case filesystem name owned by the sk-code hub/shared area to kebab-case and repair all direct references and symlink target strings without changing routing logic, document identifiers, JSON keys, or any exempt name.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Shared reference files: phase_detection.md, smart_routing.md, stack_detection.md, performance_loading_checklist.md, universal-debugging_checklist.md, universal-verification_checklist.md, workflow_debug.md, workflow_implement.md, workflow_verify.md, and the universal files code_quality_standards.md, code_style_guide.md, error_recovery.md, and multi_agent_research.md.
- Shared asset files assets/patterns/validation_patterns.js and assets/patterns/wait_patterns.js.
- References in the hub SKILL.md, README.md, shared/README.md, hub-router.json, mode-registry.json where a path value changes, and the two surface symlink closures that target shared workflow files.
- The frozen rename-map classification for every shared candidate, including a confirmation that already-compliant root names and the hub-level manual_testing_playbook/ are owned by later child phases.

### Out of Scope

- Physical names inside code-opencode/, code-quality/, code-review/, code-webflow/, manual_testing_playbook/, or benchmark/ except for reference/symlink edges required by the shared closure.
- SKILL.md, README.md, mode-registry.json, hub-router.json, description.json, and graph-metadata.json names; these are already compliant or tool/metadata contracts.
- Python .py filenames and Python import-package directories, generated or lockfile output, code identifiers, JSON/YAML/TOML keys, frontmatter fields, and frozen changelog/history content.
- Rewriting routing behavior or changing the meaning of workflow, surface, or packet keys.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .opencode/skills/sk-code/shared/references/** | Rename and reference update | Rename the listed shared reference files and repair their internal links. |
| .opencode/skills/sk-code/shared/assets/patterns/** | Rename and reference update | Rename validation_patterns.js and wait_patterns.js and update pattern indexes. |
| .opencode/skills/sk-code/SKILL.md and README.md | Reference update | Replace shared path literals while preserving prose and routing contracts. |
| .opencode/skills/sk-code/shared/README.md | Reference update | Update the shared resource index to the new filenames. |
| code-opencode/references/workflow_* and code-webflow/references/workflow_* | Symlink/reference closure | Preserve link targets and update the link nodes or target strings according to the frozen dependency map. |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every shared snake_case candidate is classified once and receives a kebab-case target when in scope | The phase manifest has one row for each listed file, no collision, and no unknown disposition. |
| REQ-002 | Shared references and workflow symlink consumers remain resolvable | Markdown links, hub resource paths, and every workflow symlink resolve to the renamed target; no old shared basename remains in an active path. |
| REQ-003 | Hub routing contracts remain unchanged | mode-registry.json and hub-router.json retain the same keys, packet mappings, and route outcomes after path-value updates. |
| REQ-004 | Exempt and already-compliant names remain untouched | SKILL.md, README.md, metadata files, Python files/package directories, generated output, tool-mandated names, and frozen history are present with their original names. |
| REQ-005 | Shared behavior remains equivalent | Shared surface detection, workflow loading, pattern references, and the hub fallback path pass their existing verification checks with the renamed paths. |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: No in-scope snake_case filesystem name remains under sk-code/shared.
- **SC-002**: All shared path references and workflow symlinks resolve to kebab-case targets.
- **SC-003**: The hub still exposes the same two-axis routing contract and shared workflow doctrine.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

The shared workflow files are symlinked into code-opencode and code-webflow, so changing only the source basename can leave dangling links or stale load paths. The mitigation is a rename-map row for each source, link node, and consumer plus a post-rename symlink and markdown-link scan. The phase depends on the 032 frozen map and the cross-cutting closure handoff; it does not authorize component-wide content changes.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking. The executor must use the frozen map to settle whether each symlink link-node moves with this shared closure or with its owning component; either choice must preserve the resolved target and be evidenced in the handoff.
<!-- /ANCHOR:questions -->
