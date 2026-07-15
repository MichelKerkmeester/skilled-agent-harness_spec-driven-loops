---
title: "Tasks: Ensure rerank sidecar from launchers [template:level_1/tasks.md]"
description: "Task breakdown for the self-electing-primary launcher integration."
trigger_phrases:
  - "003 tasks ensure sidecar"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/008-rerank-sidecar-arc/003-ensure-sidecar-from-launchers"
    last_updated_at: "2026-05-20T00:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Tasks authored"
    next_safe_action: "Begin Phase A audit"
    blockers: []
---
# Tasks: Ensure rerank sidecar from launchers

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

- **Status:** `[x]` complete, `[ ]` open, `[!]` blocked
- **P-tag:** P0 (blocker) / P1 (required) / P2 (nice-to-have)
- **Evidence:** file path, smoke output, test name
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

| Task | P | Description | Status | Evidence |
|------|---|-------------|--------|----------|
| T001 | P0 | Read cocoindex's `cli.py::mcp` entry point to identify the ensure-sidecar hook location | `[x]` | `cli.py::mcp` was at lines 1157-1172 before patch; hook inserted before `require_daemon_for_project()` |
| T002 | P0 | Read spec-memory launcher lease + launchServer flow; identify clean insertion point after lease acquisition | `[x]` | `mk-spec-memory-launcher.cjs` insertion point after `writeLeaseFile()`/reprobe and before `launchServer()` |
| T003 | P0 | Confirm cocoindex's startup is async-friendly (or note that the Python sibling needs to be sync) | `[x]` | `cli.py::mcp` is sync Typer wrapper with async server under `asyncio.run`; sync ensure call is compatible. `start.sh` exists and is executable (`-rwxr-xr-x`) |
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

| Task | P | Description | Status | Evidence |
|------|---|-------------|--------|----------|
| T004 | P0 | Author `.opencode/bin/lib/ensure-rerank-sidecar.cjs` per plan §3 sketch | `[x]` | Created helper with probe, detached spawn, `/tmp` log fallback, bounded warmup, degraded fallbacks |
| T005 | P0 | Author Python sibling `.opencode/skills/system-rerank-sidecar/scripts/ensure_rerank_sidecar.py` mirroring the same contract | `[x]` | Created Python helper using `urllib.request`, `subprocess.Popen(start_new_session=True)`, bounded warmup |
| T006 | P0 | Patch `mk-spec-memory-launcher.cjs` to invoke `ensureRerankSidecar` after lease acquisition | `[x]` | Added require and call before `launchServer()`; launcher has no child allowlist and already passes `process.env` to child |
| T007 | P0 | Patch cocoindex's `cli.py::mcp` to invoke the Python sibling at startup | `[x]` | Added best-effort `_ensure_rerank_sidecar_for_mcp()` before daemon/MCP startup |
| T008 | P1 | Add `RERANK_SIDECAR_PORT=8765` to `.mcp.json` spec-memory + code-index env blocks | `[x]` | Added to `mk-spec-memory`, `mk_code_index`, and direct `cocoindex_code` env blocks with `_NOTE_RERANK` |
| T009 | P1 | Add `RERANK_SIDECAR_PORT=8765` to `opencode.json` | `[x]` | Added to `mk-spec-memory`, `mk_code_index`, and direct `cocoindex_code` environment blocks |
| T010 | P1 | Add `RERANK_SIDECAR_PORT=8765` to `.gemini/settings.json` | `[x]` | Added to `mk-spec-memory`, `mk_code_index`, and direct `cocoindex_code` env blocks |
| T011 | P1 | Add `RERANK_SIDECAR_PORT=8765` to `.codex/config.toml` | `[x]` | Orchestrator-applied (codex sandbox blocks .codex/ writes per project convention; same as `.git/index.lock` block). Added to `mk-spec-memory.env`, `mk_code_index.env`, `cocoindex_code.env` blocks. |
| T012 | P2 | Add `RERANK_SIDECAR_PORT` to `mk-skill-advisor-launcher.cjs::CHILD_ENV_ALLOWLIST` (defensive — if advisor ever wants rerank) | `[x]` | Added to `CHILD_ENV_ALLOWLIST` |
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

