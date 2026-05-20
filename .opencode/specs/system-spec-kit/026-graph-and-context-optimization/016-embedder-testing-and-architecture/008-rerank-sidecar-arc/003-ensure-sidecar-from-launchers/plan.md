---
title: "Implementation Plan: Ensure rerank sidecar from launchers [template:level_1/plan.md]"
description: "Three-phase plan: audit launcher entry points, author shared ensure helper, wire into both launchers + runtime configs."
trigger_phrases:
  - "003 plan ensure sidecar"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-rerank-sidecar-arc/003-ensure-sidecar-from-launchers"
    last_updated_at: "2026-05-20T00:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Plan authored"
    next_safe_action: "Begin Phase A audit"
    blockers: []
---
# Implementation Plan: Ensure rerank sidecar from launchers

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Phase | What | Status |
|-------|------|--------|
| **A** | Audit cocoindex launcher entry chain to identify the ensure-sidecar hook point | Planned |
| **B** | Author `.opencode/bin/lib/ensure-rerank-sidecar.cjs` + Python sibling in `system-rerank-sidecar/scripts/ensure_rerank_sidecar.py` | Planned |
| **C** | Hook both launchers + update 4 runtime configs + add vitest case + smoke 5 scenarios | Planned |
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

1. Strict validate 0/0 on this packet.
2. All 5 REQ-001..REQ-005 P0 manual scenarios pass.
3. Vitest case for the .cjs helper passes (mocked HTTP probe + mocked spawn).
4. No regression in existing launcher tests (`launcher-ipc-bridge.vitest.ts`, etc.).
5. Cold spec-memory + cocoindex run together → exactly one `rerank_sidecar` process visible in `ps`.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Helper contract (`.opencode/bin/lib/ensure-rerank-sidecar.cjs`)

