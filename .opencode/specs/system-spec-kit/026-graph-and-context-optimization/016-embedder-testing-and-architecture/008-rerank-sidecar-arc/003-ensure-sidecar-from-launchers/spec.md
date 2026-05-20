---
title: "Feature Specification: Ensure rerank sidecar from launchers (self-electing primary)"
description: "Add ensureRerankSidecar({port}) helper to both mk-spec-memory-launcher.cjs and the cocoindex launcher. Probe /health; if absent, spawn the sidecar from .opencode/skills/system-rerank-sidecar/ detached; if present, attach as HTTP client. Port-bind EADDRINUSE is the atomicity primitive. Mirrors the lease-based bridge attachment from packets 010/012, applied at the port level for the shared rerank service."
trigger_phrases:
  - "ensure rerank sidecar launcher"
  - "self-electing primary port"
  - "spawn detached rerank"
  - "mk-spec-memory launcher rerank"
  - "cocoindex launcher rerank attach"
  - "003 ensure sidecar"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-rerank-sidecar-arc/003-ensure-sidecar-from-launchers"
    last_updated_at: "2026-05-20T00:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Spec authored"
    next_safe_action: "Begin Phase A read"
    blockers: []
    key_files:
      - ".opencode/bin/mk-spec-memory-launcher.cjs"
      - ".opencode/bin/mk-code-index-launcher.cjs"
      - ".opencode/bin/lib/ensure-rerank-sidecar.cjs"
---
# Feature Specification: Ensure rerank sidecar from launchers

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

Phase 003 of the 008 rerank-sidecar arc. Plumb the running sidecar into both MCP launcher startup paths with self-electing-primary semantics.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Planned |
| **Created** | 2026-05-20 |
| **Branch** | `main` |
| **Parent Arc** | `008-rerank-sidecar-arc` |
| **Predecessor** | `002-system-rerank-sidecar-skill` |
| **Successor** | `004-spec-memory-rerank-benchmark` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

After phase 002 ships a runnable sidecar, neither MCP launcher knows to start it or attach to it. The sidecar would only exist if a human operator manually ran `bash .opencode/skills/system-rerank-sidecar/scripts/start.sh`. That fails the "automatic on cold start" property required for the arc.

Additionally, the architecture explicitly requires graceful handling of three scenarios:
- Only cocoindex installed (no spec-memory) → cocoindex must spawn the sidecar
- Only spec-memory installed → spec-memory must spawn
- Both installed → whichever starts first spawns; the other attaches; exactly one Qwen instance lives

### Purpose

