# Deep Review Report — Session Work (E081, causal_unlink, checkpoint schema, enrichment default-on)

**Executor:** cli-opencode `openai/gpt-5.5-fast` `--variant high` · **Iterations:** 10 (0 dispatch timeouts) · **Adversarial verification:** all P0/P1 default-refute, confirmed only from real code.

**Verdict: CONDITIONAL** — P0=0, P1=18 (17 confirmed, 1 refuted), P2=6.

Scope: commits c0bb8aefd6, e93acb8e24, deee30b319, 637f83ad36, 15d2e4988d, 0060a097b3.

---

## P1 — Confirmed (17)

### A. E081 classification incomplete (commit c0bb8aefd6)
- **A1** Pre-index setup throws escape unclassified — `validateFilePathLocal` (path-traversal "Access denied") throws *before* the index try/catch, so it still flattens to generic E081. The fix classified the not-found/non-canonical/governance throws but not the path-validation/`checkDatabaseUpdated`/`requireDb` setup block.
- **A2** Handler-produced `status:'error'` messages fall through `classifySaveErrorCode` to E081 — e.g. "Save-time reconsolidation failed: …", "Save aborted before commit: candidate_changed" match none of E085–E089.
- **A3** *(design debate)* Rejected saves (quality/template/sufficiency) return a **success** envelope with `rejectionCode` and no classified error code. This is the intended "clear structured rejection" behavior — flagged as a contract question, not necessarily a bug.

### B. Async enrichment correctness/safety (commit 0060a097b3) — highest-value
- **B1** Background enrichment can mutate a **superseded** row — the `setImmediate` job runs outside the spec-folder lock and never re-checks the row is still current, so a concurrent supersede racing the deferred run repopulates stale entities/causal edges for a deprecated row (supersede logic at 2662-2664 explicitly purges those).
- **B2/B3** Unbounded background work / no concurrency bound or backpressure — one `setImmediate(runPostInsertEnrichment)` per save with no cap; a save burst schedules unbounded concurrent enrichment (each doing entity extraction + a summary embedding + graph lifecycle).
- **B4** The async task captures the module-singleton DB handle; if the daemon recycles/swaps the DB before the background run finishes, it writes against a stale/closed handle.
- **B5** Summary-step failures can be downgraded to `skipped` and still let the row reach a `complete` marker → the doc is silently under-enriched and never retried.

### C. Default-on safety
- **C1** Save-time **reconsolidation** default-on enables the *destructive* `reconsolidate()` (merge/deprecate near-duplicate rows) without explicit `full-auto` intent. **Mitigation (verified):** the destructive path is gated on a `"pre-reconsolidation"` checkpoint existing for the spec folder (reconsolidation-bridge.ts:512-522) — no checkpoint → **skipped**. So normal saves don't merge; only folders that already have that checkpoint are exposed. Still a removed safety layer.
- **(refuted)** Quality auto-fix silently truncating saved content — **refuted**: the trimmed content is computed but not persisted to the file by default (`persistQualityLoopContent` off), so no on-disk truncation.

### D. Docs vs code drift (incomplete doc sweep / spec overclaims)
- **D1** `feature_catalog.md` still documents the quality loop as **default OFF** (line ~4636) and **reconsolidation-on-save** at the wrong default + wrong flag (lines 338/2610/4639 + detail files) — the doc sweep missed these.
- **D2** Spec **R2** overstates opt-out: `full-auto` plannerMode bypasses the `=false` envs (`shouldRun = full-auto || flag`), so "set `=false` to disable" is incomplete.
- **D3** Spec **R6/SC-003** claim full-suite green, but the full run was not completed (killed) and 2 pre-existing failures remain — overclaim.

### F. Test gaps
- **F1** `T526-5/6` (force/dryRun acceptance) pass even when nothing is asserted (try/catch with no `unreachable`).
- **F2** Default async enrichment is only **flag-tested**, not behavior-tested through the save path.
- **F3** The ~17% backfill enrichment failures have no failure-mode regression test.

## P2 (6)
- Async deferred lanes mislabel reason as `planner_first_mode` (vs `async-background`).
- `memory_causal_unlink` ToolDefinition `edgeId` looser (no min) than runtime `positiveInt`.
- `feature_catalog` command-surface count + README layered total still say **36 tools** (only the 4 primary README spots were updated → 37); no test guards the public package metadata count.
- Spec R3 names the wrong response field for async enrichment status.

---

## Remediation priority
1. **Decide reconsolidation default** (C1) — keep default-on (checkpoint-gated) or revert `SPECKIT_RECONSOLIDATION_ENABLED` to opt-in (recommended: revert; it gates a destructive op and the user's goal was enrichment, not merge).
2. **Async enrichment safety** (B1, B5, then B2-B4) — superseded-row re-check before background mutation; don't mark `complete` on summary failure; bound/queue background enrichment; guard the DB handle.
3. **Complete E081 classification** (A1, A2) — wrap the pre-index setup block; extend `classifySaveErrorCode`.
4. **Doc accuracy** (D1, D2, D3, P2 counts) — finish the feature_catalog/README/spec corrections.
5. **Test gaps** (F1-F3) — assert in the acceptance tests; add an async-save behavior test + a backfill-failure regression.
