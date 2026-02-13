# Spec: JavaScript to TypeScript Migration — system-spec-kit

> **Spec Folder:** `specs/003-memory-and-spec-kit/092-javascript-to-typescript/`
> **Level:** 3+ (98,834 LOC across 186 files, architectural change)
> **Status:** Planning
> **Created:** 2026-02-07

---

## 1. Problem Statement

The entire `system-spec-kit` codebase (MCP server, CLI scripts, shared modules) is written in plain JavaScript using CommonJS (`require`/`module.exports`). This means:

- **No compile-time type safety** — runtime errors from type mismatches are caught only by tests or production failures
- **No IDE autocompletion** for internal APIs — developers rely on JSDoc annotations (inconsistent coverage)
- **Interface contracts are informal** — the existing `IEmbeddingProvider` and `IVectorStore` "interfaces" use `throw new Error('must be implemented')` instead of compile-time enforcement
- **Refactoring risk** — renaming exports, changing function signatures, or restructuring modules has no compiler safety net across 186 files

The `workflows-code--opencode` skill (the team's code standards reference) explicitly excludes TypeScript: `"TypeScript (not currently used in OpenCode)"`. This must be updated first to establish conventions before the migration begins.

---

## 2. Scope

### In Scope

| Area | Files | Lines | Description |
|------|------:|------:|-------------|
| `shared/` | 9 | 2,622 | Embeddings, chunking, trigger extraction, provider factories |
| `mcp_server/` source | 76 | 31,819 | MCP server, handlers, lib (cognitive, search, storage, etc.) |
| `mcp_server/` tests | 46 | 42,477 | Full test suite for MCP server |
| `scripts/` source | 42 | 9,096 | CLI scripts (generate-context, rank-memories, extractors, etc.) |
| `scripts/` tests | 13 | 12,820 | CLI test suite |
| **Subtotal code** | **186** | **98,834** | |
| READMEs | 7 | 4,041 | All READMEs in system-spec-kit |
| SKILL.md | 1 | 883 | Main skill definition |
| References | 23 | ~8,500 | Reference documentation |
| Assets | 4 | ~1,200 | Asset documentation |
| workflows-code--opencode | 20 | ~6,000 | Code standards skill (new TS files + updates) |
| **Subtotal docs** | **55** | **~20,624** | |
| **GRAND TOTAL** | **241** | **~119,458** | |

### Out of Scope

- `node_modules/` — third-party packages are not modified
- `templates/` — markdown template files (not code)
- `constitutional/` — markdown rule files (not code)
- `config/` — JSONC configuration files (not code)
- Other skills outside `system-spec-kit` and `workflows-code--opencode`
- CLAUDE.md, AGENTS.md, PUBLIC_RELEASE.md (project-level docs)

---

## 3. Constraints

### Hard Constraints

1. **100% functionality preservation** — every MCP tool, CLI script, and test must work identically after migration
2. **MCP server startup** — `opencode.json` starts the server via `node .opencode/skill/system-spec-kit/mcp_server/context-server.js`. The compiled output must support this exact invocation (or `opencode.json` must be updated)
3. **npm workspace structure** — `mcp_server` and `scripts` remain as npm workspaces
4. **Node.js 18+ compatibility** — all TypeScript must compile to Node 18-compatible output
5. **No new runtime dependencies** — TypeScript is dev-only; the compiled output runs as plain JS
6. **Circular dependency resolution** — `shared/` ↔ `mcp_server/` circular imports must be broken before TypeScript project references can work

### Soft Constraints

- Prefer CommonJS output (`"module": "commonjs"` in tsconfig) to minimize disruption — `__dirname` is used extensively
- Prefer in-place compilation (`.ts` source → `.js` compiled in same directory) over separate `dist/` folder to preserve all relative path references
- Existing JSDoc annotations should be converted to proper TypeScript types, not discarded
- The snake_case backward-compatible aliases (from spec 090) must be preserved in exports

---

## 4. Technical Analysis

### Current Architecture

```
system-spec-kit/
├── package.json          (root, workspaces: [mcp_server, scripts])
├── shared/               (NOT a workspace, no package.json)
│   ├── embeddings.js     (facade + LRU cache)
│   ├── embeddings/       (factory, profile, providers/)
│   ├── chunking.js       (semantic text chunking)
│   ├── trigger-extractor.js  (TF-IDF NLP pipeline)
│   └── utils.js          (DEPRECATED re-export)
├── mcp_server/           (workspace: @spec-kit/mcp-server)
│   ├── context-server.js (MCP entry point, 20+ tools)
│   ├── core/             (config, db-state)
│   ├── handlers/         (9 handlers: search, save, CRUD, etc.)
│   ├── hooks/            (auto-surface)
│   ├── formatters/       (search results, token metrics)
│   ├── lib/              (14 subdirectories, 50+ modules)
│   ├── utils/            (validators, JSON helpers, batch processing)
│   ├── scripts/          (reindex-embeddings)
│   └── tests/            (46 test files)
└── scripts/              (workspace: @spec-kit/scripts)
    ├── core/             (config, workflow)
    ├── extractors/       (8 extractors)
    ├── lib/              (10 libraries)
    ├── loaders/          (data loader)
    ├── memory/           (generate-context, cleanup, rank)
    ├── renderers/        (template renderer)
    ├── spec-folder/      (detection, setup, validation)
    ├── utils/            (10 utilities)
    └── tests/            (13 test files)
```

### Circular Dependency (MUST RESOLVE)

```
shared/embeddings/providers/voyage.js ──requires──► mcp_server/lib/utils/retry.js
shared/embeddings/providers/openai.js ──requires──► mcp_server/lib/utils/retry.js
shared/utils.js ──requires──► mcp_server/lib/utils/path-security.js

mcp_server/lib/providers/embeddings.js ──requires──► shared/embeddings.js
mcp_server/lib/parsing/trigger-extractor.js ──requires──► shared/trigger-extractor.js
mcp_server/lib/storage/checkpoints.js ──requires──► shared/embeddings
mcp_server/lib/embeddings/provider-chain.js ──requires──► shared/embeddings/factory.js
```

**Resolution:** Move `retry.js` and `path-security.js` into `shared/`. Delete deprecated `shared/utils.js`. Move `folder-scoring.js` into `shared/` to reduce `scripts/` → `mcp_server/` coupling.

### Re-Export Proxy Files (6 total)

| Proxy | Source | Will become |
|-------|--------|-------------|
| `scripts/lib/embeddings.js` | `shared/embeddings.js` | TS re-export |
| `scripts/lib/trigger-extractor.js` | `shared/trigger-extractor.js` | TS re-export |
| `scripts/lib/retry-manager.js` | `mcp_server/lib/providers/retry-manager.js` | TS re-export |
| `mcp_server/lib/providers/embeddings.js` | `shared/embeddings.js` | TS re-export |
| `mcp_server/lib/parsing/trigger-extractor.js` | `shared/trigger-extractor.js` | TS re-export |
| `shared/utils.js` (DEPRECATED) | `mcp_server/lib/utils/path-security.js` | DELETE |

### Existing Interface Pattern → TypeScript

```javascript
// Current (runtime enforcement)
class IEmbeddingProvider {
  async embed(text) { throw new Error('must be implemented'); }
}

// After (compile-time enforcement)
interface IEmbeddingProvider {
  embed(text: string): Promise<number[]>;
  batchEmbed(texts: string[]): Promise<number[][]>;
  // ...
}
```

### Dependencies Requiring @types

| Package | Has types? | Action |
|---------|-----------|--------|
| `@modelcontextprotocol/sdk` | Yes (bundled) | None |
| `better-sqlite3` | No | Add `@types/better-sqlite3` |
| `@huggingface/transformers` | Yes (TS native) | None |
| `chokidar` | Yes (bundled) | None |
| `lru-cache` | Yes (bundled) | None |
| `sqlite-vec` | No | Write custom `.d.ts` |
| `crypto` (Node built-in) | Yes (via @types/node) | Ensure `@types/node` explicit |

---

## 5. Acceptance Criteria

### Functional

- [ ] All 20+ MCP tools respond identically (same input → same output)
- [ ] `generate-context.js` CLI produces identical memory files
- [ ] `rank-memories.js` CLI produces identical ranking output
- [ ] `cleanup-orphaned-vectors.js` CLI works identically
- [ ] All 59 test files pass (46 mcp_server + 13 scripts)
- [ ] MCP server starts via `node context-server.js` (compiled output)
- [ ] Embedding providers (Voyage, OpenAI, HF-local) connect and produce embeddings
- [ ] SQLite database operations (CRUD, vector search, migrations) work identically

### Structural

- [ ] Zero `.js` source files remain (only compiled output and config)
- [ ] All source files are `.ts`
- [ ] `tsconfig.json` present in root, `mcp_server/`, `scripts/`, and `shared/`
- [ ] TypeScript `strict` mode enabled
- [ ] No `any` in public API signatures (internal `any` minimized with justification)
- [ ] All interfaces defined as proper TypeScript `interface` or `type`
- [ ] Circular dependency between `shared/` and `mcp_server/` eliminated
- [ ] `shared/` has its own `package.json` and is added as a workspace

### Documentation

- [ ] All 7 READMEs updated (`.js` → `.ts` references, `require` → `import` examples)
- [ ] SKILL.md updated with TypeScript module descriptions
- [ ] All 23 reference files updated where JS code samples exist
- [ ] `workflows-code--opencode` has full TypeScript coverage (4 new files + 5 updates)
- [ ] CHANGELOG.md updated with migration entry

---

## 6. Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Runtime behavior change from TS compilation | Medium | High | Run full test suite after each phase; compare outputs |
| `__dirname` breaks with ESM output | High (if ESM) | High | Use CommonJS output to preserve `__dirname` |
| `sqlite-vec` native module type issues | Medium | Medium | Write minimal `.d.ts` declarations |
| Circular dependency harder to break than expected | Low | High | Move files in Phase 2 before any TS conversion |
| Test files take longer than source (55K lines) | High | Medium | Convert tests last; they can run as JS against compiled TS temporarily |
| Dynamic `require()` patterns (rank-memories.js) | Low | Low | Convert to static imports during migration |

---

## 7. Dependencies

- **Spec 090** (naming conventions): Should be completed first — the camelCase migration establishes the naming baseline that TypeScript will enforce
- **Spec 091** (naming test suite): Provides validation infrastructure that can be adapted for TS migration verification
