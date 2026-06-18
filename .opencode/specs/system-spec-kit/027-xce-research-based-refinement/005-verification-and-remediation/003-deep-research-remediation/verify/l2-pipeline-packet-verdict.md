# L2 Apply-Pipeline Safety Packet — Adversarial Fix Verification

**Commit under verification:** `1cd7d104e5` (fix(029/L2): apply-pipeline safety packet)
**Verifier:** fresh Fable 5 adversarial pass, 2026-06-12
**Method:** full read of both changed lib files + new test suite, control-flow enumeration of every path to `snapshotKnownGoodTriplet`/`dispatchOperation`, caller sweep for bypass entry points, test execution (4 files / 30 tests), `tsc --noEmit`, doc/playbook reconciliation. Worktree verified clean against the commit for `mcp_server/` (`git status --porcelain` empty).

## Verdicts

```
VERDICT tri-025: CLOSED
VERDICT tri-026: CLOSED
VERDICT tri-027: CLOSED
VERDICT tri-028: CLOSED
VERDICT tri-075: CLOSED
VERDICT tri-077: CLOSED
VERDICT tri-151: CLOSED
```

All seven findings are closed by the committed code. One deployment-level caveat applies to all of them equally: the fix is **not yet live on the MCP daemon surface** because `dist/` predates the commit and the launcher only rebuilds on missing artifacts (see follow-on F1). The closures below are verdicts on the committed source + tests.

---

## Evidence per hunt item

All paths relative to `.opencode/skills/system-code-graph/mcp_server/` unless noted.

### Hunt 1 — Gate placement (tri-025, tri-026, tri-027, tri-077)

No path reaches `snapshotKnownGoodTriplet` or `dispatchOperation` for a destructive/unconfirmed or repair-nodes/unflagged run. Exhaustive branch enumeration for `applyCodeGraph` (`lib/apply-orchestrator.ts:375-607`):

