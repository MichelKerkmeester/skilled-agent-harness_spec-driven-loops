# Iteration 005: traceability (spec_code close-out)

## Dispatcher

- Iteration: 5 of 5 (JSONL-derived: four prior iteration records, 1-4; this is 5; no mismatch)
- Dimension: traceability, `spec_code` close-out for the docs prior iterations did not reach
- Session: `2026-11-17T06:46:29Z`, generation 3, lineageMode restart
- Operator focus: covered by checking the shared `lib/killer.cjs` lock contract that every runtime's arm path starts, and the `bin/session-handover.cjs` CLI surface that all five adapters print, against their docs.

## Files Reviewed

- `.skilled/hooks/session-handover/goal-carry-over.md:25-75` (killer lock, takeover mutex, relaunch path)
- `.skilled/hooks/session-handover/bin/README.md:19-42` (subcommands, exit codes)
- `.skilled/hooks/session-handover/troubleshooting.md:27-90` (prepare exits, killer log lines)
- `.skilled/hooks/session-handover/bin/session-handover.cjs:911-1019`
- `.skilled/hooks/session-handover/bin/history-lookup.mjs:30-48`
- `.skilled/hooks/session-handover/lib/killer.cjs:26-38,455-592,634-815`
- `.skilled/hooks/session-handover/lib/relaunch-core.cjs:2157-2193`

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **troubleshooting.md gives an incomplete cause for `killer-lock-stale`** -- .skilled/hooks/session-handover/troubleshooting.md:67 -- The row says the cause is "The owner process is gone or the unreadable lock is older than five seconds". The code also treats a lock as stale when its owner pid is alive but the recorded expiry has passed, or a two-field lock is past the legacy age bound. `acquireLock` only returns early when `core.isProcessAlive(ownerPid) && !expired` [SOURCE: .skilled/hooks/session-handover/lib/killer.cjs:487], and `readLockState` derives `expired` from the third field or from the creation stamp plus `LEGACY_LOCK_MAX_AGE_MS` [SOURCE: .skilled/hooks/session-handover/lib/relaunch-core.cjs:2172-2179]. `goal-carry-over.md:31` documents the expiry rule, so the two docs disagree on what this event means.
   Finding class: doc drift, symptom table narrower than the code path
   Scope proof: every `killer-lock-stale` emitter enumerated: one, at `killer.cjs:576`, reached after the expiry-aware gate at `killer.cjs:487`.
   Affected surface hints: `.skilled/hooks/session-handover/troubleshooting.md:67`
   Case: an operator sees `killer-lock-stale` logged while `ps` shows the recorded owner pid alive (a reused pid after the lock's expiry), and the table tells them that cannot happen.

## Traceability Checks

| Protocol | Status | Evidence | Notes |
|---|---|---|---|
| `spec_code` | partial | `goal-carry-over.md:29-51` vs `killer.cjs:26-38,487,534,576,592` and `relaunch-core.cjs:2165-2179`; `bin/README.md:34-42` vs `session-handover.cjs:922-926,991-1011` and `history-lookup.mjs:30-48`; `troubleshooting.md:62-81` vs `killer.cjs:576-815` | Lock constants (15000, 3000, 60000, 5000, 30000, 10 min), the `ENOENT`/`EACCES`/`EISDIR` no-owner rule, the `ENOTDIR` mutex rule, all eleven CLI subcommands, the `cancel` exit-1 message and both `history-lookup` refusal codes match. Every killer event in the troubleshooting table has an emitter. One drift (R5-P2-001). `claude/README.md`, `pi/README.md` and `lib/README.md` were not read within the budget, so this stays partial. |

## Integration Evidence

- `bin/session-handover.cjs` `cancel` → `lib/withdraw.cjs` `withdrawHandOver` (`session-handover.cjs:922`), already ruled out as a bypass in iteration 4.
- `lib/killer.cjs` → `lib/relaunch-core.cjs` `readLockState` / `lockOwnerPid` (`killer.cjs:482,530`).

## Edge Cases

- Partial coverage: three per-runtime READMEs remain unchecked against code; `spec_code` is recorded as `partial`, not `pass`.
- `troubleshooting.md:58` says the killer polls every 100 ms; no constant by that name was located in the grep, so that claim is unverified rather than disproved.

## Confirmed-Clean Surfaces

- `goal-carry-over.md` §2 lock and takeover-mutex constants and log events.
- `bin/README.md` subcommand list and exit-code contract.
- `troubleshooting.md` killer event inventory (every named event has an emitter).

## Ruled Out

- Doc drift in the killer lock constants: all six values match `killer.cjs:26-38`.
- `bin/README.md` subcommand list drift: matches the dispatch switch at `session-handover.cjs:991-1002`.
- Owner-read error codes drift: `relaunch-core.cjs:2165` handles exactly `ENOENT`, `EACCES`, `EISDIR`; `killer.cjs:534` handles `ENOTDIR`, as both docs state.

## Next Focus

- Dimension: none; max-iterations reached, synthesis next.
- Focus area: if a later run reopens, `claude/README.md`, `pi/README.md`, `lib/README.md` against code, and the 100 ms poll claim at `troubleshooting.md:58`.
- Reason: these are the only `spec_code` surfaces not reached.
- Rotation status: all four dimensions covered (4/4).
- Productive carry-forward: enumerate every emitter of a documented event, then diff the doc's cause column against the gate that precedes the emitter.

Review verdict: PASS
