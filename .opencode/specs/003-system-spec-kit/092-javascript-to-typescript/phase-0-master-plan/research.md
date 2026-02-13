# Research: JavaScript to TypeScript Migration — system-spec-kit

> **Created:** 2026-02-07
> **Method:** 10 parallel opus exploration agents

---

## 1. Codebase Inventory

### scripts/ (55 files, 21,916 lines)

| Directory | Files | Lines | Complexity Mix |
|-----------|------:|------:|---------------|
| core/ | 3 | 778 | 1 simple, 1 moderate, 1 complex |
| utils/ | 9+1 | 1,060 | 3 simple, 5 moderate, 1 complex |
| lib/ | 10 | 2,368 | 2 simple, 2 moderate, 6 complex |
| extractors/ | 9 | 2,903 | 1 simple, 3 moderate, 5 complex |
| loaders/ | 2 | 173 | 1 simple, 1 moderate |
| renderers/ | 2 | 224 | 1 simple, 1 complex |
| spec-folder/ | 4 | 840 | 2 simple, 0 moderate, 2 complex |
| memory/ | 3 | 750 | 0 simple, 3 moderate |
| tests/ | 13 | 12,820 | varies |

**Top 5 complex files (scripts/):**
1. `extractors/collect-session-data.js` — 757 lines (session data assembler, learning delta tracking)
2. `lib/semantic-summarizer.js` — 591 lines (7 message types, file change extraction)
3. `core/workflow.js` — 550 lines (12-step pipeline orchestration)
4. `spec-folder/alignment-validator.js` — 451 lines (content alignment scoring)
5. `extractors/opencode-capture.js` — 443 lines (session storage reader)

### mcp_server/ (122 files, 74,296 lines)

| Directory | Files | Lines | Notes |
|-----------|------:|------:|-------|
| Root | 1 | 525 | context-server.js (MCP entry) |
| core/ | 3 | 351 | Config, db-state |
| formatters/ | 3 | 311 | Token metrics, search results |
| handlers/ | 10 | 5,029 | 9 handlers + index |
| hooks/ | 2 | 194 | Auto-surface |
| lib/ (all) | 52 | ~20,000 | 14 subdirectories |
| utils/ | 4 | 466 | Validators, JSON, batch |
| scripts/ | 1 | 119 | Reindex CLI |
| tests/ | 46 | 42,477 | Full test suite |

**Top 5 complex files (mcp_server/):**
1. `lib/search/vector-index.js` — 3,309 lines (SQLite + sqlite-vec, schema v4 migrations)
2. `handlers/memory-save.js` — 1,215 lines (PE gating, FSRS, atomic saves)
3. `lib/cognitive/consolidation.js` — 1,054 lines (4-phase engine: REPLAY, ABSTRACT, INTEGRATE, PRUNE)
4. `lib/session/session-manager.js` — 1,045 lines (deduplication, crash recovery)
5. `lib/errors/recovery-hints.js` — 852 lines (error catalog with recovery guidance)

### shared/ (9 files, 2,622 lines)

| File | Lines | Complexity |
|------|------:|-----------|
| trigger-extractor.js | 686 | High (TF-IDF NLP pipeline) |
| embeddings.js | 585 | High (facade + LRU cache) |
| embeddings/factory.js | 370 | High (provider resolution) |
| embeddings/providers/voyage.js | 275 | Medium-High |
| embeddings/providers/openai.js | 257 | Medium-High |
| embeddings/providers/hf-local.js | 242 | High (ML model loading) |
| chunking.js | 118 | Low-Medium |
| embeddings/profile.js | 78 | Low |
| utils.js | 11 | Trivial (deprecated) |

---

## 2. Dependency Graph

### Cross-Boundary Imports

**scripts/ → mcp_server/ (3 imports):**
- `scripts/core/workflow.js` → `mcp_server/lib/search/vector-index` (lazy-loaded)
- `scripts/memory/rank-memories.js` → `mcp_server/lib/scoring/folder-scoring.js`
- `scripts/lib/retry-manager.js` → `mcp_server/lib/providers/retry-manager.js` (re-export)

**shared/ → mcp_server/ (3 imports — creates CIRCULAR):**
- `shared/embeddings/providers/voyage.js` → `mcp_server/lib/utils/retry.js` (try/catch)
- `shared/embeddings/providers/openai.js` → `mcp_server/lib/utils/retry.js` (try/catch)
- `shared/utils.js` → `mcp_server/lib/utils/path-security.js` (deprecated)

**mcp_server/ → shared/ (4 imports):**
- `mcp_server/lib/providers/embeddings.js` → `shared/embeddings.js`
- `mcp_server/lib/parsing/trigger-extractor.js` → `shared/trigger-extractor.js`
- `mcp_server/lib/storage/checkpoints.js` → `shared/embeddings`
- `mcp_server/lib/embeddings/provider-chain.js` → `shared/embeddings/factory.js`

### Re-Export Proxies (6 files)