- **Fresh-noop branch** (`apply-orchestrator.ts:414`) requires `args.operation === undefined`; `chooseOperation` (`:242-247`) returns only `'rescan'` when operation is undefined, so default routing can never select a destructive or repair operation. An *explicit* destructive op on a fresh graph skips the noop branch and falls through to the gates.
- **Hard-stale gate** (`:429-443`) fires first on hard-stale + unconfirmed — also an abort, also pre-snapshot. Combined with the new destructive gate (`:474-486`), every (destructive op × {fresh, soft-stale, hard-stale} × confirm≠true) cell aborts before the snapshot at `:504`.
- **Destructive gate** (`:474-486`): `DESTRUCTIVE_OPERATIONS` (`:107-110`) = {recover-sqlite-corruption, rollback-bad-apply}; refusal carries `requiredAction: "re-run with confirm=true to execute <op>"`, records `aborted` metadata, audits the abort — and sits BEFORE `snapshotKnownGoodTriplet` (`:504`), so a refusal leaves no snapshot-chain artifact. Test `tests/code-graph-apply-pipeline-safety.vitest.ts:64-87` asserts zero `known-good-*` dirs and zero scans after refusal of both ops.
- **repair-nodes gate** (`:490-502`): pre-dispatch refusal with `requiredAction` when `crashRootCauseAddressed !== true`; status `aborted`, never `committed`. Test at `:89-102`. The old skip branch inside `dispatchOperation` (`:327-335`) still exists but is unreachable from production: `dispatchOperation` is module-private with a single call site after the gate (`:513`), and a caller sweep confirms no other importer of the recovery functions (`rg` across non-test TS: only `lib/apply-orchestrator.ts`). MCP (`handlers/apply.ts:24`) and daemon CLI dispatch (`tools/code-graph-tools.ts:108-109`) both route through `applyCodeGraph`.
- **Dry-run ordering** (`:445-468`): dry-run sits after the hard-stale gate but before the destructive gate, so an unconfirmed destructive dry-run on a fresh/soft-stale graph is allowed by design. Verified safe: the dry-run path runs pre/post batteries (read-only gold queries), `previewRollbackTarget` (read-only listing; `resolveDbDir`'s `mkdirSync` of dbDir is the only fs touch), apply-metadata + audit-log writes (by design). No snapshot, no dispatch, no retention. Conversely, a dry-run on a *hard-stale* graph without confirm aborts at `:429` before the preview — conservative-safe but means the rollback preview is unavailable exactly on hard-stale graphs (see F5).

**tri-025 / tri-027: CLOSED** — confirm is now required for both destructive ops regardless of staleness classification, gated before the snapshot, with `requiredAction` (the exact "fix wrong" hazard flagged in `verify/l2-still-real-batch.md` — gating after the snapshot — was avoided).
**tri-026 / tri-077: CLOSED** — the misleading committed-no-op is structurally unreachable; refusal is honest (`aborted` + `requiredAction`), audit and apply-metadata stay consistent (automation reading `apply.lastResult` sees the pre-existing `aborted` status, no new terminal status introduced). Playbook `:49` expects `requiredAction:"set_crash_root_cause_addressed"` *"or equivalent refusal"* — the actual text differs but the hedge covers it in substance.

### Hunt 2 — tri-028 correctness both ways

**(a) Operator rollback excludes its own snapshot: implemented.** `dispatchOperation` receives `currentRunKnownGoodDir` (`:265`, passed at `:513`) and forwards `excludeKnownGoodDirs: [knownGoodDir]` only in the `rollback-bad-apply` case (`:297`). Selection honors it via resolve-normalized set membership (`lib/recovery-procedures.ts:177-182`), applied inside `rollbackBadApply` at `:308`. Test `:104-128` proves with real sqlite marker content that the restore lands on the prior baseline, not the just-taken snapshot.

**(b) Failure-path rollbacks do NOT exclude: implemented, and the reasoning holds.** Both the dispatch-throw catch (`apply-orchestrator.ts:521-526`) and the postflight-fail branch (`:547-552`) call `rollbackBadApply` with no `excludeKnownGoodDirs`. Correct: those paths exist to restore the pre-dispatch state, which is exactly what the run-start snapshot holds. The in-code comment (`:516-520`) states the asymmetry explicitly.

**Edge probed: operator rollback failing midway.** The hunt's premise needs one mechanism correction: the orchestrator's catch path **cannot fire** for destructive ops, because both `rollbackBadApply` and `recoverSqliteCorruption` swallow all internal errors and return `status:'failed'` instead of throwing (`recovery-procedures.ts:333-350`, `:231-241`); even the injected `scan` runs inside their try blocks. The composite hazard therefore routes through the **postflight-fail branch**:

1. Operator rollback (confirm=true) takes snapshot S_new (suspect state), quarantines the live triplet, restores prior baseline B, then fails (e.g. `wal_checkpoint` throws on a corrupt restore) → returns `status:'failed'` without throwing.
2. The orchestrator never inspects `recovery.status` → proceeds to postflight.
3. If postflight **fails** → second, unexcluded rollback selects S_new (lexicographically latest) and restores the **run-start suspect state**, returning `status:'rolled-back'`.
4. If postflight **passes** (e.g. the partial restore still answers the battery) → the run reports `status:'committed'` with `recovery.status:'failed'` buried in the payload.

**Honest severity assessment:** no data loss in any branch — the suspect triplet survives in the `bad-apply-*` quarantine and baseline B is untouched (`restoreTriplet` copies, never moves, `recovery-procedures.ts:135-146`). Branch 3's net state is the consistent run-start state (status quo ante), strictly better than pre-fix behavior where even a *successful* operator rollback restored the suspect snapshot. The residual defect is honest-status, not state-safety: a failed recovery can surface as `committed`/`rolled-back` (F2, P2). One sharper nuance: the suspect snapshot S_new stays in the chain, so a *retry* of the failed rollback (run 2, excluding only its own S_new2) selects S_new1 — the suspect state again — and B recedes one slot per attempt. Equivalently, two back-to-back successful operator rollbacks form an undo-of-undo (run 2 restores what run 1 removed). Defensible as "restore the latest known-good," but operators expecting monotonic walk-back will be surprised (folded into F2).

**tri-028: CLOSED** — the shipped, single-run contract ("operator rollback never restores the snapshot it just took; failure paths deliberately do") is implemented, tested with real DB content, and correctly reasoned. The multi-run retry residual and the recovery-status blindness are follow-ons, not reopeners: both are pre-existing-mechanism compositions, and both leave the system strictly safer than the pre-fix no-op restore.

### Hunt 3 — Retention safety (tri-151)

- **(a) Current run's snapshot:** doubly protected. The only production call site passes `protectDirs: [knownGoodDir]` (`apply-orchestrator.ts:578-583`), checked first in `removeDir` (`recovery-procedures.ts:394-397`); independently, the just-taken snapshot is the newest and therefore inside the `slice(-keepKnownGood)` keep window (`:406-408`, `keepKnownGood` floored at 1, `:388`). Test `:179-220` proves protect beats the keep window even for a snapshot *outside* it.
- **(b) Imminent rollback's target:** within a run, impossible — retention runs only on the committed path (`apply-orchestrator.ts:574-595`), after which no rollback can occur in that run; refusal/abort/dry-run/rolled-back paths all return before it. Across runs: a future operator rollback selects newest-minus-own = 2nd-newest, inside the default keep-3 window; a future failure-path rollback selects its own fresh snapshot. A cross-**process** TOCTOU exists in theory (process B selects a target, process A's retention prunes it before B's `restoreTriplet`), but it requires ≥3 snapshots created between B's selection and restore, and the deployed topology is a single warm daemon owning the apply path — negligible, noted as F7.
- **(c) Undatable directories:** the age scan prunes only when `artifactDirAgeMs` returns non-null (`:435-437`); unparseable names return null and are kept (`:358-373`). Tested (`quarantine-manual-keep` survives, test `:218`). The regex correctly inverts the `timestamp()` substitution (`:73-75` vs `:363-367`). Note the known-good *count* prune is by design not age-gated; a non-timestamped `known-good-*` name sorts after timestamps ('b' > '2') and is therefore kept — fail-open direction, but such names hog keep-window slots (F8).
- **Never runs on refusal/rollback paths:** confirmed — single call site at `:578`, reached only after `recordApplyMetadata({status:'committed'})` (`:571`). Errors are collected, and the call is additionally wrapped in try/catch so retention can never break the commit (`:577-595`).
- **Coverage matches the disk evidence:** all four artifact classes from the original finding are handled — `known-good-*` (count-kept, both roots), `bad-apply-*` in auditDir, `recovery-*`/`quarantine-*` in dbDir (`:415-418`). The `apply-*.jsonl` audit logs are not pruned (small; F9).

**tri-151: CLOSED** — the sequencing hazard called out in the original finding ("pruning must never delete the rollback target; sequence with tri-028") is the exact design implemented: shared selection mechanism, post-commit-only, protect + keep-newest + age-dated + fail-open.

### Hunt 4 — previewRollbackTarget vs live selection

Same roots, same sort, same exclusion semantics. `previewRollbackTarget` (`recovery-procedures.ts:189-193`) and `rollbackBadApply` (`:296-297`, `:308`) both resolve `dbDir` via `resolveDbDir` (default `DATABASE_DIR`) and `auditDir` via `resolve(auditDir ?? join(dbDir,'apply-audit'))`, then call the identical `findLatestKnownGood` over `listKnownGoodDirs` (`:161-182`) with resolve-normalized exclusion. The dry-run call site (`apply-orchestrator.ts:451-453`) passes the same `options.dbDir`/`options.auditDir` the live dispatch uses (`:272`, `:292-298`). The preview intentionally passes no exclusions: at preview time the current run's snapshot does not exist (dry-run never snapshots), while the live run excludes the snapshot it just created — so both name the same directory, the prior baseline. Parity is asserted directly (test `:169-177`) and end-to-end (dry-run names the same dir the live run restores, tests `:130-152` vs `:104-128`). The no-target case returns `rollbackTarget: null` with an explicit message that matches actual live behavior — `rollbackBadApply` with no target quarantines without restoring (`recovery-procedures.ts:308-312`), exactly as the message warns (`apply-orchestrator.ts:465`). Test `:154-167`.

**tri-075: CLOSED.**

### Hunt 5 — Type/contract drift

- `requiredAction?: string` and `rollbackTarget?: string | null` added to `ApplyRunResult` (`apply-orchestrator.ts:99-102`) — both optional, purely additive. `tsc --noEmit` exits 0.
- **MCP handler** (`handlers/apply.ts:24-28`) returns `{status, result}` with the whole result object — new fields pass through with zero handler changes.
- **Daemon/CLI dispatch** (`tools/code-graph-tools.ts:108-109`) → same handler. The CLI's blocked-payload normalization (`code-index-cli.ts:783-807`) only rewrites `status:'blocked'` payloads; apply uses `aborted`, so the payload renders as full JSON (json/jsonl) or stringified JSON (text fallback, `:816-821`) — new fields visible, nothing dropped, nothing broken.
- **No new statuses:** `ApplyResultStatus` (`lib/apply-metadata.ts:7`) is unchanged; refusals reuse pre-existing `aborted`, so `code_graph_status`'s `apply.lastResult` consumers see no novel value. No consumer found switching on result fields in a way the new fields break (the pipeline-safety tests mock only `persistApplyMetadata`, which the orchestrator's import set confirms is its sole apply-metadata dependency).

