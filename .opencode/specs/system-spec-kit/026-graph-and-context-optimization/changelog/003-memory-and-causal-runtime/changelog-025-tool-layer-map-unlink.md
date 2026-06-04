---
title: "TOOL_LAYER_MAP Drift Fix (memory_causal_unlink L6)"
description: "Added 'memory_causal_unlink' to the L6 (Analysis) tools array in lib/architecture/layer-definitions.ts so the derived TOOL_LAYER_MAP gains the entry, restoring registry/map parity and turning the 2 failing layer-definitions vitest tests green (41 passed). One-line change, tsc clean."
trigger_phrases:
  - "tool layer map drift fix"
  - "memory_causal_unlink missing layer"
  - "layer-definitions vitest failing"
  - "L6 analysis causal unlink"
  - "025-tool-layer-map-unlink"
importance_tier: "normal"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-04

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/025-tool-layer-map-unlink` (Level 1)

### Summary

`memory_causal_unlink` was a registered MCP tool (added by commit `deee30b319`, defined in `tool-schemas.ts` with the description prefix `[L6:Analysis]`), but it was missing from the `TOOL_LAYER_MAP` source in `lib/architecture/layer-definitions.ts`. The map is derived by iterating `LAYER_DEFINITIONS[*].tools`, and the tool name was never added to any layer's `tools` array, so it had no layer entry. This broke two parity tests on the clean baseline: "every registered tool has a layer definition" and "tool definition prefixes stay aligned with TOOL_LAYER_MAP."

This packet added `'memory_causal_unlink'` to the L6 (Analysis) `tools` array, immediately after its causal siblings `'memory_causal_link'` and `'memory_causal_stats'`, keeping the causal trio together. The target layer was confirmed in code first, not assumed. One-line change, tsc clean. Committed as `23ba7ea08e`.

### Added

None. Single one-line addition to an existing array.

### Changed

- `lib/architecture/layer-definitions.ts`: `'memory_causal_unlink'` added to the L6 (Analysis) layer's `tools` array, immediately after `'memory_causal_stats'`, so the derived `TOOL_LAYER_MAP['memory_causal_unlink']` now resolves to `'L6'`, matching the tool's registered `[L6:Analysis]` description prefix.

### Fixed

- Two `layer-definitions.vitest.ts` parity tests that failed on the clean baseline ("every registered tool has a layer definition" expecting `['memory_causal_unlink']` to equal `[]`, and "tool definition prefixes stay aligned with TOOL_LAYER_MAP" expecting `'L6'` against an undefined map value). Both now pass.

### Verification

| Check | Result |
|-------|--------|
| Registered prefix confirmed in code | PASS (`tool-schemas.ts` `memoryCausalUnlink` description starts with `[L6:Analysis]`) |
| `vitest run tests/layer-definitions.vitest.ts` | PASS (41 passed, 0 failed, was 2 failed on baseline) |
| `tsc --noEmit` | PASS (exit 0) |
| Scope lock | PASS (only `lib/architecture/layer-definitions.ts` plus packet docs changed) |
| `validate.sh --strict` | PASS (Exit 0) |

### Files Changed

| File | What changed |
|------|--------------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts` | Added `'memory_causal_unlink'` to the L6 `tools` array beside its causal siblings |

### Follow-Ups

- No new tests added. The two pre-existing parity tests already cover this drift and now pass. The fix relies on the existing registry/map alignment assertions to prevent regression.
- Single-tool fix. This packet only closes the `memory_causal_unlink` gap, and no other layer or tool was reviewed for drift.
