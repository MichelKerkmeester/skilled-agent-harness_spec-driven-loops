# Iteration 1: Bug-surface completeness (Q1 + Q2) and stale-daemon trigger (Q4 light)

## Focus
Audit every daemon spawn site for the same idempotency hole as `start_daemon()`, classify every `send_bytes` call site for the double-crash pattern at `daemon.py:436-444`, and reconstruct from `daemon.log` how PID 98364 lost its socket binding while staying alive.

## Findings

### P0-1 — `start_daemon()` is the **only** spawn site, but it is reachable via three concurrent entry points with no cross-process locking
- **Severity**: P0 (confirms the spec.md ground-truth bug; clarifies blast radius)
- **Evidence**:
  - Only spawn calls in `mcp_server/`: `client.py:212` (Win32 branch) and `client.py:220` (Unix branch). Both inside `start_daemon()`. [SOURCE: .opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/client.py:192-227]
  - All other code paths funnel through `start_daemon()`:
    - `client.py:426` inside `ensure_daemon()` after a connect-refused or version mismatch [SOURCE: .opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/client.py:405-443]
    - `cli.py:538` `daemon restart` command (calls `stop_daemon()` first, so safer) [SOURCE: .opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/cli.py:529-544]
    - `cli.py:85`, `cli.py:511`, `server.py:302`, `server.py:340` all go through `ensure_daemon()` [SOURCE: .opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/cli.py:81-89; server.py:202-340]
  - `test_e2e_daemon.py:64` calls `start_daemon()` directly in test setUp — same race exposure, but tests serialize via fixtures.
