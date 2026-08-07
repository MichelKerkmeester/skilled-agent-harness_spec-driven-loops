---
title: "deep-loop-runtime"
description: "Shared runtime foundation for the five deep loops, providing executor dispatch, prompt-pack rendering, output validation, atomic state, coverage-graph storage, Bayesian convergence scoring and fallback routing."
trigger_phrases:
  - "shared deep loop runtime"
  - "deep loop executor"
  - "coverage graph query"
  - "bayesian convergence scoring"
  - "fanout pool scripts"
---

# deep-loop-runtime

> One hardened runtime so every deep loop shares the same executor, state, scoring and coverage graph instead of duplicating them.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Use it for** | Providing executor dispatch, prompt-pack rendering, output validation, atomic state, JSONL repair, loop locking, Bayesian scoring, fallback routing and coverage-graph storage to the deep loops |
| **Invoke with** | TypeScript imports from `lib/` or direct `.cjs` script calls from `scripts/`. Not a user-facing command. |
| **Works on** | Iteration state, coverage-graph DB, executor configs, JSONL logs, prompt-pack templates and convergence signals |
| **Produces** | Hardened runtime services consumed by `deep-research`, `deep-review`, `deep-context`, `deep-ai-council` and `deep-improvement` |

---

## 2. OVERVIEW

### Why This Skill Exists

Before this runtime existed, the deep-loop infrastructure lived inside `system-spec-kit/mcp_server/` and was reached through MCP tools. Two consumer skills depended on the internals of a third package. Every workflow call paid the MCP marshalling and JSON-parse cost. Each loop would otherwise duplicate executor config, atomic-state writes, JSONL repair, single-writer locking, coverage-graph ownership, Bayesian scoring and fallback routing. That duplication is the kind of drift that turns into silent bugs.

The consolidation moved all of it into one peer skill. The MCP tools disappeared and were replaced by direct script calls. Every loop now shares one implementation.

### What It Does

The runtime is the foundation the five deep loops ride. It exposes three component families through `lib/` and a set of `.cjs` entry points through `scripts/`. Consumer skills import the modules they need and call the scripts directly. The runtime does not own spec folders, memory or continuity (`system-spec-kit` does). It does not define per-loop convergence policy (each consumer sets that on top of the shared scorer and coverage graph). It is the plumbing.

---

## 3. QUICK START

You do not invoke this runtime from a slash command. You call it from a consumer script or a workflow YAML.

**Step 1: Run a convergence check from a consumer entry point.**

```bash
node .opencode/skills/deep-loop-runtime/scripts/convergence.cjs <spec-folder>
```

Expected output: a JSON object with the convergence composite score, per-signal weights, the blocking-guard verdict (`STOP_ALLOWED` or `STOP_BLOCKED`) and the signal values that drove the decision.

**Step 2: Query the coverage graph.**

```bash
node .opencode/skills/deep-loop-runtime/scripts/query.cjs <spec-folder> --type nodes
```

Expected output: a JSON array of coverage-graph nodes with their IDs, types and connection counts.

**Step 3: Upsert a coverage-graph node or edge.**

```bash
node .opencode/skills/deep-loop-runtime/scripts/upsert.cjs <spec-folder> --node '{"id":"example","type":"slice","label":"auth middleware"}'
```

Expected output: confirmation JSON with the upserted node ID and the updated graph state.

---

## 4. HOW IT WORKS

The runtime organises its capabilities into three lib component families plus a scripts layer.

### The Deep-Loop Family (`lib/deep-loop/`)

This is the core engine. It contains executor-config and executor-audit (dispatch and provenance), prompt-pack (iteration prompt rendering), post-dispatch-validate (markdown, JSONL and delta checks), atomic-state (tmpfile-plus-rename writes), jsonl-repair (trailing corrupt-line recovery), loop-lock (single-writer lockfile), permissions-gate, bayesian-scorer (convergence score with Laplace smoothing) and fallback-router.

When a deep loop starts an iteration, it pulls executor config from here. When it writes state, atomic-state ensures a crash never leaves a half-written file. When JSONL logs grow a corrupt tail, jsonl-repair recovers it before the next read. When two writers could race, loop-lock prevents it.

### The Coverage-Graph Family (`lib/coverage-graph/`)

The coverage-graph DB, queries and signals back the context and review stop paths. Nodes represent slices, findings or anchors. Edges represent relationships like `COVERS`, `CONTRADICTS` or `DEPENDS_ON`. The convergence scorer reads signal values from this graph to decide whether a loop has gathered enough data.

### The Council Family (`lib/council/`)

Multi-seat dispatch, round-state JSONL, adjudicator-verdict scoring, cost guards, session-state hierarchy, the council graph and convergence live here. This family powers `deep-ai-council` specifically, handling the mechanics of multiple AI seats deliberating in rounds.

### The Scripts Layer (`scripts/`)

The `.cjs` entry points are the consumer-facing API. Each script loads the lib modules it needs and exposes a CLI interface that workflow YAML files and consumer skills call directly.

