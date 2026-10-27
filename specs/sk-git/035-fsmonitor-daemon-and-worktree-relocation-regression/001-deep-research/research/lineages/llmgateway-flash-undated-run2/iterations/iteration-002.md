# Iteration 2: Git 2.50.1's daemon lifecycle and the wedge — an acknowledged infinite wait, not a repo bug

## Focus

Q2 and Q3 of the packet's section 8: git 2.50.1's documented fsmonitor daemon lifecycle on macOS (idle shutdown, `fsmonitor.socketDir`, `git fsmonitor--daemon stop` on a wedged daemon), and whether the hang is event overload or a known daemon deadlock around `--ipc-threads` or the cookie-file handshake. Evidence comes from the installed build's manual and the exact v2.50.1 sources that implement the lifecycle, the cookie handshake, and the IPC client read.

## Actions Taken

1. Read the installed build's manual (`man git-fsmonitor--daemon`, Git 2.50.1 Apple Git-155) for the documented lifecycle, socket placement and network-mount caveats.
2. Read the v2.50.1 source of `builtin/fsmonitor--daemon.c`: the config defaults (lines 35-42), `do_as_client__send_stop` (lines 84-101), the cookie wait (lines 190-215), the health-thread start (lines 1160, 1235), and the detach path (lines 1422-1502).
3. Read the v2.50.1 source of `compat/simple-ipc/ipc-unix-socket.c`: `ipc_client_send_command_to_connection` and its response read (lines 195-217), plus the accept/connect poll paths (lines 469, 654) to separate them from the response read.
4. Read the v2.50.1 sources of `compat/fsmonitor/fsm-health-darwin.c` and `compat/fsmonitor/fsm-health.h` for the health-thread contract and the Darwin implementation.
5. Checked the release notes of 2.51.0, 2.52.0 and 2.53.0 for any announced fsmonitor fix (zero entries each).

## Findings

1. The manual documents the daemon only as "a long running process used to watch a single working directory", with `start`, `run`, `stop`, `status` — no idle timeout, no lifetime bound, no self-exit condition. [SOURCE: man git-fsmonitor--daemon (Git 2.50.1)]
2. `fsmonitor.socketDir` only relocates the Unix socket when `.git` (or `$HOME`) is on a network-mounted filesystem; it has no bearing on lifecycle or on a native-filesystem checkout like this one. [SOURCE: man git-fsmonitor--daemon (Git 2.50.1)]
3. On macOS the health thread is an empty stub: `fsm_health__ctor`, `fsm_health__loop` and `fsm_health__stop_async` all return immediately, while the header contract says the health thread "should call `ipc_server_stop_async()` if it needs to cause a shutdown". The daemon therefore never monitors its own liveness and never exits on health grounds on this platform. [SOURCE: compat/fsmonitor/fsm-health-darwin.c:8-27] [SOURCE: compat/fsmonitor/fsm-health.h:31-45]
4. `git fsmonitor--daemon stop` sends `quit` and then polls `fsmonitor_ipc__get_state() == IPC_STATE__LISTENING` every 50 ms with no deadline (`do_as_client__send_stop`), so on a daemon that cannot answer the stop command hangs — matching the packet's observed 15-second kill. [SOURCE: builtin/fsmonitor--daemon.c:84-101]
5. `fsmonitor.starttimeout` (60 s default) is the only timeout in the lifecycle and bounds startup alone; `fsmonitor.ipcthreads` (8 default) sizes the worker pool. Neither bounds a running query. [SOURCE: builtin/fsmonitor--daemon.c:35-39]
6. Daemon side: every non-`quit` query creates a cookie file in the watched tree and blocks in `pthread_cond_wait(&state->cookies_cond, &state->main_lock)` until the event thread reports the cookie seen. The source comment states plainly: "Technically, this is an infinite wait (well, unless another thread sends us an abort). I'd like to change this to use `pthread_cond_timedwait()` and return an error/timeout ... but we don't have that routine in our thread-utils." [SOURCE: builtin/fsmonitor--daemon.c:198-212]
7. Client side: `ipc_client_send_command_to_connection` writes the command and then calls `read_packetized_to_strbuf` with `PACKET_READ_GENTLE_ON_EOF | PACKET_READ_GENTLE_ON_READ_ERROR` and no poll and no deadline; only EOF or a read error unblocks it. The error string on that path is exactly the `could not read IPC response` the packet observed from `git fetch`. [SOURCE: compat/simple-ipc/ipc-unix-socket.c:210-213]
8. `--ipc-threads=8` is git's compiled default (`static int fsmonitor__ipc_threads = 8`), not repo or Apple configuration, and this checkout sets no `fsmonitor.*` key. It multiplies the number of clients that can be parked, but it is not the cause. [SOURCE: builtin/fsmonitor--daemon.c:36]
9. No announced fix exists: the release notes for 2.51.0, 2.52.0 and 2.53.0 contain zero fsmonitor entries. Upgrading is not the fix path. [SOURCE: Documentation/RelNotes/2.51.0.adoc, 2.52.0.adoc, 2.53.0.adoc (git v2.51.0, v2.52.0, v2.53.0)]
10. The trigger is a lost cookie event, and the source names the mechanism: the cookie's open()/unlink() "will cause at least two FS events on that path, so the odds of getting stuck are pretty slim" — but a daemon watching roughly 2.5M files (including 93 `node_modules` trees under `.worktrees/`) can drop one under load, and one undelivered event parks one worker forever; eight parked clients saturate the pool so `status` and `stop` stop answering too. [SOURCE: builtin/fsmonitor--daemon.c:206-212] [SOURCE: specs/sk-git/035-fsmonitor-daemon-and-worktree-relocation-regression/scratch/findings.md]

