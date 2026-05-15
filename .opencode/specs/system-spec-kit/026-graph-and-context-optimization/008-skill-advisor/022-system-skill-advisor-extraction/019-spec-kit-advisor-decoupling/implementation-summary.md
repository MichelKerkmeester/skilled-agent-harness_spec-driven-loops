# Implementation Summary

## Current State

Implementation work is complete for the import-isolation slice. Repository-level completion is blocked because full package test suites are not green.

## Changed

- Moved advisor prompt hooks to `system-skill-advisor/hooks/{claude,codex,gemini}`.
- Added spec-kit process stubs at the previous hook locations.
- Added advisor hook build coverage.
- Moved advisor-owned unit tests, hook tests, rebuild tests, and stress tests to advisor.
- Added `vitest.stress.config.ts` for advisor stress smoke.
- Removed spec-kit advisor schema imports and advisor tool schema entries.
- Removed or localized neutral utility seams.
- Replaced residual spec-kit advisor type imports with structural local types.
- Kept the plugin bridge as a process-boundary gateway.

## Evidence

- Exact import audit: zero `from.*system-skill-advisor` lines.
- Broad source import audit: no advisor source imports remain in spec-kit MCP tree; only plugin gateway imports remain.
- Advisor typecheck: pass.
- Spec-kit typecheck: pass.
- Advisor build: pass.
- Spec-kit build: pass.
- Advisor moved unit tests: 9 files passed, 39 tests passed, 4 skipped.
- Advisor stress smoke: 19 files passed, 57 tests passed.
- Spec-kit targeted tests: unit target passed; stress target passed with 17 tests.
- Hook smoke: advisor compiled Codex hook emitted `Advisor: live; use sk-doc 0.92/0.12 pass.`
- `opencode mcp list`: 6/6 connected.

## Blockers

- Full advisor `npm test` fails:
  - `tests/legacy/advisor-graph-health.vitest.ts` reports untracked `cli-devin` metadata paths missing.
  - `tests/scorer/lane-weight-sweep.vitest.ts` looks for old `013-skill-advisor-semantic-lane/...` packet paths after current spec reorganization.
- Full spec-kit `npm test` was previously red with broad historical failures outside this packet.

## Next Safe Action

Fix or explicitly defer the unrelated full-suite blockers, then rerun full suites, strict validates, commit, and push.
