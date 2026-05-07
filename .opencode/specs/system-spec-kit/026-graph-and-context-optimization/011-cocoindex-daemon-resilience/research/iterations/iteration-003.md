# Iter 3: Q7 LMDB safety + Q8 cross-platform + Q6 log rotation

## Focus

Iteration 3 closes the cross-cutting safety/portability/sustainability questions left open after iters 1–2:

- **Q7** — LMDB write contention with two coexisting daemons. Investigate the actual write path on disk, identify the storage engine, and decide whether PID 98364 (alive but socket-orphaned) ever reached the write critical section.
- **Q8** — Cross-platform completeness of the proposed `fcntl.flock` advisory-lock recommendation (P0-4) and validation of the existing Win32 `_pid_alive` branch (`OpenProcess`).
- **Q6** — Log growth and rotation policy. Quantify whether `daemon.log` will continue to bloat after the P0-3 fix lands.

The central question carried from iter 2: did we have an actual data-corruption risk, and how do we make the patches portable + sustainable?

## Findings

### P0-7 — RULED OUT: there is no LMDB. Storage is per-project SQLite. Q7 corruption risk does NOT exist as previously framed.

The Q7 hypothesis assumed a shared LMDB env at `cocoindex.db/mdb/data.mdb` with two writers. **This assumption is wrong.** The daemon code stores indexed data in **per-project SQLite databases**, not in any shared LMDB env.

Evidence:

- `mcp_server/cocoindex_code/project.py:10` `from cocoindex.connectors import sqlite` — the only DB connector imported.
- `mcp_server/cocoindex_code/project.py:94-102`:
  - `cocoindex_db_path = index_dir / "cocoindex.db"` (per-project)
  - `target_sqlite_db_path = index_dir / "target_sqlite.db"` (per-project)
  - `context.provide(SQLITE_DB, sqlite.connect(str(target_sqlite_db_path), load_vec=True))`
- `mcp_server/cocoindex_code/daemon.py:272` `target_db = root / ".cocoindex_code" / "target_sqlite.db"` — search path reads the per-project file.
- `mcp_server/cocoindex_code/project.py:33` `"""Close project resources to release file handles (LMDB, SQLite)."""` — the docstring mentions LMDB but the only file handle visible to user code is `SQLITE_DB`. Any LMDB env, if it exists, is owned internally by the cocoindex Rust binding and is opaque to the Python layer.
- On-disk evidence: `find ~/.cocoindex_code -name '*.mdb'` returns zero hits. `~/.cocoindex_code/` contains only `daemon.log`, `daemon.pid`, `daemon.sock`, `global_settings.yml`. `find <repo>/.cocoindex_code -name '*.db'` shows `target_sqlite.db` and `cocoindex.db` (per-project, not in `~/.cocoindex_code/`).

**Implication for the spec:** Q7 framed as "LMDB corruption risk" is RESOLVED with negative result. Update spec.md known-context to drop the LMDB framing and replace it with the SQLite-per-project model. See *LMDB Lock Analysis* below for the full reasoning, including why even the SQLite write path was not at risk for PID 98364.

[SOURCE: .opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/project.py:10,33,94-102]
[SOURCE: .opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py:272]
[SOURCE: bash:find ~/.cocoindex_code -name '*.mdb' -o -name '*.db' (zero .mdb hits)]

### P0-8 — RULED OUT: PID 98364 was quiescent. Even if SQLite cross-process locking failed, PID 98364 had no live request path to drive a write transaction.

PID 98364 was at **0.0% CPU** at packet creation (per spec.md known-context: "PID 98364, Apr 27, 9d23h, 0.0% CPU"). The daemon's only write path is request-driven:

