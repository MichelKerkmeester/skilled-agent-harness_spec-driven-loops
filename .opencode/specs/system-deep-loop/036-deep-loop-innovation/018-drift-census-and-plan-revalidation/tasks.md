---
title: "Task Breakdown: drift census and plan revalidation"
description: "Ordered task list for the two-lineage drift census: pin HEAD, triage the 204-commit range, revalidate all 15 implementation phases, reconcile the lineages, and emit the per-phase verdict table."
trigger_phrases:
  - "036 drift census tasks"
  - "drift census task list"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/018-drift-census-and-plan-revalidation"
    last_updated_at: "2026-07-19T18:16:02Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored the census task breakdown"
    next_safe_action: "Execute T001-T003, then launch the loop"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Task Breakdown: Drift Census and Plan Revalidation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

- `[ ]` pending · `[x]` complete
- `[P0]` blocking · `[P1]` required · `[P2]` optional
- Evidence column holds the command, `path:line`, or artifact proving completion.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Scaffold 018 and register it in the parent `children_ids` plus the phase map
- [x] T002 Generate `description.json` and `graph-metadata.json` for 018
- [x] T003 Confirm both executors dispatch cleanly [evidence: minimal round-trip on each path returned its sentinel, `SOL_OK` and `GLM_OK`, 2/2 dispatching]
- [x] T004 Pin the exact HEAD SHA and record it with the baseline `0ce43ff589` in the research config [evidence: each lineage pinned its own — sol `e4b242c3940c`, glm `739b85ac57`; branch moved mid-run]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Launch the census loop with two executors under forced depth, 10 iterations each [evidence: both lineages terminal, 0 failed; forced depth FAILED — `fanout-run.cjs:1512` reads stopPolicy only from CLI]
- [x] T006 Triage all commits in the baseline range into touches-036-dependency versus not [evidence: `iterations/iteration-007.md:9-11`, 27+2+182=211]
- [x] T007 Resolve every runtime path named across phase plans 003-017 against pinned HEAD [evidence: `research/research.md` §2, 15/15 rows]
- [x] T008 Test each phase's stated premise for second-order drift [evidence: `research/research.md` §2 second-order column]
- [x] T009 Determine whether shipped work has already delivered part of any planned phase [evidence: no phase fully shipped; 5 have partial overlap, e.g. `runtime/scripts/convergence.cjs:723-825` vs phase 011]
- [x] T010 Resolve the `packet-033` benchmark dependency question [evidence: survives under `z_archive/027`, active exec at `shared/behavior-benchmark/`]
- [x] T011 Determine whether routing commits changed the registered-mode count phase 013 assumes [evidence: UNCHANGED at 7 routing modes, `mode-registry.json:1-22`]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 Verify: all 15 implementation phases carry an explicit verdict with no "unknown" bucket [evidence: `research/research.md` §2]
- [x] T013 Verify: the census independently rediscovered the confirmed phase-003 path breakage [evidence: both lineages, `cc77a1e550a`]
- [x] T014 Verify: at least one phase came back genuinely clean, proving the census discriminates [evidence: phase 004 locked by both — zero `runtime/` citations, all 3 children resolve at HEAD]
- [x] T015 Reconcile the two lineages and surface disagreements rather than averaging them [evidence: `research/research.md` §3 adjudication]
- [ ] T016 Verify: strict validation on this folder reports Errors 0
- [ ] T017 Verify: the 036 parent still validates after 018 registration
- [ ] T018 Save continuity through the canonical generator
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- Per-phase drift table covering 003-017, every row carrying a verdict plus reproducible evidence.
- First-order and second-order drift reported separately.
- Both lineages ran their full budget under forced depth, or a documented fallback was applied.
- Both validate gates green.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Specification: `spec.md`
- Execution plan: `plan.md`
- Parent program: `../spec.md` (PHASE MAP & OUTCOMES)
- Terminal drift phase this pulls forward: `../017-integrate-latest-and-closeout/`
<!-- /ANCHOR:cross-refs -->
