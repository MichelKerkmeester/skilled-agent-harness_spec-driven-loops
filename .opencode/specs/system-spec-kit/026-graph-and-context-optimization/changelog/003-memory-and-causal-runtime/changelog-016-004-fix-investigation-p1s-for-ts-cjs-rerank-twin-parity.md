---
title: "Investigation P1 Fixes for TS CJS Rerank Twin Parity"
description: "Nine P1 drift and parity findings closed across TS/CJS/Python sidecar contracts. Canonical toBackendKind location confirmed. SidecarClientOptions split into production and test types. JS ledger locking aligned to Python fcntl pattern. Health payload cap raised to 64KB. processLiveness return type aligned to structured dict."
trigger_phrases:
  - "ts cjs rerank twin parity"
  - "F1 F2 F3 F37 F38 F69 F70 F101 F102 parity fixes"
  - "sidecar contract alignment p1"
  - "toBackendKind canonical location"
  - "js ledger locking parity"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-23

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/016-fix-sidecar-investigation-findings-for-resource-bounds-and-lifecycle/004-fix-investigation-p1s-for-ts-cjs-rerank-twin-parity` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/016-fix-sidecar-investigation-findings-for-resource-bounds-and-lifecycle`

### Summary

The TS/CJS/Python sidecar helpers had accumulated nine P1 drift findings where contracts disagreed or where the canonical source was unclear. Backend kind normalization had an ambiguous ownership point between `sidecar-client.ts` and `execution-router.ts`. The production `SidecarClientOptions` type leaked test-only fields. SPECKIT_ environment variable names were undocumented. JS ledger writes had no locking while the Python equivalent used `fcntl.flock`. The Python health payload cap was 8KB versus the JS canonical 64KB. The Python `processLiveness` function returned a bare `Literal` rather than the structured dict the JS contract specified.

Nine findings were closed in a single commit. Schema and location drifts (F2, F37, F38, F70) were resolved by confirming `toBackendKind` as canonical in `sidecar-client.ts`. `SidecarClientOptions` was split into production and test types. The `types.ts` canonical-location comment was updated. Python-to-JS contract alignment (F1, F69, F101, F102) was resolved by adding cross-reference comments for empty revision handling. Advisory `.lock` file locking was added to the JS ledger. The Python health cap was raised to 64KB. The Python `processLiveness` return type was changed to a structured dict. F3 was resolved by adding JSDoc to `sidecar-client.ts` documenting all recognized `SPECKIT_` environment variables with an exported constant. Vitest and pytest parity tests were added for each finding.

### Added

- `SidecarClientTestOptions` interface in `sidecar-client.ts` extending `SidecarClientOptions` for test-only fields (F37)
- `RECOGNIZED_SPECKIT_ENV_VARS` exported constant in `sidecar-client.ts` with JSDoc listing all recognized `SPECKIT_` environment variables (F3)
- `MAX_HEALTH_BODY_BYTES` constant set to 65536 in `ensure_rerank_sidecar.py` matching the JS cap (F101)
- Advisory `.lock` file locking path in `ensure-rerank-sidecar.cjs` ledger writes using exclusive-create retry on `EEXIST` (F69)
- Vitest tests in `sidecar-hardening.vitest.ts`: `toBackendKind_normalizes_provider_names_correctly`, `RECOGNIZED_SPECKIT_ENV_VARS_includes_all_documented_vars`, `SidecarClientOptions_constructor_accepts_only_production_fields`, `types.ts_references_canonical_toBackendKind_location`
- Pytest tests in `test_sidecar_ledger.py`: `test_empty_revision_treated_as_not_set_in_config_hash`, `test_health_payload_uses_64kb_cap_matching_js`, `test_process_liveness_returns_structured_dict_matching_js_contract`

### Changed

- `SidecarClientOptions` in `sidecar-client.ts` narrowed to production-only fields. Previously included test-only fields mixed into the production type (F37).
- `processLiveness` return type in `sidecar_ledger.py` changed from `Literal` to a structured dict. Keys are `alive` (bool), `reason` (str), `errorCode` (str or None), matching the JS contract (F102).
- Python health payload cap in `ensure_rerank_sidecar.py` raised from 8KB to 64KB to match the JS `MAX_HEALTH_BODY_BYTES` constant (F101).
- `types.ts` canonical-location comment updated to reflect the confirmed `sidecar-client.ts` location after F2 and F38 reconciliation (F70).
- `execution-router.ts` narrowed to import `toBackendKind` from the canonical `sidecar-client.ts` surface. No duplicate implementation retained (F2, F38).

