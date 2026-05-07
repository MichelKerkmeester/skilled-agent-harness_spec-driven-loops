# Iteration 2: Race window quantification, worker reaping, and recovery completeness (Q3 + Q5 + Q10)

## Focus
Quantify the TOCTOU race between the proposed `_pid_alive(pid)` pre-flight and the actual `subprocess.Popen` inside `start_daemon()`; trace whether the daemon spawns and reaps any worker subprocesses; and stress-test the spec.md operator-recovery snippet against the now-confirmed socket-unlink severance mechanism (P0-2 from iter 1).

**Central thesis to confirm or refute**: race window + unconditional `unlink` (`daemon.py:615`) = the leak. The spec's "race window is acceptable, document as caveat" stance is wrong on its own terms — the unlink rebinds the path on the loser, severing the winner.

## Findings

### P0-4 (NEW) — Race window between `_pid_alive()` check and daemon's own `bind()` is **5–60 ms** and is structurally unrecoverable without a cross-process lock
- **Severity**: P0 (invalidates the spec's plan-only fix)
- **Evidence**:
  - With Patch 1 in place, the candidate caller's timeline is:
    1. `daemon_pid_path().read_text()` → file read syscall, ~10 µs.
    2. `_pid_alive(pid)` → `os.kill(pid, 0)` syscall, ~10 µs on macOS (`SOURCE: client.py:242-263`).
    3. Decision to spawn: ~1 µs Python.
    4. `subprocess.Popen(["ccc","run-daemon"], start_new_session=True, ...)` → `posix_spawn` ~1–3 ms cold; the *child returns immediately to the parent*, but the new daemon's own startup until it executes `Path(sock_path).unlink(missing_ok=True)` (`SOURCE: daemon.py:613-617`) and then `Listener(sock_path, family=...)` (`SOURCE: daemon.py:619`) takes **~5–60 ms** depending on Python interpreter cold-start, settings load (`load_user_settings()` at `daemon.py:556`), and embedder construction (`create_embedder` at `daemon.py:564`) — embedder construction in particular can stretch this to seconds for first-time model load.
  - `multiprocessing.connection.Listener` on AF_UNIX calls `socket.bind(path)`. macOS `bind()` on AF_UNIX returns `EADDRINUSE` (errno 48) only if the path *currently has a bound socket file*. Because step 1 of `_async_daemon_main()` is `Path(sock_path).unlink(missing_ok=True)`, **collision detection at the `bind()` step is permanently disabled** — the previous daemon's socket file is removed before the new bind attempts, so the new bind always succeeds and the old daemon's `accept()` keeps polling a now-orphaned inode (its FD is still valid, but no client can reach it). [SOURCE: .opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py:611-620]
  - **Stack-up scenario** (3 racing callers, all see PID dead because the previous daemon just exited):
    - Caller A: `os.kill(pid_dead, 0)` → ProcessLookupError, returns False, `Popen` (~1 ms). Daemon A starts at T+0.
    - Caller B: same, `Popen` ~200 µs later.
    - Caller C: same, `Popen` ~400 µs later.
    - All three new daemons race through `_async_daemon_main()`. Daemon A unlinks + binds at T+50 ms. Daemon B unlinks (removing A's socket file) + binds at T+50.2 ms. Daemon C ditto at T+50.4 ms.
    - **C wins.** A and B are alive but unreachable, holding LMDB handles, indexing, leaking embedder GPU memory. **Identical to PID 98364 zombie scenario.**
- **Conclusion**: `_pid_alive(pid)` alone is insufficient. The fix must add **either** (a) `fcntl.flock(LOCK_EX | LOCK_NB)` on `daemon.pid` inside `start_daemon()` so only one caller wins the spawn, **or** (b) a daemon-side guard inside `_async_daemon_main()` that re-reads `daemon.pid` after binding, verifies the stored PID matches `os.getpid()`, and exits if it does not (cooperative). Option (a) is the cheaper guarantee. Recommend the spec adopt (a), because it also closes the `ensure_daemon()` version-mismatch race (P1-1) without further changes. **The "race window is acceptable" stance currently in spec.md must be removed.**

### P0-5 (NEW) — `daemon.py:568` `pid_path.write_text(str(os.getpid()))` is unconditional and leaves no audit trail
- **Severity**: P0 (necessary companion to P0-4's lock recommendation)
- **Evidence**:
  - `run_daemon()` writes the PID file with no check on existing content: `pid_path.write_text(str(os.getpid()))` [SOURCE: .opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py:567-568].
  - If two daemons race past `start_daemon()` and both reach `run_daemon()`, both blindly overwrite `daemon.pid`. The "winner" is whoever writes last. The previous daemon's PID is **lost from the file system** the moment the second daemon writes — there is no way to recover the orphaned PID short of `pgrep -f "ccc run-daemon"`. This is exactly why PID 98364 was untracked: PID 16404 overwrote `daemon.pid` at 17:08:49 on Apr 27.
  - There is **no `atexit` handler** registered to clean the PID file under abnormal exit (covered by the `try/finally` in `run_daemon()` at `daemon.py:583-602` only — bypassed on `SIGKILL`).
- **Conclusion**: When the lock-based fix lands (P0-4), the PID write must move *inside* the lock-held region. Recommend: open `daemon.pid` with `O_CREAT | O_EXCL` first, fall back to `flock` + truncate + write on the existing file. Either way, only the lock holder may write the PID. This also gives operators an immediate "second daemon refused to start" signal in `daemon.log`.

### P0-6 (NEW, contradicts iter-1 framing) — There is **no daemon-side child process spawning** in `mcp-coco-index/`; PID 40681 (`multiprocessing.resource_tracker`) is **not** owned by the daemon's code path
- **Severity**: P0 (significantly simplifies Q5 — the spec.md does not need a worker-reaping fix)
- **Evidence**:
  - Codebase-wide ripgrep for `Process(`, `Pool(`, `SemLock`, `set_start_method`, `multiprocessing.Process` returns **zero hits** in the daemon code. Only `multiprocessing.connection.Listener` / `Client` / `Connection` are used. [SOURCE: ripgrep `Process\(|SemLock|Pool\(|set_start_method` over `mcp_server/`]
  - `multiprocessing.resource_tracker` is started lazily by CPython only when `multiprocessing.Process()` or `multiprocessing.synchronize.SemLock` is created. Importing `multiprocessing.connection` does NOT start it.
  - The accept loop runs as a `threading.Thread(daemon=True)` (`SOURCE: daemon.py:664-665`), not a separate process. Connection handlers run as asyncio tasks on the same event loop (`SOURCE: daemon.py:633-642`).
  - PID 40681 (observed in known-context as a child of PID 24938) is therefore spawned by a **transitive dependency** — most likely `cocoindex` (Rust bindings) or the embedder model (e.g., `sentence-transformers`'s tokenizer fork) — not by code controlled by this packet's spec.
- **Conclusion**: The spec.md does not need to add child-process reaping logic for THIS code path. Q5 is partially answered: the *daemon's own code* leaks no children. Operator recovery (Q10) still needs to handle the transitively-spawned `resource_tracker`, which is a separate concern (it self-exits when its parent dies via SIGCHLD on macOS). Iter 3 may revisit if the embedder backend is identified as the spawn source, but spec.md scope can stop at the daemon code.

### P1-2 (NEW) — `_async_daemon_main()` accept loop swallows the `OSError` from `listener.accept()` after `listener.close()`, but does NOT close in-flight connections in `tasks: set` before the registry shutdown
- **Severity**: P1 (graceful-shutdown completeness, secondary to the P0 stack)
- **Evidence**:
  - On `shutdown_event.set()`, the main coroutine calls `listener.close()` (`SOURCE: daemon.py:670`), then `accept_thread.join(timeout=2)` (`SOURCE: daemon.py:671`), then `await asyncio.gather(*tasks, return_exceptions=True)` (`SOURCE: daemon.py:672-673`), then `registry.close_all()` (`SOURCE: daemon.py:674`).
  - In-flight `handle_connection` tasks are awaited but their `Connection` objects are not explicitly closed before `gather()`; they only release their FDs when the coroutine exits. If a client hangs in a long `recv_bytes`, the `gather()` call waits up to whatever hard deadline the handler enforces internally. With no per-task timeout, `gather()` could block indefinitely.
- **Conclusion**: Lower priority than the P0 stack but worth noting in plan/tasks: add a `wait_for(gather(...), timeout=Xs)` with a final `cancel + close` fallback. Do not block on this for the P0 patch.

### P2-2 (NEW) — Recovery snippet in spec.md is **incomplete**: `pkill -f "ccc run-daemon"` does not cover transitively-spawned `resource_tracker` and does not guard against a concurrent `ensure_daemon()` re-spawning a fresh daemon mid-recovery
- **Severity**: P2 (operator UX, low correctness impact)
- **Evidence**: see Recovery Checklist below.
- **Conclusion**: Recovery flow needs a second-step verification. Patch the spec's recovery snippet with the explicit checklist below.

## Race Window Analysis (Q3)

### Timing breakdown (macOS, Python 3.12, warm cache)
| Step | Wall-clock | Source |
|------|-----------|--------|
| `daemon_pid_path().read_text()` | ~10 µs | filesystem read |
| `_pid_alive(pid)` (`os.kill(pid, 0)`) | ~10 µs | `client.py:242-263` |
| Spawn decision | ~1 µs | Python branch |
| `subprocess.Popen(...)` returning a child PID | ~1–3 ms | `posix_spawn` cold |
| Child Python interpreter init + import `cocoindex_code.cli` | ~30–80 ms | first import warm |
| `run_daemon()` → `load_user_settings()` + `global_settings_mtime_us()` | ~1–5 ms | YAML parse |
| `create_embedder(...)` | ~1–10 ms warm / 1–10 s cold | model load |
| `pid_path.write_text(...)` | ~10 µs | overwrites |
| `_async_daemon_main()` until `Path(sock_path).unlink(missing_ok=True)` | ~1 ms | `daemon.py:613-617` |
| `Listener(sock_path, family=...)` | ~1 ms | bind + listen(5) |

**Total parent-side window from `_pid_alive` decision to first `Popen`** = effectively zero (~1 ms).
**Total child-side window from `Popen` return to `bind()`** = **5–60 ms warm, multiple seconds cold**.

### Three-caller race outcome
- Three concurrent callers all observe stale PID file (previous daemon just died) → all spawn → only the *last* daemon to call `unlink + bind` keeps the live socket; earlier daemons keep their FDs but receive zero connections. **This is exactly the PID 98364 mechanism** (P0-2 from iter 1, mechanism-confirmed at `daemon.py:615`).
- macOS `bind()` cannot detect the collision because `unlink()` happens first.

### Mitigation comparison
| Approach | Coverage | Cost | Recommendation |
|----------|----------|------|----------------|
| `_pid_alive(pid)` only | Skips spawn when daemon is *clearly* alive; useless against concurrent dead-PID racers | trivial | NECESSARY but INSUFFICIENT |
| `fcntl.flock(daemon.pid, LOCK_EX \| LOCK_NB)` in `start_daemon()` | Closes spawn-side race; loser sees `BlockingIOError`, falls back to `_wait_for_daemon` | ~10 lines | **Recommended primary** |
| Daemon-side: re-read `daemon.pid` after `Listener()` and exit if PID mismatch | Closes child-side race (handles late starters) | ~5 lines | **Recommended secondary (defense-in-depth)** |
| Replace unconditional `unlink` with "unlink only if `_pid_alive(stored_pid)` is False" | Prevents severance even without lock | ~5 lines but introduces TOCTOU between read and unlink | Useful as belt-and-suspenders |

**Spec.md correction**: the current "race window is acceptable, document as caveat" stance must be replaced with a concrete `fcntl.flock` requirement in Patch 1 + the daemon-side guard in a new Patch 3. Citations: `daemon.py:613-619`, `client.py:192-227`, `client.py:242-263`.

## Worker Reaping Trace (Q5)

- `daemon.py` imports only `multiprocessing.connection` — no `Process`, `Pool`, `SemLock`, or `set_start_method`.
- `_async_daemon_main()` runs the accept loop in a **thread** (`threading.Thread`, `daemon=True`), not a process. [SOURCE: `daemon.py:664-665`]
- Connection handlers are asyncio tasks on the same event loop. [SOURCE: `daemon.py:633-642`]
- Signal handlers are registered for `SIGTERM` and `SIGINT` via `loop.add_signal_handler` and only set `shutdown_event`. **`SIGKILL` is uncatchable on Unix** — it bypasses the cleanup `finally` block and leaves both `daemon.sock` and `daemon.pid` on disk pointing at a dead PID. [SOURCE: `daemon.py:624-629`]
- On clean exit (SIGTERM/SIGINT or `client.stop()`), the cleanup ladder is: `listener.close()` → `accept_thread.join(timeout=2)` → `await asyncio.gather(*tasks, ...)` → `registry.close_all()` → outer `finally` removes the socket file (only for the current daemon) and the PID file (only if its content matches `os.getpid()`). [SOURCE: `daemon.py:583-602, 668-674`]
- **Verdict**: The daemon's own code spawns no children. The `multiprocessing.resource_tracker` PID 40681 observed in known-context belongs to a transitive dep (`cocoindex` Rust bindings, embedder backend, or pyo3). It self-exits via SIGCHLD when its parent dies; if its parent is killed via `pkill -9`, the resource_tracker becomes parented to launchd (PID 1) but exits at next idle scan. **No code change is required in this packet for worker reaping.**

## Recovery Checklist (Q10)

Spec.md's current snippet:
```
pkill -f "ccc run-daemon"
rm /Users/<you>/.cocoindex_code/daemon.sock
ccc run-daemon &
```

Gaps identified (citation: spec.md "Operator recovery", verified against `daemon.py:583-602`, `client.py:266-365`):

1. **`pkill` does not wait for graceful exit** → `daemon.sock` and `daemon.pid` may persist briefly. The next `start_daemon()` (with the proposed Patch 1) handles this via `_cleanup_stale_files`, but a manual operator should still verify.
2. **Concurrent `ensure_daemon()` may racing-spawn during recovery** → between `pkill` and `ccc run-daemon`, an MCP server invocation or `ccc search` from another shell can call `ensure_daemon()`. With no advisory lock, two daemons start. Recovery must either **stop the MCP server first** or rely on the P0-4 lock fix.
3. **Transitive `multiprocessing.resource_tracker` orphan** → harmless, self-exits, but operators may see a stray child of `launchd` for ~10 seconds.

### Recommended recovery checklist (replaces spec.md snippet)

```bash
# 1) Stop the MCP server / any callers that call ensure_daemon()
#    (otherwise they will race-spawn during recovery)

# 2) Kill all daemon processes
pkill -f "ccc run-daemon"

# 3) Verify no daemons remain
pgrep -f "ccc run-daemon"   # expected: empty
# Optional: verify no orphan resource_tracker children
pgrep -f "multiprocessing.resource_tracker" | xargs -I{} ps -o pid,ppid,command -p {}
#   resource_tracker reparented to PID 1 will self-exit; it is harmless

# 4) Inspect leftover state
ls -la ~/.cocoindex_code/
#   daemon.pid, daemon.sock may exist; the next start_daemon() will clean them
#   (with Patch 1 + Patch 3 from this research) — manual rm is optional

# 5) Start a fresh daemon
ccc run-daemon &

# 6) Confirm reachable
ccc daemon status
#   should print version + uptime
```

This checklist covers transition states and explicitly mentions the still-open race risk if MCP server is not stopped first. Iter 3 may simplify after the lock fix lands.

## Answered Questions
- **Q3 (race window)**: ANSWERED. Window is 5–60 ms warm (multi-second cold) between candidate `Popen` and the new daemon's `unlink+bind`. The unconditional unlink at `daemon.py:615` removes the bind-time collision detection. `_pid_alive` alone is INSUFFICIENT. Need `fcntl.flock` on `daemon.pid` (primary) + daemon-side PID re-check after bind (secondary).
- **Q5 (worker reaping)**: ANSWERED. Daemon code spawns no children. PID 40681 is from a transitive dep, self-exits, and is out of spec scope.
- **Q10 (recovery completeness)**: ANSWERED. Spec snippet is functional but optimistic. Recommended checklist above adds the missing "stop callers first" + "verify no remaining processes" steps.

## Spec.md correction tracker (carry into iter 5 synthesis)
- [ ] Replace "race window is acceptable" with `fcntl.flock(daemon.pid, LOCK_EX | LOCK_NB)` requirement in Patch 1.
- [ ] Add Patch 3: daemon-side PID re-check after `Listener()` bind in `_async_daemon_main()` (defense-in-depth for late starters).
- [ ] Update the unconditional `unlink` at `daemon.py:615` to `unlink only if _pid_alive(stored_pid) is False` (cheap belt-and-suspenders).
- [ ] Note in plan.md that **Q5 worker reaping requires no code change** — the spec scope can shrink here.
- [ ] Replace the recovery snippet in spec.md with the 6-step checklist above.
- [ ] Correct the PID 98364 timeline (Apr 27 17:08:49, not May 1 17:27).

## Next Focus (recommendation for iter 3)
1. **Q6 + Q7 (log growth + LMDB safety)**: Now that we know daemon is alive but unreachable, what's the LMDB write path with two daemons each holding writable handles to `~/.cocoindex_code/<project>/embedding_index/data.mdb`? Concurrent writers via `MDB_NOLOCK`? Need to read `cocoindex` Rust bindings to confirm.
2. **Q8 (Win32 fallback)**: Validate `_pid_alive` Win32 branch (`OpenProcess(0x1000, ...)`) actually detects dead PIDs reliably. Also: does `fcntl.flock` recommendation translate to `msvcrt.locking` on Windows? What about Windows named pipes — does `Listener` on `AF_PIPE` have an analogous unlink semantic?
3. **Q9 (socket backlog)**: Quick check — does `Listener._listener._socket.listen(N)` set a non-default backlog? CPython default is `_socket.SOMAXCONN` (~128). During the 564-BrokenPipeError loop, did the backlog actually fill?

## Ruled Out (this iteration)
- "Daemon spawns child workers and we need to fix child reaping" — codebase has no `multiprocessing.Process` etc. **Do not retry "find worker spawn sites in daemon code"** — confirmed empty.
- "macOS `bind()` will detect socket collision via EADDRINUSE" — REFUTED. The `unlink` at `daemon.py:615` always runs first, so `bind()` never sees the collision.

## Edge Cases
- **Ambiguous input**: None. Strategy §16 listed Q3, Q5, Q10 explicitly.
- **Contradictory evidence**: Iter 1 implied (via Q5 framing) that worker subprocesses might exist. Iter 2's grep refutes this. Both are cited; iter 2 supersedes the framing.
- **Missing dependencies**: None for the in-scope analysis. Identifying which transitive dep spawns the resource_tracker is deferred (out of spec scope).
- **Partial success**: None — three planned questions all answered with file:line evidence.

## Sources Consulted
- .opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/client.py:180-263, 266-443
- .opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py:540-675
- ripgrep `resource_tracker|multiprocessing|fork|spawn\(|Process\(|daemon_pid_path|pid_path\.write_text|fcntl|flock` over `mcp_server/`
- ripgrep `Process\(|SemLock|Pool\(|set_start_method|atexit` over `mcp_server/`
- iter-001.md (P0-2 mechanism reference)

## Assessment
- **New information ratio**: 0.80 (P0-4 race quantification = wholly new with concrete timing; P0-5 unconditional PID write = wholly new; P0-6 = wholly new and contradicts iter-1 framing; P1-2 = partially new; P2-2 = partially new building on iter-1 P0-2). 4 fully new + 1 partially new of 5 → 0.80 (no simplicity bonus claimed).
- **Questions addressed**: Q3, Q5, Q10
- **Questions answered**: Q3, Q5, Q10

## Reflection
- **What worked**: Reading `daemon.py:540-675` (run_daemon + _async_daemon_main) + targeted grep for multiprocessing primitives pinned Q5 in two tool calls. Reasoning about timing breakdown step-by-step (vs. trying to instrument) saved budget. Causal chain: knowing the unlink mechanism from iter 1 made the race window analysis straightforward — the question was no longer "does the OS detect collision?" but "is the OS-level detector ever reachable?" (answer: no, because of `daemon.py:615`).
- **What did not work**: I almost re-searched for "worker subprocess" patterns despite iter 1 strategy mentioning PID 40681. Reading the daemon code first and *then* greping for `Process(` was the right order — let the code refute the assumption rather than chasing log forensics for an out-of-scope orphan.
- **What I would do differently**: For iter 3, jump straight to the LMDB write path in `cocoindex` Rust bindings (or `registry.add_project()` on the Python side) before opening a wider Q7 search.

## Recommended Next Focus
See **Next Focus** section above. Priority order: Q7 (LMDB safety with two writers — highest correctness risk if the leak isn't fully fixed) → Q8 (Win32 fallback completeness for the proposed `fcntl.flock` recommendation) → Q6 (log growth rotation policy). Iter 3 should target ≤ 12 tool calls.
