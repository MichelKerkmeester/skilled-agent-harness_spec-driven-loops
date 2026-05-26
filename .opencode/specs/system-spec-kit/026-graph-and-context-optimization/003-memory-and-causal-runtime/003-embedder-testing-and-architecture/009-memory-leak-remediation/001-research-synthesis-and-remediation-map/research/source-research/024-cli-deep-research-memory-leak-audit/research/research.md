# CLI Deep Research Memory Leak Audit - Final Synthesis

<!-- ANCHOR:final-synthesis -->

## Scope

This synthesis covers memory leaks and process lifecycle hazards in `.opencode/skills/mcp-coco-index` and `.opencode/skills/system-code-graph` during CLI deep-flow orchestration. It uses the existing deep-research artifacts as source of truth, especially `research/iterations/iteration-009.md`, `research/deltas/iter-009.jsonl`, and continuation validation iterations 011-015 for final severities, downgrade decisions, packet order, and verification gates.

No fixes were implemented. No target skill source files were edited. No follow-up packet directories were created.

## Executive Summary

The core conclusion is that correctness and lifecycle cleanup outrank resident-memory optimization based on current evidence.

The strongest findings are unsafe daemon remove/cancel/close behavior, missing protocol cancellation, orphan-prone background task ownership, detached process lifecycle, and code-graph launcher/server ownership hazards. Resident-memory risks are real, but the available measurements show fixed resident process costs, sandbox measurement limits, and failed-command VM stability. They do not prove successful-search leak growth or justify restoring the initial P0 memory-first ordering.

## Convergence Statement

Iteration 015 completes the extended 15 of 15 deep-research iterations. The continuation used `cli-codex` with `gpt-5.5`, `xhigh`, and `fast` for five additional recommendation-validation passes. There are no blockers for final synthesis.

Remaining questions are implementation-packet verification gates: successful Python `.venv/bin/ccc search` RSS slope outside the Homebrew `ccc` collision, sidecar 5xx/fallback RSS delta, `ccc mcp` parent PID active-vs-stale classification, and effective `SPECKIT_CODE_GRAPH_DB_DIR` identity across measured code-graph servers.

## Final Findings Summary

P1 lifecycle/correctness clusters:

- `remove-project-cancel-safety`: F-022 and F-026. Fix unsafe `RemoveProjectRequest` behavior that can pop registry state and close project resources while an index task is still using them.
- `daemon-protocol-cancel-index-surface`: F-019, F-020, F-021. Add a real per-index cancel surface instead of relying on whole-daemon stop or abandoned blocking calls.
- `daemon-and-mcp-bg-index-task-lifecycle`: F-005, F-010, F-017, F-018. Track, cancel, await, and log daemon/MCP background index tasks.
- `code-graph-launcher-single-owner-and-orphan-reap`: F-006, F-013, F-027. Enforce one launcher/server owner per DB dir, handle stale/orphaned servers, and close DB handles on shutdown.
- `mcp-host-session-process-sweep`: F-004 and M-007 inventory evidence. Treat detached daemon and multiple MCP/CLI children as orchestration lifecycle cleanup.
- `rerank-sidecar-lifecycle`: F-003. Fix detached sidecar lifecycle first; keep memory severity bounded without growth evidence.
- `registry-embedder-cache-lifecycle`: F-012, F-014, F-016. Fix deterministic retained embedder state across config changes.

P2 resident-memory/read-path clusters:

- `project-close-full-release`: F-011, F-025, with F-026 only P1 when paired with F-022.
- `adapter-lifecycle-management`: F-001, F-002, F-015, F-023, F-024, M-006-001, M-007-002.
- `code-graph-read-path-friction`: F-007, F-008.

No-action/nit:

- `no-action-cosmetic-logging`: F-009. This is a final-report bucket only, not a remediation packet to open.

## Final F-ID Matrix

