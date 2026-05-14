# Iteration 002: CORRECTNESS

**Dimension**: Correctness — all references updated, no stale server-id refs, typecheck passing, consumers aligned

**Date**: 2026-05-14

**Executor**: opencode-go/deepseek-v4-pro

---

## Investigation Summary

Performed exhaustive grep for `system_skill_advisor`, `mcp__system_skill_advisor__`, and the old launcher binary path `skill-advisor-launcher.cjs` across all live surfaces (excluding specs, changelog, dist, node_modules). Verified typecheck results, consumer namespace alignment, and cross-package compatibility.

### Old Namespace Audit

| Pattern | Scope | Result |
|---------|-------|--------|
| `system_skill_advisor` | All live code (excluding specs/changelog/dist/node_modules) | **0 hits** |
| `mcp__system_skill_advisor__` | All live code (same exclusions) | **0 hits** |
| `skill-advisor-launcher.cjs` (not mk-prefixed) | All live code (same exclusions) | **0 hits** (only `mk-skill-advisor-launcher.cjs` found) |

Confirmed: the sweep is complete. The second commit (06d1b7e48) cleaned the last 11 references in `README.md`.

### Runtime Config Consistency

| Config File | Server Key | Launcher Path | Namespace Note |
|-------------|-----------|---------------|----------------|
| `opencode.json:37` | `mk_skill_advisor` | `./.opencode/bin/mk-skill-advisor-launcher.cjs` | `mcp__mk_skill_advisor__*` |
| `.claude/mcp.json:27` | `mk_skill_advisor` | `./.opencode/bin/mk-skill-advisor-launcher.cjs` | `mcp__mk_skill_advisor__*` |
| `.codex/config.toml:31` | `mk_skill_advisor` | `./.opencode/bin/mk-skill-advisor-launcher.cjs` | `mcp__mk_skill_advisor__*` |
| `.gemini/settings.json:45` | `mk_skill_advisor` | `./.opencode/bin/mk-skill-advisor-launcher.cjs` | `mcp__mk_skill_advisor__*` |

All four configs are consistent.

### Consumer Alignment

| Consumer | Reference | Status |
|----------|-----------|--------|
| `spec-kit-skill-advisor-bridge.mjs:44` | Launcher path → `mk-skill-advisor-launcher.cjs` | Correct |
| `spec-kit-skill-advisor.js:43` | Launcher path → `mk-skill-advisor-launcher.cjs` | Correct |
| `tools/index.ts` | Comment references `mk_skill_advisor` | Correct |
| `session-bootstrap.ts` | MCP tool references | Correct |
| Doctor commands + YAML assets | No stale refs found | Correct |
| Feature catalog entries | Updated to mk-prefixed tool names | Correct |
| Manual testing playbook entries | Updated to mk-prefixed tool names | Correct |
| Install guides | Updated to `mk_skill_advisor` | Correct |

### Server Entrypoint Path

`advisor-server.ts:106` uses the path `dist/system-skill-advisor/mcp_server/advisor-server.js`. This contains the old folder name `system-skill-advisor` in the dist path, but this is correct — the folder was NOT renamed (ADR-002). The dist directory structure follows the package folder name, not the MCP server id.

---

## Findings

| ID | Severity | Title | Location | Category |
|----|----------|-------|----------|----------|
| F-004 | P2 | Env var `SYSTEM_SKILL_ADVISOR_DB_DIR` inconsistent with renamed server id | `mk-skill-advisor-launcher.cjs:72-73`, `advisor-server.ts` (via `skill-graph-db.ts:187-188`), `advisor-status.ts:27-28`, `projection.ts:40-41` | consistency |

### F-004: SYSTEM_SKILL_ADVISOR_DB_DIR env var name mismatch

**Rationale**: The environment variable `SYSTEM_SKILL_ADVISOR_DB_DIR` is used in 5 source files across both the launcher and advisor server to control the SQLite database directory. While CHK-031 explicitly states "Runtime env var names unchanged" as a P0 security check, the env var name now creates an inconsistency: the MCP server is named `mk_skill_advisor` but operators configuring the database directory must use an env var prefixed `SYSTEM_SKILL_ADVISOR_`. This was intentionally kept but creates a discoverability gap for operators who may look for `MK_SKILL_ADVISOR_DB_DIR`.

**Cited files**:
- `mk-skill-advisor-launcher.cjs:72-73` — reads `SYSTEM_SKILL_ADVISOR_DB_DIR`
- `skill-graph-db.ts:187-188` — reads `SYSTEM_SKILL_ADVISOR_DB_DIR`
- `advisor-status.ts:27-28` — reads `SYSTEM_SKILL_ADVISOR_DB_DIR`
- `projection.ts:40-41` — reads `SYSTEM_SKILL_ADVISOR_DB_DIR`
- `database/README.md:25` — documents `SYSTEM_SKILL_ADVISOR_DB_DIR`

**Suggested Remediation**: Either (a) add `MK_SKILL_ADVISOR_DB_DIR` as a fallback with `SYSTEM_SKILL_ADVISOR_DB_DIR` deprecated, or (b) document the intentional divergence in the ADR and install guide with clear rationale.

---

## Convergence Delta

New findings vs iter-001: **1** (F-004). No P0 or P1 findings. Three P2 findings from iter-001 carry forward.

## Dimension Coverage

| Dimension | Status |
|-----------|--------|
| ARCHITECTURE | Covered (iter-001) |
| CORRECTNESS | Covered (this iteration) |
| ROBUSTNESS | Pending |
| TESTING | Pending |
| DOCUMENTATION | Pending |
