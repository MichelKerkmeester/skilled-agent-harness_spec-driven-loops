---
title: "Changelog: deep-loop-runtime Improvements [002-deep-loop-runtime/root]"
description: "Chronological changelog for the deep-loop-runtime Improvements spec root."
trigger_phrases:
  - "root changelog"
  - "packet changelog"
  - "nested changelog"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/root.md | v1.0 -->

## 2026-06-29

> Spec folder: `.opencode/specs/deep-loops/030-deep-loop-improved/002-deep-loop-runtime` (Level 2)

### Summary

Phase 003 shipped runtime hardening for unattended loops across state writes, locks, waits, JSONL repair, fanout timing, convergence signals, fallback routing and judge behavior. It added safer atomic and deferred writes, abortable sleep, lifecycle guards, lock-held merge, crash-resume wait checkpoints, richer convergence evidence and hardened LLM verdict handling.

### Before vs After

**Before**

The runtime had the core loop machinery but not the hardening needed for long unattended runs. Atomic writes did not skip unchanged content or carry integrity helpers, deferred writes were not coalesced, sleep was not abortable in chunks and lifecycle transitions had no exported taxonomy. JSONL salvage appended without a lock-held merge, lock acquisition and heartbeats had weaker single-flight and staleness behavior, fanout did not persist overrun accounting and wait checkpoints and convergence lacked the shipped delta, observation, time-decay and fuzzy-merge signals.

**After**

The runtime now has `writeStateIfChangedAtomic`, integrity hashing and stamping, a deferred atomic writer and an abortable chunked sleep primitive. Lifecycle status and stop reasons are exported with legal transitions and a paused-wait gate. JSONL salvage now merges under lock with stable dedupe, loop locks have TTL-aware heartbeat refresh and single-flight acquisition and iteration records carry byte-offset log regions. Fanout now records fixed-rate skipped slots, has an opt-in stall watchdog and persists pre-dispatch wait checkpoints for crash resume. Convergence now carries score deltas, a default-off observation threshold guard, time-decay weighting and fuzzy merge. The fallback router has typed route config and graph validation and the LLM judge now retries, times out safely, strips bad formats on retry and quarantines failed verdicts.

**Impact**

The deep-loop runtime now loses less work, writes less churn, survives more interruption cases and leaves better evidence behind when a long run misbehaves. State writes are safer, waiting can resume after a crash, lock contention is more controlled and convergence has richer signals without forcing behavior changes where the phase kept defaults off.

### Included Phases

