---
title: Deep Research Strategy - MiniMax 2.7 efficiency via cli-opencode
description: Session tracking for deep research on best use / efficiency of MiniMax 2.7 dispatched through cli-opencode direct API.
---

# Deep Research Strategy - Session Tracking

## 1. OVERVIEW

### Purpose
Persistent brain for this research session. Determine how to improve/update `sk-prompt-models` and `cli-opencode` to make best use and maximize efficiency of MiniMax 2.7 via the cli-opencode direct MiniMax.io API path, producing concrete file-level deltas.

---

## 2. TOPIC
How can we improve/update sk-prompt-models and cli-opencode to make best use and maximize the efficiency of MiniMax 2.7 dispatched through cli-opencode via the direct MiniMax.io API provider? Extend the 114 small-model infrastructure (model-profiles.json, context-budget engine, output-verification pipeline, quota-fallback, permissions-matrix, pattern-index) rather than rebuilding it.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [ ] Q1: What are MiniMax 2.7's API characteristics (context window, reasoning/`--variant` controls, tool-calling, pricing, latency) that determine its context-budget defaults and cost/latency profile?
- [ ] Q2: What context-budget tuple and output-verification recipe should MiniMax 2.7 adopt, reusing 114's budget engine + 4-stage verification?
- [ ] Q3: What prompt-quality / RCAF patterns and `--variant`/reasoning-effort mapping maximize MiniMax 2.7 efficiency through cli-opencode?
- [ ] Q4: How should quota-pool + fallback wiring (`minimax-api`) and the structured permissions matrix apply to MiniMax 2.7?
- [ ] Q5: What routing heuristics should decide MiniMax 2.7 vs deepseek/qwen/glm, and what concrete file-level deltas to `sk-prompt-models` + `cli-opencode` follow?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
- Implementing the deltas (a follow-on packet acts on research.md)
- MiniMax via the opencode-go gateway (direct-API path only)
- Re-researching small-model patterns already settled by 114

---

## 5. STOP CONDITIONS
- Convergence: newInfoRatio <= 0.05 with quality gates satisfied
- Max iterations: 10
- All 5 key questions answered with actionable deltas

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
Q1: What are MiniMax 2.7's API characteristics (context window, reasoning/`--variant` controls, tool-calling, pricing, latency) that determine its context-budget defaults and cost/latency profile?

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT
- Phase 001 (this packet's sibling) just added the `minimax` direct-API provider to cli-opencode (`--model minimax/minimax-2.7`, `MINIMAX_API_KEY`, quota_pool `minimax-api`) and a `minimax-2.7` registry entry in `sk-prompt/assets/model-profiles.json` (v1.2) with `context_length`/`--variant` left unverified.
- 114 (small-ai-model-optimization, complete) shipped reusable infra: model-profile registry, context-budget engine, 4-stage output-verification, quota-pool fallback router, structured permissions matrix, and the `sk-prompt-models` pattern-index.
- Spec Kit Memory MCP was disconnected this session, so no prior-context retrieval was available; Known Context is from direct repo reads only.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 10
- Convergence threshold: 0.05
- Per-iteration budget: 12 tool calls, 10 minutes
- Progressive synthesis: true
- Executor: cli-codex `gpt-5.5`, reasoning high, service tier fast
- research/research.md ownership: workflow-owned canonical synthesis output
- Machine-owned sections: reducer controls Sections 3, 6, 7-11
- Current generation: 1
- Started: 2026-05-28T08:59:28Z