| ID | Final packet | Final severity | Verification gate |
| --- | --- | --- | --- |
| F-001 | `adapter-lifecycle-management` | P2 | mcp-coco-index adapter/rerank/sidecar pytest gate |
| F-002 | `adapter-lifecycle-management` | P2 | mcp-coco-index adapter/rerank/sidecar pytest gate |
| F-003 | `rerank-sidecar-lifecycle` | P1 lifecycle / P2 memory | system-rerank-sidecar start/health/stop pytest gate |
| F-004 | `mcp-host-session-process-sweep` | P1 lifecycle/orchestration | dry-run process inventory and current-PID safety gate |
| F-005 | `daemon-and-mcp-bg-index-task-lifecycle` | P1 | mcp-coco-index bg_index/background/shutdown pytest gate |
| F-006 | `code-graph-launcher-single-owner-and-orphan-reap` | P1 lifecycle / P2 memory | system-code-graph launcher/DB-close test plus build gate |
| F-007 | `code-graph-read-path-friction` | P2 | system-code-graph read-path test plus build gate |
| F-008 | `code-graph-read-path-friction` | P2 | system-code-graph read-path test plus build gate |
| F-009 | `no-action-cosmetic-logging` | no-action/nit | MCP stdio smoke/static gate for inactive TTY-only handler |
| F-010 | `daemon-and-mcp-bg-index-task-lifecycle` | P1 | mcp-coco-index bg_index/background/shutdown pytest gate |
| F-011 | `project-close-full-release` | P2 | mcp-coco-index Project.close/remove_project pytest gate |
| F-012 | `registry-embedder-cache-lifecycle` | P1 | mcp-coco-index embedder/config_hash/refresh pytest gate |
| F-013 | `code-graph-launcher-single-owner-and-orphan-reap` | P1 lifecycle | system-code-graph launcher/DB-close test plus build gate |
| F-014 | `registry-embedder-cache-lifecycle` | P1 narrowed | mcp-coco-index embedder/config_hash/refresh pytest gate |
| F-015 | `adapter-lifecycle-management` | P2 | mcp-coco-index adapter/rerank/sidecar pytest gate |
| F-016 | `registry-embedder-cache-lifecycle` | P1 | mcp-coco-index embedder/config_hash/refresh pytest gate |
| F-017 | `daemon-and-mcp-bg-index-task-lifecycle` | P1 | mcp-coco-index bg_index/background/shutdown pytest gate |
| F-018 | `daemon-and-mcp-bg-index-task-lifecycle` | P1 | mcp-coco-index bg_index/background/shutdown pytest gate |
| F-019 | `daemon-protocol-cancel-index-surface` | P1 | mcp-coco-index cancel_index/protocol/timeout pytest gate |
| F-020 | `daemon-protocol-cancel-index-surface` | P1 | mcp-coco-index cancel_index/protocol/timeout pytest gate |
| F-021 | `daemon-protocol-cancel-index-surface` | P1 as protocol-cancel symptom | mcp-coco-index cancel_index/protocol/timeout pytest gate |
| F-022 | `remove-project-cancel-safety` | P1 | mcp-coco-index remove_project/cancel/index pytest gate |
| F-023 | `adapter-lifecycle-management` | P2 | mcp-coco-index adapter/rerank/sidecar pytest gate |
| F-024 | `adapter-lifecycle-management` | P2 | mcp-coco-index adapter/rerank/sidecar pytest gate |
| F-025 | `project-close-full-release` | P2 | mcp-coco-index Project.close/remove_project pytest gate |
| F-026 | `remove-project-cancel-safety` | P1 when paired with F-022 | mcp-coco-index remove_project/cancel/index pytest gate |
| F-027 | `code-graph-launcher-single-owner-and-orphan-reap` | P1 lifecycle / P2 memory | system-code-graph launcher/DB-close test plus build gate |
| M-006-001 | `adapter-lifecycle-management` | P2-bound evidence | successful-search/fallback RSS benchmark before escalation |
| M-007-001 | `mcp-host-session-process-sweep` | P1 inventory evidence | dry-run process inventory and current-PID safety gate |
| M-007-002 | `adapter-lifecycle-management` | P2-bound evidence | successful-search/fallback RSS benchmark before escalation |

