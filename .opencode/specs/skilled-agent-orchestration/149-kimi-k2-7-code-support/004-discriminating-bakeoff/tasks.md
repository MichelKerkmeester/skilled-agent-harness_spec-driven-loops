---
title: "Tasks: Phase 4: discriminating-bakeoff [template:level_1/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "kimi bakeoff tasks"
  - "phase 004 tasks"
  - "discriminating bakeoff checklist"
  - "tasks core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/149-kimi-k2-7-code-support/004-discriminating-bakeoff"
    last_updated_at: "2026-06-15T16:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Ran bakeoff 007; costar promoted, rcaf retired"
    next_safe_action: "Phase complete; strict-validate and close"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-workflows/deep-improvement/assets/model_benchmark/benchmark-profiles/kimi-k2.7-discriminating.json"
      - ".opencode/skills/sk-prompt-small-model/benchmarks/007-kimi-k2.7-discriminating/synthesis.md"
      - ".opencode/skills/sk-prompt-small-model/assets/model-profiles.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-004-discriminating-bakeoff"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 4: discriminating-bakeoff

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

> Build the discriminating bakeoff profile.

- [x] T001 Clone `framework-bakeoff.json` to `kimi-k2.7-discriminating.json` (deep-loop-workflows benchmark-profiles)
- [x] T002 Retarget fixtures to invalid-dominant strict validators: validate-ipv4, validate-date, validate-semver (+ hard-roman-to-int, later excluded)
- [x] T003 [P] Set `correctnessGate.threshold` to 0.0 and `samplesPerCell` to 6
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

> Run the bakeoff with throttled serial real Kimi dispatches.

- [x] T004 Run `007-kimi-k2.7-discriminating` through the sweep engine (framework-bakeoff mode)
- [x] T005 Throttle to serial real `kimi-for-coding/k2p7` dispatches with per-fixture persistence
- [x] T006 Recover from the accidental external kill at 52/120 and relaunch resiliently from saved state
- [x] T007 Fix the throttle bug mid-flight; exclude `hard-roman-to-int` after it stalled under orchestration churn
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

> Promote the separating result and validate.

- [x] T008 Promote the registry `kimi-k2.7-code` block: primary costar, fallback tidd-ec, avoid rcaf, status empirical, evidence run 007
- [x] T009 Mirror §1/§3/§4/§5 of `kimi-k2.7-code.md` and the `_index.md` row to the run-007 result
- [x] T010 Strict-validate this phase and the parent; update the parent phase map row to Complete
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
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
