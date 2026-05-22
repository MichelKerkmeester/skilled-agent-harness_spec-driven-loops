# Memory Leak Remediation Map

<!-- ANCHOR:remediation-map -->

## Scope

This map normalizes the relocated source research from packet 020 and packet 024 into one implementation order for `009-memory-leak-remediation-arc`. It does not claim runtime memory relief. It defines the work boundaries, dependencies, and verification gates that later implementation phases must satisfy.

## Source Inputs

| Source | Evidence Location | Contribution |
| --- | --- | --- |
| Packet 020 | `system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation-arc/001-research-synthesis-and-remediation-map/research/source-research/020-cli-process-memory-leak-deep-research/research/research.md` | Broad Spec Kit Memory, deep-loop, CLI dispatch, lock/state, sidecar, external-tool, and host-memory taxonomy. |
| Packet 024 | `system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation-arc/001-research-synthesis-and-remediation-map/research/source-research/024-cli-deep-research-memory-leak-audit/research/research.md` | CocoIndex, Code Graph, rerank sidecar, daemon cancel, project close, registry cache, adapter lifecycle, and measurement-priority findings. |

## Normalized Priority Order

| Order | Normalized Work Item | Severity | Source Findings | Target Phase | Dependencies | First Verification Gate |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Evidence synthesis and source archive | P0 | 020 final taxonomy, 024 final synthesis | `001-research-synthesis-and-remediation-map` | None | Source artifact paths resolve under `source-research/`; strict validation passes. |
| 2 | Telemetry and process verification harness | P0 | 020 host-memory observability, 024 measurement notes M-006/M-007 | `002-telemetry-and-process-verification-harness` | Phase 001 | Fixtures cover process count, RSS, swap, wired memory, sidecars, daemon PIDs, and no-kill dry-run evidence. |
| 3 | Shared CLI supervisor with process-group ownership | P0 | 020 process containment | `003-cli-dispatch-containment-and-recursion-guards` | Phase 002 harness | Synthetic child plus grandchild ignoring `SIGTERM`; group cleanup and typed dispatch failure are asserted. |
| 4 | Dispatch-time recursion and self-invocation guards | P0 | 020 recursive dispatch containment | `003-cli-dispatch-containment-and-recursion-guards` | Shared supervisor | Env, ancestry, and lockfile fixtures reject same-runtime and two-hop CLI loops before spawn. |
| 5 | Deep-loop locks, heartbeat, stale-lock recovery, and atomic state repair | P0/P1 | 020 lock/state integrity and cross-flow append-only gaps | `004-deep-loop-locks-state-and-recovery` | Phase 002 harness, phase 003 containment | Dead-PID stale lock, concurrent packet, kill-during-append, and corrupt trailing-line fixtures pass. |
| 6 | Expected-daemon classifier and host/session process sweep | P1 | 020 daemon classification, 024 `mcp-host-session-process-sweep` | `005-expected-daemon-classifier-and-process-sweep` | Phase 002 harness, sidecar policy before termination | Dry-run inventory blocks current PID and ancestors, classifies expected warm daemons, handles EPERM, and refuses unknown owners. |
| 7 | CocoIndex remove-project cancel safety | P1 first code-index fix | 024 F-022/F-026, continuation first recommendation | `006-cocoindex-remove-cancel-and-index-lifecycle` | Phase 002 harness; no dependency on public cancel API | Active index work is tracked, cancelled, and bounded-awaited before registry pop or `Project.close()`. |
| 8 | CocoIndex daemon cancel protocol surface | P1 | 024 F-019/F-020/F-021 | `006-cocoindex-remove-cancel-and-index-lifecycle` | Remove-project cancel safety | Cancel request identity is defined; stale, missing, already-complete, remove-in-progress, and timeout cases pass. |
| 9 | Daemon and MCP background index task lifecycle | P1 | 024 F-005/F-010/F-017/F-018 | `006-cocoindex-remove-cancel-and-index-lifecycle` | Remove safety and cancel identity | Daemon task registry and MCP threadpool shutdown cancel, await, log, and surface errors for background work. |
| 10 | Code Graph launcher single owner, orphan reap, and DB close | P1 lifecycle | 024 F-006/F-013/F-027; 020 sidecar/daemon lifecycle | `007-code-graph-launcher-and-db-lifecycle` | Phase 005 inventory before broad reap | Same effective DB dir, symlink identity, PPID-1 orphan candidate, EPERM, child survival, and `closeDb()` fixtures pass. |
| 11 | Rerank sidecar lifecycle and safe reuse/reap policy | P1 lifecycle / P2 memory | 020 sidecar lifecycle, 024 F-003 | `008-sidecar-local-model-and-adapter-lifecycle` | Sidecar policy before destructive process sweep | PID/port ledger, owner token, healthy reuse, unknown-owner refusal, stale exact-PID cleanup, and 5xx fallback RSS gate pass. |
| 12 | Project close and registry embedder cache lifecycle | P1/P2 | 024 F-011/F-012/F-014/F-016/F-025 | `008-sidecar-local-model-and-adapter-lifecycle` | Remove-project cancel safety | Idempotent close cannot interleave with active work; config-hash embedder eviction or ref-count release is proven. |
| 13 | Adapter lifecycle management and benchmark-gated resident-memory work | P2 unless benchmark escalates | 024 F-001/F-002/F-015/F-023/F-024, M-006/M-007 | `008-sidecar-local-model-and-adapter-lifecycle` | Successful-search or fallback benchmark before severity escalation | Reranker adapters, `httpx.Client`, fallback adapters, and adapter caches close/unload idempotently; RSS slope is measured before P1/P0 claims. |
| 14 | Spec Kit Memory in-process retention cleanup | P1 | 020 MCP leases, timers, singleton caches, sessions, queues, retries, and audit rotations | `009-spec-memory-runtime-retention-cleanup` | Phase 002 harness, phase 004 state semantics | Stress save/search/index workloads show no leaked lease, active timer, unbounded map, retry growth, queue growth, or unlimited audit rotation. |
| 15 | External MCP/browser/tool cleanup | P2/P1 when part of process sweep | 020 external-tool cleanup | `005-expected-daemon-classifier-and-process-sweep` and `010-final-regression-and-operator-runbook` | Inventory-only before termination | Browser and external MCP stdio process counts return to baseline after explicit close/stop paths. |
| 16 | Code Graph read-path friction | P2 | 024 F-007/F-008 | `007-code-graph-launcher-and-db-lifecycle` or deferred follow-up | Launcher ownership first | Read-path batching, freshness checks, socket retention, and transport limits are tested after owner semantics are stable. |
| 17 | Cosmetic logging no-action bucket | No action | 024 F-009 | None unless touched incidentally | None | No remediation packet opens; only MCP stdio smoke/static gate if related code is edited for another reason. |

