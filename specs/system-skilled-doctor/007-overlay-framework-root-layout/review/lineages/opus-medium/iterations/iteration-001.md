# Iteration 001 - Frontier node F-1-001: correctness

## Dispatcher

- Lineage: opus-medium (fan-out), session fanout-opus-medium-1795192401900-xpt66n, generation 1
- Node: F-1-001 (relayout rollback, writeBackup split, mid-loop failure test), dimension correctness
- Review focus addressed: verified prior R1-P1-001 (relayout half-move) and R13-P2-002 (writeBackup one-line nested loop) against the remediated engine, and checked the new rollback for regressions.
- Sources: steer.md absent; strategy, config, frontier block for F-1-001.

## Files Reviewed

- `.skilled/commands/doctor/scripts/overlay-engine.cjs:6190-6559` (planRelayout, copyForBackup, relayoutLinkTargets, planRelayoutManifest, retargetRelayoutLink, missingRelayoutParents, rollbackRelayout, relayoutUnderLock)
- `.skilled/commands/doctor/scripts/overlay-engine.cjs:4624-4700` (writeBackup)
- `.skilled/commands/doctor/scripts/overlay-engine.cjs:272-299` (writeFileAtomic, ensureSymlink), `:2690-2758` (isEnvName, isProtectedReadPath)
- `.skilled/commands/doctor/scripts/tests/overlay-engine-follow-up.test.cjs:1110-1227, 1394-1415`
- `.skilled/commands/doctor/assets/doctor-overlay-apply.yaml:116`
- Test run: `node --test --test-name-pattern=relayout overlay-engine-follow-up.test.cjs` -> 19 pass, 0 fail, exit 0.

## Findings by Severity

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **The restore-failed message says the backup holds every moved copy, but the backup skips token-named files** -- .skilled/commands/doctor/scripts/overlay-engine.cjs:6534 -- When a rollback rename fails, the operator is told "the backup at ... holds every moved copy and the manifest as it was". copyForBackup (`overlay-engine.cjs:6278-6281`) skips every token-named file the manifest does not name exactly, and the test at `overlay-engine-follow-up.test.cjs:1140` confirms such a file is absent from the backup. The apply workflow (`doctor-overlay-apply.yaml:116`) then tells the operator to restore the overlay folder from that backup, so following the message replaces a moved folder with a copy missing its token file.
   - Finding class: message-contract drift
   - Scope proof: only the restore-failed branch at overlay-engine.cjs:6533-6536 makes the claim; the success and clean-rollback branches do not.
   - Affected surface hints: overlay-engine.cjs relayoutUnderLock catch block; doctor-overlay-apply.yaml relayout failure guidance.
   - Case: a directory entry whose source holds assets/api-token.js not named in protectedPaths, relayout moves it, the relink fails and the rollback rename of that folder also fails; the operator restores from the backup and the token file is not in it.

2. **No test covers the branch where the relayout rollback itself fails** -- .skilled/commands/doctor/scripts/overlay-engine.cjs:6533 -- The three failure tests (`overlay-engine-follow-up.test.cjs:1196, 1212, 1394`) all inject one failure and let the rollback succeed. The restore-failed branch, which keeps the backup and prints the line the apply workflow parses ("the restore also failed"), and the backup-not-removed branch at `:6541-6546`, run under no test. A change that deletes the backup in the restore-failed branch, or rewords the line the workflow keys on, passes the suite.
   - Finding class: test-gap
   - Scope proof: grep for "restore also failed" finds it only in the engine and the apply YAML, never in tests/.
   - Affected surface hints: overlay-engine-follow-up.test.cjs relayoutWithFailingRename helper (can fail call N and a later call).
   - Case: relayoutWithFailingRename failing the second move and also the rollback rename of the first move; no current test runs this.

## Prior-Finding Verification

- R1-P1-001 (relayout half-move): FIXED. Every step after the backup is recorded in `done` (`overlay-engine.cjs:6512-6529`) and undone newest-first by rollbackRelayout (`:6420-6444`); manifest refusals moved ahead of the first rename via planRelayoutManifest (`:6482-6488`); pruning deferred to after success (`:6554`). Tests at `follow-up.test.cjs:1196` and `:1212` compare a full folder snapshot before and after, so without the rollback they fail (one copy would stay moved).
- R13-P2-002 (writeBackup one-line nested loop): FIXED. Tree and overlay areas now back up in two separate loops (`overlay-engine.cjs:4684-4697`) with a shared backUpEntry closure.

## Traceability Checks

- spec_code: partial. Engine behavior matches the phase 006 rollback claim (code above); restore-failed message overclaims (finding 1).
- checklist_evidence: not run this iteration (node F-1-007 owns it).

## Integration Evidence

- `.skilled/commands/doctor/assets/doctor-overlay-apply.yaml:116` keys on the "restore also failed" and "back as they were" line endings; the engine prints both (`overlay-engine.cjs:6534, 6548`).

## Edge Cases

- Backup copy failure (copyForBackup throws before the try at `:6501-6504`) leaves a partial relayout-runs/<stamp> folder but moves nothing; not a half-move, recorded as ruled out.
- A move whose destination sits inside another move's source is impossible because destinations are always under framework/ or root/ and sources are off-layout; ruled out.
- Link rollback: retargetRelayoutLink records the change after the unlink (`:6391-6392`), so a failed ensureSymlink still gets the old link back through ensureSymlink in rollback (`:6430`).

## Confirmed-Clean Surfaces

- writeFileAtomic temp-and-rename (`:272-288`); manifest restore only when written (`:6525, 6432`).
- createdDirs removed only when empty (`:6440`).

## Ruled Out

- Half-moved folder on manifest-plan refusal: refusal happens before the first rename (`:6482-6488`).
- Double-counted created folders across moves: missingRelayoutParents runs per move after earlier mkdirs (`:6517`).

## Next Focus

- Dimension: correctness
- Focus area: frontier node F-1-003 (docs against engine)
- Reason: rotate across frontier nodes, one node and its next uncovered dimension per iteration
- Rotation status: F-1-001 correctness done; security, traceability, maintainability remain for F-1-001
- Required evidence: doctor-overlay-presentation.txt LAYOUT remedies vs overlay-engine.cjs:3689-3710

Review verdict: PASS
