---
title: "Tasks: mk-deep-loop-guard Orchestrate Loop-Detection Hardening"
description: "STATUS: RESEARCH COMPLETE. Implementation tasks deferred until the operator picks a design option."
trigger_phrases:
  - "tasks"
  - "mk-deep-loop-guard hardening"
importance_tier: "high"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "deep-loops/031-deep-loop-issues-with-gpt-opencode/016-mk-deep-loop-guard-hardening"
    last_updated_at: "2026-07-01T20:30:00Z"
    last_updated_by: "claude-code"
    recent_action: "Research complete: both lineages fulfilled, consolidated implementation-summary.md written"
    next_safe_action: "Operator picks an implementation option; a new phase codes it"
    blockers: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "031-016-tasks"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "In-process counter (Option A/lightweight) vs external state + iteration-aware counting (Option B/robust) -- both lineages recommend B with A as a lower-blast-radius first step."
    answered_questions:
      - "All 4 research questions answered by both lineages with file:line evidence; consolidated in implementation-summary.md."
---
# Tasks: mk-deep-loop-guard Orchestrate Loop-Detection Hardening

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

`[ ]` pending, `[x]` complete, `[B]` blocked. Tasks below cover the research launch only; implementation tasks are deferred until the operator picks a design option.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 — Write research charter (`spec.md`) with 4 concrete research questions.
- [x] T002 — Scaffold phase folder under packet 031, following phase 007's Level-1 research-only precedent.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 — Launched two-lineage `fanout-run.cjs --loop-type research` fan-out: `gpt-fast-high` (`openai/gpt-5.5-fast`, reasoning=high, 3 iterations) + `glm-max` (`zai-coding-plan/glm-5.2`, reasoning=max, 2 iterations), `stopPolicy=max-iterations`.
- [x] T004 — Confirmed both lineages completed cleanly (`status: fulfilled`, exit 0 each); `gpt-fast-high` 781s, `glm-max` 667s wall-clock.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T005 — Read both lineages' `research.md`; confirmed strong convergence on core design (session-scoped state + iteration-aware heuristic) despite independent execution.
- [x] T006 — Independently re-verified the single most load-bearing claim (GLM's discovery that `orchestrate`'s Task dispatches always set `subagent_type: "general"`) directly against `orchestrate.md`'s Priority table and dispatch template, rather than trusting the research at face value. **Confirmed true.**
- [x] T007 — Consolidated both lineages into `implementation-summary.md` with a recommendation and the one remaining open decision (Option A vs B).
- [x] T008 — Ran `validate.sh --strict` on this phase folder: PASSED.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

This phase is complete when both fan-out lineages finish, each `research.md` answers the research questions with evidence, the single most load-bearing claim is independently re-verified (not trusted from research alone), and at least 2 concrete design options are produced. **Met.** See `implementation-summary.md` for the full synthesis and recommendation.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Research charter: `spec.md`
- Predecessor: `../015-skill-doc-drift-remediation/implementation-summary.md`
- Grounding evidence: `../012-gpt-claude-benchmark/benchmark-results.md`
<!-- /ANCHOR:cross-refs -->
