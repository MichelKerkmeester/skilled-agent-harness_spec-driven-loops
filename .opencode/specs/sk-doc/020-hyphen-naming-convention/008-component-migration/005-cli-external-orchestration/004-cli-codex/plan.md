---
title: "Implementation Plan: cli-codex component naming (020 phase 005.004)"
description: "Implementation plan for the cli-codex component: map five reference files and two prompt assets, update local path-valued consumers, preserve Codex safety and dispatch semantics, and exclude the delegated playbook tree."
trigger_phrases:
  - "cli-codex implementation plan"
  - "Codex asset reference rename plan"
  - "cli-external phase 004 plan"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/005-cli-external-orchestration/004-cli-codex"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/005-cli-external-orchestration/004-cli-codex"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored cli-codex path plan"
    next_safe_action: "Build the Codex disposition map"
    blockers: []
    key_files:
      - ".opencode/skills/cli-external-orchestration/cli-codex/SKILL.md"
      - ".opencode/skills/cli-external-orchestration/cli-codex/references/"
      - ".opencode/skills/cli-external-orchestration/cli-codex/assets/"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "The current candidate set is five reference files plus two asset files."
      - "The nested manual-testing-playbook tree is phase 005 ownership."
---
# Implementation Plan: cli-codex component naming

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | `cli-codex/references/`, `cli-codex/assets/`, and local consumers |
| **Change class** | Semantic authored-file rename and path-reference closure |
| **Execution** | Pinned BASE, seven-entry map, link resolution, Codex contract parity |

### Overview
The plan explicitly maps `cli_reference.md`, `hook_contract.md`, `agent_delegation.md`, `integration_patterns.md`, `codex_tools.md`, `prompt_quality_card.md`, and `prompt_templates.md` to hyphenated targets. It then updates local links and compares availability, model/reasoning, sandbox, review/search/image, and self-invocation guidance with BASE.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase 003 handoff and the 020 exemption record are available.
- [ ] Candidate/BASE SHAs and the complete component file inventory are captured.
- [ ] Each source path has one owner and one rename/protected/delegated disposition.

### Definition of Done
- [ ] All seven local authored candidates have unique kebab-case targets and no stale source reference.
- [ ] Codex safety and dispatch contracts compare equal with BASE.
- [ ] The nested playbook and changelog history are outside the diff.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Use a component-local source-target map joined to a path-reference inventory; distinguish filesystem names from CLI flags, model values, sandbox values, data keys, and external paths.

### Key Components
- **References**: `cli_reference.md`, `hook_contract.md`, `agent_delegation.md`, `integration_patterns.md`, and `codex_tools.md`.
- **Assets**: `prompt_quality_card.md` and `prompt_templates.md`.
- **Consumers**: component `SKILL.md`, README, and active local cross-links.
- **Protected surfaces**: the nested playbook, changelog history, safety/tool contracts, identifiers, and external skill paths.

### Data Flow
BASE inventory → path/protected classification → seven-entry map → filesystem rename → local link update → Codex contract and scope verification.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Capture all component files and the seven named candidates.
- [ ] Search `SKILL.md`, README, assets, and active local docs for source basenames and relative paths.
- [ ] Record delegated playbook, frozen changelog, tool-contract, and external-path dispositions.

### Phase 2: Implementation
- [ ] Apply the explicit five-reference and two-asset source-target map.
- [ ] Update Markdown links and active path-valued citations.
- [ ] Preserve model/reasoning flags, sandbox names, review/search/image behavior, self-invocation rules, and delegated paths.

### Phase 3: Verification
- [ ] Reconcile the final component inventory with the map.
- [ ] Resolve all local links and search for stale source names.
- [ ] Compare Codex safety/dispatch contract text and protected files with BASE.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Reconcile the component inventory with the seven-entry map; fail on unknown, duplicate, collision, or stale source |
| REQ-002 | Resolve Markdown links and search `SKILL.md`, README, assets, and active docs for stale local paths |
| REQ-003 | Compare availability, model/reasoning, sandbox, review/search/image, and self-invocation contracts with BASE |
| REQ-004 | Review playbook, changelog, identifiers/keys, Python/package names, and tool-mandated names for scope leakage |
| REQ-005 | Confirm source-target bijection, casefold/NFC collision absence, and git-revert reversibility |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The phase consumes phase 003's component-boundary handoff and the 020 exemption record. Phase 005 owns the nested playbook references; phase 007 later verifies release evidence for this component and its siblings.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the path-only rename/reference commit if a collision, stale link, or Codex-contract mismatch appears. Return external or delegated paths to their owners instead of widening this component map.
<!-- /ANCHOR:rollback -->

