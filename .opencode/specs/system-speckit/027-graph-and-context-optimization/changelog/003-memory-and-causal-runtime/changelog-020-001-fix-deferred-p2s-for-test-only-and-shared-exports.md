---
title: "Test-Only Barrel Export Cleanup for F44 and F109"
description: "Two deferred P2 findings closed by moving test consumers from barrel imports to direct shared-module imports and removing the now-unused barrel re-exports from the mcp-server embedders barrel."
trigger_phrases:
  - "F44 F109 barrel export cleanup"
  - "test-only barrel export cleanup"
  - "listSupportedDimensions EmbedderManifest barrel"
  - "020-001 deferred P2 closure"
  - "embedder barrel export removal"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-23

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/020-fix-investigation-deferred-p2s-for-behavior-and-api-changes/001-fix-deferred-p2s-for-test-only-and-shared-exports` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/020-fix-investigation-deferred-p2s-for-behavior-and-api-changes`

### Summary

Two P2 findings (F44 and F109) had been deferred because the mcp-server embedders barrel exposed `listSupportedDimensions` and `EmbedderManifest` through a public surface that only test files consumed. A grep-based consumer inventory confirmed zero live production importers for both symbols. Test consumers in `embedder-registry.vitest.ts` were refactored to direct shared-module imports. The barrel re-exports were then deleted. Typecheck passed after each edit stage. The full embedders vitest suite of 4 files and 40 tests passed with no regressions. Final strict spec validation exited 0.

### Added

- `decision-record.md` recording no-live-consumer ADR for the barrel export collapse

### Changed

- `mcp_server/lib/embedders/registry.ts` now uses a named export for `listSupportedDimensions` instead of a wildcard re-export
- `mcp_server/lib/embedders/index.ts` no longer re-exports `EmbedderManifest` or `listSupportedDimensions`
- `mcp_server/tests/embedder-registry.vitest.ts` imports `listSupportedDimensions` from `@spec-kit/shared/embeddings/registry.js` and `EmbedderManifest` from `@spec-kit/shared/embeddings/types.js`

### Fixed

- F44: `listSupportedDimensions` barrel re-export removed after confirming all consumers were test-only
- F109: `EmbedderManifest` barrel re-export removed after confirming all consumers were test-only

### Verification

| Check | Result |
|-------|--------|
| Scaffold strict validate before source edits (`validate.sh --strict`) | PASS, exit 0 |
| Typecheck after test import refactor (`npm run typecheck --workspace=@spec-kit/mcp-server`) | PASS, exit 0 |
| Typecheck after barrel deletion | PASS, exit 0 |
| Embedders vitest (`vitest run mcp_server/tests/embedders/`) | PASS, 4 files / 40 tests |
| Final strict validate | PASS, exit 0 |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `mcp_server/lib/embedders/index.ts` | Modified | Removed `EmbedderManifest` and `listSupportedDimensions` barrel re-exports |
| `mcp_server/lib/embedders/registry.ts` | Modified | Replaced wildcard re-export of `listSupportedDimensions` with named export |
| `mcp_server/tests/embedder-registry.vitest.ts` | Modified | Test imports refactored from barrel to direct shared-module paths |

### Follow-Ups

- Commit is intentionally left to the parent agent.
- The broad `rg -l` inventory includes sibling `system-skill-advisor` shared-embedder shim references. Those are outside this packet and not affected by the `system-spec-kit` barrel cleanup.
