# Iteration 7: The relaunch decision and the killer's idle detection

## Focus

The half of the hop that runs after the sender stops. A hop can fail before any text is written: the killer may never signal, or the wrapper may decline the relaunch. Both are silent, because the sender has already ended its turn and nothing is left to report the failure. This iteration enumerates the decline reasons and the killer's give-up conditions.

## Actions Taken

1. Read `shouldRelaunch` in the core and its six decline reasons.
2. Read the `should-relaunch` command wrapper and its exit-status contract.
3. Read the wrapper's post-runtime decision branch.
4. Read the killer's idle wait, transcript grace and timeout constants.
5. Read the killer's ancestry check.
6. Read the Pi run's relaunch log to confirm the path worked there.

## Findings

1. `shouldRelaunch` declines with one of six named reasons: `no-file`, `not-armed`, `withdrawn`, `stale`, `hop-cap` and `incomplete-record`. Only a record that passes every check returns `{ relaunch: true }` with no reason. [SOURCE: .skilled/hooks/session-handover/lib/relaunch-core.cjs]

2. A record armed in the future is read as `stale`, not fresh, because a clock that stepped back makes the record's age unknown and stale is the safe reading. [SOURCE: .skilled/hooks/session-handover/lib/relaunch-core.cjs]

3. The hop count is read as stored and never coerced, so a malformed or hand-edited record cannot slip under the cap by turning `null` into `0` or `"3"` into `3`. [SOURCE: .skilled/hooks/session-handover/lib/relaunch-core.cjs]

4. The wrapper calls `should-relaunch` only after the runtime process exits, and a non-zero status takes the decline path, which preserves the runtime's own exit code rather than replacing it. [SOURCE: .skilled/bin/skilled-loop:1263]

5. The killer's transcript grace is 1000 ms: a transcript that stays missing for one second makes `waitForIdle` return false, which un-arms the session, so no signal is sent and no hop happens. [SOURCE: .skilled/hooks/session-handover/lib/killer.cjs:23]

6. The killer's default timeout is 30000 ms. A session that never goes idle within that window is left running and the hop does not happen. [SOURCE: .skilled/hooks/session-handover/lib/killer.cjs:29]

7. `isLoopAncestor` throws on a failed process-table read, and the killer refuses to signal rather than guess at ancestry, so a process-table failure blocks the hop instead of risking a wrong kill. [SOURCE: .skilled/hooks/session-handover/lib/killer.cjs:220]

8. The Pi live run shows the path working end to end: prepare at 05:32:49.151, killer signal to pid 46361 at 05:32:57.828, relaunch at 05:32:58.064 with reason `ready`. The Pi failure was therefore downstream of the relaunch, not in it. [SOURCE: specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/011-opencode-pi-handover-parity/scratch/runs/base1-pi/relaunch.log]

## Ruled Out

- "The Pi hop failed to relaunch." Its relaunch log records a `ready` relaunch 0.2 seconds after the signal.
- "A decline is reported to the operator." The decline path preserves the runtime's exit code and prints a warning only when the decision command itself fails, so a normal decline is silent.

## Dead Ends

- Looking for a retry after a decline. There is none; the wrapper takes the decline path once and exits.

## Edge Cases

- Ambiguous input: "fail to finish the sender's task" could mean the hop never starts or the receiver does not finish. This iteration covers the first; iterations 1 and 6 cover the second.
- Contradictory evidence: none.
- Missing dependencies: the OpenCode run's relaunch log was not read, so the OpenCode killer path is unproven here.
- Partial success: the decline reasons are enumerated from code, not observed in a run.

## Sources Consulted

- `.skilled/hooks/session-handover/lib/relaunch-core.cjs`
- `.skilled/hooks/session-handover/lib/killer.cjs:23`
- `.skilled/hooks/session-handover/lib/killer.cjs:29`
- `.skilled/hooks/session-handover/lib/killer.cjs:220`
- `.skilled/bin/skilled-loop:1263`
- `specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/011-opencode-pi-handover-parity/scratch/runs/base1-pi/relaunch.log`

## Assessment

- New information ratio: 0.75
- Questions addressed: the relaunch decision and the killer's idle detection
- Questions answered: none new; this iteration bounds the pre-text failure surface

## Reflection

- What worked and why: reading the decline reasons as a closed set made the failure surface finite. Six reasons is a list a test can cover exhaustively, which is what the packet needs.
- What did not work and why: assuming a decline would be visible. The wrapper deliberately preserves the runtime's exit code, so a declined hop looks exactly like a normal session end.
- What I would do differently: read the relaunch log before the code, because it proves which half of the hop the Pi failure was in and would have saved a pass over the killer.

## Recommended Next Focus

The History Lookup CLI's own failure surface: locator minting, the freshness bound, and the workspace check that withholds the offer.

## Fixes Named

- Log a declined relaunch to the status ledger with its reason, so a silent decline is visible after the fact instead of only in the handover log. [SOURCE: .skilled/bin/skilled-loop:1263]
- Raise or make configurable the killer's 1000 ms transcript grace, so a slow filesystem does not un-arm a live session. [SOURCE: .skilled/hooks/session-handover/lib/killer.cjs:23]
- Have the scorecard record the decline reason when a hop does not relaunch, so a 0/5 run names its cause. [SOURCE: .skilled/hooks/session-handover/lib/relaunch-core.cjs]
