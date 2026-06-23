---
title: "Deep Context: Loop Protocol"
description: Iteration lifecycle, parallel sweep mechanics, merge rules, and host-writes-state invariant for the deep-context loop.
trigger_phrases:
  - "context loop protocol"
  - "parallel heterogeneous sweep"
  - "frontier seeding"
  - "agreement merge rules"
  - "host writes state invariant"
importance_tier: important
contextType: implementation
version: 1.2.0.6
---

# Deep Context: Loop Protocol

How the `deep-context` loop runs: a host-driven, host-writes-state loop whose every iteration is one **parallel heterogeneous sweep** of a shared focus, merged by cross-executor agreement.

---

## 1. OVERVIEW

### Purpose

Documents the complete iteration lifecycle for the `deep-context` loop — from frontier seeding through parallel dispatch, agreement merge, convergence, and synthesis. This is the runtime contract for the `/deep:context` command and the `@deep-context` orchestrating agent.

### When to Use

Load this reference when:
- Orchestrating or debugging a running `deep-context` loop.
- Understanding how parallel seats are dispatched and barrier-joined.
- Diagnosing merge failures, agreement gaps, or state-write order issues.
- Building a new executor kind into the heterogeneous pool.

---

## 2. ROLES

- **Host** (the `/deep:context` command / orchestrating agent): owns the frontier, dispatch, merge, state writes, convergence, synthesis. The host is the ONLY writer of merged state.
- **Seat** (one executor in the pool): a READ-ONLY analyzer — native `@deep-context` Task subagent, or a CLI executor (cli-opencode / cli-codex / cli-claude-code). Returns structured findings; writes nothing outside its own artifact dir.

---

## 3. PACKET LAYOUT

`{spec_folder}/context/` holds the full run packet:

| File | Owner | Purpose |
|------|-------|---------|
| `deep-context-config.json` | Host (init) | Run config: scope, pool, thresholds |
| `deep-context-state.jsonl` | Host (append) | Append-only state log |
| `deep-context-strategy.md` | Host | Focus and scope notes |
| `iterations/iteration-NNN.md` | Host | Per-iteration summaries |
| `findings-registry.json` | Reducer | Agreement-weighted findings |
| `deep-context-dashboard.md` | Reducer | Auto-generated progress view |
| `context-report.md` + `.json` | Host (synthesis) | The deliverable |
| `seats/{label}/iter-NNN/*.json` | Per-seat | Raw per-seat structured findings |

If the user named a spec folder, or one is derivable from the scope (a spec-folder path inside the scope text), the packet MUST live at `{spec_folder}/context/`. A standalone run dir is used ONLY when no spec folder is named or derivable — fail-closed, never a default when a folder is identifiable (see `auto_mode_contract` §1 source 3 + fallback guard). In the standalone case the host hands the report path to `/speckit:plan`.

---

## 4. FRONTIER SEEDING

From the target feature/query: extract anchors (paths, symbols, error strings, domain terms) → expand via `code_graph_query` (blast-radius / calls) into ranked `SLICE` nodes; fall back to Glob+Grep when the code graph is stale/absent. Never sweep the whole repo.

---

## 5. ONE ITERATION (PARALLEL SWEEP)

1. Pick the current focus (frontier slice set for this iteration; by-model shared scope = all seats get the same focus).
2. Render each seat's prompt with the mandatory contract: gather-subject + scope/slice + known-context + output schema; apply the seat's `promptFramework` via `sk-prompt-small-model`.
3. Dispatch concurrently:
   - **native seats** → parallel Task batch (`@deep-context` LEAF subagents).
   - **CLI seats** → `deep-loop-runtime/lib/council/multi-seat-dispatch.cjs` `dispatchCouncilSeats` + per-kind spawn (`scripts/fanout-run.cjs` `buildLineageCommand`).
   Both groups start together; barrier-join when all seats have returned.
4. Collect each seat's structured findings (reuse candidates, integration points, conventions, dependencies, gaps + self-scored relevance).

---

## 6. MERGE + AGREEMENT

Host dedups findings by `unit_id = sha256(path:symbol:kind)`; unions per-executor attribution; sets agreement = count of distinct executors that produced the finding (also recorded as `CONFIRMS` edges / `metadata.confirmations`). Relevance gate (0.55) prunes noise; contradictions are surfaced (`CONTRADICTS`), never silently resolved. Reuse `scripts/fanout-merge.cjs` attribution shape.

**merge rules**:
- `unit_id` is the dedup key — explicit in the finding beats derived from path+symbol+kind.
- Agreement = `producedBy` cardinality; agreement-eligible when ≥ `agreementMin` (default 2).
- Contradictions: two or more producers asserting incompatible `signature` or `reuse` verbs for the same `unit_id` → surfaced in the findings registry and the dashboard.
- Below-gate findings (relevance < 0.55) go to a `lowConfidence` bucket — kept, not discarded, so the report's Gaps section can surface near-misses.

---

## 7. PERSIST + CONVERGE

Host appends the iteration record, upserts coverage-graph nodes/edges (`loop_type='context'`), then runs `scripts/convergence.cjs --loop-type context` → CONTINUE / STOP_ALLOWED / STOP_BLOCKED. See [convergence.md](../convergence/convergence.md).

---

## 8. SYNTHESIS

At stop, the reducer (`scripts/reduce-state.cjs`) compiles:
- `context/findings-registry.json` — agreement-weighted, sorted by agreement desc → relevance desc → path.
- `context/deep-context-dashboard.md` — status, progress, metrics, top reuse candidates, contradictions, graph convergence signals.
- `context/context-report.md` from the [Context Report template](../../assets/context_report_template.md) — reuse-catalog first, pointers not bodies, agreement + freshness per finding.

---

## 9. RELIABILITY INVARIANTS

| Invariant | Detail |
|-----------|--------|
| Read-only seats | No seat writes merged state, shared strategy, or the report. |
| Host-writes-state | Gate-3-safe: the host (command/orchestrator) owns all merged writes. |
| Per-seat artifact isolation | Each seat writes only to `seats/{label}/iter-NNN/`. |
| Closed stdin for CLI seats | `</dev/null` on every `cli-opencode` invocation; omit top-level `--agent`. |
| Verified references | Every `file:symbol` in the report is verified against the code graph before inclusion. |
| Contradiction surfacing | Contradictions between seats are recorded as `CONTRADICTS` edges and listed in the dashboard; never auto-resolved. |
