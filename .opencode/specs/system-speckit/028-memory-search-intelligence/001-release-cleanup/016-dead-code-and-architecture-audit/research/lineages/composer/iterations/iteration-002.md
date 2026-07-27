# Iteration 002 — MCP-server trees and database layout

**Focus:** `system-spec-kit`, `system-skill-advisor`, and `system-code-graph` MCP surfaces; runtime DB/vector layout; hook paths.
**newInfoRatio:** 0.85
**Novelty:** Confirmed deleted `:memory:` runtime files, removed vectors placeholder, dual hf-local shard naming, and duplicate hook copies across runtime mirrors.
**Status:** complete

## Findings

### F5 — CAT-2: Deleted `:memory:` sidecar files at system-spec-kit root (superseded by MCP database layout)
- **Path:** `.opencode/skills/system-spec-kit/:memory:` (deleted in working tree per git status)
- **Evidence:** Git status shows `D .opencode/skills/system-spec-kit/:memory:` and `D .opencode/skills/system-spec-kit/:memory:.lock`; live MCP DB lives under `mcp-server/database/`.
- **Proof:** `test -e .opencode/skills/system-spec-kit/:memory:` → fail; `test -d .opencode/skills/system-spec-kit/mcp-server/database` → pass.

### F6 — CAT-3: Removed `vectors/.gitkeep` while directory remains runtime-populated
- **Path:** `.opencode/skills/system-spec-kit/mcp-server/database/vectors/`
- **Evidence:** Git status shows deleted `.gitkeep`; directory contains live `.sqlite` shards and `README.md`.
- **Proof:** `ls .opencode/skills/system-spec-kit/mcp-server/database/vectors/` → `README.md`, `context-vectors__hf-local__...sqlite`, `context-vectors__ollama__...sqlite`; `test -f .../vectors/.gitkeep` → fail.

### F7 — CAT-2: Legacy double-dash vector filename removed; canonical double-underscore shard remains
- **Path:** `.opencode/skills/system-spec-kit/vectors/context-vectors--hf-local--nomic-ai-nomic-embed-text-v1.5--768--q8.sqlite` (deleted) vs `.opencode/skills/system-spec-kit/mcp-server/database/vectors/context-vectors__hf-local__nomic-ai_nomic-embed-text-v1.5__768__q8.sqlite` (live)
- **Evidence:** Git status deletes old path under skill root `vectors/`; active shard uses `__` delimiter per `vectors/README.md:22`.
- **Proof:** `test -f .opencode/skills/system-spec-kit/vectors/context-vectors--hf-local--nomic-ai-nomic-embed-text-v1.5--768--q8.sqlite` → fail; `test -f .opencode/skills/system-spec-kit/mcp-server/database/vectors/context-vectors__hf-local__nomic-ai_nomic-embed-text-v1.5__768__q8.sqlite` → pass.

### F8 — CAT-5: Devin post-compaction hook duplicated verbatim across three runtime trees
- **Path:** `.opencode/skills/system-spec-kit/mcp-server/hooks/devin/post-compaction.cjs`, `.claude/skills/system-spec-kit/mcp-server/hooks/devin/post-compaction.cjs`, `.devin/hooks/post-compaction.cjs`
- **Evidence:** All three reference `.opencode/bin/spec-memory.cjs` at line 94 (`join(projectDir, '.opencode', 'bin', 'spec-memory.cjs')`).
- **Proof:** `rg -n "spec-memory.cjs" .opencode/skills/system-spec-kit/mcp-server/hooks/devin/post-compaction.cjs .claude/skills/system-spec-kit/mcp-server/hooks/devin/post-compaction.cjs .devin/hooks/post-compaction.cjs` → line 94 in each.
- **Simpler shape:** Single canonical hook source with mirror sync script (sk-doc mirror policy) instead of three drift-prone copies.

### F9 — CAT-4: `plugin-bridges/mk-skill-advisor-bridge.mjs` referenced only from tests, not production server entry
- **Path:** `.opencode/skills/system-skill-advisor/mcp-server/plugin-bridges/mk-skill-advisor-bridge.mjs`
- **Evidence:** References appear in `tests/compiled-routing-consumption.vitest.ts`, `tests/compat/plugin-bridge.vitest.ts`, `tests/compat/plugin-bridge-smoke.vitest.ts` only.
- **Proof:** `rg -l 'mk-skill-advisor-bridge' --glob '*.{ts,mjs,js,cjs}' .opencode/skills/system-skill-advisor/mcp-server` → test files only.
- **Simpler shape:** Move to `tests/fixtures/` or delete if OpenCode native MCP registration fully superseded plugin bridge.

## Dead Ends / Ruled Out
- SQLite `:memory:` strings in vitest files are in-memory test DB handles, not the deleted `:memory:` filesystem artifact.

## Next focus
Deep-loop runtime scripts, fan-out merge/salvage subsystem, duplicate reducer entrypoints.
