---
title: "CocoIndex daemon resilience: idempotent start and pipe-safe error handler"
description: "Two interacting bugs in the mcp-coco-index daemon caused leaked-zombie processes and CPU-spinning log spam. start_daemon() blindly spawns without checking for an existing alive daemon, and the streaming-response error handler tries to send an error over the same broken pipe that just failed, double-crashing on every client disconnect."
trigger_phrases:
  - "cocoindex daemon resilience"
  - "daemon BrokenPipeError loop"
  - "stale daemon zombie"
  - "start_daemon idempotency"
  - "mcp-coco-index daemon leak"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "specs/system-spec-kit/026-graph-and-context-optimization/011-cocoindex-daemon-resilience"
    last_updated_at: "2026-05-07T07:30:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored spec from live diagnostic of leaked daemon + BrokenPipe loop"
    next_safe_action: "Author plan + tasks then dispatch fix"
    blockers: []
    key_files:
      - ".opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/client.py"
      - ".opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/daemon.py"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-05-07-027-cocoindex-daemon-spec"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: CocoIndex daemon resilience

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-05-07 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The mcp-coco-index daemon (`ccc run-daemon`) has two interacting bugs that cause runaway CPU and leaked zombie processes.

**Bug 1: `start_daemon()` is non-idempotent.** `client.py:192-225` blindly calls `subprocess.Popen` to spawn a new daemon without first checking whether an alive daemon is already running. The function does NOT consult `daemon.pid`, does NOT call `_pid_alive()`, and does NOT clean up stale state before spawning. This creates duplicate daemon processes when `start_daemon()` is invoked while another daemon is already running.

**Bug 2: `daemon.py:436-444` double-crashes on broken pipes.** The streaming-response branch sends bytes inside a try block. If the client disconnects mid-stream, `send_bytes()` raises `BrokenPipeError`. The except handler tries to send an `ErrorResponse` over the same broken pipe, which raises `BrokenPipeError` again. The outer except catches the second exception, logs it, and the connection drops. Each disconnect produces 2-3 stack traces in `daemon.log` plus elevated CPU from the error path.

**Live evidence captured 2026-05-07T07:30Z:**

- Two daemon processes running. PID 24938 (started May 1, 5d17h, 54.7% CPU) and PID 98364 (started Apr 27, 9d23h, 0.0% CPU but 244 open file descriptors). Only the May 1 daemon is bound to `daemon.sock`. The Apr 27 daemon is a leaked zombie.
- `daemon.log` is 23 MB and contains 564 `BrokenPipeError` lines clustered around active orchestration windows. Recent timestamps cluster on `2026-05-06 12:40-15:14` and `2026-05-07 07:58-08:00`.
- Active daemon CPU peaked at 72% during a multi-dispatch verification orchestration, dropping to ~5% only between dispatches.
- `daemon.pid` content is `24938` (only the active daemon). The leaked PID 98364 is not tracked anywhere.

### Purpose

Make the daemon lifecycle robust so that:
1. Calling `start_daemon()` while a healthy daemon is already running is a safe no-op.
2. Stale PID files are detected and cleaned at daemon startup.
3. A client disconnecting mid-stream produces a single graceful log line, not a double-crash with stack trace.

Success means an end user can run repeated MCP-driven sessions for hours without producing zombie daemons or 23 MB log files.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Pre-flight liveness check in `start_daemon()` using existing `_pid_alive()` and `_cleanup_stale_files()` helpers.
- BrokenPipeError-safe error path in the streaming-response branch of `daemon.py:_handle_connection`.
- Pytest cases under `mcp-coco-index/tests/`.
- Operator-facing recovery procedure documented in the implementation summary.
- One-time recovery: kill the leaked PID 98364 and restart the active PID 24938 cleanly.

### Out of Scope

