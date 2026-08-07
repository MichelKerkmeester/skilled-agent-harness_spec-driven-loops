---
title: "Implementation Plan: Pathspec Integrity"
description: "How the fire rate was measured and why the audit refuses to report a verdict it cannot support."
trigger_phrases:
  - "advisory noise audit"
  - "git advisory fire rate"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-git/016-git-action-advisory-hook/004-pathspec-integrity"
    last_updated_at: "2026-07-27T23:50:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Measured the real fire rate with a control group"
    next_safe_action: "Operator reviews the packet"
    blockers: []
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-27-sk-git-016-004"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Pathspec Integrity

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Replay representative command shapes against a live repository, report what fires, and make the audit structurally unable to report success when it has measured nothing.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Requirement | Result |
|------|-------------|--------|
| Aggregate budget | Under 3 advisories per 100 commands | 0 of 25 |
| Rules alive | Every control shape fires | 5 of 5 |
| No false pass | Refuses a verdict with nothing loaded | Verified |
| Probe honesty | Probes name real paths | Verified after a fix |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

Two sets of command shapes and two questions.

The ordinary set is weighted toward what the reflog says people actually run here, and deliberately includes dangerous-looking but routine forms — plain `reset`, `rebase`, `merge` — because those are exactly where a badly gated rule turns noisy.

The control set is shapes that must fire given current state. It exists because a well-gated rule set and a completely broken one produce the same aggregate number, and only one of those is good news. Without a control, a zero is unreadable.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

| Step | Work | Gate |
|------|------|------|
| 1 | Ordinary replay and per-rule counts | Numbers printed |
| 2 | Control group | Rules proven alive |
| 3 | Refuse a verdict with no rules loaded | Exits non-zero |
| 4 | Repo-relative probes | No manufactured noise |
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Run against three repositories with different shapes: the build worktree, a purpose-built dirty repository with untracked files throughout, and a repository with no rules loaded at all. The third is the important one — it is the case where a naive audit reports green.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Status |
|------------|--------|
| Phase 002 rules | Complete |
| Phase 003 hook | Complete, though the audit calls the evaluator directly |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Delete the audit. It is a diagnostic that reads state and writes nothing, so removing it changes no behaviour.
<!-- /ANCHOR:rollback -->
