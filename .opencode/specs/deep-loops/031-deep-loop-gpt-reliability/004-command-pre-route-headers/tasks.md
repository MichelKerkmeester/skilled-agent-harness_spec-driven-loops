---
title: "Tasks: Command Pre-Route Headers"
description: "Task list and evidence for phase 003 route-header implementation."
trigger_phrases:
  - "tasks"
  - "command-pre-route-headers"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/031-deep-loop-issues-with-gpt-opencode/004-command-pre-route-headers"
    last_updated_at: "2026-06-30T18:37:51Z"
    last_updated_by: "opencode-gpt"
    recent_action: "All route-header tasks complete and strict validation passed"
    next_safe_action: "Proceed to phase 004 GPT verification smoke"
    blockers: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "031-001-003-tasks"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Command Pre-Route Headers

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:notation -->
## TASK NOTATION

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] [priority] Description (file path) [evidence]`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## PHASE 1: SETUP

- [x] T001 [P0] Confirm phase 001 and 002 predecessors are complete - Evidence: active session summary recorded both phases passing strict validation.
- [x] T002 [P0] Read phase 003 spec, plan, tasks, checklist, implementation summary, and research edit map - Evidence: target docs and research section were read before edits.
- [x] T003 [P0] Load OpenCode implementation guidance through `sk-code` - Evidence: `sk-code` skill loaded and OPENCODE surface selected.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## PHASE 2: IMPLEMENTATION

- [x] T004 [P0] Add research route header to rendered template and CLI OpenCode prompt - Evidence: `prompt_pack_iteration.md.tmpl:2` and `deep_research_auto.yaml:925`; static route-header check PASS.
- [x] T005 [P0] Add review route header to rendered template and CLI OpenCode prompt - Evidence: `prompt_pack_iteration.md.tmpl:2` and `deep_review_auto.yaml:904`; static route-header check PASS.
- [x] T006 [P0] Add context route header to inline seat and one-shot prompt contracts - Evidence: exact context header appears twice in `deep_context_auto.yaml`; static route-header check PASS.
- [x] T007 [P0] Add ai-council route header to round prompt pack - Evidence: `prompt_pack_round.md:16`; static route-header check PASS.
- [x] T008 [P0] Propagate ai-council route fields through executor config and dispatch context - Evidence: `deep_ai-council_auto.yaml` names `resolved_route_header` and `route_fields`; focused Vitest tests PASS.
- [x] T009 [P1] Add focused council tests for route propagation - Evidence: `orchestrate-topic.vitest.ts` and `orchestrate-session.vitest.ts` include propagation coverage; 8 focused tests passed.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## PHASE 3: VERIFICATION

- [x] T010 [P0] Verify native `agent:` fields remain present - Evidence: grep found `agent: deep-research`, `agent: deep-review`, and `agent: deep-context` in native dispatch paths.
- [x] T011 [P0] Run focused council Vitest tests - Evidence: 2 files, 8 tests passed.
- [x] T012 [P0] Run modified council script syntax checks - Evidence: `node --check` passed for `orchestrate-session.cjs` and `orchestrate-topic.cjs`.
- [x] T013 [P0] Run `deep-loop-runtime` typecheck - Evidence: `npm run typecheck` exited 0.
- [x] T014 [P0] Run static route-header check - Evidence: `route-header-static-check PASS`.
- [x] T015 [P0] Run comment hygiene and alignment checks - Evidence: comment hygiene exited 0; alignment checks passed for affected OpenCode roots.
- [x] T016 [P0] Run `validate.sh --strict` on phase 003 - Evidence: strict validation passed with 0 errors and 0 warnings.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## COMPLETION CRITERIA

- [x] All implementation tasks are marked `[x]`.
- [x] No `[B]` blocked tasks remain.
- [x] Runtime and static verification passed.
- [x] Checklist evidence has been recorded.
- [x] Strict spec validation passed.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## CROSS-REFERENCES

- **Specification**: See `spec.md`.
- **Plan**: See `plan.md`.
- **Checklist**: See `checklist.md`.
- **Implementation Summary**: See `implementation-summary.md`.
- **Research Basis**: See `../../research/research.md`.
<!-- /ANCHOR:cross-refs -->
