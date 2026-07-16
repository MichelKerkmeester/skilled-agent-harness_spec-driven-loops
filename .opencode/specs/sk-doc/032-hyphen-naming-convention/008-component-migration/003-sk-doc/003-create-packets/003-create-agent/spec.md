---
title: "Feature Specification: create-agent resource names"
description: "The create-agent packet contains snake_case template and reference filenames used to scaffold agent documentation. This phase converts those non-exempt names to kebab-case and updates packet-local references without changing agent permission fields, SKILL.md, or other tool-mandated names."
trigger_phrases:
  - "create-agent resource naming"
  - "create-agent kebab-case phase"
  - "agent template rename"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/032-hyphen-naming-convention/008-component-migration/003-sk-doc/003-create-packets/003-create-agent"
_memory:
  continuity:
    packet_pointer: "sk-doc/032-hyphen-naming-convention/008-component-migration/003-sk-doc/003-create-packets/003-create-agent"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored create-agent phase docs"
    next_safe_action: "Build the create-agent rename map"
    blockers: []
    key_files: [".opencode/skills/sk-doc/create-agent/assets/", ".opencode/skills/sk-doc/create-agent/references/"]
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr_rules.md -->

# Feature Specification: create-agent resource names

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | `sk-doc/032-hyphen-naming-convention/008-component-migration/003-sk-doc/003-create-packets/003-create-agent` |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Owner skill** | sk-doc/create-agent |
| **Origin** | Phase 003 of the nested create-packets decomposition |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The create-agent packet's `agent_template.md`, `common_pitfalls.md`, and `permission_design.md` filenames are snake_case. They are resource paths used by the agent scaffold and authoring guidance, so the names and their links must move together.

The outcome is a kebab-case create-agent resource tree with unchanged agent permission semantics and complete path-reference closure.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Rename `assets/agent_template.md` to `agent-template.md`.
- Rename `references/common_pitfalls.md` and `references/permission_design.md` to kebab-case.
- Update links and path values in `SKILL.md`, README, the asset, and reference docs.
- Check that already-hyphenated `agent-vs-skill-vs-command.md` remains unchanged.

### Out of Scope

- `SKILL.md`, `README.md`, changelog files, package metadata, and tool-mandated names.
- Agent frontmatter fields, permission identifiers, code examples, and content keys.
- Other create-* packets and Python names.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `create-agent/assets/agent_template.md` | Rename/reference update | Convert the agent scaffold template filename |
| `create-agent/references/{common_pitfalls,permission_design}.md` | Rename/reference update | Convert the two snake_case guidance filenames |
| `create-agent/SKILL.md`, `README.md`, and docs | Modify | Repoint changed resource paths |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The three non-exempt resource names become kebab-case | Manifest and filesystem census match exactly |
| REQ-002 | Agent scaffold and guidance links resolve | Every old path consumer points to the correct new file |
| REQ-003 | Agent permission semantics remain unchanged | No frontmatter field, permission value, or identifier changes outside path tokens |
| REQ-004 | Already-canonical resources remain stable | `agent-vs-skill-vs-command.md` and changelog names are not rewritten |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The create-agent asset/reference resource names are kebab-case.
- **SC-002**: Agent scaffolding references the new paths with no permission-contract drift.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | create-agent scaffold docs | Generated agents may lose template links | Search old basenames and resolve every target |
| Risk | Permission examples are mistaken for filesystem names | Agent authority changes | Limit edits to path tokens and links |
| Risk | A reference is only loaded through a routed path | Static links miss it | Inspect packet routing and resource map entries |
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking. The execution report must record any routed or dynamically assembled resource path.
<!-- /ANCHOR:questions -->