## Remediation Packet Order

1. `remove-project-cancel-safety`
   Dependency: none. Acceptance: active index work is tracked, cancelled, and bounded-awaited before `remove_project` pops registry entries or calls `Project.close`. Verification: mcp-coco-index remove_project/cancel/index pytest gate.

2. `daemon-protocol-cancel-index-surface`
   Dependency: `remove-project-cancel-safety`. Acceptance: project/request-scoped `CancelIndexRequest`, client API, and daemon dispatch path. Verification: mcp-coco-index cancel_index/protocol/timeout pytest gate.

3. `daemon-and-mcp-bg-index-task-lifecycle`
   Dependency: `daemon-protocol-cancel-index-surface`. Acceptance: daemon/MCP background index tasks are owned, cancelled, awaited, and their exceptions are visible. Verification: mcp-coco-index bg_index/background/shutdown pytest gate.

4. `code-graph-launcher-single-owner-and-orphan-reap`
   Dependency: independent, but should precede broad process sweep. Acceptance: one active code-graph owner per effective DB dir, stale/orphan handling, and shutdown `closeDb()`. Verification: system-code-graph launcher/DB-close test plus build gate.

5. `mcp-host-session-process-sweep`
   Dependency: coordinate with packets 3 and 4. Acceptance: dry-run inventory for `ccc mcp`, `ccc run-daemon`, code-graph launcher/server, sidecar, and CLI executor processes with parent, age, lineage, and current-session safety. Verification: dry-run process inventory and current-PID safety gate.

6. `rerank-sidecar-lifecycle`
   Dependency: independent; coordinate with process sweep. Acceptance: PID/port metadata, healthy reuse, stale PID detection, bounded startup cleanup, and non-destructive stop/reap behavior. Verification: system-rerank-sidecar start/health/stop pytest gate.

7. `project-close-full-release`
   Dependency: `remove-project-cancel-safety`. Acceptance: `Project.close()` is idempotent, deeper than target SQLite close, and cannot interleave with active index/update work. Verification: mcp-coco-index Project.close/remove_project pytest gate.

8. `registry-embedder-cache-lifecycle`
   Dependency: safest after remove/close ordering is settled. Acceptance: stale config-hash embedders are evicted or reference-counted across refresh/remove/close_all paths. Verification: mcp-coco-index embedder/config_hash/refresh pytest gate.

9. `adapter-lifecycle-management`
   Dependency: lower priority unless immediate RSS relief is required. Acceptance: reranker adapters, `httpx.Client`, fallback adapters, and `_ADAPTERS` cache clear paths have idempotent close/unload behavior. Verification: mcp-coco-index adapter/rerank/sidecar pytest gate plus successful-search/fallback RSS benchmark before any severity escalation.

10. `code-graph-read-path-friction`
    Dependency: after code-graph launcher ownership. Acceptance: batched/cached git freshness checks and bounded socket/transport retention. Verification: system-code-graph read-path test plus build gate.

11. `no-action-cosmetic-logging`
    Dependency: none. Acceptance: no remediation packet; F-009 remains mapped as no-action/nit. Verification: MCP stdio smoke/static gate for inactive TTY-only handler if touched incidentally.

## Measurement Notes

- M-006 sandbox limits: iteration 006 could not capture daemon RSS because `ps`/`pgrep` process enumeration and `sysctl vm.swapusage` were denied; the packet-local venv could not create the daemon spawn lock outside the writable sandbox.
- M-007 native inventory: iteration 007 captured process/RSS inventory showing detached `ccc run-daemon`, detached rerank sidecar, multiple `ccc mcp` children, multiple code-graph launcher/server processes, and a lingering CLI executor. This is strong lifecycle/process-inventory evidence.
- Homebrew `ccc` collision: the shell-resolved `/opt/homebrew/bin/ccc` is a different Node CLI and crashes on a missing native Sentry profiler module before contacting the Python code-index daemon.
- No successful-search growth slope: neither M-006 nor M-007 proves daemon RSS growth across normal successful search. Swap/pageout/swapout/compressor counters were flat across failed command windows, so memory-first P0 ordering is unsupported.

