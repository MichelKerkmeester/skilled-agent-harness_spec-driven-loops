# 018 Review Synthesis

Multi-model deep-review of phase **018-reindex-scan-responsiveness-and-cancellation** (cooperative + cancellable background `memory_index_scan`): synthesized, deduped, and verified against shipped code.

**Lineages:** 10 (2 deepseek-v4-pro, 2 mimo-v2.5-pro, 2 kimi-k2.7, 4 opus-4.8) — 4 distinct models.
**Raw findings collected:** 21 across all lineages (0 P0, 1 P1-as-raised, 20 P2). After dedup → 8 distinct issues.
**Key files reviewed (real shipped code):** `mcp_server/handlers/memory-index.ts`, `mcp_server/utils/batch-processor.ts`, `mcp_server/lib/ops/job-store.ts` (paths under `.opencode/skills/system-spec-kit/`).

---

## Verdict

**PASS.**

- **Confirmed P0:** 0
- **Confirmed P1:** 0 — the single raised P1 (mimo-1, post-restart fast-cancel coupling) is a **false positive**: crash recovery resets all interrupted scan jobs to `failed` on boot, so the described state is unreachable.
- **Confirmed P2:** 5 (1 high-agreement, 4 singletons). All are advisory test-debt / cosmetic / invariant-comment drift — none affects the shipped event-loop-yield or cancellation behavior, which all 10 lineages independently verified as correct (REQ-001..003 PASS).

The core deliverable — tail-loop yields, `processBatches` early-abort, in-process cancel flag — is sound and unanimously verified. The confirmed P2s are quality hardening for a follow-on, not blockers.

---

## Confirmed Findings

| Severity | file:line | Agreement (lineages / models) | Issue | Verification evidence (what I read) | Remediation recommendation |
|---|---|---|---|---|---|
| **P2** | `lib/ops/job-store.ts:316-325, 339-341` (add) vs `:369, :397-399` (delete); invariant comment `:69-75`; leak path via `handlers/memory-index.ts:1525, 1532` | **4 / 2** (opus-1, opus-3, opus-4, opus-2) | In-process `cancelledJobIds` Set is cleared only in `completeJob` (:369) and `resetRunningJobsForKind` (:399), NOT in `setJobState`. A cancel-requested job that then fails via `setJobState(jobId,'failed')` (memory-index.ts:1525/1532, in an uncancel-checked phase that throws) leaks one job-id string permanently — contradicting the `:69-75` comment ("cannot grow without bound"). | Read job-store.ts: `requestCancel` adds at :319; only `completeJob` :369 and `resetRunningJobsForKind` :399 delete; `setJobState` :234-263 has no delete. Confirmed the failed-path dispatch at memory-index.ts:1525/1532 routes through `setJobState('failed')`. The cancel handler (memory-index-scan-jobs.ts:126-132) guards terminal/non-existent jobs, so the *only* residual leak is the genuine cancel-then-fail-while-running race. Real but tiny (~16-char id per racing failure; daemon-lifetime, restart-cleared). | In `setJobState`, after a successful UPDATE, add `if (isTerminalJobState(nextState)) cancelledJobIds.delete(jobId);`. Add a job-store unit test: a cancel-requested → failed job returns `false` from `isCancelRequestedFast`. |
| **P2** | `tests/batch-processor.vitest.ts` (no `shouldAbort` test); `tests/job-store.vitest.ts` (no fast-mirror test); `tests/handler-memory-index-scan-jobs.vitest.ts:107` (mocks `isCancelRequestedFast`) | **4 / 3** (kimi-1, kimi-2*, opus-2, opus-3) | The two new behavioral primitives ship with no direct unit coverage: `processBatches` `shouldAbort` early-abort (batch-processor.ts:150) and the real `isCancelRequestedFast`/`cancelledJobIds` Set lifecycle (job-store.ts:319/369/399). A future refactor regresses silently. | `grep -rln "shouldAbort\|isCancelRequestedFast"` over `tests/` returns only handler/launcher files — `batch-processor.vitest.ts` and `job-store.vitest.ts` have zero hits; the handler test mocks the helper as a `vi.fn`. Confirmed real Set semantics (add-on-request, delete-on-terminal) are never asserted. Advisory: REQ-004 was a no-regression gate only. | Add a `processBatches` test asserting `shouldAbort` breaks the loop and skips remaining batches + inter-batch delays. Add a `job-store` test for the `isCancelRequestedFast` Set lifecycle (populate via `requestCancel`, clear on `completeJob`/`resetRunningJobsForKind` *and* `setJobState('failed')` once the above fix lands). |
| **P2** | `handlers/memory-index.ts:1291` (dynamic) vs `:32` (static) | **1 / 1** (deepseek-1) | A dynamic `await import('../lib/storage/causal-edges.js')` re-imports the same module already statically bound as `import * as causalEdges` at :32 (used at :600-601). Redundant second reference to the same module in one function body. | Read both sites: line 32 static `causalEdges`, line 1291 dynamic destructure of `createSpecDocumentChain`/`init` from the identical module path. Genuine redundancy; purely cosmetic. | Use the static `causalEdges.createSpecDocumentChain` / `causalEdges.init` already imported at :32; drop the dynamic `await import` at :1291. |
| **P2** | `handlers/memory-index.ts:1051-1060` | **1 / 1** (deepseek-2) | A cancelled file returns `{ status: 'cancelled' }`, which is absent from the `isSuccessfulStatus` allow-list (:1051-1058), so it falls through to `results.failed++` (:1060). A cancelled file is mis-counted as failed, degrading scan-result accuracy. | Read :1051-1060: allow-list is `success/indexed/updated/unchanged/reinforced/duplicate/deferred` — `cancelled` not present → `results.failed++`. Impact low: the stale-delete guard correctly defers when `failed > 0`, so behavior is safe; only the reported count is wrong. | Add an explicit `result.status === 'cancelled'` branch before the failed increment (count it separately or skip the increment) so a cancel does not inflate `results.failed`. |
| **P2** | `handlers/memory-index.ts:1261` | **1 / 1** (deepseek-2) | `runNearDuplicateRepairBackfill()` is called with no `isCancelled` hook, unlike `runTriggerEmbeddingBackfill` at :1257 which passes `ctx.isCancelled`. Cancellation during the near-dup phase isn't observed until the next checkpoint. | Read :1257 (passes `{ isCancelled: () => ctx.isCancelled?.() ?? false }`) vs :1261 (`runNearDuplicateRepairBackfill()` — no hook). Asymmetry confirmed. Bounded: worst-case delay is the duration of one near-dup batch. | Pass `{ isCancelled: () => ctx.isCancelled?.() ?? false }` to `runNearDuplicateRepairBackfill()` for parity with the trigger-embedding phase (only if that function accepts the hook; otherwise document as bounded). |

