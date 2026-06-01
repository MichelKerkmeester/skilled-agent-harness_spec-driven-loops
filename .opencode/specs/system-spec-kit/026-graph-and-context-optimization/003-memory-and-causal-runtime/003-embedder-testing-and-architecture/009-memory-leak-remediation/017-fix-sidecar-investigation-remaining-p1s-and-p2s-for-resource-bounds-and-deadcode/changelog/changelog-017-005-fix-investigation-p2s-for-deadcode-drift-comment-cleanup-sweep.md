---
title: "Phase 017-005: Investigation P2 Deadcode Drift and Comment Cleanup Sweep"
description: "34 of 68 P2 cleanup findings closed across seven embedder surfaces. Dead barrel exports, stale comments, single-call helper noise, duplicate row-shape conversion and type drift removed without altering runtime behavior. 34 behavior-changing findings documented as deferred."
trigger_phrases:
  - "p2 deadcode cleanup sweep"
  - "embedder comment cleanup"
  - "68 p2 findings embedder"
  - "sidecar cleanup deferred"
  - "reindex barrel cleanup"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-23

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/017-fix-sidecar-investigation-remaining-p1s-and-p2s-for-resource-bounds-and-deadcode/005-fix-investigation-p2s-for-deadcode-drift-comment-cleanup-sweep` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/017-fix-sidecar-investigation-remaining-p1s-and-p2s-for-resource-bounds-and-deadcode`

### Summary

Arc 010/001 had recorded 68 P2 cleanup findings across embedder module surfaces. The findings mixed safe static cleanup with behavior-changing hardening requests that required separate hardening packets. A surgical sweep was needed to close non-behavioral P2s without touching runtime policy, public response shapes or security posture.

34 of 68 findings were closed across six batches covering `reindex.ts`, `sidecar-client.ts`, `ensure-rerank-sidecar.cjs`, `execution-router.ts`, `sidecar-worker.ts`, `index.ts` and `schema.ts`. Changes removed dead barrel exports, stale comment dividers, single-call helper chains, duplicate row-shape conversion and accumulated type drift. The remaining 34 findings were documented as deferred with explicit rationale covering env policy, signal handling, filesystem durability, credential cache, public response shape and test-only API constraints.

### Added

- None. Cleanup-only phase with no net-new files or APIs.

### Changed

- `reindex.ts`: job-row aliases, status SQL, shard metadata helpers and comment dividers cleaned up across 12 closed findings.
- `sidecar-client.ts`: public JSDoc and unused type exports cleaned up across 5 closed findings.
- `ensure-rerank-sidecar.cjs`: unused exports pruned and timeout parser split across 2 closed findings.
- `execution-router.ts`: execution-policy type export and provider normalization cleaned up across 3 closed findings.
- `sidecar-worker.ts`: shared input type, request envelope validation and dead fallback path cleaned up across 4 closed findings.
- `index.ts` and `schema.ts`: barrel stale comments, unused re-exports and single-call helper chain cleaned up across 8 closed findings.

### Fixed

- Dead barrel re-exports in `index.ts` that exposed internal types no longer used by any consumer.
- Stale comment dividers in `reindex.ts` referencing removed phases and superseded implementation notes.
- Duplicate row-shape conversion in `reindex.ts` that converted the same shape twice on every call.
- Type drift in `execution-router.ts` where the exported policy type had diverged from the runtime value.

### Verification

| Check | Result |
|-------|--------|
| `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh` after scaffold | PASS, exit 0 |
| `cd .opencode/skills/system-spec-kit && node mcp_server/node_modules/vitest/vitest.mjs run mcp_server/tests/embedders/ --config mcp_server/vitest.config.ts` | PASS on rerun, 4 files and 40 tests. First run hit F48 random-id monotonic flake. |
| `cd .opencode && node skills/system-spec-kit/mcp_server/node_modules/vitest/vitest.mjs run bin/lib/ensure-rerank-sidecar.vitest.ts --config vitest.config.bin.ts` | PASS, 1 file, 11 passed, 5 skipped. |
| `cd .opencode/skills/system-spec-kit && npm run typecheck --workspace=@spec-kit/mcp-server` | PASS, exit 0 |
| `python3 .opencode/skills/sk-code/assets/scripts/verify_alignment_drift.py --root .opencode/skills/system-spec-kit/mcp_server/lib/embedders` | PASS, 12 files scanned, 0 findings. |
| `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh` after final docs | PASS, exit 0 |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts` | Modified | Job-row alias cleanup, status SQL cleanup, shard metadata helper, comment divider removal across 12 closed findings. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/execution-router.ts` | Modified | Execution-policy type export and provider normalization cleanup across 3 closed findings. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/index.ts` | Modified | Stale comments and unused barrel re-exports removed across part of 8 closed findings. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/schema.ts` | Modified | Single-call helper chain inlined across part of 8 closed findings. |

### Follow-Ups

- Address the 34 deferred findings. These require dedicated hardening packets covering env policy, signal handling, filesystem durability, credential cache, public response shape and test-only API constraints.
- Investigate the F48 random-id monotonic flake observed on the first embedder vitest run to determine whether it is a test infrastructure issue or a timing race in the production path.
- Resolve the CJS test command path discrepancy. The literal command in the spec references a `node_modules/vitest/vitest.mjs` path that does not exist in the current checkout.
