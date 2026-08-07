---
title: "Rerank reaper env knobs and operator docs [019/004]"
description: "The rerank sidecar launcher now forwards approved reaper controls through its scrubbed env boundary. SKILL.md and README.md document the three-layer cleanup lifecycle for operators."
trigger_phrases:
  - "rerank reaper env knobs"
  - "sidecar reaper operator docs"
  - "reaper telemetry path forwarding"
  - "start.sh reaper allowlist"
  - "rerank sidecar lifecycle docs"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-23

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/019-fix-rerank-sidecar-accumulation-with-three-layer-reaper/004-implement-env-knobs-and-skill-docs` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/019-fix-rerank-sidecar-accumulation-with-three-layer-reaper`

### Summary

The rerank sidecar launcher was silently dropping the four approved reaper control variables at its `env -i` scrubbing boundary. Operators had no docs explaining which cleanup mechanism fires under which condition, nor how to override reaper behavior for manual debugging. The `start.sh` allowlist now explicitly forwards `RERANK_SIDECAR_REAPER_HEARTBEAT_SECONDS`, `RERANK_SIDECAR_REAPER_DISABLE`, `RERANK_SIDECAR_REAPER_TELEMETRY_PATH` and `RERANK_SIDECAR_IDLE_TIMEOUT_SECONDS` through the existing `add_env_if_set` loop without weakening the `env -i` isolation. `SKILL.md` now documents the three-layer reaper lifecycle with defaults, telemetry path and the `RERANK_SIDECAR_REAPER_DISABLE=1` manual debug opt-out. `README.md` adds operator-facing lifecycle guidance covering owner-death self-exit, the 30-minute idle backstop, launcher pre-flight reap and a troubleshooting row for stale sidecars. This closes the final open surface of the three-layer reaper arc.

### Added

- Four explicit reaper env knob entries in the `start.sh` allowlist via the existing `add_env_if_set` loop.
- Inline knob comments in `start.sh` explaining each key's purpose and default.
- Reaper lifecycle section in `SKILL.md`: heartbeat 45 seconds, idle 1800 seconds, pre-flight reap on launch, telemetry path under `~/Library/Logs/spec-kit/` and `RERANK_SIDECAR_REAPER_DISABLE=1` for manual debug.
- Operator lifecycle section in `README.md`: owner-death self-exit, idle timeout, pre-flight reap, telemetry override example, manual debug flow and a troubleshooting row for stale sidecars.
- Six-step integration smoke runbook in `implementation-summary.md` covering PID verification, parent-shell death, heartbeat wait and telemetry event check.

### Changed

- Phase-history language removed from `SKILL.md` and `README.md`. Both now describe present-tense operator behavior only.

### Fixed

- Reaper env knobs were silently dropped by the `env -i` boundary. Adding four named keys to the explicit allowlist ensures the approved controls reach the sidecar process.

### Verification

| Check | Result |
|-------|--------|
| `bash -n .opencode/skills/system-rerank-sidecar/scripts/start.sh` | PASS |
| `wc -l .opencode/skills/system-rerank-sidecar/SKILL.md` | PASS, 340 LOC (within 500 cap) |
| `rg -n "RERANK_SIDECAR_REAPER_HEARTBEAT_SECONDS\|RERANK_SIDECAR_REAPER_DISABLE\|RERANK_SIDECAR_REAPER_TELEMETRY_PATH\|RERANK_SIDECAR_IDLE_TIMEOUT_SECONDS" start.sh SKILL.md README.md` | PASS, all four keys documented and forwarded |
| `timeout 8 bash .opencode/skills/system-rerank-sidecar/scripts/start.sh --help 2>&1 \|\| true` | PASS, uvicorn started then hit sandbox bind error on `127.0.0.1:8765` and shut down cleanly |
| `python3 .opencode/skills/sk-code/assets/scripts/verify_alignment_drift.py --root .opencode/skills/system-rerank-sidecar` | PASS |
| `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <packet> --strict` | PASS after packet docs were filled |
| `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <arc-005-parent> --strict` | PASS |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-rerank-sidecar/scripts/start.sh` | Modified | Four reaper env knobs added to the explicit `add_env_if_set` allowlist with inline comments. |
| `.opencode/skills/system-rerank-sidecar/SKILL.md` | Modified | Three-layer reaper lifecycle docs added. Phase-history language removed. |
| `.opencode/skills/system-rerank-sidecar/README.md` | Modified | Operator lifecycle section added covering owner-death exit, idle timeout, pre-flight reap, telemetry and manual debug. |

### Follow-Ups

- Integration smoke is a manual post-merge runbook. The sandbox blocks the local port bind during the bounded smoke run, so the owner-death telemetry check requires an operator environment with full launcher access.
- The `system-rerank-sidecar` skill was removed in a subsequent cleanup commit (`696c889887`). If the skill is reinstated, the env forwarding and operator docs from this phase should be treated as the baseline.

## Later Update (2026-06-04)

The rerank-sidecar runtime files referenced in this changelog were later removed in cleanup commits 74b9677494, b564013c0e and 696c889887. This entry records the work as it shipped at the time. The parent packet status is now Shipped then removed.
