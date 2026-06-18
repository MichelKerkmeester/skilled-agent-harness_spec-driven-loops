# Iteration 001 — reindex-scan responsiveness and cancellation

Lineage: `p018-opus-4` | Executor: cli-claude-code (claude-opus-4-8) | Dimensions: correctness + security + spec-alignment + completeness (single fan-out pass)

## Scope reviewed

The three source changes plus the test-mock parity that make the background `memory_index_scan` cooperative and cancellable:

- `handlers/memory-index.ts`: metadata-edge tail loop yield+cancel (1166-1204), causal-chain folder loop yield+cancel (1307-1331), `processBatches` `shouldAbort` wiring (1034), background dispatch `isCancelled: () => isCancelRequestedFast(jobId)` (1506), lease lifecycle (479-484, 505, 1472-1483).
- `utils/batch-processor.ts`: `shouldAbort` on `RetryOptions` checked at loop top (11-19, 150).
- `lib/ops/job-store.ts`: `cancelledJobIds` Set (75), `requestCancel` add-first (316-325), `isCancelRequestedFast` (339-341), terminal cleanup in `completeJob` (369) and `resetRunningJobsForKind` (397-400).
- `tests/handler-memory-index-scan-jobs.vitest.ts`: `isCancelRequestedFast` mock (107).

## Spec-alignment / traceability (spec_code)

| Req | Acceptance | Evidence | Status |
|-----|-----------|----------|--------|
| REQ-001 | macrotask yield ≥ every ~200 rows (metadata-edge) and ~50 folders (causal-chain) | `memory-index.ts:1176` `if (++promoterYieldCount % 200 === 0)` → `setImmediate` at 1180; `1311` `if (++chainYieldCount % 50 === 0)` → `setImmediate` at 1315 | MET |
| REQ-002 | `processBatches` breaks on `shouldAbort`; tail loops return cancelled envelope on `isCancelled` | `batch-processor.ts:150` `if (retryOptions.shouldAbort?.()) break;`; `memory-index.ts:1177-1178`, `1312-1313` return `cancelledScanEnvelope` | MET |
| REQ-003 | `requestCancel` sets in-process flag; `isCancelRequestedFast` reads it with no SQLite query | `job-store.ts:319` `cancelledJobIds.add(jobId)` before DB write; `339-341` Set-only read | MET |
| REQ-004 | Job/scan test surface unregressed; mock gains `isCancelRequestedFast` | mock present at `handler-memory-index-scan-jobs.vitest.ts:107` | MET (code); suite execution reviewer-unverified — see Verification |

The `setImmediate`-based yield is the correct fix: the plan diagnosed that the prior `await`s only drained microtasks (synchronous better-sqlite3 + cache-served embeddings); `setImmediate` is a genuine macrotask boundary that lets queued IPC callbacks run. Confirmed at `memory-index.ts:1180` and `1315`, and the precedent `processBatches` already uses the same primitive (`batch-processor.ts:61-63`).

## Correctness

- **Yield placement is transaction-safe (risk mitigation honored).** Both yields sit at the top of a loop iteration, before the self-contained per-row/per-folder DB work (`promoteMetadataEdges` at 1186; `selectDocIds.all` + `createSpecDocumentChain` at 1317/1327). No yield lands inside an open better-sqlite3 transaction, so atomicity on the shared connection holds. Matches the spec §6 risk mitigation. [SOURCE: memory-index.ts:1176-1189, 1311-1327]
- **`shouldAbort` granularity is correct.** Checked at the top of the batch loop, so a cancelled run stops before the next batch and before the inter-batch pacing delay (`batch-processor.ts:150` precedes the `setTimeout` at 172-174). Per-file `ctx.isCancelled()` inside the processor returns a `{status:'cancelled'}` no-op so an in-flight file's mtime is never bumped (`memory-index.ts:1011-1013`). [SOURCE: batch-processor.ts:149-174, memory-index.ts:1008-1034]
- **Cancel returns do not leak the scan lease (hypothesis tested and refuted).** The early `return cancelledScanEnvelope` at 1178/1207/1313 are inside the `try` opened at 505; its `finally` (1472-1483) always clears the heartbeat/lag timers and calls `releaseScanLease()`, which is idempotent (`scanLeaseReleased` guard at 481-482). No lease leak, no timer leak on the cancel path. [SOURCE: memory-index.ts:479-484, 505, 1472-1483]
- **Scope targeting is correct (hypothesis tested and refuted).** I hypothesized the other post-batch tail phases (`orphan-sweep`, `enrichment-repair`, `near-dup-repair`) were also unyielded all-rows sweeps left unfixed. Reading them shows they are each **bounded per scan**: `runGlobalOrphanSweep` uses `{ limit: ORPHAN_SWEEP_LIMIT }` (cursor-paged, 670), `runPostInsertEnrichmentRepairBackfill` uses `{ limit: BATCH_SIZE }` (716), `runNearDuplicateRepairBackfill` uses `LIMIT ?` = `BATCH_SIZE` (743). Only the two fixed loops iterate the whole corpus, so the fix is correctly scoped to the genuine starvation sources. The post-batch result-categorization loop (1036-1154) is pure in-memory object work with no DB/IO, so it cannot reproduce the hour-long wedge. [SOURCE: memory-index.ts:657-783, 1036-1154]

