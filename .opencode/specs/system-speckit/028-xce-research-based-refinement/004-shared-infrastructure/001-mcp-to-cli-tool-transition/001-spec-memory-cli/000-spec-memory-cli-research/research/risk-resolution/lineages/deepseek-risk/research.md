# Deep Research Synthesis — deepseek-risk Lineage: Risk Resolution

- **Date:** 2026-06-06 · **Session:** `fanout-deepseek-risk-1780741781330-fuysmn` · **Lane:** deepseek-risk (deepseek/deepseek-v4-pro)
- **Parent:** `dr-20260606T122838-risk-resolution` · **Premise:** Run-1 GO verdict + Run-2 CLI design (settled, not relitigated)
- **Iterations:** 3/20 · **Stop reason:** `all-questions-answered` — all 11 seed RQs + 1 discovered RQ classified
- **newInfoRatio trend:** 1.0 → 0.95 → 0.50 (converging)

---

## 1. Verdict

**All 12 risks (11 seeds + 1 discovered) are classified.** The dual-stack CLI design is structurally sound with 6 RESOLVED and 6 MITIGATED classifications. No ACCEPTED or DEFERRED risks — every risk has either proven resolution or an actionable design delta. The implementation can proceed at the **10-13 engineering day** effort center estimate, excluding the OpenCode `tools:` block upstream dependency and the ~125-reference migration (follow-on).

---

## 2. Classification Summary

| RQ | Classification | Verdict |
|----|---------------|---------|
| RQ1 | RESOLVED | Public CLI IPC-only (SPECKIT_BACKEND_ONLY); socket 0o600; trust model = MCP stdio |
| RQ2 | RESOLVED | All 37 schemas CLI-mappable; codegen from TOOL_DEFINITIONS; ~7 need --json escape |
| RQ3 | MITIGATED | Triple-lock hierarchy (bootstrap/owner-lease/respawn); add dual-spawn test |
| RQ4 | RESOLVED | Complete 0/1/64/69/75 exit map; replayable taxonomy in session proxy |
| RQ5 | MITIGATED | Cold path 1-60s; add --timeout-ms; hooks prefer warm daemon |
| RQ6 | RESOLVED | Measured 40ms Node start on darwin/arm64; validates 50-150ms estimate |
| RQ7 | RESOLVED | sessionId → resolveSessionTrackingId; --session-id CLI flag |
| RQ8 | RESOLVED | Build-check per spawn; bootstrap lock; protocol-version mismatch detection |
| RQ9 | RESOLVED | Multi-client bridge test-proven; add dual-client concurrent test |
| RQ10 | MITIGATED | 10-13 engineering days; excludes OpenCode tools: block + migration |
| RQ11 | MITIGATED | macOS sun_path near limit; SPECKIT_IPC_SOCKET_DIR override; Windows non-goal |
| RQ4a | RESOLVED | Protocol-version-drift → fail-closed exit 69 → client reinvokes |

---

## 3. Key Evidence

### RQ1 — Daemon-Bypass Enforcement (RESOLVED)

- Launcher spawns daemon with `SPECKIT_BACKEND_ONLY: '1'` [file:.opencode/bin/mk-spec-memory-launcher.cjs:1210-1218]
- Socket permissions `chmodSync(0o600)`, DB dir `mkdirSync(0o700)` [file:.opencode/bin/lib/model-server-supervision.cjs:1316, file:.opencode/bin/mk-spec-memory-launcher.cjs:228]
- Admin direct-DB paths are separate (`cli.ts`, `spec-memory admin`) — not exposed through public 37-tool CLI

### RQ2 — Schema-Drift (RESOLVED)

- TOOL_DEFINITIONS: 37 tools, each with `name`, `description`, `inputSchema` [file:.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:709-756]
- Zod validation reused at argv boundary [file:.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:1-80]
- Classification: ~20 flat scalar tools, ~10 array tools, ~7 complex (need --json escape)
- Codegen from TOOL_DEFINITIONS is feasible by construction — every property maps to a flag

