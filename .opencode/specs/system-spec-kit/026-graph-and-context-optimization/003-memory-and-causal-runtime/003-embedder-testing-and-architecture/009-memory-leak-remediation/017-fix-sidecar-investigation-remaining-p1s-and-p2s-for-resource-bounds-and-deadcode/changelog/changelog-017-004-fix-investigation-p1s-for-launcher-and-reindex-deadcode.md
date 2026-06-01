---
title: "Launcher and Reindex P1 Finding Closure: F15, F49, F105"
description: "Three P1 findings closed across ensure-rerank-sidecar.cjs and reindex.ts: F15 atomic owner-token publication, F49 sidecar child-env allowlist, F105 dead reindex cancellation polling removal."
trigger_phrases:
  - "launcher reindex p1 finding closure"
  - "F15 F49 F105 remediation"
  - "ensure-rerank-sidecar atomic owner token"
  - "sidecar env allowlist fix"
  - "reindex dead cancellation polling removal"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-23

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/017-fix-sidecar-investigation-remaining-p1s-and-p2s-for-resource-bounds-and-deadcode/004-fix-investigation-p1s-for-launcher-and-reindex-deadcode` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/017-fix-sidecar-investigation-remaining-p1s-and-p2s-for-resource-bounds-and-deadcode`

### Summary

The rerank sidecar launcher carried two P1 process-boundary risks. F15 owner-token publication could write a partial token visible to a racing process. F49 spawned the sidecar with blanket parent-environment inheritance, leaking unrelated secrets into the child. The embedder reindex loop also kept F105 dead cancellation-polling branches even though production has no cancellation caller, adding unnecessary DB reads and implying a feature that was never wired.

All three findings were closed with surgical edits and fixture coverage. The launcher now creates owner tokens through an exclusive lock plus a crypto-random temp path with fsync and atomic rename. The sidecar spawn call uses a purpose-built env allowlist instead of spreading the full parent env. The two `runJob` cancellation polls and `getCancellationStatus` helper in `reindex.ts` were deleted, preserving the initial queued-cancellation guard.

### Added

- F15 atomic owner-token creation path in `ensure-rerank-sidecar.cjs` via exclusive lock, fsynced temp-write and atomic rename
- F49 `buildSidecarEnv()` helper that builds a minimal allowlist for the sidecar spawn call
- Two-process concurrent owner-token fixture proving a single stable token survives a launcher race
- F49 env-leakage fixture proving a custom secret is stripped while `PATH` and `SPECKIT_*` pass through
- `decision-record.md` capturing the three ADRs: owner-token write strategy (F15), env allowlist scope (F49), cancellation deletion rationale (F105)

### Changed

- `ensureRerankSidecar()` now calls `buildSidecarEnv()` instead of spreading `process.env` directly into the spawn call

### Fixed

- F15: partial or race-observed owner token eliminated by the exclusive lock plus temp-rename sequence
- F49: sidecar child process no longer inherits unrelated parent env secrets
- F105: dead `getCancellationStatus()` helper and two `runJob` cancellation-polling branches removed from `reindex.ts`

### Verification

| Check | Result |
|-------|--------|
| `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <spec-folder> --strict` after scaffold | PASS |
| `node skills/system-spec-kit/mcp_server/node_modules/vitest/vitest.mjs run bin/lib/ensure-rerank-sidecar.vitest.ts --config vitest.config.bin.ts` from `.opencode/` | PASS. 11 passed. 5 skipped. |
| `node mcp_server/node_modules/vitest/vitest.mjs run mcp_server/tests/embedders/ --config mcp_server/vitest.config.ts` | PASS. 4 files. 40 tests passed. |
| `node mcp_server/node_modules/vitest/vitest.mjs run mcp_server/tests/embedder-reindex.vitest.ts --config mcp_server/vitest.config.ts` | PASS. 4 tests passed. |
| `npm run typecheck --workspace=@spec-kit/mcp-server` | PASS |
| `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <spec-folder> --strict` final | PASS |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/bin/lib/ensure-rerank-sidecar.cjs` | Modified | F15 atomic owner-token write path and F49 child env allowlist |
| `.opencode/bin/lib/ensure-rerank-sidecar.vitest.ts` | Modified | F15 atomic and concurrent owner-token fixtures. F49 env-leakage fixture. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts` | Modified | F105 dead cancellation polling helper and two polling branches deleted |
| `decision-record.md` (NEW) | Created | Three ADRs: owner-token write strategy (F15), env allowlist scope (F49), cancellation deletion rationale (F105) |

### Follow-Ups

- Verify the bin-test path after sidecar coupling removal. The `cd .opencode/skills/system-spec-kit && node node_modules/vitest/vitest.mjs` path referenced in the plan was absent at run time. Equivalent tests ran from `.opencode/` using the installed `skills/system-spec-kit/mcp_server/node_modules/vitest/vitest.mjs`.
- Wire mid-run reindex cancellation when a production caller exists. The initial queued-cancellation guard remains active. Runtime cancellation is unsupported until a real caller is introduced, per ADR-003.
