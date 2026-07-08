---
title: "system-deep-loop/runtime"
description: "Shared runtime library the active system-deep-loop modes ride: executor dispatch, prompt-pack rendering, atomic state, coverage-graph storage, Bayesian convergence scoring and council durability, consumed through TypeScript imports and direct .cjs script calls."
trigger_phrases:
  - "deep-loop runtime"
  - "runtime/"
  - "executor config"
  - "prompt pack"
  - "coverage graph"
  - "bayesian scorer"
  - "fallback router"
  - "jsonl repair"
  - "loop lock"
version: 1.5.0.1
---

# system-deep-loop / runtime

> The shared foundation every active deep-loop mode rides. Not a loop you invoke directly, and not independently advisor-routable (no `graph-metadata.json` of its own) — it is nested infrastructure inside the `system-deep-loop` skill, consumed via TypeScript imports and direct `.cjs` script calls from the sibling mode packets. Formerly the separate `runtime/` skill, merged into this hub 2026-07-08.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Use it for** | The runtime infrastructure every deep loop needs: executor dispatch, atomic state, coverage-graph storage, Bayesian convergence scoring and council durability |
| **Invoke with** | `import` from `lib/` in TypeScript, or `node scripts/<name>.cjs` in a workflow YAML block. No MCP tools, no slash commands. |
| **Works on** | The one consumer skill that imports it, `system-deep-loop`, across active modes: `research`, `review`, `ai-council` and `improvement`. Legacy `context` parsing remains only for historical artifacts. |
| **Produces** | Typed convergence decisions, JSONL state logs, session-scoped coverage graphs, multi-seat dispatch outcomes and scored adjudicator verdicts |

---

## 2. OVERVIEW

### Why This Skill Exists

Several deep loops shared the same runtime code. Each needed executor config parsing. Each needed atomic state-log writes and single-writer locking. Each needed a coverage graph that survives a session crash. Each needed Bayesian convergence scoring. Before this skill existed, all of that lived inside `system-spec-kit/mcp_server/` and got reached through MCP tools. The consumer modes depended on the internals of a separate package, every workflow call paid the MCP marshalling and JSON-parse round-trip, and each loop would otherwise duplicate executor config, atomic-state writes, JSONL repair, single-writer locking, coverage-graph ownership, Bayesian scoring and fallback routing.

The consolidation moved the shared runtime into this peer skill. The MCP tools are gone, and direct script invocation replaced them. One step instead of two, one hardened implementation every loop shares.

### What It Does

`runtime/` provides three component families through TypeScript imports under `lib/` and `.cjs` script entry points under `scripts/`, plus shared lifecycle, observability, and test-harness helpers surfaced in the catalog. The deep-loop family owns executor config, prompt-pack rendering, post-dispatch validation, atomic state, JSONL repair, loop locking, permissions gating, Bayesian scoring and fallback routing. It also hosts the shared backend contracts the consumer modes ride: a parameterized capability resolver, the artifact-topology seam (`resolveArtifactRoot`), the terminal lifecycle taxonomy (seven `stopReason` plus four `sessionOutcome` values) and a CLI adapter over the loop lock. The coverage-graph family owns the SQLite schema, query builders and convergence-signal extraction. The council family owns multi-seat dispatch, round-state JSONL, adjudicator-verdict scoring, cost guards, session-state hierarchy and the council graph. The workflow modes import what they need. No mode invokes this skill directly, and none of these contracts register an MCP tool. It is the foundation they ride.

---

## 3. QUICK START

**Step 1: Call a script from your workflow YAML.** The `.cjs` entry points accept `--spec-folder`, `--loop-type` and `--session-id`. They write JSON to stdout and exit with a uniform code.

```bash
node .opencode/skills/system-deep-loop/runtime/scripts/convergence.cjs \
  --spec-folder "specs/my-feature" \
  --loop-type research \
  --session-id "abc123"
```

Expected output: a JSON wrapper with `status`, `data`, and workflow-facing fields including `graph_decision`, `graph_signals_json`, `graph_blockers_json`, `graph_stop_blocked`, `graph_trace_json` and `graph_convergence_score`. Exit code `0` means the decision was computed. Exit code `2` means the database was unreachable.

