---
title: "Feature Specification: prompt-improve asset and reference names (017 phase 004.002)"
description: "The prompt-improve packet still uses underscore-separated names for its format-guide assets and core reference files, and those paths are repeated in the packet skill, README, and router resource map. This phase renames only that packet-owned asset/reference set and closes every active path reference while leaving playbook, benchmark, changelog, tool-mandated, and data-key boundaries intact."
trigger_phrases:
  - "prompt-improve kebab-case migration"
  - "prompt-improve asset filenames"
  - "sk-prompt phase 002 naming"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/019-hyphen-naming-convention/008-component-migration/004-sk-prompt/002-prompt-improve"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-hyphen-naming-convention/008-component-migration/004-sk-prompt/002-prompt-improve"
    last_updated_at: "2026-07-14T18:04:33Z"
    last_updated_by: "codex"
    recent_action: "Authored the prompt-improve L2 packet from its asset and reference inventory"
    next_safe_action: "Execute the prompt-improve path map after phase 001 handoff"
    blockers: []
    key_files:
      - ".opencode/skills/sk-prompt/prompt-improve/SKILL.md"
      - ".opencode/skills/sk-prompt/prompt-improve/README.md"
      - ".opencode/skills/sk-prompt/prompt-improve/assets/format_guide_json.md"
      - ".opencode/skills/sk-prompt/prompt-improve/assets/format_guide_markdown.md"
      - ".opencode/skills/sk-prompt/prompt-improve/assets/format_guide_yaml.md"
      - ".opencode/skills/sk-prompt/prompt-improve/references/depth_framework.md"
      - ".opencode/skills/sk-prompt/prompt-improve/references/design_generation_patterns.md"
      - ".opencode/skills/sk-prompt/prompt-improve/references/patterns_evaluation.md"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "prompt-improve/manual_testing_playbook/** is owned by phase 004."
      - "prompt-improve/benchmark/** is owned by phase 005."
      - "Changelog history is not rewritten by this phase; phase 006 verifies release evidence."
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: prompt-improve asset and reference names

> Phase adjacency under the sk-prompt component parent (grouping order, not a runtime dependency): predecessor `001-hub-root-and-shared`; successor `003-prompt-models`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/019-hyphen-naming-convention/008-component-migration/004-sk-prompt/002-prompt-improve |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Owner skill** | sk-prompt |
| **Origin** | Phase 002 of the sk-prompt component subtree under the 017 kebab-case filesystem-naming program |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The prompt-improve packet names its format guides `format_guide_json.md`, `format_guide_markdown.md`, and
`format_guide_yaml.md`, and its core references `depth_framework.md`, `design_generation_patterns.md`, and
`patterns_evaluation.md`. `SKILL.md`, `README.md`, and router resource maps consume those paths, so renaming the files
without updating the active consumers would break prompt-resource loading and documentation links.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Rename the three files under `prompt-improve/assets/` from `format_guide_*` to `format-guide-*`.
- Rename `depth_framework.md`, `design_generation_patterns.md`, and `patterns_evaluation.md` under `prompt-improve/references/` to kebab-case.
- Update active path references in `prompt-improve/SKILL.md`, `prompt-improve/README.md`, and packet-local active documents.
- Prove that all prompt-improve resource-map entries resolve after the path changes.

### Out of Scope
- `prompt-improve/manual_testing_playbook/**`; phase 004 owns its root, categories, scenarios, and links.
- `prompt-improve/benchmark/**`; phase 005 owns benchmark artifact paths and references.
- `prompt-improve/changelog/**`; frozen history is not rewritten by this phase.
- `SKILL.md`, package manifests, JSON/YAML/TOML keys, frontmatter fields, Python names, and generated output.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `prompt-improve/assets/format_guide_json.md` | Rename | `format-guide-json.md`; update format-mode resource references |
| `prompt-improve/assets/format_guide_markdown.md` | Rename | `format-guide-markdown.md`; update Markdown delivery references |
| `prompt-improve/assets/format_guide_yaml.md` | Rename | `format-guide-yaml.md`; update YAML delivery references |
| `prompt-improve/references/{depth_framework,design_generation_patterns,patterns_evaluation}.md` | Rename | Kebab-case reference names; update router and README links |
| `prompt-improve/SKILL.md` and `README.md` | Reference update | Preserve content and router behavior while repointing active paths |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 [P0] | All six packet-owned asset/reference filenames use kebab-case | The rename map contains the three `format_guide_*` assets and three named references with one target per source |
| REQ-002 [P0] | Active prompt-improve consumers use the new paths | `SKILL.md`, `README.md`, and the resource-map entries resolve every renamed asset/reference with no stale active source path |
| REQ-003 [P0] | Prompt-improve routing semantics remain unchanged | Intent names, resource keys, framework identifiers, JSON/YAML keys, and frontmatter fields are byte-for-byte contract-compatible |
| REQ-004 [P1] | Delegated and frozen boundaries are respected | No playbook, benchmark, changelog, tool-mandated, Python, generated, or package-directory path is included in this phase's rename map |
| REQ-005 [P1] | The rename is dependency-closed and reversible | Link/path checks pass after the rename, and the source-to-target map supports a clean git revert |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The six prompt-improve asset/reference names are kebab-case and all active resource paths resolve.
- **SC-002**: Prompt-improve resource loading and documentation semantics are unchanged, with delegated and frozen trees untouched.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

The primary risk is a partial reference rewrite: the same asset names appear in router pseudocode, loading tables,
README links, and cross-reference prose. The phase depends on the root boundary from phase 001 and must coordinate path
ownership with phases 004 and 005; a complete active-tree search and path-resolution manifest mitigates both risks.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking; the current asset and reference inventory is concrete, and the execution map must record any newly observed file before renaming it.
<!-- /ANCHOR:questions -->