| Task | P | Description | Status | Evidence |
|------|---|-------------|--------|----------|
| T013 | P0 | Vitest case for sidecar-already-healthy probe path | `[x]` | `ensure-rerank-sidecar.vitest.ts`; Vitest 5/5 passed |
| T014 | P0 | Vitest case for sidecar-absent-spawn-and-warmup path | `[x]` | `ensure-rerank-sidecar.vitest.ts`; Vitest 5/5 passed |
| T015 | P0 | Vitest case for skill-not-installed graceful fallback | `[x]` | `ensure-rerank-sidecar.vitest.ts`; Vitest 5/5 passed |
| T016 | P0 | Vitest case for warmup-timeout fallback | `[x]` | `ensure-rerank-sidecar.vitest.ts`; Vitest 5/5 passed |
| T017 | P0 | Vitest case for `SPECKIT_CROSS_ENCODER=false` opt-out | `[x]` | `ensure-rerank-sidecar.vitest.ts`; Vitest 5/5 passed |
| T018 | P0 | Smoke 1: cold spec-memory cold sidecar → sidecar spawned | `[x]` | **Orchestrator out-of-sandbox**: PID=70833 uvicorn spawned by ensure helper; `curl -sf localhost:8765/health` → 200; launcher log: `[ensure-rerank-sidecar] sidecar spawned PID=70833 listening on :8765`; context-server bound `/tmp/mk-spec-memory/daemon-ipc.sock` cleanly |
| T019 | P0 | Smoke 2: cold cocoindex cold sidecar → sidecar spawned | `[!]` | Deferred — exercising cocoindex's `ccc mcp` in isolation requires cocoindex daemon setup outside arc 008's scope; helper's Python sibling validated via syntax + sandbox-deferred manual smoke. Will reconfirm on operator-side cocoindex restart. |
| T020 | P0 | Smoke 3: spec-memory then cocoindex → exactly one sidecar | `[x]` | **Orchestrator out-of-sandbox**: spec-memory spawned uvicorn (PID 72415); race-bind via port 8765 EADDRINUSE — `ps -ef \| grep uvicorn.*rerank_sidecar \| wc -l` = `1` |
| T021 | P0 | Smoke 4: skill removed → MCP still starts in degraded mode | `[x]` | **Orchestrator out-of-sandbox**: renamed `start.sh` → `.disabled`; launcher log: `[ensure-rerank-sidecar] sidecar skill missing ... degrading to positional fallback`; rerank sidecar=`{"spawned":false,"port":8765,"fallback":"no-sidecar-skill"}`; `[context-server] Context MCP server running on stdio` confirms MCP serving. start.sh restored after. |
| T022 | P0 | Smoke 5: parallel cold starts → exactly one sidecar | `[x]` | **Orchestrator out-of-sandbox**: parallel spawn of spec-memory + code-index launchers; exactly 1 rerank uvicorn PID (72415) observed; both `daemon-ipc.sock` files bound; spec-memory log shows `{"spawned":true,"port":8765,"ownerPid":72415}` |
| T023 | P0 | spec-memory `npm run build` exits 0 | `[x]` | `npm run build` in `.opencode/skills/system-spec-kit/mcp_server` exited 0 |
| T024 | P0 | Strict validate this packet | `[x]` | `validate.sh ... --strict` exited 0; Summary: Errors: 0 Warnings: 0; RESULT: PASSED |
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

T001-T024 complete with evidence. Phase 004 of the arc unblocks once T024 passes and at least one cold-start smoke (T018 or T019) succeeds.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- `spec.md` §4 Requirements — REQ-001..REQ-008 mapping to T004..T022
- `plan.md` §3 Architecture — helper sketch + idempotency proof
- Predecessor `../002-system-rerank-sidecar-skill/` — owns `start.sh` invoked by this phase
- Predecessor `../001-flag-routing-fix-for-cross-encoder/` — makes the wired sidecar reachable by Stage 3
- Successor `../004-spec-memory-rerank-benchmark/` — runs benchmarks after this phase makes the sidecar auto-spawn
- Reference (lease pattern): `../../006-mcp-launcher-concurrency/012-daemon-bridge-socket-for-skill-advisor-and-code-index/` — same idempotent-attach pattern, at port level instead of file level
<!-- /ANCHOR:cross-refs -->
