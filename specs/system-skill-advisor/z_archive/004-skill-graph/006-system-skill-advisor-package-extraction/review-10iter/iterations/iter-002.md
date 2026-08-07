# iter-002 — CORRECTNESS

**Dimension**: Correctness — Stale references, dead code, unused imports, type-mismatched signatures
**Date**: 2026-05-15
**Files Reviewed**: All 4 runtime configs, rename-invariants.vitest.ts, semantic-shadow.ts, skill-graph-db.ts, skill-graph-db.vitest.ts, tool-input-schemas.ts, plugin bridges, launcher

## Findings

| ID | Severity | Title | Location | Category |
|----|----------|-------|----------|----------|
| C-001 | P2 | Cross-package relative import bypasses `@spec-kit/shared` package name | `semantic-shadow.ts:5` | correctness/import-hygiene |
| C-002 | P2 | Advisor vitest fixture imports from spec-kit test fixtures via relative path | `skill-graph-db.vitest.ts:10` | correctness/test-dependency |
| C-003 | P2 | `tool-input-schemas.ts` references advisor tool schemas with `as unknown as ToolInputSchema` casts — type-safety weakened | `tool-input-schemas.ts:664-667` | correctness/type-safety |
| C-004 | P0 | NONE — zero stale references in live code | — | correctness/clean |

## Analysis

### Stale references audit: PASS

Live code surfaces verified:
- **Runtime configs** (opencode.json, .claude/mcp.json, .codex/config.toml, .gemini/settings.json): All use `mk_skill_advisor` and `mk-skill-advisor-launcher.cjs`. Zero stale `system_skill_advisor` in any live config.
- **Launcher**: No old `.skill-advisor-launcher.json` state file pattern. No old `command: 'skill-advisor-launcher'` value.
- **Live source code**: Zero stale `system_skill_advisor` in advisor/server source files.
- **Live source code**: Zero references to old launcher path `skill-advisor-launcher.cjs` (without mk-prefix) outside spec docs.
- **`system_skill_advisor` in `.opencode/`**: All 21 hits are in spec docs (historical snapshots of pre-rename child packets 001-013) — correct in historical context.

### Env var fallback: INTENTIONAL

`SYSTEM_SKILL_ADVISOR_DB_DIR` appears as a fallback after `MK_SKILL_ADVISOR_DB_DIR` in 4 locations (launcher, skill-graph-db.ts, advisor-status.ts, projection.ts). This is by design per 016 P2 remediation — backwards compatibility for scripts using the old env var name. NOT a correctness issue.

### Cross-package imports: Minor concerns

C-001: `semantic-shadow.ts` uses a relative 5-level path to reach `system-spec-kit/shared/embeddings/factory.js` instead of the package name `@spec-kit/shared/embeddings/factory`. Other files (e.g., `skill-graph-db.ts:8`) use the proper package import. This inconsistency should be resolved.

C-002: The advisor vitest suite imports from spec-kit test fixtures. Ideally the fixture should be copied or shared through a common test-utils package.

C-003: `tool-input-schemas.ts` casts advisor schemas with `as unknown as ToolInputSchema`, weakening type-safety. A proper shared type contract would be cleaner.

### Rename invariants test: PASS

`rename-invariants.vitest.ts` provides solid coverage: server registration, launcher binary, launcher state command, and all 4 runtime configs. Well-structured.

## Verdict: PASS with 3 P2 advisories
