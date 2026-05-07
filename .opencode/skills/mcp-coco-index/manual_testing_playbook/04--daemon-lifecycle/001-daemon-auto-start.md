---
title: "DMN-001 -- Daemon auto-start"
description: "This scenario validates Daemon auto-start for `DMN-001`. It focuses on Verify daemon starts automatically when a CLI command is issued after it has been stopped."
---

# DMN-001 -- Daemon auto-start

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. SCENARIO CONTRACT](#2--scenario-contract)
- [3. TEST EXECUTION](#3--test-execution)
- [4. SOURCE FILES](#4--source-files)
- [5. SOURCE METADATA](#5--source-metadata)

## 1. OVERVIEW

This scenario validates Daemon auto-start for `DMN-001`. It focuses on Verify daemon starts automatically when a CLI command is issued after it has been stopped.


---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `DMN-001` and confirm the expected signals without contradictory evidence.

- Objective: Verify daemon starts automatically when a CLI command is issued after it has been stopped
- Real user request: `Please verify daemon starts automatically when a CLI command is issued after it has been stopped.`
- Prompt: `Verify the CocoIndex daemon auto-starts after being stopped when a search command runs.`
- Expected execution process: Run the TEST EXECUTION command sequence for `DMN-001`, capture the listed evidence, compare observed output with the expected signals, and return the verdict to the user.
- Expected signals: Step 1: daemon stops or reports already stopped; Step 3: search returns at least 1 result; Step 5: daemon reports running
- Desired user-visible outcome: A concise user-visible PASS/FAIL verdict naming whether the scenario satisfied the objective and the main reason.
- Pass/fail: PASS if search succeeds after daemon stop (auto-restart) AND daemon status confirms running; FAIL if search fails or daemon remains stopped


---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| DMN-001 | Daemon auto-start | Verify daemon starts automatically when a CLI command is issued after it has been stopped | `Verify the CocoIndex daemon auto-starts after being stopped when a search command runs.` | 1. Confirm no other playbook scenario is running against the same daemon -> 2. `bash: ccc daemon stop` -> 3. `bash: sleep 2` -> 4. `bash: ccc search "test" --limit 1` -> 5. Verify search returns results (daemon restarted) -> 6. `bash: ccc daemon status` (confirm running) | Step 2: daemon stops or reports already stopped; Step 4: search returns at least 1 result; Step 6: daemon reports running | Transcript of all 6 steps; daemon status output | PASS if search succeeds after daemon stop (auto-restart) AND daemon status confirms running; FAIL if search fails or daemon remains stopped | Check `~/.cocoindex_code/daemon.pid` for stale PID; check `daemon.log` for startup errors; verify port/socket availability |

### Atomic Spawn Signals

Patch 1 made daemon spawn atomic.
Concurrent calls to `start_daemon()` produce exactly 1 new process.
The losing caller blocks on the advisory lock and returns after the winner finishes startup.
The source helper is `_try_acquire_pid_lock` in `mcp_server/cocoindex_code/client.py`.
POSIX uses `fcntl.flock(fd, LOCK_EX | LOCK_NB)`.
Win32 uses `msvcrt.locking(fd, LK_NBLCK, 1)`.
Treat a second daemon process as a failure even when the search command returns results.

### Stale PID Lock Triage

If `_try_acquire_pid_lock` returns `None`, another caller holds the PID-file lock.
When `_pid_alive(stored_pid)` returns `False`, startup falls through to `_cleanup_stale_files` and retries with stale files removed.
When `_pid_alive(stored_pid)` returns `True`, startup is a no-op because the stored daemon still owns the PID.
Capture the stored PID, `ccc daemon status`, `ps -p <pid>` on POSIX or Task Manager evidence on Win32.
Report duplicate process evidence with both PIDs and the timestamped `daemon.log` startup lines.


---

## 4. SOURCE FILES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)


---

## 5. SOURCE METADATA

- Group: Daemon Lifecycle
- Playbook ID: DMN-001
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `04--daemon-lifecycle/001-daemon-auto-start.md`
