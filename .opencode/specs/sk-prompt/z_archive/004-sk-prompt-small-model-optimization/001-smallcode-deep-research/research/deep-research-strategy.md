---
title: Deep Research Strategy — smallcode-master small-model pattern extraction
description: Live strategy file for the 20-iter cli-devin SWE-1.6 dogfood loop. Reducer updates Sections 3, 6, 7-11 between iters; analyst owns Sections 1-2, 4-5, 12-13.
---

# Deep Research Strategy — smallcode-master small-model pattern extraction

## 1. OVERVIEW

### Purpose

Live state file for the deep-research loop targeting `001-research-smallcode/`. The orchestrator + reducer keep this in sync with `deep-research-state.jsonl` and `findings-registry.json`. Read at every iteration to surface focus, key questions, and prior dead-ends.

### Usage

- **Init:** Strategy populated from `spec.md` §4 (5 RQs), §3 SCOPE (in/out), §4 NFR, and the preflight context-card at `../preflight/context-card.md`.
- **Per iteration:** cli-devin SWE-1.6 reads Next Focus + Key Questions, writes iter markdown + JSONL delta; reducer refreshes machine-owned sections.
- **Mutability:** Mutable — analyst-owned sections (Topic, Non-Goals, Stop Conditions, Known Context, Research Boundaries) stay stable; machine-owned sections (Key Questions, Answered Questions, What Worked, What Failed, Exhausted Approaches, Ruled Out, Next Focus) refresh after each iter.

---

## 2. TOPIC

Mine the MIT-licensed `external/smallcode-master/` corpus (v0.2.2, May 2026, by Doorman11991) for runtime patterns that small models like SWE-1.6 need to produce reliable output. Surface concrete, file-path-bound candidate skill-deltas across `.opencode/skills/{cli-devin,cli-opencode,sk-prompt,sk-code,mcp-code-mode,system-skill-advisor}` plus `AGENTS.md`, possibly landing as a new `sk-small-model` skill. Dogfood the loop on cli-devin SWE-1.6 (free tier per cli-devin v1.0.6.2) to validate the budget-engine thesis in flight.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] RQ1 — Context Budget Engine: ANSWERED. Iter 1 surveyed 5 patterns; iter 6 deepened with per-model token-budget defaults table (8 models), truncation-marker syntax, eviction priority ladder, sk-prompt cli_prompt_quality_card.md integration point.
- [x] RQ2 — Output Verification Pipeline: ANSWERED. Iter 2 surveyed 5 patterns; iter 7 deepened with drop-in system_instructions for SWE-1.6 output verification, confidence-scoring rubric formula, post-dispatch-validate.ts integration handshake, hard-fail message template.
- [x] RQ3 — Per-Model Profiles & Escalation: ANSWERED. Iter 3 surveyed 5 patterns; iter 8 deepened with full model-profile.json schema (8 models), escalation decision matrix (downgrade + escalate + quota-aware), registry location verdict (sk-prompt/assets/), bayesian scoring placement verdict (cli-* iter recipes).
- [x] RQ4 — Structured Scope/Permissions: ANSWERED. Iter 4 surveyed 5 patterns; iter 9 deepened with permissions-matrix.schema.json, RM-8 counter-example walkthrough (44-file deletion analysis), schema location verdict (cli-opencode/assets/), runtime enforcement design (pre-tool-call hook).
- [x] RQ5 — Skill Architecture (synthesis): ANSWERED. Iter 5 verdict HYBRID (distributed references + enhances edges, NO new skill); iter 10 cross-cutting AGENTS.md addition + 5 enhances-edges + trigger_phrases + 5-lane scoring simulation. Iter 11 gap audit Outcome B = coverage confirmed (41 artifacts across 10 iters).

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS

- Implementing recommended skill deltas (lands in follow-on 002+ packets created after synthesis ships)
- Forking smallcode-master or contributing upstream (inbound extraction only)
- Replacing mcp-code-mode / system-skill-advisor / deep-research infrastructure (integration OK, architectural rewrites excluded)
- Re-litigating 113-arc findings (RCAF, medium pre-plan, bundle-gate, sequential_thinking 2-layer, free-tier disclosure, RM-8 four-layer mitigation) — these are inputs, not subjects
- Multi-language portability concerns (smallcode is JS/Marrowscript; our adoption targets are markdown + JSON skill assets)

---

## 5. STOP CONDITIONS

- **Convergence:** `newInfoRatio < 0.15` (rolling average over last 3 iters) AND graph_decision != STOP_BLOCKED AND inline 3-signal weighted vote > 0.60
- **Iteration cap:** 20 iters
- **Stuck recovery:** 3 consecutive iter failures → halt for manual intervention
- **All-answered:** all 5 RQs marked answered with ≥3 citations each AND ≥1 candidate delta per RQ
- **Coverage:** answered/total ≥ 0.85 of Key Questions