- **Conclusion**: The remediation does NOT need to patch additional spawn sites. Fixing the idempotency hole inside `start_daemon()` (and ensuring `ensure_daemon()`'s exception path also routes through the new pre-flight) covers every reachable caller. **However**, three concurrent processes (e.g., MCP server, `ccc search` CLI, `ccc index` CLI) racing on `connection refused` will all enter `start_daemon()` with no inter-process lock — the proposed `_pid_alive()` check inside the function helps each caller skip a redundant spawn, but TOCTOU between `_pid_alive()` and `Popen` remains. Recommend the spec adopt an OS-level advisory lock on `daemon.pid` (`fcntl.flock` on Unix, `msvcrt.locking` on Win32) inside `start_daemon()` so only one caller wins the spawn.

### P0-2 — Socket-unlink on daemon startup is the **mechanism** by which PID 98364 lost its binding
- **Severity**: P0 (resolves Q4 root cause; reframes the bug from "mysterious zombie" to "predictable consequence of unguarded restart")
- **Evidence**:
  - `daemon.py:611-620`: every `_async_daemon_main()` invocation calls `Path(sock_path).unlink(missing_ok=True)` BEFORE `Listener(sock_path, family=...)`. This deletes whatever socket file is at that path, including one currently bound by another live daemon. [SOURCE: .opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py:611-620]
  - Log timeline establishes the actual sequence (different from spec.md's hypothesis):
    - `2026-04-27 11:18:28` PID 98364 starts (v0.2.3+spec-kit-fork.0.2.0) [SOURCE: ~/.cocoindex_code/daemon.log:242981]
    - `2026-04-27 17:08:49` PID 16404 starts (same version, **NO "Daemon stopped" line between them**) — concurrent spawn while 98364 was alive [SOURCE: ~/.cocoindex_code/daemon.log:243148]
    - `2026-05-01 17:25:39` "Daemon stopped" (likely PID 16404)
    - `2026-05-01 17:25:40` PID 18809 starts (v0.2.3, version downgrade — likely a stale PATH/install) [SOURCE: ~/.cocoindex_code/daemon.log:243813]
    - `2026-05-01 17:27:26` PID 24938 starts (v0.2.3+spec-kit-fork.0.2.0) — current `daemon.pid` content [SOURCE: ~/.cocoindex_code/daemon.log:243882]
- **Mechanism**: PID 98364 lost its socket binding at **17:08:49 on Apr 27**, not on May 1. PID 16404 (concurrent spawn) called `Path(sock_path).unlink()` and rebound. 98364's listener kept its file descriptor on the now-orphaned inode but never received new connections (clients connect by path, not inode). 98364 was alive but unreachable for 4d6h until being further obscured by PID 18809 / 24938 spawns.
- **Conclusion**: The spec.md correctly identifies the spawn-side fix, but should also note the daemon-side unlink behavior is what physically severs the prior daemon. Recommend the remediation include a defensive guard inside `_async_daemon_main()` that checks `daemon.pid` for a live PID before unlinking the socket, or at minimum fails fast with a clear error if another live daemon owns the socket file.

### P0-3 — Two `send_bytes` call sites in `daemon.py` are unprotected against `BrokenPipeError`; one is the known double-crash, the other is a brand-new finding
- **Severity**: P0 (extends bug 2 surface)
- **Evidence**:
  - **Class (a) — double-crash on broken pipe** (the known bug): `daemon.py:436-439` streams responses, catches `Exception`, then issues a second `conn.send_bytes` over the same broken connection [SOURCE: .opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py:434-439]. Confirmed.
  - **Class (c) — bare send outside any try/except**: `daemon.py:441` `conn.send_bytes(encode_response(result))` for non-streaming responses. Wrapped only by the outer connection-handler try/except at `daemon.py:445`, which catches the BrokenPipeError but ALSO logs `logger.exception("Error handling connection")`. Each broken non-streaming reply produces a stack trace in the 23 MB `daemon.log`. [SOURCE: .opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py:440-446]
  - **Class (b) — protected**: `daemon.py:411` (invalid request error reply), `daemon.py:417` (handshake error reply), `daemon.py:426` (handshake response). All inside the same outer try/except. Same noise problem as :441 but at lower frequency.
  - Client-side `send_bytes` at `client.py:75, 112, 165` are caller-side and not part of the daemon error-handler surface; they cannot trigger the double-crash. [SOURCE: .opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/client.py:75-165]
- **Conclusion**: Bug 2's spec patch (adding `BrokenPipeError`/`OSError` filtering before the second send at :436-439) is necessary but **insufficient**. The plan should either (a) wrap each `conn.send_bytes` in `daemon.py` with a small helper that swallows `BrokenPipeError`/`ConnectionResetError`/`EPIPE` quietly, or (b) move the outer except block to log `BrokenPipeError` at DEBUG (not exception). Otherwise log growth (Q6) continues even after the streaming-path fix.

### P1-1 — `ensure_daemon()` exception handler swallows `OSError` from version mismatch and falls through to a duplicate spawn path
- **Severity**: P1
- **Evidence**: `client.py:413-426` — on connect+handshake success but version-mismatch, the code calls `stop_daemon()` then unconditionally `start_daemon()`. If `stop_daemon()` fails to actually terminate the old daemon (e.g., because the StopRequest blocks behind a long index), `start_daemon()` runs against a still-live daemon, rebinds the socket, orphans the old. This is a SECOND code path producing the PID 98364 scenario, not just the connection-refused race. [SOURCE: .opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/client.py:413-443]
- **Conclusion**: The spec patch must verify `_pid_alive(old_pid) is False` (or honor a hard timeout) before the post-stop spawn, or take the advisory lock approach proposed in P0-1.

### P2-1 — Log volume amplified by per-broken-pipe `logger.exception` traceback at `daemon.py:438` AND outer handler at `daemon.py:445`
- **Severity**: P2 (informs Q6 growth-rate analysis but does not affect correctness)
- **Evidence**: 564 BrokenPipeError lines in 23 MB daemon.log. Each broken stream triggers `logger.exception` (multi-line traceback). [SOURCE: .opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py:438, :446; spec.md known-context]
- **Conclusion**: After fixing the double-crash, ensure log noise from broken clients drops to single-line WARN at most. Recommend adding `logging.handlers.RotatingFileHandler` configuration in iteration 3 work.

## Evidence

### Spawn-site table (Q1)
| Site | File:line | Spawns daemon? | Idempotency-safe? | Notes |
|------|-----------|----------------|-------------------|-------|
| `start_daemon()` Win32 branch | client.py:212 | YES | NO (bug 1) | Only Win32 entry |
| `start_daemon()` Unix branch | client.py:220 | YES | NO (bug 1) | Only Unix entry |
| `ensure_daemon()` initial connect path | client.py:415 | NO (connects only) | n/a | Calls start_daemon() in fallback path |
| `ensure_daemon()` version-mismatch path | client.py:421→426 | YES (via start_daemon) | NO (P1-1) | stop_daemon() not verified to complete |
| `daemon restart` CLI | cli.py:535→538 | YES (via start_daemon) | PARTIAL | stop_daemon() runs first |
| `cli.py search` (`require_daemon_for_project`) | cli.py:85 | YES (via ensure_daemon) | NO | Inherits start_daemon's race |
| `cli.py daemon status` | cli.py:511 | YES (via ensure_daemon) | NO | Inherits start_daemon's race |
| `server.py search` MCP tool | server.py:302 | YES (via ensure_daemon) | NO | Inherits start_daemon's race |
| `server.py index` MCP tool | server.py:340 | YES (via ensure_daemon) | NO | Inherits start_daemon's race |
| `test_e2e_daemon.py` setUp | test_e2e_daemon.py:64 | YES | TEST-ONLY | Serialized by fixtures |

**Total reachable spawn paths**: 2 direct + 6 indirect (8 callers, 1 underlying spawn). Fixing `start_daemon()` covers all 8.

### send_bytes safety table (Q2)
| Site | File:line | Class | Status |
|------|-----------|-------|--------|
| Streaming response | daemon.py:436 | (a) Inside try with retry | **BUG 2 (known)** — double-crash on broken pipe |
| Streaming-error retry | daemon.py:439 | (a) Same except block | **BUG 2 (known)** — the retry itself |
| Invalid-request error | daemon.py:411 | (b) Inside outer except | Safe-ish; outer except catches |
| Handshake error | daemon.py:417 | (b) Inside outer except | Safe-ish |
| Handshake response | daemon.py:426 | (b) Inside outer except | Safe-ish |
| Non-streaming response | daemon.py:441 | (c) **No inner try** | **NEW P0-3** — every broken non-streaming reply throws to outer handler that logs full traceback |
| Client index request | client.py:75 | (caller) | Out of scope (client side) |
| Client search request | client.py:112 | (caller) | Out of scope |
| Client generic _send | client.py:165 | (caller) | Out of scope |

**6 daemon-side sites total. Bug 2 covers 2 of them. P0-3 raises a third (line 441).**

### Log-history excerpts (Q4)
```
243148:2026-04-27 17:08:49,881 INFO cocoindex_code.daemon: Daemon starting (PID 16404, version 0.2.3+spec-kit-fork.0.2.0)
       (no "Daemon stopped" between PID 98364 start at 11:18:28 and PID 16404 start at 17:08:49 — concurrent spawn confirmed)
243811:2026-05-01 17:25:39,153 INFO cocoindex_code.daemon: Daemon stopped
243813:2026-05-01 17:25:40,323 INFO cocoindex_code.daemon: Daemon starting (PID 18809, version 0.2.3)
243882:2026-05-01 17:27:26,874 INFO cocoindex_code.daemon: Daemon starting (PID 24938, version 0.2.3+spec-kit-fork.0.2.0)
```
[SOURCE: /Users/michelkerkmeester/.cocoindex_code/daemon.log:242981, :243148, :243811-243883]

## Answered Questions
- **Q1 (Bug surface completeness — spawn sites)**: ANSWERED. Only `start_daemon()` (client.py:192-227) directly spawns. Fixing it covers all 8 reachable callers, but `ensure_daemon()` version-mismatch path (P1-1) and lack of inter-process lock (recommendation in P0-1) require additional remediation.
- **Q2 (Error-handler completeness — send_bytes)**: ANSWERED. 6 daemon-side call sites; spec.md covers 2 (the double-crash pair); P0-3 raises a third (`daemon.py:441`).
- **Q4 (Stale daemon root cause)**: ANSWERED. The mechanism is `_async_daemon_main()` unconditionally unlinking the socket file at startup (daemon.py:615) combined with the spawn-side race in `start_daemon()`. PID 98364 lost its binding at `2026-04-27 17:08:49`, not May 1.

## Next Focus (recommendation for iter 2)
1. **Q3 (race window characterization)**: Now that we know the unlink is the severance mechanism, instrument or reason about the timing window between `os.kill(pid, 0)` (proposed `_pid_alive()` check) and `subprocess.Popen` to quantify TOCTOU exposure. Should drive the spec's choice between "_pid_alive check" vs "advisory file lock".
2. **Q5 (worker subprocess interaction)**: Inspect `daemon.py:624-627` signal handlers and the `multiprocessing.resource_tracker` (PID 40681 in known-context). Is it reaped when parent dies via `Listener.close()`? When parent is orphaned by socket-unlink? Could we have leaked resource_tracker children too?
3. **Q10 (recovery completeness)**: Validate the `pkill -f "ccc run-daemon" && rm daemon.sock` recovery snippet against the new mechanism. Specifically: does the operator also need to verify `daemon.pid` references a live PID after pkill, given the socket-unlink behavior?

## Ruled Out (this iteration)
- "Other Popen sites in mcp-coco-index/" — exhaustive grep finds none. Do not retry this in subsequent iterations.
- "Hypothesis: PID 98364 was killed by SIGTERM" — no signal trace in log; mechanism is socket-unlink, not signal.

## Edge Cases
- **Ambiguous input**: None. Strategy §16 explicitly listed Q1, Q2, Q4-light.
- **Contradictory evidence**: Spec.md known-context says PID 98364 stopped serving "around May 1 17:27"; log evidence shows the actual severance was Apr 27 17:08:49. Both are cited; iteration trusts the log timestamps. Recommend updating spec.md known-context.
- **Missing dependencies**: None.
- **Partial success**: None — all three planned tasks completed within budget.

## Sources Consulted
- .opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/client.py:60-263, 395-443
- .opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py:395-451, 600-650
- .opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/cli.py:75-89, 503-544
- /Users/michelkerkmeester/.cocoindex_code/daemon.log:1-243883 (sampled by grep on `Daemon (starting|stopped|stopping)|signal`)
- ripgrep results: `subprocess\.Popen|Popen\(|start_daemon|restart_daemon|ensure_daemon` (entire mcp-coco-index/ tree)
- ripgrep results: `conn\.send_bytes|socket\.send_bytes|\.send_bytes\(` (mcp_server/cocoindex_code/)

## Assessment
- **New information ratio**: 0.85 (3 of 5 findings are wholly new — P0-2 mechanism, P0-3 third send_bytes hole, P1-1 version-mismatch path; P0-1 refines known bug-1; P2-1 contextualizes known noise)
- **Questions addressed**: Q1, Q2, Q4
- **Questions answered**: Q1, Q2, Q4

## Reflection
- **What worked**: Three parallel ripgrep + log-grep calls returned enough structural evidence to answer Q1/Q2/Q4 without needing to read every test file. Reading `daemon.py:611-620` (the listener setup) was the breakthrough for Q4 — without it, the log timeline alone would have been suggestive but not causal.
- **What did not work**: Initial `rg -nE` failed because `-E` is a grep-style "encoding" flag in ripgrep. Recovered by dropping it (ripgrep already does regex by default).
- **What I would do differently**: For iter 2, jump straight to reading `daemon.py:624-627` signal handlers AND the `Listener._accept_loop` (daemon.py:645+) before trying log forensics — the code is the cheaper data source.

## Recommended Next Focus
See **Next Focus** section above. Priority order: Q3 (race window) → Q5 (worker subprocess) → Q10 (recovery completeness). Iter 2 should fit comfortably in 12 tool calls because the questions are all in `daemon.py` and the spec's recovery snippet.
