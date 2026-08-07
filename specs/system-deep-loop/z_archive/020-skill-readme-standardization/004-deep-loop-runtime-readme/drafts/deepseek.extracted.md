---
title: "deep-loop-runtime"
description: "Shared runtime library that the five deep-loop skills ride: executor dispatch, prompt-pack rendering, atomic state, coverage-graph storage, Bayesian convergence scoring and council durability primitives, consumed through TypeScript imports and direct .cjs script calls."
trigger_phrases:
  - "deep-loop runtime"
  - "deep-loop-runtime"
  - "executor config"
  - "prompt pack"
  - "coverage graph"
  - "bayesian scorer"
  - "deep_loop_graph"
  - "fallback router"
  - "jsonl repair"
  - "loop lock"
---

# deep-loop-runtime

> The shared foundation every deep loop rides. Not a loop you invoke directly. The runtime library your loop's YAML, scripts and tests import.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Use it for** | The runtime infrastructure every deep loop needs: executor dispatch, atomic state, coverage-graph storage, Bayesian convergence scoring and council durability |
| **Invoke with** | `import` from `lib/` in TypeScript or `node scripts/<name>.cjs` in a workflow YAML block. No MCP tools, no slash commands. |
| **Works on** | The five deep-loop consumer skills that import it: `deep-research`, `deep-review`, `deep-context`, `deep-ai-council` and `deep-improvement` |
| **Produces** | Typed convergence decisions, JSONL state logs, session-scoped coverage graphs, multi-seat dispatch outcomes and scored adjudicator verdicts |

---

## 2. OVERVIEW

### Why This Skill Exists

Two deep-loop skills shared the same runtime code. Both needed executor config parsing. Both needed atomic state-log writes and single-writer locking. Both needed a coverage graph that survives a session crash. Both needed Bayesian convergence scoring. Before this skill existed, all of that lived inside `system-spec-kit/mcp_server/` and got reached through four `mcp__mk_spec_memory__deep_loop_graph_*` MCP tools. Two consumer skills depended on the internals of a third package. Every workflow call paid the MCP marshalling and JSON-parse round-trip. Each loop would otherwise duplicate executor config, atomic-state writes, JSONL repair, single-writer locking, coverage-graph ownership, Bayesian scoring and fallback routing.

The FULL_ISOLATE_NO_MCP consolidation moved the shared runtime into this peer skill. The four MCP tools are gone. Direct script invocation replaced them. One step instead of two. One hardened implementation every loop shares.

### What It Does

`deep-loop-runtime` provides three component families through TypeScript imports under `lib/` and eight `.cjs` script entry points under `scripts/`. The deep-loop family owns executor config, prompt-pack rendering, post-dispatch validation, atomic state, JSONL repair, loop locking, permissions gating, Bayesian scoring and fallback routing. The coverage-graph family owns the SQLite schema, query builders and convergence-signal extraction. The council family owns multi-seat dispatch, round-state JSONL, adjudicator-verdict scoring, cost guards, session-state hierarchy and the council graph. Consumer skills import what they need. No consumer invokes this skill directly. It is the foundation they ride.

---

## 3. QUICK START

**Step 1: Call a script from your workflow YAML.** The `.cjs` entry points accept `--spec-folder`, `--loop-type` and `--session-id`. They write JSON to stdout and exit with a uniform code.

```bash
node .opencode/skills/deep-loop-runtime/scripts/convergence.cjs \
  --spec-folder "specs/my-feature" \
  --loop-type research \
  --session-id "abc123"
```

Expected output: a JSON object with `decision` ("CONTINUE", "STOP_ALLOWED" or "STOP_BLOCKED"), `signals`, `blockers` and `stopBlocked`. Exit code `0` means the decision was computed. Exit code `2` means the database was unreachable.

**Step 2: Import a runtime module from your TypeScript loop code.**

```typescript
import { acquireLoopLock, releaseLoopLock } from '../../deep-loop-runtime/lib/deep-loop/loop-lock.js';
import { renderPromptPack } from '../../deep-loop-runtime/lib/deep-loop/prompt-pack.js';
import { validateIterationOutputs } from '../../deep-loop-runtime/lib/deep-loop/post-dispatch-validate.js';

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
pnpm --dir .opencode/skills/system-spec-kit/mcp_server exec vitest run ../../deep-loop-runtime/tests
```

