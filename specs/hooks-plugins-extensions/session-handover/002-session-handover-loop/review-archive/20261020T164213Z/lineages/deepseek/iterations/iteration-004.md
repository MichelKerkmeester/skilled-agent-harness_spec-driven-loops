# Iteration 4: Maintainability — stale-lock housekeeping and freshness edges

## Focus

- Dimension: maintainability, with a correctness edge in the freshness decision
- Scope: the killer's stale-lock cleanup and takeover leftovers, the freshness gate shared by the wrapper and the nudge, and the remaining process-table duplication.
- Review target: `specs/hooks/023-session-relaunch-loop`

## Files Reviewed

- `.skilled/hooks/session-relaunch/lib/killer.cjs:204-242, 244-268, 274-317, 347-466, 539-606`
- `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:403-425, 632-716, 726-771`
- `.skilled/hooks/session-relaunch/lib/nudge.cjs:312-339`
- `.skilled/hooks/session-relaunch/bin/session-relaunch.cjs:444-479`
- `.skilled/hooks/session-relaunch/tests/killer.test.cjs:619-860, 1481-1845`
- `.skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs:543-605, 938-970`
- `.skilled/hooks/session-relaunch/README.md:97-103, 164-183`

## Findings

### P0 Findings

None.

### P1 Findings

None new in this iteration; the active P1 DS-004 from iteration 3 remains open, so this iteration's verdict stays CONDITIONAL.

### P2 Findings

1. **A crash between the stale-lock rename and its removal leaves an unswept lock backup** -- `.skilled/hooks/session-relaunch/lib/killer.cjs:234-242` -- `removeStaleLock` renames a non-file at the lock path to `${lockPath}.stale-<pid>-<uuid>` and then calls `fs.rmSync`. The only stale-artifact sweep is `sweepStaleTakeovers` at `:291-317`, whose prefix is `${basename(lockPath)}.takeover.stale-`; it never matches the lock backup name, and `rg -n "stale-"` finds the two producers and no cleaner for the lock form.
   Case: the killer is killed with SIGKILL or crashes after the rename but before the removal. The lock path is free, so a later killer proceeds, but the `.stale-` file remains in the private state directory. Repeated takeovers accumulate copies, and an operator reading the directory cannot tell them from a live lock without opening each file.
   Finding class: class-of-bug
   Scope proof: the only cleanup prefix in the module is the takeover prefix; the stale-directory test at `.skilled/hooks/session-relaunch/tests/killer.test.cjs:830-859` asserts successful removal, not a crash leftover.
   Affected surface hints: ["killer stale-lock takeover", "runtime state directory", "operator diagnostics"]
   Evidence: `.skilled/hooks/session-relaunch/lib/killer.cjs:234-242` and `:291-317`; the test at `.skilled/hooks/session-relaunch/tests/killer.test.cjs:830-859` covers the normal path.
   User impact: unbounded state-directory litter and ambiguous diagnostics; no direct signal or data-loss effect.
   Recommendation: sweep `${basename(lockPath)}.stale-*` entries older than a bounded age under the same mutex, or move the backup to a temp name that a best-effort cleanup reaps; add a test with a pre-created lock backup.

2. **`shouldRelaunch` treats a future `armedAt` as fresh instead of stale** -- `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:403-417` -- the age check only rejects `nowMs - armedAtMs > ageLimitMs`. A negative difference, from a backward clock step or a manually written future timestamp, passes every guard, so an armed record can relaunch after its configured maximum age. Both the wrapper (`.skilled/hooks/session-relaunch/bin/session-relaunch.cjs:456-460`) and `nudge.armedRecordStillCurrent` (`.skilled/hooks/session-relaunch/lib/nudge.cjs:317-319`) use this single gate.
   Case: the host clock steps backward by more than ten minutes after a handoff is prepared, or a record is created with a future `armedAt`; the record remains "fresh" until the wall clock catches up, and a later runtime exit relaunches a handoff whose work may already have been resumed elsewhere.
   Finding class: algorithmic
   Scope proof: `shouldRelaunch` is the only freshness function; the wrapper and nudge both delegate to it, so a fix covers both readers.
   Affected surface hints: ["wrapper should-relaunch", "nudge handoffPending", "armed record freshness", "clock-step recovery"]
   Evidence: `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:410-417`; tests at `.skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs:562-605` cover only past-age and hop-cap cases.
   User impact: an old or clock-skewed handoff can relaunch unexpectedly; the hop cap still bounds the chain.
   Recommendation: treat `nowMs < armedAtMs - allowedSkewMs` as `stale`, with a small explicit skew allowance, and add a future-`armedAt` test for both the wrapper and `handoffPending`.

## Traceability Checks

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | partial | Active from iteration 3: parent six-child drift and handoff exit-3 drift. |
| `checklist_evidence` | partial | Active from iteration 3: missing run 10 log and phase 006 report path. |
| `skill_agent` | notApplicable | The target is a spec folder. |
| `agent_cross_runtime` | pending | Adapter parity is scheduled for iteration 5. |
| `feature_catalog_code` | pending | Catalog claims are scheduled for iteration 5. |
| `playbook_capability` | pending | Playbook claims are scheduled for iteration 5. |

## Ruled Out

- The duplicated process-table read is not a new defect: `core.findLoopChildPid` is the shared walk for the CLI and the adapters, and the killer keeps its own fail-closed `ps` read by design; the prior review's WS-5 fix is present (`.skilled/hooks/session-relaunch/bin/session-relaunch.cjs:237-243`, `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:750-771`).
- `lockIsExpired` is an exported helper with no production caller outside the core; it is tested at `.skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs:1051-1058` and is not a correctness hazard.
- The lock expiry and takeover paths pass their existing tests; the new finding is the crash-leftover cleanup, not the takeover race.
- The killer's no-transcript idle path remains an accepted, documented limit; it is not re-reported.

## Edge Cases

- The stale-backup finding depends on a crash precisely between `renameSync` and `rmSync`; it is a robustness gap, not a routine-path failure.
- The future-timestamp finding is conditional on a clock step or a hand-written record; normal records written by `toIsoTimestamp` are unaffected.
- A future `armedAt` also keeps `handoffPending` true, so the session stops being nudged; the impact is a missed handoff, not only an unexpected relaunch.

## Confirmed-Clean Surfaces

- The lock takeover still serializes through the mutex and an inode-checked release.
- The state directory and log modes remain correct.
- The wrapper's hop and age checks use the same function, so a future fix has one implementation point.
- The package remains within the documented tool-call budget for a read-only pass.

## Next Dimension

Broadened maintainability and traceability: the adapter payload sources for the carried spec folder, the Claude/Codex test coverage for that field, and the remaining documentation inputs that the runtime matrix does not name.

Review verdict: CONDITIONAL
