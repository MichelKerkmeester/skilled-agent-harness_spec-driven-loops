# Iteration 2: Git 2.50.1's fsmonitor daemon lifecycle, and why a wedged daemon never recovers

## Focus

Q2 and Q3 of section 8: git 2.50.1's documented daemon lifecycle on macOS (does a daemon ever exit on its own; how do `fsmonitor.socketDir`, idle shutdown and `git fsmonitor--daemon stop` behave on a wedged daemon), and whether the hang is event overload or a known daemon deadlock around `--ipc-threads` or the cookie handshake.

Focus selection note: the reducer's `Next Focus` pointed at Q4. Q4 and Q5 are recommendations about what the repo should do, and both depend on knowing whether the daemon can recover or exit by itself, so the dependency was reordered and Q2/Q3 taken first. No exhausted approach was retried.

## Actions Taken

1. Read the installed build's own documentation: `man git-fsmonitor--daemon` and the `core.fsmonitor` / `fsmonitor.socketDir` sections of `man git-config`, which report `Git 2.50.1.428.g0e8243`.
2. Read the 2.50.1 sources that define the lifecycle: `builtin/fsmonitor--daemon.c` (config defaults, start/stop client, cookie handshake, health thread wiring) and `compat/simple-ipc/ipc-unix-socket.c` (client connect and reply read).
3. Read `compat/fsmonitor/fsm-health-darwin.c` and `compat/fsmonitor/fsm-health.h` to establish what the Darwin health thread does.
4. Checked the release notes of 2.51.0, 2.52.0 and 2.53.0 for any announced fsmonitor fix (`grep -ci fsmonitor` → 0 hits in each).
5. Compared the source facts against the packet's observed stack (`read_packetized_to_strbuf`) and the live process census from iteration 1.

## Findings

1. The 2.50.1 manual documents exactly four subcommands (`start`, `run`, `stop`, `status`) and describes the daemon as "a long running process used to watch a single working directory". It documents no idle timeout, no lifetime bound, no self-exit and no TTL. [SOURCE: man git-fsmonitor--daemon, Git 2.50.1.428.g0e8243]

2. `--ipc-threads=8` in every live process is git's own compiled default, not this repo's configuration: `static int fsmonitor__ipc_threads = 8;` is the default for `fsmonitor.ipcthreads`, and this checkout sets no `fsmonitor.*` key at all. The argument is how the daemon re-execs itself into `run`, so it carries no signal about repo config. [SOURCE: builtin/fsmonitor--daemon.c:35-52] [SOURCE: git config --show-origin --get-regexp, iteration 1]

3. The only timeout anywhere in the daemon's lifecycle is `fsmonitor.starttimeout` (default 60 s), and it bounds startup only — how long `start` waits for the background daemon to reach `IPC_STATE__LISTENING`. Nothing bounds a request. [SOURCE: builtin/fsmonitor--daemon.c:38-61,1510]

4. On macOS the health thread is a complete no-op: `fsm_health__ctor()`, `fsm_health__loop()` and `fsm_health__stop_async()` all return immediately, so the daemon does not monitor its own listener, does not detect a stalled FSEvents stream, and never shuts itself down on health grounds. [SOURCE: compat/fsmonitor/fsm-health-darwin.c:1-28] [SOURCE: compat/fsmonitor/fsm-health.h]

5. `git fsmonitor--daemon stop` sends `quit` and then polls `fsmonitor_ipc__get_state()` every 50 ms in an unbounded `while` loop. On a daemon that will not answer, the stop command itself hangs — exactly the observed behaviour where `stop` had to be killed after 15 seconds. [SOURCE: builtin/fsmonitor--daemon.c:88-101]

6. The cookie handshake is an acknowledged infinite wait. Every query other than `quit` creates a cookie file inside the watched tree, then blocks in `while (cookie->result == FCIR_INIT) pthread_cond_wait(...)`. The source comment says outright: "Technically, this is an infinite wait (well, unless another thread sends us an abort). I'd like to change this to use `pthread_cond_timedwait()` and return an error/timeout ... but we don't have that routine in our thread-utils." [SOURCE: builtin/fsmonitor--daemon.c:198-212]

7. The client side has no deadline either. `ipc_client_send_command_to_connection()` writes the command, flushes, then calls `read_packetized_to_strbuf(connection->fd, answer, PACKET_READ_GENTLE_ON_EOF | PACKET_READ_GENTLE_ON_READ_ERROR)` with no `poll()` and no timeout, so only EOF or a read error unblocks it. That is the exact frame the packet's `sample 28423` showed. The 10 ms `poll()` in the same file belongs to the server's `worker_thread__wait_for_io_start`, not to the client's reply read. [SOURCE: compat/simple-ipc/ipc-unix-socket.c:192-220] [SOURCE: compat/simple-ipc/ipc-unix-socket.c:440-506]

8. Therefore the sustained hang is not a lock deadlock with two owners. It is an unbounded wait on both sides, reachable whenever the filesystem event for a cookie is never delivered to the daemon's listener thread: the daemon's worker parks forever, the client's read parks forever, and the only exit is the socket closing. [INFERENCE: from findings 6-7 plus the packet's 0 %-CPU sleep-state sample]

9. Event overload is the trigger, not the defect. A checkout with roughly 570k files plus roughly 2M under `.worktrees/`, with 93 `node_modules` trees, is a plausible way to lose or coalesce a cookie's FSEvents delivery under concurrent installs; the unbounded wait is what turns that dropped event into a 30-minute hang. [INFERENCE: from findings 6-8 and the packet's file census] [SOURCE: specs/sk-git/035-fsmonitor-daemon-and-worktree-relocation-regression/scratch/findings.md]

