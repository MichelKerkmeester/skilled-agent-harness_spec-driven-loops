---
title: "Tasks: CocoIndex daemon resilience"
description: "Surgical 2-patch fix to the cocoindex daemon: idempotent start_daemon() guard and BrokenPipeError-safe error handler. T001-T012 across setup, implementation, verification."
trigger_phrases:
  - "cocoindex daemon tasks"
  - "start_daemon tasks"
  - "BrokenPipeError tasks"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "specs/system-spec-kit/026-graph-and-context-optimization/011-cocoindex-daemon-resilience"
    last_updated_at: "2026-05-07T07:34:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored tasks after spec + plan landed"
    next_safe_action: "Author checklist + description.json"
    blockers: []
    key_files:
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-05-07-027-cocoindex-daemon-spec"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: CocoIndex daemon resilience

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

*Capture pre-fix baselines and confirm test infrastructure works.*

- [ ] T001 Run existing `pytest mcp-coco-index/mcp_server/tests/test_daemon.py -v` to confirm baseline pass rate
- [ ] T002 Capture `pgrep -af "ccc run-daemon"` to a snapshot file under `<packet>/scratch/baseline-processes.txt`
- [ ] T003 [P] Capture `wc -l /Users/michelkerkmeester/.cocoindex_code/daemon.log` and `grep -c BrokenPipeError` to `<packet>/scratch/baseline-log.txt`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

*Two surgical patches plus four test cases. ~15 LOC production + ~50 LOC tests.*

- [ ] T004 **Patch 1**: Edit `client.py:start_daemon()`. Insert 6-line pre-flight check at the top of the function body (after the imports, before `daemon_dir().mkdir(...)`):
  ```python
  pid_path = daemon_pid_path()
  try:
      existing = int(pid_path.read_text().strip())
      if _pid_alive(existing):
          return  # daemon already running
      _cleanup_stale_files(pid_path, existing)
  except (FileNotFoundError, ValueError):
      pass
  ```
  Confirm imports for `daemon_pid_path`, `_pid_alive`, `_cleanup_stale_files` are present (they should be, the helpers live in the same module).

- [ ] T005 **Patch 2**: Edit `daemon.py:_handle_connection()` around lines 436-440. Wrap the error-response `send_bytes` in inner try/except:
  ```python
  except Exception as exc:
      logger.exception("Error during streaming response")
      try:
          conn.send_bytes(encode_response(ErrorResponse(message=str(exc))))
      except (BrokenPipeError, ConnectionResetError):
          pass  # client already disconnected
  ```

- [ ] T006 **Test**: Add `test_start_daemon_idempotent` to `tests/test_daemon.py`. Mock `subprocess.Popen` and assert: first call invokes `Popen`, second call (with a `_pid_alive=True` mock) does NOT invoke `Popen`.

- [ ] T007 **Test**: Add `test_start_daemon_cleans_stale_pid` to `tests/test_daemon.py`. Write a fake stale PID to `daemon.pid`, call `start_daemon()` with `_pid_alive=False` mock, assert `_cleanup_stale_files` was called and `Popen` was invoked.

- [ ] T008 **Test**: Add `test_handle_connection_swallows_broken_pipe_in_error_path` to `tests/test_daemon.py`. Patch both `send_bytes` calls to raise `BrokenPipeError`. Run a connection handler. Assert: outer `Error handling connection` is logged at most once (NOT once per BrokenPipe).

- [ ] T009 [P] **Test**: Add `test_e2e_double_start_does_not_spawn` to `tests/test_e2e_daemon.py`. Use the real subprocess fixtures. Call `start_daemon()` twice. Assert `pgrep -c run-daemon` returns 1.

- [ ] T010 **Recovery**: One-shot operator recovery. Kill leaked PID 98364 and the error-looping PID 24938 (`pkill -f "ccc run-daemon"`). Re-run `ccc run-daemon` to start a fresh daemon. (This task is OUT OF SCOPE for the patch commit. Track here so the orchestrator records the recovery action separately.)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T011 Run focused pytest: `pytest mcp-coco-index/mcp_server/tests/test_daemon.py mcp-coco-index/mcp_server/tests/test_e2e_daemon.py -v`. All new tests + existing tests pass.
- [ ] T012 Run a 100-disconnect soak script (`<packet>/scratch/soak.py` or one-liner). Open 100 connections in a tight loop, close each mid-stream. Verify `daemon.log` contains zero new `BrokenPipeError` lines.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks T001-T012 marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] checklist.md P0 items 100% verified with evidence
- [ ] `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh <packet> --strict` exits 0
- [ ] `implementation-summary.md` filled (post-implementation per Rule 13)
- [ ] T010 recovery action recorded as a separate operator log entry (no source-code change for that task)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Source files**:
  - `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/client.py`
  - `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/daemon.py`
- **Test files**:
  - `.opencode/skill/mcp-coco-index/mcp_server/tests/test_daemon.py`
  - `.opencode/skill/mcp-coco-index/mcp_server/tests/test_e2e_daemon.py`
- **Live evidence**: `/Users/michelkerkmeester/.cocoindex_code/daemon.log` (23 MB, 564 BrokenPipeError lines)
<!-- /ANCHOR:cross-refs -->
