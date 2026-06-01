---
title: "Layer B Sidecar Self-Check and In-Flight Gate"
description: "Rerank sidecar gained an async-native owner-death self-check (Layer B), an idle backstop (Layer A), a shared in-flight request gate plus structured telemetry JSONL output. All 15 sidecar tests and 22 ledger regression tests pass in the sidecar venv."
trigger_phrases:
  - "layer b sidecar self-check"
  - "rerank sidecar in-flight gate"
  - "sidecar idle backstop reaper"
  - "rerank sidecar telemetry jsonl"
  - "sidecar owner death self check"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-23

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/019-fix-rerank-sidecar-accumulation-with-three-layer-reaper/002-implement-layer-b-sidecar-self-check-and-in-flight-gate` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/019-fix-rerank-sidecar-accumulation-with-three-layer-reaper`

### Summary

The rerank FastAPI sidecar had no background owner-liveness self-check, no app-level in-flight request gate, no idle timeout backstop plus no process-lifecycle telemetry. Sidecar processes could linger indefinitely after their registered owners disappeared, accumulating until the host ran out of resources.

Layer B owner self-check, Layer A idle backstop, a shared `InFlightGate` plus structured telemetry JSONL were implemented in `rerank_sidecar.py`. The reaper runs as a cancellable FastAPI lifespan asyncio task. When all registered owners are confirmed dead, the reaper defers SIGTERM until the in-flight counter drains to zero. Idle exit fires when `RERANK_SIDECAR_IDLE_TIMEOUT_SECONDS` elapses with no real request activity. Telemetry events are written through a temp-file replace via `run_in_executor` so I/O never blocks the event loop. The sidecar venv test suite grew from a model-dependent harness to a fully mocked 15-test suite covering all new behaviors plus existing endpoint contracts.

### Added

- `InFlightGate` class tracking active request count and pending shutdown state in `rerank_sidecar.py`
- `evaluate_reaper_once()` pure function for deterministic unit tests of owner-death and idle decisions
- `reaper_loop()` async task for periodic Layer B and Layer A evaluation
- Telemetry JSONL writer with atomic temp-file replace and `run_in_executor` offload
- Reaper env knobs: `RERANK_SIDECAR_REAPER_HEARTBEAT_SECONDS`, `RERANK_SIDECAR_IDLE_TIMEOUT_SECONDS`, `RERANK_SIDECAR_REAPER_TELEMETRY_PATH`, `RERANK_SIDECAR_REAPER_DISABLE`
- 15 mocked unit tests in `test_rerank_sidecar.py` covering owner-death reap, partial-owner no-reap, idle timeout, health idle behavior, telemetry JSONL, manual opt-out plus in-flight pending shutdown

### Changed

- FastAPI `lifespan()` extended to create and cancel the reaper asyncio task while preserving model cleanup
- `/warmup` and `/rerank` endpoints now increment/decrement the in-flight gate and refresh `last_request_at` in a `finally` block
- `test_rerank_sidecar.py` rewritten to mock `sentence_transformers.CrossEncoder` so no real model is loaded during test runs

### Fixed

- Sidecar processes that outlived all registered owners had no automatic shutdown path. Layer B self-check now sends a graceful SIGTERM after active requests drain.
- Sidecar processes idle for extended periods had no idle exit. Layer A backstop now exits after the configured threshold when in-flight is zero.
- Health probes were refreshing idle state, masking stale sidecars. `/health` no longer updates `last_request_at`.

### Verification

| Command | Exit | Result |
|---------|------|--------|
| `cd .opencode/skills/system-rerank-sidecar && .venv/bin/python -m pytest tests/test_rerank_sidecar.py -v` | 0 | 15 tests passed |
| `cd .opencode/skills/system-rerank-sidecar && .venv/bin/python -m pytest tests/test_sidecar_ledger.py -v` | 0 | 22 tests passed. Ledger sibling regression check. |
| `cd .opencode/skills/system-rerank-sidecar && .venv/bin/python -m py_compile scripts/rerank_sidecar.py tests/test_rerank_sidecar.py` | 0 | Syntax compile passed |
| `python3 .opencode/skills/sk-code/assets/scripts/verify_alignment_drift.py --root .opencode/skills/system-rerank-sidecar` | 0 | Alignment drift PASS. 0 errors, 0 warnings. |
| `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <spec-folder> --strict` | 0 | Strict validation passed |

### Files Changed

| File | What changed |
|------|--------------|
| `.opencode/skills/system-rerank-sidecar/scripts/rerank_sidecar.py` | Lifespan reaper task, `InFlightGate`, idle tracking, telemetry JSONL, owner self-check, self-SIGTERM, env knobs. File removed in a later cleanup commit. |
| `.opencode/skills/system-rerank-sidecar/tests/test_rerank_sidecar.py` | Rewritten with mocked model boundary. 15 tests covering all new behaviors and existing endpoint contracts. File removed in a later cleanup commit. |

### Follow-Ups

- Forward the new reaper env knobs through `start.sh` and launcher twins. Env forwarding is owned by later 010/005 child phases and was intentionally out of scope here.
- Integrate launcher owner registration so the app can safely Layer B self-reap empty-owner legacy rows. Until that lands, idle cleanup remains the only active exit path for orphaned rows with no registered owners.