### RQ3 — Lease/Spawn Races (MITIGATED)

- Owner lease: exclusive `'wx'` write + re-read-after-write race detection [file:.opencode/bin/mk-spec-memory-launcher.cjs:365-403]
- Bootstrap lock: `mkdir`-based, 300s stale timeout, 120s deadline, race-safe rename-claim-then-delete [file:.opencode/bin/mk-spec-memory-launcher.cjs:1151-1194]
- Respawn lock: serializes dead-socket respawns with full lease re-verification [file:.opencode/bin/mk-spec-memory-launcher.cjs:671-752]
- Heartbeat self-shutdown on lease failure [file:.opencode/bin/mk-spec-memory-launcher.cjs:427-443]
- Orphan cleanup: lastKnownDescendantPids snapshot + process-tree reaping [file:.opencode/bin/mk-spec-memory-launcher.cjs:1022-1048]
- Design delta: add `spec-memory-dual-simultaneous-spawn.vitest.ts` and `--session-id` flag

### RQ4 — Retryable Taxonomy (RESOLVED)

| Condition | Exit | Retryable |
|-----------|------|-----------|
| -32001 (lease held, backend recycled, cold-start) | 75 | Yes |
| Protocol version mismatch (-32002) | 69 | No |
| Dead socket, no owner PID, EPERM | 69 | No |
| Build failure, lock timeout | 1 | No |
| CLI usage error | 64 | No |
| Success | 0 | N/A |

Replayable tools on daemon recycle: memory_search, memory_context, memory_match_triggers, memory_quick_search, memory_save, session_*, memory_stats, checkpoint_list, embedder_health, initialize, ping [file:.opencode/bin/lib/launcher-session-proxy.cjs:33-58]

### RQ5 — Hook Latency (MITIGATED)

- Cold path: 1-5s (dist built, clean close), 30-60s (embedder cold start)
- Hook timeouts: Claude/Codex typically 3-10s per hook
- Session proxy handles cold-start with 30-probe-attempt backoff [file:.opencode/bin/lib/launcher-session-proxy.cjs:199-217]
- Design delta: add `--timeout-ms` flag; hooks should prefer warm daemon (MCP keeps it running)

### RQ6 — Per-Call Overhead (RESOLVED)

- Measured on darwin/arm64 (2026-06-06): 5x `time node -e ""` consistently 0.04s
- Estimated per-call: ~40ms (Node) + ~5ms (shim) + ~5ms (socket RTT) + ~1ms (render) = **~50-60ms**
- Validates original 50-150ms estimate from run-1

### RQ7 — Session Identity (RESOLVED)

- Resolution order: `args.sessionId` → `transportMetadata.sessionId` → `CODEX_THREAD_ID` → fallback [file:.opencode/skills/system-spec-kit/mcp_server/context-server.ts:518-536]
- Sticky session correlation for tools without explicit sessionId [file:.opencode/skills/system-spec-kit/mcp_server/context-server.ts:538-541]
- `--session-id` CLI flag = runtime-agnostic; non-Codex runtimes can pass arbitrary session IDs

### RQ8 — Build Drift (RESOLVED)

- `artifactsReady()` checks 3 dist paths every spawn [file:.opencode/bin/mk-spec-memory-launcher.cjs:953-958]
- `buildIfNeeded()` runs npm ci + build if missing [file:.opencode/bin/mk-spec-memory-launcher.cjs:961-984]
- Session proxy: protocol-version mismatch during internal handshake → fail-closed exit 69 [file:.opencode/bin/lib/launcher-session-proxy.cjs:644-656]

### RQ9 — Dual-Client Load (RESOLVED)

- IPC bridge serves multiple concurrent clients (test-proven) [file:../cli-backend/lineages/gpt/research.md:42-44]
- Owner lease is single-writer boundary; daemon serializes writes internally
- Design delta: add `spec-memory-dual-client.vitest.ts`

