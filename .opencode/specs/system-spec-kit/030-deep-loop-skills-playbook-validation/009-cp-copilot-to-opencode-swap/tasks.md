---
title: "Tasks: CP copilot → opencode Executor Swap (030 Phase 009)"
description: "Task list for the copilot→opencode CP swap, fixture restore, re-run, and 030 reconciliation."
trigger_phrases:
  - "cp copilot opencode swap tasks"
  - "030 phase 009 tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/030-deep-loop-skills-playbook-validation/009-cp-copilot-to-opencode-swap"
    last_updated_at: "2026-05-27T00:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "18 CP re-run via opencode/deepseek - 13 PASS 5 PARTIAL 0 FAIL"
    next_safe_action: "Validate --strict all touched packets + parent reconcile"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-2026-05-27-deep-loop-playbook"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: CP copilot → opencode Executor Swap (030 Phase 009)

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (target)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Prototype CP-046 Call B via opencode deepseek-direct; confirm `/deep:*` expands + artifacts created
- [x] T002 Restore `060-stress-test` fixture (4 runtime forms) from `e917f76347^`; deep-agent-improvement setup runs clean
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Apply copilot→opencode transform to deep-review CP-052..057 (6 files, 1 call each)
- [x] T004 Apply transform to deep-research CP-046..051 (6 files, 2 calls each)
- [x] T005 Apply transform to deep-agent-improvement CP-040..045 (6 files, 2 calls each)
- [x] T006 Assert zero `copilot -p` remain in the 3 CP categories
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Re-run all 18 via opencode; capture logs + orchestrator-verify artifacts/diffs
- [x] T008 Confirm per-scenario git tripwire clean (no repo mutation)
- [x] T009 Flip 030 child ledger CP SKIP rows (003/004/005) with evidence
- [x] T010 Re-tally `release-readiness-matrix.md` + recompute verdict + 009 lineage
- [x] T011 validate.sh --strict 009 + touched 030 children + parent; reconcile parent cursor
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All 18 CP scenarios run via opencode with recorded verdicts
- [x] Zero `copilot -p` remain; fixture restored
- [x] 030 ledgers + matrix reconciled; all packets validate --strict
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Parent**: `../spec.md` (030 phase parent); matrix `../006-release-readiness-synthesis/release-readiness-matrix.md`
- **Consuming phases**: `../003-deep-review-scenarios/`, `../004-deep-research-scenarios/`, `../005-deep-agent-improvement-scenarios/`
- **Executor**: `.opencode/skills/cli-opencode/SKILL.md`
<!-- /ANCHOR:cross-refs -->
