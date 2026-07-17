---
title: "Implementation Plan: verify design agent naming (032 phase 009)"
description: "Implementation Plan for phase 009 of the 032 agents component migration: a read-only design filename candidate audit."
trigger_phrases:
  - "design agent naming implementation plan"
  - "agents phase 009 implementation plan"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/014-agents"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/014-agents/009-design-verify"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored design phase docs"
    next_safe_action: "Execute verify-only inventory"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Implementation Plan: Design Agent Naming Verification

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | .opencode/agents, .claude/agents, and .codex/agents |
| **Change class** | Verify-only filename candidate inventory |
| **Execution** | Read-only against the pinned BASE; migration is not executed |

### Overview
This phase inventories the design definition in each runtime agent directory and classifies only the filesystem basename. The expected result is an empty rename-candidate set because the three observed names are already kebab-case. The output is path-level evidence for the sibling-independent agents gate.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The 032 naming policy and exemption boundary are available
- [ ] The pinned BASE and the three runtime agent directories are known
- [ ] The expected design definition paths are listed in spec.md
- [ ] The phase is explicitly verify-only

### Definition of Done
- [ ] All three definition paths are recorded with runtime and extension
- [ ] The rename-candidate set is recorded as exactly ∅
- [ ] No runtime agent file or agent content was changed
- [ ] Checklist evidence is sufficient for the 014-agents-gate rollup
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

The phase uses a deterministic three-path inventory:

- OpenCode definition: .opencode/agents/design.md
- Claude definition: .claude/agents/design.md
- Codex definition: .codex/agents/design.toml

A path is a candidate only when its in-scope filesystem basename contains snake_case and is not covered by the program exemption set. The three observed basenames are already kebab-case, so the expected source-to-target map is empty. Agent prompt text, frontmatter fields, TOML keys, and other identifiers are not inputs to this classifier.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Confirm the pinned BASE and read the 032 convention/exemption policy.
- Confirm all three expected design definition paths exist in the runtime inventory.

### Phase 2: Implementation
- Record each path, runtime, extension, and basename classification.
- Compare each basename with the kebab-case rule and apply the exemption boundary.
- Record an explicit empty candidate set; do not create a rename or reference-rewrite task.

### Phase 3: Verification
- Re-run the exact three-path inventory against the pinned baseline.
- Confirm no in-scope snake_case segment appears in any of the three filenames.
- Confirm the evidence is limited to this component and contains no runtime mutation.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Path-level inventory lists .opencode/agents/design.md, .claude/agents/design.md, and .codex/agents/design.toml |
| REQ-002 | Candidate report records exactly ∅ and shows each basename as kebab-case |
| REQ-003 | Review confirms only filesystem names were classified and exemption classes were not treated as debt |
| REQ-004 | Read-only diff/path audit shows no runtime definition or content change |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 032 convention policy and exemption boundary | Internal | Required | Candidate classification has no authoritative scope |
| Pinned BASE inventory | Internal | Required | The zero-candidate result cannot be reproduced |
| 014-agents-gate | Internal | Downstream | The leaf evidence cannot be rolled up |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A path is missing, an unexpected definition appears, or a runtime file is modified during verification.
- **Procedure**: Stop the phase, discard the uncommitted evidence-only change if required, and rerun the inventory from the pinned BASE. No runtime rollback is needed because this phase performs no migration.
<!-- /ANCHOR:rollback -->
