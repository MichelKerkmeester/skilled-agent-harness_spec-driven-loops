---
title: "Tasks: Reusable model-benchmark framework (research packet)"
description: "Task breakdown for the 10-iteration deep-research loop and synthesis into a config-driven benchmark-framework design."
trigger_phrases:
  - "reusable benchmark framework tasks"
  - "deep-improvement benchmark research tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/127-reusable-model-benchmark-framework"
    last_updated_at: "2026-06-02T06:20:00Z"
    last_updated_by: "claude-opus"
    recent_action: "All research tasks completed"
    next_safe_action: "Plan implementation phases"
    blockers: []
    key_files:
      - ".opencode/specs/skilled-agent-orchestration/127-reusable-model-benchmark-framework/research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "research-127"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Reusable model-benchmark framework (research packet)

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

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Smoke-test codex dispatch contract (exit 0 confirmed)
- [x] T002 Create `research/iterations` + `research/deltas`
- [x] T003 [P] Verify evidence files exist; correct `120`/`126` paths
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Iterations 1-3 (inventory+gaps, fixture taxonomy+anti-saturation, multi-dim scoring)
- [x] T005 Iterations 4-6 (statistical rigor, model-agnostic dispatch, framework registry)
- [x] T006 Iterations 7-9 (profile schema, reporting, situational modes)
- [x] T007 Iteration 10 (synthesis + roadmap); each iteration captured to `research/iterations/iteration-00N.md`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Confirm all 10 iterations exit 0 with real findings
- [x] T009 Build + validate `research/deltas/deltas.jsonl` (64 deltas, all valid JSON)
- [x] T010 Write `research/research.md`; run `validate.sh --strict`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed (artifacts present, valid, evidence-grounded)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Synthesis**: See `research/research.md`
- **Deltas**: See `research/deltas/deltas.jsonl`
<!-- /ANCHOR:cross-refs -->
