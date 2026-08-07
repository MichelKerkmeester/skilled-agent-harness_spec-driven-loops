# Iteration 1: Full-scope single-pass review (correctness + security + traceability + maintainability)

## Focus
maxIterations=1 fan-out lineage (p021-opus-4). The target is a Level 1 packet with a 3-file blast radius, so all four dimensions were covered in one breadth pass rather than one-dimension-per-iteration.

Files under review (shipped diff `372bb0f2cd`):
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts` (lag sampler, `timedPhase`, `isCancelled` threading)
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/trigger-embedding-backfill.ts` (chunked phrase sync, cancel, cache-hit yield, `cancelled` status)
- `.opencode/skills/system-spec-kit/mcp_server/tests/trigger-embedding-backfill.vitest.ts` (3 new cancel/yield cases)

## Scorecard
- Dimensions covered: correctness, security, traceability, maintainability
- Files reviewed: 3 source/test + 4 spec docs (spec.md, plan.md, tasks.md, implementation-summary.md)
- New findings: P0=0 P1=0 P2=2
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.40 (2 P2 advisories on otherwise-clean, well-scoped work)

## Findings

### P0, Blocker
_None._

### P1, Required
_None._

### P2, Suggestion

- **F001**: "Byte-identical foreground path" claim is imprecise — `timedPhase` wraps the previously-synchronous orphan sweep unconditionally, `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:1239`.
  The instrumentation *logging* and the lag `setInterval` are correctly gated on `instrument` (`= typeof ctx.onPhase === 'function'`, line 499). But the `timedPhase` wrapper itself is applied to all four tail calls regardless of `instrument`, and it is `async`. Previously `const orphanSweepResult = runGlobalOrphanSweep();` was a synchronous call; it is now `await timedPhase('orphan-sweep', () => runGlobalOrphanSweep())`, which introduces a microtask boundary (`await`) on the foreground full-scan path even when `ctx.onPhase` is absent. Functionally harmless (results identical, one extra microtask tick; the other three tail phases were already `await`ed), but `plan.md:48` / `spec.md` REQ-001 state the synchronous foreground path is "byte-identical" — it is behavior-identical, not byte-identical, for the orphan-sweep call. Dimension: maintainability/traceability (doc-vs-code drift).

- **F002**: Incremental early-return path runs orphan-sweep + trigger-backfill without `timedPhase`/marker-refresh, `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:788,802`.
  The `if (incremental && !force)` early-return branch (line 792) calls `runGlobalOrphanSweep()` un-timed (line 788) and `runTriggerEmbeddingBackfill(requireDb(), { isCancelled })` (line 802) without wrapping either in `timedPhase`. So this path threads `isCancelled` (good) but does NOT fire `ctx.onPhase` → `maintenance.refresh()` for its phases, unlike the full-scan tail (REQ-003). Low risk: this is the lightweight no-file incremental fast path, the orphan sweep is bounded to `ORPHAN_SWEEP_LIMIT = 200` rows, and the trigger-backfill is gated off by default. But if this path runs as a background scan, its phases lack the per-phase TTL refresh that REQ-003 mandates for the un-yielded tail phases. Asymmetric hardening worth a one-line note or a follow-up. Dimension: correctness/maintainability.

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | pass | hard | trigger-embedding-backfill.ts:55,169,247-259,275-284 ; memory-index.ts:499-521,1224-1257,1477-1481 | REQ-001..REQ-004 all resolve to shipped behavior (see below) |
| checklist_evidence | n/a | hard | Level 1 packet — no `checklist.md` exists | Not applicable; not a gap |
| feature_catalog_code | n/a (skipped) | advisory | No catalog claim references this internal daemon scan path | Overlay, no applicable catalog entry |

