---
title: "Code Graph Phase 006-001: system-code-graph extraction"
description: "Migrated the code-graph subsystem out of system-spec-kit into a dedicated system-code-graph skill with a standalone MCP server. Preserved all 10+ tool IDs, moved the 53 MB live SQLite index, rewired 30+ cross-subsystem consumers. Deep review verdict: CONDITIONAL promoted to PASS after 4 remediations."
trigger_phrases:
  - "system-code-graph extraction"
  - "code graph skill migration"
  - "standalone code graph MCP"
  - "code graph physical move"
  - "014 extraction handover"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-14

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph/006-extraction-and-isolation/001-system-code-graph-extraction` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph/006-extraction-and-isolation`

### Summary

The code-graph subsystem (108 files, 12 MCP tools, a 53 MB live SQLite index) was buried 5 levels deep inside `system-spec-kit`. That made it hard to discover as a first-class skill, reason about its scope independently or iterate on its public surface without touching the broader spec-kit package.

A 3-iteration deep-research loop produced ADR-001, locking the 6-phase migration sequence: scaffold the new skill, physically move source files with `git mv`, rewire 30+ cross-subsystem consumers, split category-22 documentation, then validate the full suite. Partway through execution the user reversed the MCP topology decision. ADR-002 superseded ADR-001 Q3, switching from a co-resident to a standalone MCP server with a dedicated `system-code-graph-launcher.cjs` plus a new `system_code_graph` entry in `opencode.json`.

All 6 phases shipped on main. A 4-iteration deep review surfaced 1 P0 claim mismatch, 1 P1 dead import plus 2 P2 advisory items. All four were remediated before the handover verdict was promoted to PASS. The code-graph subsystem now lives at `.opencode/skills/system-code-graph/` with its own `SKILL.md`, `feature_catalog/`, `manual_testing_playbook/`, `references/` plus a standalone MCP server. All tool IDs (`code_graph_*`, `ccc_*`, `detect_changes`) were preserved.

### Added

- New skill root `.opencode/skills/system-code-graph/` with `SKILL.md`, `README.md`, `package.json`, `tsconfig.json`, `vitest.config.ts`, `feature_catalog/`, `manual_testing_playbook/`, `references/`, `lib/`, `handlers/`, `tools/` plus `tests/`
- Standalone MCP server at `system-code-graph/mcp_server/index.ts` with server name `system_code_graph` and single-dispatch for all 10 tool schemas
- Dedicated launcher `system-code-graph-launcher.cjs` in `.opencode/bin/` mirroring the `spec-kit-memory-launcher.cjs` pattern
- `system-code-graph/mcp_server/core/config.ts` resolving `DATABASE_DIR` to the new skill location with `SPECKIT_CODE_GRAPH_DB_DIR` env fallback
- New `system_code_graph` MCP server entry in `opencode.json` with all 5 `SPECKIT_CODE_GRAPH_INDEX_*` flags defaulting to `"false"` for end-user safety

### Changed

- 108 code-graph source files moved from `system-spec-kit/mcp_server/code_graph/` to `system-code-graph/mcp_server/` (flattened layout, no inner `code_graph/` subdir)
- 5 cross-subsystem handlers in `system-spec-kit` (`memory-search`, `session-resume`, `session-bootstrap`, `session-health`, `memory-context`) rewired to sibling-skill import paths
- 6 startup-injection hooks across 4 runtimes updated to the flattened layout
- `system-spec-kit/mcp_server/tool-schemas.ts` and `tools/index.ts`: 10 code-graph tool schemas and dispatch removed, replaced by ADR-002 migration comment markers
- 14 category-22 docs (6 feature catalog + 8 manual testing playbook) moved to `system-code-graph/feature_catalog/01-08/` and `manual_testing_playbook/01-08/`
- Agent files, command docs, top-level `README.md`, `CLAUDE.md`, `AGENTS.md` plus the constitutional rule updated with new skill paths

### Fixed

- 2 stress-test files (`w10-degraded-readiness-integration.vitest.ts`, `gate-d-benchmark-session-resume.vitest.ts`) had 4 import paths targeting the pre-flattening `mcp_server/code_graph/` directory that no longer exists. All 4 paths corrected to the flattened layout.
- `doctor/update.md` SUBSYSTEM CONTRACT table used `.opencode/skills/system-code-graph/database/code-graph.sqlite` (missing `mcp_server/`). Corrected to `.opencode/skills/system-code-graph/mcp_server/database/code-graph.sqlite`.
- `002-scaffold-skill/graph-metadata.json` `derived.causal_summary` described the pre-ADR-002 co-resident topology. Updated to note the standalone server supersession.

### Verification

| Check | Result |
|-------|--------|
| Strict packet validation (`validate.sh --strict --recursive`) | PASS, 0 errors, 0 warnings |
| TypeScript typecheck (`system-code-graph`) | Exit 0 |
| TypeScript typecheck (`system-spec-kit`, post-rewire) | Exit 0 |
| Vitest `system-code-graph` full suite | 395 passed, 0 failed, 9 skipped |
| Vitest `system-spec-kit` handler tests (post-rewire) | PASS, no regressions |
| Stress test imports (P1-1 fix) | `grep -rn "code_graph/lib\|code_graph/handlers" stress_test/` returns 0 matches |
| Deep review verdict | CONDITIONAL promoted to PASS after 4 remediations (P0-1, P1-1, P2-1, P2-2) |
| Live DB at new location | `system-code-graph/mcp_server/database/code-graph.sqlite` present, 53 MB |

### Files Changed

| File | What changed |
|------|--------------|
| `.opencode/skills/system-code-graph/` (NEW) | Full skill scaffold. SKILL.md, README.md, package.json, tsconfig.json, feature_catalog, manual_testing_playbook, references, mcp_server subtree. |
| `.opencode/skills/system-code-graph/mcp_server/index.ts` (NEW) | Standalone MCP server entrypoint. Server name `system_code_graph`, StdioServerTransport, single-dispatch. |
| `.opencode/skills/system-code-graph/mcp_server/core/config.ts` (NEW) | DATABASE_DIR resolution with SPECKIT_CODE_GRAPH_DB_DIR env fallback. |
| `.opencode/skills/system-code-graph/mcp_server/tool-schemas.ts` (NEW) | All 10 code-graph tool schema exports moved from system-spec-kit. |
| `.opencode/bin/mk-code-index-launcher.cjs` (NEW) | Standalone launcher for system-code-graph MCP server. Mirrors spec-kit-memory-launcher.cjs pattern. |
| `opencode.json` | New `system_code_graph` entry added. `SPECKIT_CODE_GRAPH_INDEX_*=false` defaults. `_NOTE_8` rewritten. |
| `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts` | 10 code-graph tool schemas removed. ADR-002 migration comment markers added at removal points. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/` (5 files) | Cross-subsystem imports rewired from `mcp_server/code_graph/lib/` to sibling-skill flattened paths. |
| `README.md`, `CLAUDE.md`, `AGENTS.md` | Code-graph path references updated to new skill location. |

### Follow-Ups

- Restart MCP children so the new `system_code_graph` server entry loads and the legacy `spec_kit_memory` child stops holding stale DB handles.
- Run post-restart smoke tests (§7.1 of handover.md) to confirm all 10 code-graph tools are accessible under the new MCP namespace.
- Flesh out `system-code-graph/SKILL.md` smart routing block and references section. Both are currently minimal placeholders from the Phase 002 scaffold.
- Consider a thin Level 1 packet to record the operational MCP-restart outcome (`lsof` before/after, log output, post-cleanup file listing).
