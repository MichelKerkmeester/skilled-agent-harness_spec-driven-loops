---
title: "Feature Specification: sk-doc manual-testing-playbook tree"
description: "The root sk-doc manual_testing_playbook tree uses snake_case for its category directories, scenario filenames, and root index. This phase converts those non-exempt filesystem names to kebab-case and updates the playbook index and path references without changing scenario content or identifiers."
trigger_phrases:
  - "sk-doc manual testing playbook naming"
  - "manual playbook kebab-case phase"
  - "sk-doc scenario directory rename"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/003-sk-doc/004-manual-testing-playbook"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/003-sk-doc/004-manual-testing-playbook"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored manual playbook phase docs"
    next_safe_action: "Build the root playbook rename map"
    blockers: []
    key_files: [".opencode/skills/sk-doc/manual_testing_playbook/"]
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr_rules.md -->

# Feature Specification: sk-doc manual-testing-playbook tree
> Phase adjacency — predecessor `003-create-packets`; successor `005-benchmark`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | `sk-doc/020-hyphen-naming-convention/008-component-migration/003-sk-doc/004-manual-testing-playbook` |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Owner skill** | sk-doc |
| **Origin** | Phase 004 of the sk-doc component migration |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The root manual-testing-playbook uses snake_case category directories and scenario filenames across agent dispatch, cross-CLI dispatch, intent detection, resource loading, token-cost baselines, and unknown fallback. The root index links to these files, so renaming directories without updating the index would make the playbook incomplete.

The outcome is a fully navigable kebab-case playbook tree with scenario content and test identifiers unchanged.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Rename `manual_testing_playbook/` to `manual-testing-playbook/` and `manual_testing_playbook.md` to `manual-testing-playbook.md`.
- Rename category directories `agent_dispatch`, `cross_cli_dispatch`, `intent_detection`, `resource_loading`, `token_cost_baseline`, and `unknown_fallback`.
- Rename agent-dispatch scenarios `markdown_agent_cli_claude_code.md` and `markdown_agent_cli_opencode.md`.
- Rename cross-CLI scenarios `large_prompt_stress.md`, `multi_step_dispatch.md`, and `short_prompt_baseline.md`.
- Rename intent-detection scenarios `agent_command.md`, `doc_quality.md`, `install_guide.md`, and `skill_creation.md`; preserve the already-canonical `optimization.md`.
- Rename resource-loading scenarios `assets_only.md`, `mixed_references_assets.md`, and `references_global_only.md`.
- Rename token-cost scenarios `max_load.md`, `medium_load.md`, and `minimal_load.md`.
- Rename unknown-fallback scenarios `ambiguous_multi_intent.md`, `disambiguation_required.md`, and `no_keyword_match.md`.
- Update links, category indexes, and path references in the playbook tree and any sk-doc consumers.

### Out of Scope

- Scenario IDs, prompt text, expected outcomes, frontmatter fields, and content identifiers.
- Already-kebab scenario files such as `optimization.md`.
- Other skills' playbooks, create-manual-testing-playbook templates, and tool-mandated names.
- Historical/frozen playbook copies outside this root.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-doc/manual_testing_playbook/` | Rename | Convert root directory, six category directories, and all underscore-bearing scenario files; preserve canonical names |
| `.opencode/skills/sk-doc/manual_testing_playbook/manual_testing_playbook.md` | Rename/reference update | Convert the root index filename and repoint category links |
| `sk-doc` consumers | Modify | Update path-valued playbook references |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every non-exempt playbook directory and filename is kebab-case | Full tree manifest has one target for every underscore-bearing path and no unknown candidate |
| REQ-002 | Root index/category links remain complete | Every scenario link resolves and category/scenario discovery counts match BASE |
| REQ-003 | Scenario content remains stable | IDs, prompts, expected outcomes, and fields change only when a path token requires it |
| REQ-004 | Cross-surface references are updated | Live sk-doc consumers point to the new root/category paths |
| REQ-005 | Tool/exemption boundary is respected | No mandated name, key, field, or unrelated playbook is changed |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The complete root manual-testing-playbook tree is kebab-case within scope.
- **SC-002**: The root index still reaches every scenario with stable content and counts.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Root index and category links | Scenarios become unreachable | Build link inventory before moving paths and recheck all targets |
| Risk | A category token is used as a content identifier | Scenario selection changes | Separate path links from IDs and prompt content |
| Risk | External playbook references are missed | Cross-skill navigation breaks | Search repository consumers and report external ownership |
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking. Any cross-skill playbook path must be handed to its owning phase with evidence rather than expanded here.
<!-- /ANCHOR:questions -->
