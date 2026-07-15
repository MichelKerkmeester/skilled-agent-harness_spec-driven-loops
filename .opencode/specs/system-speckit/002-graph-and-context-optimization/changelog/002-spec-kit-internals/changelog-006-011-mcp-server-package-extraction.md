---
title: "Full MCP extraction of skill graph library and lifecycle"
description: "Skill graph DB/query library and startup lifecycle moved from spec_kit_memory into system_skill_advisor. Advisor now owns DB init, startup scan, daemon watcher, and shutdown close. Memory startup contains no skill graph lifecycle."
trigger_phrases:
  - "skill graph mcp extraction"
  - "skill graph library move advisor"
  - "D2a D2b extraction"
  - "advisor skill graph lifecycle ownership"
  - "mcp server package extraction 011"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-14

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/011-mcp-server-package-extraction` (Level 3)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction`

### Summary

The skill graph DB/query library lived inside `system-spec-kit/mcp_server/lib/skill-graph/` while `system_skill_advisor` exposed the public `skill_graph_*` tools. That split created a dual-writer risk where memory startup initialized and watched the skill graph while the advisor owned the tool surface.

D2a performed an atomic clean cut: three library files moved from spec-kit to advisor with `git mv`, advisor startup adopted DB init, startup scan, generation publication, daemon watcher, and shutdown close, and the corresponding spec-kit lifecycle paths were removed in the same commit. D2b verified prompt hooks, schema imports, session-bootstrap topology behavior, full advisor Vitest, and memory full-suite evidence, then closed the packet at 100 percent.

The advisor is now the sole runtime owner of skill graph code and lifecycle. Memory startup reaches "Context MCP server running on stdio" with no skill graph init or watcher log.

### Added

- Package-local `lib/skill-graph/` directory in `system-skill-advisor` with `skill-graph-db.ts` and `skill-graph-queries.ts` moved from spec-kit via `git mv`
- Advisor-local caller-context module at `lib/context/caller-context.ts` so skill graph dispatch no longer depends on the private spec-kit caller context
- Startup lifecycle in `advisor-server.ts`: DB init, startup scan, advisor generation publication, daemon watcher start with 2 second debounce, and shutdown DB close
- ADRs in `decision-record.md` recording council Q1-Q7 verdicts and R1-R8 mitigation decisions

### Changed

- `advisor-server.ts` rewired to own full skill graph lifecycle on start and close
- Skill graph handlers, rebuild, daemon watcher, semantic lane, tools, and auth guard in `system-skill-advisor` now use package-local imports
- `context-server.ts` no longer imports, initializes, scans, watches, publishes, or closes skill graph state
- `context-server.vitest.ts` fixture F-015 updated to assert advisor-owned publication rather than memory-owned publication

### Fixed

- Dual-writer risk where memory startup and advisor could both write skill graph state is eliminated by removing the memory lifecycle path in the same commit as the advisor adoption
- Watcher race condition where both servers could run overlapping generation publication is resolved, advisor daemon watcher is the only watcher after D2a
- Old empty `system-spec-kit/mcp_server/handlers/skill-graph/` orphan directory deleted

### Verification

| Check | Result |
|-------|--------|
| `npm run typecheck` in advisor MCP | PASS |
| `npx tsc --noEmit` in memory MCP | PASS |
| Advisor targeted skill graph Vitest (3 files, 6 tests) | PASS |
| Advisor `npm run build` | PASS |
| Memory `npm run build` | PASS |
| Advisor MCP smoke: DB path, startup scan, daemon active logged | PASS |
| Memory MCP smoke: no skill graph init log on startup | PASS |
| Grep: old advisor skill graph imports from spec-kit | PASS, zero matches |
| Grep: old spec-kit `lib/skill-graph` directory absent | PASS |
| Grep: old spec-kit handler orphan directory absent | PASS |
| Packet strict validation | PASS, 0 errors and 0 warnings |
| Hook import resolution: Claude, Codex, Gemini | PASS for 3 present runtimes, no OpenCode hook directory in this checkout |
| Schema import resolution: `AdvisorToolInputSchemas` and parameter key exports | PASS via TypeScript verification |
| Session-bootstrap topology: targeted suites 3/3 pass, topology returns advisor-ownership unavailable state | PASS |
| Advisor full Vitest: 40 files, 291 tests | PASS |
| Memory full `npm test`: core baseline-red (11404/11582), F-015 fixture fix passed, remaining failures are unrelated baseline surfaces | CLASSIFIED, outside 011 scope |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts` (NEW location) | Moved | Moved from spec-kit via `git mv`. DB now resolves `skill-graph.sqlite` under the advisor package and uses advisor-local integrity and markdown helpers. |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-queries.ts` (NEW location) | Moved | Moved from spec-kit via `git mv`. No code changes to query logic. |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/context/caller-context.ts` (NEW) | Created | Advisor-local caller context replacing spec-kit private import dependency. |
| `.opencode/skills/system-skill-advisor/mcp_server/advisor-server.ts` | Modified | DB init, startup scan, generation publication, daemon watcher start with debounce, and shutdown DB close added. |
| `.opencode/skills/system-skill-advisor/mcp_server/handlers/skill-graph/query.ts` | Modified | Rewired to package-local skill graph imports. |
| `.opencode/skills/system-skill-advisor/mcp_server/handlers/skill-graph/scan.ts` | Modified | Rewired to package-local skill graph imports. |
| `.opencode/skills/system-skill-advisor/mcp_server/handlers/skill-graph/status.ts` | Modified | Rewired to package-local skill graph imports. |
| `.opencode/skills/system-skill-advisor/mcp_server/handlers/skill-graph/validate.ts` | Modified | Rewired to package-local skill graph imports. |
| `.opencode/skills/system-spec-kit/mcp_server/context-server.ts` | Modified | Removed skill graph init, scan, watcher, generation publication, and DB close paths. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/context-server.vitest.ts` | Modified | Fixed stale D2a F-015 fixture to assert advisor-owned skill graph publication. |

### Follow-Ups

- No OpenCode hook file exists in this checkout. The verified hook set is Claude, Codex, and Gemini. A future checkout with the OpenCode hook directory should verify that import resolves correctly.
- Memory full-suite baseline remains red at core. The stale 011 fixture was fixed, but unrelated failures covering Copilot dist hooks, code-graph extraction leftovers, vector dimension mismatch, and workflow vocabulary invariance remain outside 011 scope.
- `lib/utils/sqlite-integrity.ts` re-exports advisor freshness integrity and `lib/utils/skill-label-sanitizer.ts` re-exports advisor render sanitization. Both are candidates for future neutral `@spec-kit/shared` extraction in a dedicated follow-up packet.