### RQ10 — Effort Reconciliation (MITIGATED)

- Center estimate: **10-13 engineering days** (8-10 day CLI + 2-3 day risk deltas)
- Excludes: OpenCode tools: block (upstream, unknown), ~125-ref migration (3-4 days, separable)
- Triangulates run-2 (8-12d) against run-1 (13-16d and 3-4wk)

### RQ11 — Platform Constraints (MITIGATED)

- Default socket path ~105 chars — marginally over macOS 104-byte sun_path
- `SPECKIT_IPC_SOCKET_DIR` override allows shorter path [file:.opencode/bin/lib/launcher-ipc-bridge.cjs:60-67]
- TCP endpoint support exists in the bridge code
- Windows: explicit non-goal

---

## 4. Design Deltas for Implementation Packet

These 7 actionable deltas must be absorbed by the implementation:

| # | Delta | Severity | Effort |
|---|-------|----------|--------|
| D1 | Add dual-simultaneous-spawn vitest (bootstrap lock already serializes) | Low | 0.5 day |
| D2 | Add dual-client concurrent MCP+CLI vitest | Low | 0.5 day |
| D3 | Wire `--session-id` CLI flag → args.sessionId | Medium | 0.3 day |
| D4 | Add `--timeout-ms` flag for hook-aware callers | Medium | 0.2 day |
| D5 | Document protocol-version-drift exit-69 recovery path | Low | 0.1 day |
| D6 | Handle macOS sun_path limit in shim (SPECKIT_IPC_SOCKET_DIR override) | Low | 0.1 day |
| D7 | Verify heartbeat self-shutdown in CLI-spawn path | Medium | 0.2 day |

---

## 5. Negative Knowledge (ruled out)

| Approach | Reason | Iteration |
|----------|--------|-----------|
| Direct DB access from CLI | Public path is IPC-only; admin is separate entry | 1 |
| Two simultaneous spawns = two daemons | Bootstrap lock serializes; owner lease prevents | 1 |
| Custom arg parser needed per tool | Codegen from TOOL_DEFINITIONS covers all 37 | 2 |
| SQLITE_BUSY requires special handling | Single-writer lease prevents concurrent writers | 2 |
| Windows support needed for CLI | Explicit non-goal from run-2 | 3 |
| Session identity runtime-specific | --session-id flag is runtime-agnostic | 3 |
| Dual-client traffic = conflict | Multi-client bridge test-proven | 3 |

---

## 6. Convergence Report

| Metric | Value |
|--------|-------|
| Iterations completed | 3 |
| Questions classified | 12/12 (100%) |
| Classification breakdown | 6 RESOLVED, 6 MITIGATED, 0 ACCEPTED, 0 DEFERRED |
| Stop reason | all-questions-answered |
| newInfoRatio trend | 1.0 → 0.95 → 0.50 |
| Design deltas carried forward | 7 (~2 engineering days) |
| Risks requiring no action | 5 RESOLVED |

---

## Sources

- Iteration files: `iterations/iteration-{001,002,003}.md`
- Launcher source: `.opencode/bin/mk-spec-memory-launcher.cjs` (1470 lines)
- IPC bridge: `.opencode/bin/lib/launcher-ipc-bridge.cjs` (389 lines)
- Session proxy: `.opencode/bin/lib/launcher-session-proxy.cjs` (813 lines)
- Tool schemas: `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts` (756 lines)
- Tool input schemas: `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts` (707 lines)
- Context server: `.opencode/skills/system-spec-kit/mcp_server/context-server.ts` (2205+ lines)
- Model server supervision: `.opencode/bin/lib/model-server-supervision.cjs` (1405 lines)
- Run-1 merged synthesis: `../research/research.md`
- Run-2 CLI design: `../cli-backend/lineages/gpt/research.md`
- Host measurement: `time node -e ""` 5x on darwin/arm64, 2026-06-06