Synthesis pass runs unconditionally after stop trigger. Must cover all 5 RQs even if convergence fires before all are explored.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- RQ1 — Context Budget Engine: ANSWERED. Iter 1 surveyed 5 patterns; iter 6 deepened with per-model token-budget defaults table (8 models), truncation-marker syntax, eviction priority ladder, sk-prompt cli_prompt_quality_card.md integration point.
- RQ2 — Output Verification Pipeline: ANSWERED. Iter 2 surveyed 5 patterns; iter 7 deepened with drop-in system_instructions for SWE-1.6 output verification, confidence-scoring rubric formula, post-dispatch-validate.ts integration handshake, hard-fail message template.
- RQ3 — Per-Model Profiles & Escalation: ANSWERED. Iter 3 surveyed 5 patterns; iter 8 deepened with full model-profile.json schema (8 models), escalation decision matrix (downgrade + escalate + quota-aware), registry location verdict (sk-prompt/assets/), bayesian scoring placement verdict (cli-* iter recipes).
- RQ4 — Structured Scope/Permissions: ANSWERED. Iter 4 surveyed 5 patterns; iter 9 deepened with permissions-matrix.schema.json, RM-8 counter-example walkthrough (44-file deletion analysis), schema location verdict (cli-opencode/assets/), runtime enforcement design (pre-tool-call hook).
- RQ5 — Skill Architecture (synthesis): ANSWERED. Iter 5 verdict HYBRID (distributed references + enhances edges, NO new skill); iter 10 cross-cutting AGENTS.md addition + 5 enhances-edges + trigger_phrases + 5-lane scoring simulation. Iter 11 gap audit Outcome B = coverage confirmed (41 artifacts across 10 iters).

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

<!-- MACHINE-OWNED: END -->

---

## 12. KNOWN CONTEXT

### Predecessor packet (shipped findings — DO NOT re-propose)

113-cli-devin-prompt-quality shipped (per cli-devin v1.0.6.3):

1. RCAF default for SWE-1.6 dispatches
2. Medium-density pre-planning (3-4 ordered steps with per-step acceptance + verification)
3. Standard bundle-gate (NOT strict — verbose constraints push SWE-1.6 toward defensive output)
4. Anti-hallucination wording as ~2.4× less impactful than framework choice
5. Sequential_thinking 2-layer pattern (user-scope `devin mcp add` + `system_instructions` mandate)
6. SWE-1.6 Free-tier disclosure (no Pro quota burn)
7. RM-8 destructive-scope-violation four-layer mitigation (cli-opencode v1.3.3.0)
8. Cross-CLI propagation of bundle-gate + anti-hallucination guidance (sk-prompt v1.3.1.0 + cli-opencode v1.3.3.0 + cli-devin v1.0.6.1)

### Preflight context-card

Located at `../preflight/context-card.md` — 631 lines, 6 sections (Overview + RQ1..RQ5). Citation counts per RQ:

- RQ1: 56 citations across `src/context/budget.ms`, `smallcode.toml`, `PLAN.md`, `README.md`
- RQ2: 45 citations across `src/governor/{verifier,hard_fail}.ms`, `bin/governor.js`, `src/tools/router.ms`
- RQ3: 34 citations across `src/model/profiles.ms`, `src/governor/tool_scorer.ms`, `bin/escalation.js`
- RQ4: 22 citations across smallcode's tool registry surface
- RQ5: 11 citations across `bin/smallcode.js`, `bin/governor.js`, `PLAN.md`

Cite the preflight card by section + line range as primary; drill to smallcode source only for specific patterns the card doesn't already quote.

### Our skill tree (target paths for deltas)

- `.opencode/skills/cli-devin/` v1.0.6.3 — SWE-1.6 default, RCAF, sequential_thinking 2-layer
- `.opencode/skills/cli-opencode/` v1.3.3.0 — DeepSeek-v4-pro / Kimi-k2.6 / Qwen3.6 / GLM-5.1, RM-8 mitigation
- `.opencode/skills/sk-prompt/` v1.3.1.0 — DEPTH framework, CLEAR scoring, cli_prompt_quality_card.md cross-CLI mirror
- `.opencode/skills/sk-code/` — stack-aware code patterns
- `.opencode/skills/mcp-code-mode/` — MCP orchestration
- `.opencode/skills/system-skill-advisor/` — 5-lane scorer (explicit_author / lexical / derived_generated / semantic_shadow / graph_causal), threshold 0.8 (`fusion.ts:41-42`)
- `AGENTS.md` — CLI dispatch rule (§1 line 39), Gate 2 routing
- Hypothetical new `.opencode/skills/sk-small-model/` (if RQ5 verdict)

### resource-map.md status

resource-map.md not present; skipping coverage gate.

---

## 13. RESEARCH BOUNDARIES

- Max iterations: 20
- Convergence threshold: 0.15 (rolling-average over 3 iters)
- Per-iteration budget: 12 tool calls, 25 minutes (cli-devin SWE-1.6 default fast preset)
- Progressive synthesis: true
- research/research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `resume`, `restart` (live)
- Machine-owned sections: reducer controls Sections 3, 6, 7-11
- Canonical pause sentinel: `research/.deep-research-pause`
- Executor: cli-devin --model swe-1.6 --permission-mode auto (per ADR-001)
- Per-iter agent-config recipe: `.opencode/skills/cli-devin/assets/agent-config-deep-research-iter.json`
- Current generation: 1
- Started: 2026-05-18T09:20:00Z
