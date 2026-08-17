---
title: "Decision Record: cli-pi Fan-out Execution"
description: "Diagnosis and fix for cli-pi (non-streaming) fan-out liveness: a single lineage already completes; the fix makes real artifact writes count as liveness so a working non-streaming lineage is never falsely stalled, aborted, or orphaned."
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/011-cli-pi-fanout-execution"
    last_updated_at: "2026-08-17T04:33:13Z"
    last_updated_by: "claude"
    recent_action: "Corrected the diagnosis from live reproduction; recorded the artifact-progress fix and the live findings"
    next_safe_action: "validate --strict and mark Complete with the honest caveats"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
# Decision Record: cli-pi Fan-out Execution

## Context

The packet was scoped from an earlier live test that appeared to show a cli-pi review lineage requeuing to death. Controlled reproduction **overturned that premise**. This record states what the ledger actually shows, why, the fix that was built, and the live findings — including where the fix does and does not change behaviour.

## Diagnosis (evidence)

A single cli-pi DeepSeek review lineage, run with the documented config (`kind: cli-pi`, `deepseek-v4-flash` → opencode-go, `iterations: 3`, `concurrency: 1`), **completed successfully**: `status: fulfilled`, `exitCode: 0`, ~10.9 min, all iterations, `run_id 1786892651162-qypn2j`. Ledger: `started → progress×N → completed`, **zero `orphan_requeued` / `lag_ceiling_abort`**. One advisory `stall_detected` at the 5-minute mark did **not** abort. No persisted ledger anywhere records a real `orphan_requeued`.

## Root cause (why there is no active requeue)

1. **The lag-ceiling abort path is not armed.** `fanout-run.cjs` never forwards `lagCeilingAction` to the pool, so `shouldAbortStalledLineages === false`. A fan-out cannot lag-abort/requeue a slow lineage in the shipped runtime.
2. **The post-exit-orphan path needs a real subprocess exit.** A live pi never trips it.
3. **`stall_detected` is advisory-only** — it logs, never aborts. It fires for *any* non-streaming executor because the stall-watchdog's liveness is fed solely by streamed stdout (`markLineageEvent` = `onOutput` = a stdout `data` event), which pi's `-p` print mode never emits.

The real defect is that a working non-streaming lineage *looks* idle — a misleading `stall_detected` (which invited the original hand-kill) plus exposure to two *latent* requeue paths (the lag-ceiling abort if a config arms it; a post-exit-orphan false-positive if a print-mode CLI hands work to a child that keeps writing after the tracked process exits).

## Decision

**Make real artifact writes count as liveness** (operator elected the full anti-requeue hardening). One signal closes all three exposures:

- A per-lineage **artifact-progress poller** (`fanout-run.cjs`) watches the lineage dir; when its output advances it calls `markLineageEvent()` (resets the stall-watchdog) and `context.reportProgress()`.
- `reportProgress` is threaded from the pool into the worker context; it resets the pool's stall clock (`markProgress`, closing the lag-ceiling path) and records `lastArtifactProgressAtMs`; the post-exit-orphan watchdog treats fresh progress within the grace window as "still working."

**Bounded, not a disable:** a lineage that writes nothing *and* streams nothing still trips the guards; the ultimate bound is the executor's own timeout (`SIGTERM`).

Rejected: a blanket subprocess-alive allowance (less precise — a truly-hung pi would run to full timeout); `--mode json` streaming dispatch (larger command-builder change, unnecessary).

## Proof

- **Unit + watch-it-fail** (`tests/unit/fanout-pool.vitest.ts`, +4): a silent worker that keeps reporting progress is **not** lag-aborted; an exited-but-still-writing worker is **not** orphaned; both **are** still caught once progress stops (bounded). Stashing the pool fix makes the two positive tests fail — proving they exercise the fix. Pool suite **31/31**; fan-out + cli-pi stress **38 passed / 2 skipped**.
- **Live**: the pre-fix diagnosis run completed `fulfilled`. A post-fix run drove the **full loop** — all three iterations + `review-report.md` produced, zero requeue/orphan events — then the **write-containment backstop reverted 4 out-of-scope paths** pi wrote into a sibling packet dir and marked the lineage `rejected`. That is the 010 write boundary doing its job on a weak-model out-of-scope write, not a fan-out liveness failure.

## Confirmed limitations

- **This pi config emits no incremental disk writes** — it flushes every artifact at the end. At the 5-min mark the lineage dir held only `invocation-metadata.json`, so the poller has nothing to observe and the advisory `stall_detected` still fires exactly as pre-fix. pi completes regardless (log-only; abort not armed). The artifact-progress signal helps executors that write incrementally; for a zero-incremental-write executor it does not silence `stall_detected`. Fully silencing that would require a subprocess-liveness heartbeat in the stall-watchdog — a separate change that weakens the watchdog's "alive but wedged" advisory meaning, deferred to an operator decision.
- pi via opencode-go DeepSeek is slow (~11–14 min for a 3-iteration review). The fix makes a non-streaming lineage legible and safe, not fast.
