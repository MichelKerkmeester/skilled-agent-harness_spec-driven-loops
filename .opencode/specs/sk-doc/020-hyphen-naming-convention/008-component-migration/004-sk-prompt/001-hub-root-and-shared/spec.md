---
title: "Feature Specification: sk-prompt hub root and shared boundary (032 phase 004.001)"
description: "The sk-prompt hub root owns routing and packet-entry files, while delegated playbook and benchmark trees have their own phases. This phase inventories the root/shared boundary, renames only owned snake_case paths if present, and protects tool-mandated hub names and routing semantics."
trigger_phrases:
  - "sk-prompt hub root kebab-case"
  - "sk-prompt shared assets naming"
  - "sk-prompt phase 001 naming"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/004-sk-prompt/001-hub-root-and-shared"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/004-sk-prompt/001-hub-root-and-shared"
    last_updated_at: "2026-07-14T18:04:33Z"
    last_updated_by: "codex"
    recent_action: "Authored the L2 hub-root/shared boundary specification from the live sk-prompt inventory"
    next_safe_action: "Run the root/shared census and freeze its disposition map"
    blockers: []
    key_files:
      - ".opencode/skills/sk-prompt/SKILL.md"
      - ".opencode/skills/sk-prompt/README.md"
      - ".opencode/skills/sk-prompt/hub-router.json"
      - ".opencode/skills/sk-prompt/mode-registry.json"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "The live sk-prompt root has no shared/ directory; the census must record that absence rather than inventing candidates."
      - "The root manual_testing_playbook/ and benchmark/ trees are delegated to phases 004 and 005."
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: sk-prompt hub root and shared boundary

> Phase adjacency under the sk-prompt component parent (grouping order, not a runtime dependency): successor `002-prompt-improve`; delegated roots are owned by `004-manual-testing-playbook` and `005-benchmark`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/020-hyphen-naming-convention/008-component-migration/004-sk-prompt/001-hub-root-and-shared |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Owner skill** | sk-prompt |
| **Origin** | Phase 001 of the sk-prompt component subtree under the 032 kebab-case filesystem-naming program |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The sk-prompt root combines exact routing files with child trees whose ownership is split across later phases. The live inventory contains no `shared/` directory and no root-owned snake_case file requiring rename, but the delegated `manual_testing_playbook/` and `benchmark/` directories must not be claimed by a broad root sweep. This phase establishes the root/shared census and preserves the hub contract while applying the program's exemption boundary.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Census every direct root file and directory under `.opencode/skills/sk-prompt/`.
- Inspect a present `shared/` subtree, if the pinned BASE contains one, for authored snake_case filesystem names and active path references.
- Rename only root/shared-owned authored names to kebab-case; the live BASE currently yields an explicit zero-candidate result for `shared/`.
- Update root-owned path references without changing routing keys, mode values, frontmatter fields, or data keys.
- Record delegated ownership for `manual_testing_playbook/`, `benchmark/`, `prompt-improve/`, and `prompt-models/`.

### Out of Scope
- The root `manual_testing_playbook/` tree, which phase 004 owns.
- The root `benchmark/` tree, which phase 005 owns.
- `prompt-improve/` and `prompt-models/` component contents, which phases 002 and 003 own.
- `SKILL.md`, `mode-registry.json`, `hub-router.json`, manifests, metadata filenames, Python `.py` files/package directories, and other tool-mandated names.
- JSON keys, code identifiers, frontmatter fields, changelog history, generated output, and benchmark or playbook content.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `sk-prompt/` root | Inventory and bounded rename | Classify every direct child; rename only an owned authored snake_case path if one exists |
| `sk-prompt/shared/` | Conditional inventory | Record absence on the current BASE, or map present owned assets/references if introduced before execution |
| Root-owned Markdown/JSON references | Reference update | Repoint only root/shared path values; preserve routing and data contracts |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 [P0] | Root/shared ownership is explicit | Every observed direct child has exactly one owned, delegated, protected, generated, or exempt disposition |
| REQ-002 [P0] | Owned names are kebab-case | Every root/shared-owned authored filesystem name uses kebab-case after the phase; the absent `shared/` result is recorded |
| REQ-003 [P0] | Hub contracts remain exact | `SKILL.md`, `mode-registry.json`, `hub-router.json`, metadata names, and routing semantics are unchanged except for owned path values |
| REQ-004 [P1] | Delegated phases remain independent | No playbook, benchmark, prompt-improve, or prompt-models child path is renamed or rewritten by this phase |
| REQ-005 [P1] | References resolve | Root/shared-owned path references resolve to the mapped target and no stale owned source path remains |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A complete root/shared census and disposition map is attached to the phase evidence.
- **SC-002**: The live BASE's absent `shared/` directory is recorded, and any root-owned candidates are either mapped to kebab-case or proven protected/delegated.
- **SC-003**: Hub routing files parse and retain their existing mode/resource behavior.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

The main risk is a broad root rename that captures paths owned by phases 004 or 005, or changes a tool-mandated hub filename. The phase depends on the 032 exemption set and hands its root boundary evidence to every child phase that updates root-owned references.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking. The execution census must confirm that no `shared/` subtree was introduced between authoring and migration.
<!-- /ANCHOR:questions -->
