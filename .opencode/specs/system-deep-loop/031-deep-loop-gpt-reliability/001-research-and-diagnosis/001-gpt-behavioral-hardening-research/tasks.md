---
title: "Tasks: GPT Behavioral Hardening — Follow-Up Research"
description: "STATUS: RESEARCH-ONLY. Task breakdown deferred until /deep:research synthesizes findings."
trigger_phrases:
  - "tasks"
  - "gpt behavioral hardening"
importance_tier: "critical"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/031-deep-loop-gpt-reliability/001-research-and-diagnosis/001-gpt-behavioral-hardening-research"
    last_updated_at: "2026-07-01T05:45:00Z"
    last_updated_by: "claude-code"
    recent_action: "Research complete: both lineages 30/30 iterations, consolidated research.md written"
    next_safe_action: "Plan phase 008 (prompt-layer hardening) per research.md §3 recommended breakdown"
    blockers: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "031-007-init"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Confirm a genuine OPENCODE_PID-free external shell exists before starting phase 010 (research.md §1.3, §4)"
      - "Resolve the smoke-first vs fix-first phase-ordering disagreement between the two lineages (research.md §1.2) before planning 008-012"
    answered_questions:
      - "All 9 KQs answered by both lineages with file:line evidence; consolidated in research.md."
---
# Tasks: GPT Behavioral Hardening — Follow-Up Research

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

`[ ]` pending, `[x]` complete, `[B]` blocked. Tasks below cover the research launch only; implementation tasks are deferred until the synthesis proposes concrete next phases.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 — Write research charter (`research-prompt.md`).
- [x] T002 — Smoke-test GLM-5.2 `--variant`/reasoning-effort forwarding at "max" (confirmed working: 126 vs 67 reasoning tokens at max vs high).
- [x] T003 — Raise `antiConvergence.minIterations` to 30 via the correct mechanism (`--stop-policy=max-iterations`, after discovering the file-patch approach was overridden by the model).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 — Launched `/deep:research` two-lineage fan-out (`fanout-run.cjs`) with GLM-5.2 max + GPT-5.5-fast high, `--stop-policy=max-iterations`.
- [x] T005 — Confirmed both lineages reached exactly 30/30 iterations with `stopReason=maxIterationsReached`/`max_iterations`; early convergence signals (newInfoRatio dropping well below typical thresholds by iter ~10-15) were correctly treated as telemetry only, not a stop condition.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 — Reviewed both round-1 lineages' `research.md` plus the consolidated `research/research.md` against KQ1-KQ9; all have file:line evidence. Cross-lineage agreement confirmed on all core recommendations; two disagreements (Mode D discovery, phase-ordering) documented rather than silently resolved.
- [x] T007 — Ran `validate.sh --strict` on this phase folder: PASSED.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Operator-Directed Critical Re-Review Round (research-prompt.md §9)

- [x] T008 — Launched `sonnet-critical` (Claude Sonnet 5, 10 iterations): completed 10/10, found real corrections (Mode D confirmed-fired, NDP violation, ai-council code trace) but its ai-council "guaranteed FAIL" claim was itself wrong.
- [x] T009 — Launched `glm-critical` (GLM-5.2, 10 iterations): stalled reproducibly on iteration 2 across 3 attempts (~29-50 min each, near-zero CPU) due to GLM usage/quota exhaustion (operator-confirmed). Abandoned after the 3rd stall per operator instruction; iteration 1 (7 findings) preserved.
- [x] T010 — Replaced the GLM slot with `opus-critical` (Claude Opus 4.8) + `gpt-critical` (GPT-5.5-fast, self-critiquing): both completed 10/10. `opus-critical` corrected `sonnet-critical`'s ai-council claim via direct code trace; `gpt-critical` independently reached the same corrected understanding.
- [x] T011 — Re-ran `fanout-merge.cjs` across all 6 lineages: `merged_lineages: 6, skipped_no_registry: 0`.
- [x] T012 — Rewrote `research/research.md` as the final consolidated synthesis, incorporating the round-2 correction dynamic explicitly (§0, §2) rather than silently picking one lineage's answer.
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

This phase is complete when the research run has finished (>=30 iterations for round 1, no early convergence), `research/research.md` answers all KQs with evidence, and a concrete next-phase breakdown has been proposed. **Met**, including the operator-directed critical re-review round. See `research/research.md` §4 for the final proposed 008-012 breakdown.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Research charter: `research-prompt.md`
- Goal / session objective: `../goal-prompt.md`
- Predecessor evidence: `../005-gpt-verification-smoke/`, `../006-host-hard-identity-fix5/decision-record.md`
<!-- /ANCHOR:cross-refs -->
