---
title: "Skill Advisor Package Extraction Phase 017: Fix Deep-Review P1 Findings"
description: "R-004 stale lockdir recovery and S-004 shadow-sink path containment closed surgically. Launcher now detects and removes stale lock directories before waiting. Shadow sink rejects environment-provided paths that escape the workspace root. Vitest regression coverage added for all three behaviors."
trigger_phrases:
  - "R-004 lockdir fix"
  - "S-004 shadow sink containment"
  - "skill advisor P1 remediation"
  - "launcher stale lockdir"
  - "shadow delta path validation"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-15

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/017-fix-deep-review-p1-findings-for-package-extraction` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction`

### Summary

The 10-iteration deep review of the extracted `mk_skill_advisor` server surfaced two P1 edge-case risks. A stale bootstrap lock directory created during a hard crash could block a clean checkout for up to 120 seconds, and the shadow delta sink accepted an environment-controlled path without workspace containment validation, allowing a hostile env variable to write files outside the repository root.

Both findings were closed surgically. The launcher now reads the lock directory mtime and forcibly removes it when it exceeds the staleness threshold before attempting to acquire a fresh lock. Artifact readiness now also checks source mtimes so that stale dist output cannot bypass a rebuild after source changes. The shadow sink validates `SPECKIT_ADVISOR_SHADOW_DELTA_PATH` against the workspace root and returns a structured `written: false` result without creating any file or parent directory when the path escapes containment.

Vitest regression coverage was added for lock recovery, stale artifact detection, and shadow path rejection. All 299 advisor tests pass and the launcher syntax check, runtime config JSON parse, and strict packet validation all returned clean results.

### Added

- Stale lockdir mtime detection and forced removal in `.opencode/bin/mk-skill-advisor-launcher.cjs` before the lock-wait loop runs
- Source-mtime freshness check in `artifactsReady()` so stale dist output fails readiness when any source file is newer than dist
- `launcher-bootstrap.vitest.ts` (NEW) covering stale lock acquisition and stale dist detection
- Workspace-root containment rejection path in `shadow-sink.ts` returning structured `written: false` without file or directory creation
- Regression test in `shadow-sink.vitest.ts` asserting outside env-var paths are rejected without writing

### Changed

- `artifactsReady()` in the launcher now returns false when source mtimes are newer than dist output. Previously only checked for dist file existence.
- `recordShadowDelta()` in `shadow-sink.ts` now validates env-var-provided paths against the workspace root. Previously accepted any absolute path from the environment.

### Fixed

- R-004: A stale bootstrap lock directory surviving a hard crash blocked the next clean launcher start for the full 120-second timeout. Mtime-based detection and removal resolves this without PID assumptions.
- S-004: An environment-controlled `SPECKIT_ADVISOR_SHADOW_DELTA_PATH` value could write files outside the workspace root. Containment validation now rejects those paths before any I/O.

### Verification

| Check | Result |
|-------|--------|
| Advisor Vitest (43 files) | PASS: 299 tests pass |
| Advisor typecheck (`npm run typecheck`) | PASS |
| Launcher syntax (`node -c .opencode/bin/mk-skill-advisor-launcher.cjs`) | PASS |
| Runtime config JSON parse (`opencode.json`, `.claude/mcp.json`, `.gemini/settings.json`) | PASS |
| Strict packet validation (`validate.sh --strict` on packet 017) | PASS: 0 errors, 0 warnings |

### Files Changed

| File | What changed |
|------|--------------|
| `.opencode/bin/mk-skill-advisor-launcher.cjs` | Added stale lockdir mtime detection and forced removal. Added source-mtime freshness check in `artifactsReady()`. |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/shadow/shadow-sink.ts` | Added workspace-root containment guard for env-var-provided sink paths. Returns structured `written: false` on rejection. |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/launcher-bootstrap.vitest.ts` (NEW) | Regression tests for stale lock acquisition and stale dist detection. |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/shadow-sink.vitest.ts` | Added path rejection regression test for outside env paths. |

### Follow-Ups

- Broaden subprocess environment whitelisting as a P2 item tracked in packet `021-subprocess-env-whitelist`.
