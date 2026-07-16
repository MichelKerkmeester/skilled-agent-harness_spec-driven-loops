---
title: "Deep Review Report: 030 Residual Design Units (shipped code)"
description: "10-iteration deep review (gpt-5.5-fast xhigh) of the 030 shipped code (tri-138, tri-109, Unit B). Verdict CONDITIONAL: 4 confirmed-real P1, 0 P0, privacy invariant intact. Round-2 refuted 4 hygiene false-positives and downgraded 2 to P2."
trigger_phrases:
  - "030 deep review report"
  - "030 review findings"
  - "tri-109 background scan review"
importance_tier: "important"
contextType: "review"
---
# Deep Review Report — 030 Residual Design Units (shipped code)

## 1. Summary

Ten review iterations ran via cli-opencode `openai/gpt-5.5-fast` at `xhigh`, one narrow slice each across the four dimensions, over this session's shipped + fixed code (tri-138 health budget, tri-109 background index scan, Unit B synthetic replay corpus). Each finding was then adversarially re-verified against current source. The code is sound overall: no blockers, the privacy invariant holds, and `data.routing` is preserved. Four real required-fixes remain, all narrow, two of them direct misses from the tri-109 tool-count change.

- **Verdict: CONDITIONAL** (hasAdvisories=true)
- **Findings:** P0=0, confirmed P1=4, downgraded-to-P2=2, test-strengthening=2, refuted=4, pre-existing/out-of-scope=2
- **Iterations:** 10 of 10 (all dimensions covered; 2 dimensions clean)

## 2. Verdict and Severity

| Severity | Count | Notes |
|----------|-------|-------|
| P0 | 0 | No data-loss, no security breach, no broken contract |
| P1 (confirmed) | 4 | A now-failing count guard, a layer-map drift, a status-label bug, a privacy-guard hardening |
| P2 (after round-2 downgrade) | 4 | 2 job-store defense-in-depth + 2 test-strengthening |
| Refuted | 4 | "feature-catalog" comment-hygiene false-positives |
| Pre-existing / out-of-scope | 2 | A pre-existing `Fix F21` comment, the un-rebuilt dist |

## 3. Confirmed P1 Findings (remediation recommended)

1. **Stale tool-count guard now fails (correctness).** `tests/review-fixes.vitest.ts:117` asserts `TOOL_DEFINITIONS.length === 37`. tri-109 raised the surface to 39, so this packet-013 test now fails. It was outside the targeted suite run, so the break went unseen. Fix: update 37 -> 39. Confirmed: file present, assertion present, count is 39.
2. **Scan-job tools missing from the layer map (traceability/correctness).** `memory_index_scan_status` and `memory_index_scan_cancel` are registered in schemas, handlers, dispatch, and the allowlist, but were not added to `lib/architecture/layer-definitions.ts` L7. They therefore fall to the default 1000-token budget and carry no `[L7:Maintenance]` description prefix. Fix: add both to the L7 `tools` array. Confirmed by source grep.
3. **Late cancel mislabels a completed scan (correctness, 2 seats).** In `handlers/memory-index.ts` the background dispatcher computes the terminal state as `isCancelRequested(jobId) ? 'cancelled' : 'complete'` after `runIndexScan` returns. A cancel that arrives after the scan has fully finished marks a completed job `cancelled`. No data is lost (the scan ran), but the status misrepresents the outcome. Fix: mark `cancelled` only when `runIndexScan` actually short-circuited on cancellation (detect from its returned envelope), not from a late flag check.
4. **Privacy guard does not assert the classKey shape (security hardening, 2 seats).** `assertCorpusPrivacy` validates `syntheticQuery` against the static pool and rejects a 16-hex fingerprint in `classKey`, but does not assert `classKey` matches `class:<intent>:<resultCountClass>`. The current builder can only ever produce that shape (closed-vocab values), so there is no live leak — but a future regression that put arbitrary non-hex text into `classKey` would pass. Fix: add a `classKey` format assertion to the fail-closed guard. Defense-in-depth on the make-or-break invariant.

## 4. Downgraded to P2 (real as defense-in-depth, not current bugs)