**Step 2: Import a runtime module from your TypeScript loop code.**

```typescript
import { acquireLoopLock, releaseLoopLock } from '../../runtime//lib/deep-loop/loop-lock.js';
import { renderPromptPack } from '../../runtime//lib/deep-loop/prompt-pack.js';
import { validateIterationOutputs } from '../../runtime//lib/deep-loop/post-dispatch-validate.js';

const lock = await acquireLoopLock(specFolder);
try {
  const prompt = renderPromptPack(template, vars);
  const result = await dispatch(prompt);
  validateIterationOutputs(result, iterationDir);
} finally {
  await releaseLoopLock(lock);
}
```

**Step 3: Run the runtime tests to confirm your environment works.**

```bash
pnpm --dir .opencode/skills/system-spec-kit/mcp_server exec vitest run ../../runtime//tests
```

Expected output: the vitest runner discovers the unit, integration and lifecycle tests through the cross-package glob in `system-spec-kit/mcp_server/vitest.config.ts`. A green run confirms the runtime is wired correctly.

---

## 4. HOW IT WORKS

### The Three Component Families

`lib/deep-loop/` holds the loop infrastructure. `executor-config` parses per-iteration executor settings from a shared schema so every consumer calls the same executor shape. `executor-audit` appends a provenance block to each iteration JSONL so you can tell which model and CLI produced each iteration. `prompt-pack` renders the iteration prompt template. `post-dispatch-validate` checks that an iteration produced valid markdown, JSONL and delta outputs before the state log accepts them, stamps seekable log-region offsets, and quarantines failed LLM-judge fallback cards. `atomic-state` writes state logs through a tmpfile-plus-rename pattern, adds compare-before-write, SHA-256 integrity helpers, and a deferred writer, so a crash never leaves a partial line and unchanged snapshots can avoid redundant writes. `jsonl-repair` recovers a corrupt trailing line before append and supports lock-held fan-out salvage merges. `loop-lock` enforces single-writer access around state mutations, with heartbeat metadata and opt-in host-local single-flight acquisition. `permissions-gate` checks permission scope before touching sensitive paths. `bayesian-scorer` exports the small Bayesian helpers `computeScore` and `shouldDemote`; `convergence.cjs` builds the typed loop decisions. `fallback-router` picks a replacement executor when the primary one times out and validates typed reroute graphs before dispatch.

`lib/coverage-graph/` owns the session-scoped evidence graph. `coverage-graph-db` is the sole owner of the SQLite connection at `database/deep-loop-graph.sqlite`, and no other module opens that database. `coverage-graph-query` builds queries for uncovered questions, unverified claims, contradictions and evidence chains. `coverage-graph-signals` extracts typed research and review metrics, plus legacy context metrics for historical artifacts, with optional observation thresholds and time-decay weighting, including `questionCoverage`, `claimVerificationRate`, `contradictionDensity`, `sliceCoverage`, `reuseCatalogCoverage` and `agreementRate`, for `convergence.cjs` to evaluate.

`lib/council/` provides council durability primitives. `multi-seat-dispatch` runs seat executors in parallel for one council round and returns fulfilled or rejected per-seat outcomes. `round-state-jsonl` appends per-round JSONL with the same lock-file single-writer guard the deep-loop family uses. `adjudicator-verdict-scoring` scores round-to-round verdict deltas across five weighted axes. `cost-guards` enforces session and topic budgets. `session-state-hierarchy` creates the stable session-to-topic-to-round state shape. A separate `council-graph-db` and `council-graph-query` pair owns the council-specific graph schema, and a council-layer convergence script drives council stop decisions. The council modules mirror the deep-loop durability contract in a council-scoped surface so the `ai-council` mode can consume them without touching review or research behavior.

### Script Entry Points and the Fan-Out Pool

