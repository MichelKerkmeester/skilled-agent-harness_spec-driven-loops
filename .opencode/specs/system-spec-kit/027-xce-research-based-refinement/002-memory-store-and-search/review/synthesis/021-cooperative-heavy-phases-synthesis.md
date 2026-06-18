# 021 Review Synthesis

**Phase reviewed:** `027/002/021-cooperative-heavy-phases` (commit `372bb0f2cd`)
**Scope:** Daemon-responsiveness instrumentation + the cooperative-heavy-phases changes shipped in three files:
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/trigger-embedding-backfill.ts`
- `.opencode/skills/system-spec-kit/mcp_server/tests/trigger-embedding-backfill.vitest.ts`

**Lineages:** 10 total — deepseek-v4-pro (2), mimo-v2.5-pro (2), kimi-k2p7 (2), opus-4.8 (4).
**Per-lineage verdicts as filed:** 5× PASS, 5× CONDITIONAL. Raw tally: 0 P0, 4 P1, 19 P2 across all lineages.
**Coverage caveat:** `p021-mimo-1` reviewed only the spec/plan/tasks/impl-summary docs (it states it could not access source); its findings are doc-level, not code-verified.

All findings below were re-verified by the synthesizer against the actual shipped code at `372bb0f2cd` (READ-ONLY). A finding is reported as CONFIRMED only when the cited code was opened and the claim matched.

---

## Verdict

**PASS (no remediation gate).**

- **Confirmed P0:** 0
- **Confirmed P1:** 0 — the single substantive cross-model finding (A1, empty-files-branch missing `timedPhase`) is CONFIRMED real but downgraded to **P2** on verification: every phase on that branch is provably bounded or yielding, so it cannot let the maintenance marker go stale or block the loop. It is an instrumentation-symmetry + defense-in-depth gap, not a responsiveness defect. (Rationale in the Confirmed Findings table and Rejected section.)
- **Confirmed P2 (worth fixing):** 4 (A1, A2, A4, A5).
- **Confirmed cosmetic / single-model P2 noted but not actioned:** A3, B1, B2, B3, B4, B5, B6, B9, B10.

The verdict is PASS rather than CONDITIONAL because the only P1-filed code finding (A1) does not survive verification at P1 severity, and the only non-code P1 (B8, deploy-time lag read) is ALREADY-RESOLVED per the current implementation-summary. The packet's two P0 requirements (REQ-001 instrumentation, REQ-002 trigger-backfill chunking) are satisfied on the load-bearing path. A small remediation packet (the empty-files-branch `timedPhase` symmetry fix plus three doc/observability one-liners) is recommended but not blocking.

---

## Confirmed Findings

| Severity | file:line | Agreement | Issue | Verification evidence | Remediation recommendation |
|---|---|---|---|---|---|
| **P2** (filed P1 by 3 lin) | `handlers/memory-index.ts:785-790, 802` | 4 lin / 2 models (kimi-2, opus-1, opus-2, opus-4) | **[FLAGSHIP]** The `if (files.length === 0)` empty-files branch runs the four tail phases (`runGlobalOrphanSweep` :788, `runPostInsertEnrichmentRepairBackfill` :789, `runNearDuplicateRepairBackfill` :790, `runTriggerEmbeddingBackfill` :802) as **bare calls**, NOT via `timedPhase`. So this branch lacks the per-phase `phase=<name> ms=` wall-clock log (REQ-001) AND the per-phase `onPhase`→`maintenance.refresh()` marker refresh (REQ-003) that the main path applies at :1239/1246/1256/1261. | Opened both branches. Main path `timedPhase` defined :1226-1237 (fires `ctx.onPhase?.(phase)` :1227 → `maintenance.refresh()` :1510, logs `phase=… ms=` :1235). Empty-files branch :785-844 calls the four functions raw. **Downgrade evidence:** (a) the lag sampler (:511-526) and `max-event-loop-lag` readout (:1480, in the outer `finally` started at :505) DO cover the empty-files branch — its `return` at :846 is inside that try, so the finally fires; (b) marker TTL=180s with a 20s self-refresh `setInterval` (`maintenance-marker.ts:25-26,63`); (c) the only synchronous phase on this branch is the orphan sweep bounded to `ORPHAN_SWEEP_LIMIT = 200` (:234); the two repairs are `BATCH_SIZE = 5` (`core/config.ts:117`) and await out-of-process embeddings (yield, letting the 20s timer fire); trigger-backfill is off by default and chunk-yields when on. So no phase on this branch can block past the TTL → marker cannot go stale here. `isCancelled` IS threaded on this branch (:803). | Hoist `timedPhase` above the `files.length === 0` branch (or define an equivalent local helper) and wrap all four empty-files tail-phase calls, mirroring :1239-1261. One-line-each change. Restores instrumentation symmetry and makes REQ-003's unqualified AC literally true on all reachable paths. |
| **P2** | `implementation-summary.md:60`; `spec.md:106`; `plan.md` | 2 lin / 2 models (opus-1, mimo-1) | Doc-vs-code drift: the impl-summary/spec assert `timedPhase` "enters **each** un-yielded tail phase … via `ctx.onPhase`" and "Each tail phase now begins with a full 180s TTL ahead of it" as **unqualified** claims, but this holds only on the `files.length > 0` main path (see A1), not the empty-files branch. | impl-summary.md:60 read verbatim — the claim is stated without path qualification. Cross-checked against the empty-files branch (A1). | Qualify the wording to "each un-yielded tail phase **on the main scan path**", OR fix A1 so the claim becomes true everywhere (preferred — fixing A1 resolves A2). |
| **P2** | `handlers/memory-index.ts:1261` | 2 lin / 2 models (deepseek-1, kimi-1) | `await timedPhase('near-dup-repair', () => runNearDuplicateRepairBackfill())` **discards the returned repaired-row count**. The other four `timedPhase` sites capture into `results.*`; near-dup has no `ScanResults` field or response hint, so operators cannot observe whether the phase did work. | Confirmed :1261 has no `results.x =` assignment, unlike :1239/1240, :1246, :1256. `runNearDuplicateRepairBackfill` returns `Promise<number>` (:728, returns `repaired` :778). No data loss (the function self-warns :775), purely an observability gap. | Capture the return into a new `ScanResults` field + scan-response hint, mirroring `postInsertEnrichmentRepaired`. |
| **P2** | `lib/search/trigger-embedding-backfill.ts:248-252, 275-279` | 3 lin / 2 models (kimi-1, opus-2, opus-3) | On cancel, `result.pendingRemaining` / `result.pendingRows` are left at their `emptyResult` default (0), so a `cancelled` run **under-reports the committed-but-pending backlog**. opus-3 extends: because `triggerBackfillChangedRows` keys on `readyRows||failedRows||pendingRows > 0`, a phrase-sync that committed `pending` rows then cancelled emits **no statediff/invalidation action** either. | Confirmed: `result` defaults set at :146 via `emptyResult` (`pendingRows`/`pendingRemaining` = 0, :69/74). `pendingRows` is only populated at :271 and `pendingRemaining` at :336 — both AFTER the two cancel `return result` paths (:251, :278). So cancel returns 0s. **Safe by design:** the committed rows are `embedding_status='pending'` (inert until embedded) and the next scan reconciles via idempotent `ON CONFLICT DO UPDATE` (:182); all lineages agreed. Observability/consistency gap, not correctness. | Recompute pending-row counts before the two cancel returns (so `pendingRemaining`/`pendingRows` reflect committed work), OR add a one-line code comment documenting the cancel-path counter asymmetry. |

---

## Rejected / False-Positive / Already-Resolved

| Finding | Models | Disposition | Reason |
|---|---|---|---|
| **B8 — deploy-time live lag read deferred → "responsiveness claim unvalidated" (filed P1)** | mimo-1 (docs-only) | **ALREADY-RESOLVED** | The current `implementation-summary.md` records the live read as DONE: an isolated-clone force reindex logged `max-event-loop-lag ms=634` with **no `event-loop blocked` spikes**; slowest phase `enrichment-repair ms=2216` is slow-but-cooperative (lag ≤ 634ms). Continuity `recent_action`: "Live clone reindex: max event-loop lag 634ms, no block — gap closed." The 4 opus lineages already classified SC-002 as a deploy gate by-design, not a code defect; mimo-1's own downgrade trigger ("if the lag read confirms no block, downgrade") is satisfied. Not a P1, not open. |
| **A1 at P1 severity** | kimi-2, opus-1, opus-2 (P1); opus-4 (P2) | **DOWNGRADED to P2** (kept in Confirmed Findings at P2) | The cited branch is real, but every phase on it is bounded (orphan sweep ≤200 rows) or yields (LIMIT-5 awaited embeddings; trigger-backfill off-by-default + chunk-yields), and the lag sampler + max-lag readout still cover it. No demonstrated TTL-exceeding block or stale-marker path on this branch. opus-1 itself rated confidence 0.72 and flagged the branch may never be on the marker-holding path. P1 (a re-election-breaking defect) is not warranted; P2 (symmetry + defense-in-depth) is. |
| **A3 — `timedPhase` adds one microtask to the foreground orphan-sweep → "byte-identical" claim inaccurate** | opus-1, opus-2, opus-3, opus-4 (4 lineages, **1 model**) | **NOTED (cosmetic), not actioned** | CONFIRMED literally true: `timedPhase` is `async` and does `return await fn()` even when `!instrument` (:1228-1233), so the previously-synchronous `runGlobalOrphanSweep()` now crosses one microtask boundary on the foreground path (:1239). **Behaviorally inert** — results identical, does not yield the macrotask/IO loop, responsiveness unaffected. Single-model (opus-only) agreement despite 4 lineages. Optional doc nit: "byte-identical" → "behavior-identical". Not a defect. |
| **B7 — chunk-transaction mid-failure recovery untested** | mimo-1 (docs-only) | **NOTED, low value** | The "next scan reconciles" claim rests on idempotent upserts + per-memory-id deletes, which ARE structurally verified (see cross-cutting confirmations). A failure-injection test would add confidence but is not gating; the existing 6/6 unit suite covers cancel-immediate, cancel-at-boundary, and cooperative-yield. |
| Yield-inside-transaction corruption | all source-reading lineages | **RULED OUT (true negative)** | `await setImmediate` is strictly BETWEEN self-contained `syncPhraseChunk` transactions (:253-258); the `database.transaction()` body (:169-245) contains no `await`. REQ-002's central risk is correctly mitigated. |
| Foreground/sync-path regression | all source-reading lineages | **RULED OUT (true negative)** | All instrumentation logging + the lag `setInterval` are gated on `instrument = typeof ctx.onPhase === 'function'` (:501) — absent on the synchronous foreground path (the sole exception being the inert microtask in A3). |
| Lag-timer leak / double trigger-backfill / launcher change (REQ-004) / security | various | **RULED OUT (true negatives)** | Lag timer cleared+unref'd in `finally` (:1477-1481). The two trigger-backfill sites (:802 vs :1256) are in mutually-exclusive branches. `git show 372bb0f2cd --stat` shows no launcher/supervision file changed (REQ-004 honored). No new input surface; parameterized SQL; logs emit only numeric ms + phase labels. |
| **B1-B6, B9, B10** (singletons) | 1 lineage each | **NOTED (P2 cleanup backlog)** | Dual `releaseScanLease` call but idempotent (B1); `console.error` for diagnostics — consistent with file convention (B2); `LOOP_LAG_WARN_MS=1000` tuning suggestion (B3); lag-sampler drift self-corrects + is conservative, cannot mask a block (B4); no TTL-exceeded WARN in `timedPhase` (B5); cache-hit yield lacks a cancel re-check, ≤49 bounded extra iterations (B6); duplicated `isCancelled` thunk (B9); redundant trailing `setImmediate` after final chunk (B10). None correctness-blocking. |

---

## Remediation Outline

Ordered by severity; seeds a small remediation phase packet. Target files are absolute under the repo root.

### 1. [FLAGSHIP, P2] Empty-files-branch `timedPhase` symmetry
**File:** `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts`
**Change:** Hoist the `timedPhase` helper (currently defined at :1226-1237) to a scope above the `if (files.length === 0)` branch (:785), or extract it to a small local function defined before the branch. Then wrap the four empty-files tail-phase calls (`runGlobalOrphanSweep` :788, `runPostInsertEnrichmentRepairBackfill` :789, `runNearDuplicateRepairBackfill` :790, `runTriggerEmbeddingBackfill` :802) in `timedPhase('<phase>', …)` exactly as the main path does at :1239/1246/1256/1261.
**Effect:** Restores per-phase `phase=… ms=` timing and per-phase `maintenance.refresh()` on the empty-files / incremental early-return path. Makes REQ-003's AC literally satisfied on all reachable scan paths and closes the defense-in-depth gap if any of those phases ever grows unbounded.
**Note:** Confirm exact line numbers against the live file before editing (lineages cited 788-790/802 vs 792 for the `incremental && !force` guard — synthesizer confirmed the bare calls at 788-790 and 802).

### 2. [P2] Reconcile doc claims with code (A2)
**Files:** `…/021-cooperative-heavy-phases/implementation-summary.md` (:60), `spec.md` (:106), `plan.md`.
**Change:** Either (preferred) ship fix #1, which makes the unqualified "each un-yielded tail phase" claim true everywhere; or qualify the wording to "each un-yielded tail phase on the main scan path." Also optionally soften "byte-identical synchronous foreground path" → "behavior-identical" (A3) in `spec.md`/`plan.md`.

### 3. [P2] Capture near-dup-repair count (A4)
**File:** `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts` (:1261)
**Change:** Assign the `timedPhase('near-dup-repair', …)` return into a new `ScanResults` field (e.g. `nearDuplicateRepaired`) and surface it as a scan-response hint, mirroring `postInsertEnrichmentRepaired` (:1246-1253, hint at :871). Apply to BOTH call paths if fix #1 wraps the empty-files near-dup call too.

### 4. [P2] Document/fix cancel-path counter under-report (A5)
**File:** `.opencode/skills/system-spec-kit/mcp_server/lib/search/trigger-embedding-backfill.ts` (:248-252, :275-279)
**Change:** Lowest-effort: add a one-line comment at both cancel returns noting `pendingRemaining`/`pendingRows` stay at 0 on cancel by design (the next scan reconciles). Higher-fidelity: recompute pending counts (`countPendingRows`, :106) before each cancel `return result` so a `cancelled` envelope reports the true committed-but-pending backlog.

### 5. [Optional cleanup backlog, P2 singletons]
Bundle if a packet is opened: B9 (extract shared `isCancelled` thunk, memory-index.ts :803/:1257), B10 (guard the trailing `setImmediate`, trigger-embedding-backfill.ts :253-258), B1 (consolidate `releaseScanLease` to finally-only), B5 (TTL-exceeded WARN in `timedPhase`), B6 (cancel re-check at the cache-hit yield). None gating.
