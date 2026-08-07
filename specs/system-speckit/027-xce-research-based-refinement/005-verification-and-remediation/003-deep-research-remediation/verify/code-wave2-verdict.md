# Code Wave 2 — Fresh Fable Verifier Verdict (tri-045, tri-013)

Verified 2026-06-12 against originals: tri-045 in `verify/fable-verify-l4-batch-report.md`; tri-013 in `verify/l2-still-real-batch.md` (Cluster E). Both fixes are uncommitted working-tree modifications (confirmed via `git status --porcelain`).

## Verdicts

- tri-045: CLOSED
- tri-013: CLOSED

---

## tri-045 — playbook release-readiness check now proves linked scenario coverage — CLOSED

File: `.opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md` (uncommitted `M`).

**(a) Embedded check runs and passes from repo root.** Executed the exact embedded python block from `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public`:

```
OK: 410 files, 325 index links, 0 broken, 85 orphans (baseline 85)
```

Matches the claimed 410 files / 0 broken / 85 orphans. (Original note measured 326 distinct links including the one dead link; 325 after its removal is consistent.) No `_deprecated/` dirs exist, so the 410 equals the original finding's "410 immediate scenario files" exactly; the `_deprecated` glob and orphan-exclusion are currently inert future-proofing.

**(b) Ratchet decision judged honest and genuinely enforced.**
- Honesty: old clause 6 falsely asserted "Orphan scenario count is zero" while 85 orphans existed and the check verified nothing about linkage (bare `TOTAL_FEATURES == 410` count, old lines 149-170). New clause 6 names the debt explicitly — "does not exceed the recorded reconciliation baseline (85 as of 2026-06-12 — legacy index debt; the baseline may only ratchet DOWN), and zero index links are broken." This directly remediates the finding ("the gate's two strongest clauses are unverified"): clause 3 (index links backed by files) is now machine-proven by the broken-link assertion; clause 6 converts a false zero-claim into an enforced, dated debt baseline. Converting hidden debt into named, gated debt is honest remediation.
- Enforcement, proven by mutation tests against the live script logic:
  - Adding one synthetic broken link (`zz-does-not-exist.md`) → check FAILS with `broken:1` (the `if broken:` guard fails on ANY non-empty set, so 1 broken link fails).
  - De-linking one real row (`retrieval/4-stage-pipeline-architecture.md`) → 86 orphans → check FAILS with `orphans:86>85` (`len(orphans) > ORPHAN_RATCHET_BASELINE` strict inequality: 85 passes, 86 fails).
- Residual caveat (non-blocking): "ratchet DOWN only" is prose-governed — the script hardcodes `ORPHAN_RATCHET_BASELINE = 85` and nothing mechanical stops a future editor raising it. Inherent to any doc-embedded baseline; standard ratchet practice.

**(c) Regex matches the index's actual link formats; no undercount.**
- Format census of the root index: 544 bare-format scenario link occurrences (`](NN--.../file.md`), 0 `./`-prefixed (the regex's optional `(?:\./)?` is harmless), 0 angle-bracket, %20-encoded, or reference-style scenario links (regex blind spots checked, none present). The `[^)#]+` class admits spaces (the original dead link's filename contained a literal space and was matched) and handles `#anchor` suffixes via backtracking.
- Adversarial cross-extraction: a permissive parser (any `](...md)` target resolving to a file under the playbook root) finds exactly 325 targets — identical set to the check regex; `resolved-but-missed: NONE`.
- Spot-check of 3 linked rows, all EXIST on disk: `retrieval/unified-context-retrieval-memory-context.md`, `memory-quality-and-indexing/memory-filename-uniqueness-ensureuniquememoryfilename.md`, `memory-quality-and-indexing/reconsolidation-on-save-tm-06.md`.

**Dead-link repair.** Both referencing sites of the never-existing `scoring-and-calibration/102-Ollama runtime-optionaldependencies.md` (old :2172/:3658) are replaced with honest consolidation notes (now lines 2187 and 3673: "*(102 consolidated — no standalone file; coverage lives in the scoring-and-calibration category)*"). Since the scenario was consolidated and the file never existed, a note is more honest than fabricating a file. Diff is surgical — clause 6 + check block + the two link sites only.

---

## tri-013 — dry-run/apply signal-source divergence removed — CLOSED

File: `.opencode/skills/system-spec-kit/mcp_server/lib/governance/memory-retention-sweep.ts` (uncommitted `M`). Diff is exactly the claimed change: `args.signals ?? (dryRun ? [] : aggregateEvents(...))` → `args.signals ?? aggregateEvents(database, (runAt - windowMs), runAt)` at `buildFeedbackRetentionReport` (now :297-301), plus an explanatory comment. Dry-run and apply now share one signal window by construction.

**(a) `aggregateEvents` is a pure read.** `lib/feedback/batch-learning.ts:256-308`: calls `initBatchLearning` (memoized per-db, idempotent `CREATE TABLE IF NOT EXISTS` DDL at :205-238 — schema ensure only, no data writes, and identical to what the apply path already triggered), then `getFeedbackEvents` (parameterized SELECT, `feedback-ledger.ts:244+`), then in-memory grouping/scoring/sort and return. No INSERT/UPDATE/DELETE anywhere in the path. `evaluateFeedbackRetention` (`feedback-retention-reducer.ts:131`) takes only candidates+signals+options — no db handle, cannot write.

**(b) Dry-run returns BEFORE the audit transaction.** Traced `runMemoryRetentionSweep`: `buildFeedbackRetentionReport` is invoked at :440 (read-only, returns `auditCount: 0`, calls no audit function); the `if (dryRun || candidates.length === 0)` early return at :443-461 precedes both the shadow/active-blocked `auditTx` (`recordFeedbackRetentionAudits`, :465-473) and the delete `sweepTx` (:499). Previews record nothing — confirmed behaviorally by the passing test "dry-run computes feedback decisions with no row or audit mutation" (`tests/memory-retention-feedback-learning.vitest.ts:120-139`), which asserts rows, `delete_after`, and `governance_audit` count are all unchanged.

**(c) Public schema unchanged; `signals` stays internal; preview now mirrors apply.** `tool-schemas.ts:503-507` (`memory_retention_sweep`): `additionalProperties: false` with `dryRun` as the only property — `signals`/`feedbackRetention` cannot be supplied by public callers. The handler (`handlers/memory-retention-sweep.ts:39-42`) passes only `dryRun` plus the pre-existing internal `feedbackRetention` passthrough. Behavioral parity by composition: the shadow-mode test exercises this exact `buildFeedbackRetentionReport` path with NO injected signals and real logged events (aggregation proven live), and dry-run differs only in the post-report early return.

**(d) Tests pass.** `cd .opencode/skills/system-spec-kit/mcp_server && npx vitest run tests/feedback-retention-reducer.vitest.ts tests/memory-retention-feedback-learning.vitest.ts tests/memory-retention-sweep.vitest.ts` → **3 files passed, 33/33 tests passed** (829ms, vitest 4.1.6).

Minor non-blocking note: no single test pins "dry-run + no injected signals + logged events → aggregated decisions" in one assertion; the invariant is currently proven by composition of the shadow-aggregation and dry-run-no-mutation tests. Also, the live MCP daemon serves from `dist/` — the TS fix is not live until the next dist rebuild/recycle (deployment concern, outside this verification's scope).
