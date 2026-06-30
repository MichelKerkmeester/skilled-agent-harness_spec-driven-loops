# Operator Runbook - Memory Leak Remediation Arc 009

## 1. Quick Diagnostics

Run diagnostics before cleanup. Capture output in the incident note or follow-on spec packet.

```bash
node .opencode/skills/system-spec-kit/scripts/dist/ops/process-memory-harness.js snapshot
node .opencode/skills/system-spec-kit/scripts/dist/ops/process-sweep.js fixture --pretty
node .opencode/skills/system-spec-kit/scripts/dist/ops/process-sweep.js plan --pretty
```

`snapshot` records host memory pages, process counts, project daemon counts, expected daemon counts, zombie counts, and PID-lock evidence. `fixture` proves the dry-run policy; `plan` reads the live host inventory and still sends no signals.

## 2. Safe Cleanup Commands

Safe cleanup means exact identity, owner-token or owner-lease proof, and dry-run-first behavior. These paths are operator-runnable only through the owning subsystem; do not replace them with broad `pkill`, process-name matching, or manual PID deletion.

| Area | Safe Path | Operator Command or API |
| ---- | --------- | ----------------------- |
| Stale CLI dispatch state | Phase 003 blocks recursive/self dispatch before spawn and emits typed `dispatch_failure` audit rows. There is no standalone cleanup command; use the guarded executor path. | `validateExecutorDispatchAllowed(...)` and `buildExecutorDispatchEnv(...)` in `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/executor-audit.ts` |
| Stale deep-loop lock | Phase 004 lock recovery reclaims only dead-PID or TTL-expired `.deep-loop.lock` rows and releases only matching owner PIDs. | `acquireLoopLock(packetDir, { ttlMs, runtimeKind })`, `refreshLoopLock(...)`, and `releaseLoopLock(...)` in `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/loop-lock.ts` |
| Corrupt deep-loop JSONL tail | Phase 004 repair truncates only invalid trailing bytes and preserves complete records. | `repairJsonlTail(stateLogPath)` in `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/jsonl-repair.ts` |
| Daemon classifier sweep | Phase 005 is dry-run only. It marks eligible rows but sends no signals; phase 014 B6 removed the old dry-run `apply --confirmed` alias. | `node .opencode/skills/system-spec-kit/scripts/dist/ops/process-sweep.js plan --pretty` |
| CocoIndex remove-project | Phase 006 cancels active index rows and bounded-awaits drain before registry pop and `Project.close()`. | `ccc reset --force` from the target project, or daemon/client `remove_project(project_root)` after `index_cancel(reqId=..., indexId=...)` when an active index identity is known |
| CocoIndex daemon cancel | Phase 006 cancellation is identity-based and cooperative. | MCP tool `index_cancel` or client API `DaemonClient.index_cancel(req_id=..., index_id=...)`; at least one identity is required |
| Code Graph launcher lease | Phase 007 reclaims stale owner metadata by lease overwrite only; it does not kill owner processes. | Start through `.opencode/bin/mk-code-index-launcher.cjs`; inspect `<canonicalDbDir>/.code-graph-owner.json` and let `acquireOwnerLease(...)` classify `stale-pid` or `ppid-1-orphan` |
| Code Graph DB close | Phase 007 proves the better-sqlite3 handle is closed before shutdown completes. | `closeDbWithAssertion()` in `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts` during MCP shutdown |
| Rerank sidecar ledger | Phase 008 reuses healthy matching-owner rows, refuses unknown live owners, and reclaims dead exact-PID ledger rows only. | Set `RERANK_SIDECAR_OWNER_TOKEN` and run `.opencode/skills/system-rerank-sidecar/scripts/ensure_rerank_sidecar.py`; ledger state lives at `${RERANK_SIDECAR_STATE_DIR:-~/.cache/mk-reranker}/.sidecar-ledger.json` |
| Reranker and embedder adapters | Phase 008 closes adapters idempotently and evicts registry embedders only after active work drains. | `close_all_reranker_adapters()`, adapter `.close()`, `Project.close()`, and registry `close_all()` |
| Spec Kit Memory timers and queues | Phase 009 drains registered timers and shutdown hooks cooperatively. | Normal MCP server shutdown calls `runShutdownHooks(...)` and `clearAllTimers()`; retry and ingest caps are controlled by `SPECKIT_RETRY_QUEUE_MAX_PENDING`, `SPECKIT_RETRY_QUEUE_MAX_AGE_MS`, and `SPECKIT_INGEST_QUEUE_MAX_PENDING` |

## 3. No-Action Cases

Do not kill these from the sweep layer:

- Expected warm daemons such as Ollama, healthy owned rerank sidecars, and project-owned Code Graph or Spec Kit daemons.
- Unknown-owner processes, including `EPERM` rows and live ports without matching owner tokens.
- Browser sessions. Close them through the browser runtime or user session, not process sweep.
- External MCP stdio servers. Stop them through their parent client/session.
- Current PID, current-session descendants, and ancestors.
- `ccc` daemon rows without explicit owner-token evidence.
- Zombie rows. The parent process must reap them; killing the zombie PID is not useful.

