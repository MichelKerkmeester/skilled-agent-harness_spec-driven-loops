# Phase 14: Dead Code Cleanup - Plan

## Execution Order

### Phase 1: Remove dead imports from context-server.ts (4 lines)
- `indexMemoryFile` (line 28) - `indexSingleFile` used instead
- `findConstitutionalFiles` (line 29) - used internally by handler
- `layerDefs` (line 41) - used in handlers separately
- `clearConstitutionalCache` (line 47) - never called

### Phase 2: Uninstall unused npm dependencies
- `chokidar` (~3.6 MB) - zero imports found
- `lru-cache` (~100 KB) - zero imports found

### Phase 3: Delete deprecated config file
- `config/complexity-config.jsonc` - self-marked deprecated

### Phase 4: Delete stale artifacts
- `.DS_Store`
- `mcp_server/dist/database/` (4 files, ~600 KB)
- `mcp_server/database/context-index__voyage__voyage-4__1024.sqlite` (~250 KB)

### Phase 5: Delete dead shell libraries
- `scripts/lib/common.sh` - never sourced
- `scripts/lib/config.sh` - zero consumers
- `scripts/lib/output.sh` - zero consumers

### Phase 6: Delete dead MCP server modules and barrels
- 19 dead source files (barrel-only, zero production consumers)
- 16 dead barrel `index.ts` files
- PRESERVE: `lib/errors/index.ts` (live)

### Verification: Run tests
- `npx tsc --build` - TypeScript compilation
- `npm test` - Full test suite
