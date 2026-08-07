# Review Report — 018-reindex-scan-responsiveness-and-cancellation (lineage p018-opus-3)

Executor: cli-claude-code model=claude-opus-4-8 · Iterations: 1 (maxIterations=1) · Session: fanout-p018-opus-3-1781718236450-bbehhf

## 1. Executive Summary

**Verdict: PASS** (`hasAdvisories: true`)

| Metric | Value |
|--------|-------|
| Active P0 | 0 |
| Active P1 | 0 |
| Active P2 | 2 |
| Dimensions covered | 4/4 (correctness, security, traceability, maintainability) |
| Release readiness | converged |
| Stop reason | maxIterations(1) reached; full dimension coverage; no active P0/P1 after adversarial self-check |

**Scope.** The fix that makes a background `memory_index_scan` cooperative and cancellable: macrotask yields + cancel checks in the two all-rows tail loops of `runIndexScan`, a `shouldAbort` early-abort on `processBatches`, and an in-process cancel-flag mirror (`isCancelRequestedFast`). The launcher lease-heartbeat re-election is explicitly out of scope (separate supervision subsystem; documented follow-on).

**Bottom line.** The implementation is correct and faithful to the spec. The three primitives behave as specified: yields land at loop-iteration boundaries *between* self-contained better-sqlite3 transactions (never inside one), cancellation returns the `cancelledScanEnvelope` at every checkpoint, and `isCancelRequestedFast` is an allocation/IO-free `Set.has` read so a hot loop polls cancel without contending the shared connection. No P0/P1 found. Two P2 advisories: the new cancellation code paths have no direct test (only no-regression + a mock), and `requestCancel` can leak a single `cancelledJobIds` entry on a post-terminal race, mildly overstating the in-code "cannot grow without bound" claim.

## 2. Planning Trigger

PASS with active P2 advisories only → routes to **`/create:changelog`**, not remediation planning. No P0/P1 means no blocking remediation packet is required. The two P2 advisories are optional hardening; if picked up they belong in a small follow-on test/hardening packet, not a re-open of 018.

## 3. Active Finding Registry

| ID | Sev | Dim | Title | Evidence | First/Last | Status |
|----|-----|-----|-------|----------|-----------|--------|
| F001 | P2 | maintainability | New cancellation paths (`shouldAbort` early-abort + real `isCancelRequestedFast` Set) have no direct test | `batch-processor.ts:18,150`; `job-store.ts:335-338`; only mock at `tests/handler-memory-index-scan-jobs.vitest.ts:107`; zero abort/cancel hits in `tests/batch-processor.vitest.ts` | 1/1 | active |
| F002 | P2 | correctness | `requestCancel` can leak one `cancelledJobIds` entry on a post-terminal race, contradicting the no-unbounded-growth comment | `job-store.ts:69-73` (comment) vs `:317-320` (unconditional add) vs `:369,:397-399` (clears only in terminal transitions) | 1/1 | active |

Neither finding is a spec violation. F001: REQ-004 is a no-regression gate (satisfied), and the fix was deployment-verified (SC-002). F002: practical impact is one small string per racing misuse in a single-daemon process.

## 4. Remediation Workstreams

All advisory; none blocks PASS.

- **Lane A — Test the new cancellation primitives (F001).** Add a `processBatches` test asserting `shouldAbort` breaks the loop and skips remaining batches and inter-batch delays; add a `job-store` test for the `isCancelRequestedFast` Set lifecycle (added on `requestCancel`, cleared on `completeJob` and `resetRunningJobsForKind`).
- **Lane B — Make the no-growth invariant literal (F002).** Guard `requestCancel` so it only adds non-terminal job ids (or prune the entry when the durable UPDATE matches no running row), so the `job-store.ts:69-73` comment is true under the cancel-after-terminal race.

## 5. Spec Seed

If a follow-on hardening packet is opened (optional):
- Add a requirement: "The `shouldAbort` early-abort and the in-process `isCancelRequestedFast` Set lifecycle each carry a direct regression test." (covers F001)
- Add a requirement: "`requestCancel` never inserts a cancel-flag entry for an already-terminal job." (covers F002)
- No change to 018's existing spec is warranted — its scope and completion claims are accurate.

