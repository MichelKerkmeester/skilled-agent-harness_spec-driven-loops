---
title: "Implementation Plan: Runtime Coverage"
description: "Phase 7 of the git action advisory hook packet."
trigger_phrases:
  - "007-runtime-coverage docs"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-git/016-git-action-advisory-hook/007-runtime-coverage"
    last_updated_at: "2026-07-28T08:00:00Z"
    last_updated_by: "glm-5-2"
    recent_action: "Built and verified in one pass"
    next_safe_action: "Operator review"
    blockers: []
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-28-sk-git-016-7"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Runtime Coverage

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Executed in one pass on the foundation phases 002, 003, and 006 laid; the plan is recorded for the record rather than ahead of the work.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

|| Gate | Requirement |
||------|-------------|
|| Tests | 23/23 green before and after style alignment |
|| Drift guards | All three sk-code drift guards pass |
|| Imports | Every adapter imports the shared cores; nothing duplicated |
|| Fail open | Every adapter silence/approves on error |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

One shared rule engine (`readHardRules` + `evaluate`), one check registry (`GIT_CHECKS`), one lazy context collector (`createGitContext`), and one shape gate (`GIT_SHAPE`). Each runtime adapter is a thin import-and-deliver shim that maps its native tool event onto those cores and chooses the strongest legal delivery channel for its surface.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

|| Step | Work | Gate |
||------|------|------|
|| 1 | Style-align the five sk-git scripts | 23/23 tests still green |
|| 2 | Build OpenCode, Pi, Cursor adapters; wire Devin | Imports resolve; simulations advise and stay silent |
|| 3 | Verify | Drift guards pass; suppression and fail-open confirmed |
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Real scratch repositories for stdin simulations; in-process simulations for OpenCode and Pi; stdin simulation for the Cursor proxy. Live Cursor/Devin/Pi/OpenCode sessions were not launched; the limitation is recorded.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

|| Dependency | Status |
||------------|--------|
|| Phases 002, 003, 006 | Complete |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Every adapter and registration is additive; removing the new plugin/extension/proxy file and reverting the two JSON registrations restores the prior state without touching the shared cores.
<!-- /ANCHOR:rollback -->
