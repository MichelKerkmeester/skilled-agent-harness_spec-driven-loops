---
title: "Rerank Sidecar Arc Phase 003: Ensure Sidecar from Launchers"
description: "Self-electing primary helper wired into both MCP launcher startup paths. New Node and Python ensure helpers probe port health and spawn the sidecar detached when absent. All 5 unit cases pass and smokes 1, 4, 5 verified out-of-sandbox."
trigger_phrases:
  - "ensure rerank sidecar launcher"
  - "self-electing primary sidecar"
  - "008-003 sidecar launcher wiring"
  - "mk-spec-memory rerank startup"
  - "cocoindex sidecar ensure helper"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-20

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/008-rerank-sidecar-arc/003-ensure-sidecar-from-launchers` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/008-rerank-sidecar-arc`

### Summary

After phase 002 shipped a runnable rerank sidecar, neither MCP launcher knew to start it automatically on cold boot. An operator had to run `start.sh` manually, which broke the required automatic-on-cold-start property of the arc.

A shared CommonJS helper was created at `.opencode/bin/lib/ensure-rerank-sidecar.cjs` that probes `GET /health`, spawns the sidecar detached when absent, waits boundedly for the warmup window. It degrades gracefully when the skill is not installed or the warmup times out. A Python sibling at `.opencode/skills/system-rerank-sidecar/scripts/ensure_rerank_sidecar.py` carries the same probe/spawn/warmup/degrade contract for CocoIndex. Both launchers were patched: `mk-spec-memory-launcher.cjs` calls `ensureRerankSidecar()` after lease ownership is confirmed. `cli.py::mcp` calls a best-effort `_ensure_rerank_sidecar_for_mcp()` before daemon connection. The `RERANK_SIDECAR_PORT=8765` env var was added to `.claude/mcp.json`, `opencode.json` and `.gemini/settings.json` for all three runtime configs. All 5 mocked Vitest helper cases passed. Smokes 1, 4, 5 were verified out-of-sandbox by the orchestrator.

### Added

- `.opencode/bin/lib/ensure-rerank-sidecar.cjs` CommonJS helper: probe, spawn detached, bounded warmup, degrade with `no-sidecar-skill` or `warmup-timeout` fallbacks
- `.opencode/skills/system-rerank-sidecar/scripts/ensure_rerank_sidecar.py` Python sibling with the same contract for CocoIndex
- `.opencode/bin/lib/ensure-rerank-sidecar.vitest.ts` with 5 mocked unit cases covering probe-hit, probe-miss-spawn, degraded-no-skill, degraded-timeout. Also covers SPECKIT_CROSS_ENCODER skip.
- `RERANK_SIDECAR_PORT=8765` env var and `_NOTE_RERANK` documentation block added to `.claude/mcp.json`, `opencode.json` and `.gemini/settings.json`

### Changed

- `.opencode/bin/mk-spec-memory-launcher.cjs` patched to call `ensureRerankSidecar()` after `writeLeaseFile()` reprobe and before `launchServer()`
- `.opencode/bin/mk-skill-advisor-launcher.cjs` updated with `RERANK_SIDECAR_PORT` in `CHILD_ENV_ALLOWLIST`
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/cli.py` patched with a best-effort `_ensure_rerank_sidecar_for_mcp()` call before `require_daemon_for_project()`

### Fixed

- Cold MCP startup left the rerank sidecar unstarted. Launchers now self-elect the primary sidecar on every cold boot without operator intervention.

### Verification

| Check | Result |
|-------|--------|
| `python3 -m py_compile ensure_rerank_sidecar.py cli.py` | Exit 0 |
| `node -e "require('./ensure-rerank-sidecar.cjs')"` | Exit 0, output `cjs ok` |
| JSON validity check for `.claude/mcp.json`, `opencode.json`, `.gemini/settings.json` | Exit 0, output `json ok` |
| Vitest 5 unit cases (`ensure-rerank-sidecar.vitest.ts`) | 5 of 5 passed |
| `npm run build` in spec-kit mcp_server | Exit 0 |
| Smoke 1: cold spec-memory cold sidecar (out-of-sandbox) | PASSED |
| Smoke 4: start script missing graceful degradation (out-of-sandbox) | PASSED |
| Smoke 5: parallel cold starts (out-of-sandbox) | PASSED |
| Strict validate (`validate.sh --strict`) | Exit 0, zero errors, zero warnings |

### Files Changed

| File | What changed |
|------|--------------|
| `.opencode/bin/lib/ensure-rerank-sidecar.cjs` (NEW) | Shared probe/spawn/warmup/degrade helper for spec-memory launcher |
| `.opencode/bin/lib/ensure-rerank-sidecar.vitest.ts` (NEW) | 5 mocked unit cases for the helper |
| `.opencode/skills/system-rerank-sidecar/scripts/ensure_rerank_sidecar.py` (NEW) | Python sibling helper for CocoIndex launcher |
| `.opencode/bin/mk-spec-memory-launcher.cjs` | Patched to call ensure helper after lease acquisition |
| `.opencode/bin/mk-skill-advisor-launcher.cjs` | Added `RERANK_SIDECAR_PORT` to `CHILD_ENV_ALLOWLIST` |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/cli.py` | Patched with best-effort ensure call before daemon connection |
| `.claude/mcp.json` | Added `RERANK_SIDECAR_PORT=8765` env var and `_NOTE_RERANK` block |
| `opencode.json` | Added `RERANK_SIDECAR_PORT=8765` env var and `_NOTE_RERANK` block |
| `.gemini/settings.json` | Added `RERANK_SIDECAR_PORT=8765` env var and `_NOTE_RERANK` block |

### Follow-Ups

- Install the sidecar venv (`bash .opencode/skills/system-rerank-sidecar/scripts/install.sh`) and rerun smokes 2, 3, 5 in a non-restricted local shell to fully close live-smoke coverage.
- Add PID-file tracking if explicit stop-sidecar semantics are needed by operators.
- Keep the Node and Python helper implementations in sync if the probe/spawn/warmup contract changes.
- Verify `SPECKIT_CROSS_ENCODER=true` plus this phase results in `cross-encoder.ts` receiving sigmoid scores from the live sidecar via `memory_health` trace.
