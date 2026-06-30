# Iteration 001 — Full-Coverage Review (lineage p021-opus-3)

**Target:** `027/002/021-cooperative-heavy-phases` (spec-folder, Level 1)
**Executor:** cli-claude-code / claude-opus-4-8 · **Iteration:** 1 of 1 · **Dimensions:** correctness + security + traceability + maintainability (breadth pass)
**Authoritative source:** commit `372bb0f2cd` (`feat(027/021): cooperative heavy phases`).

---

## Scope confirmed

Three source surfaces + one test surface, all read directly:

- `mcp_server/handlers/memory-index.ts` — lag sampler, `timedPhase`, `isCancelled` threading.
- `mcp_server/lib/search/trigger-embedding-backfill.ts` — chunked phrase sync, cancel/yield, `cancelled` status.
- `mcp_server/tests/trigger-embedding-backfill.vitest.ts` — 3 new cases.

`resource-map.md` not present → coverage gate skipped (per protocol §3b).

---

## Dimension: Correctness

**Event-loop lag sampler** (`memory-index.ts:501-525`, teardown `:1476-1481`). The sampler is gated on `instrument = typeof ctx.onPhase === 'function'` so only the background path arms it. Timer drift = block detection; `maxLoopLagMs` tracked; warns at >1000ms; cleared in the `finally` block, so the early cancel-return path (inside the same `try`) still tears down the timer and `leaseHeartbeat`. No timer leak. `unref()` guards keep the timer from holding the process open. [SOURCE: handlers/memory-index.ts:496-525, 1476-1481]

**`timedPhase` wrapper** (`memory-index.ts:1227-1245`). Fires `ctx.onPhase?.(phase)` first (marker refresh), then times `fn()` only when `instrument`. The `if (!instrument) return await fn()` branch is reachable only when `onPhase` is absent (so the preceding `onPhase?.()` was a no-op) — logically consistent, no double-fire. Wraps the four un-yielded tail phases (orphan-sweep, enrichment-repair, trigger-backfill, near-dup-repair). [SOURCE: handlers/memory-index.ts:1227-1265]

**Chunked phrase sync** (`trigger-embedding-backfill.ts:247-259`). `syncPhraseChunk` is a `database.transaction(...)` invoked over 200-row slices; `await setImmediate` sits strictly BETWEEN chunk calls, never inside the transaction body — the better-sqlite3 synchronous-transaction hazard called out in the spec risk table is correctly avoided. The `isCancelled?.()` check is at the top of each chunk iteration, before the chunk's transaction runs, so a cancel leaves a clean chunk-aligned partial (0/200/400…), never a mid-transaction partial. Per-chunk atomicity is safe per the documented idempotency argument (upserts `ON CONFLICT DO UPDATE`, deletes per-memory-id; next scan reconciles). [SOURCE: lib/search/trigger-embedding-backfill.ts:169-259]

**Embedding-loop cancel + cache-hit yield** (`trigger-embedding-backfill.ts:273-284`). Cancel check at the top of each row; `processedSinceYield % 50` forces a periodic `setImmediate` so a long run of `continue`-ing cache-hit/missing-phrase rows (which never `await` network I/O) cannot starve the loop. Counter increments on every row; network-awaiting rows already yield, so the extra yield is at worst redundant — benign. [SOURCE: lib/search/trigger-embedding-backfill.ts:273-334]

**Signature/back-compat.** `runTriggerEmbeddingBackfill(database, options?)` — `options` and `isCancelled?` both optional; the foreground call site at `:802` and the tail call site at `:1257` both pass `isCancelled`. No external caller breaks (only call sites are inside `memory-index.ts`). The `cancelled` status was added to the union and to `dist/`. [SOURCE: handlers/memory-index.ts:802, 1257; lib/search/trigger-embedding-backfill.ts:36, 137-140]

**Finding F002 (P2, correctness / edge-case).** When the run is cancelled *during* the phrase-sync loop (`:248-251`), already-committed chunk rows exist in `memory_trigger_embeddings`, but the function returns with `readyRows = pendingRows = failedRows = 0`. The caller's `triggerBackfillChangedRows` predicate (`readyRows||failedRows||pendingRows > 0`) therefore returns false, so no `createTriggerBackfillAction` statediff/invalidation is emitted for those writes. This is acceptable by the packet's own "next scan reconciles" design (the written rows are `pending` and inert until embedded), but it is an undocumented asymmetry on the cancel path worth a one-line note. Not blocking. [SOURCE: lib/search/trigger-embedding-backfill.ts:247-259; handlers/memory-index.ts:803-806, 1258-1260]

No P0/P1 correctness defects.

## Dimension: Security