| Phase | Status | Summary |
|---|---|---|
| `001-atomic-state-serialize-diff` | Complete | Added writeStateIfChangedAtomic(): serializes and compares against a per-path cache, skipping the fsync+rename when unchanged; writeStateAtomic retained for guaranteed writes. 4/4 hermetic unit tests pass. |
| `002-atomic-state-integrity-helpers` | Complete | Added computeIntegrityHash/stampIntegrity/verifyIntegrity (SHA-256, warn-first on mismatch) for object/registry JSON; intentionally not applied to append-only JSONL. Unit tests pass. |
| `003-atomic-state-deferred-writer` | Complete | Added createDeferredAtomicWriter(): coalesces superseded per-path content with version dirty-again reflush plus flushNow()/close() drain; JSONL stays immediate. Unit tests pass. |
| `004-abortable-chunked-sleep` | Complete | Added an abortable, chunked sleep primitive (sleep.ts): signal-cancellable wait that clears its timeout on abort, drops its listener on completion, rejects with signal.reason; chunked waits via a SLEEP_CHUNK_MS constant; AbortSignal.any composition. 5/5 unit tests pass. |
| `005-lifecycle-taxonomy-guards` | Complete | Exported LoopActiveStatus + LoopStopReason + a LEGAL_TRANSITIONS map + the one-shot resumeResolve paused-wait gate in lifecycle-taxonomy.cjs (additive, backward-compatible; no caller migration). Unit tests pass. |
| `006-jsonl-lock-held-merge` | Complete | Added mergeJsonlUnderLock to jsonl-repair.ts (reread-under-lock + set-union dedupe by stable record identity, atomic write) and wired fanout-salvage.cjs through it instead of bare append. Tests pass (19); typecheck green. Spec path for fanout-salvage corrected (scripts/, not lib/deep-loop/). |
| `007-loop-lock-heartbeat-hardening` | Complete | Hardened the loop-lock heartbeat in loop-lock.ts per the phase scope (TTL-aware heartbeat refresh + staleness/single-flight handling). 8/8 loop-lock tests pass; typecheck green. |
| `008-loop-lock-single-flight-decision` | Complete | Added single-flight acquisition decision logic to loop-lock.ts per the phase scope (collapse concurrent acquire attempts for the same lock to one in-flight request). Tests pass; typecheck green. |
| `009-byte-offset-log-regions` | Complete | Stamp logOffset/logSize/logPath on iteration records (post-dispatch-validate.ts) + optional schema fields (deep_research_auto.yaml) + dashboard surfacing in reduce-state.cjs. 23 vitest + workflows node test pass; typecheck green. Corrected two wrong spec paths (reduce-state lives in deep-loop-workflows; auto yaml in commands/deep/assets). |
| `010-fixed-rate-overrun-accounting` | Complete | Added fixed-rate overrun accounting to fanout-run.cjs (process.hrtime slot timing -> skippedCount + slotDurationMs persisted; no catch-up dispatch, per single-flight) plus optional yaml schema fields. 25 tests pass; typecheck green. |
| `011-convergence-score-delta` | Complete | Added a convergence score-delta signal to convergence.cjs declared against the shared profile schema; updated the parity goldens for the intended new behavior and added a unit test. Both pass; typecheck green. |
| `012-observation-threshold-guard` | Complete | Added a default-off observation-threshold guard to convergence (coverage-graph-signals.ts + convergence.cjs): suppresses verdicts until min-observations is met; activates via --min-observations/config/env. Parity preserved (default-off). 42 convergence tests pass; typecheck green. |
| `013-coverage-graph-time-decay` | Complete | Added time-decay weighting to coverage-graph-signals.ts so older coverage contributions decay over time; convergence parity preserved (17/17). Unit tests 21/21; typecheck + comment-hygiene + alignment-drift green. |
| `014-coverage-graph-fuzzy-merge` | Complete | Added fuzzy-merge to coverage-graph-query.ts (merge near-duplicate coverage nodes by fuzzy identity); 10 tests pass; typecheck + comment-hygiene + alignment-drift green. |
| `015-fallback-router-typed-reroute` | Complete | Typed fallback route config + routeGroupId/hopIndex trace + validateFallbackGraph() preflight in fallback-router.ts. Tests pass; typecheck + hygiene + drift green. |
| `016-llm-judge-hardening` | Complete | Hardened the LLM judge in post-dispatch-validate.ts: retry, neutral fallback card, dual timeout races, format-strip retry, quarantine. Tests pass; typecheck + hygiene + drift green. |
| `017-fanout-stall-watchdog` | Complete | Opt-in stall watchdog in fanout-pool.cjs (abort handles + lag-ceiling abort-and-requeue). Tests pass; hygiene + drift green. |
| `018-persisted-wait-crash-resume` | Complete | Persist a wait-checkpoint at the pre-dispatch boundary plus a resume-waiting crash-resume branch in fanout-run.cjs (+ optional yaml schema fields). Tests pass; hygiene + drift green. |

### Added

- No new additions recorded.

### Changed

- No broader packet changes recorded. The shipped changes are recorded in the phase rollups and leaf changelogs.

### Fixed

- No fixes recorded.

### Verification

- No explicit verification recorded.

### Files Changed

_No file-level detail recorded._

### Follow-Ups

- None recorded.