| Proxy | Source |
|-------|--------|
| `scripts/lib/embeddings.js` | `shared/embeddings.js` |
| `scripts/lib/trigger-extractor.js` | `shared/trigger-extractor.js` |
| `scripts/lib/retry-manager.js` | `mcp_server/lib/providers/retry-manager.js` |
| `mcp_server/lib/providers/embeddings.js` | `shared/embeddings.js` |
| `mcp_server/lib/parsing/trigger-extractor.js` | `shared/trigger-extractor.js` |
| `shared/utils.js` | `mcp_server/lib/utils/path-security.js` (DEPRECATED) |

---

## 3. Current Infrastructure

### Module System
- **100% CommonJS** — `require()` / `module.exports` everywhere
- `'use strict'` at top of every source file
- Barrel pattern with `index.js` re-exports using spread operator

### Package Structure
- Root workspace with `mcp_server` and `scripts` as npm workspaces
- `shared/` is NOT a workspace (no package.json)
- Node.js >= 18 required

### Dependencies Requiring Types

| Package | Has types? | Action needed |
|---------|-----------|---------------|
| `better-sqlite3` | No | Install `@types/better-sqlite3` |
| `sqlite-vec` | No | Write custom `.d.ts` |
| `@modelcontextprotocol/sdk` | Yes | None |
| `@huggingface/transformers` | Yes | None |
| `chokidar` | Yes | None |
| `lru-cache` | Yes | None |

### MCP Server Startup
```json
"command": ["node", ".opencode/skill/system-spec-kit/mcp_server/context-server.js"]
```

### Existing Tooling
- No tsconfig, no eslint, no prettier, no bundler, no test framework config
- Tests use `node:test` and `node:assert` (built-in)

---

## 4. Documentation Impact

### READMEs (7 files, 4,041 lines total)

| README | JS References | Severity |
|--------|:------------:|----------|
| shared/README.md | 44 | HIGH — architecture diagram, require examples |
| mcp_server/README.md | 56 | HIGH — directory structure, 50+ .js paths |
| scripts/README.md | 59 | HIGH — directory structure, 40+ .js paths |
| config/README.md | 6 | Medium |
| system-spec-kit/README.md | 5 | Low |
| templates/README.md | 3 | Low |
| constitutional/README.md | 1 | Minimal |

### SKILL.md (883 lines)
- 7+ sections need updating (script paths, "JavaScript modules" → "TypeScript modules")

### References (23 files)
- HIGH impact: `embedding_resilience.md` (10+ JS code blocks), `memory_system.md` (8+ JS blocks), `trigger_config.md` (3 JS blocks)
- MEDIUM: `folder_routing.md`, `troubleshooting.md`, `environment_variables.md`, `save_workflow.md`
- NO changes: 10 files with zero JS references

### workflows-code--opencode (20 files)
- ZERO TypeScript coverage currently
- SKILL.md explicitly excludes TS: "TypeScript (not currently used in OpenCode)"
- Need: 4 new files (style_guide, quality_standards, quick_reference, checklist)
- Need: 5 file updates (SKILL.md, universal_patterns, code_organization, universal_checklist, CHANGELOG)

---

## 5. Existing Patterns to Leverage

### Interface Pattern (already exists)
```javascript
// mcp_server/lib/interfaces/embedding-provider.js
class IEmbeddingProvider {
  async embed(text) { throw new Error('must be implemented'); }
  async batchEmbed(texts) { throw new Error('must be implemented'); }
  // ...10 more methods
}
```
→ Maps directly to TypeScript `interface` or `abstract class`

### JSDoc Type Annotations (partial coverage)
```javascript
/**
 * @param {string} text - Text to embed
 * @returns {Promise<number[]>} Embedding vector
 */
```
→ Convert to TypeScript annotations: `async embed(text: string): Promise<number[]>`

### Error Classes (well-structured)
```javascript
class MemoryError extends Error {
  constructor(code, message, details = {}) { ... }
}
```
→ Maps to typed class: `class MemoryError extends Error { constructor(code: ErrorCode, message: string, details?: Record<string, unknown>) }`

### Enum Patterns (using objects)
```javascript
const ErrorCodes = { E001: 'E001', E002: 'E002', ... };
const STATE_THRESHOLDS = { HOT: 0.9, WARM: 0.7, COLD: 0.4, ... };
```
→ Maps to TypeScript `enum` or `const enum`

### Backward-Compatible Aliases (from spec 090)
```javascript
module.exports = {
  calculateDecayScore,           // camelCase (primary)
  calculate_decay_score: calculateDecayScore  // snake_case (alias)
};
```
→ Preserve in TypeScript exports

---

## 6. Key Findings

1. **Scale:** 186 files, 98,834 lines — this is a Level 3+ migration by any measure
2. **Circular dependency is the critical blocker** — must be resolved in Phase 2 before any TS conversion
3. **shared/ is the architectural keystone** — both workspaces depend on it, it must be converted first
4. **CommonJS output is the safe choice** — ESM would require 50+ `__dirname` rewrites
5. **In-place compilation** preserves all path references — no `dist/` folder needed
6. **Tests are 56% of total lines** (55,297 of 98,834) — converting them last reduces risk
7. **Documentation update is substantial** — 174 JS references across 7 READMEs alone
8. **workflows-code--opencode has ZERO TS coverage** — must be Phase 0
9. **Existing OOP patterns** (interfaces, error classes, enums) map cleanly to TypeScript
10. **4 sessions of 10 parallel agents** can cover all phases systematically