### Hunt 6 — Tests

Ran from `mcp_server/`: `npx vitest run tests/code-graph-apply-pipeline-safety.vitest.ts tests/code-graph-apply-orchestrator.vitest.ts tests/code-graph-recovery-procedures.vitest.ts tests/code-graph-apply-e2e.vitest.ts` → **4 files passed, 30 tests passed** (7 new + 23 existing), 334ms. The commit adds only the new test file; the existing suites are untouched and contained zero assertions on repair-nodes/rollback operations (grep confirmed), so no test was weakened to accommodate the behavior change. The new tests assert behavior, not implementation: real sqlite marker content round-trips, refusal-leaves-no-artifact, preview/live parity, and a retention protection matrix. `launcher-lease.vitest.ts` was not run per scope (known pre-existing failure, L4 lane).

### Hunt 7 — Playbook/doc reconciliation

`manual_testing_playbook/08--doctor-code-graph/code-graph-apply-sub-operations.md`:
- Step 3 (`:42-49`, repair-nodes refusal with `requiredAction`): **now matches** (hedged wording covers the different action string).
- Step 4 (`:51-57`, recover-sqlite-corruption refuses without confirm): **now matches unconditionally** — pre-fix this promise only held on hard-stale graphs.
- Step 5 (`:59-68`, dry-run reports the rollback target / prior baseline): **now matches** (`rollbackTarget` + message).
- Step 2's prune-excludes mutation warning ("dispatch THROW and roll back") remains accurate post-fix.
- Precondition `:18` ("apply-mode writes one before destructive operations") remains accurate — snapshot still precedes destructive *dispatch*, now after the confirm gates.
- No new doc/code mismatch created by the combination, with two safe-direction understatements and one nuance flagged below (F4, F5).