## Downgrade Notes

- F-001 and F-002: downgrade from initial P0 memory-first framing to P2 adapter lifecycle risk until successful-search/fallback RSS growth is measured.
- F-003: downgrade from P0 memory framing to P1 lifecycle / P2 memory. The sidecar is detached and resident, but growth is unproven.
- F-011 and F-025: keep P2 independently after close-depth evidence; P1 only when close can race active indexing through F-022/F-026.
- F-012/F-014/F-016: keep P1 because config-change embedder retention is deterministic, not because of measured process RSS growth.
- F-023/F-024 and M-006/M-007 adapter evidence: keep P2-bound until a successful-search/fallback benchmark proves larger growth.
- F-007/F-008: keep P2 read-path friction behind code-graph launcher/server ownership.

## Iterations 011-015 Validation Addendum

The continuation validated the recommendations rather than reopening broad discovery. It preserved the main conclusion: fix correctness and lifecycle ownership before resident-memory cleanup.

### Continuation Conclusions

- `remove-project-cancel-safety` remains the first packet to open. It is dependency-free, source-validated, and establishes the task registry/quiescence barrier required by later cancel, shutdown, close, and cache-eviction work.
- `remove-project-cancel-safety` and `daemon-protocol-cancel-index-surface` should stay split. Internal task ownership must exist before exposing public cancellation.
- `daemon-and-mcp-bg-index-task-lifecycle` should split by process boundary, or remain one parent packet with two mandatory sections: daemon task registry/shutdown and MCP ThreadPool shutdown.
- `rerank-sidecar-lifecycle` should land before process-sweep code can terminate sidecars. Process sweep may start as inventory-only first, but destructive sidecar handling needs a port-keyed ledger and health-visible instance metadata.
- `project-close-full-release` and `registry-embedder-cache-lifecycle` are ready after remove safety. Registry cache eviction is registry-owned and should not wait on reranker adapter lifecycle.
- `adapter-lifecycle-management` remains P2 and benchmark-gated. It has real close/unload gaps, but no successful-search or sidecar-fallback growth measurement yet.

### Refined Packet Order

1. `remove-project-cancel-safety`
2. `daemon-protocol-cancel-index-surface`
3. `daemon-bg-index-task-registry-shutdown`
4. `mcp-bg-index-threadpool-shutdown`
5. `code-graph-launcher-single-owner-and-orphan-reap`
6. `rerank-sidecar-lifecycle`
7. `mcp-host-session-process-sweep` inventory and termination policy
8. `project-close-full-release`
9. `registry-embedder-cache-lifecycle`
10. `adapter-lifecycle-management`
11. `code-graph-read-path-friction`
12. `no-action-cosmetic-logging`

If fewer packets are preferred, items 3 and 4 can remain one parent packet, but their acceptance gates must stay separate.

### Continuation Readiness Matrix

