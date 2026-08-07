

---
title: "Plugin bridge unit test isolation"
description: "Behavioral tests for the plugin bridge ran as subprocess calls, making logic failures slow to diagnose and coupling unit coverage to MCP subprocess availability. The tests now use direct imports with mocked native dependencies while one subprocess smoke test preserves the JSON envelope contract."
trigger_phrases:
  - "plugin bridge unit isolation"
  - "bridge subprocess smoke"
  - "018 plugin bridge follow-on"
  - "spec kit skill advisor bridge"
  - "plugin bridge vitest"
importance_tier: "important"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-31

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/022-plugin-bridge-unit-test-isolation` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction`

### Summary

Behavioral tests for the plugin bridge ran as subprocess calls, making logic failures slow to diagnose and coupling unit coverage to MCP subprocess availability. The tests now use direct imports with mocked native dependencies while one subprocess smoke test preserves the JSON envelope contract. Unit test iteration is faster and logic failures surface directly rather than at process boundaries.

### Added

- Plugin bridge unit tests that use direct imports and mocked native advisor dependencies instead of spawning a subprocess for every assertion.

### Changed

- Bridge behavioral tests refactored from subprocess calls to direct unit test imports with fakes for native modules.
- One subprocess smoke test retained to validate the stdin/stdout JSON envelope contract.

### Fixed

- None.

### Verification

- Focused packet tests PASS: relevant focused Vitest and syntax checks passed.
- Full advisor Vitest PASS: 54 files passed, 371 tests passed, 4 skipped.
- Strict validation PASS: all new packet folders passed strict validation.

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-spec-kit/mcp_server/plugin_bridges/spec-kit-skill-advisor-bridge.mjs` | Modified | Export bridge helpers and guard the CLI entrypoint. |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/compat/plugin-bridge.vitest.ts` | Modified | Use direct imports and mocked native dependencies. |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/compat/plugin-bridge-smoke.vitest.ts` | Modified | Keep one subprocess smoke for the JSON envelope. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/022-plugin-bridge-unit-test-isolation` | Created | Packet docs (spec, plan, tasks, checklist, implementation-summary). |

### Follow-Ups

- None recorded.
