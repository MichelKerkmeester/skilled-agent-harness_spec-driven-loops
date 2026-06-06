---
title: Deep Research Strategy — deep-context design
description: Charter for the orchestrator-driven deep-research pass (mimo + minimax, 10 iterations) validating the best design for the `deep-context` deep loop.
---

# Deep Research Strategy — `deep-context` design

## 1. OVERVIEW

Orchestrator-driven deep-research session. The host (Claude Code) dispatches READ-ONLY analysis to two small models in parallel per round — `xiaomi-token-plan-ams/mimo-v2.5-pro` (COSTAR framing) and `minimax-coding-plan/MiniMax-M3` (TIDD-EC framing) — captures their findings, and persists per-lineage iteration files + this strategy + the shared state log. 5 rounds × 2 models = 10 iterations, then central synthesis into `research/research.md`.

---

## 2. TOPIC

Design approaches for **`deep-context`**: an iterative, small-model-driven **codebase-context-gathering** deep-loop that sweeps slices of the repository and synthesizes an **implementation/planning-ready Context Report**, built as a new (3rd) consumer of `deep-loop-runtime`. It is the missing "understand" loop that sits *before* `/speckit:plan` and `/speckit:implement`.

---

## 3. KEY QUESTIONS (remaining)

- [ ] **Q1 — Convergence signal.** What signal + default threshold best captures "context-coverage saturation" (vs. deep-research's `newInfoRatio`, deep-review's severity ratio)? How to stop noise/over-collection from masquerading as "new context" and blocking saturation (relevance gate)?
- [ ] **Q2 — Context Report schema.** What sections/format make the report genuinely useful for an AI to plan/implement, and what do `/speckit:plan` + `/speckit:implement` actually consume? (REUSE catalog as highest-value section, aligned to "reuse, avoid new code".)
- [ ] **Q3 — Chunking / frontier.** How to partition the repo across iterations & lineages without overlap or gaps (coverage-frontier bookkeeping, disjoint slice assignment, gap detection)?
- [ ] **Q4 — Small-model dispatch contract.** Read-only analyzer vs executor-writes; how to propagate the gather-subject to lineages (the topic-propagation gap found in `fanout-run.cjs`); mimo (COSTAR) vs minimax (TIDD-EC) prompt shaping for max extraction quality.
- [ ] **Q5 — Fan-out topology.** by-slice vs by-model vs hybrid; how to merge/dedup context across lineages (analog of `fanout-merge --mode research`).
- [ ] **Q6 — Relevance scoring + dedup.** How to score relevance of each gathered context unit and dedup across iterations/lineages (content hashing, file:line identity).
- [ ] **Q7 — Reuse map + governance.** Exact reuse map onto `deep-loop-runtime` libs/scripts; what the mandated ownership ADR must cover; coverage-graph schema delta for `loop_type='context'` (node kinds, relations, signals).
- [ ] **Q8 — Prior art.** Agentic context retrieval / RAG-for-code / repo-context tools / context-engineering for coding agents; what to borrow, what to avoid (negative knowledge).

---

## 4. NON-GOALS

- Building the skill (that is the post-research Phase 3 — this session only validates the design).
- Re-deriving the deep-loop architecture from scratch (it is provided in §12 Known Context).
- Outward/web knowledge discovery for its own sake (this is deep-research being used META to design an inward context loop).
- Changing `deep-loop-runtime` code during research (read-only).

---

## 5. STOP CONDITIONS

- 10 iterations completed (5 rounds × 2 models), OR all 8 key questions answered with a concrete, evidence-backed design recommendation, OR diminishing new design insight across a round.

---

## 6. ANSWERED QUESTIONS
[None yet — populated as rounds complete]

---

<!-- MACHINE-OWNED: START -->
## 7. WHAT WORKED
[Populated after round 1]

## 8. WHAT FAILED
[Populated after round 1]

## 9. EXHAUSTED APPROACHES (do not retry)
[None yet]

## 10. RULED OUT DIRECTIONS
[None yet]

## 11. NEXT FOCUS
Round 1 — landscape survey: (mimo) internal deep-skill + @context + memory/code-graph reuse surface; (minimax) external agentic-context-retrieval / RAG-for-code best practices.
<!-- MACHINE-OWNED: END -->

