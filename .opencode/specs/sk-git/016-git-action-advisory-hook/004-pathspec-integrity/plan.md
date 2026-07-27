---
title: "Implementation Plan: Pathspec Integrity"
description: "Phase 4 of the git action advisory hook packet; held until phase 001 research lands."
trigger_phrases:
  - "004-pathspec-integrity plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-git/016-git-action-advisory-hook/004-pathspec-integrity"
    last_updated_at: "2026-07-27T21:20:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Authored the phase placeholder with an honest blocked status"
    next_safe_action: "Wait for phase 001 research to land"
    blockers:
      - "Depends on phase 001 research output"
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-27-sk-git-016-4"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Pathspec Integrity

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Held until phase 001 research lands. Planning this phase now would mean inventing the answers the research exists to produce.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Requirement |
|------|-------------|
| Traceability | Every rule or check traces to research output or an observed incident |
| Non-blocking | Nothing added here may fail a git command |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

Reuses the proven PreToolUse advisory path: `parseHardRules()` reads frontmatter, `evaluate()` matches a command, the hook prints. No new infrastructure.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

| Step | Work | Gate |
|------|------|------|
| 1 | Read phase 001 research output | Research complete |
| 2 | Derive this phase's concrete plan from it | Predecessor handoff met |
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Determined by the research output. At minimum, each encoded rule or check needs a test that reproduces the failure it exists to catch.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Status |
|------------|--------|
| Phase 001 research output | In flight |
| `dispatch-rule-checks.mjs` evaluator | Exists |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Remove the frontmatter block or the hook entry from the PreToolUse array. Nothing here changes git behaviour, so rollback restores the prior state exactly.
<!-- /ANCHOR:rollback -->
