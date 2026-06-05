---
title: "Tasks — 003 Session-Trace Causal Reducer"
description: "Task list for the session-trace causal reducer."
trigger_phrases:
  - "009 causal reducer tasks"
importance_tier: "normal"
contextType: "task"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/008-learning-feedback-reducers/003-causal-reducer"
    last_updated_at: "2026-05-12T07:20:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Scaffolded Level 2 child packet"
    next_safe_action: "Implement tasks.md"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md", "checklist.md", "implementation-summary.md"]
    completion_pct: 0
---
# Tasks: Session-Trace Causal Reducer

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

`[ ]` pending, `[x]` complete, `[P]` parallelizable.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Confirm `001-aggregator` and Phase 002 guardrails are available.
- [ ] T002 Define reducer options and result telemetry.
- [ ] T003 Define shadow replay output for candidate edges, skipped edges, relation-floor decisions, and manual-edge protection. AUDIT 2026-06-05: candidate `ENABLED` edges are valid per `RELATION_TYPES` but ABSENT from `DEFAULT_RELATION_TARGETS`; the reducer must validate against `RELATION_TYPES`/schema and align coverage targets before applying the relation floor.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Create `session-trace-causal-reducer.ts`.
- [ ] T005 Implement ordered event grouping.
- [ ] T006 Implement source selection and caps.
- [ ] T007 Emit auto-session edges with manual-edge protection.
- [ ] T008 Add default-off flag gate.
- [ ] T009 Add shadow replay mode that records decisions without writing edges.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T010 Test source selection and no-source behavior.
- [ ] T011 Test manual-edge skip and idempotent reruns.
- [ ] T012 Test shadow replay records candidate/skipped/accepted decisions with no mutation.
- [ ] T013 Verify deferred-only invocation.
- [ ] T014 Run child strict validation.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] No live invocation path.
- [ ] Shadow replay evidence exists before any active edge mutation rollout.
- [ ] Tests pass.
- [ ] Strict validation exits 0.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- `spec.md`
- `plan.md`
- `checklist.md`
<!-- /ANCHOR:cross-refs -->
