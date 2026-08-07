

---
title: "Changelog: 10-iter P2 cleanup"
description: "18 P2 findings fixed in code, 3 marked not applicable, and 7 deferred to named follow-on packets."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "important"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-31

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/018-fix-followup-p2-findings-for-package-extraction` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction`

### Summary

The review identified 28 P2 findings across architecture, correctness, robustness, testing, security, performance, documentation, compatibility, and maintainability. This packet fixed 18 findings in code and config, classified 3 as not applicable against the current state, and named 7 follow-on packets for findings that exceed the surgical limit of this dispatch.

### Added

- Test coverage for all eight dispatch routes and runtime env parity.

### Changed

- Launcher artifact freshness checks now source file modification times instead of opaque readiness flags.
- Fatal server startup path now calls shutdownAdvisor on unclean exit.
- Chokidar diagnostics now report every path checked when the watcher lookup fails.
- SQLite open errors now return a named SQLITE_CHECK_FAILED code instead of a generic failure.
- Scorer lane matching now indexes once per lane instead of repeatedly.
- Watcher defaults can now be tuned via environment variables.

### Fixed

- dispatchTool and TOOL_DEFINITIONS now live in tools/index.ts, eliminating the server-local duplicate.
- Advisor test fixture helper moved under the advisor package so it no longer imports spec-kit test fixtures.
- semantic-shadow.ts now imports @spec-kit/shared directly, resolving the cross-package boundary.
- Dispatch tests now cover all eight public tools.
- Launcher stale lock recovery Vitest added.
- Launcher stale artifact Vitest added.
- Runtime env parity Vitest added.
- Fusion scorer indexes lane matches once per lane.
- All four runtime configs now expose aligned advisor environment keys.

### Verification

- Advisor Vitest - PASS: 43 files, 299 tests.
- Advisor typecheck - PASS: npm run typecheck.
- Runtime JSON parse - PASS: opencode.json, .claude/mcp.json, .gemini/settings.json.
- Launcher syntax - PASS: node -c .opencode/bin/mk-skill-advisor-launcher.cjs.
- Strict validation - PASS: 018 strict validation returned 0 errors and 0 warnings.

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| Packet docs (spec, plan, tasks, checklist, implementation-summary) | Created | Scoped packet documentation |

### Follow-Ups

- 019-advisor-schema-boundary-contract: A-005 and C-003.
- 020-plugin-bridge-unit-isolation: T-004.
- 021-subprocess-env-whitelist: S-MERGED.
- 022-dfidf-cold-start-cache: P-002.
- 023-parent-doc-drift-refresh: D-001 and D-002.
