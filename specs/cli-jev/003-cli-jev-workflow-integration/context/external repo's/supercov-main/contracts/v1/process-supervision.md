# Process-supervision contract v1

Supercov launches the already-working test command without runner-specific
semantic changes. On POSIX, the child starts a new process group and signals
target the group. Windows assigns the suspended root to a kill-on-close Job
Object before allowing it to execute.

POSIX execution is armed before the user command reaches `exec`: a forked copy
of the same Supercov binary leaves the target process group, closes every
unrelated inherited descriptor, acknowledges readiness, and then holds a
private liveness pipe. The command cannot start if that handshake fails. When
the supervising process exits normally, unwinds, or is killed by an
uncatchable signal, the pipe closes and the watchdog sends SIGKILL to the
complete target process group. This prevents the spawn-to-watchdog race and
also removes descendants that retain output pipes after their group leader
exits. Windows Job Objects use `KILL_ON_JOB_CLOSE` for the equivalent
parent-death boundary.

Long-running commands are never silent. By default, every 60,000 ms stderr
receives a sanitized process-tree snapshot containing elapsed time, PID, PPID,
executable basename, state, and CPU time where available. It never prints
arguments, environment values, or full executable paths. A preloaded Node
descendant may additionally report counts from `process.getActiveResourcesInfo`.

`SUPERCOV_DIAGNOSTIC_INTERVAL_MS` changes that interval and must be a positive
integer. There is no default kill deadline. `SUPERCOV_COMMAND_TIMEOUT_MS` is an
explicit positive-integer deadline; on expiry Supercov logs the reason, sends
SIGTERM to the full child tree, escalates to SIGKILL after 5,000 ms, and exits
124. Invalid values fail before a child is spawned.

User SIGHUP/SIGINT/SIGTERM is forwarded cooperatively, records interrupted
state, and escalates if the child refuses to exit. Spawn errors and signals are
not reported as successful tests. Diagnostic/probe machinery must never keep a
completed child or the Supercov CLI alive.

One supervision session owns signal handlers across every sequential and
parallel child in the run. A received signal remains visible to all active
process groups until that session ends; it is not consumed by the first worker.
Captured stdout and stderr are drained concurrently and remain separate, so
containment cannot change output ordering within either stream or deadlock on
pipe capacity.
