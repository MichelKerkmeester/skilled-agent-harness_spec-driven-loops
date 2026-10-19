# Iteration 2 - Security

**Focus:** security  
**Target:** `specs/hooks/023-session-relaunch-loop`  
**Session:** `fanout-luna-1792349322065-8lohfl`  
**Timestamp:** 2026-10-18T19:04:03Z

## Focus

security

## Review scope

This pass followed state-directory selection and permissions, handoff path checks, killer lock takeover, transcript disappearance, and the target-process signal path. The earlier correctness finding remains open. The general packet migration and graph-seed steps remain skipped under the lineage-only write boundary.

## Findings

Findings by severity.

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **[LUNA-002] The fallback state directory is shared across users on systems with a shared temp directory.** `stateDir` uses `os.tmpdir()` when `XDG_RUNTIME_DIR` is unset and appends the fixed name `skilled-relaunch` (`relaunch-core.cjs:20,143–145`). `ensureStateDir` accepts an existing path through recursive `mkdir` and then chmods it (`relaunch-core.cjs:42–46`). On a system where the temp directory is shared, such as Linux `/tmp`, a local user can pre-create `/tmp/skilled-relaunch`; another user's setup then fails when `chmod` reaches a directory owned by the first user. This lets one local account deny relaunch state to another in the fallback configuration. The killer test fixture always supplies a private `XDG_RUNTIME_DIR` (`killer.test.cjs:22–43`), so its source does not cover the fallback. This is a conditional static finding; running with shared `os.tmpdir()`, unset `XDG_RUNTIME_DIR`, and a pre-created directory would confirm it. Use a per-user fallback path and verify ownership before chmod or use.

2. **[LUNA-003] The killer can signal a reused PID after its ancestry check.** `supervise` validates that the target PID is descended from the loop (`killer.cjs:449`), checks liveness, reads the armed record, and later calls `process.kill` on the same numeric PID (`killer.cjs:453–464`). If the target exits and the operating system reuses that PID in the intervening window, the signal can reach the replacement process. The checks reduce the window but do not bind the signal to the process identity that passed the ancestry check. This is a low-probability static inference; a controlled PID-reuse seam or an OS process handle would confirm or close the gap. Consider revalidating process identity immediately before signaling and using a stable process handle where supported.

## Search depth

- **Scope class:** complex; strict evidence tracking for this pass.
- **Target selection:** shared state-directory helper, handoff path validator, killer lock takeover, transcript idleness, and target PID validation/signal.
- **Search mode:** graphless fallback. Coverage graph and semantic search were unavailable because graph seeding writes outside the lineage and no graph was supplied.
- **State namespace:** found conditional cross-user denial path at `relaunch-core.cjs:42–46,143–145`.
- **Handoff path escape:** no static escape found; the CLI checks the real handoff directory, parent, and existing file resolution (`session-relaunch.cjs:94–134`).
- **Stale lock takeover:** no duplicate takeover found in the inspected code; a mutex guards owner recheck and lock replacement (`killer.cjs:285–388`), and test source exercises two contenders (`killer.test.cjs:1074–1112`).
- **Transcript disappearance:** sustained absence ends the wait without signaling; a short missing interval is tolerated (`killer.cjs:157–168`); test source covers disappearance (`killer.test.cjs:958–982`).
- **Target signal scope:** ancestry and armed-state checks precede `SIGTERM`; the remaining concern is the numeric PID reuse interval between validation and signal (`killer.cjs:449–464`).

## Verification limits

This is source inspection only; tests were not run. The fallback-directory and PID-reuse cases are conditional and need an isolated harness to reproduce. No P0 or P1 issue was identified in the inspected paths.

## Next focus

Trace packet requirements, phase summaries, and evidence links against the implementation and this lineage's findings; inspect claims that may be stale or unsupported.

## Assessment

Dimensions addressed: security

Review verdict: PASS
