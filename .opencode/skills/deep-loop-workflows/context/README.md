---
title: "deep-context"
description: "Iterative codebase-context loop that runs a parallel multi-model sweep over a shared scope and synthesizes a reuse-first Context Report before planning or implementation."
trigger_phrases:
  - "gather context"
  - "map the code for X"
  - "pre-plan context sweep"
  - "what can I reuse"
  - "deep context loop"
  - "/deep:context"
---

# deep-context

> Map the existing code you can reuse, connect and follow before you write a single line.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Use it for** | Mapping existing code before `/speckit:plan` or `/speckit:implement`, returning verified reuse candidates, integration points and conventions from a multi-model parallel sweep |
| **Invoke with** | `/deep:context:auto "scope"` (autonomous) or `:confirm` (gated). Keyword triggers include "gather context", "map the code for X" and "what can I reuse" |
| **Works on** | A target scope in your codebase, swept by a configurable pool of read-only executor seats all analyzing the same focus in parallel |
| **Produces** | A reuse-first Context Report with verified `file:symbol` pointers, plus a findings registry, convergence dashboard and iteration audit trail under `{spec_folder}/context/` |

---

## 2. OVERVIEW

### Why This Skill Exists

Before you plan or implement a feature, discovery is expensive and ad-hoc. You need to know what existing code to reuse, where to connect and which conventions to follow. A single-pass lookup misses nuance. One model's perspective misses blind spots. Without a verified map you duplicate code that already exists, touch the wrong integration points or violate local conventions. The blast radius across modules stays unclear until after the plan is written, which means rework.

### What It Does

`deep-context` is an iterative multi-model context-gathering loop. It sweeps the existing repository in parallel with a configurable pool of executor seats and synthesizes a reuse-first Context Report. The report ships verified `file:symbol` pointers, not source bodies, so the consumer pulls code just-in-time. It runs the same scope through every seat at once, merges findings by cross-executor agreement and stops only when five convergence signals say enough context has been gathered. It does not plan, review or implement. Hand the report to `/speckit:plan` and let the planner decide.

---

## 3. QUICK START

**Step 1: Invoke it.** Pick your mode. Autonomous runs straight through. Confirm asks for approval at setup, each iteration and synthesis.

```bash
# Autonomous (no gates)
/deep:context:auto "WebSocket reconnection, map the existing transport layer"

# Approval-gated
/deep:context:confirm "auth middleware, what can I reuse before planning"
```

The default pool runs 2 native `@deep-context` seats. Add CLI seats with `--executor` for a heterogeneous sweep.

```bash
/deep:context:auto "payment pipeline" --executor=cli-opencode --model=deepseek-v4-pro
```

Expected output: a converged Context Report at `{spec_folder}/context/context-report.md` with a REUSE catalog leading the file, followed by integration points, touch list, conventions, a pruned dependency subgraph, prior art and gaps.

**Step 2: Verify the reducer output after the loop finishes.**

```bash
node .opencode/skills/deep-loop-workflows/context/scripts/reduce-state.cjs <spec-folder>
```

Expected output: a JSON summary with `registryPath`, `dashboardPath`, `iterationsCompleted`, `findings`, `agreementEligible` and `contradictions`.

**Step 3: Confirm the config is valid.**

```bash
node -e "JSON.parse(require('node:fs').readFileSync('.opencode/skills/deep-loop-workflows/context/assets/deep_context_config.json','utf8'))" && echo "JSON OK"
```

Expected output: `JSON OK`.

---

## 4. HOW IT WORKS

### Frontier Seeding

The host extracts anchors from your scope query, then expands them through `code_graph_query` blast-radius calls into ranked SLICE nodes. When the code graph is stale or absent, the seeder falls back to Glob and Grep. The resulting frontier goes into `deep-context-strategy.md` before the first sweep runs. Every sweep targets the same frontier, so seats work from the same fact base.

### The Parallel By-Model Sweep

All seats sweep the same scope at once. Native `@deep-context` agents run as a parallel Task batch. Optional heterogeneous CLI seats (MiMo, gpt, deepseek, claude) dispatch through the deep-loop-runtime multi-seat pool. Both groups start together and barrier-join before the host merges anything. A seat that fails does not block the others, and the agreement count reflects only the seats that returned. Seats are read-only analyzers. The host writes all merged state, which keeps the loop Gate-3-safe.

