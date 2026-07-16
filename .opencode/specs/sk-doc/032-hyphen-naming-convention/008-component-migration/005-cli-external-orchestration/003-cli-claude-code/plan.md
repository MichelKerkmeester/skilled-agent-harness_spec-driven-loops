---
title: "Implementation Plan: cli-claude-code component naming (032 phase 005.003)"
description: "Implementation plan for the cli-claude-code component: map four reference files and two prompt assets, update local path-valued consumers, preserve Claude dispatch semantics, and exclude the delegated playbook tree."
trigger_phrases:
  - "cli-claude-code implementation plan"
  - "Claude Code asset reference rename plan"
  - "cli-external phase 003 plan"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/032-hyphen-naming-convention/008-component-migration/005-cli-external-orchestration/003-cli-claude-code"
_memory:
  continuity:
    packet_pointer: "sk-doc/032-hyphen-naming-convention/008-component-migration/005-cli-external-orchestration/003-cli-claude-code"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored cli-claude path plan"
    next_safe_action: "Build the Claude Code disposition map"
    blockers: []
    key_files:
      - ".opencode/skills/cli-external-orchestration/cli-claude-code/SKILL.md"
      - ".opencode/skills/cli-external-orchestration/cli-claude-code/references/"
      - ".opencode/skills/cli-external-orchestration/cli-claude-code/assets/"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "The current candidate set is four reference files plus two asset files."
      - "The nested manual-testing-playbook tree is phase 005 ownership."
---
# Implementation Plan: cli-claude-code component naming

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | `cli-claude-code/references/`, `cli-claude-code/assets/`, and local consumers |
| **Change class** | Semantic authored-file rename and path-reference closure |
| **Execution** | Pinned BASE, six-entry map, link resolution, Claude contract parity |

### Overview
The plan explicitly maps `cli_reference.md`, `agent_delegation.md`, `claude_tools.md`, `integration_patterns.md`, `prompt_quality_card.md`, and `prompt_templates.md` to hyphenated targets. It then updates local links and compares invocation, authentication, tools, structured output, and self-invocation guidance with BASE.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase 002 handoff and the 032 exemption record are available.
- [ ] Candidate/BASE SHAs and the complete component file inventory are captured.
- [ ] Each source path has one owner and one rename/protected/delegated disposition.

### Definition of Done
- [ ] All six local authored candidates have unique kebab-case targets and no stale source reference.
- [ ] Claude dispatch and structured-output contracts compare equal with BASE.
- [ ] The nested playbook and changelog history are outside the diff.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Use a component-local source-target map joined to a path-reference inventory; distinguish filesystem names from provider flags, tool identifiers, data keys, and external paths.

### Key Components
- **References**: `cli_reference.md`, `agent_delegation.md`, `claude_tools.md`, and `integration_patterns.md`.
- **Assets**: `prompt_quality_card.md` and `prompt_templates.md`.
- **Consumers**: component `SKILL.md`, README, and active local cross-links.
- **Protected surfaces**: the nested playbook, changelog history, tool contracts, identifiers, and external skill paths.

### Data Flow
BASE inventory → path/protected classification → six-entry map → filesystem rename → local link update → contract and scope verification.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Capture all component files and the six named candidates.
- [ ] Search `SKILL.md`, README, assets, and active local docs for source basenames and relative paths.
- [ ] Record delegated playbook, frozen changelog, tool-contract, and external-path dispositions.

### Phase 2: Implementation
- [ ] Apply the explicit four-reference and two-asset source-target map.
- [ ] Update Markdown links and active path-valued citations.
- [ ] Preserve provider flags, auth/tool vocabulary, structured-output keys, self-invocation rules, and delegated paths.

### Phase 3: Verification
- [ ] Reconcile the final component inventory with the map.
- [ ] Resolve all local links and search for stale source names.
- [ ] Compare dispatch contract text and protected files with BASE.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Reconcile the component inventory with the six-entry map; fail on unknown, duplicate, collision, or stale source |
| REQ-002 | Resolve Markdown links and search `SKILL.md`, README, assets, and active docs for stale local paths |
| REQ-003 | Compare invocation/auth/tool/structured-output/self-invocation contract text and protected file hashes with BASE |
| REQ-004 | Review playbook, changelog, identifiers/keys, Python/package names, and tool-mandated names for scope leakage |
| REQ-005 | Confirm source-target bijection, casefold/NFC collision absence, and git-revert reversibility |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The phase consumes phase 002's component-boundary handoff and the 032 exemption record. Phase 005 owns the nested playbook references; phase 007 later verifies release evidence for this component and its siblings.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the path-only rename/reference commit if a collision, stale link, or Claude-contract mismatch appears. Return external or delegated paths to their owners instead of widening this component map.
<!-- /ANCHOR:rollback -->

