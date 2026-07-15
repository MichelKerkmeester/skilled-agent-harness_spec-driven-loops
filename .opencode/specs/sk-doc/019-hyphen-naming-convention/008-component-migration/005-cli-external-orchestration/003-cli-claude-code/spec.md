---
title: "Feature Specification: cli-claude-code component naming (017 phase 005.003)"
description: "The cli-claude-code component has underscore-separated reference and prompt-asset filenames with active links from its skill and README. This phase renames those local authored names, updates path-valued references, and preserves Claude dispatch contracts and the delegated playbook tree."
trigger_phrases:
  - "cli-claude-code kebab-case migration"
  - "Claude Code reference asset naming"
  - "cli-external phase 003 naming"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/019-hyphen-naming-convention/008-component-migration/005-cli-external-orchestration/003-cli-claude-code"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-hyphen-naming-convention/008-component-migration/005-cli-external-orchestration/003-cli-claude-code"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored cli-claude phase docs"
    next_safe_action: "Freeze the Claude Code path map"
    blockers: []
    key_files:
      - ".opencode/skills/cli-external-orchestration/cli-claude-code/SKILL.md"
      - ".opencode/skills/cli-external-orchestration/cli-claude-code/README.md"
      - ".opencode/skills/cli-external-orchestration/cli-claude-code/references/"
      - ".opencode/skills/cli-external-orchestration/cli-claude-code/assets/"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "The component has four snake_case reference files and two snake_case asset files outside its delegated playbook tree."
      - "SKILL.md, changelog history, JSON/data keys, and Python/package exemptions remain protected."
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: cli-claude-code component naming

> Phase adjacency under the cli-external-orchestration component parent: predecessor `002-cli-opencode`; successor `004-cli-codex`; `005-manual-testing-playbook` owns the nested playbook tree.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/019-hyphen-naming-convention/008-component-migration/005-cli-external-orchestration/003-cli-claude-code |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Owner skill** | cli-external-orchestration / cli-claude-code |
| **Origin** | Phase 003 of the cli-external-orchestration subtree under the 017 kebab-case filesystem-naming program |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The cli-claude-code component stores its CLI reference, tool/delegation references, integration guide, and prompt assets under underscore-separated filenames. `SKILL.md`, README links, and cross-document citations depend on those names, so renaming files without a reference closure would break the component's documented dispatch surface.

This phase renames the six local authored candidates to kebab-case, updates only path-valued consumers, and proves that Claude-specific invocation, auth, tool, and structured-output semantics remain unchanged.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Rename `references/cli_reference.md`, `agent_delegation.md`, `claude_tools.md`, and `integration_patterns.md` to kebab-case.
- Rename `assets/prompt_quality_card.md` and `assets/prompt_templates.md` to kebab-case.
- Update local Markdown links, `SKILL.md`/README reference tables, and active path-valued citations.
- Inventory all other component names and record already-compliant, tool-mandated, generated, frozen, and delegated dispositions.

### Out of Scope
- `cli-claude-code/manual_testing_playbook/`, including category directories and scenario files; phase 005 owns it.
- Root hub, benchmark, and sibling CLI component paths; phases 001, 002, 004, and 006 own them.
- `SKILL.md` as a filename, changelog history, code identifiers, JSON/YAML/TOML keys, frontmatter fields, Python/package names, and tool-mandated files.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `cli-claude-code/references/` | Rename/reference update | Map four reference filenames to kebab-case and update local links |
| `cli-claude-code/assets/` | Rename/reference update | Map prompt quality card and prompt templates filenames |
| `cli-claude-code/SKILL.md`, `README.md` | Reference update | Repoint active local paths without changing dispatch semantics |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 [P0] | All local authored candidates are mapped | Four reference and two asset source names have unique kebab-case targets; any new candidate is dispositioned before mutation |
| REQ-002 [P0] | Active local references resolve | `SKILL.md`, README, asset citations, and active local documents contain no stale source path |
| REQ-003 [P0] | Claude dispatch behavior is preserved | Invocation flags, auth guidance, tool names, structured-output contract, and self-invocation rules match BASE |
| REQ-004 [P1] | Delegated and exempt surfaces remain separate | Playbook, changelog, identifiers/keys, Python/package names, and tool-mandated filenames are unchanged |
| REQ-005 [P1] | The map is reversible | Source-target entries are bijective, collision-free, and git-revertable |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The six local authored files use kebab-case names.
- **SC-002**: All local active links and path-valued citations resolve.
- **SC-003**: Claude-specific dispatch and structured-output contracts match BASE.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

The main risk is treating provider flags, tool names, structured-output keys, or external skill paths as filenames. The phase depends on the 017 path-vs-key boundary and phase 005's playbook ownership; a six-entry map plus reference and contract comparisons keeps the rename narrow.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking. External references must be classified separately and changed only when they target a path owned by this phase.
<!-- /ANCHOR:questions -->

