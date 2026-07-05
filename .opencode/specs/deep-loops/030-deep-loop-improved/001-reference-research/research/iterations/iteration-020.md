# Iteration 20: S3-04 Kasper Debounced Flush Target Mapping

## Focus

[S3-04] Would kasper's debounced-flush plus version dirty-again model reduce write amplification when the reducer rewrites strategy, registry, and dashboard three times per iteration, without dropping the last write?

## Actions Taken

- Checked prior S2-07/S3 records to avoid restating the already-covered kasper buffered writer mechanism.
- Re-read kasper's dirty/version/timer flush path and shutdown drain path in `external/kasper/src/state.ts`.
- Mapped the mechanism against our current `atomic-state.ts` primitives and the deep-research reducer's strategy, registry, and dashboard write boundary.
- Checked the auto/confirm workflow YAML to confirm the reducer is the post-iteration synchronization point for all three derived surfaces.

## Findings

1. Add a reusable deferred atomic output sink, but scope it to clustered reducer writes rather than replacing reducer ownership.
   - Reference mechanism: `KasperStateStore` keeps `dirty`, `flushTimer`, `flushingPromise`, and `version` fields at `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/state.ts:112-117`; `markDirty()` increments `version`, marks dirty, and creates only one 2s timer when no timer exists at `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/state.ts:886-891`.
   - OUR target file: `.opencode/skills/deep-loop-runtime/lib/deep-loop/atomic-state.ts`.
   - Integration target: `.opencode/skills/deep-loop-workflows/deep-research/scripts/reduce-state.cjs`.
   - Why it helps: the reducer currently writes registry, strategy, and dashboard through `writeUtf8()` at `.opencode/skills/deep-loop-workflows/deep-research/scripts/reduce-state.cjs:1055-1058`, while `writeUtf8()` is direct `fs.writeFileSync()` at `.opencode/skills/deep-loop-workflows/deep-research/scripts/reduce-state.cjs:30-32`. A shared helper in `atomic-state.ts` could let the reducer queue rendered outputs and drain once after the pass, preserving reducer ownership while avoiding repeated full-file rewrites when reducer refreshes cluster tightly.
   - Port difficulty: med.
   - Tag: quick-win.

2. The no-drop guarantee requires per-path versioning plus dirty-again reflush, not debounce alone.
   - Reference mechanism: `flush()` captures `this.version` and records the in-flight promise at `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/state.ts:894-905`; after the write path, `execFlush()` schedules an immediate 0ms reflush when `this.version !== capturedVersion` at `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/state.ts:939-949`.
   - OUR target file: `.opencode/skills/deep-loop-runtime/lib/deep-loop/atomic-state.ts`.
   - Why it helps: our current `writeStateAtomic()` and `writeTextAtomic()` write immediately and synchronously at `.opencode/skills/deep-loop-runtime/lib/deep-loop/atomic-state.ts:42-64`. A buffered helper must increment a version on every queued content update, capture that version during flush, and reflush immediately if content changed mid-write; otherwise the final dashboard or registry render could be stranded until the next timer or process exit.
   - Port difficulty: med.
   - Tag: quick-win.

3. A reducer-facing debounce is only safe if callers await an explicit drain before command exit.
   - Reference mechanism: kasper `destroy()` clears any pending timer and awaits `flush()` at `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/state.ts:610-615`; flush errors keep state dirty and schedule another 2s attempt at `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/state.ts:920-930`; `reset()` also waits for an in-flight flush before rewriting state at `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/state.ts:557-568`.
   - OUR target file: `.opencode/skills/deep-loop-runtime/lib/deep-loop/atomic-state.ts`.
   - Integration target: `.opencode/commands/deep/assets/deep_research_auto.yaml`.
   - Why it helps: the auto workflow runs `reduce-state.cjs` after each iteration and expects registry, dashboard, and strategy outputs at `.opencode/commands/deep/assets/deep_research_auto.yaml:780-790`; confirm mode has the same reducer boundary at `.opencode/commands/deep/assets/deep_research_confirm.yaml:732-742`. A deferred writer must expose `flushNow()` or `close()` and the reducer command must await it before returning, or the last queued write can be lost when Node exits.
   - Port difficulty: med.
   - Tag: quick-win.

4. The write-amplification win is conditional: coalescing helps repeated writes to the same paths, not the unavoidable one write per derived surface.
   - Reference mechanism: kasper ultimately materializes one state object and writes it once via `writeTextAtomic()` at `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/state.ts:1048-1059`.
   - OUR target file: `.opencode/skills/deep-loop-runtime/lib/deep-loop/atomic-state.ts`.
   - Why it helps: our reducer writes three different outputs, not one state object: registry, strategy, and dashboard at `.opencode/skills/deep-loop-workflows/deep-research/scripts/reduce-state.cjs:1055-1058`. A buffered helper should be a per-path or batch sink that drops superseded content for the same path inside a small window; it should not promise to collapse three distinct files into one write. That caveat keeps the backlog item honest and prevents an over-broad port.
   - Port difficulty: easy.
   - Tag: quick-win.

## Questions Answered

- S3-04: Yes, kasper's model is worth porting to `atomic-state.ts`, but as a deferred/batched writer with explicit drain semantics. It can reduce repeated full-file writes when reducer-owned surfaces are regenerated more than once in a tight window, and dirty-again version checks protect the last queued content.
- Caveat: debounce alone does not reduce the three necessary writes to distinct files in a single clean reducer pass.

## Questions Remaining

- Measure whether the live workflow ever invokes `reduce-state.cjs` plus dashboard generation as two physical write passes in the same iteration, because that determines the real write-amplification savings.
- Decide whether the first implementation should wrap only `reduce-state.cjs` or expose a generic `createDeferredAtomicWriter()` for fanout and review reducers too.

## Next Focus

S3-05: map kasper-style read-merge-write set-union onto `jsonl-repair.ts` for concurrent fan-out lineages.
