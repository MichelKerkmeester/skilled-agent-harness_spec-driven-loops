---
title: "Spec-Kit Advisor Import Decoupling"
description: "Eliminated all direct advisor source imports from the spec-kit MCP server by moving advisor-owned hooks, tests and stress coverage into system-skill-advisor while keeping process-boundary compatibility stubs in spec-kit."
trigger_phrases:
  - "advisor decoupling"
  - "zero advisor imports"
  - "spec-kit advisor isolation"
  - "advisor import cleanup"
  - "system-skill-advisor package extraction"
importance_tier: "important"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-31

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/019-spec-kit-advisor-decoupling` (Level 3)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction`

### Summary

The spec-kit MCP server still contained advisor source imports after the initial advisor extraction, keeping the two packages coupled in-process. All advisor-owned hooks, tests and stress coverage were moved into `system-skill-advisor`. Spec-kit now communicates with the advisor only through local utilities or process-boundary gateways. The advisor test suite passes and no memory test regressions were introduced.

### Added

- Advisor prompt hook implementations for Claude, Codex and Gemini moved into `system-skill-advisor/hooks`.
- Runtime compatibility stubs at the original spec-kit hook paths so existing configurations continue to work without source coupling.
- Advisor-owned unit tests, hook tests, rebuild tests and stress tests relocated into `system-skill-advisor/mcp_server`.

### Changed

- All direct `from.*system-skill-advisor` source imports removed from `system-spec-kit/mcp_server`.
- Advisor schema imports dropped from spec-kit tool input schemas and replaced with local structural types.
- SQLite neutral re-export removed from the spec-kit boundary.
- Skill-label sanitizer localized within spec-kit instead of reaching into advisor utilities.

### Fixed

- Lane-weight sweep fixture paths corrected to reference the current evaluation packets `006-seeded-corpus-evaluation-sweep` and `007-hard-intent-corpus-resweep`.

### Verification

- Exact import audit of `system-spec-kit/mcp_server`: PASS, zero `from.*system-skill-advisor` lines found
- Advisor vitest suite after fixture path fix: PASS, 52 files, 338 passed, 4 skipped
- Memory vitest suite post-change: baseline-red, 114 failed tests, unchanged from pre-change baseline
- Memory regression audit: PASS, zero new failures introduced by decoupling

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-skill-advisor/hooks/` | Created | Advisor prompt hook implementations for Claude, Codex and Gemini |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/` | Created | Advisor-owned unit tests, hook tests and stress coverage |
| `.opencode/skills/system-spec-kit/mcp_server/hooks/` | Modified | Replaced advisor source imports with process-boundary compatibility stubs |
| `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts` | Modified | Dropped advisor schema imports, replaced with local structural types |

### Follow-Ups

- Spec-kit memory full suite remains baseline-red with 114 failed tests. The count is unchanged by decoupling, so those failures are documented and not fixed in this packet.
- The worktree contains unrelated dirty files. Commit staging must include only decoupling-related files and exclude parallel-session drift.