**REQ traceability (spec_code detail):**
- REQ-001 (lag sampler + per-phase wall-clock, foreground unchanged): `LOOP_LAG_SAMPLE_MS=250`/`LOOP_LAG_WARN_MS=1000` (memory-index.ts:240-241); drift sampler logs `event-loop blocked ~<ms>` (line ~514) and `max-event-loop-lag ms=<ms>` in `finally` (line ~1480); `timedPhase` logs `phase=<label> ms=<elapsed>`; logging gated on `instrument`. **PASS** (logging gated; see F001 for the wrapper nit).
- REQ-002 (chunk the unbounded transaction, never block): `syncPhraseChunk` over `PHRASE_SYNC_CHUNK_ROWS=200` slices (trigger-embedding-backfill.ts:169,247), `await setImmediate` strictly BETWEEN chunk transactions (line 258, comment 254-257), `isCancelled` at each chunk boundary (line 248) and each embedding row (line 275) returning `status:'cancelled'`, cache-hit fast-path yield every 50 rows (line 282). **PASS**.
- REQ-003 (each un-yielded tail phase carries a full TTL): `timedPhase` fires `ctx.onPhase?.(phase)` (line ~1229) for orphan-sweep, enrichment-repair, trigger-backfill, near-dup-repair (lines 1239,1246,1256,1259). **PASS** for the full-scan tail (see F002 for the incremental path asymmetry).
- REQ-004 (launcher root-cause resolved, no launcher change): `git show 372bb0f2cd --stat` lists no launcher/supervision file; working tree clean for `mk-spec-memory-launcher.cjs` / `model-server-supervision.cjs`. **PASS** (read-only investigation, no code change — verified by diff absence).

## Assessment
- New findings ratio: 0.40 (two P2 advisories; no correctness/security defects)
- Dimensions addressed: all four
- Novelty justification:
  - **Correctness**: lag-sampler drift math is sound (resets `loopLagExpectedAt` to `sampledAt + SAMPLE_MS` each tick, captures block as one large-drift sample); timer created in `try`, cleared in `finally` (no leak, `unref` set); two `runTriggerEmbeddingBackfill` call sites are in mutually-exclusive branches (incremental early-return at 792 vs full-scan tail at 1239) — **no double-run**; chunk loop yields BETWEEN self-contained transactions, never inside `database.transaction()` (the stated corruption risk is avoided); per-chunk atomicity is safe given idempotent `ON CONFLICT DO UPDATE` upserts + per-memory-id deletes.
  - **Security**: no new external inputs, no credential handling; all SQL is parameterized (`.prepare(...).run(?, ...)`); trigger-backfill reads `trigger_phrases` from the local DB and is gated off by default (`isEnabledByEnv()`, line 59-61). No injection or trust-boundary change.
  - **Traceability**: all four REQs resolve to shipped code; the 3 new unit cases (cancel-immediate → 0 rows, cancel-at-chunk-boundary → exactly 200 rows, cooperative-yield → competing macrotask ticks) are logically consistent with the chunk/cancel implementation.
  - **Maintainability**: comments are durable WHY (corruption rationale, drift-sampler intent) with **no** ephemeral artifact refs (ADR/REQ/spec-path/phase ids) — comment-hygiene clean on both source files.

## Ruled Out
- **Double trigger-backfill run per scan**: ruled out — the two call sites (memory-index.ts:802 and :1256) sit in mutually-exclusive `if (incremental && !force)` early-return vs full-scan branches. Evidence: line 792 early-return guard; line 788's `orphanSweepResult` is a separate declaration from line 1239's.
- **Yield-inside-transaction corruption**: ruled out — `await setImmediate` is at line 258, OUTSIDE/after `syncPhraseChunk(...)` returns; `database.transaction()` body (169-245) contains no `await`.
- **Lag-timer leak / keeps process alive**: ruled out — cleared in `finally` (line ~1477) and `unref()`'d.

## Dead Ends
- Independent re-run of the unit suite / `tsc` to confirm the implementation-summary "6/6 PASS, tsc exit 0" claims: test execution is permission-gated in this review session. Recorded as an audit limitation, not a defect — the test file was read and its logic verified against the implementation by hand.

## Recommended Next Focus
None for a follow-up review pass — coverage is complete and the verdict is stable. For the packet owner: optionally tighten the `plan.md`/`spec.md` "byte-identical" wording to "behavior-identical" (F001), and add a one-line note about the incremental early-return path's missing per-phase marker refresh (F002). The deploy-time live single-launcher lag read remains the open SC-002 item by design (a deploy gate, not a code defect).

Review verdict: PASS
