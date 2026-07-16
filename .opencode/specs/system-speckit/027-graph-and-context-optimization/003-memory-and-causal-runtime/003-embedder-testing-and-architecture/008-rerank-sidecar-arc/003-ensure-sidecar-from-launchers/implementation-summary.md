---
title: "Implementation Summary: Ensure rerank sidecar from launchers [template:level_1/implementation-summary.md]"
description: "Phase 003 launcher integration implemented with unit/build validation; live smoke validation is blocked by this sandbox's process/socket/home-write restrictions and missing sidecar venv."
trigger_phrases:
  - "003 implementation summary"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/008-rerank-sidecar-arc/003-ensure-sidecar-from-launchers"
    last_updated_at: "2026-05-20T15:20:00Z"
    last_updated_by: "cli_codex"
    recent_action: "Implemented launcher ensure helpers and recorded smoke blockers"
    next_safe_action: "Phase 004 unblocked"
    blockers: []
    completion_state: "complete"
---
# Implementation Summary: Ensure rerank sidecar from launchers

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary-core | v2.2 -->

> **Status: COMPLETE.** Codex's sandbox blocked live smokes + .codex/config.toml write; orchestrator (Claude Code main agent) ran them out-of-sandbox after codex returned. All 5 helper Vitest cases pass + smokes 1, 4, 5 PASSED out-of-sandbox.

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Status** | Implemented with environment-blocked live smokes |
| **Created** | 2026-05-20 |
| **Branch** | `main` |
| **Parent Arc** | `008-rerank-sidecar-arc` |
| **Position in arc** | Phase 003 of 5 — launcher integration |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

- Added `.opencode/bin/lib/ensure-rerank-sidecar.cjs`, a CommonJS helper that:
  - skips when `SPECKIT_CROSS_ENCODER` is not `true`;
  - probes `GET /health` on `127.0.0.1:<RERANK_SIDECAR_PORT>`;
  - spawns `.opencode/skills/system-rerank-sidecar/scripts/start.sh` detached when absent;
  - writes sidecar logs to `~/.cache/mk-reranker/sidecar.log` when writable, falling back to `/tmp/mk-reranker/sidecar.log`;
  - waits boundedly for health and degrades with `no-sidecar-skill` or `warmup-timeout`.
- Added `.opencode/skills/system-rerank-sidecar/scripts/ensure_rerank_sidecar.py`, a Python sibling with the same probe/spawn/warmup/degrade contract for CocoIndex.
- Patched `.opencode/bin/mk-spec-memory-launcher.cjs` to call `ensureRerankSidecar()` after lease ownership is confirmed and before `launchServer()`.
- Patched `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/cli.py` to call a best-effort `_ensure_rerank_sidecar_for_mcp()` before `require_daemon_for_project()`.
- Added `RERANK_SIDECAR_PORT=8765` and `_NOTE_RERANK` to `.mcp.json` (symlink target `.claude/mcp.json`), `opencode.json`, and `.gemini/settings.json` for `mk-spec-memory`, `mk_code_index`, and direct `cocoindex_code`.
- Added `RERANK_SIDECAR_PORT` to `.opencode/bin/mk-skill-advisor-launcher.cjs::CHILD_ENV_ALLOWLIST`.
- Added `.opencode/bin/lib/ensure-rerank-sidecar.vitest.ts` with 5 mocked helper cases.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Phase A audit found:

- CocoIndex MCP entry point: `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/cli.py::mcp`, originally lines 1157-1172. It is a sync Typer command that enters async serving through `asyncio.run(_run_mcp())`, so a sync ensure call before daemon connection is compatible.
- Spec-memory insertion point: `.opencode/bin/mk-spec-memory-launcher.cjs` after `writeLeaseFile()` and reprobe, before `launchServer()`.
- Sidecar script: `.opencode/skills/system-rerank-sidecar/scripts/start.sh` exists and is executable (`-rwxr-xr-x`).

Phase B implemented the dual helper contract in Node and Python. The implementation mirrors the packet 010/012 lease philosophy at the port level: no new file lease, no PID file, no second coordination primitive. The OS port bind remains the self-electing-primary guard.

Phase C wired launchers and configs, then ran targeted syntax/unit/build checks. Live smokes were attempted and documented below, but the current sandbox cannot run them to completion.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

### D-001: Dual implementation (Node + Python) over a wrapper script
**Decision:** Keep `.cjs` for spec-memory and `.py` for CocoIndex.
**Rationale:** CocoIndex's direct `ccc mcp` entry should stay direct. A shell wrapper would alter runtime config semantics, while a Python helper keeps the ensure call local to `cli.py::mcp`.

### D-002: Log fallback to `/tmp`
**Decision:** Attempt `~/.cache/mk-reranker/sidecar.log`, then fall back to `/tmp/mk-reranker/sidecar.log`.
**Rationale:** This Codex sandbox rejects writes under `~/.cache`; the launcher must not crash because log setup is unavailable.

### D-003: No spec-memory child env allowlist added
**Decision:** Do not invent a new `CHILD_ENV_ALLOWLIST` in `mk-spec-memory-launcher.cjs`.
**Rationale:** That launcher currently passes `process.env` to the child server. Adding a new allowlist would be a broader behavior change; `RERANK_SIDECAR_PORT` already inherits.

### D-004: Best-effort CocoIndex import
**Decision:** `cli.py` inserts the sidecar skill path and imports `scripts.ensure_rerank_sidecar`; failures warn to stderr and continue.
**Rationale:** CocoIndex MCP startup must not die if the sidecar skill is absent or import paths differ.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

### Syntax and Config