## Dependency Invariants

- Verification harness work precedes runtime cleanup claims.
- Inventory and exact identity precede destructive process cleanup.
- `remove-project-cancel-safety` is the first CocoIndex code fix because later public cancel, shutdown, close, and cache-eviction paths rely on owned active-work state.
- Rerank sidecar lifecycle must define owner/health metadata before process sweep can terminate sidecars.
- Adapter memory work stays P2 until successful-search or sidecar-fallback RSS growth is measured.
- Code Graph read-path work stays behind launcher ownership and DB lifecycle fixes.

## Open Verification Gaps

| Gap | Blocks | Resolution Phase |
| --- | --- | --- |
| Successful Python `.venv/bin/ccc search` RSS slope outside the Homebrew `ccc` collision | Escalating adapter lifecycle memory severity | `002` then `008` |
| Sidecar 5xx/fallback RSS delta | Escalating sidecar/fallback resident-memory claims | `002` then `008` |
| Public cancel identity: `reqId`, daemon `indexId`, or both | Public daemon cancel API design | `006` |
| Exact effective `SPECKIT_CODE_GRAPH_DB_DIR` identity across code-graph servers | Launcher single-owner and orphan-reap fixtures | `007` |
| Pre-authorized destructive cleanup vs fresh confirmation for every terminating action | Process sweep behavior | `005` and `010` |

## Phase 005 Completion Evidence

Items #6 and #15 now have a phase-005 dry-run implementation surface under `.opencode/skills/system-spec-kit/scripts/ops/process-sweep.ts`. The sweep consumes the phase-002 process inventory, preserves expected warm daemons, `ccc` daemon rows, browser sessions, external MCP stdio rows, unknown-owner rows, and EPERM-alive rows, and only marks stale PID locks or orphaned project daemons eligible after self-PID, ancestry, and known project identity checks pass.

Verification evidence is recorded in `005-expected-daemon-classifier-and-process-sweep/implementation-summary.md`. Destructive termination remains deferred to phase 010 operator-confirmation policy.

<!-- /ANCHOR:remediation-map -->