The `.cjs` scripts under `scripts/` handle every runtime call. The core scripts replace the deleted MCP tools: `convergence.cjs` computes the stop decision, `upsert.cjs` stores nodes and edges from an iteration's graph events, `query.cjs` inspects uncovered questions, unverified claims and contradictions, and `status.cjs` returns a session-scoped health report. Each parses argv, opens the SQLite database inside a `try`, calls the matching lib function, writes JSON to stdout, closes the database in a `finally` and exits with the standardized code (0 ok, 1 script error, 2 DB error, 3 input validation error).

The fan-out scripts orchestrate multi-executor runs, including fixed-rate overrun accounting, an opt-in stall watchdog, and persisted-wait crash resume. `fanout-run.cjs` spawns headless CLI subprocesses into isolated `lineages/{label}/` directories. `fanout-pool.cjs` provides a concurrency-capped worker pool with a status ledger. `fanout-salvage.cjs` recovers missing iteration files from captured subprocess stdout. `fanout-merge.cjs` deduplicates findings across lineages into a consolidated registry. Each lineage gets its own session id so coverage-graph writes never collide. A shared CLI guard at `scripts/lib/cli-guards.cjs` normalizes argv validation across every entry point. The runtime also ships `sleep.ts`, `lifecycle-taxonomy.cjs`, `observability-events.cjs`, `createHermeticEnv()`, and record/replay cassette helpers for cancellable waits, lifecycle guards, telemetry envelopes, hermetic tests, and reproducible script regressions.

---

## 5. INTEGRATION & NAVIGATION

### When A Consumer Reaches For This Runtime

Your loop skill needs executor dispatch, atomic state writes, a coverage graph or Bayesian scoring. Import `lib/deep-loop/`, call `scripts/convergence.cjs` from your workflow YAML, or open the coverage graph through the lib modules. The runtime provides the infrastructure. Your skill owns the loop policy and the user-facing surface.

Skip this runtime when you are writing a loop's own UX, convergence policy or domain logic. Those live in the consumer skill. The runtime offers primitive contracts, not opinions about how many iterations constitute convergence or what a research finding looks like.

### The One Consumer and Its Active Modes

`runtime/` is the foundation. `system-deep-loop`'s active modes are the rooms that ride it — nested infrastructure within the same skill, not a separate building.

| Mode | How it consumes the runtime |
|---|---|
| `research` | Calls `convergence.cjs`, `upsert.cjs`, `query.cjs` and `status.cjs` from its workflow YAML. Imports `lib/deep-loop/` for prompt-pack rendering, atomic state and executor audit. |
| `review` | Mirrors the research mode's script calls. Imports `lib/coverage-graph/` for its reducer and uses the Bayesian scorer and coverage signals to decide when a review has converged. |
| `ai-council` | Consumes `lib/council/` for multi-seat dispatch, round-state JSONL, adjudicator scoring, cost guards and session-state hierarchy. The operator-facing council semantics stay in the `ai-council` mode. |
| `improvement` | Imports the deep-loop executor config and the council cost guards. Its evaluator-first pipeline rides the same executor dispatch path the other modes use. |

The deprecated standalone context loop no longer consumes fan-out. Runtime `context` parsing remains for existing artifacts and graph rows until a migration proves it can be removed safely.

`system-spec-kit` owns the spec folder, validation and memory continuity. `sk-code` owns code standards and test verification. This runtime owns the infrastructure the loops ride and nothing else.

---

## 6. TROUBLESHOOTING