| Script | Purpose |
|---|---|
| `convergence.cjs` | Compute the convergence composite score for a spec folder |
| `query.cjs` | Read nodes and edges from the coverage graph |
| `upsert.cjs` | Insert or update coverage-graph nodes and edges |
| `fanout-pool.cjs` | Set up the executor pool for a fan-out run |
| `fanout-run.cjs` | Execute a single fan-out seat |
| `fanout-merge.cjs` | Merge results from multiple fan-out seats |
| `fanout-salvage.cjs` | Recover partial results from a failed fan-out |
| `status.cjs` | Report the current state of a loop run |

---

## 5. INTEGRATION & NAVIGATION

### When To Use This Skill

You never reach for this skill directly. The five deep loops consume it:

- `deep-research` uses executor dispatch, prompt-pack rendering, Bayesian scoring and fallback routing for its investigation iterations.
- `deep-review` uses the same core engine plus the coverage-graph signals for its audit stop path.
- `deep-context` uses the coverage-graph DB, the convergence scorer and atomic-state for its multi-model parallel sweep.
- `deep-ai-council` uses the council family for multi-seat deliberation rounds.
- `deep-improvement` uses the core engine for its bounded improvement loops.

If you are writing a new deep loop, you import from `lib/` and call the `.cjs` scripts. If you are operating an existing loop, the runtime is already wired in and you interact with it through the consumer skill's commands.

### What This Skill Does Not Own

| Concern | Owner |
|---|---|
| Spec folders, memory and continuity | `system-spec-kit` |
| Per-loop convergence policy | Each consumer skill sets its own thresholds on top of the shared scorer |
| User-facing loop commands | `deep-research`, `deep-review`, `deep-context`, `deep-ai-council`, `deep-improvement` |
| Code standards and tests | `sk-code` |

---

## 6. TROUBLESHOOTING

| What you see | Why | Fix |
|---|---|---|
| A loop's state log is corrupt on read | A trailing line was written partially before a crash | The runtime's jsonl-repair recovers trailing corrupt lines automatically. If the error persists, inspect the file for mid-line corruption. |
| Two writers raced the state log | The loop-lock was not acquired or was bypassed | Ensure the consumer acquires the lock before writing. The single-writer lockfile prevents concurrent writes. |
| `convergence.cjs` returns `STOP_BLOCKED` | A blocking guard (sliceCoverage, agreementRate or relevanceFloor) failed | Check which signal failed in the output. Adjust the consumer's thresholds or broaden the scope. |
| Coverage-graph query returns empty | No nodes have been upserted for this spec folder | Run the consumer loop first, or upsert nodes manually with `upsert.cjs`. |
| Fan-out merge produces duplicates | Seats found the same findings independently | The merge script deduplicates by `unit_id`. Check that the consumer is passing the correct dedup key. |

---

## 7. FAQ

**Q: Why does a shared runtime exist instead of letting each loop duplicate the infrastructure?**

A: Before the consolidation, executor config, atomic-state writes, JSONL repair, locking, coverage-graph ownership, Bayesian scoring and fallback routing were duplicated across loops (or worse, lived inside a third package's MCP server). One implementation means one place to fix bugs, one set of guarantees and no drift between consumers.

**Q: Which skills consume this runtime?**

A: Five: `deep-research`, `deep-review`, `deep-context`, `deep-ai-council` and `deep-improvement`. They import from `lib/` and call the `.cjs` scripts directly.

**Q: How does a consumer call the scripts?**

A: From a workflow YAML or a `.cjs` entry point, call `node .opencode/skills/deep-loop-runtime/scripts/<name>.cjs <args>`. Each script documents its own arguments in `references/script_interface_contract.md`.

**Q: What do the coverage graph and Bayesian scorer provide?**

A: The coverage graph stores nodes (slices, findings, anchors) and edges (relationships) that track what a loop has explored. The Bayesian scorer reads signal values from this graph, applies Laplace smoothing and produces a composite convergence score. Three blocking guards and two weighted contributors decide whether the loop should stop or continue.

---

## 8. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | Runtime instructions, the component map and the consumer contract |
| [`references/script_interface_contract.md`](./references/script_interface_contract.md) | CLI arguments, exit codes and output format for every `.cjs` entry point |
| [`references/coverage_graph_schema.md`](./references/coverage_graph_schema.md) | Node types, edge types and the signal table for the coverage graph |
| [`references/state_format.md`](./references/state_format.md) | Packet-file ownership, mutability rules and JSONL record types |
| [`references/integration_points.md`](./references/integration_points.md) | How consumer skills wire into the runtime and which modules they import |
| [`lib/deep-loop/`](./lib/deep-loop/) | Executor, prompt-pack, validation, atomic-state, locking, scoring and fallback modules |
| [`lib/coverage-graph/`](./lib/coverage-graph/) | Coverage-graph DB, queries and signals |
| [`lib/council/`](./lib/council/) | Multi-seat dispatch, round state, adjudication, cost guards and the council graph |
| [`scripts/`](./scripts/) | Fan-out pool, run, merge and convergence entry points |
