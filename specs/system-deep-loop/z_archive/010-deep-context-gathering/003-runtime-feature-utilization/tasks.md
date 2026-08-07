---
title: "Tasks: deep-loop-runtime utilization hardening"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "deep-loop-runtime utilization tasks"
  - "runtime hardening tasks"
  - "deep-improvement tasks"
  - "deep-review lock tasks"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/010-deep-context-gathering/003-runtime-feature-utilization"
    last_updated_at: "2026-06-06T23:59:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored Level-3 tasks for completed cross-skill optimization"
    next_safe_action: "Memory save; packet status Complete"
    blockers: []
    key_files:
      - ".opencode/skills/deep-improvement/scripts/shared/reduce-state.cjs"
      - ".opencode/commands/deep/assets/deep_start-review-loop_auto.yaml"
      - ".opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs"
    session_dedup:
      fingerprint: "sha256:21f084a2955d99a9dfb62e715e4564513164ec612ad6122518ce1ba3ac9e1663"
      session_id: "dlr-135-20260606"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "All three fixes implemented and verified"
      - "Five non-fix ADRs documented in decision-record.md"
---
# Tasks: deep-loop-runtime utilization hardening

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

- [x] T001 Sweep each deep skill for runtime feature utilization: code-enforced vs prose-only vs unused
- [x] T002 Identify the three actionable gaps: deep-improvement atomic writes, deep-review loop-lock, deep-context executor-audit env
- [x] T003 cli-opencode architect consult (deepseek-v4-pro) for prioritization and non-fix validation
- [x] T004 [P] Run two parallel opus confidence-gate audits to independently validate non-fix decisions
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Fix 1: deep-improvement state safety

- [x] T005 Import `repairJsonlTail` from deep-loop-runtime lib in `reduce-state.cjs` with in-process tsx register and inline fallback (.opencode/skills/deep-improvement/scripts/shared/reduce-state.cjs)
- [x] T006 Import `writeStateAtomic` from deep-loop-runtime lib with same fallback pattern (.opencode/skills/deep-improvement/scripts/shared/reduce-state.cjs)
- [x] T007 Replace hand-rolled JSONL read with `repairJsonlTail` call before state log parsing (.opencode/skills/deep-improvement/scripts/shared/reduce-state.cjs)
- [x] T008 Replace `fs.writeFileSync` output writes with `writeStateAtomic` calls (.opencode/skills/deep-improvement/scripts/shared/reduce-state.cjs)

### Fix 2: deep-review loop-lock

- [x] T009 [P] Add `step_acquire_lock`, `step_release_lock`, and `lock_file` fields to the auto YAML mirroring deep-research (.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml)
- [x] T010 [P] Add the same loop-lock fields to the confirm YAML (.opencode/commands/deep/assets/deep_start-review-loop_confirm.yaml)

### Fix 3: deep-context executor-audit env (fanout-run.cjs)

- [x] T011 Wire `buildExecutorDispatchEnv` into `fanout-run.cjs` at the CLI-seat spawn site so the recursion-guard env is set in code (.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs)
- [x] T012 Add +4 vitest tests: env set on spawn, inline fallback, no temp leak, `repaired=true` from runtime path (.opencode/skills/deep-loop-runtime/tests/unit/fanout-run.vitest.ts)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T013 Run `node --check` on `reduce-state.cjs` (pass)
- [x] T014 Run fixture smoke for reduce-state: confirm `repaired=true, source=runtime`, no temp files leaked
- [x] T015 Confirm 4/4 reduce-state tests pass
- [x] T016 Run deep-loop-runtime vitest suite: 291/291 (including +4 new fanout-run tests)
- [x] T017 Confirm council suite 23/23 (no regression from fanout-run change)
- [x] T018 Author five non-fix ADRs in `decision-record.md`: deep-ai-council graph-replay, deep-context pid lock, deep-research prose, fanout-run site-choice, triage rationale
- [x] T019 Run `validate.sh --strict` on this spec folder; iterate until PASSED (0/0)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Runtime tests 291/291, council 23/23, fixture smoke green
- [x] Five non-fix ADRs documented
- [x] `validate.sh --strict` PASSED
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Decision Records**: See `decision-record.md`
- **Verification Checklist**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
Level 3 task breakdown: 3 phases
Phase 1: audit + consult + parallel audits
Phase 2: 3 targeted fixes (each independently parallelizable after Phase 1)
Phase 3: verification + ADRs + validate
-->
