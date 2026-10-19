# Iteration 1: Correctness — relaunch core, killer, nudge, context-usage, CLI, wrapper

## Dispatcher

cli-devin `swe-2-max`, fan-out lineage `swe`, session `fanout-swe-1792349322065-8lohfl`. LEAF in-process iteration 1 of 3 (max-iterations stop policy). No steer.md present at iteration start.

## Dimension

**D1 Correctness** — logic, state transitions, error handling, edge cases on the relaunch core and the killer/lock surface rewritten by the remediation phase.

## Files Reviewed

- `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs` (1-717)
- `.skilled/hooks/session-relaunch/lib/killer.cjs` (1-530)
- `.skilled/hooks/session-relaunch/lib/nudge.cjs` (1-271)
- `.skilled/hooks/session-relaunch/lib/context-usage.cjs` (1-236)
- `.skilled/hooks/session-relaunch/bin/session-relaunch.cjs` (1-503)
- `.skilled/bin/skilled-loop` (1-507)

## Findings by Severity

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **Killer liveness check crashes on EPERM where the core treats it as alive** — `.skilled/hooks/session-relaunch/lib/killer.cjs:106-114` vs `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:612-622` — `targetIsRunning` rethrows every non-ESRCH error, so a `process.kill(pid, 0)` that returns EPERM (target re-owned by another uid, or a macOS SIP-protected pid the user can see but not signal) propagates out of the poll loop and kills the killer through `main().catch`; `core.isProcessAlive` deliberately counts EPERM as alive. The two liveness primitives disagree on the same syscall.
   Finding class: io-error-handling
   Scope proof: killer.cjs:108-112 (`if (error.code === 'ESRCH') return false; throw error;`); relaunch-core.cjs:617-620 (`error.code === 'EPERM'` → `return true`).
   Affected surface hints: killer supervise/wait loops; any arm path that respawns the killer.
   Case: target pid is alive but `kill(pid, 0)` returns EPERM — killer exits `killer-error` instead of supervising; the armed record waits for the next arm path to respawn it.

2. **`recordTimeout` gates unarm and notify on a pre-wait record snapshot** — `.skilled/hooks/session-relaunch/lib/killer.cjs:441` and `:403-421` — `watchedRecord` is read once before `waitForIdle`; the armed-status gate (`record?.status === 'armed'`) and `expectedHandoff` both come from that stale snapshot, while the SIGTERM path re-reads the record at `:456`. A record that flips pending→armed during the idle wait produces a timeout that skips `unarm` and `notifyManualClaim` entirely, stranding the fresh armed record until a later arm path respawns a killer.
   Finding class: concurrency
   Scope proof: killer.cjs:441 (`const watchedRecord = core.readRelaunchFile(...)` before `await waitForIdle`), :408 (`record?.status === 'armed'`), :412 (`expectedHandoff: handoffPath`), :480 (timeout path consumes `watchedRecord` only).
   Affected surface hints: killer timeout path; `core.unarm` expected-field guards.
   Case: record is `pending` at supervise start, adapter arms it mid-wait, transcript then vanishes past the grace window — `recordTimeout` sees `status: 'pending'`, skips `unarm`, and the armed record strands.

3. **`plannedNotePath` interpolates an unvalidated session id into the note filename** — `.skilled/hooks/session-relaunch/lib/nudge.cjs:191-195` — `sessionId.slice(0, 8)` is concatenated into the handoff filename without the `SESSION_ID_PATTERN` validation that `stateFilePath` applies at `:219-226`. A session id whose first 8 characters hold `/` or `..` segments escapes `handoffs/` by one level (bounded to `.skilled/skills/.state/session-relaunch/` by the 8-char slice, but outside the directory every other component scans and `handoffPathWithinRepo` enforces).
   Finding class: input-validation
   Scope proof: nudge.cjs:194-195 (filename interpolation); nudge.cjs:219-226 (`validSessionId` gate exists but is unused here); session-relaunch.cjs:71-135 (`handoffPathWithinRepo` would reject the resulting path at prepare).
   Affected surface hints: every adapter that calls `plannedNotePath` with a runtime-supplied session id.
   Case: session id `../../ab...` produces `handoffs/<stamp>-../../ab....md`, which normalizes to `<state>/session-relaunch/ab....md`; `prepare` then refuses it as outside the handoffs directory, so the planned note can never prepare — a silent dead end written by the nudge itself.

