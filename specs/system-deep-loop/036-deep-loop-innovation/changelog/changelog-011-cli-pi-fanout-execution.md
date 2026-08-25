---
title: "Changelog: cli-pi Fan-out Execution [011-cli-pi-fanout-execution]"
description: "Artifact-progress liveness in the deep-loop fan-out runner so non-streaming cli-pi lineages are not falsely stalled, lag-aborted, or orphaned; diagnosis overturned the requeue-loop premise and hardened all three liveness guards."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-08-16

> Spec folder: `specs/system-deep-loop/036-deep-loop-innovation/011-cli-pi-fanout-execution` (Level 2)
> Parent packet: `specs/system-deep-loop/036-deep-loop-innovation`

### Summary

Hardened the deep-loop fan-out runner for non-streaming cli-pi executors. Controlled reproduction overturned the original "orphan-requeue loop" premise — a cli-pi DeepSeek review lineage already completes `fulfilled` — and identified the real defect: print-mode pi emits no incremental stdout, so liveness judgements treat a working lineage as idle. Artifact-progress liveness now counts real writes under the lineage directory as a live signal feeding the stall watchdog, lag-ceiling abort path, and post-exit-orphan watchdog. A live review run drove the full loop with zero requeue/orphan events; streaming executors were regression-tested clean.

### What Changed

- Added an artifact-progress poller in `fanout-run.cjs` that watches the lineage artifact directory, resets the stall watchdog via `markLineageEvent()`, and calls `context.reportProgress()` on real writes.
- Threaded `reportProgress` through `fanout-pool.cjs` to reset the pool stall clock (`markProgress`), record `lastArtifactProgressAtMs`, and treat fresh progress within the grace window as "still working" for the post-exit-orphan watchdog.
- Recorded the diagnose-first finding in `decision-record.md`: artifact-progress over subprocess-alive allowance or `--mode json` streaming dispatch.
- Added unit coverage in `fanout-pool.vitest.ts` (+4): silent workers reporting artifact progress are not lag-aborted or orphaned; workers whose progress stops are still caught.
- Proved live acceptance on cli-pi DeepSeek review (pre-fix `fulfilled`; post-fix all iterations + `review-report.md`, zero requeue/orphan events). The write-containment backstop later rejected an out-of-scope write — a 010 boundary event, not a fan-out liveness failure.
- Deferred live cli-pi **research** fan-out (REQ-005) with operator approval; research uses the identical fan-out loop path exercised by review.

### Status

Complete. P0 requirements satisfied; research live run deferred by approval. Advisory `stall_detected` may still log for pi configs that buffer all disk writes to the end.
