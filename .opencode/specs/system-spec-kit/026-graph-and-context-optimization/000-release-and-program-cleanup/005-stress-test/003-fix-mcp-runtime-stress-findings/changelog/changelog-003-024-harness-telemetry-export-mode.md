---
title: "Harness Telemetry Export Mode"
description: "The search-quality harness now carries optional telemetry through runner output, channel captures, per-case results. Opt-in JSONL export ships. Existing fixture-only tests stay unchanged."
trigger_phrases:
  - "harness telemetry export mode"
  - "search quality telemetry export"
  - "SearchDecisionEnvelope harness"
  - "telemetryExportPath harness option"
  - "stress test harness JSONL export"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-29

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/024-harness-telemetry-export-mode` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings`

### Summary

The search-quality harness had no native slot for `SearchDecisionEnvelope`, decision-audit rows or shadow rows. The v1.0.3 stress test worked around this by composing a packet-local wrapper that imported production builders directly, duplicating code and masking differences between harness and runtime emission.

The harness was extended so a runner can return optional telemetry fields on `SearchQualityChannelOutput`. Those fields propagate through `SearchQualityChannelCapture` and aggregate into `SearchQualityCaseResult.telemetry`. A new `telemetryExportPath` option on `runSearchQualityHarness` appends per-case rows to three sibling JSONL files (envelopes, audit, shadow) without any packet-local wrapper. All existing fixture-only tests remained green.

### Added

- Optional `telemetry` field on `SearchQualityChannelOutput` accepting `envelope`, `auditRows` and `shadowRows`
- `telemetryExportPath` runner option that writes three sibling JSONL files per run
- `harness-telemetry-export.vitest.ts` covering in-memory preservation, JSONL export shape and row counts. No-export behavior with cleanup in `afterEach` is also verified.

### Changed

- `SearchQualityChannelCapture` now carries the `telemetry` object copied from runner output
- `SearchQualityCaseResult.telemetry` now aggregates per-case envelope and audit rows
- `harness.ts` propagates telemetry through channel captures and case results using type-only imports for compile-time shape safety

### Fixed

- Stress packets no longer need packet-local wrappers to produce `SearchDecisionEnvelope`, decision-audit or shadow samples. The harness now provides a native path.

### Verification

| Check | Result |
|-------|--------|
| `npx vitest run stress_test/search-quality/harness-telemetry-export.vitest.ts` | PASS: 1 file, 3 tests |
| `find stress_test/search-quality -name '*.vitest.ts' ! -name 'harness-telemetry-export.vitest.ts' -print \| sort \| xargs npx vitest run` | PASS: 14 existing files, 24 existing tests |
| `npx vitest run stress_test/search-quality/` | PASS: 15 files, 27 tests |
| `npx tsc --noEmit` | PASS: exit 0 |
| `validate.sh ... --strict` | PASS: strict validation exit 0 |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-spec-kit/mcp_server/stress_test/search-quality/harness.ts` | Modified | Added telemetry types, propagation, per-case aggregation. Opt-in JSONL export added. |
| `.opencode/skills/system-spec-kit/mcp_server/stress_test/search-quality/harness-telemetry-export.vitest.ts` | Created (NEW) | Covers in-memory preservation, JSONL export shape and row counts, no-export behavior |

### Follow-Ups

- Wire the harness to `handleMemorySearch` for live runtime telemetry capture. That connection is PP-1 scope deferred to packet 023.
- Add runner-side envelope builder support so harness callers can construct envelopes without importing production builders directly.
