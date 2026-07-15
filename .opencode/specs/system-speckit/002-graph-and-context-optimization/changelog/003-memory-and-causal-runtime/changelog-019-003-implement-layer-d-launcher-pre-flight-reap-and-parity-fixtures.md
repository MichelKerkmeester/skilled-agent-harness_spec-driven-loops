---
title: "Layer D Launcher Pre-Flight Reap and Parity Fixtures"
description: "JS and Python launcher twins gained pre-flight stale sidecar cleanup with cross-runtime parity verified on a shared fixture matrix."
trigger_phrases:
  - "layer d launcher pre-flight reap"
  - "rerank sidecar parity fixtures"
  - "ensure-rerank-sidecar layer d"
  - "launcher pre-flight cleanup"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-23

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/019-fix-rerank-sidecar-accumulation-with-three-layer-reaper/003-implement-layer-d-launcher-pre-flight-reap-and-parity-fixtures` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/019-fix-rerank-sidecar-accumulation-with-three-layer-reaper`

### Summary

Both detached rerank sidecar launchers could reuse or spawn sidecars without first removing rows whose registered launcher owners were all dead. That left failed-start, hung or ownerless stale rows able to accumulate until a later cleanup path noticed them. Layer D pre-flight reap was added to both the JS and Python launcher twins so stale rows are cleaned before the normal reuse-or-spawn path runs. JS reads ledger v1/v2 payloads, identity-checks owners via PID lstart/comm, probes the health endpoint, SIGTERMs dead-owner or unhealthy rows, removes them and registers the current launcher owner. Python mirrors the same behavior using flock-backed ledger helpers and v2 liveness checks. Cross-runtime parity was confirmed by running identical fixture inputs through both JS Vitest and Python pytest.

### Added

- JS identity-verified owner liveness reasons in `ensure-rerank-sidecar.cjs` matching Python `process_liveness()` semantics
- JS pre-flight reap path in the launcher before `findReusableSidecar()` via `reapStaleSidecars()`
- Python pre-flight reap mirror in `ensure_rerank_sidecar.py` before `find_reusable_sidecar()` via `preflight_reap_sidecars()`
- Shared fixture parity coverage in `ensure-rerank-sidecar.vitest.ts` consuming `reaper-ledger-cases.json` from the ledger packet
- Best-effort launcher reaper telemetry emitting to `RERANK_SIDECAR_REAPER_TELEMETRY_PATH`

### Changed

- JS ledger writes upgraded to v2 format on mutation to keep owner identities aligned
- Python and JS launchers both register the current launcher owner identity on reused and newly spawned rows
- Detached launch behavior preserved: JS keeps `detached: true` plus `child.unref()`, Python keeps `start_new_session=True`

### Fixed

- Stale ledger rows with all-dead owners no longer accumulate across restarts because pre-flight reap removes them before the reuse or spawn decision
- PID reuse false-negative addressed by verifying owner identity with lstart and comm, not PID alone

### Verification

| Check | Result |
|-------|--------|
| `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh` on scaffold | Exit 0 before implementation |
| `node -c .opencode/bin/lib/ensure-rerank-sidecar.cjs` | Exit 0 |
| `python3 -m py_compile .opencode/skills/system-rerank-sidecar/scripts/ensure_rerank_sidecar.py` | Exit 0 |
| `python3 -m pytest tests/test_sidecar_ledger.py -v` in `system-rerank-sidecar` | Exit 0. 22 passed |
| Vitest `ensure-rerank-sidecar.vitest.ts` via installed runner | Exit 0. 25 passed. 5 pre-existing skipped |
| `verify_alignment_drift.py --root .opencode/bin/lib` | Exit 0. PASS |
| `verify_alignment_drift.py --root .opencode/skills/system-rerank-sidecar/scripts` | Exit 0. PASS |
| JS/Python parity on 9 shared fixture cases | All 9 cases match: no-reap when owners alive, reap when all-dead plus health unreachable |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/bin/lib/ensure-rerank-sidecar.cjs` | Modified | JS Layer D pre-flight reap, owner identity verification, v2 ledger writes, telemetry and test exports |
| `.opencode/skills/system-rerank-sidecar/scripts/ensure_rerank_sidecar.py` | Modified | Python Layer D mirror with flock-backed ledger helpers and owner registration |
| `.opencode/bin/lib/ensure-rerank-sidecar.vitest.ts` | Modified | Shared fixture parity, identity reasons, legacy v1 migration, dead-owner reap and live-owner no-kill coverage |

### Follow-Ups

- The exact Vitest path `node_modules/vitest/vitest.mjs` under `.opencode/skills/system-spec-kit` was not present in this checkout. The equivalent installed runner under `skills/system-spec-kit/scripts/node_modules` passed instead.
- Python pre-flight uses private ledger lock and read helpers because `sidecar_ledger.py` does not expose a public raw-row locked read that preserves missing-owner debug rows. This keeps the change inside the approved launcher file.
- Later phases still own `start.sh`, README, SKILL.md and operator-facing env forwarding docs.
- The three implementation files were subsequently removed in a later cleanup commit (`696c889887`). The changelog records the state at ship time.

## Later Update (2026-06-04)

The rerank-sidecar runtime files referenced in this changelog were later removed in cleanup commits 74b9677494, b564013c0e and 696c889887. This entry records the work as it shipped at the time. The parent packet status is now Shipped then removed.