## 4. Reboot-Only Apple Silicon Pressure

Some host-memory pressure is outside project-daemon cleanup. Safe cleanup cannot resolve pressure when the memory is wired or compressed at the OS level rather than retained by identifiable project daemons.

Signs that cleanup is not enough:

- Wired memory grows and stays high while `process-memory-harness.js snapshot` shows no matching project daemon or expected-daemon RSS growth.
- Sustained swap activity continues over several minutes, visible as increasing `swapins` or `swapouts` in repeated snapshots.
- Compressed memory grows without an active indexing, embedding, rerank, browser, or MCP workload.
- The live sweep plan shows only preserve/no-action rows or zero process rows, but Activity Monitor still reports system pressure.

Diagnostics:

```bash
sysctl hw.memsize
vm_stat
node .opencode/skills/system-spec-kit/scripts/dist/ops/process-memory-harness.js snapshot
node .opencode/skills/system-spec-kit/scripts/dist/ops/process-sweep.js plan --pretty
```

Action: document the before/after `wiredBytes`, compressor bytes, `swapins`, and `swapouts`, then perform an explicit operator-initiated reboot. Do not escalate to broad process termination to chase wired-memory pressure.

## 5. Phase-by-Phase Reference

| Phase | Subsystem | Cleanup API | Test Command |
| ----- | --------- | ----------- | ------------ |
| 003 | CLI dispatch supervisor + guards | `validateExecutorDispatchAllowed`, `buildExecutorDispatchEnv`, `runAuditedExecutorCommandAsync` | `node mcp_server/node_modules/vitest/vitest.mjs run mcp_server/tests/deep-loop/ --config mcp_server/vitest.config.ts` |
| 004 | Deep-loop locks + JSONL repair + atomic state | `acquireLoopLock` / `releaseLoopLock` / `repairJsonlTail` / `writeStateAtomic` | `node mcp_server/node_modules/vitest/vitest.mjs run mcp_server/tests/deep-loop/ --config mcp_server/vitest.config.ts` |
| 005 | Daemon classifier + dry-run sweep | `process-sweep.js fixture --pretty`; no destructive apply command exists | `node mcp_server/node_modules/vitest/vitest.mjs run scripts/tests/process-memory-harness.vitest.ts scripts/tests/process-sweep.vitest.ts --config mcp_server/vitest.config.ts` |
| 006 | CocoIndex remove-cancel + cancel protocol + daemon tasks | `remove_project()` bounded await; `index_cancel` | `mcp_server/.venv/bin/python -m pytest mcp_server/tests/lifecycle/ -v` |
| 007 | Code Graph launcher single owner + closeDb | owner lease at `<canonicalDbDir>/.code-graph-owner.json`; `closeDbWithAssertion` | `node node_modules/vitest/vitest.mjs run mcp_server/tests/lib/ mcp_server/tests/launcher-lease.vitest.ts --config vitest.config.ts` |
| 008 | Sidecar ledger + adapter close + fallback RSS gate | sidecar ledger reuse/reclaim; adapter `close()` idempotence | `python3 -m pytest tests/test_sidecar_ledger.py -v`; `mcp_server/.venv/bin/python -m pytest mcp_server/tests/test_project_registry_embedder_lifecycle.py mcp_server/tests/test_http_sidecar_adapter.py -v` |
| 009 | Memory runtime retention | `BoundedMap`, `TtlMap`, `timer-registry`, `shutdown-hooks`, `audit-rotation`, embedder sidecar hardening | `node mcp_server/node_modules/vitest/vitest.mjs run mcp_server/tests/lib/memory/ mcp_server/tests/lib/runtime/ mcp_server/tests/embedders/sidecar-hardening.vitest.ts mcp_server/tests/providers/ mcp_server/tests/memory-runtime-retention.vitest.ts --config mcp_server/vitest.config.ts` |

## 6. Triage Decision Tree

```text
memory/process pressure observed
|
+-- Run process-memory-harness snapshot
|   |
|   +-- projectDaemonCount or terminationCandidateCount > 0?
|   |   |
|   |   +-- Run process-sweep plan --pretty
|   |   |   |
|   |   |   +-- stale-pid-lock / orphaned-project-daemon with known project identity
|   |   |   |   -> Use owning API or dry-run apply evidence. Do not broad-kill.
|   |   |   |
|   |   |   +-- unknown-owner / EPERM / browser / external MCP / ccc daemon
|   |   |       -> No action from sweep. Close through owning runtime if needed.
|   |
|   +-- No project-owned pressure visible
|       |
|       +-- Wired/compressor/swap counters rising across repeated snapshots?
|       |   -> Apple Silicon reboot-only pressure. Document deltas, then reboot.
|       |
|       +-- Counters stable
|           -> No cleanup. Keep monitoring or investigate the workload-specific phase.
|
+-- Active indexing or rerank workload in progress?
    |
    +-- CocoIndex active index identity known
    |   -> Use index_cancel(reqId/indexId), then remove_project bounded drain if removing.
    |
    +-- Rerank sidecar healthy and owner token matches
        -> Reuse/preserve. Adapter close happens through owning shutdown path.
```
