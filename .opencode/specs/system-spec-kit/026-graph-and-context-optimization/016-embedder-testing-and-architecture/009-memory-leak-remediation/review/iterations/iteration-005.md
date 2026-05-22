# Iteration 005 — correctness

## Metadata
- Iteration: 5 of 10
- Dimension: correctness
- Timestamp: 2026-05-22T17:12:02Z
- Findings this iter: 6

## Summary
Reviewed the arc 009 lifecycle code paths with a second correctness pass, focusing on concurrent project refresh/removal behavior, sidecar child termination, cleanup idempotence, bounded cache semantics, and task-registry shutdown state. The new findings are not duplicates of the existing acquisition-race and signal-hook findings: they cover resource owners that can be closed under active work, timeout paths that can detach live sidecar processes, and helper state that can report or enforce the wrong lifecycle condition.

## New Findings

### P0 — Blockers
None

### P1 — Required

#### Config refresh can close a project while indexing is active
- **Fingerprint:** `correctness:cocoindex-project-refresh:closes-project-during-active-index`
- **File(s):** `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py:452`, `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py:460`, `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py:491`, `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py:773`
- **Evidence:** `_refresh_project_if_config_changed()` pops the loaded project and calls `project.close()` immediately. `_run_index()` separately keeps `project = self._projects[project_root]` and then awaits `project.update_index(...)` under the per-project lock. `search()` calls `_refresh_project_if_config_changed(project_root)` before checking or waiting on that lock.
- **Reasoning:** The remove-project path uses the active-work registry and a bounded drain before closing, but config refresh bypasses both. A concurrent search/status path that detects a config hash change can close the SQLite/project resources while an index task is still using the already-captured `Project` object. That violates the same lifecycle invariant phase 006 was meant to establish: do not close resources underneath active index work.
- **Suggested fix:** Route config refresh through the same active-work/lock drain used by remove, or make refresh async and acquire the per-project index lock before popping and closing the project. Add a regression where an index task holds the lock while config metadata changes and a search triggers refresh.

#### Embedder sidecar timeout cleanup can detach a live child
- **Fingerprint:** `correctness:embedder-sidecar-client:sigterm-without-exit-wait-leaks-worker`
- **File(s):** `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts:327`, `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts:337`, `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts:372`, `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts:457`
- **Evidence:** `killWorker()` sends `SIGTERM` and immediately calls `cleanupChild()`, which removes stdout/stderr/exit listeners and sets `this.child = null`. The request timeout path similarly sends `SIGTERM` from a timer and rejects without waiting for exit or escalating.
- **Reasoning:** In Node, `child.kill('SIGTERM')` only reports that a signal was sent; it does not prove the worker exited. Because the client removes listeners and drops the child reference immediately, a slow or signal-resistant worker can keep the embedding provider/model resident while the next request starts a new worker. This recreates a process-local memory leak inside the cleanup path added to prevent leaks.
- **Suggested fix:** Track a terminating state, wait for the child `exit` event with a bounded grace period, and send `SIGKILL` on timeout before dropping listeners/reference. Add a fixture with a worker that ignores `SIGTERM` and assert no second worker is spawned until the first is actually gone or killed.

#### Rerank sidecar warmup timeout can leave an unledgered process
- **Fingerprint:** `correctness:rerank-sidecar:warmup-timeout-no-wait-or-ledger-cleanup`
- **File(s):** `.opencode/skills/system-rerank-sidecar/scripts/ensure_rerank_sidecar.py:192`, `.opencode/skills/system-rerank-sidecar/scripts/ensure_rerank_sidecar.py:195`, `.opencode/skills/system-rerank-sidecar/scripts/ensure_rerank_sidecar.py:201`
- **Evidence:** On failed warmup, `ensure_rerank_sidecar()` sends `SIGTERM` to `proc.pid` and immediately returns `{"fallback": "warmup-timeout"}`. The ledger row is written only later, after the health probe succeeds.
- **Reasoning:** A sidecar can exceed the health deadline while still loading, ignore or delay `SIGTERM`, and then become healthy after the ensure call has returned. That process is not recorded in `.sidecar-ledger.json`, so later ownership checks cannot classify, reuse, or safely clean it. The existing security finding covers accepting the wrong healthy port; this is the timeout cleanup path leaking a process the launcher itself spawned.
- **Suggested fix:** After timeout, wait for process exit, escalate to process-group `SIGKILL` after a short grace period, and only return fallback once the spawned PID is confirmed gone. If the process becomes healthy during the grace window, record a ledger row or explicitly classify it as unknown-owned.

