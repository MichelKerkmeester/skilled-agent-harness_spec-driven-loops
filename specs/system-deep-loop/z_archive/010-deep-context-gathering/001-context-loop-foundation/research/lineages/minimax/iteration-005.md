===FINDINGS START===
## Risks (risk | mitigation)
- **Context staleness during long loops** | Snapshot pin: freeze commit + content-hash at start, treat workspace read-only; emit `context_snapshot_id` in report header so /speckit:plan knows the baseline.
- **Cost blowup from many small-model calls** | Hard caps: `max_iterations=12`, `max_tokens_per_slice=4k`, `max_total_input_tokens=120k`; per-iter budget guard in atomic state; leverage `salvage` from deep-loop-runtime for partial findings on budget hit.
- **Irrelevant/over-collection (signal dilution)** | Relevance gate: every finding scored 0–1; drop <0.5; cap findings/slice (e.g. 8); require `file:line` citation; schema-bound categories (REUSE|INTEGRATION_POINT|UNKNOWN|RAW_NOTE) — no free text.
- **Convergence never triggers (oscillating frontier)** | Dual-criterion saturation: stop when `coverage_delta<0.05` AND `new_finding_rate<0.10` for `K=2` consecutive iters; deadlock detector (returning to seen frontier nodes) short-circuits; `iter>=12` cap is the safety net.
- **Small-model hallucinated file:line** | Post-dispatch validate: every cited `file:line` must resolve against indexed code-graph nodes (line-range overlap); invalid refs are dropped + counted, not silently repaired; per-slice `hallucination_rate` surfaced in trace.
- **Coverage-graph schema drift for new `loop_type='context'`** | Migrate in same PR as v1: add `node_kind IN ('context_slice','context_finding','context_frontier')`; backfill empty; bump schema version; gate by `loop_type` field, not free-form strings.

## NegativeKnowledge (avoid + why)
- **Don't fan out by-model in v1** | Multi-model consensus is deep-ai-council's job; doubles cost, triples state complexity, no proven value for code-context (non-adversarial task).
- **Don't add embedding-relevance channel in v1** | Coverage-graph signals + lexical match in prompt are sufficient; adds a vector-store dependency + tuning surface for marginal gain.
- **Don't make small models write/plan/score severity** | Read-only invariant: models extract + cite, never propose code or rank P0/P1/P2 (deep-review's job). Output schema enforces this.
- **Don't do a single mega-prompt "understand the whole repo"** | That's @context's job and it breaks past ~50k tokens; deep-context = iterative by-slice exactly to avoid the ceiling.
- **Don't write Context Report content into spec folders** | Spec folders are downstream consumers; report is an artifact at `.opencode/skills/deep-context/runs/<run-id>/report.md`; spec-folder writes belong in /speckit:plan.
- **Don't build a dashboard in v1** | Operator reads run log + `report.md`; UI is gold-plating.
- **Don't allow free-form finding text** | Unstructured output is uncitable, unmergeable, un-rankable; require schema-bound categories with `file:line` + one-line justification.
- **Don't seed frontier from full repo** | Seed from (a) diff if PR-context, (b) target entry-point if user provides, (c) code-graph roots of unindexed clusters; full-repo sweep is too expensive + too noisy.
- **Don't revisit a slice without new evidence** | Frontier expansion gated by uncovered signals; revisit only if new findings change the topology.

## RecommendedMVP (shape + phased roadmap: v1 ships / v2 / deferred)
**Shape:** single small-model, by-slice fan-out over a code-graph-seeded frontier, host-writes atomic state, dual-criterion relevance-gated saturation convergence, Context Report = REUSE catalog + Integration Points + Unknowns + Methodology + Confidence.

**v1 ships:**
- Loop type: `context` (new in coverage-graph; own SKILL.md under `.opencode/skills/deep-context/`)
- Governance: NEW OWNERSHIP ADR per deep-loop-runtime §4 (3rd deep-loop consumer)
- Coverage graph: 3 new node-kinds (`context_slice`, `context_finding`, `context_frontier`); edges = `seeded_from`, `produced`, `expanded_to`; signals = `relevance_score`, `coverage_delta`, `new_finding_rate`
- Frontier seeding: code-graph roots → 1-hop imports/calls + symbol neighbors; input args: optional `target` symbol/path/diff
- Slice: bounded symbol cluster (default cap: 12 symbols, 4k input tokens)
- Executor: ONE small model (default: minimax-M3 via cli-opencode, configurable), one slice per call
- Prompt pack: role=READ-ONLY context analyzer, JSON-schema output `{category, ref: file:line, one_line, relevance: 0-1}`
- Atomic state (host-writes JSONL per ADR-004): per-iter `frontier_hash`, `slices_evaluated`, `findings`, `coverage_delta`, `new_finding_rate`
- Convergence: stop when `coverage_delta<0.05 AND new_finding_rate<0.10` for `K=2`, or `iter>=12`, or deadlock
- Post-validate: every `file:line` resolved against code-graph; output `validation_report` with hallucination rate
- Context Report sections: (1) Snapshot, (2) **REUSE catalog** (file:line + what to extend), (3) Integration Points (where new code would touch existing), (4) Unknowns (gaps the loop couldn't close), (5) Methodology + Confidence Notes
- Cross-AI handoff: report is direct input to /speckit:plan and /speckit:implement

**v2 (next):**
- Two-model cross-check (small + slightly larger) on same slice, agreement-gated
- Embedding-relevance for finding dedup + ranking
- Smarter slice bundling (multi-symbol per call when input <2k)
- Richer signals: usage frequency, churn, recent-edits weight
- `context_snapshot_diff` between two runs (e.g. before/after refactor)

**Deferred:**
- Dashboard / web UI
- Cross-repo / monorepo federation
- Live incremental refresh (mid-loop FS watcher)
- Causal-graph integration for decision lineage
- Persistent in-memory cache between runs
- Auto-rewriting of stale findings on re-run

## Top5OpenQuestions
1. **Slice granularity** — file, symbol cluster, or directory? Pick empirically from a 3-run calibration sweep; default to symbol-cluster with adjacency cap.
2. **Convergence thresholds (`ε_coverage`, `ε_finding`, `K`)** — values above are guesses; calibrate against 2–3 known repos to confirm saturation without over-iteration.
3. **Small-model selection** — minimax-M3 vs qwen-coder vs kimi for code-context extraction? Benchmark on: (a) schema fidelity, (b) file:line accuracy, (c) refusal rate on out-of-scope (no write attempts), (d) cost-per-validated-finding.
4. **Frontier seeding strategy** — diff-based (PR) vs target-symbol (ask) vs code-graph-roots (open-ended)? UX decision: is deep-context targeted or exploratory? v1 should support all three but pick a default.
5. **REUSE catalog schema granularity** — function-level reuse, utility-level reuse, or pattern-level reuse? Downstream /speckit:plan vs /speckit:implement may need different cuts; v1 ships function-level, defer pattern-level.
===FINDINGS END===