## 12. KNOWN CONTEXT (provided to lineages each round)

**Deep-loop family (this repo):** Four loops share `deep-loop-runtime` (`lib/deep-loop/*` = executor-config, prompt-pack, post-dispatch-validate, atomic-state, jsonl-repair, loop-lock, permissions-gate, bayesian-scorer, fallback-router; `lib/coverage-graph/*` = db + query + signals; `scripts/*.cjs` = convergence, upsert, query, status, fanout-run/pool/salvage/merge; SQLite at `database/deep-loop-graph.sqlite`).
- **deep-research** — OUTWARD discovery; convergence `newInfoRatio` 0.05; per-iteration fresh LEAF agent; state `deep-research-state.jsonl` + `iteration-NNN.md` + reducer-owned strategy/dashboard/registry; emits `research.md`.
- **deep-review** — AUDIT; severity-weighted P0/P1/P2 ratio 0.10; Hunter/Skeptic/Referee adjudication.
- **deep-ai-council** — multi-seat PLANNING; adjudicator-verdict stability 0.20.
- **deep-improvement** — evaluator-first 5-dim agent/model/skill benchmarking.

**Governance (mandated):** `deep-loop-runtime/SKILL.md §4` — "ESCALATE to a new ownership ADR if a new consumer skill (beyond deep-review and deep-research) needs deep-loop runtime." Coverage-graph node-kind allow-list is loop-type-specific → adding `loop_type='context'` is a real schema touch. So deep-context = Level-3 packet + ownership ADR.

**Coverage graph:** node kinds + relations are loop-type-specific; signals (e.g. research `questionCoverage`, review `dimensionCoverage`) computed in `coverage-graph-signals.ts`; convergence via `convergence.cjs` → CONTINUE / STOP_ALLOWED / STOP_BLOCKED, Bayesian scoring with Laplace smoothing.

**Fan-out:** `fanout-run.cjs` spawns headless CLI subprocesses (one per lineage) via async `spawn` (concurrency cap honored — spawnSync serialization fixed in spec 123); each lineage runs the full loop in `lineages/{label}/`; `fanout-salvage.cjs` recovers iteration .md from stdout; `fanout-merge.cjs` consolidates (research = dedup-by-id + attribution; review = strongest-restriction P0). **GAP FOUND:** `buildLoopPrompt()` does NOT pass the research topic to lineages, and in fan-out mode the parent skips `phase_init` — so autonomous research lineages get an unbound `{research_topic}`. Implication for deep-context: the lineage prompt MUST carry the gather-subject explicitly.

**Existing one-shot analog:** the `@context` agent already produces a one-shot "Context Package" (memory triggers/context + memory_search for spec docs + Code Graph + Grep + direct code evidence; LEAF, read-only, no writes). deep-context ≈ a loop-refined, convergence-gated superset. Likely heavy reuse of @context's retrieval doctrine + Spec Kit Memory (`memory_context`, `memory_search`) + Code Graph (`code_graph_query/context`).

**Downstream consumers:** the Context Report should feed `/speckit:plan` (spec/plan) and `/speckit:implement`. Repo principle (CLAUDE.md): "reuse existing patterns, avoid new code, avoid over-engineering" → the REUSE catalog (existing functions/utilities to extend, with file:line) is the highest-value report section.

**Small-model facts:** mimo-v2.5-pro = 1M context, best framework COSTAR+lean (spec 126); MiniMax-M3 = TIDD-EC (spec 120); both via cli-opencode, omit `--agent`, `--variant high`, `</dev/null` mandatory.

---

## 13. RESEARCH BOUNDARIES

- Iterations: 10 (5 rounds × 2 models). Convergence threshold: 0.05 (research-loop metric; deep-context's own metric is an OUTPUT of this research).
- Per-iteration budget: ~8-12 tool calls per model dispatch; read-only (no writes by the models — host persists all state).
- Models: `xiaomi-token-plan-ams/mimo-v2.5-pro` (COSTAR) + `minimax-coding-plan/MiniMax-M3` (TIDD-EC), `--variant high`.
- research/research.md ownership: host-owned canonical synthesis output.
- Attribution: per-lineage iteration files under `research/lineages/{mimo,minimax}/`; shared append-only `research/deep-research-state.jsonl`.