10. Upgrading is not the fix path: the 2.51.0, 2.52.0 and 2.53.0 release notes contain zero fsmonitor entries, so no announced change addresses the unbounded cookie wait or the client's unbounded read. [SOURCE: Documentation/RelNotes/2.51.0.adoc] [SOURCE: Documentation/RelNotes/2.52.0.adoc] [SOURCE: Documentation/RelNotes/2.53.0.adoc]

11. Because the Darwin health thread is a no-op and no idle exit exists, a daemon cannot retire itself. The 08:51:33 daemon (PID 17228) vanishing at 09:17:59 and being replaced by PID 18482 within a second therefore points at a signal or a crash, not at a timeout — the replacement is exactly what a client-start after a dead socket looks like. [INFERENCE: from findings 4-5] [SOURCE: specs/sk-git/035-fsmonitor-daemon-and-worktree-relocation-regression/scratch/findings.md]

12. Each blocked client holds one of the 8 IPC workers. Once the pool is saturated the daemon also stops answering `status` and `stop`, which is why the whole checkout looks frozen instead of one command looking slow, and why killing the daemon was the only thing that released the hook. [INFERENCE: from findings 2 and 6-7]

## Questions Answered

- Q2. What is git 2.50.1's documented fsmonitor daemon lifecycle on macOS, and how do fsmonitor.socketDir, idle shutdown and git fsmonitor--daemon stop behave when the daemon is wedged? — Answer: there is no idle shutdown and no self-exit; the documented lifecycle is start/run/stop/status over one working directory. `fsmonitor.socketDir` only relocates the Unix socket for network-mounted `.git`/`$HOME`. On a wedged daemon, `stop` sends `quit` and then polls for exit forever, so it hangs too.

- Q3. Is event overload the real cause of the hang, or is there a known daemon deadlock in this git version, for example around --ipc-threads or the cookie-file handshake? — Answer: the defect is the cookie handshake's acknowledged infinite `pthread_cond_wait` plus the client's unbounded `read_packetized_to_strbuf`; there is no fixed timeout anywhere except startup. Overload is the plausible trigger that loses the cookie event, and `--ipc-threads=8` is git's default, not a repo setting. No announced fix exists in 2.51-2.53.

## Questions Remaining

- Q4. Which hook/script git call sites lack a timeout.
- Q5. Safest default shape.

## Ruled Out

- "`--ipc-threads=8` is a repo or Apple-specific tuning knob that might itself deadlock." Ruled out as a repo cause: 8 is the compiled default of `fsmonitor.ipcthreads`, and the repo sets no `fsmonitor.*` key. It remains a risk multiplier, not a root cause.
- "A git upgrade fixes it." Ruled out for 2.51-2.53 by their release notes; the source comment in 2.50.1 states the timed wait was not implemented.
- "The daemon exits on its own after idle time, so leaks are self-limiting." Ruled out: no idle mechanism exists, and the Darwin health thread is a no-op.

## Dead Ends

- Locating a Darwin health-check policy: the implementation is an empty stub, so there is no policy to read. The daemon's own liveness is explicitly unmonitored on macOS.

## Edge Cases

- Missing dependency: the exact reason PID 17228 disappeared at 09:17:59. The source rules out a timeout; a signal or crash remains. The resolving check is the unified log or `~/Library/Logs/DiagnosticReports` entry for that PID, which this lineage did not read.
- Contradictory evidence: the packet's section 4 INFERENCE says event volume "overloaded the main daemon until it stopped answering", while the source shows the stall is an unbounded wait. Both are compatible once overload is read as the trigger; recorded as findings 8-9 rather than collapsed.

## Sources Consulted

- `man git-fsmonitor--daemon` (Git 2.50.1.428.g0e8243)
- `man git-config` — `core.fsmonitor`, `fsmonitor.socketDir`
- `builtin/fsmonitor--daemon.c` (git v2.50.1): lines 35-61, 88-101, 198-212, 689-772, 1154-1275, 1510
- `compat/simple-ipc/ipc-unix-socket.c` (git v2.50.1): lines 192-220, 440-506
- `compat/fsmonitor/fsm-health-darwin.c`, `compat/fsmonitor/fsm-health.h` (git v2.50.1)
- `Documentation/RelNotes/2.51.0.adoc`, `2.52.0.adoc`, `2.53.0.adoc` (git v2.51.0, v2.52.0, v2.53.0)
- `specs/sk-git/035-fsmonitor-daemon-and-worktree-relocation-regression/scratch/findings.md`

## Assessment

- New information ratio: 0.90
- Questions addressed: Q2, Q3
- Questions answered: Q2, Q3

## Reflection

- What worked and why: reading the installed build's man page first pinned the exact version, then reading that version's source turned "the daemon stopped answering" into named waits at named lines. The source comment admitting the infinite wait is stronger evidence than any inference about overload.
- What did not work and why: my first guesses at source paths (`simple-ipc/`, `compat/fsmonitor/fsm-health.c`, `Documentation/RelNotes/*.txt`) all 404'd; the tree uses `compat/simple-ipc/` and `.adoc` release notes. Three path probes were wasted before checking status codes instead of reading empty output as "no match".
- What I would do differently: probe HTTP status before interpreting a grep miss as evidence of absence — an empty grep on a 404 is not a finding.

## Recommended Next Focus

Q4 and Q5 together: inventory every git call site in the repo's hooks and scripts that can block on the fsmonitor IPC (with `generate-leaf-manifest.cjs:129` as the proven one), decide which need a timeout versus `-c core.fsmonitor=false`, and turn the lifecycle facts into a default posture plus a daemon-reaping design that does not contradict the reaper's "never signals a process" invariant.