```javascript
async function ensureRerankSidecar({
  port = 8765,
  sidecarSkillPath = '.opencode/skills/system-rerank-sidecar',
  healthTimeoutMs = 20000,
  skipIfDisabled = true,
}) {
  // 1. Opt-out
  if (skipIfDisabled && process.env.SPECKIT_CROSS_ENCODER?.toLowerCase() !== 'true') {
    return { spawned: false, port, fallback: 'cross-encoder-disabled' };
  }
  // 2. Probe
  if (await isHealthy(`http://localhost:${port}/health`, 2000)) {
    return { spawned: false, port, ownerPid: null };  // attach as client
  }
  // 3. Resolve start.sh
  const startScript = path.join(sidecarSkillPath, 'scripts', 'start.sh');
  if (!fs.existsSync(startScript)) {
    return { spawned: false, port, fallback: 'no-sidecar-skill' };
  }
  // 4. Spawn detached
  const logFd = fs.openSync(path.join(os.homedir(), '.cache', 'mk-reranker', 'sidecar.log'), 'a');
  const child = spawn('bash', [startScript], {
    detached: true,
    stdio: ['ignore', logFd, logFd],
    env: { ...process.env, RERANK_SIDECAR_PORT: String(port) },
  });
  child.unref();
  // 5. Bounded warmup
  const ok = await waitForHealthy(`http://localhost:${port}/health`, { timeoutMs: healthTimeoutMs });
  if (!ok) {
    try { process.kill(child.pid, 'SIGTERM'); } catch {}
    return { spawned: false, port, fallback: 'warmup-timeout' };
  }
  return { spawned: true, port, ownerPid: child.pid };
}
```

### Python sibling (cocoindex side)

Mirrors the same flow using `urllib.request` for health probe and `subprocess.Popen` for spawn. Lives at `.opencode/skills/system-rerank-sidecar/scripts/ensure_rerank_sidecar.py` so both implementations are co-located in the same skill.

### Launcher wiring (spec-memory side)

```javascript
// .opencode/bin/mk-spec-memory-launcher.cjs (paraphrased addition)
const { ensureRerankSidecar } = require('./lib/ensure-rerank-sidecar.cjs');
// ... after lease acquisition, before launchServer():
const rerankResult = await ensureRerankSidecar({
  port: Number(process.env.RERANK_SIDECAR_PORT) || 8765,
});
log(`rerank sidecar: ${JSON.stringify(rerankResult)}`);
launchServer();
```

### Launcher wiring (cocoindex side)

Cocoindex's launcher is `python -m cocoindex_code.cli mcp` (or similar). Add the ensure call inside `cli.py::mcp_command` startup. The helper is at `.opencode/skills/system-rerank-sidecar/scripts/ensure_rerank_sidecar.py`; cocoindex imports it directly when present.

### Idempotency proof

- Both launchers race to bind port 8765.
- First wins via OS-level port-bind atomicity (EADDRINUSE for the loser).
- Loser's spawn's `start.sh` exits non-zero (or its `uvicorn` exits with `address already in use`).
- Loser's `waitForHealthy` then succeeds because the winner's sidecar IS healthy.
- Result: exactly one sidecar, both launchers happy.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase A — Audit
- Read `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/cli.py` to find the `mcp` subcommand entry point
- Confirm cocoindex's startup is async-friendly (or trivially patchable to be)
- Verify `opencode.json` cocoindex `command` invokes `ccc mcp`, which routes through cli.py
- Read `.opencode/bin/mk-spec-memory-launcher.cjs` lease + launchServer flow; identify clean insertion point

### Phase B — Author helpers
- Write `.opencode/bin/lib/ensure-rerank-sidecar.cjs` per the sketch
- Write `.opencode/skills/system-rerank-sidecar/scripts/ensure_rerank_sidecar.py` mirror
- Both share an explicit contract documented in `system-rerank-sidecar/SKILL.md`

### Phase C — Wire + verify
- Patch `mk-spec-memory-launcher.cjs` to call helper after lease acquisition
- Patch cocoindex's `cli.py::mcp` to call helper at startup
- Add `RERANK_SIDECAR_PORT` to `.mcp.json`, `opencode.json`, `.gemini/settings.json`, `.codex/config.toml` (in both spec-memory and code-index env blocks)
- Add `RERANK_SIDECAR_PORT` to `mk-skill-advisor-launcher.cjs::CHILD_ENV_ALLOWLIST` (if it ever wants rerank too — defensive)
- Write `.opencode/bin/lib/ensure-rerank-sidecar.vitest.ts`
- Build spec-memory; run vitest
- Manual smoke 5 scenarios
- Strict validate
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test | What | Expected |
|------|------|----------|
| Vitest: sidecar already healthy | Mock /health → 200; call helper | `{spawned: false, port, ownerPid: null}`; no spawn call |
| Vitest: sidecar absent + start.sh exists | Mock /health → connection-refused; mock spawn returns PID 1234 + mock /health → 200 after retry | `{spawned: true, ownerPid: 1234}` |
| Vitest: skill not installed | Mock fs.existsSync → false on start.sh | `{spawned: false, fallback: 'no-sidecar-skill'}` |
| Vitest: warmup timeout | Mock spawn returns PID; mock /health always → 500 | `{spawned: false, fallback: 'warmup-timeout'}`; spawn killed |
| Vitest: opt-out | Set `SPECKIT_CROSS_ENCODER=false` | `{fallback: 'cross-encoder-disabled'}`; no probe, no spawn |
| Smoke 1: cold spec-memory cold sidecar | Kill all; start spec-memory | sidecar spawned; spec-memory MCP ready |
| Smoke 2: cold cocoindex cold sidecar | Kill all; start cocoindex | sidecar spawned; cocoindex ready |
| Smoke 3: spec-memory then cocoindex | Start spec-memory first; then cocoindex | exactly one sidecar process |
| Smoke 4: skill removed | `rm -rf system-rerank-sidecar/`; start spec-memory | MCP ready; memory_search returns positional fallback |
| Smoke 5: parallel cold starts | Background both launchers in same millisecond | exactly one sidecar; both MCPs ready |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- **Upstream**: phase 002 must ship `start.sh` and the sidecar code. This phase invokes it.
- **Sideways**: phase 001 makes `SPECKIT_CROSS_ENCODER=true` route to the HTTP path. Without 001, even with the sidecar running, spec-memory still uses the no-op shim.
- **Downstream**: phase 004 needs the sidecar to be ensured automatically so the benchmark can run without manual setup.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

| Surface | How to roll back |
|---------|------------------|
| Launcher patches | `git checkout HEAD~1 -- .opencode/bin/mk-spec-memory-launcher.cjs .opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/cli.py` |
| Shared helper | `rm .opencode/bin/lib/ensure-rerank-sidecar.cjs` + `rm .opencode/skills/system-rerank-sidecar/scripts/ensure_rerank_sidecar.py` |
| Runtime configs | Revert the 4 config files |
| Vitest | Revert |
| Running sidecar | `pkill -f rerank_sidecar` if it's running detached |

After rollback, behavior returns to phase 002 state: sidecar code exists but nothing launches it automatically. Operators can still run it manually via `start.sh`.
<!-- /ANCHOR:rollback -->
