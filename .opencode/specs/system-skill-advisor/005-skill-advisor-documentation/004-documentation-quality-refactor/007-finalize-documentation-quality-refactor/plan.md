---
title: "Implementation Plan: 007-finalize-documentation-quality-refactor"
description: "Single-dispatch cli-opencode + DeepSeek API execution covering semicolon HVR, F34 playbook restructure, 4 new ref docs, Tier D decision doc."
trigger_phrases:
  - "007 deferred final plan"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/005-skill-advisor-documentation/004-documentation-quality-refactor/007-finalize-documentation-quality-refactor"
    last_updated_at: "2026-05-16T00:00:00Z"
    last_updated_by: "claude-opus-4-7-1m"
    recent_action: "Authored plan"
    next_safe_action: "Dispatch opencode"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "007-plan"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions: []
---
# Implementation Plan: 007-finalize-documentation-quality-refactor

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown |
| **Framework** | cli-opencode + DeepSeek API |
| **Storage** | n/a |
| **Testing** | validate.sh --strict + recursive grep gates + scope-diff verification |

### Overview
Single `opencode run` dispatch with `--model deepseek/deepseek-v4-pro --variant high --agent general --format json --dir <repo-root>` executes the entire scope. Background dispatch with `</dev/null`. Post-dispatch verification + impl-summary fill done by main agent.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Recovery baseline recorded
- [x] Provider auth pre-flight passed (DeepSeek API configured)
- [x] RM-8 mitigation layers identified
- [x] Scope locked in spec.md ALLOWED WRITE PATHS list

### Definition of Done
- [ ] Dispatch returns non-error
- [ ] Semicolon count drops by ≥ 80%
- [ ] 4 new ref docs ship
- [ ] deferred-decisions.md ships
- [ ] No out-of-scope writes in git diff
- [ ] validate.sh --strict on 007 passes
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single-shot cli-opencode dispatch with explicit scope-lock prompt. RM-8 4-layer mitigation applied. Post-dispatch human verification.

### Key Components
- `opencode run` binary (v1.15.1)
- DeepSeek API (provider configured)
- deepseek-v4-pro model with `--variant high`
- general agent
- JSON output stream

### Data Flow
prompt → opencode dispatch → DeepSeek API → file edits + new files → JSON event stream → post-verify
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Pre-flight: providers + version + self-invocation guard + recovery baseline
- [x] Scaffold 007 packet

### Phase 2: Dispatch
- [ ] Compose dispatch prompt with all 4 RM-8 mitigation layers (BANNED OPS + ALLOWED PATHS + recovery baseline cite + biased toward documentation)
- [ ] Run `opencode run --model deepseek/deepseek-v4-pro --variant high --agent general --format json --dir <repo-root> --file <prompt> </dev/null > <log> 2>&1 &`
- [ ] Monitor via until-loop on log tail / new file count

### Phase 3: Verification
- [ ] Post-dispatch git diff scope check (only ALLOWED WRITE PATHS modified)
- [ ] Semicolon count re-grep (expect drop ≥ 80%)
- [ ] 4 new ref doc existence + sk-doc validate
- [ ] deferred-decisions.md sanity check
- [ ] Spot-check 5 random files for grammar regressions
- [ ] Strict-validate 007 packet
- [ ] Update parent metadata + impl-summary
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Scope-diff | git diff against recovery baseline | git diff --name-only |
| HVR | semicolon count delta | grep |
| Strict validate | 007 + new ref docs | validate.sh --strict |
| Manual | 5 random files | Read |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| opencode v1.15.1 | External | Green | Cannot dispatch |
| DeepSeek API auth | External | Green | Cannot dispatch via deepseek/* model |
| Recovery baseline | Internal | Recorded | Required for scope verification |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Out-of-scope writes detected OR semicolon sweep introduces grammar regressions
- **Procedure**: `git checkout HEAD --` to revert all changes since recovery baseline; investigate cause; refine prompt; re-dispatch
<!-- /ANCHOR:rollback -->
