---
title: Code Graph + Skill Advisor Refinement — Deep Research Synthesis
description: 20-iteration deep-research synthesis covering 10 research questions across code-graph and skill-advisor systems; produces a 10-PR remediation roadmap.
generated_by: spec_kit_deep_research
session_id: dr-20260424T195254Z-72a5b0eb
iterations_completed: 20
generated_at: 2026-04-25T03:45:00Z
---

# Code Graph + Skill Advisor Refinement — Research Synthesis

## 1. Executive Summary

This synthesis covers a 20-iteration deep-research loop (April 2026) investigating the code-graph AST detection pipeline and skill-advisor scoring/freshness/promotion stack across 10 research questions. The research produced 88 findings (F1–F88 in the active finding set, with 6 retractions), resolved all 10 original RQs, and converged on a PR-ready remediation plan of 10 default PRs plus one contingent PR.

The five highest-leverage findings by blast radius and fix cost: (1) **F2/F8 — CALLS edges are structurally regex-only** — the tree-sitter AST path has no `call_expression` capture at all, so every CALLS edge carries `evidenceClass='INFERRED'` regardless of parser backend; (2) **F23.1 — `.claude/settings.local.json` wiring bug** dispatches the Copilot adapter instead of the Claude adapter for every hook event in Claude sessions, silently corrupting per-runtime telemetry; (3) **F17/F71 — five competing state vocabularies** including two type aliases both named `GraphFreshness` with different value sets, creating a structural landmine for exhaustive-switch callers; (4) **F52/F60 — the entire promotion subsystem is production dead code**, with zero callers outside of tests and no documented wiring intent; (5) **F81 — `advisorPromptCache` has no proactive invalidation listener**, relying solely on reactive per-request signature comparison, so stale cache entries survive up to 5 minutes after a graph rebuild.

The 10-PR remediation roadmap has an estimated critical-path effort of approximately 22 hours with parallelism across three batches (A: P0 quick wins; B: scaffolds; C: bench fan-out). Net LOC delta is approximately −744, dominated by the promotion-subsystem deletion (PR 3: −1311 LOC in code + docs) offset by new instrumentation, tests, and bench files (+567 LOC). All 10 RQs are resolved, zero items are deferred to future research, and iter-20 confirmed SHIP_READY_CONFIRMED: the AGENTS.md triad is clean, no sibling spec folders have actionable stale references, and the roadmap is skill-internal with no triad mirror requirement.

---

## 2. Research Charter

### Topic

Code Graph System and Skill Advisor System refinement — investigate algorithm correctness, performance, UX, observability, and evolution. Scoped to 10 research questions defined in `spec.md`:

- **RQ-01:** What AST edge types are currently missed by the code-graph detector? Where do edges get dropped, and at what rate per file/language?
- **RQ-02:** Does the skill-advisor scorer exhibit systematic bias toward certain lanes? How well-calibrated is confidence against ground-truth labels?
- **RQ-03:** Are the four freshness states (live/stale/absent/fallback) invariant under concurrent writes, partial scans, and lock contention?
- **RQ-04:** Is the 7-gate promotion bundle actually rigorous enough to block regressions? What categories slip through the two-consecutive-shadow-cycle rule?
- **RQ-05:** What is the scan throughput ceiling per language/file-size distribution? Where does incremental accuracy degrade?
- **RQ-06:** What is the P50/P95/P99 query latency? What is the cache hit ratio, and where do near-duplicate prompts miss?
- **RQ-07:** How consistent is stale-state messaging across the 4 tool surfaces? Are there silent degraded-state paths?
- **RQ-08:** What is the signal-to-noise ratio of the advisor hook brief? Which fields are load-bearing vs decorative?
- **RQ-09:** Where are the benchmark coverage gaps? Is there an end-to-end benchmark for the code-graph → skill-advisor projection pipeline?
- **RQ-10:** What cross-runtime parity gaps exist (Claude, Codex, Gemini, Copilot, OpenCode plugin)? What extension points exist for multi-repo support?

### Non-Goals (from `deep-research-strategy.md`)