\* kimi-2 raised the synchronous-path-no-cancel limitation, which is the same untested-cancel-surface concern adjacent to coverage; counted toward the test-debt theme as a third model only where it overlaps. The strict 4/3 count above is kimi-1 + opus-2 + opus-3 (coverage) — see Rejected section for kimi-2's distinct framing.

---

## Rejected / False-Positive / Already-Resolved

| Raised by | Severity raised | Why rejected |
|---|---|---|
| **mimo-1** (P1) — `job-store.ts:339-341`: post-restart, `isCancelRequestedFast` reads an empty Set so a durable `cancel_requested=1` job appears not-cancelled. | P1 | **FALSE POSITIVE (unreachable state).** `context-server.ts:2225` calls `resetRunningJobsForKind('index_scan', {to:'failed'})` on boot, marking every interrupted scan job terminal `failed`. Each scan creates a fresh `jobId` (memory-index.ts:1493) — a previous-process job never resumes in `running` state, so nothing ever routes a stale durable-cancel job through the fast path. The implementation-summary documents "Index scans re-run fresh." No live code path reaches the described condition. |
| **mimo-1** (P2-004) — `job-store.ts:397-399`: concluded there is **no** `cancelledJobIds` leak. | P2 (no-issue) | **INCORRECT no-issue (false negative).** mimo-1 only checked the `completeJob` (:369) and `resetRunningJobsForKind` (:399) paths and missed the `setJobState('failed')` terminal path, which is exactly where the real leak lives (see confirmed P2 #1). This "no leak" conclusion is superseded by the opus consensus. |
| **opus-2** (P2) — `job-store.ts:316-325`: `requestCancel` adds to the Set unconditionally even for terminal/non-existent jobs → growth per such call. | P2 | **MOSTLY MITIGATED — folded into confirmed P2 #1.** The cancel handler (`memory-index-scan-jobs.ts:113, 126-132`) rejects non-existent jobs (E404) and short-circuits on `isTerminalJobState` BEFORE calling `requestCancel`, so the "terminal/non-existent" entry path opus-2 describes is not reachable via the public tool. The genuine residual is the cancel-then-fail-while-running race, already captured as confirmed P2 #1. Not a separate finding. |
| **kimi-2** (P2) — `memory-index.ts:1488-1491`: synchronous (`background:false`) path wires no cancel hook. | P2 | **NOT A DEFECT (by design / out of scope).** Confirmed `runIndexScan(args, {})` on the sync branch passes no hooks. This is the spec's explicit background-only scope; the sync path is not exposed to `memory_index_scan_cancel`. Documentation nit at most; no code change warranted. |
| **mimo-1 / mimo-2** (P2) — `memory-index.ts:1176, 1311`: first yield only fires at row 200 / folder 50; rows 1-199 run synchronously; magic numbers undocumented. | P2 (advisory) | **NOT A DEFECT (intended chunking).** Confirmed `++count % 200 === 0` / `% 50 === 0` — the 200-row / 50-folder synchronous chunk is the deliberate cooperative-yield granularity (sub-second per chunk). mimo-1 itself marked it "none required." The magic-number-naming suggestion (mimo-2) is optional style polish, not a correctness issue. Left as discretionary cleanup, not tracked as a confirmed finding. |
| **mimo-1** (P2) — `batch-processor.ts:150`: `shouldAbort` checked only at batch top, not per-item. | P2 (advisory) | **NOT A DEFECT (covered by dual guard).** Confirmed `shouldAbort` at the batch boundary (:150) plus the per-file `ctx.isCancelled?.()` check inside the processor (memory-index.ts:1011) together bound abort latency to one in-flight item. mimo-1 marked it "none required." |
| **deepseek-2** (P2) — `memory-index.ts:1178, 1313`: cancel discards intermediate results. | P2 (advisory) | **BY DESIGN.** `cancelledScanEnvelope` intentionally returns a minimal cancelled status; files indexed before cancel are committed (mtimes preserved for retry), and the lease is released in the `finally`. Documentation note at most. |
| **mimo-2** (P2) — `memory-index.ts:70`: `isCancelRequestedFast` imported but not re-exported. | P2 | **NOT A DEFECT (repo convention).** Internal helpers wired into a handler are not part of that handler's export surface; consistent with existing pattern. mimo-2 itself flagged it droppable. |
| **deepseek-1** (P2) — `memory-index.ts:496`: 10s heartbeat-floor magic number undocumented. | P2 | **DISCRETIONARY (doc-only).** `Math.max(10000, leaseExpiryMs/3)` floor is real but harmless; a one-line comment is the most this warrants. Not tracked as a confirmed defect. |

---

## Remediation Outline

Seed for a remediation phase packet, ordered by severity (all P2 — no P0/P1 to remediate). Items 1-2 are the substantive ones (high cross-model agreement); 3-5 are low-cost cosmetic correctness.

1. **Fix the `cancelledJobIds` leak + correct the invariant comment** — `lib/ops/job-store.ts`. In `setJobState`, after the successful UPDATE (around :260), add `if (isTerminalJobState(nextState)) cancelledJobIds.delete(jobId);`. This closes the cancel-then-fail-while-running race so the `:69-75` "cannot grow without bound" comment becomes literally true.

2. **Add direct unit coverage for the two new primitives** — `tests/batch-processor.vitest.ts` + `tests/job-store.vitest.ts`. (a) Assert `processBatches` with `shouldAbort: () => true` breaks the loop, skipping remaining batches and their inter-batch delays. (b) Assert the `isCancelRequestedFast` lifecycle: `requestCancel` populates the Set, `isCancelRequestedFast` returns `true`, and every terminal transition (`completeJob`, `resetRunningJobsForKind`, and `setJobState('failed')` after fix #1) clears it.

3. **Count cancelled files distinctly** — `handlers/memory-index.ts:1051-1060`. Add a `result.status === 'cancelled'` branch before the `results.failed++` so a cancelled file does not inflate the failure count.

4. **De-duplicate the causal-edges import** — `handlers/memory-index.ts:1291`. Replace the dynamic `await import('../lib/storage/causal-edges.js')` with the static `causalEdges.*` already bound at :32.

5. **Pass the cancel hook to near-dup repair** — `handlers/memory-index.ts:1261`. Thread `{ isCancelled: () => ctx.isCancelled?.() ?? false }` into `runNearDuplicateRepairBackfill()` for parity with the trigger-embedding phase at :1257 (verify the callee accepts it; otherwise document the bounded delay).

**Out of scope for this packet (already documented follow-ons):** the launcher lease-heartbeat re-election that recycles the daemon mid-scan (the phase's own open limitation) and the synchronous-path cancellability (kimi-2 — by design).