## Questions Answered

- Q2. What is git 2.50.1's documented fsmonitor daemon lifecycle on macOS, and how do fsmonitor.socketDir, idle shutdown and git fsmonitor--daemon stop behave when the daemon is wedged? — Answer: there is no idle shutdown and no self-exit. The manual bounds nothing; `fsmonitor.socketDir` is only a network-mount socket relocation; the macOS health thread is an empty stub so the daemon never detects its own stall; and `stop` polls forever on a wedged daemon. `fsmonitor.starttimeout` (60 s) bounds startup only.
- Q3. Is event overload the real cause of the hang, or is there a known daemon deadlock in this git version, for example around --ipc-threads or the cookie-file handshake? — Answer: the defect is an acknowledged unbounded wait in the cookie handshake (daemon) and in the IPC response read (client); overload is the trigger that loses the cookie event. `--ipc-threads=8` is the compiled default and a risk multiplier, not the cause; no 2.51-2.53 release note announces a fix.

## Questions Remaining

- Q4. Which hook/script git call sites lack a timeout.
- Q5. Safest default shape.

## Ruled Out

- "`--ipc-threads=8` is a repo or Apple-specific tuning knob that might itself deadlock." Ruled out as a repo cause: 8 is the compiled default of `fsmonitor.ipcthreads`, and the repo sets no `fsmonitor.*` key. It remains a risk multiplier, not a root cause.
- "A git upgrade fixes it." Ruled out for 2.51-2.53 by their release notes; the source comment in 2.50.1 states the timed wait was not implemented.
- "The daemon can be expected to exit on its own after idling." Ruled out: no idle timeout exists in the manual or the source, and the macOS health thread is an empty stub.

## Dead Ends

- Locating a Darwin health-check policy: the implementation is an empty stub, so there is no policy to read. The daemon's own liveness is explicitly unmonitored on macOS.

## Edge Cases

- Missing dependency: the exact reason PID 17228 disappeared at 09:17:59 (packet section 5a). The source rules out a timeout; a signal or crash remains. The resolving check is the unified log or `~/Library/Logs/DiagnosticReports` entry for that PID, which this lineage did not read.
- Contradictory evidence: the packet's section 4 INFERENCE says event volume "overloaded the main daemon until it stopped answering", while the source shows the stall is an unbounded wait. Both are compatible once overload is read as the trigger; recorded as findings 6-10 rather than collapsed.

## Sources Consulted

- `man git-fsmonitor--daemon` (Git 2.50.1 Apple Git-155)
- `builtin/fsmonitor--daemon.c` (git v2.50.1): lines 35-42, 84-101, 190-215, 1160, 1235, 1422-1502
- `compat/simple-ipc/ipc-unix-socket.c` (git v2.50.1): lines 195-217, 469, 654
- `compat/fsmonitor/fsm-health-darwin.c`, `compat/fsmonitor/fsm-health.h` (git v2.50.1)
- `Documentation/RelNotes/2.51.0.adoc`, `2.52.0.adoc`, `2.53.0.adoc` (git v2.51.0, v2.52.0, v2.53.0)
- `specs/sk-git/035-fsmonitor-daemon-and-worktree-relocation-regression/scratch/findings.md`

## Assessment

- New information ratio: 0.90
- Questions addressed: Q2, Q3
- Questions answered: Q2, Q3

## Reflection

- What worked and why: reading the installed build's man page first pinned the exact version, then reading that version's source turned "the daemon stopped answering" into named waits at named lines. The source comment admitting the infinite wait is stronger evidence than any inference about overload, and the client-side error string cross-links the observed `could not read IPC response` to one exact line.
- What did not work and why: my first probes for the socketDir logic inside `builtin/fsmonitor--daemon.c` found nothing; the socket placement lives in the path-resolution layer, and the manual already documents the behavior, so the source hunt was unnecessary.
- What I would do differently: check the header contract (`fsm-health.h`) before the platform implementation — the contract states what the health thread is supposed to do, which makes the empty Darwin stub read as a deliberate platform gap rather than an oversight.

## Recommended Next Focus

Q4 and Q5 together: inventory every git call site in the repo's hooks and scripts that can block on the fsmonitor IPC (with `generate-leaf-manifest.cjs:129` as the proven one), decide which need a timeout versus `-c core.fsmonitor=false`, and turn the lifecycle facts into a default posture plus a daemon-reaping design that does not contradict the reaper's "never signals a process" invariant.
