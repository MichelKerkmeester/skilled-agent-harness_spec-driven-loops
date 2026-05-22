---
title: "Resource Map — Arc 009 Deep Review"
description: "Per-finding resource map mapping each finding to its target surface for remediation."
trigger_phrases:
  - "arc 009 review resource map"
contextType: "resource-map"
---
# Resource Map — Arc 009 Deep Review

## Finding → Surface Mapping

| Finding ID | Severity | Title | Primary File | Owning Phase | Remediation Surface |
|------------|----------|-------|--------------|--------------|---------------------|
| DR009-COR-001 | P1 | Deep-loop lock can be double-acquired during concurrent startup | `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/loop-lock.ts:107` | 004 | Deep-loop lock acquisition protocol in loop-lock.ts#acquireLoopLock |
| DR009-COR-002 | P1 | Code Graph owner lease can be double-acquired | `.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:97` | 007 | Code Graph owner lease acquisition/classification protocol in owner-lease.ts and mk-code-index-launcher.cjs |
| DR009-COR-003 | P1 | Runtime signal hooks run cleanup but do not terminate the process | `.opencode/skills/system-spec-kit/mcp_server/lib/runtime/shutdown-hooks.ts:119` | 009 | Runtime shutdown signal handling in shutdown-hooks.ts#installProcessHooks |
| DR009-COR-004 | P1 | Pre-dispatch audit reads can crash on the corrupt JSONL tail they added | `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/executor-audit.ts:330` | 003 | Deep-loop executor audit state-log readers in executor-audit.ts |
| DR009-COR-005 | P1 | Cancelled CocoIndex updates still sync FTS and mark initial indexing done | `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/core/project.py:61` | 006 | CocoIndex project update completion path in project.py#update_index |
| DR009-COR-006 | P1 | Process inventory failures are reported as an empty clean inventory | `.opencode/skills/system-spec-kit/scripts/ops/process-memory-harness.ts:181` | 002 | Process inventory status propagation in process-memory-harness.ts |
| DR009-COR-007 | P1 | Config refresh can close a project while indexing is active | `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py:452` | 006 | CocoIndex config refresh lifecycle in daemon.py#_refresh_project_if_config_changed |
| DR009-COR-008 | P1 | Embedder sidecar timeout cleanup can detach a live child | `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts:327` | 009 | Embedder sidecar termination in sidecar-client.ts killWorker and timeout cleanup |
| DR009-COR-009 | P1 | Rerank sidecar warmup timeout can leave an unledgered process | `.opencode/skills/system-rerank-sidecar/scripts/ensure_rerank_sidecar.py:192` | 008 | Rerank sidecar warmup timeout cleanup in ensure_rerank_sidecar.py |
| DR009-COR-010 | P1 | Project.close() marks resources closed before close succeeds | `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/core/project.py:38` | 006 | CocoIndex project close retry semantics in project.py#Project.close |
| DR009-COR-011 | P2 | BoundedMap can exceed maxSize when the oldest key is undefined | `.opencode/skills/system-spec-kit/mcp_server/lib/memory/bounded-cache.ts:51` | 009 | Spec Memory bounded cache primitives in bounded-cache.ts |
| DR009-COR-012 | P2 | Task-registry shutdown mutates completed history back to cancelling | `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/lifecycle/daemon_task_registry.py:100` | 006 | CocoIndex daemon task cancellation in daemon_task_registry.py#cancel |
| DR009-COR-013 | P1 | Mismatched cancel identities can cancel the wrong index | `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/lifecycle/cancel_protocol.py:33` | 006 | CocoIndex cancellation identity matching in cancel_protocol.py#match_cancel_request |
| DR009-COR-014 | P1 | Concurrent sidecar spawns can lose ledger rows | `.opencode/skills/system-rerank-sidecar/scripts/sidecar_ledger.py:157` | 008 | Rerank sidecar ledger update protocol in sidecar_ledger.py#add_sidecar_row |
| DR009-COR-015 | P1 | Child heartbeat silently fails after lease transfer misses | `.opencode/skills/system-code-graph/mcp_server/index.ts:41` | 013 | Code Graph child heartbeat ownership refresh in system-code-graph index.ts |
| DR009-COR-016 | P2 | Relationship queries reject the documented file-path subject | `.opencode/skills/system-code-graph/mcp_server/tool-schemas.ts:52` | 011 | Code Graph relationship subject resolution in handlers/query.ts |
| DR009-COR-017 | P2 | Audit rotation can overwrite a prior rotation in the same millisecond | `.opencode/skills/system-spec-kit/mcp_server/lib/memory/audit-rotation.ts:32` | 009 | Spec Memory audit rotation naming in audit-rotation.ts |
| DR009-SEC-001 | P1 | Configured rerank API keys are dropped before uvicorn starts | `.opencode/skills/system-rerank-sidecar/scripts/start.sh:28` | 008 | Rerank sidecar launcher environment allowlist in scripts/start.sh |
| DR009-SEC-002 | P1 | Warmup endpoint bypasses rerank auth and rate limiting | `.opencode/skills/system-rerank-sidecar/scripts/rerank_sidecar.py:209` | 008 | Rerank sidecar /warmup endpoint in rerank_sidecar.py |
| DR009-SEC-003 | P1 | Sidecar spawn accepts any localhost health response as ownership proof | `.opencode/skills/system-rerank-sidecar/scripts/ensure_rerank_sidecar.py:172` | 008 | Rerank sidecar spawn ownership handshake in ensure_rerank_sidecar.py and /health |
| DR009-SEC-004 | P1 | Cancel stale-identity sets grow without a retention cap | `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/lifecycle/active_work_registry.py:44` | 006 | CocoIndex ActiveWorkRegistry stale identity retention |
| DR009-SEC-005 | P2 | Optional rerank logging writes raw query text without rotation or redaction | `.opencode/skills/system-rerank-sidecar/scripts/rerank_sidecar.py:46` | 008 | Rerank sidecar optional request logging in rerank_sidecar.py |
| DR009-SEC-006 | P2 | Extra allowlisted models can execute local remote-code without revision pins | `.opencode/skills/system-rerank-sidecar/scripts/rerank_sidecar.py:120` | 008 | Rerank sidecar model-loading policy in rerank_sidecar.py |
| DR009-SEC-007 | P1 | Code Graph DB override is not constrained to the workspace | `.opencode/bin/mk-code-index-launcher.cjs:159` | 007 | Code Graph DB directory override in mk-code-index-launcher.cjs and core/config.ts |
| DR009-SEC-008 | P1 | Rerank requests cap item count but not document bytes | `.opencode/skills/system-rerank-sidecar/scripts/rerank_sidecar.py:155` | 008 | Rerank sidecar request payload validation in RerankRequest |
| DR009-SEC-009 | P1 | Model switcher kills sidecars by command substring | `.opencode/skills/system-rerank-sidecar/scripts/use-model.sh:139` | 008 | Rerank model switcher restart path in scripts/use-model.sh |
| DR009-SEC-010 | P1 | Code Graph executes COCOINDEX_BIN_PATH without containment | `.opencode/skills/system-code-graph/mcp_server/lib/ccc-readiness-probe.ts:146` | 011 | Code Graph CocoIndex binary resolution in ccc-readiness-probe.ts and ccc-reindex.ts |
| DR009-SEC-011 | P2 | Sidecar startup sources dotenv files as shell code | `.opencode/skills/system-rerank-sidecar/scripts/start.sh:14` | 008 | Rerank sidecar dotenv loading in start.sh and use-model.sh |
| DR009-SEC-012 | P1 | Deep-loop external executors inherit the full parent environment | `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/executor-audit.ts:275` | 003 | Deep-loop external executor environment in executor-audit.ts#buildExecutorDispatchEnv |
| DR009-SEC-013 | P1 | Code Graph launcher lets project dotenv inject Node runtime options | `.opencode/bin/mk-code-index-launcher.cjs:57` | 007 | Code Graph launcher dotenv and child process env in mk-code-index-launcher.cjs |
| DR009-SEC-014 | P1 | Stored Code Graph metadata is interpolated into a shell command | `.opencode/skills/system-code-graph/mcp_server/lib/ensure-ready.ts:107` | 011 | Code Graph readiness git diff invocation in ensure-ready.ts#getGitDiffFilePaths |
| DR009-SEC-015 | P1 | Process inventory emits raw owner tokens in command lines | `.opencode/skills/system-spec-kit/scripts/ops/process-memory-harness.ts:143` | 002 | Process inventory command redaction in process-memory-harness.ts and process-sweep.ts |
| DR009-SEC-016 | P1 | Rerank reusable-sidecar ownership token is predictable | `.opencode/skills/system-rerank-sidecar/scripts/ensure_rerank_sidecar.py:86` | 008 | Rerank sidecar owner-token generation and ledger reuse in ensure_rerank_sidecar.py |
| DR009-SEC-017 | P2 | IPC bridge unlinks any existing daemon-ipc.sock path | `.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:58` | 011 | Code Graph IPC socket cleanup in ipc/socket-server.ts |
| DR009-TRC-001 | P1 | CLI dispatch branches bypass the supervised executor contract | `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/003-cli-dispatch-containment-and-recursion-guards/spec.md:119` | 003 | Deep-review CLI dispatch branches in spec_kit_deep-review_auto.yaml and confirm.yaml |
| DR009-TRC-002 | P1 | Concurrent lock coverage is only sequential single-process coverage | `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/004-deep-loop-locks-state-and-recovery/spec.md:126` | 004 | Deep-loop lock concurrency fixture and phase 004 completion criteria |
| DR009-TRC-003 | P1 | Queued CocoIndex index work has no remove-project fixture | `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/006-cocoindex-remove-cancel-and-index-lifecycle/spec.md:118` | 006 | CocoIndex remove-project queued-work lifecycle coverage |
| DR009-TRC-004 | P1 | Runtime retention stress coverage uses synthetic maps only | `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/009-spec-memory-runtime-retention-cleanup/spec.md:133` | 009 | Spec Memory integrated save/search/index retention workload coverage |
| DR009-TRC-005 | P1 | Adapter RSS benchmark closes without required slope numbers | `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/012-adapter-resident-memory-benchmark/spec.md:122` | 012 | Adapter RSS benchmark results and phase 012 acceptance evidence |
| DR009-TRC-006 | P1 | SC-003 reconnect success is modeled, not manually verified | `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/013-owner-lease-heartbeat-staleness-detection/spec.md:153` | 013 | Code Graph parent-disconnect reconnect validation harness |
| DR009-TRC-007 | P1 | Client-facing index_cancel transport is not covered | `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/006-cocoindex-remove-cancel-and-index-lifecycle/spec.md:124` | 006 | CocoIndex index_cancel client/server/MCP transport |
| DR009-TRC-008 | P2 | Phase 007 is complete while every task checkbox is open | `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/007-code-graph-launcher-and-db-lifecycle/spec.md:45` | 007 | Phase 007 task ledger and completion metadata |
| DR009-TRC-009 | P1 | Parent-death polling is asserted by env only | `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/009-spec-memory-runtime-retention-cleanup/spec.md:125` | 009 | Embedder sidecar parent-death polling harness |
| DR009-TRC-010 | P1 | Timeout-kill fixture is a false positive on macOS | `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/009-spec-memory-runtime-retention-cleanup/implementation-summary.md:135` | 009 | Embedder sidecar timeout liveness fixture |
| DR009-TRC-011 | P1 | Phase 010 closed with an available memory scan uncompleted | `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/010-final-regression-and-operator-runbook/spec.md:140` | 010 | Final regression memory_index_scan evidence |
| DR009-TRC-012 | P2 | Phase 011 evidence uses stale phase identifiers | `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/011-system-code-graph-suite-triage/tasks.md:96` | 011 | Phase 011 task, validation, and handoff identifiers |
| DR009-MNT-001 | P1 | Rerank sidecar ensure helpers have incompatible ownership contracts | `.opencode/skills/system-rerank-sidecar/scripts/ensure_rerank_sidecar.py` | 008 | Rerank sidecar ensure-helper ownership contract across Python and Node helpers |
| DR009-MNT-002 | P1 | Code Graph owner lease protocol is hand-copied in TS and CJS | `.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts` | 007 | Code Graph owner lease acquisition/classification protocol in owner-lease.ts and mk-code-index-launcher.cjs |
| DR009-MNT-003 | P1 | Daemon task registry silently overwrites duplicate task IDs | `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/lifecycle/daemon_task_registry.py` | 006 | CocoIndex DaemonTaskRegistry registration identity in daemon_task_registry.py |
| DR009-MNT-004 | P2 | ActiveWorkRegistry's retain_stale flag reads backwards | `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/lifecycle/active_work_registry.py:104` | 006 | CocoIndex ActiveWorkRegistry completion API naming |
| DR009-MNT-005 | P2 | Lifecycle READMEs omit the arc 009 helper surfaces | `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/README.md:37` | 004 | Lifecycle maintainer READMEs for deep-loop, Code Graph, and ops helpers |
| DR009-MNT-006 | P2 | TtlMap.has() treats stored undefined as missing | `.opencode/skills/system-spec-kit/mcp_server/lib/memory/bounded-cache.ts:85` | 009 | Spec Memory bounded cache primitives in bounded-cache.ts |
| DR009-MNT-007 | P2 | process-sweep apply --confirmed is still a dry-run command | `.opencode/skills/system-spec-kit/scripts/ops/process-sweep.ts:126` | 005 | Process sweep CLI contract in process-sweep.ts |
| DR009-MNT-008 | P2 | Phase 013 summary points at the wrong phase number | `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/013-owner-lease-heartbeat-staleness-detection/implementation-summary.md:55` | 013 | Phase 013 implementation summary identifiers and commit handoff |
| DR009-MNT-009 | P1 | Deep-review executor config still has type/kind schema drift | `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/executor-config.ts:21` | 003 | Deep-review executor config schema and YAML executor field contract |
| DR009-MNT-010 | P2 | Code Graph lifecycle helpers bypass the documented library barrel | `.opencode/skills/system-code-graph/mcp_server/lib/index.ts:4` | 007 | Code Graph lifecycle helper exports in lib/index.ts and README |
| DR009-MNT-011 | P2 | CocoIndex lifecycle package omits shipped helper entrypoints | `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/lifecycle/__init__.py:3` | 006 | CocoIndex lifecycle package exports in lifecycle/__init__.py |
| DR009-MNT-012 | P2 | Adapter RSS benchmark scripts duplicate the same measurement core | `.opencode/skills/mcp-coco-index/mcp_server/benchmarks/benchmark-2026-05-22-adapter-rss/bench_successful_search_rss.py:41` | 012 | Adapter RSS benchmark measurement core |
| DR009-MNT-013 | P2 | Phase 012 benchmark docs still point at arc 010 phase 002 | `.opencode/skills/mcp-coco-index/mcp_server/benchmarks/benchmark-2026-05-22-adapter-rss/methodology.md:3` | 012 | Adapter RSS benchmark docs and phase identifiers |
| DR009-MNT-014 | P2 | Ops README validation command references a stale verifier path | `.opencode/skills/system-spec-kit/scripts/ops/README.md:63` | 005 | Ops README validation command path |

