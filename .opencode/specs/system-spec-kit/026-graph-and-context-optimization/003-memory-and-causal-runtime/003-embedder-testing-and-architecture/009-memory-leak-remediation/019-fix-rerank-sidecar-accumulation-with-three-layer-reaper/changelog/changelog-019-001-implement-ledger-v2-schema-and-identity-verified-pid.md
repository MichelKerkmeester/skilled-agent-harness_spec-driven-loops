---
title: "Ledger v2 Schema and Identity-Verified PID Helpers"
description: "Foundation layer for the three-layer reaper: ledger v2 owner identity schema, identity-verified PID liveness helpers, locked owner registration and pruning, v1 read compatibility and a shared cross-runtime JSON fixture matrix. 22 pytest cases pass. Strict validation exits 0."
trigger_phrases:
  - "ledger v2 schema identity pid"
  - "identity verified pid liveness"
  - "sidecar ledger owner identity"
  - "reaper ledger v2 foundation"
  - "reaper ledger cases fixture matrix"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-23

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/019-fix-rerank-sidecar-accumulation-with-three-layer-reaper/001-implement-ledger-v2-schema-and-identity-verified-pid` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/019-fix-rerank-sidecar-accumulation-with-three-layer-reaper`

### Summary

The rerank sidecar ledger recorded rows without process-owner identities. A `kill(pid, 0)` probe alone cannot distinguish a live original owner from a recycled PID, leaving the three-layer reaper unable to safely decide ownership before launcher and app reaper phases could consume that data.

This phase delivered the foundation layer: the ledger v2 schema with owner identity entries, an identity-verified liveness helper returning all ADR-002 reasons, locked owner prune and register helpers, backward-compatible v1 row reading and a shared language-neutral JSON fixture matrix. Python pytest coverage (22 tests) and strict packet validation both passed at exit 0.

### Added

- `OwnerIdentity` v2 dataclass capturing `pid`, `createTimestamp` and `comm` fields in `sidecar_ledger.py`
- `process_liveness(pid, recorded_create_timestamp, recorded_comm)` helper returning all ADR-002 reasons: `ok`, `pid-recycled`, `kill-0-esrch`, `kill-0-eperm`, `pid-1-orphaned` and `unknown`
- Locked owner registration and pruning helpers using `fcntl.flock(LOCK_EX)` for concurrent ledger safety
- `should_reap_row` decision helper consumed by later reaper phases
- Shared `tests/fixtures/reaper-ledger-cases.json` matrix with 9 cross-runtime cases covering alive, ESRCH, recycled PID, mixed owners, PID 1, EPERM, empty legacy owners and unknown errno
- `tests/__init__.py` package marker (was absent)

### Changed

- `sidecar_ledger.py` write path: v2 payload now uses ADR-003 shape with `version: 2` and a `sidecars` list carrying per-row `owners` identity entries
- `test_sidecar_ledger.py` reworked into pytest classes covering v2 schema, identity liveness, owner prune and register, v1 compatibility and fixture matrix assertions

### Fixed

- Ledger rows lacked owner identity data, preventing PID-recycling detection. V2 schema and identity parser fill this gap.
- Existing v1 or missing-version payloads previously had no defined upgrade path. Backward-compatible reader now materializes them as v2 row objects with empty owner sets.
- `kill(pid, 0)` returning an unknown `OSError.errno` had no defined behavior. Unknown errno now logs to stderr and returns alive fail-open with `reason: "unknown"`.

### Verification

| Command | Exit | Result |
|---------|------|--------|
| `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <packet> --strict` | 0 | Initial scaffold validation passed before source edits. |
| `cd .opencode/skills/system-rerank-sidecar && python3 -m pytest tests/test_sidecar_ledger.py -v` | 0 | 22 tests passed. |
| `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <packet> --strict` | 0 | Final docs validation passed after evidence update. |
| `python3 .opencode/skills/sk-code/assets/scripts/verify_alignment_drift.py --root .opencode/skills/system-rerank-sidecar` | 0 | PASS. One warning in untouched `test_rerank_sidecar.py` (pre-existing). |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-rerank-sidecar/scripts/sidecar_ledger.py` | Modified | V2 owner identity dataclasses, ADR-shaped v2 writes, v1 read compatibility, identity parser, identity-verified liveness, locked owner registration and pruning and `should_reap_row`. Commit `3788c7f807`. |
| `.opencode/skills/system-rerank-sidecar/tests/test_sidecar_ledger.py` | Modified | Reworked pytest coverage into classes for v2 schema, identity liveness, owner prune and register, v1 compatibility and fixture matrix assertions. Commit `3788c7f807`. |
| `.opencode/skills/system-rerank-sidecar/tests/fixtures/reaper-ledger-cases.json` (NEW) | Created | 9 cross-runtime fixture cases for alive, ESRCH, recycled PID, mixed owners, PID 1, EPERM, empty legacy owners and unknown errno. Commit `3788c7f807`. |
| `.opencode/skills/system-rerank-sidecar/tests/__init__.py` (NEW) | Created | Package marker added because it was absent. Commit `3788c7f807`. |

### Follow-Ups

- Integrate owner identity data into the launcher pre-flight reaper phase (covered by child packet 003).
- Add app self-reaper behavior using `should_reap_row` in the app self-check phase (covered by child packet 002).
- Verify live `ps` output shape once a non-sandboxed environment is available. The `/bin/ps -p PID -o lstart= -o comm=` command was blocked by the build sandbox during implementation.