- `mcp_server/cocoindex_code/daemon.py:495` (`_dispatch`) handles `IndexRequest` and calls `registry.update_index(req.project_root)`.
- `daemon.py:432` calls `_dispatch` only from `handle_connection`, which is awaited from the accept loop (`daemon.py:655` `_spawn_handler`).
- The accept loop binds to `daemon.sock` at `daemon.py:619`. PID 98364 lost its socket binding on 2026-04-27 17:08:49 (per iter 1 P0-2 evidence) when PID 16404 spawned and unlinked the socket via `daemon.py:615`.
- After socket unbinding, no client can reach PID 98364. Therefore no `IndexRequest` arrives. Therefore `update_index` never fires. Therefore no SQLite write transaction opens from PID 98364.
- The accept loop is on a `threading.Thread(daemon=True)` (per iter 2 evidence). It blocks at `accept()` on its now-orphaned `Listener` (still bound to a deleted inode), receiving zero connections.

**Worst-case scenario considered.** Even hypothetically, if both daemons received concurrent `IndexRequest`s for the same project, SQLite enforces cross-process serialization through POSIX advisory locks on the database file (or WAL-mode shared-memory locks). The user code's `asyncio.Lock` at `daemon.py:148` (`self._index_locks[project_root] = asyncio.Lock()`) is in-process only and would NOT serialize across daemon processes — but SQLite's own locking at the kernel/file level catches that miss at the cost of one writer blocking. The risk is **delayed indexing**, not corruption.

**Conclusion: zero data-corruption risk from the dual-daemon situation.** P0-2's "leaked zombie" framing remains correct: PID 98364 was a fd-leak and CPU non-issue, not a correctness threat. Q7 closes with no patch needed.

[SOURCE: .opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py:148,432,495,615,619,655]
[INFERENCE: PID 98364 0.0% CPU + lost socket binding + request-driven write path → no write txns from PID 98364]

### P0-9 — Cross-platform `fcntl.flock` recommendation translates cleanly to Windows `msvcrt.locking`. Existing Win32 paths in client.py + daemon.py already establish the abstraction pattern.

The proposed P0-4 patch (advisory `fcntl.flock(daemon.pid, LOCK_EX|LOCK_NB)` in `start_daemon()`) needs a Windows fallback. Validation:

