---
title: "Sidecar-Worker P1 Fixes: Liveness, Dead Code, Error Policy"
description: "Seven P1 correctness and dead-code findings in sidecar-worker.ts closed with surgical edits. Structured parent liveness, rejected-promise eviction, pre-parse id policy, canonical error format plus helper consolidation all shipped with 7 new fixture tests passing."
trigger_phrases:
  - "sidecar-worker p1 fixes"
  - "F5 F14 F19 F26 F30 F94 F95 sidecar"
  - "sidecar worker liveness structured result"
  - "rejected provider promise eviction"
  - "sidecar pre-parse id policy"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-23

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/017-fix-sidecar-investigation-remaining-p1s-and-p2s-for-resource-bounds-and-deadcode/001-fix-investigation-p1s-for-sidecar-worker-liveness-and-deadcode` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/017-fix-sidecar-investigation-remaining-p1s-and-p2s-for-resource-bounds-and-deadcode`

### Summary

Seven P1 findings in `sidecar-worker.ts` from arc 010/001 deep-research were open: incorrect parent-liveness detection (F14), a cached rejected provider promise that never self-evicted (F95), pre-parse failure responses silently emitting `id=0` (F94), a dead model-name fallback chain (F5), inconsistent error format across module boundaries (F30) plus two helper-consolidation findings (F19, F26). Correctness risks in F14, F94 plus F95 required new fixture tests alongside the edits.

All seven findings were closed with targeted edits to `sidecar-worker.ts`. Parent liveness now returns a structured `{ alive, reason, errorCode }` result that treats PID 1 as orphaned and distinguishes EPERM from ESRCH from unknown. The cached rejected provider promise now self-evicts so subsequent calls retry cleanly. Pre-parse failure paths mirror the request id or exit 1 with stderr rather than emitting a synthetic `id=0`. The model fallback chain was collapsed to a single env/config/default source with a stderr warning on empty. Error payloads were normalized to `{ phase, code, detail }`. Trivial single-call helper chains were inlined while test-seam helpers were preserved. Seven new vitest assertions for F14, F94 plus F95 bring the sidecar-hardening suite to 21 passing tests.

### Added

- Structured parent-liveness function returning `{ alive, reason, errorCode }` with explicit `pid-1-orphaned`, `kill-0-eperm`, `kill-0-esrch`, `ok` plus `unknown` reason codes (`sidecar-worker.ts:128-168`)
- Seven new fixture tests in `sidecar-hardening.vitest.ts` covering F14 liveness branches, F94 pre-parse id mirroring plus F95 rejected-promise eviction
- `decision-record.md` with ADRs for the F14 liveness policy, F94 pre-parse id policy plus F95 cache eviction policy

### Changed

- Model-name fallback chain collapsed from multiple dead branches to `SPECKIT_EMBEDDER_SIDECAR_MODEL` env, request config, then default with a stderr warning when both explicit sources are empty (`sidecar-worker.ts:74-88`)
- Worker error payloads normalized to `{ phase, code, detail }` across all emit sites (`sidecar-worker.ts:45-53`, `sidecar-worker.ts:214-222`, `sidecar-worker.ts:320-363`)
- Trivial single-call helper chain inlined. Helpers with test-seam or behavioral intent were retained (`sidecar-worker.ts:74-259`)

### Fixed

- F14: parent-liveness check incorrectly treated PID 1 as a live parent. Structured result now identifies orphaned, EPERM plus ESRCH cases explicitly.
- F94: pre-parse failures emitted `id=0` silently, masking the origin of errors. Recoverable requests now mirror the request id and unrecoverable no-id input exits 1 with stderr.
- F95: rejected provider creation promise remained cached indefinitely, making all subsequent dispatches return the stale rejection. Promise is evicted on first rejection so retries go through the full creation path.

### Verification

| Command | Exit | Evidence |
|---------|------|----------|
| `cd .opencode/skills/system-spec-kit && node mcp_server/node_modules/vitest/vitest.mjs run mcp_server/tests/embedders/sidecar-hardening.vitest.ts --config mcp_server/vitest.config.ts` | 0 | 1 file passed. 21 tests passed including 7 new F14/F94/F95 assertions. |
| `cd .opencode/skills/system-spec-kit && npm run typecheck --workspace=@spec-kit/mcp-server` | 0 | `tsc --noEmit --composite false -p tsconfig.json` passed. |
| Strict packet validation (`validate.sh --strict`) | 0 | Strict validation passed after final docs update. |
| Checklist review | Pass | 26 completed task items recorded. |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `mcp_server/lib/embedders/sidecar-worker.ts` | Modified | F5 fallback collapse, F14 structured liveness, F19/F26 helper consolidation, F30 canonical error format, F94 pre-parse id policy, F95 rejected-promise eviction |
| `mcp_server/tests/embedders/sidecar-hardening.vitest.ts` | Modified | 7 new fixture tests for F14, F94, F95 bringing suite to 21 tests |

### Follow-Ups

- F95 in `execution-router.ts` remains open because this packet owns only the `sidecar-worker.ts` surface. A follow-on packet covering the execution-router surface should close it.
- Scope intentionally excludes `sidecar-client.ts`, `execution-router.ts`, `ensure-rerank-sidecar.cjs`, reindex, registry, schema plus index files per the phase boundary defined in the parent spec.
