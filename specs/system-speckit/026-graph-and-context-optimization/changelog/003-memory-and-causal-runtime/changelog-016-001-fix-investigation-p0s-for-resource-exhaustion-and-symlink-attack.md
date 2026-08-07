---
title: "016-001: P0 Sidecar Security Fixes for Resource Exhaustion and Symlink Attack"
description: "Three P0 findings closed with bounded resource handling and crypto-strong temp file creation. F12 capped sidecar-client stdout lines and buffers. F13 replaced predictable temp suffixes with crypto-random bytes and exclusive-create semantics. F47 capped sidecar-worker stdin lines and input array length. 31 tests across 4 suites passed."
trigger_phrases:
  - "F12 F13 F47 p0 remediation"
  - "sidecar resource exhaustion fix"
  - "symlink attack temp file fix"
  - "unbounded json parsing sidecar"
  - "arc 010 p0 findings closed"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-23

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/016-fix-sidecar-investigation-findings-for-resource-bounds-and-lifecycle/001-fix-investigation-p0s-for-resource-exhaustion-and-symlink-attack` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/016-fix-sidecar-investigation-findings-for-resource-bounds-and-lifecycle`

### Summary

Arc 010/001 deep-research identified three P0 security findings in the embedder sidecar IPC path. The sidecar client could accumulate unbounded stdout bytes before parsing JSON (F12). The rerank-sidecar ledger write used predictable temp file names based on PID and timestamp, enabling symlink pre-creation attacks (F13). The sidecar worker had no line length or input array cap before JSON parsing, allowing unbounded allocation (F47).

All three findings were closed in commit `4fbc4098db`. Surgical fixes touched only the cited lines. F12 added a 1MB line cap and 10MB buffer cap to `handleStdout()` with structured error emission and deterministic child termination. F13 replaced the predictable suffix with `crypto.randomBytes(16).toString('hex')` and switched to exclusive-create file semantics. F47 mirrored the 1MB line cap in `sidecar-worker.ts` and added a 500-item input array rejection before allocation. A total of 31 tests across 4 suites were added, covering every overflow scenario with defense-in-depth assertions.

### Added

- `MAX_LINE_BYTES = 1MB` and `MAX_STDOUT_BUFFER_BYTES = 10MB` constants in `sidecar-client.ts`
- `emitDispatchFailure(reason)` helper for structured error reporting on buffer overflow
- Crypto-random temp suffix using `crypto.randomBytes(16).toString('hex')` in `ensure-rerank-sidecar.cjs`
- Exclusive-create ledger write using `openSync(tmp, 'wx')` replacing `writeFileSync`
- `MAX_LINE_BYTES = 1MB` and `MAX_INPUT_ITEMS = 500` constants in `sidecar-worker.ts`
- `__sidecarWorkerTestables` export for direct test access to `parseRequest`
- 31 defense-in-depth tests across 4 suites covering line cap, buffer cap, input array length, symlink-defense scenarios

### Changed

- `handleStdout()` in `sidecar-client.ts`: checks accumulated buffer against `MAX_STDOUT_BUFFER_BYTES` before appending and checks line length against `MAX_LINE_BYTES` before `JSON.parse()`
- `writeLedger` in `ensure-rerank-sidecar.cjs`: now exports `writeLedger` and `readLedger` for test dependency injection
- `parseRequest()` in `sidecar-worker.ts`: validates `input.length` against `MAX_INPUT_ITEMS` before array allocation

### Fixed

- Sidecar client accumulated unbounded stdout bytes before JSON parsing. The 1MB line cap and 10MB buffer cap with structured error and child SIGTERM now bound memory use.
- Ledger writes used PID and timestamp temp suffixes that were guessable by a local attacker. Crypto-random suffix and exclusive-create semantics prevent symlink pre-creation.
- Sidecar worker accepted arbitrarily long stdin lines and arbitrarily large input arrays before allocation. Line and array caps with structured rejection now fail closed.

### Verification

| Check | Command | Result |
|-------|---------|--------|
| Typecheck | `npx tsc --noEmit -p mcp_server/tsconfig.json` | PASSED (exit 0) |
| Sidecar hardening tests | `vitest run .../sidecar-hardening.vitest.ts` | 6/6 PASSED |
| Sidecar worker tests | `vitest run .../sidecar-worker.vitest.ts` | 9/9 PASSED |
| Embedder sidecar tests | `vitest run .../embedder-sidecar.vitest.ts` | 10/10 PASSED |
| F13 temp-file tests | `node run-f13-tests.cjs` | 6/6 PASSED |
| Spec validation | `validate.sh <folder> --strict` | PASSED (0 errors, 0 warnings) |

31 tests across 4 suites, all passing.

### Files Changed

| File | What changed |
|------|--------------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts` | F12 fix: 1MB line cap, 10MB buffer cap, `emitDispatchFailure` helper, child SIGTERM on overflow |
| `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-worker.ts` | F47 fix: 1MB line cap in reader, 500-item input array cap in `parseRequest`, testables export |
| `.opencode/bin/lib/ensure-rerank-sidecar.cjs` | F13 fix: crypto-random temp suffix, exclusive-create `openSync` semantics, `writeLedger`/`readLedger` exports |
| `.opencode/skills/system-spec-kit/mcp_server/tests/embedders/sidecar-hardening.vitest.ts` | 6 new F12 cases for line cap, buffer cap, dispatch failure |
| `.opencode/bin/lib/ensure-rerank-sidecar.vitest.ts` | F13 tests for crypto-random naming and exclusive-create behavior |
| `.opencode/specs/.../001-fix-investigation-p0s-for-resource-exhaustion-and-symlink-attack/decision-record.md` (NEW) | ADR-001 through ADR-004 documenting the cap constants and temp-file strategy |
| `.opencode/specs/.../001-fix-investigation-p0s-for-resource-exhaustion-and-symlink-attack/checklist.md` | F12, F13, F47 rows marked closed with commit and test evidence |

### Follow-Ups

- Monitor the 1MB line cap and 500-item input array cap if future embedding models produce larger per-vector metadata or require larger batch sizes. A configurable override via environment variable may be needed.
- The `ensure-rerank-sidecar.vitest.ts` test file was present at this phase but was later reorganized. Verify test coverage survives any subsequent sidecar retirement refactors.
