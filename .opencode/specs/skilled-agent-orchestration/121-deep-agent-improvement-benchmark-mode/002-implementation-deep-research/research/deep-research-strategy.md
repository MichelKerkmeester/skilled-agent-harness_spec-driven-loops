---
title: Deep Research Strategy - deep-agent-improvement model-benchmark mode implementation
description: Session tracking for deep research (MiniMax M2.7 executor) on how to implement the model-benchmark mode designed in 001.
---

# Deep Research Strategy - Session Tracking

## 1. OVERVIEW

### Purpose
Persistent brain for this research session. Turn the 001 mode-selector ADRs into build-ready implementation guidance: exact per-seam interface contracts, a model-agnostic dispatcher, a clean eval-rig scorer port, and a `mode` switch wired into `loop.cjs` without regressing the agent-improvement path. Also dogfoods MiniMax M2.7 as a deep-research executor.

---

## 2. TOPIC
How should we implement the deep-agent-improvement model-benchmark mode designed in 001? Define exact interface contracts for the three pluggable seams (candidate-source, dispatcher, scorer); generalize 120/003 `dispatch-minimax.cjs` into a model-agnostic `dispatch-model.cjs`; port the 120/003 eval-rig scorer + 5-dim rubric cleanly; wire a `mode` switch (agent-improvement | model-benchmark) into `loop.cjs` without regressing agent-improvement; backward-compat test strategy; implementation edge cases. Output per-seam interface contracts + a wiring/backward-compat build-delta list.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
[None yet]

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
- Building the mode (a follow-on packet acts on this research + the 001 design)
- Re-deciding the architecture (001's ADRs stand; this deepens implementation, not the decision)
- Moving or changing the 120/003 rig (referenced as the port source only)

---

## 5. STOP CONDITIONS
- Convergence: newInfoRatio <= 0.05 with quality gates satisfied
- Max iterations: 10
- All 5 key questions answered with build-ready, file-level guidance

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
[None yet]

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
[None yet]

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
[None yet]

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
[No exhausted approach categories yet]

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
[None yet]

<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT
- Phase 001 (this packet's sibling) authored the mode-selector design: ADR-001 (mode selector + 3 pluggable seams + reuse map), ADR-002 (home = deep-agent-improvement), ADR-003 (keep scorers/promotion separate). deep-agent-improvement is ~90% generic loop plumbing (mutation-coverage / reduce-state / converge / materialize-fixtures / improvement-journal); deep-loop-runtime is a read-only library, NOT a loop host.
- 120/003 shipped the port source: `eval-rig/` (7 fixtures + deterministic checks + claude grader + 5-dim rubric) and `eval-loop/scripts/` (loop.cjs, mutate.cjs, render-variant.cjs, score-variant.cjs, dispatch-minimax.cjs, converge.cjs, synthesize.cjs). Winner: TIDD-EC framework + dense pre-planning (0.775).
- Spec Kit Memory MCP context retrieval may be unavailable this session; Known Context is from direct repo reads + the 001 design docs.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 10
- Convergence threshold: 0.05
- Per-iteration budget: 12 tool calls, 10 minutes
- Progressive synthesis: true
- Executor: cli-opencode `minimax/MiniMax-M2.7`, no `--variant` (reasoningEffort null)
- research/research.md ownership: workflow-owned canonical synthesis output
- Machine-owned sections: reducer controls Sections 3, 6, 7-11
- Current generation: 1
- Started: 2026-05-28T14:46:22Z
