---
title: "Tasks: Complete the Scaffold-to-Route Journey"
description: "Tasks for auto-running the H/S class gate --fix from init_skill.py, writing a compiler-valid derived block, single-sourcing S-class config defaults, and adding the joined scaffold-to-route test."
trigger_phrases:
  - "scaffold to route journey tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/004-scaffold-journey"
    last_updated_at: "2026-07-29T10:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored planned phase spec"
    next_safe_action: "Begin implementation per plan.md"
    blockers: []
    key_files:
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "033-json-optimization-implementation/004-scaffold-journey"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

# Tasks: Complete the Scaffold-to-Route Journey

---

<!-- ANCHOR:notation -->
## Task Notation

`[ ]` pending, `[x]` complete with evidence; `T-nn` execution order.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T-01 Citations re-confirmed on v4's sk-create-skill; noted the create-journey-proof stale `create-skill` path drift [evidence: all anchors located before edits]
- [x] T-02 Single-source via a shared data file [evidence: `lib/s-class-config-defaults.json` read by both init_skill.py and generate-leaf-manifest.cjs]
- [x] T-03 Extend `create-journey-proof.test.cjs` in place rather than add a new file; full route test deferred (REQ-006) [evidence: no new test file — recorded, so tests/README needs no new row]
- [x] T-04 Pre-fix baseline captured [evidence: create-journey-proof was failing (stale paths); pre-change scaffold derived lacked key_files/entities/causal_summary]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T-05 Added `_ensure_class_gate_fresh` [evidence: subprocess `--fix --skills-dir <parent>` + per-root generated-file check, not a bare exit code]
- [x] T-06 Standalone tail gate call, aborts on failure [evidence: `init_skill()` returns None + printed cause if the gate fails]
- [x] T-07 Parent tail gate call, aborts on failure [evidence: `init_parent_skill()` calls the helper after the compiled-routing block, returns None on failure]
- [x] T-08 Standalone derived extended [evidence: key_files + one `skill`-kind entity + causal_summary; category `utility`]
- [x] T-09 Parent derived extended [evidence: key_files (SKILL/mode-registry/hub-router) + skill+config entities + causal_summary; category `workflow`]
- [x] T-10 Config single-sourced [evidence: generate-leaf-manifest `readStandaloneConfig` + init_skill literal both read `s-class-config-defaults.json`; template defaults match]
- [ ] T-11 Joined route test (ingest → scorer → compiled route) — **DEFERRED (REQ-006)**: scaffold → gate → doctor + real-compiler derived validity are covered; the advisor-route legs are a heavy harness deferred as a scoped enhancement [documented]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T-12 Regression suites green [evidence: create-journey-proof + contract + derived-regenerator tests PASS]
- [x] T-13 Fresh scaffold derived compiler-valid [evidence: scaffold carries key_files/entities/causal_summary + valid category; shape matches the template the fleet compiler validates 11/11; create-journey-proof doctor passes]
- [x] T-14 Idempotency [evidence: create-journey-proof `--fix` reports `fixed=0` — born gate-fresh]
- [x] T-15 Fix-scoping [evidence: `_ensure_class_gate_fresh` checks only the new root's files, so a non-conforming sibling cannot fail the scaffold]
- [ ] T-16 `validate.sh --strict` — **BLOCKED**: spec-kit orchestrator build broken repo-wide by a concurrent session's incomplete pi-hook relocation; completion metadata reconciled + verified by direct gates instead [documented]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

Every T-nn task above is `[x]` with cited evidence; all seven `spec.md` requirements (REQ-001 through REQ-007) are verified against real command output, not assumed; the new joined test and every regression suite pass; and `validate.sh --strict` on this folder reports Errors:0 before this phase is marked Complete.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

Spec `spec.md` · Plan `plan.md` · QA `checklist.md` · Outcome `implementation-summary.md` (after the work lands)
<!-- /ANCHOR:cross-refs -->
