---
title: "Feature Specification: create-command resource names"
description: "The create-command packet contains snake_case command templates and routing guidance filenames. This phase renames those non-exempt resources to kebab-case and updates command-authoring references without changing command manifests, argument fields, or tool-mandated names."
trigger_phrases:
  - "create-command resource naming"
  - "create-command kebab-case phase"
  - "command template rename"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/003-sk-doc/003-create-packets/004-create-command"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/003-sk-doc/003-create-packets/004-create-command"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored create-command phase docs"
    next_safe_action: "Build the create-command rename map"
    blockers: []
    key_files: [".opencode/skills/sk-doc/create-command/assets/", ".opencode/skills/sk-doc/create-command/references/"]
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr_rules.md -->

# Feature Specification: create-command resource names

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | `sk-doc/020-hyphen-naming-convention/008-component-migration/003-sk-doc/003-create-packets/004-create-command` |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Owner skill** | sk-doc/create-command |
| **Origin** | Phase 004 of the nested create-packets decomposition |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The create-command packet's assets and references use underscores in names such as `command_router_template.md` and `argument_hints_and_modes.md`. These paths are part of the command scaffold and router/presentation authoring workflow, so partial renames would break the resource contract.

The outcome is a kebab-case command-resource tree with all path consumers updated and command argument/router semantics unchanged.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Rename `command_presentation_template.md`, `command_router_template.md`, and `command_template.md` in `assets/`.
- Rename `argument_hints_and_modes.md`, `common_pitfalls.md`, `router_presentation_split.md`, and `worked_example.md` in `references/`.
- Update path links and resource values in `SKILL.md`, README, templates, and references.
- Preserve the packet's router/presentation split and argument-hint content.

### Out of Scope

- `SKILL.md`, `README.md`, changelog files, package metadata, and tool-mandated names.
- Command frontmatter fields, argument identifiers, mode names, JSON/YAML keys, and prose tokens that are not paths.
- Other create-* packets.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `create-command/assets/{command_presentation_template,command_router_template,command_template}.md` | Rename/reference update | Convert three command template filenames |
| `create-command/references/{argument_hints_and_modes,common_pitfalls,router_presentation_split,worked_example}.md` | Rename/reference update | Convert four reference filenames |
| `create-command/SKILL.md`, `README.md`, and docs | Modify | Repoint changed resource paths |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All seven non-exempt resources use kebab-case | Manifest and filesystem census match with no unknown candidate |
| REQ-002 | Command template and reference links resolve | Every old path consumer points to its correct new target |
| REQ-003 | Router/presentation and argument-hint semantics remain stable | Content diff changes paths only, not command behavior fields |
| REQ-004 | Tool-mandated names and metadata keys remain exact | No mandated file, key, frontmatter field, or identifier is renamed |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The create-command resource tree has kebab-case non-exempt names.
- **SC-002**: Command scaffolding continues to resolve its router, presentation, and argument-hint resources.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Router/presentation template links | Generated command structure breaks | Resolve every template link after rename |
| Risk | Argument names resemble path names | Command interface changes | Restrict edits to filesystem path tokens |
| Risk | Worked examples contain relative links | Quality guidance becomes stale | Search examples and reference indexes explicitly |
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking. Any dynamic resource lookup must be pinned in the execution report.
<!-- /ANCHOR:questions -->
