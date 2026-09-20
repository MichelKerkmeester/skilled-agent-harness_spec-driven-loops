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
    last_updated_at: "2026-07-28T16:27:03Z"
    last_updated_by: "claude-code"
    recent_action: "Delivered and verified"
    next_safe_action: "None"
    blockers: []
    key_files:
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "024-create-journey-gate-fixes"
      parent_session_id: null
    completion_pct: 100
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

- [x] T-01 Worktree from origin tip; re-verify every lens-2/lens-3 finding at its cited file:line [evidence: all six re-verified; the missing --fix was parent-path only, `SKILL.md:275`]
- [x] T-02 Reproduce the broken parent journey in a temp dir (scaffold → gate → doctor) and capture the exact failures [evidence: reproduced pre-fix: fresh hub FAILed doctor on missing numeric resourceContractVersion]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T-03 Declare `resourceContractVersion` in `parent-skill-registry-template.json` and `init_skill.py` parent output; prove byte-neutrality fleet-wide [evidence: template + `init_skill.py` declare it; `ci-leaf-manifest-freshness.cjs` 11/11 fresh]
- [x] T-04 create-skill SKILL.md conformance step: gate `--fix` first, plain re-run second (both workflows) [evidence: parent step now `--fix` then plain re-run, mirroring the standalone step]
- [x] T-05 Make router template signals/tieBreak cover every registry-template example mode [evidence: router signals/tieBreak carry all 6 registry tokens incl. transports per doctor 5b/5e/5i]
- [x] T-06 Graph template `family` placeholder → one valid value, union moved to the note; `runtimeLoopTypes` note corrected [evidence: family shows `sk-hub` with the union in the note; runtime-loop note matches doctor]
- [x] T-07 `generate-leaf-manifest.cjs`: named error for unknown-mode alias rows + failing-fixture test [evidence: named ContractError for orphan alias rows + failing fixture in `leaf-resource-contract.test.cjs`]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T-08 Automated two-class journey proof (scaffold → --fix → clean gate → doctor 0) beside the create-skill tests [evidence: `create-journey-proof.test.cjs` green: both classes, gate --fix, clean gate, doctor 0]
- [x] T-09 Full sweep: fleet gate, freshness, contract + doctor suites, drift guards; land via rebase-and-push [evidence: fleet gate 11/11, freshness 11/11, suites pass]
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
