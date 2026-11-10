---
title: "Iter 019 — Track 8: database-path-policy.md spec"
iteration: 19
track: 8
focus: "database-path-policy.md spec"
status: complete
newInfoRatio: 1.00
findings: 5
timestamp: 2026-05-15T17:33:55Z
---

## Iter 019 Findings

### Frontmatter Shape
```yaml
---
title: "System Code Graph Database Path Policy"
description: "Policy for the package-local code-graph SQLite database path required by ADR-002 extraction constraint."
trigger_phrases:
  - "system code graph db path"
  - "code-graph.sqlite path"
  - "code graph database policy"
---
```

### Section Outline
1. OVERVIEW - Policy statement for canonical database location
2. POLICY - Canonical path, forbidden locations, sidecar file placement
3. RATIONALE - ADR-002 extraction constraint, ownership boundaries, separation of concerns
4. TEST AND CI OVERRIDE - Environment variable usage, temporary directory patterns in tests
5. MIGRATION NOTES - Extraction history from system-spec-kit, launcher guard enforcement

### Key Facts Per Section

**Section 1 (OVERVIEW):**
- Policy fixes the runtime location for the code-graph's package-local SQLite database
- Database is the code-graph's structural index state
- Policy ensures clear ownership boundaries post-extraction

**Section 2 (POLICY):**
- Canonical path: `.opencode/skills/system-code-graph/mcp_server/database/code-graph.sqlite`
- Forbidden location: `.opencode/skills/system-spec-kit/mcp_server/database/` (legacy pre-extraction path)
- Sidecar files stay beside database: `code-graph.sqlite-wal`, `code-graph.sqlite-shm`
- Additional runtime state: `.mk-code-index-launcher.json` in same directory

**Section 3 (RATIONALE):**
- ADR-002 extraction constraint requires DB-local ownership for the extracted code-graph skill
- Database is code-graph's runtime state (structural index), belongs with the skill that reads/writes it
- Separation enables: per-skill repair flows (`/doctor:update`), single-writer invariant (scan loop), clean backup/cleanup targeting, independent upgrade cycles
- `system-spec-kit` keeps memory and spec packet state without owning code-graph runtime data
- Shared SQLite file is coordination boundary between in-process imports and MCP tool callers

**Section 4 (TEST AND CI OVERRIDE):**
- `SPECKIT_CODE_GRAPH_DB_DIR` environment variable allows override for tests and disposable CI runs
- Tests use temporary directories via `mkdtempSync` and pass `dbDir` as function parameter (not env var)
- Launcher enforces standalone-storage guard: override must resolve inside workspace root
- Production/operator docs should treat package-local path as default
- Runtime override must not silently relocate database to `system-spec-kit/mcp_server/database/`

**Section 5 (MIGRATION NOTES):**
- Database moved from `system-spec-kit/mcp_server/database/` to `system-code-graph/mcp_server/database/` during packet 014 extraction
- Existing configs referencing `system_code_graph` MCP server should rename to `mk_code_index`
- Launcher guard prevents external absolute paths (security/safety boundary)
- Hook source location asymmetry: SessionStart hooks live under `system-spec-kit/mcp_server/hooks/` (not `system-code-graph/hooks/`) due to 110+ file references; migration deferred to future packet with build/config redesign scope
- Cross-skill consumers use two paths: in-process imports (system-spec-kit handlers/hooks) vs standalone MCP namespace (agents/commands)

ITER_019_COMPLETE: 5 findings, newInfoRatio=1.00