## Remediation Surface Index (de-duplicated)

| Remediation Surface | Findings | Owning Phase(s) |
|---|---|---|
| Adapter RSS benchmark docs and phase identifiers | DR009-MNT-013 | 012 |
| Adapter RSS benchmark measurement core | DR009-MNT-012 | 012 |
| Adapter RSS benchmark results and phase 012 acceptance evidence | DR009-TRC-005 | 012 |
| CocoIndex ActiveWorkRegistry completion API naming | DR009-MNT-004 | 006 |
| CocoIndex ActiveWorkRegistry stale identity retention | DR009-SEC-004 | 006 |
| CocoIndex cancellation identity matching in cancel_protocol.py#match_cancel_request | DR009-COR-013 | 006 |
| CocoIndex config refresh lifecycle in daemon.py#_refresh_project_if_config_changed | DR009-COR-007 | 006 |
| CocoIndex daemon task cancellation in daemon_task_registry.py#cancel | DR009-COR-012 | 006 |
| CocoIndex DaemonTaskRegistry registration identity in daemon_task_registry.py | DR009-MNT-003 | 006 |
| CocoIndex index_cancel client/server/MCP transport | DR009-TRC-007 | 006 |
| CocoIndex lifecycle package exports in lifecycle/__init__.py | DR009-MNT-011 | 006 |
| CocoIndex project close retry semantics in project.py#Project.close | DR009-COR-010 | 006 |
| CocoIndex project update completion path in project.py#update_index | DR009-COR-005 | 006 |
| CocoIndex remove-project queued-work lifecycle coverage | DR009-TRC-003 | 006 |
| Code Graph child heartbeat ownership refresh in system-code-graph index.ts | DR009-COR-015 | 013 |
| Code Graph CocoIndex binary resolution in ccc-readiness-probe.ts and ccc-reindex.ts | DR009-SEC-010 | 011 |
| Code Graph DB directory override in mk-code-index-launcher.cjs and core/config.ts | DR009-SEC-007 | 007 |
| Code Graph IPC socket cleanup in ipc/socket-server.ts | DR009-SEC-017 | 011 |
| Code Graph launcher dotenv and child process env in mk-code-index-launcher.cjs | DR009-SEC-013 | 007 |
| Code Graph lifecycle helper exports in lib/index.ts and README | DR009-MNT-010 | 007 |
| Code Graph owner lease acquisition/classification protocol in owner-lease.ts and mk-code-index-launcher.cjs | DR009-COR-002, DR009-MNT-002 | 007 |
| Code Graph parent-disconnect reconnect validation harness | DR009-TRC-006 | 013 |
| Code Graph readiness git diff invocation in ensure-ready.ts#getGitDiffFilePaths | DR009-SEC-014 | 011 |
| Code Graph relationship subject resolution in handlers/query.ts | DR009-COR-016 | 011 |
| Deep-loop executor audit state-log readers in executor-audit.ts | DR009-COR-004 | 003 |
| Deep-loop external executor environment in executor-audit.ts#buildExecutorDispatchEnv | DR009-SEC-012 | 003 |
| Deep-loop lock acquisition protocol in loop-lock.ts#acquireLoopLock | DR009-COR-001 | 004 |
| Deep-loop lock concurrency fixture and phase 004 completion criteria | DR009-TRC-002 | 004 |
| Deep-review CLI dispatch branches in spec_kit_deep-review_auto.yaml and confirm.yaml | DR009-TRC-001 | 003 |
| Deep-review executor config schema and YAML executor field contract | DR009-MNT-009 | 003 |
| Embedder sidecar parent-death polling harness | DR009-TRC-009 | 009 |
| Embedder sidecar termination in sidecar-client.ts killWorker and timeout cleanup | DR009-COR-008 | 009 |
| Embedder sidecar timeout liveness fixture | DR009-TRC-010 | 009 |
| Final regression memory_index_scan evidence | DR009-TRC-011 | 010 |
| Lifecycle maintainer READMEs for deep-loop, Code Graph, and ops helpers | DR009-MNT-005 | 004 |
| Ops README validation command path | DR009-MNT-014 | 005 |
| Phase 007 task ledger and completion metadata | DR009-TRC-008 | 007 |
| Phase 011 task, validation, and handoff identifiers | DR009-TRC-012 | 011 |
| Phase 013 implementation summary identifiers and commit handoff | DR009-MNT-008 | 013 |
| Process inventory command redaction in process-memory-harness.ts and process-sweep.ts | DR009-SEC-015 | 002 |
| Process inventory status propagation in process-memory-harness.ts | DR009-COR-006 | 002 |
| Process sweep CLI contract in process-sweep.ts | DR009-MNT-007 | 005 |
| Rerank model switcher restart path in scripts/use-model.sh | DR009-SEC-009 | 008 |
| Rerank sidecar /warmup endpoint in rerank_sidecar.py | DR009-SEC-002 | 008 |
| Rerank sidecar dotenv loading in start.sh and use-model.sh | DR009-SEC-011 | 008 |
| Rerank sidecar ensure-helper ownership contract across Python and Node helpers | DR009-MNT-001 | 008 |
| Rerank sidecar launcher environment allowlist in scripts/start.sh | DR009-SEC-001 | 008 |
| Rerank sidecar ledger update protocol in sidecar_ledger.py#add_sidecar_row | DR009-COR-014 | 008 |
| Rerank sidecar model-loading policy in rerank_sidecar.py | DR009-SEC-006 | 008 |
| Rerank sidecar optional request logging in rerank_sidecar.py | DR009-SEC-005 | 008 |
| Rerank sidecar owner-token generation and ledger reuse in ensure_rerank_sidecar.py | DR009-SEC-016 | 008 |
| Rerank sidecar request payload validation in RerankRequest | DR009-SEC-008 | 008 |
| Rerank sidecar spawn ownership handshake in ensure_rerank_sidecar.py and /health | DR009-SEC-003 | 008 |
| Rerank sidecar warmup timeout cleanup in ensure_rerank_sidecar.py | DR009-COR-009 | 008 |
| Runtime shutdown signal handling in shutdown-hooks.ts#installProcessHooks | DR009-COR-003 | 009 |
| Spec Memory audit rotation naming in audit-rotation.ts | DR009-COR-017 | 009 |
| Spec Memory bounded cache primitives in bounded-cache.ts | DR009-COR-011, DR009-MNT-006 | 009 |
| Spec Memory integrated save/search/index retention workload coverage | DR009-TRC-004 | 009 |

