---
title: "Feature Specification: sk-doc hub root and shared backbone"
description: "The sk-doc hub's shared assets, references, and one CommonJS contract file use snake_case filesystem names. This phase applies the 032 kebab-case rule to those non-exempt names while preserving SKILL.md, registry metadata, Python files, facade symlink behavior, and path-versus-key boundaries."
trigger_phrases:
  - "sk-doc hub root shared naming"
  - "sk-doc shared backbone kebab-case"
  - "032 hub root and shared"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/003-sk-doc/001-hub-root-and-shared"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/003-sk-doc/001-hub-root-and-shared"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored hub shared phase docs"
    next_safe_action: "Execute hub and shared rename map"
    blockers: []
    key_files: [".opencode/skills/sk-doc/SKILL.md", ".opencode/skills/sk-doc/shared/", ".opencode/skills/sk-doc/scripts/"]
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr_rules.md -->

# Feature Specification: sk-doc hub root and shared backbone

> Phase 001 under the `003-sk-doc` parent. It supplies the shared naming boundary used by later sk-doc component phases.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | `sk-doc/020-hyphen-naming-convention/008-component-migration/003-sk-doc/001-hub-root-and-shared` |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Owner skill** | sk-doc |
| **Origin** | Phase 001 of the sk-doc component migration |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The shared backbone is referenced by every create-* packet and by the root scripts facade. Its non-exempt asset, reference, JSON, and CommonJS names still contain underscores, so a blind sweep could break path consumers, alter tool-mandated names, or turn Python-exempt paths into invalid imports. This phase establishes the bounded rename/reference closure for the hub and shared area.

The outcome is a kebab-case shared filesystem surface with unchanged runtime contracts, symlink semantics, Python names, metadata keys, and tool-mandated filenames.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Rename `shared/assets/changelog_template.md`, `frontmatter_templates.md`, `llmstxt_templates.md`, `skill_contract.json`, and `template_rules.json` to kebab-case.
- Rename `shared/references/core_standards.md`, `evergreen_packet_id_rule.md`, `frontmatter_versioning.md`, `hvr_rules.md`, and `quick_reference.md` to their kebab-case forms.
- Rename `shared/scripts/skill_contract.cjs` to `skill-contract.cjs`.
- Update path-valued links and loader references in the hub, shared README, packet resources, and any registry-facing manifest that points at these files.
- Preserve the root `scripts/` facade symlinks, executable bits, relative-target semantics, and all Python `.py` names.

### Out of Scope

- `SKILL.md`, `README.md`, `mode-registry.json`, `hub-router.json`, `description.json`, and `graph-metadata.json`.
- Python script filenames and Python package directories, including `shared/scripts/skill_contract.py` and `check_no_*.py`.
- JSON/YAML/TOML keys, frontmatter field names, code identifiers, and prose examples that are not filesystem paths.
- The root `scripts/tests/` fixtures and all create-* packet-owned resource names, handled by phases 002 and 003-create-packets.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-doc/shared/assets/*` | Rename/reference update | Convert the five listed non-exempt asset names to kebab-case |
| `.opencode/skills/sk-doc/shared/references/*` | Rename/reference update | Convert the five underscore-bearing reference names and repoint consumers |
| `.opencode/skills/sk-doc/shared/scripts/skill-contract.cjs` | Rename/reference update | Convert the non-Python script name and update callers |
| `.opencode/skills/sk-doc/scripts/` | Preserve/update targets | Keep facade links intact while repointing changed shared targets |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every in-scope shared non-Python snake_case name has a kebab-case target | The phase rename manifest accounts for all five asset names, the reference name, and `skill_contract.cjs`; no unknown bucket remains |
| REQ-002 | Tool-mandated and exempt names remain exact | `SKILL.md`, registry/metadata files, `.py` files, and Python package directories have no rename entry |
| REQ-003 | Shared path consumers follow the target names | `rg` over sk-doc finds no stale path reference to any old shared name outside frozen history or an intentional content example |
| REQ-004 | The root scripts facade remains usable | Each existing symlink retains its relative target and mode, and any target moved by this phase resolves from the same facade path |
| REQ-005 | The phase does not rewrite non-path identifiers or keys | Diff review shows no code identifier, JSON/YAML/TOML key, or frontmatter field change caused by the filesystem rename |
| REQ-006 | The shared backbone remains consumable by every packet | Shared references from the hub and create-* packets resolve after the rename map is applied |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The hub/shared rename map is complete, exemption-aware, and collision-free.
- **SC-002**: Shared resources and facade links resolve through kebab-case paths without changing tool contracts.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | 001 convention policy and scope | Incorrect exemption classification | Use its rule and exemption table as the only naming authority |
| Risk | A shared path is referenced from a packet resource not found by a local search | Runtime resource loading fails | Run whole-repository path search and resolve every changed path from the sk-doc root |
| Risk | A facade symlink is replaced by a regular file | Script dispatch or permissions change | Record link target, link mode, and `readlink` result before and after |
| Risk | A JSON filename is confused with a JSON key | Configuration behavior changes | Limit edits to path tokens and review key/value diffs separately |
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking. The execution report must record any dynamic path construction that cannot be proven by static search.
<!-- /ANCHOR:questions -->
