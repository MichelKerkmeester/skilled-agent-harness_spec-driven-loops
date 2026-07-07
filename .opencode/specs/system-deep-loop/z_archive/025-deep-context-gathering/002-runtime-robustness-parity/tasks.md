---
title: "Tasks: deep-context runtime-robustness parity"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "runtime parity tasks"
  - "atomic state tasks"
  - "loop lock tasks"
  - "tasks"
  - "template"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/025-deep-context-gathering/002-runtime-robustness-parity"
    last_updated_at: "2026-06-06T23:55:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored Level-3 tasks for the shipped runtime-robustness-parity phase"
    next_safe_action: "Operator: exercise the 5 robustness features in a live context loop run"
    blockers: []
    key_files:
      - ".opencode/skills/deep-context/scripts/reduce-state.cjs"
      - ".opencode/skills/deep-context/scripts/loop-lock.cjs"
    session_dedup:
      fingerprint: "sha256:2b71f0c4a9d35ee2c6184f93a17d4cb5e820a6713fd9c2ee4407b51a9c6d3e72"
      session_id: "dc-134-002-20260606"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "All five robustness features wired and verified"
      - "node --check passes both scripts; fixture smoke run green"
---
# Tasks: deep-context runtime-robustness parity

<!-- SPECKIT_LEVEL: 3 -->
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

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm the runtime helper contracts: writeStateAtomic, repairJsonlTail, acquire/refresh/releaseLoopLock, buildExecutorDispatchEnv (.opencode/skills/deep-loop-runtime/lib/deep-loop/**)
- [x] T002 Confirm the tsx CJS register path resolves from the deep-context scripts dir (.opencode/skills/deep-context/scripts/reduce-state.cjs)
- [x] T003 [P] Confirm bayesian-scorer and fanout-run are non-gaps and record the rationale (decision-record.md)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Write the findings registry via the runtime writeStateAtomic helper; surface stateSafety/source (.opencode/skills/deep-context/scripts/reduce-state.cjs)
- [x] T005 Write the dashboard via an atomic temp+fsync+rename text write (writeStateAtomicInline) (.opencode/skills/deep-context/scripts/reduce-state.cjs)
- [x] T006 Call repairJsonlTail on deep-context-state.jsonl before reading; surface registry.stateLogRepair {repaired, droppedBytes} (.opencode/skills/deep-context/scripts/reduce-state.cjs)
- [x] T007 Add validateSeatFinding (known kind, path-or-symbol present, numeric relevance) pre-merge; surface registry.seatValidationWarnings (.opencode/skills/deep-context/scripts/reduce-state.cjs)
- [x] T008 [P] Author loop-lock.cjs wrapping acquireLoopLock/refreshLoopLock/releaseLoopLock with a stable host-provided owner id and inline fallback (.opencode/skills/deep-context/scripts/loop-lock.cjs)
- [x] T009 [P] Wire step_acquire_lock/step_release_lock to invoke loop-lock.cjs in the auto and confirm workflows (.opencode/commands/deep/assets/deep_start-context-loop_auto.yaml, .opencode/commands/deep/assets/deep_start-context-loop_confirm.yaml)
- [x] T010 [P] Set the executor-audit recursion-guard env (SPECKIT_CLI_DISPATCH_STACK via buildExecutorDispatchEnv) in the cli_contract of both workflows (.opencode/commands/deep/assets/deep_start-context-loop_auto.yaml, .opencode/commands/deep/assets/deep_start-context-loop_confirm.yaml)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Run node --check on reduce-state.cjs (green)
- [x] T012 Run node --check on loop-lock.cjs (green)
- [x] T013 Run the fixture smoke run: confirm stateSafety="runtime", stateLogRepaired=true, seatValidationWarnings=1, no .tmp leftover (.opencode/skills/deep-context/scripts/reduce-state.cjs)
- [x] T014 Run the loop-lock acquire/refresh/release cycle against a lock file (.opencode/skills/deep-context/scripts/loop-lock.cjs)
- [x] T015 Run validate.sh --strict on the spec folder and reconcile completion metadata across docs
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] node --check passes both scripts; fixture smoke run + loop-lock cycle green
- [x] Non-gaps (bayesian-scorer, fanout-run) documented in decision-record.md
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Decision Records**: See `decision-record.md`
- **Phase Parent**: See `../spec.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
Level 3 task breakdown - phased robustness-parity wiring onto the host-driven loop
3 phases: Setup (confirm contracts + non-gaps), Implementation (reducer + lock + YAML), Verification
-->
