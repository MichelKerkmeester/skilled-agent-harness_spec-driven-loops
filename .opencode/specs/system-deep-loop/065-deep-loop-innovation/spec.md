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
    last_updated_at: "2026-07-14T21:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Scaffolded parent lean trio and phase-001 Level-3 doc set"
    next_safe_action: "Set session goal, then launch the phase-001 deep-research run"
    blockers: []
    key_files:
      - "001-deep-loop-market-research/spec.md"
      - "001-deep-loop-market-research/plan.md"
      - "001-deep-loop-market-research/decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "065-parent-init"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Execution shape for phase 001: Shape A (parallel 3-lineage fan-out, needs operator OK for parallelism) vs Shape B (sequential batches LUNA then SOL then GLM) -- decided at execution start. See 001-deep-loop-market-research/decision-record.md ADR-002."
      - "GLM exact provider prefix (e.g. zai-coding-plan/glm-5.2) and whether GLM supports a max variant -- confirm at execution."
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
| `001-deep-loop-market-research` | Active | 45-iteration non-converging (broadening) `/deep:research` run over the loop-engineering landscape, split LUNA 25 / SOL 10 / GLM 10. Catalogues 10+ GitHub repos (links + what each teaches) and maps insights to specific system-deep-loop subsystems/children/modes. Deliverable: `research/research.md` synthesis (17-section, incl. Eliminated Alternatives) + repo catalogue + mapped insights. Research only; no code or skill changes. |
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