- Cross-platform IPC redesign (Unix socket to TCP, Windows named pipes).
- Daemon multi-tenancy (one daemon per workspace vs shared).
- Indexing-correctness changes.
- Embedding model changes.
- Performance tuning beyond the targeted bug fixes.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/client.py` | Modify | Add pre-flight liveness check at the top of `start_daemon()` |
| `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/daemon.py` | Modify | Wrap the error-response `send_bytes` in try/except for `(BrokenPipeError, ConnectionResetError)` |
| `.opencode/skill/mcp-coco-index/mcp_server/tests/test_daemon.py` | Modify | Add 3 new test cases for idempotent start, broken-pipe-on-stream, broken-pipe-on-error-response |
| `.opencode/skill/mcp-coco-index/mcp_server/tests/test_e2e_daemon.py` | Modify | Add E2E case where `start_daemon()` called while alive returns without spawn |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `start_daemon()` is idempotent | Calling `start_daemon()` twice produces ONE process. The second call detects the live daemon and returns without spawning. Pytest case asserts process count via `psutil` or `pgrep`. |
| REQ-002 | Stale `daemon.pid` is cleaned at startup | If `daemon.pid` exists with a dead PID, `start_daemon()` calls `_cleanup_stale_files()` before spawning. Pytest case writes a fake stale PID, calls `start_daemon()`, asserts the new PID overwrites and the daemon is reachable. |
| REQ-003 | Broken pipe on stream response logs once | Client disconnect mid-stream produces exactly ONE log line at INFO or WARNING level. No `ERROR` stack traces. Pytest case patches `conn.send_bytes` to raise `BrokenPipeError` and asserts log contents. |
| REQ-004 | Broken pipe on error response is silently ignored | Client disconnect during the error-response path does NOT propagate to the outer except. The connection terminates cleanly. Pytest case patches both `send_bytes` calls to raise and asserts no second stack trace in the log. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Operator recovery procedure documented | `implementation-summary.md` Known Limitations section includes a one-paragraph operator workflow. Detect leaked daemon via `pgrep -fc run-daemon`, kill stale PIDs, restart via `ccc run-daemon`. |
| REQ-006 | `daemon.log` size advisory | After the fix, BrokenPipeError frequency drops to zero on disconnect. The log should not grow faster than legitimate index activity. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A 24-hour soak test with 100 simulated client connections (each opening, sending one request, closing mid-stream) produces zero `BrokenPipeError` lines in `daemon.log`.
- **SC-002**: Calling `ccc run-daemon` while a daemon is already alive produces no second process and no error.
- **SC-003**: Existing test suite under `mcp-coco-index/tests/` continues to pass.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Pre-flight check has a race window between read and spawn | Low. Two parallel `start_daemon()` calls could both pass the check before either spawns | Document as known caveat. Follow-up daemon dies on `bind()` since the socket is already taken. Could add a file lock if needed. |
| Risk | Stale PID matches a recycled PID for an unrelated process | Low. macOS/Linux PIDs cycle through ~99000+ entries before reuse | Use the existing `_pid_alive()` plus a process-name match (optional follow-up). |
| Risk | Tests require process spawn which is slow in CI | Medium. Each idempotency test forks a real daemon | Use small subset of cases. Mock `subprocess.Popen` for the unit-level idempotency check. Reserve real-spawn for one E2E case. |
| Dependency | `cocoindex_code.client._pid_alive()` and `_cleanup_stale_files()` already exist | Internal | No external dependency added. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Pre-flight liveness check adds <10 ms overhead to `start_daemon()` cold-start path.
- **NFR-P02**: Broken-pipe handling produces no measurable CPU difference vs the success path on a healthy disconnect.

### Reliability
- **NFR-R01**: Daemon survives 1000 abrupt client disconnects in a tight loop without leaking memory or file descriptors.
- **NFR-R02**: Daemon shutdown via `stop_daemon()` cleans the PID file, socket file, and any zombie children even if interrupted.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- `daemon.pid` is empty file. Treat as "no PID known", proceed to spawn.
- `daemon.pid` contains non-integer text. Log warning, treat as stale, clean and spawn.
- PID exists but belongs to a different user. `_pid_alive()` returns True (PermissionError catch). Skip spawn and log a warning.

### Error Scenarios
- Client opens connection then immediately closes (no handshake). Handler should detect and skip without crash.
- Client sends partial request then disconnects. `recv_bytes` raises `EOFError`, the surrounding except handles it.
- Server runs out of memory during streaming. Caught by the outer `except Exception` at line 444.

### State Transitions
- Pre-flight finds alive daemon. Return immediately, no spawn, no log.
- Pre-flight finds stale daemon (dead PID). Clean files, then spawn fresh.
- Pre-flight encounters a corrupt PID file. Log, clean files, spawn fresh.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 6/25 | 2 source files + 2 test files. ~10-15 LOC of net production change. ~50 LOC of tests. |
| Risk | 8/25 | Low risk. Uses existing helpers. Failure mode is the current behavior. |
| Research | 4/20 | Root cause is fully documented in the spec. No further research needed. |
| **Total** | **18/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Should the pre-flight check log the existing-daemon detection at INFO or DEBUG level? Default: INFO once, DEBUG on subsequent same-PID re-detections.
- Should we add a file-lock around the spawn to close the parallel-call race window? Default: no, document as known caveat.
- Is the BrokenPipeError-safe pattern needed elsewhere in `daemon.py` (other `send_bytes` call sites)? Confirm during implementation.
<!-- /ANCHOR:questions -->

---

<!-- SCAFFOLD_VALIDATION_COUNTS:
REQ-001
REQ-002
REQ-003
REQ-004
REQ-005
REQ-006
**Given** start_daemon called once with no daemon running
**Given** start_daemon called twice in succession
**Given** stale daemon.pid pointing at dead PID
**Given** corrupt daemon.pid with non-integer content
**Given** client disconnects mid-stream after partial response
**Given** client disconnects during error-response path
-->