4. **Lock-owner liveness trusts pid identity; a recycled pid pins a stale lock indefinitely** — `.skilled/hooks/session-relaunch/lib/killer.cjs:275-283` and `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:594-637` — both the fast-path owner check (`core.isProcessAlive(ownerPid)`) and the mutex-owner check at killer.cjs:333 treat "pid exists" as "killer alive". When a dead killer's pid is recycled by an unrelated long-lived process, the stale lock is never reclaimed: every new killer logs `killer-lock-held` and exits, so the armed record defers to the manual-claim path until the innocent process dies. No start-time or command-name check binds the pid to a killer.
   Finding class: concurrency
   Scope proof: killer.cjs:280 (`isProcessAlive(ownerPid)` → `killer-lock-held`); killer.cjs:333 (same check for the mutex owner); relaunch-core.cjs:612-622 (pid-existence semantics only).
   Affected surface hints: killer supervision takeover; `liveKillerPid` consumers in the arm paths.
   Case: killer dies, its pid is reused by `mds` or a user process within the stale window; every subsequent killer refuses takeover while that pid lives.

## Traceability Checks

None this iteration (traceability dimension runs in iteration 3). Cross-reference note: findings 1-4 cite only code evidence.

## Edge Cases

- `appendLog`'s newline repair (relaunch-core.cjs:573-579): two concurrent appenders can both compute a `\n` separator for the same partial tail — worst case a blank line between events, never a lost line. Ruled clean.
- `arm()` on an already-armed record returns the record without refreshing `armedAt` (relaunch-core.cjs:310); the stop-arm dedup contract is idempotent by design. Ruled clean.
- `specFolderFromSeed` skip suffix returns `'none'` only when the folder text is exactly `none` (nudge.cjs:156-159); a real folder cannot ride through the Skip suffix. Ruled clean.

## Confirmed-Clean Surfaces

- `acquireLock` takeover serialization (killer.cjs:268-389): exclusive `wx` create, single-holder mutex via `mkdir`, guarded owner re-read before unlink, inode-matched mutex release — the prior run's double-signal race (archived finding R2-P2-001) is closed.
- `appendLog` (relaunch-core.cjs:555-586): `a+` fd, `fchmod` 0600 re-pin, separator repair, `fsync` — matches the R1-P2-001 remediation claim.
- `handoffPathWithinRepo` (session-relaunch.cjs:71-135): lexical + parent-realpath + file-realpath checks — no symlink escape found.
- `shouldRelaunch` env/config precedence and EACCES→decline fail-closed path (session-relaunch.cjs:358-393).
- `skilled-loop` manual template parity with `manualClaimCommand` (skilled-loop:49-66 vs relaunch-core.cjs:520-544): both require exactly one `@@HANDOFF@@` token and apply the same double-quote + `!` escaping; balanced Skip suffix in both printers.
- `nextLevel` nudge ladder (nudge.cjs:209-216): two-step ladder at threshold and threshold+0.05 with `toFixed(6)` boundary math.
- `readTail`/`readClaudeFill` tail alignment (context-usage.cjs:38-114): partial first line dropped only when it fails to parse.

## Ruled Out

- Atomicity of the takeover lock unlink→create gap (killer.cjs:365-371): a fast-path creator that lands in the gap wins the file and the takeover contender backs off on EEXIST — a single supervisor remains. Verified by call-order read.
- Mutex takeover of a live holder: `staleMutex` requires either a dead recorded owner or an ownerless mutex older than 30 s (killer.cjs:325-335); a live holder is never displaced.

## Next Focus

- Dimension: D2 security
- Focus area: state-dir/env trust boundaries (`ensureStateDir`, `XDG_RUNTIME_DIR` fallback), signal/lock abuse, `osascript` notification command construction, path validation seams (`specFolderFromHandoff`, consume fallback parser), and the five runtime adapters' process/env handling.
- Reason: WS1/WS2 remediation touched every trust boundary; security reads the same files adversarially.
- Rotation status: 1/4 dimensions covered (correctness).
- Required evidence: file:line for every finding.

Review verdict: PASS
