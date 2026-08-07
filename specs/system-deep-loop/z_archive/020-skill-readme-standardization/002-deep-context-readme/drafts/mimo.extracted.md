---
title: "deep-context"
description: "Iterative codebase-context-gathering deep loop that runs a configurable pool of executor seats in parallel and synthesizes a reuse-first Context Report before planning or implementation."
trigger_phrases:
  - "gather context"
  - "map the code"
  - "what existing code"
  - "what can I reuse"
  - "pre-plan context"
  - "context loop"
  - "context sweep"
  - "deep context"
---

# deep-context

> Map the code you already have before you plan the code you don't.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Use it for** | Building a verified map of existing code, integration points and conventions before you plan or implement a feature |
| **Invoke with** | `/deep:start-context-loop:auto "scope"` or `/deep:start-context-loop:confirm "scope"` |
| **Works on** | Your repository or a scoped spec folder, dispatched through a configurable pool of native and optional heterogeneous CLI seats |
| **Produces** | A reuse-first Context Report under `{spec_folder}/context/` with pointers to existing code, plus a findings registry, dashboard and append-only state log |

---

## 2. OVERVIEW

### Why This Skill Exists

Before you plan or implement a feature, you need to know what existing code to reuse, where to connect and which conventions to follow. A single-pass lookup misses nuance. One model's perspective misses blind spots. Without a verified map you duplicate code that already exists, touch the wrong integration points or violate local conventions, and the blast radius across modules stays unclear until after the plan is written. That means rework.

### What It Does

`deep-context` runs an iterative, multi-model sweep of your codebase. Frontier seeding extracts anchors from your query and expands them through code-graph blast-radius analysis into ranked slices. A configurable pool of executor seats sweeps the same shared scope in parallel, then the host merges findings by content hash, boosts confidence through cross-executor agreement and surfaces contradictions as explicit edges rather than resolving them silently. Five convergence signals decide when enough context is gathered. The deliverable is a reuse-first Context Report that leads with a catalog of existing functions and utilities to extend, followed by integration points, a touch list, conventions and a pruned dependency subgraph. `/speckit:plan` and `/speckit:implement` consume this report in place of ad-hoc exploration.

---

## 3. QUICK START

**Step 1: Invoke it.** Point the loop at a scope. The `auto` variant runs without gates; the `confirm` variant pauses for operator approval at setup, each iteration and synthesis.

```bash
/deep:start-context-loop:auto "login refactor for specs/042-auth"
```

Expected output: the loop seeds frontier nodes, dispatches the parallel sweep and iterates until convergence signals pass, then writes a Context Report to `specs/042-auth/context/`.

**Step 2: Read the report.** The deliverable lives in two formats.

```bash
cat specs/042-auth/context/context-report.md
```

Expected result: a markdown report leading with a reuse catalog (existing functions to extend, cited by `file:symbol`), followed by integration points, a touch list, conventions, a pruned dependency subgraph, prior art and gaps.

**Step 3: Verify the state log before you hand off.**

```bash
cat specs/042-auth/context/deep-context-state.jsonl | tail -5
```

Expected result: the final JSONL record shows a `convergence_met` event with the composite score and per-signal breakdown.

---

## 4. HOW IT WORKS

### Frontier Seeding

The loop extracts anchors from your query: file paths, symbol names, error messages and domain terms. It expands those anchors through `code_graph_query` blast-radius into ranked SLICE nodes. When the code graph is stale or unavailable, it falls back to Glob and Grep pattern matching so the sweep never stalls.

### The Parallel By-Model Sweep

All executor seats sweep the same shared scope at once. The pool defaults to two native `@deep-context` agents. You can add heterogeneous CLI seats (MiMo, GPT, DeepSeek and others) through the `--executors` flag. Seats are barrier-joined so the groups run in true parallel. Every seat is read-only; only the host writes state.

### Agreement Merge

The host deduplicates findings by `unit_id = sha256(path:symbol:kind)`. When multiple seats report the same finding, confidence rises. When seats disagree, the contradiction is recorded as a CONTRADICTS edge in the report rather than silently dropped. This keeps the merge honest.

### Convergence Signals

Five stop signals drive the loop toward CONTINUE, STOP_ALLOWED or STOP_BLOCKED:

| Signal | Type | Weight |
|---|---|---|
| `sliceCoverage` | Blocking guard | Blocks if below threshold |
| `reuseCatalogCoverage` | Weighted | 0.30 |
| `agreementRate` | Blocking guard | Blocks if below threshold |
| `relevanceFloor` | Blocking guard | Blocks if below threshold |
| `dependencyCompleteness` | Weighted | 0.10 |

The composite of weighted signals plus the blocking guards decides whether the loop may stop. Below-gate findings route to a `lowConfidence` bucket in the report.

### The Context Report

The deliverable follows a fixed structure: reuse catalog first, then integration points, touch list, conventions, a pruned dependency subgraph, prior art and gaps. It exists in both markdown and JSON formats. The report leads with pointers (file paths and symbol names) rather than code bodies, so it stays compact and scannable.

---

## 5. INTEGRATION & NAVIGATION

### When To Use This Skill

