---
title: "Implementation Plan: 009 RM-8 deep-review iteration prompt hardening"
description: "Surgical edit to deep-review iteration prompt template adding an explicit allowed-write list and destructive-verb ban under §CONSTRAINTS, with no behavior change to the dispatch contract or YAML workflow."
trigger_phrases:
  - "rm-8 plan"
  - "prompt hardening plan"
  - "deep-review prompt template edit"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/002-spec-kit-internals/002-template-levels/009-harden-deep-review-iteration-prompts"
    last_updated_at: "2026-05-11T05:51:00Z"
    last_updated_by: "main-claude-opus-4.7"
    recent_action: "Authored plan from spec.md"
    next_safe_action: "Apply prompt template edit, then author tasks.md"
    blockers: []
    key_files:
      - ".opencode/skills/deep-review/assets/prompt_pack_iteration.md.tmpl"
    session_dedup:
      fingerprint: "sha256:rm8-009-plan-author-2026-05-11"
      session_id: "main-rm8-009-2026-05-11"
      parent_session_id: null
    completion_pct: 25
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: 009 RM-8 deep-review iteration prompt hardening

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown template with curly-brace token substitution |
| **Framework** | `renderPromptPack` (in deep-review skill) |
| **Storage** | None — text-only template |
| **Testing** | Manual smoke under the 013 phase-parent dispatch that motivated this packet |

### Overview
Insert 8–15 lines under the existing §CONSTRAINTS block in `prompt_pack_iteration.md.tmpl` listing the exact paths the agent is permitted to write to, the shell verbs banned from being executed against any other path, and the required `scope_violation` finding action when an out-of-scope mutation would otherwise occur. No token additions; no YAML changes; no contract changes.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (spec.md §2/§3)
- [x] Success criteria measurable (spec.md §5)
- [x] Dependencies identified (none beyond the prompt template file itself)

### Definition of Done
- [ ] Prompt template edit applied and committed
- [ ] All five state-path tokens (`{state_paths_iteration_pattern}`, `{state_paths_state_log}`, `{state_paths_delta_pattern}`, `{state_paths_strategy}`, `{state_paths_findings_registry}`) appear in the allowed-write list
- [ ] All listed banned verbs (`rm`, `git rm`, `mv`, `sed -i`, `rmdir`, `> file` truncate, `find -delete`) appear literally in the edit
- [ ] Smoke run on `010-doctor-update-orchestrator` (the worktree-isolated dispatch) shows no out-of-scope writes
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Template hardening only. No new components, no new abstractions.

### Key Components
- **`prompt_pack_iteration.md.tmpl`**: the single artifact under edit. Located at `.opencode/skills/deep-review/assets/prompt_pack_iteration.md.tmpl`.
- **`renderPromptPack`** (caller): unchanged. The token substitution surface stays identical because no new tokens are introduced.

### Data Flow
No change. Prompt rendered → executor stdin (cli-opencode/cli-codex/cli-gemini/cli-claude-code) → model receives instructions including the new constraint block.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm template file path and current §CONSTRAINTS block content (lines 52–59 of current revision)
- [x] Verify all five `{state_paths_*}` tokens are already substituted in the template

### Phase 2: Core Implementation
- [ ] Insert allowed-write list after the current `- Review target is READ-ONLY. Do not modify reviewed files.` line
- [ ] Insert destructive-verb ban naming `rm`, `git rm`, `mv`, `sed -i`, `rmdir`, output-redirect truncate, `find -delete`
- [ ] Insert `scope_violation` finding instruction for would-be out-of-scope mutations

### Phase 3: Verification
- [ ] Render-time substitution check (no broken tokens)
- [ ] Live smoke under cli-opencode + deepseek/deepseek-v4-pro on 013 phase parent
- [ ] Post-dispatch `git status` clean outside `010-doctor-update-orchestrator/review/`
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Manual | Token substitution sanity check on rendered prompt | `cat` rendered file from a single iteration |
| Live smoke | 10-iteration deep-review dispatch on the 013 phase parent | `/deep:start-review-loop:auto` inside isolated worktree |
| Recovery | git restore from `edf617470` if anything destructive recurs | `git restore .` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| None | — | — | — |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Edit causes prompt-render failure, or downstream YAML workflow rejects the rendered prompt.
- **Procedure**: `git revert <commit-sha>` of the prompt-hardening commit. Template returns to current revision with no other side effects.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
