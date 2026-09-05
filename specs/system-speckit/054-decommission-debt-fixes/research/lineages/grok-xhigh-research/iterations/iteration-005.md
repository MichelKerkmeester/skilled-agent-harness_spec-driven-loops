# Iteration 5: Dependency and importer mismatches

## Focus
Angle 3. Dependencies without importers, and importers without dependencies, across `@spec-kit/shared`, `@spec-kit/scripts` and `@spec-kit/runtime`.

## Findings

### F-I5-001 — `sqlite-vec` is declared on scripts and has no source importer. CONFIRMED. P1
`@spec-kit/scripts` depends on `sqlite-vec` `0.1.7-alpha.2` and optional `sqlite-vec-darwin-arm64`. [SOURCE: .opencode/skills/system-spec-kit/scripts/package.json:26-29]
A source search of `scripts/**/*.{ts,js,mjs,cjs}` found no import or require of that package. The only live mention is a comment that a mock table stands in for `vec_memories` because the virtual table needs the extension. [SOURCE: .opencode/skills/system-spec-kit/scripts/tests/test-retry-manager-behavioral.js:97]
D11 retired the zvec lane. This is a leftover native dep with no caller.
Smallest fix: drop both entries from `scripts/package.json`.

### F-I5-002 — folder-detector still reads `session_learning` from `DB_PATH`; nothing writes that table. CONFIRMED. P1
Priority 2.5 opens `DB_PATH` read-only and selects from `session_learning`. [SOURCE: .opencode/skills/system-spec-kit/scripts/spec-folder/folder-detector.ts:19] [SOURCE: .opencode/skills/system-spec-kit/scripts/spec-folder/folder-detector.ts:1341-1351]
The only `INSERT INTO session_learning` hits under `system-spec-kit` are in `test-folder-detector-functional.js`. There is no live writer.
`DB_PATH` still resolves to `context-index.sqlite` (F-I2-001). After decommission this path either misses the table and falls through, or reads a leftover local DB.
Smallest fix: delete Priority 2.5 and the `better-sqlite3` import from `folder-detector.ts` if no other function in that file needs it.

### F-I5-003 — Scripts package still describes itself as memory management. CONFIRMED. P2
`scripts/package.json` description is "CLI tools for spec-kit context generation and memory management" and `main` is `dist/memory/generate-context.js`. [SOURCE: .opencode/skills/system-spec-kit/scripts/package.json:4-6]
The workspace test scripts still smoke-test that same path. [SOURCE: .opencode/skills/system-spec-kit/package.json:20]
D7 allowed `/memory:save` as a command name. A package description that claims memory management is retired-surface framing on the successor CLI.
Smallest fix: change the description to continuity / context generation. Leave the path until a rename packet.

### F-I5-004 — Shared still ships `@modelcontextprotocol/sdk` for the IPC bridge; the comment still names the memory daemon. CONFIRMED. P2
`shared/package.json` depends on `@modelcontextprotocol/sdk`. [SOURCE: .opencode/skills/system-spec-kit/shared/package.json:26]
The only source importer in spec-kit is `shared/ipc/socket-server.ts`, which uses `StdioServerTransport`. [SOURCE: .opencode/skills/system-spec-kit/shared/ipc/socket-server.ts:14]
The skill-advisor daemon re-exports that module. [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/ipc/socket-server.ts:15-16]
D5 preserved shared IPC. The miss is the header: "Canonical bridge logic shared by every daemon launcher (memory, code-index, skill-advisor)". [SOURCE: .opencode/skills/system-spec-kit/shared/ipc/socket-server.ts:4-5]
Runtime does not declare the SDK. Compiled `runtime/shared/ipc/socket-server.js` still imports it. That is a copy of shared, not a second live server.
Smallest fix: drop `memory` and `code-index` from the comment. Do not drop the SDK while advisor still imports the bridge.

### F-I5-005 — `@huggingface/transformers` is declared on shared and the workspace root, with no TypeScript importer in those three workspaces. CONFIRMED. P2
`shared/package.json` and the workspace root `devDependencies` both list `@huggingface/transformers`. [SOURCE: .opencode/skills/system-spec-kit/shared/package.json:25] [SOURCE: .opencode/skills/system-spec-kit/package.json:48]
No `from '@huggingface/transformers'` hit in `shared/`, `scripts/` or `runtime/` source. The `hf-local` client talks HTTP to `.opencode/bin/hf-model-server.cjs`. [SOURCE: .opencode/skills/system-spec-kit/shared/embeddings/providers/hf-local.ts:36-40]
INFERRED: the import lives in `bin/hf-model-server.cjs` (D5, preserved). The shared workspace declaration is then an unused hoist unless something in shared dynamically loads it.
Smallest fix: confirm the bin file is the only importer; if so, keep the dep on the package that actually imports it, not on `@spec-kit/shared`.

### F-I5-006 — The retrieval "legacy" arm still queries `memory_index` and cites a deleted hybrid-search module. CONFIRMED. P1
`legacy-lane.mjs` says it replays `runtime/lib/search/hybrid-search.ts`. That file is gone. [SOURCE: .opencode/skills/system-spec-kit/scripts/retrieval/lib/legacy-lane.mjs:5]
The query is `FROM memory_index m JOIN active_memory_projection p`. [SOURCE: .opencode/skills/system-spec-kit/scripts/retrieval/lib/legacy-lane.mjs:295-298]
`parity-check.mjs` still treats that arm as one of three retrieval successors. [SOURCE: .opencode/skills/system-spec-kit/scripts/retrieval/parity-check.mjs:8-12]
This is a successor that still serves the retired sqlite memory surface as a comparison oracle.
Smallest fix: retire the legacy arm, or pin it as a historical fixture that must not be required for a green run.

## Sources Consulted
- .opencode/skills/system-spec-kit/{package.json,shared/package.json,scripts/package.json,runtime/package.json}
- .opencode/skills/system-spec-kit/scripts/spec-folder/folder-detector.ts:19,1341-1351
- .opencode/skills/system-spec-kit/scripts/retrieval/lib/legacy-lane.mjs:5,295-298
- .opencode/skills/system-spec-kit/scripts/retrieval/parity-check.mjs:8-12
- .opencode/skills/system-spec-kit/shared/ipc/socket-server.ts:4-14
- runtime/lib/search/hybrid-search.ts (absent)

## Assessment
- newInfoRatio: 0.80
- Novelty justification: sqlite-vec orphan, session_learning reader-without-writer, legacy-lane memory_index, scripts description, MCP comment, HF hoist.
- Confidence: high on 001-004 and 006. Medium on 005 until the bin importer is read.

## Reflection
- Worked: package.json then exact import greps, excluding fixtures.
- Failed: workspace-wide glob (broken mcp-server/node_modules path).
- Ruled out: treating `@modelcontextprotocol/sdk` itself as D8 residue. Advisor still imports the shared bridge.

## Dead Ends
- `from '@huggingface/transformers'` in the three workspaces (no hit).

## Recommended Next Focus
Angle 4. Tests that still require deleted dist modules (`working-memory`, `retry-manager`, `hybrid-search`) or that pass because deleted-file budgets went to 0.
