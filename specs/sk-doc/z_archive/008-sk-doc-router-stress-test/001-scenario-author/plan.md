---
title: "Implementation Plan: Phase 1: scenario-author"
description: "cli-copilot authors 16 files (15 scenarios + index) in one batched dispatch. Claude orchestrator scaffolds dirs and validates outputs."
trigger_phrases: ["071/001 plan", "scenario-author plan"]
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/z_archive/008-sk-doc-router-stress-test/001-scenario-author"
    last_updated_at: "2026-05-05T12:30:00Z"
    last_updated_by: "claude-orchestrator"
    recent_action: "Authored phase 1 plan.md"
    next_safe_action: "Wait for copilot, validate, commit"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase1-authoring"
      parent_session_id: null
    completion_pct: 50
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 1: scenario-author

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown (scenario .md files); cli-copilot for batch authoring |
| **Framework** | sk-code playbook structure as template |
| **Storage** | `.opencode/skills/sk-doc/manual_testing_playbook/` |
| **Testing** | grep-based REQ verification + manual review |

### Overview
Claude orchestrator scaffolds 5 category directories. cli-copilot (claude-opus-4.7) authors all 16 files in a single batched dispatch (~2-3 min). Post-completion, Claude verifies REQ-001..006, authors implementation-summary, commits.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] sk-doc/SKILL.md §2 Smart Routing readable (RESOURCE_MAP enumerated)
- [x] sk-code/manual_testing_playbook structural template available
- [x] cli-copilot reliable in this session (7 deep-review iterations earlier)

### Definition of Done
- [ ] 15 scenario files + 1 index file exist
- [ ] Each scenario has required frontmatter + sections
- [ ] One commit on main
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single batched authoring dispatch. cli-copilot handles all 16 files in one prompt to amortize loading cost. No iterative refinement needed — scenario format is well-specified upfront.

### Key Components
- **5 category dirs** (intent-detection, resource-loading, unknown-fallback, cross-cli-dispatch, token-cost-baseline)
- **15 scenario .md files** (3 per category)
- **1 index file** (manual_testing_playbook.md)
- **cli-copilot** (claude-opus-4.7) as authoring executor
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Create 5 category subdirectories
- [x] Read sk-doc/SKILL.md §2 RESOURCE_MAP for intent enumeration
- [x] Identify sk-code/manual_testing_playbook/01-001 as structural template

### Phase 2: Core Implementation
- [ ] Dispatch cli-copilot with batch authoring prompt
- [ ] Wait for completion (monitor for 16 files present)

### Phase 3: Verification
- [ ] `find .opencode/skills/sk-doc/manual_testing_playbook -name "[0-9][0-9][0-9]-*.md" | wc -l` = 15
- [ ] `test -f .opencode/skills/sk-doc/manual_testing_playbook/manual_testing_playbook.md`
- [ ] grep frontmatter fields across scenarios
- [ ] Commit on main with prescribed message
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Each scenario file structure | grep + find |
| Integration | Full playbook directory | ls + wc -l |
| Manual | Scenario realism | spot-read 2-3 scenarios |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| cli-copilot CLI | External | Green | Fall back to direct Claude authoring (~30 min for 16 files) |
| sk-doc/SKILL.md RESOURCE_MAP | Internal | Green | Can't author scenarios without intent vocabulary |
| sk-code playbook template | Internal | Green | Fall back to ad-hoc scenario format |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Copilot generates stub or broken scenarios; manual review fails
- **Procedure**: `git reset --hard HEAD~1` to revert Phase 1 commit; re-dispatch with refined prompt
- **Granularity**: One commit covers Phase 1 entirely
<!-- /ANCHOR:rollback -->