### Agreement Merge

After each sweep the host deduplicates findings by `unit_id = sha256(path:symbol:kind)`. It unions per-executor attribution, boosts confidence by cross-executor agreement count and surfaces contradictions as CONTRADICTS edges rather than resolving them silently. A relevance gate at 0.55 drops below-threshold findings to a `lowConfidence` bucket. Findings confirmed by at least `agreementMin` executors (default 2) carry agreement-weighted confidence into the report.

### Five Convergence Signals

Five signals decide when the loop has gathered enough context. Three are blocking guards: `sliceCoverage` (0.70), `agreementRate` (0.50) and `relevanceFloor` (0.50). If any guard fails, the decision is STOP_BLOCKED and the loop continues with a recovery focus. Two are weighted contributors: `reuseCatalogCoverage` (weight 0.30, the highest) and `dependencyCompleteness` (weight 0.10). The host also runs a saturation check: new agreement-eligible findings per iteration must fall below the convergence threshold (default 0.10) for two consecutive sweeps before the loop is allowed to stop. A high composite score cannot buy past a failed blocking guard.

When all guards pass and saturation is reached, the host emits STOP_ALLOWED and synthesizes the Context Report.

---

## 5. INTEGRATION & NAVIGATION

### When To Use This Skill

Run `deep-context` before `/speckit:plan` or `/speckit:implement` when a feature spans multiple modules or the blast radius is unclear. Run it when you want diverse model lenses on the same code with agreement-weighted confidence. Run it when a reuse catalog saves you from writing code that already exists.

Skip it for a single-pass lookup, where the `@context` agent is faster. Skip it for outward web research (use `deep-research`), code audits (`deep-review`) or strategy comparison (`deep-ai-council`).

### Sibling Deep Loops

`deep-context` shares the `deep-loop-runtime` with three sibling skills. Each owns a different phase of the planning-to-implementation pipeline and none crosses into another's territory.

| Skill | Relationship |
|---|---|
| `deep-research` | Investigates outward web knowledge and answers research questions. `deep-context` maps inward code. |
| `deep-review` | Audits code for bugs, security gaps and quality issues. Run it after implementation, not before. |
| `deep-ai-council` | Compares competing plans with structured disagreement. Run `deep-context` first so seats start from shared facts. |

`/speckit:plan` and `/speckit:implement` consume the Context Report. `system-spec-kit` owns the spec folder, validation and memory continuity. `deep-loop-runtime` provides the shared coverage graph, convergence script and atomic-state layer.

---

## 6. TROUBLESHOOTING

| What you see | Why | Fix |
|---|---|---|
| Loop stops too early | Convergence threshold is too loose for the scope | Lower `--convergence` (try 0.05) or raise `--max-iterations` (try 12) |
| `agreementRate` stuck below 0.50 | Pool is too thin or seats are failing | Check provider auth. Add native seats. A 1-seat pool has no agreement signal. |
| `STOP_BLOCKED: sliceCoverage < 0.70` | Frontier has SLICE nodes no seat has covered | Narrow the scope or raise `--max-iterations` to match the budget |
| `STOP_BLOCKED: relevanceFloor < 0.50` | Seats are collecting tangential files | Tighten the scope query. Raise `--relevance-gate` to 0.65. |
| Seats produce contradictory findings | Normal. Two executors found the same symbol but disagree on contract. | Read the CONTRADICTS section in the report. The host never auto-resolves. |
| Reducer exits with an error | Corrupt JSONL state log | The reducer auto-repairs a trailing corrupt line. If the error persists, inspect the file for mid-line corruption. |
| CLI seat times out | Provider is slow or the scope slice is too broad | Narrow the scope per seat. Increase the per-seat timeout or reduce `--concurrency`. |
| Reports cite stale code-graph references | The code graph was not refreshed before the sweep | Re-index the code graph and re-run. The report labels unverified refs. |

---

## 7. FAQ

**Q: When do I run `deep-context` instead of the `@context` agent?**

A: `@context` is a single-pass read-only lookup. `deep-context` is a convergence-gated multi-iteration loop with a multi-model pool. Use `@context` for quick targeted searches. Use `deep-context` when you need a verified agreement-weighted map of an entire feature's code surface before planning.

