---
title: "Deep-Review Report: Background-enrichment concurrency-cap fix (010)"
description: "Three-iteration deep-review (opus-4.8 via claude2) of the enrichment scheduler cap fix. Verdict: PASS with P2 advisories — no P0/P1; converged at iteration 3."
trigger_phrases:
  - "010 deep review report"
  - "enrichment cap review verdict"
importance_tier: "normal"
contextType: "review"
---
<!-- Deep-review synthesis — 9-section contract -->
# Deep-Review Report: Background-enrichment concurrency-cap fix (010)

## 1. Executive Summary

**Verdict: PASS (hasAdvisories = true).** No P0, no P1 across 3 iterations. Converged via early-stop (3 consecutive iterations with no new P0/P1) on a 26-line, 2-file diff.

- **Counts:** P0 = 0 · P1 = 0 · P2 = 5 (deduplicated; 1 fix-introduced, 4 pre-existing/conditional/tuning).
- **Reviewer:** `cli-claude-code` · `claude-opus-4-8` · account2 · `review` agent · high effort · single-executor inline, fresh context per iteration.
- **Core finding:** the cap fix (`scheduleBackgroundEnrichment` reserve-slot-at-schedule-time + `setImmediate` re-arm) is correct. The invariant `0 ≤ activeBackgroundEnrichments ≤ MAX` was independently re-derived and proven; the gate is atomic (no `await` between read and increment → no TOCTOU); there is no re-entrancy; the compiled dist mirrors the source (fix is live, not stranded). The scan-loop yield is correct and benign.

## 2. Planning Trigger

PASS with advisories → **no remediation plan required.** Per the post-implementation-deep-review rule: move on; queue the P2 backlog. One trivial advisory (the over-claiming comment, P2-D-comment) was remediated inline during synthesis. The remaining P2s are queued as Deferred Items (§8); none gates completion.

## 3. Active Finding Registry (deduplicated, with evidence)

| ID | Sev | Status | Location | Finding | Evidence |
|----|-----|--------|----------|---------|----------|
| F-001 | P2 | Open (tuning) | `memory-save.ts:2961` | Residual `accept()` latency (bounded, not the wedge) if `runPostInsertEnrichment` does heavy *synchronous* CPU work | iter1; depends on the enrichment body, outside this diff |
| F-002 | P2 | Open (pre-existing) | `memory-save.ts:2944` | Bare `setImmediate` not `unref`'d / not in the timer registry | iter1; original used raw `setImmediate` too; self-terminating at shutdown |
| F-003 | P2 | Open (fix-introduced) | `memory-save.ts:2921`, payload `:2946-2972` | Queue bounds concurrency but not size → `parsed` payloads retained for the serialized drain (~55-220 MB transient on an 11k-file scan); a retention-**duration** delta (not a peak regression — pre-fix peak was higher) | iter2 F1 (HIGH exists / MED harm); confirmed iter3 |
| F-004 | P2 | **Remediated (comment) / Open (re-resolve)** | `memory-save.ts:2949-2962` | `db` handle reused after the `await`; a mid-run recycle throws → row falls back to backfill (fail-safe). The doc comment over-claimed run-time re-resolution | iter2 F2; **comment tightened this session**; optional: re-resolve `db` after the await |
| F-005 | P2 | Open (conditional) | `lib/ipc/launcher-idle-timeout.ts:98-123` | Idle-monitor ignores enrichment depth → a short idle-timeout can shut the daemon mid-drain; late rows enrich via backfill, not the live queue | iter2 F3 (MED, conditional on idle timeout enabled+short) |

All P0/P1 candidates raised during the adversarial Hunter/Skeptic/Referee pass (TOCTOU, re-arm overflow, re-entrancy, stale dist, void-rejection) were dropped with evidence (see §9).

## 4. Remediation Workstreams

- **W-0 (done):** F-004 comment accuracy — tightened to state the re-resolve covers a pre-run recycle and a mid-run recycle falls back to backfill. No behavior change (comment stripped by tsc; dist unaffected).
- **W-1 (deferred, optional):** F-003 queue payload size — store only `memoryId` in the queue and re-derive `parsed` at run time, or bound queue length and lean on the pending-marker backfill. Trade memory-retention for per-run re-read I/O; evaluate before adopting.
- **W-2 (deferred, optional):** F-005 idle-monitor — treat a non-empty queue / `active>0` as activity, or document the live tail as best-effort. Cross-cutting (separate subsystem).
- **W-3 (no action):** F-001, F-002 — tuning / pre-existing; no change warranted.

## 5. Spec Seed

No new spec required. If W-1 is adopted, it is a small amendment to this packet's scope (queue-entry payload), not a new feature. Suggested spec line: "The enrichment queue retains only scalar identifiers; `parsed` is re-derived at run time to bound heap retention during large scans."

## 6. Plan Seed

If W-1/W-2 are pursued: (1) change the queue element type to `{memoryId}` and re-read+parse the row's `file_path` inside `run`; (2) add a deterministic unit test for the bounded scheduler (extract a `createBoundedScheduler(max)` helper); (3) for W-2, thread `activeBackgroundEnrichments > 0 || queue.length > 0` into the idle-monitor's activity check. Each is independently revertible.

## 7. Traceability Status

| Requirement | Covered | Evidence |
|-------------|---------|----------|
| REQ-001 cap holds under burst | ✅ | iter1+iter3 invariant proof; synchronous atomic gate |
| REQ-002 queued work yields | ✅ | `setImmediate` re-arm → next check phase (iter1) |
| REQ-003 no enrichment regression | ✅ | diff touches only scheduling; 14/14 regression green |
| REQ-004 scan yields periodically | ✅ | `% 50` deterministic yield (iter2 magic-50 analysis) |
| REQ-005 clean typecheck/build | ✅ | tsc 0 errors; dist mirrors source (iter3) |

## 8. Deferred Items

- F-001 (residual sync-CPU latency) — tuning; revisit only if `accept()` latency is observed under load.
- F-002 (bare `setImmediate` unref) — pre-existing; optional clean-shutdown symmetry.
- F-003 (queue payload retention duration) — W-1; adopt if large-scan RSS becomes a concern.
- F-004 re-resolve-after-await — comment fixed; the optional code hardening deferred (current behavior is fail-safe).
- F-005 (idle-monitor) — W-2; conditional on idle-timeout config.

## 9. Audit Appendix (convergence data)

| Iter | Worker | New P0 | New P1 | New P2 | Note |
|------|--------|--------|--------|--------|------|
| 1 | opus-4.8 | 0 | 0 | 2 | Core dimensions sound (accounting, yielding, regression, error paths) |
| 2 | opus-4.8 | 0 | 0 | 3 | New angles: queue retention, stale-handle, idle-monitor |
| 3 | opus-4.8 | 0 | 0 | 0 | Completeness + convergence: re-derived invariant, atomic gate, no re-entrancy, dist mirrors source |

- **Convergence rule:** early-stop after 3 consecutive iterations with no new P0/P1 → met at iter 3. Max was 10.
- **Iteration records:** `review/iterations/iteration-00{1,2,3}.md`. Prompts: `review/prompts/`. Config: `review/deep-review-config.json`.
- **Independent corroboration:** the loop-manager re-traced the slot accounting (burst of 6, MAX=4) and the gate atomicity independently; both match the workers' findings.
- **Honesty caveat (from iter3):** workers reviewed the applied/built code (the `/tmp` diff text was outside their sandbox) — for a convergence pass the built artifact is the more load-bearing evidence.