5. **`completeJob` optimistic concurrency (`lib/ops/job-store.ts`).** Uses `WHERE id = ?` after a read-then-check, a theoretical TOCTOU. Refuted as a live bug: better-sqlite3 is synchronous and only the single per-job runner writes state, so no concurrent state-writer path exists. Optional hardening: `WHERE id = ? AND state = ?` optimistic predicate.
6. **`resetRunningJobsForKind` accepts any target state.** The signature allows any `JobLifecycleState` and bypasses `ALLOWED_TRANSITIONS`. Refuted as a live bug: the only caller passes `'failed'`, a valid transition. Optional hardening: narrow the `to` type to terminal states or validate per row.

## 5. Test-strengthening (valid)

7. **Cancel test does not prove indexing was prevented (`handler-memory-index-scan-jobs.vitest.ts`).** It asserts the job ends `cancelled` but not that work was actually skipped. Strengthen with an assertion that the index write did not occur.
8. **SQLITE_BUSY test does not exercise the UPDATE retry path (`job-store.vitest.ts`, P2).** Add a case that forces busy on an UPDATE, not only an INSERT.

## 6. Refuted (round-2 false-positives)

- **4x "feature-catalog label in comments" (maintainability).** `// Feature catalog: <description> (<tool>)` is an established durable-descriptive convention across the codebase. It contains no finding id, spec path, or packet/ADR/REQ/CHK number, so it does not violate comment hygiene. Over-matched by the maintainability slice.

## 7. Pre-existing / out-of-scope

- **`// Fix F21 ...` comment (`memory-crud-health.ts:337`).** A genuine finding-id label, but pre-existing code outside this session's changed lines. Repo tech debt, not introduced here.
- **Un-rebuilt dist (`dist/feedback/shadow-evaluation-runtime.js`).** `dist/` is not git-tracked (build output). The running daemon serves stale compiled code until a rebuild + transparent recycle — the already-tracked deployment step, not a committed-code defect.

## 8. Coverage and Convergence

All four dimensions reviewed across 10 slices. correctness (job-store, dispatcher, busy-retry, integration), security/privacy (corpus guard, scan-jobs), traceability (tests, registration), maintainability (cross-cutting) each had at least one dedicated pass; privacy and the cancel race each drew two independent passes (corroboration). Two slices returned clean (busy-retry, health/routing). The privacy invariant — no raw query text storable or reconstructable — was specifically probed and holds.

## 9. Remediation Plan

Recommended fix order (all small, scoped to this session's code):
1. `tests/review-fixes.vitest.ts:117` 37 -> 39 (unbreaks a failing test).
2. `lib/architecture/layer-definitions.ts` add the two scan-job tools to L7.
3. `handlers/memory-index.ts` cancel-vs-complete: derive the terminal state from the run outcome, not a late flag.
4. `lib/feedback/shadow-replay-corpus.ts` add a `classKey` format assertion to `assertCorpusPrivacy`.
Optional: P2 hardening (5, 6) and test-strengthening (7, 8).

**Remediation status (post-review):** all four confirmed P1 were fixed and verified in commit `1e08816bf1` — the count guard updated to 39 (previously failing, now passes), the scan-job tools added to the L7 layer map, the dispatcher's terminal state derived from the run outcome instead of a late cancel flag, and a canonical `classKey` assertion added to the privacy guard with a new test. typecheck clean; 446 tests green across the affected suites. The two P2 job-store hardenings, the two test-strengthening items, and a stale finding-id comment were then closed in `2b38805095`, plus four more stale tool-count guards (CLI list-tools) in `cb37f58a2f`. The pre-existing vector-shard double-schedule timeout — initially out of scope — was root-caused and fixed in `d399a6745b` (a fresh-context Opus debug pass): the repair completion read now re-asserts the canonical `vec_<dim>` table so it survives a concurrent canonical-table slim, with the 8-test resilience suite now 8/8. Every deep-review finding is closed. The un-rebuilt dist is the standing deploy step (rebuild + transparent recycle); two other pre-existing test reds (`embedder-reindex` resume-offset, `vector-index-impl` no-API-key timeouts) were proven independent of this work.
