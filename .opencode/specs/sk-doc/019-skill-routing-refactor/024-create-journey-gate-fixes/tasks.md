---
title: "Task Breakdown: Create-Journey Gate Fixes"
description: "Planned tasks for re-verification, journey-critical fixes, template consistency, silent-discard reporting, and the two-class journey proof."
trigger_phrases:
  - "create journey gate fixes tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/024-create-journey-gate-fixes"
    last_updated_at: "2026-07-28T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Planned"
    next_safe_action: "Execute Phase 1 after operator go"
    blockers:
      - "Execution awaits operator authorization"
    key_files:
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "024-create-journey-gate-fixes"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

# Task Breakdown: Create-Journey Gate Fixes

---

<!-- ANCHOR:notation -->
## Task Notation

`[ ]` planned; `T-nn` in execution order.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T-01 Worktree from origin tip; re-verify every lens-2/lens-3 finding at its cited file:line
- [ ] T-02 Reproduce the broken parent journey in a temp dir (scaffold → gate → doctor) and capture the exact failures
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T-03 Declare `resourceContractVersion` in `parent-skill-registry-template.json` and `init_skill.py` parent output; prove byte-neutrality fleet-wide
- [ ] T-04 create-skill SKILL.md conformance step: gate `--fix` first, plain re-run second (both workflows)
- [ ] T-05 Make router template signals/tieBreak cover every registry-template example mode
- [ ] T-06 Graph template `family` placeholder → one valid value, union moved to the note; `runtimeLoopTypes` note corrected
- [ ] T-07 `generate-leaf-manifest.cjs`: named error for unknown-mode alias rows + failing-fixture test
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T-08 Automated two-class journey proof (scaffold → --fix → clean gate → doctor 0) beside the create-skill tests
- [ ] T-09 Full sweep: fleet gate, freshness, contract + doctor suites, drift guards; land via rebase-and-push
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

Journey proof green for both classes; all gates 11/11; suites pass; landed on the release branch.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

Spec `spec.md` · Plan `plan.md` · Evidence `research/swarm/`
<!-- /ANCHOR:cross-refs -->
