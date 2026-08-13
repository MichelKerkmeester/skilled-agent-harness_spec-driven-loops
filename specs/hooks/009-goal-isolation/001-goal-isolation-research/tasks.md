---
title: "Research Tasks: Cross-Runtime Goal Isolation"
description: "Task sequence for the three-iteration deep-research run and implementation-plan reconciliation."
trigger_phrases:
  - "goal isolation research tasks"
  - "goal deep loop iterations"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "hooks/009-goal-isolation/001-goal-isolation-research"
    last_updated_at: "2026-08-10T12:35:00Z"
    last_updated_by: "codex"
    recent_action: "Prepared the research task sequence"
    next_safe_action: "Execute deep-research iteration 1"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Research Tasks: Cross-Runtime Goal Isolation

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed with evidence |
| `[B]` | Blocked by named evidence gap |
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Establish `001-goal-isolation-research` as the research write boundary.
- [x] T002 Disable the Pi goal extension and stop live Pi processes before further investigation.
  - Evidence: `.pi/settings.json` excludes `extensions/goal-context.ts`; the Pi package resolver returned `enabled: false`; final process check returned `NO_PI_OR_GOAL_PROCESSES`.
- [x] T003 Load the `system-deep-loop`, deep-research command, state, and spec-anchoring contracts.
- [x] T004 Define the three distinct iteration focuses and forced-depth stop policy.
  - Evidence: `plan.md` defines three non-overlapping passes and the invocation binds `--max-iterations=3 --stop-policy=max-iterations`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Run iteration 1 on ownership, persistence, producer/consumer, and failure mechanics.
  - Evidence: `research/iterations/iteration-001.md` and `research/deltas/iter-001.jsonl`; state run 1 is complete.
- [x] T006 Run iteration 2 on native session identity, management binding, and runtime support truth.
  - Evidence: `research/iterations/iteration-002.md` and `research/deltas/iter-002.jsonl`; state run 2 is complete.
- [x] T007 Run iteration 3 on architecture alternatives, legacy policy, concurrency, and proof design.
  - Evidence: `research/iterations/iteration-003.md` and `research/deltas/iter-003.jsonl`; state run 3 is complete.
- [x] T008 Verify all iteration files, deltas, state records, and route-proof fields.
  - Evidence: three iteration records have `status=complete`, `target_agent=deep-research`, `agent_definition_loaded=true`, `mode=research`, and the expected resolved route; exactly three iteration and three delta files exist.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Verify the workflow-owned `research/research.md` synthesis answers all P0 questions.
  - Evidence: all five key questions are resolved; post-loop source checks corrected the false Pi/Cursor identity claim and removed the unsafe `"default"` fallback.
- [x] T010 Reconcile the parent phase map and phases 2 through 5 with confirmed findings.
  - Evidence: `../spec.md` marks Phase 1 complete; `../002-session-scoped-core/spec.md`, `../003-pi-and-runtime-bindings/spec.md`, and `../004-legacy-cutover-and-docs/spec.md` cite the corrected identity and Devin contracts.
- [x] T011 Refresh child and parent metadata.
  - Evidence: `generate-description.js` and `dist/graph/backfill-graph-metadata.js` exited 0 for `../` and children `001` through `005`; each contains refreshed `description.json` and `graph-metadata.json`.
- [x] T012 Run focused and recursive strict validation.
  - Evidence: `validate.sh specs/hooks/009-goal-isolation --recursive --strict` exited 0; parent and all five children reported zero errors and zero warnings.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Exactly three valid iterations completed.
- [x] Research synthesis is evidence-backed and implementation-ready after source correction.
- [x] No runtime implementation occurred in Phase 1.
- [x] Phase validation passes.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Parent**: `../spec.md`
<!-- /ANCHOR:cross-refs -->