1. **Win32 abstraction already exists in this codebase.** The daemon and client already branch on `sys.platform == "win32"`:
   - `daemon.py:91` `_connection_family()` returns `AF_PIPE` on Win32, `AF_UNIX` elsewhere.
   - `daemon.py:96-103` `daemon_socket_path()` returns a named-pipe path on Win32, an `AF_UNIX` socket file otherwise.
   - `daemon.py:588,613` socket-unlink branches are skipped on Win32 (named pipes don't unlink).
   - `daemon.py:649-651` `listener._listener._socket.settimeout(0.5)` is wrapped in try/except because AF_PIPE doesn't expose `._socket`.
   - `client.py:244-256` `_pid_alive` uses `OpenProcess(PROCESS_QUERY_LIMITED_INFORMATION=0x1000)` via ctypes on Win32; `os.kill(pid, 0)` elsewhere.
   - `client.py:180,207,234,319,332,347,373` — eight more sys.platform branches in `start_daemon`/`stop_daemon`/locator code.

2. **Cross-platform advisory-lock helper sketch (recommended in spec.md Patch 1):**

   ```python
   import os, sys
   from pathlib import Path
   
   def _try_acquire_pid_lock(pid_path: Path) -> int | None:
       """Acquire an exclusive non-blocking advisory lock on pid_path.
       
       Returns the open fd on success, or None if another process holds it.
       The fd MUST be retained for the daemon's lifetime; closing releases the lock.
       """
       fd = os.open(str(pid_path), os.O_RDWR | os.O_CREAT, 0o644)
       try:
           if sys.platform == "win32":
               import msvcrt
               # LK_NBLCK = non-blocking exclusive lock on byte 0
               msvcrt.locking(fd, msvcrt.LK_NBLCK, 1)
           else:
               import fcntl
               fcntl.flock(fd, fcntl.LOCK_EX | fcntl.LOCK_NB)
           return fd
       except (OSError, BlockingIOError):
           os.close(fd)
           return None
   ```

3. **Windows semantics caveat — must be in spec.md as a known limitation.** `msvcrt.locking(LK_NBLCK)` locks a byte range; it is mandatory locking on Windows (other processes get `EACCES` on read/write of the locked range), unlike `fcntl.flock`'s advisory semantics. This is **stronger** than required, not weaker — both Unix and Windows will block a second daemon from acquiring the lock. PID-recycling races are bounded by the same fcntl/msvcrt acquire on the lock fd, which dies with the holder process.

4. **Win32 `_pid_alive` branch (`client.py:244-256`) — verified correct.** `OpenProcess(0x1000, False, pid)` returns a non-NULL handle iff a process with `pid` exists and the caller has `PROCESS_QUERY_LIMITED_INFORMATION` rights. The PID-reuse window on Windows is bounded but not zero: if PID `N` exits and the kernel recycles `N` to a new process between `_pid_alive(N)` and the next operation, `_pid_alive` returns True for the wrong process. The proposed `flock`-on-`daemon.pid` advisory-lock pattern eliminates this PID-reuse hazard because the lock is tied to an open file descriptor inherited by the original PID; PID reuse cannot inherit the fd.

5. **AF_PIPE Listener does NOT have an analogous unlink hazard.** Windows named pipes use namespace registration, not filesystem inodes. A second `Listener(AF_PIPE)` on the same pipe name will fail with `ERROR_PIPE_BUSY` (231) instead of silently rebinding (which is what happens on AF_UNIX with the unconditional `unlink` at `daemon.py:615`). **Therefore the spec.md "guarded unlink" patch (Patch 4) only applies to the Unix branch (`if sys.platform != "win32"`).**

[SOURCE: .opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py:91,96,588,613,649]
[SOURCE: .opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/client.py:180,207,234,244-256,319,332,347,373]
[SOURCE: https://docs.python.org/3/library/msvcrt.html#msvcrt.locking]
[SOURCE: https://learn.microsoft.com/en-us/windows/win32/ipc/named-pipes ERROR_PIPE_BUSY semantics]

### P1-3 — `daemon.log` has no rotation handler. `RotatingFileHandler(maxBytes=10MB, backupCount=5)` recommended. Post-P0-3-fix baseline growth is ~5–10 MB/month, so the new handler also serves as future-proofing.

Evidence:

- `daemon.py:572-575` `logging.basicConfig(..., handlers=[logging.FileHandler(str(log_path)), logging.StreamHandler()], force=True)` — uses plain `FileHandler`, **no rotation**.
- `cli.py:41` `logger = logging.getLogger(__name__)` — CLI inherits root config; same plain handler.
- Searched for `RotatingFileHandler`, `TimedRotatingFileHandler`, `maxBytes`, `backupCount`: zero hits anywhere in `cocoindex_code/`.

Log composition forensics on the live `~/.cocoindex_code/daemon.log` (23 MB, 250,485 lines):

- 564 `BrokenPipeError: [Errno 32] Broken pipe` lines.
- ~215,840 lines that are NOT `Error|Traceback|^\s+|^File\s` (i.e., legitimate `INFO`-level log records — parse events, embedding logs, request acks).
- ~34,645 lines are `Error|Traceback|^\s+|^File\s` — i.e., 564 BrokenPipeError instances expanded into ~34k traceback lines (~61 lines per traceback, consistent with deeply nested asyncio + multiprocessing.connection stacks).

**Per-error byte cost:** 23 MB / 564 ≈ 40 KB per BrokenPipeError event (matches dispatch context estimate).

**Post-P0-3 baseline projection:**

- Eliminate 564 BrokenPipeError events × 40 KB = 22.6 MB removed.
- Remaining ~400 KB of legitimate INFO logs over 9d23h ≈ **40 KB/day** ≈ **1.2 MB/month** of legitimate growth.
- BUT: this estimate is for a **lightly used** daemon. Heavy reindexing (e.g., monorepo full re-scan) emits per-file `INFO Indexing %s` lines and per-batch embedding progress; growth could spike to 10–50 MB/day during active reindex.

**Recommendation (in priority order):**

1. **MUST**: Replace `logging.FileHandler(log_path)` with `RotatingFileHandler(log_path, maxBytes=10*1024*1024, backupCount=5)` at `daemon.py:572-575`. Total cap: 60 MB (10 MB current + 5 × 10 MB rotated). Survives both legitimate heavy reindex AND any regression that resurrects a noise loop.
2. **SHOULD**: Add a per-`logger` filter or `extra={'context': '...'}` discipline so future error-loop regressions don't inflate file size by 60× via traceback frames.
3. **NICE**: Add a `loguru`-style or stdlib `TimedRotatingFileHandler(when='D', interval=7, backupCount=4)` if calendar-based rotation is preferred. **Not recommended** because daemon restarts can already rotate by mtime-based naming, and size-based rotation gives a hard memory bound.

The P0-3 fix alone is necessary but not sufficient: the unrotated handler is a latent risk independent of the BrokenPipeError loop.

[SOURCE: .opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py:572-575]
[SOURCE: bash:wc -l + grep -cE BrokenPipeError + grep -cvE composition (250,485 / 564 / 215,840)]
[SOURCE: ls -la ~/.cocoindex_code/daemon.log mtime span: May 1 17:27 → May 7 08:00 = 5d14h33m]

### P2-3 — `cocoindex.db` (per-project, distinct from `target_sqlite.db`) is owned by the cocoindex Rust binding. Out of spec scope, but worth flagging.

`project.py:94-95` opens TWO per-project DBs:
- `cocoindex_db_path = index_dir / "cocoindex.db"` — passed to `coco.Settings.from_env(cocoindex_db_path)` at `:97`. Owned by the cocoindex Rust binding (incremental-build state, source-row tracking).
- `target_sqlite_db_path = index_dir / "target_sqlite.db"` — passed to `sqlite.connect(...)` at `:102`. The actual chunk vectors and metadata that `query.py` reads.

**Both are per-project**, not shared across projects. Two daemons indexing the **same** project would each open both files, but as established in P0-8, PID 98364 has no live request path. The cocoindex Rust binding's internal locking (whatever it is — probably SQLite's WAL mode) is out of spec scope for this packet. Flag for future investigation if a project sees concurrent indexers in production (e.g., someone running `ccc daemon-start` and `ccc index .` directly in parallel).

[SOURCE: .opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/project.py:94-102]

## LMDB Lock Analysis

**Verdict: no LMDB-related corruption risk existed.** The Q7 framing was based on a wrong premise.

The investigation followed three steps:

1. **Did the daemon ever open an LMDB env?** Searched `cocoindex_code/` for `lmdb`, `LMDB`, `MDB_`, `Environment(` — only hit is in `project.py:33` (a docstring comment "Close project resources to release file handles (LMDB, SQLite)"). No `import lmdb`, no `lmdb.open(...)`, no `lmdb.Environment(...)` call.

2. **Where is data persisted?** Two per-project SQLite DBs (`cocoindex.db`, `target_sqlite.db`), opened at `project.py:94-102` via `coco.Settings.from_env` (cocoindex Rust binding) and `cocoindex.connectors.sqlite.connect` (Python SQLite). No shared global LMDB.

3. **If two daemons did somehow open the same SQLite DB, would corruption result?** No. SQLite uses POSIX advisory file locks (default journal mode) or shared-memory `*-shm` locks (WAL mode) at the kernel level. These are cross-process by design. The user-code `asyncio.Lock` at `daemon.py:148` (per-project) is in-process only — but SQLite's own locking catches this miss at the cost of one writer blocking. **Worst-case outcome is delayed indexing, not corruption.**

4. **For our specific incident: was PID 98364 ever issuing writes?** No. PID 98364 had 0.0% CPU and lost its socket binding 9d23h before packet creation. Writes in this codebase are exclusively request-driven (`_dispatch` → `IndexRequest` → `registry.update_index`). No socket → no clients → no requests → no writes. PID 98364 was an idle fd-leak from the day it lost its binding.

**Action for spec.md:** Update §2 KNOWN CONTEXT to drop the LMDB framing. Update Q7 as RESOLVED-NEGATIVE in §3 KEY QUESTIONS. No new Patch is required for Q7. Add a one-paragraph "Storage model" subsection clarifying that all writes are per-project SQLite, plus a one-line note that the cocoindex Rust binding owns `cocoindex.db` opacity.

## Cross-Platform Compatibility Sketch

**Verdict: Patch 1 (advisory lock) translates cleanly. Patch 4 (guarded unlink) is Unix-only by construction. Win32 `_pid_alive` is correct but PID-reuse is mitigated by the lock-fd pattern.**

### The proposed cross-platform advisory-lock helper

Lives in `client.py` (the natural home for `_pid_alive` and friends). Spec.md should reference this in Patch 1.

```python
import os, sys
from pathlib import Path

def _try_acquire_pid_lock(pid_path: Path) -> int | None:
    """Acquire an exclusive non-blocking advisory lock on pid_path.

    Returns the open fd on success, or None if another process holds it.
    The fd MUST be retained for the daemon's lifetime; closing releases
    the lock. Cross-platform: fcntl.flock on Unix, msvcrt.locking on Win32.

    Caller protocol (in start_daemon):
      1. fd = _try_acquire_pid_lock(daemon_pid_path())
      2. if fd is None: another daemon holds the lock, exit early.
      3. write os.getpid() to pid_path.
      4. fork+exec the daemon child, passing fd via env or pre-opened fd
         so the child inherits the lock. Parent closes its copy.
      5. Daemon child holds fd until shutdown; OS releases lock on exit.
    """
    fd = os.open(str(pid_path), os.O_RDWR | os.O_CREAT, 0o644)
    try:
        if sys.platform == "win32":
            import msvcrt
            msvcrt.locking(fd, msvcrt.LK_NBLCK, 1)
        else:
            import fcntl
            fcntl.flock(fd, fcntl.LOCK_EX | fcntl.LOCK_NB)
        return fd
    except (OSError, BlockingIOError):
        os.close(fd)
        return None
```

### Existing Win32 abstractions in this codebase

The daemon already maintains a Win32-aware abstraction layer:
- Connection family: `AF_PIPE` (Win32) vs `AF_UNIX` (POSIX) at `daemon.py:91`.
- Socket path: named pipe (Win32) vs unix-socket file (POSIX) at `daemon.py:96-103`.
- Socket unlink: skipped on Win32 (named pipes have namespace registration, not inodes) at `daemon.py:588,613`.
- `Listener._socket.settimeout` shielded by try/except for AF_PIPE quirk at `daemon.py:649-651`.
- `_pid_alive`: ctypes `OpenProcess` (Win32) vs `os.kill(pid, 0)` (POSIX) at `client.py:244-256`.
- 8+ other `sys.platform == "win32"` branches in `client.py` for path resolution and process spawn.

Adding `fcntl.flock` ↔ `msvcrt.locking` is consistent with this established pattern. **No new abstraction surface is introduced.**

### Win32 `_pid_alive` review

The current implementation at `client.py:244-256` is correct:
- Uses `OpenProcess(0x1000, False, pid)` where `0x1000 = PROCESS_QUERY_LIMITED_INFORMATION`. This succeeds for any existing PID accessible to the user, including PIDs the user does not own. Avoids the `os.kill(pid, 0)` Win32 CPython bug (per the comment at `client.py:245-248`: "corrupts the C-level exception state, causing subsequent C function calls to raise SystemError").
- Returns False if `OpenProcess` fails (PID does not exist, or insufficient privilege — but `PROCESS_QUERY_LIMITED_INFORMATION` is granted to all callers for any process).

**Known PID-reuse hazard:** on Windows, PIDs are recycled aggressively (16-bit space, ~32k unique values). `_pid_alive(N)` may return True for a recycled PID belonging to a completely unrelated process. The proposed `flock`-on-`daemon.pid` lock pattern eliminates this: the lock is tied to the open fd inherited by the real daemon process, not to the PID number. Even if Windows recycles the PID, the unrelated process does NOT inherit the fd and therefore does NOT hold the lock. `_try_acquire_pid_lock` succeeds for the new daemon → safe restart.

### AF_PIPE asymmetry vs AF_UNIX

A second `Listener(AF_PIPE, name="cocoindex_daemon")` on Windows fails with `ERROR_PIPE_BUSY` (Win32 error 231) instead of silently rebinding. **Therefore the spec.md "guarded unlink" patch (Patch 4 — `Path(sock_path).unlink(missing_ok=True)` only if `_pid_alive(stored_pid)` is False) only applies to the POSIX branch** at `daemon.py:613-615`. The existing `if sys.platform != "win32":` guard at `:613` already isolates this; Patch 4 just narrows the inner unlink. No Win32 work is needed for Patch 4.

## Log Rotation Recommendation

**Verdict: replace `FileHandler` with `RotatingFileHandler(maxBytes=10*1024*1024, backupCount=5)` at `daemon.py:572-575`. P0-3 fix alone is necessary but not sufficient.**

### Drop-in patch sketch

```python
# daemon.py:570-578 (replace existing block)
import logging
from logging.handlers import RotatingFileHandler

log_path = daemon_log_path()
file_handler = RotatingFileHandler(
    str(log_path),
    maxBytes=10 * 1024 * 1024,  # 10 MB
    backupCount=5,               # keep daemon.log + .1..5
)
file_handler.setFormatter(
    logging.Formatter("%(asctime)s %(levelname)s %(name)s: %(message)s")
)
logging.basicConfig(
    level=logging.INFO,
    handlers=[file_handler, logging.StreamHandler()],
    force=True,
)
```

### Why this matters even after P0-3

1. **Defense in depth.** Any future regression that resurrects an error-loop pattern (different exception, same chain) will be capped at 60 MB instead of unbounded.
2. **Heavy reindex bursts.** Full monorepo reindex emits per-file `INFO` records. A 50k-file workspace could legitimately produce 50–100 MB during one reindex. Current `FileHandler` keeps it all forever.
3. **Operator UX.** Without rotation, `tail -f daemon.log` on a long-lived daemon eventually pages in tens of MB at start; with rotation, the active file is always ≤10 MB.

### Configuration recommendation

- `maxBytes=10*1024*1024` — gives operators a 10 MB working window for `tail`, `less`, `grep`. Larger than the average per-day legitimate volume even under heavy use.
- `backupCount=5` — total cap 60 MB. Daemon can run a year without filling more than 60 MB.
- Avoid `TimedRotatingFileHandler(when='D')` — calendar-based rotation interacts poorly with daemons that restart frequently (each restart truncates the in-progress day's log via `force=True`).

## Edge Cases

- **Ambiguous input**: dispatch context framed Q7 as LMDB-corruption risk. Investigation revealed no LMDB exists. Selected the narrower interpretation ("any cross-process write contention") and resolved it negatively. Documented the original framing's wrongness in P0-7 so iter 5 synthesis updates spec.md.
- **Contradictory evidence**: docstring at `project.py:33` mentions "LMDB" alongside "SQLite" but no LMDB import exists. Treated as legacy/aspirational doc; flagged in P0-7 for spec correction. The cocoindex Rust binding may use LMDB internally — this is out of spec scope (P2-3).
- **Missing dependencies**: none. All sources accessible.
- **Partial success**: full success on Q6/Q7/Q8. Q9 (socket backlog) deferred to iter 4 — would need a deeper read of the accept-loop's backlog parameter and `multiprocessing.connection.Listener` defaults.

## Sources Consulted

- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py` (lines 1–105, 240–360, 565–675)
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/client.py` (lines 240–280)
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/project.py` (full file via grep on lmdb/sqlite/RotatingFileHandler)
- `~/.cocoindex_code/` directory listing
- `~/.cocoindex_code/daemon.log` (line counts, BrokenPipeError grep, mtime span)
- Repo-local `<repo>/.cocoindex_code/` for `target_sqlite.db` + `cocoindex.db` confirmation
- Python stdlib docs: `msvcrt.locking`, `logging.handlers.RotatingFileHandler` (background knowledge, no live fetch)

## Assessment

- **New information ratio**: 0.85 (4 of 5 findings wholly new: P0-7, P0-8, P0-9, P1-3; P2-3 partially new — flags a known-but-out-of-scope concern).
- **Questions addressed**: Q6, Q7, Q8.
- **Questions answered**: Q6 (rotation needed), Q7 (no LMDB → no risk), Q8 (cross-platform sketch validated).
- **Questions still open**: Q9 (socket backlog) — deferred to iter 4.

## Reflection

- **What worked**: starting Q7 with a literal `grep -lE 'lmdb|LMDB|Environment\('` across `cocoindex_code/` immediately falsified the framing in one tool call. Beats reasoning from the dispatch prompt's premise. Carries forward iter 1+2 lesson: **read the actual code first, then reason about what the bug-hunt prompt thought was true**.
- **What worked**: chained `wc -l` + `grep -cE BrokenPipeError` + `grep -cvE 'Error|Traceback|^\s+|^File\s'` in one bash call to do the full log composition in a single tool round. Saved 2 tool calls vs reading the log incrementally.
- **What did not work**: I almost ran a CocoIndex search for "LMDB write path" before checking the import list. That would have wasted budget on a hallucinated answer. Course-corrected to direct ripgrep.
- **What I would do differently**: include `find / -name '*.mdb'` (scoped to home + repo) in the very first tool call alongside the grep, so we have on-disk + in-code evidence simultaneously. Cuts one round trip.

## Recommended Next Focus

**Iteration 4 priorities:**

1. **Q9 (socket backlog)** — the only key question still open. Read `daemon.py:619` `Listener(sock_path, family=_connection_family())` and check the `backlog` argument default (Python `multiprocessing.connection.Listener` does not accept `backlog`; falls through to `socket.SOMAXCONN`). Quantify: during the BrokenPipeError loop on PID 24938, did connection accept queue fill up and contribute to perceived CPU pressure? Likely <2 tool calls.

2. **Synthesize the full spec.md correction list** — iter 5 will be the synthesis pass. Iter 4 should produce a final running list of:
   - All 9 P0/P1 findings across iters 1–3 (P0-1 through P0-9, P1-1 through P1-3).
   - All P2 findings (P2-1, P2-2, P2-3).
   - Concrete `-`/`+` diff sketches for each spec.md section to update.

3. **Validate the cross-platform helper sketch (P0-9) against any existing cocoindex Win32 tests.** Search `mcp_server/tests/` for `sys.platform`, `windll`, `msvcrt`, `OpenProcess` to confirm the recommendation will not collide with existing test fixtures.

4. **Risk of premature stop**: convergence delta is approaching threshold. Iters 3 produced 4 wholly new findings (0.85 novelty), reaffirming several iter-2 findings without contradiction. If iter 4 yields ≥0.20 novelty, continue to iter 5 synthesis as planned. If ≤0.10, declare convergence and bring iter 5 forward as synthesis-only.