Expected output: the vitest runner discovers unit, integration and lifecycle tests through the cross-package glob in `system-spec-kit/mcp_server/vitest.config.ts`. A green run confirms the runtime is wired correctly.

---

## 4. HOW IT WORKS

### The Three Component Families

`lib/deep-loop/` holds the loop infrastructure. `executor-config` parses per-iteration executor settings from a shared schema so every consumer calls the same executor shape. `executor-audit` appends a provenance block to each iteration JSONL so you can tell which model and CLI produced each iteration. `prompt-pack` renders the iteration prompt template. `post-dispatch-validate` checks that an iteration produced valid markdown, JSONL and delta outputs before the state log accepts them. `atomic-state` writes state logs through a tmpfile-plus-rename pattern so a crash never leaves a partial line. `jsonl-repair` recovers a corrupt trailing line before append. `loop-lock` enforces single-writer access around state mutations. `permissions-gate` checks permission scope before touching sensitive paths. `bayesian-scorer` interprets per-iteration novelty signals into typed convergence decisions with Laplace smoothing. `fallback-router` picks a replacement executor when the primary one times out.

`lib/coverage-graph/` owns the session-scoped evidence graph. `coverage-graph-db` is the sole owner of the SQLite connection at `database/deep-loop-graph.sqlite`. No other module opens that database. `coverage-graph-query` builds queries for uncovered questions, unverified claims, contradictions and evidence chains. `coverage-graph-signals` extracts convergence signals (novelty rate, claim-support ratio, contradiction count) the Bayesian scorer consumes.

`lib/council/` provides council durability primitives. `multi-seat-dispatch` runs seat executors in parallel for one council round and returns fulfilled or rejected per-seat outcomes. `round-state-jsonl` appends per-round JSONL with the same lock-file single-writer guard the deep-loop family uses. `adjudicator-verdict-scoring` scores round-to-round verdict deltas across five weighted axes. `cost-guards` enforces session and topic budgets. `session-state-hierarchy` creates the stable session-to-topic-to-round state shape. A separate `council-graph-db` and `council-graph-query` pair owns the council-specific graph schema and `convergence.cjs` at the council layer drives council stop decisions.

The council modules mirror the deep-loop durability contract in a council-scoped surface so `deep-ai-council` can consume them without touching deep-review or deep-research behavior.

### Script Entry Points and the Fan-Out Pool

Eight `.cjs` scripts under `scripts/` handle every runtime call. The four core scripts replace the deleted MCP tools: `convergence.cjs` computes CONTINUE, STOP_ALLOWED or STOP_BLOCKED. `upsert.cjs` stores nodes and edges from an iteration's graph events. `query.cjs` inspects uncovered questions, unverified claims and contradictions. `status.cjs` returns a session-scoped health report. Each script parses argv, opens the SQLite database inside a `try`, calls the matching lib function, writes JSON to stdout, closes the database in a `finally` and exits with the standardized code (0 ok, 1 script error, 2 DB error, 3 input validation error).

The four fan-out scripts orchestrate multi-executor runs. `fanout-run.cjs` spawns headless CLI subprocesses into isolated `lineages/{label}/` directories. `fanout-pool.cjs` provides a concurrency-capped worker pool with a status ledger. `fanout-salvage.cjs` recovers missing iteration files from captured subprocess stdout. `fanout-merge.cjs` deduplicates findings across lineages into a consolidated registry. Each lineage gets its own session ID so coverage-graph writes never collide.

A shared CLI guard at `scripts/lib/cli-guards.cjs` normalizes common argv validation across all entry points.

---

## 5. INTEGRATION & NAVIGATION

### When A Consumer Reaches For This Runtime

Your loop skill needs executor dispatch, atomic state writes, a coverage graph or Bayesian scoring. Import `lib/deep-loop/`, call `scripts/convergence.cjs` from your workflow YAML, or open the coverage graph through the lib modules. The runtime provides the infrastructure. Your skill owns the loop policy and the user-facing surface.

