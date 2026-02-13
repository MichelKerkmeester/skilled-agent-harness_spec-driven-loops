# Plan: Phase 8 — Documentation Updates

> **Parent Spec:** 092-javascript-to-typescript/
> **Workstream:** W-I
> **Session:** 4 (Agents 6-8)
> **Level:** 3
> **Created:** 2026-02-07

---

## 1. Overview

**Goal:** Update all documentation to reflect TypeScript codebase after code conversion completes.

**Scope:** ~55 files, ~20,624 lines of documentation across READMEs, SKILL.md, reference files, assets, and changelog.

**Dependencies:** Phases 5 and 6 must complete (full code conversion to TypeScript).

**Strategy:** 6 parallel streams that can execute independently, maximizing agent utilization in Session 4.

---

## 2. Parallel Execution Streams

All 6 streams can run simultaneously with no inter-stream dependencies.

### Stream 8a: READMEs (7 files)

| File | Lines | JS Refs | Key Updates |
|------|------:|--------:|-------------|
| `shared/README.md` | 453 | 44 | Rewrite architecture diagram (require → import), update all code examples to ES modules, update directory structure |
| `mcp_server/README.md` | 1,066 | 56 | Update directory structure (50+ .js → .ts), update module table, update test instructions |
| `scripts/README.md` | 703 | 59 | Update directory structure (40+ .js → .ts), update JavaScript section descriptions, update code examples |
| `system-spec-kit/README.md` | 713 | 5 | Update Node.js requirement note, .js → .ts in paths, script references |
| `config/README.md` | 176 | 6 | Path references |
| `templates/README.md` | 179 | 3 | Path references |
| `constitutional/README.md` | 751 | 1 | Path references |

**Impact Assessment:**
- `shared/README.md`: 44 references to update (highest concentration)
- `mcp_server/README.md`: 56 references (largest absolute count)
- `scripts/README.md`: 59 references (largest absolute count)

**Estimated effort:** 7-8 hours (concentrated in top 3 files)

---

### Stream 8b: SKILL.md (1 file)

| File | Lines | Key Updates |
|------|------:|-------------|
| `SKILL.md` | 883 | "Canonical JavaScript modules" → "Canonical TypeScript modules", update script paths, update architecture descriptions, update code examples, update resource inventory |

**Critical changes:**
- Line 167: Language description update
- Script path references (generate-context.js → compiled .js from .ts source)
- Module count references (may change due to TypeScript barrel files)
- Code examples converted to TypeScript syntax
- Resource inventory updated to reflect .ts files

**Estimated effort:** 1 hour

---

### Stream 8c: References — Memory (6 files)

| File | Lines | JS Blocks | Key Updates |
|------|------:|----------:|-------------|
| `references/memory/embedding_resilience.md` | 422 | 10+ | Convert all JS code blocks to TypeScript with proper types, update .js file path references to .ts, update architecture table |
| `references/memory/memory_system.md` | 594 | 8+ | Convert code samples: crypto usage → typed, state management → enums, update architecture table |
| `references/memory/save_workflow.md` | 539 | — | Update script paths, Node.js invocation references |
| `references/memory/trigger_config.md` | 345 | 3 | Convert remaining JS code blocks to TypeScript |
| `references/memory/epistemic-vectors.md` | 396 | 1 | Minor reference update |
| `references/memory/index` (if exists) | — | — | Update if present |

**Conversion approach:**
- CommonJS `require()` examples → ES module `import` syntax in docs
- Note: Compiled output remains CommonJS (Decision D1), but documentation shows source-level syntax
- All code samples get proper TypeScript type annotations
- Path references: `.js` → `.ts` in source references

**Estimated effort:** 3.5 hours

---

### Stream 8d: References — Other (8 files)

| File | Lines | JS Blocks | Key Updates |
|------|------:|----------:|-------------|
| `references/structure/folder_routing.md` | 572 | 2 | Convert code blocks, update script paths |
| `references/debugging/troubleshooting.md` | 461 | 5 | Convert JS code examples to TypeScript |
| `references/config/environment_variables.md` | 200 | — | Update `node` command references |
| `references/workflows/execution_methods.md` | 256 | — | Path references |
| `references/workflows/quick_reference.md` | 609 | — | Path references |
| `references/validation/phase_checklists.md` | 182 | — | Path references |
| `references/templates/template_guide.md` | 1,060 | — | Path references |
| `references/templates/level_specifications.md` | 755 | — | Path references |

**Code sample conversion strategy:**
- Examples preserve CommonJS require patterns where showing compiled output
- Examples use ES module import where showing source-level code
- Type annotations added to all code samples where applicable
- Error handling examples show typed catch blocks

**Estimated effort:** 2 hours

---

### Stream 8e: Assets (1 file)

| File | Lines | Key Updates |
|------|------:|-------------|
| `assets/template_mapping.md` | 463 | Script path references updated |

**Estimated effort:** 10 minutes

---

### Stream 8f: Changelog (1 file)

| File | Key Updates |
|------|-------------|
| `system-spec-kit/CHANGELOG.md` | Full migration entry documenting all phases completed, all architectural decisions referenced (D1-D8 from decision-record.md), new TypeScript infrastructure noted |

