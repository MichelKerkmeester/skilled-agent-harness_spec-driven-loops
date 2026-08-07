# Iteration 018 — Track 6: bin paths + .env example

## Findings

### 1. `.opencode/bin/` paths

**Status:** NO direct references to `.opencode/bin/` paths found in README.md

- The README does not reference any `.opencode/bin/` paths directly
- However, the `.opencode/bin/` directory exists and contains 3 launcher scripts:
  - `mk-code-index-launcher.cjs` (executable)
  - `mk-skill-advisor-launcher.cjs` (non-executable)
  - `mk-spec-memory-launcher.cjs` (executable)
- These launchers are referenced indirectly through MCP server registrations in runtime configs, not through direct README instructions

### 2. npm script names

**Status:** All npm scripts referenced in README.md exist and are valid

| Line | Package | Script | Status | Source |
|------|---------|--------|--------|--------|
| 134 | `.opencode/skills/system-spec-kit/mcp_server` | `npm run build` | ✅ EXISTS | package.json:18 |
| 138 | `.opencode/skills/system-skill-advisor/mcp_server` | `npm run build` | ✅ EXISTS | package.json:7 |
| 146 | `.opencode/skills/system-spec-kit/scripts` | `npm run build` | ✅ EXISTS | package.json:11 |
| 1138 | `.opencode/skills/system-spec-kit/mcp_server` | `npm run stress` | ✅ EXISTS | package.json:30 |

**Additional verification:**
- Line 142 references `node node_modules/typescript/bin/tsc -p tsconfig.json` (direct command, not npm script)
- Verified TypeScript binary exists at: `.opencode/skills/system-code-graph/node_modules/typescript/bin/tsc`

### 3. `.env` example blocks and environment keys

**Status:** Environment variables documented in README match actual usage

**Environment variables referenced in README:**
- Line 162: `export VOYAGE_API_KEY="your-key-here"`
- Line 165: `export OPENAI_API_KEY="your-key-here"`
- Line 543: `Set VOYAGE_API_KEY` (Voyage AI cloud embeddings)
- Line 544: `Set OPENAI_API_KEY` (OpenAI embeddings)
- Line 1307: `VOYAGE_API_KEY` (optional)
- Line 1311: `OPENAI_API_KEY` (optional)

**Verification against launcher binaries:**
All three launchers (mk-code-index-launcher.cjs, mk-skill-advisor-launcher.cjs, mk-spec-memory-launcher.cjs) load environment variables from `.env.local` and `.env` files using a minimal parser that:
- Reads both `.env.local` and `.env` files
- Parses `KEY=VALUE` format
- Respects existing process.env (does not override)
- Supports quoted and unquoted values

**Verification against MCP server code:**
- `VOYAGE_API_KEY` and `OPENAI_API_KEY` are actively used in:
  - `.opencode/skills/system-spec-kit/shared/embeddings/factory.ts` (provider selection)
  - `.opencode/skills/system-spec-kit/shared/embeddings/providers/voyage.ts`
  - `.opencode/skills/system-spec-kit/shared/embeddings/providers/openai.ts`
  - Multiple test files and runtime detection code
- ENV_REFERENCE.md documents these variables in the Embedding section (line 446)

**No `.env` example block found:**
- No dedicated `.env` example block exists in the README
- The archived `.env.example` at `.opencode/specs/system-spec-kit/z_archive/020-mcp-working-memory-hybrid-rag/scratch/graphrag-hybrid/.env.example` is unrelated to the current framework (contains Neo4j/Qdrant config for deprecated hybrid RAG experiment)

## Summary

- **Bin paths:** 0 findings (no direct `.opencode/bin/` references in README)
- **npm scripts:** 4/4 verified (all scripts exist)
- **Environment variables:** 2/2 verified (VOYAGE_API_KEY, OPENAI_API_KEY match actual usage)

ITER_018_COMPLETE: 6 findings, newInfoRatio=0.00
