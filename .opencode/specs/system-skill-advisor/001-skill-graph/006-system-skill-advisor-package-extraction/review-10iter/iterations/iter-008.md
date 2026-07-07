# iter-008 — COMPATIBILITY

**Dimension**: Compatibility — 4-runtime smoke, Python shim parity, legacy fallbacks
**Date**: 2026-05-15
**Files Reviewed**: opencode.json, .claude/mcp.json, .codex/config.toml, .gemini/settings.json, spec-kit-skill-advisor.js, plugin_bridges/spec-kit-skill-advisor-bridge.mjs, skill_advisor.py

## Findings

| ID | Severity | Title | Location | Category |
|----|----------|-------|----------|----------|
| CP-001 | P2 | Runtime configs have asymmetric env-var blocks — OpenCode has 6 env vars, Codex has 5, Claude/Gemini have 0 | 4 runtime configs | compatibility/config-parity |
| CP-002 | P2 | Plugin bridge `runBridge` passes full `process.env` to subprocess — same env-surface concern as S-001 | `spec-kit-skill-advisor.js:418-419` | compatibility/env-surface |

## Analysis

### 4-runtime configs: PASS

All 4 runtime configurations are correctly updated:
- **OpenCode** (`opencode.json:37`): `mk_skill_advisor` with `node ./.opencode/bin/mk-skill-advisor-launcher.cjs`. 6 env vars (DB dir, launch mode, shadow, workspace, metrics, hook).
- **Codex** (`config.toml:31`): `mk_skill_advisor` with correct args. 5 env vars. Env block format follows TOML conventions.
- **Claude** (`mcp.json:27`): `mk_skill_advisor` with correct args. No env block.
- **Gemini** (`settings.json:45`): `mk_skill_advisor` with correct args. No env block.

All configs register the correct namespace (`mcp__mk_skill_advisor__*`). No stale `system_skill_advisor` or old launcher paths in any live config.

### Python shim: PASS

Zero stale references in Python scripts. `skill_advisor.py` uses `NATIVE_ADVISOR_COMPAT` for the native bridge path, `SKILL_GRAPH_SQLITE_PATH` resolves to the advisor package database. The Python shim properly falls back from native to legacy mode.

### Plugin bridge: PASS

`spec-kit-skill-advisor.js` references `mk-skill-advisor-launcher.cjs` in `ADVISOR_SOURCE_PATHS` (line 43). The bridge path resolves through `spec-kit-skill-advisor-bridge.mjs` which dispatches to `mk_skill_advisor` MCP server. The cache key includes `advisorSourceSignature()` for invalidation on source changes.

### Legacy fallback: PRESENT

The `SYSTEM_SKILL_ADVISOR_DB_DIR` env var is kept as a fallback after `MK_SKILL_ADVISOR_DB_DIR` in 4 locations (launcher, skill-graph-db.ts, advisor-status.ts, projection.ts). This preserves backwards compatibility for existing scripts using the old variable name.

### Config asymmetry: MINOR

CP-001: OpenCode and Codex configs pass env vars while Claude and Gemini don't. The advisor server itself resolves DB dir from `process.env`, so the env vars are optional — missing them just means the default package-local path is used. This is not a functional issue but could cause unexpected behavior differences between runtimes if env-specific features are needed.

## Verdict: PASS with 2 P2 advisories