Run `deep-context` before `/speckit:plan` or `/speckit:implement` when a feature spans multiple modules and you need a verified map of what exists. Skip it when the codebase is small enough that a quick `@context` agent lookup gives you what you need, or when you are investigating outward knowledge rather than internal code.

### Sibling Deep Loops

Four deep loops share the `deep-loop-runtime`. Each owns a different phase of the planning-to-implementation pipeline.

| Skill | Relationship |
|---|---|
| `deep-research` | Investigates outward knowledge and answers research questions. `deep-context` maps internal code; `deep-research` maps the web. |
| `deep-review` | Audits code for bugs, security gaps and quality issues after implementation. `deep-context` runs before planning; `deep-review` runs after. |
| `deep-ai-council` | Runs multi-seat planning with structured disagreement. Feed the Context Report to the council so seats start from shared facts. |

### Related Skills

| Skill | Relationship |
|---|---|
| `system-spec-kit` | Owns the spec folder where `context/` outputs land. Validation and continuity run through it. |
| `sk-code` | Handles implementation and code verification. `deep-context` maps; `sk-code` builds. |
| `@context` agent | A quick one-shot context lookup. Use it for small scopes. Use `deep-context` when you need convergence-gated, multi-model coverage. |

---

## 6. TROUBLESHOOTING

| What you see | Why | Fix |
|---|---|---|
| Loop stops too early with sparse report | The relevance gate or convergence threshold is too loose for your scope | Lower `--convergence` (default 0.10) or raise `--max-iterations` (default 8) |
| Seats produce contradictory findings | Different models interpreted the code differently | Contradictions are surfaced as CONTRADICTS edges in the report, never auto-resolved. Read them and judge which interpretation holds. |
| Frontier seeding returns few nodes | The code graph is stale or the query anchors are too narrow | The loop falls back to Glob and Grep automatically. Try broadening your scope string or rebuilding the code graph first. |
| `lowConfidence` bucket is large | Findings did not meet the relevance gate (default 0.55) | Review the bucket manually. Raise `--relevance-gate` to tighten filtering or accept the low-confidence items as leads for further investigation. |
| Heterogeneous seats are not running | The `--executors` flag was not set or the CLI seats are not configured | Pass `--executors='[{"type":"native"},{"type":"native"},{"type":"cli","executor":"mimo"}]'` and confirm the CLI binary is on PATH. |

---

## 7. FAQ

**Q: When should I run deep-context instead of a quick @context lookup?**

A: Use `@context` for small, well-scoped questions where one model's answer is enough. Use `deep-context` when a feature spans multiple modules, when you need cross-executor agreement to trust the findings, or when you want a convergence-gated report that `/speckit:plan` can consume directly.

**Q: What does the reuse-first report actually contain?**

A: A catalog of existing functions and utilities to extend (cited by `file:symbol`), integration points to touch, a conventions summary, a pruned dependency subgraph, prior art references and identified gaps. It points to code rather than pasting it.

**Q: How does convergence decide to stop?**

A: Five signals are evaluated each iteration. Three are blocking guards (sliceCoverage, agreementRate, relevanceFloor). Two are weighted (reuseCatalogCoverage at 0.30 and dependencyCompleteness at 0.10). The composite score plus the guards must all pass before the loop may stop.

**Q: Can I add a seat from a different AI provider?**

A: Yes. Pass `--executors` with a mix of `native` and `cli` entries. Each CLI seat runs its own binary (MiMo, GPT, DeepSeek). All seats sweep the same scope in parallel and the host merges the results.

**Q: Where do the outputs land?**

A: Under `{spec_folder}/context/`. The directory contains `context-report.md` and `.json`, `findings-registry.json`, `deep-context-dashboard.md`, the append-only `deep-context-state.jsonl`, `deep-context-config.json`, `deep-context-strategy.md` and `iterations/iteration-NNN.md`.

---

## 8. VERIFICATION

The skill ships a feature inventory and a manual testing playbook.

| Check | How to run it |
|---|---|
| Feature catalog | Review `feature_catalog/` for the full capability inventory |
| Manual testing playbook | Run the scenarios in `manual_testing_playbook/` to validate frontier seeding, parallel sweep, agreement merge, convergence detection and report synthesis |
| State reducer | `node scripts/reduce-state.cjs <spec_folder>/context/` refreshes the findings registry and dashboard from the JSONL state log |

---

## 9. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | Runtime instructions, the smart router and the full operating contract |
| [`references/guides/quick_reference.md`](./references/guides/quick_reference.md) | Operator cheat sheet with commands, flags and expected outputs |
| [`references/protocol/loop_protocol.md`](./references/protocol/loop_protocol.md) | Iteration lifecycle, parallel sweep mechanics and the host-writes-state contract |
| [`references/convergence/`](./references/convergence/) | Convergence hub: the five signals, recovery procedures and the coverage-graph stop path |
| [`references/state/`](./references/state/) | State format, JSONL records, output structure and the reducer registry |
| [`feature_catalog/`](./feature_catalog/) | Full feature inventory for the skill |
| [`manual_testing_playbook/`](./manual_testing_playbook/) | Operator validation scenarios across all capability areas |
