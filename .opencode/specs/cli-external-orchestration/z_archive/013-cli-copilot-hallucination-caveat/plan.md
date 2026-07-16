---
title: "Implementation Plan: 075 cli-copilot Hallucination Caveat"
description: "Doc-only patch: append caveat bullet to cli-copilot SKILL.md + insert cross-CLI consumption note in sk-doc SKILL.md. ~10 lines total."
trigger_phrases: ["075 plan"]
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/013-cli-copilot-hallucination-caveat"
    last_updated_at: "2026-05-05T17:55:00Z"
    last_updated_by: "claude-orchestrator"
    recent_action: "Plan authored"
    next_safe_action: "Commit + push"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "075-final"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: 075 cli-copilot Hallucination Caveat

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context
| Aspect | Value |
|--------|-------|
| **Stack** | Markdown |
| **Source files** | cli-copilot/SKILL.md + sk-doc/SKILL.md |
| **Output** | 2 caveat blocks |
| **Testing** | grep verification |

### Overview
2 surgical doc edits. No code, no tests. Both edits cite the empirical evidence from 071/072 stress matrices and recommend cli-codex as the preferred default for routing-trace consumption tasks.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] 072's P1-072-001 hallucination finding documented in review-report-v2.md
- [x] cli-codex 66.7% / cli-opencode 47.2% / cli-copilot 11.1% accuracy numbers verified

### Definition of Done
- [x] cli-copilot/SKILL.md caveat shipped
- [x] sk-doc/SKILL.md caveat shipped
- [ ] Commit + push
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
2 Edit calls. No build. No tests.

### Data Flow
```
Edit cli-copilot/SKILL.md "When NOT to Use" → append routing-trace caveat
Edit sk-doc/SKILL.md §2 "Resource Domains" → insert cross-CLI consumption note
verify both via grep
commit + push
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Locate "When NOT to Use" section in cli-copilot/SKILL.md
- [x] Locate "Resource Domains" section in sk-doc/SKILL.md

### Phase 2: Core Implementation
- [x] Edit cli-copilot/SKILL.md: append caveat bullet
- [x] Edit sk-doc/SKILL.md: insert cross-CLI consumption note

### Phase 3: Verification
- [x] grep both edits land
- [ ] validate.sh --strict on 075
- [ ] Commit + push
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Verification | grep both caveats | grep |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Status |
|------------|--------|
| 072 review-report-v2.md exists | Green |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Caveat phrasing problematic; numbers wrong
- **Procedure**: `git revert HEAD`
- **Granularity**: One commit
<!-- /ANCHOR:rollback -->
