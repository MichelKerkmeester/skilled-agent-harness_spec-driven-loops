# Context Report: deep-context README rewrite

Two-iteration by-model sweep (DeepSeek v4 Pro + MiMo v2.5 Pro, read-only). Both iterations converge with cited file:line evidence on the loop, convergence signals, invocation and outputs.

---

## 1. PURPOSE

`deep-context` is an iterative, multi-model codebase-context-gathering deep loop. It sweeps the existing repository in parallel with a configurable pool of executor seats and synthesizes a reuse-first Context Report (pointers, not bodies) to run before `/speckit:plan` or `/speckit:implement`.

## 2. PROBLEM

Before planning or implementing a feature, discovery is expensive and ad-hoc: you need to know what existing code to reuse, where to connect and which conventions to follow, but a single-pass lookup misses nuance and one model's perspective misses blind spots. Without a verified map, you duplicate code that already exists, touch the wrong integration points or violate local conventions, and the blast radius across modules stays unclear until after the plan is written, causing rework.

## 3. MODES & CAPABILITIES

- Frontier seeding: extract anchors (paths, symbols, errors) from the query, expand via `code_graph_query` blast-radius into ranked SLICE nodes, with Glob and Grep fallback when the graph is stale.
- Parallel by-model sweep: all seats (native `@deep-context` agents plus optional heterogeneous CLI seats) sweep the same shared scope at once, barrier-joined so the groups run in true parallel.
- Agreement merge (host-only): the host dedups findings by `unit_id = sha256(path:symbol:kind)`, boosts confidence by cross-executor agreement and surfaces contradictions as CONTRADICTS edges rather than resolving them silently.
- Relevance-gated convergence: five stop signals drive CONTINUE, STOP_ALLOWED or STOP_BLOCKED; below-gate findings route to a `lowConfidence` bucket.
- Reuse-first Context Report: the deliverable leads with a reuse catalog, then integration points, touch list, conventions, a pruned dependency subgraph, prior art and gaps.

## 4. INVOCATION (verified)

Command and flags (`SKILL.md` + `references/guides/quick_reference.md`):

```bash
/deep:start-context-loop:auto "scope"      # autonomous, no gates
/deep:start-context-loop:confirm "scope"   # approval gates at setup, each iteration, synthesis
```

Key flags: `--spec-folder` (writes land at `{spec_folder}/context/`), `--max-iterations` (default 8), `--convergence` (0.10), `--relevance-gate` (0.55), `--agreement-min` (2), `--concurrency` (4), `--executor=<type>` / `--executors=<json>` (the by-model-shared-scope pool, default 2 native seats; heterogeneous opt-in adds CLI seats like MiMo, gpt or deepseek). It writes under `{spec_folder}/context/`: `context-report.md` and `.json` (the deliverable), `findings-registry.json`, `deep-context-dashboard.md`, the append-only `deep-context-state.jsonl`, `deep-context-config.json`, `deep-context-strategy.md` and `iterations/iteration-NNN.md`.

## 5. CONVERGENCE SIGNALS (5)

From `references/convergence/convergence_signals.md`: `sliceCoverage` (blocking guard), `reuseCatalogCoverage` (weighted, the highest at 0.30), `agreementRate` (blocking guard), `relevanceFloor` (blocking guard) and `dependencyCompleteness` (weighted 0.10). The composite of weighted signals plus the guards decides whether the loop may stop.

## 6. KEY FILES (real)

| Path | Role |
|------|------|
| `SKILL.md` | Runtime instructions and the smart router |
| `references/guides/quick_reference.md` | Operator cheat sheet, the ALWAYS baseline |
| `references/protocol/loop_protocol.md` | Iteration lifecycle, parallel sweep, merge, host-writes-state |
| `references/convergence/` | Convergence hub, signals, recovery and the coverage-graph stop path |
| `references/state/` | State format, JSONL records, outputs and the reducer registry |
| `scripts/reduce-state.cjs` | The reducer that refreshes the findings registry and dashboard |
| `feature_catalog/` and `manual_testing_playbook/` | The feature inventory and validation scenarios |

The `references/` tree has ten files across the four subfolders `convergence/`, `protocol/`, `state/` and `guides/`.

## 7. BOUNDARIES

deep-context gathers context before planning; it does not plan, review or implement. Sibling deep loops: `deep-research` (open investigation), `deep-review` (code audit), `deep-ai-council` (multi-seat planning); all four ride the shared `deep-loop-runtime`. `/speckit:plan` and `/speckit:implement` consume its Context Report. The executor seats are read-only and the host writes all state, which keeps the loop Gate-3-safe.

## 8. TROUBLESHOOTING & FAQ MATERIAL

- Loop stops too early: the relevance gate or convergence threshold is too loose; lower `--convergence` or raise `--max-iterations`.
- Seats disagree: contradictions are surfaced as CONTRADICTS edges and never auto-resolved; read them in the report.
- Stale code graph: frontier seeding falls back to Glob and Grep.
- FAQ: when to run it (before plan or implement); what the reuse-first report contains; how convergence decides to stop; how to add a heterogeneous CLI seat.

## 9. STALE FACTS (must fix on rewrite)

1. The current README claims version 1.0.0; SKILL.md is 1.2.0. The new template carries no version line.
2. The current README's Key Statistics claims 2 references; the real `references/` tree has 10 across four subfolders (the README's own Structure section already lists them, an internal contradiction). The rewrite lists the four subfolders accurately with no count.
3. The README structure omits `feature_catalog/` and `manual_testing_playbook/`; the rewrite mentions them in VERIFICATION and RELATED DOCUMENTS.

## 10. METHODOLOGY

Two iterations, by-model-shared-scope (DeepSeek + MiMo, read-only). Iteration 1 gathered purpose, modes and invocation; iteration 2 verified flags, the five convergence signals, the reference subfolders and stale facts, each cited to a file and line. Converged before the 3-iteration ceiling.
