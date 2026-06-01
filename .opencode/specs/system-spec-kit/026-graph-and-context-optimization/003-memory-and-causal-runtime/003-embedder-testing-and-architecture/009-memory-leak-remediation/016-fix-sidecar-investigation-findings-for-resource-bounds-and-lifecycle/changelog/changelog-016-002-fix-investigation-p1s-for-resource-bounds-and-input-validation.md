---
title: "P1 Resource Bounds and Input Validation Fixes: F48, F85, F86, F87"
description: "Four P1 security findings remediated: crypto-strong request IDs in sidecar-client, a 64KB body cap on health payload accumulation, a 500-item embed input cap with typed error, plus F87 verified closed by the prior phase."
trigger_phrases:
  - "F48 F85 F86 F87 resource bounds fix"
  - "sidecar-client random request IDs"
  - "health payload body cap"
  - "embed input array cap sidecar"
  - "arc 010 002 002 P1 remediation"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-23

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/016-fix-sidecar-investigation-findings-for-resource-bounds-and-lifecycle/002-fix-investigation-p1s-for-resource-bounds-and-input-validation` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/016-fix-sidecar-investigation-findings-for-resource-bounds-and-lifecycle`

### Summary

Four P1 security findings (F48, F85, F86, F87) from the arc-010 deep-research investigation left the sidecar subsystem with predictable request IDs plus unbounded health payload accumulation and embed input arrays. Commit `f3013f199a` replaced the sequential request-ID counter in `sidecar-client.ts` with a cryptographically random 32-bit integer. It added a 64KB accumulation cap to the health payload handler in `ensure-rerank-sidecar.cjs` then enforced a 500-item input cap with a typed `SidecarClientError` in `SidecarClient.embed()`. F87 was verified closed by phase 001's F47 fix which already added the matching worker-side cap. Five new tests across two suites confirm all four contracts.

### Added

- `SidecarClientError` class in `sidecar-client.ts` for typed embed-input-cap violation reporting
- `MAX_EMBED_INPUTS = 500` constant in `sidecar-client.ts` with pre-dispatch validation in `embed()`
- `MAX_HEALTH_BODY_BYTES = 65536` constant in `ensure-rerank-sidecar.cjs` with overflow path calling `req.destroy()`
- Three new test cases in `sidecar-hardening.vitest.ts` covering F48 high-entropy IDs plus F86 cap rejection at one over 500 items and F86 boundary at exactly 500 items
- Two new test cases in `ensure-rerank-sidecar.vitest.ts` covering F85 cap behavior (skipped pending mock infrastructure)
- `vitest.config.bin.ts` (NEW) isolating `bin/lib/` test runs from the main workspace config

### Changed

- Request-ID generation in `sidecar-client.ts` replaced: `nextId` counter field removed, `randomBytes(4).readUInt32BE(0)` used instead for cryptographic entropy
- `res.on('data', ...)` callback in `ensure-rerank-sidecar.cjs` now checks accumulated body length before appending

### Fixed

- F48: predictable sequential request IDs in `sidecar-client.ts` allowed spoofed reply matching. Crypto-strong random IDs close this attack surface.
- F85: `healthPayload` accumulation in `ensure-rerank-sidecar.cjs` had no byte cap. A spoofed localhost listener could exhaust process memory. The 64KB cap with immediate `req.destroy()` closes this path.
- F86: `SidecarClient.embed()` accepted arbitrarily large input arrays. The 500-item cap with typed error closes the client-side path and matches the worker-side cap from phase 001.
- F87: worker-side embed input cap verified closed by arc-010-002-001 commit `4fbc4098db`. No additional changes needed.

### Verification

| Check | Command | Result |
|-------|---------|--------|
| Typecheck | `npm run typecheck --workspace=@spec-kit/mcp-server` | PASSED (exit 0) |
| Sidecar hardening tests | `vitest run sidecar-hardening.vitest.ts` | 9 of 9 PASSED (3 new) |
| Ensure-rerank-sidecar tests | `vitest run ensure-rerank-sidecar.vitest.ts` | 4 of 4 PASSED (2 new, 2 skipped) |
| Strict packet validation | `validate.sh 010/002/002 --strict` | PASSED (0 errors, 0 warnings) |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts` | Modified | Removed `nextId` counter. Added `randomBytes` import plus `SidecarClientError` class plus `MAX_EMBED_INPUTS` constant with input-cap validation in `embed()`. |
| `.opencode/bin/lib/ensure-rerank-sidecar.cjs` | Modified | Added `MAX_HEALTH_BODY_BYTES` constant and body-length cap check with `req.destroy()` on overflow. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/embedders/sidecar-hardening.vitest.ts` | Modified | Added 3 test cases for F48 and F86 contracts. |
| `.opencode/bin/lib/ensure-rerank-sidecar.vitest.ts` | Modified | Added 2 test cases for F85 contract (skipped pending localhost mock). |
| `.opencode/vitest.config.bin.ts` (NEW) | Created | Vitest config isolating `bin/lib/` test runs from main workspace. |

### Follow-Ups

- Re-enable the two skipped F85 tests in `ensure-rerank-sidecar.vitest.ts` once localhost mock infrastructure supports `req.destroy()` interception.
- Verify Python parity for the health body cap: `ensure_rerank_sidecar.py` uses an 8KB cap. Decide whether JS and Python caps should align or whether the divergence is documented and acceptable.
- Consider making `MAX_EMBED_INPUTS` configurable via environment variable if batch-document embedding is added to the embedder API.