Skip this runtime when you are writing a loop's own UX, convergence policy or domain logic. Those live in the consumer skill. The runtime offers primitive contracts, not opinions about how many iterations constitute convergence or what a research finding looks like.

### The Five Consumers

`deep-loop-runtime` is the foundation. The five loop skills are the buildings.

| Skill | How it consumes the runtime |
|---|---|
| `deep-research` | Calls `convergence.cjs`, `upsert.cjs`, `query.cjs` and `status.cjs` from its workflow YAML. Imports `lib/deep-loop/` for prompt-pack rendering, atomic state and executor audit. |
| `deep-review` | Mirror script invocations to deep-research. Imports `lib/coverage-graph/` for its reducer. Uses the Bayesian scorer and coverage-graph signals to decide when a review has converged. |
| `deep-context` | Runs the fan-out pool to sweep the codebase in parallel. Imports the coverage-graph store and the convergence script. The multi-model agreement merge reads coverage-graph signals. |
| `deep-ai-council` | Consumes `lib/council/` for multi-seat dispatch, round-state JSONL, adjudicator scoring, cost guards and session-state hierarchy. Operator-facing council semantics stay in `deep-ai-council`. |
| `deep-improvement` | Imports the deep-loop executor config and the council cost guards. Its evaluator-first proposal pipeline rides the same executor dispatch path the other loops use. |

`system-spec-kit` owns the spec folder, validation and memory continuity. `sk-code` owns code standards and test verification. This runtime owns the infrastructure the loops ride and nothing else.

---

## 6. TROUBLESHOOTING

| What you see | Why | Fix |
|---|---|---|
| Script exits with code 2 (DB error) | The SQLite database is missing, corrupt or locked by another writer | Confirm `database/deep-loop-graph.sqlite` exists and is writable. If a stale lock file at `database/.deep-loop-graph-writer.lock` survived a crash, remove it after confirming no live writer is running (`ps aux | grep convergence.cjs`). |
| Script exits with code 3 (input validation error) | Argv parsing rejected the input | Check `--spec-folder` is present, `--loop-type` is one of `review` or `research` and `--session-id` contains no path-traversal characters. The full contract is at `references/script_interface_contract.md`. |
| Bayesian scorer returns CONTINUE past a high iteration count | The novelty signal is not dropping | Check the iteration outputs for corrupt data that injects fake novelty. `jsonl-repair` catches trailing-line corruption. If outputs are valid, the loop is genuinely surfacing new evidence and the hard cap is the correct stop. |
| Loop-lock acquisition times out | A long-running upsert holds the lock, or a stale lock survived a crash | Raise `DEEP_LOOP_WRITER_LOCK_MAX_WAIT_MS` (default 1000 ms) for contended workloads. For a stale lock, remove `database/.deep-loop-graph-writer.lock` after confirming no live writer. |
| A state log is corrupt mid-line | The crash happened during a write, not at a line boundary | `jsonl-repair` recovers only trailing corruption. For mid-line corruption, inspect the file manually and delete the broken line. The loop resumes from the last intact record. |
| Two writers raced the state log | The loop-lock was not acquired before the mutation | Every consumer that mutates state must call `acquireLoopLock` first. The lockfile at `database/.deep-loop-graph-writer.lock` enforces single-writer access. Verify your consumer's write path calls `acquireLoopLock` and `releaseLoopLock` in a try-finally. |
| Tests fail with "table coverage_nodes not found" | The test runner points at a real database instead of a fresh per-test one | Confirm the test imports `coverage-graph-db.ts`, calls the init helper and points at a temporary database directory, not the runtime-owned one. |

---

## 7. FAQ

**Q: Why does a shared runtime exist instead of each loop duplicating the infrastructure?**

A: Before the consolidation, executor config, atomic state, coverage-graph storage and Bayesian scoring were scattered across the MCP server and duplicated per loop. A bug fix to the JSONL repair module required the same change in multiple places. The runtime consolidation moved every shared contract into one peer skill. One fix now propagates to every consumer.

**Q: Which skills consume this runtime?**