Observation-only change; no new input surface, no credential handling, no path/IO trust boundary. The trigger-backfill remains gated behind `SPECKIT_TRIGGER_EMBEDDING_BACKFILL` (default off). The lag-sampler logs to `console.error` and emit only numeric `ms` values and phase labels — no memory content, no PII, no phrase text. `sanitizeAndLogEmbeddingFailure` is reused unchanged for the error path. No findings.

## Dimension: Traceability (spec_code + checklist_evidence)

| Requirement | Acceptance criteria | Code evidence | Status |
|---|---|---|---|
| REQ-001 | Lag sampler + per-phase wall-clock, foreground path unchanged (gated on `ctx.onPhase`) | `:501` gate, `:513-525` sampler, `:522` block warning, `:1480` max-lag, `:1239` per-phase timing via `timedPhase` | **pass** |
| REQ-002 | `syncPhraseRows`→chunked 200-row txns, yield between (never inside), `isCancelled`→`cancelled`, cache-hit yield | `trigger-backfill.ts:55,247-259,249,276,282` | **pass** |
| REQ-003 | Each un-yielded tail phase enters via `timedPhase`→`onPhase`→`maintenance.refresh()` (full 180s TTL) | `:1239,1248,1257,1262` wrap 4 phases; consumer `:1505-1511` calls `maintenance.refresh()` | **pass** |
| REQ-004 | Launcher adopt/reap confirmed correct, no launcher change | Documented investigation (T009); no diff to launcher `.cjs` in commit `372bb0f2cd` | **pass (documented, not re-derived)** |

`checklist_evidence`: Level 1 packet, no `checklist.md` required. tasks.md T001-T012 reconciled: T001-T011 map to shipped code/tests/investigation; T012 (live deploy read) is explicitly the deploy-time check, marked complete via the isolated-clone read (max lag 634ms, no block). Verification table in `implementation-summary.md` lists typecheck PASS, unit 6/6, scan-job suite PASS, adoption harness 6/6.

**SC-001 (typecheck + tests).** Could not re-run `npm run typecheck` / vitest in this sandboxed lineage (build commands require interactive approval here). Corroborating evidence: `dist/handlers/memory-index.js:953` and `dist/.../trigger-embedding-backfill.js` already contain `timedPhase`, `isCancelled`, and the `cancelled` status — `tsc --build` produced them, which fails on type errors. Combined with the summary's recorded exit-0, SC-001 is **confirmed by artifact, inferred for the live re-run.**

**SC-002 (live single-launcher reindex).** Explicitly deferred to deploy in spec §5/§7 and tasks T012; an isolated-clone proxy read is recorded (634ms max lag, `fts==memory_index` 20001==20001, pid unchanged). Not a code deliverable — no traceability gap.

**Finding F001 (P2, docs-vs-code-drift).** Spec §3 / plan §2 quality gate assert the "synchronous foreground scan path is byte-identical." `runGlobalOrphanSweep()` changed from a synchronous, unawaited call to `await timedPhase('orphan-sweep', …)` (`:1239`). On the foreground (non-instrument) path `timedPhase` still does `return await fn()`, introducing one microtask boundary that did not exist before. `runIndexScan` is already `async` with many awaits, so this is behaviorally inert for correctness — but "byte-identical" is literally inaccurate for this one call. The other three tail phases were already `await`ed pre-change. Documentation precision only. [SOURCE: handlers/memory-index.ts:1239; spec.md §3 In Scope; plan.md §2]

## Dimension: Maintainability

Comment hygiene clean — added comments state durable WHY (event-loop-block rationale, transaction-yield hazard, per-chunk atomicity tradeoff) with no spec paths, REQ/task ids, or phase numbers embedded. Test coverage is precise: cancel-immediate (0 rows, embedder never called), cancel-at-chunk-boundary (exactly 200 rows — proves self-contained chunks vs whole-corpus 0/300), cooperative-yield (competing macrotask advances). The rename `syncPhraseRows`→`syncPhraseChunk` is local-scope only. No dead code. No findings.

---

## Adversarial self-check

No P0 findings asserted, so no P0 adjudication packets required. F001 and F002 are P2 advisories; both re-read at cited file:line. F002 alternative explanation considered (maybe `phrasesSeen>0` should gate the action) and rejected as out-of-scope design change — the existing predicate intentionally keys on durable row outcomes, and the cancel path is best-effort by design. Neither finding rises to P1.

## Convergence

Single-iteration fan-out (maxIterations=1): all four dimensions covered in one breadth pass; both core traceability protocols executed; applicable overlays N/A. Stop on maxIterations with full coverage. No P0/P1 → no blocking gate.

---

Review verdict: PASS
