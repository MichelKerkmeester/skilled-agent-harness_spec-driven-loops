---
title: "Feature Specification: cli-codex component naming (017 phase 005.004)"
description: "The cli-codex component has underscore-separated reference and prompt-asset filenames with active links from its skill and README. This phase renames those local authored names, updates path-valued references, and preserves Codex availability, sandbox, model, and review contracts."
trigger_phrases:
  - "cli-codex kebab-case migration"
  - "Codex reference asset naming"
  - "cli-external phase 004 naming"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/008-component-migration/005-cli-external-orchestration/004-cli-codex"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/008-component-migration/005-cli-external-orchestration/004-cli-codex"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored cli-codex phase docs"
    next_safe_action: "Freeze the Codex path map"
    blockers: []
    key_files:
      - ".opencode/skills/cli-external-orchestration/cli-codex/SKILL.md"
      - ".opencode/skills/cli-external-orchestration/cli-codex/README.md"
      - ".opencode/skills/cli-external-orchestration/cli-codex/references/"
      - ".opencode/skills/cli-external-orchestration/cli-codex/assets/"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "The component has five snake_case reference files and two snake_case asset files outside its delegated playbook tree."
      - "SKILL.md, changelog history, CLI/data identifiers, and Python/package exemptions remain protected."
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: cli-codex component naming

> Phase adjacency under the cli-external-orchestration component parent: predecessor `003-cli-claude-code`; successor `005-manual-testing-playbook`; `005-manual-testing-playbook` owns the nested playbook tree.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/017-hyphen-naming-convention/008-component-migration/005-cli-external-orchestration/004-cli-codex |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Owner skill** | cli-external-orchestration / cli-codex |
| **Origin** | Phase 004 of the cli-external-orchestration subtree under the 017 kebab-case filesystem-naming program |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The cli-codex component stores its CLI, Codex-tool, agent-delegation, integration, and hook-contract references under underscore-separated filenames, as well as underscore-separated prompt assets. `SKILL.md`, README links, and cross-document citations depend on those names; a directory-only rename would leave the documented Codex dispatch surface broken.

This phase maps the seven local authored candidates to kebab-case, updates path-valued consumers, and proves that Codex availability, model/reasoning, sandbox, review, web-search, and self-invocation guidance remain unchanged.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Rename `references/cli_reference.md`, `hook_contract.md`, `agent_delegation.md`, `integration_patterns.md`, and `codex_tools.md` to kebab-case.
- Rename `assets/prompt_quality_card.md` and `assets/prompt_templates.md` to kebab-case.
- Update local Markdown links, `SKILL.md`/README reference tables, and active path-valued citations.
- Inventory all other component paths and record compliant, protected, generated, frozen, delegated, and exempt dispositions.

### Out of Scope
- `cli-codex/manual_testing_playbook/`, including category directories and scenario files; phase 005 owns it.
- Root hub, benchmark, and sibling CLI component paths; phases 001–003 and 006 own them.
- `SKILL.md` as a filename, changelog history, code/CLI identifiers, JSON/YAML/TOML keys, frontmatter fields, Python/package names, and tool-mandated files.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `cli-codex/references/` | Rename/reference update | Map five reference filenames to kebab-case and update local links |
| `cli-codex/assets/` | Rename/reference update | Map prompt quality card and prompt templates filenames |
| `cli-codex/SKILL.md`, `README.md` | Reference update | Repoint active local paths without changing Codex contracts |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 [P0] | All local authored candidates are mapped | Five reference and two asset source names have unique kebab-case targets; any execution-time candidate is dispositioned before mutation |
| REQ-002 [P0] | Active local references resolve | `SKILL.md`, README, asset links, and active component documents contain no stale source path |
| REQ-003 [P0] | Codex contracts are preserved | Availability/self-invocation guards, model/reasoning flags, sandbox modes, review/search/image guidance, and handback semantics match BASE |
| REQ-004 [P1] | Delegated and exempt surfaces remain separate | Playbook, changelog, identifiers/keys, Python/package names, and tool-mandated filenames are unchanged |
| REQ-005 [P1] | The map is reversible | Source-target entries are bijective, collision-free, and git-revertable |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The seven local authored files use kebab-case names.
- **SC-002**: All local active links and path-valued citations resolve.
- **SC-003**: Codex execution, safety, and review contracts match BASE.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

The main risk is treating Codex flags, model names, sandbox values, or structured data keys as filesystem names. The phase depends on the 017 path-vs-key boundary and phase 005's playbook ownership; a seven-entry map and contract comparison prevent semantic drift.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking. External references are classified separately and changed only when they target a path owned by this phase.
<!-- /ANCHOR:questions -->