## Findings

### P2-001 — In-process cancel Set not cleared on the `failed` terminal transition (`resource-map-coverage`: n/a; category: correctness/maintainability)

The module comment for `cancelledJobIds` asserts an invariant: *"Entries are cleared when a job reaches a terminal state so the Set cannot grow without bound across many jobs."* [SOURCE: job-store.ts:72-74]. But only two paths delete: `completeJob` (369) and `resetRunningJobsForKind` (397-400). The background dispatch sends failures through `setJobState(jobId, 'failed')` [SOURCE: memory-index.ts:1525, 1532], and `setJobState` never touches the Set [SOURCE: job-store.ts:234-263]. So a job that was cancel-requested (`requestCancel` → `cancelledJobIds.add`) and then **fails** (error envelope or thrown exception) before its own cancel check fires leaves its id in the Set permanently.

- Reachability: narrow. A cancel-requested run normally short-circuits to the cancelled envelope (→ `completeJob('cancelled')` → cleanup). The leak needs the cancel to arrive during a phase with no cancel check (e.g. `orphan-sweep`/`enrichment-repair`) AND that phase to throw, so the run reports `failed` rather than `cancelled`.
- Magnitude: each leaked entry is a ~16-char job id; index_scan/ingest jobs are infrequent. Practically bounded, not a runtime hazard — but it is a genuine violation of the stated in-code invariant (docs-vs-code drift) and a slow unbounded-growth path on a long-lived daemon with recurring cancel+fail.
- Suggested fix (non-blocking, follow-on): clear the Set on every terminal transition — either `cancelledJobIds.delete(jobId)` inside `setJobState` when `isTerminalJobState(nextState)`, or in the two `setJobState(jobId, 'failed')` branches in the dispatcher. riskScore: 0.15 (advisory).

No P0 or P1 findings.

## Security

No new trust boundary, input, or credential surface. `requestCancel`/`isCancelRequestedFast` operate on server-minted job ids within the same daemon process. The in-process Set is authoritative only for the live process; cross-process/post-restart durability still routes through the `cancel_requested` column via `isCancelRequested` (job-store.ts:328-333), as the comment documents. No security findings.

## Verification (reviewer-attempted)

| Check | Result |
|-------|--------|
| Static read of all four changed files | DONE |
| REQ-001..REQ-004 spec_code trace | DONE — all MET in code |
| Lease-leak on cancel path | REFUTED — finally-released, idempotent |
| Other tail phases unbounded? | REFUTED — all bounded by limit/cursor |
| Touched-surface vitest (SC-001 / REQ-004, 68 tests) | NOT RUN — sandbox blocked `vitest`/`npx` (required approval). Claim is reviewer-unverified, not refuted; mock parity is present in source. |
| `validate.sh --strict` on target | NOT RUN — sandbox blocked (required approval). |
| `npm run build` exit 0 (T006) | NOT RUN — sandbox blocked. |

## Adversarial self-check

No P0 was raised, so no P0 replay is required. The two correctness hypotheses that could have been P1 (lease leak; unaddressed unbounded tail phases) were each opened against the cited code and refuted before recording. The single P2 was confirmed by reading the actual delete sites and the `setJobState` body rather than inferring from the comment.

## Severity summary

- P0: 0
- P1: 0
- P2: 1 (P2-001)
- newFindingsRatio: 1.0 (first pass)

Mapping: P2-only → PASS with advisories (`hasAdvisories: true`). The shipped event-loop/cancellation fix is correct, transaction-safe, and correctly scoped; the one advisory is a bounded cleanup gap that contradicts its own in-code invariant comment and warrants a one-line follow-on.

Review verdict: PASS
