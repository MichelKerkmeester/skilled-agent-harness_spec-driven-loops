# Review Report — 021-cooperative-heavy-phases (lineage p021-opus-1)

| Field | Value |
|-------|-------|
| Target | `.../002-memory-store-and-search/021-cooperative-heavy-phases` |
| Target type | spec-folder (Level 1) |
| Executor | cli-claude-code · claude-opus-4-8 |
| Iterations | 1 (single-pass fan-out lineage) |
| Stop reason | maxIterations reached (1) |
| Dimension coverage | 4/4 |
| Verdict | **CONDITIONAL** |
| Release readiness | in-progress |

---

## 1. Executive Summary

**Verdict: CONDITIONAL** (hasAdvisories: true). Active findings: **P0=0, P1=1, P2=2**.

The packet's two headline deliverables are correctly implemented and the load-bearing one is sound on every path. The **event-loop lag sampler** (REQ-001) is set up before any scan branch and torn down in `finally`, so it covers both scan exit paths. The **trigger-embedding-backfill chunking** (REQ-002) is correct and well-tested: deletes are scoped per-`memory_id`, so splitting the corpus into 200-row chunks is safe; cancel checks sit at each chunk and each embedding-row boundary; the cache-hit fast path yields every 50 rows; a `cancelled` status is added. The three new unit cases exercise cancel-immediate, cancel-at-chunk-boundary (clean 200-row partial), and cooperative-yield.

The one material gap is **REQ-003** (per-tail-phase marker refresh + per-phase timing): it is applied only on the main scan path. The `files.length === 0` early-return branch (`memory-index.ts:785-883`) runs the same four tail phases — orphan-sweep, enrichment-repair, near-dup-repair, trigger-backfill — **without** `timedPhase`, so on that branch they neither fire `onPhase`/`maintenance.refresh()` nor emit `phase=` timing. That branch is the routine steady-state path for a background incremental scan that finds no changed files but still runs the periodic tail repairs (F001, P1). Two P2 advisories: the spec/plan/summary describe `timedPhase` coverage as universal when it is main-path-only (F002), and a redundant trailing `setImmediate` after the final chunk (F003).

Scope: 3 changed source/test files from commit `372bb0f2cd` + the packet's spec docs. Security dimension is N/A (internal daemon maintenance; no external input, no credentials; logs emit only phase names and lag ms).

---

## 2. Planning Trigger

CONDITIONAL routes to **`/speckit:plan`** for a small remediation: one active P1 (F001) is an incomplete-implementation gap against a stated P1 acceptance criterion. The fix is mechanical (hoist `timedPhase` above the `files.length === 0` branch, or wrap the four no-files tail calls), so a thin remediation packet — or a fast-follow amendment to 021 — is appropriate rather than a full re-plan. P2 advisories can ride along.

---

## 3. Active Finding Registry

| ID | Sev | Dim | Title | Evidence | Status |
|----|-----|-----|-------|----------|--------|
| F001 | P1 | traceability | REQ-003 marker-refresh/timing not applied on `files.length===0` scan branch | `memory-index.ts:788-790,802-804` (unwrapped tail phases); helper defined at `:1224`, applied only at `:1234/1241/1256/1259`; branch returns at `:846` | active |
| F002 | P2 | maintainability | `implementation-summary.md` overstates `timedPhase` coverage as universal | `implementation-summary.md:60`; same framing `spec.md:106`, `plan.md:64` | active |
| F003 | P2 | maintainability | Redundant trailing `setImmediate` yield after the final phrase-sync chunk | `trigger-embedding-backfill.ts:253-258` | active |

**F001 detail.** REQ-003 acceptance: "The orphan-sweep, enrichment-repair, trigger-backfill, and near-dup-repair phases **each** enter via `timedPhase`, which fires `ctx.onPhase` and thereby `maintenance.refresh()`." The no-files branch runs `runGlobalOrphanSweep()` (`:788`), `runPostInsertEnrichmentRepairBackfill()` (`:789`), `runNearDuplicateRepairBackfill()` (`:790`), and `runTriggerEmbeddingBackfill(..., {isCancelled})` (`:802`) directly. `isCancelled` *is* threaded (`:802-804`) and the lag sampler *is* active (set up `:507-521` before the branch), so the gap is precisely the per-phase marker refresh and per-phase wall-clock attribution. Mitigations that lower live risk but do not satisfy the criterion: with the trigger-backfill flag off (default) the no-files tail phases are bounded (orphan sweep 200 rows, LIMIT-5 repairs) and unlikely to block 180s; with the flag on, the chunk-yields let the marker's own 20s timer fire. Residual: an operator's deploy-time read taken during a no-files background scan would see no `phase=` attribution, and REQ-003's literal guarantee is unmet on a reachable path. Confidence 0.72; downgrade to P2 if the marker-holding background path is confirmed never to take this branch.

---

## 4. Remediation Workstreams

**WS-1 — Close REQ-003 on every scan path (F001, P1).** Hoist the `timedPhase` helper (currently defined at `memory-index.ts:1224`) above the `files.length === 0` branch, then wrap the four tail calls at `:788-802` in it. Net: ~4 call-site edits + one helper move. Re-run the scan-job suite to confirm `onPhase` wiring still passes.

