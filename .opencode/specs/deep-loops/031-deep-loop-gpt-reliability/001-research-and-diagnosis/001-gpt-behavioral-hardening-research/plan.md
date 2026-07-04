---
title: "Implementation Plan: GPT Behavioral Hardening — Follow-Up Research"
description: "STATUS: RESEARCH-ONLY. No implementation plan until /deep:research synthesizes findings and proposes concrete next phases."
trigger_phrases:
  - "implementation"
  - "plan"
  - "gpt behavioral hardening"
importance_tier: "critical"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "deep-loops/031-deep-loop-gpt-reliability/001-research-and-diagnosis/001-gpt-behavioral-hardening-research"
    last_updated_at: "2026-07-01T05:45:00Z"
    last_updated_by: "claude-code"
    recent_action: "Phase scaffolded, research not yet launched"
    next_safe_action: "Launch /deep:research per research-prompt.md"
    blockers: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "031-007-init"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: GPT Behavioral Hardening — Follow-Up Research

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown research artifacts, `/deep:research` runtime |
| **Framework** | `deep-loop-workflows` deep-research mode over `deep-loop-runtime` |
| **Storage** | JSONL research state log + per-iteration markdown |
| **Testing** | N/A this phase (research-only; no code changes) |

### Overview
This phase has no implementation yet. It exists to launch and track a `/deep:research` follow-up investigation (charter: `research-prompt.md`) into why real-world GPT-backed OpenCode deep-loop symptoms persist after phases 002-005. This plan will be replaced with a real implementation plan once the research synthesizes `research/research.md` and proposes concrete next phases.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Research charter written (`research-prompt.md`) with KQ1-KQ9, boundaries, stop conditions.
- [ ] GLM-5.2 reasoning-effort forwarding smoke-tested.
- [ ] `antiConvergence.minIterations` raised to 30 in this run's config.

### Definition of Done
- [ ] `/deep:research` completes >=30 iterations without early convergence.
- [ ] `research/research.md` answers KQ1-KQ9 with file:line evidence.
- [ ] Synthesis proposes a concrete next-phase breakdown.
- [ ] `validate.sh --strict` passes for this phase.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Research-first phase (same pattern as `001-deep-agent-router-and-orchestration`): no code changes in this phase, only investigation and synthesis.

### Key Components
- **`research-prompt.md`**: the charter driving the deep-research loop.
- **Two-lineage `/deep:research` run**: GLM-5.2 (max-thinking) + GPT-5.5-fast (high), each an independent convergence loop under `research/lineages/{label}/`.

### Data Flow
`/deep:research:auto` reads `research-prompt.md`, dispatches fresh research-leaf agents per iteration per lineage, evaluates convergence (floor raised to 30), and synthesizes `research/research.md` once both lineages complete or are manually merged.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Pre-launch checks
- Smoke-test GLM-5.2 reasoning-effort forwarding.
- Raise `antiConvergence.minIterations` to 30 in the run config.

### Phase 2: Research execution
- Launch the two-lineage `/deep:research:auto` run per `research-prompt.md` §8.
- Monitor for early-convergence attempts; steer/expand angle if a plateau appears before iteration 30.

### Phase 3: Synthesis review
- Review `research/research.md` against KQ1-KQ9.
- Propose the next phase breakdown (continuing numbering from 007).
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

No code under test this phase. Verification is: did the research reach >=30 iterations without early convergence, and does `research/research.md` cite file:line evidence for every KQ.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Status |
|------------|--------|
| Phase 005 (GPT verification smoke) evidence | Complete (inconclusive result, cited as input) |
| Phase 006 (host hard identity/FIX-5) decision-record | Complete (parked, cited as input) |
| `cli-opencode` GLM-5.2 / GPT-5.5-fast dispatch | Available, GLM reasoning-effort mapping unverified |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

No code changes in this phase; nothing to roll back. If the research run needs to be aborted, stop the `/deep:research` process — no persistent state outside `research/` in this folder is mutated.
<!-- /ANCHOR:rollback -->