| Recommendation | Readiness | Dependency / pre-work | First verification gate |
| --- | --- | --- | --- |
| `remove-project-cancel-safety` | Ready to open now | None | Remove during explicit/load-time/queued index, bounded cancel/await, post-remove SQLite usability |
| `daemon-protocol-cancel-index-surface` | Ready after packet 1 | Choose `reqId`/`indexId` response schema | Protocol round trips, stale/not-found/already-complete/remove-in-progress cancel cases |
| `daemon-bg-index-task-registry-shutdown` | Ready after packet 1, or merge into packet 1 if small | Reuse owned task registry and remove barrier | Shutdown tracks and drains load-time/explicit index tasks |
| `mcp-bg-index-threadpool-shutdown` | Ready after daemon cancel identity exists | Blocking `DaemonClient.index` ThreadPool fixture | Visible `_bg_index` errors, bounded worker await, daemon-side cancel request |
| `code-graph-launcher-single-owner-and-orphan-reap` | Ready with fixture design first | Orphan, EPERM, symlink DB-dir fixtures | Same effective DB dir, PPID-1 orphan candidate, `closeDb()` on shutdown |
| `rerank-sidecar-lifecycle` | Ready with safety spec first | Ledger path, owner token, shared-service health schema | Fresh spawn ledger, healthy reuse, unknown-owner refusal, stale exact-PID cleanup |
| `mcp-host-session-process-sweep` | Ready as inventory first; termination later | Exact PID/resource identity confirmation and service policies | Dry-run no-signal, current PID/ancestor blocking, EPERM live/unknown |
| `project-close-full-release` | Ready after packet 1 | Avoid nonexistent `App.close()` anchor | Idempotent deeper close that cannot interleave with active index/update work |
| `registry-embedder-cache-lifecycle` | Ready after packet 1, adjacent to project close | Fake heavy embedder/reference-release fixtures; `shared.embedder` decision | Config-hash eviction, weakref/finalizer release, active work keeps refs until quiesced |
| `adapter-lifecycle-management` | P2; benchmark-gated for escalation | Fake heavy model/client tests plus benchmark before severity change | Cache-owner pop-before-close, nested fallback/httpx close, successful-search/fallback RSS slope |
| `code-graph-read-path-friction` | Defer | Wait for launcher ownership | Read-path batching/socket retention tests |

### Continuation Remaining Questions

- Should public index identity be client-supplied `reqId`, daemon-returned `indexId`, or both?
- Should load-time auto-index be externally cancellable, or only internally cancellable through remove/shutdown?
- What exact ledger path and health payload should the shared rerank sidecar use?
- Should process sweep support pre-authorized destructive cleanup inside deep-flow YAML, or require fresh explicit confirmation for every terminating action?
- When should LiteLLM package-level async client cleanup run: daemon shutdown only, or last-LiteLLM-embedder eviction?

Every follow-up implementation packet should include an explicit rollback section before code changes begin. At minimum, rollback must cover disabling the new cleanup path, preserving existing daemon/index data, and proving post-rollback search/index usability.

## Non-Goals

- No implementation fixes were made.
- No target skill source files were edited.
- No follow-up remediation packet directories were created.
- No sub-agents, nested loops, or follow-up implementation dispatch were invoked by the iteration executors. The continuation itself used `cli-codex` as requested.
- No new broad discovery was performed during final synthesis.
- No claim is made that current evidence proves monotonic successful-search memory leakage.

## References

Research artifacts:

- `../spec.md`
- `../decision-record.md`
- `research/deep-research-config.json`
- `research/deep-research-strategy.md`
- `research/deep-research-state.jsonl`
- `research/iterations/iteration-007.md`
- `research/iterations/iteration-008.md`
- `research/iterations/iteration-009.md`
- `research/iterations/iteration-010.md`
- `research/iterations/iteration-011.md` through `research/iterations/iteration-015.md`
- `research/deltas/iter-001.jsonl` through `research/deltas/iter-015.jsonl`
- `research/logs/iteration-007-runtime-measurement.json`

Important source paths:

- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py`
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/core/client.py`
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/core/protocol.py`
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/core/project.py`
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/cli.py`
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/server.py`
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/rerankers/reranker.py`
- `.opencode/bin/mk-code-index-launcher.cjs`
- `.opencode/skills/system-code-graph/mcp_server/index.ts`
- `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts`
- `.opencode/skills/system-code-graph/mcp_server/lib/ensure-ready.ts`
- `.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts`
- `.opencode/skills/system-rerank-sidecar/scripts/ensure_rerank_sidecar.py`
- `.opencode/skills/system-rerank-sidecar/scripts/start.sh`

<!-- /ANCHOR:final-synthesis -->