**Q: What does the reuse-first report contain?**

A: Seven sections ordered by value-per-token: REUSE catalog (existing functions to extend, with `file:symbol`, signature and agreement count), integration points, touch list, conventions, a pruned dependency subgraph, prior art and gaps. Every entry ships a pointer, not a source body. The planner reads the actual code at the cited location just-in-time.

**Q: How does convergence decide to stop?**

A: Five signals drive the decision. Three blocking guards (`sliceCoverage`, `agreementRate`, `relevanceFloor`) must all pass, plus two weighted signals (`reuseCatalogCoverage`, `dependencyCompleteness`). When the guards pass and new agreement-eligible findings per iteration fall below the convergence threshold for two consecutive sweeps, the loop stops. If a guard fails, the decision is STOP_BLOCKED and the loop continues.

**Q: How do I add a heterogeneous CLI seat?**

A: Pass `--executor` with the CLI type, model and optional label. Repeat for each seat.

```bash
--executor=cli-opencode --model=deepseek-v4-pro --label=deepseek
--executor=cli-opencode --model=mimo-v2.5-pro --label=mimo
```

Or use the JSON escape hatch with `--executors=<json>` for the full pool. All CLI seats run read-only and carry a recursion guard so no nested context loop can launch from a seat.

**Q: Can I run the loop without a spec folder?**

A: Yes. When no spec folder is named or derivable from the scope, the host uses a standalone run directory and hands the report path to `/speckit:plan` at the end. All packet files still live under a `context/` subdirectory of that run dir.

---

## 8. VERIFICATION

The skill ships two validation packages.

### Feature Catalog

The `feature_catalog/` covers every capability across its categories: frontier seeding, the by-model parallel sweep, agreement merge, convergence detection, context report synthesis, coverage-graph schema and runtime robustness. Each category documents inputs, outputs, the owning resource and acceptance criteria.

### Manual Testing Playbook

Deterministic scenarios under `manual_testing_playbook/` across the same categories. Preconditions, expected signals and pass, fail or partial verdict rules are defined in the root playbook. Every scenario maps to a dedicated feature file with the canonical prompt, expected signals and live source anchors.

---

## 9. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | Runtime instructions, the smart router, the rules and the full operating contract |
| [`references/guides/quick_reference.md`](./references/guides/quick_reference.md) | One-page operator cheat sheet with commands, parameters, state files and the convergence tree |
| [`references/protocol/loop_protocol.md`](./references/protocol/loop_protocol.md) | Iteration lifecycle, parallel dispatch, merge rules and the host-writes-state invariant |
| [`references/convergence/convergence.md`](./references/convergence/convergence.md) | Stop-contract hub and decision tree |
| [`references/convergence/convergence_signals.md`](./references/convergence/convergence_signals.md) | The five signals, composite weights and threshold reference table |
| [`references/convergence/convergence_recovery.md`](./references/convergence/convergence_recovery.md) | Blocked-stop and stuck-recovery procedures |
| [`references/convergence/convergence_graph.md`](./references/convergence/convergence_graph.md) | The coverage-graph stop path for `loop_type='context'` |
| [`references/state/state_format.md`](./references/state/state_format.md) | Packet-file hub: owners, mutability and routing |
| [`references/state/state_jsonl.md`](./references/state/state_jsonl.md) | Append-only JSONL record types |
| [`references/state/state_outputs.md`](./references/state/state_outputs.md) | Dashboard, iteration files and Context Report outputs |
| [`references/state/state_reducer_registry.md`](./references/state/state_reducer_registry.md) | Reducer ownership, dedup and agreement and runtime robustness |
| [`assets/context_report_template.md`](./assets/context_report_template.md) | The Context Report schema consumed by `/speckit:plan` and `/speckit:implement` |
| [`scripts/reduce-state.cjs`](./scripts/reduce-state.cjs) | The agreement-weighted findings reducer and dashboard generator |
| [`feature_catalog/`](./feature_catalog/) | Feature inventory across frontier seeding, parallel sweep, agreement merge, convergence, report synthesis, coverage-graph schema and runtime robustness |
| [`manual_testing_playbook/`](./manual_testing_playbook/) | Deterministic scenarios with preconditions, expected signals and per-feature execution contracts |
