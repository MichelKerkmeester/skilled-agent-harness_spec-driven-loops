---
title: "runtime/ Scripts"
description: "CLI entry points for deep-loop runtime operations: convergence detection, graph upsert, query, status, fan-out, and loop locking."
---

# runtime/ Scripts

---

## 1. OVERVIEW

CLI invocation surface for deep-loop runtime operations. Consumed by active `/deep:*` workflows under `.opencode/commands/deep`, including research, review, ai-council, and the four improvement commands. Each script is a thin CommonJS wrapper around the domain library at `../lib/`. The deprecated standalone context loop no longer consumes fan-out; legacy context parsing remains only where a script explicitly documents historical artifact compatibility.

## 2. SCRIPTS

| File | Purpose |
|------|---------|
| `convergence.cjs` | Computes typed graph convergence decisions for research, review, council, and legacy context artifacts |
| `query.cjs` | Queries coverage gaps, unverified claims, contradictions, council graph state, and related graph state |
| `status.cjs` | Reports session-scoped graph health and stored row counts |
| `upsert.cjs` | Stores graph nodes, edges, and iteration events for research, review, council, and legacy context artifacts |
| `fanout-run.cjs` | Runs parallel research or review lineages through headless CLI subprocesses. Deprecated context fan-out is rejected before dispatch. On `SIGINT`/`SIGTERM` it flushes a partial summary marked `stopped:true` instead of dying silently, and treats an empty / no-new-findings tick as valid convergence rather than failure |
| `fanout-pool.cjs` | Provides the concurrency-capped worker pool and status ledger for fan-out lineages. Pool events and the final summary carry read-side `lag` / `pending` / `failed` gauges plus an `oldest_pending_lag_ms` heartbeat (it does not duplicate the upstream failure classification). The lag ceiling is a true stall detector measuring time since the pool last settled while work is still queued, not queue backpressure, so it no longer false-fires on every pool wider than the concurrency cap |
| `fanout-salvage.cjs` | Recovers missing iteration artifacts from captured subprocess stdout |
| `fanout-merge.cjs` | Merges research or review fan-out lineage outputs into consolidated artifacts, applying a deterministic content-derived total-order sort (on top of id-or-title dedup and, when `SPECKIT_FANOUT_NEAR_DUP_DEDUP` is enabled, a title-aware Jaccard near-dup gate that treats same-body findings with distinct titles as distinct) so merged findings order reproducibly across runs. `--loop-type context` is accepted but currently uses research registry and state filenames, so it is not a correct context-output merger |
| `loop-lock.cjs` | CLI adapter for shared loop-lock acquire, heartbeat, stale reclaim, and release operations |

## 3. INTERNAL LIBRARY

`scripts/lib/cli-guards.cjs` - CLI-specific guards for input validation, error formatting, signal handling, and writer-lock coordination. Kept separate from top-level `lib/` because it serves CLI infrastructure, not domain logic.

## 4. USAGE

```bash
node .opencode/skills/system-deep-loop/runtime/scripts/<script-name>.cjs <args>
```

## 5. RELATED RESOURCES

- Parent SKILL.md: `.opencode/skills/system-deep-loop/runtime/SKILL.md`
- Domain library: `.opencode/skills/system-deep-loop/runtime/lib/`
- Tests: `.opencode/skills/system-deep-loop/runtime/tests/`