- Re-implementing or replacing either system from scratch
- Proposing alternative scoring algorithms without empirical evidence
- Making decisions requiring external stakeholder input
- Expanding scope beyond code-graph and skill-advisor

### Stop Conditions

Max iterations (20) reached. Convergence threshold (0.05) was never crossed — the rolling average sat above 0.05 throughout, so the loop ran its full budget. STOP_READY was confirmed at iter-15; SHIP_READY_CONFIRMED was confirmed at iter-20 after triad audit.

---

## 3. Method

Each iteration used a single-pass, fresh-context model execution with externalized state via `deep-research-state.jsonl` and per-iteration delta JSONL files in `deltas/`. The executor mix was:

- **Iters 1–4:** Native `@deep-research` agent (Opus 4.x), fresh-context per iteration
- **Iters 5–6:** `cli-codex gpt-5.4 high fast` (dispatched per fallback configuration)
- **Iter 7 (nominal):** Lost — Codex deadlock from stale processes; execution recovered immediately
- **Iters 7–20:** Native `@deep-research` (Opus) after fallback, renumbering preserved in the JSONL state

Tool-call budget per iteration: approximately 5–8 tool calls (file reads + greps). Iters 18–20 were synthesis-only (no new source-code reads), drawing exclusively on prior JSONL delta records. The resource map (`resource-map.md`) tracked 90 references across 37 skill files, 21 scripts, 5 tests, and 3 configs; 57 were cited-only (MISSING on disk) and 33 were verified OK.

---

## 4. Findings — Code Graph System

### RQ-01: AST Edge Detection Gaps

**F1** — The canonical `EdgeType` union declares 10 types: `CONTAINS | CALLS | IMPORTS | EXPORTS | EXTENDS | IMPLEMENTS | TESTED_BY | DECORATES | OVERRIDES | TYPE_OF`. All 10 are emitted by `structural-indexer.ts` with weights ranging from 0.6 (`TESTED_BY`) to 1.0 (`CONTAINS`, `IMPORTS`, `EXPORTS`). [SOURCE: `code-graph/lib/indexer-types.ts:13-17`; `structural-indexer.ts` grep of `edgeType:` occurrences]

**F2** — The CALLS detector (`structural-indexer.ts:950-981`) uses a regex `/\b(\w+)\s*\(/g` applied to each callable's body text, with a skip-list of control-flow keywords. Every CALLS edge is emitted with `detectorProvenance: 'heuristic'` and `evidenceClass: 'INFERRED'` regardless of parser backend. All nine other edge types use `evidenceClass: 'EXTRACTED'`. Concrete failure modes: type-assertion calls `(foo as Bar)(arg)` only capture `Bar`; chained calls suffer name-only target lookup; shadowed locals create false edges to unrelated same-named symbols; dedup is per-caller-body only. [SOURCE: `structural-indexer.ts:950-981`; `indexer-types.ts:19,22`]

**F3** — The `GraphEdgeEnrichmentSummary` (persisted under `last_graph_edge_enrichment_summary`) records one `edgeEvidenceClass` and a single `numericConfidence` per scan — NOT per-edge-type coverage. The startup brief surfaces this as `edge-enrichment=<class> (<confidence>)`. This explains why the known-context showed `direct_call (1.00 coverage)` — it is an aggregate, not a per-type breakdown. [SOURCE: `code-graph-db.ts:38-48,249-268`; `startup-brief.ts:158-161`]

**F8 (iter 2)** — `tree-sitter-parser.ts` has **no `call_expression` capture or branch** in `walkAST`. The 10 emitted `RawCapture.kind` values are `function | method | class | interface | type_alias | enum | import | export | variable | parameter`. Grep for `call_expression` returns 0 hits in non-comment lines. The remediation is net-new code: add a `'call'` `RawCapture.kind`, emit per `call_expression` node in `walkAST`, and consume from `extractEdges` instead of regex-scanning bodies. [SOURCE: `tree-sitter-parser.ts:350-358,416-424,436-445,451-460,520-533,555-566`; `tree-sitter-parser.ts:16,645-648`]