| What you see | Why | Fix |
|---|---|---|
| Script exits with code 2 (DB error) | The SQLite database is missing, corrupt or locked by another writer | Confirm `database/deep-loop-graph.sqlite` exists and is writable. If a stale `database/.deep-loop-graph-writer.lock` survived a crash, remove it after confirming no live writer (`ps aux | grep convergence.cjs`). |
| Script exits with code 3 (input validation) | Argv parsing rejected the input | Check `--spec-folder` is present, `--loop-type` is valid for the script, and `--session-id` has no path-traversal characters. Active convergence loop types are `research`, `review` and `council`; fan-out accepts only `research` and `review`; legacy `context` is retained only where a script explicitly documents historical artifact compatibility. `improvement` is host-driven, not a runtime `loopType`. The full contract is in `references/script_interface_contract.md`. |
| Convergence returns CONTINUE past a high iteration count | The typed convergence signals are not passing the stop thresholds | Check the iteration outputs for corrupt data that injects fake coverage or contradiction signals. If outputs are valid, the loop is genuinely surfacing new evidence and the hard cap is the correct stop. |
| Loop-lock acquisition times out | A long-running upsert holds the lock, or a stale lock survived a crash | Raise `DEEP_LOOP_WRITER_LOCK_MAX_WAIT_MS` for contended workloads. For a stale lock, remove the writer lockfile after confirming no live writer. |
| A state log is corrupt mid-line | The crash happened during a write, not at a line boundary | `jsonl-repair` recovers only trailing corruption. For mid-line corruption, inspect the file and delete the broken line. The loop resumes from the last intact record. |
| Two writers raced the state log | The loop-lock was not acquired before the mutation | Every consumer that mutates state must call `acquireLoopLock` first, in a try-finally with `releaseLoopLock`. |

---

## 7. FAQ

**Q: Why does a shared runtime exist instead of each loop duplicating the infrastructure?**

A: Before the consolidation, executor config, atomic state, coverage-graph storage and Bayesian scoring were scattered across the MCP server and duplicated per loop. A bug fix to the JSONL repair module needed the same change in multiple places. The consolidation moved every shared contract into one peer skill, so one fix now propagates to every consumer.

**Q: Which skill consumes this runtime?**

A: One: `system-deep-loop`, across active modes (`research`, `review`, `ai-council` and `improvement`). Each mode imports the modules it needs and calls the `.cjs` scripts from its workflow YAML. The deprecated context loop is not an active consumer; retained `context` handling is for historical artifacts only. The runtime itself has no user-facing command and registers no MCP tools.

**Q: What does the coverage graph provide?**

A: A session-scoped SQLite graph that tracks research nodes (questions, findings, claims, sources) and review nodes (dimensions, files, findings, evidence, bugs, invariants). Query builders surface uncovered questions, unverified claims and contradictions. Signal extractors feed `convergence.cjs` with typed research, review and context metrics such as `questionCoverage`, `claimVerificationRate`, `contradictionDensity`, `sliceCoverage`, `reuseCatalogCoverage` and `agreementRate`.

**Q: What does the Bayesian scorer do?**

A: It exposes `computeScore(success, total)` with Laplace smoothing and `shouldDemote(score, totalCalls)` for fallback decisions. The typed loop decisions (`CONTINUE`, `STOP_ALLOWED` and `STOP_BLOCKED`) are assembled by `scripts/convergence.cjs` from coverage-graph signals and per-loop thresholds.

**Q: Why are council primitives here rather than in the `ai-council` mode?**

A: Multi-seat dispatch, round-state JSONL, adjudicator scoring, cost guards and session-state hierarchy are durability contracts, not UX. They belong with the other deep-loop durability primitives. The `ai-council` mode owns the operator-facing council semantics, and the split keeps it free to change its UX without touching the durability layer.

**Q: Does this skill expose MCP tools?**

A: No. The isolation removed the deep-loop-graph MCP tools. Every runtime call goes through a direct `.cjs` script invocation or a TypeScript import.

---

## 8. VERIFICATION

The skill ships a feature catalog and a manual testing playbook that together cover every runtime surface.

### Feature Catalog

`feature_catalog/` documents each capability across its domains: executor config, prompt rendering, validation, state safety, scoring, the coverage graph, the script entry points, council primitives and the fan-out pool. Every entry names inputs, outputs, the owning resource and acceptance criteria.

### Manual Testing Playbook

`manual_testing_playbook/` provides deterministic scenarios across the same domains. The root playbook defines preconditions, expected signals and pass, fail or partial verdict rules. Each scenario maps to a dedicated feature file with the canonical invocation and live source anchors.

```bash
python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/system-deep-loop/runtime/README.md --type readme
```

Expected output: zero issues reported.

---

## 9A. OPERATING RULES

