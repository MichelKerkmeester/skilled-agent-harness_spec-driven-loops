---
title: "Implementation Plan: md-generator upgrade research"
description: "Dispatch a 10-iteration deep-research loop (GPT 5.6 SOL xhigh via cli-opencode) over how the styles library upgrades the design-md-generator mode and synthesize ranked upgrade levers."
trigger_phrases:
  - "md generator upgrade plan"
  - "design-md-generator research plan"
  - "improve DESIGN.md plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-design/011-sk-design-styles-utilization/002-md-generator-upgrade"
    last_updated_at: "2026-07-18T11:00:00Z"
    last_updated_by: "claude"
    recent_action: "Research converged at 5 iters; ranked upgrade levers delivered"
    next_safe_action: "Seed a md-generator implementation phase from the Phase A schema contract"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-md-gen-upgrade-011-002"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions: []
---

# Implementation Plan: md-generator upgrade research

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Loop** | Deep-research (`fanout-run.cjs --loop-type research`), 10 iterations, convergence 0.05 |
| **Executor** | cli-opencode · `openai/gpt-5.6-sol-fast` · `--variant xhigh` |
| **Subject** | `.opencode/skills/sk-design/design-md-generator/` + the styles corpus |
| **Output** | `002-md-generator-upgrade/research/research.md` + iteration state |

### Overview
A single SOL-xhigh cli-opencode lineage runs the deep-research loop for up to 10 iterations over one question: how the 1,290-style library upgrades md-generator output. It reads the 001 retrieval findings first so it builds on the substrate. Convergence or the ceiling produces a ranked synthesis of upgrade levers.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The research question and subject (md-generator backend + corpus) are scoped
- [x] The executor and loop parameters are fixed

### Definition of Done
- [x] The loop converges (or hits the ceiling) and writes research.md
- [x] Upgrade levers are ranked with evidence and rough cost
- [x] Each lever names a concrete md-generator integration point
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Externalized-state research loop: a fresh SOL agent per iteration reads prior state, investigates one upgrade angle against the md-generator backend and the real corpus, and writes deltas; the reducer accumulates and checks convergence; a final synthesis ranks levers.

### Key Components
- `fanout-run.cjs` (research lineage runner).
- The deep-research SKILL contract and its `research/` artifact layout.
- The subject: `design-md-generator` backend (`formatters-v3`) + the styles corpus + 001 findings.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `002-md-generator-upgrade/research/**` | n/a (new) | loop state + synthesis | research.md exists with ranked levers |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Dispatch
- [x] Launch the SOL-xhigh research lineage with the md-generator upgrade topic

### Phase 2: Loop
- [x] Iterate to convergence or the 10-iteration ceiling

### Phase 3: Synthesize
- [x] Confirm research.md ranks upgrade levers with evidence + cost
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- Verify the loop wrote research.md and the iteration state under `research/`.
- Sanity-check that levers cite the `formatters-v3` schema and real corpus files, not just themes.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- `fanout-run.cjs`, cli-opencode, and a reachable GPT 5.6 SOL model.
- The md-generator backend and the extracted styles library as the subject.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Research is read-only over the codebase; delete `002-md-generator-upgrade/research/` to discard the loop output. Nothing in the sk-design runtime is touched by this phase.
<!-- /ANCHOR:rollback -->

---

## RELATED DOCUMENTS

- **Specification**: `spec.md`
- **Tasks**: `tasks.md`
- **Parent**: `../spec.md`
