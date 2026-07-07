# iter-001 — ARCHITECTURE

**Dimension**: Architecture — Extraction soundness, ADR consistency, boundary integrity
**Date**: 2026-05-15
**Files Reviewed**: advisor-server.ts, launcher (mk-skill-advisor-launcher.cjs), tools/index.ts (both packages), skill_advisor.py, 3 implementation-summaries (014,015,016)

## Findings

| ID | Severity | Title | Location | Category |
|----|----------|-------|----------|----------|
| A-001 | P2 | Dual dispatchTool implementations create maintenance overlap | `advisor-server.ts:217-234` AND `tools/index.ts:37-56` | architecture/duplication |
| A-002 | P2 | Chokidar imported from system-spec-kit node_modules instead of advisor's own | `advisor-server.ts:91-102` | architecture/coupling |
| A-003 | P1 | Old `system_skill_advisor` server id references persist in live runtime configs post-015 rename | `.codex/config.toml`, `.claude/mcp.json`, `.gemini/settings.json` — 330+ matches in spec docs but need verification on runtime configs | architecture/stale-ref |
| A-004 | P2 | Test fixture cross-import: advisor vitest imports from spec-kit fixture dir | `system-skill-advisor/mcp_server/tests/skill-graph-db.vitest.ts:10` | architecture/coupling |
| A-005 | P1 | spec_kit_memory still imports advisor schemas and hook renderers (intentional bridges but no deprecation timeline) | `spec-kit/mcp_server/schemas/tool-input-schemas.ts:12`, 4 hook files | architecture/extraction-boundary |
| A-006 | P2 | advisor-server.ts:dispatchTool silently returns null for unhandled tools, then advisor-server.ts wraps that with "Unhandled" error — tool dispatch happens at two layers | `advisor-server.ts:217-234` (dispatchTool) and `advisor-server.ts:261-267` (CallToolRequestSchema handler) | architecture/error-path |

## Analysis

### Extraction soundness: PASS with advisories

The advisor is structurally standalone. It has its own MCP server entrypoint, launcher, tools, handlers, schemas, lib, and DB. The 015 rename from `system_skill_advisor` → `mk_skill_advisor` completed cleanly. The 016 P2 remediation closed the known cleanup ledger.

### Remaining cross-package coupling

**Acceptable bridges** (by design):
- Hook wrappers importing `renderAdvisorBrief` from advisor lib (5 files) — these are the hooks shipping advisor context; they need access to advisor renderer logic.
- `tool-input-schemas.ts` importing `AdvisorToolInputSchemas` — shared schema contract.
- Test cross-imports (13 files) — tests validate cross-package behavior; this coupling is expected.

**Unacceptable / questionable**:
- A-002: chokidar dynamic import from spec-kit node_modules. The advisor should use its own chokidar dependency. If the advisor package has its own node_modules (it does — `system-skill-advisor/mcp_server/package.json`), this import should resolve from there.

### ADR consistency

ADR-001 (standalone advisor MCP) verified. ADR-003 (stable tool ids) confirmed. The 015 rename preserves all tool ids. The extraction follows the 5-phase ADR-001 plan tracked through 004-006. The 008 follow-on (skill_graph_* migration) is complete per implementation summary.

One gap: the `system_skill_advisor` server id appears in 430+ files across spec docs, feature catalogs, and manual testing playbooks from child packets 001-013. This is expected (historical spec docs are snapshots), but live runtime configs and live docs should be verified in iter-002 (CORRECTNESS).

## Verdict: PASS with 2 P1, 4 P2 advisories