A: Five: `deep-research`, `deep-review`, `deep-context`, `deep-ai-council` and `deep-improvement`. Each imports the modules it needs through TypeScript and calls the `.cjs` scripts from its workflow YAML. The runtime itself has no user-facing command and registers no MCP tools.

**Q: How does a consumer call the scripts?**

A: A workflow YAML block calls `node .opencode/skills/deep-loop-runtime/scripts/<name>.cjs` with `--spec-folder`, `--loop-type` and `--session-id`. The script writes JSON to stdout and exits with code 0, 1, 2 or 3. Workflow output bindings capture the JSON fields. TypeScript consumers import `lib/` modules directly and call the exported functions.

**Q: What does the coverage graph provide?**

A: A session-scoped SQLite graph that tracks research nodes (questions, findings, claims, sources) and review nodes (dimensions, files, findings, evidence, bugs, invariants). Query builders surface uncovered questions, unverified claims and contradictions. Signal extractors feed the Bayesian scorer with novelty rate, claim-support ratio and contradiction counts.

**Q: What does the Bayesian scorer do?**

A: It reads per-iteration novelty signals from the coverage graph and returns a typed decision: CONTINUE (keep iterating), STOP_ALLOWED (convergence reached) or STOP_BLOCKED (a blocking guard failed). The scorer uses Laplace smoothing and a configurable weight matrix. Each consumer sets its own convergence thresholds on top of the shared scorer.

**Q: Why are council primitives here rather than in `deep-ai-council`?**

A: Multi-seat dispatch, round-state JSONL, adjudicator scoring, cost guards and session-state hierarchy are durability contracts, not UX. They belong with the other deep-loop durability primitives (atomic state, JSONL repair, loop-lock). `deep-ai-council` owns the operator-facing council semantics. The split keeps `deep-ai-council` free to change its UX without touching the durability layer.

**Q: Does this skill expose MCP tools?**

A: No. The isolation ADR removed the four `mcp__mk_spec_memory__deep_loop_graph_*` tools. Reintroducing MCP surface here would defeat the FULL_ISOLATE direction. Every runtime call goes through a direct `.cjs` script invocation or a TypeScript import.

**Q: Can I add a new consumer skill?**

A: Adding a sixth consumer requires a new ownership ADR. The ESCALATE clause in `SKILL.md` routes new consumers through an explicit contract decision so the runtime-to-consumer relationship stays documented.

---

## 8. VERIFICATION

The skill ships a feature catalog and a manual testing playbook that together cover every runtime surface.

### Feature Catalog

`feature_catalog/` documents each capability across nine domains: executor config, prompt rendering, validation, state safety, scoring, coverage graph, script entry points, council primitives and the fan-out pool. Every entry names inputs, outputs, the owning resource and acceptance criteria.

### Manual Testing Playbook

`manual_testing_playbook/` provides deterministic scenarios across the same nine domains. The root playbook defines preconditions, expected signals and pass, fail or partial verdict rules. Each scenario maps to a dedicated feature file with the canonical invocation and live source anchors.

### Run the validator

```bash
python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/deep-loop-runtime/README.md --type readme
```

Expected output: zero issues reported.

---

## 9. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | Runtime instructions, the smart router, the ALWAYS / NEVER / ESCALATE rules and the full operating contract |
| [`references/script_interface_contract.md`](./references/script_interface_contract.md) | The `.cjs` argv contract, exit-code matrix and stdout JSON shape every script honors |
| [`references/coverage_graph_schema.md`](./references/coverage_graph_schema.md) | SQLite schema, node-kind allow-list, relation kinds and indexes |
| [`references/integration_points.md`](./references/integration_points.md) | Consumer surface map: which skill calls which script and imports which module |
| [`references/state_format.md`](./references/state_format.md) | Runtime state JSONL record types and the tmpfile-plus-rename write contract |
| [`feature_catalog/feature_catalog.md`](./feature_catalog/feature_catalog.md) | Per-feature canonical inventory across nine domains |
| [`manual_testing_playbook/manual_testing_playbook.md`](./manual_testing_playbook/manual_testing_playbook.md) | Operator-facing deterministic scenarios with preconditions and expected signals |
| [`changelog/`](./changelog/) | Per-release notes and the consolidation rationale |
