---
title: "Tasks: Phase 1: build-benchmark-mode [template:level_1/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "name"
  - "template"
  - "tasks core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/022-deep-agent-improvement-benchmark-mode/003-build-model-benchmark-mode-runtime"
    last_updated_at: "2026-05-28T16:24:07Z"
    last_updated_by: "template-author"
    recent_action: "Initialize continuity block"
    next_safe_action: "Replace template defaults on first save"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/003-build-model-benchmark-mode-runtime"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 1: build-benchmark-mode

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Capture a baseline: run the deep-agent-improvement vitest suite + record a known agent-improvement state-JSONL output (the byte-identity reference for TST-1)
- [x] T002 Confirm the `promote-candidate.cjs` routing mechanism (explicit `--mode` vs score-file `status` inspection) before extending it (resolves spec.md OQ-2)
- [x] T003 [P] Decide scorer-port placement: copy `eval-rig/` + grader into deep-agent-improvement vs cross-packet reference (resolves spec.md OQ-1)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Create `dispatch-model.cjs` (additive) — generalize `dispatch-minimax.cjs` via executor-routing map; `--variant` forwarded only for model-benchmark
- [x] T005 Create `loop-host.cjs` (additive) — mode resolve (`args.mode || config.mode || 'agent-improvement'`); agent-improvement → score-candidate path (no-op dispatcher); model-benchmark → materialize → run-benchmark; unknown mode → warn+default
- [x] T006 Port + decouple the scorer behind the seam — primitive criteria arrays (not raw fixture JSON), `--cwd`-parameterized det-checks, `buildGraderFn(mode)` factory
- [x] T007 Add `mode` to all records (`score-candidate.cjs`, `run-benchmark.cjs`, incl. infra_failure); extend mode-aware `promote-candidate.cjs`; `reduce-state.cjs` metadata pass-through
- [x] T008 Handle edge cases EC-1..10 (per-mode cache key, concurrent state-log safety, materialize-failure propagation, etc.)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 TST-1 identity gate: `--mode=agent-improvement` vs no flag → byte-identical state JSONL (`diff` empty); wire as a pre-merge check
- [x] T010 TST-2..6 regression + a real `--mode=model-benchmark` smoke run; re-run the vitest suite (must stay green)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->