## Cross-Phase Dependencies

- **DR009-COR-002 / DR009-MNT-002:** the owner-lease acquisition fix is owned by phase 007, but phase 013 heartbeat-staleness coverage should be rerun because lease transfer and reclaim semantics share the same protocol.
- **DR009-COR-015 / DR009-TRC-006:** phase 013 heartbeat fixes should rerun phase 007 launcher/DB lifecycle regressions because the child heartbeat relies on launcher-to-child lease transfer.
- **DR009-COR-006 / DR009-SEC-015 / DR009-MNT-007 / DR009-MNT-014:** process inventory redaction and degraded-state reporting are owned by phase 002, while process sweep/operator docs live in phase 005.
- **DR009-MNT-005:** README remediation spans deep-loop phase 004, Code Graph phase 007, and ops phase 005 docs; keep it in one doc-hygiene patch to avoid partial maps.
- **DR009-TRC-003 / DR009-TRC-007 / DR009-COR-013:** queued remove, public cancel transport, and dual-identity matching all touch phase 006; tests should cover both helper and client/server surfaces.
- **DR009-SEC-010 / DR009-SEC-014 / DR009-SEC-017 / DR009-COR-016:** Code Graph suite-triage fixes in phase 011 should run the phase 007 launcher smoke tests afterward, because readiness/query/IPC still depend on the same daemon storage boundary.
- **DR009-TRC-005 / DR009-MNT-012 / DR009-MNT-013:** phase 012 benchmark utility refactors must preserve the exact output fields needed by the operator-runbook RSS evidence gate.
