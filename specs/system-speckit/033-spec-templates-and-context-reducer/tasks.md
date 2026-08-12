---
title: "Tasks: Spec-Kit Template & Context Reducer Research"
description: "Ordered task list for launching and closing out the 10-iteration multi-model deep-research run."
importance_tier: "normal"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-spec-templates-and-context-reducer"
    last_updated_at: "2026-08-12T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored task list"
    next_safe_action: "Operator sets goal; launch loop"
    blockers: []
    key_files:
      - "specs/system-speckit/033-spec-templates-and-context-reducer/plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-12-system-speckit-033-templates-context-reducer"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Tasks: Spec-Kit Template & Context Reducer Research

<!-- ANCHOR:notation -->
## Task Notation

`[ ]` open · `[~]` in progress · `[x]` done · `[!]` blocked. Evidence required on completion.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] **T001** Author research charter (`spec.md`) — scope, requirements, risks, open questions.
- [x] **T002** Author execution plan (`plan.md`) — verified executor matrix + launch command.
- [x] **T003** Generate packet metadata (`description.json`, `graph-metadata.json`).
- [x] **T004** Tier mappings resolved (grok max → `cursor-grok-4.5-high`; swe 1.7 → `swe-1-7`). Devin lineages later replaced (see T006).
- [x] **T005** Goal set; run launched.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] **T006** Launched fan-out. cursor lineages (grok 3/3, composer 2/2) completed clean. Both cli-devin lineages failed structurally (single-turn `-p`); after a hardened retry confirmed the cause, they were replaced with **cli-pi / deepseek-v4-flash** (pi-flash-a 3/3, pi-flash-b 2/2). Final: 10 iters, 4 lineages, 3 models.
- [x] **T007** Monitored throughout. Caught devin write-containment violation early, halted, verified 0 net repo damage, then swapped executor.
- [x] **T008** Synthesized `research/research.md` (cross-lineage merge) and wrote the `spec.md` findings fence.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] **T009** 10/10 iterations on disk across 4 lineages; all `stopReason: max_iterations` (forced depth held).
- [x] **T010** Quality guards passed per lineage (source diversity, one-focus-per-iteration, no weak single source).
- [x] **T011** Findings cited + classified; ranked shortlist (6) + refutation list present in `research/research.md`. Top-3 implementable findings independently re-verified this session.
- [x] **T012** `git status` clean outside the `033` packet; devin's `sh-thd-*` litter swept; 0 net repo damage confirmed.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- All P0 requirements (REQ-001–004) satisfied with evidence; REQ-005–006 present or explicitly deferred.
- Continuity saved via `generate-context.js`.
- Go/no-go recorded per surviving opportunity before any implementation packet is scoped.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Charter: `spec.md` · Plan: `plan.md` · Seeds: `context/*.md`
- Downstream: `/speckit:plan` (separate implementation packet, only if opportunities survive review).
<!-- /ANCHOR:cross-refs -->