*(Folded in from the former `SKILL.md` during the 2026-07-08 merge into `system-deep-loop`. This runtime is no longer independently advisor-routable, so these are contributor/operator rules, not routing logic.)*

### ALWAYS
- **ALWAYS** open the SQLite DB inside a `try` block and close it in a `finally` block (script lifecycle invariant)
- **ALWAYS** emit JSON-only output to stdout from `scripts/*.cjs` (workflow YAML parses stdout for output bindings)
- **ALWAYS** include `'use strict';` on line 2 of every `.cjs` script (per sk-code OPENCODE JS style)
- **ALWAYS** include a `MODULE: <name>` header comment in every `lib/**/*.ts` file (per sk-code OPENCODE TS-MODULE-HEADER convention)
- **ALWAYS** preserve atomic-state semantics when mutating JSONL state — never partial-write
- **ALWAYS** acquire `loop-lock` before any state-log mutation

### NEVER
- **NEVER** register MCP tools from this runtime — the isolation ADR explicitly removed the MCP surface; reintroducing tools defeats the FULL_ISOLATE direction
- **NEVER** open the SQLite DB outside `lib/coverage-graph/coverage-graph-db.ts` — single owner of the connection
- **NEVER** write to `database/deep-loop-graph.sqlite` without holding the `loop-lock`
- **NEVER** swallow exceptions in script entry points — propagate to the exit-code matrix
- **NEVER** add a `graph-metadata.json` or any discoverable skill marker to this folder — it is nested infrastructure, not a mode (per `system-deep-loop/SKILL.md`'s own NEVER rule)

### ESCALATE IF
- **ESCALATE** to the user if a runtime call requires a new MCP tool — the architectural direction prohibits MCP additions
- **ESCALATE** if the SQLite schema requires a backward-incompatible change — coordinate with all consumer modes + add migration to `coverage-graph-db.ts`
- **ESCALATE** if a script's stdout JSON contract changes — every workflow YAML output binding depends on the existing shape

### Per-runtime agent mirrors (consumer convention)

This runtime is MCP-free and owns no agents, but every active deep-loop mode that consumes it ships a **native agent** that the loop dispatches **by name** (`agent: <name>` in the loop YAML), which each host runtime resolves from its OWN `agents/` dir. Each such active agent — `deep-research`, `deep-review`, `deep-improvement`, `ai-council` — is one canonical source plus one runtime mirror carrying the same body:

- `.opencode/agents/<name>.md` — **canonical** (OpenCode frontmatter: `mode: subagent` + `permission:` block)
- `.claude/agents/<name>.md` — Claude mirror (`tools:` allow-list frontmatter)

The loop commands and YAML are **shared** across runtimes (the `.claude/`/`.opencode/` `commands`/`prompts`/`skills` dirs are symlinks to `.opencode/`), so they reference canonical `.opencode/` paths and dispatch by name on purpose — do NOT fork them per runtime. A deep-loop agent present in `.opencode/agents/` but missing its `.claude/` mirror silently fails to dispatch in that runtime (CLI seats still run; only the native seat drops). **When adding or renaming a deep-loop native agent, create/update both files and verify two-way parity** (e.g. compare `ls .opencode/agents .claude/agents`).

---

## 9. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`references/script_interface_contract.md`](./references/script_interface_contract.md) | The `.cjs` argv contract, exit-code matrix and stdout JSON shape every script honors |
| [`references/coverage_graph_schema.md`](./references/coverage_graph_schema.md) | SQLite schema, node-kind allow-list, relation kinds and indexes |
| [`references/integration_points.md`](./references/integration_points.md) | Consumer surface map: which skill calls which script and imports which module |
| [`references/state_format.md`](./references/state_format.md) | Runtime state JSONL record types and the tmpfile-plus-rename write contract |
| [`feature_catalog/feature_catalog.md`](./feature_catalog/feature_catalog.md) | Per-feature canonical inventory across the runtime domains |
| [`manual_testing_playbook/manual_testing_playbook.md`](./manual_testing_playbook/manual_testing_playbook.md) | Operator-facing deterministic scenarios with preconditions and expected signals |