### Fixed

- `toBackendKind` had an ambiguous canonical location between `sidecar-client.ts` and `execution-router.ts`. Confirmed canonical in `sidecar-client.ts:175-183`. `execution-router.ts:11` imports and uses it with no local duplicate (F2, F38).
- `SidecarClientOptions` leaked test-only fields into the production type surface. Split resolved the boundary (F37).
- `SPECKIT_` environment variable names were not documented. JSDoc and exported constant now cover all recognized names (F3).
- JS ledger writes had no locking while Python used `fcntl.flock`. Advisory `.lock` file pattern now matches Python's exclusive-create approach (F69).
- Empty `RERANK_MODEL_REVISION` was handled differently across `ensure-rerank-sidecar.cjs` and `ensure_rerank_sidecar.py`. Both now treat empty string as "not set" via the `||` operator with cross-reference comments (F1).
- Python health payload was capped at 8KB while JS was 64KB. Python cap raised to 64KB (F101).
- Python `processLiveness` returned a bare `Literal` while JS returned a structured dict. Python now returns a `dict` with `alive`, `reason`, `errorCode` keys matching the JS contract (F102).

### Verification

| Check | Status | Evidence |
|-------|--------|----------|
| Vitest (sidecar-hardening.vitest.ts) | PASSED | 14 tests passed, 4 new parity tests added |
| Pytest (test_sidecar_ledger.py) | PASSED | 20 tests passed, 3 new parity tests added |
| TypeScript typecheck | PASSED | `npm run typecheck --workspace=@spec-kit/mcp-server` |
| strict validation | TBD | Pending final packet validation |

### Files Changed

| File | What changed |
|------|--------------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts` | `toBackendKind` canonical location confirmed. `SidecarClientOptions` narrowed to production. `SidecarClientTestOptions` added for test fields. `RECOGNIZED_SPECKIT_ENV_VARS` constant and JSDoc added (F2, F3, F37, F38). |
| `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/types.ts` | Canonical-location comment updated to reflect `sidecar-client.ts` (F70). |
| `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/execution-router.ts` | Narrowed to import `toBackendKind` from canonical surface. No local duplicate retained (F2, F38). |
| `.opencode/bin/lib/ensure-rerank-sidecar.cjs` | Contract comment for empty revision handling added. Advisory `.lock` file locking added to ledger writes. `MAX_HEALTH_BODY_BYTES` comment updated (F1, F69, F101). |
| `.opencode/skills/system-rerank-sidecar/scripts/ensure_rerank_sidecar.py` | Contract comment for empty revision added. `MAX_HEALTH_BODY_BYTES = 65536` constant added. Health cap raised to 64KB (F1, F101). |
| `.opencode/skills/system-rerank-sidecar/scripts/sidecar_ledger.py` | `processLiveness` return type changed to structured dict. Callers updated. `ProcessLivenessChecker` type signature updated (F69, F102). |
| `.opencode/skills/system-spec-kit/mcp_server/tests/embedders/sidecar-hardening.vitest.ts` | Four new parity vitest tests added for F2, F3, F37, F38, F70 (NEW tests). |
| `.opencode/skills/system-rerank-sidecar/tests/test_sidecar_ledger.py` | Three new parity pytest tests added. Existing tests updated for F102 structured dict format (F1, F69, F101, F102). |

### Follow-Ups

- Validate strict packet validation once the spec folder is finalized and confirm `validate.sh --strict` exits 0.
- Track remaining 21 P1 and 68 P2 deferred findings from arc 010/001 investigation for future prioritization.
- Confirm `test_concurrent_sidecar_adds_do_not_lose_rows` coverage remains valid against the `.lock` file pattern added for F69 after any future ledger refactoring.

## Later Update (2026-06-04)

The rerank-sidecar runtime files referenced in this changelog were later removed in cleanup commits 74b9677494, b564013c0e and 696c889887. This entry records the work as it shipped at the time. The parent packet status is now Shipped then removed.