Add `ensureRerankSidecar({ port, sidecarSkillPath, healthTimeoutMs })` helper to a new shared module at `.opencode/bin/lib/ensure-rerank-sidecar.cjs`. Both `mk-spec-memory-launcher.cjs` and `mk-code-index-launcher.cjs` (cocoindex's launcher) call this helper during their own startup, before reporting MCP-ready.

The helper's contract:

1. **Probe** `GET http://localhost:<port>/health` with a short timeout (2s).
2. If response is `200` AND `model_loaded || queue_depth >= 0` (any healthy response) → return `{ spawned: false, port, ownerPid: null }`. We're a client.
3. If probe fails → resolve the sidecar's start script (`<sidecarSkillPath>/scripts/start.sh`). If the script doesn't exist (skill not installed) → return `{ spawned: false, port, fallback: 'no-sidecar-skill' }`. The MCP starts up; cross-encoder falls back to positional scores (current behavior).
4. If start script exists → spawn it with `detached: true`, `stdio: ['ignore', logFd, logFd]`, `unref()`. Capture PID. Wait for `/health` to return 200 (poll every 500ms up to `healthTimeoutMs` default 20000ms).
5. If health probe succeeds within timeout → return `{ spawned: true, port, ownerPid: PID }`.
6. If health probe times out → kill the spawned process, return `{ spawned: false, port, fallback: 'warmup-timeout' }`. MCP starts up in degraded mode.

Race condition handling: two launchers start simultaneously. Both see "not healthy" → both attempt spawn. The second one's `start.sh` execution will fail with `EADDRINUSE` because the first one bound the port. The second helper catches the spawn failure, retries the `/health` probe → sees the first sidecar healthy → uses it. Idempotent.

### Companion changes

- New shared module `.opencode/bin/lib/ensure-rerank-sidecar.cjs` (~80 LOC)
- Hook into `mk-spec-memory-launcher.cjs` after lease acquisition, before child server spawn
- Hook into cocoindex launcher (need to verify exact entry point — likely `.opencode/skills/mcp-coco-index/mcp_server/.venv/bin/ccc` or the wrapper that spawns it)
- Add `RERANK_SIDECAR_PORT` to both runtime configs as an env-configurable default (`8765`)
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- New `.opencode/bin/lib/ensure-rerank-sidecar.cjs` shared helper module
- Hook the helper into `mk-spec-memory-launcher.cjs` (and add `RERANK_SIDECAR_PORT` to its `CHILD_ENV_ALLOWLIST` so the child server inherits the port for HTTP client construction)
- Hook the helper into cocoindex's launcher (exact integration point TBD during Phase A audit)
- Add `RERANK_SIDECAR_PORT` env var to all 4 runtime configs (default `8765`); document in each `_NOTE_*` block
- Vitest case for the helper (mocked HTTP probe + mocked spawn)
- Smoke test: kill any running sidecar, start spec-memory launcher cold → verify sidecar gets spawned, then kill spec-memory and start cocoindex → verify cocoindex spawns a fresh sidecar; then start both → verify only one sidecar runs

### Out of Scope

- **The sidecar's own code** — phase 002 owns the actual rerank logic
- **Cross-encoder.ts default model flip** — phase 005
- **PID-file tracking of the sidecar** — the OS handles process lifecycle; PID file is only needed if we want explicit "stop sidecar" semantics (deferred)
- **Cleanup of orphaned sidecars** — if both launchers crash and the sidecar lives on, that's acceptable; operator can `pkill -f rerank_sidecar` if needed

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/bin/lib/ensure-rerank-sidecar.cjs` | Create | Shared helper for both launchers |
| `.opencode/bin/mk-spec-memory-launcher.cjs` | Modify | Call `ensureRerankSidecar` during startup; add `RERANK_SIDECAR_PORT` to allowlist |
| `.opencode/bin/mk-code-index-launcher.cjs` | Modify | Same — call helper, allowlist port (verify env-pass behavior) |
| `.mcp.json`, `opencode.json`, `.gemini/settings.json`, `.codex/config.toml` | Modify | Add `RERANK_SIDECAR_PORT=8765` to spec-memory + code-index env blocks |
| `.opencode/bin/lib/ensure-rerank-sidecar.vitest.ts` | Create | Helper unit tests (mocked) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Cold spec-memory startup spawns the sidecar when absent | Kill all sidecars + start spec-memory launcher; `ps -ef \| grep rerank_sidecar` shows new process; `/health` returns 200 within 20s |
| REQ-002 | Cold cocoindex startup spawns the sidecar when absent | Same for cocoindex |
| REQ-003 | When sidecar already running, second launcher attaches (does not spawn duplicate) | Start spec-memory first; then start cocoindex; only one `rerank_sidecar` process exists |
| REQ-004 | Sidecar absence (skill not installed) → graceful degradation, MCP still starts | Delete `.opencode/skills/system-rerank-sidecar/`; start spec-memory; MCP serves memory_search normally; cross-encoder reports positional fallback |
| REQ-005 | Race condition between two simultaneous launcher starts handled idempotently | Start both launchers in same wall-clock millisecond; exactly one sidecar process exists; both launchers report healthy |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | `RERANK_SIDECAR_PORT` env var honored by all 4 runtime configs | Set `RERANK_SIDECAR_PORT=9999`; verify sidecar binds 9999; verify both launchers probe 9999 |
| REQ-007 | Spawned sidecar is detached — survives launcher restart | Start spec-memory + sidecar; kill launcher (NOT sidecar); restart launcher; second launcher attaches to existing sidecar |
| REQ-008 | Warmup timeout returns degraded mode, doesn't hang MCP startup | Mock the sidecar to never respond to /health; verify launcher gives up after 20s and starts MCP anyway |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 5 P0 scenarios pass manual smoke test on a clean lease state.
- **SC-002**: `.opencode/bin/lib/ensure-rerank-sidecar.vitest.ts` passes 100%.
- **SC-003**: `npm run build` in spec-memory exits 0.
- **SC-004**: Strict validate exits 0 on this packet.
- **SC-005**: Setting `SPECKIT_CROSS_ENCODER=true` plus this phase landing → `cross-encoder.ts` actually receives sigmoid scores from the live sidecar (verify via memory_health trace).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Cocoindex launcher entry point is unfamiliar — integration may be more invasive than the spec-memory side | Phase blocked or expanded scope | Phase A audit reads cocoindex's launcher chain (likely `.opencode/skills/mcp-coco-index/mcp_server/.venv/bin/ccc mcp` per `opencode.json`). May need a wrapper script. |
| Risk | Detached process inherits stdout/stderr; logs from sidecar collide with the launcher's stdio MCP stream | MCP protocol corruption | Sidecar spawn uses `stdio: ['ignore', logFd, logFd]` where logFd writes to `.cache/rerank-sidecar/sidecar.log` — never inherits launcher's stdio |
| Risk | Spawn happens but `/health` never reaches 200 (model download stalled, OOM, etc.) | MCP hangs at startup | REQ-008: bounded timeout + degraded mode |
| Risk | Race condition between two launchers — both spawn, one fails EADDRINUSE; lose 1-2s on the loser | Slower cold start | Acceptable trade-off; the loser's re-probe of /health finds the winner's sidecar |
| Risk | Sidecar crashes mid-session; subsequent /rerank calls fail | Search degrades | spec-memory's `cross-encoder.ts` already has circuit-breaker; falls back to positional. Subsequent launcher restart re-runs `ensureRerankSidecar` → re-spawns |
| Dependency | Phase 002 must ship a working `start.sh` for this helper to invoke | Phase blocked | Verify 002 lands first; this phase's vitest can mock the spawn regardless |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should we add a PID file (`~/.cache/mk-reranker/sidecar.pid`) for explicit start/stop semantics? **PROPOSED: not in this phase.** Port-bind is the atomicity primitive; explicit lifecycle is a future ops feature.
- Where exactly does the helper hook into cocoindex's launcher? Cocoindex's entry per `opencode.json` is `.opencode/skills/mcp-coco-index/mcp_server/.venv/bin/ccc mcp`. The Python entrypoint is `cli.py::mcp`. Adding the ensure-sidecar logic there means it's pure-Python (no shared `.cjs`). **PROPOSED**: write a small Python `ensure_rerank_sidecar.py` that mirrors the `.cjs` helper, called from `cli.py::mcp` startup. Tradeoff: two implementations to keep in sync.
- Alternative: wrap cocoindex's `ccc` invocation in a thin shell script that runs the ensure logic before exec'ing ccc. Single implementation, but breaks `opencode.json`'s direct binary reference. **PROPOSED**: stick with the parallel-implementations approach; document the contract in SKILL.md so both versions agree.
- Should `ensureRerankSidecar` respect `SPECKIT_CROSS_ENCODER=false`? **PROPOSED: yes.** Skip the entire spawn-and-probe dance if the consumer opts out. Saves cold-start time for operators who explicitly don't want rerank.
<!-- /ANCHOR:questions -->
