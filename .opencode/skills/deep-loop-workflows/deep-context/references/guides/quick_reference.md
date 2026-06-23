---
title: Deep Context Quick Reference
description: One-page cheat sheet for the autonomous deep context loop.
trigger_phrases:
  - "deep context cheat sheet"
  - "start context loop command"
  - "context loop parameters"
  - "when to run deep context"
importance_tier: normal
contextType: general
version: 1.2.0.4
---

# Deep Context Quick Reference

One-page operator cheat sheet for the autonomous deep context loop.

---

## 1. OVERVIEW

Lookup surface during runs covering when to invoke the loop, what each phase produces, how convergence is computed from cross-executor agreement, and where live state lives on disk. Defer to the full protocol and convergence references for deep reasoning.

Operator contract source of truth for this page:
- command syntax: `.opencode/commands/deep/context.md`
- loop lifecycle, roles, packet layout: `references/protocol/loop_protocol.md`
- convergence stop contract: `references/convergence/convergence.md`, `references/convergence/convergence_signals.md`, and the deep-context YAML workflow
- config + default pool: `assets/deep_context_config.json`

> **By-model-shared-scope, NOT newInfoRatio.** Every iteration is ONE parallel heterogeneous sweep where every seat analyzes the SAME focus; cross-executor **agreement** is the confidence signal. This is the opposite of `deep-research`/`deep-review`, where lineages take disjoint slices. Convergence is **relevance-gated coverage saturation** with agreement + relevance as blocking guards — never a newInfoRatio.

---

## 2. COMMANDS

| Command | Description |
|---------|-------------|
| `/deep:context:auto "scope"` | Run autonomous deep context (no approval gates) |
| `/deep:context:confirm "scope"` | Run with approval gates at setup, each iteration, and synthesis |
| `/deep:context "scope"` | Ask which mode to use |

### Parameters

| Parameter | Default | Description |
|-----------|---------|-------------|
| `--max-iterations` | 8 | Maximum parallel-sweep iterations |
| `--convergence` | 0.10 | Stop when new agreement-eligible findings per iteration fall below this |
| `--relevance-gate` | 0.55 | Prune findings scoring below this relevance |
| `--agreement-min` | 2 | Distinct executors required to confirm a finding |
| `--concurrency` | 4 | CLI-pool concurrency cap |
| `--spec-folder` | auto | Target spec folder path (E = standalone run dir) |
| `--executor=<type>` | default pool | Repeatable seat (`native`/`cli-opencode`/`cli-codex`/`cli-claude-code`); accepts `--model`, `--reasoning-effort`, `--prompt-framework`, `--label` |
| `--executors=<json>` | default pool | JSON escape hatch for the full by-model-shared-scope pool |

---

## 3. WHEN TO USE

| Scenario | Use |
|----------|-----|
| Map existing code before planning/implementing, multi-model confidence needed | `/deep:context` |
| Single-pass codebase search, one lens | `@context` (not iterative) |
| Check prior work / saved memory only | `memory_context()` |
| Outward/web knowledge discovery | `/deep:research` (different skill) |
| Code audit / defect finding | `/deep:review` (different skill) |
| Exhaustive critical mapping | `/deep:context --max-iterations 12 --convergence 0.05` |

---

## 4. ARCHITECTURE

```text
/deep:context  -->  YAML workflow  -->  @deep-context seats (LEAF) + CLI seats
    |                    |                      |
    |                    |                      +-- Read frontier focus (SAME for all seats)
    |                    |                      +-- Analyze (read-only, 3-5 actions)
    |                    |                      +-- Return structured findings + relevance
    |                    |
    |                    +-- Init (config, strategy, frontier seed, state)
    |                    +-- Loop (parallel sweep, MERGE by file:symbol + agreement, converge)
    |                    +-- Synthesize (reuse-first context/context-report.md + .json)
    |                    +-- Save (memory context)
```

> Native seats run as a parallel Task batch; CLI seats run via `multi-seat-dispatch.cjs`. Both groups start together and barrier-join. Seats are READ-ONLY; the **host writes all merged state** (Gate-3-safe).