**Entry structure:**
```markdown
## [2.0.0] - YYYY-MM-DD - TypeScript Migration

### Migration Summary
- Converted entire codebase from JavaScript to TypeScript (~241 files, ~119,458 lines)
- Phased bottom-up migration (9 phases) preserving all functionality
- Zero breaking changes to compiled output (CommonJS compatibility maintained)

### Architecture Decisions
- [Decision D1] CommonJS output (not ESM) — preserves __dirname patterns
- [Decision D2] In-place compilation (no dist/) — all relative paths unchanged
- [Decision D3] Strict mode from start — zero technical debt
- [Decision D4] File moves to break circular dependencies — DAG dependency graph
- [Decision D5] Keep I prefix on IEmbeddingProvider, IVectorStore — backward compatibility
- [Decision D6] TypeScript standards established first (Phase 0) — consistency across agents
- [Decision D7] Central shared/types.ts — single source of truth for cross-workspace types
- [Decision D8] Tests converted last (Phase 7) — minimized migration risk

### Infrastructure
- TypeScript 5.x with project references (3 workspaces: shared, mcp_server, scripts)
- tsconfig.json: strict mode, CommonJS output, ES2022 target
- Custom type declarations: sqlite-vec.d.ts
- Build scripts: npm run build, npm run typecheck, npm run build:watch

### Migration Phases Completed
1. Phase 0: TypeScript standards (workflows-code--opencode)
2. Phase 1: Infrastructure setup (tsconfig, deps, build pipeline)
3. Phase 2: Circular dependency resolution (3 file moves, 3 re-export stubs)
4. Phase 3: shared/ conversion (9 files → 12 .ts files with types.ts)
5. Phase 4: mcp_server/ foundation (34 files, 12 sub-layers)
6. Phase 5: mcp_server/ upper layers (42 files, handlers, entry points)
7. Phase 6: scripts/ conversion (42 files, CLI tools)
8. Phase 7: Test conversion (59 test files)
9. Phase 8: Documentation updates (55 files)
10. Phase 9: Final verification (build, tests, smoke tests)

### Changed
- All source files: .js → .ts
- Code examples in documentation: require → import (source syntax)
- Architecture diagrams: updated module references
- README directory structures: .js → .ts

### Added
- shared/types.ts: Central cross-workspace type definitions
- sqlite-vec.d.ts: Custom type declarations for native module
- TypeScript build pipeline
- TypeScript standards documentation (4 new files in workflows-code--opencode)

### Preserved
- All backward-compatible snake_case export aliases
- Compiled output behavior (100% test pass rate)
- All file paths and directory structures
- All configuration files (opencode.json startup paths unchanged)
- Security patterns (path validation, input limits)

### Performance
- Build time: <60 seconds for full compilation
- MCP server startup: no degradation
- Memory search response time: no degradation
- Compiled output size: comparable to original JS

See: specs/003-memory-and-spec-kit/092-javascript-to-typescript/decision-record.md for full rationale
```

**Estimated effort:** 30 minutes

---

## 3. Agent Allocation (Session 4)

Given 10 available opus agents in Session 4, allocation for Phase 8 documentation:

| Agent | Stream | Files | Est. Hours |
|-------|--------|------:|----------:|
| Agent 6 | Stream 8a (READMEs 1-3) | 3 | 6h |
| Agent 7 | Stream 8a (READMEs 4-7) + Stream 8b (SKILL.md) | 5 | 2h |
| Agent 8 | Stream 8c (memory refs 1-3) + Stream 8d (1-4) + Stream 8e + Stream 8f | 10 | 3h |

**Remaining agents (1-5, 9-10):** Executing Phases 7 (test conversion) and Phase 9 (final verification) in parallel.

---

## 4. Code Sample Conversion Strategy

### Documentation vs. Compiled Output

**Key principle:** Documentation shows TypeScript SOURCE syntax, but notes that compiled output is CommonJS.

#### Example transformation:

**Before (JavaScript):**
```javascript
const { retryWithBackoff } = require('../../../shared/utils/retry');
const { MemoryError } = require('../lib/errors/core');

async function searchMemories(query, options) {
  return retryWithBackoff(async () => {
    // search logic
  }, { maxRetries: 3 });
}

module.exports = { searchMemories };
```

**After (TypeScript source, shown in docs):**
```typescript
import { retryWithBackoff, RetryConfig } from '../../../shared/utils/retry';
import { MemoryError } from '../lib/errors/core';

async function searchMemories(query: string, options?: SearchOptions): Promise<SearchResult[]> {
  return retryWithBackoff(async () => {
    // search logic
  }, { maxRetries: 3 } as RetryConfig);
}

export { searchMemories };
```

**Note in documentation:**
> Source code uses ES module syntax (`import`/`export`), but compiles to CommonJS output (`require`/`module.exports`) for Node.js compatibility.

---

## 5. Path Reference Update Strategy

### Three categories of path updates:

1. **Source file references:** `.js` → `.ts`
   - Example: `shared/embeddings.js` → `shared/embeddings.ts`