**WS-2 — Doc reconciliation (F002, P2).** Qualify the `timedPhase`-coverage wording in `implementation-summary.md:60`, `spec.md:106`, `plan.md:64`. Naturally folded into WS-1's close-out (after WS-1 the claim becomes true and no edit is needed beyond confirming it).

**WS-3 — Cosmetic (F003, P2).** Optional: guard the trailing yield with `offset + PHRASE_SYNC_CHUNK_ROWS < sourceRows.length`. Defer unless touching the file.

Execution order: WS-1 → (WS-2 auto-resolves) → WS-3 optional.

---

## 5. Spec Seed

> REQ-003 (amended): Each un-yielded tail phase (orphan-sweep, enrichment-repair, trigger-backfill, near-dup-repair) enters via `timedPhase` on **every** scan exit path, including the `files.length === 0` early-return branch, so `onPhase`/`maintenance.refresh()` and `phase=` timing apply whenever those phases run on the background path — not only on the file-bearing main path.

Acceptance addendum: a background scan that takes the no-files branch emits `phase=<name> ms=` for each of the four tail phases and refreshes the marker on each entry.

---

## 6. Plan Seed

1. Move `timedPhase` definition above the `if (files.length === 0)` block in `memory-index.ts` (currently `:1224`, needs to precede `:785`).
2. Wrap `:788`, `:789`, `:790`, `:802` tail calls in `timedPhase('orphan-sweep'|'enrichment-repair'|'near-dup-repair'|'trigger-backfill', …)`.
3. Run `tsc --noEmit` + `tests/handler-memory-index-scan-jobs.vitest.ts` + the daemon-reelection adoption harness.
4. Confirm the spec/plan/summary `timedPhase`-coverage wording is now accurate (F002).

---

## 7. Traceability Status

| Protocol | Class | Status | Notes |
|----------|-------|--------|-------|
| spec_code | core/hard | partial | REQ-001 PASS (lag, both paths) / per-phase timing main-path-only; REQ-002 PASS + unit-tested; **REQ-003 FAIL on no-files branch (F001)**; REQ-004 (no launcher change) recorded read-only, not independently re-verified in this read |
| checklist_evidence | core/hard | n/a | Level 1 packet, no `checklist.md` — exempt; `implementation-summary.md:89-96` verification table used as evidence surface |
| feature_catalog_code | overlay/advisory | n/a | No catalog claims in scope |
| playbook_capability | overlay/advisory | n/a | No playbook in scope |

REQ-002 verification (SC-001) is recorded as 6/6 PASS in the implementation-summary; the unit-test logic was verified statically here (re-execution blocked by interactive approval in this autonomous lineage). SC-002 (live single-launcher lag read) is an acknowledged deploy-time check; the implementation-summary reports an isolated-clone proxy (max lag 634 ms, no block).

---

## 8. Deferred Items

- **F002, F003** (P2 advisories) — resolve alongside WS-1 or defer.
- **REQ-004 launcher claim** — declared no-change and read-only-confirmed by the implementor; this review did not re-read the launcher (`mk-spec-memory-launcher.cjs`, `model-server-supervision.cjs`). Advisory: a follow-up read could close the loop, but no contradicting evidence was found.
- **SC-002 live lag read** — deploy-time; out of this read's scope.

---

## 9. Audit Appendix

**Coverage.** 1 iteration, 4/4 dimensions. Files: `memory-index.ts` (both scan exit paths, both backfill call sites, lag sampler lifecycle, `timedPhase`), `trigger-embedding-backfill.ts` (chunk loop, per-memory delete scoping `:208-226`, cancel boundaries, cache-hit yield, status), `trigger-embedding-backfill.vitest.ts` (3 new cases). Spec docs: spec/plan/tasks/implementation-summary.

**Convergence replay.** Single-pass, `maxIterations=1`. newFindingsRatio 0.60 (P1 present → above the 0.08 rolling floor); coverage 4/4. Stop is by the iteration cap, not by composite convergence — consistent with a fan-out lineage's single dispatch. P0=0 so no P0-override; verdict locked to CONDITIONAL by the lone active P1.

**Claim adjudication.** F001 carries a typed packet (re-read cited evidence, sought counterevidence in both scan branches, recorded an alternative explanation and a downgrade trigger). `claim_adjudication` event `passed:true`. F002/F003 are P2 and exempt from the packet requirement.

**Correctness confirmations (no finding).** Chunk delete scoping is per-`memory_id` (safe split); `await setImmediate` is strictly between self-contained chunk transactions (no yield inside `database.transaction`); cancel checks at chunk + row boundaries match the unit assertions; lag timer is `unref()`'d and cleared in `finally` with a final `max-event-loop-lag` log; `timedPhase` logs elapsed in `finally` (throw-safe).

**Limitations of this read.** Vitest not re-executed in-lineage (interactive approval blocked); launcher adopt/reap path (REQ-004) not independently re-verified; live deploy-time lag read out of scope.

---

_Verdict: **CONDITIONAL** — one active P1 (F001), zero P0. Route to `/speckit:plan` for a thin REQ-003 remediation; P2 advisories ride along._