## 6. Plan Seed

1. F001 / Lane A: write `processBatches` abort test + `job-store` fast-cancel Set lifecycle test (`utils/batch-processor.ts`, `lib/ops/job-store.ts`, new/extended vitest files).
2. F002 / Lane B: add the non-terminal guard in `requestCancel` (`lib/ops/job-store.ts:315-320`).
3. Build + run the job/scan suites; confirm green.

## 7. Traceability Status

| Protocol | Level | Status | Gate | Evidence |
|----------|-------|--------|------|----------|
| spec_code | core | PASS | hard | REQ-001 (yields ≥ every 200 rows / 50 folders) → `memory-index.ts:1176-1181,1311-1316`; REQ-002 (abort + cancelled envelope) → `batch-processor.ts:150`, `memory-index.ts:1178,1206,1313`; REQ-003 (in-process flag, DB-free read) → `job-store.ts:317-320,335-338`; REQ-004 (no-regression) asserted by commit `f1dbb676f2` |
| checklist_evidence | core | N/A | hard | Level 1 packet, no checklist.md; tasks T001-T008 map to shipped code/verification |
| feature_catalog_code | overlay | N/A | advisory | No catalog claim for this incident-fix packet |
| playbook_capability | overlay | N/A | advisory | No playbook references this fix |

**Acceptance-coverage signal:** not applicable — Level 1 folder with no `checklist.md`, exempt per the AC_COVERAGE lifecycle predicate.

**Independent test re-run:** SC-001/REQ-004 ("68 tests pass") could not be re-run here — `npx`/`vitest` are sandbox-blocked. Recorded as asserted-not-independently-verified; the mock-parity change keeping the suite green is present at `tests/handler-memory-index-scan-jobs.vitest.ts:107`. No evidence contradicts the claim.

## 8. Deferred Items

- F001 (P2, test coverage of new cancellation paths) — defer to optional hardening packet.
- F002 (P2, post-terminal cancel-Set leak edge) — defer to optional hardening packet.
- Out of scope (already tracked by the packet): launcher lease-heartbeat re-election recycling the daemon mid-scan; full corpus reindex; cosmetic consistency/enrichment cleanup.

## 9. Audit Appendix

**Coverage matrix.** 4 in-scope files reviewed in full: `handlers/memory-index.ts`, `utils/batch-processor.ts`, `lib/ops/job-store.ts`, `tests/handler-memory-index-scan-jobs.vitest.ts`. All four dimensions covered in iteration 1.

**Convergence replay.** Single iteration; `newFindingsRatio=0.18` (P2-only, weight 2.0). STOP is legal: maxIterations(1) reached, dimension coverage 4/4, no active P0/P1, evidence/scope/coverage gates pass. No `blocked_stop` events. No claim-adjudication packets required (no new P0/P1).

**Confirmed-vs-inferred ledger.**
- Confirmed by reading source: `processBatches` arg order and `undefined`-delay fallback; `shouldAbort` fires only on cancel; in-order positional result tally; yields between transactions; `cancelledScanEnvelope` returned at `memory-index.ts:1178/1206/1313`; bare `isCancelRequested` import dropped from handler; `isCancelRequestedFast` routed into background dispatch (`:1444`).
- Confirmed by static grep: F001 (no abort/cancel test in `batch-processor.vitest.ts`; `isCancelRequestedFast` present only as a mock).
- Confirmed by reading source: F002 (unconditional `add` in `requestCancel`; clears only in terminal transitions).
- Inferred / not independently verified: SC-001/REQ-004 "68 tests pass" and "build exit 0" (sandbox could not run them; asserted by commit + implementation-summary).

**Most-likely-wrong claim.** F002's severity — if the runtime never issues `requestCancel` on an already-terminal job (the IPC layer may pre-filter), the leak is unreachable and F002 collapses to a documentation nit. It is recorded as P2 precisely because the impact is marginal either way.

---
_Review verdict: PASS_
