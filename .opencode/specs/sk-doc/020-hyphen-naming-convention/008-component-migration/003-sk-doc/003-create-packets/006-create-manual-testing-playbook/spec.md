---
title: "Feature Specification: create-manual-testing-playbook resource names"
description: "The create-manual-testing-playbook packet contains snake_case template and prompt-voice resource filenames. This phase converts those non-exempt names to kebab-case and updates packet-local links while preserving playbook schema fields and scenario identifiers."
trigger_phrases:
  - "create-manual-testing-playbook resource naming"
  - "manual testing playbook template kebab-case"
  - "create playbook resource rename"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/003-sk-doc/003-create-packets/006-create-manual-testing-playbook"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/003-sk-doc/003-create-packets/006-create-manual-testing-playbook"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored create-playbook phase docs"
    next_safe_action: "Build the create-playbook rename map"
    blockers: []
    key_files: [".opencode/skills/sk-doc/create-manual-testing-playbook/assets/", ".opencode/skills/sk-doc/create-manual-testing-playbook/references/"]
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr_rules.md -->

# Feature Specification: create-manual-testing-playbook resource names

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | `sk-doc/020-hyphen-naming-convention/008-component-migration/003-sk-doc/003-create-packets/006-create-manual-testing-playbook` |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Owner skill** | sk-doc/create-manual-testing-playbook |
| **Origin** | Phase 006 of the nested create-packets decomposition |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The create-manual-testing-playbook packet names its two assets and two reference files with underscores. Those resource paths are linked by the playbook authoring workflow, while scenario IDs and prompt/schema fields are content contracts that must remain untouched.

The outcome is a kebab-case authoring-resource tree with intact playbook structure and resolved links.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Rename `assets/manual_testing_playbook_snippet_template.md` and `assets/manual_testing_playbook_template.md`.
- Rename `references/common_pitfalls.md` and `references/prompt_voice.md`.
- Update packet-local links and path values in `SKILL.md`, README, assets, and references.
- Preserve playbook category/scenario naming rules as content unless a token is a filesystem path.

### Out of Scope

- `SKILL.md`, `README.md`, changelog files, package metadata, and tool-mandated names.
- Scenario IDs, category identifiers, frontmatter fields, prompt content, and schema keys.
- The root `manual_testing_playbook/` tree, handled by phase 004.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `create-manual-testing-playbook/assets/{manual_testing_playbook_snippet_template,manual_testing_playbook_template}.md` | Rename/reference update | Convert the two asset filenames |
| `create-manual-testing-playbook/references/{common_pitfalls,prompt_voice}.md` | Rename/reference update | Convert the two reference filenames |
| `create-manual-testing-playbook/SKILL.md`, `README.md`, and docs | Modify | Repoint packet-owned paths |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All four packet-owned resource names become kebab-case | Manifest and filesystem census match exactly |
| REQ-002 | Template and guidance links resolve | Every old packet-local path consumer points at its target |
| REQ-003 | Playbook content contracts remain stable | Scenario IDs, fields, keys, and prompt text are unchanged except for path links |
| REQ-004 | Root playbook scope remains separate | No root `manual_testing_playbook/` directory or scenario file is changed here |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The create-manual-testing-playbook resources have kebab-case names.
- **SC-002**: The packet continues to scaffold and explain playbook packages through the renamed paths.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Playbook asset/reference links | Scaffold fails to locate templates | Resolve every packet-local link |
| Risk | Root playbook paths are confused with packet resources | Cross-phase edits | Use path ownership and phase boundary checks |
| Risk | Scenario identifiers are normalized accidentally | Manual test selection changes | Review content keys separately from filesystem links |
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking. Cross-references to the root playbook must be handed to phase 004 if their target is root-owned.
<!-- /ANCHOR:questions -->
