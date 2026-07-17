---
title: "Implementation Plan: cli-opencode component naming (032 phase 005.002)"
description: "Implementation plan for the cli-opencode component: build a semantic local path map for references and assets, update path-valued consumers, preserve permissions/schema semantics, and exclude the delegated playbook tree."
trigger_phrases:
  - "cli-opencode implementation plan"
  - "OpenCode asset reference rename plan"
  - "cli-external phase 002 plan"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/005-cli-external-orchestration/002-cli-opencode"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/005-cli-external-orchestration/002-cli-opencode"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored cli-opencode path plan"
    next_safe_action: "Build the component disposition map"
    blockers: []
    key_files:
      - ".opencode/skills/cli-external-orchestration/cli-opencode/SKILL.md"
      - ".opencode/skills/cli-external-orchestration/cli-opencode/references/"
      - ".opencode/skills/cli-external-orchestration/cli-opencode/assets/"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "The current non-playbook candidate set is eight reference files plus six asset files."
      - "The nested manual-testing-playbook tree is phase 005 ownership."
---
# Implementation Plan: cli-opencode component naming

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | `cli-opencode/references/`, `cli-opencode/assets/`, and their local consumers |
| **Change class** | Semantic authored-file rename and path-reference closure |
| **Execution** | Pinned BASE, source-target ledger, content/key parity, local link resolution |

### Overview
The plan maps the eight reference files and six asset files explicitly: `cli_reference.md`, `opencode_tools.md`, `agent_delegation.md`, `permissions_matrix.md`, `self_invocation_guard.md`, `integration_patterns.md`, `context_budget.md`, `destructive_scope_violations.md`, the four `permissions_matrix.*.json` assets, `prompt_quality_card.md`, and `prompt_templates.md`. It then rewrites only path-valued consumers and proves that permission/schema data and dispatch behavior did not change.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase 001 hub boundary and the 032 exemption record are available.
- [ ] Candidate/BASE SHAs and the complete local file inventory are captured.
- [ ] Every source path has an owner and a rename/exempt/protected disposition before mutation.

### Definition of Done
- [ ] All local authored candidates have unique kebab-case targets and no stale source references.
- [ ] Permission/schema keys and dispatch contracts compare equal with BASE.
- [ ] The nested playbook and protected script/tool surfaces are outside the change set.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Use a local source-target map joined to a path-reference inventory. The map distinguishes filesystem tokens from JSON keys, schema properties, code identifiers, and external paths.

### Key Components
- **References**: eight local Markdown files under `cli-opencode/references/`.
- **Assets**: four permissions-matrix JSON files plus `prompt_quality_card.md` and `prompt_templates.md`.
- **Consumers**: `SKILL.md`, `README.md`, asset links, schema `$id`/glob/path values, and active local changelog paths.
- **Protected surfaces**: `SKILL.md`, `scripts/`, `manual_testing_playbook/`, changelog history, and external skill names.

### Data Flow
BASE inventory → path/key classification → bijective local map → filesystem rename → path-valued reference update → link, schema, script, and content parity checks.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Capture all files under `references/` and `assets/`, including the four permissions-matrix examples/schema.
- [ ] Search `SKILL.md`, `README.md`, assets, and active local docs for each source basename and path segment.
- [ ] Record delegated playbook, script, changelog, Python/package, and external-path dispositions.

### Phase 2: Implementation
- [ ] Apply the explicit eight-reference and six-asset source-target map.
- [ ] Update Markdown links, `SKILL.md`/README tables, JSON schema path values/globs, and active local path references.
- [ ] Keep JSON keys, schema property names, dispatch text, scripts, and external paths unchanged unless their path value points at a mapped file.

### Phase 3: Verification
- [ ] Re-enumerate local paths and compare them with the ledger.
- [ ] Resolve all local links and inspect schema/path values for stale sources.
- [ ] Compare JSON keys, script checks, dispatch rule anchors, and protected files with BASE.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Reconcile `find` inventory with the map; fail on unknown, duplicate, collision, or stale source |
| REQ-002 | Resolve Markdown links and search path-valued references in `SKILL.md`, README, assets, and active local docs |
| REQ-003 | Compare JSON keys/schema properties, path-normalized schema values, dispatch rules, and script behavior with BASE |
| REQ-004 | Review `manual_testing_playbook/`, scripts, changelog history, Python/package names, and external paths for scope leakage |
| REQ-005 | Confirm exact source-target bijection, casefold/NFC collision absence, and git-revert reversibility |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The phase depends on phase 001's hub boundary, the 032 exemption decision record, and phase 005's ownership of all nested manual-testing-playbook paths. Phase 007 later verifies release evidence for the completed component set.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the path-only rename/reference commit if collision, stale-link, schema, or dispatch parity checks fail. If a path is found to be an external or delegated consumer, stop before mutation and return it to the owning phase rather than broadening this map.
<!-- /ANCHOR:rollback -->

