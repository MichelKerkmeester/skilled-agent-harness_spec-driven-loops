---
title: "Execution-Router P1 Fixes: Policy Resolution, Dimension Fallback, Shutdown Hooks"
description: "Seven P1 findings closed in execution-router.ts covering production API hygiene, pure resolver boundaries, dimension fallback correctness, signal-hook shutdown semantics, zero-caller readiness method removal."
trigger_phrases:
  - "execution-router p1 fixes"
  - "F6 F31 F52 F53 F58 F61 F74 remediation"
  - "execution router policy resolution"
  - "shutdown hook signal handler fix"
  - "dimension fallback mismatch warning"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-23

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/017-fix-sidecar-investigation-remaining-p1s-and-p2s-for-resource-bounds-and-deadcode/002-fix-investigation-p1s-for-execution-router-policy-and-shutdown-hooks` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/017-fix-sidecar-investigation-remaining-p1s-and-p2s-for-resource-bounds-and-deadcode`

### Summary

`execution-router.ts` accumulated seven P1 defects from an arc 010/001 deep-research investigation. The defects clustered around production API hygiene (a test-only aggregate exported from the production module), impure resolver boundaries (policy logging inside the resolver), dimension fallback dead code with silent mismatches, fire-and-forget signal handler semantics, plus a zero-caller readiness method left in the adapter surface.

All seven findings (F6, F31, F52, F53, F58, F61, F74) were closed in a single surgical commit. The router now exports named internals through a test-only seam, resolves policy purely with logging separated to the caller side, collapses the four-level dimension fallback to two levels with an explicit mismatch warning on stderr, registers shutdown hooks through one shared async handler across all three signals, plus carries no dead readiness API. Fixture coverage was added for every changed behavior.

### Added

- `execution-router.testables.ts`: test-only seam exporting named router internals without a production `__*Testables` aggregate (F6)
- `execution-router.vitest.ts`: six focused fixture tests covering policy resolution, config override, default fallback, mismatch warning, shared signal registration, plus deleted readiness surface (F6, F31, F52, F53, F58, F61, F74)
- Stderr warning on dimension mismatch when the requested provider/model does not match the default startup profile (F61)

### Changed

- `execution-router.ts`: `resolveExecutionPolicy` is now a pure resolver returning a policy value. A new `logPolicyResolution` helper owns the invalid-env warning side effect. (F31)
- `execution-router.ts`: `resolveDimensions` collapsed from four levels to two: explicit/configured dimensions or the default startup profile. Dead provider/model equality branch removed. (F52)
- `execution-router.ts`: shutdown hook registration uses one shared async handler registered across `[SIGINT, SIGTERM, SIGHUP]` with `forEach`. Previously registered handlers individually with fire-and-forget void semantics. (F53, F58)

### Fixed

- Production module exported `__embedderExecutionRouterTestables` aggregate, leaking test scaffolding into the runtime bundle. Test imports now target `execution-router.testables.ts`. (F6)
- Policy resolver emitted a side-effect warning on invalid env, making it impure and hard to unit-test independently. Separated to a logging helper at the call site. (F31)
- Dimension fallback had a dead third level whose provider/model equality check returned the same default as the final fallback. Collapsed to remove the unreachable branch. (F52)
- Mismatch between requested provider/model and the default startup profile was silently ignored. Now emits a stderr warning with provider, model, dimension context. (F61)
- Signal handlers were registered with fire-and-forget `void` semantics, giving callers a false impression that cleanup was awaited. Handler now awaits `shutdownAllSidecars()` before re-signaling. (F53, F58)
- `DirectProviderAdapter.ready()` had zero production callers. Removed to eliminate dead surface area. (F74)

### Verification

| Check | Result |
|-------|--------|
| Scaffold strict validation | PASS: `validate.sh <packet> --strict` exit 0 before source edits |
| Embedder vitest | PASS: `node mcp_server/node_modules/vitest/vitest.mjs run mcp_server/tests/embedders/ --config mcp_server/vitest.config.ts`. 4 files, 39 tests |
| Router-sidecar regression vitest | PASS: same runner including `mcp_server/tests/embedder-sidecar.vitest.ts`. 5 files, 49 tests |
| MCP server typecheck | PASS: `npm run typecheck --workspace=@spec-kit/mcp-server` exit 0 |
| Final strict validation | PASS: `validate.sh <packet> --strict` exit 0 |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/execution-router.ts` | Modified | Pure policy resolver. Collapsed dimension fallback with mismatch warning. Shared async signal handler. Deleted readiness method. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/execution-router.testables.ts` (NEW) | Created | Test-only seam exporting named router internals without production aggregate |
| `.opencode/skills/system-spec-kit/mcp_server/tests/embedders/execution-router.vitest.ts` (NEW) | Created | Six fixture tests for F6, F31, F52, F53, F58, F61, F74 |
| `.opencode/skills/system-spec-kit/mcp_server/tests/embedder-sidecar.vitest.ts` | Modified | Import updated to reference new test-only seam instead of production module export |

### Follow-Ups

- Signal cleanup remains process-lifecycle best effort. The shared handler awaits `shutdownAllSidecars()` before re-signaling, but callers needing deterministic shutdown should call and await `shutdownAllSidecars()` directly rather than relying on signal interception.
