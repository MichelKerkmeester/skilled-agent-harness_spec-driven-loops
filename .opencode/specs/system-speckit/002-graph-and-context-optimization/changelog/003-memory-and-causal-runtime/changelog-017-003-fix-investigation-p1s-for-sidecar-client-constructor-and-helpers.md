---
title: "Sidecar-Client P1 Fixes: Constructor Split, Helper Consolidation, Response Narrowing"
description: "Seven P1 findings closed in sidecar-client.ts covering constructor option separation, EmbedOptions canonicalization, helper inlining, termination sequencing, response discriminator narrowing, readiness deletion, embed validation flattening."
trigger_phrases:
  - "sidecar-client p1 fixes"
  - "F18 F20 F25 F57 F62 F73 F91"
  - "sidecar constructor split"
  - "sidecar termination grace period"
  - "sidecar response narrowing"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-23

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/017-fix-sidecar-investigation-remaining-p1s-and-p2s-for-resource-bounds-and-deadcode/003-fix-investigation-p1s-for-sidecar-client-constructor-and-helpers` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/017-fix-sidecar-investigation-remaining-p1s-and-p2s-for-resource-bounds-and-deadcode`

### Summary

The sidecar client had accumulated seven P1 findings from the arc 010/001 deep-research pass. Production constructor options blurred with test-only knobs (F18). `EmbedOptions` was defined twice across the embedder layer (F20). Eight trivial single-call helpers indirected the flow without encoding meaningful seams (F25). SIGTERM and SIGKILL sequencing was split across duplicate call sites instead of one grace-period helper (F57). Response handling relied on broad post-parse assertions rather than discriminator narrowing, leaving unknown message types unhandled (F62). `SidecarClient.ready()` had no production callers on the sidecar execution path (F73). The `embed()` validation cascade was deeply nested rather than flat (F91).

All seven findings closed in commit `fcbfd89386`. `sidecar-client.ts` received surgical edits for each finding. `execution-router.ts` was narrowed to import the canonical `EmbedOptions`. A new `sidecar-client.testables.ts` fixture enforces the F18 production/test boundary at compile time. `sidecar-hardening.vitest.ts` gained F57 grace-period sequencing and F62 unknown-discriminator runtime fixtures. Vitest passed 40 tests across 4 files. Typecheck and alignment drift checks both exited clean.

### Added

- `SidecarClientTestOptions` interface and constructor overload in `sidecar-client.ts` isolating test-only knobs from the production `SidecarClientOptions` surface (F18)
- `sidecar-client.testables.ts` (NEW) with a negative compile-time fixture confirming test options cannot be assigned to the production type
- F57 grace-period sequencing fixture in `sidecar-hardening.vitest.ts` covering SIGTERM followed by SIGKILL after the explicit `gracePeriodMs` window
- F62 unknown-discriminator fixture in `sidecar-hardening.vitest.ts` verifying structured `SidecarClientError` rejection on unrecognised response types
- `validateEmbedInput()` single-call validation helper flattening the `embed()` cascade (F91)

### Changed

- `sidecar-client.ts` SIGTERM/SIGKILL grace sequencing consolidated into one `terminateWithGrace(gracePeriodMs)` helper (F57). Previously spread across duplicate signal/exit call sites inside `terminateChild()`.
- `handleResponseLine()` in `sidecar-client.ts` now narrows on the response discriminator field before dispatch. Unknown `type` values reject the matching pending request with a structured `SidecarClientError` rather than passing a broad runtime assertion (F62).
- Eight trivial single-call helpers removed from `sidecar-client.ts`. Only meaningful validation, default, env, termination seams were kept (F25).
- `execution-router.ts` now imports the canonical `EmbedOptions` from `sidecar-client.ts` instead of defining its own duplicate (F20).

### Fixed

- Production `SidecarClientOptions` type no longer accepts test-only constructor knobs at compile time. Previously both options shapes shared one interface and were distinguished only by a runtime assertion inside the constructor (F18).
- Duplicate `EmbedOptions` interface definition removed from `execution-router.ts`, eliminating a type-drift risk between the two files (F20).
- `SidecarClient.ready()` deleted. The sidecar execution router uses `Omit<EmbedderAdapter, 'ready'>` so the method had no production callers and was a dead-code surface (F73).

### Verification

| Command | Exit | Notes |
|---------|------|-------|
| `cd .opencode/skills/system-spec-kit && node mcp_server/node_modules/vitest/vitest.mjs run mcp_server/tests/embedders/ --config mcp_server/vitest.config.ts` | 0 | 4 files. 40 tests passed. Includes F57 and F62 runtime fixtures. |
| `cd .opencode/skills/system-spec-kit && npm run typecheck --workspace=@spec-kit/mcp-server` | 0 | `tsc --noEmit --composite false`. F18 negative compile fixture confirmed. |
| `python3 .opencode/skills/sk-code/assets/scripts/verify_alignment_drift.py --root .opencode/skills/system-spec-kit/mcp_server/lib/embedders` | 0 | OpenCode alignment drift check passed. |
| `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <packet> --strict` | 0 | Strict validation passed after final docs update. |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts` | Modified | F18 constructor overload. F20 canonical `EmbedOptions` export. F25 trivial helpers removed. F57 `terminateWithGrace` helper. F62 discriminator narrowing. F73 `ready()` deleted. F91 `validateEmbedInput` added. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/execution-router.ts` | Modified | F20 import of canonical `EmbedOptions` from sidecar-client. No behavior change. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.testables.ts` | Created (NEW) | F18 compile-time production/test boundary fixture. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/embedders/sidecar-hardening.vitest.ts` | Modified | F57 grace-period sequencing test. F62 unknown-discriminator rejection test. `ready()` test dependence removed. |

### Follow-Ups

- Address remaining P2 findings in `execution-router.ts` that are outside this packet scope. Only the F20 duplicate `EmbedOptions` definer changed here.
- The `EmbedderAdapter` shared contract still includes `ready()` for registry adapters. A follow-on packet should evaluate whether the registry adapter surface also warrants removal or a separate `ready()` contract.
