---
title: "Feature Specification: cli-opencode component naming (017 phase 005.002)"
description: "The cli-opencode component has snake_case reference and asset filenames, including permissions-matrix examples/schema and prompt assets, with active links from SKILL.md, README.md, and JSON path values. This phase renames those local filesystem names and closes their references while preserving tool contracts and delegated playbook ownership."
trigger_phrases:
  - "cli-opencode kebab-case migration"
  - "OpenCode reference asset naming"
  - "cli-external phase 002 naming"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/008-component-migration/005-cli-external-orchestration/002-cli-opencode"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/008-component-migration/005-cli-external-orchestration/002-cli-opencode"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored cli-opencode phase docs"
    next_safe_action: "Freeze the cli-opencode path map"
    blockers: []
    key_files:
      - ".opencode/skills/cli-external-orchestration/cli-opencode/SKILL.md"
      - ".opencode/skills/cli-external-orchestration/cli-opencode/README.md"
      - ".opencode/skills/cli-external-orchestration/cli-opencode/references/"
      - ".opencode/skills/cli-external-orchestration/cli-opencode/assets/"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "The component has 8 snake_case reference files and 6 snake_case asset files outside its delegated playbook tree."
      - "SKILL.md, scripts, changelog history, JSON keys, and Python/package exemptions remain protected."
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: cli-opencode component naming

> Phase adjacency under the cli-external-orchestration component parent: predecessor `001-hub-root-and-shared`; successor `003-cli-claude-code`; `005-manual-testing-playbook` owns the nested playbook tree.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/017-hyphen-naming-convention/008-component-migration/005-cli-external-orchestration/002-cli-opencode |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Owner skill** | cli-external-orchestration / cli-opencode |
| **Origin** | Phase 002 of the cli-external-orchestration subtree under the 017 kebab-case filesystem-naming program |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The cli-opencode component uses underscore-separated filenames in `references/` and `assets/`, and those names are loaded by `SKILL.md`, README tables, prompt assets, changelog references, and permissions-matrix path values. A directory-only change would leave dispatch guidance and schema globs pointing at stale sources.

This phase maps every local authored candidate to a unique kebab-case target, updates path-valued consumers, and preserves dispatch behavior, data keys, and the delegated manual-testing-playbook tree.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Rename reference files: `cli_reference.md`, `opencode_tools.md`, `agent_delegation.md`, `permissions_matrix.md`, `self_invocation_guard.md`, `integration_patterns.md`, `context_budget.md`, and `destructive_scope_violations.md` to hyphenated filenames.
- Rename asset files: `permissions_matrix.schema.json`, `permissions_matrix.example-packet-local.json`, `permissions_matrix.example-readonly.json`, `permissions_matrix.example-repo-wide.json`, `prompt_quality_card.md`, and `prompt_templates.md` to hyphenated filenames.
- Update local Markdown links, `SKILL.md` mode/reference tables, README links, changelog path references where active, schema `$id`/glob/path values, and other local path-valued consumers.
- Inventory `scripts/` and confirm its already-hyphenated JavaScript files and executable behavior remain unchanged.

### Out of Scope
- `cli-opencode/manual_testing_playbook/`, including its categories and scenarios; phase 005 owns it.
- Root `benchmark/`, root hub files, sibling CLI components, and frozen changelog history except for active path references owned by this phase.
- `SKILL.md` and other tool-mandated filenames, Python `.py` files/package directories, JSON keys, code identifiers, frontmatter fields, and benchmark payload semantics.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `cli-opencode/references/` | Rename/reference update | Map the eight named snake_case reference files to kebab-case and update local links |
| `cli-opencode/assets/` | Rename/reference update | Map four permissions-matrix files and two prompt assets to kebab-case |
| `cli-opencode/SKILL.md`, `README.md` | Reference update | Repoint active local references without changing dispatch rules |
| `cli-opencode/scripts/` | Protected inventory | Confirm current hyphenated script names and mode/exec behavior |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 [P0] | All local authored candidates are mapped | The eight reference and six asset source names have unique exact kebab-case targets; any execution-time candidate is ledgered before mutation |
| REQ-002 [P0] | Active path references resolve | `SKILL.md`, README, asset links, schema path values/globs, and active changelog references contain no stale local source path |
| REQ-003 [P0] | Dispatch and permission contracts are preserved | Routing prose, script behavior, JSON keys, schema properties, `$id` semantics, and permissions meaning are unchanged except for required path values |
| REQ-004 [P1] | Delegated and exempt surfaces remain separate | The nested playbook, Python/package names, tool-mandated names, generated output, and frozen history are not renamed |
| REQ-005 [P1] | The map is reversible | Source-target entries are bijective, collision-free, and support a clean git revert |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every in-scope non-playbook cli-opencode authored name is kebab-case.
- **SC-002**: All local active links, globs, schema path values, and README/SKILL references resolve.
- **SC-003**: Dispatch rules, permission semantics, JSON keys, and script behavior match BASE.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

The main risk is rewriting an underscore inside a permissions key, schema property, or external cross-skill identifier as if it were a filename. The phase depends on the 017 path-vs-key boundary and the phase 005 playbook handoff; a path ledger plus content/key comparison prevents scope leakage.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking. Any reference whose target is outside cli-opencode must be classified as an external consumer and left to its owning phase unless it points at a path renamed here.
<!-- /ANCHOR:questions -->