---

## 5. STATE FILES

Context mode stores its packet under `{spec_folder}/context/`:

| File | Location | Format | Owner | Purpose |
|------|----------|--------|-------|---------|
| Config | `context/deep-context-config.json` | JSON | Host (init) | Pool + thresholds |
| State | `context/deep-context-state.jsonl` | JSONL | Host (append) | Iteration log (append-only) |
| Strategy | `context/deep-context-strategy.md` | Markdown | Host | Focus and scope notes, known context |
| Registry | `context/findings-registry.json` | JSON | Reducer | Agreement-weighted findings |
| Dashboard | `context/deep-context-dashboard.md` | Markdown | Reducer | Auto-generated progress + convergence view |
| Iterations | `context/iterations/iteration-NNN.md` | Markdown | Host | Per-iteration sweep summary |
| Seat output | `context/seats/{label}/iter-NNN/*.json` | JSON | Per-seat | Raw per-seat structured findings |
| Report | `context/context-report.md` + `.json` | Markdown/JSON | Host (synthesis) | The deliverable (reuse-first) |

> **Session classification:** `fresh` | `resume` | `completed-session` | `invalid-state` (inspected from config + JSONL + strategy before any write). `:restart` archives the packet and starts a new lineage segment (fresh sessionId, generation + 1).

> **Path contract:** with a spec folder, write to `{spec_folder}/context/`. With no spec folder yet (Q1 option E), use a standalone run dir and hand the report path to `/speckit:plan`.

> **Pointers, not bodies:** the report ships verified `file:symbol` pointers with agreement + freshness, not source bodies — the consumer pulls bodies just-in-time to avoid context rot.

---

## 6. MERGE + AGREEMENT MODEL

| Concept | Rule |
|---------|------|
| Dedup key | `unit_id = sha256(path:symbol:kind)` (explicit beats derived) |
| Agreement | Count of distinct executors that produced the finding (`producedBy` cardinality) |
| Agreement-eligible | Agreement `>= agreementMin` (default 2) |
| Relevance gate | Findings `< 0.55` go to a `lowConfidence` bucket — kept (for Gaps), not discarded |
| Contradictions | Incompatible signatures/reuse verbs for one `unit_id` surfaced as `CONTRADICTS` — never auto-resolved |

---

## 7. CONVERGENCE DECISION TREE

```text
Max iterations reached?
  Yes --> STOP

Stuck (stuckThreshold consecutive no-new-agreement sweeps)?
  Yes --> STUCK_RECOVERY (re-seed frontier / rotate focus)
    Recovery works? --> CONTINUE
    Recovery fails? --> STOP (with gaps)

Graph guards: run convergence.cjs --loop-type context (evaluateContext)
  |
  +-- Any BLOCKING guard fails? --> STOP_BLOCKED (record blocker, continue with recovery focus)
  |     sliceCoverage   < 0.70  --> in-scope surface not yet swept
  |     relevanceFloor  < 0.50  --> collecting tangential noise, not focused context
  |     agreementRate   < 0.50  --> findings not yet multi-model-confirmed
  |
  +-- All blocking guards pass AND all weighted thresholds pass
  |   (reuseCatalogCoverage >= 0.60, dependencyCompleteness >= 0.70)
  |   AND host saturation check passes
  |   (new agreement-eligible findings/iter < convergenceThreshold for K iters)
  |     --> STOP_ALLOWED (saturated)
  |
  +-- Otherwise --> CONTINUE
```

### Composite Signals (telemetry, NOT a stop gate)

| Signal | Weight | Role | Votes via |
|--------|--------|------|-----------|
| `reuseCatalogCoverage` | 0.30 | Weighted (highest) | REUSE_CANDIDATE nodes confirmed / total |
| `agreementRate` | 0.25 | **Blocking guard** | Findings confirmed by `>= agreementMin` executors / total |
| `sliceCoverage` | 0.20 | **Blocking guard** | SLICE nodes with a `COVERED_BY` edge / total |
| `relevanceFloor` | 0.15 | **Blocking guard** | Findings with `relevance >= 0.55` / total |
| `dependencyCompleteness` | 0.10 | Weighted | DEPENDENCY nodes with a resolved edge / total |