#### `Project.close()` marks resources closed before close succeeds
- **Fingerprint:** `correctness:cocoindex-project-close:marks-closed-before-db-close-succeeds`
- **File(s):** `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/core/project.py:38`, `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/core/project.py:42`, `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/core/project.py:44`
- **Evidence:** `Project.close()` sets `self._closed = True`, then calls `db.close()` inside a broad `except Exception: pass`.
- **Reasoning:** If SQLite/CocoIndex close fails once, the project is permanently marked closed and every later close attempt returns early. The caller also gets no error signal. In a remediation arc whose contract is deterministic DB/resource release, this can silently convert a failed close into a successful lifecycle state while the handle remains open.
- **Suggested fix:** Move `_closed = True` after a successful close, log or propagate close failures, and leave the project retryable when close fails. Add a test with a fake DB whose first `close()` raises and assert a second `Project.close()` retries.

### P2 — Suggestions

#### `BoundedMap` can exceed `maxSize` when the oldest key is `undefined`
- **Fingerprint:** `correctness:bounded-map:undefined-key-blocks-eviction`
- **File(s):** `.opencode/skills/system-spec-kit/mcp_server/lib/memory/bounded-cache.ts:51`, `.opencode/skills/system-spec-kit/mcp_server/lib/memory/bounded-cache.ts:57`, `.opencode/skills/system-spec-kit/mcp_server/lib/memory/bounded-cache.ts:58`
- **Evidence:** Eviction reads `const first = this.keys().next().value as K | undefined;` and breaks when `first === undefined`.
- **Reasoning:** `undefined` is a valid JavaScript `Map` key. For `new BoundedMap(1).set(undefined, a).set('b', b)`, the first key is `undefined`, the loop breaks, and the map remains over the configured bound. Most current call sites use string keys, so this is lower severity, but it is still a correctness bug in the shared retention primitive.
- **Suggested fix:** Check the iterator's `done` flag instead of using the key value as the sentinel. Add a unit test with `undefined` as the oldest key.

#### Task-registry shutdown mutates completed history back to cancelling
- **Fingerprint:** `correctness:cocoindex-daemon-task-registry:shutdown-mutates-completed-history`
- **File(s):** `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/lifecycle/daemon_task_registry.py:100`, `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/lifecycle/daemon_task_registry.py:107`, `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/lifecycle/daemon_task_registry.py:151`, `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/lifecycle/daemon_task_registry.py:189`
- **Evidence:** `cancel()` iterates every retained row and sets `row.status = "cancelling"` without checking whether the row is already `"complete"`. Completed rows are intentionally retained by `_remember_completed()` until the history cap evicts them.
- **Reasoning:** A shutdown after some tasks have already completed rewrites completed diagnostic rows to `cancelling`. Their done callbacks will not run again, so the registry can return shutdown state that says old completed tasks are still cancelling. That does not directly leak a process, but it corrupts lifecycle evidence and can mislead stuck-shutdown/recovery logic.
- **Suggested fix:** Have `cancel()` skip rows whose status is already `complete`, or split live rows from completed-history rows before cancellation. Add a test where one completed task and one running task exist before shutdown; only the running row should change status.

## Convergence Signal
- New findings this iter: 6
- Cumulative finding count after iter: 32
- New-findings ratio: 0.19
- Continue / converged signal: `continue`

## Files Touched (this iter)
- `iterations/iteration-005.md`
- `deltas/iter-005.jsonl`
- `deep-review-findings-registry.json`
- `deep-review-state.jsonl`
- `deep-review-dashboard.md`
