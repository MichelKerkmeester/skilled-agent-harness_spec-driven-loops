# Iteration 15: S2-07 Kasper Debounced State Flush

## Focus

Investigated how kasper's `KasperStateStore` implements buffered state persistence: `markDirty()` increments an in-memory version, schedules a single 2s flush, and the flush path detects mutations that land during the async write by comparing `capturedVersion` with the current version.

## Actions Taken

- Read the deep-research iteration output contract and convergence guidance for artifact shape.
- Checked prior packet state for duplicate S2-07 coverage; prior records list S2-07 as open, but no previous iteration covered this exact flush mechanism.
- Mined `external/kasper/src/state.ts` for the store fields, dirty marking, flush orchestration, error retry, and shutdown drain paths.
- Inspected our atomic-state helper and tests to identify the current target gap.

## Findings

1. Buffered dirty writer should be a reusable layer above the existing atomic write primitive.
   - Reference mechanism: `KasperStateStore` keeps `dirty`, `flushTimer`, `flushingPromise`, and `version` fields in memory at `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/state.ts:112-117`; `markDirty()` increments `version`, sets `dirty`, and starts one 2s timer only when no timer is pending at `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/state.ts:886-891`.
   - OUR target file: `.opencode/skills/deep-loop-runtime/lib/deep-loop/atomic-state.ts`.
   - Why it helps: our current `writeStateAtomic`/`writeTextAtomic` helpers write immediately on every call at `.opencode/skills/deep-loop-runtime/lib/deep-loop/atomic-state.ts:42-64`; a buffered wrapper could coalesce reducer bursts while preserving the existing temp/fsync/rename guarantee.
   - Port difficulty: med.
   - Tag: quick-win.

2. Version dirty-again detection closes the mid-flush crash-loss window.
   - Reference mechanism: `flush()` captures the current version and records the in-flight promise at `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/state.ts:894-905`; after lock/merge/write, `execFlush()` compares `this.version` with `capturedVersion` and schedules a 0ms reflush when they differ at `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/state.ts:939-949`.
   - OUR target file: `.opencode/skills/deep-loop-runtime/lib/deep-loop/atomic-state.ts`.
   - Why it helps: a mutation that happens during a long write should not wait for the normal debounce interval after the first flush succeeds; immediate reflush reduces the remaining crash-loss window to the next event-loop turn.
   - Port difficulty: med.
   - Tag: quick-win.

3. The buffered writer needs explicit drain and retry semantics, not only a timer.
   - Reference mechanism: `destroy()` clears the pending timer and forces `flush()` at `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/state.ts:610-615`; flush errors mark state dirty again and schedule another 2s attempt at `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/state.ts:920-930`; reset waits for an in-flight flush before rewriting state at `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/state.ts:557-568`.
   - OUR target file: `.opencode/skills/deep-loop-runtime/lib/deep-loop/atomic-state.ts`.
   - Why it helps: deep-loop reducers and fanout merge paths need a `flushNow()`/`close()` style drain before process exit or handoff, plus retry behavior that keeps dirty state visible after a failed write.
   - Port difficulty: med.
   - Tag: quick-win.

## Questions Answered

- [S2-07] Kasper debounces state persistence by making `markDirty()` versioned and timer-backed; `flush()` captures the version; `execFlush()` writes under the store's lock/merge path; and a version mismatch after write schedules an immediate reflush instead of clearing `dirty`.

## Questions Remaining

- [S2-08] The same source file also exposes `mergeExternalState()` read-merge-write behavior at `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/state.ts:958-1028`; that needs a separate pass against our JSONL repair and append semantics.
- A D2 mapping pass should identify which deep-loop reducers can safely adopt buffered writes without delaying append-only JSONL state events.

## Next Focus

[S2-08] How does kasper reconcile concurrent writers with read-merge-write (`mergeExternalState` set-union) so two processes do not clobber each other? -> `.opencode/skills/deep-loop-runtime/lib/deep-loop/jsonl-repair.ts`
