---
title: "Phase Parent: Deep-Loop Innovation Program"
description: "Innovation program for the system-deep-loop parent skill: deeply research the state of the art in loop engineering (agentic/iterative loops) across the open ecosystem, mine 10+ GitHub repos for transferable techniques, then rank findings, design spec-ready improvement proposals, and optionally implement them across the deep-loop children/modes and the shared runtime loop engine."
trigger_phrases:
  - "deep loop innovation"
  - "loop engineering research"
  - "deep loop market research"
  - "improve system-deep-loop"
  - "loop engineering state of the art"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation"
    last_updated_at: "2026-07-15T08:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Phases 001 + 005 COMPLETE; 005 added targeted SOL-xhigh follow-on (74 repos)"
    next_safe_action: "Operator review 001 + 005 research.md; begin phase 002 ranking + mapping"
    blockers: []
    key_files:
      - "001-deep-loop-market-research/research/research.md"
      - "005-deep-loop-effectiveness-and-fanout/research/research.md"
      - "005-deep-loop-effectiveness-and-fanout/implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "065-parent-init"
      parent_session_id: null
    completion_pct: 40
    open_questions: []
    answered_questions:
      - "Research state lives INSIDE the phase child at 001-deep-loop-market-research/research/, created at execution by the /deep:research loop -- never pre-scaffolded."
      - "GPT lineages run ONLY via cli-codex; GLM runs via cli-opencode (operator mandate)."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Phase Parent: Deep-Loop Innovation Program

<!-- SPECKIT_LEVEL: phase -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | phase |
| **Priority** | P1 |
| **Status** | Active |
| **Created** | 2026-07-14 |
| **Parent Packet** | None (top-level packet under the system-deep-loop track) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PURPOSE

The `system-deep-loop` parent skill owns every autonomous iterative loop in this repository: the deep-research, deep-review, deep-ai-council, deep-improvement (agent-improvement, model-benchmark, skill-benchmark, ai-system-improvement) and deep-alignment children/modes, plus the shared `runtime/` loop engine (convergence math, state JSONL, fan-out, gauges, dedup, locks and recovery). These loops were designed inside this repo, against this repo's own failure modes. Meanwhile the open ecosystem has been iterating hard on the same problems under the banner of loop engineering: loop control and termination policy, evaluator/critic/verifier loops, reflection and self-improvement, multi-agent deliberation, state externalization and durable execution, fan-out/fan-in orchestration, novelty and coverage tracking, budget and depth control, and loop observability. Nothing in this repo systematically mines that body of work, so improvement ideas for system-deep-loop currently come only from local incident experience.

This packet is the innovation program that closes the gap. Phase 001 runs a 45-iteration NON-CONVERGING (broadening) `/deep:research` investigation of the loop-engineering state of the art, catalogues at least 10 valuable GitHub repos with the transferable lesson each one teaches, and maps every insight to a specific system-deep-loop subsystem, child, or mode. Later phases rank and dedup those findings, turn the selected ones into concrete spec-ready improvement proposals, and optionally implement them. The end state is a prioritized, evidence-backed improvement pipeline for system-deep-loop grounded in the best of what the wider ecosystem has learned about running agentic loops.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:phases -->
## 3. PHASE DOCUMENTATION MAP

| Phase | Status | Purpose |
|-------|--------|---------|
| `001-deep-loop-market-research` | Complete | 45-iteration non-converging (broadening) `/deep:research` run over the loop-engineering landscape, split LUNA 25 / SOL 10 / GLM 10. **Done 2026-07-15:** 216 repos catalogued, 222 insights, 134 contradictions, all 13 subsystems mapped; `research/research.md` synthesized (17-section incl. Eliminated Alternatives). Executed via a manual Shape-B driver (fanout codex leaves lack `--search`; ADR-002). Research only; no code or skill changes. |
| `005-deep-loop-effectiveness-and-fanout` | Complete | Targeted single-lineage SOL-xhigh (20-iteration, non-converging) follow-on to 001 — three threads: fan-out automation + recommendation deep-dive + AI-council depth. **Done 2026-07-15:** 74 new repos, 83 insights, 59 recommendations, 64 contradictions, 14 subsystems mapped; `research/research.md` synthesized. A live 3-model `scratch/` prototype proves an automated multi-model + `--search` fanout is feasible; the shipped `fanout-run.cjs` is unmodified (the small fix is a gated follow-on). Research + scratch-prototype only; no runtime changes. |
| `002-synthesis-and-improvement-mapping` | Planned | Rank and dedup phase-001 findings, map each finding to a system-deep-loop subsystem/child/mode, prioritize by impact x effort. |
| `003-improvement-proposals` | Planned | Design concrete, spec-ready changes for the selected improvements. |
| `004-implementation` | Planned | Optional; gated on 003 outcomes. Implement the approved proposals. |

> Phases 002-004 are Planned map entries only; their child folders are scaffolded when each phase starts. Phase 001 satisfies phase-parent detection on its own.

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/speckit:resume` on a specific child to resume that phase
- Run `validate.sh --recursive` on the parent to validate all phases as an integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001 | 002 | `research/research.md` synthesis complete; 10+ repos catalogued; insights mapped to 6+ distinct subsystems | Phase-001 checklist P0 items all checked with evidence; strict validation Errors: 0 |
| 002 | 003 | Ranked, deduped improvement map with impact x effort priorities | Phase-002 deliverable reviewed by operator |
| 003 | 004 | Spec-ready proposals approved by operator | Explicit operator go decision (004 is optional) |
<!-- /ANCHOR:phases -->
