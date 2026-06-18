# Review Report — reindex-scan responsiveness and cancellation (lineage p018-opus-4)

Session: `fanout-p018-opus-4-1781718236450-bbehhf` | Executor: cli-claude-code (claude-opus-4-8)
Target: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/018-reindex-scan-responsiveness-and-cancellation`
Stop reason: maxIterations (1) | Iterations: 1 | Dimensions: 4/4 | **Verdict: PASS** | Release-readiness: converged

## 1. Executive Summary

The shipped fix makes the background `memory_index_scan` cooperative and genuinely cancellable, and it is **correct, transaction-safe, and correctly scoped**. The three changes — `setImmediate` macrotask yields plus cancel checks in the two all-rows tail loops (`memory-index.ts`), a `shouldAbort` early-abort on `processBatches` (`batch-processor.ts`), and an in-process `cancelledJobIds` mirror with `isCancelRequestedFast` (`job-store.ts`) — each trace cleanly to REQ-001..REQ-004 and to the diagnosed root cause (awaits that only drained microtasks). All four declared file changes are present and match the spec scope.

One non-blocking advisory (P2-001): the in-process cancel Set is not cleared on the `setJobState(jobId,'failed')` terminal transition, which contradicts the Set's own in-code invariant comment and leaks a job id on the narrow cancel-then-fail path. No P0 or P1 findings. Two correctness hypotheses that could have been P1 — a lease leak on the cancel return path, and other unyielded all-rows tail phases — were opened against the cited code and refuted.

Verdict: **PASS** (with advisories). Severity counts P0=0, P1=0, P2=1.

## 2. Planning Trigger

A planning follow-on is **not required** to ship this packet. One advisory cleanup item is worth a one-line follow-on commit (see Remediation Workstreams / Plan Seed). The already-documented launcher lease-heartbeat re-election follow-on (out of scope here) remains the substantive next packet, unchanged by this review.

## 3. Active Finding Registry

| ID | Sev | Category | File:line | Title | riskScore | Status |
|----|-----|----------|-----------|-------|-----------|--------|
| P2-001 | P2 | correctness | `lib/ops/job-store.ts:72` | In-process `cancelledJobIds` Set not cleared on `setJobState 'failed'` terminal transition | 0.15 | active |

Detail — P2-001: The Set comment (job-store.ts:72-74) asserts entries are cleared at every terminal state. Only `completeJob` (369) and `resetRunningJobsForKind` (397-400) delete; `setJobState` (234-263) does not. Background dispatch routes failures through `setJobState(jobId,'failed')` (memory-index.ts:1525,1532), so a cancel-requested job that subsequently fails leaks its id permanently. Reachability is narrow (cancel must arrive during an uncancel-checked phase that then throws) and magnitude is tiny (~16-char id, infrequent jobs), so it is advisory rather than blocking — but it is a real invariant violation and slow unbounded-growth path.

## 4. Remediation Workstreams

1. **Cancel-Set cleanup completeness (P2-001, advisory).** Clear `cancelledJobIds` on every terminal transition. Cleanest: add `if (isTerminalJobState(nextState)) cancelledJobIds.delete(jobId);` inside `setJobState` after a successful UPDATE, so all terminal paths (including `failed`) honor the documented invariant. Alternatively delete in the two dispatcher `setJobState(jobId,'failed')` branches. One-line change, no test-surface risk; add a job-store unit assertion that a cancel-requested → failed job is absent from the fast checker after transition.

No P0/P1 workstreams.

## 5. Spec Seed

For a follow-on packet (advisory):

- Title: cancel-Set terminal cleanup parity
- Problem: the in-process `cancelledJobIds` mirror is cleared on `complete`/`cancelled`/crash-reset but not on `failed` via `setJobState`, violating its own bounded-growth invariant.
- Requirement: every terminal job transition clears the in-process cancel mirror; `isCancelRequestedFast` returns false for any terminal job id.
- Acceptance: unit test — request cancel, drive job to `failed` via `setJobState`, assert `isCancelRequestedFast(jobId) === false`.

## 6. Plan Seed

- Single-file edit in `lib/ops/job-store.ts`: centralize cancel-mirror cleanup in `setJobState` gated on `isTerminalJobState(nextState)`; optionally remove the now-redundant `delete` in `completeJob` or keep it (idempotent).
- Add one assertion to `tests/job-store.vitest.ts`.
- Rollback: revert the single hunk; behavior returns to current.
- No new packages, no migration.

## 7. Traceability Status

| Protocol | Status | Note |
|----------|--------|------|
| spec_code (REQ-001..004 ↔ code) | COVERED | All four REQs MET in source; evidence in iteration-001 §Spec-alignment |
| checklist_evidence (T001-T008) | PARTIAL | T001-T005 (code/mock) present and verified by read; T006 (build), T007 (68-test suite / SC-001 / REQ-004), T008 (deploy behavior / SC-002) reviewer-UNVERIFIED — sandbox blocked `vitest`, `npx`, `validate.sh`, and `npm build` (each required approval). Implementation-summary claims them PASS/CONFIRMED; not refuted by this review. |
| Resource Map Coverage | N/A | `resource-map.md` absent in target (`resource_map_present:false`); coverage gate skipped per contract |
| AC_COVERAGE | N/A | Level 1 folder; advisory INFO rule, lifecycle predicate not active |

## 8. Deferred Items

- **Launcher lease-heartbeat / daemon re-election** — explicitly out of scope (spec §3 Out of Scope; implementation-summary Known Limitations). A heavy scan still gets the daemon recycled mid-run and marked `failed`; the index is functionally healthy without completion. Remains the substantive open follow-on. Not a finding against this packet.
- **Warmup synchronicity** — BM25 + embedding-model load on a cold daemon is synchronous and outside the scan loop; noted in implementation-summary as the most likely heartbeat-trip moment. Outside this packet's scope; no action proposed here.
- **Build/test/deploy re-verification** — re-run the touched-surface suites and `validate.sh --strict` in an environment where execution is permitted to confirm SC-001/REQ-004 (this lineage could not execute them).

## 9. Audit Appendix

- Files read in full or in relevant regions: `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md`; `mcp_server/handlers/memory-index.ts` (479-532, 657-783, 980-1340, 1424-1554), `mcp_server/utils/batch-processor.ts` (full), `mcp_server/lib/ops/job-store.ts` (full), `mcp_server/tests/handler-memory-index-scan-jobs.vitest.ts` (mock block).
- Hypotheses tested and refuted: (a) cancel returns leak the scan lease — refuted, `try`(505)/`finally`(1472-1483) always releases via idempotent `releaseScanLease`; (b) other tail phases are unyielded all-rows sweeps — refuted, `orphan-sweep`/`enrichment-repair`/`near-dup-repair` are each bounded by `limit`/cursor (memory-index.ts:670,716,743).
- Adversarial replay: 0 P0s raised → none to replay. The single P2 confirmed against actual delete sites and the `setJobState` body, not inferred from the comment.
- Confirmed vs inferred: REQ-001..004 code presence and yield/abort/lease behavior are CONFIRMED by file:line. The 68-test-pass / build-clean / deploy-responsive claims are INFERRED from implementation-summary and were NOT executed by this lineage (sandbox-blocked) — recorded as unverified, not refuted.
- Most-likely-wrong claim: P2-001's reachability characterization ("narrow") — if a real deployment frequently cancels scans that then fail during the uncancel-checked tail phases, the leak rate is higher than implied, though magnitude per entry stays trivial.

---

Review verdict: PASS
