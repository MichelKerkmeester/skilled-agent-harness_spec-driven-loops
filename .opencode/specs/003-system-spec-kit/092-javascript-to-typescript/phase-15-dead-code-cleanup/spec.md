# Phase 14: Dead Code Cleanup

## Overview
Remove dead/unused code discovered through comprehensive 15-agent audit of `system-spec-kit/` and `mcp_server/`.

## Scope
- 19 dead MCP server source files (barrel-only, never imported by production code)
- 16 dead barrel `index.ts` files (architectural transition leftovers)
- 4 dead imports in `context-server.ts`
- 3 dead shell libraries in `scripts/lib/`
- 2 unused npm dependencies (`chokidar`, `lru-cache`)
- 1 deprecated config file (`complexity-config.jsonc`)
- Stale artifacts: `.DS_Store`, `dist/database/`, legacy `.sqlite` file

## Root Cause
The JS-to-TS migration (phases 0-13) transitioned from barrel-import pattern to direct-import pattern. Old barrel files and modules accessible only through barrels were never cleaned up.

## Out of Scope
- Templates (all 72 verified active)
- References (all 23 verified active)
- Assets (all 4 verified active)
- Test fixtures (all 51 verified active)
- Constitutional files (actively loaded and enforced at runtime)

## Risk Assessment
- Phases 1-5: Negligible risk (dead imports, unused deps, deprecated files)
- Phase 6: Medium risk (35 file deletions) - mitigated by test verification