2. **Compiled output references:** `.js` (unchanged)
   - Example: `node mcp_server/context-server.js` (compiled from .ts)

3. **Documentation cross-references:** Update line numbers if file structure changed
   - Most line numbers remain stable (in-place conversion)

### Directory structure listings:

**Before:**
```
shared/
├── embeddings.js
├── chunking.js
└── utils/
    ├── retry.js
    └── path-security.js
```

**After:**
```
shared/
├── embeddings.ts
├── embeddings.js (compiled)
├── chunking.ts
├── chunking.js (compiled)
└── utils/
    ├── retry.ts
    ├── retry.js (compiled)
    ├── path-security.ts
    └── path-security.js (compiled)
```

**Simplified representation for READMEs (source-focused):**
```
shared/
├── embeddings.ts
├── chunking.ts
└── utils/
    ├── retry.ts
    └── path-security.ts
```

With note:
> TypeScript source files (`.ts`) compile to JavaScript (`.js`) in the same directory. Node.js executes the compiled `.js` files.

---

## 6. Impact Assessment

### High-impact files (require careful review):

1. **`shared/README.md`** — 44 JS references
   - Architecture diagram needs full redraw
   - All code examples use ES module syntax
   - Provider documentation updated

2. **`mcp_server/README.md`** — 56 JS references
   - Directory structure table (50+ entries)
   - Module description table (type annotations visible)
   - Test running instructions (TypeScript-aware)

3. **`scripts/README.md`** — 59 JS references
   - Directory structure listing (40+ entries)
   - JavaScript section renamed to "TypeScript Modules"
   - Code examples for CLI invocation

### Medium-impact files:

4. **`SKILL.md`** — Canonical reference for system
   - Language detection update critical
   - Resource router logic affects AI behavior
   - Architecture description consumed by agents

5. **`references/memory/embedding_resilience.md`** — 10+ code blocks
   - Retry logic examples show typed Promises
   - Provider fallback examples show typed chain

6. **`references/memory/memory_system.md`** — 8+ code blocks
   - Crypto hash examples show typed Buffer handling
   - State management shows TypeScript enums

### Low-impact files:

7-24. Remaining reference files, asset mappings, and configuration READMEs — mostly path reference updates.

---

## 7. Verification Strategy

### Automated checks:

1. **Path accuracy:** All `.ts` references exist in file system
2. **Code sample validity:** All TypeScript code blocks compile with `tsc --noEmit`
3. **Cross-reference integrity:** All internal links resolve

### Manual review (spot-check 10 files):

1. shared/README.md
2. mcp_server/README.md
3. scripts/README.md
4. SKILL.md
5. embedding_resilience.md
6. memory_system.md
7. troubleshooting.md
8. template_mapping.md
9. CHANGELOG.md
10. system-spec-kit/README.md

**Acceptance criteria:**
- [ ] All code examples use TypeScript syntax with type annotations
- [ ] All path references point to existing files
- [ ] Architecture diagrams reflect TypeScript module structure
- [ ] No references to deprecated .js source files (only compiled .js)
- [ ] CHANGELOG.md comprehensive (covers all 10 phases, all 8 decisions)

---

## 8. Risk Mitigations

| Risk | Mitigation |
|------|-----------|
| Inconsistent code examples across docs | Use standard transformation template (§4) for all code samples |
| Broken cross-references after path updates | Automated link checker pass before claiming completion |
| Incomplete CHANGELOG entry | Reference decision-record.md for all 8 decisions; cross-check with plan.md phases |
| Path confusion (source .ts vs compiled .js) | Clear note in each README explaining compilation model |
| Line number drift in cross-references | Spot-check 5 random line number references for accuracy |

---

## 9. Success Metrics

| Metric | Target |
|--------|--------|
| Files updated | 55 |
| Code blocks converted to TypeScript | 30+ |
| Path references corrected | 200+ |
| Documentation accuracy (spot-check) | 100% |
| Zero broken internal links | Pass |
| CHANGELOG completeness | All 10 phases + all 8 decisions documented |

---

## 10. Cross-References

- **Parent Plan:** `../plan.md` (Phase 8, lines 331-347)
- **Tasks:** `tasks.md` (Phase 8, T280-T303)
- **Checklist:** `checklist.md` (CHK-150 through CHK-169)
- **Decision Record:** `../decision-record.md` (D1-D8 for CHANGELOG reference)
- **Spec:** `../spec.md` (documentation standards)

---

## Execution Notes

**Pre-execution:**
- [ ] Phases 5 and 6 confirmed complete (all code converted to TypeScript)
- [ ] Compiled output verified functional (MCP server + CLI scripts work)
- [ ] Standard code sample template agreed (see §4)

**During execution:**
- Document any additional files discovered during update process
- Track actual vs. estimated reference counts for accuracy
- Flag any inconsistencies between code and documentation for resolution

**Post-execution:**
- Run automated link checker
- Validate 10 spot-check files manually
- Verify CHANGELOG entry against decision-record.md
- Confirm all 24 tasks (T280-T303) marked complete