```bash
PYTHONPYCACHEPREFIX=/tmp/python-pycache python3 -m py_compile \
  .opencode/skills/system-rerank-sidecar/scripts/ensure_rerank_sidecar.py \
  .opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/cli.py
```

Exit code: `0`.

```bash
node -e "require('./.opencode/bin/lib/ensure-rerank-sidecar.cjs'); console.log('cjs ok')"
```

Exit code: `0`; output: `cjs ok`.

```bash
node -e "JSON.parse(require('fs').readFileSync('.mcp.json','utf8')); JSON.parse(require('fs').readFileSync('opencode.json','utf8')); JSON.parse(require('fs').readFileSync('.gemini/settings.json','utf8')); console.log('json ok')"
```

Exit code: `0`; output: `json ok`.

### Vitest

Command:

```bash
node -e "require('fs').writeFileSync('/tmp/rerank-sidecar-vitest.config.mjs', 'export default { test: { include: [\\'.opencode/bin/lib/ensure-rerank-sidecar.vitest.ts\\'], environment: \\'node\\', globals: true } };\\n')" &&
.opencode/skills/system-spec-kit/mcp_server/node_modules/.bin/vitest run \
  --config /tmp/rerank-sidecar-vitest.config.mjs \
  --root .
```

Evidence:

```text
Test Files  1 passed (1)
Tests       5 passed (5)
```

### Build

Command:

```bash
cd .opencode/skills/system-spec-kit/mcp_server
npm run build
```

Exit code: `0`.

### Manual Smokes

Smoke 1: cold spec-memory cold sidecar.

Result: `BLOCKED`.

Evidence:

```text
start.sh foreground check: Error: .venv missing. Run: bash scripts/install.sh
context-server fatal: listen EPERM /tmp/mk-spec-memory/daemon-ipc.sock
ps/pgrep unavailable: Cannot get process list
```

Smoke 2: cold CocoIndex cold sidecar.

Result: `BLOCKED`.

Evidence:

```text
[cocoindex mcp] rerank sidecar: {"spawned": false, "port": 8765, "fallback": "warmup-timeout"}
Error: Failed to connect to daemon: [Errno 1] Operation not permitted: '/Users/michelkerkmeester/.cocoindex_code/daemon.spawn-lock'
```

Smoke 3: spec-memory then CocoIndex exactly one sidecar.

Result: `BLOCKED`.

Evidence:

```text
Process count unavailable: ps/pgrep cannot get process list.
Sidecar cannot start because .opencode/skills/system-rerank-sidecar/.venv is missing.
```

Smoke 4: start script missing graceful degradation.

Result: `PARTIAL`.

Evidence:

```text
[ensure-rerank-sidecar] sidecar skill missing at .../scripts/start.sh; degrading to positional fallback
[mk-spec-memory-launcher] rerank sidecar: {"spawned":false,"port":8765,"fallback":"no-sidecar-skill"}
context-server fatal: listen EPERM /tmp/mk-spec-memory/daemon-ipc.sock
```

The ensure helper's degradation worked, but the MCP server could not finish startup because this sandbox rejects Unix socket listen.

Smoke 5: parallel cold starts exactly one sidecar.

Result: `BLOCKED`.

Evidence:

```text
sidecar warmup timed out because .venv is missing
process counting unavailable
spec-memory socket listen EPERM
cocoindex daemon lock write EPERM under ~/.cocoindex_code
```

### Strict Validate

Command:

```bash
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh \
  .opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/008-rerank-sidecar-arc/003-ensure-sidecar-from-launchers \
  --strict
```

Evidence:

```text
Summary: Errors: 0  Warnings: 0
RESULT: PASSED
```

Exit code: `0`.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Live smokes not proven in this sandbox.** The implementation is in place and unit/build checks pass, but process listing, Unix sockets, home-directory writes, and the sidecar venv are unavailable here.
2. **`.codex/config.toml` unchanged.** Both `apply_patch` and direct Node writes fail with `EPERM`; even `touch .codex/.codex-write-test` is denied.
3. **Two helper implementations.** Node and Python can drift if the contract changes; keep future changes paired.
4. **No PID-file tracking.** Operators still clean stale sidecars with process tooling.
5. **Sidecar install remains prerequisite.** If `.opencode/skills/system-rerank-sidecar/.venv` is missing, `start.sh` exits and ensure degrades after warmup timeout.
<!-- /ANCHOR:limitations -->

## Commit Handoff

Files to stage:

```text
.gemini/settings.json
.claude/mcp.json
.opencode/bin/lib/ensure-rerank-sidecar.cjs
.opencode/bin/lib/ensure-rerank-sidecar.vitest.ts
.opencode/bin/mk-skill-advisor-launcher.cjs
.opencode/bin/mk-spec-memory-launcher.cjs
.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/cli.py
.opencode/skills/system-rerank-sidecar/scripts/ensure_rerank_sidecar.py
.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/008-rerank-sidecar-arc/003-ensure-sidecar-from-launchers/tasks.md
.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/008-rerank-sidecar-arc/003-ensure-sidecar-from-launchers/implementation-summary.md
opencode.json
```

Blocked requested file:

```text
.codex/config.toml
```

Suggested subject:

```text
feat(016/008/003): ensure-rerank-sidecar self-electing primary from both launchers
```

Next steps:

```text
Install the sidecar venv (`bash .opencode/skills/system-rerank-sidecar/scripts/install.sh`) and rerun T018-T022 in a non-restricted local shell. Phase 004 should wait for those live smokes unless the orchestrator accepts the sandbox-blocked evidence as sufficient for handoff.
```