`tool_surface.md:50` ("no automatic VACUUM or checkpoint policy") is scoped to DB-file compaction (tri-154) and does not contradict the new artifact retention.

---

## Follow-ons (none reopen the verdicts)

- **F1 (P1, operational): the fix is not live on the MCP daemon surface until dist is rebuilt.** `dist/lib/apply-orchestrator.js` and `dist/lib/recovery-procedures.js` are dated Jun 11 21:19 (pre-commit) and contain none of the new symbols (no `DESTRUCTIVE_OPERATIONS`/`previewRollbackTarget`/`pruneApplyArtifacts`). The launcher serves `dist/index.js` and rebuilds only when it is *missing* (`.opencode/bin/mk-code-index-launcher.cjs:721-738`, existence-only `artifactsReady`). The CLI front door fails loudly on stale dist (`.opencode/bin/code-index.cjs:85-100`), but the MCP path will keep executing pre-fix code — including the unconditional-confirm bypass and the self-snapshot rollback — until `tsc -p .opencode/skills/system-code-graph/tsconfig.json` (or `/doctor:update`) runs.
- **F2 (P2): the orchestrator never inspects `recovery.status`.** A `rollbackBadApply`/`recoverSqliteCorruption` that fails internally returns `status:'failed'` without throwing; the run can then report `committed` (postflight passed) or `rolled-back` after an unexcluded second rollback restores the run-start suspect snapshot (mechanism in Hunt 2). Pre-existing blindness, now more visible against the packet's honest-refusal standard. Suggested: treat `recovery.status === 'failed'` as a distinct terminal status before postflight. Related nuance: each operator-rollback run leaves a suspect-state snapshot as the new chain head, so rollback retries/repeats walk back onto it (run-scoped exclusion only).
- **F3 (P2): refusal-by-throw remnants dodge the new clean-refusal pattern.** repair-nodes with `crashRootCauseAddressed=true`, eligible rows, and `confirm!==true` throws inside dispatch (`apply-orchestrator.ts:350-353`), as do the prune-excludes medium/low gates (`:309-314`) — each triggering snapshot + quarantine + rollback churn and `status:'rolled-back'` for what is semantically a refusal (and accumulating exactly the refusal-path artifacts the new gates were built to avoid). Pre-existing; candidates for promotion to pre-snapshot gates.
- **F4 (P3, doc drift — safe direction):** `tool-schemas.ts:160` (`confirm` description) and `references/runtime/tool_surface.md:64` still say confirm is required "for hard-stale recovery" only; the code now requires it for destructive ops unconditionally. Docs understate the refusal surface (code refuses more than promised).
- **F5 (P3, consistency):** the hard-stale abort (`apply-orchestrator.ts:429-443`) carries no `requiredAction`, unlike the new refusals; and because it precedes the dry-run branch, a rollback dry-run preview is unavailable on hard-stale graphs without confirm. Playbook step 3 run on a hard-stale graph likewise returns the confirm refusal rather than the crash-root-cause refusal.
- **F6 (P3, reporting):** in the postflight-fail return, `...dispatchResult` is spread after the explicit `recovery` key (`apply-orchestrator.ts:558-568`), so the dispatch's recovery result masks the second rollback's recovery in the response (audit log retains both).
- **F7 (P3, pre-existing mechanism):** `listKnownGoodDirs` sorts full paths across two roots (`recovery-procedures.ts:161-175`); a legacy `known-good-*` directly under dbDir sorts after every `apply-audit/known-good-*` entry ('k' > 'a'), so it would win live selection and hog the retention keep window regardless of age. In practice `snapshotKnownGoodTriplet` writes only to auditDir (`:195-202`), so this fires only with manually/legacy-placed snapshots. Same class: cross-process retention/rollback TOCTOU (Hunt 3b) is unguarded but practically negligible under the single-daemon topology.
- **F8 (P3):** non-timestamped `known-good-*` names are never age-checked in the count prune and permanently occupy keep-window slots (fail-open direction, but can push real snapshots out of the window).
- **F9 (P3):** `apply-*.jsonl` audit logs have no retention (small files; the ~6x amplification was directory-driven).
