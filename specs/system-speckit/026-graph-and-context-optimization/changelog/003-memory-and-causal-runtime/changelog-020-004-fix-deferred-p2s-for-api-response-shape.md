---
title: "Sidecar-Client API Response Shape Closure: F9 F32 F39 F97 F99"
description: "Five deferred P2 findings closed on the sidecar-client API surface: test-only export separation via testables module, canonical camelCase worker info and dimension fields with deprecated one-release aliases, deprecation warnings with discriminator-narrowed pending-map resolution."
trigger_phrases:
  - "020 004 api response shape"
  - "F9 F32 F39 F97 F99 sidecar-client"
  - "sidecar response aliases camelCase"
  - "buildSidecarEnv testables split"
  - "sidecar pending-map discriminator narrowing"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-23

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/020-fix-investigation-deferred-p2s-for-behavior-and-api-changes/004-fix-deferred-p2s-for-api-response-shape` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/020-fix-investigation-deferred-p2s-for-behavior-and-api-changes`

### Summary

Five deferred P2 findings on the `sidecar-client.ts` API surface were confirmed present and then closed. F9 exposed a test-only environment helper as a production named export. F32, F39 and F97 used legacy snake_case or abbreviated response field names without a canonical camelCase alternative. F99 resolved pending-map entries through an unsafe cast that bypassed discriminator checks.

All five findings were closed in commit `fa30304726`. The production module no longer exports `buildSidecarEnv`. Test access was rerouted through `sidecar-client.testables.ts`. Canonical camelCase fields (`lastRequestAt`, `idleForMs`, `requestCount`, `dimensions`) were added alongside their deprecated legacy aliases, with a once-per-process stderr warning on alias reads. The pending-map cast was replaced with `unknown`-typed map entries narrowed through `isPendingRequest()`. Regression fixtures in `sidecar-hardening.vitest.ts` lock each finding closed.

### Added

- Canonical camelCase worker info fields `lastRequestAt`, `idleForMs` and `requestCount` on the sidecar response object
- Canonical `dimensions` field on `SidecarClient` alongside the deprecated `dim` alias
- Deprecation getter aliases for legacy response field names that warn once per process on first read
- `isPendingRequest()` discriminator function for narrowing unknown pending-map entries
- F9/F32/F39/F97/F99 regression fixtures in `sidecar-hardening.vitest.ts` covering both canonical and legacy access paths

### Changed

- `sidecar-client.testables.ts` now re-exports `buildSidecarEnv` as the sole test-access surface for that helper
- Pending-map entries are now typed as `unknown` with discriminator narrowing rather than resolved through an unsafe cast

### Fixed

- F9: `buildSidecarEnv` was exported from the production module. It is now exported only through `sidecar-client.testables.ts`.
- F32 and F39: Worker info response fields used snake_case names. Canonical camelCase names are now present on every response object.
- F97: The `dim` shorthand for embedding dimensions had no canonical alternative. `dimensions` is now the canonical field. `dim` remains as a one-release deprecated alias.
- F99: Malformed pending-map entries could reach an unsafe cast path. They now reject with a structured `SidecarClientError` at the discriminator check.

### Verification

| Check | Result |
|-------|--------|
| Scaffold strict validation | PASS: errors 0, warnings 0, exit 0 |
| Embedders vitest (4 files, 47 tests) | PASS: exit 0 |
| MCP server typecheck | PASS: exit 0 |
| Final strict validation | PASS: errors 0, warnings 0, exit 0 |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts` | Modified | Removed `buildSidecarEnv` production export. Added canonical camelCase response fields. Added deprecated alias getters with once-per-process warning. Replaced unsafe pending cast with discriminator narrowing. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.testables.ts` | Modified | Re-exports `buildSidecarEnv` as the test-only access surface. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/embedders/sidecar-hardening.vitest.ts` | Modified | Added F9, F32, F39, F97, F99 regression fixtures covering production non-export, canonical and alias field presence, deprecation warnings and malformed pending entry rejection. |

### Follow-Ups

- Remove legacy `dim`, `last_request_at`, `idle_for_ms` and `request_count` aliases after the one-release compatibility window.
