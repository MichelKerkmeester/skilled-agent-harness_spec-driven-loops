---
title: "Implementation Summary: cli-pi Fan-out Execution"
description: "Artifact-progress liveness so a non-streaming cli-pi lineage is never falsely stalled, aborted, or orphaned; a single review lineage already completes, and real writes now count as liveness for the executors that emit them."
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/011-cli-pi-fanout-execution"
    last_updated_at: "2026-08-17T04:04:40Z"
    last_updated_by: "claude"
    recent_action: "Built and tested the artifact-progress liveness fix"
    next_safe_action: "validate --strict, commit, and surface the stall_detected follow-on decision"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "decision-record.md"
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 011-cli-pi-fanout-execution |
| **Completed** | 2026-08-16 |
| **Level** | 2 |
| **Actual Effort** | ~4 hours (diagnosis-heavy) |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

**Artifact-progress liveness for the deep-loop fan-out runner.** Real writes under a lineage's artifact directory now count as a liveness signal, so a genuinely-working non-streaming executor is not judged idle. Two files changed:

- `fanout-run.cjs` — a per-lineage **artifact-progress poller** watches the lineage dir on a bounded cadence; when its on-disk output advances it calls `markLineageEvent()` (resets the stall-watchdog) and `context.reportProgress()`. Helpers: `computeLineageArtifactSignature`, `lineageArtifactProgressed`, `computeArtifactPollCadenceMs`, `startLineageArtifactProgressPoller`; stopped in the worker's `finally`.
- `fanout-pool.cjs` — `reportProgress` is threaded from the pool into the worker context; it resets the pool's stall clock (`markProgress`, closing the lag-ceiling abort path) and records `lastArtifactProgressAtMs`; the post-exit-orphan watchdog treats fresh progress within the grace window as "still working."

**Correction of record (see `decision-record.md`):** the packet's original premise — cli-pi "requeues to death" — was **overturned by reproduction**. A single cli-pi DeepSeek review lineage already completes `fulfilled`; the lag-ceiling abort path is not armed; no ledger records a real `orphan_requeued`. The genuine defect is that a working non-streaming lineage *looks* idle. At the operator's direction the full anti-requeue hardening was built, closing all three exposures (stall-watchdog false-positive, latent lag-ceiling abort, latent post-exit-orphan) with one artifact-progress signal.

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Diagnose-first. Phase 1 reproduced the run under controlled ledger + process capture, read the real event sequence, and traced the three liveness judgements in code to confirm which are armed and how each reads liveness. The fix was then written as one signal feeding all three, bounded so a lineage that writes nothing is still caught by its own timeout.

<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

- **Artifact-progress, not subprocess-alive.** A blanket "alive" allowance would let a truly-hung pi run to its full timeout with no progress; keying on real writes is more precise and still bounded.
- **One signal, three guards.** Real writes reset every liveness judgement uniformly — any incremental-writing executor benefits, streaming executors are unaffected.
- **Correct the record over defending the premise.** The reproduction disproved the "requeue loop"; the docs were amended to the evidence.

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

- **Unit + watch-it-fail** (`tests/unit/fanout-pool.vitest.ts`, +4): a silent worker that keeps reporting artifact progress is **not** lag-aborted; an exited-but-still-writing worker is **not** orphaned; both **are** still caught once progress stops (bounded controls). Stashing the pool fix makes the two positive tests fail and the controls pass. Pool suite **31/31**.
- **Non-regression**: fan-out + cli-pi stress suites **38 passed / 2 skipped**; `node --check` clean on both changed files.
- **Live**: the pre-fix diagnosis run completed `fulfilled` (all iterations). A post-fix run drove the **full loop** — all three iterations + `review-report.md` produced, zero requeue/orphan events — then the **write-containment backstop reverted 4 out-of-scope paths** pi wrote into a sibling packet dir and marked the lineage `rejected`. The fan-out drove cli-pi through the entire loop without requeue; the rejection is the 010 write boundary catching a weak-model out-of-scope write, not a fan-out liveness failure.
- **Authoritative gate**: `validate.sh 011-cli-pi-fanout-execution --strict` Errors: 0.

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

- Scope is the two fan-out loop-types (research, review). The six single-driver modes are not fan-out lineages and are out of scope.
- **This pi config emits no incremental disk writes** (it flushes every artifact at the end), so the artifact-progress poller cannot silence its advisory `stall_detected`. The warning is harmless (log-only; pi completes) but is the exact signal that invited the original hand-kill. Fully silencing it for a zero-incremental-write executor needs a subprocess-liveness heartbeat in the stall-watchdog — a separate, larger change that weakens the watchdog's "alive but wedged" meaning, deferred to an operator decision.
- No config currently arms the lag-ceiling abort, so that guard's hardening is defense-in-depth against a future config, proven by unit test rather than a live run the shipped runtime cannot trigger.
- **Research fan-out (REQ-005) live run deferred with operator approval** — it uses the identical fan-out loop path the review run exercises; review-only live proof was accepted.
- The post-fix live run showed DeepSeek writing out-of-scope into a sibling packet; the containment backstop reverted it (and, as a side effect, reverted the uncommitted docs it overlapped). Weak-model out-of-scope writes remain a live behaviour (packet 010's domain); prompt-hardening reduces but does not eliminate them.

<!-- /ANCHOR:limitations -->
