---
title: "Implementation Plan: verify ai-council agent naming (017 phase 001)"
description: "Implementation Plan for phase 001 of the 017 agents component migration: a read-only ai-council filename candidate audit."
trigger_phrases:
  - "ai-council agent naming implementation plan"
  - "agents phase 001 implementation plan"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/019-hyphen-naming-convention/008-component-migration/014-agents"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-hyphen-naming-convention/008-component-migration/014-agents/001-ai-council-verify"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored ai-council phase docs"
    next_safe_action: "Execute verify-only inventory"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Implementation Plan: AI Council Agent Naming Verification

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
This phase inventories the ai-council definition in each runtime agent directory and classifies only the filesystem basename. The expected result is an empty rename-candidate set because the three observed names are already kebab-case. The output is path-level evidence for the sibling-independent agents gate.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The 017 naming policy and exemption boundary are available
- [ ] The pinned BASE and the three runtime agent directories are known
- [ ] The expected ai-council definition paths are listed in spec.md
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

- OpenCode definition: .opencode/agents/ai-council.md
- Claude definition: .claude/agents/ai-council.md
- Codex definition: .codex/agents/ai-council.toml

A path is a candidate only when its in-scope filesystem basename contains snake_case and is not covered by the program exemption set. The three observed basenames are already kebab-case, so the expected source-to-target map is empty. Agent prompt text, frontmatter fields, TOML keys, and other identifiers are not inputs to this classifier.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Confirm the pinned BASE and read the 017 convention/exemption policy.
- Confirm all three expected ai-council definition paths exist in the runtime inventory.

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
| REQ-001 | Path-level inventory lists .opencode/agents/ai-council.md, .claude/agents/ai-council.md, and .codex/agents/ai-council.toml |
| REQ-002 | Candidate report records exactly ∅ and shows each basename as kebab-case |
| REQ-003 | Review confirms only filesystem names were classified and exemption classes were not treated as debt |
| REQ-004 | Read-only diff/path audit shows no runtime definition or content change |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 017 convention policy and exemption boundary | Internal | Required | Candidate classification has no authoritative scope |
| Pinned BASE inventory | Internal | Required | The zero-candidate result cannot be reproduced |
| 014-agents-gate | Internal | Downstream | The leaf evidence cannot be rolled up |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A path is missing, an unexpected definition appears, or a runtime file is modified during verification.
- **Procedure**: Stop the phase, discard the uncommitted evidence-only change if required, and rerun the inventory from the pinned BASE. No runtime rollback is needed because this phase performs no migration.
<!-- /ANCHOR:rollback -->