**The composite score (`graph_convergence_score`) is trend telemetry only — it is NOT compared against any threshold.** STOP is decided by the per-signal guards above plus the host's saturation check. Each signal **vacuous-passes** (1.0) when its node kind is absent (a feature with no dependencies is not penalized); an empty graph returns `CONTINUE`.

---

## 8. SEAT ITERATION CHECKLIST

Each parallel sweep:
1. Host picks the current focus (frontier slice set) — the SAME focus for every seat (by-model shared scope).
2. Host renders each seat's prompt: gather-subject + scope/slice + known-context + output schema; applies the seat's `promptFramework` via `sk-prompt-small-model` (MiMo -> COSTAR, DeepSeek -> TIDD-EC; native seats carry no framework).
3. Dispatch concurrently — native Task batch ‖ CLI pool — and barrier-join when all seats return.
4. Each seat returns structured findings (reuse candidates, integration points, conventions, dependencies, gaps + self-scored relevance) to `seats/{label}/iter-NNN/`. Seats write nothing else.
5. Host dedups by `unit_id`, unions attribution, sets agreement counts, applies the relevance gate, surfaces contradictions.
6. Host appends to `deep-context-state.jsonl`, upserts coverage-graph nodes/edges (`loop_type='context'`), and runs `convergence.cjs --loop-type context`.
7. Reducer refreshes `findings-registry.json` and `deep-context-dashboard.md`.

---

## 9. TUNING GUIDE

| Goal | Adjustment |
|------|------------|
| Deeper / higher-confidence map | Lower convergence (0.05), raise max iterations (12) |
| Faster completion | Raise convergence (0.15), lower max iterations (5) |
| Stronger agreement signal | Raise `--agreement-min` (3); use 3+ heterogeneous seats |
| Tighter focus, less noise | Raise `--relevance-gate` (0.65) |
| Broader coverage | Start with broad scope, let iterations narrow the frontier |

> **Hardcoded guards:** the graph STOP thresholds (`sliceCoverage` 0.70, `relevanceFloor` 0.50, `agreementRate` 0.50, `reuseCatalogCoverage` 0.60, `dependencyCompleteness` 0.70) live in `convergence.cjs#evaluateContext` and are NOT read from config — changing them requires editing that function. Only `relevanceGate`, `agreementMin`, and `convergenceThreshold` are config-tunable.

---

## 10. TROUBLESHOOTING

| Problem | Fix |
|---------|-----|
| Stops too early | Lower `--convergence` from 0.10 to 0.05 |
| Never stops (`STOP_BLOCKED` every pass) | Check which blocking guard fails in the dashboard — usually `sliceCoverage` (frontier too wide) or `agreementRate` (pool too homogeneous / single-seat) |
| Findings never agreement-eligible | Pool is too thin — a 1-seat pool yields no agreement signal; add heterogeneous seats |
| Loop collects tangential noise | Raise `--relevance-gate`; tighten the scope phrasing |
| A seat times out | Surviving seats merge (agreement degrades gracefully); the seat retries once next iteration |
| Whole sweep returns no seats | After 3 consecutive empty sweeps, the loop halts and synthesizes partial findings |
| State file corrupt | Validate JSONL: `cat context/deep-context-state.jsonl \| jq .` (runtime also auto-repairs a corrupt trailing line) |

---

## 11. RELATED

| Resource | Purpose |
|----------|---------|
| `@context` | Single-pass codebase search (not iterative) |
| `@deep-context` | Single read-only sweep seat (LEAF) |
| `memory_context()` | Prior work / saved-memory retrieval |
| `/deep:research` | Outward/web research (different skill) |
| `/deep:review` | Code audit / defect finding (different skill) |
| `/speckit:plan` / `/speckit:implement` | Consumers of the Context Report |
| `generate-context.js` | Supported memory save script |
| `references/convergence/convergence_signals.md` | Convergence signal details |
| `references/state/state_jsonl.md` | JSONL state record details |
