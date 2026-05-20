---
title: "Tasks: Ensure rerank sidecar from launchers [template:level_1/tasks.md]"
description: "Task breakdown for the self-electing-primary launcher integration."
trigger_phrases:
  - "003 tasks ensure sidecar"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-rerank-sidecar-arc/003-ensure-sidecar-from-launchers"
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
| T001 | P0 | Read cocoindex's `cli.py::mcp` entry point to identify the ensure-sidecar hook location | `[ ]` | (pending) |
| T002 | P0 | Read spec-memory launcher lease + launchServer flow; identify clean insertion point after lease acquisition | `[ ]` | (pending) |
| T003 | P0 | Confirm cocoindex's startup is async-friendly (or note that the Python sibling needs to be sync) | `[ ]` | (pending) |
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

| Task | P | Description | Status | Evidence |
|------|---|-------------|--------|----------|
| T004 | P0 | Author `.opencode/bin/lib/ensure-rerank-sidecar.cjs` per plan §3 sketch | `[ ]` | (pending) |
| T005 | P0 | Author Python sibling `.opencode/skills/system-rerank-sidecar/scripts/ensure_rerank_sidecar.py` mirroring the same contract | `[ ]` | (pending) |
| T006 | P0 | Patch `mk-spec-memory-launcher.cjs` to invoke `ensureRerankSidecar` after lease acquisition | `[ ]` | (pending) |
| T007 | P0 | Patch cocoindex's `cli.py::mcp` to invoke the Python sibling at startup | `[ ]` | (pending) |
| T008 | P1 | Add `RERANK_SIDECAR_PORT=8765` to `.mcp.json` spec-memory + code-index env blocks | `[ ]` | (pending) |
| T009 | P1 | Add `RERANK_SIDECAR_PORT=8765` to `opencode.json` | `[ ]` | (pending) |
| T010 | P1 | Add `RERANK_SIDECAR_PORT=8765` to `.gemini/settings.json` | `[ ]` | (pending) |
| T011 | P1 | Add `RERANK_SIDECAR_PORT=8765` to `.codex/config.toml` | `[ ]` | (pending) |
| T012 | P2 | Add `RERANK_SIDECAR_PORT` to `mk-skill-advisor-launcher.cjs::CHILD_ENV_ALLOWLIST` (defensive — if advisor ever wants rerank) | `[ ]` | (pending) |
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

| Task | P | Description | Status | Evidence |
|------|---|-------------|--------|----------|
| T013 | P0 | Vitest case for sidecar-already-healthy probe path | `[ ]` | (pending) |
| T014 | P0 | Vitest case for sidecar-absent-spawn-and-warmup path | `[ ]` | (pending) |
| T015 | P0 | Vitest case for skill-not-installed graceful fallback | `[ ]` | (pending) |
| T016 | P0 | Vitest case for warmup-timeout fallback | `[ ]` | (pending) |
| T017 | P0 | Vitest case for `SPECKIT_CROSS_ENCODER=false` opt-out | `[ ]` | (pending) |
| T018 | P0 | Smoke 1: cold spec-memory cold sidecar → sidecar spawned | `[ ]` | `ps -ef \| grep rerank_sidecar` shows new process |
| T019 | P0 | Smoke 2: cold cocoindex cold sidecar → sidecar spawned | `[ ]` | (same) |
| T020 | P0 | Smoke 3: spec-memory then cocoindex → exactly one sidecar | `[ ]` | (same) |
| T021 | P0 | Smoke 4: skill removed → MCP still starts in degraded mode | `[ ]` | memory_search returns positional fallback scores |
| T022 | P0 | Smoke 5: parallel cold starts → exactly one sidecar | `[ ]` | (same) |
| T023 | P0 | spec-memory `npm run build` exits 0 | `[ ]` | (pending) |
| T024 | P0 | Strict validate this packet | `[ ]` | Exit 0 |
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
- Reference (lease pattern): `../../006-mcp-launcher-concurrency-arc/012-daemon-bridge-socket-for-skill-advisor-and-code-index/` — same idempotent-attach pattern, at port level instead of file level
<!-- /ANCHOR:cross-refs -->
