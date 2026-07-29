---
title: "Implementation Plan: Silent Test Discovery"
description: "Discovery runner and pre-push gate for the thirty-seven silently unrun test files."
trigger_phrases:
  - "silent test discovery docs"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/032-silent-test-discovery"
    last_updated_at: "2026-07-28T08:20:00Z"
    last_updated_by: "claude-fable-5"
    recent_action: "Built the runner and wired the report-only pre-push gate"
    next_safe_action: "Spec-kit repairs completion-state; then flip the gate to enforce"
    blockers: []
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-28-speckit-032"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Silent Test Discovery

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Count the silence first, then build discovery that cannot lie, then wire it where work crosses the outward boundary — with a default that reports rather than blocks, because the first run surfaced pre-existing rot that other sessions should not be held hostage to.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Requirement | Result |
|------|-------------|--------|
| No false green | Empty discovery or unparseable summary exits non-zero | Verified |
| No false red | Vitest files never hosted under node:test | Partitioned by import |
| No hostage-taking | Pre-existing failures report, not block | Default report-only |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

Discovery walks the four live-code roots and excludes `node_modules`, `external`, `z_archive`, `z_future` and worktrees — the spec tree is out wholesale because its suites are vendored or archived and fail environmentally.

Partition is by what a file imports, not what its name promises: two dialects share the `.test.mjs` extension, and a vitest file hosted under `node --test` crashes on import, which reads as a failure and is a lie in both directions.

The gate joins pre-push as a third independent gate with the same bypass discipline as its two siblings.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

| Step | Work | Gate |
|------|------|------|
| 1 | Enumerate and time the full suite | 37 files, ~50s, failures decomposed |
| 2 | Runner with dialect partition | 35 + 2, honest exits |
| 3 | Pre-push wiring | Report-only, two flags |
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The runner was validated against the main tree, where 35 node:test files report 409 pass / 0 fail and the two vitest files report 56 pass / 9 fail — establishing both that the green half is genuinely green and that the runner surfaces the red half instead of crashing on it.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Status |
|------------|--------|
| vitest under `.opencode/node_modules` | Present; the runner reports SKIPPED-as-failure when absent |
| Built dist for eight spec-gate suites | Environmental; run from a built tree |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Remove the gate block from pre-push and delete the runner; both are additive. `SPECKIT_SKIP_PREPUSH_TESTS=1` achieves the same per-push without editing anything.
<!-- /ANCHOR:rollback -->
