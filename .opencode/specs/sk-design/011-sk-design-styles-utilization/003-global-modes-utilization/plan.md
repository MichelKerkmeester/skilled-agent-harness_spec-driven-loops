---
title: "Implementation Plan: global styles utilization research"
description: "Dispatch a 10-iteration deep-research loop (GPT 5.6 SOL xhigh via cli-opencode) over how the styles library integrates across the sk-design hub and its non-md-generator modes, and synthesize ranked per-mode strategies."
trigger_phrases:
  - "global styles utilization plan"
  - "styles across design modes plan"
  - "sk-design hub integration plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-design/011-sk-design-styles-utilization/003-global-modes-utilization"
    last_updated_at: "2026-07-18T11:00:00Z"
    last_updated_by: "claude"
    recent_action: "Authored the global-modes utilization research charter"
    next_safe_action: "Dispatch the SOL-xhigh research loop over the global-modes topic"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-global-modes-011-003"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions: []
---

# Implementation Plan: global styles utilization research

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
| **Subject** | The sk-design hub + interface/foundations/motion/audit/open-design modes + the styles corpus |
| **Output** | `003-global-modes-utilization/research/research.md` + iteration state |

### Overview
A single SOL-xhigh cli-opencode lineage runs the deep-research loop for up to 10 iterations over one question: how the library integrates per mode across the hub. It reads the 001 substrate findings first and scopes away from md-generator (002). Convergence or the ceiling produces a ranked synthesis of per-mode integration strategies.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The research question and per-mode subjects are scoped
- [x] The executor and loop parameters are fixed

### Definition of Done
- [ ] The loop converges (or hits the ceiling) and writes research.md
- [ ] Per-mode strategies are ranked with evidence and rough cost
- [ ] The non-md-generator modes + hub are all covered
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Externalized-state research loop: a fresh SOL agent per iteration reads prior state, investigates one mode's integration angle against its real contract and the corpus, and writes deltas; the reducer accumulates and checks convergence; a final synthesis ranks per-mode strategies.

### Key Components
- `fanout-run.cjs` (research lineage runner).
- The deep-research SKILL contract and its `research/` artifact layout.
- The subject: the hub + interface/foundations/motion/audit/open-design modes + the corpus + 001 findings.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `003-global-modes-utilization/research/**` | n/a (new) | loop state + synthesis | research.md exists with ranked per-mode strategies |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Dispatch
- [ ] Launch the SOL-xhigh research lineage with the global-modes utilization topic

### Phase 2: Loop
- [ ] Iterate to convergence or the 10-iteration ceiling

### Phase 3: Synthesize
- [ ] Confirm research.md ranks per-mode strategies with evidence + cost
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- Verify the loop wrote research.md and the iteration state under `research/`.
- Sanity-check that strategies cite each mode's real contract, not just themes.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- `fanout-run.cjs`, cli-opencode, and a reachable GPT 5.6 SOL model.
- The mode contracts and the extracted styles library as the subject.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Research is read-only over the codebase; delete `003-global-modes-utilization/research/` to discard the loop output. Nothing in the sk-design runtime is touched by this phase.
<!-- /ANCHOR:rollback -->

---

## RELATED DOCUMENTS

- **Specification**: `spec.md`
- **Tasks**: `tasks.md`
- **Parent**: `../spec.md`
