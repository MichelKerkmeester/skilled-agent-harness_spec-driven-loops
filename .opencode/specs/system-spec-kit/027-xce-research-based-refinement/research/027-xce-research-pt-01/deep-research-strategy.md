---
title: Deep Research Strategy — 027 XCE Research-Based Refinement
description: Persistent strategy for the 027 XCE deep-research run. Tracks 9 RQs, focus rotation, and progress across 10 iterations.
session_id: 2026-05-08-027-xce-research
generation: 1
---

# Deep Research Strategy — 027 XCE Research-Based Refinement

## 1. OVERVIEW

Persistent brain for the 027 XCE deep-research session. Each iteration agent reads `Next Focus` and writes evidence to `iterations/iteration-NNN.md`; reducer refreshes machine-owned sections at end of iteration.

---

## 2. TOPIC

Compare the public Xanther Context Engine (XCE) MCP surface in `external/` against our local `code_graph` (`.opencode/skills/system-spec-kit/mcp_server/code_graph/`) and `skill_advisor` (`.opencode/skills/system-spec-kit/mcp_server/skill_advisor/`) subsystems. Identify adoption candidates by extracting findings, methods, logic, and architectural patterns from XCE's 5 tool primitives (`xce_get_context`, `xce_architecture_context`, `xce_search`, `xce_trace`, `xce_impact_analysis`), HLD/LLD layered abstractions, and context-first steering pattern. Reverse-engineer the closed-source PRAT (Persistent Recursive Abstract Tree) algorithm from public clues (name decomposition, benchmark numbers, tool API shape) and map plausible pipeline stages to our local files. Produce: (1) RQ-keyed `research/research.md` synthesis, (2) `research/findings.md` adoption matrix with ADOPT / ADAPT / DEFER / SKIP verdicts and file:line citations, (3) `research/sub-packet-proposals.md` with 1–4 candidate downstream packets, (4) `research/resource-map.md` path ledger. Every claim about XCE must cite `external/`; every claim about local code must cite `mcp_server/`. Research-only packet — no source modifications.

---

## 3. KEY QUESTIONS (remaining)

- [ ] **RQ1 — Architectural Context Gap**: Minimum viable HLD/LLD schema we could emit from existing graph + optional generation step. Template-only baseline before LLM.
- [ ] **RQ2 — Trace Tool Design**: `code_graph_trace` inputs/outputs to walk symbol → file → package → repo. Schema delta needed?
- [ ] **RQ3 — Impact Analysis Schema**: Risk signals computable deterministically (fan-in, hub centrality, edge-drift) vs LLM-scored.
- [ ] **RQ4 — Get-Context Combiner**: `code_graph_context_omni` tool vs folding into existing context. Payload-size budget tradeoff.
- [ ] **RQ5 — PRAT Reverse-Engineering**: Most-likely PRAT pipeline from public clues. Map stages to local files. Confidence-flagged inferences.
- [ ] **RQ6 — Steering Pattern Transfer**: Adapting static "ALWAYS call X FIRST" to dynamic skill_advisor brief. `lib/render.ts` target lines.
- [ ] **RQ7 — Benchmark Methodology Transfer**: Local eval harness for file-reads-avoided / context-accuracy. Lightest viable design.
- [ ] **RQ8 — Token Reduction Validation**: Measurability via `prompt-cache` + `budget-allocator` instrumentation. Baseline-vs-after protocol.
- [ ] **RQ9 — Non-Adoption Boundary**: Closed-source PRAT internals, SaaS hosting, xanther.ai dependency — explicit SKIP rationale.

---

## 4. NON-GOALS

- Modifying any source file in `mcp_server/` or anywhere else (research-only packet).
- Creating implementation sub-packets in this run (proposals only — user authors them downstream).
- Calling the live `xanther.ai` SaaS endpoint. Research is offline against `external/` plus our local code.
- Reverse-engineering proprietary PRAT internals from network traffic, decompilation, or any non-public source. Public docs only.
- SWE-bench evaluation against our stack. Benchmark methodology is a follow-on RQ proposal, not run.
- Replacing CocoIndex semantic search.
- Changes to `skill_advisor/lib/scorer/` (scoring math). Render-layer only, and only as proposals.

---

## 5. STOP CONDITIONS

- **Converged** — newInfoRatio < 0.10 across at least 5 iterations AND every RQ has ≥3 findings AND adoption matrix has ≥1 ADOPT + ≥1 DEFER + ≥1 SKIP verdict.
- **All answered** — every RQ resolved with ≥3 findings.
- **Max iterations** — 10/10 reached.
- **Stuck** — 3 consecutive iterations with newInfoRatio < 0.10 AND quality guards block convergence.

---

## 6. ANSWERED QUESTIONS

[None yet — populated as iterations resolve RQs]

---

<!-- MACHINE-OWNED: START -->
## 7. WHAT WORKED

[First iteration — populated after iteration 1 completes]

---

## 8. WHAT FAILED

[First iteration — populated after iteration 1 completes]

---

## 9. EXHAUSTED APPROACHES (do not retry)

[Populated when an approach has been tried from multiple angles without success]

---

## 10. RULED OUT DIRECTIONS

[Approaches that were investigated and definitively eliminated — consolidated from iteration dead-end data]

---

## 11. NEXT FOCUS

**RQ1 — Architectural Context Gap**: inventory our `code_graph_context` payload shape (what symbols + edges + readiness fields it returns), then read `external/README.md` for XCE's `xce_architecture_context` payload shape (HLD/LLD/component description). Diff the two: identify the minimum viable HLD/LLD schema we could emit deterministically from our existing graph (no LLM yet). Cite at least 2 file:line refs from `mcp_server/code_graph/` and 2 from `external/README.md`.

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT

None. Spec Kit Memory MCP server returned ERR_MODULE_NOT_FOUND on `memory_context()` lookup at session start. Prior research artifacts not loaded. Cli-opencode dispatched sessions have their own MCP connection and may succeed independently — agents should attempt their own `memory_context` lookups for prior work on adjacent topics (code_graph evolution, skill_advisor brief design, context-first steering).

---

## 13. RESEARCH BOUNDARIES

- **Max iterations**: 10
- **Convergence threshold**: 0.10
- **Per-iteration budget**: 14 tool calls, 12 minutes
- **Total wall-clock cap**: 180 minutes
- **Progressive synthesis**: true
- **research/research.md ownership**: workflow-owned canonical synthesis output
- **Lifecycle branches**: `resume` (active), `restart` (deferred), `fork`/`completed-continue` (deferred, not runtime-wired)
- **Machine-owned sections**: reducer controls Sections 6, 7–11
- **Canonical pause sentinel**: `research/.deep-research-pause`
- **Executor**: cli-opencode + `deepseek/deepseek-v4-pro` --variant high (per user direction; fallback chain documented in `deep-research-config.json`)
- **Quality guards**: novelty_floor=0.15, min_iterations_before_converge=5, rq_finding_floor=3, verdict_diversity_floor={min_adopt:1, min_defer:1, min_skip:1}
- **Scope read-only paths**: `external/`, `mcp_server/code_graph/`, `mcp_server/skill_advisor/`
- **Scope write paths**: `research/` only
- **Forbidden writes**: `mcp_server/` (any), `external/` (any)
- **Current generation**: 1
- **Started**: 2026-05-08T08:30:00Z
