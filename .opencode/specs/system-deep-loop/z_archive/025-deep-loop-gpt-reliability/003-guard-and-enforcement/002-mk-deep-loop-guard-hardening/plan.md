---
title: "Implementation Plan: mk-deep-loop-guard Orchestrate Loop-Detection Hardening"
description: "STATUS: RESEARCH COMPLETE. Design options synthesized; no implementation plan until the operator picks a direction and a new phase codes it."
trigger_phrases:
  - "implementation"
  - "plan"
  - "mk-deep-loop-guard hardening"
importance_tier: "high"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/025-deep-loop-gpt-reliability/003-guard-and-enforcement/002-mk-deep-loop-guard-hardening"
    last_updated_at: "2026-07-01T20:30:00Z"
    last_updated_by: "claude-code"
    recent_action: "5-iteration dual-model research complete and synthesized"
    next_safe_action: "Operator picks an implementation option; a new phase codes it"
    blockers: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "031-016-plan"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "SDK exposes sessionID/callID on every tool.execute.before call; 3 sibling plugins already use in-process closure Maps, mk-goal.js uses external per-session JSON state -- both mechanisms are viable and precedented."
---
# Implementation Plan: mk-deep-loop-guard Orchestrate Loop-Detection Hardening

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown research artifacts, `/deep:research` fan-out runtime |
| **Framework** | `deep-loop-workflows` deep-research mode over `deep-loop-runtime`'s `fanout-run.cjs` |
| **Storage** | Per-lineage JSONL research state log + per-iteration markdown under `research/lineages/{label}/` |
| **Testing** | N/A this phase (research-only; no code changes) |

### Overview
This phase has no implementation. It ran a 5-iteration dual-model fan-out (`cli-opencode openai/gpt-5.5-fast` reasoning=high, 3 iterations; `cli-opencode zai-coding-plan/glm-5.2` reasoning=max, 2 iterations) investigating whether `.opencode/plugins/mk-deep-loop-guard.js` can be extended with session-scoped dispatch-history tracking to mechanically detect loop-like repeated `orchestrate`-to-command-owned-loop-executor dispatches. Both lineages independently converged on the same core design (session-scoped state + an iteration-aware heuristic to distinguish legitimate command-driven loop iterations from illegitimate orchestrate re-dispatches) and surfaced a load-bearing, independently-verified fact: `orchestrate`'s Task dispatches always set `subagent_type: "general"`, so real target identity must come from parsing the prompt body, not the tool-call's structured field. This plan will be replaced with a real implementation plan once the operator picks between the proposed design options.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Phase 015 (skill-doc drift remediation) complete, providing a stable baseline to extend.
- [x] Research topic scoped in `spec.md` with concrete research questions.

### Definition of Done
- [x] Both fan-out lineages (5/5 iterations total) reach synthesis.
- [x] `research/lineages/{gpt-fast-high,glm-max}/research.md` each answer the research questions with file:line evidence.
- [x] The `subagent_type="general"` claim independently re-verified against real `orchestrate.md` content (not trusted from research alone).
- [x] At least 2 concrete design options with trade-offs and false-positive risk produced.
- [x] `validate.sh --strict` passes for this phase.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Research-first phase (same pattern as `007-gpt-behavioral-hardening-research`): no code changes in this phase, only investigation and synthesis.

### Key Components
- **`spec.md`**: the charter driving the deep-research fan-out.
- **Two-lineage `fanout-run.cjs --loop-type research` run**: `gpt-fast-high` (3 iterations) + `glm-max` (2 iterations), each an independent convergence loop under `research/lineages/{label}/`.

### Data Flow
`fanout-run.cjs` dispatches fresh research-leaf agents per iteration per lineage via detached `opencode run` CLI sessions, evaluates convergence (`stopPolicy: max-iterations`, so all iterations run regardless of early convergence), and each lineage synthesizes its own `research.md`. This document (`plan.md`) plus `implementation-summary.md` manually consolidate both lineages' findings.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Scaffolded phase folder, wrote research charter in `spec.md`.

### Phase 2: Research execution
- Launched the two-lineage `fanout-run.cjs --loop-type research` run (3 GPT-5.5 + 2 GLM-5.2 iterations).
- Both lineages completed cleanly (`status: fulfilled`, exit 0).

### Phase 3: Synthesis review
- Read both `research.md` outputs; independently re-verified the load-bearing `subagent_type="general"` claim directly against `orchestrate.md`.
- Consolidated into `implementation-summary.md` with a recommendation and remaining open decision.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

No code under test this phase. Verification is: did both fan-out lineages reach synthesis, and does each `research.md` cite file:line evidence for its claims (independently spot-checked, not trusted at face value).
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Status |
|------------|--------|
| Phase 012 (GPT-vs-Claude benchmark) evidence | Complete (cited as the grounding inconsistency this hardening addresses) |
| Phase 015 (skill-doc drift remediation) | Complete (cli-opencode's routing contract this design must respect) |
| `cli-opencode` GLM-5.2 / GPT-5.5-fast dispatch | Available, both confirmed working this phase |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

No code changes in this phase; nothing to roll back. Research state is confined to `research/` under this phase folder.
<!-- /ANCHOR:rollback -->
